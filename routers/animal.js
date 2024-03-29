const express = require("express");
const AnimalsController = require("../controllers/animalController");

const router = express.Router();
//middlewares
const mdAuth = require("../middleware/authenticate");
const mdAdmin = require("../middleware/isAdmin.js");

//multiparty
const multipart = require("connect-multiparty");
const mdUploadImage = multipart({ uploadDir: './uploads/animals' });

router.get("/", AnimalsController.getAnimals);
router.get("/:id", AnimalsController.getAnimal);
router.post("/", [mdAuth.ensureAuth, mdAdmin.isAdmin], AnimalsController.createAnimal);
router.put("/:id",[mdAuth.ensureAuth, mdAdmin.isAdmin], AnimalsController.updateAnimal);
router.post("/image/:id", [mdAuth.ensureAuth, mdAdmin.isAdmin, mdUploadImage], AnimalsController.uploadImage);
router.get("/image/:imageFile", AnimalsController.getImageFile);
router.delete("/:id",[mdAuth.ensureAuth, mdAdmin.isAdmin], AnimalsController.deleteAnimal);

module.exports = router;