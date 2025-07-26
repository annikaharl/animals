import { Physics } from './physics.js';

export class Player {
    constructor(animal, startX = 100, startY = 300) {
        this.animal = animal;
        this.x = startX;
        this.y = startY;
        this.width = 40;
        this.height = 40;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.inWater = false;
        
        
        // Animal-specific properties
        this.setAnimalAbilities(animal);
        
        // Input state
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        
        // Jump mechanics
        this.isJumping = false;
        this.jumpStartTime = 0;
        this.jumpHoldTime = 0;
        this.maxJumpHoldTime = 500; // Maximum milliseconds to hold jump
        this.minJumpPower = 8;
        this.maxJumpPower = 20;
        
        this.physics = new Physics();
        this.setupControls();
    }
    
    setAnimalAbilities(animal) {
        const abilities = {
            'Lion': { speed: 6, jumpPower: 12, waterSpeed: 0.3 },
            'Elephant': { speed: 4, jumpPower: 8, waterSpeed: 0.6 },
            'Giraffe': { speed: 5, jumpPower: 15, waterSpeed: 0.2 },
            'Zebra': { speed: 7, jumpPower: 11, waterSpeed: 0.4 },
            'Monkey': { speed: 5, jumpPower: 14, waterSpeed: 0.5 },
            'Tiger': { speed: 8, jumpPower: 13, waterSpeed: 0.7 },
            'Bear': { speed: 4, jumpPower: 9, waterSpeed: 0.8 },
            'Panda': { speed: 3, jumpPower: 8, waterSpeed: 0.6 },
            'Koala': { speed: 3, jumpPower: 10, waterSpeed: 0.2 },
            'Penguin': { speed: 4, jumpPower: 7, waterSpeed: 1.0 },
            'Owl': { speed: 6, jumpPower: 16, waterSpeed: 0.1 },
            'Fox': { speed: 7, jumpPower: 13, waterSpeed: 0.4 },
            'Bunny': { speed: 6, jumpPower: 18, waterSpeed: 0.3 },
            'Horse': { speed: 9, jumpPower: 14, waterSpeed: 0.5 },
            'Unicorn': { speed: 8, jumpPower: 20, waterSpeed: 0.6 }
        };
        
        const animalAbility = abilities[this.animal.name] || abilities['Lion'];
        this.speed = animalAbility.speed;
        this.jumpPower = animalAbility.jumpPower;
        this.waterSpeed = animalAbility.waterSpeed;
        
        // Set jump power range based on animal's jump ability
        this.minJumpPower = Math.max(5, animalAbility.jumpPower * 0.6);
        this.maxJumpPower = animalAbility.jumpPower * 1.2;
    }
    
    setupControls() {
        // Handle keydown events
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'arrowleft':
                case 'a':
                    this.keys.left = true;
                    e.preventDefault();
                    break;
                case 'arrowright':
                case 'd':
                    this.keys.right = true;
                    e.preventDefault();
                    break;
                case 'arrowup':
                case 'w':
                case ' ': // Spacebar for jump
                    if (!this.keys.up) {
                        this.keys.up = true;
                        this.jumpStartTime = Date.now();
                    }
                    e.preventDefault();
                    break;
                case 'arrowdown':
                case 's':
                    this.keys.down = true;
                    e.preventDefault();
                    break;
            }
        });
        
        // Handle keyup events
        document.addEventListener('keyup', (e) => {
            switch(e.key.toLowerCase()) {
                case 'arrowleft':
                case 'a':
                    this.keys.left = false;
                    break;
                case 'arrowright':
                case 'd':
                    this.keys.right = false;
                    break;
                case 'arrowup':
                case 'w':
                case ' ':
                    this.keys.up = false;
                    if (this.jumpStartTime > 0 && this.isJumping) {
                        // Calculate jump power and execute jump immediately
                        const holdTime = Date.now() - this.jumpStartTime;
                        const holdRatio = Math.min(holdTime / this.maxJumpHoldTime, 1);
                        const jumpPower = this.minJumpPower + (this.maxJumpPower - this.minJumpPower) * holdRatio;
                        this.velocityY = -jumpPower;
                        this.jumpStartTime = 0;
                        this.isJumping = false;
                        this.onGround = false;
                    }
                    break;
                case 'arrowdown':
                case 's':
                    this.keys.down = false;
                    break;
            }
        });
    }
    
    update() {
        // Reset ground state (will be set true if touching ground)
        this.onGround = false;
        
        // Handle input
        this.handleInput();
        
        // Apply physics based on environment
        if (this.inWater) {
            this.physics.applyWaterPhysics(this);
        } else {
            this.physics.applyGravity(this);
        }
        
        this.physics.applyFriction(this);
        this.physics.updatePosition(this);
        
    }
    
    handleInput() {
        let currentSpeed = this.inWater ? this.speed * this.waterSpeed : this.speed;
        
        if (this.keys.left) {
            this.physics.moveLeft(this, currentSpeed);
        }
        if (this.keys.right) {
            this.physics.moveRight(this, currentSpeed);
        }
        if (this.keys.up) {
            if (this.inWater) {
                // Swimming up
                this.velocityY = Math.max(this.velocityY - 2, -6);
            } else if (!this.isJumping && Math.abs(this.velocityY) < 1) {
                // Prepare to jump - check if we're essentially on ground (small velocity)
                this.isJumping = true;
            }
        }
        if (this.keys.down && this.inWater) {
            // Swimming down
            this.velocityY = Math.min(this.velocityY + 2, 6);
        }
    }
    
    checkWorldCollisions(worldWidth, worldHeight) {
        return this.physics.checkBounds(this, worldWidth, worldHeight);
    }
    
    checkGroundCollision(groundY) {
        return this.physics.checkGroundCollision(this, groundY);
    }
    
    checkObstacleCollision(obstacle) {
        if (this.physics.checkCollision(this, obstacle)) {
            this.physics.resolveCollision(this, obstacle);
            return true;
        }
        return false;
    }
    
    checkMovingPlatformCollision(platform) {
        return this.physics.checkMovingPlatformCollision(this, platform);
    }
    
    setWaterState(inWater) {
        this.inWater = inWater;
    }
    
    render(ctx, camera) {
        // Calculate screen position based on camera
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Only render if on screen
        if (screenX > -this.width && screenX < ctx.canvas.width + this.width &&
            screenY > -this.height && screenY < ctx.canvas.height + this.height) {
            
            // Draw player as colored rectangle for now (will be replaced with sprite)
            ctx.fillStyle = this.inWater ? '#4a90e2' : '#e74c3c';
            ctx.fillRect(screenX, screenY, this.width, this.height);
            
            // Draw animal emoji
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.fillText(
                this.animal.emoji, 
                screenX + this.width / 2, 
                screenY + this.height / 2 + 10
            );
            
            // Draw velocity indicator for debugging (optional)
            if (Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1) {
                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(screenX + this.width / 2, screenY + this.height / 2);
                ctx.lineTo(
                    screenX + this.width / 2 + this.velocityX * 3,
                    screenY + this.height / 2 + this.velocityY * 3
                );
                ctx.stroke();
            }
        }
    }
    
    reset(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.inWater = false;
        this.isJumping = false;
        this.jumpStartTime = 0;
        this.jumpHoldTime = 0;
    }
    
    // Get center position for camera following
    getCenterX() {
        return this.x + this.width / 2;
    }
    
    getCenterY() {
        return this.y + this.height / 2;
    }
    
    // Check if player has fallen off the world
    isDead(worldHeight) {
        return this.y > worldHeight + 100;
    }
}