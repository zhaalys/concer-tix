import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const MIDTRANS_CLIENT_KEY = process.env.EXPO_PUBLIC_MIDTRANS_CLIENT_KEY ?? '';
export const SNAP_SANDBOX_URL = 'https://app.sandbox.midtrans.com/snap/v2/vtweb';

export function getSnapUrl(token: string): string {
  return `${SNAP_SANDBOX_URL}/${encodeURIComponent(token)}`;
}

export async function openSnap(token: string): Promise<boolean> {
  if (!token || token.startsWith('demo-snap-token-')) {
    // Simulated demo payment success
    return true;
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (win.snap && typeof win.snap.pay === 'function') {
      return new Promise<boolean>((resolve) => {
        win.snap.pay(token, {
          onSuccess: () => resolve(true),
          onPending: () => resolve(true),
          onError: () => resolve(false),
          onClose: () => resolve(true),
        });
      });
    }
  }

  try {
    const res = await WebBrowser.openBrowserAsync(getSnapUrl(token));
    return res.type === 'dismiss' || res.type === 'opened';
  } catch {
    return true;
  }
}

export { MIDTRANS_CLIENT_KEY };
