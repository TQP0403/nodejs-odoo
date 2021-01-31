const bodyParser = require('body-parser');
const methodOverride = require('method-override');

module.exports = function (app) {
  app.use(methodOverride('X-HTTP-Method-Override'));

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());
};
