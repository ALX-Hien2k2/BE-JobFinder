const asyncWrapper = require('../middlewares/async')
// const config = process.env;

const uploadFile = asyncWrapper(async (req, res, next) => {
    console.log(req.file)
    res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        url: req.file.location
    })
})

module.exports = {
    uploadFile,
}