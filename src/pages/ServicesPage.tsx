import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateChars, animateWords } from '../utils/gsapText';

gsap.registerPlugin(ScrollTrigger);
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, MeshDistortMaterial, Edges } from '@react-three/drei';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CustomCursor } from '../components/Layout/CustomCursor';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const services = [
  {
    id: '01',
    title: 'Website Development',
    tagline: 'Clear, fast websites that represent your business properly.',
    description:
      'We build websites that are easy to understand, fast to use, and designed to guide users toward taking action.',
    features: [
      'Clean and modern UI design',
      'Mobile-friendly responsive layout',
      'Fast loading and smooth experience',
      'Structured for clarity and conversions',
    ],
    stat: { value: 'Outcome', label: 'Better understanding, stronger trust, more inquiries' },
    color: '#5B8DEF',
    glow: 'rgba(91,141,239,0.15)',
    shape: 'box',
  },
  {
    id: '02',
    title: 'Customer Flow Systems',
    tagline: 'Get serious customers, not just traffic.',
    description:
      'We design how customers find, reach, and buy from you — from first click to final payment. Fewer drop-offs, more conversions.',
    features: [
      'Structured landing flow before contact',
      'Filtering out low-intent users',
      'Clear customer journey design',
      'Better handling of incoming inquiries',
    ],
    stat: { value: 'Outcome', label: 'Fewer time-wasters, more relevant and ready-to-buy customers' },
    color: '#E5C07B',
    glow: 'rgba(229,192,123,0.15)',
    shape: 'torus',
  },
  {
    id: '03',
    title: 'AI Tools',
    tagline: 'Two kinds of AI. Both built for your business.',
    description:
      'We build AI systems that work in two directions — one that helps your team work smarter internally, and one that handles your customers automatically from the outside.',
    features: [
      'Internal AI: query your sales, inventory, fees, or records in plain language',
      'Works on your Google Sheets, PDFs, databases, and documents',
      'Customer AI: handles FAQs, pricing, availability, and bookings 24/7',
      'Qualifies leads before they reach you — on your website or WhatsApp',
      'Or take both together as one connected system',
    ],
    stat: { value: 'Outcome', label: 'Less manual work for your team. Faster responses for your customers. A business that runs even when you\'re not available.' },
    color: '#A78BFA',
    glow: 'rgba(167,139,250,0.15)',
    shape: 'sphere',
  },
  {
    id: '04',
    title: 'Automation',
    tagline: 'Stop doing the same thing twice.',
    description:
      'We automate the tasks that repeat every day — so your systems handle them in the background while you focus on what actually matters.',
    features: [
      'Payment and receipt automation',
      'Follow-up and reminder systems',
      'Scheduled background processes',
      'Backend workflow automation',
    ],
    stat: { value: 'Outcome', label: 'Time saved, fewer errors, smoother operations' },
    color: '#34D399',
    glow: 'rgba(52,211,153,0.15)',
    shape: 'octahedron',
  },
  {
    id: '05',
    title: 'Business Software',
    tagline: 'Run your operations without the paperwork.',
    description:
      'We build custom management systems for schools, clinics, and businesses — so your daily operations are digital, organized, and easy to manage from one place.',
    features: [
      'School and institution ERP systems',
      'Clinic and appointment management',
      'Inventory and billing systems',
      'Admin dashboards and reporting',
    ],
    stat: { value: 'Outcome', label: 'Less manual work, full visibility into your operations' },
    color: '#F472B6',
    glow: 'rgba(244,114,182,0.15)',
    shape: 'icosahedron',
  },
];

/* ─────────────────────────────────────────
   THREE.JS COMPONENTS
───────────────────────────────────────── */
function ParticleField({ count = 4000 }: { count?: number }) {
  const ref = useRef<any>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.cbrt(Math.random()) * 3.5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04;
    ref.current.rotation.x = state.clock.elapsedTime * 0.015;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#ffffff" size={0.01} sizeAttenuation depthWrite={false} opacity={0.35} />
    </Points>
  );
}

function WireframeGlobe() {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.08;
    ref.current.rotation.x = state.clock.elapsedTime * 0.04;
  });
  return (
    <mesh ref={ref} position={[3.5, 0, -2]}>
      <icosahedronGeometry args={[2.8, 1]} />
      <meshBasicMaterial color="#E5C07B" transparent opacity={0} />
      <Edges linewidth={0.8} threshold={5} color="#E5C07B" />
    </mesh>
  );
}

function FloatingShape({ shape, color }: { shape: string; color: string }) {
  const meshRef = useRef<any>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.6;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
  });

  const mat = <MeshDistortMaterial color={color} distort={0.35} speed={2} roughness={0} metalness={0.8} />;

  return (
    <mesh ref={meshRef}>
      {shape === 'box'         && <boxGeometry args={[1.4, 1.4, 1.4]} />}
      {shape === 'torus'       && <torusGeometry args={[1, 0.38, 32, 64]} />}
      {shape === 'sphere'      && <sphereGeometry args={[1.1, 64, 64]} />}
      {shape === 'octahedron'  && <octahedronGeometry args={[1.3]} />}
      {shape === 'icosahedron' && <icosahedronGeometry args={[1.2]} />}
      {mat}
    </mesh>
  );
}

/* ─────────────────────────────────────────
   ANIMATED NUMBER COUNTER
───────────────────────────────────────── */
function AnimatedStat({ value, label, color }: { value: string; label: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-60px' });
  return (
    <div ref={ref} className="mt-auto pt-8 border-t border-white/10">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl md:text-6xl font-bold tracking-tighter leading-none"
        style={{ color, fontFamily: "'Playfair Display', serif" }}
      >
        {value}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-white/40 text-sm mt-2 font-light"
      >
        {label}
      </motion.p>
    </div>
  );
}

/* ─────────────────────────────────────────
   WORD-BY-WORD REVEAL
───────────────────────────────────────── */
function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

/* ─────────────────────────────────────────
   SINGLE SERVICE SECTION
───────────────────────────────────────── */
function ServiceSection({ service, index }: { service: typeof services[0]; index: number }) {
  const ref       = useRef<HTMLDivElement>(null);
  const sTitleRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: false, margin: '-100px' });
  const isEven = index % 2 === 0;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Service title word reveal
      animateWords(sTitleRef.current, { start: 'top 80%' });

      // Glow blob parallax
      gsap.to('.svc-glow-blob', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Canvas card tilt in from side
      const canvasSide = isEven ? 30 : -30;
      gsap.fromTo('.svc-canvas-card', { x: canvasSide, opacity: 0 }, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [isEven]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex items-center py-24 px-6 md:px-14 lg:px-20 overflow-hidden"
    >
      {/* Glow blob */}
      <div
        aria-hidden="true"
        className="svc-glow-blob absolute pointer-events-none rounded-full blur-[120px]"
        style={{
          background: service.glow,
          width: '50vw', height: '50vw',
          [isEven ? 'right' : 'left']: '-10vw',
          top: '50%', transform: 'translateY(-50%)',
        }}
      />

      {/* Horizontal rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 inset-x-0 h-px origin-left"
        style={{ background: `linear-gradient(90deg, transparent, ${service.color}55, transparent)` }}
      />

      <div className={`relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}>

        {/* Text side */}
        <div className={isEven ? '' : 'lg:col-start-2'}>
          {/* Number + ID */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span
              className="text-xs tracking-[0.35em] uppercase font-medium px-3 py-1.5 rounded-full border"
              style={{ color: service.color, borderColor: `${service.color}40`, background: `${service.color}10` }}
            >
              {service.id}
            </span>
            <div className="flex-1 h-px" style={{ background: `${service.color}30` }} />
          </motion.div>

          {/* Title — GSAP word reveal */}
          <h2
            ref={sTitleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {service.title}
          </h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base font-light mb-6"
            style={{ color: service.color }}
          >
            {service.tagline}
          </motion.p>

          {/* Description */}
          <WordReveal
            text={service.description}
            className="text-white/55 text-base md:text-lg leading-relaxed font-light mb-10"
          />

          {/* Feature list */}
          <ul className="space-y-3 mb-10">
            {service.features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.35 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3 text-white/65 text-sm font-light"
              >
                <span
                  className="mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: service.color }}
                />
                {f}
              </motion.li>
            ))}
          </ul>

          {/* Stat */}
          <AnimatedStat value={service.stat.value} label={service.stat.label} color={service.color} />
        </div>

        {/* 3D canvas side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`svc-canvas-card relative h-[340px] md:h-[440px] rounded-3xl overflow-hidden ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}
          style={{
            background: `radial-gradient(ellipse at center, ${service.glow.replace('0.15', '0.35')}, #060606 70%)`,
            boxShadow: `0 0 80px ${service.color}22, 0 0 0 1px ${service.color}18`,
          }}
        >
          {/* Grid lines overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(${service.color}30 1px, transparent 1px),
                linear-gradient(90deg, ${service.color}30 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[4, 4, 4]} intensity={2} color={service.color} />
            <pointLight position={[-4, -2, -4]} intensity={1} color="#ffffff" />
            <FloatingShape shape={service.shape} color={service.color} />
          </Canvas>

          {/* Corner label */}
          <div className="absolute bottom-5 left-5 pointer-events-none">
            <span
              className="text-[9px] tracking-[0.3em] uppercase font-medium"
              style={{ color: `${service.color}80` }}
            >
              {service.title}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────── */
function ServicesHero() {
  const ref          = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y     = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title char reveal
      animateChars(heroTitleRef.current, { scrollTrigger: false, delay: 0.3 });

      // Particle canvas parallax
      gsap.to('.svchero-particles', {
        yPercent: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Gold line at top: animate width in
      gsap.fromTo('.svchero-goldline', { scaleX: 0 }, {
        scaleX: 1,
        duration: 1.4,
        ease: 'expo.inOut',
        delay: 0.5,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative w-full h-screen flex items-center overflow-hidden">
      {/* Three.js particles + wireframe globe */}
      <div className="svchero-particles absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
          <ambientLight intensity={0.3} />
          <ParticleField />
          <WireframeGlobe />
        </Canvas>
      </div>

      {/* Gold gradient line at top */}
      <div
        aria-hidden="true"
        className="svchero-goldline absolute top-0 inset-x-0 h-px origin-left"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(229,192,123,0.6), transparent)' }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14 lg:px-20"
      >
        {/* Kicker */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-accent text-xs tracking-[0.4em] uppercase mb-6 font-light"
        >
          What We Offer
        </motion.p>

        {/* Giant heading — GSAP char reveal */}
        <h1
          ref={heroTitleRef}
          className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter leading-[0.95] mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Services &amp; Expertise
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-white/50 text-lg md:text-xl font-light max-w-xl leading-relaxed"
        >
          Five focused disciplines. Every one built to make your business work better online.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
          <motion.span
            className="block w-px h-10 bg-white/20 origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}

/* ─────────────────────────────────────────
   SERVICE INDEX NAV (sticky sidebar)
───────────────────────────────────────── */
function ServiceIndexNav({ active }: { active: number }) {
  return (
    <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-4">
      {services.map((s, i) => (
        <a
          key={s.id}
          href={`#service-${s.id}`}
          className="flex items-center gap-2 group"
          aria-label={s.title}
        >
          <span
            className="block rounded-full transition-all duration-300"
            style={{
              width: active === i ? '24px' : '8px',
              height: '2px',
              background: active === i ? s.color : 'rgba(255,255,255,0.2)',
            }}
          />
          <span
            className="text-[9px] tracking-widest uppercase font-medium overflow-hidden transition-all duration-300"
            style={{
              maxWidth: active === i ? '100px' : '0px',
              opacity: active === i ? 1 : 0,
              color: s.color,
            }}
          >
            {s.title}
          </span>
        </a>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   CTA SECTION
───────────────────────────────────────── */
function ServicesCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });

  return (
    <section ref={ref} className="relative w-full py-40 px-6 md:px-14 lg:px-20 overflow-hidden border-t border-white/[0.06]">
      {/* Background glow */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[60vw] h-[40vw] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-accent text-xs tracking-[0.4em] uppercase mb-6 font-light"
        >
          Ready to build?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Stop wasting time on things<br />
          <span className="italic text-accent">that don't grow your business.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-white/45 text-lg font-light mb-12 max-w-xl mx-auto"
        >
          Let's talk about which of these services will have the biggest impact on your business right now.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-accent text-black font-semibold text-sm uppercase tracking-wide hover:bg-accent/80 active:scale-[0.97] btn-dot"
            style={{ transition: 'background-color 0.3s ease, transform 0.2s ease' }}
          >
            <span className="relative z-10 flex items-center">Start Your Project</span>
            <ArrowUpRight size={16} aria-hidden="true" className="relative z-10" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full border border-white/15 bg-white/5 text-white text-sm uppercase tracking-wide hover:bg-white hover:text-black active:scale-[0.97] btn-dot"
            style={{ transition: 'background-color 0.5s ease, color 0.5s ease' }}
          >
            <span className="relative z-10 flex items-center">Back to Home</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0);

  // Track which service is in view for sidebar nav
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    services.forEach((s, i) => {
      const el = document.getElementById(`service-${s.id}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveService(i); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Scroll to hash anchor on mount (for project deep-links from homepage)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const tryScroll = () => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        setTimeout(tryScroll, 120);
      }
    };
    setTimeout(tryScroll, 300);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <CustomCursor />
      {/* Ambient orbs */}
      <div aria-hidden="true" className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />
      <div aria-hidden="true" className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />

      {/* Fixed logo */}
      <Link
        to="/"
        className="group relative fixed top-5 left-6 z-[70] text-3xl font-bold tracking-tighter hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm btn-dot"
        style={{ transition: 'color 0.3s ease' }}
      >
        <span className="relative z-10 flex items-center">Studio.</span>
        <span className="absolute -bottom-0.5 left-0 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
      </Link>

      {/* Back button */}
      <Link
        to="/"
        className="group relative fixed top-[1.4rem] right-6 z-[70] flex items-center gap-2 text-white/50 hover:text-white text-xs tracking-widest uppercase focus-visible:outline-none btn-dot"
        style={{ transition: 'color 0.3s ease' }}
      >
        <ArrowLeft size={14} aria-hidden="true" className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="relative z-10 flex items-center">Home</span>
        <span className="absolute -bottom-0.5 left-5 h-px w-0 group-hover:w-[calc(100%-1.25rem)] bg-current/40 transition-all duration-300 ease-out" />
      </Link>

      {/* Sidebar nav */}
      <ServiceIndexNav active={activeService} />

      <main>
        {/* Hero */}
        <ServicesHero />

        {/* Services */}
        {services.map((service, index) => (
          <div key={service.id} id={`service-${service.id}`}>
            <ServiceSection service={service} index={index} />
          </div>
        ))}

        {/* CTA */}
        <ServicesCTA />
      </main>
    </div>
  );
}
