const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({msg: "No tienes acceso a esta zona"});
    }
    next();
}

module.exports = {isAdmin};
