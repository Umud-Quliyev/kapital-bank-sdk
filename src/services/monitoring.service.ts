export interface MetricData {
  timestamp: string;
  method: string;
  endpoint: string;
  status: "success" | "error";
  latency: number;
  statusCode?: number;
  error?: string;
}

export interface MonitoringMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  successRate: number;
  recentMetrics: MetricData[];
}

export class MonitoringService {
  private metrics: MetricData[] = [];
  private maxMetrics: number = 1000;

  recordMetric(metric: MetricData): void {
    this.metrics.push(metric);

    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getMetrics(): MonitoringMetrics {
    const totalRequests = this.metrics.length;
    const successfulRequests = this.metrics.filter(
      (m) => m.status === "success"
    ).length;
    const failedRequests = totalRequests - successfulRequests;
    const averageLatency =
      totalRequests > 0
        ? this.metrics.reduce((sum, m) => sum + m.latency, 0) / totalRequests
        : 0;
    const successRate =
      totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageLatency,
      successRate,
      recentMetrics: this.metrics.slice(-100),
    };
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  getMetricsByEndpoint(endpoint: string): MetricData[] {
    return this.metrics.filter((m) => m.endpoint === endpoint);
  }

  getMetricsByStatus(status: "success" | "error"): MetricData[] {
    return this.metrics.filter((m) => m.status === status);
  }

  getErrorRate(): number {
    const total = this.metrics.length;
    if (total === 0) return 0;
    const errors = this.metrics.filter((m) => m.status === "error").length;
    return (errors / total) * 100;
  }

  getP95Latency(): number {
    if (this.metrics.length === 0) return 0;
    const sorted = [...this.metrics].sort((a, b) => a.latency - b.latency);
    const index = Math.floor(sorted.length * 0.95);
    return sorted[index]?.latency || 0;
  }

  getP99Latency(): number {
    if (this.metrics.length === 0) return 0;
    const sorted = [...this.metrics].sort((a, b) => a.latency - b.latency);
    const index = Math.floor(sorted.length * 0.99);
    return sorted[index]?.latency || 0;
  }
}
