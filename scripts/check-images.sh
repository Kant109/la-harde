#!/bin/bash

# Script pour vérifier les images des produits

echo "🔍 Vérification des images produits pour LA HARDE"
echo "=================================================="
echo ""

IMAGES_DIR="/home/qroulet/PERSO/la-harde/public/images/products"

# Vérifier si le dossier existe
if [ ! -d "$IMAGES_DIR" ]; then
    echo "❌ Le dossier $IMAGES_DIR n'existe pas!"
    echo "Création du dossier..."
    mkdir -p "$IMAGES_DIR"
    echo "✅ Dossier créé"
fi

cd "$IMAGES_DIR"

echo "📁 Dossier : $IMAGES_DIR"
echo ""

# Liste des images attendues selon products.json
declare -a EXPECTED_IMAGES=(
    "stickers.png"
    "stickers-2.png"
    "stickers-3.png"
    "maillot.png"
    "maillot-2.png"
    "maillot-3.png"
    "maillot-4.png"
    "mug.png"
    "mug-2.png"
    "veste.png"
    "veste-2.png"
    "veste-3.png"
    "veste-4.png"
    "casque.png"
    "casque-2.png"
    "casque-3.png"
    "casque-4.png"
    "bidon.png"
    "bidon-2.png"
    "bidon-3.png"
)

MISSING_COUNT=0
FOUND_COUNT=0

echo "📋 État des images :"
echo ""

for image in "${EXPECTED_IMAGES[@]}"; do
    if [ -f "$image" ]; then
        SIZE=$(du -h "$image" | cut -f1)
        echo "✅ $image ($SIZE)"
        FOUND_COUNT=$((FOUND_COUNT + 1))
    else
        echo "❌ $image (MANQUANT)"
        MISSING_COUNT=$((MISSING_COUNT + 1))
    fi
done

echo ""
echo "=================================================="
echo "📊 Résumé :"
echo "   ✅ Images trouvées : $FOUND_COUNT"
echo "   ❌ Images manquantes : $MISSING_COUNT"
echo "   📦 Total attendu : ${#EXPECTED_IMAGES[@]}"
echo ""

if [ $MISSING_COUNT -eq 0 ]; then
    echo "🎉 Toutes les images sont présentes !"
else
    echo "⚠️  Il manque $MISSING_COUNT image(s)"
    echo ""
    echo "💡 Conseil : Ajoutez les images manquantes dans :"
    echo "   $IMAGES_DIR"
    echo ""
    echo "📖 Pour plus d'informations, consultez :"
    echo "   GUIDE-IMAGES-PRODUITS.md"
fi

echo ""
echo "📸 Images supplémentaires trouvées :"
shopt -s nullglob
EXTRA_FOUND=0
for file in *.jpg *.jpeg *.png *.webp; do
    if [ -f "$file" ]; then
        # Vérifier si l'image n'est pas dans la liste attendue
        if [[ ! " ${EXPECTED_IMAGES[@]} " =~ " ${file} " ]]; then
            SIZE=$(du -h "$file" | cut -f1)
            echo "   ℹ️  $file ($SIZE)"
            EXTRA_FOUND=$((EXTRA_FOUND + 1))
        fi
    fi
done

if [ $EXTRA_FOUND -eq 0 ]; then
    echo "   Aucune image supplémentaire"
fi

echo ""
