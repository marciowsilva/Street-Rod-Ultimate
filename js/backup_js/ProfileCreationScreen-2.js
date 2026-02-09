// ProfileCreationScreen.js - VERSÃO ULTRA SIMPLES
console.log('🆕 [ProfileCreationScreen] Carregando...');

class ProfileCreationScreen {
    constructor() {
        this.screenId = 'profile-creation';
        console.log('✅ [ProfileCreationScreen] Inicializado');
    }
    
    initialize() {
        console.log('🆕 [ProfileCreationScreen] Inicializando...');
        this.createSimpleScreen();
    }
    
    createSimpleScreen() {
        const container = document.getElementById('game-container');
        if (!container) {
            console.error('❌ Container não encontrado');
            return;
        }
        
        container.innerHTML = `
            <div style="
                min-height: 100vh;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                padding: 40px;
                color: white;
                text-align: center;
            ">
                <h1 style="color: #ff4757; font-size: 3rem; margin-bottom: 30px;">
                    CRIAR PERFIL
                </h1>
                
                <div style="
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    padding: 40px;
                    max-width: 500px;
                    margin: 0 auto;
                ">
                    <div style="margin-bottom: 30px;">
                        <input type="text" id="profile-name-input" placeholder="Digite seu nome" style="
                            width: 100%;
                            padding: 15px;
                            background: rgba(255, 255, 255, 0.1);
                            border: 2px solid #444;
                            border-radius: 8px;
                            color: white;
                            font-size: 1.2rem;
                            text-align: center;
                        ">
                    </div>
                    
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button onclick="createProfileSimple()" style="
                            padding: 15px 30px;
                            background: #2ed573;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 1.2rem;
                            cursor: pointer;
                        ">
                            CRIAR
                        </button>
                        
                        <button onclick="goBackToSelection()" style="
                            padding: 15px 30px;
                            background: #333;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 1.2rem;
                            cursor: pointer;
                        ">
                            CANCELAR
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    cleanup() {
        console.log('🧹 [ProfileCreationScreen] Limpando');
    }
}

// Funções globais para os botões
window.createProfileSimple = function() {
    const nameInput = document.getElementById('profile-name-input');
    if (!nameInput || !nameInput.value.trim()) {
        alert('Digite um nome para o perfil!');
        return;
    }
    
    const profileName = nameInput.value.trim();
    console.log(`🆕 Criando perfil: ${profileName}`);
    
    // Criar perfil básico
    const newProfile = {
        name: profileName,
        level: 1,
        cash: 15000,
        vehicles: [],
        stats: { races: 0, wins: 0 }
    };
    
    // Usar ProfileManager se disponível
    if (window.profileManager && window.profileManager.createProfile) {
        if (window.profileManager.createProfile(profileName, newProfile)) {
            window.profileManager.selectProfile(profileName);
            window.eventSystem.setCurrentProfile(newProfile);
            alert(`Perfil ${profileName} criado com sucesso!`);
            window.eventSystem.showScreen('main-menu');
            return;
        }
    }
    
    // Fallback
    alert(`Perfil ${profileName} criado! (modo fallback)`);
    window.currentProfile = newProfile;
    window.eventSystem.showScreen('main-menu');
};

window.goBackToSelection = function() {
    console.log('↩ Voltando para seleção de perfis');
    window.eventSystem.showScreen('profile-selection');
};

// Exportar PARA O WINDOW - ESTA É A PARTE IMPORTANTE
if (typeof window !== 'undefined') {
    window.profileCreationScreen = new ProfileCreationScreen();
    console.log('✅ [ProfileCreationScreen] Exportado para window.profileCreationScreen');
    
    // Verificar se foi exportado
    console.log('🔍 Verificação:', {
        temProfileCreationScreen: !!window.profileCreationScreen,
        tipo: typeof window.profileCreationScreen,
        temInitialize: !!window.profileCreationScreen.initialize
    });
}