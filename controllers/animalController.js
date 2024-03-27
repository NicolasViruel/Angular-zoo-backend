// const AnimalModel = require("../models/animals");

const getAnimals = (req, res) =>{
    res.status(200).send({msg: "Probando traer todos los animales"});
}

const createAnimal = (req, res) =>{
    res.status(200).send({msg: "Probando crear un animal"});
}

const deleteAnimal = (req, res) =>{
    res.status(200).send({msg: "Probando eliminar un animal"});
}

const updateAnimal = (req, res) =>{
    res.status(200).send({msg: "Probando updateUser un animal"});
}

module.exports= {
    getAnimals,
    createAnimal,
    deleteAnimal,
    updateAnimal
}

