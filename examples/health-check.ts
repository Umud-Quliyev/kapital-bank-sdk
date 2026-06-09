import { KapitalBank } from "../src";
import "dotenv/config";

const kb = KapitalBank.fromEnv();

async function basicHealthCheck() {
  const health = await kb.healthCheck();

  console.log("Health Check Result:");
  console.log("- Healthy:", health.healthy);
  console.log("- Environment:", health.environment);
  console.log("- Timestamp:", health.timestamp);
  console.log("- Latency:", health.latency, "ms");

  if (health.error) {
    console.log("- Error:", health.error);
  }
}

async function healthCheckWithTimeout() {
  const health = await kb.healthCheckWithTimeout(3000); 

  console.log("Health Check with Timeout Result:");
  console.log("- Healthy:", health.healthy);
  console.log("- Environment:", health.environment);
  console.log("- Timestamp:", health.timestamp);

  if (health.error) {
    console.log("- Error:", health.error);
  }
}

async function continuousHealthMonitoring() {
  const interval = 30000;

  setInterval(async () => {
    const health = await kb.healthCheck();

    if (!health.healthy) {
      console.error("⚠️  Health check failed:", health.error);
    } else {
      console.log("✅ Health check passed. Latency:", health.latency, "ms");
    }
  }, interval);

  console.log(`Started continuous health monitoring (interval: ${interval}ms)`);
}

basicHealthCheck().catch(console.error);
healthCheckWithTimeout().catch(console.error);
continuousHealthMonitoring().catch(console.error);
