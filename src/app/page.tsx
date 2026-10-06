import { ExpandingVideoSection } from "@/components/landing/ExpandingVideoSection";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { ProductDetails } from "@/components/landing/ProductDetails";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <ExpandingVideoSection />
        <ProductDetails />
      </main>
      <footer className="site-footer">
        <a className="wordmark" href="#overview" aria-label="FORM home">form<span>®</span></a>
        <p>An independent concept. Not affiliated with Apple.</p>
        <p className="model-credit">Model by <a href="https://sketchfab.com/MG990" target="_blank" rel="noreferrer">MajdyModels</a>{" · "}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a></p>
        <a className="text-link" href="#overview">Back to top <span aria-hidden="true">↗</span></a>
      </footer>
    </>
  );
}
