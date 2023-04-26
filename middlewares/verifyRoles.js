const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user.role) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    if (!rolesArray.includes(req.user.role)) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;