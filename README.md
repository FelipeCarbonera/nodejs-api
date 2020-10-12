# nodejs-api

Dentro do arquivo 'config/default.json' é configurada a porta a ser utilizada.
A mesma porta deve ser configurada no arquivo 'Dockerfile' na raiz do projeto pela variavel EXPOSE

No arquivo 'config/giphyApiConfig.json' é configurado as variáveis de acesso a API do GIPHY.

A pasta api possui a estrutura de pastas e arquivos do projeto:

'routes' tem a finalidade de gerenciar as rotas da API;
'data' possui as classes de gerenciamento de acesso as APIs do 'recipepuppy' e do 'Giphy';
'controllers' é onde estao as classes de controle, chamando as classes de acesso e manipulando os dados obtidos;


