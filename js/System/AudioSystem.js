// AudioSystem.js - Premium SFX System
class AudioSystem {
  constructor() {
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.sfxVolume = 0.5;
    this.musicVolume = 0.3;

    // Use synthesized sounds or base64 files to avoid 404s since we don't have real assets
    this.sounds = {
      hover: this.createSynthSound("hover"),
      click: this.createSynthSound("click"),
      success: this.createSynthSound("success"),
      error: this.createSynthSound("error"),
      buy: this.createSynthSound("buy"),
    };

    this.loadSettings();
    this.attachGlobalInteractions();
  }

  loadSettings() {
    try {
      const saved = JSON.parse(
        localStorage.getItem("streetrod2_settings") || "{}",
      );
      if (saved.audio) {
        this.sfxEnabled = saved.audio.enabled;
        this.sfxVolume = saved.audio.sfxVolume / 100;
        this.musicVolume = saved.audio.musicVolume / 100;
      }
    } catch (e) {}
  }

  // Create simple synthesized UI sounds
  createSynthSound(type) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    // We don't initialize context immediately to respect browser autoplay policies
    return type;
  }

  playSynth(type) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!this.ctx) {
      this.ctx = new AudioContext();
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    const now = this.ctx.currentTime;

    if (type === "hover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
      gainNode.gain.setValueAtTime(this.sfxVolume * 0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "click") {
      osc.type = "square";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gainNode.gain.setValueAtTime(this.sfxVolume * 0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "success" || type === "buy") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(600, now + 0.1);
      osc.frequency.setValueAtTime(800, now + 0.2);
      gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "error") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.setValueAtTime(150, now + 0.2);
      gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  }

  play(soundName) {
    this.loadSettings(); // update in case changed
    if (!this.sfxEnabled) return;

    if (this.sounds[soundName]) {
      this.playSynth(soundName);
    }
  }

  attachGlobalInteractions() {
    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest(
        "button, .nav-btn, .st-tab-btn, .car-card, .filter-btn, .rs-track-card, .rs-opt, .menu-item",
      );
      if (target && !target.dataset.hovered) {
        this.play("hover");
        target.dataset.hovered = "true";
        target.addEventListener(
          "mouseleave",
          () => delete target.dataset.hovered,
          { once: true },
        );
      }
    });

    document.addEventListener("click", (e) => {
      const target = e.target.closest(
        "button, .nav-btn, .st-tab-btn, .filter-btn, .rs-opt, .menu-item",
      );
      if (target) {
        // Assume default click
        if (
          target.classList.contains("purchase-btn") ||
          target.innerText.includes("COMPRAR")
        ) {
          this.play("buy");
        } else {
          this.play("click");
        }
      }
    });
  }
}

// Initialize
if (typeof window !== "undefined") {
  window.audioSystem = new AudioSystem();
}
