const jwt = require("jwt-simple");
//para calcular si el token aun no expiro
const moment = require("moment");

const ensureAuth = (req, res, next) =>{
    if (!req.headers.authorization) {
        return res.status(403).send({msg: "La peticion no tiene la cabecera de Autenticacion"})
    }
    //en caso de que si llegue la cabecera
    let token = req.headers.authorization.replace(/['"]+/g, ''); //sustituimos las comillas en caso de que se nos escape alguna
    let payload; //defino payload para que tenga los datos almacenados
    try {
        //decodificamos el token. IMPORTANTE SACARLE EL LET a payload ya que sino req.user nunca se establece correctamente, ya que estás asignando payload local (que es undefined fuera del bloque try) en lugar de asignar el payload externo.
        payload = jwt.decode(token, process.env.SECRET);
        //comprobamos si la fecha aun no expiro
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({msg:"El token ha expirado"})
        }
    } catch (error) {
        return res.status(404).send({msg:"El token no es valido"});
    }
    //generamos la req.user para poder acceder al usuario que esta logeado
    req.user = payload;

    next();
};




module.exports = {
    ensureAuth,
}