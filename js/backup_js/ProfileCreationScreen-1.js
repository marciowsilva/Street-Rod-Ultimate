// ProfileCreationScreen.js
class ProfileCreationScreen {
    constructor(eventSystem) {
        console.log('🆕 Criando ProfileCreationScreen');
        this.eventSystem = eventSystem;
        this.isVisible = false;
        this.maxNameLength = 12;
    }

    show(data = {}) {
        console.log('🖥️ Mostrando ProfileCreationScreen');
        this.isVisible = true;
        this.slotNumber = data.slot || null;

        return this;
    }

    hide() {
        console.log('👋 Escondendo ProfileCreationScreen');
        this.isVisible = false;
    }

    render() {
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
                <div style="text-align: center; margin-bottom: 30px;">
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
                        font-size: 2rem;
                        margin-bottom: 10px;
                    ">
                        CRIAR NOVO PERFIL
                    </h1>
                    <div style="color: #aaa; font-size: 1rem; max-width: 500px;">
                        ${this.slotNumber ? `Slot ${this.slotNumber} de 3` : 'Preencha os dados abaixo para criar um novo perfil'}
                    </div>
                </div>

                <!-- Formulário -->
                <div style="
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    padding: 30px;
                    width: 100%;
                    max-width: 500px;
                    border: 2px solid rgba(46, 213, 115, 0.3);
                ">
                    <!-- Nome do Perfil -->
                    <div style="margin-bottom: 25px;">
                        <label style="
                            display: block;
                            color: #2ed573;
                            margin-bottom: 10px;
                            font-weight: bold;
                            font-size: 1.1rem;
                        ">
                            NOME DO PERFIL
                        </label>
                        <input type="text" id="profile-name" maxlength="${this.maxNameLength}" placeholder="Digite um nome (ex: 'SpeedRacer')" style="
                            width: 100%;
                            padding: 15px;
                            background: rgba(255, 255, 255, 0.1);
                            border: 2px solid #555;
                            border-radius: 10px;
                            color: white;
                            font-family: 'Rajdhani', sans-serif;
                            font-size: 1rem;
                            transition: all 0.3s;
                            box-sizing: border-box;
                        ">
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            margin-top: 8px;
                            color: #888;
                            font-size: 0.9rem;
                        ">
                            <span id="name-counter">0/${this.maxNameLength} caracteres</span>
                            <span id="name-status" style="color: #ff4757;">Campo obrigatório</span>
                        </div>
                    </div>

                    <!-- Dificuldade -->
                    <div style="margin-bottom: 30px;">
                        <label style="
                            display: block;
                            color: #ffcc00;
                            margin-bottom: 10px;
                            font-weight: bold;
                            font-size: 1.1rem;
                        ">
                            DIFICULDADE INICIAL
                        </label>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                            <label class="difficulty-option" data-difficulty="easy" style="
                                background: rgba(46, 213, 115, 0.1);
                                border: 2px solid #2ed573;
                                border-radius: 10px;
                                padding: 15px;
                                text-align: center;
                                cursor: pointer;
                                transition: all 0.2s;
                            ">
                                <div style="font-size: 1.5rem; margin-bottom: 5px;">😊</div>
                                <div style="color: #2ed573; font-weight: bold;">FÁCIL</div>
                                <div style="color: #aaa; font-size: 0.85rem; margin-top: 5px;">
                                    Para iniciantes
                                </div>
                            </label>
                            
                            <label class="difficulty-option selected" data-difficulty="medium" style="
                                background: rgba(255, 204, 0, 0.1);
                                border: 2px solid #ffcc00;
                                border-radius: 10px;
                                padding: 15px;
                                text-align: center;
                                cursor: pointer;
                                transition: all 0.2s;
                            ">
                                <div style="font-size: 1.5rem; margin-bottom: 5px;">😐</div>
                                <div style="color: #ffcc00; font-weight: bold;">MÉDIO</div>
                                <div style="color: #aaa; font-size: 0.85rem; margin-top: 5px;">
                                    Padrão
                                </div>
                            </label>
                            
                            <label class="difficulty-option" data-difficulty="hard" style="
                                background: rgba(255, 71, 87, 0.1);
                                border: 2px solid #ff4757;
                                border-radius: 10px;
                                padding: 15px;
                                text-align: center;
                                cursor: pointer;
                                transition: all 0.2s;
                            ">
                                <div style="font-size: 1.5rem; margin-bottom: 5px;">😠</div>
                                <div style="color: #ff4757; font-weight: bold;">DIFÍCIL</div>
                                <div style="color: #aaa; font-size: 0.85rem; margin-top: 5px;">
                                    Para experts
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Botões -->
                    <div style="display: flex; gap: 15px; margin-top: 20px;">
                        <button id="create-btn" disabled style="
                            flex: 1;
                            padding: 15px;
                            background: rgba(46, 213, 115, 0.3);
                            color: #2ed573;
                            border: 2px solid #2ed573;
                            border-radius: 10px;
                            cursor: not-allowed;
                            font-family: 'Rajdhani', sans-serif;
                            font-weight: bold;
                            font-size: 1.1rem;
                            transition: all 0.3s;
                        ">
                            CRIAR PERFIL
                        </button>
                        
                        <button id="cancel-btn" style="
                            padding: 15px 25px;
                            background: rgba(255, 71, 87, 0.1);
                            color: #ff4757;
                            border: 2px solid #ff4757;
                            border-radius: 10px;
                            cursor: pointer;
                            font-family: 'Rajdhani', sans-serif;
                            font-weight: bold;
                            transition: all 0.3s;
                        ">
                            CANCELAR
                        </button>
                    </div>
                </div>

                <!-- Informações -->
                <div style="
                    margin-top: 30px;
                    color: #666;
                    font-size: 0.9rem;
                    text-align: center;
                    max-width: 500px;
                    line-height: 1.5;
                ">
                    <p>📁 Perfis são salvos localmente no seu navegador</p>
                    <p>🔄 Você pode criar até 3 perfis diferentes</p>
                    <p>💰 Cada perfil começa com $10.000</p>
                </div>
            </div>

            <style>
                #profile-name:focus {
                    border-color: #2ed573;
                    background: rgba(46, 213, 115, 0.05);
                    outline: none;
                }

                .difficulty-option:hover {
                    transform: translateY(-3px);
                    background: rgba(255, 255, 255, 0.1) !important;
                }

                .difficulty-option.selected {
                    box-shadow: 0 0 15px rgba(255, 204, 0, 0.3);
                }

                #create-btn:enabled {
                    background: linear-gradient(145deg, #2ed573, #1dd1a1) !important;
                    color: white !important;
                    cursor: pointer !important;
                }

                #create-btn:enabled:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(46, 213, 115, 0.3);
                }

                #cancel-btn:hover {
                    background: rgba(255, 71, 87, 0.2);
                    transform: translateY(-3px);
                }

                #back-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                }

                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #1e90ff;
                    border-radius: 50%;
                    cursor: pointer;
                }
            </style>
        `;
    }

    attachEvents() {
        console.log('🔗 Anexando eventos da ProfileCreationScreen');

        // Botão Voltar
        const backBtn = document.getElementById('back-btn');
        if (backBtn && this.eventSystem) {
            backBtn.onclick = () => {
                console.log('← Voltando para seleção de perfis');
                this.eventSystem.showScreen('profile-selection');
            };
        }

        // Botão Cancelar
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn && this.eventSystem) {
            cancelBtn.onclick = () => {
                console.log('❌ Cancelando criação de perfil');
                this.eventSystem.showScreen('profile-selection');
            };
        }

        // Contador de caracteres do nome
        const nameInput = document.getElementById('profile-name');
        const nameCounter = document.getElementById('name-counter');
        const nameStatus = document.getElementById('name-status');
        const createBtn = document.getElementById('create-btn');

        if (nameInput && nameCounter) {
            nameInput.addEventListener('input', () => {
                const length = nameInput.value.length;
                nameCounter.textContent = `${length}/${this.maxNameLength}`;

                // Validar nome
                const isValid = this.validateProfileName(nameInput.value);

                if (nameStatus) {
                    if (nameInput.value.length === 0) {
                        nameStatus.textContent = 'Campo obrigatório';
                        nameStatus.style.color = '#ff4757';
                    } else if (!isValid) {
                        nameStatus.textContent = 'Nome inválido';
                        nameStatus.style.color = '#ff4757';
                    } else {
                        nameStatus.textContent = 'Nome válido';
                        nameStatus.style.color = '#2ed573';
                    }
                }

                // Habilitar/desabilitar botão Criar
                if (createBtn) {
                    if (isValid && nameInput.value.length > 0) {
                        createBtn.disabled = false;
                        createBtn.style.background = 'rgba(46, 213, 115, 0.3)';
                        createBtn.style.color = '#2ed573';
                    } else {
                        createBtn.disabled = true;
                        createBtn.style.background = 'rgba(46, 213, 115, 0.1)';
                        createBtn.style.color = '#2ed573';
                    }
                }
            });

            // Focar no campo de nome
            setTimeout(() => {
                nameInput.focus();
            }, 100);
        }

        // Seleção de dificuldade
        let selectedDifficulty = 'medium';
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remover seleção anterior
                document.querySelectorAll('.difficulty-option').forEach(opt => {
                    opt.classList.remove('selected');
                    opt.style.background = ''; // Resetar background
                });

                // Adicionar seleção atual
                option.classList.add('selected');

                // Atualizar dificuldade selecionada
                selectedDifficulty = option.getAttribute('data-difficulty');
                console.log(`🎯 Dificuldade selecionada: ${selectedDifficulty}`);
            });
        });

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

        // Botão Criar Perfil
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.createProfile();
            });
        }

        // Permitir criar com Enter
        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!createBtn.disabled) {
                        this.createProfile();
                    }
                }
            });
        }
    }

    validateProfileName(name) {
        if (!name || name.trim().length === 0) return false;

        // Verificar comprimento
        if (name.length > this.maxNameLength) return false;

        // Verificar caracteres válidos (letras, números, espaços, hífen, underline)
        const validRegex = /^[a-zA-Z0-9 _\-]+$/;
        if (!validRegex.test(name)) return false;

        // Verificar se nome já existe
        if (window.profileManager) {
            const profiles = window.profileManager.getAllProfiles();
            const exists = profiles.some(profile =>
                profile.name.toLowerCase() === name.toLowerCase()
            );
            if (exists) return false;
        }

        return true;
    }

    createProfile() {
        const nameInput = document.getElementById('profile-name');
        if (!nameInput) return;

        const profileName = nameInput.value.trim();

        // Validar nome
        if (!this.validateProfileName(profileName)) {
            if (window.GameNotifications) {
                window.GameNotifications.error('Nome de perfil inválido ou já existente!');
            }
            return;
        }

        // Obter dificuldade selecionada
        const selectedOption = document.querySelector('.difficulty-option.selected');
        const difficulty = selectedOption ? selectedOption.getAttribute('data-difficulty') : 'medium';

        // Obter configurações de volume
        const musicVolume = document.getElementById('music-volume') ? parseInt(document.getElementById('music-volume').value) / 100 : 0.7;
        const sfxVolume = document.getElementById('sfx-volume') ? parseInt(document.getElementById('sfx-volume').value) / 100 : 1.0;

        console.log(`🆕 Criando perfil: ${profileName} (Dificuldade: ${difficulty})`);

        // Verificar se há espaço para novo perfil
        if (window.profileManager) {
            const profiles = window.profileManager.getAllProfiles();
            if (profiles.length >= 3) {
                if (window.GameNotifications) {
                    window.GameNotifications.error('Limite de 3 perfis atingido!');
                }
                return;
            }
        }

        // Dados do perfil
        const profileData = {
            name: profileName,
            money: 10000,
            level: 1,
            xp: 0,
            stats: {
                wins: 0,
                losses: 0,
                races: 0,
                bestTime: null,
                totalMoneyEarned: 0
            },
            cars: [],
            settings: {
                musicVolume: musicVolume,
                sfxVolume: sfxVolume,
                difficulty: difficulty
            },
            createdAt: Date.now(),
            lastPlayed: Date.now()
        };

        // Criar perfil via ProfileManager
        if (window.profileManager) {
            const newProfile = window.profileManager.createProfile(profileName, profileData);

            if (newProfile) {
                // Selecionar automaticamente o novo perfil
                window.profileManager.selectProfile(profileName);

                // Notificação
                if (window.GameNotifications) {
                    window.GameNotifications.success(`Perfil ${profileName} criado com sucesso!`);
                }

                // Navegar para menu principal após delay
                setTimeout(() => {
                    if (this.eventSystem && this.eventSystem.showScreen) {
                        this.eventSystem.showScreen('main-menu');
                    }
                }, 1000);
            } else {
                if (window.GameNotifications) {
                    window.GameNotifications.error('Erro ao criar perfil');
                }
            }
        } else {
            console.error('❌ ProfileManager não disponível');
            if (window.GameNotifications) {
                window.GameNotifications.error('Sistema de perfis não disponível');
            }
        }
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.ProfileCreationScreen = ProfileCreationScreen;
}