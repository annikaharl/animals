import { Player } from './player.js';
import { Physics } from './physics.js';

export class ObstacleCourse {
    constructor(canvas, animal) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animal = animal;
        
        // Game state
        this.gameState = 'playing'; // playing, paused, completed, gameOver
        this.score = 0;
        this.starsCollected = 0;
        this.totalStars = 0;
        this.gameTime = 0;
        this.gameStartTime = Date.now();
        
        // World properties
        this.worldWidth = 3000;
        this.worldHeight = 600;
        this.groundY = this.worldHeight - 50;
        
        // Game objects
        this.player = new Player(animal, 100, this.groundY - 100);
        this.obstacles = [];
        this.stars = [];
        this.particles = [];
        this.movingPlatforms = [];
        this.waterSections = [];
        
        // Camera
        this.camera = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            smoothing: 0.1
        };
        
        // Initialize level
        this.initializeLevel();
        
        // Start game loop
        this.gameLoop();
        
        // Setup pause controls
        this.setupPauseControls();
    }
    
    setupPauseControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'P' || e.key === 'p') {
                this.togglePause();
                e.preventDefault();
            }
        });
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.gameStartTime = Date.now() - this.gameTime;
        }
    }
    
    initializeLevel() {
        // Create obstacles
        this.createStaticObstacles();
        this.createMovingPlatforms();
        this.createWaterSections();
        this.createStars();
        this.createFinishLine();
    }
    
    createStaticObstacles() {
        // Various static barriers to jump over
        const obstacles = [
            { x: 300, y: this.groundY - 80, width: 20, height: 80 },
            { x: 500, y: this.groundY - 60, width: 15, height: 60 },
            { x: 700, y: this.groundY - 100, width: 25, height: 100 },
            { x: 1000, y: this.groundY - 50, width: 30, height: 50 },
            { x: 1200, y: this.groundY - 120, width: 20, height: 120 },
            { x: 1500, y: this.groundY - 40, width: 40, height: 40 },
            { x: 1800, y: this.groundY - 90, width: 25, height: 90 },
            { x: 2200, y: this.groundY - 70, width: 35, height: 70 },
            { x: 2500, y: this.groundY - 110, width: 30, height: 110 }
        ];
        
        this.obstacles = obstacles.map(obs => ({
            ...obs,
            type: 'static',
            color: '#8B4513'
        }));
    }
    
    createMovingPlatforms() {
        this.movingPlatforms = [
            {
                x: 900, y: this.groundY - 150,
                width: 80, height: 15,
                velocityX: 2, velocityY: 0,
                minX: 850, maxX: 1050,
                type: 'horizontal',
                color: '#9370DB'
            },
            {
                x: 1400, y: this.groundY - 200,
                width: 60, height: 15,
                velocityX: 0, velocityY: 1,
                minY: this.groundY - 250, maxY: this.groundY - 100,
                type: 'vertical',
                color: '#20B2AA'
            },
            {
                x: 2000, y: this.groundY - 180,
                width: 70, height: 15,
                velocityX: -1.5, velocityY: 0,
                minX: 1950, maxX: 2150,
                type: 'horizontal',
                color: '#FF6347'
            }
        ];
    }
    
    createWaterSections() {
        this.waterSections = [
            {
                x: 1300, y: this.groundY - 30,
                width: 200, height: 30,
                color: '#4169E1',
                type: 'water'
            },
            {
                x: 2300, y: this.groundY - 40,
                width: 150, height: 40,
                color: '#4169E1',
                type: 'water'
            }
        ];
    }
    
    createStars() {
        const starPositions = [
            { x: 250, y: this.groundY - 150 },
            { x: 450, y: this.groundY - 120 },
            { x: 650, y: this.groundY - 180 },
            { x: 950, y: this.groundY - 200 },
            { x: 1150, y: this.groundY - 160 },
            { x: 1350, y: this.groundY - 100 },
            { x: 1650, y: this.groundY - 140 },
            { x: 1950, y: this.groundY - 220 },
            { x: 2150, y: this.groundY - 130 },
            { x: 2450, y: this.groundY - 180 }
        ];
        
        this.stars = starPositions.map((pos, index) => ({
            id: index,
            x: pos.x,
            y: pos.y,
            width: 30,
            height: 30,
            collected: false,
            rotation: 0,
            pulseScale: 1
        }));
        
        this.totalStars = this.stars.length;
    }
    
    createFinishLine() {
        this.finishLine = {
            x: this.worldWidth - 100,
            y: 0,
            width: 20,
            height: this.worldHeight,
            color: '#FFD700'
        };
    }
    
    gameLoop() {
        if (this.gameState === 'playing') {
            this.update();
        }
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update game time
        this.gameTime = Date.now() - this.gameStartTime;
        
        // Update player
        this.player.update();
        
        // Update moving platforms
        this.updateMovingPlatforms();
        
        // Check collisions
        this.checkCollisions();
        
        // Update camera
        this.updateCamera();
        
        // Update particles
        this.updateParticles();
        
        // Update star animations
        this.updateStars();
    }
    
    updateMovingPlatforms() {
        this.movingPlatforms.forEach(platform => {
            if (platform.type === 'horizontal') {
                platform.x += platform.velocityX;
                if (platform.x <= platform.minX || platform.x + platform.width >= platform.maxX) {
                    platform.velocityX *= -1;
                }
            } else if (platform.type === 'vertical') {
                platform.y += platform.velocityY;
                if (platform.y <= platform.minY || platform.y + platform.height >= platform.maxY) {
                    platform.velocityY *= -1;
                }
            }
        });
    }
    
    updateStars() {
        this.stars.forEach(star => {
            if (!star.collected) {
                star.rotation += 0.05;
                star.pulseScale = 1 + Math.sin(Date.now() * 0.01 + star.id) * 0.1;
            }
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.velocityY += 0.1; // gravity
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
    }
    
    checkCollisions() {
        // Ground collision
        this.player.checkGroundCollision(this.groundY);
        
        // World bounds
        this.player.checkWorldCollisions(this.worldWidth, this.worldHeight);
        
        // Static obstacles
        this.obstacles.forEach(obstacle => {
            this.player.checkObstacleCollision(obstacle);
        });
        
        // Moving platforms
        this.movingPlatforms.forEach(platform => {
            this.player.checkMovingPlatformCollision(platform);
        });
        
        // Water sections
        this.checkWaterCollisions();
        
        // Star collection
        this.checkStarCollection();
        
        // Finish line
        this.checkFinishLine();
        
        // Death condition
        if (this.player.isDead(this.worldHeight)) {
            this.gameState = 'gameOver';
        }
    }
    
    checkWaterCollisions() {
        let playerInWater = false;
        this.waterSections.forEach(water => {
            if (this.player.physics.checkCollision(this.player, water)) {
                playerInWater = true;
            }
        });
        this.player.setWaterState(playerInWater);
    }
    
    checkStarCollection() {
        this.stars.forEach(star => {
            if (!star.collected && this.player.physics.checkCollision(this.player, star)) {
                star.collected = true;
                this.starsCollected++;
                this.score += 100;
                this.createStarParticles(star.x + star.width / 2, star.y + star.height / 2);
            }
        });
    }
    
    checkFinishLine() {
        if (this.player.physics.checkCollision(this.player, this.finishLine)) {
            this.gameState = 'completed';
            
            // Bonus points for completion
            this.score += 500;
            
            // Time bonus (faster completion = more points)
            const timeBonus = Math.max(0, 60000 - this.gameTime) / 100;
            this.score += Math.floor(timeBonus);
        }
    }
    
    createStarParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                velocityX: (Math.random() - 0.5) * 6,
                velocityY: Math.random() * -4 - 2,
                life: 30,
                maxLife: 30,
                alpha: 1,
                color: '#FFD700',
                size: Math.random() * 4 + 2
            });
        }
    }
    
    updateCamera() {
        // Follow player
        this.camera.targetX = this.player.getCenterX() - this.canvas.width / 2;
        this.camera.targetY = this.player.getCenterY() - this.canvas.height / 2;
        
        // Smooth camera movement
        this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothing;
        this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothing;
        
        // Keep camera within world bounds
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.worldWidth - this.canvas.width));
        this.camera.y = Math.max(0, Math.min(this.camera.y, this.worldHeight - this.canvas.height));
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB'; // Sky blue background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render game world
        this.renderBackground();
        this.renderWaterSections();
        this.renderObstacles();
        this.renderMovingPlatforms();
        this.renderStars();
        this.renderPlayer();
        this.renderParticles();
        this.renderFinishLine();
        
        // Render UI
        this.renderHUD();
        
        // Render game state overlays
        this.renderGameStateOverlays();
    }
    
    renderBackground() {
        // Ground
        this.ctx.fillStyle = '#8FBC8F';
        this.ctx.fillRect(0 - this.camera.x, this.groundY - this.camera.y, this.worldWidth, this.worldHeight - this.groundY);
        
        // Clouds (simple parallax effect)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 5; i++) {
            const cloudX = (i * 400 + 200) - this.camera.x * 0.3;
            const cloudY = 50 + i * 30 - this.camera.y * 0.1;
            this.renderCloud(cloudX, cloudY);
        }
    }
    
    renderCloud(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
        this.ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    renderWaterSections() {
        this.waterSections.forEach(water => {
            this.ctx.fillStyle = water.color;
            this.ctx.fillRect(
                water.x - this.camera.x,
                water.y - this.camera.y,
                water.width,
                water.height
            );
            
            // Water surface animation
            this.ctx.strokeStyle = '#87CEEB';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            for (let x = 0; x < water.width; x += 10) {
                const waveY = water.y - this.camera.y + Math.sin((x + Date.now() * 0.003) * 0.02) * 3;
                if (x === 0) {
                    this.ctx.moveTo(water.x - this.camera.x + x, waveY);
                } else {
                    this.ctx.lineTo(water.x - this.camera.x + x, waveY);
                }
            }
            this.ctx.stroke();
        });
    }
    
    renderObstacles() {
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = obstacle.color;
            this.ctx.fillRect(
                obstacle.x - this.camera.x,
                obstacle.y - this.camera.y,
                obstacle.width,
                obstacle.height
            );
        });
    }
    
    renderMovingPlatforms() {
        this.movingPlatforms.forEach(platform => {
            this.ctx.fillStyle = platform.color;
            this.ctx.fillRect(
                platform.x - this.camera.x,
                platform.y - this.camera.y,
                platform.width,
                platform.height
            );
            
            // Add movement indicator
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.fillRect(
                platform.x - this.camera.x + 2,
                platform.y - this.camera.y + 2,
                platform.width - 4,
                platform.height - 4
            );
        });
    }
    
    renderStars() {
        this.stars.forEach(star => {
            if (!star.collected) {
                const screenX = star.x - this.camera.x + star.width / 2;
                const screenY = star.y - this.camera.y + star.height / 2;
                
                this.ctx.save();
                this.ctx.translate(screenX, screenY);
                this.ctx.rotate(star.rotation);
                this.ctx.scale(star.pulseScale, star.pulseScale);
                
                // Draw star shape
                this.ctx.fillStyle = '#FFD700';
                this.ctx.beginPath();
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI) / 5;
                    const radius = i % 2 === 0 ? 15 : 7;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                this.ctx.closePath();
                this.ctx.fill();
                
                this.ctx.restore();
            }
        });
    }
    
    renderPlayer() {
        this.player.render(this.ctx, this.camera);
    }
    
    renderParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(
                particle.x - this.camera.x - particle.size / 2,
                particle.y - this.camera.y - particle.size / 2,
                particle.size,
                particle.size
            );
            this.ctx.restore();
        });
    }
    
    renderFinishLine() {
        // Animated finish line
        this.ctx.fillStyle = this.finishLine.color;
        this.ctx.fillRect(
            this.finishLine.x - this.camera.x,
            this.finishLine.y - this.camera.y,
            this.finishLine.width,
            this.finishLine.height
        );
        
        // Checkered pattern
        this.ctx.fillStyle = '#000';
        const squareSize = 20;
        for (let y = 0; y < this.finishLine.height; y += squareSize) {
            for (let x = 0; x < this.finishLine.width; x += squareSize) {
                if ((Math.floor(x / squareSize) + Math.floor(y / squareSize)) % 2 === 1) {
                    this.ctx.fillRect(
                        this.finishLine.x - this.camera.x + x,
                        this.finishLine.y - this.camera.y + y,
                        squareSize,
                        Math.min(squareSize, this.finishLine.height - y)
                    );
                }
            }
        }
    }
    
    renderHUD() {
        // HUD background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, 60);
        
        // Stars collected
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`⭐ ${this.starsCollected}/${this.totalStars}`, 20, 30);
        
        // Score
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillText(`Score: ${this.score}`, 20, 50);
        
        // Timer
        const minutes = Math.floor(this.gameTime / 60000);
        const seconds = Math.floor((this.gameTime % 60000) / 1000);
        this.ctx.fillText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`, 200, 30);
        
        // Animal name
        this.ctx.fillText(`Playing as: ${this.animal.name} ${this.animal.emoji}`, 200, 50);
        
        // Controls hint
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.fillText('WASD/Arrows to move, Hold UP to jump higher, P to pause', this.canvas.width - 350, 30);
        
        // Jump power indicator
        if (this.player.keys.up && !this.player.inWater && this.player.onGround) {
            const currentHoldTime = this.player.jumpStartTime > 0 ? Date.now() - this.player.jumpStartTime : 0;
            const holdRatio = Math.min(currentHoldTime / this.player.maxJumpHoldTime, 1);
            
            // Draw jump power bar
            const barX = this.canvas.width - 350;
            const barY = 40;
            const barWidth = 100;
            const barHeight = 10;
            
            // Background
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Fill
            this.ctx.fillStyle = `hsl(${holdRatio * 120}, 100%, 50%)`; // Red to green
            this.ctx.fillRect(barX, barY, barWidth * holdRatio, barHeight);
            
            // Border
            this.ctx.strokeStyle = '#FFF';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(barX, barY, barWidth, barHeight);
            
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = '12px Arial';
            this.ctx.fillText('Jump Power', barX + barWidth + 10, barY + 8);
        }
    }
    
    renderGameStateOverlays() {
        if (this.gameState === 'paused') {
            this.renderPauseOverlay();
        } else if (this.gameState === 'completed') {
            this.renderCompletionOverlay();
        } else if (this.gameState === 'gameOver') {
            this.renderGameOverOverlay();
        }
    }
    
    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Press P or ESC to resume', this.canvas.width / 2, this.canvas.height / 2 + 50);
        
        this.ctx.textAlign = 'left';
    }
    
    renderCompletionOverlay() {
        this.ctx.fillStyle = 'rgba(0, 100, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(`Stars Collected: ${this.starsCollected}/${this.totalStars}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
        
        const minutes = Math.floor(this.gameTime / 60000);
        const seconds = Math.floor((this.gameTime % 60000) / 1000);
        this.ctx.fillText(`Completion Time: ${minutes}:${seconds.toString().padStart(2, '0')}`, this.canvas.width / 2, this.canvas.height / 2 + 60);
        
        this.ctx.textAlign = 'left';
    }
    
    renderGameOverOverlay() {
        this.ctx.fillStyle = 'rgba(100, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Your animal fell off the world!', this.canvas.width / 2, this.canvas.height / 2 + 50);
        
        this.ctx.textAlign = 'left';
    }
    
    // Public methods for external control
    restart() {
        this.gameState = 'playing';
        this.score = 0;
        this.starsCollected = 0;
        this.gameTime = 0;
        this.gameStartTime = Date.now();
        this.player.reset(100, this.groundY - 100);
        this.stars.forEach(star => star.collected = false);
        this.particles = [];
    }
    
    getGameState() {
        return {
            state: this.gameState,
            score: this.score,
            starsCollected: this.starsCollected,
            totalStars: this.totalStars,
            gameTime: this.gameTime
        };
    }
}