import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateWords } from '../../utils/gsapText';

gsap.registerPlugin(ScrollTrigger);

export const Contact = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading word reveal on scroll
      animateWords(headingRef.current, { start: 'top 80%', stagger: 0.05 });

      // Buttons stagger in
      gsap.fromTo('.contact-cta-btn',
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 0.7, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.contact-cta-btn', start: 'top 90%', toggleActions: 'play none none reverse' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="w-full py-32 md:py-48 px-6 bg-background relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32 items-start lg:items-center">
        <div className="flex-[1.4] w-full">
          <h2
            ref={headingRef}
            className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-8 leading-[1.05] whitespace-normal overflow-visible"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Stop wasting time on things that don't grow your business.
          </h2>
          <motion.p
            className="text-muted text-xl md:text-2xl max-w-md font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Let's build something useful.
          </motion.p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <a
            href="/contact"
            className="contact-cta-btn group relative inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-accent text-black text-sm md:text-base font-semibold tracking-wide uppercase overflow-hidden hover:scale-110 hover:shadow-[0_0_40px_rgba(229,192,123,0.4)] active:scale-[0.97] transition-all duration-300 w-fit"
            style={{ opacity: 0 }}
          >
            <span className="absolute inset-0 rounded-full bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10">Start Your Project</span>
            <span className="relative z-10 w-0 overflow-hidden group-hover:w-4 transition-all duration-300 ease-in-out">
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </span>
          </a>

        </div>
      </div>
    </section>
  );
};
