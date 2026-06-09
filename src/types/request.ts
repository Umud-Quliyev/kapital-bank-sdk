import { Method } from "axios";

export interface KapitalBankRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export type KapitalBankRequestMethod = Method;
