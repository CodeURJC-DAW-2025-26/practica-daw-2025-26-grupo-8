import { t as categoryService } from "./category-service-DucSZTVQ.js";
import { t as productService } from "./product-service-BkwnfBmn.js";
import { Link, UNSAFE_withComponentProps } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region app/routes/admin/categories.tsx
var categories_default = UNSAFE_withComponentProps(function AdminCategories() {
	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [productFilter, setProductFilter] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [deleteType, setDeleteType] = useState(null);
	const [itemToDelete, setItemToDelete] = useState(null);
	const [categoryTitle, setCategoryTitle] = useState("");
	const [categoryDescription, setCategoryDescription] = useState("");
	const [categoryImage, setCategoryImage] = useState(null);
	const [productTitle, setProductTitle] = useState("");
	const [productCategoryId, setProductCategoryId] = useState("");
	const [productPrice, setProductPrice] = useState("");
	const [productShortDesc, setProductShortDesc] = useState("");
	const [productDesc, setProductDesc] = useState("");
	const [productAllergies, setProductAllergies] = useState([]);
	const [productImage, setProductImage] = useState(null);
	const [showAllergens, setShowAllergens] = useState(false);
	const fetchAll = async () => {
		try {
			setLoading(true);
			const [cats, prods] = await Promise.all([categoryService.getCategories(), productService.getAllProductsAdmin()]);
			setCategories(cats);
			setProducts(prods);
		} catch (err) {
			setErrorMessage("Error al cargar datos: " + err.message);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchAll();
	}, []);
	const handleCategorySubmit = async (e) => {
		e.preventDefault();
		setErrorMessage("");
		setSuccessMessage("");
		try {
			await categoryService.createCategory({
				title: categoryTitle,
				description: categoryDescription
			}, categoryImage);
			setSuccessMessage("Categoría creada con éxito.");
			setCategoryTitle("");
			setCategoryDescription("");
			setCategoryImage(null);
			e.target.reset();
			fetchAll();
		} catch (err) {
			setErrorMessage("Error al crear categoría: " + err.message);
		}
	};
	const handleProductSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage("");
		setSuccessMessage("");
		try {
			await productService.createProduct({
				title: productTitle,
				categoryId: parseInt(productCategoryId),
				price: parseFloat(productPrice),
				shortDescription: productShortDesc,
				description: productDesc,
				allergies: productAllergies
			}, productImage);
			setSuccessMessage("Producto creado con éxito.");
			setProductTitle("");
			setProductCategoryId("");
			setProductPrice("");
			setProductShortDesc("");
			setProductDesc("");
			setProductAllergies([]);
			setProductImage(null);
			e.target.reset();
			fetchAll();
		} catch (err) {
			setErrorMessage("Error al crear producto: " + err.message);
		}
	};
	const toggleAllergy = (allergy) => {
		setProductAllergies((prev) => prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]);
	};
	const confirmDelete = (type, id, title) => {
		setDeleteType(type);
		setItemToDelete({
			id,
			title
		});
		setShowModal(true);
	};
	const handleDelete = async () => {
		if (!itemToDelete || !deleteType) return;
		setErrorMessage("");
		setSuccessMessage("");
		try {
			if (deleteType === "category") {
				await categoryService.deleteCategory(itemToDelete.id);
				setSuccessMessage("Categoría eliminada con éxito.");
			} else {
				await productService.deleteProduct(itemToDelete.id);
				setSuccessMessage("Producto eliminado con éxito.");
			}
			setShowModal(false);
			fetchAll();
		} catch (err) {
			setErrorMessage("Error al eliminar: " + err.message);
			setShowModal(false);
		}
	};
	const filteredProducts = products.filter((p) => p.title.toLowerCase().includes(productFilter.toLowerCase()));
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "text-center mt-5",
		children: "Cargando..."
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		successMessage && /* @__PURE__ */ jsxs("div", {
			className: "alert alert-success alert-dismissible fade show mt-3 shadow-sm",
			role: "alert",
			children: [
				/* @__PURE__ */ jsx("i", { className: "bi bi-check-circle-fill me-2" }),
				" ",
				successMessage,
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn-close",
					onClick: () => setSuccessMessage("")
				})
			]
		}),
		errorMessage && /* @__PURE__ */ jsxs("div", {
			className: "alert alert-danger alert-dismissible fade show mt-3 shadow-sm",
			role: "alert",
			children: [
				/* @__PURE__ */ jsx("i", { className: "bi bi-x-circle-fill me-2" }),
				" ",
				errorMessage,
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn-close",
					onClick: () => setErrorMessage("")
				})
			]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom",
			children: /* @__PURE__ */ jsx("h1", {
				className: "h2 title-font text-dark",
				children: "Gestión de Inventario"
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "row g-4 mb-5",
			children: [/* @__PURE__ */ jsx("div", {
				className: "col-lg-5",
				children: /* @__PURE__ */ jsxs("div", {
					className: "card shadow-sm h-100 border-0",
					children: [/* @__PURE__ */ jsx("div", {
						className: "card-header bg-dark text-white",
						children: /* @__PURE__ */ jsxs("h5", {
							className: "mb-0 fw-bold",
							children: [/* @__PURE__ */ jsx("i", { className: "bi bi-folder-plus me-2" }), " Nueva Categoría"]
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "card-body",
						children: /* @__PURE__ */ jsxs("form", {
							onSubmit: handleCategorySubmit,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label small text-muted",
										children: "Nombre de la Categoría"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										className: "form-control",
										placeholder: "Ej: Entrantes",
										value: categoryTitle,
										onChange: (e) => setCategoryTitle(e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label small text-muted",
										children: "Imagen de Fondo"
									}), /* @__PURE__ */ jsx("input", {
										type: "file",
										className: "form-control",
										accept: "image/*",
										onChange: (e) => setCategoryImage(e.target.files ? e.target.files[0] : null),
										required: true
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label small text-muted",
										children: "Descripción Breve"
									}), /* @__PURE__ */ jsx("textarea", {
										className: "form-control",
										rows: 2,
										placeholder: "Breve descripción de la categoría...",
										value: categoryDescription,
										onChange: (e) => setCategoryDescription(e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "d-grid",
									children: /* @__PURE__ */ jsx("button", {
										type: "submit",
										className: "btn btn-primary btn-custom",
										children: "Guardar Categoría"
									})
								})
							]
						})
					})]
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "col-lg-7",
				children: /* @__PURE__ */ jsxs("div", {
					className: "card shadow-sm h-100 border-0",
					children: [/* @__PURE__ */ jsx("div", {
						className: "card-header bg-dark text-white",
						children: /* @__PURE__ */ jsxs("h5", {
							className: "mb-0 fw-bold",
							children: [/* @__PURE__ */ jsx("i", { className: "bi bi-pizza me-2" }), " Nuevo Producto"]
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "card-body",
						children: /* @__PURE__ */ jsxs("form", {
							onSubmit: handleProductSubmit,
							className: "row g-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "col-md-6",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label small text-muted",
										children: "Nombre del Producto"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										className: "form-control",
										placeholder: "Ej: Pizza Hawaiana",
										value: productTitle,
										onChange: (e) => setProductTitle(e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-md-6",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label small text-muted",
										children: "Categoría"
									}), /* @__PURE__ */ jsxs("select", {
										className: "form-select",
										value: productCategoryId,
										onChange: (e) => setProductCategoryId(e.target.value),
										required: true,
										children: [/* @__PURE__ */ jsx("option", {
											disabled: true,
											value: "",
											children: "Selecciona..."
										}), categories.map((c) => /* @__PURE__ */ jsx("option", {
											value: c.id,
											children: c.title
										}, c.id))]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-md-4",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label small text-muted",
										children: "Precio (€)"
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										step: "0.01",
										className: "form-control",
										placeholder: "0.00",
										value: productPrice,
										onChange: (e) => setProductPrice(e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-md-8",
									children: [
										/* @__PURE__ */ jsx("label", {
											className: "form-label small text-muted",
											children: "Alérgenos"
										}),
										/* @__PURE__ */ jsxs("button", {
											className: "btn btn-outline-secondary w-100 text-start d-flex justify-content-between align-items-center bg-white",
											type: "button",
											onClick: () => setShowAllergens(!showAllergens),
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-muted",
												children: "Seleccionar alérgenos..."
											}), /* @__PURE__ */ jsx("i", { className: `bi bi-chevron-${showAllergens ? "up" : "down"}` })]
										}),
										/* @__PURE__ */ jsx("div", {
											className: `collapse mt-2 ${showAllergens ? "show" : ""}`,
											id: "listaAlergenos",
											children: /* @__PURE__ */ jsx("div", {
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
														className: "col-6 col-sm-4",
														children: /* @__PURE__ */ jsxs("div", {
															className: "form-check",
															children: [/* @__PURE__ */ jsx("input", {
																className: "form-check-input",
																type: "checkbox",
																checked: productAllergies.includes(alg),
																onChange: () => toggleAllergy(alg),
																id: `alg-${alg.toLowerCase().replace(" ", "")}`
															}), /* @__PURE__ */ jsxs("label", {
																className: `form-check-label ${alg === "Picante" ? "text-danger" : ""}`,
																htmlFor: `alg-${alg.toLowerCase().replace(" ", "")}`,
																children: [
																	alg === "Picante" && /* @__PURE__ */ jsx("i", { className: "bi bi-fire me-1" }),
																	alg === "Gluten" && /* @__PURE__ */ jsx("i", { className: "bi bi-slash-circle me-1" }),
																	alg === "Lácteos" && /* @__PURE__ */ jsx("i", { className: "bi bi-droplet me-1" }),
																	alg === "Huevo" && /* @__PURE__ */ jsx("i", { className: "bi bi-egg-fried me-1" }),
																	alg === "Pescado" && /* @__PURE__ */ jsx("i", { className: "bi bi-water me-1" }),
																	alg === "Frutos Secos" && /* @__PURE__ */ jsx("i", { className: "bi bi-nut me-1" }),
																	alg !== "Picante" && alg !== "Gluten" && alg !== "Lácteos" && alg !== "Huevo" && alg !== "Pescado" && alg !== "Frutos Secos" && /* @__PURE__ */ jsx("i", { className: "bi bi-tag me-1" }),
																	alg === "Frutos Secos" ? "F. Secos" : alg
																]
															})]
														})
													}, alg))
												})
											})
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-12",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label small text-muted",
										children: "Imagen"
									}), /* @__PURE__ */ jsx("input", {
										type: "file",
										className: "form-control",
										accept: "image/*",
										onChange: (e) => setProductImage(e.target.files ? e.target.files[0] : null),
										required: true
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-12",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label small text-muted",
										children: "Descripción Breve"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										className: "form-control",
										placeholder: "Ej: Pizza clásica con pepperoni",
										value: productShortDesc,
										onChange: (e) => setProductShortDesc(e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-12",
									children: [/* @__PURE__ */ jsx("label", {
										className: "form-label small text-muted",
										children: "Descripción Detallada"
									}), /* @__PURE__ */ jsx("textarea", {
										className: "form-control",
										rows: 2,
										placeholder: "Ingredientes, elaboración...",
										value: productDesc,
										onChange: (e) => setProductDesc(e.target.value)
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "col-12 text-end",
									children: /* @__PURE__ */ jsx("button", {
										type: "submit",
										className: "btn btn-primary btn-custom px-4",
										children: "Guardar Producto"
									})
								})
							]
						})
					})]
				})
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "card shadow-sm mb-5 border-0",
			children: [/* @__PURE__ */ jsx("div", {
				className: "card-header bg-white py-3",
				children: /* @__PURE__ */ jsxs("h5", {
					className: "mb-0 fw-bold text-dark",
					children: [/* @__PURE__ */ jsx("i", { className: "bi bi-tags me-2" }), " Categorías Activas"]
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "card-body p-0",
				children: /* @__PURE__ */ jsx("div", {
					className: "table-responsive",
					children: /* @__PURE__ */ jsxs("table", {
						className: "table table-hover align-middle mb-0",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "table-light",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									className: "ps-4",
									children: "Imagen"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									children: "Nombre"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									children: "Productos"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									className: "text-end pe-4",
									children: "Acciones"
								})
							] })
						}), /* @__PURE__ */ jsxs("tbody", { children: [categories.map((cat) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("td", {
								className: "ps-4",
								children: cat.hasImage && /* @__PURE__ */ jsx("img", {
									src: `/api/v1/categories/${cat.id}/image`,
									className: "rounded-3 shadow-sm admin-table-img",
									style: {
										width: "45px",
										height: "45px",
										objectFit: "cover"
									},
									alt: cat.title
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "fw-bold",
								children: cat.title
							}),
							/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("span", {
								className: "badge bg-secondary rounded-pill",
								children: ["ID: ", cat.id]
							}) }),
							/* @__PURE__ */ jsxs("td", {
								className: "text-end pe-4",
								children: [/* @__PURE__ */ jsx(Link, {
									to: `/admin/categories/${cat.id}/edit`,
									className: "btn btn-sm btn-outline-primary me-1",
									title: "Editar",
									children: /* @__PURE__ */ jsx("i", { className: "bi bi-pencil" })
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-sm btn-outline-danger",
									title: "Borrar",
									onClick: () => confirmDelete("category", cat.id, cat.title),
									children: /* @__PURE__ */ jsx("i", { className: "bi bi-trash" })
								})]
							})
						] }, cat.id)), categories.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 4,
							className: "text-center py-4 text-muted",
							children: "No hay categorías"
						}) })] })]
					})
				})
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "card shadow-sm mb-5 border-0",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "card-header bg-white py-3 d-flex justify-content-between align-items-center",
				children: [/* @__PURE__ */ jsxs("h5", {
					className: "mb-0 fw-bold text-dark",
					children: [/* @__PURE__ */ jsx("i", { className: "bi bi-list-ul me-2" }), " Productos Activos"]
				}), /* @__PURE__ */ jsx("input", {
					type: "text",
					className: "form-control form-control-sm w-25",
					placeholder: "Filtrar productos...",
					value: productFilter,
					onChange: (e) => setProductFilter(e.target.value)
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "card-body p-0",
				children: /* @__PURE__ */ jsx("div", {
					className: "table-responsive",
					children: /* @__PURE__ */ jsxs("table", {
						className: "table table-hover align-middle mb-0",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "table-light",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									className: "ps-4",
									children: "Img"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									children: "Nombre"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									children: "Categoría"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									children: "Precio"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									children: "Alérgenos"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									className: "text-end pe-4",
									children: "Acciones"
								})
							] })
						}), /* @__PURE__ */ jsxs("tbody", { children: [filteredProducts.map((prod) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("td", {
								className: "ps-4",
								children: prod.hasImage ? /* @__PURE__ */ jsx("img", {
									src: `/api/v1/products/${prod.id}/image`,
									className: "rounded-circle admin-table-img",
									style: {
										width: "45px",
										height: "45px",
										objectFit: "cover"
									},
									alt: prod.title
								}) : /* @__PURE__ */ jsx("div", {
									className: "rounded-circle admin-table-img bg-light p-1 d-flex align-items-center justify-content-center",
									style: {
										width: "45px",
										height: "45px"
									},
									children: /* @__PURE__ */ jsx("i", { className: "bi bi-image text-muted" })
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "fw-bold",
								children: prod.title
							}),
							/* @__PURE__ */ jsx("td", { children: prod.categoryTitle ? /* @__PURE__ */ jsx("span", {
								className: "badge bg-dark",
								children: prod.categoryTitle
							}) : /* @__PURE__ */ jsx("span", {
								className: "badge border border-danger text-danger",
								children: "Unassigned"
							}) }),
							/* @__PURE__ */ jsxs("td", {
								className: "text-primary-custom fw-bold",
								children: [prod.price.toFixed(2), "€"]
							}),
							/* @__PURE__ */ jsx("td", { children: prod.allergies && prod.allergies.length > 0 ? prod.allergies.map((alg, i) => /* @__PURE__ */ jsx("span", {
								className: "badge bg-secondary fw-normal me-1",
								children: alg
							}, i)) : /* @__PURE__ */ jsx("small", {
								className: "text-muted",
								children: "-"
							}) }),
							/* @__PURE__ */ jsxs("td", {
								className: "text-end pe-4",
								children: [/* @__PURE__ */ jsx(Link, {
									to: `/admin/products/${prod.id}/edit`,
									className: "btn btn-sm btn-outline-primary me-1",
									title: "Editar",
									children: /* @__PURE__ */ jsx("i", { className: "bi bi-pencil" })
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-sm btn-outline-danger",
									title: "Borrar",
									onClick: () => confirmDelete("product", prod.id, prod.title),
									children: /* @__PURE__ */ jsx("i", { className: "bi bi-trash" })
								})]
							})
						] }, prod.id)), filteredProducts.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 6,
							className: "text-center py-4 text-muted",
							children: "No hay productos"
						}) })] })]
					})
				})
			})]
		}),
		showModal && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", { className: "modal-backdrop fade show" }), /* @__PURE__ */ jsx("div", {
			className: "modal fade show d-block",
			tabIndex: -1,
			children: /* @__PURE__ */ jsx("div", {
				className: "modal-dialog modal-dialog-centered",
				children: /* @__PURE__ */ jsxs("div", {
					className: "modal-content border-0 shadow-lg",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "modal-header bg-danger text-white",
							children: [/* @__PURE__ */ jsxs("h5", {
								className: "modal-title",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-exclamation-triangle-fill me-2" }), " Confirmar Eliminación"]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn-close btn-close-white",
								onClick: () => setShowModal(false)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "modal-body text-center py-4",
							children: [
								/* @__PURE__ */ jsx("i", {
									className: "bi bi-x-circle text-danger mb-3",
									style: { fontSize: "3rem" }
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mb-0 fs-5 text-dark",
									children: [
										"¿Seguro que quieres borrar ",
										deleteType === "category" ? "la categoría" : "el producto",
										" '",
										itemToDelete?.title,
										"' permanentemente?"
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-muted small mt-2",
									children: "Esta acción no se puede deshacer."
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "modal-footer bg-light justify-content-center",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-outline-secondary px-4",
								onClick: () => setShowModal(false),
								children: "Cancelar"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-danger px-4",
								onClick: handleDelete,
								children: "Sí, borrar permanentemente"
							})]
						})
					]
				})
			})
		})] })
	] });
});
//#endregion
export { categories_default as default };
