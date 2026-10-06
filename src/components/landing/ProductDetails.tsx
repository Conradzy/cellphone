import { MagneticButton } from "@/components/ui/MagneticButton";

export function ProductDetails() {
  return (
    <section className="details-section" id="technology" aria-labelledby="technology-title">
      <div className="details-intro"><p className="eyebrow">03 — Intention, made tangible</p><h2 id="technology-title">Progress is a feeling.<br /><span>You know it when you hold it.</span></h2></div>
      <div className="details-grid">
        <article><span className="detail-number">01 / FORM</span><h3>Less, refined.</h3><p>A considered silhouette. A quiet presence. Every line belongs.</p></article>
        <article><span className="detail-number">02 / PERSPECTIVE</span><h3>Look a little closer.</h3><p>A new way to frame the familiar. Room for the moments that matter.</p></article>
        <article><span className="detail-number">03 / POSSIBILITY</span><h3>Forward, naturally.</h3><p>Technology that fades into the experience. So your ideas can take the lead.</p></article>
      </div>
      <div className="buy-section" id="buy"><p className="eyebrow">iPhone 16 Pro Max — The concept</p><h2>Make room<br />for what’s next.</h2><MagneticButton href="https://www.apple.com/iphone/" className="pill-button-dark">Explore iPhone</MagneticButton><p className="buy-note">A study in possibility. An invitation to move forward.</p></div>
    </section>
  );
}
