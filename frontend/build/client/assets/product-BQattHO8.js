import { t as useUserStore } from "./user-store-C1C9MW7l.js";
import { t as useCartStore } from "./cart-store-Cz8axkd9.js";
import { n as useAuthModal } from "./AuthModalContext-BVEB1Lx-.js";
import { t as logo_default } from "./logo-DKHlijU7.js";
import { t as productService } from "./product-service-B3WJV0b7.js";
import { UNSAFE_withComponentProps, useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/product.tsx
async function clientLoader({ params }) {
	const id = Number(params.id);
	if (isNaN(id)) return {
		product: null,
		error: "ID de producto no válido"
	};
	try {
		return {
			product: await productService.getProductById(id),
			error: null
		};
	} catch (e) {
		return {
			product: null,
			error: e.message
		};
	}
}
var product_default = UNSAFE_withComponentProps(function Product() {
	const { product, error } = useLoaderData();
	const navigate = useNavigate();
	const addToCart = useCartStore((state) => state.addToCart);
	const { isLogged } = useUserStore();
	const { openAuthModal } = useAuthModal();
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	if (error || !product) return /* @__PURE__ */ jsxs("div", {
		className: "container mt-5 text-center",
		children: [/* @__PURE__ */ jsx("h2", { children: "Error" }), /* @__PURE__ */ jsx("p", { children: error || "No se pudo cargar el producto" })]
	});
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
			hasImage: product.hasImage
		});
		setShowSuccessMessage(true);
		setTimeout(() => setShowSuccessMessage(false), 2e3);
	};
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("section", {
		className: "section-padding container mt-5 mb-5",
		children: /* @__PURE__ */ jsxs("div", {
			className: "row align-items-center g-5",
			children: [/* @__PURE__ */ jsx("div", {
				className: "col-md-6",
				children: /* @__PURE__ */ jsx("div", {
					className: "card border-0 shadow-lg rounded-4 overflow-hidden",
					children: product.hasImage ? /* @__PURE__ */ jsx("img", {
						src: `/api/v1/products/${product.id}/image`,
						className: "img-fluid w-100",
						alt: product.title,
						style: {
							objectFit: "cover",
							maxHeight: "600px"
						}
					}) : /* @__PURE__ */ jsx("img", {
						src: logo_default,
						className: "img-fluid w-100 p-5",
						alt: "Sin imagen"
					})
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "col-md-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "ps-md-4",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "badge bg-dark text-white mb-3 px-3 py-2 fs-6 rounded-pill",
							children: ["Categoría: ", product.categoryTitle]
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "display-4 fw-bold title-font text-dark mb-2",
							children: product.title
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "display-5 fw-bold text-primary-custom mb-4",
							children: [product.price, "€"]
						}),
						/* @__PURE__ */ jsx("h5", {
							className: "fw-bold mb-3",
							children: "Descripción"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "lead text-secondary mb-4",
							children: product.description
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mb-5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "fw-bold me-2",
								children: "Alérgenos:"
							}), product.allergies && product.allergies.length > 0 ? product.allergies.map((allergy, index) => /* @__PURE__ */ jsxs("span", {
								className: "badge border border-secondary text-secondary me-1",
								title: `Contiene ${allergy}`,
								children: [
									/* @__PURE__ */ jsx("i", { className: "bi bi-info-circle" }),
									" ",
									allergy
								]
							}, index)) : /* @__PURE__ */ jsx("span", {
								className: "text-muted small",
								children: "Sin alérgenos registrados."
							})]
						}),
						showSuccessMessage && /* @__PURE__ */ jsxs("div", {
							className: "alert alert-success alert-dismissible fade show mb-3",
							role: "alert",
							children: [/* @__PURE__ */ jsx("i", { className: "bi bi-check-circle me-2" }), "Producto añadido al carrito"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "d-grid gap-3 d-md-flex justify-content-md-start",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: handleAddToCart,
								className: "btn btn-primary btn-custom btn-load-more w-100 py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 border-0",
								children: [/* @__PURE__ */ jsx("span", { children: "Añadir al Pedido" }), /* @__PURE__ */ jsx("i", { className: "bi bi-cart-plus-fill fs-5" })]
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => navigate("/cart"),
								className: "btn btn-outline-primary rounded-pill py-3 d-flex align-items-center justify-content-center gap-2",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-cart-check fs-5" }), /* @__PURE__ */ jsx("span", { children: "Ver Carrito" })]
							})]
						})
					]
				})
			})]
		})
	}) });
});
//#endregion
export { clientLoader, product_default as default };
