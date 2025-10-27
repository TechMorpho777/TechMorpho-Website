# TechMorpho IT Solutions Website

A modern, professional multi-page website for TechMorpho IT Solutions with organized file structure and clean design.

## 📁 Project Structure

```
tech/
├── assets/
│   ├── css/
│   │   └── styles.css          # All website styles
│   ├── js/
│   │   └── script.js           # JavaScript functionality
│   └── images/
│       ├── logo/               # Company logos
│       ├── services/           # Service icons
│       ├── portfolio/          # Project screenshots
│       ├── hero/               # Hero backgrounds
│       ├── IMAGES-GUIDE.md     # Image guidelines
│       └── favicon.ico         # Website favicon
├── index.html                  # Home page
├── services.html               # Services page
├── portfolio.html              # Portfolio page
├── about.html                  # About us page
├── contact.html                # Contact page
└── README.md                   # This file
```

## 🚀 Features

### Pages
- ✅ **Home** - Hero section, services preview, stats
- ✅ **Services** - Detailed service information (6 services)
- ✅ **Portfolio** - Project showcase with filtering (9 sample projects)
- ✅ **About** - Company info, values, track record
- ✅ **Contact** - Contact form, business hours, location

### Technical Features
- Fully responsive design (mobile, tablet, desktop)
- SEO optimized with meta tags
- Clean, professional animations
- Portfolio filtering system
- Mobile-friendly navigation
- Contact form ready
- Fast loading performance
- Cross-browser compatible

## 🎨 Getting Started

### 1. Basic Setup
Simply open `index.html` in your web browser to view the website.

### 2. Adding Images
See `assets/images/IMAGES-GUIDE.md` for detailed instructions on:
- Where to place images
- Recommended sizes and formats
- How to optimize images
- Free image resources

Quick start:
```
assets/images/
├── logo/logo.png              # Add your logo here
├── portfolio/project-01.jpg   # Add project screenshots
└── favicon.ico                # Add your favicon
```

### 3. Customization

#### Colors
Edit CSS variables in `assets/css/styles.css`:
```css
:root {
    --primary-color: #6366f1;    /* Main brand color */
    --primary-dark: #4f46e5;     /* Darker shade */
    --secondary-color: #06b6d4;  /* Accent color */
}
```

#### Contact Information
Update in `contact.html`:
- Email addresses
- Phone numbers
- Physical address
- Business hours

#### Company Name
Find and replace "TechMorpho" with your company name across all HTML files.

#### Portfolio Projects
Edit `portfolio.html` to add your real projects:
- Update project titles and descriptions
- Change technology tags
- Add real project images

## 📱 Responsive Design

The website automatically adjusts for:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1440px+)

## 🌐 Deployment Options

### Easy Deployment (Drag & Drop):
1. **Netlify** - netlify.com (Free)
2. **Vercel** - vercel.com (Free)
3. **GitHub Pages** - pages.github.com (Free)

### Traditional Hosting:
1. Upload all files via FTP
2. Point your domain to the hosting
3. Done!

### Before Deployment Checklist:
- [ ] Replace all placeholder content
- [ ] Add your company logo
- [ ] Add real portfolio images
- [ ] Update contact information
- [ ] Add favicon
- [ ] Test all pages and links
- [ ] Optimize all images
- [ ] Update meta tags with your info

## 🔧 Making the Contact Form Work

The form currently shows an alert. To make it functional:

### Option 1: Use a Form Service (Easiest)
- **Formspree** (formspree.io) - Free for 50 submissions/month
- **EmailJS** (emailjs.com) - Send emails from JavaScript
- **Netlify Forms** (if hosted on Netlify)
- **Google Forms** - Embed a Google Form

### Option 2: Backend Integration
Uncomment the fetch code in `assets/js/script.js` and create a backend API.

## 📦 What's Included

### HTML Files (5 pages)
- Semantic HTML5 markup
- SEO-friendly structure
- Accessibility features
- Clean, readable code

### CSS (assets/css/styles.css)
- Modern CSS3 features
- Flexbox & Grid layouts
- CSS Variables for easy customization
- Smooth transitions
- Mobile-first approach

### JavaScript (assets/js/script.js)
- Mobile menu toggle
- Portfolio filtering
- Form handling
- Smooth scrolling
- Active navigation highlighting

## 🎯 Services Included

1. **Website Development** - WordPress & Custom sites
2. **Desktop/Web Applications** - Flutter & Electron apps
3. **SEO & Digital Marketing** - Search optimization & ads
4. **Graphic Design** - Logos, branding, social media
5. **Web Hosting & Maintenance** - Hosting, SSL, backups
6. **QA & Security Testing** - Testing & vulnerability reports

## 📸 Adding Real Images

### Portfolio Images
1. Take screenshots of your projects
2. Resize to 1200x800px
3. Optimize/compress them
4. Save as `project-01.jpg`, `project-02.jpg`, etc.
5. Place in `assets/images/portfolio/`
6. Update `portfolio.html`:
```html
<div class="portfolio-image">
    <img src="assets/images/portfolio/project-01.jpg" alt="Project Name">
</div>
```

### Logo
1. Create/export your logo as PNG
2. Size: ~200x60px (or maintain aspect ratio)
3. Save as `logo.png` in `assets/images/logo/`
4. Update navigation in all HTML files:
```html
<a href="index.html" class="logo">
    <img src="assets/images/logo/logo.png" alt="TechMorpho">
</a>
```

## ✅ Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Troubleshooting

### Images not showing?
- Check file paths are correct
- Ensure images are in the right folders
- Check file extensions (.jpg, .png, etc.)

### CSS not loading?
- Clear browser cache
- Check `assets/css/styles.css` path
- Open browser console for errors

### Form not working?
- Check `assets/js/script.js` is loaded
- Integrate with a form service (see above)
- Check browser console for errors

## 📝 Maintenance Tips

1. **Regular Updates**
   - Keep content fresh
   - Update portfolio regularly
   - Add new blog posts or case studies

2. **Image Optimization**
   - Always compress images before upload
   - Use WebP format for better compression
   - Consider lazy loading for better performance

3. **SEO**
   - Update meta descriptions regularly
   - Add new keywords as needed
   - Keep sitemap updated

## 🎓 Learn More

### Free Resources:
- **HTML/CSS** - MDN Web Docs (developer.mozilla.org)
- **JavaScript** - JavaScript.info
- **Web Design** - Awwwards.com for inspiration
- **SEO** - Google Search Central

## 📞 Support

For questions about customization or deployment, refer to:
- `assets/images/IMAGES-GUIDE.md` - Image help
- Individual folder README files
- Online documentation

## 📄 License

© 2025 TechMorpho IT Solutions. All rights reserved.

---

## 🚀 Quick Start Commands

### To view locally:
1. Simply open `index.html` in your browser
2. No server required for basic viewing

### To deploy:
1. Compress entire `tech` folder
2. Upload to your hosting provider
3. Or drag folder to Netlify/Vercel

---

**Ready to go live?** Replace placeholder content, add your images, and deploy!

Need help? Check the guides in `assets/images/` folder or contact your developer.
