export type ReversalPhase =
  | "Single"
  | "Auth"
  | "Clearing";

export type VoidKind =
  | "Full"
  | "Partial";

export interface ReversalRequest {
  phase: ReversalPhase;
  voidKind: VoidKind;
  amount?: string;
}

export interface ReversalResponse {
  orderId?: number;
  status?: string;
  approvalCode?: string;
}