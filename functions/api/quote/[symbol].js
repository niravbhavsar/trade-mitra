/**
 * Cloudflare Pages Function: Path-parameter Quote Proxy (/api/quote/:symbol)
 */
import { onRequestGet as handleGet, onRequestOptions as handleOptions } from '../quote.js';

export const onRequestGet = handleGet;
export const onRequestOptions = handleOptions;
