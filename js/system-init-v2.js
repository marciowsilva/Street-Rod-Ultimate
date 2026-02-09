// js/system-init-v2.js - SISTEMA DE INICIALIZAÇÃO RESTAURADO
class SystemInitializerV2 {
    constructor() {
        console.log('🚀 Street Rod II Ultimate - Sistema de Inicialização V2');
        this.init();
    }
    
    async init() {
        try {
            // 1. Mostrar tela de carregamento
            await this.showLoadingScreen();
            
            // 2. Inicializar ProfileManager
            await this.initProfileManager();
            
            // 3. Inicializar EventSystem com wrapper
            await this.initEventSystem();
            
            // 4. Verificar perfil ativo
            await this.checkActiveProfile();
            
            // 5. Carregar módulos principais
            await this.loadCoreModules();
            
            console.log('✅ Sistema completamente inicializado!');
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            this.showFatalError(error);
        }
    }
    
    async showLoadingScreen() {
        // Usar o LoadingScreen original se existir
        if (window.LoadingScreen) {
            const loadingScreen = new LoadingScreen();
            if (loadingScreen.show) {
                return loadingScreen.show();
            }
        }
        
        // Fallback básico
        const container = document.getElementById('game-container');
        if (container) {
            container.innerHTML = `
                <div class="loading-screen">
                    <h1>STREET ROD II ULTIMATE</h1>
                    <div class="loading-bar">
                        <div class="loading-progress" style="width: 0%"></div>
                    </div>
                    <p class="loading-text">Inicializando sistema...</p>
                </div>
            `;
            
            // Animar barra de progresso
            const progress = container.querySelector('.loading-progress');
            const text = container.querySelector('.loading-text');
            const steps = [
                'Carregando módulos principais...',
                'Inicializando ProfileManager...',
                'Configurando EventSystem...',
                'Verificando perfis...',
                'Pronto para jogar!'
            ];
            
            for (let i = 0; i <= 100; i += 20) {
                progress.style.width = `${i}%`;
                if (steps[i/20]) {
                    text.textContent = steps[i/20];
                }
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    async initProfileManager() {
        console.log('👤 Inicializando ProfileManager...');
        
        if (!window.ProfileManager) {
            console.error('❌ ProfileManager não encontrado!');
            throw new Error('ProfileManager é necessário');
        }
        
        // Inicializar com dados padrão se não houver perfis
        const profiles = ProfileManager.getAllProfiles();
        if (profiles.length === 0) {
            console.log('📝 Criando perfil padrão...');
            ProfileManager.createProfile('Jogador', 'car1');
        }
        
        console.log(`✅ ProfileManager inicializado: ${profiles.length} perfis encontrados`);
        return true;
    }
    
    async initEventSystem() {
        console.log('🎮 Inicializando EventSystem...');
        
        // Aguardar EventSystem original carregar
        let attempts = 0;
        while (!window.EventSystem && attempts < 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (window.EventSystem) {
            console.log('✅ EventSystem original encontrado, aplicando wrapper...');
            
            // Criar instância original
            const originalES = new EventSystem();
            window.eventSystem = originalES;
            
            // Aplicar wrapper
            window.eventSystemWrapper = new EventSystemWrapper(originalES);
            
            // Registrar telas adaptadas
            this.registerAllScreens(originalES);
            
        } else {
            console.log('⚠️ EventSystem não encontrado, usando wrapper completo');
            window.eventSystemWrapper = new EventSystemWrapper(null);
            window.eventSystem = window.eventSystemWrapper.original;
        }
        
        console.log('✅ Sistema de eventos pronto');
    }
    
    registerAllScreens(eventSystem) {
        const screens = {
            'profile-selection': window.ProfileSelectionScreen,
            'profile-creation': window.ProfileCreationScreen,
            'main-menu': window.MainMenuScreen,
            'garage': window.GarageScreen,
            'shop': window.ShopScreen,
            'settings': window.SettingsScreen
        };
        
        Object.entries(screens).forEach(([id, ScreenClass]) => {
            if (ScreenClass) {
                eventSystem.registerScreen(id, ScreenClass);
                console.log(`✅ Tela registrada: ${id}`);
            } else {
                console.warn(`⚠️ Classe para ${id} não encontrada`);
            }
        });
    }
    
    async checkActiveProfile() {
        const activeProfile = ProfileManager.getActiveProfile();
        
        if (!activeProfile) {
            console.log('👤 Nenhum perfil ativo, indo para seleção...');
            if (window.eventSystem) {
                await eventSystem.showScreen('profile-selection');
            }
        } else {
            console.log(`👤 Perfil ativo: ${activeProfile.name}`);
            if (window.eventSystem) {
                await eventSystem.showScreen('main-menu');
            }
        }
    }
    
    async loadCoreModules() {
        console.log('📦 Carregando módulos principais...');
        
        // Lista de módulos essenciais
        const modules = [
            { name: 'Sistema de Áudio', check: () => typeof AudioManager !== 'undefined' },
            { name: 'Sistema de Carros', check: () => typeof CarSystem !== 'undefined' },
            { name: 'Sistema de Corridas', check: () => typeof RaceSystem !== 'undefined' }
        ];
        
        for (const module of modules) {
            if (!module.check()) {
                console.warn(`⚠️ ${module.name} não encontrado`);
            } else {
                console.log(`✅ ${module.name} carregado`);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    showFatalError(error) {
        const container = document.getElementById('game-container');
        if (container) {
            container.innerHTML = `
                <div class="fatal-error">
                    <h1>💥 ERRO FATAL</h1>
                    <p>O sistema não pôde ser inicializado</p>
                    <pre>${error.message || error}</pre>
                    <button onclick="location.reload()">TENTAR NOVAMENTE</button>
                    <button onclick="localStorage.clear(); location.reload()">LIMPAR DADOS E REINICIAR</button>
                </div>
            `;
        }
    }
}