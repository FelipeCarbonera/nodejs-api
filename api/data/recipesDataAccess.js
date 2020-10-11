module.exports = () => {
    const superagent = require('superagent');
    const httpStatus = require('http-status');

    const data = {};
    data.GetRecipesFromApi = (ingredients) => {
        return new Promise(resolve => {
            superagent.get('http://www.recipepuppy.com/api/')
                .query({ i: ingredients }) //passa os ingredientes para a busca na api
                //.query({ p: 1 })
                .type('json')
                .catch(error => {
                    const errorReturn =
                    {
                        "error":{
                            "status": error.status,
                            "msg": httpStatus[error.status] + ' | HTTP STATUS -> ' + error.status
                        }
                    };

                    resolve(errorReturn);
                })
                .then(response => {
                    //retorna as receitas encontradas
                    resolve(response);
                });
        });
    }

    return data;
}