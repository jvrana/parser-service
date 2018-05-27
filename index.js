const anyToJson = require('bio-parsers').anyToJson;
const jsonToGenbank = require('bio-parsers').jsonToGenbank;
const jsonToFasta = require('bio-parsers').jsonToFasta;

const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const server = require('apollo-server-micro');
const { json } = require('micro');

const typeDefs = `
  scalar JSON
  type Query {
    tojson(file: String!, filename: String!): Result,
    tojsons(files: [String!], filenames: [String!]): [Result],
    tofasta(json: SequenceInput!): String
    togenbank(json: SequenceInput!): String
  }
  
  input Lat {
    lat: Float,
    lon: Float,
    }
    
  
  type Result {
    messages: [String],
    success: Boolean,
    parsedSequence: Sequence
  }

  type Feature {
        name: String!,
        type: String,
        id: ID,
        start: Int!,
        end: Int!
        strand: Int!
  }
 
  type Sequence {
        size: Int,
        sequence: String!,
        circular: Boolean,
        name: String!,
        description: String,
        features: [Feature!]
  }
  
  input SequenceInput {
    sequence: String!,
    circular: Boolean,
    name: String!,
    description: String,
    features: [FeatureInput!]
  }
  
  input FeatureInput {
         name: String!,
        type: String,
        id: ID,
        start: Int!,
        end: Int!
        strand: Int!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        tojson: async (root, args, context) => {
            const response = await anyToJson(args.file, {"fileName": args.filename});
            return response[0]
        },
        tojsons: async (root, args, context) => {
            const promises = args.files.map( (f, i) => {
                return anyToJson(f, args.filenames[i])
            });
            let res =  await Promise.all(promises);
            res = res.map ( (x) => x[0] );
            return res
        },
        tofasta: async (root, args, context) => {
            const response = await jsonToFasta(args.json);
            return response
        },
        togenbank: async (root, args, context) => {
            const response = await jsonToGenbank(args.json);
            return response
        },
    },
};

// Required: Export the GraphQL.js schema object as "schema"
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
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