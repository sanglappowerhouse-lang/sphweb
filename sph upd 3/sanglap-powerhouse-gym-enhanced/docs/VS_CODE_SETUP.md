# VS Code Setup & Folder Structure Guide

## 📂 Complete Folder Structure (Copy-Paste Ready)

Create this exact structure in VS Code:

```
sanglap-powerhouse-gym/
│
├── index.html                    [Main HTML File]
├── README.md                     [Documentation]
├── QUICK_START.md                [Quick Setup Guide]
├── PROJECT_SUMMARY.md            [Complete Overview]
├── IMAGE_ASSET_GUIDE.md          [Image Instructions]
├── .gitignore                    [Git Configuration]
│
├── css/
│   └── style.css                 [Complete Styling]
│
├── js/
│   └── script.js                 [JavaScript Logic]
│
└── assets/
    └── images/
        ├── gym-banner.jpg        [Hero Background]
        └── gym-logo.png          [Navigation & Footer Logo]
```

---

## 🚀 Step-by-Step VS Code Setup

### Step 1: Create Main Project Folder

**Option A: Using Terminal**
```bash
# Create project folder
mkdir sanglap-powerhouse-gym

# Navigate into it
cd sanglap-powerhouse-gym

# Open in VS Code
code .
```

**Option B: Using VS Code Explorer**
1. Open VS Code
2. File → Open Folder
3. Create new folder named `sanglap-powerhouse-gym`
4. Select it and open

---

### Step 2: Create Subfolders in VS Code

**Method 1: Using VS Code File Explorer**

1. Right-click in Explorer panel (left side)
2. Click "New Folder"
3. Type: `css`
4. Press Enter
5. Repeat for `js` folder
6. Create `assets` folder
7. Inside `assets`, create `images` folder

**Method 2: Using Terminal in VS Code**

Open terminal (Ctrl+` or View → Terminal):

```bash
# Create all folders at once
mkdir -p css js assets/images

# Verify structure
tree
# or
ls -la
```

---

### Step 3: Add All Code Files

**Method 1: Copy-Paste in VS Code**

1. Right-click in Explorer → New File
2. Name: `index.html`
3. Paste HTML code
4. Repeat for each file:
   - `css/style.css`
   - `js/script.js`
   - `README.md`
   - `QUICK_START.md`
   - `PROJECT_SUMMARY.md`
   - `IMAGE_ASSET_GUIDE.md`

**Method 2: Drag-Drop Files**

1. If you've saved files on computer
2. Drag files directly into VS Code Explorer
3. Drop into correct folders

---

### Step 4: Folder Structure Verification

After adding all files, your explorer should show:

```
📁 sanglap-powerhouse-gym
 ├── 📄 index.html
 ├── 📄 README.md
 ├── 📄 QUICK_START.md
 ├── 📄 PROJECT_SUMMARY.md
 ├── 📄 IMAGE_ASSET_GUIDE.md
 ├── 📄 .gitignore
 ├── 📁 css
 │   └── 📄 style.css
 ├── 📁 js
 │   └── 📄 script.js
 └── 📁 assets
     └── 📁 images
         ├── 📄 gym-banner.jpg (Add your image)
         └── 📄 gym-logo.png (Add your image)
```

---

## 🖼️ Step 5: Add Your Images

### Method 1: Drag-Drop Images into VS Code

1. Have your image files ready
2. In VS Code Explorer, right-click `assets/images/` folder
3. Click "Reveal in Explorer" or "Show in Finder"
4. Drag your prepared images into the folder
5. Ensure filenames are exactly:
   - `gym-banner.jpg`
   - `gym-logo.png`

### Method 2: Copy Images via File Manager

1. Find your image files on computer
2. Rename them to exact names:
   - `gym-banner.jpg`
   - `gym-logo.png`
3. Copy both files
4. Navigate to project folder → assets → images
5. Paste images there

### Method 3: Using Terminal Commands

```bash
# Navigate to images folder
cd assets/images

# Copy images from Downloads (example)
cp ~/Downloads/your-banner.jpg ./gym-banner.jpg
cp ~/Downloads/your-logo.png ./gym-logo.png

# Verify files are there
ls -la
```

---

## 📝 File Creation Shortcuts

### Using VS Code Command Palette

1. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
2. Type `>create file`
3. Select "Files: Create New File"
4. Type file path with name
5. Example: `css/style.css`
6. Press Enter

### Quick File Creation

**Create Multiple Files at Once:**

```bash
# Using terminal in VS Code
touch index.html README.md QUICK_START.md
mkdir -p css js assets/images
touch css/style.css js/script.js
```

---

## 🔧 VS Code Settings for This Project

### Recommended Extensions

Install these VS Code extensions for better development:

1. **Live Server**
   - Author: Ritwick Dey
   - ID: ritwickdey.liveserver
   - Use: Hot reload while editing

2. **HTML to CSS autocompletion**
   - Author: Zignd
   - ID: zignd.html-css-class-completion
   - Use: CSS class suggestions

3. **Thunder Client** (Optional)
   - For API testing (if you add backend later)

4. **Prettier**
   - Author: Prettier
   - ID: esbenp.prettier-vscode
   - Use: Auto-format code

5. **Better Comments**
   - Author: Aaron Bond
   - ID: aaron-bond.better-comments
   - Use: Highlight important comments

### Installation Steps

1. Click Extensions icon (Ctrl+Shift+X)
2. Search for extension name
3. Click "Install"
4. Reload VS Code if prompted

---

## ▶️ Running the Website

### Method 1: Live Server (Recommended) ⭐

**Most convenient for development:**

1. Install "Live Server" extension (see above)
2. Right-click on `index.html` in Explorer
3. Select "Open with Live Server"
4. Website opens in browser automatically
5. Any changes auto-refresh in browser

### Method 2: Open File Directly

**Simple, no extension needed:**

1. Right-click `index.html` in Explorer
2. Select "Open with Default Browser"
3. Website opens in your default browser
4. Manually refresh (F5) after changes

### Method 3: Terminal Commands

**Using Python (if installed):**
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

**Using Node.js (if installed):**
```bash
# Install http-server
npm install -g http-server

# Run server
http-server

# Open: http://localhost:8080
```

---

## 🎨 VS Code Theme Recommendations

For working with the dark "Powerhouse" theme:

### Dark Themes (Recommended)
- **Dracula Official** - Beautiful dark theme
- **One Dark Pro** - Popular and easy on eyes
- **Nord** - Cool dark blue tones
- **Material Dark** - Clean and modern
- **GitHub Dark** - GitHub's official theme

### Setup Theme

1. Click Settings icon (bottom left gear)
2. Select "Color Theme"
3. Browse available themes
4. Click to apply theme

---

## 📋 VS Code Shortcuts (Helpful)

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` / `Cmd+S` | Save file |
| `Ctrl+Shift+S` / `Cmd+Shift+S` | Save all files |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Ctrl+X` / `Cmd+X` | Cut line |
| `Ctrl+C` / `Cmd+C` | Copy line |
| `Ctrl+V` / `Cmd+V` | Paste |
| `Ctrl+F` / `Cmd+F` | Find |
| `Ctrl+H` / `Cmd+H` | Find and Replace |
| `Ctrl+/` / `Cmd+/` | Toggle comment |
| `Alt+Up` / `Option+Up` | Move line up |
| `Alt+Down` / `Option+Down` | Move line down |
| `F12` | Open DevTools |
| `Ctrl+Shift+P` / `Cmd+Shift+P` | Command palette |

---

## 🐛 Troubleshooting VS Code Setup

### Problem: Folder Not Opening in VS Code

**Solution:**
1. Make sure you have the correct folder path
2. Try: File → Open Folder
3. Navigate to `sanglap-powerhouse-gym` folder
4. Click "Open"

### Problem: Live Server Not Working

**Solution:**
1. Make sure Live Server is installed
2. Restart VS Code completely
3. Try right-clicking `index.html` again
4. If still not working, reload VS Code (Ctrl+R)

### Problem: Files Not Saving

**Solution:**
1. Check if file shows dot (●) next to name (unsaved)
2. Press Ctrl+S / Cmd+S to save
3. Check file permissions
4. Try "Save All" (Ctrl+Shift+S)

### Problem: Images Not Showing

**Solution:**
1. Verify image files are in `assets/images/` folder
2. Check exact filename: `gym-banner.jpg` and `gym-logo.png`
3. Hard refresh browser (Ctrl+Shift+R)
4. Check console (F12) for file path errors

### Problem: Styling Looks Wrong

**Solution:**
1. Verify `css/style.css` is in correct folder
2. Check link in `index.html`: `<link rel="stylesheet" href="css/style.css">`
3. Hard refresh browser cache
4. Check console for 404 errors

### Problem: Hamburger Menu Not Working

**Solution:**
1. Verify `js/script.js` is in correct folder
2. Check script tag: `<script src="js/script.js"></script>`
3. Open DevTools console (F12) and check for errors
4. Make sure window width is < 768px to see hamburger

---

## 💾 Project Organization Tips

### Naming Conventions

**Use consistent naming:**
- Files: lowercase, use hyphens: `gym-banner.jpg`
- Folders: lowercase: `assets`, `images`
- Classes: lowercase, use hyphens: `floor-card`, `pricing-grid`
- IDs: lowercase, use hyphens: `floor-rules`, `contact`

### File Organization Best Practices

1. **HTML in root** - `index.html`
2. **CSS in folder** - `css/style.css`
3. **JavaScript in folder** - `js/script.js`
4. **Assets in subfolder** - `assets/images/`, `assets/fonts/`
5. **Docs in root** - `README.md`, `QUICK_START.md`

### Comments for Organization

```html
<!-- ============================================
     NAVIGATION SECTION
     ============================================ -->
<nav class="navbar">
    ...
</nav>
```

```css
/* ============================================
   HERO SECTION
   ============================================ */
.hero {
    ...
}
```

```javascript
// ============================================
// MOBILE MENU TOGGLE
// ============================================
```

---

## 🔄 Git Integration (Optional)

### Initialize Git Repository

```bash
# Inside project folder
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Sanglap Power House Gym Website"

# Create main branch
git branch -M main
```

### Create .gitignore

Already provided in project. Prevents unwanted files from uploading.

### Push to GitHub (Optional)

```bash
# Add remote repository
git remote add origin https://github.com/username/sanglap-powerhouse-gym.git

# Push to GitHub
git push -u origin main
```

---

## 📦 Project File Checklist

After setup, verify all files are present:

### Root Files
- [x] `index.html` - Main website file
- [x] `README.md` - Complete documentation
- [x] `QUICK_START.md` - Quick setup guide
- [x] `PROJECT_SUMMARY.md` - Project overview
- [x] `IMAGE_ASSET_GUIDE.md` - Image instructions
- [x] `.gitignore` - Git configuration

### CSS Folder
- [x] `css/style.css` - All styling

### JavaScript Folder
- [x] `js/script.js` - All interactivity

### Assets Folder
- [x] `assets/images/gym-banner.jpg` - [Add your image]
- [x] `assets/images/gym-logo.png` - [Add your image]

**Total Files:** 10+ (6 code + 2 images + 4 docs)
**Total Size (without images):** ~75 KB

---

## 🎉 Setup Complete!

You're ready to:

1. ✅ Edit HTML, CSS, and JavaScript
2. ✅ View changes in real-time with Live Server
3. ✅ Test responsive design
4. ✅ Customize content for your gym
5. ✅ Deploy to web hosting

**Estimated setup time: 5-10 minutes**

---

## 📚 Next Steps

1. **Open website with Live Server** - See it in action
2. **Test on different screen sizes** - Use DevTools
3. **Update content** - Edit HTML with your information
4. **Optimize images** - Compress and prepare files
5. **Deploy online** - Choose hosting provider

For detailed guides, see:
- `QUICK_START.md` - Fast setup
- `README.md` - Complete documentation
- `PROJECT_SUMMARY.md` - Project overview
- `IMAGE_ASSET_GUIDE.md` - Image specifications

---

**Happy coding! 🚀**
**Your Sanglap Power House Gym website is ready to shine!**
