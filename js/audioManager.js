export class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.volume = 0.5;
        this.muted = false;
        this.audioContext = null;
        
        // Initialize Web Audio API if available
        this.initializeAudioContext();
        
        // Load default sound effects
        this.loadSoundEffects();
    }
    
    initializeAudioContext() {
        try {
            // Use Web Audio API for better control
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.audioContext = new AudioContextClass();
            }
        } catch (error) {
            console.warn('Web Audio API not available, falling back to HTML5 audio');
        }
    }
    
    loadSoundEffects() {
        // For now, we'll use programmatically generated sounds
        // In a real implementation, you would load actual audio files
        this.createJumpSounds();
        this.createLandingSounds();
    }
    
    createJumpSounds() {
        // Create different jump sounds for different animals
        const jumpSounds = {
            'Lion': { frequency: 220, duration: 0.2, type: 'sine' },
            'Elephant': { frequency: 150, duration: 0.3, type: 'triangle' },
            'Giraffe': { frequency: 300, duration: 0.25, type: 'sine' },
            'Zebra': { frequency: 250, duration: 0.2, type: 'square' },
            'Monkey': { frequency: 400, duration: 0.15, type: 'sine' },
            'Tiger': { frequency: 200, duration: 0.2, type: 'sawtooth' },
            'Bear': { frequency: 120, duration: 0.35, type: 'triangle' },
            'Panda': { frequency: 180, duration: 0.25, type: 'sine' },
            'Koala': { frequency: 280, duration: 0.2, type: 'sine' },
            'Penguin': { frequency: 350, duration: 0.15, type: 'square' },
            'Owl': { frequency: 450, duration: 0.1, type: 'sine' },
            'Fox': { frequency: 320, duration: 0.18, type: 'sawtooth' },
            'Bunny': { frequency: 500, duration: 0.12, type: 'sine' },
            'Horse': { frequency: 190, duration: 0.25, type: 'triangle' },
            'Unicorn': { frequency: 600, duration: 0.15, type: 'sine' }
        };
        
        Object.entries(jumpSounds).forEach(([animal, config]) => {
            this.sounds.set(`jump_${animal}`, config);
        });
    }
    
    createLandingSounds() {
        // Create landing sounds - generally lower frequency, shorter duration
        const landingSounds = {
            'default': { frequency: 100, duration: 0.1, type: 'triangle' },
            'water': { frequency: 80, duration: 0.15, type: 'sine' },
            'soft': { frequency: 120, duration: 0.08, type: 'triangle' },
            'hard': { frequency: 60, duration: 0.12, type: 'square' }
        };
        
        Object.entries(landingSounds).forEach(([surface, config]) => {
            this.sounds.set(`landing_${surface}`, config);
        });
    }
    
    playSound(soundKey, options = {}) {
        if (this.muted) return;
        
        const soundConfig = this.sounds.get(soundKey);
        if (!soundConfig) {
            console.warn(`Sound '${soundKey}' not found`);
            return;
        }
        
        if (this.audioContext) {
            this.playGeneratedSound(soundConfig, options);
        } else {
            // Fallback: could use HTML5 audio here
            console.warn('No audio context available');
        }
    }
    
    playGeneratedSound(config, options = {}) {
        // Resume audio context if suspended (required by browser autoplay policies)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Configure oscillator
        oscillator.type = config.type || 'sine';
        oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);
        
        // Configure envelope
        const now = this.audioContext.currentTime;
        const duration = options.duration || config.duration || 0.2;
        const volume = (options.volume || this.volume) * 0.3; // Scale down to avoid being too loud
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.01); // Quick attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Exponential decay
        
        // Connect audio graph
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Start and stop
        oscillator.start(now);
        oscillator.stop(now + duration);
    }
    
    playJumpSound(animalName) {
        const soundKey = `jump_${animalName}`;
        this.playSound(soundKey);
    }
    
    playLandingSound(surfaceType = 'default') {
        const soundKey = `landing_${surfaceType}`;
        this.playSound(soundKey);
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
    
    setMuted(muted) {
        this.muted = muted;
    }
    
    isMuted() {
        return this.muted;
    }
    
    getVolume() {
        return this.volume;
    }
    
    // Load actual audio files (for future use)
    async loadAudioFile(url, soundKey) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            
            if (this.audioContext) {
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.sounds.set(soundKey, { buffer: audioBuffer, type: 'file' });
            }
        } catch (error) {
            console.error(`Failed to load audio file ${url}:`, error);
        }
    }
    
    // Play audio file (for future use)
    playAudioFile(soundKey, options = {}) {
        const soundData = this.sounds.get(soundKey);
        if (!soundData || !soundData.buffer) return;
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = soundData.buffer;
        gainNode.gain.value = (options.volume || this.volume) * 0.5;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start();
    }
}