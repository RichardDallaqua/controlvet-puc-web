//Importa as dependências que acabamos de instalar
const express = require("express");
const path = require("path");

const app = express();

// Serve os arquivos estáticos da pasta dist (gerada pelo ng build)
app.use(express.static(__dirname + "/dist/controlvet"));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/controlvet/index.html"));
});

// Inicia a aplicação pela porta configurada
app.listen(process.env.PORT || 8080);

const proxy = [
    {
      context: '/api',
      target: 'controlvet-rest-api.herokuapp.com',
      // target: 'http://localhost:8080',
      pathRewrite: {'^/api' : ''}
    }
  ];
  module.exports = proxy;