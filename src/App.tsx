import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { getLenis } from './lib/lenisInstance';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenis } from './lib/lenisInstance';

gsap.registerPlugin(ScrollTrigger);
import { CustomCursor } from './components/Layout/CustomCursor';
import { Navbar } from './components/Layout/Navbar';
import { Hero } from './components/Sections/Hero';
import { Services } from './components/Sections/Services';
import { Work } from './components/Sections/Work';
import { About } from './components/Sections/About';
import { Contact } from './components/Sections/Contact';
import { Footer } from './components/Layout/Footer';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';

function HomePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-accent selection:text-black font-sans overflow-x-hidden">
      {/* Ambient background orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />

      <CustomCursor />
      <Navbar />

      <main className="relative z-10 w-full flex flex-col items-stretch">
        <Hero />
        <Services />
        <Work />
        <About />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Reset Lenis internal state + window scroll together — must use lenis.scrollTo
    // so Lenis's this.scroll syncs to 0 (window.scrollTo alone doesn't update Lenis state)
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      autoRaf: false, // disable Lenis's own RAF — GSAP ticker drives it exclusively
    });
    setLenis(lenis);

    // Connect Lenis to GSAP ticker so ScrollTrigger stays in sync
    lenis.on('scroll', ScrollTrigger.update);
    const lenisRaf = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);

    // Recalculate all ScrollTrigger positions after page fully renders
    setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenisRaf);
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
