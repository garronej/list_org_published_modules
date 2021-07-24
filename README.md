<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/80216211-00ef5280-863e-11ea-81de-59f3a3d4b8e4.png">  
</p>
<p align="center">
    <i>A CLI tool that lists all the modules published by a given GitHub organisation for a given ecosystem (npm, maven, ect.)</i>
    <br>
    <br>
    <img src="https://github.com/garronej/list_org_published_modules/workflows/ci/badge.svg?branch=main">
    <img src="https://img.shields.io/bundlephobia/minzip/list_org_published_modules">
    <img src="https://img.shields.io/npm/dw/list_org_published_modules">
    <img src="https://img.shields.io/npm/l/list_org_published_modules">
</p>
<p align="center">
  <a href="https://github.com/garronej/list_org_published_modules">Home</a>
  -
  <a href="https://github.com/garronej/list_org_published_modules">Documentation</a>
</p>

# Install / Import

```bash
$ npm install --save list_org_published_modules
```

```typescript
import { myFunction, myObject } from "list_org_published_modules";
```

Specific imports:

```typescript
import { myFunction } from "list_org_published_modules/myFunction";
import { myObject } from "list_org_published_modules/myObject";
```

## Import from HTML, with CDN

Import it via a bundle that creates a global ( wider browser support ):

```html
<script src="//unpkg.com/list_org_published_modules/bundle.min.js"></script>
<script>
    const { myFunction, myObject } = list_org_published_modules;
</script>
```

Or import it as an ES module:

```html
<script type="module">
    import { myFunction, myObject } from "//unpkg.com/list_org_published_modules/zz_esm/index.js";
</script>
```

_You can specify the version you wish to import:_ [unpkg.com](https://unpkg.com)

## Contribute

```bash
npm install
npm run build
npm test
```
