import { NavLink, Outlet } from "react-router";
import { useUserStore } from "../../stores/user-store";

export default function AdminLayout() {
    const { user, isAdmin } = useUserStore();

    if (!user || !isAdmin) {
        return (
            <div className="container mt-5 text-center">
                <h2>Acceso Denegado</h2>
                <p>No tienes permisos para ver esta página.</p>
                <NavLink to="/" className="btn btn-primary mt-3">Volver al Inicio</NavLink>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse p-0">
                    <div className="position-sticky pt-3 text-white">
                        <NavLink to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none px-3">
                            <span className="fs-4 title-font">Aparizzio Admin</span>
                        </NavLink>
                        <hr className="text-white" />
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item">
                                <NavLink to="/admin/metrics" className={({ isActive }) => `nav-link text-white rounded-0 px-3 ${isActive ? 'active' : ''}`}>
                                    <i className="bi bi-speedometer2 me-2"></i> Dashboard
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/admin/users" className={({ isActive }) => `nav-link text-white rounded-0 px-3 ${isActive ? 'active' : ''}`}>
                                    <i className="bi bi-people-fill me-2"></i> Usuarios
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/admin/orders" className={({ isActive }) => `nav-link text-white rounded-0 px-3 ${isActive ? 'active' : ''}`}>
                                    <i className="bi bi-cart-check me-2"></i> Pedidos
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/admin/categories" className={({ isActive }) => `nav-link text-white rounded-0 px-3 ${isActive ? 'active' : ''}`}>
                                    <i className="bi bi-tags me-2"></i> Categorías y Productos
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light py-4" style={{ minHeight: "100vh" }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
