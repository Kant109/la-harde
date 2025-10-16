# Migration vers PNG - Guide rapide

## ✅ Modifications effectuées

Tous les fichiers ont été mis à jour pour utiliser le format PNG :

1. ✅ **products.json** - Tous les chemins d'images utilisent maintenant `.png`
2. ✅ **check-images.sh** - Le script vérifie maintenant les fichiers `.png`
3. ✅ **GUIDE-IMAGES-PRODUITS.md** - Documentation mise à jour
4. ✅ **RESUME-AJOUT-IMAGES.md** - Instructions mises à jour

## 📋 État actuel de vos images

D'après la dernière vérification :

```
✅ maillot-2.png (452K)
✅ maillot-3.png (1.4M)
✅ maillot-4.png (1.4M)
❌ maillot.png (MANQUANT)
```

**Images à ajouter :**
- 17 images PNG manquantes (voir liste complète avec `npm run check-images`)

**Image JPG à convertir :**
- `maillot.jpg` → à convertir en `maillot.png`

## 🔄 Conversion des images existantes

Si vous avez des images JPG, voici comment les convertir :

### Option 1 : Conversion avec ImageMagick

```bash
cd /home/qroulet/PERSO/la-harde/public/images/products

# Convertir l'image maillot.jpg existante
convert maillot.jpg maillot.png

# Vérifier le résultat
ls -lh maillot.png

# Supprimer l'ancien JPG (optionnel)
rm maillot.jpg
```

### Option 2 : Conversion en masse

Si vous avez plusieurs images JPG à convertir :

```bash
cd /home/qroulet/PERSO/la-harde/public/images/products

# Convertir tous les JPG en PNG
for img in *.jpg; do
    echo "Conversion de $img..."
    convert "$img" "${img%.jpg}.png"
done

# Vérifier les conversions
ls -lh *.png

# Supprimer les anciens JPG (optionnel - ATTENTION: permanent!)
# rm *.jpg
```

### Option 3 : Avec optimisation

Pour des fichiers PNG plus légers :

```bash
# Installer optipng si nécessaire
sudo apt-get install optipng

cd /home/qroulet/PERSO/la-harde/public/images/products

# Convertir et optimiser
convert maillot.jpg maillot.png
optipng -o5 maillot.png
```

## 📸 Ajout de nouvelles images

Toutes les nouvelles images doivent être au format PNG :

```bash
cd /home/qroulet/PERSO/la-harde/public/images/products

# Copier vos images PNG
cp /chemin/vers/vos/photos/*.png .

# Renommer selon la convention
# Exemple pour les stickers:
mv photo1.png stickers.png
mv photo2.png stickers-2.png
mv photo3.png stickers-3.png
```

## ✅ Vérification

Après avoir ajouté ou converti vos images :

```bash
# Vérifier l'état des images
npm run check-images

# Démarrer le site pour tester
npm run dev
```

## 📝 Liste complète des images nécessaires

Tous les fichiers doivent être en **PNG** :

```
stickers.png + stickers-2.png + stickers-3.png
maillot.png + maillot-2.png + maillot-3.png + maillot-4.png
mug.png + mug-2.png
veste.png + veste-2.png + veste-3.png + veste-4.png
casque.png + casque-2.png + casque-3.png + casque-4.png
bidon.png + bidon-2.png + bidon-3.png
```

## 🎯 Avantages du PNG

**Pourquoi ce changement ?**
- ✅ Meilleure qualité sans perte
- ✅ Support de la transparence (utile pour les logos)
- ✅ Pas d'artefacts de compression JPEG
- ✅ Idéal pour les produits avec texte ou détails fins
- ✅ Conversion automatique en WebP par Nuxt Image (optimisation)

## 🆘 Besoin d'aide ?

Consultez les guides détaillés :
- **[RESUME-AJOUT-IMAGES.md](RESUME-AJOUT-IMAGES.md)** - Instructions rapides
- **[GUIDE-IMAGES-PRODUITS.md](GUIDE-IMAGES-PRODUITS.md)** - Guide complet

Commandes utiles :
```bash
# Vérifier les images
npm run check-images

# Lister les images actuelles
ls -lh public/images/products/

# Voir l'espace disque utilisé
du -sh public/images/products/
```
