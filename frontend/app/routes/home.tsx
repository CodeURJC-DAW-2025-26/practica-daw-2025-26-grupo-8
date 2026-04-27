import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { categoryService } from "../services/category-service";
import { productService } from "../services/product-service";
import { authService } from "../services/auth-sevice";
import type { ProductDTO } from "../dtos/ProductDTO";
import type { OrderDTO } from "../dtos/OrderDTO";
import { useUserStore } from "../stores/user-store";
import logoImage from "../assets/images/logo.png";

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

// Normalizes text so comparisons ignore accents and case.
function normalize(value: string): string {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

// Maps product categories into broad groups used for recommendation priority.
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

// Returns unique products from the latest order, preserving order appearance.
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

// Counts how many times each product appears across the provided orders.
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

// Defines category priority based on what appears in the latest order.
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

// Builds up to LIMIT recommendations using latest order first, then history.
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

// Loads the current top-selling products from metrics and resolves full product data.
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
 * Client loader: preloads categories and top products before rendering.
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
    const { user, isAdmin } = useUserStore();
    const [personalizedProducts, setPersonalizedProducts] = useState<ProductDTO[]>([]);

    useEffect(() => {
        let cancelled = false;

        // Loads personalized recommendations for logged-in non-admin users.
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

    return (
        <>
            {/* Hero section. */}
            <header className="hero-section d-flex align-items-center justify-content-center text-center">
                <div className="container text-white">
                    <h1 className="display-3 mb-2">La auténtica pizza italiana</h1>
                    <p className="lead mb-4">Ingredientes frescos, horno de leña y mucho amor.</p>
                    <Link to="/menu" className="btn btn-primary btn-cta">Pedir Ahora</Link>
                </div>
            </header>

            {/* Top sold products section. */}
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

                    {/* Personalized recommendations section. */}
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

            {/* Category cards section. */}
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

            {/* Final call-to-action to open the full menu. */}
            <section className="full-menu-cta text-center text-white">
                <div className="container">
                    <h2 className="mb-3">¿No sabes qué elegir?</h2>
                    <p className="lead mb-4">Descubre todos nuestros sabores en la carta completa.</p>
                    <Link to="/menu" className="btn btn-outline-light btn-cta-secondary">Ver Carta Completa</Link>
                </div>
            </section>
        </>
    );
}