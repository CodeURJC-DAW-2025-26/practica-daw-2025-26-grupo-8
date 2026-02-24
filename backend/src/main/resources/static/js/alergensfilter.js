document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.getElementById('allergenFilters');
    const filterButtons = document.querySelectorAll('.btn-allergen-filter');
    const productItems = document.querySelectorAll('.product-item');
    const noResults = document.getElementById('allergenNoResults');
    const loadMoreButton = document.querySelector('.btn-load-more');
    const ITEMS_PER_BATCH = 4;

    let currentAllergen = 'all';
    let visibleLimit = ITEMS_PER_BATCH;

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

    const updateVisibleProducts = () => {
        let matchingProducts = 0;
        let shownProducts = 0;

        productItems.forEach((item) => {
            if (!matchesCurrentFilter(item)) {
                item.classList.add('d-none');
                return;
            }

            matchingProducts += 1;
            const shouldShow = shownProducts < visibleLimit;
            item.classList.toggle('d-none', !shouldShow);

            if (shouldShow) {
                shownProducts += 1;
            }
        });

        noResults.classList.toggle('d-none', matchingProducts !== 0);

        if (!loadMoreButton) {
            return;
        }

        const hasMoreProducts = matchingProducts > shownProducts;
        loadMoreButton.classList.toggle('d-none', !hasMoreProducts);
        loadMoreButton.disabled = !hasMoreProducts;
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
            visibleLimit = ITEMS_PER_BATCH;
            updateVisibleProducts();
            return;
        }

        button.classList.add('active');
        currentAllergen = selectedAllergen;
        visibleLimit = ITEMS_PER_BATCH;
        updateVisibleProducts();
    });

    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            visibleLimit += ITEMS_PER_BATCH;
            updateVisibleProducts();
        });
    }

    updateVisibleProducts();
});
