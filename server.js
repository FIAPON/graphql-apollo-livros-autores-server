const { ApolloServer } = require('apollo-server'),
	depthLimit = require('graphql-depth-limit'),
	schema = require('./schema'),
	resolvers = require('./resolvers'),
	port = 3000;

const server = new ApolloServer({ 
	typeDefs: schema, 
	resolvers, 
	validationRules: [depthLimit(3)] 
});

server.listen(port).then(({url}) => {
	console.log(`Servidor funcionando! ${url}`);
});