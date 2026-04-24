import { t as adminUserService } from "./admin-user-service-CZCeC8sI.js";
import { UNSAFE_withComponentProps, useLoaderData } from "react-router";
import { Modal } from "react-bootstrap";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
//#region app/routes/admin/users.tsx
async function clientLoader() {
	try {
		return {
			users: await adminUserService.getAllUsers(),
			error: null
		};
	} catch (e) {
		return {
			users: [],
			error: e.message
		};
	}
}
var users_default = UNSAFE_withComponentProps(function AdminUsers() {
	const { users: initialUsers, error: loadError } = useLoaderData();
	const [users, setUsers] = useState(initialUsers);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState(loadError || "");
	const [formName, setFormName] = useState("");
	const [formEmail, setFormEmail] = useState("");
	const [formRole, setFormRole] = useState("");
	const [formPassword, setFormPassword] = useState("");
	const [passwordModalUser, setPasswordModalUser] = useState(null);
	const [newPassword, setNewPassword] = useState("");
	const [deleteModalUser, setDeleteModalUser] = useState(null);
	const handleCreateUser = async (e) => {
		e.preventDefault();
		setSuccessMessage("");
		setErrorMessage("");
		try {
			const created = await adminUserService.createUser({
				name: formName,
				email: formEmail,
				password: formPassword
			}, formRole);
			setUsers([...users, created]);
			setSuccessMessage(`El usuario '${created.name}' ha sido creado correctamente con el rol ${formRole}.`);
			setFormName("");
			setFormEmail("");
			setFormRole("");
			setFormPassword("");
		} catch (error) {
			setErrorMessage("Error al crear usuario.");
		}
	};
	const handleDelete = async () => {
		if (!deleteModalUser) return;
		try {
			await adminUserService.deleteUser(deleteModalUser.id);
			setUsers(users.filter((u) => u.id !== deleteModalUser.id));
			setSuccessMessage("El usuario ha sido eliminado.");
			setDeleteModalUser(null);
		} catch (error) {
			setErrorMessage("Error al borrar usuario. Asegúrate de que no es el administrador principal.");
			setDeleteModalUser(null);
		}
	};
	const handleChangePassword = async (e) => {
		e.preventDefault();
		if (!passwordModalUser) return;
		try {
			await adminUserService.changePassword(passwordModalUser.id, { newPassword });
			setSuccessMessage("La contraseña del usuario ha sido actualizada con éxito.");
			setPasswordModalUser(null);
			setNewPassword("");
		} catch (error) {
			setErrorMessage("Error cambiando la contraseña.");
			setPasswordModalUser(null);
			setNewPassword("");
		}
	};
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
				children: "Gestión de Usuarios"
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "card shadow-sm mb-5 border-0",
			children: [/* @__PURE__ */ jsx("div", {
				className: "card-header bg-dark text-white",
				children: /* @__PURE__ */ jsxs("h5", {
					className: "mb-0 fw-bold",
					children: [/* @__PURE__ */ jsx("i", { className: "bi bi-person-plus-fill me-2" }), " Crear Nuevo Usuario"]
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "card-body",
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: handleCreateUser,
					className: "row g-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "col-md-6",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label small text-muted",
								children: "Nombre Completo"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								className: "form-control",
								placeholder: "Ej: Laura García",
								required: true,
								value: formName,
								onChange: (e) => setFormName(e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-md-6",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label small text-muted",
								children: "Correo Electrónico"
							}), /* @__PURE__ */ jsx("input", {
								type: "email",
								className: "form-control",
								placeholder: "usuario@aparizzio.com",
								required: true,
								value: formEmail,
								onChange: (e) => setFormEmail(e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-md-6",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label small text-muted",
								children: "Rol de Usuario"
							}), /* @__PURE__ */ jsxs("select", {
								className: "form-select",
								required: true,
								value: formRole,
								onChange: (e) => setFormRole(e.target.value),
								children: [
									/* @__PURE__ */ jsx("option", {
										disabled: true,
										value: "",
										children: "Selecciona un rol..."
									}),
									/* @__PURE__ */ jsx("option", {
										value: "USER",
										children: "Cliente (Usuario)"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "ADMIN",
										children: "Administrador"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-md-6",
							children: [/* @__PURE__ */ jsx("label", {
								className: "form-label small text-muted",
								children: "Contraseña"
							}), /* @__PURE__ */ jsx("input", {
								type: "password",
								className: "form-control",
								placeholder: "******",
								required: true,
								value: formPassword,
								onChange: (e) => setFormPassword(e.target.value)
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "col-12 text-end mt-4",
							children: /* @__PURE__ */ jsxs("button", {
								type: "submit",
								className: "btn btn-primary btn-custom px-4",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-save me-2" }), " Guardar Usuario"]
							})
						})
					]
				})
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "card shadow-sm mb-5 border-0",
			children: [/* @__PURE__ */ jsx("div", {
				className: "card-header bg-white py-3 d-flex justify-content-between align-items-center",
				children: /* @__PURE__ */ jsxs("h5", {
					className: "mb-0 fw-bold text-dark",
					children: [/* @__PURE__ */ jsx("i", { className: "bi bi-people me-2" }), " Lista de Usuarios"]
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
									children: "ID"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									children: "Usuario"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									children: "Email"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									children: "Rol"
								}),
								/* @__PURE__ */ jsx("th", {
									scope: "col",
									className: "text-end pe-4",
									children: "Acciones"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", { children: users.map((u) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsxs("td", {
								className: "ps-4 text-muted",
								children: ["#", u.id]
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "fw-bold",
								children: [/* @__PURE__ */ jsx("img", {
									src: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&color=fff`,
									className: "rounded-circle me-2 admin-table-img",
									style: {
										width: "40px",
										height: "40px",
										objectFit: "cover"
									},
									alt: ""
								}), u.name]
							}),
							/* @__PURE__ */ jsx("td", { children: u.email }),
							/* @__PURE__ */ jsx("td", { children: u.roles.map((r) => /* @__PURE__ */ jsx("span", {
								className: "badge bg-dark me-1",
								children: r
							}, r)) }),
							/* @__PURE__ */ jsxs("td", {
								className: "text-end pe-4",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-sm btn-outline-primary me-1",
									title: "Cambiar Clave",
									onClick: () => setPasswordModalUser(u),
									children: /* @__PURE__ */ jsx("i", { className: "bi bi-key" })
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn-sm btn-outline-danger",
									title: "Borrar",
									onClick: () => setDeleteModalUser(u),
									children: /* @__PURE__ */ jsx("i", { className: "bi bi-trash" })
								})]
							})
						] }, u.id)) })]
					})
				})
			})]
		}),
		/* @__PURE__ */ jsx(Modal, {
			show: !!passwordModalUser,
			onHide: () => setPasswordModalUser(null),
			children: /* @__PURE__ */ jsxs("form", {
				onSubmit: handleChangePassword,
				children: [
					/* @__PURE__ */ jsx(Modal.Header, {
						className: "bg-dark text-white",
						closeButton: true,
						closeVariant: "white",
						children: /* @__PURE__ */ jsxs(Modal.Title, { children: [/* @__PURE__ */ jsx("i", { className: "bi bi-key-fill me-2" }), " Cambiar Contraseña"] })
					}),
					/* @__PURE__ */ jsxs(Modal.Body, { children: [/* @__PURE__ */ jsxs("p", { children: [
						"Introduce una nueva contraseña para ",
						/* @__PURE__ */ jsx("strong", {
							className: "text-primary-custom",
							children: passwordModalUser?.name
						}),
						"."
					] }), /* @__PURE__ */ jsxs("div", {
						className: "mb-3",
						children: [/* @__PURE__ */ jsx("label", {
							className: "form-label small text-muted",
							children: "Nueva Contraseña"
						}), /* @__PURE__ */ jsx("input", {
							type: "password",
							name: "newPassword",
							className: "form-control",
							required: true,
							minLength: 4,
							value: newPassword,
							onChange: (e) => setNewPassword(e.target.value)
						})]
					})] }),
					/* @__PURE__ */ jsxs(Modal.Footer, {
						className: "bg-light",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn-outline-secondary",
							onClick: () => setPasswordModalUser(null),
							children: "Cancelar"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "btn btn-primary btn-custom",
							children: "Guardar Contraseña"
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ jsxs(Modal, {
			show: !!deleteModalUser,
			onHide: () => setDeleteModalUser(null),
			centered: true,
			children: [
				/* @__PURE__ */ jsx(Modal.Header, {
					className: "bg-danger text-white",
					closeButton: true,
					closeVariant: "white",
					children: /* @__PURE__ */ jsxs(Modal.Title, { children: [/* @__PURE__ */ jsx("i", { className: "bi bi-exclamation-triangle-fill me-2" }), " Confirmar Eliminación"] })
				}),
				/* @__PURE__ */ jsxs(Modal.Body, {
					className: "text-center py-4",
					children: [
						/* @__PURE__ */ jsx("i", {
							className: "bi bi-x-circle text-danger mb-3",
							style: { fontSize: "3rem" }
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mb-0 fs-5 text-dark",
							children: [
								"¿Seguro que quieres borrar el usuario '",
								deleteModalUser?.name,
								"' y todo su historial de pedidos permanentemente?"
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-muted small mt-2",
							children: "Esta acción no se puede deshacer."
						})
					]
				}),
				/* @__PURE__ */ jsxs(Modal.Footer, {
					className: "bg-light justify-content-center",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn-outline-secondary px-4",
						onClick: () => setDeleteModalUser(null),
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
	] });
});
//#endregion
export { clientLoader, users_default as default };
