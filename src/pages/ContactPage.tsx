import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateLineReveal } from '../utils/gsapText';

gsap.registerPlugin(ScrollTrigger);
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useMemo } from 'react';
import { CustomCursor } from '../components/Layout/CustomCursor';

const EASE = [0.16, 1, 0.3, 1] as const;

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`;

function FloatingTorusKnot() {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.12;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });
  return (
    <mesh ref={ref} position={[2.5, 0, 0]}>
      <torusKnotGeometry args={[1.1, 0.32, 180, 32, 2, 3]} />
      <meshStandardMaterial
        color="#E5C07B"
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.18}
      />
    </mesh>
  );
}

function ContactParticles() {
  const ref = useRef<any>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(2500 * 3);
    for (let i = 0; i < 2500; i++) {
      const r = Math.cbrt(Math.random()) * 3;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04;
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#ffffff" size={0.009} sizeAttenuation depthWrite={false} opacity={0.25} />
    </Points>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] origin-left"
      style={{ scaleX, height: '1.5px', background: '#E5C07B' }}
    />
  );
}

const SERVICES = [
  'Website Development',
  'Customer Flow Systems',
  'AI Tools',
  'Automation',
  'Business Software',
];

const BUDGETS = [
  'Under ₹10k',
  '₹10k–₹25k',
  '₹25k–₹50k',
  '₹50k+',
];

const inputBase =
  'w-full bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 text-white/90 text-base font-light placeholder:text-white/25 focus:outline-none focus:border-accent/60 focus:bg-white/[0.06] transition-all duration-300';

const labelBase =
  'block text-[11px] tracking-[0.3em] uppercase text-white/35 font-medium mb-2';

export default function ContactPage() {
  const mainRef      = useRef<HTMLElement>(null);
  const pageTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page title char reveal
      animateLineReveal(pageTitleRef.current, { scrollTrigger: false, delay: 0.5 });

      // Form field rows stagger in
      gsap.fromTo(
        '.form-field-row',
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.75,
          ease: 'power3.out',
          delay: 0.5,
        }
      );

      // Submit buttons pop in
      gsap.fromTo(
        '.submit-btns',
        { scale: 0.95, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'back.out(1.4)',
          delay: 1.2,
        }
      );
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const [form, setForm] = useState({
    name: '',
    business: '',
    service: '',
    requirement: '',
    budget: '',
    email: '',
    phone: '',
  });


  const isValid =
    form.name.trim() !== '' &&
    form.business.trim() !== '' &&
    form.service !== '' &&
    form.requirement.trim() !== '' &&
    form.budget !== '' &&
    form.email.trim() !== '';

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const buildMessage = () =>
    [
      `New project inquiry from ${form.name}`,
      ``,
      `Business: ${form.business}`,
      `Service: ${form.service}`,
      `Requirement: ${form.requirement}`,
      `Budget: ${form.budget}`,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : null,
    ]
      .filter(line => line !== null)
      .join('\n');

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = buildMessage();
    window.open(`https://wa.me/917404019891?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = buildMessage();
    const subject = `Project Inquiry — ${form.business}`;
    window.open(`mailto:bold51@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-[#060606] text-white font-sans overflow-x-hidden selection:bg-accent selection:text-black">
      <style>{`
        select option { background: #0f0f0f; color: rgba(255,255,255,0.9); }
      `}</style>

      <ScrollProgress />
      <CustomCursor />

      {/* 3D ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 4], fov: 55 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#E5C07B" />
          <pointLight position={[-5, -3, -3]} intensity={0.8} color="#ffffff" />
          <ContactParticles />
          <FloatingTorusKnot />
        </Canvas>
      </div>

      {/* Grain */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.028]"
        style={{ backgroundImage: GRAIN, backgroundSize: '280px 280px' }}
      />

      {/* Ambient orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/4 blur-[100px] pointer-events-none z-0" />

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-20">
        <Link
          to="/"
          className="group relative text-2xl font-bold tracking-tighter hover:text-accent transition-colors duration-300"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Studio.
          <span className="absolute -bottom-0.5 left-0 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
        </Link>
        <Link
          to="/"
          className="group relative flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors duration-300 btn-dot"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1 relative z-10" />
          <span className="relative z-10 flex items-center">Back</span>
          <span className="absolute -bottom-0.5 left-5 h-px w-0 group-hover:w-[calc(100%-1.25rem)] bg-current/40 transition-all duration-300 ease-out" />
        </Link>
      </header>

      <main ref={mainRef} className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 pt-36 pb-32">

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="mb-16 md:mb-20"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-accent text-[11px] tracking-[0.35em] uppercase mb-6 font-medium"
          >
            Get In Touch
          </motion.p>

          <h1
            ref={pageTitleRef}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Start a Project
          </h1>

          <p className="text-white/40 text-lg md:text-xl font-light leading-relaxed max-w-md">
            Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="h-px bg-white/8 mb-14 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
        />

        {/* Form */}
        <motion.form
          onSubmit={e => e.preventDefault()}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          className="flex flex-col gap-8"
        >
          {/* Row 1: Name + Business */}
          <div className="form-field-row grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelBase}>Your Name <span className="text-accent">*</span></label>
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={set('name')}
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelBase}>Business / School Name <span className="text-accent">*</span></label>
              <input
                type="text"
                required
                placeholder="Acme Pvt. Ltd."
                value={form.business}
                onChange={set('business')}
                className={inputBase}
              />
            </div>
          </div>

          {/* Row 2: Service + Budget */}
          <div className="form-field-row grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelBase}>Service Interested In <span className="text-accent">*</span></label>
              <select
                required
                value={form.service}
                onChange={set('service')}
                className={inputBase + ' cursor-pointer'}
              >
                <option value="" disabled>Select a service</option>
                {SERVICES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelBase}>Budget Range <span className="text-accent">*</span></label>
              <select
                required
                value={form.budget}
                onChange={set('budget')}
                className={inputBase + ' cursor-pointer'}
              >
                <option value="" disabled>Select a range</option>
                {BUDGETS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Requirement */}
          <div className="form-field-row">
            <label className={labelBase}>Brief Requirement <span className="text-accent">*</span></label>
            <textarea
              required
              rows={5}
              placeholder="Describe what you need — the problem you're solving, any specific features, timeline, etc."
              value={form.requirement}
              onChange={set('requirement')}
              className={inputBase + ' resize-none leading-relaxed'}
            />
          </div>

          {/* Row 3: Email + Phone */}
          <div className="form-field-row grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelBase}>Email Address <span className="text-accent">*</span></label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelBase}>Phone Number <span className="text-white/20">Optional</span></label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={set('phone')}
                className={inputBase}
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div className="form-field-row pt-2 flex flex-col gap-4">
            <div className="submit-btns flex flex-wrap gap-4">
              {/* WhatsApp */}
              <button
                type="submit"
                onClick={handleWhatsApp}
                disabled={!isValid}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-accent text-black text-sm font-semibold tracking-wide uppercase overflow-hidden hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(229,192,123,0.3)] active:scale-[0.97] transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none btn-dot"
              >
                <span className="absolute inset-0 rounded-full bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {/* WhatsApp icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Send via WhatsApp
                </span>
                <span className="relative z-10 w-0 overflow-hidden group-hover:w-5 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
              </button>

              {/* Email */}
              <button
                type="submit"
                onClick={handleEmail}
                disabled={!isValid}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/8 border border-white/15 text-white text-sm font-semibold tracking-wide uppercase overflow-hidden hover:border-accent/40 active:scale-[0.97] transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-white/15 btn-dot"
              >
                <span className="absolute inset-0 rounded-full bg-white/5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {/* Email icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  Send via Email
                </span>
                <span className="relative z-10 w-0 overflow-hidden group-hover:w-5 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
              </button>
            </div>

            <p className="text-white/25 text-sm font-light">
              We review every inquiry and respond within 24 hours.
            </p>
          </div>
        </motion.form>
      </main>
    </div>
  );
}
