const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const resultsRoot = path.join(repoRoot, 'docs', 'testing', 'jmeter', 'results');
const summaryDir = path.join(resultsRoot, 'phase6-summary');
const chartsDir = path.join(summaryDir, 'charts');

fs.mkdirSync(chartsDir, { recursive: true });

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    return entry.isFile() && entry.name.endsWith('.jtl') ? [fullPath] : [];
  });
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function percentile(sorted, p) {
  if (!sorted.length) return 0;
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, index))];
}

function scenarioFromFile(filePath) {
  const name = path.basename(filePath, '.jtl');
  if (/^read_/.test(name)) {
    const match = name.match(/^read_(\d+_[a-z_]+)_t(\d+)$/);
    return { category: 'read-only load', scenario: match[1], threads: Number(match[2]) };
  }
  if (/^auth_/.test(name)) {
    const match = name.match(/^auth_(\d+_[a-z_]+)_t(\d+)$/);
    return { category: 'authenticated load', scenario: match[1], threads: Number(match[2]) };
  }
  if (/^mutation_/.test(name)) {
    const match = name.match(/^mutation_(\d+_[a-z_]+)_t(\d+)$/);
    return { category: 'controlled mutation', scenario: match[1], threads: Number(match[2]) };
  }
  return { category: 'smoke', scenario: name, threads: 1 };
}

function summarize(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').trim().split(/\r?\n/);
  const header = parseCsvLine(lines.shift());
  const index = Object.fromEntries(header.map((name, i) => [name, i]));
  const rows = lines.filter(Boolean).map(parseCsvLine);
  const elapsed = rows.map((row) => Number(row[index.elapsed])).filter(Number.isFinite).sort((a, b) => a - b);
  const errors = rows.filter((row) => row[index.success] !== 'true').length;
  const firstStart = Math.min(...rows.map((row) => Number(row[index.timeStamp])));
  const lastEnd = Math.max(...rows.map((row) => Number(row[index.timeStamp]) + Number(row[index.elapsed])));
  const durationSeconds = rows.length ? Math.max((lastEnd - firstStart) / 1000, 0.001) : 0;
  const meta = scenarioFromFile(filePath);

  return {
    ...meta,
    file: path.relative(repoRoot, filePath),
    samples: rows.length,
    errors,
    errorRatePct: rows.length ? (errors / rows.length) * 100 : 0,
    avgMs: elapsed.length ? elapsed.reduce((sum, value) => sum + value, 0) / elapsed.length : 0,
    medianMs: percentile(elapsed, 50),
    p90Ms: percentile(elapsed, 90),
    minMs: elapsed[0] || 0,
    maxMs: elapsed[elapsed.length - 1] || 0,
    throughputPerSec: rows.length / durationSeconds,
  };
}

function formatNumber(value, digits = 2) {
  return Number(value).toFixed(digits);
}

function csvEscape(value) {
  const text = String(value);
  return /[,"\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(filePath, rows) {
  const columns = [
    'category',
    'scenario',
    'threads',
    'samples',
    'errors',
    'error_rate_pct',
    'avg_ms',
    'median_ms',
    'p90_ms',
    'min_ms',
    'max_ms',
    'throughput_per_sec',
    'file',
  ];
  const lines = [columns.join(',')];
  for (const row of rows) {
    lines.push([
      row.category,
      row.scenario,
      row.threads,
      row.samples,
      row.errors,
      formatNumber(row.errorRatePct),
      formatNumber(row.avgMs),
      row.medianMs,
      row.p90Ms,
      row.minMs,
      row.maxMs,
      formatNumber(row.throughputPerSec),
      row.file,
    ].map(csvEscape).join(','));
  }
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`);
}

function writeMarkdown(filePath, rows) {
  const lines = [
    '# Phase 6 JMeter Summary Tables',
    '',
    'Generated from local JMeter `.jtl` files. Raw `.jtl` and generated HTML reports are intentionally ignored by Git; this file and the CSV summary are the retained evidence.',
    '',
    '| Category | Scenario | Threads | Samples | Errors | Error Rate | Avg ms | Median ms | P90 ms | Max ms | Throughput/s |',
    '|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
  ];
  for (const row of rows) {
    lines.push(`| ${row.category} | \`${row.scenario}\` | ${row.threads} | ${row.samples} | ${row.errors} | ${formatNumber(row.errorRatePct)}% | ${formatNumber(row.avgMs)} | ${row.medianMs} | ${row.p90Ms} | ${row.maxMs} | ${formatNumber(row.throughputPerSec)} |`);
  }
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`);
}

function svgBarChart(filePath, title, rows, valueKey, valueLabel) {
  const width = 1200;
  const rowHeight = 26;
  const margin = { top: 58, right: 90, bottom: 30, left: 360 };
  const height = margin.top + margin.bottom + rows.length * rowHeight;
  const maxValue = Math.max(...rows.map((row) => row[valueKey]), 1);
  const plotWidth = width - margin.left - margin.right;
  const colors = {
    'smoke': '#64748b',
    'read-only load': '#2563eb',
    'authenticated load': '#059669',
    'controlled mutation': '#dc2626',
  };
  const bars = rows.map((row, i) => {
    const y = margin.top + i * rowHeight;
    const value = row[valueKey];
    const barWidth = Math.max((value / maxValue) * plotWidth, 1);
    const label = `${row.category} ${row.scenario} T${row.threads}`;
    return [
      `<text x="12" y="${y + 17}" font-size="12" fill="#111827">${label}</text>`,
      `<rect x="${margin.left}" y="${y + 5}" width="${barWidth}" height="16" fill="${colors[row.category] || '#475569'}"/>`,
      `<text x="${margin.left + barWidth + 8}" y="${y + 17}" font-size="12" fill="#111827">${formatNumber(value)}</text>`,
    ].join('\n');
  }).join('\n');

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">`,
    '<rect width="100%" height="100%" fill="#ffffff"/>',
    `<text x="12" y="32" font-size="22" font-family="Arial, sans-serif" font-weight="700" fill="#111827">${title}</text>`,
    `<text x="12" y="50" font-size="12" font-family="Arial, sans-serif" fill="#4b5563">${valueLabel}</text>`,
    `<line x1="${margin.left}" y1="${margin.top - 8}" x2="${margin.left}" y2="${height - margin.bottom + 4}" stroke="#d1d5db"/>`,
    bars,
    '</svg>',
  ].join('\n');

  fs.writeFileSync(filePath, `${svg}\n`);
}

const summaries = walk(resultsRoot)
  .filter((filePath) => !filePath.includes(`${path.sep}phase6-summary${path.sep}`))
  .filter((filePath) => !path.basename(filePath).includes('validation'))
  .map(summarize)
  .sort((a, b) => (
    a.category.localeCompare(b.category)
    || a.scenario.localeCompare(b.scenario)
    || a.threads - b.threads
  ));

writeCsv(path.join(summaryDir, 'aggregate-results.csv'), summaries);
writeMarkdown(path.join(summaryDir, 'summary-tables.md'), summaries);

const loadRows = summaries.filter((row) => row.category !== 'smoke');
svgBarChart(path.join(chartsDir, 'p90-response-time-ms.svg'), 'Phase 6 P90 Response Time', loadRows, 'p90Ms', 'Milliseconds, lower is better');
svgBarChart(path.join(chartsDir, 'throughput-per-second.svg'), 'Phase 6 Throughput', loadRows, 'throughputPerSec', 'Samples per second, higher is better');

console.log(`Wrote ${summaries.length} summarized result rows to ${summaryDir}`);
