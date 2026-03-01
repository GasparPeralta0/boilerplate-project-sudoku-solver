const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');

suite('Unit Tests', () => {

  let solver = new Solver();

  test('Logic handles a valid puzzle string of 81 characters', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3....9..5.....1..3.8.29.63..5.5..7.1';
    assert.equal(solver.validate(puzzle), true);
  });

  test('Logic handles a puzzle string with invalid characters', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.36X4.3....9..5.....1..3.8.29.63..5.5..7.1';
    assert.property(solver.validate(puzzle), 'error');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const puzzle = '123';
    assert.property(solver.validate(puzzle), 'error');
  });

  test('Valid row placement', () => {
    const puzzle = '.'.repeat(81);
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 0, 5));
  });

  test('Invalid row placement', () => {
    const puzzle = '5' + '.'.repeat(80);
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 1, 5));
  });

  test('Valid column placement', () => {
    const puzzle = '.'.repeat(81);
    assert.isTrue(solver.checkColPlacement(puzzle, 0, 0, 5));
  });

  test('Invalid column placement', () => {
    let puzzle = '.'.repeat(81).split('');
    puzzle[9] = '5';
    puzzle = puzzle.join('');
    assert.isFalse(solver.checkColPlacement(puzzle, 0, 0, 5));
  });

  test('Valid region placement', () => {
    const puzzle = '.'.repeat(81);
    assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 0, 5));
  });

  test('Invalid region placement', () => {
    let puzzle = '.'.repeat(81).split('');
    puzzle[1] = '5';
    puzzle = puzzle.join('');
    assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 0, 5));
  });

  test('Valid puzzle strings pass the solver', () => {
    const puzzle = '.'.repeat(81);
    assert.property(solver.solve(puzzle), 'solution');
  });

  test('Invalid puzzle strings fail the solver', () => {
    const puzzle = '123';
    assert.property(solver.solve(puzzle), 'error');
  });

});