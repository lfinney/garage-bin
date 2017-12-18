const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Garage Bin';


app.get('/', (request, response) => {
  response.send('Oh, hai!');
});

app.get('/api/v1/items', (request, response) => {
  database('garage_items').select()
    .then((items) => {
      return response.status(200).json(items);
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;

  database('garage_items').where('id', id).select()
    .then((items) => {
      return response.status(200).json(items);
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
