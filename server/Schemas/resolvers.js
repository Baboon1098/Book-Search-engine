const { User } = require('./models');

const resolvers = {
  Query: {
    user: async (_, { username }) => {
      return User.findOne({ username }).populate('savedBooks');
    },
  },

  Mutation: {
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      return user;
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Incorrect email or password');
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new Error('Incorrect email or password');
      }

      return user;
    },

    saveBook: async (_, { username, book }) => {
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { $push: { savedBooks: book } },
        { new: true }
      ).populate('savedBooks');

      return updatedUser;
    },

    removeBook: async (_, { username, bookId }) => {
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      ).populate('savedBooks');

      return updatedUser;
    },
  },
};

module.exports = resolvers;
