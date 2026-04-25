import { t as useUserStore } from "./user-store-C1C9MW7l.js";
import { t as useCartStore } from "./cart-store-Cz8axkd9.js";
import { n as useAuthModal } from "./AuthModalContext-BVEB1Lx-.js";
import { t as logo_default } from "./logo-DKHlijU7.js";
import { t as productService } from "./product-service-B3WJV0b7.js";
import { Link, UNSAFE_withComponentProps, useLoaderData } from "react-router";
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/menu.tsx
async function clientLoader() {
	return await productService.getProducts(0, 4);
}
var menu_default = UNSAFE_withComponentProps(function Menu() {
	const initialData = useLoaderData();
	const addToCart = useCartStore((state) => state.addToCart);
	const { isLogged } = useUserStore();
	const { openAuthModal } = useAuthModal();
	const [products, setProducts] = useState(initialData.content);
	const [page, setPage] = useState(0);
	const [isLast, setIsLast] = useState(initialData.last);
	const [isLoading, setIsLoading] = useState(false);
	const [addedProductId, setAddedProductId] = useState(null);
	const [excludedAllergens, setExcludedAllergens] = useState([]);
	const normalize = (val) => val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
	const allergenOptions = [
		{
			id: "gluten",
			label: "Sin gluten",
			icon: "bi-slash-circle"
		},
		{
			id: "lacteos",
			label: "Sin lácteos",
			icon: "bi-droplet"
		},
		{
			id: "huevo",
			label: "Sin huevo",
			icon: "bi-egg-fried"
		},
		{
			id: "pescado",
			label: "Sin pescado",
			icon: "bi-water"
		},
		{
			id: "frutos secos",
			label: "Sin frutos secos",
			icon: "bi-nut"
		},
		{
			id: "picante",
			label: "Sin picante",
			icon: "bi-fire"
		}
	];
	const handleFilterClick = (id) => {
		if (id === "all") {
			setExcludedAllergens([]);
			return;
		}
		const normId = normalize(id);
		setExcludedAllergens((prev) => prev.includes(normId) ? prev.filter((a) => a !== normId) : [...prev, normId]);
	};
	const filteredProducts = useMemo(() => {
		if (excludedAllergens.length === 0) return products;
		return products.filter((p) => {
			const pAllergies = (p.allergies || []).map(normalize);
			return !excludedAllergens.some((ex) => pAllergies.includes(ex));
		});
	}, [products, excludedAllergens]);
	const loadMoreProducts = async () => {
		setIsLoading(true);
		try {
			const nextPage = page + 1;
			const newData = await productService.getProducts(nextPage, 4);
			setProducts((prev) => [...prev, ...newData.content]);
			setPage(nextPage);
			setIsLast(newData.last);
		} catch (error) {
			console.error("Error al cargar más:", error);
		} finally {
			setIsLoading(false);
		}
	};
	if (!isLogged) {
		openAuthModal("login");
		return;
	}
	const handleAddToCart = (product) => {
		addToCart({
			productId: product.id,
			title: product.title,
			price: product.price,
			quantity: 1,
			hasImage: product.hasImage
		});
		setAddedProductId(product.id);
		setTimeout(() => setAddedProductId(null), 1500);
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("header", {
		className: "bg-dark text-white py-5 text-center",
		children: /* @__PURE__ */ jsxs("div", {
			className: "container",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "display-4",
				children: "Nuestra Carta"
			}), /* @__PURE__ */ jsx("p", {
				className: "lead text-secondary",
				children: "Sabores tradicionales hechos al momento"
			})]
		})
	}), /* @__PURE__ */ jsxs("section", {
		className: "container mt-5 mb-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "d-flex justify-content-center flex-wrap gap-2 mb-4",
				id: "allergenFilters",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => handleFilterClick("all"),
					className: `btn btn-allergen-filter ${excludedAllergens.length === 0 ? "active" : ""}`,
					children: [/* @__PURE__ */ jsx("i", { className: "bi bi-grid-3x3-gap" }), /* @__PURE__ */ jsx("span", { children: "Todos" })]
				}), allergenOptions.map((opt) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => handleFilterClick(opt.id),
					className: `btn btn-allergen-filter ${excludedAllergens.includes(normalize(opt.id)) ? "active" : ""}`,
					children: [/* @__PURE__ */ jsx("i", { className: `bi ${opt.icon}` }), /* @__PURE__ */ jsx("span", { children: opt.label })]
				}, opt.id))]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4",
				children: filteredProducts.map((p) => /* @__PURE__ */ jsx("div", {
					className: "col",
					children: /* @__PURE__ */ jsxs("div", {
						className: "card h-100 border-0 shadow-sm",
						children: [/* @__PURE__ */ jsx(Link, {
							to: `/product/${p.id}`,
							children: /* @__PURE__ */ jsx("img", {
								src: p.hasImage ? `/api/v1/products/${p.id}/image` : logo_default,
								className: "card-img-top",
								alt: p.title,
								style: {
									height: "200px",
									objectFit: "cover"
								}
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "card-body d-flex flex-column",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "h5",
									children: p.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-muted small",
									children: p.shortDescription
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-auto d-flex justify-content-between align-items-center",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "fw-bold text-success",
										children: [p.price, "€"]
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										className: `btn btn-sm rounded-pill ${addedProductId === p.id ? "btn-success" : "btn-outline-primary"}`,
										onClick: () => handleAddToCart(p),
										children: addedProductId === p.id ? "Añadido" : "Añadir"
									})]
								})
							]
						})]
					})
				}, p.id))
			}),
			!isLast && /* @__PURE__ */ jsx("div", {
				className: "text-center mt-5",
				children: /* @__PURE__ */ jsx("button", {
					id: "btnLoadMore",
					className: "btn btn-primary btn-custom btn-load-more rounded-pill mb-4 d-inline-flex align-items-center gap-2",
					onClick: loadMoreProducts,
					disabled: isLoading,
					children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
						className: "spinner-border spinner-border-sm",
						role: "status",
						"aria-hidden": "true"
					}), /* @__PURE__ */ jsx("span", { children: "Cargando..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "Más resultados" }), /* @__PURE__ */ jsx("i", { className: "bi bi-arrow-down-circle-fill" })] })
				})
			})
		]
	})] });
});
//#endregion
export { clientLoader, menu_default as default };
