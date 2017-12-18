const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return an html homepage with text', (done) => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.includes('Garage Bin');
        done();
      });
  });

    it('should return a 404 for a route that does not exist', (done) => {
      chai.request(server)
        .get('/sadness')
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });

});

describe('API Routes', () => {
  before((done) => {
      database.migrate.latest()
        .then(() => done())
        .catch((error) => {
          throw error;
        });
    });

    beforeEach((done) => {
      database.seed.run()
        .then(() => done())
        .catch((error) => {
          throw error;
        });
    });

  describe('GET /api/v1/garageItems', () => {
    it('should revtrieve all items in garage', (done) => {
      chai.request(server)
        .get('/api/v1/garageItems')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body.includes({ 'id': 1 });
          response.body.includes({ 'name': 'Tarp' });
          response.body.includes({ 'reason': 'Fun' });
          response.body.includes({ 'cleanliness': 'Rancid' });
          done();
        });
    });

    it('should return a 404 if path does not exist', (done) => {
      chai.request(server)
        .get('/api/v1/sadness')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('GET /api/v1/garageItems/:id', () => {
    it('should retrieve a specific item from the garage', (done) => {
      chai.request(server)
        .get('/api/v1/garageItems/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body.includes({ 'id': 1 });
          response.body.includes({ 'name': 'Tent' });
          response.body.includes({ 'reason': 'camping' });
          response.body.includes({ 'cleanliness': 'Dusty' });
          done();
      })
    });

    it('should return a 404 if path does not exist', (done) => {
      chai.request(server)
        .get('/api/v1/sadness')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });

  });

  describe('POST /api/v1/garageItems/', () => {
    it('should be able to add a new item to garage', (done) => {
      chai.request(server)
        .post('/api/v1/garageItems/')
        .send({
          id: 4,
          name: 'Pokemon Cards',
          reason: 'They are going to pay for college',
          cleanliness: 'Sparkling'
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.have.property('id');
          response.body.id.should.equal(4);
          chai.request(server)
            .get('/api/v1/garageItems')
            .end((error, response) => {
              response.body.should.be.a('array');
              response.body.length.should.equal(4);
              response.body.includes({ 'name': 'Pokemon Cards' });
              done();
            });
        });
    });

    it('should not be able to add a new garage item if a property is missing', (done) => {
      chai.request(server)
        .post('/api/v1/garageItems/')
        .send({
          id: 4,
          name: 'Pokemon Cards',
          cleanliness: 'Sparkling'
        })
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
    });

  });

  describe('PATCH /api/v1/garageItems/:id', () => {
    const updateItem = {
      cleanliness: 'Sparkling',
    };

    it('should be able to update the cleanliness of an item', (done) => {
      chai.request(server)
        .patch('/api/v1/garageItems/1')
        .send(updateItem)
        .end((error, response) => {
          response.should.have.status(204);
          chai.request(server)
            .get('/api/v1/garageItems/1')
            .end((error, response) => {
              response.body.should.be.a('array');
              response.body.includes({ 'body': updateItem.cleanliness });
              done();
            });
        });
    });

    it('should throw a 422 if item cleanliness is not provided', (done) => {
      chai.request(server)
        .patch('/api/v1/garageItems/1')
        .send()
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
    });
  });

});
