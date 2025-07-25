export class Physics {
    constructor() {
        this.gravity = 0.8;
        this.friction = 0.85;
        this.airResistance = 0.98;
        this.terminalVelocity = 15;
    }

    applyGravity(entity) {
        if (!entity.onGround) {
            entity.velocityY += this.gravity;
            
            // Apply terminal velocity
            if (entity.velocityY > this.terminalVelocity) {
                entity.velocityY = this.terminalVelocity;
            }
        }
    }

    applyFriction(entity) {
        if (entity.onGround) {
            entity.velocityX *= this.friction;
        } else {
            entity.velocityX *= this.airResistance;
        }
    }

    updatePosition(entity) {
        entity.x += entity.velocityX;
        entity.y += entity.velocityY;
    }

    checkCollision(entityA, entityB) {
        return entityA.x < entityB.x + entityB.width &&
               entityA.x + entityA.width > entityB.x &&
               entityA.y < entityB.y + entityB.height &&
               entityA.y + entityA.height > entityB.y;
    }

    resolveCollision(entity, obstacle) {
        const overlapX = Math.min(
            entity.x + entity.width - obstacle.x,
            obstacle.x + obstacle.width - entity.x
        );
        const overlapY = Math.min(
            entity.y + entity.height - obstacle.y,
            obstacle.y + obstacle.height - entity.y
        );

        // Resolve collision on the axis with smallest overlap
        if (overlapX < overlapY) {
            // Horizontal collision
            if (entity.x < obstacle.x) {
                entity.x = obstacle.x - entity.width;
            } else {
                entity.x = obstacle.x + obstacle.width;
            }
            entity.velocityX = 0;
        } else {
            // Vertical collision
            if (entity.y < obstacle.y) {
                // Landing on top
                entity.y = obstacle.y - entity.height;
                entity.velocityY = 0;
                entity.onGround = true;
            } else {
                // Hitting from below
                entity.y = obstacle.y + obstacle.height;
                entity.velocityY = 0;
            }
        }
    }

    checkGroundCollision(entity, groundY) {
        if (entity.y + entity.height >= groundY) {
            entity.y = groundY - entity.height;
            entity.velocityY = 0;
            entity.onGround = true;
            return true;
        }
        return false;
    }

    jump(entity, jumpPower = 12) {
        if (entity.onGround) {
            entity.velocityY = -jumpPower;
            entity.onGround = false;
        }
    }

    moveLeft(entity, speed = 5) {
        entity.velocityX = Math.max(entity.velocityX - speed, -speed);
    }

    moveRight(entity, speed = 5) {
        entity.velocityX = Math.min(entity.velocityX + speed, speed);
    }

    // Check if entity is within bounds
    checkBounds(entity, worldWidth, worldHeight) {
        const collisions = {
            left: entity.x <= 0,
            right: entity.x + entity.width >= worldWidth,
            top: entity.y <= 0,
            bottom: entity.y + entity.height >= worldHeight
        };

        // Keep entity within bounds
        if (collisions.left) {
            entity.x = 0;
            entity.velocityX = 0;
        }
        if (collisions.right) {
            entity.x = worldWidth - entity.width;
            entity.velocityX = 0;
        }
        if (collisions.top) {
            entity.y = 0;
            entity.velocityY = 0;
        }
        if (collisions.bottom) {
            entity.y = worldHeight - entity.height;
            entity.velocityY = 0;
            entity.onGround = true;
        }

        return collisions;
    }

    // Advanced collision detection for moving platforms
    checkMovingPlatformCollision(entity, platform) {
        const wasOnGround = entity.onGround;
        const prevY = entity.y - entity.velocityY;
        
        if (this.checkCollision(entity, platform)) {
            // Check if player was above the platform in the previous frame
            if (prevY + entity.height <= platform.y && entity.velocityY >= 0) {
                entity.y = platform.y - entity.height;
                entity.velocityY = 0;
                entity.onGround = true;
                
                // Move with the platform
                entity.x += platform.velocityX || 0;
                return true;
            } else {
                // Side or bottom collision
                this.resolveCollision(entity, platform);
                return true;
            }
        }
        
        return false;
    }

    // Water physics for swimming sections
    applyWaterPhysics(entity) {
        entity.velocityY *= 0.5; // Reduced gravity in water
        entity.velocityX *= 0.8; // More resistance in water
        
        // Buoyancy effect
        if (entity.velocityY > 2) {
            entity.velocityY *= 0.7;
        }
    }
}