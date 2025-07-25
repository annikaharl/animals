import { InstructionPanel } from './instructions.js';
import { AnimalBoard } from './animalBoard.js';
import { GameState } from './gameState.js';

class AnimalGame {
    constructor() {
        this.gameState = new GameState();
        this.instructionPanel = new InstructionPanel();
        this.animalBoard = new AnimalBoard();
        
        this.elements = {
            instructionPanel: document.getElementById('instruction-panel'),
            animalBoard: document.getElementById('animal-board'),
            gameControls: document.getElementById('game-controls'),
            letsGoBtn: document.getElementById('lets-go-btn'),
            gameArea: document.getElementById('game-area')
        };
        
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
        this.elements.gameArea.innerHTML = `
            <h1>Playing with ${selectedAnimal.name}!</h1>
            <p>Game implementation coming soon...</p>
            <button class="btn btn-primary" onclick="location.reload()">Start Over</button>
        `;
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimalGame();
});