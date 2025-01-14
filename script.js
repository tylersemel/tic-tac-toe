function Gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];

    const getRows = () => rows;
    const getCols = () => cols;

    const addCells = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < cols; j++) {
                board[i].push(Cell());
            }
        }
    };

    addCells();

    const getBoard = () => board;

    const placeSymbol = (row, col, symbol) => {
        if (row == null || col == null) {
            return false;
        }
        if ((row < 0 || row >= rows) || (col < 0 || col >= cols)) {
            console.log("Enter a valid row and column.");
            return false;
        }
        if (board[row][col].getSymbol() !== 'X' && board[row][col].getSymbol() !== 'O') {
            board[row][col].setSymbol(symbol);
            return true;
        }

        console.log("Enter a valid row and column.");
        return false;
    };

    //for debugging
    const printBoard = () => {
        let str = "  0 1 2\n";

        for (let i = 0; i < rows; i++) {
            str += i.toString() + ' ' + board[i].map(cell => cell.getSymbol()).join(' ');
            str += '\n';
        }

        console.log(str);
    };

    return { getBoard, placeSymbol, printBoard, getRows, getCols };
}

function Cell() {
    let symbol = '';

    const setSymbol = (val) => symbol = val;
    const getSymbol = () => symbol;

    return { setSymbol, getSymbol };
}

function Player(id, symbol) {
    const color = id === 1 ? 'red' : 'blue';

    let name = 'None';
    const setName = (player) => name = player;
    const getName = () => name;

    return { id, symbol, color, setName, getName };
}

function Win(type, row, col, player) {
    return { type, row, col, player };
}

function Game() {
    let players = [
        Player(1, 'X'),
        Player(2, 'O')
    ];
    let currentPlayer = players[0];
    const board = Gameboard();
    let win;

    const getPlayers = () => players;

    //if horizontal only need to know row
    //if diagonal need to know start left side row and col
    const setWin = (type, row, col, player) => {
        win = Win(type, row, col, player);
    }

    const getWin = () => win;

    const checkStraight = (direction) => {
        let outerLength = board.getRows();
        let innerLength = board.getCols();
        
        if (direction === 'vertical') {
            outerLength = board.getCols();
            innerLength = board.getRows();
        }

        let count = 0;
        
        for (let i = 0; i < outerLength; i++) {
            for (let j = 0; j < innerLength; j++) {
                if (direction === 'horizontal') {
                    if (board.getBoard()[i][j].getSymbol() === getCurrentPlayer().symbol) {
                        count++;
                    }
                }
                else {
                    if (board.getBoard()[j][i].getSymbol() === getCurrentPlayer().symbol) {
                        count++;
                    }
                }

                if (count === 3) {
                    if (direction === 'horizontal') {
                        
                        setWin(direction, i, -1, getCurrentPlayer());
                    }
                    else {
                        setWin(direction, -1, i, getCurrentPlayer());
                    }

                    return true;
                }

            }

            count = 0;
        }

        return false;
    };

    const checkDiagonal = () => {
        if (board.getBoard()[0][0].getSymbol() === getCurrentPlayer().symbol && board.getBoard()[1][1].getSymbol() === getCurrentPlayer().symbol && board.getBoard()[2][2].getSymbol() === getCurrentPlayer().symbol) {
            setWin('diagonal', 0, 0, getCurrentPlayer());
            return true;
        }
        else if (board.getBoard()[0][2].getSymbol() === getCurrentPlayer().symbol && board.getBoard()[1][1].getSymbol() === getCurrentPlayer().symbol && board.getBoard()[2][0].getSymbol() === getCurrentPlayer().symbol) {
            setWin('diagonal', 2, 0, getCurrentPlayer());
            return true;
        }
        
        return false;
    }

    const checkWin = () => {
        if (checkStraight('horizontal')) {
            return true;
        }
        else if (checkStraight('vertical')) {
            return true;
        }
        
        return checkDiagonal();
    };

    const switchCurrentPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const getCurrentPlayer = () => currentPlayer;

    /**
     * Plays a round of Tic Tac Toe.
     * 
     * @param {number} row - The row to place the symbol in the board array.
     * @param {number} col - The column to place the symbol in the board array.
     * @returns {boolean} True if the game is over (tie or win) and false if not.
     */
    const playRound = (row, col) => {
        if (!board.placeSymbol(row, col, getCurrentPlayer().symbol)) {
            return false;
        }

        if (checkWin()) {
            console.log(`Player ${currentPlayer.id} has won!`);
            board.printBoard();
            return true;
        }

        if (!(board.getBoard().find(r => r.find(cell => cell.getSymbol() === '')))) {
            console.log('It was a tie!');
            setWin('tie', -1, -1);
            board.printBoard();
            return true;
        }

        board.printBoard();

        switchCurrentPlayer();
        console.log(`Player ${getCurrentPlayer().id}'s turn:`);
        return false;
    };

    const start = () => {
        board.printBoard();
        console.log("Enter a row and a column number with Game.playRound(row, col)");
        console.log(`Player ${getCurrentPlayer().id}'s turn:`);
    };

    start();

    return { board, playRound, getCurrentPlayer, getWin, getPlayers, switchCurrentPlayer };
}


const Display = (function() {
    const cellDivs = document.querySelectorAll('.cell');
    const game = Game();
    const startForm = document.querySelector('form');
    const startDialog = document.querySelector('#start-modal');
    const restartBtn = document.querySelector('.restart');
    let winLine;

    const start = () => {
        // startDialog.showModal();
        attachSpans(game.board);
        displayTurn(game.getCurrentPlayer());
    }

    const attachSpans = (board) => {
        let count = 0;
        for (let i = 0; i < board.getRows(); i++) {
            for (let j = 0; j < board.getCols(); j++) {
                let cellSpan = document.createElement('span');
                cellDivs[count].appendChild(cellSpan);
                count++;
            }
        }
    }

    startForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(startForm);

        setPlayers(game.getPlayers(), [formData.get('player-one'), formData.get('player-two')]);
        displayPlayers();
        startDialog.close();
    });

    restartBtn.addEventListener('click', (e) => {
        for (let i = 0; i < game.board.getRows(); i++) {
            for (let j = 0; j < game.board.getCols(); j++) {
                game.board.getBoard()[i][j].setSymbol('');
                renderGameboard(i, j);
            }
        }

        if (winLine) {
            winLine.style.visibility = 'hidden';
        }
        if (game.getCurrentPlayer().id !== 1) {
            game.switchCurrentPlayer();
        }

        removeEvents();
        addEvents();
        displayTurn(game.getCurrentPlayer());
    });

    const setPlayers = (players, names) => {
        players[0].setName(names[0]);
        players[1].setName(names[1]);
    }

    const displayPlayers = () => {
        const playerOne = document.querySelector('.p1');
        const playerTwo = document.querySelector('.p2');

        playerOne.textContent = game.getPlayers()[0].getName();
        playerTwo.textContent = game.getPlayers()[1].getName();
    }

    const addEvents = () => {
        for (const cell of cellDivs) {
            cell.addEventListener('click', clickCell);
            cell.addEventListener('mouseover', hoverOnCell);
            cell.addEventListener('mouseout', hoverOutCell);
            cell.style.cursor = 'pointer';
        }
    };

    addEvents();

    function hoverOnCell(event) {
        let cellSpan = event.target.querySelector('span');
        cellSpan.textContent = game.getCurrentPlayer().symbol;
        cellSpan.style.color = game.getCurrentPlayer().color;
        cellSpan.style.opacity = 0.5;
    }

    function hoverOutCell(event) {
        let cellSpan = event.target.querySelector('span');
        cellSpan.textContent = '';
        cellSpan.style.color = 'rgb(227, 249, 255)';
        cellSpan.style.opacity = 1;
    }

    function removeEvents() {
        for (const cell of cellDivs) {
            cell.removeEventListener('click', clickCell);
            cell.removeEventListener('mouseover', hoverOnCell);
            cell.removeEventListener('mouseout', hoverOutCell);
            cell.style.cursor = 'default';
        }
    }

    function clickCell(event) {
        console.log("clicked a cell " + event.target.getAttribute('data-row'));
        const row = parseInt(event.target.getAttribute('data-row'));
        const col = parseInt(event.target.getAttribute('data-col'));
        if (game.playRound(row, col)) {
            displayWin();
            addWinLine();
            removeEvents();
        }
        else {
            displayTurn(game.getCurrentPlayer());
        }

        renderGameboard(row, col);
    }

    const renderGameboard = (row, col) => {        
        const cell = game.board.getBoard()[row][col];
        const idx = row * game.board.getRows() + col;
        const symbol = cell.getSymbol();
        const cellSpan = cellDivs[idx].querySelector('span');

        cellSpan.textContent = symbol;
        cellSpan.style.color = symbol === 'X' ? 'red' : 'blue';
        cellSpan.style.opacity = 1;

        cellDivs[idx].removeEventListener('mouseover', hoverOnCell);
        cellDivs[idx].removeEventListener('mouseout', hoverOutCell);
        cellDivs[idx].style.cursor = 'default';

    };

    const displayWin = () => {
        const turnDiv = document.querySelector('.turn');
        const nameDiv = turnDiv.querySelector('.player');
        if (game.getWin().type === 'tie') {
            nameDiv.textContent = 'It was a tie!';
        }
        else {
            console.log(game.getWin().player.getName());
            nameDiv.textContent = `${game.getWin().player.getName()} won!`;
        }
    };

    const displayTurn = (currentPlayer) => {
        const turnDiv = document.querySelector('.turn');
        const nameDiv = turnDiv.querySelector('.player');
        nameDiv.textContent = `Player ${currentPlayer.id}'s turn!`;
        nameDiv.style.color = currentPlayer.color;
    };

    const setHorizontalLine = () => {
        const horWinLineDiv = document.querySelector('.horizontal');
        
        const horTopTop = '-140px';
        const horMiddleTop = '30px';
        const horBotTop = '200px';

        if (game.getWin().row === 0) {
            horWinLineDiv.style.top = horTopTop;
        }
        else if (game.getWin().row === 1) {
            horWinLineDiv.style.top = horMiddleTop;
        }
        else {
            horWinLineDiv.style.top = horBotTop;
        }

        horWinLineDiv.style.visibility = 'visible';
        horWinLineDiv.style.backgroundColor = game.getCurrentPlayer().color;
        horWinLineDiv.style.animation = 'fadeIn 0.5s';
        winLine = horWinLineDiv;
    };

    const setVerticalLine = () => {
        const vertWinLineDiv = document.querySelector('.vertical');

        const verticalLeftLeft = '70px';
        const verticalMiddleLeft = '240px';
        const verticalRightLeft = '410px';

        if (game.getWin().col === 0) {
            vertWinLineDiv.style.left = verticalLeftLeft;
        }
        else if (game.getWin().col === 1) {
            vertWinLineDiv.style.left = verticalMiddleLeft;
        }
        else {
            vertWinLineDiv.style.left = verticalRightLeft;
        }

        vertWinLineDiv.style.visibility = 'visible';
        vertWinLineDiv.style.backgroundColor = game.getCurrentPlayer().color;
        vertWinLineDiv.style.animation = 'fadeIn 0.5s';
        winLine = vertWinLineDiv;
    };

    const setDiagonalLine = () => {
        const diagWinLineDiv = document.querySelector('.diagonal');

        const topLeftDiagonalDeg = 'rotate(-45deg)';
        const botLeftDiagonalDeg = 'rotate(45deg)';

        if (game.getWin().row === 0) {
            diagWinLineDiv.style.transform = topLeftDiagonalDeg;
        }
        else {
            diagWinLineDiv.style.transform = botLeftDiagonalDeg;
        }

        diagWinLineDiv.style.visibility = 'visible';
        diagWinLineDiv.style.backgroundColor = game.getWin().player.color;
        diagWinLineDiv.style.animation = 'fadeIn 0.5s';
        winLine = diagWinLineDiv;
    }

    const addWinLine = () => {
        //so 3 types of line
        if (game.getWin().type === 'horizontal') {
            setHorizontalLine();
        }
        else if (game.getWin().type === 'vertical') {
            setVerticalLine();
        }
        else if (game.getWin().type === 'diagonal') {
            setDiagonalLine();
        }
        else {
            const tie = document.querySelector('.tie');

            tie.style.visibility = 'visible';
            winLine = tie;
        }
    }
    start();

    return { game, renderGameboard, displayTurn };
    
})();
