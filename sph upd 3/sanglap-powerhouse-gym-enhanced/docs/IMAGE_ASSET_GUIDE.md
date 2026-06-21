# Sanglap Power House Gym - Image & Asset Placement Guide

## 🖼️ Image Requirements Overview

Your website requires exactly **2 images** to be placed in the `assets/images/` folder. Both are critical for the website to display correctly.

---

## 1. GYM BANNER IMAGE (Hero Section Background)

### File Details
- **Filename:** `gym-banner.jpg`
- **Location:** `assets/images/gym-banner.jpg`
- **Format:** JPG (JPEG)
- **Purpose:** Hero section background image
- **Display Location:** Full-screen banner at top of website

### Specifications

| Property | Value |
|----------|-------|
| **Recommended Width** | 1920px |
| **Recommended Height** | 1080px |
| **Aspect Ratio** | 16:9 |
| **File Size** | Max 300-400 KB |
| **Format** | JPG/JPEG |
| **Quality** | 75-85% (balanced) |

### What This Image Should Show
- **Primary:** Modern gym facility with equipment
- **Secondary:** Multiple workout areas or floor views
- **Tertiary:** Professional gym environment
- **Include:** Equipment, lighting, and member activity (optional)
- **Avoid:** Blurry, low-quality, or dark images

### Recommended Images from Your Uploads
- **Use:** Image 1 (IMG-20260609-WA0046.jpg) - Shows multiple gym sections with great lighting
- **Why:** Perfect 16:9 aspect, professional layout, shows multiple areas

### Image Usage in HTML
```html
<img src="assets/images/gym-banner.jpg" alt="Sanglap Power House Gym - State of the Art Facilities" class="hero-bg">
```

### CSS Styling Applied
```css
.hero-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}
```

### How It Appears
- Full-screen background behind hero text
- Dark overlay applied on top for text readability
- "SANGLAP POWER HOUSE GYM" title overlaid
- "JOIN NOW" button displayed on top

---

## 2. GYM LOGO IMAGE (Navigation & Footer)

### File Details
- **Filename:** `gym-logo.png`
- **Location:** `assets/images/gym-logo.png`
- **Format:** PNG (transparent background)
- **Purpose:** Logo for navigation bar and footer
- **Display Locations:** 
  - Top left of navbar (50x50px)
  - Footer section (80x80px)

### Specifications

| Property | Value |
|----------|-------|
| **Recommended Width** | 200px |
| **Recommended Height** | 200px |
| **Aspect Ratio** | 1:1 (Square) |
| **File Size** | Max 100 KB |
| **Format** | PNG (Transparent BG) |
| **Background** | Transparent (Recommended) |

### What This Image Should Show
- **Primary:** Gym logo or emblem
- **Style:** Professional, bold, clean design
- **Colors:** Works well with orange background (primary color)
- **Scale:** Works at both 50px and 80px sizes
- **Background:** Transparent (PNG with transparency)

### Recommended Images from Your Uploads
- **Use:** Image 2 (IMG-20260609-WA0047.jpg) - SPH logo with lion head
- **Why:** Perfect gym branding, bold design, professional appearance
- **Note:** May need to be extracted/cropped from image

### Image Usage in HTML

#### Navbar
```html
<img src="assets/images/gym-logo.png" alt="Sanglap Power House Gym Logo" class="logo-img">
```

#### Footer
```html
<img src="assets/images/gym-logo.png" alt="Sanglap Power House Gym Logo" class="footer-logo">
```

### CSS Styling Applied

#### Navbar Logo
```css
.logo-img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
    background-color: var(--color-primary);  /* Orange background */
    padding: 5px;
}
```

#### Footer Logo
```css
.footer-logo {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
    background-color: var(--color-primary);  /* Orange background */
    padding: 5px;
}
```

### How It Appears
- Navbar: Small square logo (50x50px) with orange background
- Footer: Larger square logo (80x80px) with orange background
- Both have slight border-radius for modern look
- Orange fallback background if image doesn't load

---

## 📋 Image File Checklist

### Before Adding Images
- [ ] Gym banner image is 1920x1080px (or larger, 16:9 aspect)
- [ ] Gym banner is JPG/JPEG format
- [ ] Gym banner file size is reasonable (< 400 KB)
- [ ] Gym logo is 200x200px (square)
- [ ] Gym logo is PNG format
- [ ] Gym logo has transparent background
- [ ] Gym logo file size is < 100 KB
- [ ] Both files have correct names
- [ ] Both files are in `assets/images/` folder

### File Paths (Exact)
```
project-root/
├── assets/
│   └── images/
│       ├── gym-banner.jpg          ← Hero section background
│       └── gym-logo.png            ← Navbar & footer logo
```

---

## 🛠️ How to Prepare Images

### For Gym Banner (JPG)

1. **Select High-Quality Photo**
   - Use the multi-section gym photo from your uploads
   - Ensure good lighting and clarity
   - Show professional gym environment

2. **Resize to 1920x1080px**
   - Use Photoshop, GIMP, or online tools (Canva, Pixlr)
   - Maintain 16:9 aspect ratio
   - Center important elements

3. **Optimize File Size**
   - Export as JPG with 75-85% quality
   - Use online compressor (TinyPNG, ImageOptim)
   - Target: 200-300 KB final size

4. **Save as `gym-banner.jpg`**
   - Place in `assets/images/` folder
   - Verify file path and name are exact

### For Gym Logo (PNG)

1. **Select Logo Design**
   - Use the SPH logo with lion head from your uploads
   - Should be bold and recognizable
   - Professional appearance preferred

2. **Prepare as Square (200x200px)**
   - Crop or resize to square format
   - Center the logo within the square
   - Use graphic design software (Photoshop, Illustrator, or Canva)

3. **Remove Background**
   - Make background transparent (PNG)
   - Use "Remove Background" tools or manual editing
   - Save as PNG with transparency

4. **Optimize File Size**
   - PNG compression (use online tools)
   - Target: < 100 KB file size
   - Verify transparency is maintained

5. **Save as `gym-logo.png`**
   - Place in `assets/images/` folder
   - Verify file path and name are exact

---

## 🎨 Image Quality Guidelines

### Gym Banner Quality Checklist
✅ **Resolution:** 1920x1080px minimum
✅ **Format:** JPG/JPEG
✅ **Lighting:** Bright, well-lit gym environment
✅ **Composition:** Shows gym facilities/equipment
✅ **Colors:** Vibrant, professional appearance
✅ **File Size:** 200-400 KB
✅ **Aspect Ratio:** 16:9 (widescreen)

### Gym Logo Quality Checklist
✅ **Resolution:** 200x200px
✅ **Format:** PNG with transparent background
✅ **Shape:** Square (1:1 aspect ratio)
✅ **Design:** Bold, professional, memorable
✅ **Colors:** Works with orange background
✅ **File Size:** < 100 KB
✅ **Scalability:** Looks good at 50px and 80px

---

## 🖥️ Online Tools for Image Editing

### Image Resizing
- **Canva.com** - Drag & drop, templates
- **Pixlr.com** - Browser-based editor
- **Photopea.com** - Photoshop alternative
- **ImageResize.org** - Quick resize tool

### Image Compression
- **TinyPNG.com** - PNG & JPG compression
- **ImageOptim.com** - Image optimization
- **Compressor.io** - Format conversion & compression
- **Kraken.io** - Advanced compression

### Background Removal (For Logo)
- **Remove.bg** - Automatic background removal
- **Photoshop** - Manual selection & removal
- **Pixlr** - Free alternative to Photoshop
- **Canva** - Built-in background removal

---

## 🎯 Image Display Verification

### How to Check Images are Working

1. **After Adding Images:**
   - Refresh browser (F5 or Cmd+R)
   - Clear browser cache (Ctrl+Shift+Delete)
   - Open DevTools (F12) and check console for errors

2. **Verify in Browser:**
   - Hero banner displays full-width at page top
   - Logo appears in navbar (top left)
   - Logo appears in footer (bottom left)
   - No broken image icons
   - Images display with correct aspect ratio

3. **Test Responsive:**
   - Resize browser window (drag edge)
   - Check logo on mobile (hamburger menu visible)
   - Verify banner scales properly
   - Test on actual mobile device if possible

### Troubleshooting

**Problem: Images not displaying**
- Solution: Verify file names are exactly `gym-banner.jpg` and `gym-logo.png`
- Check path is exactly `assets/images/` folder
- Verify files are in correct folder
- Hard refresh browser (Ctrl+F5)

**Problem: Wrong image appears**
- Solution: Verify you're using correct source image
- Check file format is correct (JPG for banner, PNG for logo)
- Ensure files are not corrupted

**Problem: Image looks distorted**
- Solution: Check aspect ratios (16:9 for banner, 1:1 for logo)
- Verify original image resolution is sufficient
- May need to recrop or resize

**Problem: File size is too large**
- Solution: Use compression tools (TinyPNG, Kraken.io)
- Reduce JPG quality to 75-80%
- Remove unnecessary metadata
- Ensure correct format (JPG not PNG for photos)

---

## 📊 Image Asset Summary Table

| Asset | Type | Size | Format | Location |
|-------|------|------|--------|----------|
| **Gym Banner** | Hero Background | 1920x1080px | JPG | `assets/images/gym-banner.jpg` |
| **Gym Logo** | Navigation/Footer | 200x200px | PNG | `assets/images/gym-logo.png` |

---

## 🔄 HTML Image Tags

### Banner (In HTML)
```html
<img src="assets/images/gym-banner.jpg" 
     alt="Sanglap Power House Gym - State of the Art Facilities" 
     class="hero-bg">
```

### Logo - Navbar (In HTML)
```html
<img src="assets/images/gym-logo.png" 
     alt="Sanglap Power House Gym Logo" 
     class="logo-img">
```

### Logo - Footer (In HTML)
```html
<img src="assets/images/gym-logo.png" 
     alt="Sanglap Power House Gym Logo" 
     class="footer-logo">
```

---

## ✨ Advanced Image Tips

### Responsive Images (Optional Enhancement)
```html
<img srcset="assets/images/gym-banner-small.jpg 768w,
             assets/images/gym-banner.jpg 1920w"
     sizes="(max-width: 768px) 100vw, 100vw"
     src="assets/images/gym-banner.jpg"
     alt="Sanglap Power House Gym - State of the Art Facilities" 
     class="hero-bg">
```

### Picture Element (Advanced)
```html
<picture>
    <source media="(max-width: 768px)" 
            srcset="assets/images/gym-banner-mobile.jpg">
    <img src="assets/images/gym-banner.jpg" 
         alt="Sanglap Power House Gym - State of the Art Facilities" 
         class="hero-bg">
</picture>
```

### Lazy Loading (Performance)
```html
<img src="assets/images/gym-banner.jpg" 
     alt="Sanglap Power House Gym - State of the Art Facilities" 
     class="hero-bg"
     loading="lazy">
```

---

## 🎬 Image Display Locations

### Gym Banner (gym-banner.jpg)
**Display:** Hero Section (Full Screen)
**Size on Screen:** 100% width × 100% height
**Location in Code:** Line ~43 in index.html
**CSS:** `.hero-bg` styling
**Visibility:** Main page hero section

### Gym Logo (gym-logo.png)
**Display #1:** Navigation Bar (Top Left)
**Size on Screen:** 50px × 50px
**Location in Code:** Line ~50 in index.html
**CSS:** `.logo-img` styling
**Visibility:** Always visible (sticky nav)

**Display #2:** Footer
**Size on Screen:** 80px × 80px
**Location in Code:** Line ~342 in index.html
**CSS:** `.footer-logo` styling
**Visibility:** Bottom of page

---

## ✅ Final Checklist

Before launching your website:

- [ ] `gym-banner.jpg` added to `assets/images/`
- [ ] `gym-logo.png` added to `assets/images/`
- [ ] Both files have correct names (exact spelling)
- [ ] Both files are in correct folder
- [ ] Banner image is 1920x1080px or larger
- [ ] Logo image is 200x200px square
- [ ] Banner is JPG format
- [ ] Logo is PNG format with transparency
- [ ] Images display correctly in browser
- [ ] Images display correctly on mobile
- [ ] No broken image icons appear
- [ ] File sizes are optimized
- [ ] Images have good quality
- [ ] Page loads quickly with images

---

**Image Guide Complete! Your gym website is ready to shine. 🌟**
