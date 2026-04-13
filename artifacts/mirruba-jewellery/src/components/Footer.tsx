import { Link } from "wouter";
import { MapPin, Phone, Mail } from "lucide-react";
import logoImg from "@assets/LogoAlaaEdited.df4b9638e3b8557a4379_(1)_1776081454867.png";

export default function Footer() {
  return (
    <footer className="bg-[#231f20] text-foreground/90 pt-8 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12 mb-6 sm:mb-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <img src={logoImg} alt="Mirruba Jewellery" className="h-10 w-auto mb-4 brightness-150" />
            <p className="text-sm leading-relaxed text-foreground/90">
              An Icon Of Absolute Femininity. We are committed to providing a unique shopping experience with the perfect jewelry pieces that suit your style.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg tracking-wider mb-4 text-gold-light">Quick Links</h4>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-3 justify-items-center md:justify-items-start">
              <Link href="/" className="text-sm text-foreground/80 hover:text-gold-light transition-colors" data-testid="link-footer-home">
                Home
              </Link>
              <Link href="/shop" className="text-sm text-foreground/80 hover:text-gold-light transition-colors" data-testid="link-footer-shop">
                Shop
              </Link>
              <Link href="/about" className="text-sm text-foreground/80 hover:text-gold-light transition-colors" data-testid="link-footer-about">
                About
              </Link>
              <Link href="/contact" className="text-sm text-foreground/80 hover:text-gold-light transition-colors" data-testid="link-footer-contact">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-serif text-lg tracking-wider mb-4 text-gold-light">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-foreground/80">
                <MapPin className="w-4 h-4 mt-0.5 text-gold-light shrink-0" />
                <span>Sharjah, Emirates, Central Market</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <Phone className="w-4 h-4 text-gold-light shrink-0" />
                <a href="tel:+971501045496" className="hover:text-gold-light transition-colors">
                  +971 501 045 496
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <Mail className="w-4 h-4 text-gold-light shrink-0" />
                <a href="mailto:contact@mirruba-jewellery.com" className="hover:text-gold-light transition-colors">
                  contact@mirruba-jewellery.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#231f20] mt-0 py-4 sm:py-5 border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-gold/90">
            &copy; {new Date().getFullYear()} Mirruba Jewellery. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-gold/70 hover:text-gold transition-colors text-sm"
              data-testid="link-terms"
            >
              Terms of Service
            </Link>
            <a
              href="#"
              className="text-gold/70 hover:text-gold transition-colors text-sm"
              data-testid="link-facebook"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-gold/70 hover:text-gold transition-colors text-sm"
              data-testid="link-instagram"
            >
              Instagram
            </a>
          </div>
        </div>
        <div className="text-center mt-3">
          <p className="text-xs text-white">
            Developed by <a href="https://mr-appss.com/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors">Mr Apps</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
