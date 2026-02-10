// system-init-v3.js - Sistema de Inicialização Tolerante a Falhas
console.log('🚀 Inicializando Street Rod II v3...');

// Lista de dependências essenciais e opcionais
const DEPENDENCIES = {
    essential: ['ProfileManager', 'EventSystem', 'MainMenuScreen'],
    important: ['ProfileSelectionScreen', 'ProfileCreationScreen'],
    optional: ['GarageScreen', 'ShopScreen', 'RaceScreen']
};

// Verificar dependências de forma mais tolerante
function checkDependencies() {
    console.group('🔍 Verificando dependências...');

    let allOk = true;

    // Verificar dependências essenciais
    DEPENDENCIES.essential.forEach(dep => {
        if (!window[dep]) {
            console.error(`❌ ESSENCIAL não encontrada: ${dep}`);
            allOk = false;
        } else {
            console.log(`✅ ${dep} OK`);
        }
    });

    // Verificar dependências importantes
    DEPENDENCIES.important.forEach(dep => {
        if (!window[dep]) {
            console.warn(`⚠️  IMPORTANTE não encontrada: ${dep}`);
        } else {
            console.log(`✅ ${dep} OK`);
        }
    });

    // Verificar dependências opcionais
    DEPENDENCIES.optional.forEach(dep => {
        if (!window[dep]) {
            console.warn(`⚠️  OPICIONAL não encontrada: ${dep}`);
        } else {
            console.log(`✅ ${dep} OK`);
        }
    });

    console.groupEnd();

    if (!allOk) {
        console.error('❌ Falha crítica: dependências essenciais ausentes');
        return false;
    }

    console.log('✅ Dependências verificadas');
    return true;
}

// Criar telas substitutas para dependências faltantes
function createFallbackScreens() {
    console.log('🔧 Criando telas de fallback...');

    // Fallback para ProfileSelectionScreen
    if (!window.profileSelectionScreen && window.eventSystem) {
        console.log('🔧 Criando ProfileSelectionScreen fallback');
        window.profileSelectionScreen = {
            screenId: 'profile-selection',
            initialize: function () {
                const container = document.getElementById('game-container');
                container.innerHTML = `
                    <div style="padding: 40px; text-align: center;">
                        <h1 style="color: #ff4757;">SELECIONAR PERFIL</h1>
                        <p style="color: #aaa; margin: 20px 0;">Carregando perfis...</p>
                        <div id="saved-profiles-fallback"></div>
                        <button onclick="window.eventSystem.showScreen('profile-creation')" 
                                style="margin-top: 30px; padding: 12px 24px; background: #ff4757; color: white; border: none; border-radius: 6px;">
                            CRIAR NOVO PERFIL
                        </button>
                        <button onclick="window.eventSystem.showScreen('main-menu')" 
                                style="margin-top: 20px; padding: 10px 20px; background: #333; color: white; border: none; border-radius: 6px; display: block; margin-left: auto; margin-right: auto;">
                            VOLTAR
                        </button>
                    </div>
                `;
            }
        };
    }

    // Fallback para ProfileCreationScreen
    if (!window.profileCreationScreen && window.eventSystem) {
        console.log('🔧 Criando ProfileCreationScreen fallback');
        window.profileCreationScreen = {
            screenId: 'profile-creation',
            initialize: function () {
                const container = document.getElementById('game-container');
                container.innerHTML = `
                    <div style="padding: 40px; max-width: 500px; margin: 0 auto;">
                        <h1 style="color: #ff4757;">CRIAR PERFIL</h1>
                        
                        <div style="margin: 30px 0;">
                            <label style="display: block; margin-bottom: 10px; color: #fff;">NOME DO PERFIL:</label>
                            <input type="text" id="profile-name-input" 
                                   style="width: 100%; padding: 12px; background: #222; border: 2px solid #444; color: white; border-radius: 6px;"
                                   placeholder="Digite seu nome">
                        </div>
                        
                        <div style="margin: 30px 0;">
                            <label style="display: block; margin-bottom: 10px; color: #fff;">DIFICULDADE:</label>
                            <select id="profile-difficulty" style="width: 100%; padding: 12px; background: #222; border: 2px solid #444; color: white; border-radius: 6px;">
                                <option value="easy">Fácil</option>
                                <option value="normal" selected>Normal</option>
                                <option value="hard">Difícil</option>
                            </select>
                        </div>
                        
                        <button onclick="createProfileFallback()" 
                                style="width: 100%; padding: 15px; background: #2ed573; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                            CRIAR PERFIL
                        </button>
                        
                        <button onclick="window.eventSystem.showScreen('profile-selection')" 
                                style="width: 100%; margin-top: 20px; padding: 12px; background: #333; color: white; border: none; border-radius: 6px;">
                            CANCELAR
                        </button>
                    </div>
                `;
            }
        };

        // Função global para criação de perfil fallback
        window.createProfileFallback = function () {
            const nameInput = document.getElementById('profile-name-input');
            const difficultySelect = document.getElementById('profile-difficulty');

            if (!nameInput || !nameInput.value.trim()) {
                alert('Digite um nome para o perfil!');
                return;
            }

            const profileName = nameInput.value.trim();

            // Criar perfil básico
            const newProfile = {
                name: profileName,
                level: 1,
                cash: 10000,
                experience: 0,
                difficulty: difficultySelect ? difficultySelect.value : 'normal',
                vehicles: [],
                stats: {
                    races: 0,
                    wins: 0,
                    losses: 0
                },
                created: new Date().toISOString()
            };

            // Salvar usando ProfileManager se disponível
            if (window.profileManager && window.profileManager.createProfile) {
                window.profileManager.createProfile(profileName, newProfile);
                window.profileManager.selectProfile(profileName);
                window.eventSystem.setCurrentProfile(newProfile);
                window.eventSystem.showNotification(`Perfil ${profileName} criado com sucesso!`, 'success');
                window.eventSystem.showScreen('main-menu');
            } else {
                // Fallback local
                window.currentProfile = newProfile;
                window.eventSystem.setCurrentProfile(newProfile);
                localStorage.setItem(`profile_${profileName}`, JSON.stringify(newProfile));
                alert(`Perfil ${profileName} criado!`);
                window.eventSystem.showScreen('main-menu');
            }
        };
    }

    // Fallback para GarageScreen
    if (!window.garageScreen && window.eventSystem) {
        console.log('🔧 Criando GarageScreen fallback');
        window.garageScreen = {
            screenId: 'garage',
            initialize: function () {
                const container = document.getElementById('game-container');
                const profile = window.currentProfile || { name: 'Jogador', cash: 0 };

                container.innerHTML = `
                    <div style="padding: 30px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                            <h1 style="color: #ff4757;">GARAGEM</h1>
                            <div style="color: white;">
                                <strong>${profile.name}</strong> - $${profile.cash || 0}
                            </div>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                            <h2 style="color: white; margin-bottom: 20px;">MEUS VEÍCULOS</h2>
                            <div id="garage-vehicles" style="min-height: 200px; color: #aaa; text-align: center; padding: 40px;">
                                ${(profile.vehicles && profile.vehicles.length > 0) ?
                        'Carregando veículos...' :
                        'Sua garagem está vazia!<br>Vá à loja para comprar seu primeiro veículo.'}
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 15px; justify-content: center;">
                            <button onclick="window.eventSystem.showScreen('shop')" 
                                    style="padding: 12px 24px; background: #1e90ff; color: white; border: none; border-radius: 6px;">
                                IR PARA LOJA
                            </button>
                            <button onclick="window.eventSystem.showScreen('main-menu')" 
                                    style="padding: 12px 24px; background: #333; color: white; border: none; border-radius: 6px;">
                                VOLTAR
                            </button>
                        </div>
                    </div>
                `;
            }
        };
    }

    console.log('✅ Telas de fallback criadas');
}

// Registrar telas no EventSystem
function registerScreens() {
    console.log('📺 Registrando telas...');

    const screenRegistry = [
        { id: 'main-menu', instance: window.mainMenuScreen },
        { id: 'profile-selection', instance: window.profileSelectionScreen },
        { id: 'profile-creation', instance: window.profileCreationScreen },
        { id: 'garage', instance: window.garageScreen },
        { id: 'shop', instance: window.shopScreen },
        { id: 'race', instance: window.raceScreen },
        { id: 'settings', instance: window.settingsScreen }
    ];

    let registeredCount = 0;

    screenRegistry.forEach(screen => {
        if (screen.instance && window.eventSystem) {
            window.eventSystem.registerScreen(screen.id, screen.instance);
            registeredCount++;
            console.log(`  ✅ ${screen.id}`);
        } else {
            console.warn(`  ⚠️  ${screen.id} não disponível`);
        }
    });

    console.log(`✅ ${registeredCount} telas registradas`);
    return registeredCount > 0;
}

// Configurar ProfileManager
function setupProfileManager() {
    console.log('👤 Configurando ProfileManager...');

    if (window.profileManager) {
        window.eventSystem.profileManager = window.profileManager;
        console.log('✅ ProfileManager configurado');

        // Tentar carregar último perfil
        try {
            const lastProfile = window.profileManager.getCurrentProfile();
            if (lastProfile) {
                window.eventSystem.setCurrentProfile(lastProfile);
                console.log(`✅ Perfil carregado: ${lastProfile.name}`);
                return lastProfile;
            }
        } catch (error) {
            console.warn('⚠️  Erro ao carregar perfil:', error);
        }
    } else {
        console.warn('⚠️  ProfileManager não encontrado');
    }

    return null;
}

// Inicialização principal
function initializeGame() {
    console.group('🎮 Inicializando Street Rod II');

    try {
        // Verificar dependências críticas
        if (!window.eventSystem) {
            console.error('❌ EventSystem não encontrado!');
            throw new Error('EventSystem não disponível');
        }

        // Criar telas de fallback para as ausentes
        createFallbackScreens();

        // Configurar ProfileManager
        const currentProfile = setupProfileManager();

        // Registrar telas
        if (!registerScreens()) {
            console.warn('⚠️  Nenhuma tela registrada');
        }

        // Sempre mostrar seleção de perfis ao iniciar (exceto se não houver perfis)
        const profiles = window.profileManager ? window.profileManager.getAllProfiles() : [];
        
        if (profiles.length === 0) {
            console.log('🆕 Nenhum perfil encontrado, mostrando criação de perfil');
            window.eventSystem.showScreen('profile-creation');
        } else {
            // Limpar perfil atual para forçar seleção manual
            if (currentProfile) {
                console.log(`🔄 Limpando perfil atual (${currentProfile.name}) para mostrar seleção`);
                localStorage.removeItem('streetrod2_current_profile');
                localStorage.removeItem('sr2_currentProfile');
                window.currentProfile = null;
            }
            console.log('👤 Mostrando seleção de perfis');
            window.eventSystem.showScreen('profile-selection');
        }

        // Configurar atalhos de teclado
        setupKeyboardShortcuts();

        // Esconder tela de carregamento
        setTimeout(hideLoadingScreen, 1000);

        console.log('✅ Jogo inicializado com sucesso!');

    } catch (error) {
        console.error('❌ Erro na inicialização:', error);

        // Mostrar tela de erro
        const container = document.getElementById('game-container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 40px; text-align: center; color: white;">
                    <h1 style="color: #ff4757;">ERRO DE INICIALIZAÇÃO</h1>
                    <p style="margin: 20px 0; color: #aaa;">${error.message}</p>
                    <button onclick="location.reload()" 
                            style="padding: 12px 24px; background: #ff4757; color: white; border: none; border-radius: 6px; margin-top: 20px;">
                        RECARREGAR JOGO
                    </button>
                </div>
            `;
        }

        hideLoadingScreen();
    }

    console.groupEnd();
}

// Função auxiliar para esconder loading
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Configurar atalhos de teclado
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // ESC para voltar
        if (e.key === 'Escape') {
            if (window.eventSystem && window.eventSystem.currentScreen) {
                const screen = window.eventSystem.currentScreen;
                if (screen.screenId !== 'main-menu') {
                    window.eventSystem.showScreen('main-menu');
                }
            }
        }

        // F12 para debug
        if (e.key === 'F12') {
            console.log('=== DEBUG INFO ===');
            console.log('Perfil atual:', window.currentProfile);
            console.log('Telas registradas:', window.eventSystem ? Object.keys(window.eventSystem.screens) : 'N/A');
            console.log('ProfileManager:', window.profileManager ? 'Disponível' : 'Não disponível');
        }
    });
}

// Inicializar quando seguro
function safeInitialize() {
    // Esperar um pouco para garantir que os scripts sejam carregados
    if (!window.eventSystem || !window.mainMenuScreen) {
        console.log('⏳ Aguardando scripts...');
        setTimeout(safeInitialize, 100);
        return;
    }

    // Esperar DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeGame);
    } else {
        // DOM já carregado, dar um pequeno delay
        setTimeout(initializeGame, 100);
    }
}

// Iniciar processo
console.log('⏳ Preparando inicialização...');
setTimeout(safeInitialize, 500);

// Expor para debug
window.debugGame = function () {
    console.group('🐛 DEBUG DO JOGO');
    console.log('Scripts carregados:', window.loadedScripts || 'N/A');
    console.log('EventSystem:', window.eventSystem ? 'OK' : 'FALTANDO');
    console.log('ProfileManager:', window.profileManager ? 'OK' : 'FALTANDO');
    console.log('Perfil atual:', window.currentProfile);
    console.log('Telas disponíveis:', Object.keys(window).filter(key => key.endsWith('Screen')));
    console.groupEnd();
};

console.log('✅ system-init-v3.js carregado - Aguardando inicialização...');