# Instructions for Claude - Animal Game Setup

## Initial Setup Tasks

### 1. Clone the Repository
Since you'll be in the animals subdirectory, first check if it's already a git repository. If not, initialize it:

```bash
# Check git status
git status

# If not a git repo, initialize and connect to GitHub
git init
git remote add origin https://github.com/annikaharl/animals.git
git branch -M main
git pull origin main
```

### 2. Create Project Structure
Set up the following directory structure for the animal game:

```bash
# Create directories
mkdir -p css js assets/images assets/sounds

# Create initial files
touch index.html
touch css/styles.css
touch css/animations.css
touch js/app.js
touch js/instructions.js
touch js/animalBoard.js
touch js/gameState.js
touch README.md
```

### 3. Initialize Basic HTML
Create a basic `index.html` with:
- Proper HTML5 structure
- Links to CSS files
- Script tags for JavaScript modules
- Basic game container structure

### 4. Set Up Version Control
```bash
# Create .gitignore
echo "node_modules/
.DS_Store
*.log
.env" > .gitignore

# Make initial commit
git add .
git commit -m "Initial project structure for animal game"
git push -u origin main
```

### 5. Game Implementation Priority
Follow the development plan in `GAME_DEVELOPMENT_PLAN.md`:
1. Start with the instruction panel
2. Then build the animal selection board
3. Finally add the "Let's Go" button and game transitions

### Key Requirements
- The instruction panel should appear on first visit only (use localStorage)
- Animal selection should be visual and intuitive
- The green "Let's Go" button should only appear after animal selection
- Keep the code modular and well-organized

### Notes
- This is a web-based game using vanilla JavaScript
- Focus on clean, readable code
- Make frequent commits to track progress
- Test in multiple browsers if possible

Good luck building the animal game! 🎮🦁