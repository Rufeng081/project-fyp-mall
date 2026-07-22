import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(testDir, '..');
const failures = [];

function readRequired(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing deliverable: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function requireText(source, value, label = value) {
  if (!source.includes(value)) failures.push(`Missing required content: ${label}`);
}

function rejectText(source, value) {
  if (source.toLowerCase().includes(value.toLowerCase())) {
    failures.push(`Prohibited claim found: ${value}`);
  }
}

const html = readRequired('index.html');
const css = readRequired('styles.css');
const js = readRequired('slides.js');
const script = readRequired('speaker-script.md');
const jmeter = readRequired('jmeter-defence-quick-reference.md');
const readme = readRequired('README.md');
const combined = [html, script, jmeter].join('\n');

const exactTitle = 'DEVELOPMENT AND NETWORK PERFORMANCE EVALUATION OF A CLOUD-BASED SMALL ECOMMERCE PLATFORM';
requireText(html, exactTitle, 'exact project title');
for (const value of ['LI RUFENG', 'A206331']) requireText(html, value);

const slides = html.match(/<section\b[^>]*class="[^"]*\bslide\b[^"]*"[^>]*>/g) ?? [];
if (slides.length !== 12) failures.push(`Expected 12 slides, found ${slides.length}`);

const activeSlides = slides.filter((tag) => /\bis-active\b/.test(tag));
if (activeSlides.length !== 1) failures.push(`Expected one initial active slide, found ${activeSlides.length}`);

const slideNumbers = html.match(/class="slide-number"/g) ?? [];
if (slideNumbers.length !== 12) failures.push(`Expected 12 slide-number labels, found ${slideNumbers.length}`);

for (const claim of [
  '3,197',
  'sampler executions',
  '0 observed JMeter errors',
  '0.00%',
  '3,659 ms',
  '3,400 ms',
  '3,116 ms',
  '2,457 ms'
]) requireText(combined, claim);

for (const claim of [
  '3,197 users',
  '3,197 test runs',
  'the system has zero errors',
  'supports 200 users',
  'commercial-scale capacity'
]) rejectText(combined, claim);

for (const hook of ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'requestFullscreen']) {
  requireText(js, hook, `navigation hook ${hook}`);
}

for (const token of ['--paper:', '--ink:', '--copper:', 'aspect-ratio: 16 / 9', 'prefers-reduced-motion']) {
  requireText(css, token, `style token ${token}`);
}

const assetMatches = [...html.matchAll(/(?:src|href)="(assets\/[^"#?]+)"/g)].map((match) => match[1]);
if (assetMatches.length < 3) failures.push(`Expected at least 3 local visual assets, found ${assetMatches.length}`);
for (const relativeAsset of new Set(assetMatches)) {
  if (!fs.existsSync(path.join(root, relativeAsset))) failures.push(`Missing local asset: ${relativeAsset}`);
}

if (/(?:src|href)="https?:\/\//i.test(html)) failures.push('External asset request found in index.html');

requireText(script, '## Slide 1');
requireText(script, '## Slide 12');
requireText(script, 'Live demonstration fallback');
for (const term of ['Thread', 'Ramp-up', 'Loop', 'Sampler', 'P90', 'Throughput', 'Error rate']) {
  requireText(jmeter, term, `JMeter term ${term}`);
}
requireText(readme, 'Arrow keys');
requireText(readme, 'Fullscreen');
requireText(readme, 'Live demonstration');

if (failures.length) {
  console.error('FYP defence slide verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('FYP defence slide verification passed');
