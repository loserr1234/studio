import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateChars, animateWords } from '../../utils/gsapText';

gsap.registerPlugin(ScrollTrigger);

function ParticleCloud({ count = 6000 }) {
  const points = useRef<any>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi   = Math.acos((Math.random() * 2) - 1);
      const r     = Math.cbrt(Math.random()) * 2.5;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      points.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#ffffff" size={0.012} sizeAttenuation depthWrite={false} opacity={0.4} />
      </Points>
    </group>
  );
}

export const Hero = () => {
  const logoRef       = useRef<HTMLHeadingElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const subRef        = useRef<HTMLParagraphElement>(null);
  const particles1Ref = useRef<HTMLDivElement>(null);
  const particles2Ref = useRef<HTMLDivElement>(null);
  const screen1Ref    = useRef<HTMLElement>(null);
  const screen2Ref    = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Screen 1: "Studio." char reveal ──
      animateChars(logoRef.current, { scrollTrigger: false, delay: 0.4 });

      // ── Particle parallax scrub ──
      gsap.to(particles1Ref.current, {
        yPercent: 50, ease: 'none',
        scrollTrigger: { trigger: screen1Ref.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(particles2Ref.current, {
        yPercent: 25, ease: 'none',
        scrollTrigger: { trigger: screen2Ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      // ── Screen 2: heading word reveal on scroll ──
      animateWords(headingRef.current, { start: 'top 80%', stagger: 0.05 });

      // ── Sub paragraph word reveal ──
      animateWords(subRef.current, { start: 'top 85%', delay: 0.1, stagger: 0.04 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── Screen 1 ── */}
      <section id="hero" ref={screen1Ref} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background">
        <div ref={particles1Ref} className="absolute inset-0 z-0 opacity-70">
          <Canvas camera={{ position: [0, 0, 3] }}><ParticleCloud /></Canvas>
        </div>

        {/* GSAP char-animated logo */}
        <h1
          ref={logoRef}
          className="relative z-10 select-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(5rem, 16vw, 15rem)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'rgba(255,255,255,0.92)',
          }}
        >
          Studio<span style={{ color: '#E5C07B' }}>.</span>
        </h1>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted font-light">Scroll</span>
          <motion.span
            className="block w-px h-8 bg-muted origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>

        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>

      {/* ── Screen 2 ── */}
      <section ref={screen2Ref} className="relative w-full min-h-screen flex items-center overflow-hidden bg-background">
        <div ref={particles2Ref} className="absolute inset-0 z-0 opacity-40">
          <Canvas camera={{ position: [0, 0, 3] }}><ParticleCloud /></Canvas>
        </div>

        <div className="relative z-10 flex flex-col items-start text-left px-6 md:px-12 lg:px-20 w-full">
          {/* GSAP word-animated heading */}
          <h2
            ref={headingRef}
            className="text-4xl md:text-6xl lg:text-[5.5rem] leading-[1.1] font-bold tracking-tighter"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            We Build Websites and Systems That Help Your Business Grow
          </h2>

          <div className="mt-8 md:mt-10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <p
              ref={subRef}
              className="text-lg md:text-xl text-muted font-light max-w-lg leading-relaxed"
            >
              From clean websites to smart customer handling and automation — we help you get customers, manage them better, and save time.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 flex-shrink-0"
            >
              <a href="#contact" className="group relative inline-flex items-center gap-2 px-10 py-4 md:py-5 rounded-full bg-accent text-black text-sm md:text-base font-semibold tracking-wide uppercase overflow-hidden hover:scale-105 hover:shadow-[0_0_32px_rgba(229,192,123,0.35)] active:scale-[0.97] transition-all duration-300">
                <span className="absolute inset-0 rounded-full bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10">Let's Talk</span>
                <span className="relative z-10 w-0 overflow-hidden group-hover:w-4 transition-all duration-300 ease-in-out">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </a>
              <a href="#work" className="group relative inline-flex items-center px-10 py-4 md:py-5 rounded-full bg-white/10 border border-white/20 text-white text-sm md:text-base font-semibold tracking-wide uppercase overflow-hidden active:scale-[0.97] transition-all duration-300">
                <span className="absolute inset-0 rounded-full bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10 group-hover:text-black transition-colors duration-300 delay-100">See Work</span>
              </a>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>
    </>
  );
};
