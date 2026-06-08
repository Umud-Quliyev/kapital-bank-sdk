import {
  TransactionPhase,
  TransactionType,
  CofUsage,
} from "./enums";

export interface TransactionRequest {
  phase: TransactionPhase;

  amount?: string;

  type?: TransactionType;

  authorizationKind?: "Preliminary";

  conditions?: {
    cofUsage?: CofUsage;
  };
}

export interface TransactionResponse {
  approvalCode?: string;

  match?: {
    tranActionId?: string;
    ridByPmo?: string;
  };

  pmoResultCode?: string;
}