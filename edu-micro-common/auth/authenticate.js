const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const CONST = require("../constants/CONST");
const STATUS = require("../constants/STATUS");
const AUTH = require("../constants/AUTH");
const { match, parse } = require("matchit");
let redis = require("../config/redis");
let crypto = require('crypto');

module.exports = async (req, res, next) => {

    try {

        const url = req._parsedUrl.pathname;
        const urlExist = Object.keys(match(url, AUTH.API.PUBLIC.map(parse))).length;
        const isAuthApi = urlExist == 0 ? false : true;

        if (isAuthApi) return next();

        const token = req.header("authorization");
        const decoded = jwt.verify(token, AUTH.SECRET_KEY);
        req.plainToken = decoded;

        const isUserValid = await redis.GetKeyRedis(req.plainToken.user_name);
        if (isUserValid) {
            logger.info(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
            logger.info(
                `Read Token Successfully for User : ${req.plainToken.user_name}`
            );
            next();
        } else {

            // const hashKey = crypto.createHash('md5').update(token).digest('hex');
            // const isUserValidForSelfReg = await redis.GetKeyRedis(hashKey);

            // if (isUserValidForSelfReg) {
            //     logger.info(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
            //     logger.info(
            //         `Read Token Successfully for User : ${req.plainToken.user_name}`
            //     );
            //     next();
            // } else {
                logger.debug(`Token Not Found In Redis`);
                res.status(STATUS.UNAUTHORIZED).send("Unauthenticated access!");
            // }
        }
    } catch (ex) {
        logger.debug(`Error decrypting token ${JSON.stringify(ex)}`);
        res.status(STATUS.UNAUTHORIZED).send("Unauthenticated access!");
    }
};
