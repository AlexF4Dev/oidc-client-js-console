import fetch, {
  Headers,
  Request,
  Response,
} from 'node-fetch';

export const fetch_polyfill = () => {
  if (!globalThis.fetch) {
    (globalThis as any).fetch = fetch;
    (globalThis as any).Headers = Headers;
    (globalThis as any).Request = Request;
    (globalThis as any).Response = Response;
  }
}
