document.addEventListener("DOMContentLoaded", function () {

    // Find the product form by its ID
    const form = document.getElementById("editProductForm");

    // If the form is not found (e.g., we are editing a category instead), exit
    if (!form) return;

    // 1. Auto-select the Category
    const categorySelect = document.getElementById("categorySelect");
    const currentCategoryId = form.getAttribute("data-category");

    if (currentCategoryId && categorySelect) {
        categorySelect.value = currentCategoryId;
    }

    // 2. Auto-check the Allergens
    let allergiesString = form.getAttribute("data-allergies");

    // Verify it is not empty or an empty array "[]"
    if (allergiesString && allergiesString !== "[]" && allergiesString !== "") {

        // Clean Java brackets: from "[Gluten, Dairy]" to "Gluten, Dairy"
        allergiesString = allergiesString.replace('[', '').replace(']', '');

        // Split by commas and trim excess whitespace
        const allergiesArray = allergiesString.split(',').map(item => item.trim());

        // Loop through each allergen and check the corresponding box
        allergiesArray.forEach(alg => {
            const checkbox = document.querySelector(`input.allergen-cb[value="${alg}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
});