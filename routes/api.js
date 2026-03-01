'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  const solver = new SudokuSolver();

  app.route('/api/solve')
    .post((req, res) => {

      const puzzle = req.body.puzzle;

      if (puzzle === undefined) {
        return res.json({ error: 'Required field missing' });
      }

     console.log("PUZZLE RECIBIDO:", puzzle);
     console.log("LENGTH:", puzzle.length);

     const result = solver.solve(puzzle);
     console.log("RESULTADO:", result);

      return res.json(result);
    });

  app.route('/api/check')
    .post((req, res) => {

      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const validation = solver.validate(puzzle);
      if (validation !== true) {
        return res.json(validation);
      }

      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const row = coordinate.charCodeAt(0) - 65;
      const col = parseInt(coordinate[1]) - 1;

      const rowValid = solver.checkRowPlacement(puzzle, row, col, value);
      const colValid = solver.checkColPlacement(puzzle, row, col, value);
      const regionValid = solver.checkRegionPlacement(puzzle, row, col, value);

      if (puzzle[row * 9 + col] === value) {
        return res.json({ valid: true });
      }

      let conflicts = [];
      if (!rowValid) conflicts.push('row');
      if (!colValid) conflicts.push('column');
      if (!regionValid) conflicts.push('region');

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      return res.json({ valid: true });
    });

};