# 📦 Neofox Media Website - Installation Guide

This guide will help you deploy your Neofox Media website with the Visual Editor to your Bluehost shared hosting.

---

## 🎯 Prerequisites

- Bluehost shared hosting account
- cPanel access
- FTP client (optional, for manual upload)
- Git access (for Git deployment)

**Your Server Details:**
- Server: sh033
- Operating System: Linux
- cPanel Version: 110.0 (build 79)
- Apache: 2.4.59
- MySQL: 5.7.23-23
- PHP: 7.0+ (check your version in cPanel)

---

## 🚀 Installation Methods

### Method 1: Git Deployment (Recommended)

1. **Log into cPanel**
   - Go to your Bluehost cPanel

2. **Navigate to Git Version Control**
   - Find "Git™ Version Control" in cPanel
   - Click "Create"

3. **Clone Repository**
   - Repository URL: `[Your GitHub Repository URL]`
   - Repository Path: `/home/[username]/repositories/nfxmwebsite`
   - Click "Create"

4. **Deploy to public_html**
   - Click "Manage" on your repository
   - Click "Pull or Deploy" tab
   - Update `.cpanel.yml` deployment path:
     ```yaml
     - export DEPLOYPATH=/home/[your-username]/public_html/
     ```
   - Click "Update from Remote"

### Method 2: FTP Upload

1. **Download Files**
   - Download all files from GitHub repository
   - Extract the ZIP file

2. **Connect via FTP**
   - Host: `ftp.yourdomain.com`
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21

3. **Upload Files**
   - Upload all files to `/public_html/` directory
   - Ensure `.htaccess` files are uploaded (enable "Show hidden files" in FTP client)

### Method 3: File Manager

1. **Log into cPanel**
2. **Open File Manager**
3. **Navigate to public_html**
4. **Upload ZIP**
   - Click "Upload"
   - Select your website ZIP file
   - Wait for upload to complete
5. **Extract Files**
   - Right-click the ZIP file
   - Click "Extract"
   - Delete the ZIP file after extraction

---

## 🔧 Post-Installation Setup

### Step 1: Set File Permissions

Using File Manager in cPanel:

```
/public_html/editor/            → 755
/public_html/editor/database/   → 755
/public_html/editor/backups/    → 755
/public_html/editor/logs/       → 755
/public_html/images/            → 755
/public_html/.htaccess          → 644
/public_html/editor/.htaccess   → 644
```

**Quick Commands (via SSH if available):**
```bash
cd /home/[username]/public_html
chmod 755 editor
chmod -R 755 editor/database
chmod -R 755 editor/backups
chmod -R 755 editor/logs
chmod 755 images
chmod 644 .htaccess
chmod 644 editor/.htaccess
```

### Step 2: Update Editor Configuration

1. **Navigate to:** `/public_html/editor/includes/config.php`

2. **Change Default Credentials:**
   ```php
   define('EDITOR_USERNAME', 'your_username'); // Change this!
   define('EDITOR_PASSWORD', '$2y$10$...'); // Change this!
   ```

3. **Generate Password Hash:**
   - Create a file `hash.php` in your root:
   ```php
   <?php
   echo password_hash('your_new_password', PASSWORD_DEFAULT);
   ?>
   ```
   - Visit: `https://yourdomain.com/hash.php`
   - Copy the hash
   - Update config.php
   - Delete hash.php

### Step 3: Upload Your Images

Your `images/` folder is currently empty. Upload your images:

1. **Via Editor:**
   - Go to `https://yourdomain.com/editor/`
   - Log in
   - Click "Media" tab
   - Upload your images

2. **Via cPanel File Manager:**
   - Navigate to `/public_html/images/`
   - Click "Upload"
   - Select your image files
   - Upload

3. **Via FTP:**
   - Connect to your FTP
   - Navigate to `/public_html/images/`
   - Upload your image files

### Step 4: Test the Editor

1. **Access the Editor:**
   ```
   https://yourdomain.com/editor/
   ```

2. **Login:**
   - Username: (your configured username)
   - Password: (your configured password)

3. **Test Features:**
   - Select a page
   - Click an element
   - Make a change
   - Save the page
   - Preview in new tab

### Step 5: Update Website Content

1. **Homepage:** Edit `index.html`
2. **About Page:** Edit `about-pages/about-v1.html`
3. **Services:** Edit `services.html`
4. **Blog:** Edit `blog.html`
5. **Contact:** Edit `contact-pages/contact-v2.html`
6. **Portfolio:** Edit project files in `project/` folder

---

## 🔒 Security Checklist

- [ ] Changed default editor username
- [ ] Changed default editor password
- [ ] Deleted `hash.php` if created
- [ ] Set correct file permissions
- [ ] Verified `.htaccess` files are active
- [ ] Tested editor login
- [ ] Tested page editing and saving
- [ ] Tested media upload

---

## 🌐 SSL Certificate (HTTPS)

### Enable SSL in Bluehost:

1. **Log into cPanel**
2. **Navigate to "SSL/TLS Status"**
3. **Select your domain**
4. **Click "Run AutoSSL"**
5. **Wait for certificate installation**

### Enable HTTPS Redirect:

After SSL is active, uncomment these lines in `.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

## 📊 PHP Configuration

If you need to adjust PHP settings:

1. **In cPanel:**
   - Navigate to "MultiPHP INI Editor"
   - Select your domain
   - Adjust settings:
     - `upload_max_filesize`: 10M
     - `post_max_size`: 10M
     - `max_execution_time`: 300
     - `memory_limit`: 128M

2. **Via php.ini (if available):**
   ```ini
   upload_max_filesize = 10M
   post_max_size = 10M
   max_execution_time = 300
   memory_limit = 128M
   ```

---

## 🐛 Troubleshooting

### Editor Login Issues

**Problem:** Can't log in to editor

**Solution:**
1. Verify username/password in `config.php`
2. Check file permissions on `editor/` directory
3. Clear browser cookies
4. Try incognito/private browsing mode

### Can't Upload Images

**Problem:** Image upload fails

**Solution:**
1. Check `images/` folder permissions (should be 755)
2. Verify PHP upload limits
3. Check available disk space
4. Try smaller file sizes

### Changes Not Saving

**Problem:** Editor changes don't save

**Solution:**
1. Check `editor/database/` permissions (should be 755)
2. Verify PHP has write access
3. Check error logs in cPanel
4. Clear browser cache

### White Screen / 500 Error

**Problem:** Website shows blank page or error

**Solution:**
1. Check `.htaccess` syntax
2. Review PHP error logs in cPanel
3. Verify file permissions
4. Check PHP version (needs 7.0+)

### Editor Not Loading

**Problem:** Editor interface doesn't appear

**Solution:**
1. Clear browser cache
2. Check browser console for JavaScript errors
3. Verify all files uploaded correctly
4. Check file paths are correct

---

## 📱 Testing Checklist

After installation, test:

- [ ] Homepage loads correctly
- [ ] All pages load without errors
- [ ] Images display (after uploading)
- [ ] Editor login works
- [ ] Can edit page content
- [ ] Can save changes
- [ ] Can upload media
- [ ] Mobile responsive works
- [ ] Forms work (if applicable)
- [ ] All links work

---

## 🔄 Updating

To update your website:

### Via Git:
```bash
cd /home/[username]/repositories/nfxmwebsite
git pull origin main
# Deploy via cPanel Git interface
```

### Via FTP:
1. Backup current files
2. Upload new files
3. Overwrite when prompted
4. Keep config.php unchanged

---

## 💾 Backup Recommendations

1. **Database:**
   - Editor creates automatic backups in `editor/backups/`
   - Download backups regularly via FTP

2. **Files:**
   - Use cPanel Backup Wizard
   - Schedule automatic backups
   - Store backups off-server

3. **Images:**
   - Keep original copies locally
   - Backup `images/` folder regularly

---

## 🆘 Getting Help

### Check Logs:

1. **PHP Error Log:**
   - cPanel → Error Log

2. **Editor Activity Log:**
   - `/editor/logs/activity.log`

3. **Apache Error Log:**
   - cPanel → Errors (latest errors)

### Common Resources:

- Bluehost Support: https://www.bluehost.com/help
- Editor Documentation: `/EDITOR_README.md`
- cPanel Guide: https://docs.cpanel.net/

---

## ✅ Installation Complete!

Once everything is set up:

1. **Visit your website:** `https://yourdomain.com`
2. **Access the editor:** `https://yourdomain.com/editor/`
3. **Start editing!**

---

## 🎨 Next Steps

1. Upload all your images to the media library
2. Customize each page with your content
3. Update colors and branding
4. Test on different devices
5. Set up contact forms
6. Configure email forwarding
7. Submit to search engines
8. Set up Google Analytics (optional)

---

**Congratulations! Your Neofox Media website is now live! 🎉**

Need help? Check the documentation or contact your administrator.
