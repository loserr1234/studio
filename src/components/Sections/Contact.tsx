import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateChars } from '../../utils/gsapText';

gsap.registerPlugin(ScrollTrigger);

export const Contact = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading char reveal on scroll
      animateChars(headingRef.current, { start: 'top 75%' });

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
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">
        <div className="flex-1">
          <h2
            ref={headingRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]"
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

        <div className="flex-1 flex flex-col gap-4">
          <a
            href="mailto:thoughts.09@proton.me"
            className="contact-cta-btn group relative inline-flex items-center gap-2 px-10 py-5 rounded-full bg-accent text-black text-sm md:text-base font-semibold tracking-wide uppercase overflow-hidden hover:scale-105 hover:shadow-[0_0_32px_rgba(229,192,123,0.35)] active:scale-[0.97] transition-all duration-300"
            style={{ opacity: 0 }}
          >
            <span className="absolute inset-0 rounded-full bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10">Start Your Project</span>
            <span className="relative z-10 w-0 overflow-hidden group-hover:w-4 transition-all duration-300 ease-in-out">
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </span>
          </a>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-cta-btn group relative inline-flex items-center gap-2 px-10 py-5 rounded-full bg-white/10 border border-white/20 text-white text-sm md:text-base font-semibold tracking-wide uppercase overflow-hidden active:scale-[0.97] transition-all duration-300"
            style={{ opacity: 0 }}
          >
            <span className="absolute inset-0 rounded-full bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10 group-hover:text-black transition-colors duration-300 delay-100 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
