// ProfileManager.js - VERSÃO COMPATÍVEL
console.log('👤 ProfileManager carregado');

class ProfileManager {
    constructor() {
        console.log('🛠️ Inicializando ProfileManager...');
        this.profiles = new Map();
        this.currentProfile = null;

        // Garantir que window.game existe
        this.ensureGameObject();

        this.loadProfiles();
        console.log(`✅ ProfileManager inicializado com ${this.profiles.size} perfil(s)`);
    }

    // Método para garantir que window.game existe
    ensureGameObject() {
        if (!window.game) {
            window.game = {
                isInitialized: false,
                currentScreen: 'welcome',
                isPaused: false,
                isRacing: false,
                raceProgress: 0,
                lastProfile: null
            };
        }
        return window.game;
    }

    loadProfiles() {
        try {
            console.log('📂 Carregando perfis salvos...');
            const saved = localStorage.getItem('streetRodProfiles');

            if (saved) {
                const parsed = JSON.parse(saved);

                // Verificar se parsed é um array
                if (Array.isArray(parsed)) {
                    parsed.forEach(profileData => {
                        if (profileData && profileData.name) {
                            const profile = this.reconstructProfile(profileData);
                            this.profiles.set(profile.name, profile);
                            console.log(`📖 Perfil carregado: ${profile.name}`);
                        }
                    });
                } else if (parsed && typeof parsed === 'object' && parsed.name) {
                    // Backward compatibility: se for um objeto único
                    const profile = this.reconstructProfile(parsed);
                    this.profiles.set(profile.name, profile);
                    console.log(`📖 Perfil carregado (objeto único): ${profile.name}`);
                }

                // Verificar se há lastProfile
                const lastProfileName = localStorage.getItem('streetRodLastProfile');
                if (lastProfileName && this.profiles.has(lastProfileName)) {
                    if (window.game) {
                        window.game.lastProfile = lastProfileName;
                    }
                }
            } else {
                console.log('📭 Nenhum perfil salvo encontrado');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar perfis:', error);
        }
    }

    // Método para reconstruir perfil
    reconstructProfile(data) {
        return {
            name: data.name,
            money: data.money || 10000,
            level: data.level || 1,
            xp: data.xp || 0,
            stats: data.stats || {
                wins: 0,
                losses: 0,
                races: 0,
                bestTime: null,
                totalMoneyEarned: 0
            },
            cars: data.cars || [],
            upgrades: data.upgrades || {},
            settings: data.settings || {
                musicVolume: 0.7,
                sfxVolume: 1.0,
                controls: 'keyboard',
                difficulty: 'medium'
            },
            unlocked: data.unlocked || {
                tracks: ['downtown', 'industrial'],
                cars: ['starter'],
                parts: ['basic']
            },
            createdAt: data.createdAt || Date.now(),
            lastPlayed: data.lastPlayed || Date.now()
        };
    }

    saveProfiles() {
        try {
            console.log('💾 Salvando perfis...');
            const profilesArray = this.getAllProfiles().map(profile => ({
                ...profile,
                lastPlayed: profile.lastPlayed || Date.now()
            }));

            localStorage.setItem('streetRodProfiles', JSON.stringify(profilesArray));

            // Salvar também o último perfil usado
            if (this.currentProfile) {
                localStorage.setItem('streetRodLastProfile', this.currentProfile.name);

                if (window.game) {
                    window.game.lastProfile = this.currentProfile.name;
                }
            }

            console.log(`✅ ${profilesArray.length} perfil(s) salvo(s)`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar perfis:', error);
            return false;
        }
    }

    createProfile(name, data = {}) {
        console.log(`👤 Criando perfil: ${name}`);

        const profile = this.reconstructProfile({ name, ...data });

        if (!data.createdAt) {
            profile.createdAt = Date.now();
        }

        this.profiles.set(name, profile);
        this.saveProfiles();

        console.log(`✅ Perfil ${name} criado com sucesso`);
        return profile;
    }

    selectProfile(name) {
        console.log(`🎯 Selecionando perfil: ${name}`);

        if (!this.profiles.has(name)) {
            console.error(`❌ Perfil ${name} não encontrado`);
            return false;
        }

        const profile = this.profiles.get(name);
        profile.lastPlayed = Date.now();
        this.currentProfile = profile;
        window.currentProfile = profile;

        if (window.game) {
            window.game.lastProfile = name;
        }
        localStorage.setItem('streetRodLastProfile', name);

        this.saveProfiles();

        console.log(`✅ Perfil ${name} selecionado`);
        return true;
    }

    deleteProfile(name) {
        console.log(`🗑️ Deletando perfil: ${name}`);

        if (!this.profiles.has(name)) {
            console.error(`❌ Perfil ${name} não encontrado`);
            return false;
        }

        this.profiles.delete(name);

        if (this.currentProfile && this.currentProfile.name === name) {
            this.currentProfile = null;
            window.currentProfile = null;

            if (window.game) {
                window.game.lastProfile = null;
            }
            localStorage.removeItem('streetRodLastProfile');
        }

        this.saveProfiles();

        console.log(`✅ Perfil ${name} deletado`);
        return true;
    }

    updateProfile(name, updates) {
        console.log(`✏️ Atualizando perfil: ${name}`);

        if (!this.profiles.has(name)) {
            console.error(`❌ Perfil ${name} não encontrado`);
            return false;
        }

        const profile = this.profiles.get(name);
        Object.assign(profile, updates);
        profile.lastPlayed = Date.now();

        if (this.currentProfile && this.currentProfile.name === name) {
            this.currentProfile = profile;
            window.currentProfile = profile;
        }

        this.saveProfiles();
        console.log(`✅ Perfil ${name} atualizado`);
        return true;
    }

    getProfile(name) {
        return this.profiles.get(name) || null;
    }

    // MÉTODO ADICIONADO: getAllProfiles
    getAllProfiles() {
        // Retornar array de todos os perfis
        return Array.from(this.profiles.values()).map(profile => ({
            ...profile,
            name: String(profile.name || 'Sem Nome')
        }));
    }

    getCurrentProfile() {
        return this.currentProfile;
    }

    // Carregar perfil automaticamente se houver lastProfile
    loadLastProfile() {
        const lastProfileName = localStorage.getItem('streetRodLastProfile') ||
            (window.game && window.game.lastProfile);

        if (lastProfileName && this.profiles.has(lastProfileName)) {
            console.log(`🔄 Tentando carregar último perfil: ${lastProfileName}`);
            return this.selectProfile(lastProfileName);
        }
        return false;
    }

    // Criar perfil padrão se não houver nenhum
    createDefaultProfileIfEmpty() {
        if (this.profiles.size === 0) {
            console.log('👤 Criando perfil padrão...');
            const defaultProfile = this.createProfile('Player1');
            this.selectProfile('Player1');
            return defaultProfile;
        }
        return null;
    }

    // MÉTODO ADICIONADO: getProfileCount
    getProfileCount() {
        return this.profiles.size;
    }

    // MÉTODO ADICIONADO: hasProfiles
    hasProfiles() {
        return this.profiles.size > 0;
    }
}

// Inicialização global
function initProfileManager() {
    if (window.profileManager) {
        console.warn('⚠️ ProfileManager já inicializado');
        return window.profileManager;
    }

    // Garantir que window.game existe
    if (!window.game) {
        window.game = {
            isInitialized: false,
            currentScreen: 'welcome',
            isPaused: false,
            isRacing: false,
            raceProgress: 0,
            lastProfile: null
        };
    }

    window.profileManager = new ProfileManager();
    window.profileManager.createDefaultProfileIfEmpty();

    console.log('🎮 ProfileManager inicializado globalmente');
    return window.profileManager;
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProfileManager, initProfileManager };
} else if (typeof window !== 'undefined') {
    window.ProfileManager = ProfileManager;
    window.initProfileManager = initProfileManager;
}