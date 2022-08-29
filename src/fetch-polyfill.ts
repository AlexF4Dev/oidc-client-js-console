import fetch, {
  Headers,
  Request,
  Response,
} from 'node-fetch';

export const fetch_polyfill = () => {
  const global: any = globalThis;
  if (!global.fetch) {
    global.fetch = fetch;
    global.Headers = Headers;
    global.Request = Request;
    global.Response = Response;
  }
}
