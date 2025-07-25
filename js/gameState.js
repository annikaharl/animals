export class GameState {
    constructor() {
        this.storageKey = 'animalGameState';
        this.state = this.loadState();
    }
    
    loadState() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load game state:', e);
            }
        }
        
        // Default state
        return {
            firstVisit: true,
            selectedAnimal: null,
            gamesPlayed: 0
        };
    }
    
    saveState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (e) {
            console.error('Failed to save game state:', e);
        }
    }
    
    isFirstVisit() {
        return this.state.firstVisit;
    }
    
    markVisited() {
        this.state.firstVisit = false;
        this.saveState();
    }
    
    setSelectedAnimal(animal) {
        this.state.selectedAnimal = animal;
        this.saveState();
    }
    
    getSelectedAnimal() {
        return this.state.selectedAnimal;
    }
    
    incrementGamesPlayed() {
        this.state.gamesPlayed++;
        this.saveState();
    }
    
    getGamesPlayed() {
        return this.state.gamesPlayed;
    }
    
    reset() {
        this.state = {
            firstVisit: false,
            selectedAnimal: null,
            gamesPlayed: this.state.gamesPlayed
        };
        this.saveState();
    }
}