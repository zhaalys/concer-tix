import * as WebBrowser from 'expo-web-browser';

// Client key from web (sandbox format). Kept for reference; RN opens Snap via WebBrowser.
const MIDTRANS_CLIENT_KEY = process.env.EXPO_PUBLIC_MIDTRANS_CLIENT_KEY ?? '';

export const SNAP_SANDBOX_URL = 'https://app.sandbox.midtrans.com/snap/v2/vtweb';

export function getSnapUrl(token: string): string {
  return `${SNAP_SANDBOX_URL}/${encodeURIComponent(token)}`;
}

export async function openSnap(token: string): Promise<WebBrowser.WebBrowserResult> {
  return WebBrowser.openBrowserAsync(getSnapUrl(token));
}

export { MIDTRANS_CLIENT_KEY };
