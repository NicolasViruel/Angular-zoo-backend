const express = require("express");
const UserController = require("../controllers/userController");
const router = express.Router();
//middleware
const mdAuth = require("../middleware/authenticate");

//multiparty
const multipart = require("connect-multiparty");
const mdUploadImage = multipart({ uploadDir: './uploads/users' });

router.post("/", UserController.createUser);
router.post("/login",mdAuth.ensureAuth, UserController.login);
router.put("/:id",mdAuth.ensureAuth, UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.post("/image/:id", [mdAuth.ensureAuth, mdUploadImage], UserController.uploadImage);
router.get("/:imageFile", UserController.getImageFile);
router.get("/", UserController.getKeepers);


module.exports = router;