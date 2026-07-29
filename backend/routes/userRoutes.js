const express = require("express");
const router = express.Router();

const { authenticate, authorizeRoles } = require('../middleware/auth');
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");

router.use(authenticate);
router.use(authorizeRoles('admin'));

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User created
 */
router.get("/", getUsers);
router.post("/", createUser);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 */
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;