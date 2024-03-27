const express = require("express");
const AnimalsController = require("../controllers/animalController");

const router = express.Router();

router.get("/", AnimalsController.getAnimals);
router.post("/", AnimalsController.createAnimal);
router.delete("/:id", AnimalsController.deleteAnimal);
router.put("/:id", AnimalsController.updateAnimal)

module.exports = router;