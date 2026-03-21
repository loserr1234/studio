import { useEffect, useState } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';

type CursorState = 'default' | 'hover' | 'project';

export const CustomCursor = () => {
  const [state, setState]     = useState<CursorState>('default');
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  const springCfg = { damping: 26, stiffness: 200, mass: 0.5 };
  const x = useSpring(0, springCfg);
  const y = useSpring(0, springCfg);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('[data-cursor="project"]')) {
        setState('project');
      } else if (t.closest('a') || t.closest('button') || t.closest('input') || t.closest('textarea')) {
        setState('hover');
      } else {
        setState('default');
      }
    };

    const down = () => setClicking(true);
    const up   = () => setClicking(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener('mousemove',  move,  { passive: true });
    window.addEventListener('mouseover',  over);
    window.addEventListener('mousedown',  down);
    window.addEventListener('mouseup',    up);
    document.documentElement.addEventListener('mouseleave', leave);
    document.documentElement.addEventListener('mouseenter', enter);

    return () => {
      window.removeEventListener('mousemove',  move);
      window.removeEventListener('mouseover',  over);
      window.removeEventListener('mousedown',  down);
      window.removeEventListener('mouseup',    up);
      document.documentElement.removeEventListener('mouseleave', leave);
      document.documentElement.removeEventListener('mouseenter', enter);
    };
  }, [x, y, visible]);

  // Don't render on touch/reduced-motion
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return null;
  }

  const sizes: Record<CursorState, number> = {
    default: 16,
    hover:   50,
    project: 108,
  };

  const size = sizes[state];
  const isDefault = state === 'default';
  const isProject = state === 'project';

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        borderRadius: '50%',
      }}
      animate={{
        width:   size,
        height:  size,
        scale:   clicking ? 0.8 : 1,
        opacity: visible ? 1 : 0,
        backgroundColor: isDefault
          ? 'rgba(229,192,123,0.9)'
          : isProject
          ? 'rgba(229,192,123,0.07)'
          : 'rgba(229,192,123,0.1)',
        borderWidth: isDefault ? 0 : 1.5,
        borderColor:  'rgba(229,192,123,0.55)',
        borderStyle: 'solid',
        boxShadow: isDefault
          ? '0 0 14px rgba(229,192,123,0.45)'
          : isProject
          ? '0 0 30px rgba(229,192,123,0.15), inset 0 0 20px rgba(229,192,123,0.05)'
          : '0 0 20px rgba(229,192,123,0.2)',
      }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence>
        {isProject && (
          <motion.span
            key="view-label"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-accent select-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: '15px',
              fontWeight: 300,
              letterSpacing: '0.02em',
            }}
          >
            View
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
