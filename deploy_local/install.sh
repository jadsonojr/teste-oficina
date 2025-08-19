#!/bin/bash
echo "================================"
echo "  INSTALANDO GESTÃO OFICINA"
echo "================================"

echo "Instalando dependências do backend..."
cd backend
pip3 install -r requirements.txt

echo "Instalando dependências do frontend..."
cd ../frontend
npm install

echo "================================"
echo "  INSTALAÇÃO CONCLUÍDA!"
echo "================================"
echo
echo "Para iniciar o sistema, execute: ./start.sh"
echo