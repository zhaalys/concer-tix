import type { Order, WristbandOrder } from './types';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

const API_BASE = `${BACKEND_URL}/api/v1`;

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  } catch (e) {
    throw new ApiError('Tidak dapat terhubung ke server. Pastikan backend berjalan.', 0);
  }

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    throw new ApiError(body?.message || 'Terjadi kesalahan pada server', res.status);
  }
  return body as T;
}

export interface OrderRequest {
  user_id: string;
  event_slug: string;
  category: string;
  unit_price: number;
  quantity?: number;
  full_name: string;
  email: string;
  whatsapp: string;
  identity_type?: string | null;
  identity_number?: string | null;
  gender?: string | null;
  age?: number | null;
  domicile?: string | null;
  booker_name?: string | null;
}

export interface WristbandOrderRequest {
  variant: 'without_qr' | 'with_qr';
  quantity: number;
  customer_name: string;
  customer_whatsapp: string;
  shipping_address: string;
  user_id?: string | null;
}

export const api = {
  createOrder: (data: OrderRequest) =>
    request<{ success: boolean; data: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getOrderHistory: (userId: string) =>
    request<{ success: boolean; data: Order[] }>(
      `/orders/history?user_id=${encodeURIComponent(userId)}`
    ),

  getOrderByCode: (code: string) =>
    request<{ success: boolean; data: Order }>(`/orders/${encodeURIComponent(code)}`),

  updateOrderStatus: (
    code: string,
    data: { status: 'pending' | 'paid'; payment_method?: string; payment_token?: string }
  ) =>
    request<{ success: boolean; data: Order }>(`/orders/${encodeURIComponent(code)}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  createWristbandOrder: (data: WristbandOrderRequest) =>
    request<{ success: boolean; data: WristbandOrder }>('/wristband-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getWristbandOrderHistory: (userId: string) =>
    request<{ success: boolean; data: WristbandOrder[] }>(
      `/wristband-orders/history?user_id=${encodeURIComponent(userId)}`
    ),

  getWristbandOrderByCode: (code: string) =>
    request<{ success: boolean; data: WristbandOrder }>(
      `/wristband-orders/${encodeURIComponent(code)}`
    ),

  updateWristbandOrderStatus: (
    code: string,
    data: { status: 'pending' | 'paid'; payment_method?: string; payment_token?: string }
  ) =>
    request<{ success: boolean; data: WristbandOrder }>(
      `/wristband-orders/${encodeURIComponent(code)}/status`,
      { method: 'PATCH', body: JSON.stringify(data) }
    ),

  createWristbandPaymentToken: (orderCode: string) =>
    request<{ success: boolean; token: string }>('/wristband-orders/payment-token', {
      method: 'POST',
      body: JSON.stringify({ orderCode }),
    }),

  createPaymentToken: (data: {
    orderId: string;
    amount: number;
    name: string;
    email: string;
    category: { id: string; label: string };
    enabledPayments?: string[];
  }) =>
    request<{ success: boolean; token: string }>('/payment/token', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export { ApiError, BACKEND_URL };
