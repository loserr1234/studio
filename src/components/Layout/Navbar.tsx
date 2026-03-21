import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const primaryLinks = ["Solutions", "Work", "About", "Contact"];
const secondaryLinks = [
  { label: "Services",     href: "/services" },
  { label: "About Us",     href: "#about"    },
  { label: "Get in Touch", href: "/contact"  },
];

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

  /* ── overlay animation variants ── */
  const overlayVariants = prefersReduced
    ? {
        hidden:  { opacity: 0 },
        visible: { opacity: 1 },
        exit:    { opacity: 0 },
      }
    : {
        hidden:  { clipPath: 'inset(0 0 100% 0)' },
        visible: { clipPath: 'inset(0 0 0% 0)'   },
        exit:    { clipPath: 'inset(0 0 100% 0)'  },
      };

  const overlayTransition = prefersReduced
    ? { duration: 0.25 }
    : { duration: 0.8, ease: EASE_CURTAIN };

  const exitTransition = prefersReduced
    ? { duration: 0.2 }
    : { duration: 0.55, ease: EASE_CURTAIN };

  return (
    <>
      {/* ── Fixed logo — always top-left ── */}
      <a
        href="#"
        className="fixed top-5 left-6 z-[70] text-3xl font-bold tracking-tighter hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        style={{ transition: 'color 0.3s ease' }}
      >
        Studio.
      </a>

      {/* ── Regular navbar — absolute, scrolls away with page ── */}
      <header className="absolute top-0 inset-x-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-end">
          <nav className="hidden md:flex items-center gap-8" aria-label="Top navigation">
            {["Solutions", "Work", "About"].map((item) => (
              <a
                key={item}
                href={item === "Solutions" ? "/services" : item === "Work" ? "/projects" : `#${item.toLowerCase()}`}
                className="text-xs uppercase tracking-widest font-medium text-muted hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                style={{ transition: 'color 0.3s ease' }}
              >
                {item}
              </a>
            ))}
            <a
              href="/contact"
              className="text-xs uppercase tracking-widest font-medium bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{ transition: 'background-color 0.3s ease' }}
            >
              Get in touch
            </a>
          </nav>
          <button
            className="md:hidden text-foreground text-sm tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
            aria-label="Open navigation menu"
            onClick={() => setMenuOpen(true)}
          >
            Menu
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
            className="fixed top-[1.4rem] right-6 z-[70] w-10 h-10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          >
            {/* Two lines that morph smoothly into × */}
            <div className="relative w-6 h-[14px]">
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

      {/* ── Full-screen overlay menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="main-overlay-menu"
            key="overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={overlayTransition}
            style={prefersReduced ? {} : { willChange: 'clip-path' }}
            className="fixed inset-0 z-[65] bg-[#060606] flex flex-col px-8 md:px-14 lg:px-20 pt-28 pb-12 overflow-auto"
          >
            {/* Subtle grain overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '160px 160px',
              }}
            />

            {/* Ghost "MENU" background watermark */}
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-end justify-end px-8 md:px-14 pb-8 pointer-events-none select-none overflow-hidden"
            >
              <span
                className="text-[18vw] font-bold leading-none tracking-tighter text-white/[0.025]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Menu
              </span>
            </div>

            {/* ── MENU label ── */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.55, ease: EASE_OUT_EXPO }}
              className="text-white/25 text-[9px] tracking-[0.55em] uppercase mb-10 font-light"
            >
              Menu
            </motion.p>

            {/* ── Big editorial nav — each link staggers in ── */}
            <nav aria-label="Main navigation">
              <p
                className="text-[2.5rem] md:text-[3.5rem] lg:text-7xl font-bold tracking-tighter leading-[1.25]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {primaryLinks.map((item, i) => (
                  <motion.span
                    key={item}
                    className="inline"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.42 + i * 0.08,
                      duration: 0.6,
                      ease: EASE_OUT_EXPO,
                    }}
                  >
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={item === "Solutions" ? "/services" : item === "Work" ? "/projects" : item === "Contact" ? "/contact" : `#${item.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                      style={{ transition: 'color 0.25s ease' }}
                    >
                      {item}
                    </a>
                    {i < primaryLinks.length - 1
                      ? <span className="text-white/20">, </span>
                      : <span className="text-accent">.</span>
                    }
                  </motion.span>
                ))}
              </p>
            </nav>

            {/* ── Divider — wipes in ── */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.78, duration: 0.7, ease: EASE_OUT_EXPO }}
              className="h-px bg-white/10 mt-12 mb-8 origin-left"
            />

            {/* ── Secondary links ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88, duration: 0.5, ease: EASE_OUT_EXPO }}
              className="flex flex-wrap gap-8"
            >
              {secondaryLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-white/30 hover:text-white text-sm tracking-wide focus-visible:outline-none focus-visible:text-accent"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.12)',
                    paddingBottom: '2px',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
