// MainMenuScreen.js - VERSÃO LIMPA E OTIMIZADA
console.log('🏠 Carregando MainMenuScreen...');

class MainMenuScreen {
    constructor() {
        this.screenId = 'main-menu';
    }

    initialize() {
        console.log('🏠 Inicializando menu principal...');
        this.updateProfileData();
        this.render();
        this.attachEvents();
    }

    // Atualizar dados do perfil
    updateProfileData() {
        try {
            if (window.ProfileManager && window.ProfileManager.getCurrentProfile) {
                const profile = window.ProfileManager.getCurrentProfile();
                if (profile) {
                    window.currentProfile = profile;
                    return;
                }
            }

            if (!window.currentProfile) {
                window.currentProfile = {
                    name: 'Jogador',
                    cash: 0,
                    level: 1,
                    vehicles: []
                };
            }
        } catch (error) {
            console.error('❌ Erro ao atualizar dados do perfil:', error);
        }
    }

    render() {
        const container = document.getElementById('game-container');
        if (!container) {
            console.error('❌ Container do jogo não encontrado');
            return;
        }

        const profile = window.currentProfile || {
            name: 'Jogador',
            cash: 0,
            level: 1,
            vehicles: []
        };

        container.innerHTML = this.createMenuHTML(profile);
        this.addStyles();
    }

    // Criar HTML do menu (separado para clareza)
    createMenuHTML(profile) {
        return `
            <div id="main-menu" class="screen">
                <!-- CABEÇALHO -->
                <div class="screen-header" style="
                    padding: 40px 30px 20px;
                    text-align: center;
                    background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                    border-bottom: 3px solid #ff4757;
                ">
                    <h1 style="
                        color: #ff4757;
                        font-size: 4rem;
                        text-transform: uppercase;
                        letter-spacing: 5px;
                        margin-bottom: 10px;
                        text-shadow: 0 0 30px rgba(255, 71, 87, 0.5);
                    ">
                        STREET ROD <span style="color: white;">II</span>
                    </h1>
                    <p style="color: #aaa; font-size: 1.2rem; letter-spacing: 2px;">
                        Sistema de Múltiplos Perfis
                    </p>
                </div>
                
                <!-- INFORMAÇÕES DO PERFIL -->
                <div class="profile-info" style="
                    padding: 30px;
                    background: rgba(255, 255, 255, 0.05);
                    margin: 20px 40px;
                    border-radius: 15px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center;
                ">
                    <div style="color: white; font-size: 2rem; font-weight: bold; margin-bottom: 10px;">
                        ${profile.name}
                    </div>
                    <div style="color: #4cd137; font-size: 2.5rem; font-weight: bold;">
                        $${profile.cash.toLocaleString()}
                    </div>
                    <div style="color: #aaa; margin-top: 10px; font-size: 0.9rem;">
                        Nível ${profile.level || 1} • ${profile.vehicles?.length || 0} veículos
                    </div>
                </div>
                
                <!-- BOTÕES DO MENU -->
                <div class="menu-buttons" style="
                    padding: 40px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 25px;
                    max-width: 1000px;
                    margin: 0 auto;
                ">
                    <button id="race-button" class="menu-btn" style="
                        background: linear-gradient(135deg, #ff4757, #ff6b81);
                        grid-column: span 2;
                    ">
                        <span class="btn-icon">🏁</span>
                        <span class="btn-text">CORRER</span>
                        <span class="btn-desc">Iniciar uma nova corrida</span>
                    </button>
                    
                    <button id="garage-button" class="menu-btn" style="
                        background: linear-gradient(135deg, #1e90ff, #00bfff);
                    ">
                        <span class="btn-icon">🚗</span>
                        <span class="btn-text">GARAGEM</span>
                        <span class="btn-desc">Ver seus veículos</span>
                    </button>
                    
                    <button id="shop-button" class="menu-btn" style="
                        background: linear-gradient(135deg, #2ed573, #26c46a);
                    ">
                        <span class="btn-icon">🛒</span>
                        <span class="btn-text">LOJA</span>
                        <span class="btn-desc">Comprar veículos e peças</span>
                    </button>
                    
                    <button id="profiles-button" class="menu-btn" style="
                        background: linear-gradient(135deg, #9c88ff, #8c7ae6);
                    ">
                        <span class="btn-icon">👤</span>
                        <span class="btn-text">PERFIS</span>
                        <span class="btn-desc">Trocar ou criar perfis</span>
                    </button>
                    
                    <button id="settings-button" class="menu-btn" style="
                        background: linear-gradient(135deg, #353b48, #2f3640);
                    ">
                        <span class="btn-icon">⚙️</span>
                        <span class="btn-text">CONFIGURAÇÕES</span>
                        <span class="btn-desc">Ajustes do jogo</span>
                    </button>
                </div>
                
                <!-- RODAPÉ -->
                <div class="menu-footer" style="
                    padding: 30px;
                    background: rgba(0, 0, 0, 0.5);
                    text-align: center;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 40px;
                ">
                    <p style="color: #666;">
                        Street Rod II v2.0 • © 2024 Todos os direitos reservados
                    </p>
                </div>
            </div>
        `;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .menu-btn {
                padding: 30px 20px;
                border: none;
                border-radius: 15px;
                color: white;
                font-family: 'Rajdhani', sans-serif;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 15px;
                position: relative;
                overflow: hidden;
            }
            
            .menu-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }
            
            .menu-btn:hover {
                transform: translateY(-10px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .menu-btn:hover::before {
                left: 100%;
            }
            
            .btn-icon {
                font-size: 3rem;
                margin-bottom: 10px;
            }
            
            .btn-text {
                font-size: 1.8rem;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            
            .btn-desc {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.8);
                margin-top: 5px;
            }
            
            @media (max-width: 768px) {
                .menu-btn {
                    grid-column: span 1 !important;
                }
                
                #race-button {
                    grid-column: span 1 !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    attachEvents() {
        // BOTÃO GARAGEM - Limpo e direto
        const garageBtn = document.getElementById('garage-button');
        if (garageBtn) {
            garageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                console.log('🚗 Navegando para Garagem...');
                
                if (window.garageScreen && typeof window.garageScreen.initialize === 'function') {
                    window.garageScreen.initialize();
                } else {
                    console.error('❌ GarageScreen não disponível');
                }
            });
        }

        // Outros botões
        this.setupButton('race-button', () => {
            console.log('🏁 Corrida selecionada');
            alert('🏁 Sistema de corridas em desenvolvimento');
        });

        this.setupButton('shop-button', () => {
            console.log('🛒 Loja selecionada');
            alert('🛒 Loja em desenvolvimento');
        });

        this.setupButton('profiles-button', () => {
            console.log('👤 Perfis selecionados');
            if (window.eventSystem && window.eventSystem.showScreen) {
                window.eventSystem.showScreen('profile-selection');
            } else {
                alert('👤 Sistema de perfis em desenvolvimento');
            }
        });

        this.setupButton('settings-button', () => {
            console.log('⚙️ Configurações selecionadas');
            alert('⚙️ Configurações em desenvolvimento');
        });
    }

    // Método auxiliar para configurar botões
    setupButton(buttonId, action) {
        const button = document.getElementById(buttonId);
        if (button && action) {
            button.addEventListener('click', action);
        }
    }

    cleanup() {
        console.log('🧹 Limpando MainMenuScreen');
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.MainMenuScreen = MainMenuScreen;
    window.mainMenuScreen = new MainMenuScreen();
    console.log('✅ MainMenuScreen carregado');
}