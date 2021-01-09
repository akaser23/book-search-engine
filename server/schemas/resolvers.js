const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('savedBooks')
        }
    },
    Mutations: {
        addUser: async (parent, args) => {
            const user = await User.create(body);

            if (!user) {
                return res.status(400).json({ message: 'Something is wrong!' });
            }
            const token = signToken(user);
            res.json({ token, user });
        },
        saveBook: async (parent, { user, body }) => {
            console.log(user);
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                );
                return res.json(updatedUser);
            } catch (err) {
                console.log(err);
                return res.status(400).json(err);
            }
        },
        removeBook: async (parent, { user, params }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: params.bookId } } },
                { new: true }
            );
            if (!updatedUser) {
                return res.status(404).json({ message: "Couldn't find user with this id!" });
            }
            return res.json(updatedUser);
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
            if (!user) {
                return res.status(400).json({ message: "Can't find this user" });
            }

            const correctPw = await user.isCorrectPassword(body.password);

            if (!correctPw) {
                return res.status(400).json({ message: 'Wrong password!' });
            }
            const token = signToken(user);
            res.json({ token, user });
        }
    }
};

module.exports = resolvers;