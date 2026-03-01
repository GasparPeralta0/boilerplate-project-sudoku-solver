const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);
const assert = chai.assert;

suite('Functional Tests', () => {

  // ✅ Puzzle válido y resoluble (sale de controllers/puzzle-strings.js)
  const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

  test('Solve a puzzle with valid puzzle string', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle })
      .end((err, res) => {
        assert.property(res.body, 'solution');
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.property(res.body, 'error');
        done();
      });
  });

});