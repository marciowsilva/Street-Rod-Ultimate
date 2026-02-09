/*
==========================================
PROFILE MANAGER - GERENCIADOR DE PERFIS
==========================================
*/

console.info('👤 ProfileManager: Carregando...');

class ProfileManager {
    constructor(config = {}) {
        // Configuração
        this.config = {
            storageKey: 'streetrod2_profiles',
            currentProfileKey: 'sr2_currentProfile',
            autoSave: true,
            saveDelay: 500,
            maxProfiles: 10,
            ...config
        };

        // Estado
        this.state = {
            isInitialized: false,
            profiles: [],
            currentProfile: null,
            lastSaveTime: null,
            saveQueue: new Set(),
            stats: {
                loadCount: 0,
                saveCount: 0,
                errorCount: 0
            }
        };

        // Bind apenas dos métodos que existem
        this.initialize = this.initialize.bind(this);
        this._validateProfile = this._validateProfile.bind(this);

        // Inicializar timeout como null
        this._saveTimeout = null;

        // Sistema de eventos
        this._setupEventSystem();

        console.info('✅ ProfileManager: Instância criada');
    }

    // ============= SISTEMA DE EVENTOS =============

    _setupEventSystem() {
        this.events = {
            listeners: {},

            on(event, callback) {
                if (!this.listeners[event]) {
                    this.listeners[event] = [];
                }
                this.listeners[event].push(callback);
            },

            off(event, callback) {
                if (!this.listeners[event]) return;
                this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
            },

            emit(event, data) {
                // Disparar evento DOM também
                window.dispatchEvent(new CustomEvent(`profile:${event}`, { detail: data }));

                // Executar listeners internos
                if (this.listeners[event]) {
                    this.listeners[event].forEach(callback => {
                        try {
                            callback(data);
                        } catch (error) {
                            console.error(`❌ Erro no listener de ${event}:`, error);
                        }
                    });
                }
            }
        };
    }

    // ============= INICIALIZAÇÃO =============

    initialize() {
        if (this.state.isInitialized) {
            console.warn('⚠️ ProfileManager: Já inicializado');
            return Promise.resolve(true);
        }

        console.info('🚀 ProfileManager: Inicializando...');

        return new Promise((resolve, reject) => {
            try {
                // 1. Carregar perfis
                this._loadProfiles();

                // 2. Carregar perfil atual
                this._loadCurrentProfile();

                // 3. Configurar auto-save
                if (this.config.autoSave) {
                    this._setupAutoSave();
                }

                // 4. Marcar como inicializado
                this.state.isInitialized = true;
                this.state.stats.loadCount++;

                // 5. Sincronizar com estado global
                this._syncWithGameState();

                console.info(`✅ ProfileManager: Inicializado com ${this.state.profiles.length} perfil(s)`);
                resolve(true);

            } catch (error) {
                console.error('❌ ProfileManager: Erro na inicialização:', error);
                this.state.stats.errorCount++;
                reject(error);
            }
        });
    }

    // ============= CARREGAMENTO DE DADOS =============

    _loadProfiles() {
        try {
            const savedData = localStorage.getItem(this.config.storageKey);

            if (!savedData) {
                console.info('📭 Nenhum perfil salvo encontrado');
                this.state.profiles = [];
                return;
            }

            const parsed = JSON.parse(savedData);

            if (!Array.isArray(parsed)) {
                console.warn('⚠️ Dados de perfis corrompidos, recriando...');
                this.state.profiles = [];
                this._saveProfiles();
                return;
            }

            // Validar cada perfil
            this.state.profiles = parsed
                .map(profile => this._validateProfile(profile))
                .filter(profile => profile !== null);

            console.info(`📂 ${this.state.profiles.length} perfil(s) carregado(s)`);

        } catch (error) {
            console.error('❌ Erro ao carregar perfis:', error);
            this.state.profiles = [];
            this.state.stats.errorCount++;
        }
    }

    _loadCurrentProfile() {
        try {
            const profileName = localStorage.getItem(this.config.currentProfileKey);

            if (!profileName) {
                console.info('📭 Nenhum perfil atual salvo');
                this.state.currentProfile = null;
                return;
            }

            // Encontrar perfil na lista
            this.state.currentProfile = this.state.profiles.find(p => p.name === profileName) || null;

            if (this.state.currentProfile) {
                console.info(`👤 Perfil atual carregado: ${this.state.currentProfile.name}`);
            } else {
                console.warn(`⚠️ Perfil atual "${profileName}" não encontrado na lista`);
                localStorage.removeItem(this.config.currentProfileKey);
            }

        } catch (error) {
            console.error('❌ Erro ao carregar perfil atual:', error);
            this.state.currentProfile = null;
            this.state.stats.errorCount++;
        }
    }

    // ============= API PÚBLICA =============

    getAllProfiles() {
        if (!this.state.isInitialized) {
            console.warn('⚠️ ProfileManager não inicializado, retornando array vazio');
            return [];
        }
        return [...this.state.profiles];
    }

    getCurrentProfile() {
        if (!this.state.isInitialized) {
            console.warn('⚠️ ProfileManager não inicializado');
            return null;
        }
        return this.state.currentProfile ? { ...this.state.currentProfile } : null;
    }

    createProfile(name, initialData = {}) {
        if (!this.state.isInitialized) {
            console.error('❌ ProfileManager não inicializado');
            return false;
        }

        // Validar nome
        const trimmedName = (name || '').trim();
        if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 20) {
            console.error('❌ Nome inválido (2-20 caracteres)');
            return false;
        }

        // Verificar se já existe
        if (this.state.profiles.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
            console.error(`❌ Já existe um perfil com o nome "${trimmedName}"`);
            return false;
        }

        // Limite de perfis
        if (this.state.profiles.length >= this.config.maxProfiles) {
            console.error(`❌ Limite de ${this.config.maxProfiles} perfis atingido`);
            return false;
        }

        // Criar perfil padrão
        const now = new Date().toISOString();
        const defaultProfile = {
            name: trimmedName,
            level: 1,
            cash: 10000,
            experience: 0,
            vehicles: [],
            garage: [],
            achievements: [],
            stats: {
                races: 0,
                wins: 0,
                losses: 0,
                playTime: 0,
                totalEarnings: 0,
                bestSpeed: 0
            },
            settings: {
                audio: { volume: 0.7, music: 0.5 },
                controls: { sensitivity: 1.0, invertY: false },
                graphics: { quality: 'medium' }
            },
            created: now,
            lastPlayed: now,
            version: '2.0.0',
            ...initialData
        };

        // Validar perfil criado
        const validatedProfile = this._validateProfile(defaultProfile);
        if (!validatedProfile) {
            console.error('❌ Erro ao validar perfil criado');
            return false;
        }

        // Adicionar à lista
        this.state.profiles.push(validatedProfile);

        // Selecionar automaticamente se for o primeiro perfil
        if (this.state.profiles.length === 1) {
            this.selectProfile(trimmedName);
        }

        // Salvar
        if (this.config.autoSave) {
            this._queueSave();
        } else {
            this._saveProfiles();
        }

        console.info(`✅ Perfil criado: "${trimmedName}"`);

        // CORREÇÃO: Disparar eventos
        this.events.emit('profileCreated', {
            profileName: trimmedName,
            totalProfiles: this.state.profiles.length
        });

        this.events.emit('profilesUpdated', {
            profiles: [...this.state.profiles],
            action: 'create',
            newProfile: trimmedName
        });

        return true;
    }

    selectProfile(profileName) {
        if (!this.state.isInitialized) {
            console.error('❌ ProfileManager não inicializado');
            return false;
        }

        const profile = this.state.profiles.find(p => p.name === profileName);
        if (!profile) {
            console.error(`❌ Perfil "${profileName}" não encontrado`);
            return false;
        }

        // Atualizar perfil atual
        this.state.currentProfile = profile;

        // Atualizar lastPlayed
        profile.lastPlayed = new Date().toISOString();

        // Salvar em localStorage
        try {
            localStorage.setItem(this.config.currentProfileKey, profileName);

            // Marcar para salvar lista de perfis (atualiza lastPlayed)
            if (this.config.autoSave) {
                this._queueSave();
            } else {
                this._saveProfiles();
            }

            // Sincronizar com estado global
            this._syncWithGameState();

            console.info(`✅ Perfil selecionado: "${profileName}"`);

            // CORREÇÃO: Disparar evento
            this.events.emit('profileSelected', {
                profileName: profileName,
                profile: this.state.currentProfile
            });

            return true;

        } catch (error) {
            console.error(`❌ Erro ao selecionar perfil "${profileName}":`, error);
            this.state.stats.errorCount++;
            return false;
        }
    }

    updateProfile(profileName, updates) {
        if (!this.state.isInitialized) {
            console.error('❌ ProfileManager não inicializado');
            return false;
        }

        const profileIndex = this.state.profiles.findIndex(p => p.name === profileName);
        if (profileIndex === -1) {
            console.error(`❌ Perfil "${profileName}" não encontrado`);
            return false;
        }

        try {
            // Aplicar atualizações
            const updatedProfile = {
                ...this.state.profiles[profileIndex],
                ...updates,
                lastModified: new Date().toISOString()
            };

            // Validar perfil atualizado
            const validatedProfile = this._validateProfile(updatedProfile);
            if (!validatedProfile) {
                console.error(`❌ Perfil "${profileName}" inválido após atualização`);
                return false;
            }

            // Atualizar na lista
            this.state.profiles[profileIndex] = validatedProfile;

            // Atualizar perfil atual se for o mesmo
            if (this.state.currentProfile && this.state.currentProfile.name === profileName) {
                this.state.currentProfile = validatedProfile;
                this._syncWithGameState();
            }

            // Salvar
            if (this.config.autoSave) {
                this._queueSave();
            } else {
                this._saveProfiles();
            }

            console.info(`✅ Perfil atualizado: "${profileName}"`);
            return true;

        } catch (error) {
            console.error(`❌ Erro ao atualizar perfil "${profileName}":`, error);
            this.state.stats.errorCount++;
            return false;
        }
    }

    deleteProfile(profileName) {
        if (!this.state.isInitialized) {
            console.error('❌ ProfileManager não inicializado');
            return false;
        }

        const profileIndex = this.state.profiles.findIndex(p => p.name === profileName);
        if (profileIndex === -1) {
            console.error(`❌ Perfil "${profileName}" não encontrado`);
            return false;
        }

        // Não permitir deletar o último perfil
        if (this.state.profiles.length <= 1) {
            console.error('❌ Não é possível deletar o último perfil');
            return false;
        }

        try {
            // Guardar referência do perfil deletado
            const deletedProfile = this.state.profiles[profileIndex];

            // Remover da lista
            this.state.profiles.splice(profileIndex, 1);

            // Se era o perfil atual, selecionar outro
            let profileChanged = false;
            if (this.state.currentProfile && this.state.currentProfile.name === profileName) {
                const newCurrent = this.state.profiles[0] || null;
                this.state.currentProfile = newCurrent;

                if (newCurrent) {
                    localStorage.setItem(this.config.currentProfileKey, newCurrent.name);
                } else {
                    localStorage.removeItem(this.config.currentProfileKey);
                }

                this._syncWithGameState();
                profileChanged = true;
            }

            // Salvar
            if (this.config.autoSave) {
                this._queueSave();
            } else {
                this._saveProfiles();
            }

            console.info(`✅ Perfil deletado: "${profileName}"`);

            // CORREÇÃO: Disparar eventos de atualização
            this.events.emit('profileDeleted', {
                profileName: deletedProfile.name,
                remainingProfiles: this.state.profiles.length,
                profileChanged: profileChanged,
                newCurrentProfile: this.state.currentProfile
            });

            // Disparar evento de lista atualizada
            this.events.emit('profilesUpdated', {
                profiles: [...this.state.profiles],
                action: 'delete',
                deletedProfile: deletedProfile.name
            });

            return true;

        } catch (error) {
            console.error(`❌ Erro ao deletar perfil "${profileName}":`, error);
            this.state.stats.errorCount++;
            return false;
        }
    }

    _deleteProfileWithConfirmation(profileName) {
        console.log(`🔄 Iniciando deleção do perfil: ${profileName}`);

        // 1. Mostrar confirmação
        if (!confirm(`Tem certeza que deseja deletar o perfil "${profileName}"?`)) {
            console.log('❌ Deleção cancelada pelo usuário');
            return;
        }

        try {
            // 2. Carregar perfis atuais
            const profiles = this.profileManager.getAllProfiles();
            console.log('📊 Perfis antes da deleção:', profiles);

            // 3. Encontrar índice do perfil
            const profileIndex = profiles.findIndex(p => p.name === profileName);

            if (profileIndex === -1) {
                console.error(`❌ Perfil "${profileName}" não encontrado`);
                alert('Perfil não encontrado!');
                return;
            }

            // 4. Remover perfil do array
            profiles.splice(profileIndex, 1);
            console.log('✅ Perfil removido do array');

            // 5. Salvar no localStorage
            localStorage.setItem('streetrod2_profiles', JSON.stringify(profiles));
            console.log('💾 Perfis salvos no localStorage');

            // 6. Verificar se era o perfil atual
            const currentProfile = localStorage.getItem('sr2_currentProfile');
            if (currentProfile === profileName) {
                localStorage.removeItem('sr2_currentProfile');
                console.log('🗑️ Perfil atual removido');
            }

            // 7. **SOLUÇÃO CRÍTICA: Forçar re-renderização COMPLETA da tela**
            console.log('🎬 Recriando tela de seleção de perfis...');

            // Remover conteúdo atual
            if (this.profileSelectionContainer) {
                console.log('🧹 Limpando container existente...');
                this.profileSelectionContainer.innerHTML = '';
            } else {
                console.log('📦 Criando novo container...');
                this.profileSelectionContainer = document.createElement('div');
                this.profileSelectionContainer.id = 'profile-selection-container';
            }

            // 8. Recriar todos os elementos da tela
            this._createProfileSelectionInterface();

            console.log('✅ Deleção completada e UI atualizada!');

            // 9. Feedback visual opcional
            this._showNotification('Perfil deletado com sucesso!', 'success');

        } catch (error) {
            console.error('❌ ERRO na deleção do perfil:', error);
            alert(`Erro ao deletar perfil: ${error.message}`);
        }
    }

    clearCurrentProfile() {
        if (!this.state.isInitialized) {
            console.error('❌ ProfileManager não inicializado');
            return false;
        }

        try {
            this.state.currentProfile = null;
            localStorage.removeItem(this.config.currentProfileKey);

            console.info('✅ Perfil atual limpo');
            return true;

        } catch (error) {
            console.error('❌ Erro ao limpar perfil atual:', error);
            this.state.stats.errorCount++;
            return false;
        }
    }

    // ============= VALIDAÇÃO =============

    _validateProfile(profile) {
        if (!profile || typeof profile !== 'object') {
            console.warn('⚠️ Perfil inválido: não é objeto');
            return null;
        }

        // Campos obrigatórios
        if (!profile.name || typeof profile.name !== 'string') {
            console.warn('⚠️ Perfil inválido: nome ausente ou inválido');
            return null;
        }

        // Criar perfil validado com defaults
        const validated = {
            name: String(profile.name).trim(),
            level: Number(profile.level) || 1,
            cash: Number(profile.cash) || 10000,
            experience: Number(profile.experience) || 0,
            vehicles: Array.isArray(profile.vehicles) ? profile.vehicles : [],
            garage: Array.isArray(profile.garage) ? profile.garage : [],
            achievements: Array.isArray(profile.achievements) ? profile.achievements : [],
            stats: {
                races: Number(profile.stats?.races) || 0,
                wins: Number(profile.stats?.wins) || 0,
                losses: Number(profile.stats?.losses) || 0,
                playTime: Number(profile.stats?.playTime) || 0,
                totalEarnings: Number(profile.stats?.totalEarnings) || 0,
                bestSpeed: Number(profile.stats?.bestSpeed) || 0,
                ...(profile.stats || {})
            },
            settings: {
                audio: { volume: 0.7, music: 0.5, ...profile.settings?.audio },
                controls: { sensitivity: 1.0, invertY: false, ...profile.settings?.controls },
                graphics: { quality: 'medium', ...profile.settings?.graphics },
                ...(profile.settings || {})
            },
            created: profile.created || new Date().toISOString(),
            lastPlayed: profile.lastPlayed || new Date().toISOString(),
            version: profile.version || '1.0.0'
        };

        // Garantir valores mínimos
        validated.level = Math.max(1, Math.min(100, validated.level));
        validated.cash = Math.max(0, validated.cash);
        validated.experience = Math.max(0, validated.experience);

        return validated;
    }

    // ============= PERSISTÊNCIA =============

    _saveProfiles() {
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(this.state.profiles));
            this.state.lastSaveTime = Date.now();
            this.state.stats.saveCount++;

            // Limpar fila de saves
            this.state.saveQueue.clear();

            return true;

        } catch (error) {
            console.error('❌ Erro ao salvar perfis:', error);
            this.state.stats.errorCount++;

            // Tentar fallback: salvar menos dados
            try {
                const minimalProfiles = this.state.profiles.map(p => ({
                    name: p.name,
                    level: p.level,
                    cash: p.cash,
                    vehicles: p.vehicles.slice(0, 5)
                }));

                localStorage.setItem(this.config.storageKey, JSON.stringify(minimalProfiles));
                console.warn('⚠️ Perfis salvos em modo mínimo (fallback)');
                return true;

            } catch (fallbackError) {
                console.error('❌ Fallback também falhou:', fallbackError);
                return false;
            }
        }
    }

    _queueSave() {
        this.state.saveQueue.add('profiles');

        if (!this._saveTimeout) {
            this._saveTimeout = setTimeout(() => {
                this._saveProfiles();
                this._saveTimeout = null;
            }, this.config.saveDelay);
        }
    }

    _setupAutoSave() {
        // Salvar antes de fechar a página
        window.addEventListener('beforeunload', () => {
            if (this.state.saveQueue.size > 0) {
                this._saveProfiles();
            }
        });

        // Salvar periodicamente (a cada 30 segundos se houver mudanças)
        setInterval(() => {
            if (this.state.saveQueue.size > 0) {
                console.debug('💾 Auto-save periódico');
                this._saveProfiles();
            }
        }, 30000);
    }

    // ============= INTEGRAÇÃO COM SISTEMA =============

    _syncWithGameState() {
        // Sincronizar com estado global do jogo
        if (window.GAME && window.GAME.state) {
            window.GAME.state.currentProfile = this.state.currentProfile;

            // Disparar evento de mudança de perfil
            window.dispatchEvent(new CustomEvent('profileChanged', {
                detail: { profile: this.state.currentProfile }
            }));
        }
    }

    // ============= UTILITÁRIOS =============

    getStats() {
        return {
            ...this.state.stats,
            profileCount: this.state.profiles.length,
            hasCurrentProfile: !!this.state.currentProfile,
            lastSaveTime: this.state.lastSaveTime,
            saveQueueSize: this.state.saveQueue.size
        };
    }

    backupProfiles() {
        try {
            const backup = {
                profiles: this.state.profiles,
                timestamp: new Date().toISOString(),
                version: '2.0.0'
            };

            const backupKey = `${this.config.storageKey}_backup_${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(backup));

            console.info(`✅ Backup criado: ${backupKey}`);
            return backupKey;

        } catch (error) {
            console.error('❌ Erro ao criar backup:', error);
            return null;
        }
    }

    restoreFromBackup(backupKey) {
        try {
            const backupData = localStorage.getItem(backupKey);
            if (!backupData) {
                console.error('❌ Backup não encontrado');
                return false;
            }

            const backup = JSON.parse(backupData);

            if (!backup.profiles || !Array.isArray(backup.profiles)) {
                console.error('❌ Dados de backup inválidos');
                return false;
            }

            // Validar todos os perfis do backup
            const validatedProfiles = backup.profiles
                .map(p => this._validateProfile(p))
                .filter(p => p !== null);

            // Substituir perfis
            this.state.profiles = validatedProfiles;

            // Resetar perfil atual
            this.state.currentProfile = null;
            localStorage.removeItem(this.config.currentProfileKey);

            // Salvar
            this._saveProfiles();

            console.info(`✅ Backup restaurado: ${validatedProfiles.length} perfil(s)`);
            return true;

        } catch (error) {
            console.error('❌ Erro ao restaurar backup:', error);
            return false;
        }
    }

    // ============= DESTRUIÇÃO =============

    cleanup() {
        // Limpar timeouts
        if (this._saveTimeout) {
            clearTimeout(this._saveTimeout);
            this._saveTimeout = null;
        }

        // Forçar save final
        if (this.state.saveQueue.size > 0) {
            this._saveProfiles();
        }

        console.info('🧹 ProfileManager: Limpeza concluída');
    }
}

// ============= INICIALIZAÇÃO E EXPORTAÇÃO =============

// Prevenir múltiplas instâncias
if (!window.__profileManagerInitialized) {
    window.__profileManagerInitialized = true;

    try {
        // Criar instância
        const profileManager = new ProfileManager({
            autoSave: true,
            saveDelay: 1000,
            maxProfiles: 5
        });

        // Exportar instância (compatibilidade)
        window.profileManager = profileManager;

        // Exportar classe (para criação manual se necessário)
        window.ProfileManager = ProfileManager;

        console.info('✅ ProfileManager: Carregado e pronto');

        // Auto-inicializar quando o evento systemReady for disparado
        window.addEventListener('systemReady', () => {
            console.info('🎯 ProfileManager: systemReady recebido, inicializando...');
            profileManager.initialize().catch(error => {
                console.error('❌ ProfileManager: Falha na inicialização automática:', error);
            });
        });

        // CORREÇÃO: Também escutar gameLoaded como fallback
        window.addEventListener('gameLoaded', () => {
            console.info('🎮 ProfileManager: gameLoaded recebido, aguardando systemReady...');
        });

        // Permitir inicialização manual
        window.initProfileManager = () => profileManager.initialize();

    } catch (error) {
        console.error('❌ Falha crítica ao criar ProfileManager:', error);

        // Fallback mínimo compatível
        window.profileManager = {
            getAllProfiles: () => {
                try {
                    const saved = localStorage.getItem('streetrod2_profiles');
                    return saved ? JSON.parse(saved) : [];
                } catch {
                    return [];
                }
            },
            getCurrentProfile: () => {
                try {
                    const name = localStorage.getItem('sr2_currentProfile');
                    const profiles = JSON.parse(localStorage.getItem('streetrod2_profiles') || '[]');
                    return profiles.find(p => p.name === name) || null;
                } catch {
                    return null;
                }
            },
            createProfile: (name) => {
                try {
                    const profiles = JSON.parse(localStorage.getItem('streetrod2_profiles') || '[]');
                    const newProfile = {
                        name: name.trim(),
                        level: 1,
                        cash: 10000,
                        vehicles: []
                    };
                    profiles.push(newProfile);
                    localStorage.setItem('streetrod2_profiles', JSON.stringify(profiles));
                    return true;
                } catch {
                    return false;
                }
            },
            selectProfile: (name) => {
                try {
                    localStorage.setItem('sr2_currentProfile', name);
                    return true;
                } catch {
                    return false;
                }
            },
            initialize: () => Promise.resolve(true)
        };

        console.warn('⚠️ Usando ProfileManager de fallback');
    }
} else {
    console.warn('⚠️ ProfileManager: Já foi inicializado anteriormente');
}

// Comandos de debug
if (window.location.search.includes('debug')) {
    console.log(`
👤 PROFILE MANAGER - DEBUG COMMANDS
====================================
• profileManager.getAllProfiles() - Listar perfis
• profileManager.getCurrentProfile() - Ver perfil atual
• profileManager.createProfile("Teste") - Criar perfil
• profileManager.selectProfile("Teste") - Selecionar perfil
• localStorage.clear() - Limpar dados
    `);
}