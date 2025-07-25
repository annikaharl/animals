# Animal Selection Game 🎮

An interactive web-based game where players can select their favorite animal and play engaging activities.

## Features

- **First-time instruction panel** - Shows game instructions on first visit
- **Visual animal selection board** - Choose from 15 different animals including:
  - Lion 🦁
  - Elephant 🐘
  - Giraffe 🦒
  - Zebra 🦓
  - Monkey 🐵
  - Tiger 🐅
  - Bear 🐻
  - Panda 🐼
  - Koala 🐨
  - Penguin 🐧
  - Owl 🦉
  - Fox 🦊
  - Bunny 🐰
  - Horse 🐴
  - Unicorn 🦄
- **Interactive animations** - Hover effects and selection feedback
- **Persistent game state** - Remembers your preferences using localStorage

## Project Structure

```
animals/
├── index.html          # Main HTML file
├── css/
│   ├── styles.css      # Main styles
│   └── animations.css  # Animation effects
├── js/
│   ├── app.js          # Main application logic
│   ├── instructions.js # Instruction panel logic
│   ├── animalBoard.js  # Animal selection logic
│   └── gameState.js    # Game state management
├── assets/
│   ├── images/         # Animal images (to be added)
│   └── sounds/         # Sound effects (optional)
└── README.md           # This file
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/annikaharl/animals.git
   cd animals
   ```

2. Open `index.html` in a modern web browser

3. Follow the on-screen instructions to select your animal and start playing!

## Development

This game is built with:
- **HTML5** for structure
- **CSS3** for styling and animations
- **Vanilla JavaScript** for game logic (ES6 modules)
- **localStorage** for saving game state

## Future Enhancements

- Add actual animal images instead of emojis
- Implement main game mechanics after animal selection
- Add sound effects and background music
- Create multiple game modes
- Add score tracking and leaderboards
- Support for multiple languages

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.