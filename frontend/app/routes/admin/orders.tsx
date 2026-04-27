import { Link, useLoaderData, useLocation } from "react-router";
import { orderService } from "../../services/order-service";
import { adminUserService } from "../../services/admin-user-service";
import type { OrderDTO } from "../../dtos/OrderDTO";
import type { UserDTO } from "../../dtos/UserDTO";

// Loads orders and users for the admin orders page.
export async function clientLoader() {
    try {
        const [orders, users] = await Promise.all([
            orderService.getAllOrders(),
            adminUserService.getAllUsers()
        ]);
        return { orders, users };
    } catch (error) {
        console.error("Error loading orders or users:", error);
        return { orders: [] as OrderDTO[], users: [] as UserDTO[] };
    }
}

export default function AdminOrders() {
    const { orders, users } = useLoaderData<typeof clientLoader>();
    const location = useLocation();
    const flashMessage = location.state?.message;
    const isWarning = location.state?.type === "warning";

    // Returns the user name from the order email.
    const getUserName = (email: string) => {
        if (!email) return "Invitado";
        const user = users.find(u => u.email === email);
        return user ? user.name : "Invitado";
    };

    return (
        <>
            {/* Optional flash message from previous actions. */}
            {flashMessage && (
                <div className={`alert ${isWarning ? 'alert-warning' : 'alert-success'} alert-dismissible fade show mt-3 shadow-sm`} role="alert">
                    <i className={`bi ${isWarning ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} me-2`}></i> {flashMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>
            )}

            {/* Page title. */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
                <h1 className="h2 title-font text-dark">Gestión de Pedidos</h1>
            </div>

            {/* Orders table with a fallback empty state. */}
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th className="ps-4">ID Pedido</th>
                                    <th>Cliente</th>
                                    <th>Dirección</th>
                                    <th>Ciudad</th>
                                    <th>Teléfono</th>
                                    <th className="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="ps-4 fw-bold text-secondary">#ORD-{order.id}</td>
                                            <td className="fw-bold">
                                                <i className="bi bi-person-circle text-muted me-1"></i>
                                                {getUserName(order.userEmail)}
                                            </td>
                                            <td>{order.address}</td>
                                            <td>{order.city}</td>
                                            <td>{order.phoneNumber}</td>
                                            <td className="text-end pe-4">
                                                <Link to={`/admin/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                                                    <i className="bi bi-eye"></i> Ver Detalle
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5 text-muted">
                                            <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
                                            <h5 className="fw-bold">Sin pedidos</h5>
                                            <p className="mb-0">Aún no hay ningún pedido registrado en el sistema.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}