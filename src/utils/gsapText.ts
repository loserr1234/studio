import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Split element's text into char spans and animate them in */
export function animateChars(
  el: HTMLElement | null,
  opts: { delay?: number; once?: boolean; scrollTrigger?: boolean; start?: string } = {}
) {
  if (!el) return;
  const original = el.textContent || '';
  el.setAttribute('aria-label', original);
  el.innerHTML = original
    .split('')
    .map(ch =>
      ch === ' '
        ? '<span style="display:inline-block;min-width:0.28em"> </span>'
        : `<span class="g-ch-wrap" style="display:inline-block;"><span class="g-ch" style="display:inline-block;">${ch}</span></span>`
    )
    .join('');
  const chars = Array.from(el.querySelectorAll<HTMLElement>('.g-ch'));
  const animProps: gsap.TweenVars = {
    y: 0,
    opacity: 1,
    rotateX: 0,
    duration: 0.7,
    ease: 'expo.out',
    stagger: 0.028,
    delay: opts.delay ?? 0,
  };
  if (opts.scrollTrigger !== false) {
    animProps.scrollTrigger = {
      trigger: el,
      start: opts.start ?? 'top 85%',
      toggleActions: opts.once ? 'play none none none' : 'play none none reverse',
    };
  }
  gsap.fromTo(chars, { y: '110%', opacity: 0, rotateX: -30 }, animProps);
}

/** Scramble each character through random glyphs before landing on the real letter */
export function animateScramble(
  el: HTMLElement | null,
  opts: { delay?: number; cyclesPerChar?: number; speed?: number; scrollTrigger?: boolean; start?: string } = {}
) {
  if (!el) return;

  const runScramble = () => {
    const original = el.textContent || '';
    el.setAttribute('aria-label', original);

    const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!';
    const delay       = opts.delay ?? 0;
    const cyclesBase  = opts.cyclesPerChar ?? 14;
    const speed       = opts.speed ?? 0.038;

    el.innerHTML = original
      .split('')
      .map(ch =>
        ch === ' '
          ? '<span style="display:inline-block;min-width:0.28em"> </span>'
          : `<span class="s-ch" data-final="${ch}" style="display:inline-block;opacity:0">${ch}</span>`
      )
      .join('');

    const spans = Array.from(el.querySelectorAll<HTMLElement>('.s-ch'));
    spans.forEach((span, i) => {
      const finalChar = span.dataset.final!;
      const cycles    = cyclesBase + Math.floor(Math.random() * 6);
      const startAt   = delay + i * 0.055;
      gsap.delayedCall(startAt, () => {
        gsap.set(span, { opacity: 1 });
        let count = 0;
        const tick = () => {
          if (count < cycles) {
            span.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            count++;
            gsap.delayedCall(speed, tick);
          } else {
            span.textContent = finalChar;
            if (finalChar === '.') span.style.color = '#E5C07B';
          }
        };
        tick();
      });
    });
  };

  if (opts.scrollTrigger !== false) {
    ScrollTrigger.create({
      trigger: el,
      start: opts.start ?? 'top 85%',
      once: true,
      onEnter: runScramble,
    });
  } else {
    runScramble();
  }
}

/** Mask push-up reveal — each word slides up from behind an overflow:hidden wrapper (no opacity, pure positional) */
export function animateLineReveal(
  el: HTMLElement | null,
  opts: { delay?: number; once?: boolean; scrollTrigger?: boolean; start?: string; stagger?: number } = {}
) {
  if (!el) return;
  const original = el.textContent || '';
  el.setAttribute('aria-label', original);
  el.innerHTML = original
    .trim()
    .split(/\s+/)
    .map(
      w =>
        `<span class="ln-wrap" style="display:inline-block;overflow:hidden;margin-right:0.3em;vertical-align:bottom"><span class="ln-wd" style="display:inline-block;">${w}</span></span>`
    )
    .join('');
  const words = Array.from(el.querySelectorAll<HTMLElement>('.ln-wd'));
  const animProps: gsap.TweenVars = {
    y: 0,
    duration: 0.85,
    ease: 'power4.out',
    stagger: opts.stagger ?? 0.06,
    delay: opts.delay ?? 0,
  };
  if (opts.scrollTrigger !== false) {
    animProps.scrollTrigger = {
      trigger: el,
      start: opts.start ?? 'top 85%',
      toggleActions: opts.once ? 'play none none none' : 'play none none reverse',
    };
  }
  gsap.fromTo(words, { y: '115%' }, animProps);
}

/** Blur materialise — words fade in from blur, creating a cinematic "focus" entrance */
export function animateBlurIn(
  el: HTMLElement | null,
  opts: { delay?: number; once?: boolean; scrollTrigger?: boolean; start?: string; stagger?: number } = {}
) {
  if (!el) return;
  const original = el.textContent || '';
  el.setAttribute('aria-label', original);
  el.innerHTML = original
    .trim()
    .split(/\s+/)
    .map(w => `<span class="bl-wd" style="display:inline-block;margin-right:0.28em;">${w}</span>`)
    .join('');
  const words = Array.from(el.querySelectorAll<HTMLElement>('.bl-wd'));
  const animProps: gsap.TweenVars = {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    duration: 0.95,
    ease: 'power3.out',
    stagger: opts.stagger ?? 0.07,
    delay: opts.delay ?? 0,
  };
  if (opts.scrollTrigger !== false) {
    animProps.scrollTrigger = {
      trigger: el,
      start: opts.start ?? 'top 85%',
      toggleActions: opts.once ? 'play none none none' : 'play none none reverse',
    };
  }
  gsap.fromTo(words, { opacity: 0, filter: 'blur(16px)', y: 10 }, animProps);
}

/** Skew slide — words enter from the left with an editorial skewX twist */
export function animateSkewReveal(
  el: HTMLElement | null,
  opts: { delay?: number; once?: boolean; scrollTrigger?: boolean; start?: string; stagger?: number } = {}
) {
  if (!el) return;
  const original = el.textContent || '';
  el.setAttribute('aria-label', original);
  el.innerHTML = original
    .trim()
    .split(/\s+/)
    .map(
      w =>
        `<span class="sk-wrap" style="display:inline-block;overflow:hidden;margin-right:0.28em;"><span class="sk-wd" style="display:inline-block;">${w}</span></span>`
    )
    .join('');
  const words = Array.from(el.querySelectorAll<HTMLElement>('.sk-wd'));
  const animProps: gsap.TweenVars = {
    x: 0,
    opacity: 1,
    skewX: 0,
    duration: 0.9,
    ease: 'expo.out',
    stagger: opts.stagger ?? 0.08,
    delay: opts.delay ?? 0,
  };
  if (opts.scrollTrigger !== false) {
    animProps.scrollTrigger = {
      trigger: el,
      start: opts.start ?? 'top 85%',
      toggleActions: opts.once ? 'play none none none' : 'play none none reverse',
    };
  }
  gsap.fromTo(words, { x: -60, opacity: 0, skewX: 14 }, animProps);
}

/** Split element's text into word spans and animate them in */
export function animateWords(
  el: HTMLElement | null,
  opts: { delay?: number; once?: boolean; scrollTrigger?: boolean; start?: string; stagger?: number } = {}
) {
  if (!el) return;
  const original = el.textContent || '';
  el.setAttribute('aria-label', original);
  el.innerHTML = original
    .trim()
    .split(/\s+/)
    .map(
      w =>
        `<span class="g-wd-wrap" style="display:inline-block;margin-right:0.28em"><span class="g-wd" style="display:inline-block;">${w}</span></span>`
    )
    .join('');
  const words = Array.from(el.querySelectorAll<HTMLElement>('.g-wd'));
  const animProps: gsap.TweenVars = {
    y: 0,
    opacity: 1,
    duration: 0.75,
    ease: 'power4.out',
    stagger: opts.stagger ?? 0.06,
    delay: opts.delay ?? 0,
  };
  if (opts.scrollTrigger !== false) {
    animProps.scrollTrigger = {
      trigger: el,
      start: opts.start ?? 'top 85%',
      toggleActions: opts.once ? 'play none none none' : 'play none none reverse',
    };
  }
  gsap.fromTo(words, { y: '100%', opacity: 0 }, animProps);
}
