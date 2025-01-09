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

    return { getBoard, placeSymbol, printBoard };
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
        for (let row = 0; row < board.getBoard().length; row++) {
            for (let col = 0; col < board.getBoard()[row].length; col++) {
                if (board.getBoard()[row][col].getSymbol() === currentPlayer.symbol) {
                    count++;
                }
                if (count === 3) {
                    return true;
                }

            }

            count = 0;
        }

        //check col
        for (let col = 0; col < board.getBoard()[0].length; col++) {
            for (let row = 0; row < board.getBoard().length; row++) {
                if (board.getBoard()[row][col].getSymbol() === currentPlayer.symbol) {
                    count++;
                }
                if (count === 3) {
                    return true;
                }

            }

            count = 0;
        }

        //check diagonal
        // if ((Game.Gameboard.getBoardPiece(0, 0) === piece && Game.Gameboard.getBoardPiece(1, 1) === piece && Game.Gameboard.getBoardPiece(2, 2) === piece) ||
        //     (Game.Gameboard.getBoardPiece(0, 2) === piece && Game.Gameboard.getBoardPiece(1, 1) === piece && Game.Gameboard.getBoardPiece(2, 0) === piece)) {
        //     return true;
        // }

        return false;
    };

    const switchCurrentPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const getCurrentPlayer = () => currentPlayer;

    const playRound = () => {
        let isPlaced = false;

        while (!isPlaced) {
            row = Number(prompt("Enter a row: "));
            col = Number(prompt("Enter a col: "));
            isPlaced = board.placeSymbol(row, col, getCurrentPlayer().symbol);
        }

        // if (checkWin()) {
        //     console.log(`Player ${currentPlayer.id} has won!`);
        //     return true;
        // }

        board.printBoard();

        return false;
    };

    const start = () => {
        board.printBoard();

        while (!gameOver) {
            gameOver = playRound();
            switchCurrentPlayer();
            gameOver = true;
        }
    };

    
    return { start, test, getCurrentPlayer };
})();

function createPlayer(id) {
    let piece = id === 1 ? 'X' : 'O';

    const checkWin = () => {
        let count = 0;
        //check row
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (Game.Gameboard.getBoardPiece(row, col) === piece) {
                    count++;
                }
                if (count === 3) {
                    return true;
                }

            }

            count = 0;
        }

        //check col
        for (let col = 0; col < 3; col++) {
            for (let row = 0; row < 3; row++) {
                if (Game.Gameboard.getBoardPiece(row, col) === piece) {
                    count++;
                }
                if (count === 3) {
                    return true;
                }

            }

            count = 0;
        }

        //check diagonal
        if ((Game.Gameboard.getBoardPiece(0, 0) === piece && Game.Gameboard.getBoardPiece(1, 1) === piece && Game.Gameboard.getBoardPiece(2, 2) === piece) ||
            (Game.Gameboard.getBoardPiece(0, 2) === piece && Game.Gameboard.getBoardPiece(1, 1) === piece && Game.Gameboard.getBoardPiece(2, 0) === piece)) {
            return true;
        }

        return false;
    }

    return { id, piece, checkWin };
}

Game.test();
Game.start();