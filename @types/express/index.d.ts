declare namespace Express {
  import { MatchedDataOptions } from 'express-validator'

  export interface Request {
    $get: (keys: string | Array<string>, defaultValue?: any) => any
    $validated: (options?: Partial<MatchedDataOptions>) => Record<string, any>
  }
}
