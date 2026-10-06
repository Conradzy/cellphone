# FORM — iPhone concept

A monochrome product landing page built inside the existing Next.js App Router project. Uses variable Inter Tight via `next/font/google`, Tailwind CSS 4, TypeScript, GSAP/ScrollTrigger, and React Three Fiber/Drei.

## Development

- Install: `npm ci`
- Develop: `npm run dev`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Production build: `npm run build`
- Serve the build: `npm run start`
- Browser regression suite: `npm test` (build first)

In Windows PowerShell with script execution disabled, use `npm.cmd` instead of `npm`. The build needs access to Google Fonts the first time; Next.js then serves the font locally. The existing project has no separate formatter configured; follow its two-space TypeScript/CSS conventions.

Playwright uses installed Google Chrome on Windows. On other systems run `npx playwright install chromium` once. Tests start a fresh production server on dedicated port 3107, independently of your development server. Desktop, laptop, tablet, mobile, and small-mobile layouts are covered. The real GLB is rendered; the external YouTube API is mocked to test our playback lifecycle deterministically. Generated traces/screenshots stay in ignored `test-results/`.

## Components and motion

- `src/components/landing/Hero.tsx`: semantic quote, natural character reveal, hero entrance and scroll departure. Separate nested wrappers prevent entrance/scroll transforms from competing.
- `src/components/landing/Navbar.tsx`: compact navigation and scoped entrance.
- `src/components/ui/MagneticButton.tsx`: small pointer offset and pill hover. Disabled on coarse pointers and with reduced motion.
- `src/components/three/HeroScene.tsx`: dynamically imported client-only canvas, local studio reflection panels, visibility-aware rendering, loading/error fallback.
- `src/components/three/IPhoneModel.tsx`: normalized GLTF, cloned neutral materials, damped horizontal cursor rotation (up to 0.18 radians either side of its resting pose) and subtle idle float. Pointer position is measured across the viewport, including over navigation; pitch/roll remain fixed. Soft key/fill/rim lighting and faint CSS radial glows separate the phone from the background without washing out the quote.
- `src/components/landing/ExpandingVideoSection.tsx`: native sticky stage over 220svh (190svh on mobile). ScrollTrigger expands the card during the first half of the sticky scroll range, then holds its maximum width and height for the second half. A 0.35-second scrub and eased uniform scale preserve aspect ratio and avoid per-frame layout changes. Full-size CSS gutters are 100px desktop, 40px tablet, and 16–20px mobile.
- `src/components/media/ExpandingVideo.tsx`: lazy media mounting, cover-sized player, pause/resume, automatic offscreen/tab-hidden pause, and an unavailable-player fallback.
- `src/components/landing/ProductDetails.tsx`: restrained closing section and purchase placeholder destination.

GSAP contexts and media queries revert their animations/triggers on cleanup. Pointer listeners, observers, media listeners, and player instances are cleaned up. Reduced motion removes the long reveal, sticky expansion, 3D drift and automatic video playback; an explicit Play button remains available. Native browser scrolling is preserved. No Lenis or additional animation library is used.

## Model

Detected asset: `public/3dmodels/iphone_16_pro_max.glb` (~7.8 MB).

The original GLB is unchanged. Its export orientation and dimensions are normalized in memory, and cloned materials receive a monochrome studio treatment. The canvas is also desaturated to keep embedded textures neutral. No external HDR environment is downloaded. A CSS phone silhouette keeps the composition usable while loading or when WebGL fails.

Model: [iPhone 16 Pro Max](https://sketchfab.com/3d-models/iphone-16-pro-max-41a071ae12794b668502f58d1e0fd1a3) by [MajdyModels](https://sketchfab.com/MG990), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), as recorded in the supplied asset metadata. Display treatment: monochrome materials, studio lighting, and pose. Creator credit is retained in the footer.

## Replace the film

Edit `productFilm` in `src/lib/media.ts`. Current source:

```ts
{ type: "youtube", videoId: "Q3zwkxqh1t0", start: 14 }
```

Put a licensed local video in `public/media/` and change only the source:

```ts
export const productFilm: MediaSource = {
  type: "file",
  src: "/media/product-film.mp4", // .webm also works
  poster: "/media/product-poster.jpg", // optional
  start: 0,
};
```

The same section, scroll timeline, cover styling, and controls work for both sources. YouTube uses a privacy-enhanced embed with muted autoplay, inline playback, a 14-second start, and the video ID as its looping playlist. Playback quality is selected by YouTube; exact 1080p cannot be guaranteed. Browser autoplay restrictions, content blockers, and regional/embed restrictions can still affect playback. No audio is enabled by the page. The fallback retains an Open film link if loading fails.

## Performance decisions

- Three.js is a separate dynamic client bundle. The supplied GLB is preloaded when that bundle loads; its original 7.8 MB payload is retained.
- DPR capped at 1.5, no realtime shadows or postprocessing, 128px environment captured once.
- Canvas uses on-demand rendering while offscreen, paused, or in reduced-motion mode. Pointer data stays in refs; animation does not update React state every frame.
- Video loads near the viewport and pauses offscreen. Film expansion uses transform scaling with fixed internal player dimensions. A single card layer is promoted only near the viewport, painting is contained, and the fallback artwork is hidden once playback has faded in. Scaling ends halfway through the section so full-size playback stays stable.
- The brief letter blur is removed after each reveal; no persistent `will-change` layers.

`Buy Now` and the navigation Buy link currently point to `#buy`. The closing Explore iPhone link opens Apple's product overview. Replace these hrefs when connecting a store; no checkout or transaction is implemented.
