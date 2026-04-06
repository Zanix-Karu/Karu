// scripts/check-translations.js
const en = require('../messages/en.json')
const fr = require('../messages/fr.json')

function getKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return getKeys(value, fullKey)
    }
    return [fullKey]
  })
}

const enKeys = new Set(getKeys(en))
const frKeys = new Set(getKeys(fr))

const missingInFr = [...enKeys].filter(k => !frKeys.has(k))
const missingInEn = [...frKeys].filter(k => !enKeys.has(k))

let hasErrors = false

if (missingInFr.length > 0) {
  console.error('❌ Keys in en.json missing from fr.json:')
  missingInFr.forEach(k => console.error(`  - ${k}`))
  hasErrors = true
}

if (missingInEn.length > 0) {
  console.error('❌ Keys in fr.json missing from en.json:')
  missingInEn.forEach(k => console.error(`  - ${k}`))
  hasErrors = true
}

if (!hasErrors) {
  console.log('✅ Translation keys are in parity.')
  process.exit(0)
} else {
  process.exit(1)
}
