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
            str += i.toString() + ' ' + board[i].map(cell => cell.getSymbol()).join(' ')
            str += '\n';
        }

        console.log(str);
    };

    return { getBoard, placeSymbol, printBoard, getRows, getCols };
}

function Cell() {
    let symbol = '_';

    const setSymbol = (val) => symbol = val;
    const getSymbol = () => symbol;

    return { setSymbol, getSymbol };
}

const Game = (function () {
    let players = [
        {   id: 1,
            symbol: 'X'
        },
        {
            id: 2,
            symbol: 'O'
        },
    ];
    let currentPlayer = players[0];
    const board = Gameboard();
    let gameOver = false;

    const test = () => {
        console.log(board.getBoard()[0][0] instanceof Cell);
        let cell = Cell();

        cell.setSymbol('Y');

        console.log(cell.getSymbol());
    }

    const checkWin = () => {
        let count = 0;
        //check row
        for (let row = 0; row < board.getRows(); row++) {
            for (let col = 0; col < board.getCols(); col++) {
                if (board.getBoard()[row][col].getSymbol() === getCurrentPlayer().symbol) {
                    count++;
                }
                if (count === 3) {
                    return true;
                }

            }

            count = 0;
        }

        //check col
        for (let col = 0; col < board.getCols(); col++) {
            for (let row = 0; row < board.getRows(); row++) {
                if (board.getBoard()[row][col].getSymbol() === getCurrentPlayer().symbol) {
                    count++;
                }
                if (count === 3) {
                    return true;
                }

            }

            count = 0;
        }

        //top left to bottom right diagonal
        if (board.getBoard()[0][0].getSymbol() === getCurrentPlayer().symbol && board.getBoard()[1][1].getSymbol() === getCurrentPlayer().symbol && board.getBoard()[2][2].getSymbol() === getCurrentPlayer().symbol ||
            board.getBoard()[0][2].getSymbol() === getCurrentPlayer().symbol && board.getBoard()[1][1].getSymbol() === getCurrentPlayer().symbol && board.getBoard()[2][0].getSymbol() === getCurrentPlayer().symbol) {
            return true;
        }

        return false;
    };

    const switchCurrentPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const getCurrentPlayer = () => currentPlayer;

    const playRound = (row, col) => {
        board.placeSymbol(row, col, getCurrentPlayer().symbol);

        if (!(board.getBoard().find(r => r.find(cell => cell.getSymbol() === '_')))) {
            console.log('It was a tie!');

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

    
    return { start, playRound, getCurrentPlayer };
})();


// Game.start();