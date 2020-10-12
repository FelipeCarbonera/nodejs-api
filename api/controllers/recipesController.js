const recipesData = require('../data/recipesDataAccess')();
const gifData = require('../data/gifDataAccess')();
const async = require('async');

module.exports = () => {
    const controller = {};

    // cria o objeto pra ser retornado no requisição da api 
    const apiRecipesReturn = {};
    apiRecipesReturn.keywords = [];
    apiRecipesReturn.recipes = [];

    //método que retorna o 'apiRecipesReturn' com as receitas e gif encontradados pelos ingredientes  
    controller.recipes = (ingredients) => {
        return new Promise(resolve => {
            //método responsavel por popular as receitas
            PopulateRecipes(ingredients).then(apiRecipes => {

                //cria o array com os ingredientes
                SplitAndSortString(ingredients, ',').then(apiKeywords => {
                    apiRecipesReturn.keywords = apiKeywords;
                    apiRecipesReturn.recipes = apiRecipes;

                    //retorna o objeto apiRecipesReturn populado e pronto
                    resolve(apiRecipesReturn);
                });
            });
        });
    }

    return controller;
}

// cria e ordena um array de acordo com uma string e um reparador
function SplitAndSortString(stringToSplit, separator) {
    return new Promise(resolve => {
        resolve(stringToSplit.split(separator).sort());
    });
}

// popula o objeto recipes de acordo com as receitas encontradas
function PopulateRecipes(ingredients) {
    return new Promise(resolve => {

        GetRecipesFromRecipePuppyApiByIngredients(ingredients).then(RecipesPuppy => {

            if (RecipesPuppy.ApiError != undefined) {
                resolve(RecipesPuppy);
            }
            const recipes = [];

            var iterationsCount = 0;
            // para cada receita retornada da api, cria um objeto de recipe novo com uma nova estrutura

            async.each(RecipesPuppy, function (r) {

                GetGifUrlFromGiphyApiByTitle(r.title).then(giphyUrl => {

                    SplitAndSortString(r.ingredients, ',').then(apiRecipeIngredients => {
                        const recipe = {};

                        recipe.title = r.title;
                        recipe.ingredients = apiRecipeIngredients;
                        recipe.link = r.href;
                        recipe.gif = giphyUrl;

                        recipes.push(recipe);

                        iterationsCount++;
                        if (iterationsCount == RecipesPuppy.length) {
                            resolve(recipes);
                        }
                    });
                });
            });
        });
    });
}

//função responsável por realizar a chamada da api de receitas 
//recebe uma string contendo os ingredientes separados por virgula
function GetRecipesFromRecipePuppyApiByIngredients(ingredients) {
    return new Promise(resolve => {
        recipesData.GetRecipesFromApi(ingredients)
            .then(apiRet => {

                //caso a api retorne um erro
                if (typeof apiRet.ApiError != 'undefined') {
                    resolve(apiRet);
                }

                //converte o retorno da api para Json
                const RecipesPuppy = JSON.parse(apiRet.text).results;  // apiRecipes = [ { "title": "", "href": "", "ingredients": "", "thumbnail": "" } ]
                resolve(RecipesPuppy);

            });
    });
}

//função responsável por realizar a chamada da api da giphy
function GetGifUrlFromGiphyApiByTitle(title) {
    return new Promise(resolve => {
        gifData.GetRecipeGifFromApi(title).then(giphyUrl => { resolve(giphyUrl) });
    });
}