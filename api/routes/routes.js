module.exports = app => {
  const controller = require('../controllers/recipesController')();

  app.get('/recipes/', function (req, res) { //delimitar numero de parametros (max 3)
    var params = req.query.i;
    controller.recipes(params)
    .then(ret => {
      res.send(ret);
    })
  });

  return app;
}

