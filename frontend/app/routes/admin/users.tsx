import { useState } from "react";
import { useLoaderData } from "react-router";
import { Modal } from "react-bootstrap";
import { adminUserService } from "../../services/admin-user-service";
import type { UserDTO } from "../../dtos/UserDTO";

export async function clientLoader() {
    try {
        const users = await adminUserService.getAllUsers();
        return { users, error: null };
    } catch (e: any) {
        return { users: [], error: e.message };
    }
}

export default function AdminUsers() {
    const { users: initialUsers, error: loadError } = useLoaderData<typeof clientLoader>();
    // const navigate = useNavigate();

    // Holds the user list and the form/modal state.
    const [users, setUsers] = useState<UserDTO[]>(initialUsers);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState(loadError || "");

    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formRole, setFormRole] = useState("");
    const [formPassword, setFormPassword] = useState("");

    const [passwordModalUser, setPasswordModalUser] = useState<UserDTO | null>(null);
    const [newPassword, setNewPassword] = useState("");

    const [deleteModalUser, setDeleteModalUser] = useState<UserDTO | null>(null);

    // Creates a new user and adds it to the table.
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        try {
            const created = await adminUserService.createUser({
                name: formName,
                email: formEmail,
                password: formPassword,
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

    // Deletes the selected user from the list.
    const handleDelete = async () => {
        if (!deleteModalUser) return;
        try {
            await adminUserService.deleteUser(deleteModalUser.id);
            setUsers(users.filter(u => u.id !== deleteModalUser.id));
            setSuccessMessage("El usuario ha sido eliminado.");
            setDeleteModalUser(null);
        } catch (error) {
            setErrorMessage("Error al borrar usuario. Asegúrate de que no es el administrador principal.");
            setDeleteModalUser(null);
        }
    };

    // Updates the selected user's password.
    const handleChangePassword = async (e: React.FormEvent) => {
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

    return (
        <>
            {/* Feedback messages shown after create, update, or delete actions. */}
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show mt-3 shadow-sm" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i> {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-danger alert-dismissible fade show mt-3 shadow-sm" role="alert">
                    <i className="bi bi-x-circle-fill me-2"></i> {errorMessage}
                    <button type="button" className="btn-close" onClick={() => setErrorMessage("")}></button>
                </div>
            )}

            {/* Page title. */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
                <h1 className="h2 title-font text-dark">Gestión de Usuarios</h1>
            </div>

            {/* New user form. */}
            <div className="card shadow-sm mb-5 border-0">
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0 fw-bold"><i className="bi bi-person-plus-fill me-2"></i> Crear Nuevo Usuario</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleCreateUser} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small text-muted">Nombre Completo</label>
                            <input type="text" className="form-control" placeholder="Ej: Laura García" required
                                value={formName} onChange={e => setFormName(e.target.value)} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small text-muted">Correo Electrónico</label>
                            <input type="email" className="form-control" placeholder="usuario@aparizzio.com" required
                                value={formEmail} onChange={e => setFormEmail(e.target.value)} />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small text-muted">Rol de Usuario</label>
                            <select className="form-select" required value={formRole} onChange={e => setFormRole(e.target.value)}>
                                <option disabled value="">Selecciona un rol...</option>
                                <option value="USER">Cliente (Usuario)</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small text-muted">Contraseña</label>
                            <input type="password" className="form-control" placeholder="******" required
                                value={formPassword} onChange={e => setFormPassword(e.target.value)} />
                        </div>

                        <div className="col-12 text-end mt-4">
                            <button type="submit" className="btn btn-primary btn-custom px-4">
                                <i className="bi bi-save me-2"></i> Guardar Usuario
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Users table. */}
            <div className="card shadow-sm mb-5 border-0">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-people me-2"></i> Lista de Usuarios</h5>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className="ps-4">ID</th>
                                    <th scope="col">Usuario</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Rol</th>
                                    <th scope="col" className="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="ps-4 text-muted">#{u.id}</td>
                                        <td className="fw-bold">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&color=fff`}
                                                className="rounded-circle me-2 admin-table-img"
                                                style={{ width: "40px", height: "40px", objectFit: "cover" }} alt="" />
                                            {u.name}
                                        </td>
                                        <td>{u.email}</td>
                                        <td>
                                            {u.roles.map(r => (
                                                <span key={r} className="badge bg-dark me-1">{r}</span>
                                            ))}
                                        </td>
                                        <td className="text-end pe-4">
                                            <button type="button" className="btn btn-sm btn-outline-primary me-1"
                                                title="Cambiar Clave" onClick={() => setPasswordModalUser(u)}>
                                                <i className="bi bi-key"></i>
                                            </button>
                                            <button type="button" className="btn btn-sm btn-outline-danger"
                                                title="Borrar" onClick={() => setDeleteModalUser(u)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Password change modal. */}
            <Modal show={!!passwordModalUser} onHide={() => setPasswordModalUser(null)}>
                <form onSubmit={handleChangePassword}>
                    <Modal.Header className="bg-dark text-white" closeButton closeVariant="white">
                        <Modal.Title><i className="bi bi-key-fill me-2"></i> Cambiar Contraseña</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Introduce una nueva contraseña para <strong className="text-primary-custom">{passwordModalUser?.name}</strong>.</p>
                        <div className="mb-3">
                            <label className="form-label small text-muted">Nueva Contraseña</label>
                            <input type="password" name="newPassword" className="form-control" required minLength={4}
                                value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="bg-light">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setPasswordModalUser(null)}>Cancelar</button>
                        <button type="submit" className="btn btn-primary btn-custom">Guardar Contraseña</button>
                    </Modal.Footer>
                </form>
            </Modal>

            {/* Delete confirmation modal. */}
            <Modal show={!!deleteModalUser} onHide={() => setDeleteModalUser(null)} centered>
                <Modal.Header className="bg-danger text-white" closeButton closeVariant="white">
                    <Modal.Title><i className="bi bi-exclamation-triangle-fill me-2"></i> Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <i className="bi bi-x-circle text-danger mb-3" style={{ fontSize: "3rem" }}></i>
                    <p className="mb-0 fs-5 text-dark">¿Seguro que quieres borrar el usuario '{deleteModalUser?.name}' y todo su historial de pedidos permanentemente?</p>
                    <p className="text-muted small mt-2">Esta acción no se puede deshacer.</p>
                </Modal.Body>
                <Modal.Footer className="bg-light justify-content-center">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setDeleteModalUser(null)}>Cancelar</button>
                    <button type="button" className="btn btn-danger px-4" onClick={handleDelete}>Sí, borrar permanentemente</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}