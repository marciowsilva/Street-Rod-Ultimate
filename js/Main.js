// js/main.js - VERIFICAÇÃO DE CRIAÇÃO DE TELAS
class Game {
    constructor() {
        console.log('🚗 Street Rod II - Inicializando Game...');
        
        // Inicializar sistemas
        this.initSystems();
        
        // Configurar eventos globais
        this.setupGlobalEvents();
        
        // Iniciar jogo
        this.start();
    }
    
    initSystems() {
        console.log('🔧 Inicializando sistemas...');
        
        // Sistema de eventos
        this.eventSystem = new EventSystem();
        console.log('✅ EventSystem:', this.eventSystem ? 'OK' : 'FALHA');
        
        // Gerenciador de perfil
        this.profileManager = new ProfileManager();
        console.log('✅ ProfileManager:', this.profileManager ? 'OK' : 'FALHA');
        
        // Sistema de notificações
        this.notifications = new GameNotifications();
        console.log('✅ GameNotifications:', this.notifications ? 'OK' : 'FALHA');
        
        // Gerenciador de telas (CRÍTICO)
        this.screenManager = new ScreenManager(this.eventSystem);
        console.log('✅ ScreenManager:', this.screenManager ? 'OK' : 'FALHA');
        
        // Expor globalmente para debug
        window.game = this;
        window.eventSystem = this.eventSystem;
        window.profileManager = this.profileManager;
        window.GameNotifications = this.notifications;
        window.screenManager = this.screenManager;
        
        console.log('✅ Sistemas inicializados');
    }
    
    setupGlobalEvents() {
        console.log('🔧 Configurando eventos globais...');
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                console.log('🔇 Mute pressionado');
            }
        });
        
        console.log('✅ Eventos globais configurados');
    }
    
    start() {
        console.log('🎮 Iniciando jogo...');
        
        // Carregar ou criar perfil
        this.loadOrCreateProfile();
        
        // Criar telas (IMPORTANTE: na ordem correta)
        this.createScreens();
        
        // Mostrar menu principal
        console.log('📱 Tentando mostrar main-menu...');
        const success = this.screenManager.showScreen('main-menu');
        
        if (success) {
            console.log('✅ Jogo iniciado com sucesso!');
            
            // Notificação de boas-vindas
            setTimeout(() => {
                if (window.GameNotifications) {
                    window.GameNotifications.success('🎮 Bem-vindo ao Street Rod II!');
                }
            }, 1000);
        } else {
            console.error('❌ Falha ao iniciar jogo');
        }
    }
    
    loadOrCreateProfile() {
        console.log('👤 Carregando/criando perfil...');
        
        const profile = this.profileManager.loadProfile();
        
        if (!profile) {
            console.log('👤 Criando novo perfil...');
            const newProfile = this.profileManager.createNewProfile('Jogador');
            this.profileManager.saveProfile(newProfile);
            window.currentProfile = newProfile;
            
            if (window.GameNotifications) {
                window.GameNotifications.success('👤 Novo perfil criado!');
            }
        } else {
            window.currentProfile = profile;
            console.log(`👤 Perfil carregado: ${profile.name} (Level ${profile.level})`);
            
            if (window.GameNotifications) {
                window.GameNotifications.info(`👤 Bem-vindo de volta, ${profile.name}!`);
            }
        }
    }
    
    createScreens() {
        console.log('📱 Criando telas...');
        
        // IMPORTANTE: A ordem pode ser importante dependendo das dependências
        
        // 1. Menu Principal (PRIMEIRO)
        console.log('📱 Criando MainMenuScreen...');
        try {
            new MainMenuScreen(this.screenManager, this.eventSystem);
            console.log('✅ MainMenuScreen criado');
        } catch (error) {
            console.error('❌ Erro ao criar MainMenuScreen:', error);
        }
        
        // 2. Garagem
        console.log('📱 Criando GarageScreen...');
        try {
            new GarageScreen(this.screenManager, this.eventSystem);
            console.log('✅ GarageScreen criado');
        } catch (error) {
            console.error('❌ Erro ao criar GarageScreen:', error);
        }
        
        // 3. Loja
        console.log('📱 Criando ShopScreen...');
        try {
            new ShopScreen(this.screenManager, this.eventSystem);
            console.log('✅ ShopScreen criado');
        } catch (error) {
            console.error('❌ Erro ao criar ShopScreen:', error);
        }
        
        // 4. Corrida (ÚLTIMO - pode depender das outras)
        console.log('📱 Criando RaceScreen...');
        try {
            new RaceScreen(this.screenManager, this.eventSystem);
            console.log('✅ RaceScreen criado');
        } catch (error) {
            console.error('❌ Erro ao criar RaceScreen:', error);
        }
        
        // Debug: listar telas registradas
        console.log('📱 Telas registradas:', Object.keys(this.screenManager.screens));
        
        console.log('✅ Telas criadas');
    }
}