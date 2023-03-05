import pino from 'pino'
let log:any

if (process.env.NODE_ENV === 'production') {
    log = pino();
} else {
    const transport = pino.transport({
        target: 'pino-pretty',
        options: {
        colorize: true,
        timestampKey: 'time',
        translateTime: 'yyyy-mm-dd HH:MM:ss.l',
        messageFormat: '{msg}'
        }
    })
    log = pino({ level: 'debug' }, transport  )
}


export const getLogger = (name:string) => {
  const logger = log.child({ name })
  return logger
}