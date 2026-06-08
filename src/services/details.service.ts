import axios, { AxiosInstance } from 'axios';
import { GetDetailsRequest, DetailsResponse } from '../types/details';
import { KapitalBankError } from '../errors/KapitalBankError';

export class DetailsService {
  constructor(private client: AxiosInstance) {}

  async get(data: GetDetailsRequest): Promise<DetailsResponse> {
    try {
      const response = await this.client.post<DetailsResponse>('/orders/details', data);
      return response.data;
    } catch (error: any) {
      throw new KapitalBankError(
        error.response?.data?.message || 'Failed to get details',
        error.response?.data?.code,
        error.response?.status
      );
    }
  }
}
