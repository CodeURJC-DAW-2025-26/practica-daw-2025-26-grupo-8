import { UNSAFE_withComponentProps, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
//#region app/services/metrics-service.ts
var metricsService = {
	async getDashboardMetrics() {
		const response = await fetch("/api/v1/metrics/");
		if (!response.ok) throw new Error(`Failed to fetch metrics: ${response.statusText}`);
		return response.json();
	},
	async getTopSoldProducts() {
		const response = await fetch("/api/v1/metrics/top-products");
		if (!response.ok) throw new Error(`Failed to fetch top products: ${response.statusText}`);
		return response.json();
	}
};
//#endregion
//#region app/routes/admin/metrics.tsx
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
async function clientLoader() {
	try {
		return { metrics: await metricsService.getDashboardMetrics() };
	} catch (error) {
		console.error("Failed to load dashboard metrics", error);
		return { metrics: null };
	}
}
var BAR_COLORS = [
	"rgba(220, 53, 69, 0.90)",
	"rgba(255, 99, 132, 0.85)",
	"rgba(255, 159, 64, 0.85)",
	"rgba(255, 193, 7, 0.85)",
	"rgba(13, 110, 253, 0.85)"
];
var metrics_default = UNSAFE_withComponentProps(function AdminMetrics() {
	const [metrics, setMetrics] = useState(useLoaderData().metrics);
	useEffect(() => {
		let interval;
		async function fetchTopProducts() {
			try {
				const topProducts = await metricsService.getTopSoldProducts();
				setMetrics((prev) => prev ? {
					...prev,
					topSoldProducts: topProducts
				} : null);
			} catch (err) {
				console.error(err);
			}
		}
		interval = setInterval(fetchTopProducts, 5e3);
		return () => clearInterval(interval);
	}, []);
	if (!metrics) return /* @__PURE__ */ jsx("div", {
		className: "alert alert-danger",
		children: "Error cargando las métricas del dashboard."
	});
	const chartData = {
		labels: metrics.topSoldProducts.map((p) => p.name),
		datasets: [{
			label: "Unidades vendidas",
			data: metrics.topSoldProducts.map((p) => p.count),
			backgroundColor: BAR_COLORS,
			borderRadius: 10,
			borderSkipped: false,
			maxBarThickness: 52
		}]
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("div", {
			className: "d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom",
			children: /* @__PURE__ */ jsx("h1", {
				className: "h2 title-font text-dark",
				children: "Métricas de Ventas"
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "row g-4 mb-4",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "col-md-4",
					children: /* @__PURE__ */ jsx("div", {
						className: "card text-white bg-primary h-100 shadow-sm",
						children: /* @__PURE__ */ jsxs("div", {
							className: "card-body",
							children: [/* @__PURE__ */ jsx("h5", {
								className: "card-title",
								children: "Pedidos Totales"
							}), /* @__PURE__ */ jsx("p", {
								className: "display-6 fw-bold",
								children: metrics.totalOrders
							})]
						})
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "col-md-4",
					children: /* @__PURE__ */ jsx("div", {
						className: "card text-white bg-success h-100 shadow-sm",
						children: /* @__PURE__ */ jsxs("div", {
							className: "card-body",
							children: [/* @__PURE__ */ jsx("h5", {
								className: "card-title",
								children: "Productos Vendidos"
							}), /* @__PURE__ */ jsxs("p", {
								className: "display-6 fw-bold",
								children: [metrics.totalProductsSold, " uds"]
							})]
						})
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "col-md-4",
					children: /* @__PURE__ */ jsx("div", {
						className: "card text-dark bg-warning h-100 shadow-sm",
						children: /* @__PURE__ */ jsxs("div", {
							className: "card-body",
							children: [/* @__PURE__ */ jsx("h5", {
								className: "card-title",
								children: "Productos Diferentes"
							}), /* @__PURE__ */ jsx("p", {
								className: "display-6 fw-bold",
								children: metrics.differentProductsSold
							})]
						})
					})
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "card shadow-sm",
			children: [/* @__PURE__ */ jsx("div", {
				className: "card-header bg-white",
				children: /* @__PURE__ */ jsxs("h5", {
					className: "mb-0",
					children: [/* @__PURE__ */ jsx("i", { className: "bi bi-bar-chart-fill text-danger" }), " Productos Más Vendidos"]
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "card-body",
				children: metrics.topSoldProducts.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "alert alert-light border m-0",
					role: "alert",
					children: "Todavía no hay ventas registradas para mostrar en la gráfica."
				}) : /* @__PURE__ */ jsx("div", {
					className: "position-relative",
					style: { height: "420px" },
					children: /* @__PURE__ */ jsx(Bar, {
						data: chartData,
						options: {
							responsive: true,
							maintainAspectRatio: false,
							plugins: {
								legend: { display: false },
								tooltip: { callbacks: { label: (context) => `${context.parsed.y} ventas` } }
							},
							scales: {
								y: {
									beginAtZero: true,
									ticks: { precision: 0 },
									grid: { color: "rgba(0, 0, 0, 0.06)" }
								},
								x: { grid: { display: false } }
							}
						}
					})
				})
			})]
		})
	] });
});
//#endregion
export { clientLoader, metrics_default as default };
