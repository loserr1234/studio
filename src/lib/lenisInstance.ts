import type Lenis from 'lenis';

let _instance: Lenis | null = null;

export const setLenis = (l: Lenis) => { _instance = l; };
export const getLenis = () => _instance;
