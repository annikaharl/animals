import { InstructionPanel } from './instructions.js';
import { AnimalBoard } from './animalBoard.js';
import { GameState } from './gameState.js';
import { ObstacleCourse } from './obstacle.js';
import { LevelManager } from './levels.js';

class AnimalGame {
    constructor() {
        this.gameState = new GameState();
        this.instructionPanel = new InstructionPanel();
        this.animalBoard = new AnimalBoard();
        this.levelManager = new LevelManager();
        
        this.elements = {
            instructionPanel: document.getElementById('instruction-panel'),
            animalBoard: document.getElementById('animal-board'),
            gameControls: document.getElementById('game-controls'),
            letsGoBtn: document.getElementById('lets-go-btn'),
            gameArea: document.getElementById('game-area')
        };
        
        // Game instances
        this.obstacleCourse = null;
        this.gameCanvas = null;
        this.currentLevel = 1;
        
        this.init();
    }
    
    init() {
        // Check if this is the first visit
        if (this.gameState.isFirstVisit()) {
            this.showInstructions();
        } else {
            this.showAnimalSelection();
        }
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Instruction panel dismiss
        this.instructionPanel.onDismiss(() => {
            this.hideInstructions();
            this.showAnimalSelection();
        });
        
        // Animal selection
        this.animalBoard.onAnimalSelect((animal) => {
            this.gameState.setSelectedAnimal(animal);
            this.enableStartButton();
        });
        
        // Let's Go button
        this.elements.letsGoBtn.addEventListener('click', () => {
            if (!this.elements.letsGoBtn.classList.contains('disabled')) {
                this.startGame();
            }
        });
    }
    
    showInstructions() {
        this.elements.instructionPanel.classList.remove('hidden');
    }
    
    hideInstructions() {
        this.elements.instructionPanel.classList.add('hidden');
        this.gameState.markVisited();
    }
    
    showAnimalSelection() {
        this.elements.animalBoard.classList.remove('hidden');
        this.elements.gameControls.classList.remove('hidden');
        this.animalBoard.render();
    }
    
    hideAnimalSelection() {
        this.elements.animalBoard.classList.add('hidden');
        this.elements.gameControls.classList.add('hidden');
    }
    
    enableStartButton() {
        this.elements.letsGoBtn.classList.remove('disabled');
    }
    
    startGame() {
        const selectedAnimal = this.gameState.getSelectedAnimal();
        if (!selectedAnimal) {
            alert('Please select an animal first!');
            return;
        }
        
        // Hide selection screen
        this.hideAnimalSelection();
        
        // Show game area
        this.elements.gameArea.classList.remove('hidden');
        
        // Create game interface
        this.createGameInterface(selectedAnimal);
        
        // Initialize the obstacle course
        this.initializeObstacleCourse(selectedAnimal);
        
        // Increment games played
        this.gameState.incrementGamesPlayed();
    }
    
    createGameInterface(selectedAnimal) {
        this.elements.gameArea.innerHTML = `
            <div class="animal-abilities">
                <h3>Playing as ${selectedAnimal.name} ${selectedAnimal.emoji}</h3>
                <div class="ability-grid">
                    <div class="ability-item">
                        <div class="ability-label">Speed</div>
                        <div class="ability-value">${this.getAnimalAbility(selectedAnimal.name, 'speed')}/10</div>
                        <div class="ability-bar">
                            <div class="ability-fill" style="width: ${this.getAnimalAbility(selectedAnimal.name, 'speed') * 10}%"></div>
                        </div>
                    </div>
                    <div class="ability-item">
                        <div class="ability-label">Jump</div>
                        <div class="ability-value">${this.getAnimalAbility(selectedAnimal.name, 'jump')}/10</div>
                        <div class="ability-bar">
                            <div class="ability-fill" style="width: ${this.getAnimalAbility(selectedAnimal.name, 'jump') * 10}%"></div>
                        </div>
                    </div>
                    <div class="ability-item">
                        <div class="ability-label">Swimming</div>
                        <div class="ability-value">${this.getAnimalAbility(selectedAnimal.name, 'water')}/10</div>
                        <div class="ability-bar">
                            <div class="ability-fill" style="width: ${this.getAnimalAbility(selectedAnimal.name, 'water') * 10}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="level-selector">
                <button class="level-btn active" data-level="1">Level 1</button>
                <button class="level-btn" data-level="2">Level 2</button>
                <button class="level-btn" data-level="3">Level 3</button>
            </div>
            
            <canvas id="game-canvas" class="game-canvas" width="800" height="600"></canvas>
            
            <div class="game-controls-overlay">
                <button class="game-control-btn restart" id="restart-btn">Restart</button>
                <button class="game-control-btn" id="back-btn">Back to Menu</button>
            </div>
            
            <div class="game-stats">
                <div class="stat-item">
                    <div class="stat-label">Score</div>
                    <div class="stat-value" id="score-display">0</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Stars</div>
                    <div class="stat-value" id="stars-display">0/0</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Time</div>
                    <div class="stat-value" id="time-display">0:00</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Level</div>
                    <div class="stat-value" id="level-display">1</div>
                </div>
            </div>
        `;
        
        // Setup game controls
        this.setupGameControls();
    }
    
    setupGameControls() {
        // Level selection
        const levelButtons = document.querySelectorAll('.level-btn');
        levelButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = parseInt(e.target.dataset.level);
                this.switchLevel(level);
            });
        });
        
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartLevel();
        });
        
        // Back to menu button
        document.getElementById('back-btn').addEventListener('click', () => {
            this.backToMenu();
        });
    }
    
    getAnimalAbility(animalName, abilityType) {
        const abilities = {
            'Lion': { speed: 6, jump: 6, water: 3 },
            'Elephant': { speed: 4, jump: 4, water: 6 },
            'Giraffe': { speed: 5, jump: 8, water: 2 },
            'Zebra': { speed: 7, jump: 6, water: 4 },
            'Monkey': { speed: 5, jump: 7, water: 5 },
            'Tiger': { speed: 8, jump: 7, water: 7 },
            'Bear': { speed: 4, jump: 5, water: 8 },
            'Panda': { speed: 3, jump: 4, water: 6 },
            'Koala': { speed: 3, jump: 5, water: 2 },
            'Penguin': { speed: 4, jump: 4, water: 10 },
            'Owl': { speed: 6, jump: 9, water: 1 },
            'Fox': { speed: 7, jump: 7, water: 4 },
            'Bunny': { speed: 6, jump: 10, water: 3 },
            'Horse': { speed: 9, jump: 8, water: 5 },
            'Unicorn': { speed: 8, jump: 10, water: 6 }
        };
        
        return abilities[animalName]?.[abilityType] || 5;
    }
    
    initializeObstacleCourse(selectedAnimal) {
        this.gameCanvas = document.getElementById('game-canvas');
        if (!this.gameCanvas) {
            console.error('Game canvas not found!');
            return;
        }
        
        // Create obstacle course instance
        this.obstacleCourse = new ObstacleCourse(this.gameCanvas, selectedAnimal);
        
        // Start monitoring game state
        this.monitorGameState();
    }
    
    monitorGameState() {
        const updateStats = () => {
            if (this.obstacleCourse) {
                const gameState = this.obstacleCourse.getGameState();
                
                // Update display elements
                const scoreDisplay = document.getElementById('score-display');
                const starsDisplay = document.getElementById('stars-display');
                const timeDisplay = document.getElementById('time-display');
                
                if (scoreDisplay) scoreDisplay.textContent = gameState.score;
                if (starsDisplay) starsDisplay.textContent = `${gameState.starsCollected}/${gameState.totalStars}`;
                if (timeDisplay) {
                    const minutes = Math.floor(gameState.gameTime / 60000);
                    const seconds = Math.floor((gameState.gameTime % 60000) / 1000);
                    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
                
                // Handle game completion
                if (gameState.state === 'completed') {
                    this.handleLevelCompletion(gameState);
                } else if (gameState.state === 'gameOver') {
                    this.handleGameOver(gameState);
                }
            }
            
            requestAnimationFrame(updateStats);
        };
        
        updateStats();
    }
    
    switchLevel(levelNumber) {
        this.currentLevel = levelNumber;
        
        // Update UI
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.level) === levelNumber) {
                btn.classList.add('active');
            }
        });
        
        document.getElementById('level-display').textContent = levelNumber;
        
        // Restart with new level
        this.restartLevel();
    }
    
    restartLevel() {
        if (this.obstacleCourse) {
            this.obstacleCourse.restart();
        }
    }
    
    backToMenu() {
        // Show selection screen
        this.elements.gameArea.classList.add('hidden');
        this.showAnimalSelection();
        
        // Clean up game
        if (this.obstacleCourse) {
            this.obstacleCourse = null;
        }
        this.gameCanvas = null;
    }
    
    handleLevelCompletion(gameState) {
        setTimeout(() => {
            const nextLevel = this.currentLevel + 1;
            const hasNextLevel = nextLevel <= this.levelManager.getTotalLevels();
            
            const message = hasNextLevel 
                ? `Level ${this.currentLevel} Complete!\n\nScore: ${gameState.score}\nStars: ${gameState.starsCollected}/${gameState.totalStars}\n\nReady for Level ${nextLevel}?`
                : `Congratulations!\n\nYou completed all levels!\nFinal Score: ${gameState.score}\nTotal Stars: ${gameState.starsCollected}/${gameState.totalStars}`;
                
            if (confirm(message)) {
                if (hasNextLevel) {
                    this.switchLevel(nextLevel);
                } else {
                    this.backToMenu();
                }
            }
        }, 2000); // Give time to see the completion screen
    }
    
    handleGameOver(gameState) {
        setTimeout(() => {
            if (confirm(`Game Over!\n\nYour ${this.gameState.getSelectedAnimal().name} fell off the world!\n\nScore: ${gameState.score}\nStars: ${gameState.starsCollected}/${gameState.totalStars}\n\nTry again?`)) {
                this.restartLevel();
            }
        }, 1000);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimalGame();
});