// SettingsScreen.js - VERSÃO PREMIUM HUD
class SettingsScreen {
  constructor() {
    this.screenId = "settings";
    this.settings = this.loadSettings();
    this.currentTab = "audio";
  }

  loadSettings() {
    const defaultSettings = {
      audio: { musicVolume: 80, sfxVolume: 90, enabled: true },
      graphics: {
        quality: "high",
        shadows: true,
        reflections: true,
        animations: true,
      },
      controls: { layout: "classic", sensitivity: 70, vibration: true },
      game: { difficulty: "normal", language: "pt-BR", autosave: true },
    };

    try {
      const saved = JSON.parse(
        localStorage.getItem("streetrod2_settings") || "{}",
      );
      const merged = {};
      // Deep merge (1 level) para garantir que propriedades novas/faltantes não quebrem a tela
      for (const cat in defaultSettings) {
        merged[cat] = saved[cat]
          ? { ...defaultSettings[cat], ...saved[cat] }
          : { ...defaultSettings[cat] };
      }
      return merged;
    } catch (error) {
      return defaultSettings;
    }
  }

  saveSettings() {
    try {
      localStorage.setItem(
        "streetrod2_settings",
        JSON.stringify(this.settings),
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  show() {
    this.render();
  }

  render() {
    const container = document.getElementById("game-container");
    if (!container) return;

    if (!document.getElementById("settings-container")) {
      const bgUrl =
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070";

      container.innerHTML = `
            <div id="settings-container" class="ps-root" style="
                background: url('${bgUrl}') center/cover no-repeat;
                height: 100vh;
                display: flex;
                flex-direction: column;
                position: relative;
                overflow: hidden;
                font-family: 'Rajdhani', sans-serif;
                color: #fff;
            ">
                <div class="ps-glass-overlay" style="
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(10, 10, 25, 0.7) 0%, rgba(5, 5, 10, 0.95) 100%);
                    backdrop-filter: blur(15px);
                    z-index: 0;
                "></div>

                <header class="ps-header anim-fade-down" style="position: relative; z-index: 10; padding: 40px 0 20px; text-align: center;">
                    <h1 class="ps-game-title" style="font-size: 3.5rem; font-weight: 800; letter-spacing: 8px; margin: 0; text-shadow: 0 0 30px rgba(255, 71, 87, 0.5);">
                        SISTEMA DE <span class="ps-accent-text" style="color: #ff4757;">AJUSTES</span>
                    </h1>
                    <p class="ps-game-subtitle" style="color: #aaa; font-size: 1.1rem; letter-spacing: 4px; margin-top: 5px; text-transform: uppercase;">CONFIGURAÇÕES GLOBAIS</p>
                </header>

                <main class="settings-content anim-fade-up" style="position: relative; z-index: 10; flex: 1; display: flex; flex-direction: column; max-width: 1000px; margin: 0 auto; width: 90%;">
                    <nav class="settings-tabs" id="settings-tabs" style="display: flex; gap: 15px; margin-bottom: 25px;">
                        <!-- Tabs Dinâmicas -->
                    </nav>

                    <div id="settings-panel" style="
                        background: rgba(255, 255, 255, 0.03);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 20px;
                        padding: 40px;
                        flex: 1;
                        overflow-y: auto;
                        backdrop-filter: blur(10px);
                        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                        margin-bottom: 40px;
                    ">
                        <!-- Conteúdo Dinâmico -->
                    </div>
                </main>

                <footer style="position: relative; z-index: 10; padding: 25px; background: rgba(0, 0, 0, 0.4); border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: center; gap: 20px;">
                    <button id="st-cancel-btn" class="st-btn-secondary">VOLTAR</button>
                    <button id="st-default-btn" class="st-btn-secondary">PADRÃO</button>
                    <button id="st-save-btn" class="st-btn-primary">SALVAR</button>
                </footer>
            </div>
        `;

      this.addStyles();
      this.attachGlobalEvents();
    }

    this.updateTabs();
    this.updatePanel();
  }

  updateTabs() {
    const tabsContainer = document.getElementById("settings-tabs");
    if (!tabsContainer) return;

    tabsContainer.innerHTML = `
        <button class="st-tab-btn ${this.currentTab === "audio" ? "active" : ""}" data-tab="audio">🔊 ÁUDIO</button>
        <button class="st-tab-btn ${this.currentTab === "graphics" ? "active" : ""}" data-tab="graphics">🖥️ VÍDEO</button>
        <button class="st-tab-btn ${this.currentTab === "controls" ? "active" : ""}" data-tab="controls">🎮 CONTROLES</button>
        <button class="st-tab-btn ${this.currentTab === "game" ? "active" : ""}" data-tab="game">⚙️ JOGO</button>
    `;

    document.querySelectorAll(".st-tab-btn").forEach((btn) => {
      btn.onclick = () => {
        if (this.currentTab === btn.dataset.tab) return;
        this.currentTab = btn.dataset.tab;
        this.updateTabs();
        this.updatePanel();
      };
    });
  }

  attachGlobalEvents() {
    const cancel = document.getElementById("st-cancel-btn");
    if (cancel)
      cancel.onclick = () => window.eventSystem?.showScreen("main-menu");

    const def = document.getElementById("st-default-btn");
    if (def)
      def.onclick = () => {
        if (confirm("Restaurar padrões?")) {
          localStorage.removeItem("streetrod2_settings");
          this.settings = this.loadSettings();
          this.updatePanel();
        }
      };

    const save = document.getElementById("st-save-btn");
    if (save)
      save.onclick = () => {
        this.saveSettings();
        window.eventSystem?.showNotification?.("Salvo!", "success");
        setTimeout(() => window.eventSystem?.showScreen("main-menu"), 500);
      };
  }

  addStyles() {
    if (document.getElementById("st-premium-styles")) return;
    const style = document.createElement("style");
    style.id = "st-premium-styles";
    style.textContent = `
        .st-tab-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #aaa; padding: 12px 25px; border-radius: 10px; cursor: pointer; font-family: inherit; font-weight: 700; transition: 0.3s; }
        .st-tab-btn.active { background: #ff4757; border-color: #ff4757; color: white; box-shadow: 0 0 20px rgba(255, 71, 87, 0.3); }
        .st-setting-row { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .st-info h3 { margin: 0; font-size: 1.1rem; color: #fff; }
        .st-info p { margin: 5px 0 0; font-size: 0.8rem; color: #777; }
        .st-control { display: flex; align-items: center; gap: 15px; }
        .st-range { -webkit-appearance: none; width: 150px; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 5px; }
        .st-range::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: #ff4757; border-radius: 50%; cursor: pointer; }
        .st-range-val { font-weight: 800; color: #ff4757; min-width: 40px; text-align: right; }
        .st-toggle { width: 50px; height: 26px; background: rgba(0, 0, 0, 0.3); border-radius: 50px; position: relative; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.1); }
        .st-toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: 0.3s; }
        .st-toggle.on { background: #2ed573; border-color: #2ed573; }
        .st-toggle.on::after { transform: translateX(24px); }
        .st-select { background: rgba(0, 0, 0, 0.3); color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 15px; border-radius: 8px; font-family: inherit; cursor: pointer; }
        .st-btn-primary { background: #ff4757; color: #fff; border: none; padding: 12px 30px; border-radius: 10px; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .st-btn-secondary { background: rgba(255, 255, 255, 0.05); color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 25px; border-radius: 10px; font-weight: 700; cursor: pointer; }
    `;
    document.head.appendChild(style);
  }

  updatePanel() {
    const panel = document.getElementById("settings-panel");
    if (!panel) return;

    let html = "";
    if (this.currentTab === "audio") {
      html = `
        <div class="st-setting-row"><div class="st-info"><h3>MÚSICA</h3><p>Volume da trilha sonora.</p></div>
        <div class="st-control"><input type="range" class="st-range" id="vol-music" min="0" max="100" value="${this.settings.audio.musicVolume}"><span class="st-range-val">${this.settings.audio.musicVolume}%</span></div></div>
        <div class="st-setting-row"><div class="st-info"><h3>EFEITOS (SFX)</h3><p>Roncos e sons da UI.</p></div>
        <div class="st-control"><input type="range" class="st-range" id="vol-sfx" min="0" max="100" value="${this.settings.audio.sfxVolume}"><span class="st-range-val">${this.settings.audio.sfxVolume}%</span></div></div>
        <div class="st-setting-row"><div class="st-info"><h3>ÁUDIO GERAL</h3><p>Habilitar sons.</p></div>
        <div class="st-control"><div class="st-toggle ${this.settings.audio.enabled ? "on" : ""}" id="toggle-audio"></div></div></div>
      `;
    } else if (this.currentTab === "graphics") {
      html = `
        <div class="st-setting-row"><div class="st-info"><h3>QUALIDADE</h3><p>Nível de detalhes.</p></div>
        <div class="st-control"><select class="st-select" id="sel-quality">
            <option value="low" ${this.settings.graphics.quality === "low" ? "selected" : ""}>BAIXA</option>
            <option value="medium" ${this.settings.graphics.quality === "medium" ? "selected" : ""}>MÉDIA</option>
            <option value="high" ${this.settings.graphics.quality === "high" ? "selected" : ""}>ALTA</option>
        </select></div></div>
        <div class="st-setting-row"><div class="st-info"><h3>SOMBRAS</h3><p>Sombras dinâmicas.</p></div>
        <div class="st-control"><div class="st-toggle ${this.settings.graphics.shadows ? "on" : ""}" id="toggle-shadows"></div></div></div>
        <div class="st-setting-row"><div class="st-info"><h3>REFLEXOS</h3><p>Reflexos no cockpit.</p></div>
        <div class="st-control"><div class="st-toggle ${this.settings.graphics.reflections ? "on" : ""}" id="toggle-reflections"></div></div></div>
      `;
    } else if (this.currentTab === "controls") {
      html = `
        <div class="st-setting-row"><div class="st-info"><h3>LAYOUT</h3><p>Teclas de controle.</p></div>
        <div class="st-control"><select class="st-select" id="sel-layout">
            <option value="classic" ${this.settings.controls.layout === "classic" ? "selected" : ""}>CLÁSSICO</option>
            <option value="wasd" ${this.settings.controls.layout === "wasd" ? "selected" : ""}>WASD</option>
        </select></div></div>
        <div class="st-setting-row"><div class="st-info"><h3>SENSIBILIDADE</h3><p>Resposta da direção.</p></div>
        <div class="st-control"><input type="range" class="st-range" id="ctl-sens" min="1" max="100" value="${this.settings.controls.sensitivity}"><span class="st-range-val">${this.settings.controls.sensitivity}</span></div></div>
      `;
    } else {
      html = `
        <div class="st-setting-row"><div class="st-info"><h3>IA</h3><p>Dificuldade dos rivais.</p></div>
        <div class="st-control"><select class="st-select" id="sel-diff">
            <option value="easy" ${this.settings.game.difficulty === "easy" ? "selected" : ""}>FÁCIL</option>
            <option value="normal" ${this.settings.game.difficulty === "normal" ? "selected" : ""}>MÉDIO</option>
            <option value="hard" ${this.settings.game.difficulty === "hard" ? "selected" : ""}>DIFÍCIL</option>
        </select></div></div>
        <div class="st-setting-row"><div class="st-info"><h3>AUTO-SALVAR</h3><p>Salvar após ações.</p></div>
        <div class="st-control"><div class="st-toggle ${this.settings.game.autosave ? "on" : ""}" id="toggle-save"></div></div></div>
      `;
    }

    panel.innerHTML = html;
    this.attachPanelEvents();
  }

  attachPanelEvents() {
    const music = document.getElementById("vol-music");
    if (music)
      music.oninput = (e) => {
        this.settings.audio.musicVolume = parseInt(e.target.value);
        e.target.nextElementSibling.textContent = e.target.value + "%";
      };

    const sfx = document.getElementById("vol-sfx");
    if (sfx)
      sfx.oninput = (e) => {
        this.settings.audio.sfxVolume = parseInt(e.target.value);
        e.target.nextElementSibling.textContent = e.target.value + "%";
      };

    const sens = document.getElementById("ctl-sens");
    if (sens)
      sens.oninput = (e) => {
        this.settings.controls.sensitivity = parseInt(e.target.value);
        e.target.nextElementSibling.textContent = e.target.value;
      };

    const tAudio = document.getElementById("toggle-audio");
    if (tAudio)
      tAudio.onclick = () => {
        this.settings.audio.enabled = !this.settings.audio.enabled;
        tAudio.classList.toggle("on");
      };

    const tShadows = document.getElementById("toggle-shadows");
    if (tShadows)
      tShadows.onclick = () => {
        this.settings.graphics.shadows = !this.settings.graphics.shadows;
        tShadows.classList.toggle("on");
      };

    const tRefl = document.getElementById("toggle-reflections");
    if (tRefl)
      tRefl.onclick = () => {
        this.settings.graphics.reflections =
          !this.settings.graphics.reflections;
        tRefl.classList.toggle("on");
      };

    const tSave = document.getElementById("toggle-save");
    if (tSave)
      tSave.onclick = () => {
        this.settings.game.autosave = !this.settings.game.autosave;
        tSave.classList.toggle("on");
      };

    const sQuality = document.getElementById("sel-quality");
    if (sQuality)
      sQuality.onchange = (e) =>
        (this.settings.graphics.quality = e.target.value);

    const sLayout = document.getElementById("sel-layout");
    if (sLayout)
      sLayout.onchange = (e) =>
        (this.settings.controls.layout = e.target.value);

    const sDiff = document.getElementById("sel-diff");
    if (sDiff)
      sDiff.onchange = (e) => (this.settings.game.difficulty = e.target.value);
  }

  hide() {
    this.isActive = false;
    const container = document.getElementById("settings-container");
    if (container) container.remove();
  }

  cleanup() {
    this.hide();
  }
}

if (typeof window !== "undefined") {
  window.settingsScreen = new SettingsScreen();
  window.SettingsScreen = SettingsScreen;
}
