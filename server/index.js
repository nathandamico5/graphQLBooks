const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const { db } = require("./db");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 4000;
db.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`GraphQL API listening at http://localhost:${PORT}/graphql`);
  });
});
