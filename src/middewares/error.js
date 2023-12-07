import EErros from "../service/errors/enums.js"
import logger from "../logger.js"

export default(error, req, res, next) => {
    

    switch (error.code) {
        case EErros.INVALID_TYPES_ERROR:
            res.status(400).send({ status: 'error', error: error.name})
            logger.error(error.cause)
            break;
        default:
            res.send({ status: 'error', error: 'Unhandled error'})
            break;
    }
}