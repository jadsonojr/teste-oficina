#!/bin/bash
echo "================================"
echo "  INICIANDO GESTÃO OFICINA"
echo "================================"

# Verificar MongoDB
if ! systemctl is-active --quiet mongod; then
    echo "Iniciando MongoDB..."
    sudo systemctl start mongod
fi

echo "Iniciando backend..."
cd backend
python3 server.py &
BACKEND_PID=$!

echo "Aguardando backend iniciar..."
sleep 5

echo "Iniciando frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "================================"
echo "  SISTEMA INICIADO!"
echo "================================"
echo
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8001"
echo
echo "Para parar: ./stop.sh"
echo "PIDs salvos em: .pids"

echo "$BACKEND_PID" > .pids
echo "$FRONTEND_PID" >> .pids