import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initLocationAnimations() {
    const section = document.querySelector('.section--location');
    if (!section) return;

    const title = section.querySelector('.location__title');
    const desc = section.querySelector('.location__desc');
    const items = section.querySelectorAll('.location__item');
    const map = section.querySelector('.location__map-wrapper');

    // Timeline for content
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 70%', // Start animation when section is 70% in view
            toggleActions: 'play none none reverse'
        }
    });

    tl.from(title, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    })
        .from(desc, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.6')
        .from(items, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.4');

    // Parallax effect for map
    gsap.to(map, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}
