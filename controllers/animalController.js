//Modelos
const AnimalModel = require("../models/animals");
const UserModel = require("../models/users");
//Modulos
const fs = require("fs"); //libreria de ficheros de nodejs
const path = require("path"); //podemos acceder a rutas de archivos

const getAnimals = async (req, res) => {
  try {
    const animals = await AnimalModel.find({}).populate("user"); //populamos la coleccion para tener en la propiedad user el objeto de usuario que creo el animal

    if (!animals || animals.length === 0) {
      return res.status(404).send({ msg: "No hay animales" });
    }

    return res.status(200).send({ animals });
  } catch (error) {
    console.error("Error en la peticion:", error);
    return res.status(500).send({ msg: "Error en la peticion" });
  }
};

const createAnimal = async (req, res) => {
  try {
    const params = req.body;

    if (!params.name) {
      return res.status(400).send({ msg: "El nombre del animal es requerido" });
    }

    const animal = new AnimalModel({
      name: params.name,
      description: params.description,
      year: params.year,
      image: null,
      user: req.user.sub,
    });

    const animalStored = await animal.save();

    if (!animalStored) {
      return res.status(404).send({ msg: "No se ha guardado el animal" });
    }

    return res.status(200).send({ animal: animalStored });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).send({ msg: "Error en el servidor" });
  }
};

const getAnimal = async (req, res) => {
  try {
    const animalId = req.params.id;

    const animal = await AnimalModel.findById(animalId).populate("user"); //populamos para que nos traiga los datos del usuario que creo el animal

    if (!animal) {
      return res.status(404).send({ msg: "Animal no encontrado" });
    }

    return res.status(200).send({ animal });
  } catch (error) {
    console.error("Error en la petición:", error);
    return res.status(500).send({ msg: "Error en la petición" });
  }
};

const updateAnimal = async (req, res) => {
  try {
    const animalId = req.params.id;
    const update = req.body;

    //verificamos si el animal existe
    const animal = await AnimalModel.findById(animalId);
    if (!animal) {
      return res.status(404).send({ msg: "Animal no encontrado" });
    }
    //verificamos si el usuario tiene permisos para actualizar el animal
    if (animal.user.toString() !== req.user.sub) {
      return res
        .status(403)
        .send({ msg: "No tienes permiso para actualizar este animal" });
    }

    //actualizamos el animal
    const updateAnimal = await AnimalModel.findByIdAndUpdate(animalId, update, {
      new: true,
    });

    return res.status(200).send({ animal: updateAnimal });
  } catch (error) {
    console.error("Error en la peticion", error);
    return res.status(500).send({msg:"Error en la peticion"})
  }
};

//metodo para subir una imagen
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
            
            // if (id != req.user.sub) {
            //     return res.status(403).send({msg:"No tienes permiso para actualizar el Animal"});
            // }
            try {
                 // Subir la imagen en la base de datos
                 await AnimalModel.findByIdAndUpdate(id, { image: file_name }, { new: true });
                
                 // Obtener los datos actualizados del usuario
                 const updateAnimal = await AnimalModel.findById(id);
                 
                 return res.status(200).send({ animal: updateAnimal, msg: "La imagen fue subida con éxito" });
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
    let path_file = './uploads/animals/' + imageFile; // ruta donde está guardado

    // Verificar si el archivo existe
    if (fs.existsSync(path_file)) {
        // Si el archivo existe, enviarlo como respuesta
        res.sendFile(path.resolve(path_file));
    } else {
        // Si el archivo no existe, enviar un mensaje de error
        res.status(404).send({ msg: "La imagen no existe" });
    }
}


const deleteAnimal = async (req, res) => {
    try {
        const animalId = req.params.id;
        
        // Buscar el animal por su ID y eliminarlo
        const deletedAnimal = await AnimalModel.findByIdAndDelete(animalId);

        if (!deletedAnimal) {
            // Si no se encuentra el animal, devolver un mensaje de error
            return res.status(404).send({ msg: "Animal no encontrado" });
        }

        // Eliminación exitosa, devolver un mensaje de éxito
        return res.status(200).send({ animal: deletedAnimal, msg: "Animal eliminado correctamente"});
    } catch (error) {
        // Si ocurre un error durante la eliminación, devolver un mensaje de error
        console.error(error);
        return res.status(500).send({ msg: "Error al eliminar el animal" });
    }
};



module.exports = {
  getAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  uploadImage,
  getImageFile,
  deleteAnimal,
};
