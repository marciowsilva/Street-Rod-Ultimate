// js/AudioManager.js
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.isMuted = false;
        this.volume = {
            music: 0.5,
            sfx: 0.7
        };
        
        this.init();
    }
    
    init() {
        // Carregar configurações salvas
        const savedSettings = localStorage.getItem('streetrod2_audio_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.volume = settings.volume || this.volume;
            this.isMuted = settings.isMuted || false;
        }
    }
    
    preloadSounds(soundList) {
        // soundList é um array de objetos {id: string, url: string, type: 'sfx'|'music', loop: boolean}
        soundList.forEach(soundDef => {
            const audio = new Audio();
            audio.src = soundDef.url;
            audio.loop = soundDef.loop || false;
            audio.preload = 'auto';
            
            if (soundDef.type === 'music') {
                this.music = audio;
                audio.volume = this.volume.music * (this.isMuted ? 0 : 1);
            } else {
                this.sounds[soundDef.id] = audio;
                audio.volume = this.volume.sfx * (this.isMuted ? 0 : 1);
            }
        });
    }
    
    playSound(id, restart = true) {
        if (this.isMuted || !this.sounds[id]) return;
        
        const sound = this.sounds[id];
        sound.currentTime = 0;
        sound.play().catch(e => console.log(`Audio play failed: ${e}`));
    }
    
    stopSound(id) {
        if (this.sounds[id]) {
            this.sounds[id].pause();
            this.sounds[id].currentTime = 0;
        }
    }
    
    playMusic(id) {
        if (this.isMuted) return;
        
        if (this.music) {
            this.music.pause();
        }
        
        if (this.sounds[id]) {
            this.music = this.sounds[id];
            this.music.loop = true;
            this.music.volume = this.volume.music;
            this.music.play().catch(e => console.log(`Music play failed: ${e}`));
        }
    }
    
    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }
    }
    
    setVolume(type, value) {
        this.volume[type] = Math.max(0, Math.min(1, value));
        
        if (type === 'music' && this.music) {
            this.music.volume = this.volume.music * (this.isMuted ? 0 : 1);
        } else if (type === 'sfx') {
            Object.values(this.sounds).forEach(sound => {
                sound.volume = this.volume.sfx * (this.isMuted ? 0 : 1);
            });
        }
        
        this.saveSettings();
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        const multiplier = this.isMuted ? 0 : 1;
        
        if (this.music) {
            this.music.volume = this.volume.music * multiplier;
        }
        
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume.sfx * multiplier;
        });
        
        this.saveSettings();
        return this.isMuted;
    }
    
    saveSettings() {
        localStorage.setItem('streetrod2_audio_settings', JSON.stringify({
            volume: this.volume,
            isMuted: this.isMuted
        }));
    }
}

// Exportar instância singleton
const audioManager = new AudioManager();