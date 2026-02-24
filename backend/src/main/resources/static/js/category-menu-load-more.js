document.addEventListener('DOMContentLoaded', () => {
    const productItems = document.querySelectorAll('.product-item');
    const loadMoreButton = document.querySelector('.btn-load-more');
    const ITEMS_PER_BATCH = 4;

    if (!productItems.length || !loadMoreButton) {
        if (loadMoreButton) {
            loadMoreButton.classList.add('d-none');
        }
        return;
    }

    let visibleLimit = ITEMS_PER_BATCH;

    const getVisibleCandidates = () => Array.from(productItems)
        .filter((item) => !item.classList.contains('allergen-hidden'));

    const updateVisibleProducts = () => {
        const candidates = getVisibleCandidates();
        let shownProducts = 0;

        candidates.forEach((item) => {
            const shouldShow = shownProducts < visibleLimit;
            item.classList.toggle('d-none', !shouldShow);

            if (shouldShow) {
                shownProducts += 1;
            }
        });

        productItems.forEach((item) => {
            if (item.classList.contains('allergen-hidden')) {
                item.classList.add('d-none');
            }
        });

        const hasMoreProducts = candidates.length > shownProducts;
        loadMoreButton.classList.toggle('d-none', !hasMoreProducts);
        loadMoreButton.disabled = !hasMoreProducts;
    };

    loadMoreButton.addEventListener('click', () => {
        visibleLimit += ITEMS_PER_BATCH;
        updateVisibleProducts();
    });

    document.addEventListener('menu:filter-changed', () => {
        visibleLimit = ITEMS_PER_BATCH;
        updateVisibleProducts();
    });

    updateVisibleProducts();
});
