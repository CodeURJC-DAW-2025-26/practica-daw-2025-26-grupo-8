import { Link, NavLink } from "react-router";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useUserStore } from "../stores/user-store";

export default function Header() {
    const { isLogged, isAdmin, user, removeCurrentUser } = useUserStore();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">Pizzería Aparizzio 🍕</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/">Inicio</Nav.Link>
                        <Nav.Link as={NavLink} to="/menu">Carta</Nav.Link>
                        {isLogged && <Nav.Link as={NavLink} to="/orders">Mis Pedidos</Nav.Link>}
                        {isAdmin && <Nav.Link as={NavLink} to="/admin" className="text-warning">Panel Admin</Nav.Link>}
                    </Nav>
                    <Nav>
                        {isLogged ? (
                            <>
                                <Navbar.Text className="me-3">
                                    Hola, <strong>{user?.name}</strong>
                                </Navbar.Text>
                                <Button variant="outline-light" size="sm" onClick={removeCurrentUser}>
                                    Cerrar Sesión
                                </Button>
                            </>
                        ) : (
                            <Nav.Link as={NavLink} to="/login">Iniciar Sesión</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}