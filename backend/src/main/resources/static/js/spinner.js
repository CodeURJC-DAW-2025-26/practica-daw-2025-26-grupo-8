(function () {
    const OVERLAY_ID = 'pizza-spinner-overlay';

    let animationFrameId = null;
    let angle = 0;

    function buildSpinner() {
        if (document.getElementById(OVERLAY_ID)) return;

        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        overlay.setAttribute('aria-live', 'polite');
        overlay.setAttribute('aria-busy', 'true');

        const wrapper = document.createElement('div');

        const spinner = document.createElement('div');
        spinner.className = 'pizza-spinner';

        const base = document.createElement('div');
        base.className = 'pizza-base';

        const cheese = document.createElement('div');
        cheese.className = 'pizza-cheese';

        const slice = document.createElement('div');
        slice.className = 'pizza-slice';
        slice.id = 'pizza-spinner-slice';

        const p1 = document.createElement('span');
        p1.className = 'pizza-pepperoni p1';
        const p2 = document.createElement('span');
        p2.className = 'pizza-pepperoni p2';
        const p3 = document.createElement('span');
        p3.className = 'pizza-pepperoni p3';

        const label = document.createElement('div');
        label.className = 'pizza-spinner-label';
        label.textContent = 'Horneando...';

        slice.appendChild(p1);
        slice.appendChild(p2);
        slice.appendChild(p3);

        base.appendChild(cheese);
        spinner.appendChild(base);
        spinner.appendChild(slice);

        wrapper.appendChild(spinner);
        wrapper.appendChild(label);

        overlay.appendChild(wrapper);
        document.body.appendChild(overlay);
    }

    function animate() {
        const slice = document.getElementById('pizza-spinner-slice');
        if (!slice) return;

        angle = (angle + 4) % 360;
        slice.style.transform = `rotate(${angle}deg)`;

        animationFrameId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (animationFrameId !== null) return;
        animationFrameId = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        if (animationFrameId === null) return;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    function show(text) {
        buildSpinner();

        const overlay = document.getElementById(OVERLAY_ID);
        const label = overlay ? overlay.querySelector('.pizza-spinner-label') : null;

        if (label && typeof text === 'string' && text.trim()) {
            label.textContent = text;
        }

        if (overlay) overlay.classList.add('is-visible');
        startAnimation();
    }

    function hide() {
        const overlay = document.getElementById(OVERLAY_ID);
        if (overlay) overlay.classList.remove('is-visible');
        stopAnimation();
    }

    function setText(text) {
        const overlay = document.getElementById(OVERLAY_ID);
        const label = overlay ? overlay.querySelector('.pizza-spinner-label') : null;
        if (label && typeof text === 'string' && text.trim()) {
            label.textContent = text;
        }
    }

    window.PizzaSpinner = {
        show,
        hide,
        setText
    };

    document.addEventListener('pizza-spinner:show', function (event) {
        const detailText = event && event.detail && event.detail.text;
        show(detailText);
    });

    document.addEventListener('pizza-spinner:hide', hide);
})();
