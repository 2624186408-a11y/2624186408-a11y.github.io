# WEN.

WEN. personal portfolio, published at <https://2624186408-a11y.github.io/>.

## Local production build

```powershell
npm run build
```

The build copies the public site into `_site/` and verifies that every local resource referenced by the HTML, CSS, and JavaScript exists. No dependency installation is required.

## Deployment

Every push to `main` runs `.github/workflows/deploy-pages.yml`. The workflow builds the site, uploads the `_site/` artifact, and deploys it through GitHub Pages. It can also be run manually from the repository's Actions tab.

