//gameboard iife
//check board space
//gameboard array

//player
//player turn

//game 
//who's turn it is
//win condition

//i'll place checks later

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
    let name = 'None';
    const setName = (player) => name = player;
    const getName = () => name;

    return { id, symbol, setName, getName }
}

function Win(type, row, col) {
    return { type, row, col }
}

function Game() {
    let players = [
        Player(1, 'X'),
        Player(2, 'O')
    ];
    let currentPlayer = players[0];
    const board = Gameboard();
    let win;

    //if horizontal only need to know row
    //if diagonal need to know start left side row and col
    const setWin = (type, row, col) => {
        win = Win(type, row, col);
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
                        setWin(direction, i, -1);
                    }
                    else {
                        setWin(direction, -1, i);
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
            setWin('diagonal', 0, 0);
            return true;
        }
        else if (board.getBoard()[0][2].getSymbol() === getCurrentPlayer().symbol && board.getBoard()[1][1].getSymbol() === getCurrentPlayer().symbol && board.getBoard()[2][0].getSymbol() === getCurrentPlayer().symbol) {
            setWin('diagonal', 2, 0);
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

        if (!(board.getBoard().find(r => r.find(cell => cell.getSymbol() === '')))) {
            console.log('It was a tie!');
            setWin('tie', -1, -1);
            board.printBoard();
            return true;
        }

        if (checkWin()) {
            console.log(`Player ${currentPlayer.id} has won!`);
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

    return { board, playRound, getCurrentPlayer, getWin };
}


const Display = (function() {
    const cellDivs = document.querySelectorAll('.cell');
    const turnDiv = document.querySelector('.turn');
    const nameDiv = turnDiv.querySelector('.name');
    const game = Game();

    const addEvents = () => {
        for (const cell of cellDivs) {
            cell.addEventListener('click', clickCell);
        }
    };

    addEvents();

    function removeEvents() {
        for (const cell of cellDivs) {
            cell.removeEventListener('click', clickCell);
        }
    }

    function clickCell(event) {
        console.log("clicked a cell " + event.target.getAttribute('data-row'));
        const row = parseInt(event.target.getAttribute('data-row'));
        const col = parseInt(event.target.getAttribute('data-col'));
        if (game.playRound(row, col)) {
            removeEvents();
            addWinLine();
        }
        renderGameboard(game.board);
    }

    const renderGameboard = (board) => {

        renderTurn(game.getCurrentPlayer());
        // console.log(cellDivs.length)
        console.log("will display gameboard array");
        //not good
        let count = 0;
        for (let i = 0; i < board.getRows(); i++) {
            for (let j = 0; j < board.getCols(); j++) {
                cellDivs[count].textContent = board.getBoard()[i][j].getSymbol();
                count++;
            }
        }
    };

    const renderTurn = (currentPlayer) => {
        nameDiv.textContent = `Player ${currentPlayer.id}`
    };

    const removeCellHover = () => {

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
        horWinLineDiv.style.animation = 'fadeIn 0.5s';
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
        vertWinLineDiv.style.animation = 'fadeIn 0.5s';
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
        diagWinLineDiv.style.animation = 'fadeIn 0.5s';
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
            
        }
    }

    renderGameboard(game.board);

    return { game, renderGameboard, renderTurn };
    
})();
