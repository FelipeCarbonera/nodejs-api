module.exports = app => {
  const controller = require('../controllers/recipesController')();

  app.get('/recipes/', function (req, res) { //delimitar numero de parametros (max 3)
    var params = req.query.i;

    var countParams = params.split(',');

    //verifica se esta sendo passado mais de 3 ingredientes
    // caso tenha, utiliza apenas os 3 primeiros
    if(countParams.length > 3)
    {
      params = countParams[0] + ',' + countParams[1] + ',' + countParams[2];
    }

    controller.recipes(params)
    .then(ret => {
      res.send(ret);
    });
  });

  return app;
}

