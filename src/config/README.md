# External Links Configuration

## 📋 Overview

This configuration file (`src/config/externalLinks.js`) centralizes all external links used throughout the JobGen Blog application. This makes it easy to update links in one place instead of searching through multiple files.

## 🎯 Purpose

- **Maintainability**: Update all external links from a single source
- **Consistency**: Ensure all components use the same URLs
- **Efficiency**: No need to search through multiple files when URLs change

## 📁 File Location

```
src/config/externalLinks.js
```

## 🔧 Usage

### Import the configuration

```javascript
import { EXTERNAL_LINKS } from '@/config/externalLinks';
// or
import { EXTERNAL_LINKS } from '../config/externalLinks';
```

### Use in components

**For regular links:**
```jsx
<a href={EXTERNAL_LINKS.main.website}>Visit Website</a>
```

**For button clicks:**
```jsx
<button onClick={() => window.location.href = EXTERNAL_LINKS.main.website}>
  Go to Website
</button>
```

**For links opening in new tab:**
```jsx
<a 
  href={EXTERNAL_LINKS.social.linkedin} 
  target="_blank" 
  rel="noopener noreferrer"
>
  LinkedIn
</a>
```

## 📦 Available Link Categories

### Main Website Links
- `EXTERNAL_LINKS.main.website` - Main website (https://jobgen.ai)
- `EXTERNAL_LINKS.main.interviewPrep` - Interview preparation tool
- `EXTERNAL_LINKS.main.resumeTemplates` - Resume templates
- `EXTERNAL_LINKS.main.starMethod` - STAR method guide

### Social Media Links
- `EXTERNAL_LINKS.social.linkedin` - LinkedIn profile
- `EXTERNAL_LINKS.social.twitter` - Twitter profile
- `EXTERNAL_LINKS.social.github` - GitHub profile

### Company Pages
- `EXTERNAL_LINKS.company.about` - About page
- `EXTERNAL_LINKS.company.contact` - Contact page
- `EXTERNAL_LINKS.company.privacy` - Privacy policy
- `EXTERNAL_LINKS.company.terms` - Terms of service

### Timeline Phase CTAs
- `EXTERNAL_LINKS.timeline.init` - Init phase CTA
- `EXTERNAL_LINKS.timeline.build` - Build phase CTA
- `EXTERNAL_LINKS.timeline.deploy` - Deploy phase CTA
- `EXTERNAL_LINKS.timeline.test` - Test phase CTA
- `EXTERNAL_LINKS.timeline.release` - Release phase CTA
- `EXTERNAL_LINKS.timeline.logs` - Logs phase CTA

## 🛠️ Helper Functions

### `openInNewTab(url)`
Opens a URL in a new browser tab safely.

```javascript
import { openInNewTab, EXTERNAL_LINKS } from '@/config/externalLinks';

openInNewTab(EXTERNAL_LINKS.main.website);
```

### `navigateToExternal(url)`
Navigates to an external URL in the current tab.

```javascript
import { navigateToExternal, EXTERNAL_LINKS } from '@/config/externalLinks';

navigateToExternal(EXTERNAL_LINKS.main.interviewPrep);
```

## 📍 Files Using This Configuration

The following files have been updated to use the centralized configuration:

1. **CTASection.jsx** - Social media links
2. **TimelineSection.jsx** - Timeline phase CTA buttons
3. **BlogLayout.jsx** - Header "Try Free" button, Footer links, Social icons
4. **ArticlePage.jsx** - Phase CTA buttons

## ✏️ How to Update Links

To update any external link, simply edit `src/config/externalLinks.js`:

```javascript
export const EXTERNAL_LINKS = {
  main: {
    website: 'https://new-domain.com', // Change here
    // ... other links
  },
  // ... other categories
};
```

**All components will automatically use the updated URL!** No need to modify individual component files.

## ⚠️ Important Notes

1. **Always use the config** - Don't hardcode external URLs in components
2. **Follow the pattern** - Use the existing structure when adding new links
3. **Test after changes** - Verify all links work after updating the config
4. **Keep it organized** - Group related links together

## 🔍 Example: Adding a New Link

If you need to add a new external link:

1. Open `src/config/externalLinks.js`
2. Add the new link to the appropriate category:

```javascript
export const EXTERNAL_LINKS = {
  main: {
    website: 'https://jobgen.ai',
    // ... existing links
    newFeature: 'https://jobgen.ai/new-feature', // ← Add here
  },
  // ...
};
```

3. Use it in your component:

```jsx
import { EXTERNAL_LINKS } from '@/config/externalLinks';

<a href={EXTERNAL_LINKS.main.newFeature}>Try New Feature</a>
```

## 📝 Summary

This centralized configuration system makes maintaining external links effortless. Update once, apply everywhere!
