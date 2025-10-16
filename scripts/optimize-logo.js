import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = path.join(__dirname, '../public/images/logo-harde.png');
const outputDir = path.join(__dirname, '../public/images');

async function optimizeLogo() {
  try {
    // Vérifier si l'image source existe
    if (!fs.existsSync(inputPath)) {
      console.error('❌ L\'image logo-harde.png n\'existe pas encore.');
      console.log('📝 Veuillez placer votre logo dans public/images/logo-harde.png');
      return;
    }

    console.log('🚀 Optimisation du logo en cours...\n');

    // Optimiser l'image principale
    await sharp(inputPath)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(outputDir, 'logo-harde-optimized.png'));
    console.log('✅ Logo principal optimisé (512x512)');

    // Créer une version favicon 32x32
    await sharp(inputPath)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 90 })
      .toFile(path.join(outputDir, 'logo-32x32.png'));
    console.log('✅ Favicon 32x32 créé');

    // Créer une version favicon 16x16
    await sharp(inputPath)
      .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 90 })
      .toFile(path.join(outputDir, 'logo-16x16.png'));
    console.log('✅ Favicon 16x16 créé');

    // Créer une version Apple Touch Icon 180x180
    await sharp(inputPath)
      .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 90 })
      .toFile(path.join(outputDir, 'logo-180x180.png'));
    console.log('✅ Apple Touch Icon 180x180 créé');

    // Créer une version pour les réseaux sociaux (Open Graph) 1200x630
    await sharp(inputPath)
      .resize(1200, 630, { fit: 'contain', background: { r: 20, g: 20, b: 30, alpha: 1 } })
      .png({ quality: 90 })
      .toFile(path.join(outputDir, 'logo-og.png'));
    console.log('✅ Image Open Graph 1200x630 créée');

    // Créer un favicon.ico à partir de l'image
    await sharp(inputPath)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(__dirname, '../public/favicon-new.png'));
    console.log('✅ Nouveau favicon créé (à convertir en .ico)');

    console.log('\n🎉 Optimisation terminée avec succès!');
    console.log('\n📋 Fichiers créés:');
    console.log('   - logo-harde-optimized.png (512x512) - Image principale optimisée');
    console.log('   - logo-32x32.png - Favicon standard');
    console.log('   - logo-16x16.png - Petit favicon');
    console.log('   - logo-180x180.png - Apple Touch Icon');
    console.log('   - logo-og.png (1200x630) - Image pour réseaux sociaux');
    console.log('   - favicon-new.png - À convertir en .ico si nécessaire');

  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error.message);
  }
}

optimizeLogo();
