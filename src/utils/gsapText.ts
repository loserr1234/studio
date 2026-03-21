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
        : `<span class="g-ch-wrap" style="display:inline-block;overflow:hidden;"><span class="g-ch" style="display:inline-block;">${ch}</span></span>`
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
        `<span class="g-wd-wrap" style="display:inline-block;overflow:hidden;margin-right:0.28em"><span class="g-wd" style="display:inline-block;">${w}</span></span>`
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
