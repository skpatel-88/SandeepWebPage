// Keep the footer copyright year current automatically
document.querySelectorAll('.copyright').forEach((el) => {
  el.textContent = el.textContent.replace(/©\s*\d{4}/, `© ${new Date().getFullYear()}`);
});

// Tic Tac Toe: human (X) vs computer (O)
(() => {
  const board = document.getElementById('tttBoard');
  const statusEl = document.getElementById('tttStatus');
  const resetBtn = document.getElementById('tttReset');
  if (!board || !statusEl || !resetBtn) return;

  const cells = [...board.querySelectorAll('.ttt-cell')];
  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  let cellValues = Array(9).fill(null);
  let gameOver = false;

  const getWinner = (values) => {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (values[a] && values[a] === values[b] && values[a] === values[c]) {
        return { player: values[a], line };
      }
    }
    return null;
  };

  const pickComputerMove = (values) => {
    const empty = values.map((v, i) => (v ? null : i)).filter((i) => i !== null);
    // Win if possible, otherwise block the human's winning move.
    for (const player of ['O', 'X']) {
      for (const i of empty) {
        const copy = [...values];
        copy[i] = player;
        if (getWinner(copy)) return i;
      }
    }
    if (!values[4]) return 4;
    const corners = [0, 2, 6, 8].filter((i) => !values[i]);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    return empty[Math.floor(Math.random() * empty.length)];
  };

  const endGame = (message) => {
    gameOver = true;
    statusEl.textContent = message;
    cells.forEach((cell) => { cell.disabled = true; });
  };

  const computerTurn = () => {
    const move = pickComputerMove(cellValues);
    if (move === undefined) return;
    cellValues[move] = 'O';
    cells[move].textContent = 'O';

    const result = getWinner(cellValues);
    if (result) {
      result.line.forEach((i) => cells[i].classList.add('win'));
      endGame('Computer wins! 🤖');
      return;
    }
    if (cellValues.every(Boolean)) {
      endGame("It's a draw! 🤝");
      return;
    }
    statusEl.textContent = 'Your turn (X)';
  };

  const handleCellClick = (event) => {
    const index = Number(event.currentTarget.dataset.index);
    if (gameOver || cellValues[index]) return;

    cellValues[index] = 'X';
    event.currentTarget.textContent = 'X';

    const result = getWinner(cellValues);
    if (result) {
      result.line.forEach((i) => cells[i].classList.add('win'));
      endGame('You win! 🎉');
      return;
    }
    if (cellValues.every(Boolean)) {
      endGame("It's a draw! 🤝");
      return;
    }
    statusEl.textContent = "Computer's turn...";
    setTimeout(computerTurn, 350);
  };

  const resetGame = () => {
    cellValues = Array(9).fill(null);
    gameOver = false;
    statusEl.textContent = 'Your turn (X)';
    cells.forEach((cell) => {
      cell.textContent = '';
      cell.disabled = false;
      cell.classList.remove('win');
    });
  };

  cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
  resetBtn.addEventListener('click', resetGame);
})();
