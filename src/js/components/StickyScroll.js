import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initStickyFeatures() {
    const root = document;
    const wraps = Array.from(root.querySelectorAll("[data-sticky-feature-wrap]"));

    if (!wraps.length) return;

    wraps.forEach((w) => {
        const visualWraps = Array.from(w.querySelectorAll("[data-sticky-feature-visual-wrap]"));
        const items = Array.from(w.querySelectorAll("[data-sticky-feature-item]"));
        const progressBar = w.querySelector("[data-sticky-feature-progress]");

        if (visualWraps.length !== items.length) return;

        const count = Math.min(visualWraps.length, items.length);
        if (count < 1) return;

        // Configuration
        const DURATION = 0.75;
        const EASE = "power4.inOut";
        const SCROLL_AMOUNT = 0.9; // 90% du scroll sert à changer les items

        // Initialisation
        // On enlève le radius de l'inset pour le style carré
        if (visualWraps[0]) gsap.set(visualWraps[0], { clipPath: "inset(0% 0 0% 0)" });
        gsap.set(items[0], { autoAlpha: 1 });

        let currentIndex = 0;

        // --- FONCTIONS D'ANIMATION ---

        const getTexts = (el) => Array.from(el.querySelectorAll("[data-sticky-feature-text]"));

        // Transition principale
        function transition(fromIndex, toIndex) {
            if (fromIndex === toIndex) return;

            const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

            // Animation du CLIP-PATH (Le volet qui s'ouvre/ferme)
            if (fromIndex < toIndex) {
                // On descend : Le nouveau vient écraser l'ancien
                tl.to(visualWraps[toIndex], {
                    clipPath: "inset(0% 0 0% 0)", // Plein écran
                    duration: DURATION,
                    ease: EASE,
                }, 0);
            } else {
                // On remonte : L'ancien se referme vers le centre
                tl.to(visualWraps[fromIndex], {
                    clipPath: "inset(50% 0 50% 0)", // Fermé
                    duration: DURATION,
                    ease: EASE,
                }, 0);
            }

            animateOut(items[fromIndex]);
            animateIn(items[toIndex]);
        }

        // Animation TEXTE Sortant
        function animateOut(itemEl) {
            const texts = getTexts(itemEl);
            gsap.to(texts, {
                autoAlpha: 0,
                y: -30,
                ease: "power4.out",
                duration: 0.4,
                onComplete: () => gsap.set(itemEl, { autoAlpha: 0 }),
            });
        }

        // Animation TEXTE Entrant
        function animateIn(itemEl) {
            const texts = getTexts(itemEl);
            gsap.set(itemEl, { autoAlpha: 1 });
            gsap.fromTo(texts,
                { autoAlpha: 0, y: 30 },
                {
                    autoAlpha: 1,
                    y: 0,
                    ease: "power4.out",
                    duration: DURATION,
                    stagger: 0.1, // Effet cascade
                }
            );
        }

        // --- SCROLLTRIGGER ---

        const steps = Math.max(1, count - 1);

        ScrollTrigger.create({
            trigger: w,
            start: "top top", // Commence quand le haut de la section touche le haut de l'écran
            end: () => `+=${steps * 100}%`, // La durée du scroll dépend du nombre d'items
            pin: true, // On épingle la section
            scrub: true, // Lier l'animation au scroll
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                // Gestion de la barre de progression
                const p = Math.min(self.progress, SCROLL_AMOUNT) / SCROLL_AMOUNT;
                gsap.to(progressBar, { scaleX: p, ease: "none", duration: 0.1 });

                // Calcul de l'index actif
                let idx = Math.floor(p * steps + 1e-6);
                idx = Math.max(0, Math.min(steps, idx));

                if (idx !== currentIndex) {
                    transition(currentIndex, idx);
                    currentIndex = idx;
                }
            },
        });
    });
}