class XOGame {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.cells = document.querySelectorAll('.cell');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.scoreXDisplay = document.getElementById('scoreX');
        this.scoreODisplay = document.getElementById('scoreO');
        this.resetBtn = document.getElementById('resetBtn');
        this.clearScoreBtn = document.getElementById('clearScoreBtn');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.gameOverMessage = document.getElementById('gameOverMessage');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        
        // Validate that all required elements exist
        if (!this.cells.length || !this.currentPlayerDisplay || !this.scoreXDisplay || 
            !this.scoreODisplay || !this.resetBtn || !this.clearScoreBtn || 
            !this.gameOverModal || !this.gameOverMessage || !this.playAgainBtn) {
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
        this.scores[this.currentPlayer]++;
        this.updateScores();
        this.showGameOver(`${this.currentPlayer} Wins!`);
    }
    
    handleDraw() {
        this.gameActive = false;
        this.showGameOver("It's a Draw!");
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
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
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Clear all cells
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
            cell.style.transform = '';
        });
        
        this.updateDisplay();
        this.closeModal();
    }
    
    clearScores() {
        this.scores = { X: 0, O: 0 };
        this.updateScores();
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

