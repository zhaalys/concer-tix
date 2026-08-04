import 'react-native-url-polyfill/auto';

export interface AuthCodeParams {
  code: string;
  flowId?: string;
}

export function extractAuthCodeParams(url: string): AuthCodeParams | null {
  if (!url) return null;
  const queryIndex = url.indexOf('?');
  if (queryIndex === -1) return null;
  const params = new URLSearchParams(url.slice(queryIndex + 1));
  const code = params.get('code');
  if (!code) return null;
  const flowId = params.get('sb_flow_id') ?? undefined;
  return { code, flowId };
}
