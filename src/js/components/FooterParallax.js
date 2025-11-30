import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialise l'effet parallax sur le footer
 * Le footer remonte avec un effet de profondeur pendant le scroll
 */
export function initFooterParallax() {
    const footerWrappers = document.querySelectorAll('[data-footer-parallax]');

    if (!footerWrappers.length) return;

    footerWrappers.forEach(el => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'clamp(top bottom)',
                end: 'clamp(top top)',
                scrub: true
            }
        });

        const inner = el.querySelector('[data-footer-parallax-inner]');
        const dark = el.querySelector('[data-footer-parallax-dark]');

        if (inner) {
            tl.from(inner, {
                yPercent: -25,
                ease: 'linear'
            });
        }

        if (dark) {
            tl.from(dark, {
                opacity: 0.5,
                ease: 'linear'
            }, '<');
        }
    });
}
