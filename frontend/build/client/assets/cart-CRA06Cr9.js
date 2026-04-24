import { t as useCartStore } from "./cart-store-Cz8axkd9.js";
import { t as logo_default } from "./logo-dqhES8Zi.js";
import { UNSAFE_withComponentProps, useNavigate } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/cart.tsx
var cart_default = UNSAFE_withComponentProps(function Cart() {
	const navigate = useNavigate();
	const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCartStore();
	if (items.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "container section-padding",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "title-font fw-bold mb-4",
			children: "Carrito de Compras"
		}), /* @__PURE__ */ jsx("div", {
			className: "alert alert-info",
			role: "alert",
			children: /* @__PURE__ */ jsxs("p", {
				className: "mb-0",
				children: ["Tu carrito está vacío. ", /* @__PURE__ */ jsx("a", {
					href: "/menu",
					className: "alert-link",
					children: "Continúa comprando"
				})]
			})
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "container section-padding",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "title-font fw-bold mb-4",
			children: "Carrito de Compras"
		}), /* @__PURE__ */ jsxs("div", {
			className: "row",
			children: [/* @__PURE__ */ jsx("div", {
				className: "col-lg-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "table-responsive",
					children: /* @__PURE__ */ jsxs("table", {
						className: "table",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "table-light",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", { children: "Producto" }),
								/* @__PURE__ */ jsx("th", { children: "Precio" }),
								/* @__PURE__ */ jsx("th", { children: "Cantidad" }),
								/* @__PURE__ */ jsx("th", { children: "Subtotal" }),
								/* @__PURE__ */ jsx("th", { children: "Acción" })
							] })
						}), /* @__PURE__ */ jsx("tbody", { children: items.map((item) => /* @__PURE__ */ jsxs("tr", {
							className: "border-bottom",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "py-3",
									children: /* @__PURE__ */ jsxs("div", {
										className: "d-flex align-items-center gap-3",
										children: [item.hasImage ? /* @__PURE__ */ jsx("img", {
											src: `/api/v1/products/${item.productId}/image`,
											alt: item.title,
											style: {
												width: "60px",
												height: "60px",
												objectFit: "cover",
												borderRadius: "4px"
											}
										}) : /* @__PURE__ */ jsx("img", {
											src: logo_default,
											alt: "Sin imagen",
											style: {
												width: "60px",
												height: "60px",
												objectFit: "cover",
												borderRadius: "4px"
											}
										}), /* @__PURE__ */ jsx("a", {
											href: `/product/${item.productId}`,
											className: "text-decoration-none text-dark",
											children: item.title
										})]
									})
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "py-3",
									children: [item.price.toFixed(2), "€"]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3",
									children: /* @__PURE__ */ jsxs("div", {
										className: "d-flex align-items-center gap-2",
										children: [
											/* @__PURE__ */ jsx("button", {
												type: "button",
												className: "btn btn-sm btn-outline-secondary",
												onClick: () => updateQuantity(item.productId, item.quantity - 1),
												"aria-label": "Disminuir cantidad",
												children: "-"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "number",
												min: "1",
												value: item.quantity,
												onChange: (e) => updateQuantity(item.productId, parseInt(e.target.value) || 1),
												className: "form-control form-control-sm",
												style: {
													width: "50px",
													textAlign: "center"
												},
												"aria-label": "Cantidad"
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												className: "btn btn-sm btn-outline-secondary",
												onClick: () => updateQuantity(item.productId, item.quantity + 1),
												"aria-label": "Aumentar cantidad",
												children: "+"
											})
										]
									})
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "py-3 fw-bold",
									children: [(item.price * item.quantity).toFixed(2), "€"]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3",
									children: /* @__PURE__ */ jsx("button", {
										type: "button",
										className: "btn btn-sm btn-danger",
										onClick: () => removeFromCart(item.productId),
										"aria-label": "Eliminar del carrito",
										children: /* @__PURE__ */ jsx("i", { className: "bi bi-trash" })
									})
								})
							]
						}, item.productId)) })]
					})
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "col-lg-4",
				children: /* @__PURE__ */ jsx("div", {
					className: "card shadow-sm border-0 rounded-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "card-body p-4",
						children: [
							/* @__PURE__ */ jsx("h5", {
								className: "card-title fw-bold mb-4",
								children: "Resumen del Pedido"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "d-flex justify-content-between mb-3 pb-3 border-bottom",
								children: [/* @__PURE__ */ jsx("span", { children: "Subtotal:" }), /* @__PURE__ */ jsxs("span", { children: [getTotalPrice().toFixed(2), "€"] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "d-flex justify-content-between mb-4 fw-bold fs-5",
								children: [/* @__PURE__ */ jsx("span", { children: "Total:" }), /* @__PURE__ */ jsxs("span", {
									className: "text-primary-custom",
									children: [getTotalPrice().toFixed(2), "€"]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "d-grid gap-2",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									className: "btn btn-primary btn-custom rounded-pill py-3",
									onClick: () => navigate("/checkout"),
									children: [/* @__PURE__ */ jsx("i", { className: "bi bi-credit-card me-2" }), "Proceder al Pago"]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									className: "btn btn-outline-secondary rounded-pill py-3",
									onClick: () => navigate("/menu"),
									children: [/* @__PURE__ */ jsx("i", { className: "bi bi-arrow-left me-2" }), "Continuar Comprando"]
								})]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-sm btn-link text-danger w-100 mt-3",
								onClick: () => {
									if (confirm("¿Deseas vaciar el carrito?")) clearCart();
								},
								children: "Vaciar Carrito"
							})
						]
					})
				})
			})]
		})]
	});
});
//#endregion
export { cart_default as default };
