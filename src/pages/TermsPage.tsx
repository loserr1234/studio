import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CustomCursor } from '../components/Layout/CustomCursor';

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-white/40 text-sm mb-12">Last updated: 22 March 2026</p>

        <div className="flex flex-col gap-10 text-white/60 text-base leading-relaxed font-light">
          <section>
            <h2 className="text-white text-lg font-semibold mb-3">1. Services</h2>
            <p>
              Studio (stdn.in) offers digital services including website development, customer flow systems,
              AI tools, business automation, and custom business software. The scope, deliverables, and timeline
              of each project are agreed upon before work begins.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">2. Payment Terms</h2>
            <p>
              Payment terms are discussed and agreed upon on a per-project basis. Typically, an advance payment
              is required before work begins, with the remaining balance due upon delivery. All fees are
              non-refundable once work has commenced unless otherwise agreed in writing.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">3. Project Terms</h2>
            <p>
              Project timelines and milestones are communicated during the proposal stage. Delays caused by
              late feedback or content from the client may extend the timeline. We reserve the right to pause
              work if payments are overdue.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">4. Intellectual Property</h2>
            <p>
              Upon full payment, all deliverables (code, designs, and assets) created specifically for your project
              are transferred to you. We retain the right to showcase the project in our portfolio unless
              otherwise agreed. Third-party tools, libraries, and assets used in the project remain subject to
              their respective licences.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">5. Limitation of Liability</h2>
            <p>
              Studio shall not be liable for any indirect, incidental, or consequential damages arising from the
              use of our services or deliverables. Our total liability is limited to the amount paid for the
              specific project in question.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">6. Modifications</h2>
            <p>
              We reserve the right to update these terms at any time. Any changes will be posted on this page
              with an updated date. Continued use of our services after changes constitutes acceptance of the
              revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">7. Contact</h2>
            <p>
              For questions about these terms, contact us at{' '}
              <a href="mailto:thoughts.09@proton.me" className="text-accent hover:underline">thoughts.09@proton.me</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
