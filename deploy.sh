#!/bin/bash

echo "========== INICIANDO DEPLOY =========="

# Actualización del repositorio
echo "📥 Ejecutando git fetch..."
git fetch

echo "📥 Ejecutando git pull..."
git pull

# Instalación de dependencias
echo "📦 Ejecutando npm install..."
npm install

# Construcción del proyecto
echo "🏗️ Ejecutando npm run build..."
npm run build

# Recarga de Nginx
echo "🔄 Recargando Nginx..."
sudo systemctl reload nginx

echo "✅ DEPLOY COMPLETADO"