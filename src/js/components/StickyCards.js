import stickyCardsData from "../../data/stickyCards";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Initialise la section Sticky Cards
 * Crée des cartes empilées avec des animations au scroll
 */
export function initStickyCards() {
    // Récupère le conteneur des cartes
    const container = document.querySelector(".sticky-cards");

    // Si le conteneur n'existe pas, on sort
    if (!container) return;

    // Crée les cartes à partir des données
    stickyCardsData.forEach((cardData, index) => {
        const card = document.createElement("div");
        card.className = "sticky-card";
        // Applique la couleur de fond définie dans les données
        card.style.backgroundColor = cardData.backgroundColor;
        container.appendChild(card);
    });

    // Récupère toutes les cartes créées
    const stickyCards = document.querySelectorAll(".sticky-card");

    // Pour chaque carte (sauf la dernière)
    stickyCards.forEach((card, index) => {
        // Crée un ScrollTrigger pour piner chaque carte
        if (index < stickyCards.length - 1) {
            ScrollTrigger.create({
                trigger: card, // La carte actuelle est le trigger
                start: "top top", // Démarre quand le haut de la carte atteint le haut de la fenêtre
                endTrigger: stickyCards[stickyCards.length - 1], // Se termine quand la dernière carte arrive
                end: "top top", // Se termine quand le haut de la dernière carte atteint le haut
                pin: true, // Épingle la carte pendant le scroll
                pinSpacing: false, // Ne réserve pas d'espace supplémentaire (les cartes se superposent)
            });
        }

        // Crée un ScrollTrigger pour animer la carte lors du scroll
        if (index < stickyCards.length - 1) {
            ScrollTrigger.create({
                trigger: stickyCards[index + 1], // La carte suivante est le trigger
                start: "top bottom", // Démarre quand le haut de la carte suivante atteint le bas de la fenêtre
                end: "top top", // Se termine quand le haut de la carte suivante atteint le haut
                onUpdate: (self) => {
                    // Progress de 0 à 1 pendant le scroll
                    const progress = self.progress;
                    // Réduit l'échelle de 25% au maximum (de 1 à 0.75)
                    const scale = 1 - progress * 0.25;
                    // Rotation alternée : +5° pour les index pairs, -5° pour les impairs
                    const rotation = (index % 2 === 0 ? 5 : -5) * progress;
                    // Opacité de l'overlay (de 0 à 1)
                    const afterOpacity = progress;

                    // Applique les transformations à la carte
                    gsap.set(card, {
                        scale: scale, // Échelle réduite
                        rotation: rotation, // Rotation
                        "--after-opacity": afterOpacity, // Variable CSS pour l'opacité de l'overlay
                    });
                },
            });
        }
    });
}


