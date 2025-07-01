# 🚀 RitterFinder Deployment Guide

Esta guía te ayudará a desplegar RitterFinder en tu VPS con Docker y configurar actualizaciones automáticas.

## 📋 Prerrequisitos

### En tu VPS:
- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Git** >= 2.30
- **Make** (opcional, para comandos fáciles)
- **jq** (para webhooks)
- **curl** o **wget** (para health checks)

### Instalación de prerrequisitos (Ubuntu/Debian):
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias básicas
sudo apt install -y git make jq curl

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt install -y docker-compose-plugin

# Reiniciar sesión para aplicar cambios de grupo
newgrp docker
```

## 🏗️ Configuración Inicial

### 1. Clonar el repositorio
```bash
# Navegar al directorio donde quieres el proyecto
cd /opt  # o /home/tu-usuario

# Clonar el repositorio
git clone https://github.com/tu-usuario/ritterfinder.git
cd ritterfinder
```

### 2. Configurar variables de entorno
```bash
# Copiar template de producción
cp .env.production.example .env.production

# Editar con tus valores reales
nano .env.production
```

**Variables importantes en `.env.production`:**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-supabase-url.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# App Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
```

### 3. Configurar scripts de despliegue
```bash
# Hacer scripts ejecutables
chmod +x scripts/*.sh

# Editar rutas en los scripts
nano scripts/auto-deploy.sh
# Cambiar: PROJECT_DIR="/path/to/your/ritterfinder"
# Por:     PROJECT_DIR="/opt/ritterfinder"  # o tu ruta real
```

## 🐳 Despliegue Inicial

### Opción 1: Usando Make (Recomendado)
```bash
# Ver comandos disponibles
make help

# Configurar entorno de producción
make setup-prod

# Construir y desplegar
make prod
```

### Opción 2: Comandos Docker directos
```bash
# Construir imagen
docker-compose build

# Iniciar en producción
docker-compose up -d
```

### 3. Verificar despliegue
```bash
# Verificar contenedores
docker-compose ps

# Ver logs
docker-compose logs -f

# Probar health check
curl http://localhost:3000/api/health

# O usar Make
make health
```

## 🔄 Configurar Auto-Actualización

### Método 1: Cron Job (Polling)
```bash
# Editar crontab
crontab -e

# Agregar línea para revisar cada 5 minutos
*/5 * * * * cd /opt/ritterfinder && ./scripts/auto-deploy.sh >/dev/null 2>&1
```

### Método 2: GitHub Webhooks (Recomendado)

#### A. Configurar webhook script
```bash
# Editar webhook script
nano scripts/webhook-deploy.sh

# Cambiar configuraciones:
WEBHOOK_SECRET="tu-secreto-super-seguro"
PROJECT_DIR="/opt/ritterfinder"
```

#### B. Crear endpoint web (con nginx)
```bash
# Instalar nginx si no lo tienes
sudo apt install -y nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/ritterfinder-webhook
```

**Contenido de la configuración nginx:**
```nginx
server {
    listen 8080;
    server_name tu-servidor.com;
    
    location /webhook {
        proxy_pass http://localhost:9000/webhook;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### C. Activar configuración
```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/ritterfinder-webhook /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### D. Crear servicio webhook
```bash
# Crear servicio webhook simple
sudo nano /etc/systemd/system/ritterfinder-webhook.service
```

**Contenido del servicio:**
```ini
[Unit]
Description=RitterFinder Webhook Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/ritterfinder
ExecStart=/bin/bash -c 'while true; do nc -l -p 9000 -c "scripts/webhook-deploy.sh"; done'
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar y iniciar servicio
sudo systemctl enable ritterfinder-webhook
sudo systemctl start ritterfinder-webhook
```

#### E. Configurar GitHub Webhook
1. Ve a tu repositorio en GitHub
2. Settings → Webhooks → Add webhook
3. **Payload URL:** `http://tu-servidor.com:8080/webhook`
4. **Content type:** `application/json`
5. **Secret:** el mismo que pusiste en `WEBHOOK_SECRET`
6. **Events:** Just the push event

## 🔧 Comandos de Mantenimiento

### Comandos Make disponibles:
```bash
make help          # Ver todos los comandos
make dev            # Modo desarrollo
make prod           # Modo producción
make logs           # Ver logs
make health         # Verificar salud
make restart        # Reiniciar
make clean          # Limpiar todo
make deploy         # Redeploy manual
make update         # Pull + redeploy
make backup         # Crear backup
make status         # Estado detallado
```

### Comandos Docker manuales:
```bash
# Ver logs
docker-compose logs -f

# Reiniciar aplicación
docker-compose restart

# Rebuild completo
docker-compose down
docker-compose up -d --build

# Limpiar espacio
docker system prune -f
```

## 🔍 Troubleshooting

### 1. Contenedor no inicia
```bash
# Ver logs detallados
docker-compose logs ritterfinder

# Verificar configuración
make health

# Verificar variables de entorno
docker-compose config
```

### 2. Aplicación no responde
```bash
# Verificar puertos
netstat -tlnp | grep 3000

# Verificar health endpoint
curl -v http://localhost:3000/api/health

# Reiniciar contenedor
docker-compose restart ritterfinder
```

### 3. Auto-deploy no funciona
```bash
# Verificar logs de deployment
tail -f /var/log/ritterfinder-deploy.log

# Probar script manualmente
./scripts/auto-deploy.sh

# Verificar permisos
ls -la scripts/
```

### 4. Problemas de memoria
```bash
# Ver uso de recursos
docker stats

# Limpiar imágenes no usadas
docker image prune -f

# Reiniciar con límites de memoria
docker-compose down
docker-compose up -d --build
```

## 🚨 Configuración de Alertas (Opcional)

### Configurar notificaciones en auto-deploy.sh:
```bash
# Editar función notify en scripts/auto-deploy.sh
notify() {
    # Slack webhook
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 RitterFinder: $1\"}" \
        YOUR_SLACK_WEBHOOK_URL
    
    # Discord webhook
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"content\":\"🚀 RitterFinder: $1\"}" \
        YOUR_DISCORD_WEBHOOK_URL
    
    # Email (usando sendmail)
    echo "RitterFinder: $1" | mail -s "Deployment Update" admin@tudominio.com
}
```

## 📊 Monitoreo

### Health Check URL:
```
http://tu-servidor.com:3000/api/health
```

### Logs importantes:
```bash
# Logs de aplicación
docker logs ritterfinder_app

# Logs de deployment
tail -f /var/log/ritterfinder-deploy.log

# Logs de webhook
tail -f /var/log/ritterfinder-webhook.log
```

## 🔒 Seguridad

### Recomendaciones de seguridad:
1. **Firewall:** Solo abrir puertos necesarios (80, 443, 22)
2. **SSL:** Configurar certificados SSL con Let's Encrypt
3. **Secrets:** No commitear `.env.production` al repositorio
4. **Updates:** Mantener Docker y sistema actualizado
5. **Backups:** Programar backups regulares

### Configurar SSL con Let's Encrypt:
```bash
# Instalar certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Auto-renovación
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🎉 ¡Listo!

Tu aplicación RitterFinder ahora está:
- ✅ Dockerizada
- ✅ Auto-desplegándose en cada push
- ✅ Monitoreada con health checks
- ✅ Lista para producción

### URLs importantes:
- **Aplicación:** `http://tu-servidor.com:3000`
- **Health Check:** `http://tu-servidor.com:3000/api/health`
- **Webhook:** `http://tu-servidor.com:8080/webhook`

¡Disfruta tu deployment automatizado! 🌸✨ 