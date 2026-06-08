import axios, { AxiosInstance } from 'axios';
import { CreateRefundRequest, RefundResponse } from '../types/refund';
import { KapitalBankError } from '../errors/KapitalBankError';

export class RefundsService {
  constructor(private client: AxiosInstance) {}

  async create(data: CreateRefundRequest): Promise<RefundResponse> {
    try {
      const response = await this.client.post<RefundResponse>('/refunds', data);
      return response.data;
    } catch (error: any) {
      throw new KapitalBankError(
        error.response?.data?.message || 'Failed to create refund',
        error.response?.data?.code,
        error.response?.status
      );
    }
  }

  async get(refundId: string): Promise<RefundResponse> {
    try {
      const response = await this.client.get<RefundResponse>(`/refunds/${refundId}`);
      return response.data;
    } catch (error: any) {
      throw new KapitalBankError(
        error.response?.data?.message || 'Failed to get refund',
        error.response?.data?.code,
        error.response?.status
      );
    }
  }
}
