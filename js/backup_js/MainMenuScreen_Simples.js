// MainMenuScreen.js - Versão Mínima Funcional
console.log('🏠 Carregando MainMenuScreen...');

class MainMenuScreen {
    constructor() {
        this.screenId = 'main-menu';
        console.log('✅ MainMenuScreen inicializado');
    }

    initialize() {
        console.log('🏠 Inicializando Main Menu...');
        this.createMenu();
        this.attachEvents();
    }

    createMenu() {
        const container = document.getElementById('game-container');
        if (!container) {
            console.error('❌ Container do jogo não encontrado');
            return;
        }

        const currentProfile = window.currentProfile || { name: 'Jogador' };

        container.innerHTML = `
            <div id="main-menu" style="
                min-height: 100vh;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                padding: 40px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            ">
                <div style="text-align: center; margin-bottom: 50px;">
                    <h1 style="
                        color: #ff4757;
                        font-size: 4rem;
                        text-transform: uppercase;
                        letter-spacing: 5px;
                        margin-bottom: 10px;
                        text-shadow: 0 0 20px rgba(255, 71, 87, 0.5);
                    ">
                        STREET ROD II
                    </h1>
                    <p style="color: #aaa; font-size: 1.2rem;">
                        Sistema de Múltiplos Perfis
                    </p>
                </div>
                
                <div id="profile-info" style="
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 40px;
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                ">
                    <div style="color: #fff; font-size: 1.5rem; margin-bottom: 10px;">
                        ${currentProfile.name}
                    </div>
                    <div style="color: #4cd137; font-size: 1.2rem;">
                        $${currentProfile.cash || 0}
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 300px;">
                    <button id="race-button" class="menu-btn" data-type="primary">
                        🏁 CORRER
                    </button>
                    <button id="garage-button" class="menu-btn" data-type="primary">
                        🚗 GARAGEM
                    </button>
                    <button id="shop-button" class="menu-btn" data-type="primary">
                        🛒 LOJA
                    </button>
                    <button id="profiles-button" class="menu-btn" data-type="secondary">
                        👤 PERFIS
                    </button>
                    <button id="settings-button" class="menu-btn" data-type="secondary">
                        ⚙️ CONFIGURAÇÕES
                    </button>
                </div>
                
                <div style="margin-top: 50px; color: #666; text-align: center;">
                    <p>© 2024 Street Rod II</p>
                </div>
            </div>
        `;

        // Adicionar estilos
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .menu-btn {
                padding: 15px 25px;
                border: none;
                border-radius: 8px;
                font-family: 'Rajdhani', sans-serif;
                font-size: 1.2rem;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .menu-btn[data-type="primary"] {
                background: #ff4757;
                color: white;
            }
            
            .menu-btn[data-type="primary"]:hover {
                background: #ff2e43;
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
            }
            
            .menu-btn[data-type="secondary"] {
                background: #333;
                color: white;
            }
            
            .menu-btn[data-type="secondary"]:hover {
                background: #444;
                transform: translateY(-3px);
            }
        `;

        document.head.appendChild(style);
    }

    attachEvents() {
        // Botão GARAGEM
        const garageBtn = document.getElementById('garage-button');
        if (garageBtn) {
            garageBtn.addEventListener('click', () => {
                console.log('🚗 Botão Garagem clicado');
                if (window.garageScreen && window.garageScreen.initialize) {
                    window.garageScreen.initialize();
                } else if (window.eventSystem && window.eventSystem.showScreen) {
                    window.eventSystem.showScreen('garage');
                } else {
                    alert('Funcionalidade de garagem em desenvolvimento!');
                }
            });
        }

        // Botão CORRER
        const raceBtn = document.getElementById('race-button');
        if (raceBtn) {
            raceBtn.addEventListener('click', () => {
                console.log('🏁 Botão Correr clicado');
                if (window.raceScreen && window.raceScreen.initialize) {
                    window.raceScreen.initialize();
                } else if (window.eventSystem && window.eventSystem.showScreen) {
                    window.eventSystem.showScreen('race');
                } else {
                    alert('Funcionalidade de corrida em desenvolvimento!');
                }
            });
        }

        // Botão LOJA
        const shopBtn = document.getElementById('shop-button');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => {
                console.log('🛒 Botão Loja clicado');
                if (window.shopScreen && window.shopScreen.initialize) {
                    window.shopScreen.initialize();
                } else if (window.eventSystem && window.eventSystem.showScreen) {
                    window.eventSystem.showScreen('shop');
                } else {
                    alert('Funcionalidade de loja em desenvolvimento!');
                }
            });
        }

        // Botão PERFIS
        const profilesBtn = document.getElementById('profiles-button');
        if (profilesBtn) {
            profilesBtn.addEventListener('click', () => {
                console.log('👤 Botão Perfis clicado');
                if (window.eventSystem && window.eventSystem.showScreen) {
                    window.eventSystem.showScreen('profile-selection');
                }
            });
        }

        // Botão CONFIGURAÇÕES
        const settingsBtn = document.getElementById('settings-button');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                console.log('⚙️ Botão Configurações clicado');
                if (window.settingsScreen && window.settingsScreen.initialize) {
                    window.settingsScreen.initialize();
                } else if (window.eventSystem && window.eventSystem.showScreen) {
                    window.eventSystem.showScreen('settings');
                } else {
                    alert('Configurações em desenvolvimento!');
                }
            });
        }
    }

    cleanup() {
        console.log('🏠 Limpando Main Menu');
    }
}

// Exportar para window
if (typeof window !== 'undefined') {
    window.mainMenuScreen = new MainMenuScreen();
    window.MainMenuScreen = MainMenuScreen;
    console.log('✅ MainMenuScreen exportado para window');
}