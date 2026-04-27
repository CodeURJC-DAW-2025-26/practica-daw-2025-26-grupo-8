// Shape of a single top-selling product metric returned by the API.
export type TopProductMetric = {
    productId: number;
    name: string;
    count: number;
};

// Full dashboard metrics payload used by the admin metrics page.
export type DashboardMetrics = {
    totalOrders: number;
    totalProductsSold: number;
    differentProductsSold: number;
    topSoldProducts: TopProductMetric[];
};

// Service wrapper for metrics-related API endpoints.
export const metricsService = {
    // Fetches all dashboard metrics in one request.
    async getDashboardMetrics(): Promise<DashboardMetrics> {
        const response = await fetch('/api/v1/metrics/');
        if (!response.ok) {
            throw new Error(`Failed to fetch metrics: ${response.statusText}`);
        }
        return response.json();
    },

    // Fetches only the top-selling products list.
    async getTopSoldProducts(): Promise<TopProductMetric[]> {
        const response = await fetch('/api/v1/metrics/top-products');
        if (!response.ok) {
            throw new Error(`Failed to fetch top products: ${response.statusText}`);
        }
        return response.json();
    }
};
