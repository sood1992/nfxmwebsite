# 🎨 Neofox Media Visual Editor

**Advanced Visual Page Builder v1.0.0**

Welcome to your powerful, intuitive visual editor! This professional-grade page builder lets you create stunning websites without any coding knowledge.

---

## 🚀 Quick Start

### First Time Setup

1. **Access the Editor**
   - Navigate to `/editor/` in your browser
   - Default login: `admin` / `password`
   - ⚠️ **IMPORTANT**: Change these credentials immediately!

2. **Change Default Credentials**
   - Open `editor/includes/config.php`
   - Generate a new password hash:
     ```php
     <?php
     echo password_hash('your_new_password', PASSWORD_DEFAULT);
     ?>
     ```
   - Update `EDITOR_USERNAME` and `EDITOR_PASSWORD`

3. **Upload Images**
   - Your images folder is currently empty
   - Use the Media tab to upload your images and videos
   - Drag & drop support for easy uploads

---

## 📖 User Guide

### Interface Overview

The editor consists of three main areas:

#### 1. **Left Sidebar - Elements & Blocks**
   - **Elements Tab**: Individual components (heading, text, image, video, button, etc.)
   - **Blocks Tab**: Pre-built sections (hero, about, services, portfolio, etc.)
   - **Media Tab**: Upload and manage images/videos

#### 2. **Center Canvas - Preview Area**
   - Live preview of your page
   - Click elements to select
   - Double-click text to edit inline
   - Device preview buttons (Desktop, Tablet, Mobile)

#### 3. **Right Sidebar - Properties & Styles**
   - **Content Tab**: Edit element content
   - **Style Tab**: Typography, colors, spacing, borders
   - **Advanced Tab**: Animations, effects, custom CSS

---

## 🎯 Features

### 🎨 Visual Editing
- ✅ Click any element to edit
- ✅ Double-click text for inline editing
- ✅ Drag & drop new elements
- ✅ Real-time preview
- ✅ Responsive design preview (Desktop/Tablet/Mobile)

### 🎭 Animations & Effects
**Entrance Animations:**
- Fade In, Fade In Up/Down/Left/Right
- Zoom In/Out
- Slide In Up/Down/Left/Right
- Bounce In, Rotate In
- Flip In X/Y

**Hover Effects:**
- Pulse, Bounce, Shake
- Swing, Wobble
- Grow, Shrink
- Float, Sink, Glow

**Visual Effects:**
- Opacity control
- Blur effects
- Brightness/Contrast
- Saturation
- Hue rotation
- Rotation & scaling

### 📦 Elements Library

**Basic Elements:**
- Heading (H1-H6)
- Text/Paragraph
- Image
- Video
- Button
- Divider
- Spacer

**Layout Elements:**
- Section
- Container
- Columns (2-col grid)
- Grid (3-col grid)

**Interactive Elements:**
- Tabs
- Accordion
- Slider/Carousel
- Image Gallery
- Video Carousel

**Advanced Elements:**
- Contact Forms
- Icon Library (Font Awesome)
- Social Media Icons
- Embed Code
- Countdown Timer

### 🎨 Style Controls

**Typography:**
- Font family selection
- Font size (px, rem, em, %)
- Font weight (300-800)
- Text color
- Text alignment
- Line height & letter spacing

**Layout:**
- Margin (top, right, bottom, left)
- Padding (top, right, bottom, left)
- Display properties
- Position controls

**Background:**
- Solid colors
- Gradients (linear/radial)
- Background images
- Background videos
- Multiple color stops

**Border & Effects:**
- Border width, style, color
- Border radius
- Box shadows
- Text shadows
- Filters & effects

### 📸 Media Management
- Drag & drop upload
- Image optimization
- Thumbnail generation
- Video support (MP4, WebM, OGG)
- Image formats (JPG, PNG, GIF, WebP, SVG)
- Media library with preview
- Easy media insertion

### 💾 Save & History
- Manual save (Ctrl+S)
- Auto-save every 60 seconds
- Undo/Redo (up to 50 steps)
- Automatic backups (keeps last 10)
- Revision history

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` / `Cmd+S` | Save page |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Escape` | Deselect element |
| `Delete` | Delete selected element |
| `Double-click` | Edit text inline |

---

## 🔧 Advanced Configuration

### Config File (`editor/includes/config.php`)

```php
// Change login credentials
define('EDITOR_USERNAME', 'your_username');
define('EDITOR_PASSWORD', 'your_password_hash');

// Upload limits
define('MAX_UPLOAD_SIZE', 10 * 1024 * 1024); // 10MB

// Backup settings
define('AUTO_BACKUP', true);
define('BACKUP_LIMIT', 10); // Keep last 10 backups

// History settings
define('ENABLE_HISTORY', true);
define('HISTORY_LIMIT', 50); // Undo/Redo limit
```

### Supported File Types

**Images:**
- JPG/JPEG
- PNG
- GIF
- WebP
- SVG

**Videos:**
- MP4
- WebM
- OGG
- MOV

---

## 🎓 How-To Guides

### How to Change Page Content

1. Select a page from the dropdown in the top bar
2. Click on any element you want to edit
3. Use the right sidebar to modify:
   - **Content Tab**: Change text, links, images
   - **Style Tab**: Adjust colors, fonts, spacing
   - **Advanced Tab**: Add animations and effects
4. Press `Ctrl+S` to save

### How to Add New Elements

1. Click the **Elements** tab in the left sidebar
2. Find the element you want (e.g., Heading, Image, Button)
3. Drag it to where you want it on the page
4. Drop it in the desired location
5. Customize using the right sidebar
6. Save your changes

### How to Upload Images/Videos

1. Click the **Media** tab in the left sidebar
2. Click "Upload Media" or drag files into the upload zone
3. Select multiple files if needed
4. Wait for upload to complete
5. Click any media item to insert it into selected element

### How to Add Animations

1. Select an element on the page
2. Click the **Advanced** tab in the right sidebar
3. Choose an **Entrance Animation** (how it appears)
4. Set **Animation Duration** (how long it takes)
5. Set **Animation Delay** (when it starts)
6. Choose a **Hover Animation** (on mouse hover)
7. Save your changes

### How to Change Colors

1. Select an element
2. Go to the **Style** tab
3. Click on color input fields
4. Use the color picker to choose a color
5. Or enter a hex color code (e.g., #667eea)
6. The color updates in real-time

### How to Make Responsive Designs

1. Use the device selector in the top bar
2. Click Desktop, Tablet, or Mobile icons
3. Preview how your page looks on different screens
4. Note: Adjustments affect all screen sizes

### How to Restore Backups

1. Go to Settings (gear icon in top bar)
2. Scroll to the Statistics section
3. View available backups
4. Or manually access `/editor/backups/` folder via FTP

---

## 🐛 Troubleshooting

### Editor Won't Load
- Check that all files are uploaded correctly
- Verify PHP version is 7.0 or higher
- Check browser console for JavaScript errors
- Clear browser cache and reload

### Can't Upload Images
- Check file size (default limit: 10MB)
- Verify `/images/` folder has write permissions (755 or 777)
- Check PHP `upload_max_filesize` in php.ini
- Supported formats: JPG, PNG, GIF, WebP, SVG

### Changes Not Saving
- Check `/editor/database/` folder has write permissions
- Verify disk space is available
- Check PHP error logs
- Try manual save (Ctrl+S) instead of auto-save

### Page Looks Different After Save
- Clear browser cache
- Check for CSS conflicts
- Verify all media files are uploaded
- Use browser DevTools to inspect elements

### Login Issues
- Verify credentials in `config.php`
- Check session settings in PHP
- Clear browser cookies
- Regenerate password hash if needed

---

## 🔒 Security Best Practices

1. **Change Default Credentials**
   - Never use default username/password
   - Use strong, unique passwords

2. **Protect Editor Directory**
   - Add additional .htaccess protection if needed
   - Consider IP whitelisting for production

3. **Regular Backups**
   - Enable auto-backup in config
   - Download backups regularly
   - Store backups securely off-server

4. **Update Regularly**
   - Keep PHP updated
   - Monitor security advisories

5. **Limit File Uploads**
   - Set reasonable size limits
   - Validate file types
   - Scan uploads for malware

---

## 🎯 Performance Tips

1. **Optimize Images**
   - Use the built-in image optimizer
   - Upload appropriately sized images
   - Use WebP format when possible

2. **Minimize Animations**
   - Don't overuse animations
   - Keep animation durations reasonable
   - Test on slower devices

3. **Clean Up Media Library**
   - Delete unused images/videos
   - Compress files before uploading
   - Use external CDN for large media

4. **Regular Maintenance**
   - Clear old backups
   - Optimize database periodically
   - Monitor disk usage

---

## 📱 Browser Support

**Fully Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Partial Support:**
- Older browsers may have limited functionality
- Internet Explorer is not supported

---

## 🆘 Support & Resources

### Need Help?
- Check this documentation first
- Review browser console for errors
- Check PHP error logs
- Test in different browsers

### Reporting Issues
If you encounter bugs:
1. Note the steps to reproduce
2. Check browser console for errors
3. Document your environment (PHP version, browser, etc.)
4. Check if issue occurs in different browsers

---

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Visual drag & drop editor
- ✅ 20+ element types
- ✅ 15+ entrance animations
- ✅ 10+ hover effects
- ✅ Media upload & management
- ✅ Undo/Redo functionality
- ✅ Auto-save & backups
- ✅ Responsive preview
- ✅ Style editor
- ✅ Custom CSS support
- ✅ User authentication
- ✅ Settings panel

---

## 🎉 Getting Started Checklist

- [ ] Change default login credentials
- [ ] Upload your website images to Media library
- [ ] Test editing a page
- [ ] Try adding new elements
- [ ] Experiment with animations
- [ ] Customize colors and fonts
- [ ] Test on different devices
- [ ] Save and preview changes
- [ ] Set up regular backups
- [ ] Read full documentation

---

## 💡 Pro Tips

1. **Use Sections Wisely**: Group related content in sections for better organization
2. **Consistent Spacing**: Use the same padding/margin values for a cohesive look
3. **Color Palette**: Stick to 2-3 main colors for a professional appearance
4. **Animation Restraint**: Less is more - don't animate everything
5. **Mobile First**: Always check mobile view before finalizing
6. **Regular Saves**: Save frequently, don't rely solely on auto-save
7. **Test Everything**: Preview in actual browsers, not just the editor
8. **Backup Before Major Changes**: Create manual backups before big updates

---

## 🚀 What's Next?

Now that you have the visual editor:

1. **Customize Your Site**: Update all pages with your content
2. **Add Your Branding**: Upload logos, change colors to match your brand
3. **Optimize Media**: Compress and optimize all images
4. **Test Thoroughly**: Check all pages on different devices
5. **Go Live**: Deploy to your Bluehost shared hosting

---

## 📄 License & Credits

**Neofox Media Visual Editor**
- Version: 1.0.0
- Created for: Neofox Media
- Hosting: Bluehost Shared Hosting

**Technologies Used:**
- PHP 7.0+
- SQLite Database
- jQuery 3.6
- Font Awesome 6.4
- Spectrum Color Picker
- SortableJS

---

**Need help? Remember:**
- 🔍 Check this documentation
- 💾 Save your work frequently
- 🧪 Test on different devices
- 📧 Keep backups updated

**Happy Editing! 🎨**
