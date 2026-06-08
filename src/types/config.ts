export type Environment = "test" | "production";

export interface KapitalBankConfig {
  username: string;
  password: string;
  environment?: Environment;
  timeout?: number;
}