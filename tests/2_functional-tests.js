const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);
const assert = chai.assert;

suite('Functional Tests', () => {

  const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const solvedPuzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

  test('Solve a puzzle with valid puzzle string: POST /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { solution: solvedPuzzle });
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Required field missing' });
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzle.replace('.', 'X') })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '123' })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST /api/solve', (done) => {
    // same puzzle but with a contradiction
    const bad = validPuzzle.replace('.', '1'); // introduces conflict
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: bad })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.deepEqual(res.body, { valid: true });
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: '1' })
      .end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.isArray(res.body.conflict);
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'B2', value: '5' })
      .end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.isArray(res.body.conflict);
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST /api/check', (done) => {
    // Choose a coordinate likely to hit row+col+region conflicts.
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: '5' })
      .end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.isArray(res.body.conflict);
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2' })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle.replace('.', 'X'), coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '123', coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  test('Check a puzzle placement with invalid coordinate: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'Z9', value: '3' })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid coordinate' });
        done();
      });
  });

  test('Check a puzzle placement with invalid value: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A2', value: '0' })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid value' });
        done();
      });
  });

});