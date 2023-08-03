const User = require("../models/user");
const TokenGenerator = require("../lib/token_generator");

const UsersController = {
  Create: (req, res) => {
    const user = new User(req.body);
    user.save((err) => {
      if (err) {
        res.status(400).json({message: 'Bad request'})
      } else {
        res.status(201).json({ message: 'OK' });
      }
    });
  },
  GetUserByID: async (req, res) => {
    const user = await User.findById(req.params.id)
    console.log(user)
    if (! user) {
      res.status(404)
    }
    res.status(200).json({user})
  }
};

module.exports = UsersController;
