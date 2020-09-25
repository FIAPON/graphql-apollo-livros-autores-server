const { PubSub } = require('apollo-server');
const pubsub = new PubSub();


const listaLivros = [
	{
		"id": "123",
		"titulo": "GraphQL: A revolucionária linguagem de consulta e manipulação de dados para APIs",
        "ano": 2019,
        "autor": "111"
	},
	{
		"id": "456",
		"titulo": "14 Hábitos de Desenvolvedores Altamente Produtivos",
        "ano": 2020,
        "autor": '222'
    },
    {
		"id": "789",
		"titulo": "Learning JavaScript Data Structures and Algorithms",
        "ano": 2014,
        "autor": '333'
    }, 
    {
		"id": "987",
		"titulo": "Mastering Ext Js",
        "ano": 2013,
        "autor": '333'
	}
];

const listaAutores = [
    {
        "id": "111",
        "nome": "Akira Hanashiro",
        "livros": ['123']
    },
    {
        "id": "222",
        "nome": "Zeno Rocha",
        "livros": ['456']
    },
    {
        "id": "333",
        "nome": "Loiane Groner",
        "livros": ['789', '987']
    }
];

const resolvers = {
    Livro: {
        autor(parent){
            return listaAutores.find(autor => autor.id === parent.autor)
        }
    },
    Autor: {
        livros(parent){
            return listaLivros.filter(livro => parent.livros.includes(livro.id))
        }
    },
	Query: {
		livro(root, args) {  
			return listaLivros.find(livro => livro.id === args.id);
		},
		livros() {
			return listaLivros;
        },
        autor(root, args) {  
			return listaAutores.find(autor => autor.id === args.id);
		},
		autores() {
			return listaAutores;
        }
	},
	Mutation: {
		criarLivro(root, args){
			const novoLivro = args.data;
			novoLivro.id = Date.now().toString();
			
			listaLivros.push(novoLivro);

			pubsub.publish('livro_CREATED', {
				livro: { 
					mutation: 'CREATED',
					node: novoLivro,
					previousValues: null
			
				}
			});
			return novoLivro;
		}, 
		apagarLivro(root, args){
			const indice = listaLivros.findIndex(livro => livro.id == args.where.id);
			if(indice >= 0){
				const livroDeletado =  listaLivros.splice(indice, 1)[0];
				pubsub.publish('livro_DELETED', {
					livro: {
						mutation: 'DELETED',
						node: null,
						previousValues: livroDeletado
					}
				});
				return livroDeletado;
			}
			return null;
        },
        alterarLivro(root, args){
            const indice = listaLivros.findIndex(livro => livro.id == args.data.id);
            if(indice >= 0){
                const novoLivro = args.data;
                const livroAntigo = listaLivros[indice];
                listaLivros[indice] = novoLivro;
                pubsub.publish('livro_UPDATED', {
					livro: {
						mutation: 'UPDATED',
						node: novoLivro,
						previousValues: livroAntigo
					}
				});
                return novoLivro;
            }
            return null;
        }
	},
	Subscription: {
		livro: {
		  subscribe: (root, args) => {
			  const eventNames = args.where.mutation_in.map(eventName => `livro_${eventName}`);
			  return pubsub.asyncIterator(eventNames);
		  }
		},
	},
};

module.exports = resolvers;