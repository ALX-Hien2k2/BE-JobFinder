const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("allowedRoles", allowedRoles)
    if (!req?.user.role) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    console.log("rolesArray", rolesArray)
    if (!rolesArray.includes(req.user.role)) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;