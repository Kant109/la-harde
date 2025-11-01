#!/usr/bin/env node

/**
 * Script pour générer le hash SHA-256 d'une clé admin
 * Usage: node scripts/generate-admin-hash.js "votre-clé-secrète"
 */

import crypto from 'crypto'

const key = process.argv[2]

if (!key) {
  console.error('❌ Erreur: Veuillez fournir une clé en argument')
  console.log('\nUsage:')
  console.log('  node scripts/generate-admin-hash.js "votre-clé-secrète"')
  console.log('\nExemple:')
  console.log('  node scripts/generate-admin-hash.js "MonMotDePasseSecret123"')
  process.exit(1)
}

const hash = crypto.createHash('sha256').update(key).digest('hex')

console.log('\n✅ Hash généré avec succès!\n')
console.log('Clé entrée:', key)
console.log('Hash SHA-256:', hash)
console.log('\nAjoutez cette ligne à votre fichier .env:')
console.log(`NUXT_PUBLIC_ADMIN_KEY_HASH=${hash}`)
console.log('\n⚠️  IMPORTANT: Conservez votre clé en lieu sûr et ne la commitez jamais!')
