import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateChars, animateWords } from '../../utils/gsapText';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { number: "01", title: "Website Development", description: "High performance websites built with modern tech. Fast, mobile-first, and built to convert visitors into customers." },
  { number: "02", title: "Customer Flow Systems", description: "We design how customers find, reach, and buy from you — from first click to final payment. Fewer drop-offs, more conversions." },
  { number: "03", title: "AI Tools", description: "Custom AI agents trained on your business — for support, sales, data, or internal ops. Built and maintained by us." },
  { number: "04", title: "Automation", description: "We automate your repetitive work — follow-ups, reminders, invoicing, reports. You focus on the business, we handle the backend." },
  { number: "05", title: "Business Software", description: "Custom management systems for schools, clinics, and businesses. Your operations, digitized and automated." },
];

export const Services = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  const sectionHRef  = useRef<HTMLHeadingElement>(null);
  const titleRefs    = useRef<HTMLHeadingElement[]>([]);
  const descRefs     = useRef<HTMLParagraphElement[]>([]);
  const numRefs      = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section heading: char reveal
      animateChars(sectionHRef.current, { start: 'top 80%' });

      // Each service: number pop + title word reveal + desc fade
      titleRefs.current.forEach((el) => {
        if (!el) return;
        animateWords(el, { start: 'top 86%', stagger: 0.05 });
      });

      descRefs.current.forEach(el => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } }
        );
      });

      numRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 1, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } }
        );
      });

      // Divider lines draw in
      gsap.utils.toArray<HTMLElement>('.svc-line').forEach(line => {
        gsap.fromTo(line,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: 'expo.inOut',
            scrollTrigger: { trigger: line, start: 'top 92%', toggleActions: 'play none none reverse' } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="w-full py-32 md:py-48 px-6 bg-background relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 md:mb-32">
          <p className="text-accent text-sm tracking-[0.3em] uppercase mb-6 font-light">What We Do</p>
          <h2
            ref={sectionHRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Services &amp; Expertise
          </h2>
        </div>

        <div className="svc-line h-px bg-white/10 origin-left" style={{ scaleX: 0 }} />

        {services.map((service, i) => (
          <div key={service.number}>
            <article className="group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 py-16 md:py-20 items-start">
              <div className="md:col-span-2">
                <span
                  ref={el => { if (el) numRefs.current[i] = el; }}
                  className="text-7xl md:text-8xl lg:text-9xl font-bold text-white/[0.04] group-hover:text-accent/20 transition-colors duration-700 leading-none block"
                  style={{ fontFamily: "'Playfair Display', serif", opacity: 0 }}
                  aria-hidden="true"
                >
                  {service.number}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3
                  ref={el => { if (el) titleRefs.current[i] = el; }}
                  className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white/90 group-hover:text-foreground transition-colors duration-500 leading-[1.1]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {service.title}
                </h3>
              </div>
              <div className="md:col-span-5 md:col-start-8 flex items-start">
                <p
                  ref={el => { if (el) descRefs.current[i] = el; }}
                  className="text-white/50 text-lg md:text-xl leading-relaxed font-light group-hover:text-white/70 transition-colors duration-500"
                  style={{ opacity: 0 }}
                >
                  {service.description}
                </p>
              </div>
            </article>
            <div className={`svc-line h-px origin-left ${i === services.length - 1 ? 'bg-white/10' : 'bg-white/[0.07]'}`} style={{ scaleX: 0 }} />
          </div>
        ))}

        <div className="mt-20 md:mt-28 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <p className="text-white/30 text-base md:text-lg font-light max-w-md leading-relaxed">
            We help businesses get real customers
            <span className="text-accent"> and run better systems.</span>
          </p>
          <a
            href="/services"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white text-sm font-semibold tracking-wide uppercase overflow-hidden hover:border-accent active:scale-[0.97] transition-all duration-300 flex-shrink-0"
          >
            <span className="absolute inset-0 rounded-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10 group-hover:text-black transition-colors duration-300 delay-100">Our Services</span>
            <span className="relative z-10 group-hover:text-black transition-colors duration-300 delay-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
