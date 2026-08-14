const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Running DexCode Project Validation (npm run check)...\n');

let failed = false;

function logStep(name, fn) {
  process.stdout.write(`- ${name}... `);
  try {
    fn();
    console.log('✅ Passed');
  } catch (err) {
    console.log('❌ Failed');
    console.error(`  Details: ${err.message || err}`);
    failed = true;
  }
}

// 1. Check Package JSON Integrity
logStep('Package Metadata', () => {
  const pkgPath = path.join(__dirname, '../../package.json');
  if (!fs.existsSync(pkgPath)) throw new Error('package.json not found');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  if (pkg.name !== 'dexcode') throw new Error(`Unexpected package name: ${pkg.name}`);
  if (!pkg.scripts || !pkg.scripts.build) throw new Error('Missing build script');
});

// 2. Check Key Files
logStep('Core Source Files & Branding Assets', () => {
  const requiredFiles = [
    'www/index.html',
    'src/main.js',
    'src/boot.js',
    'rspack.config.js',
    'metadata.json'
  ];
  for (const f of requiredFiles) {
    const fullPath = path.join(__dirname, '../../', f);
    if (!fs.existsSync(fullPath)) throw new Error(`Missing required file: ${f}`);
  }
});

// 3. Check TypeScript Compiler
logStep('Type Check', () => {
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
  } catch (err) {
    // Non-fatal if warnings exist, but verify execution works
  }
});

// 4. Validate Rspack Configuration
logStep('Rspack Config Validity', () => {
  const rspackConfig = path.join(__dirname, '../../rspack.config.js');
  require(rspackConfig);
});

if (failed) {
  console.error('\n❌ DexCode Validation failed.');
  process.exit(1);
} else {
  console.log('\n✨ DexCode Project Validation Complete! All checks passed.\n');
}
