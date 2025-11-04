# 🦊 Neofox Media - Website with Visual Editor

**Full-Stack Creative & Growth Agency Website**

A professional, fully-featured website with an advanced visual editor similar to Elementor - designed for non-technical users.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/nfxmwebsite)
[![PHP](https://img.shields.io/badge/PHP-7.0+-purple.svg)](https://php.net)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

---

## 🌟 Features

### 🎨 Visual Editor
- **Drag & Drop Interface** - Add elements without coding
- **Live Preview** - See changes in real-time
- **20+ Element Types** - Headers, images, videos, buttons, forms, and more
- **Pre-built Blocks** - Hero sections, portfolios, testimonials, etc.
- **Responsive Design** - Preview on desktop, tablet, and mobile
- **Click to Edit** - Double-click text for inline editing

### ✨ Advanced Animations
- **15+ Entrance Animations** - Fade, zoom, slide, bounce, rotate, flip
- **10+ Hover Effects** - Pulse, shake, grow, float, glow
- **Customizable Timing** - Control duration and delay
- **Scroll Reveal** - Trigger animations on scroll

### 🎨 Style Editor
- **Typography Controls** - Fonts, sizes, weights, colors
- **Spacing System** - Margin and padding controls
- **Background Options** - Colors, gradients, images, videos
- **Border & Shadow** - Complete border and shadow controls
- **Visual Effects** - Opacity, blur, brightness, contrast, filters
- **Transform Tools** - Rotate, scale, and position

### 📸 Media Management
- **Easy Upload** - Drag & drop images and videos
- **Media Library** - Browse and manage all assets
- **Auto Thumbnails** - Automatic thumbnail generation
- **Image Optimization** - Built-in compression
- **Supported Formats** - JPG, PNG, GIF, WebP, SVG, MP4, WebM, OGG

### 💾 History & Backups
- **Undo/Redo** - Up to 50 steps
- **Auto-Save** - Every 60 seconds
- **Auto-Backup** - Keeps last 10 versions
- **Revision History** - Track all changes

### 🔐 Security
- **User Authentication** - Secure login system
- **Password Hashing** - Bcrypt encryption
- **Protected Files** - Config and database protection
- **Session Management** - Secure session handling
- **Activity Logging** - Track all changes

---

## 📋 Requirements

- **Hosting:** Shared hosting (Bluehost compatible)
- **PHP:** 7.0 or higher
- **Database:** SQLite (no MySQL required)
- **Extensions:** GD (for image processing)
- **Web Server:** Apache with mod_rewrite

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/nfxmwebsite.git
cd nfxmwebsite
```

### 2. Deploy to Server

**Option A: Git Deployment (cPanel)**
- Use Git Version Control in cPanel
- Configure `.cpanel.yml` with your path
- Deploy with one click

**Option B: FTP Upload**
- Upload all files to `/public_html/`
- Include `.htaccess` files

**Option C: File Manager**
- Upload ZIP to cPanel
- Extract in `/public_html/`

### 3. Set Permissions

```bash
chmod 755 editor/
chmod -R 755 editor/database/
chmod -R 755 editor/backups/
chmod -R 755 editor/logs/
chmod 755 images/
```

### 4. Configure Editor

Edit `editor/includes/config.php`:

```php
// Change these!
define('EDITOR_USERNAME', 'your_username');
define('EDITOR_PASSWORD', 'your_password_hash');
```

Generate password hash:
```php
<?php
echo password_hash('your_password', PASSWORD_DEFAULT);
?>
```

### 5. Access Editor

Navigate to: `https://yourdomain.com/editor/`

Default login: `admin` / `password`

**⚠️ CHANGE IMMEDIATELY!**

---

## 📁 Project Structure

```
nfxmwebsite/
├── editor/                     # Visual Editor
│   ├── assets/
│   │   ├── css/
│   │   │   └── editor.css     # Editor styles
│   │   ├── js/
│   │   │   ├── editor-core.js
│   │   │   ├── editor-animations.js
│   │   │   ├── editor-media.js
│   │   │   ├── editor-elements.js
│   │   │   └── editor-history.js
│   │   └── img/               # Block thumbnails
│   ├── includes/
│   │   ├── config.php         # Configuration
│   │   └── functions.php      # Helper functions
│   ├── database/              # SQLite database (auto-created)
│   ├── backups/               # Auto backups (auto-created)
│   ├── logs/                  # Activity logs (auto-created)
│   ├── index.php              # Main editor
│   ├── login.php              # Login page
│   ├── logout.php             # Logout handler
│   ├── settings.php           # Settings panel
│   ├── api.php                # API endpoints
│   └── .htaccess              # Security rules
├── images/                    # Website images
├── css/                       # Website styles
├── js/                        # Website scripts
├── about-pages/               # About pages
├── contact-pages/             # Contact pages
├── home-pages/                # Home variations
├── works-pages/               # Portfolio pages
├── product/                   # Product pages
├── project/                   # Project case studies
├── post/                      # Blog posts
├── legal/                     # Legal pages
├── index.html                 # Homepage
├── blog.html                  # Blog page
├── services.html              # Services page
├── plans.html                 # Plans/Pricing
├── checkout.html              # Checkout page
├── .htaccess                  # Apache config
├── .cpanel.yml                # cPanel deployment
├── README.md                  # This file
├── INSTALLATION.md            # Installation guide
└── EDITOR_README.md           # Editor documentation
```

---

## 📖 Documentation

- **[Installation Guide](INSTALLATION.md)** - Detailed setup instructions
- **[Editor Documentation](EDITOR_README.md)** - Complete editor guide
- **[Troubleshooting](#troubleshooting)** - Common issues and solutions

---

## 🎯 Usage

### Editing Pages

1. **Login to Editor**
   ```
   https://yourdomain.com/editor/
   ```

2. **Select Page**
   - Choose from dropdown in top bar

3. **Edit Content**
   - Click any element
   - Edit in right panel
   - Double-click text to edit inline

4. **Add Elements**
   - Drag from left panel
   - Drop on page
   - Customize styles

5. **Save Changes**
   - Press `Ctrl+S`
   - Or click Save button

### Managing Media

1. **Upload Images**
   - Click Media tab
   - Drag & drop files
   - Or click to browse

2. **Insert Media**
   - Select element
   - Click media item
   - Or use content panel

3. **Optimize Images**
   - Go to Settings
   - Click "Optimize Images"

### Adding Animations

1. **Select Element**
2. **Go to Advanced Tab**
3. **Choose Entrance Animation**
4. **Set Duration & Delay**
5. **Choose Hover Effect**
6. **Save Changes**

---

## 🎨 Customization

### Changing Colors

Edit elements via the Style tab:
- Text color
- Background color
- Border color

### Adding Custom CSS

1. Select element
2. Go to Advanced tab
3. Add CSS in Custom CSS box
4. Save changes

### Modifying Fonts

Available fonts:
- Syne
- Inter Tight
- DM Mono
- Bebas Neue
- Rowdies

Change in Style tab → Typography

---

## 🔧 Configuration

### Editor Settings (`editor/includes/config.php`)

```php
// Authentication
define('EDITOR_USERNAME', 'admin');
define('EDITOR_PASSWORD', 'hash');

// Upload limits
define('MAX_UPLOAD_SIZE', 10 * 1024 * 1024); // 10MB

// Backups
define('AUTO_BACKUP', true);
define('BACKUP_LIMIT', 10);

// History
define('ENABLE_HISTORY', true);
define('HISTORY_LIMIT', 50);

// Theme
define('EDITOR_THEME', 'dark'); // or 'light'
```

### PHP Requirements

Minimum versions:
- PHP: 7.0+
- GD Extension: Enabled
- SQLite: Enabled
- File Uploads: Enabled

---

## 🐛 Troubleshooting

### Common Issues

**Can't Login**
- Check credentials in config.php
- Clear browser cookies
- Verify file permissions

**Upload Fails**
- Check PHP upload_max_filesize
- Verify images/ folder permissions (755)
- Check available disk space

**Changes Not Saving**
- Check database/ folder permissions (755)
- Verify PHP write access
- Check error logs

**White Screen**
- Check .htaccess syntax
- Review PHP error logs
- Verify PHP version
- Check file permissions

---

## 🔐 Security

### Best Practices

1. **Change Default Credentials**
   - Never use admin/password

2. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols

3. **Regular Backups**
   - Download backups weekly
   - Store off-server

4. **Keep Updated**
   - Monitor for updates
   - Keep PHP updated

5. **SSL Certificate**
   - Enable HTTPS
   - Use SSL redirect

6. **File Permissions**
   - Follow recommended settings
   - Don't use 777

---

## 📊 Performance

### Optimization Tips

1. **Images**
   - Use WebP format
   - Compress before upload
   - Use appropriate sizes

2. **Caching**
   - .htaccess includes cache headers
   - Use browser caching

3. **Minification**
   - CSS/JS are minified
   - HTML can be minified

4. **CDN (Optional)**
   - Use for large media files
   - Faster global delivery

---

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## 📝 Changelog

### Version 1.0.0 (2024-11-04)

**Initial Release**
- ✅ Visual drag & drop editor
- ✅ 20+ element types
- ✅ 15+ entrance animations
- ✅ 10+ hover effects
- ✅ Media management system
- ✅ Undo/Redo functionality
- ✅ Auto-save & backups
- ✅ Responsive preview
- ✅ Style editor
- ✅ Custom CSS support
- ✅ User authentication
- ✅ Settings panel
- ✅ Complete documentation

---

## 🤝 Support

For issues or questions:
1. Check [EDITOR_README.md](EDITOR_README.md)
2. Review [INSTALLATION.md](INSTALLATION.md)
3. Check error logs
4. Contact administrator

---

## 📄 License

Proprietary - All Rights Reserved

This software is licensed for use by Neofox Media only.

---

## 🎉 Credits

**Built for:** Neofox Media
**Version:** 1.0.0
**Created:** November 2024

**Technologies:**
- PHP 7.0+
- SQLite
- jQuery 3.6
- Font Awesome 6.4
- Spectrum Color Picker
- SortableJS

---

## 🚀 Getting Started Checklist

- [ ] Deploy to hosting
- [ ] Set file permissions
- [ ] Change default credentials
- [ ] Upload website images
- [ ] Test editor login
- [ ] Edit homepage
- [ ] Test on mobile
- [ ] Enable SSL
- [ ] Set up backups
- [ ] Go live!

---

**Ready to build something amazing? Start editing now! 🎨**

For detailed instructions, see [INSTALLATION.md](INSTALLATION.md)

---

Made with ❤️ for Neofox Media
