import { KapitalBank } from "../src";
import "dotenv/config";

const kb = KapitalBank.fromEnv();

async function getMetrics() {
  await kb.createOrder({
    amount: "10",
    description: "Test order for monitoring",
  });

  await kb.getOrder(123456);

  const metrics = kb.getMonitoringMetrics();

  console.log("Monitoring Metrics:");
  console.log("- Total Requests:", metrics.totalRequests);
  console.log("- Successful Requests:", metrics.successfulRequests);
  console.log("- Failed Requests:", metrics.failedRequests);
  console.log("- Average Latency:", metrics.averageLatency.toFixed(2), "ms");
  console.log("- Success Rate:", metrics.successRate.toFixed(2), "%");
}

async function clearMetrics() {
  kb.clearMonitoringMetrics();
  console.log("Monitoring metrics cleared");
}

async function monitorEndpoint() {
  await kb.createOrder({ amount: "10", description: "Test 1" });
  await kb.createOrder({ amount: "20", description: "Test 2" });
  await kb.createOrder({ amount: "30", description: "Test 3" });

  const metrics = kb.getMonitoringMetrics();
  const orderMetrics = metrics.recentMetrics.filter((m) => m.endpoint === "/order");

  console.log("Order Endpoint Metrics:");
  console.log("- Total Calls:", orderMetrics.length);
  console.log("- Success:", orderMetrics.filter((m) => m.status === "success").length);
  console.log("- Errors:", orderMetrics.filter((m) => m.status === "error").length);
}

async function monitorErrorRate() {
  const metrics = kb.getMonitoringMetrics();
  const errorRate = metrics.failedRequests > 0
    ? (metrics.failedRequests / metrics.totalRequests) * 100
    : 0;

  console.log("Current Error Rate:", errorRate.toFixed(2), "%");

  if (errorRate > 5) {
    console.warn("⚠️  High error rate detected!");
  }
}

async function monitorLatency() {
  const metrics = kb.getMonitoringMetrics();
  const latencies = metrics.recentMetrics.map((m) => m.latency).sort((a, b) => a - b);

  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;

  console.log("Latency Percentiles:");
  console.log("- P95:", p95, "ms");
  console.log("- P99:", p99, "ms");

  if (p95 > 1000) {
    console.warn("⚠️  High P95 latency detected!");
  }
}

async function recentMetrics() {
  const metrics = kb.getMonitoringMetrics();

  console.log("Recent Metrics (last 100):");
  metrics.recentMetrics.forEach((metric) => {
    console.log(
      `- ${metric.method} ${metric.endpoint}: ${metric.status} (${metric.latency}ms)`
    );
  });
}

getMetrics().catch(console.error);
clearMetrics();
monitorEndpoint().catch(console.error);
monitorErrorRate().catch(console.error);
monitorLatency().catch(console.error);
recentMetrics().catch(console.error);
