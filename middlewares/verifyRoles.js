const verifyRole = (userType) => {
  return (req, res, next) => {
    if (!req?.user.role) return res.sendStatus(401);
    if (req.user.role !== userType) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRole;