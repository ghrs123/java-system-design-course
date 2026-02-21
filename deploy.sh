#!/bin/bash
# ─── Deploy Script: Java System Design Course ───
# Executa este script na raiz do repositório clonado
# Não deleta nada que já existia — apenas adiciona/atualiza client/src

set -e

REPO_URL="https://github.com/ghrs123/java-system-design-course"

echo "🔵 Java System Design Course — Deploy"
echo "======================================"

# 1. Verificar que estamos no repositório correto
if [ ! -f "package.json" ]; then
  echo "❌ Erro: Executa este script na raiz do repositório"
  exit 1
fi

REPO_NAME=$(cat package.json | python3 -c "import json,sys; print(json.load(sys.stdin)['name'])")
echo "✅ Repositório: $REPO_NAME"

# 2. Instalar dependências
echo ""
echo "📦 Instalando dependências..."
pnpm install

# 3. Build para verificar que compila
echo ""
echo "🔨 Build de verificação..."
pnpm build

echo ""
echo "✅ Build OK — pronto para deploy"
echo ""
echo "📤 Para fazer push para GitHub:"
echo "   git add ."
echo "   git commit -m 'feat: add interactive course site (Blueprint Engineering theme)'"
echo "   git push origin main"
