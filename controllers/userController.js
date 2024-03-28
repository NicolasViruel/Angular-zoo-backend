const bcrypt = require("bcrypt");
const UserModel = require("../models/users");
const jwt = require("../services/jwt");
const fs = require("fs"); //libreria de ficheros de nodejs
const path = require('path') //podemos acceder a rutas de archivos

const createUser = async (req, res) =>{
    const {name, surname, email, password, role} = req.body

    if (!email) return res.status(400).send({msg:"Email es requerido"});
    if (!password) return res.status(400).send({msg:"La password es requerida"});
    //crear el objeto del usuario
    let user = new UserModel({
        name,
        surname,
        email: email.toLowerCase(),
        password,
        role
    });

    const salt = bcrypt.genSaltSync(Number(process.env.SALT));
    const passwordHash = bcrypt.hashSync(password, salt);
    user.password = passwordHash;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).send({ msg: "El usuario ya existe" });
        }
        //creamos el usuario
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
}

const login = async (req, res)=>{
    const { email, password} = req.body
    if (!email || !password) {
        return res.status(400).send({msg:"Todos los campos son requeridos"});
    }
    const emailLowerCase = email.toLowerCase();

    try {
        const findUser = await UserModel.findOne({ email:emailLowerCase});

        if (findUser) {
            const isMatch = bcrypt.compareSync( password, findUser.password);
            if (isMatch) {
                //creamos el token
                res.status(200).send({ token: jwt.createToken(findUser)});
            } else {
                res.status(400).send({msg:"El email o password son incorrectos"})
            }
        }else{
            res.status(400).send({msg:"El usuario no fue encontrado"});
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({msg: "Usuario no encontrado"})
    }
}

const deleteUser = (req, res) =>{
    res.status(200).send({msg: "Probando eliminar un usuario"});
}

const updateUser = async (req, res) =>{

    const {id} = req.params;
    const userDate = req.body;
    console.log(req);
    if (id != req.user.sub) {
        return res.status(403).send({msg:"No tienes permiso para actualizar el usuario"});
    }
    try {
        await UserModel.findByIdAndUpdate(id, userDate, {new:true} );
        return res.status(200).send({msg: "El usuario ha sido editado con exito"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg: "Error al editar el usuario"});
    }


    
}

const uploadImage = async ( req, res) =>{

    const {id} = req.params;

    //files existe gracias al multi-party
    if (req.files) {
        let file_path = req.files.image.path; //es la ruta del fichero que hemos subido
        let file_split = file_path.split('\\'); //split para sacar solamente el nombre del fichero
        let file_name = file_split[2];
        let ext_split = file_name.split('\.'); //para sacar la extencion de la imagen (si es png-jpg - etc)
        let file_ext = ext_split[1];

        // Convertir la extensión del archivo a minúsculas antes de realizar la comparación
        const file_ext_lower = file_ext.toLowerCase();

        if (file_ext_lower === 'png' || file_ext_lower === 'jpg' || file_ext_lower === 'jpeg' || file_ext_lower === 'gif') {
            
            if (id != req.user.sub) {
                return res.status(403).send({msg:"No tienes permiso para actualizar el usuario"});
            }
            try {
                 // Actualizar la imagen del usuario en la base de datos
                 await UserModel.findByIdAndUpdate(id, { image: file_name }, { new: true });
                
                 // Obtener los datos actualizados del usuario
                 const updatedUser = await UserModel.findById(id);
                 
                 return res.status(200).send({ user: updatedUser, msg: "La imagen fue subida con éxito" });
            } catch (error) {
                console.log(error);
                return res.status(500).send({msg: "Error al editar el usuario"});
            }


        }else{
            fs.unlink(file_path, (err) =>{
                //si la extension no es valida debemos eliminar la imagen que se subio, para no acumular.
                if (err) {
                    return res.status(200).send({msg: "Extension no valida y fichero no borrado"});
                }else{
                    return res.status(200).send({msg: "Extension no valida"});
                }
            });

            
        }
    }else{
        return res.status(200).send({msg: "No se ha subido un archivos"});
    }
}

//metodo para devolver la imagen como tal
const getImageFile = (req, res) => {
    let imageFile = req.params.imageFile; // nombre del archivo
    let path_file = './uploads/users/' + imageFile; // ruta donde está guardado

    // Verificar si el archivo existe
    if (fs.existsSync(path_file)) {
        // Si el archivo existe, enviarlo como respuesta
        res.sendFile(path.resolve(path_file));
    } else {
        // Si el archivo no existe, enviar un mensaje de error
        res.status(404).send({ msg: "La imagen no existe" });
    }
}
//metodo para devolver los cuidadores con rol Admin
const getKeepers = async (req, res) => {
    try {
        const users = await UserModel.find({ role: "admin" }).exec();

        if (!users || users.length === 0) {
            return res.status(404).send({ msg: "No hay cuidadores" });
        }

        return res.status(200).send({ users });
    } catch (error) {
        console.error("Error en la petición:", error);
        return res.status(500).send({ msg: "Error en la petición" });
    }
};

module.exports= {
    getKeepers,
    createUser,
    deleteUser,
    updateUser,
    login,
    uploadImage,
    getImageFile
}