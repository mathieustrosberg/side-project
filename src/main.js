// src/js/main.js

// 0. RESET SCROLL POSITION
// Force le navigateur à revenir en haut au rafraîchissement de manière agressive
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Force le scroll en haut immédiatement au chargement du script
window.scrollTo(0, 0);

// Force aussi le scroll en haut quand on quitte la page (pour le prochain chargement)
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// 1. IMPORT DU STYLE (Correction du chemin)
// On utilise l'alias '@' configuré dans vite.config.js pour être sûr du chemin
import '@/css/style.css';

import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import de tes composants
import { initStickyFeatures } from '@/js/components/StickyScroll.js';
import { initStickyCards } from '@/js/components/StickyCards.js';
import { initFooterParallax } from '@/js/components/FooterParallax.js';
import { initContactPopup } from '@/js/components/ContactPopup.js';
import { initLocationAnimations } from '@/js/components/LocationAnimations.js';
import { initLoader } from '@/js/components/Loader.js';
import { initTextReveal } from '@/js/components/TextReveal.js';
import { initLocationPreview } from '@/js/components/LocationPreview.js';

// Enregistrement du plugin
gsap.registerPlugin(ScrollTrigger);

// 2. INITIALISATION DE LENIS (Le Smooth Scroll)
const lenis = new Lenis({
    duration: 1.2, // Vitesse du scroll (plus c'est haut, plus c'est lent/doux)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Courbe d'accélération
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

// Boucle d'animation pour Lenis
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Intégration Lenis + GSAP ScrollTrigger (Important pour éviter les décalages)
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// 3. LANCEMENT DES SCRIPTS AU CHARGEMENT DU DOM
document.addEventListener("DOMContentLoaded", () => {
    // On vérifie si les fonctions existent avant de les lancer pour éviter les erreurs
    if (typeof initStickyFeatures === 'function') initStickyFeatures();
    if (typeof initStickyCards === 'function') initStickyCards();
    if (typeof initFooterParallax === 'function') initFooterParallax();
    // On passe l'instance de Lenis à la popup pour pouvoir arrêter le scroll
    if (typeof initContactPopup === 'function') initContactPopup(lenis);
    if (typeof initLocationAnimations === 'function') initLocationAnimations();

    // Lancement du loader
    initLoader(lenis);
    initTextReveal();
    initLocationPreview();

    // Force Lenis à démarrer en haut
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true, force: true });

    console.log("Le Douze - Scripts initialisés");
});

// 4. REVEAL DU SITE (Anti-Flash)
// On attend que TOUT soit chargé (images, css, fonts)
window.addEventListener('load', () => {
    // Une dernière sécurité pour être sûr
    window.scrollTo(0, 0);
    if (typeof lenis !== 'undefined') {
        lenis.scrollTo(0, { immediate: true, force: true });
    }
    document.body.classList.add('is-loaded');
});