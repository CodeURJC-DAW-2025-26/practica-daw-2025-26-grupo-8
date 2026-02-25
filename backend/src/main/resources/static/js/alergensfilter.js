document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.getElementById('allergenFilters');
    const filterButtons = document.querySelectorAll('.btn-allergen-filter');

    const selectedAllergens = new Set();

    if (!filterContainer || !filterButtons.length) {
        return;
    }

    const normalize = (value) => value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    const activateAllButton = () => {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        const allButton = filterContainer.querySelector('[data-allergen="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
    };

    const notifyAllergenUpdate = () => {
        document.dispatchEvent(new CustomEvent('menu:allergen-updated', {
            detail: {
                allergens: Array.from(selectedAllergens)
            }
        }));
    };

    filterContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.btn-allergen-filter');
        if (!button) {
            return;
        }

        const selectedAllergen = normalize(button.dataset.allergen || '');

        if (selectedAllergen === 'all') {
            selectedAllergens.clear();
            activateAllButton();
            notifyAllergenUpdate();
            return;
        }

        const allButton = filterContainer.querySelector('[data-allergen="all"]');
        if (allButton) {
            allButton.classList.remove('active');
        }

        if (selectedAllergens.has(selectedAllergen)) {
            selectedAllergens.delete(selectedAllergen);
            button.classList.remove('active');
        } else {
            selectedAllergens.add(selectedAllergen);
            button.classList.add('active');
        }

        if (selectedAllergens.size === 0) {
            activateAllButton();
        }
        notifyAllergenUpdate();
    });
});
