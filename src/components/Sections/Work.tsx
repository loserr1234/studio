import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../../data/projects';

// Only show these 3 on the home page, in this order
const workProjects = [
  projects.find(p => p.title === 'JD & Dark Website')!,
  projects.find(p => p.title === 'School ERP System')!,
];

const PANEL_COUNT = workProjects.length + 1; // +1 for the "View All" panel

const CSS = `
  @keyframes wk-ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .wk-ticker { animation: wk-ticker 22s linear infinite; }
  @media (prefers-reduced-motion: reduce) { .wk-ticker { animation: none; } }

  .wk-reveal-title {
    transform: translateY(105%);
    will-change: transform;
    transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .wk-reveal-title.active {
    transform: translateY(0);
  }

  .wk-fade {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1);
  }
  .wk-fade.active { opacity: 1; transform: translateY(0); }

  .wk-card {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1),
                transform 0.75s cubic-bezier(0.16,1,0.3,1);
  }
  .wk-card.active { opacity: 1; transform: translateY(0); }

  .wk-line {
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .wk-line.active { transform: scaleX(1); }
`;

export const Work = () => {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── scroll-jacking ── */
  const onFrame = useCallback(() => {
    const wrapper   = wrapperRef.current;
    const container = containerRef.current;
    const track     = trackRef.current;
    if (!wrapper || !container || !track) return;

    const rect             = wrapper.getBoundingClientRect();
    const wrapperHeight    = wrapper.offsetHeight;
    const wh               = window.innerHeight;
    const scrollableDistance = wrapperHeight - wh;
    const scrolledInto     = -rect.top;

    if (scrolledInto < 0) {
      container.style.position = 'absolute';
      container.style.top      = '0px';
      container.style.bottom   = '';
      track.style.transform    = 'translateX(0)';
    } else if (scrolledInto >= scrollableDistance) {
      container.style.position = 'absolute';
      container.style.top      = '';
      container.style.bottom   = '0px';
      track.style.transform    = `translateX(-${(PANEL_COUNT - 1) * 100}vw)`;
      setActiveIndex(PANEL_COUNT - 1);
    } else {
      container.style.position = 'fixed';
      container.style.top      = '0px';
      container.style.bottom   = '';
      const progress   = scrolledInto / scrollableDistance;
      const translateX = -(progress * (PANEL_COUNT - 1) * 100);
      track.style.transform = `translateX(${translateX}vw)`;
      setActiveIndex(Math.min(PANEL_COUNT - 1, Math.round(progress * (PANEL_COUNT - 1))));
    }
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let rafId: number;
    const loop = () => { onFrame(); rafId = requestAnimationFrame(loop); };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [onFrame, isMobile]);

  /* ── mouse tilt — RAF-throttled so it never fires faster than the display refresh ── */
  useEffect(() => {
    let rafId: number;
    const h = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMouse({
          x: (e.clientX / window.innerWidth  - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
      });
    };
    window.addEventListener('mousemove', h, { passive: true });
    return () => { window.removeEventListener('mousemove', h); cancelAnimationFrame(rafId); };
  }, []);

  const handleProjectClick = (projectIndex: number) => {
    navigate(`/projects#project-${projectIndex}`);
  };

  /* ── Mobile: simple vertical stack ── */
  if (isMobile) {
    return (
      <>
        <style>{CSS}</style>
        <section id="work" className="w-full relative z-10 bg-[#060606] py-20 px-6">
          <p className="text-[8.5px] tracking-[0.5em] uppercase text-white/20 font-light mb-10">
            Selected Work
          </p>
          <div className="flex flex-col gap-10">
            {workProjects.map((project, index) => (
              <div key={project.title} className="flex flex-col gap-4">
                {/* Card */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${project.title} case study`}
                  onClick={() => handleProjectClick(project.index)}
                  onKeyDown={e => e.key === 'Enter' && handleProjectClick(project.index)}
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: '1rem',
                    aspectRatio: '4/3',
                    background: '#0f0f0f',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-25 mix-blend-luminosity"
                    style={{ pointerEvents: 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                  {/* Top */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                    <span className="text-[8px] tracking-[0.3em] uppercase font-medium text-white/50">
                      {project.category}
                    </span>
                    <span className="text-white/20 text-[9px] tabular-nums tracking-widest">
                      {project.year}
                    </span>
                  </div>
                  {/* Bottom */}
                  <div className="absolute bottom-0 inset-x-0 px-4 py-3 flex items-center justify-between">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-2 text-white/30 text-[8.5px] tracking-[0.3em] uppercase"
                    >
                      View Live <ArrowUpRight size={10} aria-hidden="true" />
                    </a>
                    <span className="text-white/15 text-[8px] tabular-nums">
                      {String(index + 1).padStart(2, '0')} / {String(workProjects.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                {/* Text */}
                <div className="flex flex-col gap-3">
                  <h3
                    className="font-bold tracking-tighter leading-[0.9]"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 8vw, 3rem)' }}
                  >
                    {project.displayTitle}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map(t => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-[8px] text-white/30 font-light tracking-wide"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* View all */}
            <div className="flex flex-col items-center gap-6 text-center pt-6">
              <h3
                className="font-bold tracking-tighter leading-[0.9]"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 10vw, 4rem)' }}
              >
                See everything<br />
                <span className="italic text-accent">we've built.</span>
              </h3>
              <Link
                to="/projects"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-black text-sm font-semibold tracking-wide uppercase"
              >
                View All Projects <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>

      <section
        id="work"
        ref={wrapperRef}
        className="w-full relative z-10"
        style={{ height: `${PANEL_COUNT * 140}vh` }}
      >
        <div
          ref={containerRef}
          className="left-0 w-full h-screen overflow-hidden"
          style={{ position: 'absolute', top: 0, background: '#060606' }}
        >

          {/* ── Grain overlay ── */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-[1] opacity-[0.035]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
            }}
          />

          {/* ── Horizontal track ── */}
          <div
            ref={trackRef}
            className="flex h-full"
            style={{ width: `${PANEL_COUNT * 100}vw`, willChange: 'transform' }}
          >
            {workProjects.map((project, index) => {
              const active = activeIndex === index;
              const a = active ? ' active' : '';
              const ticker = [...project.tech, ...project.tech, ...project.tech, ...project.tech];

              return (
                <div
                  key={project.title}
                  className="relative w-screen h-screen flex-shrink-0 overflow-hidden"
                >
                  {/* Ghost project number */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-end justify-end pb-8 pr-10 pointer-events-none select-none overflow-hidden z-[2]"
                  >
                    <span
                      className="font-bold leading-none tabular-nums"
                      style={{
                        fontSize: 'clamp(140px, 22vw, 300px)',
                        fontFamily: "'Playfair Display', serif",
                        color: 'rgba(255,255,255,0.025)',
                        letterSpacing: '-0.05em',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* ── Layout ── */}
                  <div className="relative z-10 h-full grid grid-cols-[48%_52%] items-center px-8 md:px-14 lg:px-20 gap-12 lg:gap-20">

                    {/* ── LEFT: Card ── */}
                    <div className={`wk-card${a} flex flex-col`}>

                      {index === 0 && (
                        <p className="text-[8.5px] tracking-[0.5em] uppercase text-white/20 font-light mb-5">
                          Selected Work
                        </p>
                      )}

                      {/* Clickable card — data-cursor triggers "View" cursor */}
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label={`View ${project.title} case study`}
                        data-cursor="project"
                        onClick={() => handleProjectClick(project.index)}
                        onKeyDown={e => e.key === 'Enter' && handleProjectClick(project.index)}
                        className="relative overflow-hidden group"
                        style={{
                          borderRadius: '1.25rem',
                          aspectRatio: '4/3',
                          background: '#0f0f0f',
                          border: '1px solid rgba(255,255,255,0.06)',
                          transform: `perspective(1100px) rotateY(${mouse.x * 3.5}deg) rotateX(${-mouse.y * 3.5}deg)`,
                          transition: 'transform 0.2s ease-out',
                          boxShadow: '0 60px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
                          cursor: 'none',
                        }}
                      >
                        {/* Screenshot */}
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover object-top opacity-25 mix-blend-luminosity scale-[1.05] group-hover:scale-100 group-hover:opacity-40"
                          style={{ transition: 'transform 1.2s ease-out, opacity 0.8s ease', pointerEvents: 'none' }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                        {/* Card grain */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
                            backgroundSize: '120px 120px',
                          }}
                        />

                        {/* Top: category + year */}
                        <div className="absolute top-5 inset-x-5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-accent opacity-70 flex-shrink-0" />
                            <span className="text-[8px] tracking-[0.3em] uppercase font-medium text-white/50">
                              {project.category}
                            </span>
                          </div>
                          <span className="text-white/20 text-[9px] font-light tabular-nums tracking-widest">
                            {project.year}
                          </span>
                        </div>

                        {/* Tech ticker */}
                        <div className="absolute bottom-14 inset-x-0 overflow-hidden border-y border-white/[0.06] py-[6px] bg-black/30 backdrop-blur-sm">
                          <div className="flex whitespace-nowrap wk-ticker" aria-hidden="true">
                            {ticker.map((t, i) => (
                              <span key={i} className="text-white/25 text-[7.5px] tracking-[0.28em] uppercase px-5 flex-shrink-0">
                                {t}
                                <span className="ml-5 text-accent/40">·</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom bar */}
                        <div className="absolute bottom-0 inset-x-0 px-5 py-4 flex items-center justify-between">
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="group/v flex items-center justify-center gap-2 text-white/30 hover:text-white/70 text-[8.5px] tracking-[0.3em] uppercase focus-visible:outline-none btn-dot"
                            style={{ transition: 'color 0.25s ease' }}
                          >
                            <span className="relative z-10 flex items-center">View Live</span>
                            <ArrowUpRight size={10} aria-hidden="true" className="group-hover/v:translate-x-0.5 group-hover/v:-translate-y-0.5 relative z-10" style={{ transition: 'transform 0.2s ease' }} />
                          </a>
                          <span className="text-white/15 text-[8px] tabular-nums">
                            {String(index + 1).padStart(2, '0')} / {String(PANEL_COUNT).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Hover shimmer */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
                            transition: 'opacity 0.6s ease',
                          }}
                        />
                      </div>
                    </div>

                    {/* ── RIGHT: Editorial text ── */}
                    <div className="flex flex-col justify-center gap-7 pl-0 lg:pl-4">

                      {/* Counter */}
                      <div className={`wk-fade${a} flex items-center gap-4`} style={{ transitionDelay: '0.04s' }}>
                        <span className="text-[8px] tracking-[0.5em] uppercase text-white/15 font-light">
                          {String(index + 1).padStart(2, '0')} — {String(workProjects.length).padStart(2, '0')}
                        </span>
                        <div
                          className={`wk-line${a} flex-1 h-px bg-white/[0.08]`}
                          style={{ transitionDelay: '0.12s' }}
                        />
                      </div>

                      {/* Big title */}
                      <div className="overflow-hidden">
                        <h3
                          className={`wk-reveal-title${a} font-bold tracking-tighter leading-[0.9] whitespace-pre-line`}
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(2.6rem, 5vw, 5.2rem)',
                            transitionDelay: '0.1s',
                          }}
                        >
                          {project.displayTitle}
                        </h3>
                      </div>

                      {/* Category */}
                      <div className={`wk-fade${a} flex items-center gap-2.5`} style={{ transitionDelay: '0.25s' }}>
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-accent/60 flex-shrink-0" />
                        <span className="text-[8.5px] tracking-[0.4em] uppercase text-muted font-light">
                          {project.category}
                        </span>
                      </div>

                      {/* Divider */}
                      <div
                        className={`wk-line${a} h-px bg-white/[0.07]`}
                        style={{ transitionDelay: '0.3s' }}
                      />

                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t, ti) => (
                          <span
                            key={t}
                            className={`wk-fade${a} px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-[8px] text-white/30 font-light tracking-wide`}
                            style={{ transitionDelay: `${0.33 + ti * 0.05}s` }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Link */}
                      <div className={`wk-fade${a} mt-1`} style={{ transitionDelay: '0.5s' }}>
                        <button
                          onClick={() => handleProjectClick(project.index)}
                          className="group/cta inline-flex items-center gap-3 focus-visible:outline-none"
                          aria-label={`View ${project.title} case study`}
                        >
                          <div className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center group-hover/cta:bg-accent group-hover/cta:border-accent group-hover/cta:text-black" style={{ transition: 'all 0.3s ease' }}>
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </div>
                          <span className="text-[8.5px] tracking-[0.4em] uppercase text-white/20 group-hover/cta:text-white/60 font-medium btn-dot" style={{ transition: 'color 0.3s ease' }}>
                            <span className="relative z-10 flex items-center">View Project</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}

            {/* ── View All panel ── */}
            <div className="relative w-screen h-screen flex-shrink-0 overflow-hidden flex items-center justify-center">
              {/* Ghost text */}
              <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span
                  className="font-bold leading-none tracking-tighter"
                  style={{
                    fontSize: 'clamp(120px, 20vw, 260px)',
                    fontFamily: "'Playfair Display', serif",
                    color: 'rgba(255,255,255,0.018)',
                    letterSpacing: '-0.05em',
                  }}
                >
                  Work
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-8 text-center px-8">
                <p className="text-[9px] tracking-[0.5em] uppercase text-white/20 font-light">
                  All Projects
                </p>
                <h3
                  className="font-bold tracking-tighter leading-[0.9]"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(3rem, 7vw, 7rem)',
                  }}
                >
                  See everything
                  <br />
                  <span className="italic text-accent">we've built.</span>
                </h3>
                <p className="text-white/30 text-base font-light max-w-sm leading-relaxed">
                  5 projects across web, AI, automation, and custom software.
                </p>
                <Link
                  to="/projects"
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-accent text-black text-sm font-semibold tracking-wide uppercase overflow-hidden hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(229,192,123,0.3)] active:scale-[0.97] transition-all duration-300 mt-2 btn-dot"
                >
                  <span className="absolute inset-0 rounded-full bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out" />
                  <span className="relative z-10 flex items-center">View All Projects</span>
                  <span className="relative z-10 w-0 overflow-hidden group-hover:w-5 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Progress dots ── */}
          <div
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-black/40 backdrop-blur-md rounded-full px-5 py-3 border border-white/[0.06]"
            role="tablist"
            aria-label="Project indicator"
          >
            {[...workProjects.map(p => p.title), 'View All'].map((label, i) => (
              <div
                key={i}
                role="tab"
                aria-selected={activeIndex === i}
                aria-label={label}
                className="rounded-full"
                style={{
                  width:      activeIndex === i ? '18px' : '5px',
                  height:     '5px',
                  background: activeIndex === i ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)',
                  boxShadow:  activeIndex === i ? '0 0 8px rgba(229,192,123,0.6)' : 'none',
                  transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1), background 0.35s ease, box-shadow 0.35s ease',
                }}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
};
