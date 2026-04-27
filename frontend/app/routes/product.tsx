import { useState } from "react";
import { useLoaderData } from "react-router";
import { productService } from "../services/product-service";
import { useCartStore } from "../stores/cart-store";
import { useUserStore } from "../stores/user-store";
import { useAuthModal } from "../contexts/AuthModalContext";
import logoImage from "../assets/images/logo.png";

// Loads a single product using the route id.
export async function clientLoader({ params }: any) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return { product: null, error: "ID de producto no válido" };
    }
    try {
        const product = await productService.getProductById(id);
        return { product, error: null };
    } catch (e: any) {
        return { product: null, error: e.message };
    }
}

export default function Product() {
    const { product, error } = useLoaderData<typeof clientLoader>();
    const addToCart = useCartStore((state) => state.addToCart);
    const { isLogged } = useUserStore();
    const { openAuthModal } = useAuthModal();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Fallback UI when product loading fails.
    if (error || !product) {
        return (
            <div className="container mt-5 text-center">
                <h2>Error</h2>
                <p>{error || "No se pudo cargar el producto"}</p>
            </div>
        );
    }

    // Requires login to add products to the cart.
    const handleAddToCart = () => {
        if (!isLogged) {
            openAuthModal("login");
            return;
        }

        addToCart({
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            hasImage: product.hasImage,
        });
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 2000);
    };

    return (
        <>
            {/* Product detail layout: image on the left, information/actions on the right. */}
            <section className="section-padding container mt-5 mb-5">
                <div className="row align-items-center g-5">
                    {/* Product image block. */}
                    <div className="col-md-6">
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                            {product.hasImage ? (
                                <img
                                    src={`/api/v1/products/${product.id}/image`}
                                    className="img-fluid w-100"
                                    alt={product.title}
                                    style={{ objectFit: "cover", maxHeight: "600px" }}
                                />
                            ) : (
                                <img
                                    src={logoImage}
                                    className="img-fluid w-100 p-5"
                                    alt="Sin imagen"
                                />
                            )}
                        </div>
                    </div>

                    {/* Product information and add-to-cart action. */}
                    <div className="col-md-6">
                        <div className="ps-md-4">
                            <span className="badge bg-dark text-white mb-3 px-3 py-2 fs-6 rounded-pill">
                                Categoría: {product.categoryTitle}
                            </span>

                            <h1 className="display-4 fw-bold title-font text-dark mb-2">{product.title}</h1>
                            <p className="display-5 fw-bold text-primary-custom mb-4">{product.price}€</p>

                            <h5 className="fw-bold mb-3">Descripción</h5>
                            <p className="lead text-secondary mb-4">{product.description}</p>

                            <div className="mb-5">
                                <span className="fw-bold me-2">Alérgenos:</span>
                                {product.allergies && product.allergies.length > 0 ? (
                                    product.allergies.map((allergy, index) => (
                                        <span
                                            key={index}
                                            className="badge border border-secondary text-secondary me-1"
                                            title={`Contiene ${allergy}`}
                                        >
                                            <i className="bi bi-info-circle"></i> {allergy}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-muted small">Sin alérgenos registrados.</span>
                                )}
                            </div>

                            {/* Temporary success message after adding to cart. */}
                            {showSuccessMessage && (
                                <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
                                    <i className="bi bi-check-circle me-2"></i>
                                    Producto añadido al carrito
                                </div>
                            )}

                            {/* Main add-to-cart button. */}
                            <div className="d-grid gap-3 d-md-flex justify-content-md-start">
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className="btn btn-primary btn-custom btn-load-more w-100 py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 border-0"
                                >
                                    <span>Añadir al Pedido</span>
                                    <i className="bi bi-cart-plus-fill fs-5"></i>
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
