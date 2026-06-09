import { KapitalBankClient } from "../client/KapitalBankClient";

export interface HealthCheckResult {
  healthy: boolean;
  timestamp: string;
  environment: string;
  latency?: number;
  error?: string;
}

export class HealthService {
  constructor(private readonly client: KapitalBankClient) {}

  async check(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const config = this.client.getConfig();

    try {
      await this.client.request("GET", "/", undefined);

      const latency = Date.now() - startTime;

      return {
        healthy: true,
        timestamp: new Date().toISOString(),
        environment: config.environment,
        latency,
      };
    } catch (error) {
      return {
        healthy: false,
        timestamp: new Date().toISOString(),
        environment: config.environment,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async checkWithTimeout(timeoutMs: number = 5000): Promise<HealthCheckResult> {
    const timeoutPromise = new Promise<HealthCheckResult>((resolve) =>
      setTimeout(() => {
        const config = this.client.getConfig();
        resolve({
          healthy: false,
          timestamp: new Date().toISOString(),
          environment: config.environment,
          error: `Health check timed out after ${timeoutMs}ms`,
        });
      }, timeoutMs)
    );

    return Promise.race([this.check(), timeoutPromise]);
  }
}
