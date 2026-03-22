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
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import { FloatingShape } from './components/Layout/FloatingShape';

function HomePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-accent selection:text-black font-sans overflow-x-hidden">
      {/* Ambient background orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />

      <CustomCursor />
      <Navbar />

      <main className="relative z-10 w-full flex flex-col items-stretch">

        <div className="relative">
          <Hero />
          <FloatingShape type="torus" size={170} color="#E5C07B"
            rotationSpeed={[0.15, 0.35, 0.08]}
            style={{ top: '12%', right: '3%', zIndex: 20 }} />
          <FloatingShape type="tetrahedron" size={90} color="#ffffff"
            rotationSpeed={[0.5, 0.3, 0.2]}
            style={{ top: '55%', left: '2%', zIndex: 20 }} />
        </div>

        <div className="relative">
          <Services />
          <FloatingShape type="octahedron" size={120} color="#ffffff"
            rotationSpeed={[0.4, 0.2, 0.3]}
            style={{ top: '20%', left: '1%', zIndex: 20 }} />
          <FloatingShape type="torus2" size={100} color="#E5C07B"
            rotationSpeed={[0.1, 0.55, 0.2]}
            style={{ top: '60%', right: '2%', zIndex: 20 }} />
        </div>

        <div className="relative">
          <Work />
          <FloatingShape type="torusKnot" size={150} color="#E5C07B"
            rotationSpeed={[0.2, 0.5, 0.15]}
            style={{ top: '15%', right: '2%', zIndex: 20 }} />
          <FloatingShape type="sphere" size={100} color="#ffffff"
            rotationSpeed={[0.3, 0.3, 0.3]}
            style={{ top: '60%', left: '1%', zIndex: 20 }} />
        </div>

        <div className="relative">
          <About />
          <FloatingShape type="icosahedron" size={110} color="#ffffff"
            rotationSpeed={[0.3, 0.25, 0.4]}
            style={{ top: '25%', left: '2%', zIndex: 20 }} />
          <FloatingShape type="cone" size={95} color="#E5C07B"
            rotationSpeed={[0.25, 0.45, 0.1]}
            style={{ top: '55%', right: '3%', zIndex: 20 }} />
        </div>

        <div className="relative">
          <Contact />
          <FloatingShape type="dodecahedron" size={130} color="#E5C07B"
            rotationSpeed={[0.18, 0.38, 0.12]}
            style={{ top: '20%', right: '4%', zIndex: 20 }} />
          <FloatingShape type="torusKnot2" size={105} color="#ffffff"
            rotationSpeed={[0.35, 0.2, 0.5]}
            style={{ top: '55%', left: '2%', zIndex: 20 }} />
        </div>

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
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
