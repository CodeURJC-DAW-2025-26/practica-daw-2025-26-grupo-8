// frontend/app/routes/profile.tsx
import { useState, useEffect } from "react";
import { Link, redirect, useLoaderData } from "react-router";
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useUserStore } from "../stores/user-store";
import { authService } from "../services/auth-sevice";
import { userService } from "../services/user-service";
import { productService } from "../services/product-service";
import type { OrderDTO } from "../dtos/OrderDTO";

/**
 * CLIENT LOADER: Solo protege la página, devuelve el usuario inmediatamente.
 * Los pedidos se cargan en segundo plano con useEffect para evitar delay.
 */
export async function clientLoader() {
    const user = useUserStore.getState().user;
    if (!user) {
        return redirect("/?auth=login&auth_required=1");
    }
    return { user };
}

export default function Profile() {
    const { user } = useLoaderData<typeof clientLoader>();
    const setCurrentUser = useUserStore((state) => state.setCurrentUser);

    // Estado para las órdenes (cargadas en background)
    const [orders, setOrders] = useState<OrderDTO[]>([]);
    const [pricesByTitle, setPricesByTitle] = useState<Map<string, number>>(new Map());
    const [loadingOrders, setLoadingOrders] = useState(true);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        newPassword: "",
        oldPassword: ""
    });
    const [status, setStatus] = useState<{ type: 'success' | 'danger', msg: string } | null>(null);

    // Cargar pedidos en background (no bloquea la renderización)
    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoadingOrders(true);
                const [ordersData, catalog] = await Promise.all([
                    authService.getMyOrders(),
                    productService.getProducts(0, 1000)
                ]);

                setOrders(ordersData);

                const priceMap = new Map<string, number>();
                for (const product of catalog.content) {
                    priceMap.set(product.title, product.price);
                }
                setPricesByTitle(priceMap);
            } catch (error) {
                console.error("Error cargando pedidos:", error);
                setOrders([]);
            } finally {
                setLoadingOrders(false);
            }
        };

        loadOrders();
    }, []); // Solo ejecuta una vez al montar el componente

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedUser = await userService.updateProfile({
                name: formData.name,
                email: formData.email,
                newPassword: formData.newPassword || undefined,
                oldPassword: formData.oldPassword
            });

            setCurrentUser(updatedUser);
            setFormData((prev) => ({ ...prev, newPassword: "", oldPassword: "" }));
            setStatus({ type: 'success', msg: '¡Perfil actualizado correctamente!' });
        } catch {
            setStatus({
                type: 'danger',
                msg: 'Error: La contraseña actual es incorrecta. No se han guardado los cambios.'
            });
        }
    };

    return (
        <Container className="section-padding mt-4 mb-5">
            <h2 className="section-title text-center mb-5">Mi Perfil</h2>

            {status && (
                <Alert
                    variant={status.type}
                    dismissible
                    onClose={() => setStatus(null)}
                    className="text-center"
                >
                    {status.msg}
                </Alert>
            )}

            <Row className="g-5">
                <Col md={6}>
                    <Card className="shadow-sm h-100">
                        <Card.Header className="bg-primary text-white">
                            <h3 className="h5 mb-0"><i className="bi bi-person-gear me-2"></i>Editar Información</h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-muted mb-1" htmlFor="name">Nombre</Form.Label>
                                    <Form.Control
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-muted mb-1" htmlFor="email">Correo Electrónico</Form.Label>
                                    <Form.Control
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-muted mb-1" htmlFor="newPassword">Nueva Contraseña</Form.Label>
                                    <Form.Control
                                        id="newPassword"
                                        type="password"
                                        placeholder="Dejar en blanco para mantener la actual"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    />
                                </Form.Group>

                                <hr className="mb-4" />

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-danger mb-1" htmlFor="oldPassword">Contraseña Actual *</Form.Label>
                                    <p className="small text-muted mb-2">Debes introducir tu contraseña actual para guardar cualquier cambio.</p>
                                    <Form.Control
                                        id="oldPassword"
                                        type="password"
                                        className="border-danger"
                                        value={formData.oldPassword}
                                        onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button type="submit" className="btn-cta">Guardar Cambios</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow-sm h-100">
                        <Card.Header className="bg-dark text-white">
                            <h3 className="h5 mb-0"><i className="bi bi-bag-check me-2"></i>Mis Pedidos</h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {loadingOrders ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" role="status" className="text-primary mb-3">
                                        <span className="visually-hidden">Cargando pedidos...</span>
                                    </Spinner>
                                    <p className="text-muted">Cargando tus pedidos...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center text-muted mt-4">
                                    <i className="bi bi-receipt display-4 d-block mb-3"></i>
                                    <p>Aún no has realizado ningún pedido.</p>
                                    <Link to="/menu" className="btn btn-outline-primary mt-2">Ver la carta</Link>
                                </div>
                            ) : (
                                <>
                                    {orders.map((order) => (
                                        <Card key={order.id} className="mb-3 border-0 shadow-sm">
                                            <Card.Header className="bg-light d-flex justify-content-between align-items-center border-bottom-0">
                                                <h5 className="mb-0 text-primary fw-bold">Pedido #{order.id}</h5>
                                            </Card.Header>

                                            <Card.Body className="p-0">
                                                <ul className="list-group list-group-flush">
                                                    {(order.productTitles || []).map((title, index) => (
                                                        <li
                                                            key={`${order.id}-${title}-${index}`}
                                                            className="list-group-item d-flex justify-content-between align-items-center bg-transparent"
                                                        >
                                                            <span><i className="bi bi-caret-right text-secondary me-2"></i>{title}</span>
                                                            <span className="text-muted fw-bold">
                                                                {pricesByTitle.has(title) ? `${pricesByTitle.get(title)}€` : "-"}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}