const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const SOURCE_LOCALE = 'en.json';
const TARGET_LOCALES = ['te.json', 'ur.json'];

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function checkI18n() {
  const sourcePath = path.join(MESSAGES_DIR, SOURCE_LOCALE);
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source locale file not found: ${sourcePath}`);
    process.exit(1);
  }

  const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const sourceKeys = getKeys(sourceContent);
  let hasError = false;

  TARGET_LOCALES.forEach(localeFile => {
    const targetPath = path.join(MESSAGES_DIR, localeFile);
    if (!fs.existsSync(targetPath)) {
      console.warn(`Target locale file missing: ${localeFile}`);
      return;
    }

    const targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    const targetKeys = new Set(getKeys(targetContent));

    const missingKeys = sourceKeys.filter(key => !targetKeys.has(key));
    if (missingKeys.length > 0) {
      console.error(`❌ Locale ${localeFile} is missing keys:\n  - ${missingKeys.join('\n  - ')}`);
      hasError = true;
    } else {
      console.log(`✅ Locale ${localeFile} is up to date.`);
    }
  });

  if (hasError) {
    process.exit(1);
  }
}

checkI18n();
