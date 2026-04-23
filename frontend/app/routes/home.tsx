import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate, useSearchParams } from "react-router";
import { Alert, Modal } from "react-bootstrap";
import { categoryService } from "../services/category-service";
import { productService } from "../services/product-service";
import { authService } from "../services/auth-sevice";
import type { ProductDTO } from "../dtos/ProductDTO";
import type { OrderDTO } from "../dtos/OrderDTO";
import { useUserStore } from "../stores/user-store";
import logoImage from "../assets/images/logo.png";
import authImage from "../assets/images/inicio-sesion_resized.jpg";

type TopProductMetric = {
    productId: number;
    name: string;
    count: number;
};

type LoaderData = {
    categories: Awaited<ReturnType<typeof categoryService.getCategories>>;
    topProducts: ProductDTO[];
};

const LIMIT = 5;

function normalize(value: string): string {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function resolveCategoryKey(product: ProductDTO): string {
    const category = normalize(product.categoryTitle || "");

    if (category.includes("pizza")) {
        return "PIZZA";
    }
    if (category.includes("aperitivo") || category.includes("entrante")) {
        return "STARTER";
    }
    if (category.includes("bebida")) {
        return "DRINK";
    }

    return "OTHER";
}

function distinctFromLatestOrder(order: OrderDTO, catalogByTitle: Map<string, ProductDTO>): ProductDTO[] {
    const seen = new Set<number>();
    const result: ProductDTO[] = [];

    for (const title of order.productTitles || []) {
        const mapped = catalogByTitle.get(normalize(title));
        if (!mapped || seen.has(mapped.id)) {
            continue;
        }

        seen.add(mapped.id);
        result.push(mapped);
    }

    return result;
}

function countPoints(orders: OrderDTO[], catalogByTitle: Map<string, ProductDTO>): Map<number, number> {
    const points = new Map<number, number>();

    for (const order of orders) {
        for (const title of order.productTitles || []) {
            const mapped = catalogByTitle.get(normalize(title));
            if (!mapped) {
                continue;
            }

            points.set(mapped.id, (points.get(mapped.id) ?? 0) + 1);
        }
    }

    return points;
}

function fillPriority(latestProducts: ProductDTO[]): string[] {
    const hasPizza = latestProducts.some((p) => resolveCategoryKey(p) === "PIZZA");
    const hasStarter = latestProducts.some((p) => resolveCategoryKey(p) === "STARTER");
    const hasDrink = latestProducts.some((p) => resolveCategoryKey(p) === "DRINK");

    const priority: string[] = [];
    if (hasPizza) {
        priority.push("PIZZA", "STARTER", "DRINK");
    } else if (hasStarter) {
        priority.push("STARTER", "PIZZA", "DRINK");
    } else if (hasDrink) {
        priority.push("DRINK", "PIZZA", "STARTER");
    }
    priority.push("OTHER");

    return priority;
}

function buildRecommendations(orders: OrderDTO[], catalog: ProductDTO[]): ProductDTO[] {
    if (!orders.length || !catalog.length) {
        return [];
    }

    const latestOrder = [...orders].sort((a, b) => a.id - b.id).at(-1);
    if (!latestOrder) {
        return [];
    }

    const catalogByTitle = new Map(catalog.map((p) => [normalize(p.title), p]));
    const userPoints = countPoints(orders, catalogByTitle);
    const latestPoints = countPoints([latestOrder], catalogByTitle);

    const latestDistinct = distinctFromLatestOrder(latestOrder, catalogByTitle);
    if (!latestDistinct.length) {
        return [];
    }

    const rankedLatest = [...latestDistinct].sort((a, b) => {
        const latestDiff = (latestPoints.get(b.id) ?? 0) - (latestPoints.get(a.id) ?? 0);
        if (latestDiff !== 0) {
            return latestDiff;
        }

        const userDiff = (userPoints.get(b.id) ?? 0) - (userPoints.get(a.id) ?? 0);
        if (userDiff !== 0) {
            return userDiff;
        }

        return b.id - a.id;
    });

    if (rankedLatest.length >= LIMIT) {
        return rankedLatest.slice(0, LIMIT);
    }

    const recommendations = [...rankedLatest];
    const existing = new Set(recommendations.map((p) => p.id));

    const historyRanked = [...catalog]
        .filter((p) => !existing.has(p.id))
        .sort((a, b) => {
            const pointsDiff = (userPoints.get(b.id) ?? 0) - (userPoints.get(a.id) ?? 0);
            if (pointsDiff !== 0) {
                return pointsDiff;
            }
            return b.id - a.id;
        });

    for (const key of fillPriority(latestDistinct)) {
        for (const product of historyRanked) {
            if (recommendations.length >= LIMIT) {
                break;
            }
            if (existing.has(product.id) || resolveCategoryKey(product) !== key) {
                continue;
            }

            recommendations.push(product);
            existing.add(product.id);
        }

        if (recommendations.length >= LIMIT) {
            break;
        }
    }

    for (const product of historyRanked) {
        if (recommendations.length >= LIMIT) {
            break;
        }
        if (existing.has(product.id)) {
            continue;
        }

        recommendations.push(product);
        existing.add(product.id);
    }

    return recommendations.slice(0, LIMIT);
}

async function loadTopProducts(): Promise<ProductDTO[]> {
    try {
        const metricsResponse = await fetch("/api/v1/metrics/");
        if (metricsResponse.ok) {
            const metrics = await metricsResponse.json() as { topSoldProducts?: TopProductMetric[] };
            const ids = (metrics.topSoldProducts || []).map((p) => p.productId).slice(0, LIMIT);

            if (ids.length > 0) {
                const resolved = await Promise.all(
                    ids.map(async (id) => {
                        try {
                            return await productService.getProductById(id);
                        } catch {
                            return null;
                        }
                    })
                );

                return resolved.filter((p): p is ProductDTO => p !== null);
            }

            return [];
        }
    } catch {
        return [];
    }

    return [];
}

/**
 * CLIENT LOADER: Obligatorio por rúbrica (Punto 21).
 * Carga los datos ANTES de que el usuario vea la página.
 */
export async function clientLoader() {
    const [categories, topProducts] = await Promise.all([
        categoryService.getCategories(),
        loadTopProducts(),
    ]);

    return { categories, topProducts } satisfies LoaderData;
}

export default function Home() {
    const { categories, topProducts } = useLoaderData<typeof clientLoader>();
    const { user, isAdmin, setCurrentUser } = useUserStore();
    const [personalizedProducts, setPersonalizedProducts] = useState<ProductDTO[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authView, setAuthView] = useState<"login" | "register">("login");
    const [loginError, setLoginError] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const passwordMismatch = useMemo(
        () => registerForm.confirmPassword.length > 0 && registerForm.password !== registerForm.confirmPassword,
        [registerForm.password, registerForm.confirmPassword]
    );

    useEffect(() => {
        let cancelled = false;

        async function loadPersonalized() {
            if (!user || isAdmin) {
                if (!cancelled) {
                    setPersonalizedProducts([]);
                }
                return;
            }

            try {
                const [orders, catalog] = await Promise.all([
                    authService.getMyOrders(),
                    productService.getProducts(0, 1000),
                ]);

                if (!cancelled) {
                    setPersonalizedProducts(buildRecommendations(orders, catalog.content));
                }
            } catch {
                if (!cancelled) {
                    setPersonalizedProducts([]);
                }
            }
        }

        void loadPersonalized();

        return () => {
            cancelled = true;
        };
    }, [user?.id, isAdmin]);

    useEffect(() => {
        const error = searchParams.get("error");
        const authRequired = searchParams.has("auth_required");
        const auth = searchParams.get("auth");

        if (!error && !authRequired && !auth) {
            return;
        }

        if (auth === "register") {
            setAuthView("register");
        } else {
            setAuthView("login");
        }

        if (error) {
            setLoginError("Correo o contraseña incorrectos.");
        } else if (authRequired) {
            setLoginError("Tienes que iniciar sesión para acceder a esta página.");
        }

        setShowAuthModal(true);

        const cleanParams = new URLSearchParams(searchParams);
        cleanParams.delete("error");
        cleanParams.delete("auth_required");
        cleanParams.delete("auth");

        setSearchParams(cleanParams, { replace: true });
    }, [searchParams, setSearchParams]);

    const switchAuthView = (next: "login" | "register") => {
        setAuthView(next);
        setLoginError(null);
        setRegisterError(null);
    };

    const closeAuthModal = () => {
        setShowAuthModal(false);
        setLoginError(null);
        setRegisterError(null);
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setLoginError(null);

        try {
            const loginResponse = await authService.login(loginForm.username, loginForm.password);

            if (String(loginResponse?.status || "").toUpperCase() === "FAILURE") {
                throw new Error(loginResponse?.error || "Credenciales inválidas");
            }

            const me = await authService.getMe();
            setCurrentUser(me);
            closeAuthModal();
            navigate("/", { replace: true });
        } catch {
            setLoginError("Correo o contraseña incorrectos.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setRegisterError(null);

        if (passwordMismatch) {
            setRegisterError("Las contraseñas no coinciden.");
            return;
        }

        setIsSubmitting(true);
        try {
            await authService.register(registerForm);
            switchAuthView("login");
            setLoginError("Registro completado. Ahora inicia sesión.");
            setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" });
        } catch (error) {
            setRegisterError(error instanceof Error ? error.message : "No se pudo completar el registro.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <header className="hero-section d-flex align-items-center justify-content-center text-center">
                <div className="container text-white">
                    <h1 className="display-3 mb-2">La auténtica pizza italiana</h1>
                    <p className="lead mb-4">Ingredientes frescos, horno de leña y mucho amor.</p>
                    <Link to="/menu" className="btn btn-primary btn-cta">Pedir Ahora</Link>
                </div>
            </header>

            <section className="section-padding container">
                <h2 className="section-title text-center">!! Los 5 Más Vendidos !!</h2>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-4 justify-content-center">
                    {topProducts.map((product) => (
                        <div className="col" key={product.id}>
                            <div className="card product-card h-100">
                                <Link to={`/product/${product.id}`}>
                                    <img
                                        src={product.hasImage ? `/api/v1/products/${product.id}/image` : logoImage}
                                        className="card-img-top"
                                        alt={product.title}
                                    />
                                </Link>
                                <div className="card-body">
                                    <h3 className="card-title h5">{product.title}</h3>
                                    <p className="card-text text-muted small">{product.shortDescription}</p>
                                    <span className="price">{product.price}€</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {personalizedProducts.length > 0 && (
                <>
                    <div className="container">
                        <hr className="text-muted opacity-25 my-3" style={{ borderWidth: "2px" }} />
                    </div>

                    <section className="section-padding container pt-5">
                        <div className="text-center mb-5">
                            <h2 className="section-title" style={{ marginBottom: 0 }}>Recomendadas según tus gustos</h2>
                        </div>

                        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-4 justify-content-center">
                            {personalizedProducts.map((product) => (
                                <div className="col" key={product.id}>
                                    <div className="card product-card h-100">
                                        <Link to={`/product/${product.id}`}>
                                            <img
                                                src={product.hasImage ? `/api/v1/products/${product.id}/image` : logoImage}
                                                className="card-img-top"
                                                alt={product.title}
                                            />
                                        </Link>
                                        <div className="card-body">
                                            <h3 className="card-title h5">{product.title}</h3>
                                            <p className="card-text text-muted small">{product.shortDescription}</p>
                                            <span className="price">{product.price}€</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}

            <section className="section-padding bg-light">
                <div className="container">
                    <h2 className="section-title text-center">Nuestras Categorías</h2>
                    <div className="row g-4">
                        {categories.map((cat) => (
                            <div className="col-md-6 col-lg-3" key={cat.id}>
                                <Link
                                    to={`/category/${cat.id}`}
                                    className="cat-card d-flex align-items-center justify-content-center"
                                    style={{ backgroundImage: `url(${cat.hasImage ? `/api/v1/categories/${cat.id}/image` : logoImage})` }}
                                >
                                    <h3>{cat.title}</h3>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="full-menu-cta text-center text-white">
                <div className="container">
                    <h2 className="mb-3">¿No sabes qué elegir?</h2>
                    <p className="lead mb-4">Descubre todos nuestros sabores en la carta completa.</p>
                    <Link to="/menu" className="btn btn-outline-light btn-cta-secondary">Ver Carta Completa</Link>
                </div>
            </section>

            <Modal show={showAuthModal} onHide={closeAuthModal} centered size="lg">
                <Modal.Body className="p-0">
                    <div className="row g-0">
                        <div className="col-md-5 d-none d-md-block">
                            <img
                                src={authImage}
                                alt="Login"
                                className="img-fluid w-100 h-100"
                                style={{ objectFit: "cover", minHeight: "450px" }}
                            />
                        </div>

                        <div className="col-12 col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center">
                            {authView === "login" && (
                                <div className="fade-in-left">
                                    <h2 className="fw-bold mb-4">¡Hola de nuevo!</h2>

                                    {loginError && <Alert variant="warning" className="small py-2">{loginError}</Alert>}

                                    <form onSubmit={handleLogin}>
                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Correo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                required
                                                value={loginForm.username}
                                                onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label small text-muted">Contraseña</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                required
                                                value={loginForm.password}
                                                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                                            />
                                        </div>

                                        <div className="d-grid mb-3">
                                            <button type="submit" className="btn btn-primary py-2" disabled={isSubmitting}>
                                                {isSubmitting ? "Entrando..." : "Entrar"}
                                            </button>
                                        </div>

                                        <div className="text-center">
                                            <p className="small text-muted mb-0">¿No tienes cuenta?</p>
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 fw-bold text-decoration-none"
                                                onClick={() => switchAuthView("register")}
                                            >
                                                Regístrate aquí
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {authView === "register" && (
                                <div className="fade-in-right">
                                    <h2 className="fw-bold mb-4">Crear Cuenta</h2>

                                    {registerError && <Alert variant="danger" className="small py-2">{registerError}</Alert>}

                                    <form onSubmit={handleRegister}>
                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Nombre Completo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ej: Juan Pérez"
                                                required
                                                value={registerForm.name}
                                                onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="juan@ejemplo.com"
                                                required
                                                value={registerForm.email}
                                                onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Contraseña</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                required
                                                minLength={4}
                                                value={registerForm.password}
                                                onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label small text-muted">Repetir Contraseña</label>
                                            <input
                                                type="password"
                                                className={`form-control ${passwordMismatch ? "is-invalid" : ""}`}
                                                required
                                                minLength={4}
                                                value={registerForm.confirmPassword}
                                                onChange={(e) => setRegisterForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                            />
                                            <div className="invalid-feedback">Las contraseñas no coinciden.</div>
                                        </div>

                                        <div className="d-grid mb-3">
                                            <button type="submit" className="btn btn-primary py-2" disabled={isSubmitting || passwordMismatch}>
                                                {isSubmitting ? "Registrando..." : "Registrarse"}
                                            </button>
                                        </div>

                                        <div className="text-center">
                                            <p className="small text-muted mb-0">¿Ya tienes cuenta?</p>
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 fw-bold text-decoration-none"
                                                onClick={() => switchAuthView("login")}
                                            >
                                                Inicia sesión
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}