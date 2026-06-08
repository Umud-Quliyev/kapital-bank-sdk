import axios, { AxiosInstance } from "axios";
import { KapitalBankConfig } from "../types/config";
import { ENVIRONMENTS } from "../constants/environments";


export class KapitalBankClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly config: Required<KapitalBankConfig>;

  constructor(config: KapitalBankConfig) {
    this.config = {
      environment: "test",
      timeout: 30000,
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
  }

  protected get http(): AxiosInstance {
    return this.axiosInstance;
  }

  public getConfig(): Required<KapitalBankConfig> {
    return this.config;
  }

  public getHttp() {
    return this.axiosInstance;
  }
}
