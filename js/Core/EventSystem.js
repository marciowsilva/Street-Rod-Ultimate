// EventSystem.js - VERSÃO LIMPA E PROFISSIONAL
console.log('🔧 Carregando EventSystem...');

class EventSystem {
    constructor() {
        console.log('🏗️ Inicializando EventSystem');
        
        // Telas registradas
        this.screens = {};
        this.currentScreen = null;
        
        // Estado do jogo
        this.gameState = {
            isPaused: false,
            isRacing: false
        };
        
        // Sistema de perfis
        this.profileManager = window.profileManager || null;
        this.currentProfile = null;
        
        console.log('✅ EventSystem inicializado');
    }

    // ========== GERENCIAMENTO DE TELAS ==========

    registerScreen(screenId, screen) {
        console.log(`📺 Registrando tela: ${screenId}`);
        this.screens[screenId] = screen;
        
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
            return false;
        }

        // Limpar tela atual
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

        // Chamar método da tela
        if (screen.show) {
            screen.show(data);
        } else if (screen.initialize) {
            screen.initialize();
        } else {
            console.warn(`Tela ${screenId} não tem método show ou initialize`);
            return false;
        }

        // Atualizar estado global
        if (window.game) {
            window.game.currentScreen = screenId;
        }

        console.log(`✅ Tela ${screenId} mostrada`);
        return true;
    }

    switchToScreen(screenId, data = {}) {
        return this.showScreen(screenId, data);
    }

    navigateToScreen(screenId, data = {}) {
        return this.showScreen(screenId, data);
    }

    // ========== GERENCIAMENTO DE PERFIS ==========

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
        
        setTimeout(() => {
            const container = document.getElementById('saved-profiles');
            if (!container) {
                return;
            }
            
            if (!this.profileManager) {
                container.innerHTML = '<p class="no-profiles">Sistema de perfis não disponível</p>';
                return;
            }
            
            const profiles = this.profileManager.getAllProfiles();
            
            if (!profiles || profiles.length === 0) {
                container.innerHTML = `
                    <div class="empty-profiles">
                        <div class="empty-icon">👤</div>
                        <p>Nenhum perfil salvo</p>
                        <p class="hint">Crie um perfil para começar!</p>
                    </div>
                `;
                return;
            }
            
            let html = '<div class="profiles-list">';
            
            profiles.forEach(profile => {
                if (!profile || !profile.name) return;
                
                const isCurrent = this.currentProfile && this.currentProfile.name === profile.name;
                const safeName = String(profile.name).replace(/'/g, "\\'");
                
                html += `
                    <div class="profile-item ${isCurrent ? 'current' : ''}">
                        <div class="profile-info">
                            <strong class="profile-name">${profile.name}</strong>
                            <div class="profile-details">
                                Nível ${profile.level || 1} • $${(profile.money || 0).toLocaleString()}
                            </div>
                        </div>
                        <button class="profile-action" onclick="window.eventSystem.selectProfile('${safeName}')">
                            ${isCurrent ? 'ATUAL' : 'CARREGAR'}
                        </button>
                    </div>
                `;
            });
            
            html += '</div>';
            container.innerHTML = html;
            
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
        
        // Criar elemento
        const notification = document.createElement('div');
        notification.className = `game-notification notification-${type}`;
        notification.textContent = message;
        
        // Adicionar ao DOM
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
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

// ========== REGISTRO AUTOMÁTICO DE TELAS ==========
(function registerAvailableScreens() {
    console.log('🔍 Registrando telas disponíveis...');
    
    // Aguardar EventSystem estar pronto
    setTimeout(() => {
        if (!window.eventSystem) {
            console.warn('⚠️ EventSystem não disponível para registro automático');
            return;
        }
        
        const screens = [
            { id: 'profile-creation', instance: window.profileCreationScreen },
            { id: 'profile-selection', instance: window.profileSelectionScreen },
            { id: 'main-menu', instance: window.mainMenuScreen },
            { id: 'garage', instance: window.garageScreen },
            { id: 'settings', instance: window.settingsScreen }
        ];
        
        let registered = 0;
        
        screens.forEach(screen => {
            if (screen.instance && !window.eventSystem.screens[screen.id]) {
                window.eventSystem.registerScreen(screen.id, screen.instance);
                registered++;
            }
        });
        
        console.log(`✅ ${registered} telas registradas automaticamente`);
        
    }, 1000);
})();

// ========== ESTILOS ==========
(function addEventSystemStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .game-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: notificationSlideIn 0.3s ease;
            min-width: 200px;
            max-width: 300px;
        }
        
        .notification-info {
            background: #1e90ff;
        }
        
        .notification-success {
            background: #2ed573;
        }
        
        .notification-error {
            background: #ff4757;
        }
        
        .notification-warning {
            background: #ffa502;
        }
        
        @keyframes notificationSlideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes notificationSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .no-profiles {
            color: #ccc;
            text-align: center;
            padding: 20px;
        }
        
        .empty-profiles {
            text-align: center;
            padding: 20px;
            color: #666;
        }
        
        .empty-icon {
            font-size: 3rem;
            margin-bottom: 10px;
        }
        
        .hint {
            font-size: 0.9rem;
            color: #888;
        }
        
        .profiles-list {
            margin-top: 20px;
        }
        
        .profile-item {
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid #444;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .profile-item.current {
            background: rgba(46, 213, 115, 0.1);
            border-color: #2ed573;
        }
        
        .profile-name {
            color: #fff;
        }
        
        .profile-item.current .profile-name {
            color: #2ed573;
        }
        
        .profile-details {
            color: #ccc;
            font-size: 0.9rem;
        }
        
        .profile-action {
            padding: 8px 15px;
            background: #1e90ff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
        }
        
        .profile-item.current .profile-action {
            background: #2ed573;
        }
    `;
    document.head.appendChild(style);
})();

// ========== EXPORTAÇÃO ==========
if (typeof window !== 'undefined') {
    window.eventSystem = new EventSystem();
    window.EventSystem = EventSystem;
    console.log('✅ EventSystem carregado');
}