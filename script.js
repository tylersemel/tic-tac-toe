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
            ['_','_','_'],
            ['_','_','_'],
        ];

        //so other modules cannot modify the board directly
        const getBoardPiece = (row, col) => {
            const coord = board[row][col];
            return coord;
        }

        const placePiece = (row, col, piece) => {
            if (row == null || col == null) {
                return false;
            }
            if ((row < 0 || row > 2) || (col < 0 || col > 2)) {
                console.log("Enter a valid row and column.");
                return false;
            }
            if (board[row][col] !== 'X' && board[row][col] !== 'O') {
                board[row][col] = piece;
                return true;
            }

            console.log("Enter a valid row and column.");
            return false;
        };

        //for debugging
        const printBoard = () => {
            let str = "  0 1 2";
            for (let row = 0; row < 3; row++) {
                str += "\n";
                str += row + " ";
                str += board[row][0] + " ";
                str += board[row][1] + " ";
                str += board[row][2] + " ";
            }
            console.log(str);
        };

        return { getBoardPiece, placePiece, printBoard };
    })();

    const start = () => {
        players.push(createPlayer(1));
        players.push(createPlayer(2));
        currentPlayer = players[0];
        // gameOver = true;

        while (!gameOver) {
            Gameboard.printBoard();
            let row = prompt("Enter a row: ");
            let col = prompt("Enter a col: ");
            
            let isPlaced = Gameboard.placePiece(row, col, currentPlayer.piece);

            while (!isPlaced) {
                row = prompt("Enter a row: ");
                col = prompt("Enter a col: ");
                isPlaced = Gameboard.placePiece(row, col, currentPlayer.piece);
            }

            console.log(' ');
            gameOver = currentPlayer.checkWin();

            if (gameOver) {
                Gameboard.printBoard();
                console.log(`Winner is Player ${currentPlayer.id}`);
                return;
            }

            currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        }
    };


    return { start, players, Gameboard };
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

Game.start();
