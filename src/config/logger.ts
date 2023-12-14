const { createLogger, format, transports } = require('winston');
const { format: dateFormat } = require('date-fns');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format((info: any, opts:any) => {
      info.timestamp = dateFormat(new Date(), 'yyyy-MM-dd h:mm:ss a');
      return info;
    })(),
    format.colorize(),
    format.simple()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

export default logger;