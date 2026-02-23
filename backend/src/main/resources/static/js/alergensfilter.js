document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.getElementById('allergenFilters');
    const filterButtons = document.querySelectorAll('.btn-allergen-filter');
    const productItems = document.querySelectorAll('.product-item');
    const noResults = document.getElementById('allergenNoResults');

    if (!filterContainer || !filterButtons.length || !productItems.length || !noResults) {
        return;
    }

    const normalize = (value) => value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    const showAllProducts = () => {
        productItems.forEach((item) => item.classList.remove('d-none'));
        noResults.classList.add('d-none');
    };

    const applyAllergenFilter = (allergen) => {
        let visibleCount = 0;

        productItems.forEach((item) => {
            const rawAllergies = item.dataset.allergies || '';
            const allergies = rawAllergies
                .split('|')
                .map((entry) => normalize(entry))
                .filter(Boolean);

            const visible = allergies.includes(allergen);
            item.classList.toggle('d-none', !visible);

            if (visible) {
                visibleCount += 1;
            }
        });

        noResults.classList.toggle('d-none', visibleCount !== 0);
    };

    filterContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.btn-allergen-filter');
        if (!button) {
            return;
        }

        const isAlreadyActive = button.classList.contains('active');

        filterButtons.forEach((btn) => btn.classList.remove('active'));

        if (isAlreadyActive) {
            showAllProducts();
            return;
        }

        button.classList.add('active');
        applyAllergenFilter(normalize(button.dataset.allergen || ''));
    });
});
