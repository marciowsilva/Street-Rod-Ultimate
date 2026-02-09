// ProfileSelectionScreen.js - Tela de Seleção de Perfis
console.log('👥 Carregando ProfileSelectionScreen...');

class ProfileSelectionScreen {
    constructor() {
        this.screenId = 'profile-selection';
        this.profiles = [];
        console.log('✅ ProfileSelectionScreen inicializado');
    }
    
    initialize() {
        console.log('👥 Inicializando seleção de perfis...');
        this.createScreen();
        this.loadProfiles();
        this.attachEvents();
    }
    
    createScreen() {
        const container = document.getElementById('game-container');
        if (!container) return;
        
        container.innerHTML = `
            <div id="profile-selection-screen" style="
                min-height: 100vh;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                padding: 40px 20px;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
            ">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="
                        color: #ff4757;
                        font-size: 3.5rem;
                        text-transform: uppercase;
                        letter-spacing: 3px;
                        margin-bottom: 10px;
                        text-shadow: 0 0 20px rgba(255, 71, 87, 0.5);
                    ">
                        STREET ROD II
                    </h1>
                    <p style="color: #aaa; font-size: 1.2rem;">
                        Selecione ou crie um perfil
                    </p>
                </div>
                
                <div style="
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    padding: 30px;
                    width: 100%;
                    max-width: 800px;
                    margin-bottom: 30px;
                ">
                    <h2 style="
                        color: white;
                        margin-bottom: 25px;
                        border-bottom: 2px solid #ff4757;
                        padding-bottom: 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <span>PERFIS SALVOS</span>
                        <span id="profiles-count" style="
                            background: rgba(255, 71, 87, 0.2);
                            color: #ff4757;
                            padding: 5px 15px;
                            border-radius: 20px;
                            font-size: 0.9rem;
                        ">0 perfis</span>
                    </h2>
                    
                    <div id="profiles-list" style="min-height: 300px;">
                        <!-- Perfis serão carregados aqui -->
                        <div style="
                            text-align: center;
                            padding: 60px 20px;
                            color: #666;
                        ">
                            <div style="font-size: 4rem; margin-bottom: 20px;">👤</div>
                            <h3 style="color: #aaa; margin-bottom: 10px;">Nenhum perfil encontrado</h3>
                            <p>Crie seu primeiro perfil para começar a jogar!</p>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
                    <button id="create-profile-btn" style="
                        padding: 15px 35px;
                        background: #2ed573;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-family: 'Rajdhani', sans-serif;
                        font-size: 1.2rem;
                        font-weight: bold;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        transition: all 0.3s;
                    ">
                        <span style="font-size: 1.5rem;">+</span>
                        CRIAR NOVO PERFIL
                    </button>
                    
                    <button id="refresh-btn" style="
                        padding: 15px 25px;
                        background: #1e90ff;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-family: 'Rajdhani', sans-serif;
                        font-size: 1.2rem;
                        font-weight: bold;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        transition: all 0.3s;
                    ">
                        <span style="font-size: 1.2rem;">🔄</span>
                        ATUALIZAR
                    </button>
                    
                    <button id="import-export-btn" style="
                        padding: 15px 25px;
                        background: #333;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-family: 'Rajdhani', sans-serif;
                        font-size: 1.2rem;
                        font-weight: bold;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        transition: all 0.3s;
                    ">
                        <span style="font-size: 1.2rem;">📁</span>
                        IMPORTAR/EXPORTAR
                    </button>
                </div>
                
                <div style="margin-top: 40px; color: #666; text-align: center; font-size: 0.9rem;">
                    <p>© 2024 Street Rod II - Sistema de Múltiplos Perfis</p>
                    <p style="margin-top: 10px; color: #444;">
                        Versão ${window.game?.version || '2.0.0'}
                    </p>
                </div>
            </div>
        `;
        
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .profile-card {
                background: rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                border: 2px solid transparent;
                transition: all 0.3s ease;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .profile-card:hover {
                background: rgba(255, 255, 255, 0.12);
                border-color: #444;
                transform: translateY(-2px);
            }
            
            .profile-card.selected {
                background: rgba(46, 213, 115, 0.1);
                border-color: #2ed573;
            }
            
            .profile-info {
                flex: 1;
            }
            
            .profile-name {
                color: white;
                font-size: 1.4rem;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .profile-details {
                color: #aaa;
                font-size: 0.9rem;
                display: flex;
                gap: 20px;
            }
            
            .profile-stats {
                display: flex;
                gap: 15px;
                margin-top: 10px;
            }
            
            .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 5px 10px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                min-width: 70px;
            }
            
            .stat-value {
                color: white;
                font-weight: bold;
                font-size: 1.2rem;
            }
            
            .stat-label {
                color: #aaa;
                font-size: 0.8rem;
                margin-top: 2px;
            }
            
            .profile-actions {
                display: flex;
                gap: 10px;
            }
            
            .profile-btn {
                padding: 8px 15px;
                border: none;
                border-radius: 6px;
                font-family: 'Rajdhani', sans-serif;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .select-btn {
                background: #2ed573;
                color: white;
            }
            
            .select-btn:hover {
                background: #26c46a;
            }
            
            .delete-btn {
                background: rgba(255, 71, 87, 0.2);
                color: #ff4757;
                border: 1px solid rgba(255, 71, 87, 0.5);
            }
            
            .delete-btn:hover {
                background: rgba(255, 71, 87, 0.3);
            }
            
            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    loadProfiles() {
        console.log('📋 Carregando perfis...');
        
        if (window.profileManager) {
            this.profiles = window.profileManager.getAllProfiles();
            console.log(`✅ ${this.profiles.length} perfis carregados`);
        } else {
            this.profiles = [];
            console.warn('⚠️ ProfileManager não disponível');
        }
        
        this.renderProfiles();
    }
    
    renderProfiles() {
        const profilesList = document.getElementById('profiles-list');
        const profilesCount = document.getElementById('profiles-count');
        
        if (!profilesList || !profilesCount) return;
        
        // Atualizar contador
        profilesCount.textContent = `${this.profiles.length} ${this.profiles.length === 1 ? 'perfil' : 'perfis'}`;
        
        if (this.profiles.length === 0) {
            profilesList.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 60px 20px;
                    color: #666;
                ">
                    <div style="font-size: 4rem; margin-bottom: 20px;">👤</div>
                    <h3 style="color: #aaa; margin-bottom: 10px;">Nenhum perfil salvo</h3>
                    <p>Crie seu primeiro perfil para começar sua jornada no Street Rod II!</p>
                    <button onclick="document.getElementById('create-profile-btn').click()" style="
                        margin-top: 20px;
                        padding: 10px 25px;
                        background: #ff4757;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-family: 'Rajdhani', sans-serif;
                        font-weight: bold;
                    ">
                        CRIAR PRIMEIRO PERFIL
                    </button>
                </div>
            `;
            return;
        }
        
        // Obter perfil atual se existir
        const currentProfile = window.profileManager ? 
            window.profileManager.getCurrentProfile() : null;
        
        let html = '';
        
        this.profiles.forEach(profile => {
            const isCurrent = currentProfile && currentProfile.name === profile.name;
            const createdDate = profile.created ? 
                new Date(profile.created).toLocaleDateString('pt-BR') : 'Data desconhecida';
            
            html += `
                <div class="profile-card ${isCurrent ? 'selected' : ''}" data-profile-name="${profile.name}">
                    <div class="profile-info">
                        <div class="profile-name">
                            ${profile.name}
                            ${isCurrent ? '<span style="color:#2ed573; font-size:0.8rem; margin-left:10px;">(ATUAL)</span>' : ''}
                        </div>
                        <div class="profile-details">
                            <span>Nível ${profile.level || 1}</span>
                            <span>Criado em: ${createdDate}</span>
                            <span>Veículos: ${profile.vehicles ? profile.vehicles.length : 0}</span>
                        </div>
                        <div class="profile-stats">
                            <div class="stat-item">
                                <div class="stat-value" style="color: #4cd137;">$${(profile.cash || 0).toLocaleString()}</div>
                                <div class="stat-label">Dinheiro</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${profile.stats?.wins || 0}</div>
                                <div class="stat-label">Vitórias</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${profile.stats?.races || 0}</div>
                                <div class="stat-label">Corridas</div>
                            </div>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button class="profile-btn select-btn" onclick="event.stopPropagation(); window.profileSelectionScreen.selectProfile('${profile.name.replace(/'/g, "\\'")}')">
                            ${isCurrent ? 'CONTINUAR' : 'SELECIONAR'}
                        </button>
                        <button class="profile-btn delete-btn" onclick="event.stopPropagation(); window.profileSelectionScreen.deleteProfile('${profile.name.replace(/'/g, "\\'")}')">
                            EXCLUIR
                        </button>
                    </div>
                </div>
            `;
        });
        
        profilesList.innerHTML = html;
        
        // Adicionar evento de clique nas cards
        document.querySelectorAll('.profile-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.profile-btn')) {
                    const profileName = card.dataset.profileName;
                    this.selectProfile(profileName);
                }
            });
        });
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
        
        // Botão IMPORTAR/EXPORTAR
        const importExportBtn = document.getElementById('import-export-btn');
        if (importExportBtn) {
            importExportBtn.addEventListener('click', () => {
                this.showImportExport();
            });
        }
    }
    
    selectProfile(profileName) {
        console.log(`👤 Selecionando perfil: ${profileName}`);
        
        if (!window.profileManager) {
            this.showError('Sistema de perfis não disponível');
            return;
        }
        
        if (window.profileManager.selectProfile(profileName)) {
            const profile = window.profileManager.getCurrentProfile();
            window.eventSystem.setCurrentProfile(profile);
            
            console.log(`✅ Perfil "${profileName}" selecionado`);
            
            if (window.eventSystem && window.eventSystem.showNotification) {
                window.eventSystem.showNotification(`Bem-vindo, ${profileName}!`, 'success');
            }
            
            // Ir para menu principal
            setTimeout(() => {
                window.eventSystem.showScreen('main-menu');
            }, 500);
        } else {
            this.showError(`Não foi possível selecionar o perfil "${profileName}"`);
        }
    }
    
    deleteProfile(profileName) {
        if (!confirm(`Tem certeza que deseja excluir o perfil "${profileName}"?\nEsta ação não pode ser desfeita.`)) {
            return;
        }
        
        if (!window.profileManager) {
            this.showError('Sistema de perfis não disponível');
            return;
        }
        
        // Encontrar e remover perfil
        const index = this.profiles.findIndex(p => p.name === profileName);
        if (index === -1) {
            this.showError('Perfil não encontrado');
            return;
        }
        
        // Remover do array
        this.profiles.splice(index, 1);
        
        // Atualizar localStorage
        try {
            localStorage.setItem('streetrod2_profiles', JSON.stringify(this.profiles));
            
            // Se era o perfil atual, limpar
            const currentProfile = window.profileManager.getCurrentProfile();
            if (currentProfile && currentProfile.name === profileName) {
                localStorage.removeItem('streetrod2_current_profile');
                window.currentProfile = null;
            }
            
            console.log(`🗑️ Perfil "${profileName}" excluído`);
            
            if (window.eventSystem && window.eventSystem.showNotification) {
                window.eventSystem.showNotification(`Perfil "${profileName}" excluído`, 'success');
            }
            
            // Recarregar lista
            this.loadProfiles();
            
        } catch (error) {
            console.error('❌ Erro ao excluir perfil:', error);
            this.showError('Erro ao excluir perfil');
        }
    }
    
    createNewProfile() {
        console.log('➕ Criando novo perfil...');
        
        if (window.eventSystem && window.eventSystem.showScreen) {
            window.eventSystem.showScreen('profile-creation');
        } else if (window.profileCreationScreen) {
            window.profileCreationScreen.initialize();
        } else {
            this.showError('Sistema de criação de perfis não disponível');
        }
    }
    
    showImportExport() {
        alert('Funcionalidade de importação/exportação em desenvolvimento!');
        // Em produção, aqui você implementaria a lógica de import/export
    }
    
    showError(message) {
        console.error('❌ Erro:', message);
        alert(`Erro: ${message}`);
    }
    
    cleanup() {
        console.log('🧹 Limpando ProfileSelectionScreen');
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.profileSelectionScreen = new ProfileSelectionScreen();
    window.ProfileSelectionScreen = ProfileSelectionScreen;
    console.log('✅ ProfileSelectionScreen exportado para window');
}