const express = require("express");
const router = express.Router();

const {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");

router.get("/", (req, res) => {
    res.json({ message: "Welcome" });
});

router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;