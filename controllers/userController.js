const bcrypt = require("bcrypt");
const UserModel = require("../models/users");

const getUsers = (req, res) =>{

    res.status(200).send({msg: "Probando traer los usuario"});}

const createUser = async (req, res) =>{
    const {name, surname, email, password, role} = req.body
    //crear el objeto del usuario
    let user = new UserModel({
        name,
        surname,
        email,
        password,
        role
    });

    const salt = bcrypt.genSaltSync(Number(process.env.SALT));
    const passwordHash = bcrypt.hashSync(password, salt);
    user.password = passwordHash;

    try {
        const newUser = await user.save();
        return res.status(200).send(newUser);
    } catch (error) {
        if (error.code === 11000) {
            console.log(error);
            return res.status(500).send({msg:"Error al parecer el usuario ya existe en la base de datos"});
        }else{
            console.error(error)
            return res.status(500).send({msg:"Fallo al crear el usuario"});
        }
    }
    //recoger los parametros que llegan por la peticion
    // let params = req.body;
    

    // if (params.password && params.name && params.surname && params.email) {
        
    //     //asignar valores al objeto usuario
    //     user.name = params.name;
    //     user.surname = params.surname;
    //     user.email = params.email;
    //     user.role = 'ROLE_USER';
    //     user.image = null;

    //     //siframos la contraseña
    //     bcrypt.hash(params.password, null , null, function(err, hash){
    //         user.password = hash;
    //         //guardamos el usuario
    //         user.save(( err, userStored) =>{
    //             if (err) {
    //                 res.status(500).send({msg:"Error al guardar el usuario"});
    //             }else{
    //                 if (!userStored) {
    //                 res.status(404).send({msg:"No se ha registrado el usuario"});
    //                 }else{
    //                     res.status(200).send({ user: userStored});
    //                 }
    //             }
    //         });
    //     })
    // }else{
    //     res.status(200).send({msg:"Introduce los datos Correctamente"})
    // }
    // res.status(200).send({msg: "Probando crear un usuario"});
}

const deleteUser = (req, res) =>{
    res.status(200).send({msg: "Probando eliminar un usuario"});
}

const updateUser = (req, res) =>{
    res.status(200).send({msg: "Probando updateUser un usuario"});
}

module.exports= {
    getUsers,
    createUser,
    deleteUser,
    updateUser
}