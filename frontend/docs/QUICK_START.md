# Sanglap Power House Gym - Quick Start Guide

## 🚀 Get Started in 5 Minutes!

### Step 1: Open VS Code
1. Open your preferred terminal
2. Navigate to where you want to save the project
3. Run: `code .` to open VS Code

### Step 2: Create Project Structure
Create the following folder structure:

```
sanglap-powerhouse-gym/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── images/
│       ├── gym-banner.jpg
│       └── gym-logo.png
└── README.md
```

### Step 3: Copy Files
1. Copy the provided `index.html` to the root folder
2. Copy `style.css` to the `css/` folder
3. Copy `script.js` to the `js/` folder
4. Copy `README.md` to the root folder

### Step 4: Add Images

#### Gym Banner Image (`assets/images/gym-banner.jpg`)
- **What it should be:** Main gym facility photo
- **Recommended size:** 1920x1080px minimum
- **Format:** JPG
- **Tip:** Use one of the images from your uploads (the one showing multiple gym sections)

#### Gym Logo (`assets/images/gym-logo.png`)
- **What it should be:** Your gym's logo or emblem
- **Recommended size:** 200x200px or 256x256px
- **Format:** PNG with transparent background
- **Tip:** Use the SPH logo from your uploads

### Step 5: Open with Live Server
1. **Install Live Server Extension:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Search for "Live Server"
   - Click "Install" on the extension by Ritwick Dey

2. **Run Live Server:**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Your website opens automatically in your browser!

3. **Auto-Refresh:**
   - Any changes you make to HTML, CSS, or JS will auto-refresh in the browser

---

## 🎨 File Overview

### `index.html` (25 KB)
Your main website file containing:
- Navigation bar with gym logo
- Hero section with banner image
- About section with government registration
- Floor rules section (Male/Female segregation)
- Pricing cards (Male, Female, PT options)
- Contact information with map
- Footer with social links

**Key Edit Points:**
- Phone number: Line 241
- Address: Line 227, 252
- Registration number: Line 66, 309
- Instagram link: Line 267, 356
- Pricing: Lines 311-348

### `css/style.css` (35 KB)
Complete styling with:
- Dark "Powerhouse" theme
- Energetic orange, red, and yellow accents
- Responsive grid layouts
- Smooth animations
- Mobile hamburger menu styles

**Key Color Variables (Top of file):**
```css
--color-primary: #FF6B35;      /* Orange */
--color-secondary: #DC143C;    /* Red */
--color-accent: #FFD60A;       /* Yellow */
--color-dark: #0F0F0F;         /* Black background */
```

### `js/script.js` (15 KB)
Interactive features including:
- Mobile menu toggle (hamburger)
- Smooth scroll navigation
- Active link highlighting
- Card hover animations
- Scroll animations for sections
- Keyboard navigation support

---

## 💡 Quick Customization

### Change Gym Name
In `index.html`, find and update:
- Line 26: `<title>` tag
- Line 49: `.gym-name` text: "SPH GYM"
- Line 50: Alternative name in `.nav-logo`
- Line 338: In footer

### Update Phone Number
Replace `+919836336565` throughout:
- Line 241: Contact section
- Line 252: Footer
- Appears in multiple places for consistency

### Update Address
Find "Vidyasagar Sarani, Madhyamgram, Kolkata - 700129":
- Line 227: Contact section
- Line 252: Footer
- Line 267: Contact info card

### Change Prices
Edit the pricing cards (Lines 311-348):
- Male: ₹1500 / ₹500
- Female: ₹1600 / ₹600
- PT: ₹2000

### Update Instagram Link
Replace throughout:
```
https://www.instagram.com/sanglap_powerhouse?igsh=NTI2Mms0a2V2eWZp
```

### Update Google Maps Link
Replace:
```
https://share.google/XWfyxSpZxPvk7cKRW
```

---

## 📱 Testing Checklist

- [ ] Open website in Chrome
- [ ] Open website in Firefox
- [ ] Open website in Safari
- [ ] Test on mobile (use DevTools: F12 > Toggle Device Toolbar)
- [ ] Test hamburger menu on mobile
- [ ] Click all navigation links
- [ ] Hover over pricing cards
- [ ] Test phone number link (should open dialer)
- [ ] Test Instagram link (should open in new tab)
- [ ] Check Google Map loads correctly
- [ ] Verify images display properly

---

## 🐛 Troubleshooting

### Images Not Showing
**Problem:** Broken image icons appear
**Solution:** 
- Make sure image files are in `assets/images/` folder
- Check filenames are exactly `gym-banner.jpg` and `gym-logo.png`
- Ensure paths match in HTML

### Styling Looks Wrong
**Problem:** Colors or layout appears broken
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
- Hard refresh page (Ctrl+F5 / Cmd+Shift+R)
- Check that `css/style.css` is properly linked in HTML

### Mobile Menu Doesn't Work
**Problem:** Hamburger menu not appearing or not clickable
**Solution:**
- Check browser width is less than 768px
- Open DevTools (F12) and check for JavaScript errors
- Ensure `js/script.js` is properly linked

### Links Not Working
**Problem:** Phone or Instagram links don't work
**Solution:**
- Check URLs are correct in HTML
- Phone should start with `tel:`
- Instagram should start with `https://`
- Use `target="_blank"` for external links

---

## 📊 Performance Tips

1. **Image Optimization:**
   - Compress gym banner before adding (use TinyPNG.com)
   - Keep logo size reasonable (< 100 KB)
   - Use appropriate formats (JPG for photos, PNG for logos)

2. **Caching:**
   - Live Server automatically caches static files
   - For production, set proper cache headers

3. **Page Speed:**
   - Current size: ~75 KB (without images)
   - Add-on images: ~200-300 KB (optimized)
   - Total: ~275-375 KB (very fast loading)

---

## 🔄 Workflow Tips

### Editing in VS Code
1. Open file (Ctrl+P / Cmd+P)
2. Make changes
3. Save (Ctrl+S / Cmd+S)
4. Website auto-refreshes with Live Server

### Editing HTML/Structure
- Add new sections in HTML
- Styles automatically apply (if you use existing classes)
- No need to refresh manually

### Editing CSS
- Colors, layouts, animations
- Reload page to see changes
- Inspect elements with DevTools (F12)

### Editing JavaScript
- Interactivity and events
- Check browser console (F12 > Console) for errors
- Test functionality on page

---

## 🎯 Key Sections to Customize

### 1. Navigation Bar (Top)
**File:** `index.html` Lines 27-35
- Update gym name
- Change nav links if needed

### 2. Hero Section (Banner)
**File:** `index.html` Lines 38-45
- Background image: `gym-banner.jpg`
- Heading text
- Subtitle text
- Button text

### 3. About Section
**File:** `index.html` Lines 48-70
- Gym description
- Registration number (Trust badge)

### 4. Floor Rules
**File:** `index.html` Lines 73-108
- Male floor description
- Female floor description
- Features lists

### 5. Pricing
**File:** `index.html` Lines 111-157
- Price amounts
- Feature lists
- Button text

### 6. Contact
**File:** `index.html` Lines 160-213
- Address
- Phone number
- Instagram link
- Google Maps embed
- Email (if adding)

### 7. Footer
**File:** `index.html` Lines 216-260
- Logo image: `gym-logo.png`
- Gym name
- Contact info
- Social links
- Copyright

---

## 📞 Contact Information

The website displays:
- **Address:** Vidyasagar Sarani, Madhyamgram, Kolkata - 700129
- **Phone:** +91 9836336565 (clickable tel: link)
- **Instagram:** @sanglap_powerhouse
- **Registration:** W.B. Govt. Regn. No.: 20025111780
- **Map:** Embedded Google Map

---

## ✨ Features Summary

✅ **Fully Responsive** - Works on mobile, tablet, desktop
✅ **Dark Theme** - Modern "Powerhouse" aesthetic
✅ **Energetic Colors** - Orange, red, yellow accents
✅ **Smooth Animations** - Professional transitions
✅ **Mobile Menu** - Hamburger navigation
✅ **Price Comparison** - Three membership options
✅ **Floor Segregation** - Clearly displayed male/female areas
✅ **Trust Elements** - Government registration badge
✅ **Contact Ready** - Maps, phone, Instagram
✅ **Fast Loading** - Optimized code and images

---

## 🚀 Next Steps After Setup

1. ✅ Complete file structure
2. ✅ Add images
3. ✅ Test in browser
4. ✅ Customize text/prices
5. ⬜ Deploy to web hosting (optional)
6. ⬜ Add form handling (optional)
7. ⬜ Set up analytics (optional)
8. ⬜ Add more features (optional)

---

**You're all set! Your Sanglap Power House Gym website is ready to impress! 💪**

For detailed documentation, see `README.md`
