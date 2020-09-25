const { gql} = require('apollo-server');
const schema = gql`
type Query {
    livro(id: ID!): Livro
    livros: [Livro]!
    autor(id: ID!): Autor
    autores: [Autor]!
}
type Mutation {
    criarLivro(data: LivroInput!): Livro
    apagarLivro(where: LivroWhere!): Livro
    alterarLivro(data: LivroInputUpdate!): Livro
}
type Subscription {
	livro(where: LivroSubscriptionFilter!): LivroSubscriptionPayload
}

enum ModelMutationType{
	CREATED
	UPDATED
	DELETED
}


type Autor{
    id: ID!
    nome: String!
    livros: [Livro]!
}
type Livro{
    id: ID!
    titulo: String!
    ano: Int
    autor: Autor
}


input LivroInputUpdate{
    id: ID!
	titulo: String!
    ano: Int
}
input LivroInput{
	titulo: String!
    ano: Int
    autor: ID
}
input LivroWhere{
	id: ID!
}
input LivroSubscriptionFilter {
	mutation_in: [ ModelMutationType! ]
}
type LivroSubscriptionPayload{
	mutation: ModelMutationType
	node: Livro 
	previousValues: Livro
}
`;
module.exports = schema;