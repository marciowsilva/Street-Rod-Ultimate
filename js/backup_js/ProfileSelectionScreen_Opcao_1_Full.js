// ProfileSelectionScreen.js - VERSÃO COMPLETA ORIGINAL
console.log('👥 Carregando ProfileSelectionScreen Original...');

class ProfileSelectionScreen {
    constructor() {
        this.screenId = 'profile-selection';
        this.profiles = [];
        console.log('✅ ProfileSelectionScreen Original inicializado');
    }
    
    initialize() {
        console.log('👥 Inicializando seleção de perfis original...');
        this.render();
        this.loadProfiles();
        this.attachEvents();
    }
    
    render() {
        const container = document.getElementById('game-container');
        if (!container) return;
        
        container.innerHTML = `
            <div id="profile-selection" class="screen">
                <!-- CABEÇALHO -->
                <div class="screen-header" style="
                    padding: 30px;
                    text-align: center;
                    background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                    border-bottom: 3px solid #ff4757;
                ">
                    <h1 style="
                        color: #ff4757;
                        font-size: 3.5rem;
                        text-transform: uppercase;
                        letter-spacing: 4px;
                        margin-bottom: 10px;
                        text-shadow: 0 0 20px rgba(255, 71, 87, 0.5);
                    ">
                        STREET ROD <span style="color: white;">II</span>
                    </h1>
                    <p style="color: #aaa; font-size: 1.2rem; letter-spacing: 2px;">
                        Sistema de Múltiplos Perfis
                    </p>
                </div>
                
                <!-- CONTEÚDO PRINCIPAL -->
                <div class="screen-content" style="
                    padding: 40px;
                    background: #0a0a0f;
                    min-height: 70vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                ">
                    <!-- CARD DE PERFIS -->
                    <div style="
                        width: 100%;
                        max-width: 900px;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 20px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        padding: 40px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                        margin-bottom: 30px;
                    ">
                        <!-- TÍTULO DO CARD -->
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 30px;
                            padding-bottom: 20px;
                            border-bottom: 2px solid rgba(255, 71, 87, 0.3);
                        ">
                            <h2 style="
                                color: white;
                                font-size: 2rem;
                                display: flex;
                                align-items: center;
                                gap: 15px;
                            ">
                                <span style="font-size: 2.5rem;">👤</span>
                                PERFIS SALVOS
                            </h2>
                            <div style="
                                background: rgba(255, 71, 87, 0.2);
                                color: #ff4757;
                                padding: 10px 25px;
                                border-radius: 20px;
                                font-weight: bold;
                                font-size: 1.1rem;
                            ">
                                <span id="profiles-count">0</span> PERFIS
                            </div>
                        </div>
                        
                        <!-- LISTA DE PERFIS -->
                        <div id="profiles-container" style="min-height: 300px;">
                            <!-- Perfis serão carregados aqui -->
                            <div style="
                                text-align: center;
                                padding: 60px 20px;
                                color: #666;
                            ">
                                <div style="font-size: 5rem; margin-bottom: 20px;">👤</div>
                                <h3 style="color: #aaa; margin-bottom: 15px; font-size: 1.5rem;">
                                    Nenhum perfil encontrado
                                </h3>
                                <p style="color: #666; max-width: 400px; margin: 0 auto 30px; line-height: 1.6;">
                                    Crie seu primeiro perfil para começar sua jornada no Street Rod II!
                                </p>
                                <button id="create-first-profile" style="
                                    padding: 15px 40px;
                                    background: #ff4757;
                                    color: white;
                                    border: none;
                                    border-radius: 10px;
                                    font-size: 1.2rem;
                                    font-weight: bold;
                                    cursor: pointer;
                                    transition: all 0.3s;
                                ">
                                    CRIAR PRIMEIRO PERFIL
                                </button>
                            </div>
                        </div>
                        
                        <!-- ESTATÍSTICAS -->
                        <div style="
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            gap: 20px;
                            margin-top: 40px;
                            padding-top: 30px;
                            border-top: 1px solid rgba(255, 255, 255, 0.1);
                        ">
                            <div style="
                                background: rgba(255, 255, 255, 0.05);
                                padding: 20px;
                                border-radius: 12px;
                                text-align: center;
                            ">
                                <div style="color: #4cd137; font-size: 2rem; font-weight: bold; margin-bottom: 10px;">
                                    $<span id="total-cash">0</span>
                                </div>
                                <div style="color: #aaa; font-size: 0.9rem;">
                                    DINHEIRO TOTAL
                                </div>
                            </div>
                            
                            <div style="
                                background: rgba(255, 255, 255, 0.05);
                                padding: 20px;
                                border-radius: 12px;
                                text-align: center;
                            ">
                                <div style="color: white; font-size: 2rem; font-weight: bold; margin-bottom: 10px;">
                                    <span id="total-wins">0</span>
                                </div>
                                <div style="color: #aaa; font-size: 0.9rem;">
                                    VITÓRIAS TOTAIS
                                </div>
                            </div>
                            
                            <div style="
                                background: rgba(255, 255, 255, 0.05);
                                padding: 20px;
                                border-radius: 12px;
                                text-align: center;
                            ">
                                <div style="color: white; font-size: 2rem; font-weight: bold; margin-bottom: 10px;">
                                    <span id="total-vehicles">0</span>
                                </div>
                                <div style="color: #aaa; font-size: 0.9rem;">
                                    VEÍCULOS
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- BOTÕES DE AÇÃO -->
                    <div style="
                        display: flex;
                        gap: 20px;
                        justify-content: center;
                        flex-wrap: wrap;
                        width: 100%;
                        max-width: 900px;
                    ">
                        <button id="create-profile-btn" style="
                            padding: 20px 50px;
                            background: linear-gradient(135deg, #2ed573, #26c46a);
                            color: white;
                            border: none;
                            border-radius: 12px;
                            font-size: 1.3rem;
                            font-weight: bold;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 15px;
                            transition: all 0.3s;
                            min-width: 300px;
                        ">
                            <span style="font-size: 1.8rem;">+</span>
                            CRIAR NOVO PERFIL
                        </button>
                        
                        <button id="refresh-btn" style="
                            padding: 20px 40px;
                            background: rgba(255, 255, 255, 0.1);
                            color: white;
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 12px;
                            font-size: 1.3rem;
                            font-weight: bold;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 15px;
                            transition: all 0.3s;
                        ">
                            <span style="font-size: 1.5rem;">🔄</span>
                            ATUALIZAR
                        </button>
                    </div>
                </div>
                
                <!-- RODAPÉ -->
                <div class="screen-footer" style="
                    padding: 30px;
                    background: rgba(0, 0, 0, 0.5);
                    text-align: center;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                ">
                    <p style="color: #666; margin-bottom: 10px;">
                        Street Rod II v2.0 • Sistema de Perfis
                    </p>
                    <p style="color: #444; font-size: 0.9rem;">
                        Dica: Você pode criar múltiplos perfis para experimentar diferentes estilos de jogo
                    </p>
                </div>
            </div>
        `;
        
        // Adicionar estilos para hover
        this.addHoverStyles();
    }
    
    addHoverStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #create-profile-btn:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 30px rgba(46, 213, 115, 0.3);
            }
            
            #refresh-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            }
            
            #create-first-profile:hover {
                background: #ff2e43;
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(255, 71, 87, 0.3);
            }
            
            .profile-card {
                transition: all 0.3s ease;
            }
            
            .profile-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            }
        `;
        document.head.appendChild(style);
    }
    
    loadProfiles() {
        console.log('📋 Carregando perfis...');
        
        if (window.profileManager) {
            this.profiles = window.profileManager.getAllProfiles();
            console.log(`✅ ${this.profiles.length} perfil(s) carregado(s)`);
        } else {
            // Fallback
            try {
                const saved = localStorage.getItem('streetrod2_profiles');
                this.profiles = saved ? JSON.parse(saved) : [];
                console.log(`✅ ${this.profiles.length} perfil(s) carregado(s) do localStorage`);
            } catch (error) {
                console.error('❌ Erro ao carregar perfis:', error);
                this.profiles = [];
            }
        }
        
        this.renderProfiles();
        this.updateStats();
    }
    
    renderProfiles() {
        const container = document.getElementById('profiles-container');
        const counter = document.getElementById('profiles-count');
        
        if (!container || !counter) return;
        
        counter.textContent = this.profiles.length;
        
        if (this.profiles.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #666;">
                    <div style="font-size: 5rem; margin-bottom: 20px;">👤</div>
                    <h3 style="color: #aaa; margin-bottom: 15px; font-size: 1.5rem;">
                        Nenhum perfil encontrado
                    </h3>
                    <p style="color: #666; max-width: 400px; margin: 0 auto 30px; line-height: 1.6;">
                        Crie seu primeiro perfil para começar sua jornada no Street Rod II!
                    </p>
                    <button id="create-first-profile" style="
                        padding: 15px 40px;
                        background: #ff4757;
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-size: 1.2rem;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">
                        CRIAR PRIMEIRO PERFIL
                    </button>
                </div>
            `;
            return;
        }
        
        // Obter perfil atual
        const currentProfile = window.profileManager ? 
            window.profileManager.getCurrentProfile() : 
            (window.currentProfile || null);
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        
        this.profiles.forEach(profile => {
            const isCurrent = currentProfile && currentProfile.name === profile.name;
            const createdDate = profile.created ? 
                new Date(profile.created).toLocaleDateString('pt-BR') : 'Data desconhecida';
            
            // Calcular estatísticas
            const totalWins = profile.stats?.wins || 0;
            const totalRaces = profile.stats?.races || 0;
            const winRate = totalRaces > 0 ? Math.round((totalWins / totalRaces) * 100) : 0;
            const totalVehicles = profile.vehicles?.length || 0;
            const totalCash = profile.cash || 0;
            
            html += `
                <div class="profile-card" data-profile-name="${profile.name}" style="
                    background: ${isCurrent ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 255, 255, 0.08)'};
                    border: 2px solid ${isCurrent ? '#2ed573' : 'rgba(255, 255, 255, 0.1)'};
                    border-radius: 15px;
                    padding: 25px;
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                ">
                    ${isCurrent ? `
                    <div style="
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: #2ed573;
                        color: white;
                        padding: 5px 15px;
                        border-radius: 15px;
                        font-size: 0.8rem;
                        font-weight: bold;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    ">
                        ✓ SELECIONADO
                    </div>
                    ` : ''}
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                        <div>
                            <div style="
                                color: ${isCurrent ? '#2ed573' : 'white'};
                                font-size: 1.8rem;
                                font-weight: bold;
                                margin-bottom: 8px;
                            ">
                                ${profile.name}
                                <span style="
                                    background: rgba(255, 71, 87, 0.2);
                                    color: #ff4757;
                                    padding: 4px 12px;
                                    border-radius: 10px;
                                    font-size: 0.9rem;
                                    margin-left: 10px;
                                    font-weight: bold;
                                ">
                                    NÍVEL ${profile.level || 1}
                                </span>
                            </div>
                            <div style="color: #aaa; font-size: 0.9rem;">
                                Criado em ${createdDate}
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 10px;">
                            <button onclick="event.stopPropagation(); selectProfileOriginal('${profile.name.replace(/'/g, "\\'")}')" style="
                                padding: 10px 25px;
                                background: ${isCurrent ? '#2ed573' : '#1e90ff'};
                                color: white;
                                border: none;
                                border-radius: 8px;
                                font-weight: bold;
                                cursor: pointer;
                                font-size: 1rem;
                                min-width: 120px;
                            ">
                                ${isCurrent ? 'CONTINUAR' : 'SELECIONAR'}
                            </button>
                            <button onclick="event.stopPropagation(); deleteProfileOriginal('${profile.name.replace(/'/g, "\\'")}')" style="
                                padding: 10px 20px;
                                background: rgba(255, 71, 87, 0.2);
                                color: #ff4757;
                                border: 1px solid rgba(255, 71, 87, 0.3);
                                border-radius: 8px;
                                font-weight: bold;
                                cursor: pointer;
                            ">
                                EXCLUIR
                            </button>
                        </div>
                    </div>
                    
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 15px;
                        margin-bottom: 20px;
                    ">
                        <div style="
                            background: rgba(255, 255, 255, 0.05);
                            padding: 15px;
                            border-radius: 10px;
                        ">
                            <div style="color: #aaa; font-size: 0.9rem; margin-bottom: 5px;">
                                DINHEIRO
                            </div>
                            <div style="color: #4cd137; font-size: 1.5rem; font-weight: bold;">
                                $${totalCash.toLocaleString()}
                            </div>
                        </div>
                        
                        <div style="
                            background: rgba(255, 255, 255, 0.05);
                            padding: 15px;
                            border-radius: 10px;
                        ">
                            <div style="color: #aaa; font-size: 0.9rem; margin-bottom: 5px;">
                                VITÓRIAS
                            </div>
                            <div style="color: white; font-size: 1.5rem; font-weight: bold;">
                                ${totalWins}
                            </div>
                        </div>
                        
                        <div style="
                            background: rgba(255, 255, 255, 0.05);
                            padding: 15px;
                            border-radius: 10px;
                        ">
                            <div style="color: #aaa; font-size: 0.9rem; margin-bottom: 5px;">
                                VEÍCULOS
                            </div>
                            <div style="color: white; font-size: 1.5rem; font-weight: bold;">
                                ${totalVehicles}
                            </div>
                        </div>
                        
                        <div style="
                            background: rgba(255, 255, 255, 0.05);
                            padding: 15px;
                            border-radius: 10px;
                        ">
                            <div style="color: #aaa; font-size: 0.9rem; margin-bottom: 5px;">
                                TAXA DE VITÓRIA
                            </div>
                            <div style="color: white; font-size: 1.5rem; font-weight: bold;">
                                ${winRate}%
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <div style="
                            background: rgba(255, 255, 255, 0.1);
                            padding: 8px 15px;
                            border-radius: 15px;
                            font-size: 0.8rem;
                            display: flex;
                            align-items: center;
                            gap: 5px;
                        ">
                            <span>🏁</span> ${totalRaces} corridas
                        </div>
                        
                        ${profile.difficulty ? `
                        <div style="
                            background: rgba(255, 255, 255, 0.1);
                            padding: 8px 15px;
                            border-radius: 15px;
                            font-size: 0.8rem;
                            display: flex;
                            align-items: center;
                            gap: 5px;
                        ">
                            <span>⚡</span> ${profile.difficulty}
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Adicionar evento de clique nas cards
        document.querySelectorAll('.profile-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const profileName = card.dataset.profileName;
                    this.selectProfile(profileName);
                }
            });
        });
    }
    
    updateStats() {
        // Calcular totais
        let totalCash = 0;
        let totalWins = 0;
        let totalVehicles = 0;
        
        this.profiles.forEach(profile => {
            totalCash += profile.cash || 0;
            totalWins += profile.stats?.wins || 0;
            totalVehicles += profile.vehicles?.length || 0;
        });
        
        // Atualizar UI
        document.getElementById('total-cash').textContent = totalCash.toLocaleString();
        document.getElementById('total-wins').textContent = totalWins.toLocaleString();
        document.getElementById('total-vehicles').textContent = totalVehicles.toLocaleString();
    }
    
    attachEvents() {
        // Botão CRIAR PERFIL
        const createBtn = document.getElementById('create-profile-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.createNewProfile();
            });
        }
        
        // Botão ATUALIZAR
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadProfiles();
                if (window.eventSystem && window.eventSystem.showNotification) {
                    window.eventSystem.showNotification('Perfis atualizados!', 'info');
                }
            });
        }
        
        // Botão CRIAR PRIMEIRO PERFIL (se existir)
        const createFirstBtn = document.getElementById('create-first-profile');
        if (createFirstBtn) {
            createFirstBtn.addEventListener('click', () => {
                this.createNewProfile();
            });
        }
    }
    
    selectProfile(profileName) {
        console.log(`👤 Selecionando perfil: ${profileName}`);
        
        if (!window.profileManager) {
            this.showError('Sistema de perfis não disponível');
            return false;
        }
        
        if (window.profileManager.selectProfile(profileName)) {
            const profile = window.profileManager.getCurrentProfile();
            window.eventSystem.setCurrentProfile(profile);
            
            console.log(`✅ Perfil "${profileName}" selecionado`);
            
            // Notificação
            if (window.eventSystem && window.eventSystem.showNotification) {
                window.eventSystem.showNotification(`Bem-vindo, ${profileName}!`, 'success');
            }
            
            // Ir para menu principal
            setTimeout(() => {
                window.eventSystem.showScreen('main-menu');
            }, 800);
            
            return true;
        }
        
        this.showError(`Não foi possível selecionar o perfil "${profileName}"`);
        return false;
    }
    
    deleteProfile(profileName) {
        if (!confirm(`Tem certeza que deseja excluir o perfil "${profileName}"?\n\nEsta ação não pode ser desfeita.`)) {
            return;
        }
        
        // Encontrar e remover
        const index = this.profiles.findIndex(p => p.name === profileName);
        if (index === -1) {
            this.showError('Perfil não encontrado');
            return;
        }
        
        this.profiles.splice(index, 1);
        
        // Atualizar armazenamento
        if (window.profileManager) {
            window.profileManager.profiles = this.profiles;
            window.profileManager.saveProfiles();
        } else {
            // Fallback
            localStorage.setItem('streetrod2_profiles', JSON.stringify(this.profiles));
        }
        
        console.log(`🗑️ Perfil "${profileName}" excluído`);
        
        // Recarregar
        this.loadProfiles();
    }
    
    createNewProfile() {
        console.log('➕ Criando novo perfil...');
        
        if (window.eventSystem && window.eventSystem.showScreen) {
            window.eventSystem.showScreen('profile-creation');
        } else {
            this.showError('Sistema de criação não disponível');
        }
    }
    
    showError(message) {
        console.error('❌ Erro:', message);
        alert(`Erro: ${message}`);
    }
    
    cleanup() {
        console.log('🧹 Limpando ProfileSelectionScreen');
    }
}

// Funções globais para os botões
window.selectProfileOriginal = function(profileName) {
    if (window.profileSelectionScreen) {
        window.profileSelectionScreen.selectProfile(profileName);
    }
};

window.deleteProfileOriginal = function(profileName) {
    if (window.profileSelectionScreen) {
        window.profileSelectionScreen.deleteProfile(profileName);
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.profileSelectionScreen = new ProfileSelectionScreen();
    console.log('✅ ProfileSelectionScreen Original exportado');
}