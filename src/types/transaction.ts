export type TransactionPhase =
  | "Single"
  | "Auth"
  | "Clearing";

export interface TransactionRequest {
  phase: TransactionPhase;

  amount?: string;

  type?: "Credit" | "Refund";

  authorizationKind?: "Preliminary";

  conditions?: {
    cofUsage?: "Recurring";
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