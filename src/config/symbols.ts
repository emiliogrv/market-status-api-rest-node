export const SYMBOLS_ALLOWED = ['BTCUSD', 'ETHUSD'] as const

export type SymbolsAllowedEnum = (typeof SYMBOLS_ALLOWED)[number]
