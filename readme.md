<p align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png" width="150" height="150" alt="logo_mal.png"/></p>  
<h5 align="center"><a href="https://commons.wikimedia.org/wiki/File:MyAnimeList_Logo.png">[Source: Wikipédia]</a></h5>  
  
## Instalação:  
- Rode o código abaixo para instalar via `NPM`:  
  
```bash  
$ npm i @killovsky/mal  
```  
  
- Rode o código abaixo para instalar via `GIT`:  
```bash  
$ git clone https://github.com/KillovSky/MyAnimeList.git  
```  
  
## O que este módulo faz?  
- Ele faz scrapping de todas as informações possíveis das páginas de anime do [My Anime List](https://myanimelist.net/).  
  
## O que este módulo tem de especial?  
- Assim como o da [NASA](https://github.com/KillovSky/NASA), muitas coisas, confira abaixo:  
  
------  
> 1. Neste módulo, os erros não afetam o funcionamento, o que significa que apesar de qualquer erro, os valores 'sempre' estarão lá para que você não seja afetado. [Leia o Q&A]  
>  
> 2. Os erros serão inseridos na resposta com uma explicação sobre o que causou eles, facilitando para você entender.  
>  
> 3. Os headers estão inseridos na resposta, facilitando para saber detalhes que podem lhe ser uteis.  
>  
> 4. Não existem dependências de módulos de terceiro, tudo é feito usando o puro `Node.js`.  
>  
> 5. Cada linha do código possui uma explicação do que está rodando ou vai rodar, ou seja, o código INTEIRO é explicado, linha por linha.   
>  
> 6. Ao contrario da API oficial do [MAL](https://myanimelist.net), esse módulo retorna dezenas de informações sem uma `API-KEY` ou 'limitação'.  
>  
> 7. E muitas outras coisas, confira o código para entender!  
------  
  
## Como testar este módulo:  
- Basta abrir um terminal na pasta do módulo e digitar:  
  
```bash  
$ npm test  
```  
  
## Como utilizar este módulo:  
- Existem diversas formas de utilizar, mas como se trata de um script que faz uso de `Promises`, irei dar dois exemplos que funcionam bem, lembrando, você pode rodar sem especificar nada pois também funciona desta forma.   
- Clique em uma das linhas/setas abaixo para exibir os detalhes!  
  
<details>  
<summary><code>Descrição de cada parâmetro da execução:</code></summary>  
  
```javascript  
// Adquire um anime aleatório  
get()  
// Enviando "TESTING_USAGE" na função...  
// ...Executará em modo teste.  
  
// Retorna o JSON padrão  
defaults()  
  
// Retorna apenas a URL de um anime  
onlyurl()  
  
// Retorna os animes padrões  
animes()  
  
// Retorna os códigos HTTP  
http()  
  
// Retorna a package JSON  
packages()  
```  
  
</details>   
  
<details>  
<summary><code>Exemplos de uso:</code></summary>  
  
```javascript  
// Usando .then | Modo de uso padrão  
const mal = require('@killovsky/mal');  
mal.get().then(data => {  
	// Faça seu código baseado na object 'data' aqui  
	// Exemplo: console.log(data);  
})  
  
// Usando await [async] | Modo de uso padrão  
const mal = require('@killovsky/mal');  
const data = await mal.get();  
// Faça seu código aqui usando a const 'data'  
// Exemplo: console.log(data);  
```  
  
</details>  
  
<details>  
<summary><code>Código já prontos [.then]:</code></summary>  
  
```javascript  
// Código usando .then  
const mal = require('@killovsky/mal');  
mal.get().then(data => console.log(data));  
```  
  
</details>  
  
<details>  
<summary><code>Código já prontos [async/await]:</code></summary>  
  
```javascript  
// Código usando await   
const mal = require('@killovsky/mal');  
const data = await mal.get();  
console.log(data);  
  
// Se você não sabe criar uma função async ou ainda não tiver uma, use este código abaixo:  
(async () => {  
	// Cole um código com await aqui dentro  
})();  
```  
  
</details>  
  
<details>  
<summary><code>Exemplo de resultado com explicações:</code></summary>  
  
- Caso um dos valores, como as arrays, não seja encontrado ou obtenha erros, `false` será colocado no seu lugar.  
  
```JSON  
{  
	"date": "String | Data [YYYY-MM-DD HH:MM:SS]",  
	"error": "true | false",  
	"error_msg": "String / false | Códigos de erros de execução",  
	"code": "Number | String | Código de erro HTTP",  
	"explain": {  
		"code": "Number / String | Código escrito de HTTP",  
		"why": "String | Explicação do código HTTP"  
	},  
	"headers": {  
		"date": "String | Data escrita da requisição",  
		"content-type": "String | Tipo de resposta",  
		"Outros": "E vários outros headers, faça uma requisição para obter todos."  
	},  
	"MAL": {  
		"url": "String / false | URL MAL do anime",  
		"image": "String / false | URL da capa do anime",  
		"title": "String / false | Nome padrão",  
		"title_synonyms": "String / false | Sinônimos do Nome",  
		"title_japanese": "String / false | Nome Japonês",  
		"title_french": "String / false | Nome Francês",  
		"title_english": "String / false | Nome Inglês",  
		"sort": {  
			"url": "String / false | URL MAL do tipo de transmissão",  
			"type": "String / false | Tipo de transmissão"  
		},  
		"episodes": "String / false | Número de episódios",  
		"list": {  
			"data": [  
				{  
					"platform": {  
						"id": "Número | ID?",  
						"name": "String | Nome da plataforma?",  
						"icon": "String | Nome do Icone?",  
						"type": "Número | Tipo?"  
					},  
					"available": "Boolean / true, false | Disponível na plataforma?",  
					"url": "String | URL na plataforma?"  
				}  
			],  
			"count": {  
				"available": "Número | ?",  
				"typicals": "Número | ?",  
				"others": "Número | ?",  
				"total": "Número | ?"  
			}  
		},  
		"status": "String / false | Status de transmissão",  
		"duration": "String / false | Duração do episodio",  
		"score": {  
			"votes": "String / false | Número de votos",  
			"value": "String / false | Porcentagem de aprovação"  
		},  
		"rank": "String / false | Número de ranking",  
		"popularity": "String / false | Número de popularidade",  
		"members": "String / false | Número de membros",  
		"favorites": "String / false | Número de favoritos",  
		"rating": "String / false | Classificação de idade",  
		"external": [  
			{  
				"name": "String / false | Nome do site externo",  
				"url": "String / false | URL's do site externo"  
			}  
		],  
		"characters": [  
			{  
				"voice": {  
					"name": "String / false | Nome do dublador/a",  
					"url": "String / false | URL da página MAL do dublador/a",  
					"images": "array / false | Fotos do dublador/a"  
				},  
				"name": "String / false | Nome do personagem",  
				"url": "String / false | URL's da página do personagem"  
			}  
		],  
		"ost": [  
			{  
				"hear": {  
					"spotify": "String / false | URL da música no Spotify",  
					"apple": "String / false | URL da música na Apple",  
					"amazon": "String / false | URL da música no Amazon",  
					"youtube": "String / false | URL da música no YouTube",  
					"other": "String / false | URL's de outros locais"  
				},  
				"name": "String / false | Nome da música",  
				"by": "String / false | Nome do autor",  
				"ep": "String / false | Episódios em que a OST apareceu"  
			}  
		],  
		"reviews": [  
			{  
				"name": "String / false | Nome do avaliador",  
				"date": "String / false | Data do comentário",  
				"url": "String / false | Link do perfil do avaliador",  
				"at": "String / false | Link da página do comentário",  
				"review": "String / false | Comentário do examinador"  
			}  
		],  
		"related": [  
			{  
				"name": "String / false | Nome de anime relacionado",  
				"url": "String / false | URL do anime relacionado"  
			}  
		],  
		"links": [  
			{  
				"name": "String / false | Nome da página MAL",  
				"url": "String / false | Link da página MAL"  
			}  
		],  
		"description": "String / false | Descrição do anime",  
		"stream": [  
			{  
				"name": "String / false | Nome do streaming",  
				"url": "String / false | URL do streaming"  
			}  
		],  
		"foruns": [  
			{  
				"name": "String / false | Nome da discussão",  
				"url": "String / false | URL MAL da discussão"  
			}  
		],  
		"recommendations": [  
			{  
				"name": "String / false | Nome da recomendação",  
				"url": "String / false | URL MAL da recomendação"  
			}  
		],  
		"aired": "String / false | Data de inicio ao fim da exibição",  
		"source": "String / false | Origem do anime",  
		"broadcast": "String / false | Dia da semana em que os episódios vão ao ar",  
		"premier": [  
			{  
				"at": "String / false | Tipo de premiação",  
				"url": "String / false | URL MAL do prêmio"  
			}  
		],  
		"genres": [  
			{  
				"name": "String / false | Nome do tema",  
				"url": "String / false | URL MAL do Tema"  
			}  
		],  
		"producers": [  
			{  
				"name": "String / false | Nome do produtor/a",  
				"url": "String / false | URL MAL do produtor/a"  
			}  
		]  
	}  
}  
```  
  
</details>  
  
<details>  
<summary><code>Exemplo utilizável de resultado:</code></summary>  
  
- A `Object` utilizável é grande demais para ser exibida aqui, sendo 2 a 3 vezes maior que a versão explicativa acima, para conferir um exemplo utilizável, acesse a "[Github](https://github.com/KillovSky/MyAnimeList)" oficial e abra o arquivo "[default.json](https://github.com/KillovSky/MyAnimeList/blob/master/default.json)" ou "[Clique Aqui](https://raw.githubusercontent.com/KillovSky/MyAnimeList/master/default.json)".
  
</details>   
  
## Perguntas e Respostas [Q&A]:  
  
- Isso é bem similar ao seu módulo do Projeto APOD da NASA, não é?  
> Sim, é por que quero criar sistemas fáceis de entender e usar, decidi que a melhor forma seria fazendo eles de forma similar, deixando o código bem simples para qualquer um que vier de outros projetos meus.  
>  
- Por que não usou `axios`, `cheerio` ou módulos do tipo?  
> Esse meio exige instalação de módulos de terceiro, quero fazer meus sistemas sem dependências, nada além do próprio `Node.js`, pois tenho foco em uma única tarefa: ser simples.  
>  
- O que é proibido ao usar este módulo?  
> Você jamais deve abusar de qualquer programa, sempre crie um limitador de tempo ou armazene a ultima resposta se caso seja a mesma imagem e use ela, evite ficar utilizando um programa deste estilo muitas vezes seguidas sem esperar.  
>  
- Comunicado do DEV [Q&A]  
> Este módulo foi feito em menos de um dia de forma apressada e rápida, ele não está completo ainda e pode apresentar erros, embora obter erros graves seja um pouco difícil, mesmo assim, use com cuidado e sem abuso.  
  
## Suporte  
  
- Se obtiver algum problema, você pode me dizer [Reportando nas Issues](https://github.com/KillovSky/MyAnimeList/issues).  
- Confira outros projetos meus [Acessando Isto](https://github.com/KillovSky).  
- Se gostar, doe para me ajudar a continuar desenvolvendo, mais informações [Clicando Aqui](http://htmlpreview.github.io/?https://github.com/KillovSky/iris/blob/main/.readme/donates/page.html) - [Página do Projeto Íris]  