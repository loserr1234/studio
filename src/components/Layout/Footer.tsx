import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateChars } from '../../utils/gsapText';

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
  const footerRef  = useRef<HTMLElement>(null);
  const logoRef    = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      animateChars(logoRef.current, { start: 'top 90%', once: true });
      gsap.fromTo('.footer-meta > *',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: '.footer-meta', start: 'top 95%', toggleActions: 'play none none none' } }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer ref={footerRef} className="w-full py-20 md:py-32 px-6 bg-background border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <h2
          ref={logoRef}
          className="text-6xl md:text-8xl font-bold tracking-tight text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Studio.
        </h2>

        <div className="w-full h-px bg-white/10 mt-12 mb-8" />

        <div className="footer-meta flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} Studio. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-white/40 hover:text-accent transition-colors text-sm btn-dot"><span className="relative z-10 flex items-center">Twitter</span></a>
            <a href="#" className="text-white/40 hover:text-accent transition-colors text-sm btn-dot"><span className="relative z-10 flex items-center">LinkedIn</span></a>
            <a href="#" className="text-white/40 hover:text-accent transition-colors text-sm btn-dot"><span className="relative z-10 flex items-center">Instagram</span></a>
          </div>
          <button onClick={scrollToTop} className="text-white/40 hover:text-accent transition-colors duration-300 text-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm bg-transparent border-none btn-dot">
            <span className="relative z-10 flex items-center">Back to top</span>
            <svg aria-hidden="true" className="relative z-10" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5" /><path d="m5 12 7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};
