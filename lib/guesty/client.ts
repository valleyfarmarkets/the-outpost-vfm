import 'server-only';
import { GUESTY_API_BASE_URL } from '../env';
import { getValidToken } from './token-manager';
import type { GuestyError } from './types';

/**
 * Guesty API Client with Serverless-Safe Rate Limiting
 *
 * This module provides a wrapper for all Guesty Booking Engine API calls with:
 * - Automatic OAuth token injection
 * - Exponential backoff retry for 429 rate limits
 * - Comprehensive error handling
 *
 * Rate Limits (from Guesty):
 * - 5 requests/second
 * - 275 requests/minute
 * - 16,500 requests/hour
 *
 * Strategy: Rely on Guesty's 429 responses rather than trying to count requests
 * locally (impossible in serverless with multiple instances)
 */

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

/**
 * Makes an authenticated request to the Guesty API
 *
 * @param endpoint - API endpoint path (e.g., '/search')
 * @param options - Fetch options
 * @returns Parsed JSON response
 * @throws Error if request fails after retries
 */
export async function guestyFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return retryWithBackoff(async () => {
    // Get valid token (automatically renews if needed)
    const token = await getValidToken();

    // Make request with auth token
    const url = `${GUESTY_API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Handle rate limiting (429)
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : 2000;

      console.warn(
        `[Guesty Client] Rate limited. Retry after ${delay}ms`
      );

      throw new RateLimitError(delay);
    }

    // Handle other errors
    if (!response.ok) {
      const errorData: GuestyError = await response.json().catch(() => ({
        error: 'Unknown Error',
        message: response.statusText,
        statusCode: response.status,
      }));

      throw new GuestyApiError(
        errorData.message || response.statusText,
        response.status,
        errorData
      );
    }

    // Parse and return response
    const data: T = await response.json();
    return data;
  });
}

/**
 * Retry logic with exponential backoff
 *
 * Handles 429 rate limit errors specially by using Retry-After header
 * For other errors, uses exponential backoff: 1s → 2s → 4s
 *
 * @param fn - Function to retry
 * @returns Result of successful function call
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on last attempt
      if (attempt === MAX_RETRIES) {
        break;
      }

      // Handle rate limit with custom delay
      if (error instanceof RateLimitError) {
        console.log(
          `[Guesty Client] Retry attempt ${attempt + 1}/${MAX_RETRIES} after rate limit`
        );
        await sleep(error.retryAfter);
        continue;
      }

      // Handle other errors with exponential backoff
      if (error instanceof GuestyApiError && error.statusCode >= 500) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        console.log(
          `[Guesty Client] Retry attempt ${attempt + 1}/${MAX_RETRIES} after ${delay}ms (server error)`
        );
        await sleep(delay);
        continue;
      }

      // Don't retry client errors (4xx except 429)
      throw error;
    }
  }

  // All retries exhausted
  throw lastError || new Error('Request failed after retries');
}

/**
 * Sleep utility
 * @param ms - Milliseconds to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Rate Limit Error (429)
 * Contains the delay from Retry-After header
 */
class RateLimitError extends Error {
  constructor(public retryAfter: number) {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
  }
}

/**
 * Guesty API Error
 * Contains full error details from API response
 */
export class GuestyApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorData: GuestyError
  ) {
    super(message);
    this.name = 'GuestyApiError';
  }
}
