import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateWords } from '../../utils/gsapText';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '4+', label: 'Projects Created' },
  { value: '2+', label: 'year of hands on experience' },
  { value: '100%', label: 'Dedication' },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: '-80px' as const },
};

export const About = () => {
  const sectionRef        = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const statRefs          = useRef<HTMLSpanElement[]>([]);
  const aboutHeadRef      = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate stat numbers counting up
      const statData = [
        { target: 4, suffix: '+' },
        { target: 2,  suffix: '+' },
        { target: 100, suffix: '%' },
      ];

      statRefs.current.forEach((el, i) => {
        if (!el) return;
        const { target, suffix } = statData[i];
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reset',
          },
          onUpdate() {
            el.textContent = Math.round(obj.val) + suffix;
          },
        });
      });

      // Main heading word reveal
      animateWords(aboutHeadRef.current, { start: 'top 80%', stagger: 0.04 });

      // Philosophy list items stagger
      gsap.fromTo(
        '.philo-item',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.philo-list',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const { scrollYProgress: imgScroll } = useScroll({
    target: imageContainerRef,
    offset: ['start end', 'end start'],
  });

  const imgY           = useTransform(imgScroll,      [0, 1], ['-12%', '12%']);
  const dividerWidth   = useTransform(scrollYProgress, [0.05, 0.35], ['0%', '100%']);
  const statsDiv       = useTransform(scrollYProgress, [0.25, 0.55], ['0%', '100%']);

  const philoRaw   = useTransform(scrollYProgress, [0.5, 1], [50, -50]);
  const philoSlowY = useSpring(philoRaw, { stiffness: 40, damping: 20 });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 w-full bg-[#060606] overflow-hidden"
    >

      {/* ── Editorial Header Block (text left, image right) ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-40 md:pt-56 pb-24 md:pb-36">

        {/* Kicker */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7 }}
          className="text-[#E5C07B] text-xs md:text-sm font-medium tracking-[0.35em] uppercase mb-8"
        >
          Who We Are
        </motion.p>

        {/* Animated divider */}
        <motion.div
          className="h-px bg-white/10 mb-16 md:mb-20 origin-left"
          style={{ width: dividerWidth }}
        />

        {/* Two-column: text left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left: heading + description */}
          <div className="flex flex-col gap-10">
            <h2
              ref={aboutHeadRef}
              className="text-[clamp(2.25rem,5.5vw,5rem)] leading-[1.05] tracking-[-0.02em] text-white/90"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              We don't just build websites. We improve how you work online.
            </h2>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-white/50 text-base md:text-lg leading-relaxed font-light max-w-lg"
            >
              We improve how your business works online —
              from getting customers to handling them better.
              Everything we build is focused on practical use, not just design.
            </motion.p>
          </div>

          {/* Right: image */}
          <motion.div
            ref={imageContainerRef}
            className="relative overflow-hidden group"
            style={{ borderRadius: '1.25rem', aspectRatio: '4/5' }}
            initial={{ opacity: 0, clipPath: 'inset(8% 4% 8% 4%)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: false, margin: '-50px' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src="/about.png"
              alt="Studio workspace"
              style={{ y: imgY }}
              className="absolute inset-x-0 w-full h-[130%] -top-[15%] object-cover object-center opacity-70 group-hover:opacity-85 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#060606]/20 pointer-events-none" />

            {/* Caption */}
            <motion.p
              className="absolute bottom-6 left-6 text-white/30 text-xs tracking-[0.2em] uppercase font-light"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Crafted with intention
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* ── Stats Band ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-36">
        <motion.div
          className="h-px bg-white/10 mb-20 md:mb-28 origin-left"
          style={{ width: statsDiv }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="text-center md:text-left group/stat"
            >
              <span
                ref={el => { if (el) statRefs.current[i] = el; }}
                className="block text-[clamp(3.5rem,8vw,7rem)] leading-none font-light tracking-[-0.04em] text-[#E5C07B] mb-4 transition-colors duration-500 group-hover/stat:text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </span>
              <span className="text-white/40 text-xs md:text-sm tracking-[0.25em] uppercase font-light">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="h-px bg-white/10 mt-20 md:mt-28"
          initial={{ width: '0%' }}
          whileInView={{ width: '100%' }}
          viewport={{ once: false, margin: '-40px' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Our Philosophy ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-40 md:pb-56 flex items-center">
        <motion.div style={{ y: philoSlowY }} className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 w-full">

          <motion.div
            className="lg:col-span-5"
            {...fadeUp}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[#E5C07B] text-xs md:text-sm font-medium tracking-[0.35em] uppercase mb-6">
              Our Philosophy
            </p>
            <h3
              className="text-3xl md:text-4xl lg:text-5xl text-white/90 leading-[1.25] tracking-[-0.01em]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              We help businesses get real customers and run better systems.
            </h3>
          </motion.div>

          <motion.div
            className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center gap-8"
            {...fadeUp}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="philo-list flex flex-col gap-5">
              {[
                'More people reach your business',
                'Better quality conversations',
                'Less time wasted on unnecessary work',
                'Smoother business operations',
              ].map((item) => (
                <div key={item} className="philo-item flex items-start gap-4">
                  <span className="text-[#E5C07B]/50 mt-[6px] flex-shrink-0 text-[10px]">•</span>
                  <p className="text-white/50 text-base md:text-lg leading-relaxed font-light">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-white/30 text-base md:text-lg leading-[1.8] font-light border-t border-white/[0.07] pt-6">
              Everything we build is focused on practical use — not just design.
            </p>
          </motion.div>

        </motion.div>
      </div>

    </section>
  );
};
