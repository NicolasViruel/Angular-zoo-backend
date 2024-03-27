const express = require("express");
const UserController = require("../controllers/userController");

const router = express.Router();

router.get("/", UserController.getUsers);
router.post("/", UserController.createUser);
router.delete("/:id", UserController.deleteUser);
router.put("/:id", UserController.updateUser)


module.exports = router;