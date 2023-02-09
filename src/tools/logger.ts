import { LoggerType } from '@t/logger'

const loggerGenerator =
  (key: keyof Console = 'log') =>
  (...args: unknown[]) => {
    if (!process.env.DEBUG?.includes('logger')) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-console
    console[key](...args)
  }

let logger = loggerGenerator()

for (const key in console) {
  if (key !== 'log') {
    logger = Object.assign(logger, {
      [key]: loggerGenerator(key as keyof Console)
    })
  }
}

// this could be any library for logs
export default logger as LoggerType
