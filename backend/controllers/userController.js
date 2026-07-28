exports.getUsers = (req, res) => {
    res.json({
        message: "All users"
    });
};

exports.createUser = (req, res) => {
    res.json({
        message: "User created"
    });
};

exports.updateUser = (req, res) => {
    res.json({
        message: `Updated user ${req.params.id}`
    });
};

exports.deleteUser = (req, res) => {
    res.json({
        message: `Deleted user ${req.params.id}`
    });
};