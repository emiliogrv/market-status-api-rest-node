export type LoggerType = ((...data: Array<any>) => void) & Omit<Console, 'log'>
