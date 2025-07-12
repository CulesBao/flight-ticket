/**
 * Payments Module Dependency Injection Tokens
 */

export const PAYMENT_TOKENS = {
  // Repository
  PAYMENT_REPOSITORY: 'PAYMENT_REPOSITORY',

  // Use Cases
  PROCESS_PAYMENT_USE_CASE: 'PROCESS_PAYMENT_USE_CASE',
  REFUND_PAYMENT_USE_CASE: 'REFUND_PAYMENT_USE_CASE',
  GET_PAYMENT_BY_ID_USE_CASE: 'GET_PAYMENT_BY_ID_USE_CASE',

  // External Services
  PAYMENT_GATEWAY: 'PAYMENT_GATEWAY',
} as const;

export type PaymentToken = keyof typeof PAYMENT_TOKENS;
