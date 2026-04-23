export type TopProductMetric = {
    productId: number;
    name: string;
    count: number;
};

export type DashboardMetrics = {
    totalOrders: number;
    totalProductsSold: number;
    differentProductsSold: number;
    topSoldProducts: TopProductMetric[];
};

export const metricsService = {
    async getDashboardMetrics(): Promise<DashboardMetrics> {
        const response = await fetch('/api/v1/metrics/');
        if (!response.ok) {
            throw new Error(`Failed to fetch metrics: ${response.statusText}`);
        }
        return response.json();
    },

    async getTopSoldProducts(): Promise<TopProductMetric[]> {
        const response = await fetch('/api/v1/metrics/top-products');
        if (!response.ok) {
            throw new Error(`Failed to fetch top products: ${response.statusText}`);
        }
        return response.json();
    }
};
