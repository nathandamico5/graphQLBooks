const { db, Book, Author } = require("./index.js");

const seed = async () => {
  try {
    await db.sync({ force: true });

    // Seed Books
    await Book.create({
      title: "Name of the Wind",
      genre: "Fantasy",
    });
    await Book.create({
      title: "The Final Empire",
      genre: "Fantasy",
    });
    await Book.create({
      title: "The Long Earth",
      genre: "Sci-Fi",
    });
    await Book.create({
      title: "The Hero of Ages",
      genre: "Fantasy",
    });
    await Book.create({
      title: "The Colour of Magic",
      genre: "Fantasy",
    });
    await Book.create({
      title: "The Light Fantastic",
      genre: "Fantasy",
    });

    // Seed Authors
    const author1 = await Author.create({
      name: "Patrick Rothfuss",
      age: 44,
    });
    const author2 = await Author.create({
      name: "Brandon Sanderson",
      age: 44,
    });
    const author3 = await Author.create({
      name: "Terry Pratchett",
      age: 66,
    });

    // Define Relations
    await author1.setBooks([1]);
    await author2.setBooks([2, 4]);
    await author3.setBooks([3, 5, 6]);
  } catch (err) {
    console.log(err);
  }
};

module.exports = seed;
if (require.main === module) {
  seed()
    .then(() => {
      console.log("Seeding success!");
      db.close();
    })
    .catch((err) => {
      console.error("Error While Seeding Database");
      console.error(err);
      db.close();
    });
}
