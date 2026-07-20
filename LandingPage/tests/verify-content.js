const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const repoRoot = path.resolve(root, '..');
const requiredFiles = ['index.html', 'styles.css', 'script.js'];
const errors = [];

function readRequired(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing required file: LandingPage/${relativePath}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}

const files = Object.fromEntries(
  requiredFiles.map((relativePath) => [relativePath, readRequired(relativePath)])
);
const html = files['index.html'];
const css = files['styles.css'];
const script = files['script.js'];
const combined = `${html}\n${css}\n${script}`;

const readme = readRequired('README.md');
const requiredProvenance = [
  'aggregate-results.csv',
  'summary-tables.md',
  'phase-6-jmeter-execution-record-2026-06-16.md',
  'phase-6-jmeter-performance-evaluation-report.md',
  'sampler execution',
  'single-VM HTTP academic prototype'
];
for (const text of requiredProvenance) {
  if (readme && !readme.includes(text)) {
    errors.push(`README is missing provenance text: ${text}`);
  }
}

const requiredClaims = [
  '3,197',
  'JMeter sampler executions',
  '35 summarized result rows',
  '0 JMeter errors observed',
  '16 June 2026',
  '441 ms',
  '1,882 ms',
  '1,986 ms',
  '2,457 ms',
  '3,116 ms',
  '3,400 ms',
  '3,659 ms',
  'single-VM HTTP academic prototype'
];

for (const claim of requiredClaims) {
  if (html && !html.includes(claim)) {
    errors.push(`Missing evidence text: ${claim}`);
  }
}

const requiredVisibleContent = [
  'Chapter 4 test summary',
  'Design and develop a cloud-based small e-commerce platform that supports core online shopping functions.',
  'Implement and analyse the network communication mechanisms used by the platform in a cloud environment.',
  'Evaluate the network performance of the deployed platform under different test parameters using Apache JMeter.',
  'Chapter 4, Tables 4.17 and 4.18'
];

for (const text of requiredVisibleContent) {
  if (html && !html.includes(text)) {
    errors.push(`Missing required visible content: ${text}`);
  }
}

const prohibitedClaims = [
  '3,197 test runs',
  '3,197 users',
  'the system has zero errors',
  'supports 200 users',
  'reproducible response-time',
  'Evidence policy for the final page',
  'Claims that will not be used'
];

for (const claim of prohibitedClaims) {
  if (combined.toLowerCase().includes(claim.toLowerCase())) {
    errors.push(`Prohibited or internal claim found: ${claim}`);
  }
}

if (html && /\bPhase 6\b/i.test(html)) {
  errors.push('Prohibited presentation-phase content found: Phase 6');
}

const aiSelfReferencePattern =
  /\b(?:i(?:'m| am)|we(?:'re| are)|this (?:is|was))\s+(?:an?\s+)?(?:ai|artificial intelligence|assistant|system)\b/i;
if (aiSelfReferencePattern.test(combined)) {
  errors.push('Prohibited AI/assistant/system self-reference found');
}

const requiredIds = ['main-content', 'overview', 'method', 'architecture', 'results', 'conclusion'];
for (const id of requiredIds) {
  if (html && !new RegExp(`id=["']${id}["']`).test(html)) {
    errors.push(`Missing section id: ${id}`);
  }
}

if (html) {
  const declaredIds = new Set(
    [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1])
  );
  for (const match of html.matchAll(/\bhref=["']#([^"']+)["']/g)) {
    if (!declaredIds.has(match[1])) {
      errors.push(`Anchor target does not exist: #${match[1]}`);
    }
  }

  for (const match of html.matchAll(/(?:src|href)=["']([^"'#][^"']*)["']/g)) {
    const reference = match[1];
    if (/^https?:\/\//i.test(reference)) {
      errors.push(`External asset request is not allowed: ${reference}`);
      continue;
    }
    if (/^(?:mailto:|tel:|javascript:|data:)/i.test(reference)) continue;
    const cleanReference = reference.split(/[?#]/)[0];
    if (!cleanReference || cleanReference.startsWith('/')) continue;
    if (!fs.existsSync(path.join(root, cleanReference))) {
      errors.push(`Missing local asset: ${reference}`);
    }
  }
}

const visualAntiPatterns = [
  /\bpurple\b/i,
  /linear-gradient\s*\(/i,
  /radial-gradient\s*\(/i,
  /backdrop-filter\s*:/i,
  /#[0-9a-f]{0,2}(?:6c4cff|7c3aed|8b5cf6|a855f7)/i
];
for (const pattern of visualAntiPatterns) {
  if (pattern.test(css)) errors.push(`Disallowed visual pattern found: ${pattern}`);
}

const privacyPatterns = [
  { label: 'email address', pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i },
  { label: 'public IPv4 address', pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/ },
  { label: 'institution branding', pattern: /\b(?:UKM|Universiti Kebangsaan Malaysia)\b/i },
  { label: 'matric number', pattern: /\bA\d{6}\b/i }
];
for (const { label, pattern } of privacyPatterns) {
  if (pattern.test(combined)) errors.push(`Potential private content found: ${label}`);
}

if (html && !/<a[^>]+class=["'][^"']*skip-link/.test(html)) {
  errors.push('Missing keyboard skip link');
}
if (css && !/:focus-visible/.test(css)) {
  errors.push('Missing visible keyboard focus styles');
}
if (css && !/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css)) {
  errors.push('Missing reduced-motion support');
}
if (script && !/IntersectionObserver/.test(script)) {
  errors.push('Missing chapter state enhancement');
}
if (script && !script.includes("rootMargin: '-18% 0px -81% 0px'")) {
  errors.push('Chapter observer must use a narrow viewport band');
}
if (script && (!script.includes("addEventListener('scroll'") || !script.includes('requestAnimationFrame'))) {
  errors.push('Chapter state must resynchronize during reverse scrolling');
}

const nginxPath = path.join(repoRoot, 'deploy/nginx/project-fyp-mall.conf');
if (fs.existsSync(nginxPath)) {
  const nginx = fs.readFileSync(nginxPath, 'utf8');
  const requiredNginxText = [
    'location = /LandingPage',
    'return 301 /LandingPage/;',
    'location ^~ /LandingPage/',
    'alias /var/www/project-fyp-mall-landing/;'
  ];
  for (const text of requiredNginxText) {
    if (!nginx.includes(text)) errors.push(`Incomplete Nginx landing-page route: ${text}`);
  }
} else {
  errors.push('Missing Nginx deployment configuration');
}

if (errors.length) {
  console.error('Landing page verification failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Landing page verification passed.');
