---
description: How to update the Expanding Land changelog after making changes
---

# Updating the Changelog

After making significant changes to the Expanding Land server or client (ogario), update the changelog page.

## Steps

1. Open `C:\Github_repos\legendworld-help\changelog.html`
2. Add a new `<article class="entry">` block at the top of `<main>`, before existing entries
3. Use this template:

```html
<article class="entry">
  <div class="entry-header">
    <span class="version">Month Year</span>
    <span class="date">YYYY-MM-DD</span>
    <span class="tag tag-feature">Features</span>
    <!-- Other tags: tag-fix, tag-perf, tag-security -->
  </div>
  <ul>
    <li>Description of change</li>
  </ul>
</article>
```

4. Available tags:
   - `tag-feature` (green) — New features
   - `tag-fix` (yellow) — Bug fixes
   - `tag-perf` (blue) — Performance improvements
   - `tag-security` (red) — Security updates

5. Commit and push:
```
cd C:\Github_repos\legendworld-help
git add changelog.html
git commit -m "Changelog: describe changes"
git push
```

6. Optionally submit to IndexNow for faster indexing:
   - Visit: `https://api.indexnow.org/IndexNow?url=https://help.expanding.land/changelog.html&key=a1b2c3d4e5f6g7h8indexnow`
