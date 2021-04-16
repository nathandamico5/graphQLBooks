const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
const { Book, Author, User } = require("../db");

// Book Type
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      async resolve(parent) {
        return await Author.findByPk(parent.authorId);
      },
    },
  }),
});

// Author Type
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: GraphQLList(BookType),
      async resolve(parent) {
        return await Book.findAll({
          where: {
            authorId: parent.id,
          },
        });
      },
    },
  }),
});

// User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    username: { type: GraphQLString },
  }),
});

// Auth Type - Authentication
const AuthType = new GraphQLObjectType({
  name: "Auth",
  fields: () => ({
    userId: { type: GraphQLID },
    token: { type: GraphQLString },
  }),
});

// Root Queries / Entry Points to graphQL API
// Root Queries:
//    Get All Books
//    Get Single Book
//    Get Sngle Author etc.
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // book matches what a front end query would call for
    // requires args to be able to identify specific book - id of type id in this case
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        // Code to get data from db / other source
        return await Book.findByPk(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return Author.findByPk(args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      args: { genre: { type: GraphQLString } },
      async resolve(parent, args) {
        let books;
        if (args.genre) {
          books = await Book.findAll({
            where: {
              genre: args.genre,
            },
          });
        } else {
          books = await Book.findAll();
        }
        return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve() {
        return await Author.findAll();
      },
    },
    users: {
      type: new GraphQLList(UserType),
      async resolve() {
        return await User.findAll();
      },
    },

    // Authentication Queries
    login: {
      type: AuthType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const { userId, token } = await User.authenticate({
          username: args.username,
          password: args.password,
        });
        console.log("We made it here", userId);
        return {
          userId,
          token,
        };
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args) {
        let author = await Author.create({
          name: args.name,
          age: args.age,
        });
        await author.save();
        return author;
      },
    },
    addBook: {
      type: BookType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        let book = await Book.create({
          title: args.title,
          genre: args.genre,
          authorId: args.authorId,
        });
        await book.save();
        return book;
      },
    },
    // Sign Up Functionality
    createUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        let user = await User.create({
          username: args.username,
          password: args.password,
        });
        await user.save();
        return user;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
