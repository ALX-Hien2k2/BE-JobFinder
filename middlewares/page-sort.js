const PageSort = (req, res, next) => {
    const column = req.query.column || "createdAt";
    const sort = req.query.sort || "asc";
    const pageNumber = req.query.page || 1;

    req.column = column
    req.sortOrder = sort
    req.pageNumber = pageNumber
    next()
}

module.exports = { PageSort }