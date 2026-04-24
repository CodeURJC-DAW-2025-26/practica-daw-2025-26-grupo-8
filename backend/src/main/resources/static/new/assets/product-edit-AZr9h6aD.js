import { t as categoryService } from "./category-service-DucSZTVQ.js";
import { t as productService } from "./product-service-BkwnfBmn.js";
import { Link, UNSAFE_withComponentProps, useParams } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region app/routes/admin/product-edit.tsx
var product_edit_default = UNSAFE_withComponentProps(function AdminProductEdit() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [title, setTitle] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [price, setPrice] = useState("");
	const [shortDescription, setShortDescription] = useState("");
	const [description, setDescription] = useState("");
	const [allergies, setAllergies] = useState([]);
	const [imageFile, setImageFile] = useState(null);
	useEffect(() => {
		if (!id) return;
		Promise.all([productService.getProductById(parseInt(id)), categoryService.getCategories()]).then(([prod, cats]) => {
			setProduct(prod);
			setCategories(cats);
			setTitle(prod.title);
			setCategoryId(prod.categoryId?.toString() || "");
			setPrice(prod.price.toString());
			setShortDescription(prod.shortDescription || "");
			setDescription(prod.description || "");
			setAllergies(prod.allergies || []);
			setLoading(false);
		}).catch((err) => {
			setError("Error al cargar producto o categorías: " + err.message);
			setLoading(false);
		});
	}, [id]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!id) return;
		setError("");
		setSuccess("");
		try {
			await productService.updateProduct(parseInt(id), {
				title,
				categoryId: parseInt(categoryId),
				price: parseFloat(price),
				shortDescription,
				description,
				allergies
			}, imageFile);
			setProduct(await productService.getProductById(parseInt(id)));
			setImageFile(null);
			const fileInput = document.getElementById("productImageInput");
			if (fileInput) fileInput.value = "";
			setSuccess("Cambios guardados con éxito.");
		} catch (err) {
			setError("Error al actualizar producto: " + err.message);
		}
	};
	const toggleAllergy = (allergy) => {
		setAllergies((prev) => prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]);
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "text-center mt-5",
		children: "Cargando..."
	});
	if (!product && !loading) return /* @__PURE__ */ jsx("div", {
		className: "alert alert-danger mt-5",
		children: "Producto no encontrado."
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		success && /* @__PURE__ */ jsxs("div", {
			className: "alert alert-success alert-dismissible fade show mt-3 shadow-sm",
			role: "alert",
			children: [
				/* @__PURE__ */ jsx("i", { className: "bi bi-check-circle-fill me-2" }),
				" ",
				success,
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn-close",
					onClick: () => setSuccess("")
				})
			]
		}),
		error && /* @__PURE__ */ jsxs("div", {
			className: "alert alert-danger alert-dismissible fade show mt-3 shadow-sm",
			role: "alert",
			children: [
				/* @__PURE__ */ jsx("i", { className: "bi bi-x-circle-fill me-2" }),
				" ",
				error,
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn-close",
					onClick: () => setError("")
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "h2 title-font text-dark",
				children: "Edit Product"
			}), /* @__PURE__ */ jsxs(Link, {
				to: "/admin/categories",
				className: "btn btn-outline-secondary",
				children: [/* @__PURE__ */ jsx("i", { className: "bi bi-arrow-left" }), " Volver"]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "card shadow-sm border-0 mx-auto mb-5",
			style: { maxWidth: "800px" },
			children: [/* @__PURE__ */ jsx("div", {
				className: "card-header bg-dark text-white",
				children: /* @__PURE__ */ jsxs("h5", {
					className: "mb-0 fw-bold",
					children: [
						/* @__PURE__ */ jsx("i", { className: "bi bi-pencil-square me-2" }),
						" Editing: ",
						product?.title
					]
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "card-body p-4",
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "row g-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "col-md-6",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label small text-muted",
								children: "Product Name"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								className: "form-control",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-md-6",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label small text-muted",
								children: "Category"
							}), /* @__PURE__ */ jsxs("select", {
								className: "form-select",
								value: categoryId,
								onChange: (e) => setCategoryId(e.target.value),
								required: true,
								children: [/* @__PURE__ */ jsx("option", {
									disabled: true,
									value: "",
									children: "Select category..."
								}), categories.map((c) => /* @__PURE__ */ jsx("option", {
									value: c.id,
									children: c.title
								}, c.id))]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-md-6",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label small text-muted",
								children: "Price (€)"
							}), /* @__PURE__ */ jsx("input", {
								type: "number",
								step: "0.01",
								className: "form-control",
								value: price,
								onChange: (e) => setPrice(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-md-6",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "form-label small text-muted",
									children: "New Image (Optional)"
								}),
								product?.hasImage ? /* @__PURE__ */ jsxs("div", {
									className: "mb-2 d-flex align-items-center",
									children: [/* @__PURE__ */ jsx("img", {
										src: `/api/v1/products/${product.id}/image?timestamp=${Date.now()}`,
										className: "rounded-3 shadow-sm border",
										style: {
											width: "50px",
											height: "50px",
											objectFit: "cover"
										},
										alt: "Current"
									}), /* @__PURE__ */ jsx("span", {
										className: "ms-2 small text-muted",
										children: "Uploading a new one replaces this."
									})]
								}) : /* @__PURE__ */ jsx("div", {
									className: "mb-2 small text-danger",
									children: "No image assigned."
								}),
								/* @__PURE__ */ jsx("input", {
									type: "file",
									id: "productImageInput",
									className: "form-control",
									accept: "image/*",
									onChange: (e) => setImageFile(e.target.files ? e.target.files[0] : null)
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-12 mt-3",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label small text-muted",
								children: "Allergens"
							}), /* @__PURE__ */ jsx("div", {
								className: "card card-body bg-light border-0 small",
								children: /* @__PURE__ */ jsx("div", {
									className: "row g-2",
									children: [
										"Gluten",
										"Lácteos",
										"Huevo",
										"Pescado",
										"Frutos Secos",
										"Picante"
									].map((alg) => /* @__PURE__ */ jsx("div", {
										className: "col-4 col-md-2",
										children: /* @__PURE__ */ jsxs("div", {
											className: "form-check",
											children: [/* @__PURE__ */ jsx("input", {
												className: "form-check-input allergen-cb",
												type: "checkbox",
												checked: allergies.includes(alg),
												onChange: () => toggleAllergy(alg),
												id: `edit-alg-${alg.toLowerCase().replace(" ", "")}`
											}), /* @__PURE__ */ jsx("label", {
												className: `form-check-label ${alg === "Picante" ? "text-danger" : ""}`,
												htmlFor: `edit-alg-${alg.toLowerCase().replace(" ", "")}`,
												children: alg === "Frutos Secos" ? "F. Secos" : alg
											})]
										})
									}, alg))
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-12",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label small text-muted",
								children: "Short Description"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								className: "form-control",
								value: shortDescription,
								onChange: (e) => setShortDescription(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-12",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label small text-muted",
								children: "Detailed Description"
							}), /* @__PURE__ */ jsx("textarea", {
								className: "form-control",
								rows: 3,
								value: description,
								onChange: (e) => setDescription(e.target.value)
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "col-12 text-end mt-4",
							children: /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "btn btn-primary btn-custom px-5",
								children: "Save Product Changes"
							})
						})
					]
				})
			})]
		})
	] });
});
//#endregion
export { product_edit_default as default };
