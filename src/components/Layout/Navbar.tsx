import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const primaryLinks = ["Services", "Projects", "About", "Contact"];


/* ── Easing curves ── */
const EASE_OUT_EXPO  = [0.16, 1, 0.3, 1]   as const;
const EASE_CURTAIN   = [0.76, 0, 0.24, 1]  as const;

export const Navbar = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const prefersReduced = useReducedMotion();
  const firstLinkRef   = useRef<HTMLAnchorElement>(null);

  /* scroll detection */
  useEffect(() => {
    const fn = () => setHasScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* Escape to close */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  /* focus first link when menu opens */
  useEffect(() => {
    if (menuOpen) setTimeout(() => firstLinkRef.current?.focus(), 650);
  }, [menuOpen]);

  /* ── panel slide-in from left ── */
  const panelVariants = prefersReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : { hidden: { x: '-100%' }, visible: { x: '0%' }, exit: { x: '-100%' } };

  const panelTransition = prefersReduced
    ? { duration: 0.25 }
    : { duration: 0.65, ease: EASE_CURTAIN };



  return (
    <>
      {/* ── Fixed logo — always top-left ── */}
      <a
        href="/"
        className="group relative fixed top-5 left-6 z-[70] text-2xl font-bold tracking-tighter hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm btn-dot"
        style={{ fontFamily: "'Playfair Display', serif", transition: 'color 0.3s ease' }}
      >
        <span className="relative z-10 flex items-center">Studio.</span>
        <span className="absolute -bottom-0.5 left-0 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
      </a>

      {/* ── Regular navbar — absolute, scrolls away with page ── */}
      <header className="absolute top-0 inset-x-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-end">
          <nav className="hidden md:flex items-center gap-8" aria-label="Top navigation">
            {["Services", "Projects", "About"].map((item) => (
              <a
                key={item}
                href={item === "Services" ? "/services" : item === "Projects" ? "/projects" : `#${item.toLowerCase()}`}
                className="group relative text-xs uppercase tracking-widest font-medium text-muted hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                style={{ transition: 'color 0.3s ease' }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </a>
            ))}
            <a
              href="/contact"
              className="group relative flex items-center gap-0 text-xs uppercase tracking-widest font-medium bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 overflow-hidden hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent btn-dot"
              style={{ transition: 'border-color 0.4s ease' }}
            >
              <span className="absolute inset-0 rounded-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              <span className="relative z-10 group-hover:text-black transition-colors duration-300 delay-75 flex items-center">Get in touch</span>
              <span className="relative z-10 w-0 overflow-hidden group-hover:w-4 transition-all duration-300 group-hover:text-black">
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </span>
            </a>
          </nav>
          <button
            className="group md:hidden relative text-foreground text-sm tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm btn-dot"
            aria-label="Open navigation menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="relative z-10 flex items-center">Menu</span>
            <span className="absolute -bottom-0.5 left-0 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
          </button>
        </div>
      </header>

      {/* ── Hamburger — fixed, appears on scroll ── */}
      <AnimatePresence>
        {hasScrolled && (
          <motion.button
            key="hamburger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="main-overlay-menu"
            className="fixed top-[1.4rem] right-6 z-[70] w-10 h-10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm btn-dot"
          >
            {/* Two lines that morph smoothly into × */}
            <div className="relative w-6 h-[14px] z-10">
              <motion.span
                className="absolute top-0 left-0 w-full h-px bg-white/90 rounded-full"
                animate={menuOpen ? { y: 7, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              />
              <motion.span
                className="absolute bottom-0 left-0 w-full h-px bg-white/90 rounded-full"
                animate={menuOpen ? { y: -7, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Half-screen left panel menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Click-outside backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[64] bg-black/50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Left panel */}
            <motion.div
              id="main-overlay-menu"
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={panelTransition}
              style={prefersReduced ? {} : { willChange: 'transform' }}
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm md:w-1/2 md:max-w-md z-[65] bg-[#060606] flex flex-col px-8 md:px-12 pt-24 pb-12 overflow-auto border-r border-white/[0.06]"
            >
              {/* Subtle grain */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: '160px 160px',
                }}
              />

              {/* ── MENU label ── */}
              <motion.p
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: EASE_OUT_EXPO }}
                className="text-white/25 text-[9px] tracking-[0.55em] uppercase mb-10 font-light"
              >
                Menu
              </motion.p>

              {/* ── Primary nav links ── */}
              <nav aria-label="Main navigation" className="flex flex-col gap-1">
                {primaryLinks.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32 + i * 0.07, duration: 0.55, ease: EASE_OUT_EXPO }}
                  >
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={item === "Services" ? "/services" : item === "Projects" ? "/projects" : item === "Contact" ? "/contact" : `#${item.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                      className="group relative block text-4xl md:text-5xl font-bold tracking-tighter text-white/80 hover:text-accent focus-visible:text-accent focus-visible:outline-none leading-tight py-1 btn-dot"
                      style={{ fontFamily: "'Playfair Display', serif", transition: 'color 0.25s ease' }}
                    >
                      <span className="relative z-10 flex items-center transition-transform duration-300 ease-out group-hover:translate-x-2">{item}</span>
                      <span className="absolute bottom-1 left-0 h-px w-0 group-hover:w-16 bg-accent transition-all duration-400 ease-out" />
                    </a>
                  </motion.div>
                ))}
              </nav>

              {/* Primary nav links removed divider and secondary section as requested */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
