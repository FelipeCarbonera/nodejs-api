const recipesData = require('../data/recipesDataAccess')();
const gifData = require('../data/gifDataAccess')();
const async = require('async');

module.exports = () => {

    const controller = {};

    const apiRecipesReturn = {};

    apiRecipesReturn.keywords = [];
    apiRecipesReturn.recipes = [];

    controller.recipes = (ingredients) => {
        return new Promise(resolve => {
            recipesData.GetRecipesFromApi(ingredients)
                .catch(error => {
                    console.log("Error on 'recipesData.GetRecipesFromApi(ingredients)' -> " + error);
                    resolve("ERRO!");
                })
                .then(apiRet => {

                    //caso a api retorne com algum status diferente, retorna o status http. 
                    if (apiRet.status != 200 || apiRet.error.status != 200) {
                        resolve(httpStatus[apiRet.status] + ' | HTTP STATUS -> ' + apiRet.status);
                    }
                    else {
                        const apiRecipes = JSON.parse(apiRet.text).results;  // apiRecipes = [ { "title": "", "href": "", "ingredients": "", "thumbnail": "" } ]

                        //cria e ordena o array com os ingredientes
                        splitAndSortString(ingredients, ',').then(arrayIngredients => {
                            apiRecipesReturn.keywords = arrayIngredients;

                            //chama o método para popular com as receitas e buscar o gif de cada receita
                            PopulateRecipe(apiRecipes).then(recipes => {
                                apiRecipesReturn.recipes = recipes;

                                //retorna o objeto apiRecipesReturn, que contém a estrutura e as receitas encontradas com os ingredientes passados
                                resolve(apiRecipesReturn);
                            });
                        });
                    }
                });
        });
    };

    return controller;
}

// cria e ordena array de acordo com uma string e um reparador
function splitAndSortString(stringToSplit, separator) {
    return new Promise(resolve => {
        resolve(stringToSplit.split(separator).sort());
    });
}

// popula o objeto recipes de acordo com as receitas encontradas
function PopulateRecipe(apiRecipe) {
    return new Promise(resolve => {

        const recipes = [];

        var itemsProcessed = 0;

        // para cada receita retornada da api, cria um objeto de recipe novo com uma nova estrutura
        async.each(apiRecipe, function (r) {
            const recipe = {};
            recipe.title = '';
            recipe.ingredients = [];
            recipe.link = '';
            recipe.gif = '';

            // cria o array com todos os ingredientes da raceita
            splitAndSortString(r.ingredients, ',').then(arrayIngredients => {

                //busca a url de um gif encontrado com o titulo da receita
                gifData.GetRecipeGifFromApi(r.title).then(gif => {

                    recipe.title = r.title;
                    recipe.ingredients = arrayIngredients;
                    recipe.link = r.href;
                    recipe.gif = gif;
                    
                    //adiciona a receita no array de receitas
                    recipes.push(recipe);

                    itemsProcessed++;
                    // garante que todas as iterações do .each foram realizadas
                    if (itemsProcessed == apiRecipe.length) {
                        resolve(recipes);
                    }
                });
            });

        });
    });
}