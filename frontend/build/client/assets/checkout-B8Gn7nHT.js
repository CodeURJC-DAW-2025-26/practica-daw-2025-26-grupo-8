import { t as useUserStore } from "./user-store-C1C9MW7l.js";
import { t as useCartStore } from "./cart-store-Cz8axkd9.js";
import { t as orderService } from "./order-service-4fYg0mHa.js";
import { UNSAFE_withComponentProps, useNavigate } from "react-router";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/checkout.tsx
var checkout_default = UNSAFE_withComponentProps(function Checkout() {
	const navigate = useNavigate();
	const { items, getTotalPrice, clearCart } = useCartStore();
	const { user, isLogged } = useUserStore();
	const [formData, setFormData] = useState({
		address: "",
		city: "",
		postalCode: "",
		phoneNumber: ""
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	if (items.length === 0) return /* @__PURE__ */ jsx("div", {
		className: "container section-padding",
		children: /* @__PURE__ */ jsx("div", {
			className: "alert alert-warning",
			role: "alert",
			children: /* @__PURE__ */ jsxs("p", {
				className: "mb-0",
				children: ["Tu carrito está vacío. ", /* @__PURE__ */ jsx("a", {
					href: "/menu",
					className: "alert-link",
					children: "Vuelve al menú"
				})]
			})
		})
	});
	if (!isLogged) return /* @__PURE__ */ jsx("div", {
		className: "container section-padding",
		children: /* @__PURE__ */ jsx("div", {
			className: "alert alert-info",
			role: "alert",
			children: /* @__PURE__ */ jsxs("p", {
				className: "mb-0",
				children: ["Debes iniciar sesión para realizar un pedido. ", /* @__PURE__ */ jsx("a", {
					href: "/login",
					className: "alert-link",
					children: "Inicia sesión aquí"
				})]
			})
		})
	});
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			if (!formData.address || !formData.city || !formData.postalCode || !formData.phoneNumber) {
				setError("Por favor, completa todos los campos");
				setLoading(false);
				return;
			}
			const orderRequest = {
				productIds: items.map((item) => item.productId),
				address: formData.address,
				city: formData.city,
				postalCode: formData.postalCode,
				phoneNumber: formData.phoneNumber
			};
			const order = await orderService.createOrder(orderRequest);
			clearCart();
			navigate(`/profile?orderId=${order.id}&success=true`);
		} catch (err) {
			setError(err.message || "Error al crear la orden. Por favor, intenta de nuevo.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "container section-padding",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "title-font fw-bold mb-5",
			children: "Finalizar Compra"
		}), /* @__PURE__ */ jsxs("div", {
			className: "row g-5",
			children: [/* @__PURE__ */ jsx("div", {
				className: "col-lg-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "card shadow-sm border-0 rounded-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "card-body p-4",
						children: [
							/* @__PURE__ */ jsx("h5", {
								className: "card-title fw-bold mb-4",
								children: "Información de Entrega"
							}),
							error && /* @__PURE__ */ jsxs("div", {
								className: "alert alert-danger alert-dismissible fade show",
								role: "alert",
								children: [error, /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn-close",
									onClick: () => setError(null)
								})]
							}),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: handleSubmit,
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ jsx("label", {
											htmlFor: "address",
											className: "form-label fw-bold",
											children: "Dirección"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											id: "address",
											name: "address",
											className: "form-control",
											placeholder: "Calle, número, piso...",
											value: formData.address,
											onChange: handleInputChange,
											required: true
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "row",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "col-md-6 mb-3",
											children: [/* @__PURE__ */ jsx("label", {
												htmlFor: "city",
												className: "form-label fw-bold",
												children: "Ciudad"
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												id: "city",
												name: "city",
												className: "form-control",
												placeholder: "Tu ciudad",
												value: formData.city,
												onChange: handleInputChange,
												required: true
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "col-md-6 mb-3",
											children: [/* @__PURE__ */ jsx("label", {
												htmlFor: "postalCode",
												className: "form-label fw-bold",
												children: "Código Postal"
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												id: "postalCode",
												name: "postalCode",
												className: "form-control",
												placeholder: "12345",
												value: formData.postalCode,
												onChange: handleInputChange,
												required: true
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mb-4",
										children: [/* @__PURE__ */ jsx("label", {
											htmlFor: "phoneNumber",
											className: "form-label fw-bold",
											children: "Teléfono"
										}), /* @__PURE__ */ jsx("input", {
											type: "tel",
											id: "phoneNumber",
											name: "phoneNumber",
											className: "form-control",
											placeholder: "+34 123 456 789",
											value: formData.phoneNumber,
											onChange: handleInputChange,
											required: true
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "d-grid gap-2",
										children: [/* @__PURE__ */ jsx("button", {
											type: "submit",
											className: "btn btn-primary btn-custom rounded-pill py-3",
											disabled: loading,
											children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
												className: "spinner-border spinner-border-sm me-2",
												role: "status",
												"aria-hidden": "true"
											}), "Procesando..."] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("i", { className: "bi bi-check-circle me-2" }), "Confirmar Pedido"] })
										}), /* @__PURE__ */ jsxs("button", {
											type: "button",
											className: "btn btn-outline-secondary rounded-pill py-3",
											onClick: () => navigate("/cart"),
											disabled: loading,
											children: [/* @__PURE__ */ jsx("i", { className: "bi bi-arrow-left me-2" }), "Volver al Carrito"]
										})]
									})
								]
							})
						]
					})
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "col-lg-4",
				children: /* @__PURE__ */ jsx("div", {
					className: "card shadow-sm border-0 rounded-4 sticky-top",
					children: /* @__PURE__ */ jsxs("div", {
						className: "card-body p-4",
						children: [
							/* @__PURE__ */ jsx("h5", {
								className: "card-title fw-bold mb-4",
								children: "Resumen del Pedido"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "border-bottom pb-3 mb-3",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-muted mb-2",
									children: "Artículos en el carrito:"
								}), /* @__PURE__ */ jsx("ul", {
									className: "list-unstyled small",
									children: items.map((item) => /* @__PURE__ */ jsxs("li", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ jsxs("span", { children: [
											item.title,
											" x",
											item.quantity
										] }), /* @__PURE__ */ jsxs("span", {
											className: "fw-bold",
											children: [(item.price * item.quantity).toFixed(2), "€"]
										})]
									}, item.productId))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mb-3 pb-3 border-bottom",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "d-flex justify-content-between mb-2",
									children: [/* @__PURE__ */ jsx("span", { children: "Subtotal:" }), /* @__PURE__ */ jsxs("span", { children: [getTotalPrice().toFixed(2), "€"] })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "d-flex justify-content-between text-muted small",
									children: [/* @__PURE__ */ jsx("span", { children: "Gastos de envío:" }), /* @__PURE__ */ jsx("span", { children: "Gratis" })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "d-flex justify-content-between fw-bold fs-5",
								children: [/* @__PURE__ */ jsx("span", { children: "Total:" }), /* @__PURE__ */ jsxs("span", {
									className: "text-primary-custom",
									children: [getTotalPrice().toFixed(2), "€"]
								})]
							}),
							user && /* @__PURE__ */ jsxs("div", {
								className: "mt-4 pt-3 border-top",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-muted small mb-1",
									children: "Usuario registrado:"
								}), /* @__PURE__ */ jsx("p", {
									className: "fw-bold",
									children: user.email
								})]
							})
						]
					})
				})
			})]
		})]
	});
});
//#endregion
export { checkout_default as default };
