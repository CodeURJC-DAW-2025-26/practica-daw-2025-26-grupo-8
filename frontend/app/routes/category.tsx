// frontend/app/routes/category.tsx
import { useState } from "react";
import { Link, useLoaderData, useParams } from "react-router";
import { Row, Col, Card, Button } from "react-bootstrap";
import { categoryService } from "../services/category-service";
import { productService } from "../services/product-service";
import type { ProductDTO } from "../dtos/ProductDTO";

/**
 * CLIENT LOADER: Recibe 'params' para saber qué categoría cargar.
 * Cargamos la categoría y la primera página de sus productos.
 */
export async function clientLoader({ params }: { params: { id: string } }) {
    const categoryId = Number(params.id);

    const category = await categoryService.getCategoryById(categoryId);
    const productsData = await productService.getProducts(0, 4, categoryId);

    return { category, initialProducts: productsData.content, initialLast: productsData.last, categoryId };
}

export default function CategoryPage() {
    const { category, initialProducts, initialLast } = useLoaderData<typeof clientLoader>();
    const { id } = useParams(); // Obtenemos el ID de la URL

    // ESTADOS PARA PAGINACIÓN (Igual que en el ejemplo de los profesores)
    const [products, setProducts] = useState<ProductDTO[]>(initialProducts);
    const [page, setPage] = useState(0);
    const [isLast, setIsLast] = useState(initialLast);
    const [isLoading, setIsLoading] = useState(false);

    const loadMore = async () => {
        setIsLoading(true);
        try {
            const nextPage = page + 1;
            const data = await productService.getProducts(nextPage, 4, Number(id));
            setProducts([...products, ...data.content]);
            setPage(nextPage);
            setIsLast(data.last);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* CABECERA DE CATEGORÍA (Copiado de category.html) */}
            <header className="category-header d-flex align-items-center justify-content-center text-white text-center py-5"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${category.hasImage ? `/api/v1/categories/${category.id}/image` : '/assets/images/banner-carta.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '300px'
                }}>
                <div>
                    <h1 className="display-2 title-font">{category.title}</h1>
                    <p className="lead fs-4">{category.description}</p>
                </div>
            </header>

            <section className="container mt-5 mb-5">
                {/* GRID DE PRODUCTOS */}
                <Row xs={1} md={2} lg={4} className="g-4">
                    {products.map((p) => (
                        <Col key={p.id}>
                            <Card className="h-100 border-0 shadow-sm product-card">
                                <Link to={`/product/${p.id}`}>
                                    <Card.Img
                                        variant="top"
                                        src={p.hasImage ? `/api/v1/products/${p.id}/image` : "/assets/images/logo.png"}
                                        alt={p.title}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                </Link>
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="h5 title-font">{p.title}</Card.Title>
                                    <Card.Text className="text-muted small">{p.shortDescription}</Card.Text>
                                    <div className="mt-auto d-flex justify-content-between align-items-center">
                                        <span className="fw-bold text-success fs-5">{p.price}€</span>
                                        <Button variant="outline-primary" size="sm" className="rounded-pill">
                                            <i className="bi bi-plus-lg"></i> Añadir
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* BOTÓN MÁS RESULTADOS (Copiado de category.html) */}
                {!isLast && (
                    <div className="text-center mt-5">
                        <Button
                            variant="primary"
                            className="rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2"
                            onClick={loadMore}
                            disabled={isLoading}
                        >
                            <span>{isLoading ? 'Cargando...' : 'Más resultados'}</span>
                            {!isLoading && <i className="bi bi-arrow-down-circle-fill"></i>}
                        </Button>
                    </div>
                )}

                <div className="text-center mt-4">
                    <Link to="/menu" className="btn btn-link text-secondary text-decoration-none">
                        <i className="bi bi-grid-3x3-gap-fill me-1"></i> Ver la Carta Completa
                    </Link>
                </div>
            </section>
        </>
    );
}