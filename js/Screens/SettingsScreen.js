// SettingsScreen.js - Tela de Configurações
console.log('⚙️ Carregando SettingsScreen...');

class SettingsScreen {
    constructor() {
        this.screenId = 'settings-screen';
        this.settings = this.loadSettings();
        console.log('✅ SettingsScreen inicializado');
    }
    
    loadSettings() {
        const defaultSettings = {
            audio: {
                musicVolume: 80,
                sfxVolume: 90,
                enabled: true
            },
            graphics: {
                quality: 'medium',
                shadows: true,
                reflections: true
            },
            controls: {
                layout: 'default',
                sensitivity: 50,
                vibration: true
            },
            game: {
                difficulty: 'normal',
                language: 'pt-BR',
                autosave: true
            }
        };
        
        try {
            const saved = localStorage.getItem('streetrod2_settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            return defaultSettings;
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('streetrod2_settings', JSON.stringify(this.settings));
            return true;
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            return false;
        }
    }
    
    initialize() {
        console.log('⚙️ Inicializando tela de configurações');
        this.createSettingsScreen();
        this.attachEvents();
    }
    
    createSettingsScreen() {
        const container = document.getElementById('game-container');
        if (!container) return;
        
        container.innerHTML = `
            <div id="settings-screen" style="
                min-height: 100vh;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                padding: 30px;
                color: white;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h1 style="color: #ff4757; font-size: 2.5rem;">⚙️ CONFIGURAÇÕES</h1>
                    <button id="back-button" style="
                        padding: 10px 20px;
                        background: #333;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-family: 'Rajdhani', sans-serif;
                        font-weight: bold;
                    ">
                        VOLTAR
                    </button>
                </div>
                
                <div style="
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    padding: 30px;
                    max-width: 800px;
                    margin: 0 auto;
                ">
                    <!-- Abas -->
                    <div style="display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px;">
                        <button class="tab-btn active" data-tab="audio">🎵 Áudio</button>
                        <button class="tab-btn" data-tab="graphics">🖥️ Gráficos</button>
                        <button class="tab-btn" data-tab="controls">🎮 Controles</button>
                        <button class="tab-btn" data-tab="game">🎮 Jogo</button>
                    </div>
                    
                    <!-- Conteúdo das abas -->
                    <div id="tab-content" style="min-height: 400px;">
                        <!-- O conteúdo será carregado dinamicamente -->
                    </div>
                    
                    <!-- Botões de ação -->
                    <div style="display: flex; gap: 15px; margin-top: 40px; justify-content: center;">
                        <button id="save-button" style="
                            padding: 12px 25px;
                            background: #2ed573;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 1rem;
                            cursor: pointer;
                            font-weight: bold;
                        ">
                            💾 SALVAR
                        </button>
                        
                        <button id="default-button" style="
                            padding: 12px 25px;
                            background: #1e90ff;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 1rem;
                            cursor: pointer;
                        ">
                            🔄 PADRÃO
                        </button>
                        
                        <button id="reset-button" style="
                            padding: 12px 25px;
                            background: #ff4757;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 1rem;
                            cursor: pointer;
                        ">
                            🗑️ RESETAR
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Carregar primeira aba
        this.showTab('audio');
        
        // Adicionar estilos
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tab-btn {
                padding: 10px 20px;
                background: #333;
                color: white;
                border: none;
                border-radius: 6px 6px 0 0;
                cursor: pointer;
                font-family: 'Rajdhani', sans-serif;
                font-weight: bold;
                transition: all 0.3s;
            }
            
            .tab-btn:hover {
                background: #444;
            }
            
            .tab-btn.active {
                background: #ff4757;
                color: white;
            }
            
            .setting-item {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .setting-label {
                color: white;
                font-size: 1.1rem;
                font-weight: 500;
            }
            
            .setting-description {
                color: #aaa;
                font-size: 0.9rem;
                margin-top: 5px;
            }
            
            .slider-container {
                width: 200px;
            }
            
            .slider {
                width: 100%;
                height: 8px;
                background: #333;
                border-radius: 4px;
                outline: none;
                -webkit-appearance: none;
            }
            
            .slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                background: #ff4757;
                border-radius: 50%;
                cursor: pointer;
            }
            
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 30px;
            }
            
            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #333;
                transition: .4s;
                border-radius: 34px;
            }
            
            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 22px;
                width: 22px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            
            input:checked + .toggle-slider {
                background-color: #2ed573;
            }
            
            input:checked + .toggle-slider:before {
                transform: translateX(30px);
            }
            
            .select-dropdown {
                padding: 8px 15px;
                background: #333;
                color: white;
                border: none;
                border-radius: 6px;
                font-family: 'Rajdhani', sans-serif;
                min-width: 150px;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    showTab(tabName) {
        // Atualizar botões da aba
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Mostrar conteúdo da aba
        const content = document.getElementById('tab-content');
        
        switch(tabName) {
            case 'audio':
                content.innerHTML = this.createAudioTab();
                break;
            case 'graphics':
                content.innerHTML = this.createGraphicsTab();
                break;
            case 'controls':
                content.innerHTML = this.createControlsTab();
                break;
            case 'game':
                content.innerHTML = this.createGameTab();
                break;
        }
        
        // Reanexar eventos dos controles
        this.attachControlEvents();
    }
    
    createAudioTab() {
        const audio = this.settings.audio;
        return `
            <h2 style="color: white; margin-bottom: 20px;">Configurações de Áudio</h2>
            
            <div class="setting-item">
                <div>
                    <div class="setting-label">Volume da Música</div>
                    <div class="setting-description">Volume da trilha sonora do jogo</div>
                </div>
                <div class="slider-container">
                    <input type="range" min="0" max="100" value="${audio.musicVolume}" 
                           class="slider" id="music-volume">
                    <div style="color: white; text-align: center; margin-top: 5px;">
                        <span id="music-volume-value">${audio.musicVolume}%</span>
                    </div>
                </div>
            </div>
            
            <div class="setting-item">
                <div>
                    <div class="setting-label">Volume de Efeitos</div>
                    <div class="setting-description">Volume dos efeitos sonoros</div>
                </div>
                <div class="slider-container">
                    <input type="range" min="0" max="100" value="${audio.sfxVolume}" 
                           class="slider" id="sfx-volume">
                    <div style="color: white; text-align: center; margin-top: 5px;">
                        <span id="sfx-volume-value">${audio.sfxVolume}%</span>
                    </div>
                </div>
            </div>
            
            <div class="setting-item">
                <div>
                    <div class="setting-label">Áudio Habilitado</div>
                    <div class="setting-description">Ativar/desativar todos os sons</div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="audio-enabled" ${audio.enabled ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `;
    }
    
    createGraphicsTab() {
        const graphics = this.settings.graphics;
        const qualityOptions = {
            'low': 'Baixo',
            'medium': 'Médio', 
            'high': 'Alto',
            'ultra': 'Ultra'
        };
        
        let qualityOptionsHTML = '';
        for (const [value, label] of Object.entries(qualityOptions)) {
            qualityOptionsHTML += `<option value="${value}" ${graphics.quality === value ? 'selected' : ''}>${label}</option>`;
        }
        
        return `
            <h2 style="color: white; margin-bottom: 20px;">Configurações Gráficas</h2>
            
            <div class="setting-item">
                <div>
                    <div class="setting-label">Qualidade Gráfica</div>
                    <div class="setting-description">Ajusta qualidade visual e performance</div>
                </div>
                <select class="select-dropdown" id="graphics-quality">
                    ${qualityOptionsHTML}
                </select>
            </div>
            
            <div class="setting-item">
                <div>
                    <div class="setting-label">Sombras</div>
                    <div class="setting-description">Ativar/desativar sombras</div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="shadows-enabled" ${graphics.shadows ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            
            <div class="setting-item">
                <div>
                    <div class="setting-label">Reflexos</div>
                    <div class="setting-description">Reflexos em veículos e superfícies</div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="reflections-enabled" ${graphics.reflections ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `;
    }
    
    createControlsTab() {
        const controls = this.settings.controls;
        return `
            <h2 style="color: white; margin-bottom: 20px;">Configurações de Controle</h2>
            
            <div class="setting-item">
                <div>
                    <div class="setting-label">Sensibilidade</div>
                    <div class="setting-description">Sensibilidade dos controles de direção</div>
                </div>
                <div class="slider-container">
                    <input type="range" min="1" max="100" value="${controls.sensitivity}" 
                           class="slider" id="control-sensitivity">
                    <div style="color: white; text-align: center; margin-top: 5px;">
                        <span id="sensitivity-value">${controls.sensitivity}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    createGameTab() {
        const game = this.settings.game;
        return `
            <h2 style="color: white; margin-bottom: 20px;">Configurações do Jogo</h2>
            
            <div class="setting-item">
                <div>
                    <div class="setting-label">Dificuldade</div>
                    <div class="setting-description">Nível de dificuldade da IA</div>
                </div>
                <select class="select-dropdown" id="game-difficulty">
                    <option value="easy" ${game.difficulty === 'easy' ? 'selected' : ''}>Fácil</option>
                    <option value="normal" ${game.difficulty === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="hard" ${game.difficulty === 'hard' ? 'selected' : ''}>Difícil</option>
                </select>
            </div>
        `;
    }
    
    attachEvents() {
        // Botão VOLTAR
        const backBtn = document.getElementById('back-button');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (window.eventSystem && window.eventSystem.showScreen) {
                    window.eventSystem.showScreen('main-menu');
                }
            });
        }
        
        // Botões das abas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showTab(e.target.dataset.tab);
            });
        });
        
        // Botão SALVAR
        const saveBtn = document.getElementById('save-button');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveCurrentSettings();
                if (window.eventSystem && window.eventSystem.showNotification) {
                    window.eventSystem.showNotification('Configurações salvas!', 'success');
                } else {
                    alert('Configurações salvas com sucesso!');
                }
            });
        }
        
        // Botão PADRÃO
        const defaultBtn = document.getElementById('default-button');
        if (defaultBtn) {
            defaultBtn.addEventListener('click', () => {
                if (confirm('Restaurar configurações padrão?')) {
                    this.restoreDefaults();
                }
            });
        }
        
        // Botão RESETAR
        const resetBtn = document.getElementById('reset-button');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja resetar TODAS as configurações?')) {
                    this.resetSettings();
                }
            });
        }
    }
    
    attachControlEvents() {
        // Atualizar valores dos sliders em tempo real
        const musicSlider = document.getElementById('music-volume');
        const sfxSlider = document.getElementById('sfx-volume');
        const sensitivitySlider = document.getElementById('control-sensitivity');
        
        if (musicSlider) {
            musicSlider.addEventListener('input', (e) => {
                document.getElementById('music-volume-value').textContent = e.target.value + '%';
            });
        }
        
        if (sfxSlider) {
            sfxSlider.addEventListener('input', (e) => {
                document.getElementById('sfx-volume-value').textContent = e.target.value + '%';
            });
        }
        
        if (sensitivitySlider) {
            sensitivitySlider.addEventListener('input', (e) => {
                document.getElementById('sensitivity-value').textContent = e.target.value;
            });
        }
    }
    
    saveCurrentSettings() {
        // Áudio
        this.settings.audio = {
            musicVolume: parseInt(document.getElementById('music-volume').value) || 80,
            sfxVolume: parseInt(document.getElementById('sfx-volume').value) || 90,
            enabled: document.getElementById('audio-enabled').checked
        };
        
        // Gráficos
        this.settings.graphics = {
            quality: document.getElementById('graphics-quality').value,
            shadows: document.getElementById('shadows-enabled').checked,
            reflections: document.getElementById('reflections-enabled').checked
        };
        
        // Controles
        this.settings.controls = {
            layout: 'default',
            sensitivity: parseInt(document.getElementById('control-sensitivity').value) || 50,
            vibration: true
        };
        
        // Jogo
        this.settings.game = {
            difficulty: document.getElementById('game-difficulty').value,
            language: 'pt-BR',
            autosave: true
        };
        
        // Salvar
        this.saveSettings();
        console.log('✅ Configurações salvas');
    }
    
    restoreDefaults() {
        this.settings = {
            audio: {
                musicVolume: 80,
                sfxVolume: 90,
                enabled: true
            },
            graphics: {
                quality: 'medium',
                shadows: true,
                reflections: true
            },
            controls: {
                layout: 'default',
                sensitivity: 50,
                vibration: true
            },
            game: {
                difficulty: 'normal',
                language: 'pt-BR',
                autosave: true
            }
        };
        
        this.saveSettings();
        this.showTab('audio'); // Recarregar aba atual
        
        if (window.eventSystem && window.eventSystem.showNotification) {
            window.eventSystem.showNotification('Configurações restauradas para padrão!', 'success');
        }
    }
    
    resetSettings() {
        localStorage.removeItem('streetrod2_settings');
        this.settings = this.loadSettings();
        this.showTab('audio');
        
        if (window.eventSystem && window.eventSystem.showNotification) {
            window.eventSystem.showNotification('Todas as configurações foram resetadas!', 'success');
        }
    }
    
    cleanup() {
        console.log('🧹 Limpando SettingsScreen');
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.settingsScreen = new SettingsScreen();
    window.SettingsScreen = SettingsScreen;
    console.log('✅ SettingsScreen exportado para window');
}