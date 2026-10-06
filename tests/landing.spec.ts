import { expect, test, type Page } from "@playwright/test";
import { youtubeEmbedUrl } from "../src/lib/media";

const quote = "The cost of innovation is eclipsed by the price of obsolescence.";

// Exercise our player lifecycle deterministically, without relying on ads,
// regional embed availability, third-party network access, or autoplay policy.
test.beforeEach(async ({ page }) => {
  await page.route("https://www.youtube.com/iframe_api", (route) => route.fulfill({
    contentType: "text/javascript",
    body: `window.YT = { Player: class {
      constructor(frame, options) { this.frame = frame; this.events = options.events; setTimeout(() => this.events.onReady({ target: this }), 0); }
      mute() { this.frame.dataset.muted = 'true'; }
      seekTo(seconds) { this.frame.dataset.start = String(seconds); }
      playVideo() { this.frame.dataset.state = 'playing'; this.events.onStateChange({target:this, data:1}); }
      pauseVideo() { this.frame.dataset.state = 'paused'; }
      destroy() { this.frame.remove(); }
    }}; window.onYouTubeIframeAPIReady();`,
  }));
  await page.route("https://www.youtube-nocookie.com/**", (route) => route.fulfill({ contentType: "text/html", body: "<html><body style='background:#171717'></body></html>" }));
});

async function jump(page: Page, top: number) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
}

test("hero loads the real model, keeps the quote clear, and has no overflow", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(quote);
  await expect(page.locator(".quote-letter").last()).toHaveCSS("opacity", "1");
  await expect(page.locator(".scene-canvas")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".hero-quote")).toHaveCSS("font-weight", "310");
  const dimensions = await page.evaluate(() => {
    const cta = document.querySelector(".hero-cta")!.getBoundingClientRect();
    const scene = document.querySelector(".hero-scene")!.getBoundingClientRect();
    return { width: document.documentElement.scrollWidth, viewport: innerWidth, ctaBottom: cta.bottom, sceneTop: scene.top, font: getComputedStyle(document.body).fontFamily };
  });
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.font).toContain("Inter Tight");
  expect(dimensions.ctaBottom).toBeLessThan(dimensions.sceneTop + 20);
  expect(errors).toEqual([]);
  await page.screenshot({ path: info.outputPath("hero.png") });
});

test("media reaches full size halfway, holds steady, reverses, and pauses", async ({ page }, info) => {
  await page.goto("/");
  const layout = await page.locator("#design").evaluate((element) => ({ top: (element as HTMLElement).offsetTop, height: element.getBoundingClientRect().height, viewport: innerHeight, width: innerWidth }));
  await jump(page, layout.top);
  const frame = page.locator(".film-frame");
  const gutter = layout.width >= 1200 ? 100 : layout.width >= 768 ? 40 : layout.width >= 375 ? 20 : 16;
  const fullWidth = layout.width - 2 * gutter;
  const scrollTravel = layout.height - layout.viewport;
  await expect.poll(async () => (await frame.boundingBox())!.width).toBeLessThan(fullWidth - 5);
  const initial = (await frame.boundingBox())!;
  const iframe = page.locator(".youtube-cover iframe");
  await expect(iframe).toBeAttached();
  const playerSize = await iframe.evaluate((element) => ({ width: element.clientWidth, height: element.clientHeight }));

  await jump(page, layout.top + scrollTravel * 0.25);
  await expect.poll(async () => (await frame.boundingBox())!.width).toBeGreaterThan(initial.width + 5);
  expect((await frame.boundingBox())!.width).toBeLessThan(fullWidth);

  await jump(page, layout.top + scrollTravel * 0.5);
  await expect.poll(async () => Math.round((await frame.boundingBox())!.width)).toBe(fullWidth);
  const halfway = (await frame.boundingBox())!;
  for (const progress of [0.75, 1]) {
    await jump(page, layout.top + scrollTravel * progress);
    await expect.poll(async () => Math.round((await frame.boundingBox())!.width)).toBe(fullWidth);
    expect(Math.round((await frame.boundingBox())!.height)).toBe(Math.round(halfway.height));
  }
  // Scaling must not resize the embedded player or trigger stream renegotiation.
  expect(await iframe.evaluate((element) => ({ width: element.clientWidth, height: element.clientHeight }))).toEqual(playerSize);

  await jump(page, layout.top + scrollTravel * 0.25);
  await expect.poll(async () => (await frame.boundingBox())!.width).toBeLessThan(fullWidth - 5);
  await jump(page, layout.top + scrollTravel * 0.5);
  await expect.poll(async () => Math.round((await frame.boundingBox())!.width)).toBe(fullWidth);
  const final = (await frame.boundingBox())!;
  expect(Math.round(final.x)).toBe(gutter);
  expect(final.height).toBeGreaterThan(layout.viewport * 0.7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(iframe).toHaveAttribute("data-muted", "true");
  await expect(iframe).toHaveAttribute("data-start", "14");
  await expect(iframe).toHaveAttribute("data-state", "playing");
  await page.getByRole("button", { name: "Pause film" }).click();
  await expect(iframe).toHaveAttribute("data-state", "paused");
  await page.getByRole("button", { name: "Play film" }).click();
  await expect(iframe).toHaveAttribute("data-state", "playing");
  await page.screenshot({ path: info.outputPath("expanded-film.png") });
});

test("reduced motion removes typing, sticky scrolling, and automatic playback", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".quote-letter").last()).toHaveCSS("opacity", "1");
  await expect(page.locator(".film-stage")).toHaveCSS("position", "relative");
  await expect(page.locator(".film-frame")).toHaveCSS("transform", "none");
  await expect(page.getByRole("button", { name: "Pause 3D motion" })).toHaveCount(0);
  await page.locator("#design").scrollIntoViewIfNeeded();
  const iframe = page.locator(".youtube-cover iframe");
  await expect(iframe).toHaveAttribute("data-state", "paused");
  await expect(iframe).toHaveAttribute("src", /autoplay=0/);
  await page.getByRole("button", { name: "Play film" }).click();
  await expect(iframe).toHaveAttribute("data-state", "playing");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".film-stage")).toHaveCSS("position", "sticky");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".film-frame")).toHaveCSS("transform", "none");
  await page.screenshot({ path: info.outputPath("reduced-motion.png") });
});

test("keyboard navigation and purchase placeholder lead to meaningful destinations", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.getByRole("link", { name: "Buy Now", exact: true }).click();
  await expect(page).toHaveURL(/#buy$/);
  await expect(page.getByRole("link", { name: "Explore iPhone" })).toHaveAttribute("href", "https://www.apple.com/iphone/");
});

test("YouTube configuration has muted looping inline playback at 14 seconds", () => {
  const url = new URL(youtubeEmbedUrl("Q3zwkxqh1t0", 14, "http://localhost:3000"));
  expect(url.hostname).toBe("www.youtube-nocookie.com");
  for (const key of ["autoplay", "mute", "loop", "playsinline", "enablejsapi"]) expect(url.searchParams.get(key)).toBe("1");
  expect(url.searchParams.get("playlist")).toBe("Q3zwkxqh1t0");
  expect(url.searchParams.get("start")).toBe("14");
  expect(() => youtubeEmbedUrl("invalid", 14, "http://localhost:3000")).toThrow();
});
