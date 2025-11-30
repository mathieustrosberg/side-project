/**
 * Gestion de la popup de contact
 * @param {Object} lenisInstance - Instance de Lenis (inutilisé ici si on utilise data-lenis-prevent + CSS)
 */
export function initContactPopup(lenisInstance) {
    const popup = document.querySelector('[data-contact-popup]');
    const openButtons = document.querySelectorAll('[data-open-contact]');
    const closeButtons = document.querySelectorAll('[data-close-contact]');
    const form = popup?.querySelector('form');

    if (!popup) return;

    // Fonction pour bloquer le scroll
    const disableScroll = () => {
        popup.classList.add('is-open');
        // On fige le body. Lenis continuera de tourner mais ne scrollera pas car le body est figé.
        // Le conteneur de la popup avec data-lenis-prevent gérera son propre scroll.
        document.body.style.overflow = 'hidden';
        
        // Note: On n'utilise pas lenisInstance.stop() ici car cela désactiverait 
        // potentiellement la détection du data-lenis-prevent selon les versions,
        // ou empêcherait simplement tout scroll.
    };

    // Fonction pour réactiver le scroll
    const enableScroll = () => {
        popup.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    // Ouvrir la popup
    openButtons.forEach(btn => {
        btn.addEventListener('click', disableScroll);
    });

    // Fermer la popup
    closeButtons.forEach(btn => {
        btn.addEventListener('click', enableScroll);
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('is-open')) {
            enableScroll();
        }
    });

    // Gérer la soumission du formulaire
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Ici vous pouvez ajouter votre logique d'envoi
            console.log('Formulaire soumis');

            // Exemple: afficher un message de confirmation
            alert('Merci ! Nous vous recontacterons très prochainement.');

            // Fermer la popup et réinitialiser le formulaire
            enableScroll();
            form.reset();
        });
    }
}
