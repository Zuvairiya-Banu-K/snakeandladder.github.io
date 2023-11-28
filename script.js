document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const diceResult = document.getElementById('diceResult');
    const playerInfo = document.getElementById('playerInfo');
    const rollDiceButton = document.getElementById('rollDice');
    const startGameButton = document.getElementById('startGame');
    const numPlayersSelect = document.getElementById('numPlayers');
    let currentPlayer = 1;
    let playerPositions = {};
    let numPlayers;
    let playerNames = {};

    const snakes = { 16: 6, 47: 26, 64: 60 };
    const ladders = { 4: 14, 28: 84, 71: 91 };

    startGameButton.addEventListener('click', () => {
        numPlayers = parseInt(numPlayersSelect.value);
        initializeGame();
        createPlayerInputs(numPlayers);
    });

    function initializeGame() {
        gameBoard.innerHTML = '';
        playerPositions = {};

        for (let i = 100; i >= 1; i--) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = 'cell' + i;
            cell.textContent = i;
            gameBoard.appendChild(cell);
        }

        document.getElementById('cell1').classList.add('start-point');
        document.getElementById('cell100').classList.add('winning-point');

        drawSnakesAndLadders();

        for (let i = 1; i <= numPlayers; i++) {
            const player = document.createElement('div');
            player.classList.add('player', 'player' + i);
            document.getElementById('cell1').appendChild(player);
            playerPositions[i] = 1;
        }
    }

    function drawSnakesAndLadders() {
        const svgNS = "http://www.w3.org/2000/svg";
        let svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "500");
        svg.setAttribute("height", "500");
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        gameBoard.appendChild(svg);
    
        Object.entries(snakes).forEach(([start, end]) => {
            drawLine(start, end, svg, svgNS, 'snake');
        });
    
        Object.entries(ladders).forEach(([start, end]) => {
            drawLine(start, end, svg, svgNS, 'ladder');
        });
    }
    
    function drawLine(start, end, svg, svgNS, type) {
        const startCell = document.getElementById('cell' + start);
        const endCell = document.getElementById('cell' + end);
    
        const x1 = startCell.offsetLeft + startCell.offsetWidth / 2;
        const y1 = startCell.offsetTop + startCell.offsetHeight / 2;
        const x2 = endCell.offsetLeft + endCell.offsetWidth / 2;
        const y2 = endCell.offsetTop + endCell.offsetHeight / 2;
    
        let line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", type === 'snake' ? "red" : "green");
        line.setAttribute("stroke-width", 2);
        svg.appendChild(line);
    }
    

    function createPlayerInputs(num) {
        const playerInputDiv = document.getElementById('playerInput');
        playerInputDiv.innerHTML = '';
        for (let i = 1; i <= num; i++) {
            const input = document.createElement('input');
            input.placeholder = `Player ${i} Name`;
            input.id = `playerName${i}`;
            playerInputDiv.appendChild(input);
        }
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Set Names';
        submitButton.onclick = setPlayerNames;
        playerInputDiv.appendChild(submitButton);
    }

    function setPlayerNames() {
        const playerStatusDiv = document.getElementById('playerStatus');
        playerStatusDiv.innerHTML = '<h2>Player Status</h2>';
        const table = document.createElement('table');
        for (let i = 1; i <= numPlayers; i++) {
            playerNames[i] = document.getElementById(`playerName${i}`).value || `Player ${i}`;
            const row = table.insertRow();
            const nameCell = row.insertCell(0);
            const colorCell = row.insertCell(1);
            nameCell.textContent = playerNames[i];
            colorCell.textContent = getPlayerColor(i);
        }
        playerStatusDiv.appendChild(table);
        updateCurrentPlayer();
    }

    function getPlayerColor(playerNumber) {
        switch (playerNumber) {
            case 1: return 'Red';
            case 2: return 'Blue';
            case 3: return 'Green';
            case 4: return 'Yellow';
            default: return 'N/A';
        }
    }

    function updateCurrentPlayer() {
        playerInfo.textContent = `Current Player: ${playerNames[currentPlayer]} (${getPlayerColor(currentPlayer)})`;
    }

    rollDiceButton.addEventListener('click', () => {
        const diceRoll = Math.ceil(Math.random() * 6);
        diceResult.textContent = 'Dice Roll: ' + diceRoll;
        movePlayer(currentPlayer, diceRoll);
        currentPlayer = currentPlayer % numPlayers + 1;
        updateCurrentPlayer();
    });

    function movePlayer(player, steps) {
        let newPosition = playerPositions[player] + steps;
        newPosition = newPosition > 100 ? 100 : newPosition;

        if (snakes[newPosition]) {
            newPosition = snakes[newPosition];
        } else if (ladders[newPosition]) {
            newPosition = ladders[newPosition];
        }

        const playerToken = document.querySelector('.player' + player);
        document.getElementById('cell' + newPosition).appendChild(playerToken);
        playerPositions[player] = newPosition;

        if (newPosition === 100) {
            alert(`${playerNames[player]} wins!`);
            resetGame();
        }
    }

    function resetGame() {
        // Reset the game to its initial state
        // This function needs to be implemented
    }
});
