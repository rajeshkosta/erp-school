


const sendSuccessResponse = (res, status, data, message) => {

    const responseData = {
        isError: false,
        message,
        data,
    };

    return res.status(status).send(responseData);
}

const sendErrorResponse = (res, status, errorCode, errMessage) => {

    const responseData = {
        isError: true,
        errorCode,
        error: errMessage,
    };

    return res.status(status).send(responseData);
}

module.exports = {
    sendSuccessResponse,
    sendErrorResponse
}