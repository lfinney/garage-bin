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
app.use(express.static(__dirname + '/public'));


app.get('/', (request, response) => {
  response.send('Oh, hai!');
});

app.get('/api/v1/garageItems', (request, response) => {
  database('garage_items').select()
    .then((items) => {
      return response.status(200).json(items);
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/garageItems/:id', (request, response) => {
  const { id } = request.params;

  database('garage_items').where('id', id).select()
    .then((items) => {
      return response.status(200).json(items);
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/garageItems', (request, response) => {
  const item = request.body;

  for (const requiredParameter of ['name', 'reason', 'cleanliness']) {
    if (!item[requiredParameter]){
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} category`
      });
    }
  }

  database('garage_items').insert(item, 'id')
    .then((itemId) => {
      return response.status(201).json({ id: itemId[0] });
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.patch('/api/v1/garageItems/:id', (request, response) => {
  const { id } = request.params;
  const itemUpdate = request.body;

  if (!itemUpdate.cleanliness) {
    return response.status(422).json({
      error: 'You must only send an object literal to this endpoint'
    });
  }

  database('garage_items').where('id', id)
    .update(itemUpdate, '*')
    .then((update) => {
      if (!update.length) {
        return response.sendStatus(404);
      }
      return response.sendStatus(204);
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});



app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
