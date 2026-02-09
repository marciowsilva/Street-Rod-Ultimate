// EventSystem.js - VERSÃO CORRIGIDA
console.log('🔧 Carregando EventSystem Corrigido...');

class EventSystem {
    constructor() {
        console.log('🏗️  Inicializando EventSystem Corrigido');

        // CORREÇÃO: screens como objeto (não Map)
        this.screens = {};  // Mantém como objeto, mas podemos adicionar método keys()
        this.currentScreen = null;

        // Adicionar método keys para compatibilidade
        this.screens.keys = () => Object.keys(this.screens);

        // Estado
        this.gameState = {
            isPaused: false,
            isRacing: false
        };

        // Referências
        this.profileManager = window.profileManager || null;
        this.currentProfile = null;

        console.log('✅ EventSystem corrigido pronto');
    }

    // ========== MÉTODOS BÁSICOS ==========

    registerScreen(screenId, screen) {
        console.log(`📺 Registrando tela: ${screenId}`);
        this.screens[screenId] = screen;

        // Conectar referências
        if (screen) {
            screen.eventSystem = this;
        }

        return this;
    }

    showScreen(screenId, data = {}) {
        console.log(`🔄 Mostrando tela: ${screenId}`);

        const screen = this.screens[screenId];
        if (!screen) {
            console.error(`❌ Tela não registrada: ${screenId}`);

            // Mapeamento de fallback para telas comuns
            const screenFallbacks = {
                'profile-creation': () => {
                    if (window.profileCreationScreen) {
                        console.log('🔧 Carregando ProfileCreationScreen do cache...');
                        this.registerScreen('profile-creation', window.profileCreationScreen);
                        return this.showScreen(screenId, data);
                    }
                    return false;
                },
                'profile-selection': () => {
                    if (window.profileSelectionScreen) {
                        console.log('🔧 Carregando ProfileSelectionScreen do cache...');
                        this.registerScreen('profile-selection', window.profileSelectionScreen);
                        return this.showScreen(screenId, data);
                    }
                    return false;
                },
                'main-menu': () => {
                    if (window.mainMenuScreen) {
                        console.log('🔧 Carregando MainMenuScreen do cache...');
                        this.registerScreen('main-menu', window.mainMenuScreen);
                        return this.showScreen(screenId, data);
                    }
                    return false;
                },
                'garage': () => {
                    if (window.garageScreen) {
                        console.log('🔧 Carregando GarageScreen do cache...');
                        this.registerScreen('garage', window.garageScreen);
                        return this.showScreen(screenId, data);
                    }
                    return false;
                }
            };

            if (screenFallbacks[screenId]) {
                return screenFallbacks[screenId]();
            }

            return false;
        }

        // Esconder tela atual se existir
        if (this.currentScreen && this.currentScreen.cleanup) {
            try {
                this.currentScreen.cleanup();
            } catch (e) {
                console.warn('Erro ao limpar tela atual:', e);
            }
        }

        // Atualizar referência
        this.currentScreen = screen;

        // Renderizar
        const container = document.getElementById('game-container');
        if (!container) {
            console.error('❌ Container do jogo não encontrado');
            return false;
        }

        // Chamar método específico da tela
        if (screen.show) {
            screen.show(data);
        } else if (screen.initialize) {
            screen.initialize();
        } else {
            console.warn(`Tela ${screenId} não tem método show ou initialize`);
        }

        // Atualizar estado global
        if (window.game) {
            window.game.currentScreen = screenId;
        }

        console.log(`✅ Tela ${screenId} mostrada com sucesso`);
        return true;
    }

    switchToScreen(screenId, data = {}) {
        return this.showScreen(screenId, data);
    }

    navigateToScreen(screenId, data = {}) {
        return this.showScreen(screenId, data);
    }

    // ========== MÉTODOS DE PERFIL ==========

    getCurrentProfile() {
        return this.currentProfile || (window.currentProfile || null);
    }

    setCurrentProfile(profile) {
        this.currentProfile = profile;
        window.currentProfile = profile;

        if (window.game) {
            window.game.currentProfile = profile;
        }

        return this;
    }

    loadSavedProfilesList() {
        console.log('📋 Carregando lista de perfis...');

        // Este método pode ser chamado antes do DOM estar pronto
        setTimeout(() => {
            const container = document.getElementById('saved-profiles');
            if (!container) {
                console.log('⏳ Elemento #saved-profiles não encontrado ainda');
                return;
            }

            if (!this.profileManager) {
                container.innerHTML = '<p style="color:#ccc;text-align:center;">Sistema de perfis não disponível</p>';
                return;
            }

            const profiles = this.profileManager.getAllProfiles();

            if (!profiles || profiles.length === 0) {
                container.innerHTML = `
                    <div style="text-align:center;padding:20px;color:#666;">
                        <div style="font-size:3rem;">👤</div>
                        <p>Nenhum perfil salvo</p>
                        <p style="font-size:0.9rem;">Crie um perfil para começar!</p>
                    </div>
                `;
                return;
            }

            let html = '<div style="margin-top:20px;">';

            profiles.forEach(profile => {
                if (!profile || !profile.name) return;

                const isCurrent = this.currentProfile && this.currentProfile.name === profile.name;
                const safeName = String(profile.name).replace(/'/g, "\\'");

                html += `
                    <div style="
                        background: ${isCurrent ? 'rgba(46,213,115,0.1)' : 'rgba(255,255,255,0.05)'};
                        border: 2px solid ${isCurrent ? '#2ed573' : '#444'};
                        border-radius: 10px;
                        padding: 15px;
                        margin-bottom: 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <div>
                            <strong style="color:${isCurrent ? '#2ed573' : '#fff'}">${profile.name}</strong>
                            <div style="color:#ccc;font-size:0.9rem;">
                                Nível ${profile.level || 1} • $${(profile.money || 0).toLocaleString()}
                            </div>
                        </div>
                        <button onclick="window.eventSystem.selectProfile('${safeName}')" style="
                            padding: 8px 15px;
                            background: ${isCurrent ? '#2ed573' : '#1e90ff'};
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                        ">
                            ${isCurrent ? 'ATUAL' : 'CARREGAR'}
                        </button>
                    </div>
                `;
            });

            html += '</div>';
            container.innerHTML = html;

            console.log('✅ Lista de perfis carregada');
        }, 100);
    }

    selectProfile(profileName) {
        console.log(`👤 Selecionando perfil: ${profileName}`);

        if (!this.profileManager) {
            this.showNotification('Sistema de perfis não disponível', 'error');
            return false;
        }

        if (this.profileManager.selectProfile(profileName)) {
            this.currentProfile = this.profileManager.getCurrentProfile();
            window.currentProfile = this.currentProfile;
            this.showNotification(`Bem-vindo de volta, ${profileName}!`, 'success');
            this.showScreen('main-menu');
            return true;
        }

        return false;
    }

    // ========== UTILITÁRIOS ==========

    showNotification(message, type = 'info') {
        console.log(`🔔 ${type.toUpperCase()}: ${message}`);

        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = 'game-notification';
        notification.setAttribute('data-type', type);

        // Estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4757' :
                type === 'success' ? '#2ed573' :
                    type === 'warning' ? '#ffa502' : '#1e90ff'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
            min-width: 200px;
            max-width: 300px;
        `;

        // Adicionar animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            notification.style.opacity = '0';

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // ========== DEPURAÇÃO ==========

    debug() {
        console.group('🔍 EventSystem Debug');
        console.log('Telas registradas:', Object.keys(this.screens));
        console.log('Tela atual:', this.currentScreen);
        console.log('Perfil atual:', this.currentProfile);
        console.log('ProfileManager:', this.profileManager);
        console.groupEnd();
    }
}

// ========== FALLBACK DE INICIALIZAÇÃO ==========
console.log('🛠️ Configurando fallbacks do EventSystem...');

// Aguardar um pouco e verificar se as telas foram carregadas
setTimeout(() => {
    console.log('🔍 Verificando telas disponíveis...');

    // Lista de telas para verificar e registrar
    const screensToRegister = [
        { id: 'profile-creation', instance: window.profileCreationScreen, name: 'ProfileCreationScreen' },
        { id: 'profile-selection', instance: window.profileSelectionScreen, name: 'ProfileSelectionScreen' },
        { id: 'main-menu', instance: window.mainMenuScreen, name: 'MainMenuScreen' },
        { id: 'garage', instance: window.garageScreen, name: 'GarageScreen' },
        { id: 'settings', instance: window.settingsScreen, name: 'SettingsScreen' }
    ];

    let registeredCount = 0;

    screensToRegister.forEach(screen => {
        if (screen.instance && !window.eventSystem.screens[screen.id]) {
            console.log(`🔧 Registrando ${screen.id} (${screen.name})...`);
            window.eventSystem.registerScreen(screen.id, screen.instance);
            registeredCount++;
        } else if (!screen.instance) {
            console.warn(`⚠️ ${screen.name} não encontrado no window`);
        } else {
            console.log(`✅ ${screen.id} já registrado`);
        }
    });

    console.log(`📊 ${registeredCount} telas registradas via fallback`);

    // Debug: mostrar todas as telas registradas
    console.log('📋 Telas registradas no EventSystem:', Object.keys(window.eventSystem.screens));

}, 1500); // Aguardar 1.5 segundos após carregamento

// Instanciar e exportar
if (typeof window !== 'undefined') {
    window.eventSystem = new EventSystem();
    window.EventSystem = EventSystem; // Para compatibilidade
    console.log('✅ EventSystem instanciado como window.eventSystem');
}