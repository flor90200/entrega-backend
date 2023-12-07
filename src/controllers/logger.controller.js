import logger from "../logger.js"

export const loggerTest = async (req, res ) => {
  logger.debug('Test de logger Debug')
  logger.http('Test de logger http')
  logger.info('Test de logger info')
  logger.warning('Test de logger warning')
  logger.error('Test de logger error')
  logger.fatal('Test de logger fatal')

  res.send({ status: 'success', payload: 'Logger test successful' });
}