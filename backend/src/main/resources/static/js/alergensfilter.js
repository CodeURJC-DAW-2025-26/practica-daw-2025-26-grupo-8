document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.getElementById('allergenFilters');
    const filterButtons = document.querySelectorAll('.btn-allergen-filter');
    const productItems = document.querySelectorAll('.product-item');
    const noResults = document.getElementById('allergenNoResults');

    let currentAllergen = 'all';

    if (!filterContainer || !filterButtons.length || !productItems.length || !noResults) {
        return;
    }

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
        if (currentAllergen === 'all') {
            return true;
        }

        const allergies = getItemAllergies(item);
        return allergies.includes(currentAllergen);
    };

    const activateAllButton = () => {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        const allButton = filterContainer.querySelector('[data-allergen="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
    };

    const updateFilteredProducts = () => {
        let matchingProducts = 0;

        productItems.forEach((item) => {
            const isMatch = matchesCurrentFilter(item);
            item.classList.toggle('allergen-hidden', !isMatch);

            if (isMatch) {
                matchingProducts += 1;
            }
        });

        noResults.classList.toggle('d-none', matchingProducts !== 0);
        document.dispatchEvent(new CustomEvent('menu:filter-changed'));
    };

    filterContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.btn-allergen-filter');
        if (!button) {
            return;
        }

        const isAlreadyActive = button.classList.contains('active');
        const selectedAllergen = normalize(button.dataset.allergen || '');

        filterButtons.forEach((btn) => btn.classList.remove('active'));

        if (isAlreadyActive || selectedAllergen === 'all') {
            activateAllButton();
            currentAllergen = 'all';
            updateFilteredProducts();
            return;
        }

        button.classList.add('active');
        currentAllergen = selectedAllergen;
        updateFilteredProducts();
    });
    updateFilteredProducts();
});
