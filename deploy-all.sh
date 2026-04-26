#!/bin/bash

echo "========== INICIANDO DEPLOY COMPLETO =========="

# === FRONTEND ===
echo ""
echo "🎨 DEPLOY FRONTEND"

cd /opt/starFactory/front/Starfactory-front || { echo "❌ Error: No se pudo acceder al directorio del frontend"; exit 1; }

echo "📥 Git fetch..."
git fetch

echo "📥 Git pull..."
git pull

echo "📦 Instalando dependencias frontend..."
npm install

echo "🏗️ Compilando proyecto frontend..."
npm run build

echo "🔄 Recargando Nginx..."
sudo systemctl reload nginx


# === BACKEND ===
echo ""
echo "🧠 DEPLOY BACKEND"

cd /opt/starFactory/back/Starfactory-back || { echo "❌ Error: No se pudo acceder al directorio del backend"; exit 1; }

echo "📥 Git fetch..."
git fetch

echo "📥 Git pull..."
git pull

echo "📦 Instalando dependencias backend..."
npm install

echo "🧼 Eliminando proceso PM2 anterior..."
pm2 delete star-back || echo "ℹ️ Proceso 'star-back' no estaba corriendo (ok)"

echo "🚀 Iniciando backend con PM2..."
pm2 start index.js --name star-back

echo ""
echo "✅ DEPLOY COMPLETO FINALIZADO"