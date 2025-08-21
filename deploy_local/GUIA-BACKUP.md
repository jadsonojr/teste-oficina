# 💾 GUIA COMPLETO DE BACKUP - GESTÃO OFICINA

## 🚀 MÉTODOS DE BACKUP DISPONÍVEIS

### 1️⃣ BACKUP COMPLETO (Recomendado)
**Arquivo:** `BACKUP.bat`
**Inclui:** Dados + Sistema completo
**Uso:** Para backup completo da oficina

### 2️⃣ BACKUP RÁPIDO (Só dados) 
**Arquivo:** `BACKUP-RAPIDO.bat`
**Inclui:** Apenas dados (vendas, clientes, etc)
**Uso:** Backup diário rápido

### 3️⃣ BACKUP AUTOMÁTICO
**Arquivo:** `CONFIGURAR-BACKUP-AUTOMATICO.bat`
**Inclui:** Configura backup diário automático
**Uso:** Para não esquecer de fazer backup

## 📅 CRONOGRAMA RECOMENDADO

### BACKUP DIÁRIO:
```
Execute: BACKUP-RAPIDO.bat
Quando: Final do expediente
Tempo: 30 segundos
```

### BACKUP SEMANAL:
```
Execute: BACKUP.bat
Quando: Final de semana  
Tempo: 2-3 minutos
```

### BACKUP MENSAL:
```
Execute: BACKUP.bat
Copie para pendrive/nuvem
Quando: Todo dia 30
```

## 🔄 RESTAURAÇÃO

### Restaurar dados:
```bat
RESTAURAR.bat
# Ou manualmente:
mongorestore --db oficina_mecanica --drop pasta_backup/oficina_mecanica
```

### Restaurar sistema completo:
```
1. Execute RESTAURAR.bat
2. Selecione pasta do backup
3. Sistema será restaurado automaticamente
```

## 📁 ONDE FICAM OS BACKUPS

```
pasta_do_sistema/
├── backup_2025-01-20_09-15/    ← Backup completo
├── backup_2025-01-20_18-30/    ← Backup completo  
├── backup_dados_2025-01-21/    ← Só dados
└── backup_dados_2025-01-22/    ← Só dados
```

## 💡 DICAS IMPORTANTES

### ✅ BOAS PRÁTICAS:
- Faça backup ANTES de atualizar o sistema
- Teste a restauração pelo menos 1x por mês
- Mantenha pelo menos 3 backups recentes
- Copie backups importantes para pendrive

### ⚠️ CUIDADOS:
- Não delete a pasta `oficina_mecanica` do backup
- Backups ficam na mesma pasta do sistema
- Para segurança extra, copie para outro local

## 🆘 BACKUP DE EMERGÊNCIA

Se o sistema parar de funcionar:

1. **Execute:** `BACKUP-RAPIDO.bat`
2. **Reinstale** o sistema
3. **Execute:** `RESTAURAR.bat`
4. **Selecione** o backup criado

## 🔧 COMANDOS MANUAIS

### Backup manual:
```cmd
mongodump --db oficina_mecanica --out backup_manual
```

### Restauração manual:
```cmd  
mongorestore --db oficina_mecanica --drop backup_manual/oficina_mecanica
```

### Verificar backups:
```cmd
dir backup_*
```

## 📞 BACKUP PARA MÚLTIPLOS COMPUTADORES

Se usar em rede, faça backup apenas no **computador servidor**:

1. **No servidor:** Execute `BACKUP.bat`
2. **Copie** a pasta de backup para segurança
3. **Para restaurar:** Use `RESTAURAR.bat` no servidor

---

**🎯 RESUMO RÁPIDO:**
- **Diário:** `BACKUP-RAPIDO.bat` (30 segundos)
- **Semanal:** `BACKUP.bat` (2-3 minutos)  
- **Emergência:** `RESTAURAR.bat`