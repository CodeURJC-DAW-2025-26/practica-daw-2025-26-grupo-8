document.addEventListener('DOMContentLoaded', () => {
    const loadMoreButton = document.querySelector('.btn-load-more[data-more-url]');
    const productsContainer = document.getElementById('productsContainer');
    const filterContainer = document.getElementById('allergenFilters');
    const isMenuPage = Boolean(filterContainer);

    if (!loadMoreButton || !productsContainer) {
        return;
    }

    const pageSize = Number.parseInt(loadMoreButton.dataset.pageSize || '4', 10) || 4;
    let isLoading = false;

    const getNextPage = () => Number.parseInt(loadMoreButton.dataset.nextPage || '1', 10) || 1;
    const getSelectedAllergens = () => {
        if (!isMenuPage) {
            return [];
        }

        return Array.from(filterContainer.querySelectorAll('.btn-allergen-filter.active'))
            .map((button) => (button.dataset.allergen || '').trim().toLowerCase())
            .filter((allergen) => allergen && allergen !== 'all');
    };

    const hideButton = () => {
        loadMoreButton.classList.add('d-none');
        loadMoreButton.disabled = true;
    };

    const showButton = () => {
        loadMoreButton.classList.remove('d-none');
        loadMoreButton.disabled = false;
    };

    const loadMoreProducts = async (reset = false) => {
        if (isLoading) {
            return;
        }

        const shouldReset = reset === true;

        const moreUrl = loadMoreButton.dataset.moreUrl;
        if (!moreUrl) {
            hideButton();
            return;
        }

        isLoading = true;
        loadMoreButton.disabled = true;

        const spinnerStartTime = Date.now();
        if (window.PizzaSpinner) {
            window.PizzaSpinner.show('Cargando más resultados...');
        }

        try {
            const nextPage = shouldReset ? 0 : getNextPage();
            const url = new URL(moreUrl, window.location.origin);
            url.searchParams.set('page', String(nextPage));
            url.searchParams.set('size', String(pageSize));
            url.searchParams.set('fragment', 'true');

            getSelectedAllergens().forEach((allergen) => {
                url.searchParams.append('allergen', allergen);
            });

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error('No se pudieron cargar más resultados');
            }

            const html = (await response.text()).trim();
            const hasMoreHeader = (response.headers.get('X-Has-More') || '').toLowerCase();
            if (!html) {
                hideButton();
                return;
            }

            const looksLikeLoginHtml = html.includes('name="username"')
                && html.includes('name="password"')
                && html.toLowerCase().includes('sign in');

            if (looksLikeLoginHtml || response.redirected) {
                throw new Error('Sesión requerida para cargar más resultados');
            }

            if (shouldReset) {
                productsContainer.innerHTML = '';
            }

            productsContainer.insertAdjacentHTML('beforeend', html);
            loadMoreButton.dataset.nextPage = String(nextPage + 1);

            const appendedProducts = (html.match(/class="col product-item"/g) || []).length;
            if (hasMoreHeader === 'false') {
                hideButton();
            } else if (hasMoreHeader === 'true') {
                showButton();
            } else if (appendedProducts < pageSize) {
                hideButton();
            } else {
                showButton();
            }

            document.dispatchEvent(new CustomEvent('menu:items-appended'));
        } catch (error) {
            console.error('Error cargando más productos:', error);
        } finally {
            const elapsedTime = Date.now() - spinnerStartTime;
            const minSpinnerTime = 300;
            const remainingTime = Math.max(0, minSpinnerTime - elapsedTime);

            setTimeout(() => {
                isLoading = false;
                if (!loadMoreButton.classList.contains('d-none')) {
                    loadMoreButton.disabled = false;
                }

                if (window.PizzaSpinner) {
                    window.PizzaSpinner.hide();
                }
            }, remainingTime);
        }
    };

    loadMoreButton.addEventListener('click', () => loadMoreProducts(false));

    if (isMenuPage) {
        document.addEventListener('menu:allergen-updated', () => {
            loadMoreButton.dataset.nextPage = '0';
            loadMoreProducts(true);
        });
    }
});
