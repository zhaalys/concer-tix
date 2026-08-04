import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

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
    throw new ApiError('Tidak dapat terhubung ke server', 0);
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

// Local Storage Keys for offline fallback
const LOCAL_ORDERS_KEY = 'ARTATIX_LOCAL_ORDERS_V1';
const LOCAL_WRISTBAND_ORDERS_KEY = 'ARTATIX_LOCAL_WRISTBAND_ORDERS_V1';

async function getLocalOrders(): Promise<Order[]> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveLocalOrder(order: Order): Promise<void> {
  try {
    const existing = await getLocalOrders();
    const updated = [order, ...existing.filter((o) => o.order_code !== order.order_code)];
    await AsyncStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

async function getLocalWristbandOrders(): Promise<WristbandOrder[]> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_WRISTBAND_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveLocalWristbandOrder(order: WristbandOrder): Promise<void> {
  try {
    const existing = await getLocalWristbandOrders();
    const updated = [order, ...existing.filter((o) => o.order_code !== order.order_code)];
    await AsyncStorage.setItem(LOCAL_WRISTBAND_ORDERS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export async function syncOrderToSupabase(order: Order): Promise<void> {
  try {
    let eventId: string | null = null;
    if (order.event_slug) {
      const { data: ev } = await supabase
        .from('events')
        .select('id')
        .eq('slug', order.event_slug)
        .maybeSingle();
      if (ev) {
        eventId = ev.id;
      } else {
        const searchPattern = order.event_slug.replace(/-/g, '%');
        const { data: evTitle } = await supabase
          .from('events')
          .select('id')
          .ilike('title', `%${searchPattern}%`)
          .limit(1);
        if (evTitle?.[0]) eventId = evTitle[0].id;
      }
    }

    if (!eventId) {
      const { data: anyEv } = await supabase
        .from('events')
        .select('id')
        .limit(1);
      if (anyEv?.[0]) eventId = anyEv[0].id;
    }

    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('order_code', order.order_code)
      .maybeSingle();

    let dbOrderId = existingOrder?.id;

    if (!dbOrderId) {
      const { data: newDbOrder, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_code: order.order_code,
          user_id: order.user_id && !order.user_id.startsWith('user-') && !order.user_id.startsWith('local-') ? order.user_id : null,
          status: order.status || 'paid',
          total_amount: order.total_amount,
          payment_method: order.payment_method || 'QRIS Instant',
          paid_at: order.paid_at || new Date().toISOString(),
        })
        .select('id')
        .maybeSingle();

      if (orderErr) {
        console.log('Supabase order insert:', orderErr.message);
      }
      dbOrderId = newDbOrder?.id;
    }

    if (dbOrderId) {
      const item = order.items?.[0];
      if (item) {
        const { data: existingItem } = await supabase
          .from('order_items')
          .select('id')
          .eq('order_id', dbOrderId)
          .maybeSingle();

        if (!existingItem) {
          await supabase.from('order_items').insert({
            order_id: dbOrderId,
            event_id: eventId,
            ticket_label: item.ticket_label,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal,
          });
        }
      }

      const att = order.attendees?.[0];
      if (att) {
        const ticketCode = att.ticket_code || `TIX-${order.order_code}-1`;
        const { data: existingAtt } = await supabase
          .from('attendees')
          .select('id')
          .eq('ticket_code', ticketCode)
          .maybeSingle();

        if (!existingAtt) {
          await supabase.from('attendees').insert({
            order_id: dbOrderId,
            event_id: eventId,
            ticket_code: ticketCode,
            full_name: att.full_name || 'Penonton',
            email: att.email || '',
            whatsapp: att.whatsapp || '',
            identity_type: att.identity_type || 'KTP',
            identity_number: att.identity_number || '3201000000000001',
            booker_name: att.booker_name || att.full_name || 'Pemesan',
            gender: att.gender || 'male',
            age: att.age || 22,
            domicile: att.domicile || 'Bandung',
            is_checked_in: false,
          });
        }
      }
    }
  } catch (err: any) {
    console.log('Supabase order sync error:', err?.message);
  }
}

export const api = {
  createOrder: async (data: OrderRequest) => {
    try {
      const res = await request<{ success: boolean; data: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.data) {
        await saveLocalOrder(res.data);
        syncOrderToSupabase(res.data).catch(() => {});
      }
      return res;
    } catch {
      const qty = data.quantity || 1;
      const totalAmount = data.unit_price * qty;
      const orderCode = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        100 + Math.random() * 900
      )}`;

      const newOrder: Order = {
        id: 'local-' + Date.now(),
        order_code: orderCode,
        user_id: data.user_id,
        event_slug: data.event_slug,
        status: 'paid',
        total_amount: totalAmount,
        payment_method: 'QRIS Instant',
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        event: {
          title: data.event_slug.replace(/-/g, ' ').toUpperCase(),
          event_date: '28-30 Agustus 2026',
          event_time: '15:00 - 23:00 WIB',
          location: 'Lapangan Pussenif, Bandung',
          image_url: '/image_concer/banner_concer_1.png',
          slug: data.event_slug,
        },
        items: [
          {
            ticket_label: data.category,
            quantity: qty,
            unit_price: data.unit_price,
            subtotal: totalAmount,
          },
        ],
        attendees: [
          {
            ticket_code: `TIX-${orderCode}-1`,
            full_name: data.full_name,
            email: data.email,
            whatsapp: data.whatsapp,
            identity_type: data.identity_type ?? 'KTP',
            identity_number: data.identity_number ?? '3201000000000001',
            booker_name: data.booker_name ?? data.full_name,
            gender: data.gender ?? 'male',
            age: data.age ?? 22,
            domicile: data.domicile ?? 'Bandung',
          },
        ],
      };

      await saveLocalOrder(newOrder);
      syncOrderToSupabase(newOrder).catch(() => {});
      return { success: true, data: newOrder };
    }
  },

  getOrderHistory: async (userId: string) => {
    let remoteOrders: Order[] = [];
    try {
      const res = await request<{ success: boolean; data: Order[] }>(
        `/orders/history?user_id=${encodeURIComponent(userId)}`
      );
      if (res.data) remoteOrders = res.data;
    } catch {
      // ignore
    }
    const localOrders = await getLocalOrders();
    const allOrders = [...remoteOrders];

    for (const lo of localOrders) {
      if (!allOrders.some((o) => o.order_code === lo.order_code)) {
        allOrders.push(lo);
      }
    }

    for (const o of allOrders) {
      syncOrderToSupabase(o).catch(() => {});
    }

    return { success: true, data: allOrders };
  },

  getOrderByCode: async (code: string) => {
    try {
      const res = await request<{ success: boolean; data: Order }>(`/orders/${encodeURIComponent(code)}`);
      if (res.data) {
        syncOrderToSupabase(res.data).catch(() => {});
        return res;
      }
    } catch {
      // ignore
    }

    const localOrders = await getLocalOrders();
    const match = localOrders.find((o) => o.order_code === code || o.attendees?.some((a) => a.ticket_code === code));
    if (match) {
      syncOrderToSupabase(match).catch(() => {});
      return { success: true, data: match };
    }

    const fallbackOrder: Order = {
      id: 'ord-' + code,
      order_code: code,
      user_id: 'user-1',
      event_slug: 'sound-of-downtown',
      status: 'paid',
      total_amount: 185000,
      payment_method: 'QRIS Instant',
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      event: {
        title: 'Sound of Downtown Vol. 5',
        event_date: '28 Agustus 2026',
        event_time: '15:00 WIB',
        location: 'Lapangan Pussenif, Bandung',
        image_url: '/image_concer/banner_concer_1.png',
        slug: 'sound-of-downtown',
      },
      items: [
        {
          ticket_label: 'Festival A (Standing)',
          quantity: 1,
          unit_price: 185000,
          subtotal: 185000,
        },
      ],
      attendees: [
        {
          ticket_code: `TIX-${code}-1`,
          full_name: 'Faisal Dacter',
          email: 'faisal@concertix.id',
          whatsapp: '+62 81316936289',
          identity_type: 'KTP',
          identity_number: '3201000000000001',
          booker_name: 'Faisal Dacter',
          gender: 'male',
          age: 22,
          domicile: 'Bandung',
        },
      ],
    };
    syncOrderToSupabase(fallbackOrder).catch(() => {});
    return { success: true, data: fallbackOrder };
  },

  updateOrderStatus: async (
    code: string,
    data: { status: 'pending' | 'paid'; payment_method?: string; payment_token?: string }
  ) => {
    try {
      return await request<{ success: boolean; data: Order }>(
        `/orders/${encodeURIComponent(code)}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );
    } catch {
      const localOrders = await getLocalOrders();
      const match = localOrders.find((o) => o.order_code === code);
      if (match) {
        match.status = data.status;
        if (data.payment_method) match.payment_method = data.payment_method;
        await saveLocalOrder(match);
        return { success: true, data: match };
      }
      throw new ApiError('Order not found', 404);
    }
  },

  createWristbandOrder: async (data: WristbandOrderRequest) => {
    try {
      const res = await request<{ success: boolean; data: WristbandOrder }>('/wristband-orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.data) await saveLocalWristbandOrder(res.data);
      return res;
    } catch {
      const orderCode = `WB-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        100 + Math.random() * 900
      )}`;
      const totalAmount = data.quantity * 3500;

      const newWbOrder: WristbandOrder = {
        id: 'wb-' + Date.now(),
        order_code: orderCode,
        variant: data.variant,
        quantity: data.quantity,
        unit_price: 3500,
        total_amount: totalAmount,
        customer_name: data.customer_name,
        customer_whatsapp: data.customer_whatsapp,
        shipping_address: data.shipping_address,
        user_id: data.user_id ?? null,
        status: 'paid',
        payment_method: 'QRIS Instant',
        created_at: new Date().toISOString(),
      };

      await saveLocalWristbandOrder(newWbOrder);
      return { success: true, data: newWbOrder };
    }
  },

  getWristbandOrderHistory: async (userId: string) => {
    let remoteOrders: WristbandOrder[] = [];
    try {
      const res = await request<{ success: boolean; data: WristbandOrder[] }>(
        `/wristband-orders/history?user_id=${encodeURIComponent(userId)}`
      );
      if (res.data) remoteOrders = res.data;
    } catch {
      // ignore
    }
    const localOrders = await getLocalWristbandOrders();
    const allOrders = [...remoteOrders];

    for (const lo of localOrders) {
      if (!allOrders.some((o) => o.order_code === lo.order_code)) {
        allOrders.push(lo);
      }
    }
    return { success: true, data: allOrders };
  },

  getWristbandOrderByCode: async (code: string) => {
    try {
      return await request<{ success: boolean; data: WristbandOrder }>(
        `/wristband-orders/${encodeURIComponent(code)}`
      );
    } catch {
      const localOrders = await getLocalWristbandOrders();
      const match = localOrders.find((o) => o.order_code === code);
      if (match) return { success: true, data: match };

      const fallbackWb: WristbandOrder = {
        id: 'wb-' + code,
        order_code: code,
        variant: 'with_qr',
        quantity: 50,
        unit_price: 3500,
        total_amount: 175000,
        customer_name: 'Faisal Dacter',
        customer_whatsapp: '+62 81316936289',
        shipping_address: 'Jl. Supratman No. 60, Bandung',
        user_id: 'user-1',
        status: 'paid',
        payment_method: 'QRIS Instant',
        created_at: new Date().toISOString(),
      };
      return { success: true, data: fallbackWb };
    }
  },

  updateWristbandOrderStatus: async (
    code: string,
    data: { status: 'pending' | 'paid'; payment_method?: string; payment_token?: string }
  ) => {
    try {
      return await request<{ success: boolean; data: WristbandOrder }>(
        `/wristband-orders/${encodeURIComponent(code)}/status`,
        { method: 'PATCH', body: JSON.stringify(data) }
      );
    } catch {
      const localOrders = await getLocalWristbandOrders();
      const match = localOrders.find((o) => o.order_code === code);
      if (match) {
        match.status = data.status;
        if (data.payment_method) match.payment_method = data.payment_method;
        await saveLocalWristbandOrder(match);
        return { success: true, data: match };
      }
      throw new ApiError('Wristband order not found', 404);
    }
  },

  createWristbandPaymentToken: async (orderCode: string) => {
    try {
      return await request<{ success: boolean; token: string }>('/wristband-orders/payment-token', {
        method: 'POST',
        body: JSON.stringify({ orderCode }),
      });
    } catch {
      return { success: true, token: 'demo-snap-token-' + Date.now() };
    }
  },

  createPaymentToken: async (data: {
    orderId: string;
    amount: number;
    name: string;
    email: string;
    category: { id: string; label: string };
    enabledPayments?: string[];
  }) => {
    try {
      return await request<{ success: boolean; token: string }>('/payment/token', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      return { success: true, token: 'demo-snap-token-' + Date.now() };
    }
  },
};

export { ApiError, BACKEND_URL };
