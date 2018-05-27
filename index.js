const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema.js')



const PORT = 3000;
// bodyParser is needed just for POST.
const app = express();
app.use('/json', bodyParser.urlencoded({extended: true}), graphqlExpress({ schema: schema }));
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled

app.listen(PORT, () => console.log("Parser listening on port 3000!"));
//
// const PORT = 3000;
// app.us
// console.log(anyToJson);
// module.exports = server.microGraphql({schema: schema})