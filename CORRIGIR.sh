#!/bin/bash

# 🔧 CORRETOR DE PROBLEMAS - PROJETO TESTE OFICINA
# Execute este arquivo se algo não estiver funcionando!

clear
echo "🔧 ============================================="
echo "🔧 CORRETOR DE PROBLEMAS - TESTE OFICINA"
echo "🔧 ============================================="
echo ""
echo "🛠️  Este script vai corrigir problemas comuns:"
echo "   • Limpar caches"
echo "   • Reinstalar dependências"
echo "   • Liberar portas ocupadas"
echo "   • Recriar configurações"
echo ""
read -p "🔥 Pressione ENTER para começar a correção..."

# Executar correção de problemas
bash fix_problems.sh

echo ""
echo "🎉 ============================================="
echo "🎉 CORREÇÃO CONCLUÍDA!"
echo "🎉 ============================================="
echo ""
echo "🚀 PRÓXIMOS PASSOS:"
echo ""
echo "   1️⃣ Reinstalar (recomendado):"
echo "      bash INSTALAR.sh"
echo ""
echo "   2️⃣ Ou tentar executar diretamente:"
echo "      bash EXECUTAR.sh"
echo ""
echo "🎯 Problemas resolvidos!"
