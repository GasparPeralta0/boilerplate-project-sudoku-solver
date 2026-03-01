class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) return { error: 'Required field missing' };

    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    if (/[^1-9.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, col, value) {
    value = String(value);
    for (let i = 0; i < 9; i++) {
      if (i !== col && puzzleString[row * 9 + i] === value) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, col, value) {
    value = String(value);
    for (let i = 0; i < 9; i++) {
      if (i !== row && puzzleString[i * 9 + col] === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    value = String(value);
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && puzzleString[r * 9 + c] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation !== true) return validation;

    // build grid (0 = empty)
    const grid = puzzleString.split('').map(ch => (ch === '.' ? 0 : parseInt(ch, 10)));

    const rowUsed = Array.from({ length: 9 }, () => new Set());
    const colUsed = Array.from({ length: 9 }, () => new Set());
    const boxUsed = Array.from({ length: 9 }, () => new Set());

    const boxIndex = (r, c) => Math.floor(r / 3) * 3 + Math.floor(c / 3);

    // initialize sets + detect immediate conflicts
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const v = grid[r * 9 + c];
        if (v === 0) continue;

        const b = boxIndex(r, c);
        const s = String(v);

        if (rowUsed[r].has(s) || colUsed[c].has(s) || boxUsed[b].has(s)) {
          return { error: 'Puzzle cannot be solved' };
        }

        rowUsed[r].add(s);
        colUsed[c].add(s);
        boxUsed[b].add(s);
      }
    }

    const candidates = (r, c) => {
      const b = boxIndex(r, c);
      const out = [];
      for (let n = 1; n <= 9; n++) {
        const s = String(n);
        if (!rowUsed[r].has(s) && !colUsed[c].has(s) && !boxUsed[b].has(s)) {
          out.push(s);
        }
      }
      return out;
    };

    const findBestEmpty = () => {
      // MRV: choose empty cell with fewest candidates
      let bestIdx = -1;
      let bestCands = null;

      for (let i = 0; i < 81; i++) {
        if (grid[i] !== 0) continue;
        const r = Math.floor(i / 9);
        const c = i % 9;
        const cands = candidates(r, c);

        if (cands.length === 0) return { idx: i, cands: [] }; // dead end
        if (!bestCands || cands.length < bestCands.length) {
          bestIdx = i;
          bestCands = cands;
          if (bestCands.length === 1) break;
        }
      }

      return { idx: bestIdx, cands: bestCands };
    };

    const backtrack = () => {
      const { idx, cands } = findBestEmpty();
      if (idx === -1) return true; // solved
      if (!cands || cands.length === 0) return false;

      const r = Math.floor(idx / 9);
      const c = idx % 9;
      const b = boxIndex(r, c);

      for (const s of cands) {
        grid[idx] = parseInt(s, 10);
        rowUsed[r].add(s);
        colUsed[c].add(s);
        boxUsed[b].add(s);

        if (backtrack()) return true;

        // undo
        grid[idx] = 0;
        rowUsed[r].delete(s);
        colUsed[c].delete(s);
        boxUsed[b].delete(s);
      }

      return false;
    };

    if (!backtrack()) {
      return { error: 'Puzzle cannot be solved' };
    }

    return { solution: grid.map(v => String(v)).join('') };
  }
}

 module.exports = SudokuSolver;