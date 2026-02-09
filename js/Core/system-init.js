/*
==========================================
SYSTEM INIT - INICIALIZADOR DE SISTEMAS (VERSÃO DEBUG)
==========================================
*/

console.info('🔧 SystemInit: Carregando...');

class SystemInit {
    constructor() {
        this.state = {
            isInitialized: false,
            subsystems: {},
            dependencies: new Set(),
            retryCount: 0,
            maxRetries: 3,
            initializationStartTime: null
        };

        // Bind methods
        this.initialize = this.initialize.bind(this);
        this._onGameLoaded = this._onGameLoaded.bind(this);
        this._onError = this._onError.bind(this);

        // DEBUG
        console.log('✅ SystemInit criado');
    }

    // ============= API PÚBLICA =============

    initialize() {
        if (this.state.isInitialized) {
            console.warn('⚠️ SystemInit: Já inicializado');
            return Promise.resolve(true);
        }

        if (this.state.isInitializing) {
            console.warn('⚠️ SystemInit: Já está inicializando');
            return Promise.resolve(false);
        }

        console.info('🚀 SystemInit: Iniciando...');
        this.state.isInitializing = true;
        this.state.initializationStartTime = Date.now();

        return new Promise((resolve, reject) => {
            this._initializePromise = { resolve, reject };

            // Registrar listeners de eventos
            this._setupEventListeners();

            // Timeout
            this._fallbackTimeout = setTimeout(() => {
                if (!this.state.isInitialized && !this.state.isInitializing) {
                    console.warn('⚠️ SystemInit: Timeout (15s), forçando...');
                    this._forceInitialize();
                }
            }, 15000);
        });
    }

    // ============= FLUXO DO JOGO =============

    async _setupGameFlow() {
        console.info('🎮 SystemInit: Configurando fluxo...');

        // SIMPLES: Sempre ir para seleção de perfil primeiro
        // Isso resolve TODOS os problemas de fluxo

        try {
            // 1. Verificar se tem perfis
            let profiles = [];
            try {
                const saved = localStorage.getItem('streetrod2_profiles');
                profiles = saved ? JSON.parse(saved) : [];
                console.log(`📊 ${profiles.length} perfil(s) encontrado(s)`);
            } catch (e) {
                console.error('❌ Erro ao ler perfis:', e);
                profiles = [];
            }

            // 2. Decidir tela baseado APENAS na contagem
            let targetScreen = 'welcome';

            if (profiles.length === 0) {
                targetScreen = 'profile-creation';
                console.info('🆕 Nenhum perfil → Criação');
            } else {
                targetScreen = 'profile-selection';
                console.info(`👥 ${profiles.length} perfil(s) → Seleção`);
            }

            // 3. Navegar
            await this._navigateToScreen(targetScreen);

        } catch (error) {
            console.error('❌ Erro no fluxo:', error);
            this._navigateToScreen('profile-creation');
        }
    }

    // ============= TELA DE SELEÇÃO DE PERFIL (FUNCIONAL) =============

    _showBasicScreen(screenName) {
        const container = document.getElementById('game-container');
        if (!container) {
            console.error('❌ Container não encontrado');
            return;
        }

        // DEBUG
        console.log(`🖥️ Mostrando tela: ${screenName}`);

        if (screenName === 'profile-selection') {
            this._renderProfileSelectionScreen(container);
        }
        else if (screenName === 'profile-creation') {
            container.innerHTML = this._getProfileCreationHTML();
            this._setupProfileCreation();
        }
        else if (screenName === 'main-menu') {
            container.innerHTML = this._getMainMenuHTML();
        }
        else {
            container.innerHTML = this._getWelcomeHTML();
        }
    }

    _renderProfileSelectionScreen(container) {
        // Carregar perfis
        let profiles = [];
        try {
            const saved = localStorage.getItem('streetrod2_profiles');
            profiles = saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('❌ Erro ao carregar perfis:', e);
            profiles = [];
        }

        // DEBUG
        console.log(`🔄 Renderizando ${profiles.length} perfil(s)`);

        // HTML da tela
        container.innerHTML = `
            <div style="min-height:100vh; background:#0C0C0D; color:white; padding:40px 20px; font-family:'Rajdhani';">
                <h1 style="color:#F14144; text-align:center; margin-bottom:40px; font-size:2.5rem;">
                    SELECIONAR PERFIL
                </h1>
                
                <div style="max-width:500px; margin:0 auto;">
                    <!-- Botão criar -->
                    <div style="text-align:center; margin-bottom:30px;">
                        <button id="create-profile-btn" 
                                style="padding:15px 30px; background:#55A213; color:white; border:none; border-radius:8px; font-family:'Rajdhani'; font-weight:bold; font-size:16px; cursor:pointer;">
                            ＋ CRIAR NOVO PERFIL
                        </button>
                    </div>
                    
                    <!-- Lista de perfis -->
                    <div id="profiles-list-container" style="margin-bottom:30px;">
                        ${this._renderProfilesList(profiles)}
                    </div>
                    
                    <!-- Debug info -->
                    <div style="text-align:center; color:#666; font-size:12px; padding:20px; background:rgba(255,255,255,0.05); border-radius:8px;">
                        <div>Perfis encontrados: <strong>${profiles.length}</strong></div>
                        <div>Perfil atual: <strong>${localStorage.getItem('sr2_currentProfile') || 'Nenhum'}</strong></div>
                        <button onclick="location.reload()" 
                                style="margin-top:10px; padding:8px 16px; background:#F14144; color:white; border:none; border-radius:4px; font-family:'Rajdhani'; cursor:pointer;">
                            🔄 Recarregar
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Configurar eventos
        this._setupProfileSelectionEvents();
    }

    _renderProfilesList(profiles) {
        if (profiles.length === 0) {
            return `
                <div style="text-align:center; padding:40px; color:#666; background:rgba(255,255,255,0.05); border-radius:8px;">
                    <p>Nenhum perfil encontrado</p>
                    <p style="font-size:14px; margin-top:10px;">Crie seu primeiro perfil!</p>
                </div>
            `;
        }

        let html = '';
        profiles.forEach(profile => {
            html += `
                <div class="profile-item" 
                     data-profile="${profile.name}"
                     style="padding:15px; margin-bottom:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer; transition:all 0.3s;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="flex:1;">
                            <div style="font-weight:600; color:#A9A9A9; font-size:16px;">${profile.name}</div>
                            <div style="color:#666; font-size:12px; margin-top:5px;">
                                Nível ${profile.level || 1} • $${profile.cash || 10000}
                            </div>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button class="select-btn"
                                    style="padding:8px 15px; background:#3498db; color:white; border:none; border-radius:4px; font-family:'Rajdhani'; font-weight:600; cursor:pointer;">
                                Selecionar
                            </button>
                            <button class="delete-btn"
                                    style="padding:8px 15px; background:rgba(231,76,60,0.2); color:#e74c3c; border:1px solid #e74c3c; border-radius:4px; font-family:'Rajdhani'; font-weight:600; cursor:pointer;">
                                Deletar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        return html;
    }

    _setupProfileSelectionEvents() {
        // Botão criar
        const createBtn = document.getElementById('create-profile-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this._navigateToScreen('profile-creation');
            });
        }

        // Configurar cada item de perfil
        const profileItems = document.querySelectorAll('.profile-item');
        profileItems.forEach(item => {
            const profileName = item.dataset.profile;

            // Botão selecionar
            const selectBtn = item.querySelector('.select-btn');
            if (selectBtn) {
                selectBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this._selectProfileDirect(profileName);
                });
            }

            // Botão deletar
            const deleteBtn = item.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this._deleteProfileDirect(profileName);
                });
            }

            // Clicar no item inteiro
            item.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    this._selectProfileDirect(profileName);
                }
            });

            // Efeitos hover
            item.addEventListener('mouseenter', () => {
                item.style.background = 'rgba(255,255,255,0.1)';
                item.style.transform = 'translateY(-2px)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.background = 'rgba(255,255,255,0.05)';
                item.style.transform = 'translateY(0)';
            });
        });
    }

    // ============= OPERAÇÕES DIRETAS (100% FUNCIONAIS) =============

    _selectProfileDirect(profileName) {
        console.log(`🎯 Selecionando: ${profileName}`);

        try {
            // 1. Salvar como perfil atual
            localStorage.setItem('sr2_currentProfile', profileName);

            // 2. Ir para menu principal
            setTimeout(() => {
                this._navigateToScreen('main-menu');
            }, 300);

        } catch (error) {
            console.error('❌ Erro ao selecionar:', error);
            alert('Erro ao selecionar perfil');
        }
    }

    _deleteProfileDirect(profileName) {
        console.log(`🗑️ DELETANDO: ${profileName}`);

        if (!confirm(`Deletar perfil "${profileName}"?\nEsta ação não pode ser desfeita.`)) {
            return;
        }

        try {
            // 1. Ler perfis
            const saved = localStorage.getItem('streetrod2_profiles');
            let profiles = saved ? JSON.parse(saved) : [];

            // 2. Verificar
            if (profiles.length <= 1) {
                alert('Não é possível deletar o último perfil!');
                return;
            }

            // 3. Filtrar (manualmente para debug)
            const newProfiles = [];
            for (let i = 0; i < profiles.length; i++) {
                if (profiles[i].name !== profileName) {
                    newProfiles.push(profiles[i]);
                }
            }

            // DEBUG
            console.log(`Antes: ${profiles.length}, Depois: ${newProfiles.length}`);

            // 4. Salvar
            localStorage.setItem('streetrod2_profiles', JSON.stringify(newProfiles));

            // 5. Verificar perfil atual
            const current = localStorage.getItem('sr2_currentProfile');
            if (current === profileName) {
                localStorage.removeItem('sr2_currentProfile');
            }

            // 6. ATUALIZAÇÃO VISUAL IMEDIATA (CRÍTICO)
            this._refreshProfileList();

            // 7. Feedback
            this._showMessage(`Perfil "${profileName}" deletado!`, 'success');

        } catch (error) {
            console.error('❌ Erro ao deletar:', error);
            this._showMessage('Erro ao deletar perfil', 'error');
        }
    }

    _refreshProfileList() {
        console.log('🔄 Atualizando lista de perfis...');

        const container = document.getElementById('profiles-list-container');
        if (!container) {
            console.error('❌ Container não encontrado');
            return;
        }

        // Recarregar perfis
        let profiles = [];
        try {
            const saved = localStorage.getItem('streetrod2_profiles');
            profiles = saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('❌ Erro ao recarregar:', e);
            profiles = [];
        }

        // Substituir HTML
        container.innerHTML = this._renderProfilesList(profiles);

        // Reconfigurar eventos
        this._setupProfileSelectionEvents();

        console.log(`✅ Lista atualizada: ${profiles.length} perfil(s)`);
    }

    _loadProfileList() {
        console.log('🔄 Carregando lista de perfis...');

        // Elemento onde os perfis serão listados
        const profileListElement = document.getElementById('profile-list');
        if (!profileListElement) {
            console.error('❌ Elemento #profile-list não encontrado');
            return;
        }

        // Limpar lista atual
        profileListElement.innerHTML = '';

        // Carregar perfis
        const profiles = this.profileManager.getAllProfiles();
        console.log(`📊 ${profiles.length} perfil(s) encontrado(s):`, profiles);

        if (profiles.length === 0) {
            profileListElement.innerHTML = `
                <div class="no-profiles">
                    <p>Nenhum perfil encontrado</p>
                    <p class="hint">Clique em "Criar Novo Perfil" para começar</p>
                </div>
            `;
            return;
        }

        // Criar cards para cada perfil
        profiles.forEach(profile => {
            const profileCard = document.createElement('div');
            profileCard.className = 'profile-card';
            profileCard.dataset.profileName = profile.name;

            profileCard.innerHTML = `
                <div class="profile-card-header">
                    <h3>${this._escapeHtml(profile.name)}</h3>
                    <span class="profile-level">Nível ${profile.level || 1}</span>
                </div>
                <div class="profile-card-content">
                    <p><strong>Carro:</strong> ${profile.car || 'Nenhum'}</p>
                    <p><strong>Dinheiro:</strong> $${profile.money || 5000}</p>
                    <p><strong>Criado em:</strong> ${new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="profile-card-actions">
                    <button class="btn-select-profile" data-profile="${this._escapeHtml(profile.name)}">
                        Selecionar
                    </button>
                    <button class="btn-delete-profile" data-profile="${this._escapeHtml(profile.name)}">
                        Deletar
                    </button>
                </div>
            `;

            // Event listeners
            const selectBtn = profileCard.querySelector('.btn-select-profile');
            const deleteBtn = profileCard.querySelector('.btn-delete-profile');

            selectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._selectProfile(profile.name);
            });

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._deleteProfileWithConfirmation(profile.name);
            });

            // Adicionar ao DOM
            profileListElement.appendChild(profileCard);
        });

        console.log('✅ Lista de perfis carregada com sucesso');
    }

    // ============= MÉTODOS AUXILIARES =============

    _showMessage(message, type = 'info') {
        // Criar mensagem flutuante
        const msg = document.createElement('div');
        msg.textContent = message;
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
            color: white;
            border-radius: 8px;
            font-family: 'Rajdhani';
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(msg);

        // Remover após 3 segundos
        setTimeout(() => {
            if (msg.parentNode) {
                msg.parentNode.removeChild(msg);
            }
        }, 3000);
    }

    _showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Estilos inline para garantir visibilidade
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;

        // Estilo para o conteúdo interno
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
        `;

        // Botão de fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: transparent;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });

        // Adicionar ao DOM
        document.body.appendChild(notification);

        // Remover automaticamente após 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);

        // Adicionar animações CSS
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
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
        }
    }

    _getProfileCreationHTML() {
        return `
            <div style="min-height:100vh; background:#0C0C0D; color:white; padding:40px 20px; font-family:'Rajdhani'; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <h1 style="color:#F14144; text-align:center; margin-bottom:40px; font-size:2.5rem;">
                    CRIAR PERFIL
                </h1>
                
                <div style="width:100%; max-width:400px;">
                    <input type="text" 
                           id="new-profile-name" 
                           placeholder="Nome do piloto"
                           style="width:100%; padding:15px; margin-bottom:20px; background:#1A1A1A; border:1px solid #2D2D2D; color:#A9A9A9; border-radius:6px; font-family:'Rajdhani'; font-size:16px; text-align:center;">
                    
                    <button id="create-profile-action"
                            style="width:100%; padding:18px; background:#55A213; color:white; border:none; border-radius:6px; font-family:'Rajdhani'; font-weight:bold; font-size:16px; cursor:pointer;">
                        🏁 CRIAR PERFIL
                    </button>
                    
                    <div style="text-align:center; margin-top:30px;">
                        <button onclick="window.systemInit?._navigateToScreen('profile-selection')"
                                style="padding:10px 20px; background:#2D2D2D; color:#A9A9A9; border:1px solid #444; border-radius:6px; font-family:'Rajdhani'; cursor:pointer;">
                            ← Voltar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    _setupProfileCreation() {
        const createBtn = document.getElementById('create-profile-action');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                const input = document.getElementById('new-profile-name');
                const name = (input?.value || '').trim();

                if (!name || name.length < 2) {
                    this._showMessage('Nome inválido (mínimo 2 caracteres)', 'error');
                    return;
                }

                this._createProfileDirect(name);
            });
        }
    }

    _createProfileDirect(name) {
        console.log(`🆕 Criando perfil: ${name}`);

        try {
            // Ler perfis existentes
            const saved = localStorage.getItem('streetrod2_profiles');
            let profiles = saved ? JSON.parse(saved) : [];

            // Verificar se já existe
            if (profiles.some(p => p.name === name)) {
                this._showMessage('Já existe um perfil com este nome', 'error');
                return;
            }

            // Criar novo perfil
            const newProfile = {
                name: name,
                level: 1,
                cash: 10000,
                vehicles: [],
                created: new Date().toISOString()
            };

            // Adicionar à lista
            profiles.push(newProfile);

            // Salvar
            localStorage.setItem('streetrod2_profiles', JSON.stringify(profiles));

            // Selecionar automaticamente se for o primeiro
            if (profiles.length === 1) {
                localStorage.setItem('sr2_currentProfile', name);
                this._navigateToScreen('main-menu');
            } else {
                this._showMessage(`Perfil "${name}" criado!`, 'success');
                setTimeout(() => {
                    this._navigateToScreen('profile-selection');
                }, 1000);
            }

        } catch (error) {
            console.error('❌ Erro ao criar perfil:', error);
            this._showMessage('Erro ao criar perfil', 'error');
        }
    }

    _getMainMenuHTML() {
        return `
            <div style="min-height:100vh; background:#0C0C0D; color:white; padding:40px 20px; font-family:'Rajdhani'; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <h1 style="color:#F14144; text-align:center; margin-bottom:40px; font-size:2.5rem;">
                    MENU PRINCIPAL
                </h1>
                
                <div style="width:100%; max-width:300px;">
                    <button style="width:100%; padding:15px; margin-bottom:10px; background:#2D2D2D; color:#A9A9A9; border:1px solid #444; border-radius:4px; font-family:'Rajdhani'; font-weight:600; cursor:pointer;">
                        🏁 CORRER
                    </button>
                    <button style="width:100%; padding:15px; margin-bottom:10px; background:#2D2D2D; color:#A9A9A9; border:1px solid #444; border-radius:4px; font-family:'Rajdhani'; font-weight:600; cursor:pointer;">
                        🔧 GARAGEM
                    </button>
                    <button style="width:100%; padding:15px; margin-bottom:10px; background:#2D2D2D; color:#A9A9A9; border:1px solid #444; border-radius:4px; font-family:'Rajdhani'; font-weight:600; cursor:pointer;">
                        🛒 LOJA
                    </button>
                    
                    <div style="margin-top:30px;">
                        <button onclick="localStorage.removeItem('sr2_currentProfile'); location.reload();"
                                style="width:100%; padding:15px; background:rgba(209,161,16,0.2); color:#D1A110; border:1px solid #D1A110; border-radius:4px; font-family:'Rajdhani'; font-weight:600; cursor:pointer;">
                            👤 TROCAR PERFIL
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    _getWelcomeHTML() {
        return `
            <div style="min-height:100vh; background:#0C0C0D; color:white; padding:40px 20px; font-family:'Rajdhani'; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
                <h1 style="color:#F14144; margin-bottom:20px; font-size:3rem;">
                    STREET ROD II
                </h1>
                <p style="color:#A9A9A9; margin-bottom:40px; font-size:1.2rem;">
                    Bem-vindo ao jogo!
                </p>
                <button onclick="window.systemInit?._navigateToScreen('profile-selection')"
                        style="padding:15px 40px; background:#F14144; color:white; border:none; border-radius:8px; font-family:'Rajdhani'; font-weight:bold; font-size:18px; cursor:pointer;">
                    🎮 COMEÇAR
                </button>
            </div>
        `;
    }

    // ============= MÉTODOS EXISTENTES (mantenha como estão) =============

    async _navigateToScreen(screenName) {
        console.log(`📍 Navegando para: ${screenName}`);

        // Pequeno delay para transição
        setTimeout(() => {
            this._showBasicScreen(screenName);
        }, 300);
    }

    _escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ============= INICIALIZAÇÃO =============

if (!window.__systemInitInitialized) {
    window.__systemInitInitialized = true;

    const systemInit = new SystemInit();
    window.systemInit = systemInit;

    console.info('✅ SystemInit: Carregado e pronto');

    // Auto-inicializar quando gameLoaded for disparado
    window.addEventListener('gameLoaded', () => {
        console.info('🎯 SystemInit: Inicializando...');
        systemInit.initialize().catch(error => {
            console.error('❌ SystemInit: Falha na inicialização:', error);
        });
    });

} else {
    console.warn('⚠️ SystemInit: Já foi inicializado anteriormente');
}