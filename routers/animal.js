const express = require("express");
const AnimalsController = require("../controllers/animalController");

const router = express.Router();
//middleware
const mdAuth = require("../middleware/authenticate");

//multiparty
const multipart = require("connect-multiparty");
const mdUploadImage = multipart({ uploadDir: './uploads/animals' });

router.get("/", AnimalsController.getAnimals);
router.get("/:id", AnimalsController.getAnimal);
router.post("/", mdAuth.ensureAuth, AnimalsController.createAnimal);
router.put("/:id",mdAuth.ensureAuth, AnimalsController.updateAnimal);
router.post("/image/:id", [mdAuth.ensureAuth, mdUploadImage], AnimalsController.uploadImage);
router.get("/image/:imageFile", AnimalsController.getImageFile);
router.delete("/:id",mdAuth.ensureAuth, AnimalsController.deleteAnimal);

module.exports = router;