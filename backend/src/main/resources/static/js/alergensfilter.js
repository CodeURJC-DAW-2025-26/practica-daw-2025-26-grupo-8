document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.getElementById('allergenFilters');
    const filterButtons = document.querySelectorAll('.btn-allergen-filter');
    const noResults = document.getElementById('allergenNoResults');

    const selectedAllergens = new Set();

    if (!filterContainer || !filterButtons.length || !noResults) {
        return;
    }

    const getProductItems = () => Array.from(document.querySelectorAll('.product-item'));

    const normalize = (value) => value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    const getItemAllergies = (item) => {
        const rawAllergies = item.dataset.allergies || '';

        return rawAllergies
            .split('|')
            .map((entry) => normalize(entry))
            .filter(Boolean);
    };

    const matchesCurrentFilter = (item) => {
        if (selectedAllergens.size === 0) {
            return true;
        }

        const allergies = getItemAllergies(item);
        let hasAllNegatives = true;

        selectedAllergens.forEach((allergen) => {
            if (allergies.includes(allergen)) {
                hasAllNegatives = false;
            }
        });

        return hasAllNegatives;
    };

    const activateAllButton = () => {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        const allButton = filterContainer.querySelector('[data-allergen="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
    };

    const updateFilteredProducts = () => {
        const productItems = getProductItems();
        let matchingProducts = 0;

        productItems.forEach((item) => {
            const isMatch = matchesCurrentFilter(item);
            item.classList.toggle('allergen-hidden', !isMatch);
            item.classList.toggle('d-none', !isMatch);

            if (isMatch) {
                matchingProducts += 1;
            }
        });

        noResults.classList.toggle('d-none', matchingProducts !== 0);
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
            updateFilteredProducts();
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
        updateFilteredProducts();
        notifyAllergenUpdate();
    });

    document.addEventListener('menu:items-appended', updateFilteredProducts);

    updateFilteredProducts();
});
