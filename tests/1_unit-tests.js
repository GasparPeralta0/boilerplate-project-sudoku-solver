const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');

suite('Unit Tests', () => {

  const solver = new Solver();

  const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const solvedPuzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.equal(solver.validate(validPuzzle), true);
  });

  test('Logic handles a puzzle string with invalid characters', () => {
    const puzzle = validPuzzle.replace('.', 'X');
    assert.deepEqual(solver.validate(puzzle), { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.deepEqual(solver.validate('123'), { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, 1, '3'));
  });

  test('Logic handles an invalid row placement', () => {
    // Row A already has a 1 at col 0
    assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, 1, '1'));
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(validPuzzle, 0, 1, '3'));
  });

  test('Logic handles an invalid column placement', () => {
    // Column 1 already has a 6 at row 5 (example conflict)
    assert.isFalse(solver.checkColPlacement(validPuzzle, 0, 1, '6'));
  });

  test('Logic handles a valid region placement', () => {
    assert.isTrue(solver.checkRegionPlacement(validPuzzle, 0, 1, '3'));
  });

  test('Logic handles an invalid region placement', () => {
    // Top-left region already contains 5 at A3 (index 2)
    assert.isFalse(solver.checkRegionPlacement(validPuzzle, 0, 1, '5'));
  });

  test('Valid puzzle strings pass the solver', () => {
    const res = solver.solve(validPuzzle);
    assert.property(res, 'solution');
  });

  test('Invalid puzzle strings fail the solver', () => {
    const res = solver.solve('123');
    assert.property(res, 'error');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const res = solver.solve(validPuzzle);
    assert.equal(res.solution, solvedPuzzle);
  });

});