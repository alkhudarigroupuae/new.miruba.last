import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/context/StoreContext";
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
          {t("getInTouch")}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
          {t("contactUs")}
        </h1>
        <div className="w-16 h-[1px] bg-gold/60 mx-auto opacity-0 animate-gold-line" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }} />
      </div>
    </section>
  );
}

function ContactFormSection() {
  const { t } = useLanguage();
  const store = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { ref, isVisible } = useInView(0.1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("messageSent"),
      description: t("messageSentDesc"),
    });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section className="py-20 sm:py-28 bg-background" data-testid="section-contact">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className={`space-y-8 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div>
              <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">{t("weLoveToHear")}</p>
              <h2 className="font-serif text-3xl sm:text-4xl mb-6">{t("letsConnect")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                {t("contactIntro")}
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="font-serif text-lg mb-1">{t("visitUs")}</h4>
                <p className="text-muted-foreground text-sm">{store.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="font-serif text-lg mb-1">{t("callUs")}</h4>
                <a href={`tel:${store.contactPhone.replace(/\s/g, "")}`} className="text-muted-foreground text-sm hover:text-gold transition-colors">
                  {store.contactPhone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="font-serif text-lg mb-1">{t("emailUs")}</h4>
                <a href={`mailto:${store.contactEmail}`} className="text-muted-foreground text-sm hover:text-gold transition-colors">
                  {store.contactEmail}
                </a>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`space-y-6 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <div>
              <input
                type="text"
                placeholder={t("namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-border py-3 px-0 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted-foreground/50"
                data-testid="input-name"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder={t("emailAddress")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-border py-3 px-0 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted-foreground/50"
                data-testid="input-email"
              />
            </div>
            <div>
              <textarea
                placeholder={t("messagePlaceholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full bg-transparent border-b border-border py-3 px-0 text-sm focus:outline-none focus:border-gold transition-colors resize-none placeholder:text-muted-foreground/50"
                data-testid="input-message"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gold text-white px-8 py-3 tracking-[0.15em] uppercase text-sm font-medium hover:bg-gold-dark transition-all duration-300 rounded"
              data-testid="button-send-message"
            >
              <Send className={`w-4 h-4 ${useLanguage().dir === 'rtl' ? 'rotate-180' : ''}`} />
              {t("sendMessage")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <main>
      <HeroBanner />
      <ContactFormSection />
    </main>
  );
}
