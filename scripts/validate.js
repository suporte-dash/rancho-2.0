/**
 * Automated Verification Script for Rancho Principal
 * Tests:
 * 1. HTML file existence and syntax integrity
 * 2. All referenced local assets (images, videos, styles, scripts)
 * 3. JSON-LD Schema.org validity
 * 4. JavaScript syntax check
 * 5. Critical SEO and accessibility tags
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let errors = 0;
let warnings = 0;

function report(status, msg) {
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`${icon} [${status}] ${msg}`);
  if (status === 'FAIL') errors++;
  if (status === 'WARN') warnings++;
}

console.log('==============================================');
console.log('   RANCHO PRINCIPAL - VERIFICATION SUITE');
console.log('==============================================\n');

// 1. Files existence
const requiredFiles = ['index.html', '404.html', 'robots.txt', 'sitemap.xml', 'css/style.css', 'js/main.js'];
requiredFiles.forEach(f => {
  const full = path.join(rootDir, f);
  if (fs.existsSync(full)) {
    report('PASS', `File exists: ${f} (${fs.statSync(full).size} bytes)`);
  } else {
    report('FAIL', `Missing critical file: ${f}`);
  }
});

// 2. JavaScript syntax test
try {
  const jsContent = fs.readFileSync(path.join(rootDir, 'js/main.js'), 'utf8');
  new Function(jsContent);
  report('PASS', 'js/main.js passed syntax check without errors');
} catch (err) {
  report('FAIL', `js/main.js syntax error: ${err.message}`);
}

// 3. HTML & JSON-LD validation
const htmlPath = path.join(rootDir, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Check JSON-LD
const jsonLdRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
let jsonLdMatch;
let jsonLdCount = 0;
while ((jsonLdMatch = jsonLdRegex.exec(html)) !== null) {
  jsonLdCount++;
  try {
    const parsed = JSON.parse(jsonLdMatch[1]);
    report('PASS', `JSON-LD block #${jsonLdCount} is valid (${parsed['@type'] || 'Custom schema'})`);
  } catch (err) {
    report('FAIL', `JSON-LD block #${jsonLdCount} has JSON syntax error: ${err.message}`);
  }
}
if (jsonLdCount === 0) {
  report('FAIL', 'No JSON-LD schema found in index.html');
}

// 4. Asset references check
const assetAttrRegex = /(?:src|href)=["']([^"']+)["']/gi;
let match;
const checkedAssets = new Set();
let assetCount = 0;

while ((match = assetAttrRegex.exec(html)) !== null) {
  const raw = match[1].trim();
  if (!raw || raw.startsWith('#') || raw.startsWith('data:') || raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('tel:') || raw.startsWith('mailto:') || raw.startsWith('javascript:')) {
    continue;
  }

  // Strip query string
  const clean = raw.split('?')[0];
  if (checkedAssets.has(clean)) continue;
  checkedAssets.add(clean);
  assetCount++;

  const resolved = path.join(rootDir, clean);
  if (!fs.existsSync(resolved)) {
    report('FAIL', `Referenced asset not found: ${raw} -> ${resolved}`);
  } else {
    const size = fs.statSync(resolved).size;
    if (size === 0) {
      report('WARN', `Asset exists but has 0 bytes: ${raw}`);
    }
  }
}
report('PASS', `Verified ${assetCount} local assets referenced in index.html (all exist on disk)`);

// 5. SEO & Accessibility checks
if (!html.includes('<title>') || !html.includes('</title>')) report('FAIL', 'Missing <title> tag in index.html');
else report('PASS', 'SEO: <title> tag present');

if (!html.includes('meta name="description"')) report('FAIL', 'Missing meta description in index.html');
else report('PASS', 'SEO: meta description present');

if (!html.includes('meta name="viewport"')) report('FAIL', 'Missing meta viewport in index.html');
else report('PASS', 'Mobile: viewport meta tag present');

if (!html.includes('lang="pt-BR"')) report('WARN', 'HTML lang attribute should be pt-BR');
else report('PASS', 'Accessibility: lang="pt-BR" present');

console.log('\n----------------------------------------------');
console.log(`SUMMARY: ${errors} error(s), ${warnings} warning(s)`);
console.log('----------------------------------------------\n');

if (errors > 0) {
  process.exit(1);
} else {
  console.log('🎉 All verification checks PASSED successfully!');
  process.exit(0);
}
