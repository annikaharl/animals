export class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.levels = this.defineLevels();
    }
    
    defineLevels() {
        return {
            1: {
                name: "Forest Adventure",
                worldWidth: 3000,
                worldHeight: 600,
                groundY: 550,
                backgroundColor: '#87CEEB',
                groundColor: '#8FBC8F',
                
                obstacles: [
                    { x: 300, y: 470, width: 20, height: 80, type: 'static', color: '#8B4513' },
                    { x: 500, y: 490, width: 15, height: 60, type: 'static', color: '#8B4513' },
                    { x: 700, y: 450, width: 25, height: 100, type: 'static', color: '#8B4513' },
                    { x: 1000, y: 500, width: 30, height: 50, type: 'static', color: '#8B4513' },
                    { x: 1200, y: 430, width: 20, height: 120, type: 'static', color: '#8B4513' },
                    { x: 1500, y: 510, width: 40, height: 40, type: 'static', color: '#8B4513' },
                    { x: 1800, y: 460, width: 25, height: 90, type: 'static', color: '#8B4513' },
                    { x: 2200, y: 480, width: 35, height: 70, type: 'static', color: '#8B4513' },
                    { x: 2500, y: 440, width: 30, height: 110, type: 'static', color: '#8B4513' }
                ],
                
                movingPlatforms: [
                    {
                        x: 900, y: 400, width: 80, height: 15,
                        velocityX: 2, velocityY: 0,
                        minX: 850, maxX: 1050,
                        type: 'horizontal', color: '#9370DB'
                    },
                    {
                        x: 1400, y: 350, width: 60, height: 15,
                        velocityX: 0, velocityY: 1,
                        minY: 300, maxY: 450,
                        type: 'vertical', color: '#20B2AA'
                    },
                    {
                        x: 2000, y: 370, width: 70, height: 15,
                        velocityX: -1.5, velocityY: 0,
                        minX: 1950, maxX: 2150,
                        type: 'horizontal', color: '#FF6347'
                    }
                ],
                
                waterSections: [
                    { x: 1300, y: 520, width: 200, height: 30, color: '#4169E1', type: 'water' },
                    { x: 2300, y: 510, width: 150, height: 40, color: '#4169E1', type: 'water' }
                ],
                
                stars: [
                    { x: 250, y: 400 },
                    { x: 450, y: 430 },
                    { x: 650, y: 370 },
                    { x: 950, y: 350 },
                    { x: 1150, y: 390 },
                    { x: 1350, y: 450 },
                    { x: 1650, y: 410 },
                    { x: 1950, y: 330 },
                    { x: 2150, y: 420 },
                    { x: 2450, y: 370 }
                ],
                
                playerStart: { x: 100, y: 450 },
                finishLine: { x: 2900, y: 0, width: 20, height: 600, color: '#FFD700' }
            },
            
            2: {
                name: "Mountain Challenge",
                worldWidth: 4000,
                worldHeight: 700,
                groundY: 650,
                backgroundColor: '#B0C4DE',
                groundColor: '#A0522D',
                
                obstacles: [
                    { x: 200, y: 550, width: 30, height: 100, type: 'static', color: '#696969' },
                    { x: 400, y: 500, width: 25, height: 150, type: 'static', color: '#696969' },
                    { x: 600, y: 450, width: 35, height: 200, type: 'static', color: '#696969' },
                    { x: 900, y: 400, width: 40, height: 250, type: 'static', color: '#696969' },
                    { x: 1200, y: 350, width: 30, height: 300, type: 'static', color: '#696969' },
                    { x: 1500, y: 450, width: 50, height: 200, type: 'static', color: '#696969' },
                    { x: 1800, y: 500, width: 25, height: 150, type: 'static', color: '#696969' },
                    { x: 2100, y: 400, width: 35, height: 250, type: 'static', color: '#696969' },
                    { x: 2500, y: 350, width: 45, height: 300, type: 'static', color: '#696969' },
                    { x: 2900, y: 450, width: 40, height: 200, type: 'static', color: '#696969' },
                    { x: 3300, y: 500, width: 30, height: 150, type: 'static', color: '#696969' }
                ],
                
                movingPlatforms: [
                    {
                        x: 700, y: 300, width: 60, height: 15,
                        velocityX: 0, velocityY: 2,
                        minY: 250, maxY: 400,
                        type: 'vertical', color: '#9370DB'
                    },
                    {
                        x: 1000, y: 250, width: 80, height: 15,
                        velocityX: 3, velocityY: 0,
                        minX: 950, maxX: 1150,
                        type: 'horizontal', color: '#20B2AA'
                    },
                    {
                        x: 1600, y: 300, width: 70, height: 15,
                        velocityX: -2, velocityY: 0,
                        minX: 1550, maxX: 1750,
                        type: 'horizontal', color: '#FF6347'
                    },
                    {
                        x: 2200, y: 200, width: 60, height: 15,
                        velocityX: 0, velocityY: -1.5,
                        minY: 150, maxY: 300,
                        type: 'vertical', color: '#FFD700'
                    },
                    {
                        x: 3000, y: 300, width: 90, height: 15,
                        velocityX: 2.5, velocityY: 0,
                        minX: 2950, maxX: 3200,
                        type: 'horizontal', color: '#DA70D6'
                    }
                ],
                
                waterSections: [
                    { x: 800, y: 620, width: 300, height: 30, color: '#4169E1', type: 'water' },
                    { x: 2000, y: 600, width: 250, height: 50, color: '#4169E1', type: 'water' },
                    { x: 3200, y: 630, width: 200, height: 20, color: '#4169E1', type: 'water' }
                ],
                
                stars: [
                    { x: 150, y: 500 },
                    { x: 350, y: 450 },
                    { x: 550, y: 400 },
                    { x: 750, y: 250 },
                    { x: 1050, y: 200 },
                    { x: 1350, y: 300 },
                    { x: 1650, y: 250 },
                    { x: 1950, y: 350 },
                    { x: 2250, y: 150 },
                    { x: 2600, y: 300 },
                    { x: 3050, y: 250 },
                    { x: 3400, y: 450 }
                ],
                
                playerStart: { x: 50, y: 550 },
                finishLine: { x: 3900, y: 0, width: 20, height: 700, color: '#FFD700' }
            },
            
            3: {
                name: "Ocean Depths",
                worldWidth: 3500,
                worldHeight: 800,
                groundY: 750,
                backgroundColor: '#4682B4',
                groundColor: '#F4A460',
                
                obstacles: [
                    { x: 250, y: 650, width: 20, height: 100, type: 'static', color: '#FF7F50' },
                    { x: 450, y: 600, width: 30, height: 150, type: 'static', color: '#FF7F50' },
                    { x: 700, y: 550, width: 25, height: 200, type: 'static', color: '#FF7F50' },
                    { x: 1000, y: 500, width: 35, height: 250, type: 'static', color: '#FF7F50' },
                    { x: 1400, y: 450, width: 40, height: 300, type: 'static', color: '#FF7F50' },
                    { x: 1800, y: 550, width: 30, height: 200, type: 'static', color: '#FF7F50' },
                    { x: 2200, y: 600, width: 45, height: 150, type: 'static', color: '#FF7F50' },
                    { x: 2600, y: 500, width: 35, height: 250, type: 'static', color: '#FF7F50' },
                    { x: 3000, y: 650, width: 25, height: 100, type: 'static', color: '#FF7F50' }
                ],
                
                movingPlatforms: [
                    {
                        x: 550, y: 400, width: 80, height: 15,
                        velocityX: 1.5, velocityY: 0,
                        minX: 500, maxX: 650,
                        type: 'horizontal', color: '#20B2AA'
                    },
                    {
                        x: 850, y: 350, width: 60, height: 15,
                        velocityX: 0, velocityY: 2.5,
                        minY: 300, maxY: 500,
                        type: 'vertical', color: '#9370DB'
                    },
                    {
                        x: 1200, y: 300, width: 70, height: 15,
                        velocityX: -2, velocityY: 0,
                        minX: 1150, maxX: 1350,
                        type: 'horizontal', color: '#FF6347'
                    },
                    {
                        x: 1600, y: 250, width: 90, height: 15,
                        velocityX: 2.5, velocityY: 0,
                        minX: 1550, maxX: 1750,
                        type: 'horizontal', color: '#FFD700'
                    },
                    {
                        x: 2000, y: 400, width: 75, height: 15,
                        velocityX: 0, velocityY: -1.8,
                        minY: 350, maxY: 500,
                        type: 'vertical', color: '#DA70D6'
                    },
                    {
                        x: 2400, y: 350, width: 80, height: 15,
                        velocityX: 3, velocityY: 0,
                        minX: 2350, maxX: 2550,
                        type: 'horizontal', color: '#00CED1'
                    }
                ],
                
                waterSections: [
                    { x: 0, y: 650, width: 200, height: 100, color: '#4169E1', type: 'water' },
                    { x: 300, y: 600, width: 400, height: 150, color: '#4169E1', type: 'water' },
                    { x: 900, y: 550, width: 600, height: 200, color: '#4169E1', type: 'water' },
                    { x: 1700, y: 600, width: 500, height: 150, color: '#4169E1', type: 'water' },
                    { x: 2800, y: 650, width: 700, height: 100, color: '#4169E1', type: 'water' }
                ],
                
                stars: [
                    { x: 100, y: 600 },
                    { x: 400, y: 550 },
                    { x: 600, y: 350 },
                    { x: 900, y: 300 },
                    { x: 1100, y: 250 },
                    { x: 1300, y: 200 },
                    { x: 1550, y: 150 },
                    { x: 1750, y: 200 },
                    { x: 2050, y: 350 },
                    { x: 2350, y: 300 },
                    { x: 2700, y: 400 },
                    { x: 3100, y: 550 },
                    { x: 3300, y: 600 }
                ],
                
                playerStart: { x: 50, y: 600 },
                finishLine: { x: 3400, y: 0, width: 20, height: 800, color: '#FFD700' }
            }
        };
    }
    
    getCurrentLevel() {
        return this.levels[this.currentLevel];
    }
    
    getLevelData(levelNumber) {
        return this.levels[levelNumber] || null;
    }
    
    setCurrentLevel(levelNumber) {
        if (this.levels[levelNumber]) {
            this.currentLevel = levelNumber;
            return true;
        }
        return false;
    }
    
    getNextLevel() {
        const nextLevelNumber = this.currentLevel + 1;
        return this.levels[nextLevelNumber] || null;
    }
    
    hasNextLevel() {
        return this.levels[this.currentLevel + 1] !== undefined;
    }
    
    getTotalLevels() {
        return Object.keys(this.levels).length;
    }
    
    getLevelNames() {
        const names = {};
        Object.keys(this.levels).forEach(key => {
            names[key] = this.levels[key].name;
        });
        return names;
    }
    
    // Generate level stats
    getLevelStats(levelNumber) {
        const level = this.levels[levelNumber];
        if (!level) return null;
        
        return {
            name: level.name,
            obstacles: level.obstacles.length,
            movingPlatforms: level.movingPlatforms.length,
            waterSections: level.waterSections.length,
            stars: level.stars.length,
            worldWidth: level.worldWidth,
            difficulty: this.calculateDifficulty(level)
        };
    }
    
    calculateDifficulty(level) {
        let difficulty = 0;
        
        // Base difficulty from obstacles
        difficulty += level.obstacles.length * 0.5;
        difficulty += level.movingPlatforms.length * 1.5;
        difficulty += level.waterSections.length * 1.0;
        
        // World size factor
        difficulty += (level.worldWidth / 1000) * 0.5;
        
        // Normalize to 1-10 scale
        return Math.min(10, Math.max(1, Math.round(difficulty)));
    }
    
    // Create an obstacle course instance with level data
    createObstacleCourseFromLevel(canvas, animal, levelNumber = null) {
        const levelData = levelNumber ? this.getLevelData(levelNumber) : this.getCurrentLevel();
        if (!levelData) return null;
        
        // This would be used to configure the ObstacleCourse with level-specific data
        return {
            levelData: levelData,
            canvas: canvas,
            animal: animal
        };
    }
}