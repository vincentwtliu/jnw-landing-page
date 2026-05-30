# Self-Hosted Font Files

This directory should contain the following font subset files for optimal performance.

## Required Font Files

### Cormorant Garamond (Headings)
- `cormorant-garamond-v16-latin-regular.woff2`
- `cormorant-garamond-v16-latin-regular.woff`
- `cormorant-garamond-v16-latin-600.woff2`
- `cormorant-garamond-v16-latin-600.woff`
- `cormorant-garamond-v16-latin-700.woff2`
- `cormorant-garamond-v16-latin-700.woff`

### Inter (Body)
- `inter-v13-latin-regular.woff2`
- `inter-v13-latin-regular.woff`
- `inter-v13-latin-500.woff2`
- `inter-v13-latin-500.woff`
- `inter-v13-latin-600.woff2`
- `inter-v13-latin-600.woff`

## How to Download

1. Visit https://gwfh.mranftl.com/fonts (google-webfonts-helper)
2. Search for "Cormorant Garamond" — select weights 400, 600, 700 — choose "latin" subset
3. Search for "Inter" — select weights 400, 500, 600 — choose "latin" subset
4. Download and extract the woff2/woff files into this directory

Alternatively, use Font Squirrel's Webfont Generator:
- https://www.fontsquirrel.com/tools/webfont-generator

## Why Self-Host?

- Eliminates third-party DNS lookups and connection overhead
- Allows subsetting to reduce file size
- Ensures `font-display: swap` is applied consistently
- No dependency on Google Fonts CDN availability
