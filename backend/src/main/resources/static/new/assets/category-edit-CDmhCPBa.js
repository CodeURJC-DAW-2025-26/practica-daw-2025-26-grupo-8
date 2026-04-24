import { t as categoryService } from "./category-service-DucSZTVQ.js";
import { Link, UNSAFE_withComponentProps, useParams } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region app/routes/admin/category-edit.tsx
var category_edit_default = UNSAFE_withComponentProps(function AdminCategoryEdit() {
	const { id } = useParams();
	const [category, setCategory] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [imageFile, setImageFile] = useState(null);
	useEffect(() => {
		if (!id) return;
		categoryService.getCategoryById(parseInt(id)).then((cat) => {
			setCategory(cat);
			setTitle(cat.title);
			setDescription(cat.description);
			setLoading(false);
		}).catch((err) => {
			setError("Error al cargar categoría: " + err.message);
			setLoading(false);
		});
	}, [id]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!id) return;
		setError("");
		setSuccess("");
		try {
			await categoryService.updateCategory(parseInt(id), {
				title,
				description
			}, imageFile);
			setCategory(await categoryService.getCategoryById(parseInt(id)));
			setImageFile(null);
			const fileInput = document.getElementById("categoryImageInput");
			if (fileInput) fileInput.value = "";
			setSuccess("Cambios guardados con éxito.");
		} catch (err) {
			setError("Error al actualizar categoría: " + err.message);
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "text-center mt-5",
		children: "Cargando..."
	});
	if (!category && !loading) return /* @__PURE__ */ jsx("div", {
		className: "alert alert-danger mt-5",
		children: "Categoría no encontrada."
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
				children: "Edit Category"
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
						category?.title
					]
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "card-body p-4",
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "row g-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "col-12",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label small text-muted",
								children: "Category Name"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								className: "form-control",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-12",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "form-label small text-muted",
									children: "New Background Image (Optional)"
								}),
								category?.hasImage && /* @__PURE__ */ jsxs("div", {
									className: "mb-2 d-flex align-items-center",
									children: [/* @__PURE__ */ jsx("img", {
										src: `/api/v1/categories/${category.id}/image?timestamp=${Date.now()}`,
										className: "rounded-3 shadow-sm border",
										style: {
											width: "80px",
											height: "50px",
											objectFit: "cover"
										},
										alt: "Current"
									}), /* @__PURE__ */ jsx("span", {
										className: "ms-2 small text-muted",
										children: "Uploading a new one replaces this."
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "file",
									id: "categoryImageInput",
									className: "form-control",
									accept: "image/*",
									onChange: (e) => setImageFile(e.target.files ? e.target.files[0] : null)
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-12",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label small text-muted",
								children: "Description"
							}), /* @__PURE__ */ jsx("textarea", {
								className: "form-control",
								rows: 3,
								value: description,
								onChange: (e) => setDescription(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "col-12 text-end mt-4",
							children: /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "btn btn-primary btn-custom px-5",
								children: "Save Category Changes"
							})
						})
					]
				})
			})]
		})
	] });
});
//#endregion
export { category_edit_default as default };
