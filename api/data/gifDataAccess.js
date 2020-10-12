const superagent = require('superagent');
const httpStatus = require('http-status');
const util = require('util');
module.exports = () => {

    // busca o arquivo de configurações para ter acesso a api da giphy
    const giphyApiConfig = require('../../config/giphyApiConfig'); 
    const _key = giphyApiConfig.giphyApi.key;
    const _limit = giphyApiConfig.giphyApi.limit;
    const _offset = giphyApiConfig.giphyApi.offset;
    const _rating = giphyApiConfig.giphyApi.rating;
    const _lang = giphyApiConfig.giphyApi.lang;

    const data = {};
    data.GetRecipeGifFromApi = (RecipeName) => {
        return new Promise(resolve => {
            superagent.get('https://api.giphy.com/v1/gifs/search')
                .query({ api_key: _key })
                .query({ q: RecipeName })
                .query({ limit: _limit })
                .query({ offset: _offset })
                .query({ rating: _rating })
                .query({ lang: _lang })
                .type('json')
                .catch(error => {

                    console.log(error);
                    
                    //caso ocorra algum problema, o link é retornado como um erro
                    const errorReturn =
                    {
                        "error":{
                            "status": error.status,
                            "msg": httpStatus[error.status] + ' | HTTP STATUS -> ' + error.status
                        }
                    }
                    resolve(errorReturn);
                })
                .then(response => {
                    //converte o retorno de json para um objeto
                    const gif = JSON.parse(response.text)

                    //busca somente a o link da primeira imagem encontrada com o nome da receita
                    var url = gif.data[0].images.downsized.url
                    
                    resolve(url);  
                });
        });
    }

    return data;
}