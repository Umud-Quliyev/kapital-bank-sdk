export interface SetDestinationTokenRequest {
  pan: string;
}

export interface DestinationTokenCard {
  expiration?: string;
  brand?: string;
}

export interface DestinationToken {
  id: number;
  paymentMethod: string;
  role: string;
  status: string;
  regTime: string;
  displayName: string;
  card?: DestinationTokenCard;
}

export interface SetDestinationTokenResponse {
  status: string;

  cvv2AuthStatus?: string;

  tdsV1AuthStatus?: string;

  tdsV2AuthStatus?: string;

  otpAutStatus?: string;

  dstToken?: DestinationToken;

  srcToken?: DestinationToken;
}