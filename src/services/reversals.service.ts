import axios, { AxiosInstance } from 'axios';
import { CreateReversalRequest, ReversalResponse } from '../types/reversal';
import { KapitalBankError } from '../errors/KapitalBankError';

export class ReversalsService {
  constructor(private client: AxiosInstance) {}

  async create(data: CreateReversalRequest): Promise<ReversalResponse> {
    try {
      const response = await this.client.post<ReversalResponse>('/reversals', data);
      return response.data;
    } catch (error: any) {
      throw new KapitalBankError(
        error.response?.data?.message || 'Failed to create reversal',
        error.response?.data?.code,
        error.response?.status
      );
    }
  }

  async get(reversalId: string): Promise<ReversalResponse> {
    try {
      const response = await this.client.get<ReversalResponse>(`/reversals/${reversalId}`);
      return response.data;
    } catch (error: any) {
      throw new KapitalBankError(
        error.response?.data?.message || 'Failed to get reversal',
        error.response?.data?.code,
        error.response?.status
      );
    }
  }
}
