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

  constructor(config: KapitalBankClientConfig) {
    this.config = {
      environment: "test",
      timeout: 30000,
      logEnabled: false,
      ...config,
    };

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

  async request<T>(
    method: Method,
    path: string,
    body?: unknown,
    options: KapitalBankRequestOptions = {}
  ): Promise<T> {
    try {
      const response =
        await this.axiosInstance.request<T>({
          method,
          url: path,
          data: body,
          params: options.params,
          headers: options.headers,
        });

      return response.data;
    } catch (error) {
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
  }
}
