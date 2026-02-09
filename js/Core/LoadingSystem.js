/*
==========================================
LOADING SYSTEM - STREET ROD II ULTIMATE
==========================================
*/

console.info('🔄 LoadingSystem: Inicializando...');

class LoadingSystem {
    constructor(config = {}) {
        // Configuração
        this.config = {
            minLoadTime: 800,
            moduleCheckDelay: 100,
            animationDuration: 500,
            ...config
        };

        // Módulos do sistema
        this.modules = [
            { name: 'ProfileManager', check: () => this._checkProfileManager() },
            { name: 'EventSystem', check: () => this._checkEventSystem() },
            { name: 'ScreenManager', check: () => this._checkScreenManager() },
            { name: 'MainMenuScreen', check: () => this._checkScreen('MainMenuScreen') },
            { name: 'GarageScreen', check: () => this._checkScreen('GarageScreen') },
            { name: 'ProfileSelectionScreen', check: () => this._checkScreen('ProfileSelectionScreen') },
            { name: 'ProfileCreationScreen', check: () => this._checkScreen('ProfileCreationScreen') },
            { name: 'ShopScreen', check: () => this._checkScreen('ShopScreen') },
            { name: 'RaceSelectionScreen', check: () => this._checkScreen('RaceSelectionScreen') },
            { name: 'SettingsScreen', check: () => this._checkScreen('SettingsScreen') },
            { name: 'GameSystem', check: () => this._checkGameSystem() }
        ];

        // Estado
        this.state = {
            loadedCount: 0,
            hasErrors: false,
            isLoading: true,
            startTime: null,
            moduleStatus: {}
        };

        // Elementos DOM
        this.elements = this._getElements();
        
        // CORREÇÃO: Remover bind de métodos que não existem
        // Apenas bind dos métodos que serão usados como callbacks
        this._updateProgress = this._updateProgress.bind(this);
        this._onGameLoaded = this._onGameLoaded?.bind(this) || (() => {});
    }

    // ============= INICIALIZAÇÃO =============

    initialize() {
        try {
            console.info('🎮 LoadingSystem: Iniciando...');
            
            this.state.startTime = Date.now();
            
            // Verificar se já estamos no DOM
            if (!this.elements.loadingScreen) {
                console.warn('⚠️ LoadingSystem: Elementos não encontrados, criando fallback...');
                this._createFallbackUI();
            }
            
            // Iniciar sequência
            this._createModuleTable();
            this._startLoadingSequence();
            
        } catch (error) {
            console.error('❌ LoadingSystem: Erro na inicialização:', error);
            this._emergencyStart();
        }
    }

    // ============= VERIFICAÇÃO DE MÓDULOS =============

    _checkProfileManager() {
        return !!(window.ProfileManager || window.profileManager);
    }

    _checkEventSystem() {
        return !!(window.EventSystem || window.eventSystem);
    }

    _checkScreenManager() {
        return !!(window.ScreenManager);
    }

    _checkScreen(screenName) {
        return !!(window[screenName] || 
                 window[`init${screenName}`] || 
                 window[`${screenName.toLowerCase()}Screen`]);
    }

    _checkGameSystem() {
        return !!(window.systemInit || 
                 window.initializeGameSystem || 
                 window.bootstrapGame ||
                 window.GameBootstrap);
    }

    // ============= INTERFACE DO USUÁRIO =============

    _getElements() {
        return {
            loadingScreen: document.getElementById('game-loading-screen'),
            modulesTable: document.querySelector('.modules-table'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),
            moduleCounter: document.getElementById('module-counter'),
            loadingSpinner: document.querySelector('.loading-spinner')
        };
    }

    _createFallbackUI() {
        const container = document.createElement('div');
        container.id = 'game-loading-screen';
        container.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #0C0C0D; z-index: 10000; display: flex;
            align-items: center; justify-content: center; color: white;
            font-family: 'Rajdhani', sans-serif;
        `;
        
        container.innerHTML = `
            <div style="text-align: center;">
                <h1 style="color: #F14144; margin-bottom: 20px;">STREET ROD II</h1>
                <div class="loading-spinner" style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #F14144; border-radius: 50%; margin: 20px auto; animation: spin 1s linear infinite;"></div>
                <div id="progress-text" style="font-size: 24px; margin: 20px 0;">0%</div>
                <div style="width: 300px; height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; margin: 20px auto;">
                    <div id="progress-fill" style="width: 0%; height: 100%; background: #F14144; border-radius: 5px; transition: width 0.3s;"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        this.elements = this._getElements();
    }

    _createModuleTable() {
        if (!this.elements.modulesTable) return;
        
        let tableHTML = '';
        this.modules.forEach((module, index) => {
            tableHTML += `
                <tr class="module-row">
                    <td class="module-name">${module.name}</td>
                    <td id="status-${index}" class="module-status status-Pendente">
                        <span class="status-bg">Pendente</span>
                    </td>
                </tr>
            `;
        });
        
        this.elements.modulesTable.innerHTML = tableHTML;
    }

    _updateModuleStatus(index, status, moduleName = '') {
        try {
            const statusCell = document.getElementById(`status-${index}`);
            if (!statusCell) return;

            const statusSpan = statusCell.querySelector('.status-bg');
            if (statusSpan) {
                statusSpan.textContent = status;
            }

            statusCell.className = `module-status status-${status}`;
            
            this.state.moduleStatus[moduleName || this.modules[index]?.name] = status;
            
        } catch (error) {
            console.warn(`⚠️ Não foi possível atualizar status do módulo ${index}:`, error);
        }
    }

    _updateProgress() {
        const percent = Math.round((this.state.loadedCount / this.modules.length) * 100);
        
        try {
            if (this.elements.progressFill) {
                this.elements.progressFill.style.width = `${percent}%`;
            }
            
            if (this.elements.progressText) {
                this.elements.progressText.textContent = `${percent}%`;
            }
            
            if (this.elements.moduleCounter) {
                this.elements.moduleCounter.innerHTML = 
                    `Modules loaded: <span class="counter-value">${this.state.loadedCount}</span> of <span class="counter-value">${this.modules.length}</span>`;
            }
        } catch (error) {
            console.warn('⚠️ Erro ao atualizar progresso:', error);
        }
    }

    // ============= SEQUÊNCIA DE CARREGAMENTO =============

    async _startLoadingSequence() {
        console.info('📦 LoadingSystem: Iniciando carregamento de módulos...');
        
        for (let i = 0; i < this.modules.length; i++) {
            const module = this.modules[i];
            
            this._updateModuleStatus(i, 'Carregando', module.name);
            
            await this._wait(this.config.moduleCheckDelay);
            
            try {
                const isLoaded = module.check();
                
                if (isLoaded) {
                    this._updateModuleStatus(i, 'OK', module.name);
                    console.debug(`✅ ${module.name}: Carregado`);
                } else {
                    this._updateModuleStatus(i, 'Erro', module.name);
                    this.state.hasErrors = true;
                    console.warn(`⚠️ ${module.name}: Não disponível`);
                }
            } catch (error) {
                this._updateModuleStatus(i, 'Erro', module.name);
                this.state.hasErrors = true;
                console.error(`❌ ${module.name}: Erro na verificação:`, error);
            }
            
            this.state.loadedCount++;
            this._updateProgress();
            
            await this._wait(50);
        }
        
        this._finishLoading();
    }

    _finishLoading() {
        console.info('✅ LoadingSystem: Carregamento concluído');
        
        const elapsed = Date.now() - this.state.startTime;
        const remainingTime = Math.max(0, this.config.minLoadTime - elapsed);
        
        setTimeout(() => {
            this._finalizeLoading();
        }, remainingTime);
    }

    _finalizeLoading() {
        try {
            // Finalizar animações
            if (this.elements.loadingSpinner) {
                this.elements.loadingSpinner.style.animation = 'none';
                this.elements.loadingSpinner.style.borderTopColor = 
                    this.state.hasErrors ? '#E13847' : '#55A213';
            }
            
            if (this.elements.progressFill) {
                this.elements.progressFill.style.background = 
                    this.state.hasErrors ? '#E13847' : '#55A213';
            }
            
            // Iniciar jogo
            this._startGameSystem();
            
            // Esconder loading
            setTimeout(() => {
                this._hideLoadingScreen();
            }, this.config.animationDuration);
            
        } catch (error) {
            console.error('❌ LoadingSystem: Erro na finalização:', error);
            this._emergencyStart();
        }
    }

    _hideLoadingScreen() {
        try {
            this.elements.loadingScreen.style.opacity = '0';
            this.elements.loadingScreen.style.transition = `opacity ${this.config.animationDuration}ms ease`;
            
            setTimeout(() => {
                this.elements.loadingScreen.style.display = 'none';
                this.state.isLoading = false;
                console.info('🎮 LoadingSystem: Jogo pronto!');
                
                // Disparar evento de carregamento completo
                window.dispatchEvent(new CustomEvent('gameLoaded'));
                
            }, this.config.animationDuration);
            
        } catch (error) {
            console.error('❌ LoadingSystem: Erro ao esconder loading:', error);
            this.elements.loadingScreen.style.display = 'none';
        }
    }

    // ============= INICIALIZAÇÃO DO JOGO =============

    _startGameSystem() {
        console.info('🚀 LoadingSystem: Iniciando sistema do jogo...');
        
        // Tentar diferentes métodos de inicialização
        if (window.systemInit && typeof window.systemInit.initialize === 'function') {
            console.info('✅ Usando systemInit...');
            window.systemInit.initialize();
        } else if (window.GameBootstrap && typeof window.GameBootstrap.initialize === 'function') {
            console.info('✅ Usando GameBootstrap...');
            window.GameBootstrap.initialize();
        } else if (window.eventSystem && window.profileManager) {
            console.info('✅ Usando EventSystem...');
            this._startWithEventSystem();
        } else {
            console.warn('⚠️ Nenhum sistema encontrado, usando fallback...');
            this._emergencyStart();
        }
    }

    _startWithEventSystem() {
        if (window.eventSystem && window.profileManager) {
            const profiles = window.profileManager.getAllProfiles();
            const current = window.profileManager.getCurrentProfile();
            
            if (profiles.length === 0) {
                window.eventSystem.navigateTo?.('profile-creation') || 
                window.eventSystem.showScreen?.('profile-creation');
            } else if (!current) {
                window.eventSystem.navigateTo?.('profile-selection') || 
                window.eventSystem.showScreen?.('profile-selection');
            } else {
                window.eventSystem.navigateTo?.('main-menu') || 
                window.eventSystem.showScreen?.('main-menu');
            }
        }
    }

    _emergencyStart() {
        console.warn('⚠️ LoadingSystem: Usando inicialização de emergência');
        
        const container = document.getElementById('game-container') || document.body;
        container.innerHTML = `
            <div style="min-height: 100vh; background: #0C0C0D; color: white; padding: 20px; font-family: 'Rajdhani', sans-serif;">
                <h1 style="color: #F14144; text-align: center; margin-bottom: 30px;">STREET ROD II</h1>
                <div style="max-width: 500px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 10px;">
                    <h2 style="color: #E13847; margin-bottom: 20px;">⚠️ Modo de Emergência</h2>
                    <p style="margin-bottom: 20px;">O jogo foi carregado, mas houve um problema na inicialização.</p>
                    <button onclick="location.reload()" style="width: 100%; padding: 15px; background: #F14144; color: white; border: none; border-radius: 5px; font-family: 'Rajdhani'; font-weight: bold; font-size: 16px; cursor: pointer;">
                        🔄 RECARREGAR JOGO
                    </button>
                </div>
            </div>
        `;
    }

    // ============= UTILITÁRIOS =============

    _wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ============= API PÚBLICA =============

    getStatus() {
        return {
            loaded: this.state.loadedCount,
            total: this.modules.length,
            hasErrors: this.state.hasErrors,
            isLoading: this.state.isLoading,
            modules: this.state.moduleStatus
        };
    }

    forceStart() {
        console.warn('⚠️ LoadingSystem: Forçando início do jogo');
        this._hideLoadingScreen();
        this._emergencyStart();
    }
}

// ============= INICIALIZAÇÃO CONTROLADA =============

// Prevenir múltiplas inicializações
if (!window.__loadingSystemInitialized) {
    window.__loadingSystemInitialized = true;
    
    const initLoadingSystem = () => {
        try {
            const loadingSystem = new LoadingSystem({
                minLoadTime: 1000,
                moduleCheckDelay: 80
            });
            
            // Iniciar com pequeno delay
            setTimeout(() => {
                loadingSystem.initialize();
            }, 150);
            
        } catch (error) {
            console.error('❌ Falha crítica no LoadingSystem:', error);
            
            setTimeout(() => {
                const loadingScreen = document.getElementById('game-loading-screen');
                if (loadingScreen) {
                    loadingScreen.innerHTML = `
                        <div style="text-align:center; color:#E13847; padding:40px;">
                            <h2 style="margin-bottom:20px;">⚠️ ERRO NO CARREGAMENTO</h2>
                            <p style="color:#A9A9A9; margin-bottom:20px;">
                                Não foi possível inicializar o sistema de carregamento.
                            </p>
                            <button onclick="location.reload()" style="padding:12px 30px; background:#F14144; color:white; border:none; border-radius:4px; font-family:'Rajdhani'; font-weight:600; font-size:16px; cursor:pointer;">
                                🔄 RECARREGAR
                            </button>
                        </div>
                    `;
                }
            }, 1000);
        }
    };

    // Inicializar quando estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoadingSystem);
    } else {
        initLoadingSystem();
    }
}

// Comandos de debug
if (window.location.search.includes('debug=true')) {
    console.log(`
🎮 STREET ROD II - DEBUG COMMANDS
=================================
• localStorage.clear() - Limpar dados
• location.reload() - Recarregar
• ?skipLoading=1 - Pular loading
    `);
}