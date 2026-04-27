import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { metricsService, type DashboardMetrics } from "../../services/metrics-service";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Loads the dashboard metrics before the page renders.
export async function clientLoader() {
    try {
        const metrics = await metricsService.getDashboardMetrics();
        return { metrics };
    } catch (error) {
        console.error("Failed to load dashboard metrics", error);
        return { metrics: null };
    }
}

const BAR_COLORS = [
    'rgba(220, 53, 69, 0.90)',
    'rgba(255, 99, 132, 0.85)',
    'rgba(255, 159, 64, 0.85)',
    'rgba(255, 193, 7, 0.85)',
    'rgba(13, 110, 253, 0.85)'
];

export default function AdminMetrics() {
    const loaderData = useLoaderData<typeof clientLoader>();
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(loaderData.metrics);

    // Refreshes the top products every few seconds so the chart stays current.
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        async function fetchTopProducts() {
            try {
                const topProducts = await metricsService.getTopSoldProducts();
                setMetrics(prev => prev ? { ...prev, topSoldProducts: topProducts } : null);
            } catch (err) {
                console.error(err);
            }
        }

        interval = setInterval(fetchTopProducts, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!metrics) {
        return <div className="alert alert-danger">Error cargando las métricas del dashboard.</div>;
    }

    // Prepares the chart data from the metrics response.
    const chartData = {
        labels: metrics.topSoldProducts.map(p => p.name),
        datasets: [{
            label: 'Unidades vendidas',
            data: metrics.topSoldProducts.map(p => p.count),
            backgroundColor: BAR_COLORS,
            borderRadius: 10,
            borderSkipped: false as const,
            maxBarThickness: 52
        }]
    };

    // Configures the chart appearance and tooltip behavior.
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.parsed.y} ventas`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.06)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <>
            {/* Page title. */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2 title-font text-dark">Métricas de Ventas</h1>
            </div>

            {/* Summary cards with the main dashboard numbers. */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card text-white bg-primary h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Pedidos Totales</h5>
                            <p className="display-6 fw-bold">{metrics.totalOrders}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Productos Vendidos</h5>
                            <p className="display-6 fw-bold">{metrics.totalProductsSold} uds</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-dark bg-warning h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Productos Diferentes</h5>
                            <p className="display-6 fw-bold">{metrics.differentProductsSold}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales chart section. */}
            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h5 className="mb-0"><i className="bi bi-bar-chart-fill text-danger"></i> Productos Más Vendidos</h5>
                </div>
                <div className="card-body">
                    {metrics.topSoldProducts.length === 0 ? (
                        <div className="alert alert-light border m-0" role="alert">
                            Todavía no hay ventas registradas para mostrar en la gráfica.
                        </div>
                    ) : (
                        <div className="position-relative" style={{ height: '420px' }}>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
