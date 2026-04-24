import { t as categoryService } from "./category-service-DucSZTVQ.js";
import { t as productService } from "./product-service-BkwnfBmn.js";
import { Link, UNSAFE_withComponentProps, useLoaderData, useParams } from "react-router";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
//#region app/routes/category.tsx
/**
* CLIENT LOADER: Recibe 'params' para saber qué categoría cargar.
* Cargamos la categoría y la primera página de sus productos.
*/
async function clientLoader({ params }) {
	const categoryId = Number(params.id);
	const category = await categoryService.getCategoryById(categoryId);
	const productsData = await productService.getProducts(0, 4, categoryId);
	return {
		category,
		initialProducts: productsData.content,
		initialLast: productsData.last,
		categoryId
	};
}
var category_default = UNSAFE_withComponentProps(function CategoryPage() {
	const { category, initialProducts, initialLast } = useLoaderData();
	const { id } = useParams();
	const [products, setProducts] = useState(initialProducts);
	const [page, setPage] = useState(0);
	const [isLast, setIsLast] = useState(initialLast);
	const [isLoading, setIsLoading] = useState(false);
	const loadMore = async () => {
		setIsLoading(true);
		try {
			const nextPage = page + 1;
			const data = await productService.getProducts(nextPage, 4, Number(id));
			setProducts([...products, ...data.content]);
			setPage(nextPage);
			setIsLast(data.last);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("header", {
		className: "category-header d-flex align-items-center justify-content-center text-white text-center py-5",
		style: {
			backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${category.hasImage ? `/api/v1/categories/${category.id}/image` : "/assets/images/banner-carta.jpg"})`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			minHeight: "300px"
		},
		children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "display-2 title-font",
			children: category.title
		}), /* @__PURE__ */ jsx("p", {
			className: "lead fs-4",
			children: category.description
		})] })
	}), /* @__PURE__ */ jsxs("section", {
		className: "container mt-5 mb-5",
		children: [
			/* @__PURE__ */ jsx(Row, {
				xs: 1,
				md: 2,
				lg: 4,
				className: "g-4",
				children: products.map((p) => /* @__PURE__ */ jsx(Col, { children: /* @__PURE__ */ jsxs(Card, {
					className: "h-100 border-0 shadow-sm product-card",
					children: [/* @__PURE__ */ jsx(Link, {
						to: `/product/${p.id}`,
						children: /* @__PURE__ */ jsx(Card.Img, {
							variant: "top",
							src: p.hasImage ? `/api/v1/products/${p.id}/image` : "/assets/images/logo.png",
							alt: p.title,
							style: {
								height: "200px",
								objectFit: "cover"
							}
						})
					}), /* @__PURE__ */ jsxs(Card.Body, {
						className: "d-flex flex-column",
						children: [
							/* @__PURE__ */ jsx(Card.Title, {
								className: "h5 title-font",
								children: p.title
							}),
							/* @__PURE__ */ jsx(Card.Text, {
								className: "text-muted small",
								children: p.shortDescription
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-auto d-flex justify-content-between align-items-center",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "fw-bold text-success fs-5",
									children: [p.price, "€"]
								}), /* @__PURE__ */ jsxs(Button, {
									variant: "outline-primary",
									size: "sm",
									className: "rounded-pill",
									children: [/* @__PURE__ */ jsx("i", { className: "bi bi-plus-lg" }), " Añadir"]
								})]
							})
						]
					})]
				}) }, p.id))
			}),
			!isLast && /* @__PURE__ */ jsx("div", {
				className: "text-center mt-5",
				children: /* @__PURE__ */ jsxs(Button, {
					variant: "primary",
					className: "rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2",
					onClick: loadMore,
					disabled: isLoading,
					children: [/* @__PURE__ */ jsx("span", { children: isLoading ? "Cargando..." : "Más resultados" }), !isLoading && /* @__PURE__ */ jsx("i", { className: "bi bi-arrow-down-circle-fill" })]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "text-center mt-4",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/menu",
					className: "btn btn-link text-secondary text-decoration-none",
					children: [/* @__PURE__ */ jsx("i", { className: "bi bi-grid-3x3-gap-fill me-1" }), " Ver la Carta Completa"]
				})
			})
		]
	})] });
});
//#endregion
export { clientLoader, category_default as default };
