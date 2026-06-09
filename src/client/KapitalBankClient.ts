import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  Method,
} from "axios";
import { KapitalBankClientConfig } from "../types/config";
import { ENVIRONMENTS } from "../constants/environments";
import { logRequest } from "../utils/logger";
import { KapitalBankError } from "../errors/KapitalBankError";
import {
  KapitalBankRequestOptions,
} from "../types/request";
import { retryWithBackoff, RetryOptions } from "../utils/retry";
import { MonitoringService, MetricData } from "../services/monitoring.service";

export class KapitalBankClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly config: Required<
    Pick<
      KapitalBankClientConfig,
      "username" | "password" | "environment" | "timeout"
    >
  > & {
    logEnabled: boolean;
  };
  private readonly retryOptions?: RetryOptions;
  private readonly monitoringService: MonitoringService;

  constructor(config: KapitalBankClientConfig) {
    this.config = {
      environment: "test",
      timeout: 30000,
      logEnabled: false,
      ...config,
    };

    const { retry, ...clientConfig } = config;
    this.retryOptions = retry;

    if (retry) {
      if (retry.maxAttempts !== undefined) {
        if (retry.maxAttempts <= 0 || retry.maxAttempts > 10) {
          throw new Error("retry.maxAttempts must be between 1 and 10");
        }
      }
      if (retry.initialDelay !== undefined && retry.initialDelay < 0) {
        throw new Error("retry.initialDelay must be non-negative");
      }
      if (retry.maxDelay !== undefined && retry.maxDelay < 0) {
        throw new Error("retry.maxDelay must be non-negative");
      }
      if (retry.backoffMultiplier !== undefined && retry.backoffMultiplier <= 1) {
        throw new Error("retry.backoffMultiplier must be greater than 1");
      }
    }

    this.monitoringService = new MonitoringService();

    const baseURL = ENVIRONMENTS[this.config.environment];

    this.axiosInstance = axios.create({
      baseURL,
      timeout: this.config.timeout,
      auth: {
        username: this.config.username,
        password: this.config.password,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (this.config.logEnabled) {
      this.attachLoggingInterceptors();
    }
  }

  private attachLoggingInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const method = (
          config.method ?? "get"
        ).toUpperCase();
        const path = config.url ?? "/";

        logRequest(method, path);
        return config;
      }
    );
  }

  protected get http(): AxiosInstance {
    return this.axiosInstance;
  }

  public getConfig() {
    return this.config;
  }

  public getHttp() {
    return this.axiosInstance;
  }

  public getMonitoringService() {
    return this.monitoringService;
  }

  async request<T>(
    method: Method,
    path: string,
    body?: unknown,
    options: KapitalBankRequestOptions = {}
  ): Promise<T> {
    const startTime = Date.now();
    const makeRequest = async (): Promise<T> => {
      try {
        const response =
          await this.axiosInstance.request<T>({
            method,
            url: path,
            data: body,
            params: options.params,
            headers: options.headers,
          });

        const latency = Date.now() - startTime;

        this.monitoringService.recordMetric({
          timestamp: new Date().toISOString(),
          method: method.toUpperCase(),
          endpoint: path,
          status: "success",
          latency,
          statusCode: response.status,
        });

        return response.data;
      } catch (error) {
        const latency = Date.now() - startTime;

        this.monitoringService.recordMetric({
          timestamp: new Date().toISOString(),
          method: method.toUpperCase(),
          endpoint: path,
          status: "error",
          latency,
          statusCode: axios.isAxiosError(error) ? error.response?.status : undefined,
          error: error instanceof Error ? error.message : "Unknown error",
        });

        if (axios.isAxiosError(error)) {
          throw new KapitalBankError(
            error.response?.data?.message ??
              error.message,
            error.response?.status,
            error.response?.data
          );
        }

        throw error;
      }
    };

    if (this.retryOptions) {
      const result = await retryWithBackoff(makeRequest, this.retryOptions);
      return result.data;
    }

    return makeRequest();
  }
}
