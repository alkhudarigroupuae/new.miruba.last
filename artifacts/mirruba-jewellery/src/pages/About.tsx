import { useState, useEffect, useRef } from "react";
import logoImg from "@assets/LogoAlaaEdited.df4b9638e3b8557a4379_(1)_1776081454867.png";
import { useProducts } from "@/hooks/useProducts";
import { useLanguage } from "@/context/LanguageContext";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function HeroBanner() {
  const { t } = useLanguage();
  return (
    <section className="relative py-32 sm:py-40 flex items-center justify-center overflow-hidden bg-[#231f20]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20" />
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="text-gold-light tracking-[0.4em] text-xs sm:text-sm uppercase mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
          {t("ourStory")}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
          {t("aboutMirruba")}
        </h1>
        <div className="w-16 h-[1px] bg-gold/60 mx-auto opacity-0 animate-gold-line" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }} />
      </div>
    </section>
  );
}

function StorySection() {
  const { t } = useLanguage();
  const { ref, isVisible } = useInView(0.2);
  const { data: allProducts } = useProducts();
  const storyImage = (() => {
    const withImages = (allProducts || []).filter((p) => p.images.length > 0);
    return withImages.length > 0 ? withImages[0].images[0].src : "";
  })();

  return (
    <section className="py-20 sm:py-28 bg-background" data-testid="section-story">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">{t("whoWeAre")}</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-6 leading-tight">
              {t("aboutPreviewTitle").split(" ").slice(0, -1).join(" ")}<br />
              {t("aboutPreviewTitle").split(" ").slice(-1)}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t("aboutPreviewDesc")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("aboutIntro")}
            </p>
          </div>
          {storyImage && (
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
              <div className="relative">
                <img
                  src={storyImage}
                  alt="Mirruba Jewellery"
                  className="w-full max-h-[350px] rounded-lg shadow-xl object-cover"
                  loading="lazy"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-gold/30 rounded-lg" />
                <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-gold/30 rounded-lg" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const { t } = useLanguage();
  const { ref, isVisible } = useInView(0.1);

  const values = [
    { title: t("craftsmanship"), description: t("craftsmanshipDesc") },
    { title: t("elegance"), description: t("eleganceDesc") },
    { title: t("authenticity"), description: t("authenticityDesc") },
    { title: t("exclusivity"), description: t("exclusivityDesc") },
  ];

  return (
    <section className="py-20 sm:py-28 bg-muted/30" data-testid="section-values">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">{t("whoWeAre")}</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-4">{t("values")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, i) => (
            <div
              key={value.title}
              className={`text-center p-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 relative">
                <div className="w-8 h-8 rotate-45 bg-gradient-to-br from-gold/80 via-gold-light to-gold/60 animate-diamond-shine shadow-[0_0_15px_rgba(231,188,103,0.3)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rotate-45 border border-gold/20 animate-diamond-shine" style={{ animationDelay: "1s" }} />
                </div>
              </div>
              <h3 className="font-serif text-xl mb-3">{value.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarqueeSection() {
  return (
    <section className="py-12 bg-black/10 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {Array.from({ length: 12 }).map((_, i) => (
          <img
            key={i}
            src={logoImg}
            alt="Mirruba"
            className="h-8 w-auto mx-12 opacity-30 brightness-150"
          />
        ))}
      </div>
    </section>
  );
}

export default function About() {
  return (
    <main>
      <HeroBanner />
      <StorySection />
      <ValuesSection />
      <MarqueeSection />
    </main>
  );
}
