# 🏠 INSTALAÇÃO LOCAL - GESTÃO OFICINA MECÂNICA

## 📋 REQUISITOS MÍNIMOS
- Windows 10/11 ou Linux Ubuntu 18+
- 4GB RAM mínimo
- 2GB espaço em disco
- **NÃO PRECISA DE INTERNET após instalação**

## 🚀 INSTALAÇÃO WINDOWS

### Passo 1: Instalar Node.js
1. Baixe Node.js LTS: https://nodejs.org
2. Execute o instalador
3. Reinicie o computador

### Passo 2: Instalar Python
1. Baixe Python 3.9+: https://python.org
2. **MARQUE** "Add Python to PATH"
3. Execute o instalador

### Passo 3: Instalar MongoDB
1. Baixe MongoDB Community: https://mongodb.com/download-center/community
2. Execute instalador com configurações padrão
3. MongoDB rodará como serviço

### Passo 4: Instalar o Sistema
1. Extraia o arquivo `gestao-oficina.zip`
2. Abra PowerShell como Administrador
3. Navegue até a pasta: `cd C:\gestao-oficina`
4. Execute: `install.bat`

### Passo 5: Executar
1. Execute: `start.bat`
2. Abra navegador: `http://localhost:3000`
3. **PRONTO! Sistema funcionando offline**

## 🐧 INSTALAÇÃO LINUX

### Passo 1: Instalar dependências
```bash
sudo apt update
sudo apt install nodejs npm python3 python3-pip mongodb
```

### Passo 2: Instalar o Sistema
```bash
cd gestao-oficina
chmod +x install.sh
./install.sh
```

### Passo 3: Executar
```bash
./start.sh
# Abrir navegador: http://localhost:3000
```

## 💾 BACKUP DOS DADOS

### Exportar dados
```bash
mongodump --db oficina_mecanica --out backup/
```

### Importar dados
```bash
mongorestore --db oficina_mecanica backup/oficina_mecanica/
```

## 🖥️ ACESSO EM REDE LOCAL

Para usar em vários computadores da oficina:

### No computador servidor:
1. Execute: `start-network.bat`
2. Anote o IP exibido (ex: 192.168.1.100)

### Nos outros computadores:
1. Abra navegador
2. Digite: `http://192.168.1.100:3000`
3. **Sistema compartilhado na rede local!**

## 🔧 RESOLUÇÃO DE PROBLEMAS

### Erro de porta ocupada:
- Reinicie o computador
- Execute `stop.bat` antes de `start.bat`

### Banco não conecta:
- Reiniciar serviço MongoDB
- Windows: `services.msc` → MongoDB → Reiniciar

### Sistema não abre:
- Verificar se Node.js e Python estão instalados
- Executar `install.bat` novamente

## 📞 SUPORTE
- Sistema funciona 100% offline
- Dados salvos localmente
- Sem mensalidades ou dependências externas