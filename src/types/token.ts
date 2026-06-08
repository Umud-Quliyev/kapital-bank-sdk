export type InitiationEnvKind =
  | "Browser"
  | "Server";

export interface SetSourceTokenRequest {
  initiationEnvKind: InitiationEnvKind;
  storedId: number;
}

export interface SourceTokenCard {
  expiration: string;
  brand: string;
}

export interface SourceToken {
  id: number;
  paymentMethod: string;
  role: string;
  status: string;
  regTime: string;
  displayName: string;
  card: SourceTokenCard;
}

export interface SetSourceTokenResponse {
  status: string;
  cvv2AuthStatus?: string;
  tdsV1AuthStatus?: string;
  tdsV2AuthStatus?: string;
  otpAutStatus?: string;
  srcToken?: SourceToken;
}