const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        getMe: async (parent, args, context) => {
            if (context.user) {
                const profile = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks')
                return profile;
            }
            throw new AuthenticationError('Not logged in')
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { book }, context) => {
            // console.log(user);
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: book } },
                    { new: true }
                );

                return user;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const User = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );

                return user;
            }

            throw new AuthenticationError('You need to be logged in!');

        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect Username');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Incorrect Password");
            }
            const token = signToken(user);
            return { token, user };
        }
    }
};

module.exports = resolvers;