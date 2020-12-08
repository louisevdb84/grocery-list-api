const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema')
const app = express();
const cors = require('cors');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')

const mongoose = require('mongoose');

const mongoDbConnectionString = process.env.groceryListMongoDb;
 mongoose.connect(mongoDbConnectionString, {

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

app.use(cors());

//This route will be used as an endpoint to interact with Graphql, 
//All queries will go through this route. 
app.use('/graphql',  graphqlHTTP({
    //Directing express-graphql to use this schema to map out the graph 
    schema,
    //Directing express-graphql to use graphiql when goto '/graphql' address in the browser
    //which provides an interface to make GraphQl queries
    graphiql:true
}));

//app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on port 4000');
}); 