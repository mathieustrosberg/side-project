import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Helper to split text into words wrapped in spans
 * @param {HTMLElement} element 
 */
function splitTextToWords(element) {
    const text = element.textContent.trim();
    element.innerHTML = '';
    const words = text.split(/\s+/);
    const spans = [];

    words.forEach((word, index) => {
        // Wrapper for overflow hidden (mask)
        const wrapper = document.createElement('span');
        wrapper.style.display = 'inline-block';
        wrapper.style.overflow = 'hidden';
        wrapper.style.verticalAlign = 'top';
        wrapper.style.marginRight = '0.25em'; // Space between words

        // Inner span for animation
        const span = document.createElement('span');
        span.textContent = word;
        span.style.display = 'inline-block';
        span.style.transform = 'translateY(100%)'; // Initial state

        wrapper.appendChild(span);
        element.appendChild(wrapper);
        spans.push(span);
    });

    return spans;
}

/**
 * Initialize text reveal animations
 */
export function initTextReveal() {
    const revealElements = document.querySelectorAll('[data-text-reveal]');

    revealElements.forEach(element => {
        // Check if it's a title (h1, h2, etc) or forced title via attribute
        const isTitle = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName) ||
            element.getAttribute('data-text-reveal') === 'title' ||
            element.classList.contains('footer__logo');

        if (isTitle) {
            // Split titles into words for staggered reveal
            const chars = splitTextToWords(element);

            gsap.to(chars, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%", // Trigger when top of element hits 85% of viewport height
                    toggleActions: "play none none reverse"
                },
                y: 0,
                duration: 1,
                ease: "power4.out",
                stagger: 0.05
            });
        } else {
            // For paragraphs, simple fade up
            gsap.fromTo(element,
                {
                    y: 30,
                    opacity: 0
                },
                {
                    scrollTrigger: {
                        trigger: element,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }
            );
        }
    });
}
