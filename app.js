const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema')
const app = express();
const cors = require('cors');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const expressPlayground = require("graphql-playground-middleware-express").default;
const mongoose = require('mongoose');


const startServer = async()=>{

   
    const mongoDbConnectionString = process.env.groceryListMongoDb;
    await mongoose.connect(mongoDbConnectionString, {

        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

app.use(cors());
mongoose.set('bufferCommands', false);


app.use('/graphql',  graphqlHTTP({
    schema,
    graphiql:true
}));


  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
  
  const port = process.env.PORT || "4000";  
  app.listen(port);
  
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  

}

startServer();