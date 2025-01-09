//gameboard iife
//check board space
//gameboard array

//player
//player turn

//game 
//who's turn it is
//win condition

//i'll place checks later

const Game = (function () {
    let currentPlayer;
    let gameOver = false;
    let players = [];
    const Gameboard = (function () {
        const board = [
            ['_','_','_'],
            ['_','-','_'],
            ['_','_','_'],
        ];

        const placePiece = (row, col, piece) => {
            board[row][col] = piece;
        };

        const printBoard = () => {
            for (let row = 0; row < 3; row++) {
                console.log(board[row][0], board[row][1], board[row][2]);
            }
        }

        return { board, placePiece, printBoard };
    })();

    const start = () => {
        players.push(createPlayer(1));
        players.push(createPlayer(2));
        currentPlayer = players[0];
        let count = 0;

        while (!gameOver) {
            Gameboard.printBoard();
            let row = prompt("Enter a row: ");
            let col = prompt("Enter a col: ");

            // let coord = createCoord(row, col);
            Gameboard.placePiece(row, col, currentPlayer.symbol);
            Gameboard.printBoard();

            gameOver = currentPlayer.checkWin();

            if (gameOver) {
                console.log(`Winner is Player ${currentPlayer.id}`);
                return;
            }

            currentPlayer = currentPlayer === players[0] ? players[1] : players[0];

            count++;

            gameOver = count === 5 ? true : false;
        }
    };


    return { start, players, Gameboard };
})();

function createCoord(row, col) {
    return { row, col };
}

// function createPlayer(id) {
//     const moves = [];

//     const getMoves = () => {
//         return moves;
//     };

//     const placeMove = (coord) => {
//         moves.push(coord);
//     }

//     return { getMoves };
// }

function createPlayer(id) {
    let symbol = id === 1 ? 'X' : 'O';
    const checkWin = () => {
        let count = 0;
        //check row
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (Game.Gameboard.board[row][col] === symbol) {
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
                if (Game.Gameboard.board[row][col] === symbol) {
                    count++;
                }
                if (count === 3) {
                    return true;
                }

            }

            count = 0;
        }

        //check diagonal
        if ((Game.Gameboard.board[0][0] === symbol && Game.Gameboard.board[1][1] === symbol && Game.Gameboard.board[2][2] === symbol) ||
            (Game.Gameboard.board[0][2] === symbol && Game.Gameboard.board[1][1] === symbol && Game.Gameboard.board[2][0] === symbol)) {
            return true;
        }

        return false;
    }

    return { id, symbol, checkWin };
}

Game.start();
