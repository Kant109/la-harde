import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicDir = join(__dirname, '..', 'public')

// Configuration des icônes PWA
const iconSizes = [
  { size: 64, name: 'pwa-64x64.png' },
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 512, name: 'maskable-icon-512x512.png', maskable: true }
]

async function generatePWAIcons() {
  const logoPath = join(publicDir, 'images', 'logo-harde.png')

  // Vérifier si le logo existe
  if (!fs.existsSync(logoPath)) {
    console.error('Logo file not found:', logoPath)
    process.exit(1)
  }

  console.log('Generating PWA icons...')

  for (const config of iconSizes) {
    const outputPath = join(publicDir, config.name)

    try {
      if (config.maskable) {
        // Pour les icônes maskable, ajouter un padding de 20%
        const padding = Math.floor(config.size * 0.2)
        const innerSize = config.size - (padding * 2)

        await sharp(logoPath)
          .resize(innerSize, innerSize, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .png()
          .toFile(outputPath)
      } else {
        // Pour les icônes normales
        await sharp(logoPath)
          .resize(config.size, config.size, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .png()
          .toFile(outputPath)
      }

      console.log(`✓ Generated ${config.name} (${config.size}x${config.size})`)
    } catch (error) {
      console.error(`✗ Error generating ${config.name}:`, error.message)
    }
  }

  console.log('PWA icons generated successfully!')
}

generatePWAIcons().catch(console.error)
