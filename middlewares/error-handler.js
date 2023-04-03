const { CustomAPIError } = require("../errors/custom-error")

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ message: err.message })
    }
    //return res.status(500).json({ message: "Something went wrong, please try again" })
    //easier to read the error
    errorStatus = err.status || 500;
    errMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errMessage,
      stack: err.stack,
    });
}

module.exports = errorHandlerMiddleware