#!/bin/bash
echo "================================"
echo "  PARANDO GESTÃO OFICINA"
echo "================================"

if [ -f .pids ]; then
    while read pid; do
        echo "Parando processo $pid..."
        kill -9 $pid 2>/dev/null
    done < .pids
    rm .pids
fi

# Backup kill
pkill -f "python3 server.py"
pkill -f "npm start"
pkill -f "node.*react-scripts"

echo "Sistema parado com sucesso!"