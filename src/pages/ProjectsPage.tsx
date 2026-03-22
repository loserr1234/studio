import { useRef, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateChars, animateWords } from '../utils/gsapText';

gsap.registerPlugin(ScrollTrigger);
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { CustomCursor } from '../components/Layout/CustomCursor';
import { projects } from '../data/projects';
import { projectContext } from '../data/projectContext';
import { getLenis } from '../lib/lenisInstance';

const EASE = [0.16, 1, 0.3, 1] as const;

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`;

const CSS = `
  @keyframes pg-ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .pg-ticker { animation: pg-ticker 28s linear infinite; }
  @media (prefers-reduced-motion: reduce) { .pg-ticker { animation: none; } }
`;

/* ── 3D Wave Mesh for hero backdrop ── */
function WaveMesh() {
  const meshRef = useRef<any>(null);
  const geomRef = useRef<THREE.PlaneGeometry | null>(null);

  useFrame((state) => {
    if (!meshRef.current || !geomRef.current) return;
    const positions = geomRef.current.attributes.position;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const wave = Math.sin(x * 0.8 + time * 0.6) * 0.18
                 + Math.sin(y * 0.6 + time * 0.4) * 0.12
                 + Math.sin((x + y) * 0.5 + time * 0.3) * 0.1;
      positions.setZ(i, wave);
    }
    positions.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3.5, 0, 0]} position={[0, -1.2, -1]}>
      <planeGeometry args={[14, 10, 60, 40]} ref={geomRef} />
      <meshStandardMaterial
        color="#E5C07B"
        metalness={0.6}
        roughness={0.4}
        transparent
        opacity={0.06}
        wireframe
      />
    </mesh>
  );
}

function ProjectParticles() {
  const ref = useRef<any>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.025;
    ref.current.rotation.x = state.clock.elapsedTime * 0.01;
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#ffffff" size={0.008} sizeAttenuation depthWrite={false} opacity={0.3} />
    </Points>
  );
}

/* ── Thin gold progress bar at top ── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] origin-left"
      style={{ scaleX, height: '1.5px', background: 'var(--color-accent)' }}
    />
  );
}

/* ── Scrolling ticker strip ── */
function Ticker({ items }: { items: string[] }) {
  const all = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/[0.045] py-[10px]">
      <div className="flex whitespace-nowrap pg-ticker" aria-hidden="true">
        {all.map((t, i) => (
          <span key={i} className="text-white/15 text-[8px] tracking-[0.38em] uppercase px-7 flex-shrink-0">
            {t}<span className="ml-7 text-accent/30">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Hero ── */
function ProjectsHero() {
  const heroRef  = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title char reveal
      animateChars(titleRef.current, { scrollTrigger: false, delay: 0.4 });

      // Ghost "WORK" text slow parallax
      gsap.to('.pg-ghost-work', {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Hero heading scrub scale
      gsap.to('.pg-hero-heading', {
        scale: 0.92,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen flex flex-col justify-center px-8 md:px-14 lg:px-20 overflow-hidden">
      {/* Grain */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }} />

      {/* 3D wave + particles backdrop */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[4, 4, 4]} intensity={1.5} color="#E5C07B" />
          <ProjectParticles />
          <WaveMesh />
        </Canvas>
      </div>

      {/* Gold ambient glow */}
      <div aria-hidden="true" className="absolute top-[5%] left-[0%] w-[45vw] h-[50vh] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(229,192,123,0.06), transparent 70%)', filter: 'blur(60px)' }} />

      {/* Ghost "WORK" */}
      <div aria-hidden="true" className="pg-ghost-work absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden pr-[5vw]">
        <span className="font-bold leading-none" style={{
          fontSize: 'clamp(160px, 30vw, 480px)',
          fontFamily: "'Playfair Display', serif",
          color: 'rgba(255,255,255,0.02)',
          letterSpacing: '-0.05em',
        }}>Work</span>
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        {/* Label row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          className="flex items-center gap-5 mb-7"
        >
          <span className="text-[8.5px] tracking-[0.6em] uppercase text-white/20 font-light">Selected Work</span>
          <div className="h-px w-10 bg-white/10" />
          <span className="text-[8.5px] tracking-[0.45em] uppercase text-accent/55 font-light">{projects.length.toString().padStart(2,'0')} Projects</span>
        </motion.div>

        {/* Main heading — GSAP char reveal */}
        <div className="mb-6">
          <h1
            ref={titleRef}
            className="pg-hero-heading font-bold tracking-tighter leading-[0.88]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3.8rem, 11vw, 9.5rem)' }}
          >
            Our Work.
          </h1>
        </div>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.72, ease: EASE }}
          className="text-muted text-lg md:text-xl font-light max-w-sm leading-relaxed"
        >
          Real problems. Real solutions. Real results.
        </motion.p>

        {/* Project index (bottom-right) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-[-30vh] right-0 flex flex-col gap-1.5 items-end"
        >
          {projects.map((p, i) => (
            <a
              key={i}
              href={`#project-${i}`}
              className="flex items-center gap-3 group"
            >
              <span className="text-[7.5px] tracking-[0.35em] uppercase text-white/15 group-hover:text-white/40 font-light" style={{ transition: 'color 0.2s' }}>
                {p.title}
              </span>
              <span className="text-white/10 text-[8px] tabular-nums w-5 text-right">{String(i + 1).padStart(2, '0')}</span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        <span className="text-[8.5px] tracking-[0.45em] uppercase text-white/15">Scroll</span>
        <motion.span
          className="block w-px h-9 bg-white/15 origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.5, duration: 1, ease: EASE }}
        />
      </motion.div>
    </section>
  );
}

/* ── Single project section ── */
function ProjectSection({ project, index }: { project: typeof projects[0]; index: number }) {
  const ctx = projectContext.find(c => c.title === project.title);
  const sectionRef    = useRef<HTMLElement>(null);
  const projTitleRef  = useRef<HTMLHeadingElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: '-12% 0px' });

  useEffect(() => {
    const gsapCtx = gsap.context(() => {
      animateWords(projTitleRef.current, { start: 'top 80%' });
    }, sectionRef);
    return () => gsapCtx.revert();
  }, []);

  /* Parallax: image moves slower than scroll */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  /* Slow-scroll: content moves at ~30% of scroll speed */
  const contentRaw   = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const contentSlowY = useSpring(contentRaw, { stiffness: 40, damping: 20 });

  const isOdd = index % 2 !== 0;

  /* Animate helper */
  const anim = (delay: number) => ({
    animate: { opacity: inView ? 1 : 0, y: inView ? 0 : 18 },
    transition: { duration: 0.6, delay, ease: EASE },
  });

  return (
    <section
      ref={sectionRef}
      id={`project-${project.index}`}
      className="relative py-32 md:py-44 overflow-hidden border-t border-white/[0.05]"
    >
      {/* Grain */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }} />

      {/* Subtle gold smear per section */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          width: '50vw', height: '50vh',
          top: '20%', [isOdd ? 'right' : 'left']: '-10%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(229,192,123,0.04), transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Ghost number */}
      <div aria-hidden="true"
        className="absolute bottom-0 right-4 pointer-events-none select-none overflow-hidden leading-none"
      >
        <span className="font-bold tabular-nums" style={{
          fontSize: 'clamp(160px, 26vw, 360px)',
          fontFamily: "'Playfair Display', serif",
          color: 'rgba(255,255,255,0.022)',
          letterSpacing: '-0.05em',
          lineHeight: '0.85',
          display: 'block',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <motion.div style={{ y: contentSlowY }} className="relative z-10 max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
        <div className={`grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-20 items-center ${isOdd ? 'direction-rtl' : ''}`}
          style={{ direction: isOdd ? 'rtl' : 'ltr' }}
        >

          {/* ── Image card ── */}
          <motion.div
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 32 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ direction: 'ltr' }}
            className="relative overflow-hidden"
          >
            <div
              className="relative overflow-hidden group"
              style={{
                borderRadius: '1.25rem',
                aspectRatio: '4/3',
                background: '#0d0d0d',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 50px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Parallax wrapper */}
              <motion.div
                style={{ y: imgY }}
                className="absolute w-full h-[116%] top-[-8%]"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top opacity-28 mix-blend-luminosity group-hover:opacity-40"
                  style={{ transition: 'opacity 0.8s ease' }}
                />
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />

              {/* Card grain overlay */}
              <div aria-hidden="true" className="absolute inset-0 opacity-[0.055] mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: GRAIN, backgroundSize: '120px 120px' }} />

              {/* Top badges */}
              <div className="absolute top-5 inset-x-5 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-black/55 backdrop-blur-sm border border-white/[0.09] rounded-full px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-75 flex-shrink-0" aria-hidden="true" />
                  <span className="text-[7.5px] tracking-[0.3em] uppercase text-white/55">{project.category}</span>
                </div>
                <span className="text-white/20 text-[9px] font-light tabular-nums tracking-widest">{project.year}</span>
              </div>

              {/* Bottom bar */}
              <div className="absolute bottom-0 inset-x-0 px-5 py-4 flex items-end justify-between">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-white/20 text-[8px] tracking-[0.3em] uppercase mb-1">{project.category}</p>
                  <h3
                    className="text-xl md:text-2xl font-bold tracking-tighter leading-tight truncate"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {project.title}
                  </h3>
                </div>
                {project.url !== '#' && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-white/12 bg-white/[0.04] flex items-center justify-center hover:bg-accent hover:border-accent hover:text-black flex-shrink-0 btn-dot"
                    style={{ transition: 'all 0.3s ease' }}
                    aria-label={`Open ${project.title}`}
                  >
                    <ArrowUpRight size={14} aria-hidden="true" className="relative z-10" />
                  </a>
                )}
              </div>

              {/* Hover shine */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 55%)', transition: 'opacity 0.7s ease' }}
              />
            </div>
          </motion.div>

          {/* ── Text side ── */}
          <div style={{ direction: 'ltr' }} className="flex flex-col gap-6">

            {/* Counter + wipe line */}
            <motion.div {...anim(0.06)} className="flex items-center gap-4">
              <span className="text-[7.5px] tracking-[0.55em] uppercase text-white/12 font-light">
                {String(index + 1).padStart(2, '0')} — {String(projects.length).padStart(2, '0')}
              </span>
              <motion.div
                animate={{ scaleX: inView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
                className="flex-1 h-px bg-white/[0.08] origin-left"
              />
            </motion.div>

            {/* Title */}
            <div>
              <h2
                ref={projTitleRef}
                className="font-bold tracking-tighter leading-[0.9]"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.4rem, 4.8vw, 4.8rem)' }}
              >
                {project.title}
              </h2>
            </div>

            {/* Category dot */}
            <motion.div {...anim(0.24)} className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/55 flex-shrink-0" aria-hidden="true" />
              <span className="text-[8.5px] tracking-[0.42em] uppercase text-white/35 font-light">{project.category}</span>
            </motion.div>

            {/* Divider */}
            <motion.div
              animate={{ scaleX: inView ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="h-px bg-white/[0.07] origin-left"
            />

            {/* Problem / Solution / Impact */}
            {ctx && (
              <div className="flex flex-col gap-4">
                {([
                  { label: 'Problem',  content: ctx.problem,  isList: false },
                  { label: 'Solution', content: ctx.solution, isList: false },
                  { label: 'Impact',   content: ctx.impact,   isList: true  },
                ] as const).map(({ label, content, isList }, li) => (
                  <motion.div
                    key={label}
                    animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 14 }}
                    transition={{ duration: 0.6, delay: 0.35 + li * 0.1, ease: EASE }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex items-center gap-1.5 pt-[3px] w-20 flex-shrink-0">
                      <span className="w-[5px] h-[5px] rounded-full bg-accent/45 flex-shrink-0" aria-hidden="true" />
                      <span className="text-[8px] tracking-[0.28em] uppercase text-accent/60 font-medium">{label}</span>
                    </div>
                    {isList ? (
                      <ul className="flex flex-col gap-1 min-w-0">
                        {(content as string[]).map((item) => (
                          <li key={item} className="text-white/40 text-sm leading-relaxed font-light flex items-start gap-2">
                            <span className="text-accent/40 mt-[6px] flex-shrink-0 text-[8px]">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-white/40 text-sm leading-relaxed font-light min-w-0">{content as string}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Divider */}
            <motion.div
              animate={{ scaleX: inView ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
              className="h-px bg-white/[0.07] origin-left"
            />

            {/* Tech tags */}
            <motion.div {...anim(0.67)} className="flex flex-wrap gap-2">
              {project.tech.map(t => (
                <span key={t} className="px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-[8px] text-white/28 font-light tracking-wide">
                  {t}
                </span>
              ))}
            </motion.div>

            {/* CTA */}
            {project.url !== '#' && (
              <motion.div {...anim(0.76)}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 mt-1"
                  aria-label={`View ${project.title} live`}
                >
                  <div
                    className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-black"
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </div>
                  <span className="text-[8.5px] tracking-[0.42em] uppercase text-white/18 group-hover:text-white/55 font-medium" style={{ transition: 'color 0.3s ease' }}>
                    View Live
                  </span>
                </a>
              </motion.div>
            )}

          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ── CTA Footer ── */
function ProjectsFooter() {
  return (
    <section className="relative py-40 border-t border-white/[0.05] overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }} />
      <div aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="font-bold leading-none" style={{
          fontSize: 'clamp(120px, 22vw, 320px)',
          fontFamily: "'Playfair Display', serif",
          color: 'rgba(255,255,255,0.018)',
          letterSpacing: '-0.05em',
        }}>Next.</span>
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-8 md:px-14 text-center flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.85, ease: EASE }}
          className="flex flex-col items-center gap-6"
        >
          <p className="text-[8.5px] tracking-[0.6em] uppercase text-white/20">Ready to Build?</p>
          <h2
            className="font-bold tracking-tighter leading-[0.9]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}
          >
            Let's build<br />
            <span className="italic text-accent">something</span><br />
            together.
          </h2>
          <p className="text-muted font-light text-lg max-w-xs leading-relaxed">
            From idea to launch — design, development, delivery.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center justify-center gap-2.5 px-10 py-5 rounded-full bg-accent text-black font-semibold tracking-wide uppercase text-sm hover:shadow-[0_0_32px_rgba(229,192,123,0.35)] hover:scale-105 active:scale-[0.97] btn-dot"
            style={{ transition: 'all 0.3s ease' }}
          >
            <span className="relative z-10 flex items-center">Start a Project</span>
            <span className="relative z-10 w-0 overflow-hidden group-hover:w-4" style={{ transition: 'width 0.3s ease' }}>
              <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Schema ── */
const projectsItemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Studio Portfolio',
  url: 'https://www.stdn.in/projects',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'CreativeWork',
        name: 'JD & Dark Website',
        url: 'https://jd-and-dark.vercel.app',
        dateCreated: '2025',
        creator: { '@id': 'https://www.stdn.in/#organization' },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'CreativeWork',
        name: 'School ERP System',
        url: 'https://erp.stdn.in',
        dateCreated: '2026',
        creator: { '@id': 'https://www.stdn.in/#organization' },
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'CreativeWork',
        name: 'School Portfolio Website',
        url: 'https://sps-naguran.vercel.app',
        dateCreated: '2025',
        creator: { '@id': 'https://www.stdn.in/#organization' },
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'CreativeWork',
        name: 'Research AI RAG System',
        url: 'https://research-ai-navy.vercel.app',
        dateCreated: '2026',
        creator: { '@id': 'https://www.stdn.in/#organization' },
      },
    },
  ],
};

const projectsBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.stdn.in' },
    { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://www.stdn.in/projects' },
  ],
};

/* ── Page ── */
export default function ProjectsPage() {
  // Hash scroll on mount (deep-link from homepage project card)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const tryScroll = () => {
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) { setTimeout(tryScroll, 120); return; }
      // Use absolute position (getBoundingClientRect + current scrollY) so Lenis
      // doesn't add its own stale internal scroll offset on top
      const absoluteTop = el.getBoundingClientRect().top + window.scrollY + el.offsetHeight / 2 - window.innerHeight / 2;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(absoluteTop, { immediate: false, duration: 1.4 });
      } else {
        window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
      }
    };
    setTimeout(tryScroll, 600);
  }, []);

  const allTech = projects.flatMap(p => p.tech);
  const tickerItems = [...new Set(allTech), ...projects.map(p => p.category)];

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(projectsItemList)}</script>
        <script type="application/ld+json">{JSON.stringify(projectsBreadcrumb)}</script>
      </Helmet>
      <style>{CSS}</style>
      <CustomCursor />

      {/* Ambient orbs */}
      <div aria-hidden="true" className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />
      <div aria-hidden="true" className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />

      <ScrollProgress />

      {/* Fixed logo */}
      <Link
        to="/"
        className="fixed top-5 left-6 z-[70] text-4xl font-bold tracking-tighter text-white focus-visible:outline-none"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Studio.
      </Link>

      {/* Back */}
      <Link
        to="/"
        className="fixed top-6 right-6 z-[70] flex items-center gap-2 text-white/50 hover:text-white text-sm tracking-widest uppercase focus-visible:outline-none"
        style={{ transition: 'color 0.3s ease' }}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Home
      </Link>

      <main className="relative z-10">
        <ProjectsHero />

        {/* Ticker intro */}
        <Ticker items={tickerItems} />

        {/* Project sections */}
        {projects.map((project, i) => (
          <ProjectSection key={project.index} project={project} index={i} />
        ))}

        <ProjectsFooter />
      </main>
    </div>
  );
}
