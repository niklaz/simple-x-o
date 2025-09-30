class XOGame {
    constructor() {
        this.boardSize = 3;
        this.board = Array(this.boardSize * this.boardSize).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        this.gameStartTime = null;
        this.timerInterval = null;
        this.gameTime = 0;
        
        this.winningCombinations = this.generateWinningCombinations(this.boardSize);
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadGameState();
        this.loadDarkModePreference();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.cells = document.querySelectorAll('.cell');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.gameTimerDisplay = document.getElementById('gameTimer');
        this.scoreXDisplay = document.getElementById('scoreX');
        this.scoreODisplay = document.getElementById('scoreO');
        this.resetBtn = document.getElementById('resetBtn');
        this.clearScoreBtn = document.getElementById('clearScoreBtn');
        this.clearAllDataBtn = document.getElementById('clearAllDataBtn');
        this.boardSizeSelect = document.getElementById('boardSize');
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.gameOverMessage = document.getElementById('gameOverMessage');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        
        // Validate that all required elements exist
        if (!this.cells.length || !this.currentPlayerDisplay || !this.gameTimerDisplay || !this.scoreXDisplay || 
            !this.scoreODisplay || !this.resetBtn || !this.clearScoreBtn || 
            !this.clearAllDataBtn || !this.boardSizeSelect || !this.darkModeToggle || !this.gameOverModal || !this.gameOverMessage || !this.playAgainBtn) {
            console.error('Required game elements not found in DOM');
            return;
        }
    }
    
    attachEventListeners() {
        // Cell click events
        this.cells.forEach((cell, index) => {
            const handleCellInteraction = (e) => {
                e.preventDefault();
                this.handleCellClick(index);
                // Add haptic feedback for mobile
                if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                }
            };
            
            cell.addEventListener('click', handleCellInteraction);
            cell.addEventListener('touchstart', handleCellInteraction);
        });
        
        // Button events
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.clearScoreBtn.addEventListener('click', () => this.clearScores());
        this.clearAllDataBtn.addEventListener('click', () => this.clearAllData());
        this.boardSizeSelect.addEventListener('change', () => this.changeBoardSize());
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        
        // Modal click outside to close
        this.gameOverModal.addEventListener('click', (e) => {
            if (e.target === this.gameOverModal) {
                this.closeModal();
            }
        });
    }
    
    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '') {
            return;
        }
        
        this.makeMove(index);
    }
    
    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.updateCell(index);
        
        // Start timer on first move
        if (this.gameTime === 0 && !this.gameStartTime) {
            this.startTimer();
        }
        
        this.saveGameState(); // Save after each move
        
        if (this.checkWin()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            this.switchPlayer();
        }
    }
    
    updateCell(index) {
        const cell = this.cells[index];
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());
        
        // Add visual feedback
        cell.style.transform = 'scale(0.8)';
        setTimeout(() => {
            cell.style.transform = 'scale(1)';
        }, 100);
    }
    
    checkWin() {
        return this.winningCombinations.some(combination => {
            const [a, b, c] = combination;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.highlightWinningCells(combination);
                return true;
            }
            return false;
        });
    }
    
    highlightWinningCells(combination) {
        combination.forEach(index => {
            this.cells[index].classList.add('winning');
        });
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    handleWin() {
        this.gameActive = false;
        this.stopTimer();
        this.scores[this.currentPlayer]++;
        this.updateScores();
        this.saveGameState(); // Save after win
        this.showGameOver(`${this.currentPlayer} Wins!`);
    }
    
    handleDraw() {
        this.gameActive = false;
        this.stopTimer();
        this.saveGameState(); // Save after draw
        this.showGameOver("It's a Draw!");
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
        this.saveGameState(); // Save after switching players
    }
    
    updateDisplay() {
        this.currentPlayerDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
    }
    
    updateScores() {
        this.scoreXDisplay.textContent = this.scores.X;
        this.scoreODisplay.textContent = this.scores.O;
    }
    
    showGameOver(message) {
        this.gameOverMessage.textContent = message;
        this.gameOverModal.classList.add('show');
    }
    
    closeModal() {
        this.gameOverModal.classList.remove('show');
    }
    
    resetGame() {
        this.board = Array(this.boardSize * this.boardSize).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.resetTimer();
        
        // Clear all cells
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
            cell.style.transform = '';
        });
        
        this.updateDisplay();
        this.closeModal();
        this.saveGameState(); // Save after reset
    }
    
    clearScores() {
        this.scores = { X: 0, O: 0 };
        this.updateScores();
        this.saveGameState();
    }
    
    // localStorage methods for persistence
    saveGameState() {
        const gameState = {
            board: this.board,
            currentPlayer: this.currentPlayer,
            gameActive: this.gameActive,
            scores: this.scores,
            gameTime: this.gameTime,
            gameStartTime: this.gameStartTime,
            boardSize: this.boardSize
        };
        localStorage.setItem('xoGameState', JSON.stringify(gameState));
    }
    
    loadGameState() {
        try {
            const savedState = localStorage.getItem('xoGameState');
            if (savedState) {
                const gameState = JSON.parse(savedState);
                this.boardSize = gameState.boardSize || 3;
                this.board = gameState.board || Array(this.boardSize * this.boardSize).fill('');
                this.currentPlayer = gameState.currentPlayer || 'X';
                this.gameActive = gameState.gameActive !== undefined ? gameState.gameActive : true;
                this.scores = gameState.scores || { X: 0, O: 0 };
                this.gameTime = gameState.gameTime || 0;
                this.gameStartTime = gameState.gameStartTime || null;
                
                // Update board size selector
                this.boardSizeSelect.value = this.boardSize;
                
                // Regenerate winning combinations for the saved board size
                this.winningCombinations = this.generateWinningCombinations(this.boardSize);
                
                // Create board if size changed
                if (this.boardSize !== 3) {
                    this.createBoard();
                }
                
                // Restore the visual state of the board
                this.restoreBoardVisuals();
                this.updateScores();
                this.displayTimer();
                
                // Resume timer if game is active and timer was running
                if (this.gameActive && this.gameStartTime && this.gameTime > 0) {
                    this.startTimer();
                }
            }
        } catch (error) {
            console.error('Error loading game state:', error);
            // If there's an error, start fresh
            this.boardSize = 3;
            this.board = Array(9).fill('');
            this.currentPlayer = 'X';
            this.gameActive = true;
            this.scores = { X: 0, O: 0 };
            this.gameTime = 0;
            this.gameStartTime = null;
        }
    }
    
    restoreBoardVisuals() {
        this.cells.forEach((cell, index) => {
            const value = this.board[index];
            if (value) {
                cell.textContent = value;
                cell.classList.add(value.toLowerCase());
            } else {
                cell.textContent = '';
                cell.className = 'cell';
            }
        });
    }
    
    clearAllData() {
        localStorage.removeItem('xoGameState');
        this.board = Array(this.boardSize * this.boardSize).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        this.resetTimer();
        this.restoreBoardVisuals();
        this.updateScores();
        this.updateDisplay();
        this.closeModal();
    }
    
    // Dark mode methods
    toggleDarkMode() {
        const body = document.body;
        const isDarkMode = body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        }
    }
    
    loadDarkModePreference() {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
    
    // Timer methods
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.gameStartTime = Date.now() - (this.gameTime * 1000);
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimer() {
        if (this.gameStartTime) {
            this.gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
            this.displayTimer();
        }
    }
    
    displayTimer() {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.gameTimerDisplay.textContent = timeString;
    }
    
    resetTimer() {
        this.stopTimer();
        this.gameTime = 0;
        this.gameStartTime = null;
        this.displayTimer();
    }
    
    // Board size methods
    generateWinningCombinations(size) {
        const combinations = [];
        
        // Rows
        for (let i = 0; i < size; i++) {
            for (let j = 0; j <= size - 3; j++) {
                const row = [];
                for (let k = 0; k < 3; k++) {
                    row.push(i * size + j + k);
                }
                combinations.push(row);
            }
        }
        
        // Columns
        for (let i = 0; i <= size - 3; i++) {
            for (let j = 0; j < size; j++) {
                const col = [];
                for (let k = 0; k < 3; k++) {
                    col.push((i + k) * size + j);
                }
                combinations.push(col);
            }
        }
        
        // Diagonals (top-left to bottom-right)
        for (let i = 0; i <= size - 3; i++) {
            for (let j = 0; j <= size - 3; j++) {
                const diag1 = [];
                for (let k = 0; k < 3; k++) {
                    diag1.push((i + k) * size + j + k);
                }
                combinations.push(diag1);
            }
        }
        
        // Diagonals (top-right to bottom-left)
        for (let i = 0; i <= size - 3; i++) {
            for (let j = 2; j < size; j++) {
                const diag2 = [];
                for (let k = 0; k < 3; k++) {
                    diag2.push((i + k) * size + j - k);
                }
                combinations.push(diag2);
            }
        }
        
        return combinations;
    }
    
    changeBoardSize() {
        const newSize = parseInt(this.boardSizeSelect.value);
        if (newSize !== this.boardSize) {
            this.boardSize = newSize;
            this.winningCombinations = this.generateWinningCombinations(this.boardSize);
            this.createBoard();
            this.resetGame();
        }
    }
    
    createBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
        
        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-index', i);
            gameBoard.appendChild(cell);
        }
        
        // Re-initialize cells and event listeners
        this.initializeElements();
        this.attachEventListeners();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new XOGame();
});

// Add mobile-friendly features
document.addEventListener('DOMContentLoaded', () => {
    // Prevent zoom on double tap for mobile
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Prevent context menu on long press for mobile
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

