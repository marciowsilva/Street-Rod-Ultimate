// js/EventSystemWrapper.js - WRAPPER COMPATÍVEL
class EventSystemWrapper {
    constructor(originalEventSystem) {
        this.original = originalEventSystem;
        this.screens = new Map();
        this.currentScreen = null;
        
        console.log('🔧 EventSystemWrapper inicializado');
        
        // Inicializar adaptador de telas
        this.screenAdapter = new ScreenAdapter();
        
        // Substituir métodos problemáticos
        this.patchEventSystem();
    }
    
    patchEventSystem() {
        if (!this.original) {
            console.error('❌ EventSystem original não encontrado');
            this.createFallbackSystem();
            return;
        }
        
        // Substituir showScreen para ser mais tolerante
        const originalShowScreen = this.original.showScreen;
        
        this.original.showScreen = async (screenId, data) => {
            console.log(`🎬 Tentando mostrar tela: ${screenId}`);
            
            try {
                // Verificar se a tela existe no original
                if (this.original.screens && this.original.screens.has(screenId)) {
                    return await originalShowScreen.call(this.original, screenId, data);
                }
                
                // Se não existir, usar nosso sistema adaptado
                return await this.showAdaptedScreen(screenId, data);
            } catch (error) {
                console.error(`❌ Erro ao mostrar tela ${screenId}:`, error);
                return this.showAdaptedScreen(screenId, data);
            }
        };
        
        // Manter referência aos outros métodos
        this.showScreen = (screenId, data) => this.original.showScreen(screenId, data);
        this.registerScreen = (screenId, screenClass) => this.original.registerScreen(screenId, screenClass);
        this.getCurrentScreen = () => this.original.getCurrentScreen ? this.original.getCurrentScreen() : this.currentScreen;
        
        console.log('✅ EventSystem original foi patchado com sucesso');
    }
    
    createFallbackSystem() {
        console.log('🔄 Criando sistema de fallback completo');
        
        // Criar um EventSystem básico
        this.original = {
            screens: new Map(),
            showScreen: async (screenId, data) => {
                return this.showAdaptedScreen(screenId, data);
            },
            registerScreen: (screenId, screenClass) => {
                this.screens.set(screenId, screenClass);
            },
            getCurrentScreen: () => this.currentScreen
        };
        
        window.eventSystem = this.original;
    }
    
    async showAdaptedScreen(screenId, data) {
        console.log(`🔄 Mostrando tela adaptada: ${screenId}`);
        
        // Mapear screenId para classe
        const screenMap = {
            'profile-selection': 'ProfileSelectionScreen',
            'profile-creation': 'ProfileCreationScreen',
            'main-menu': 'MainMenuScreen',
            'garage': 'GarageScreen',
            'shop': 'ShopScreen',
            'settings': 'SettingsScreen'
        };
        
        const className = screenMap[screenId] || screenId;
        
        if (!window[className]) {
            console.error(`❌ Classe ${className} não encontrada`);
            return this.showErrorScreen(`Tela ${screenId} não disponível`);
        }
        
        try {
            // Esconder tela atual
            if (this.currentScreen && this.currentScreen.hide) {
                await this.currentScreen.hide();
            }
            
            // Criar nova instância
            const screenInstance = new window[className]();
            
            // Mostrar nova tela
            if (screenInstance.show) {
                await screenInstance.show(data);
                this.currentScreen = screenInstance;
                console.log(`✅ Tela ${screenId} mostrada com sucesso`);
                return screenInstance;
            } else {
                throw new Error(`Tela ${className} não tem método show()`);
            }
        } catch (error) {
            console.error(`❌ Erro ao mostrar ${screenId}:`, error);
            return this.showErrorScreen(`Erro: ${error.message}`);
        }
    }
    
    showErrorScreen(message) {
        const container = document.getElementById('game-container');
        if (container) {
            container.innerHTML = `
                <div class="error-screen">
                    <h2>⚠️ ERRO DO SISTEMA</h2>
                    <p>${message}</p>
                    <button onclick="location.reload()">RECARREGAR</button>
                    <button onclick="eventSystem.showScreen('main-menu')">MENU PRINCIPAL</button>
                </div>
            `;
        }
    }
}