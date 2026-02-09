// SettingsScreen.js - Nova tela para configurações do sistema
class SettingsScreen {
    constructor(eventSystem) {
        console.log('⚙️ Criando SettingsScreen');
        this.eventSystem = eventSystem;
        this.isVisible = false;
    }

    show() {
        console.log('🖥️ Mostrando SettingsScreen');
        this.isVisible = true;
        return this;
    }

    hide() {
        console.log('👋 Escondendo SettingsScreen');
        this.isVisible = false;
    }

    render() {
        // Obter perfil atual para dificuldade
        const profile = window.profileManager ? window.profileManager.getCurrentProfile() : null;
        const currentDifficulty = profile ? profile.settings?.difficulty || 'medium' : 'medium';
        
        // Obter configurações de sistema do localStorage
        const systemSettings = this.getSystemSettings();

        return `
            <!-- Container Principal -->
            <div style="
                min-height: 100vh;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            ">
                
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 30px; width: 100%;">
                    <button id="back-btn" style="
                        position: absolute;
                        top: 20px;
                        left: 20px;
                        background: rgba(255, 255, 255, 0.1);
                        color: #aaa;
                        border: 1px solid #555;
                        border-radius: 8px;
                        padding: 10px 15px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-family: 'Rajdhani', sans-serif;
                        transition: all 0.2s;
                    ">
                        ← VOLTAR
                    </button>

                    <h1 style="
                        color: #2ed573;
                        font-size: 2.2rem;
                        margin-bottom: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 15px;
                    ">
                        <span>⚙️</span>
                        CONFIGURAÇÕES DO SISTEMA
                    </h1>
                    <div style="color: #aaa; font-size: 1rem; max-width: 600px; margin: 0 auto;">
                        Configurações gerais do jogo
                    </div>
                </div>

                <!-- Formulário de Configurações -->
                <div style="
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    padding: 30px;
                    width: 100%;
                    max-width: 600px;
                    border: 2px solid rgba(46, 213, 115, 0.3);
                ">
                    <!-- Configurações de Áudio (SISTEMA) -->
                    <div style="margin-bottom: 30px;">
                        <h2 style="
                            color: #1e90ff;
                            border-left: 4px solid #1e90ff;
                            padding-left: 10px;
                            margin-bottom: 20px;
                            font-size: 1.3rem;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        ">
                            🔊 CONFIGURAÇÕES DE ÁUDIO
                        </h2>
                        
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: #aaa; font-weight: bold;">Volume da Música</span>
                                <span id="music-value" style="color: #1e90ff; font-weight: bold;">${Math.round(systemSettings.musicVolume * 100)}%</span>
                            </div>
                            <input type="range" id="music-volume" min="0" max="100" value="${Math.round(systemSettings.musicVolume * 100)}" style="
                                width: 100%;
                                height: 10px;
                                background: rgba(30, 144, 255, 0.2);
                                border-radius: 5px;
                                outline: none;
                            ">
                            <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 0.8rem; color: #666;">
                                <span>0%</span>
                                <span>100%</span>
                            </div>
                        </div>
                        
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: #aaa; font-weight: bold;">Volume dos Efeitos</span>
                                <span id="sfx-value" style="color: #1e90ff; font-weight: bold;">${Math.round(systemSettings.sfxVolume * 100)}%</span>
                            </div>
                            <input type="range" id="sfx-volume" min="0" max="100" value="${Math.round(systemSettings.sfxVolume * 100)}" style="
                                width: 100%;
                                height: 10px;
                                background: rgba(30, 144, 255, 0.2);
                                border-radius: 5px;
                                outline: none;
                            ">
                            <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 0.8rem; color: #666;">
                                <span>0%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Dificuldade (PERFIL) -->
                    <div style="margin-bottom: 30px;">
                        <h2 style="
                            color: #ffcc00;
                            border-left: 4px solid #ffcc00;
                            padding-left: 10px;
                            margin-bottom: 20px;
                            font-size: 1.3rem;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        ">
                            🎮 DIFICULDADE (PERFIL ATUAL)
                        </h2>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                            <label class="difficulty-option ${currentDifficulty === 'easy' ? 'selected' : ''}" data-difficulty="easy" style="
                                background: ${currentDifficulty === 'easy' ? 'rgba(46, 213, 115, 0.2)' : 'rgba(46, 213, 115, 0.05)'};
                                border: 2px solid ${currentDifficulty === 'easy' ? '#2ed573' : '#555'};
                                border-radius: 10px;
                                padding: 15px;
                                text-align: center;
                                cursor: pointer;
                                transition: all 0.2s;
                            ">
                                <div style="font-size: 1.8rem; margin-bottom: 8px;">😊</div>
                                <div style="color: ${currentDifficulty === 'easy' ? '#2ed573' : '#aaa'}; font-weight: bold; font-size: 1.1rem;">FÁCIL</div>
                                <div style="color: #888; font-size: 0.85rem; margin-top: 5px;">
                                    +50% recompensa<br>IA mais lenta
                                </div>
                            </label>
                            
                            <label class="difficulty-option ${currentDifficulty === 'medium' ? 'selected' : ''}" data-difficulty="medium" style="
                                background: ${currentDifficulty === 'medium' ? 'rgba(255, 204, 0, 0.2)' : 'rgba(255, 204, 0, 0.05)'};
                                border: 2px solid ${currentDifficulty === 'medium' ? '#ffcc00' : '#555'};
                                border-radius: 10px;
                                padding: 15px;
                                text-align: center;
                                cursor: pointer;
                                transition: all 0.2s;
                            ">
                                <div style="font-size: 1.8rem; margin-bottom: 8px;">😐</div>
                                <div style="color: ${currentDifficulty === 'medium' ? '#ffcc00' : '#aaa'}; font-weight: bold; font-size: 1.1rem;">MÉDIO</div>
                                <div style="color: #888; font-size: 0.85rem; margin-top: 5px;">
                                    Recompensa padrão<br>IA balanceada
                                </div>
                            </label>
                            
                            <label class="difficulty-option ${currentDifficulty === 'hard' ? 'selected' : ''}" data-difficulty="hard" style="
                                background: ${currentDifficulty === 'hard' ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255, 71, 87, 0.05)'};
                                border: 2px solid ${currentDifficulty === 'hard' ? '#ff4757' : '#555'};
                                border-radius: 10px;
                                padding: 15px;
                                text-align: center;
                                cursor: pointer;
                                transition: all 0.2s;
                            ">
                                <div style="font-size: 1.8rem; margin-bottom: 8px;">😠</div>
                                <div style="color: ${currentDifficulty === 'hard' ? '#ff4757' : '#aaa'}; font-weight: bold; font-size: 1.1rem;">DIFÍCIL</div>
                                <div style="color: #888; font-size: 0.85rem; margin-top: 5px;">
                                    +50% XP<br>IA agressiva
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Configurações de Controle -->
                    <div style="margin-bottom: 30px;">
                        <h2 style="
                            color: #7b68ee;
                            border-left: 4px solid #7b68ee;
                            padding-left: 10px;
                            margin-bottom: 20px;
                            font-size: 1.3rem;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        ">
                            🎮 CONTROLES
                        </h2>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; color: #aaa; margin-bottom: 10px;">Tipo de Controle</label>
                            <select id="control-type" style="
                                width: 100%;
                                padding: 12px;
                                background: rgba(123, 104, 238, 0.1);
                                border: 2px solid #7b68ee;
                                border-radius: 8px;
                                color: white;
                                font-family: 'Rajdhani', sans-serif;
                                font-size: 1rem;
                            ">
                                <option value="keyboard" ${systemSettings.controls === 'keyboard' ? 'selected' : ''}>Teclado (Setas/WASD)</option>
                                <option value="mouse" ${systemSettings.controls === 'mouse' ? 'selected' : ''}>Mouse</option>
                                <option value="gamepad" ${systemSettings.controls === 'gamepad' ? 'selected' : ''}>Gamepad</option>
                            </select>
                        </div>
                    </div>

                    <!-- Botões -->
                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button id="save-btn" style="
                            flex: 1;
                            padding: 15px;
                            background: linear-gradient(145deg, #2ed573, #1dd1a1);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            cursor: pointer;
                            font-family: 'Rajdhani', sans-serif;
                            font-weight: bold;
                            font-size: 1.1rem;
                            transition: all 0.3s;
                        ">
                            💾 SALVAR CONFIGURAÇÕES
                        </button>
                        
                        <button id="reset-btn" style="
                            padding: 15px 20px;
                            background: rgba(255, 71, 87, 0.1);
                            color: #ff4757;
                            border: 2px solid #ff4757;
                            border-radius: 10px;
                            cursor: pointer;
                            font-family: 'Rajdhani', sans-serif;
                            font-weight: bold;
                            transition: all 0.3s;
                        ">
                            🔄 PADRÃO
                        </button>
                    </div>
                </div>

                <!-- Informações -->
                <div style="
                    margin-top: 30px;
                    color: #666;
                    font-size: 0.9rem;
                    text-align: center;
                    max-width: 600px;
                    line-height: 1.5;
                ">
                    <p>🔊 Configurações de áudio são globais para todos os perfis</p>
                    <p>🎯 Dificuldade é salva por perfil</p>
                    <p>💾 Configurações são salvas automaticamente</p>
                </div>
            </div>

            <style>
                .difficulty-option:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                }

                .difficulty-option.selected {
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
                }

                #save-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(46, 213, 115, 0.3);
                }

                #reset-btn:hover {
                    background: rgba(255, 71, 87, 0.2);
                    transform: translateY(-3px);
                }

                #back-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                }

                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 22px;
                    height: 22px;
                    background: #1e90ff;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 2px solid white;
                }

                select:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(123, 104, 238, 0.5);
                }
            </style>
        `;
    }

    getSystemSettings() {
        // Obter configurações do localStorage ou usar padrões
        const saved = localStorage.getItem('streetRodSystemSettings');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Erro ao ler configurações do sistema:', e);
            }
        }
        
        // Configurações padrão
        return {
            musicVolume: 0.7,
            sfxVolume: 1.0,
            controls: 'keyboard',
            language: 'pt-BR'
        };
    }

    saveSystemSettings(settings) {
        try {
            localStorage.setItem('streetRodSystemSettings', JSON.stringify(settings));
            console.log('💾 Configurações do sistema salvas:', settings);
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar configurações do sistema:', error);
            return false;
        }
    }

    attachEvents() {
        console.log('🔗 Anexando eventos da SettingsScreen');

        // Botão Voltar
        const backBtn = document.getElementById('back-btn');
        if (backBtn && this.eventSystem) {
            backBtn.onclick = () => {
                console.log('← Voltando para menu anterior');
                this.eventSystem.showScreen('main-menu');
            };
        }

        // Sliders de volume
        const musicSlider = document.getElementById('music-volume');
        const musicValue = document.getElementById('music-value');
        const sfxSlider = document.getElementById('sfx-volume');
        const sfxValue = document.getElementById('sfx-value');

        if (musicSlider && musicValue) {
            musicSlider.addEventListener('input', () => {
                musicValue.textContent = `${musicSlider.value}%`;
            });
        }

        if (sfxSlider && sfxValue) {
            sfxSlider.addEventListener('input', () => {
                sfxValue.textContent = `${sfxSlider.value}%`;
            });
        }

        // Seleção de dificuldade
        let selectedDifficulty = null;
        const profile = window.profileManager ? window.profileManager.getCurrentProfile() : null;
        if (profile && profile.settings) {
            selectedDifficulty = profile.settings.difficulty || 'medium';
        }

        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remover seleção anterior
                document.querySelectorAll('.difficulty-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Adicionar seleção atual
                option.classList.add('selected');
                selectedDifficulty = option.getAttribute('data-difficulty');
                console.log(`🎯 Dificuldade selecionada: ${selectedDifficulty}`);
            });
        });

        // Botão Salvar
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSettings(selectedDifficulty);
            });
        }

        // Botão Resetar
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Deseja redefinir todas as configurações para os valores padrão?')) {
                    this.resetToDefaults();
                }
            });
        }
    }

    saveSettings(difficulty) {
        // Obter configurações de áudio
        const musicSlider = document.getElementById('music-volume');
        const sfxSlider = document.getElementById('sfx-volume');
        const controlSelect = document.getElementById('control-type');
        
        if (!musicSlider || !sfxSlider || !controlSelect) {
            console.error('❌ Elementos de configuração não encontrados');
            return;
        }

        // Salvar configurações do sistema
        const systemSettings = {
            musicVolume: parseInt(musicSlider.value) / 100,
            sfxVolume: parseInt(sfxSlider.value) / 100,
            controls: controlSelect.value,
            language: 'pt-BR'
        };

        this.saveSystemSettings(systemSettings);

        // Salvar dificuldade no perfil atual
        if (difficulty && window.profileManager) {
            const profile = window.profileManager.getCurrentProfile();
            if (profile) {
                if (!profile.settings) profile.settings = {};
                profile.settings.difficulty = difficulty;
                
                // Atualizar perfil
                window.profileManager.updateProfile(profile.name, {
                    settings: profile.settings
                });
            }
        }

        // Notificar sucesso
        if (window.GameNotifications) {
            window.GameNotifications.success('Configurações salvas com sucesso!');
        }

        // Voltar ao menu após um breve delay
        setTimeout(() => {
            if (this.eventSystem && this.eventSystem.showScreen) {
                this.eventSystem.showScreen('main-menu');
            }
        }, 1000);
    }

    resetToDefaults() {
        // Resetar sliders
        const musicSlider = document.getElementById('music-volume');
        const sfxSlider = document.getElementById('sfx-volume');
        const controlSelect = document.getElementById('control-type');
        const musicValue = document.getElementById('music-value');
        const sfxValue = document.getElementById('sfx-value');

        if (musicSlider && musicValue) {
            musicSlider.value = 70;
            musicValue.textContent = '70%';
        }

        if (sfxSlider && sfxValue) {
            sfxSlider.value = 100;
            sfxValue.textContent = '100%';
        }

        if (controlSelect) {
            controlSelect.value = 'keyboard';
        }

        // Resetar seleção de dificuldade para médio
        document.querySelectorAll('.difficulty-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-difficulty') === 'medium') {
                opt.classList.add('selected');
            }
        });

        if (window.GameNotifications) {
            window.GameNotifications.info('Configurações redefinidas para padrão');
        }
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.SettingsScreen = SettingsScreen;
}