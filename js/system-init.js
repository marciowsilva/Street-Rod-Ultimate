// system-init.js - Controlador do Fluxo Completo
console.log('🎮 [SystemInit] Inicializando sistema...');

window.systemInit = {
    isInitialized: false,
    
    initialize: function() {
        if (this.isInitialized) {
            console.warn('⚠️ Sistema já inicializado');
            return;
        }
        
        console.log('🚀 [SystemInit] Iniciando fluxo do jogo...');
        
        // 1. Configurar EventSystem
        this.setupEventSystem();
        
        // 2. Verificar se todas as telas foram registradas
        this.verifyScreens();
        
        // 3. Iniciar fluxo baseado nos perfis
        this.startGameFlow();
        
        this.isInitialized = true;
        console.log('✅ [SystemInit] Sistema inicializado com sucesso');
    },
    
    setupEventSystem: function() {
        if (!window.eventSystem) {
            console.error('❌ EventSystem não encontrado');
            this.showErrorScreen('EventSystem não disponível');
            return;
        }
        
        console.log('🔧 [SystemInit] Configurando EventSystem...');
        
        // Configurar ProfileManager se disponível
        if (window.profileManager) {
            window.eventSystem.profileManager = window.profileManager;
            console.log('✅ ProfileManager configurado no EventSystem');
        }
        
        // Configurar notificações
        window.eventSystem.showNotification = function(message, type = 'info') {
            console.log(`🔔 ${type.toUpperCase()}: ${message}`);
            
            // Implementação simples de notificação
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'error' ? '#ff4757' : 
                            type === 'success' ? '#2ed573' : 
                            '#1e90ff'};
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                z-index: 10000;
                font-family: 'Rajdhani', sans-serif;
                font-weight: bold;
                animation: slideIn 0.3s ease;
            `;
            
            // Adicionar animação
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
            
            // Remover após 3 segundos
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        };
    },
    
    verifyScreens: function() {
        console.log('🔍 [SystemInit] Verificando telas...');
        
        const requiredScreens = [
            { id: 'profile-selection', name: 'ProfileSelectionScreen' },
            { id: 'profile-creation', name: 'ProfileCreationScreen' },
            { id: 'main-menu', name: 'MainMenuScreen' }
        ];
        
        let allScreensAvailable = true;
        
        requiredScreens.forEach(screen => {
            const instance = window[screen.name.toLowerCase()];
            const isRegistered = window.eventSystem.screens[screen.id];
            
            console.log(`${screen.id}:`, {
                instance: instance ? '✅' : '❌',
                registered: isRegistered ? '✅' : '❌'
            });
            
            if (!instance || !isRegistered) {
                allScreensAvailable = false;
                console.warn(`⚠️ ${screen.id} não disponível ou não registrado`);
            }
        });
        
        if (!allScreensAvailable) {
            console.warn('⚠️ Algumas telas não estão disponíveis, tentando corrigir...');
            this.fixMissingScreens();
        }
        
        console.log('✅ Verificação de telas concluída');
    },
    
    fixMissingScreens: function() {
        console.log('🔧 [SystemInit] Corrigindo telas faltantes...');
        
        // Registrar telas que podem estar no window mas não no EventSystem
        const screenMap = [
            { id: 'profile-selection', instance: window.profileSelectionScreen },
            { id: 'profile-creation', instance: window.profileCreationScreen },
            { id: 'main-menu', instance: window.mainMenuScreen },
            { id: 'garage', instance: window.garageScreen },
            { id: 'settings', instance: window.settingsScreen }
        ];
        
        screenMap.forEach(screen => {
            if (screen.instance && !window.eventSystem.screens[screen.id]) {
                console.log(`🔧 Registrando ${screen.id}...`);
                window.eventSystem.registerScreen(screen.id, screen.instance);
            }
        });
    },
    
    startGameFlow: function() {
        console.log('🎯 [SystemInit] Iniciando fluxo do jogo...');
        
        // Pequeno delay para garantir que o DOM está pronto
        setTimeout(() => {
            // Verificar se temos ProfileManager
            if (window.profileManager) {
                this.startWithProfileManager();
            } else {
                this.startWithoutProfileManager();
            }
        }, 500);
    },
    
    startWithProfileManager: function() {
        console.log('👤 [SystemInit] Usando ProfileManager...');
        
        const profiles = window.profileManager.getAllProfiles();
        const currentProfile = window.profileManager.getCurrentProfile();
        
        console.log(`📊 Perfis encontrados: ${profiles.length}`);
        console.log(`👤 Perfil atual: ${currentProfile ? currentProfile.name : 'Nenhum'}`);
        
        // Sempre mostrar seleção de perfis, exceto se não houver nenhum perfil
        if (profiles.length === 0) {
            // Sem perfis -> Criação de Perfil
            console.log('🆕 Indo para criação de perfil');
            
            setTimeout(() => {
                window.eventSystem.showScreen('profile-creation');
                window.eventSystem.showNotification('Crie seu primeiro perfil!', 'info');
            }, 300);
        } else {
            // Tem perfis -> Sempre mostrar Seleção de Perfis (mesmo se houver perfil atual)
            if (currentProfile) {
                console.log(`🔄 Limpando perfil atual (${currentProfile.name}) para mostrar seleção`);
                // Limpar perfil atual para forçar seleção manual
                localStorage.removeItem('streetrod2_current_profile');
                localStorage.removeItem('sr2_currentProfile');
                window.currentProfile = null;
                window.eventSystem.setCurrentProfile(null);
            }
            
            console.log('👥 Indo para seleção de perfis');
            
            setTimeout(() => {
                window.eventSystem.showScreen('profile-selection');
                window.eventSystem.showNotification('Selecione um perfil para continuar', 'info');
            }, 300);
        }
    },
    
    startWithoutProfileManager: function() {
        console.warn('⚠️ [SystemInit] ProfileManager não disponível, usando fallback');
        
        // Verificar se há perfis no localStorage
        try {
            const savedProfiles = localStorage.getItem('streetrod2_profiles');
            const profiles = savedProfiles ? JSON.parse(savedProfiles) : [];
            
            if (profiles.length > 0) {
                // Tem perfis -> Seleção de Perfis
                console.log(`📊 ${profiles.length} perfis encontrados no localStorage`);
                setTimeout(() => {
                    window.eventSystem.showScreen('profile-selection');
                }, 300);
            } else {
                // Sem perfis -> Criação de Perfil
                console.log('🆕 Nenhum perfil encontrado, criando primeiro perfil');
                setTimeout(() => {
                    window.eventSystem.showScreen('profile-creation');
                }, 300);
            }
        } catch (error) {
            console.error('❌ Erro ao verificar perfis:', error);
            // Fallback absoluto: ir para criação de perfil
            setTimeout(() => {
                window.eventSystem.showScreen('profile-creation');
            }, 300);
        }
    },
    
    showErrorScreen: function(message) {
        const container = document.getElementById('game-container');
        if (!container) return;
        
        container.innerHTML = `
            <div style="
                min-height: 100vh;
                background: #0a0a0f;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 40px;
                text-align: center;
            ">
                <h1 style="color: #ff4757; margin-bottom: 20px;">ERRO DE SISTEMA</h1>
                <p style="color: #aaa; margin-bottom: 30px; max-width: 500px;">
                    ${message}
                </p>
                <div style="display: flex; gap: 15px;">
                    <button onclick="location.reload()" style="
                        padding: 12px 25px;
                        background: #ff4757;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-family: 'Rajdhani', sans-serif;
                        font-weight: bold;
                    ">
                        RECARREGAR
                    </button>
                    <button onclick="window.systemInit.initialize()" style="
                        padding: 12px 25px;
                        background: #1e90ff;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-family: 'Rajdhani', sans-serif;
                        font-weight: bold;
                    ">
                        TENTAR NOVAMENTE
                    </button>
                </div>
            </div>
        `;
    },
    
    restart: function() {
        console.log('🔄 [SystemInit] Reiniciando sistema...');
        this.isInitialized = false;
        
        // Limpar tela atual
        if (window.eventSystem && window.eventSystem.currentScreen) {
            if (window.eventSystem.currentScreen.cleanup) {
                window.eventSystem.currentScreen.cleanup();
            }
            window.eventSystem.currentScreen = null;
        }
        
        // Limpar container
        const container = document.getElementById('game-container');
        if (container) {
            container.innerHTML = '';
        }
        
        // Reiniciar após pequeno delay
        setTimeout(() => this.initialize(), 100);
    }
};

// Inicializar automaticamente quando tudo estiver carregado
window.addEventListener('load', function() {
    console.log('📦 [SystemInit] Página carregada, aguardando módulos...');
    
    // Aguardar um pouco para garantir que todos os módulos foram carregados
    setTimeout(() => {
        if (window.systemInit && window.systemInit.initialize) {
            window.systemInit.initialize();
        } else {
            console.error('❌ systemInit não encontrado');
        }
    }, 1000);
});

console.log('✅ [SystemInit] Módulo carregado e pronto');