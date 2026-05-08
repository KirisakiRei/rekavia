# Panduan Deploy ke VPS Ubuntu + PM2

## Prasyarat VPS

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 secara global
sudo npm install -g pm2

# Install MySQL (jika belum ada)
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Buat database dan user
sudo mysql -u root -p
# Di dalam MySQL:
# CREATE DATABASE rvtech_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# CREATE USER 'rvtech'@'localhost' IDENTIFIED BY 'password_kuat';
# GRANT ALL PRIVILEGES ON rvtech_db.* TO 'rvtech'@'localhost';
# FLUSH PRIVILEGES;
# EXIT;
```

---

## Deploy Backend (NestJS)

### 1. Upload kode ke VPS

```bash
# Opsi A: Git clone
git clone https://github.com/your-repo/rvtech.git /var/www/rvtech
cd /var/www/rvtech/backend

# Opsi B: rsync dari lokal
rsync -avz --exclude node_modules --exclude dist ./backend/ user@vps:/var/www/rvtech/backend/
```

### 2. Setup environment

```bash
cd /var/www/rvtech/backend
cp .env.example .env
nano .env   # isi semua variabel dengan nilai production
```

### 3. Install dependencies & build

```bash
npm install --omit=dev
npm run build

# Generate Prisma client
npx prisma generate

# Jalankan migrasi database
npx prisma migrate deploy
```

### 4. Buat folder PM2 logs

```bash
mkdir -p .pm2-logs
```

### 5. Start dengan PM2

```bash
pm2 start ecosystem.config.js --env production

# Cek status
pm2 status
pm2 logs rvtech-backend

# Simpan konfigurasi PM2
pm2 save

# Setup auto-start saat reboot
pm2 startup
# Jalankan perintah yang muncul dari output pm2 startup
```

### 6. Update / Redeploy

```bash
cd /var/www/rvtech/backend

# Pull kode terbaru
git pull

# Install dependencies baru (jika ada)
npm install --omit=dev

# Build ulang
npm run build

# Jalankan migrasi jika ada schema baru
npx prisma migrate deploy

# Reload tanpa downtime (cluster mode)
pm2 reload rvtech-backend
```

---

## Deploy Frontend (Vite/React)

### 1. Build frontend

```bash
cd /var/www/rvtech/frontend

# Buat .env.production
echo 'VITE_API_BASE_URL=https://api.rvtech.id' > .env.production

npm install
npm run build
# Output ada di dist/
```

### 2. Setup Nginx

```bash
sudo apt install -y nginx

# Buat konfigurasi site
sudo nano /etc/nginx/sites-available/rvtech
```

Isi konfigurasi Nginx:

```nginx
# ── Gzip compression (taruh di /etc/nginx/nginx.conf dalam block http{}) ──────
# gzip on;
# gzip_vary on;
# gzip_min_length 1024;
# gzip_proxied any;
# gzip_comp_level 5;
# gzip_types text/plain text/css text/javascript application/javascript
#            application/json image/svg+xml application/xml;

# ── Site config ───────────────────────────────────────────────────────────────
server {
    listen 80;
    server_name rvtech.id www.rvtech.id 165.22.240.104;

    # ── Uploaded files user (nama file unik/timestamp → cache 1 tahun) ────────
    location /uploads {
        alias /var/www/rekavia/backend/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        try_files $uri =404;
    }

    # ── Backend API — no cache ─────────────────────────────────────────────────
    location /api {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 30M;
        proxy_read_timeout 120s;
        add_header Cache-Control "no-store";
    }

    # ── JS/CSS/Font Vite (nama file pakai hash → cache 1 tahun) ───────────────
    location ~* \.(js|css|woff2?|ttf|eot)$ {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    # ── Gambar & aset statis frontend (tema, layout, icon) ────────────────────
    location ~* \.(png|jpg|jpeg|webp|svg|ico|gif|mp3|mp4|webm)$ {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public";
        add_header Vary "Accept-Encoding";
    }

    # ── Frontend SPA (index.html — no cache) ──────────────────────────────────
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

```bash
# Aktifkan site
sudo ln -s /etc/nginx/sites-available/rvtech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Aktifkan Gzip di nginx.conf:**

```bash
sudo nano /etc/nginx/nginx.conf
```

Tambahkan di dalam block `http { ... }`:

```nginx
http {
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 5;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        image/svg+xml
        application/xml;

    # ... konfigurasi lainnya
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 3. SSL dengan Certbot (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d rvtech.id -d www.rvtech.id -d api.rvtech.id
# Certbot akan otomatis update konfigurasi Nginx untuk HTTPS
```

---

## Monitoring & Maintenance

```bash
# Lihat semua proses PM2
pm2 status

# Lihat log real-time
pm2 logs rvtech-backend --lines 100

# Monitor CPU & Memory
pm2 monit

# Restart jika ada masalah
pm2 restart rvtech-backend

# Lihat log Winston (per hari)
ls backend/logs/2026/05/
tail -f backend/logs/2026/05/08/combined.log
tail -f backend/logs/2026/05/08/error.log
```

---

## Checklist Production

- [ ] `.env` sudah diisi dengan nilai production (bukan default)
- [ ] `JWT_ACCESS_SECRET` sudah diganti dengan string acak panjang
- [ ] `DATABASE_URL` mengarah ke database production
- [ ] `CORS_ORIGINS` sudah diisi dengan domain frontend yang benar
- [ ] `NODE_ENV=production` sudah di-set
- [ ] Migrasi database sudah dijalankan (`prisma migrate deploy`)
- [ ] PM2 sudah di-save dan startup sudah dikonfigurasi
- [ ] Nginx sudah dikonfigurasi sebagai reverse proxy
- [ ] SSL/HTTPS sudah aktif
- [ ] Firewall hanya membuka port 80, 443, dan 22
- [ ] Folder `uploads/` memiliki permission yang benar
