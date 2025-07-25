export class AnimalBoard {
    constructor() {
        this.animals = [
            { id: 1, name: 'Lion', emoji: '🦁' },
            { id: 2, name: 'Elephant', emoji: '🐘' },
            { id: 3, name: 'Giraffe', emoji: '🦒' },
            { id: 4, name: 'Zebra', emoji: '🦓' },
            { id: 5, name: 'Monkey', emoji: '🐵' },
            { id: 6, name: 'Tiger', emoji: '🐅' },
            { id: 7, name: 'Bear', emoji: '🐻' },
            { id: 8, name: 'Panda', emoji: '🐼' },
            { id: 9, name: 'Koala', emoji: '🐨' },
            { id: 10, name: 'Penguin', emoji: '🐧' },
            { id: 11, name: 'Owl', emoji: '🦉' },
            { id: 12, name: 'Fox', emoji: '🦊' },
            { id: 13, name: 'Bunny', emoji: '🐰' },
            { id: 14, name: 'Horse', emoji: '🐴' },
            { id: 15, name: 'Unicorn', emoji: '🦄' }
        ];
        
        this.selectedAnimal = null;
        this.callbacks = {
            onSelect: null
        };
        
        this.gridElement = document.querySelector('.animal-grid');
    }
    
    render() {
        if (!this.gridElement) return;
        
        // Clear existing content
        this.gridElement.innerHTML = '';
        
        // Create animal cards
        this.animals.forEach(animal => {
            const card = this.createAnimalCard(animal);
            this.gridElement.appendChild(card);
        });
    }
    
    createAnimalCard(animal) {
        const card = document.createElement('div');
        card.className = 'animal-card';
        card.dataset.animalId = animal.id;
        
        // For now, use emoji as placeholder for images
        card.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 10px;">${animal.emoji}</div>
            <div class="animal-name">${animal.name}</div>
        `;
        
        // Add click listener
        card.addEventListener('click', () => {
            this.selectAnimal(animal, card);
        });
        
        return card;
    }
    
    selectAnimal(animal, cardElement) {
        // Remove previous selection
        const previouslySelected = document.querySelector('.animal-card.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        
        // Add selection to clicked card
        cardElement.classList.add('selected');
        
        // Update selected animal
        this.selectedAnimal = animal;
        
        // Trigger callback
        if (this.callbacks.onSelect) {
            this.callbacks.onSelect(animal);
        }
    }
    
    onAnimalSelect(callback) {
        this.callbacks.onSelect = callback;
    }
    
    getSelectedAnimal() {
        return this.selectedAnimal;
    }
}