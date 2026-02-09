// bootstrap.js - Inicialização à prova de falhas
console.log('🚀 BOOTSTRAP - Inicializando Street Rod II...');

// Configuração global
window.game = window.game || {
    version: '2.0.0',
    isInitialized: false,
    currentScreen: ''
};

window.currentProfile = window.currentProfile || null;

// Função para carregar scripts dinamicamente
function loadScript(src) {
    return new Promise((resolve, reject) => {
        console.log(`📦 Carregando: ${src}`);
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`✅ ${src} carregado`);
            resolve();
        };
        script.onerror = () => {
            console.error(`❌ Falha ao carregar: ${src}`);
            reject(new Error(`Falha ao carregar ${src}`));
        };
        
        document.head.appendChild(script);
    });
}

// Função para inicializar o sistema
async function initializeSystem() {
    console.log('🎮 Inicializando sistema...');
    
    try {
        // 1. Carregar scripts essenciais se não estiverem carregados
        const essentialScripts = [
            'js/ProfileManager.js',
            'js/EventSystem.js',
            'js/MainMenuScreen.js',
            'js/ProfileSelectionScreen.js',
            'js/ProfileCreationScreen.js'
        ];
        
        for (const script of essentialScripts) {
            // Verificar se já está carregado
            const scriptName = script.split('/').pop().replace('.js', '');
            const isLoaded = window[scriptName] || window[scriptName.toLowerCase()];
            
            if (!isLoaded) {
                await loadScript(script);
            }
        }
        
        // 2. Aguardar EventSystem
        if (!window.eventSystem) {
            console.warn('⚠️ EventSystem não carregado, tentando novamente...');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (!window.eventSystem) {
                throw new Error('EventSystem não carregado após tentativa');
            }
        }
        
        // 3. Registrar todas as telas
        console.log('📺 Registrando telas...');
        
        const screens = [
            { id: 'main-menu', instance: window.mainMenuScreen },
            { id: 'profile-selection', instance: window.profileSelectionScreen },
            { id: 'profile-creation', instance: window.profileCreationScreen },
            { id: 'garage', instance: window.garageScreen },
            { id: 'settings', instance: window.settingsScreen }
        ];
        
        screens.forEach(screen => {
            if (screen.instance) {
                window.eventSystem.registerScreen(screen.id, screen.instance);
                console.log(`   ✅ ${screen.id}`);
            } else {
                console.warn(`   ⚠️ ${screen.id} não disponível`);
            }
        });
        
        // 4. Esconder loading
        console.log('🎯 Escondendo loading...');
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                console.log('✅ Loading escondido');
                
                // 5. Mostrar tela apropriada
                showFirstScreen();
            }, 500);
        } else {
            // Se não tem loading, mostrar diretamente
            showFirstScreen();
        }
        
        window.game.isInitialized = true;
        console.log('✅ Sistema inicializado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showErrorScreen(`Erro: ${error.message}`);
    }
}

function showFirstScreen() {
    console.log('🔍 Decidindo primeira tela...');
    
    let targetScreen = 'profile-selection';
    let profileName = '';
    
    // Verificar perfis
    if (window.profileManager) {
        const profiles = window.profileManager.getAllProfiles();
        const currentProfile = window.profileManager.getCurrentProfile();
        
        console.log(`📊 ${profiles.length} perfil(s) encontrado(s)`);
        
        if (currentProfile) {
            targetScreen = 'main-menu';
            profileName = currentProfile.name;
            window.eventSystem.setCurrentProfile(currentProfile);
        } else if (profiles.length === 0) {
            targetScreen = 'profile-creation';
        }
    }
    
    console.log(`🎯 Mostrando: ${targetScreen}`);
    
    // Mostrar tela
    if (window.eventSystem.showScreen(targetScreen)) {
        console.log(`✅ Tela ${targetScreen} mostrada`);
        
        // Notificação de boas-vindas
        if (targetScreen === 'main-menu' && profileName) {
            setTimeout(() => {
                if (window.eventSystem.showNotification) {
                    window.eventSystem.showNotification(`Bem-vindo, ${profileName}!`, 'success');
                }
            }, 800);
        }
    } else {
        console.error(`❌ Falha ao mostrar ${targetScreen}`);
        
        // Fallback
        if (targetScreen !== 'profile-selection') {
            window.eventSystem.showScreen('profile-selection');
        }
    }
}

function showErrorScreen(message) {
    const container = document.getElementById('game-container');
    if (container) {
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
                <div style="display: flex; gap: 15px; margin-top: 20px;">
                    <button onclick="location.reload()" style="
                        padding: 12px 25px;
                        background: #ff4757;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-family: 'Rajdhani', sans-serif;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                        RECARREGAR
                    </button>
                    <button onclick="window.initializeSystem()" style="
                        padding: 12px 25px;
                        background: #1e90ff;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-family: 'Rajdhani', sans-serif;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                        TENTAR NOVAMENTE
                    </button>
                </div>
            </div>
        `;
    }
    
    // Esconder loading
    const loading = document.getElementById('loading-screen');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📦 DOM carregado, iniciando bootstrap...');
        setTimeout(initializeSystem, 100);
    });
} else {
    console.log('⚡ DOM já carregado, iniciando imediatamente...');
    setTimeout(initializeSystem, 100);
}

// Expor função para uso manual
window.initializeSystem = initializeSystem;
window.showFirstScreen = showFirstScreen;

console.log('✅ Bootstrap carregado e pronto');