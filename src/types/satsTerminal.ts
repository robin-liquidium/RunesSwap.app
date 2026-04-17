/**
 * Types related to SatsTerminal SDK interactions and API responses.
 */

import { z } from 'zod';

/**
 * Represents a Rune as returned by SatsTerminal or enriched from Ordiscan.
 */
export interface Rune {
  /** Unique identifier for the Rune. */
  id: string;
  /** Name of the Rune. */
  name: string;
  /** URI for the asset image. Required for type safety. */
  imageURI: string;
  /** Formatted amount string (optional). */
  formattedAmount?: string | undefined;
  /** Formatted unit price string (optional). */
  formattedUnitPrice?: string | undefined;
  /** Price value (optional). */
  price?: number | undefined;
}

// Add other SatsTerminal specific types here as needed, e.g.:
// export interface SatsTerminalQuote {
//   ...
// }

export const runeOrderSchema = z
  .object({
    id: z.string().min(1, 'Order ID is required'),
    market: z.string().min(1, 'Market is required'),
    price: z.number(),
    formattedAmount: z.number(),
    fromTokenAmount: z.string().optional(),
    slippage: z.number().optional(),
    listingAmount: z.number().optional(),
    sellerAddress: z.string().optional(),
    tokenAmount: z.string().optional(),
    listingPrice: z.string().optional(),
    updatedAt: z.string().optional(),
    formattedUnitPrice: z.string().optional(),
    alkanesId: z.string().optional(),
    name: z.string().optional(),
    amount: z.string().optional(),
  })
  .passthrough();
