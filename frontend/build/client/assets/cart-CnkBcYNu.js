import { t as useUserStore } from "./user-store-C1C9MW7l.js";
import { t as useCartStore } from "./cart-store-Cz8axkd9.js";
import { n as useAuthModal } from "./AuthModalContext-BVEB1Lx-.js";
import { t as logo_default } from "./logo-DKHlijU7.js";
import { t as orderService } from "./order-service-4fYg0mHa.js";
import { UNSAFE_withComponentProps, useNavigate } from "react-router";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/cart.tsx
var cart_default = UNSAFE_withComponentProps(function Cart() {
	const navigate = useNavigate();
	const { items, removeFromCart, clearCart, getTotalPrice } = useCartStore();
	const { isLogged } = useUserStore();
	const { openAuthModal } = useAuthModal();
	const isCartEmpty = items.length === 0;
	const [formData, setFormData] = useState({
		address: "",
		city: "",
		postalCode: "",
		phoneNumber: ""
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isCartEmpty) return;
		if (!isLogged) {
			openAuthModal("login");
			return;
		}
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
			className: "title-font fw-bold mb-4",
			children: "Carrito de Compras"
		}), /* @__PURE__ */ jsxs("div", {
			className: "row g-5",
			children: [/* @__PURE__ */ jsx("div", {
				className: "col-lg-7",
				children: /* @__PURE__ */ jsx("div", {
					className: "card border-0 shadow-sm rounded-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "card-body p-4",
						children: [/* @__PURE__ */ jsx("h5", {
							className: "card-title fw-bold mb-4",
							children: "Tus Productos"
						}), isCartEmpty ? /* @__PURE__ */ jsx("p", {
							className: "mb-0",
							children: "Tu carrito está vacío."
						}) : items.map((item) => /* @__PURE__ */ jsxs("div", {
							className: "d-flex align-items-center justify-content-between mb-4 pb-4 border-bottom",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "d-flex align-items-center gap-3 flex-grow-1",
								children: [item.hasImage ? /* @__PURE__ */ jsx("img", {
									src: `/api/v1/products/${item.productId}/image`,
									alt: item.title,
									style: {
										width: "80px",
										height: "80px",
										objectFit: "cover",
										borderRadius: "8px"
									}
								}) : /* @__PURE__ */ jsx("img", {
									src: logo_default,
									alt: "Sin imagen",
									style: {
										width: "80px",
										height: "80px",
										objectFit: "cover",
										borderRadius: "8px"
									}
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex-grow-1",
									children: [/* @__PURE__ */ jsx("h6", {
										className: "fw-bold mb-1",
										children: item.title
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-muted small mb-0",
										children: [item.price.toFixed(2), "€"]
									})]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-end",
								children: [/* @__PURE__ */ jsxs("p", {
									className: "fw-bold mb-2",
									children: [item.price.toFixed(2), "€"]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-sm btn-outline-danger",
									onClick: () => removeFromCart(item.productId),
									"aria-label": "Eliminar del carrito",
									children: /* @__PURE__ */ jsx("i", { className: "bi bi-trash" })
								})]
							})]
						}, item.productId))]
					})
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "col-lg-5",
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					children: [/* @__PURE__ */ jsx("div", {
						className: "card border-0 shadow-sm rounded-4 mb-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "card-body p-4",
							children: [
								/* @__PURE__ */ jsx("h5", {
									className: "card-title fw-bold mb-4",
									children: "Dirección de Envío"
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
								/* @__PURE__ */ jsxs("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "address",
										className: "form-label fw-bold small",
										children: "Calle y número"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										id: "address",
										name: "address",
										className: "form-control",
										placeholder: "Ej: Calle Mayor 12, 3ªA",
										value: formData.address,
										onChange: handleInputChange,
										required: true
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "row g-3 mb-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "col-6",
										children: [/* @__PURE__ */ jsx("label", {
											htmlFor: "city",
											className: "form-label fw-bold small",
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
										className: "col-6",
										children: [/* @__PURE__ */ jsx("label", {
											htmlFor: "postalCode",
											className: "form-label fw-bold small",
											children: "C. Postal"
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
									className: "mb-3",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "phoneNumber",
										className: "form-label fw-bold small",
										children: "Teléfono de contacto"
									}), /* @__PURE__ */ jsx("input", {
										type: "tel",
										id: "phoneNumber",
										name: "phoneNumber",
										className: "form-control",
										placeholder: "600 000 000",
										value: formData.phoneNumber,
										onChange: handleInputChange,
										required: true
									})]
								})
							]
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "card border-0 shadow-sm rounded-4 mb-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "card-body p-4",
							children: [
								/* @__PURE__ */ jsx("h5", {
									className: "card-title fw-bold mb-4",
									children: "Resumen"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "d-flex justify-content-between mb-3 pb-3 border-bottom",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted",
										children: "Subtotal:"
									}), /* @__PURE__ */ jsxs("span", {
										className: "fw-bold",
										children: [getTotalPrice().toFixed(2), "€"]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "d-flex justify-content-between mb-4 pb-3 border-bottom",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted",
										children: "Envío:"
									}), /* @__PURE__ */ jsx("span", {
										className: "fw-bold text-success",
										children: "Gratis"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "d-flex justify-content-between mb-4",
									children: [/* @__PURE__ */ jsx("span", {
										className: "fw-bold fs-5",
										children: "Total:"
									}), /* @__PURE__ */ jsxs("span", {
										className: "fw-bold fs-5 text-primary-custom",
										children: [getTotalPrice().toFixed(2), "€"]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "d-grid gap-2",
									children: [/* @__PURE__ */ jsx("button", {
										type: "submit",
										className: "btn btn-primary btn-custom rounded-pill py-3",
										disabled: loading || isCartEmpty,
										children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
											className: "spinner-border spinner-border-sm me-2",
											role: "status",
											"aria-hidden": "true"
										}), "Procesando..."] }) : isCartEmpty ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("i", { className: "bi bi-cart-x me-2" }), "Carrito vacío"] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("i", { className: "bi bi-check-circle me-2" }), "Confirmar Pedido"] })
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
					})]
				})
			})]
		})]
	});
});
//#endregion
export { cart_default as default };
