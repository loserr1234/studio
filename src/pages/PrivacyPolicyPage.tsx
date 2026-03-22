import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CustomCursor } from '../components/Layout/CustomCursor';

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen bg-[#060606] text-white font-sans overflow-x-hidden selection:bg-accent selection:text-black">
      <CustomCursor />

      {/* Grain */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.028]"
        style={{ backgroundImage: GRAIN, backgroundSize: '280px 280px' }} />

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-20">
        <Link to="/" className="text-4xl font-bold tracking-tighter text-white focus-visible:outline-none"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Studio.
        </Link>
        <Link to="/" className="group flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors duration-300">
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Back
        </Link>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 pt-36 pb-32">
        <p className="text-accent text-[11px] tracking-[0.35em] uppercase mb-6 font-medium">Legal</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[0.95] mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Privacy Policy
        </h1>
        <p className="text-white/40 text-sm mb-12">Last updated: 22 March 2026</p>

        <div className="flex flex-col gap-10 text-white/60 text-base leading-relaxed font-light">
          <section>
            <h2 className="text-white text-lg font-semibold mb-3">1. Information We Collect</h2>
            <p>When you submit the contact form on our website, we collect the following personal information:</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-white/50">
              <li>Your name</li>
              <li>Email address</li>
              <li>Phone number (optional)</li>
              <li>Business or school name</li>
              <li>Project requirement details</li>
              <li>Budget range</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">2. How We Use Your Information</h2>
            <p>
              We use your information solely to respond to your project inquiry, discuss your requirements, and provide a quote for our services.
              We do not use your data for marketing or any other purpose beyond addressing your enquiry.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">3. Data Sharing</h2>
            <p>
              We do <strong className="text-white/80">not</strong> sell, trade, or share your personal information with any third parties.
              Your data stays with us and is used exclusively for the purpose described above.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">4. Data Security</h2>
            <p>
              We take reasonable measures to protect your personal information. However, no method of transmission over the Internet
              is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">5. Your Rights</h2>
            <p>
              You have the right to request access to, correction of, or deletion of your personal data at any time.
              To exercise these rights, please contact us at{' '}
              <a href="mailto:thoughts.09@proton.me" className="text-accent hover:underline">thoughts.09@proton.me</a>.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">6. Compliance</h2>
            <p>
              This privacy policy is designed in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India.
              We are committed to complying with all applicable data protection regulations.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">7. Contact</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at{' '}
              <a href="mailto:thoughts.09@proton.me" className="text-accent hover:underline">thoughts.09@proton.me</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
