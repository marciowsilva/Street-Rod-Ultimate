// js/ScreenAdapter.js - ADAPTADOR UNIVERSAL PARA TELAS
class ScreenAdapter {
    constructor() {
        console.log('🔧 ScreenAdapter inicializado');
        this.adaptAllScreens();
    }
    
    adaptAllScreens() {
        // Lista de todas as classes de tela que precisam ser adaptadas
        const screenClasses = [
            'ProfileSelectionScreen',
            'ProfileCreationScreen', 
            'MainMenuScreen',
            'SettingsScreen',
            'ShopScreen',
            'GarageScreen'
        ];
        
        screenClasses.forEach(className => {
            this.adaptScreenClass(className);
        });
        
        console.log('✅ Todas as telas foram adaptadas');
    }
    
    adaptScreenClass(className) {
        if (!window[className]) {
            console.warn(`⚠️ Classe ${className} não encontrada, criando placeholder`);
            window[className] = class {};
            return;
        }
        
        const OriginalClass = window[className];
        
        // Substituir a classe original por uma versão adaptada
        window[className] = class AdaptedScreen {
            constructor(...args) {
                this._instance = new OriginalClass(...args);
                this._className = className;
                this._container = document.getElementById('game-container');
                
                // Injetar métodos padrão se não existirem
                this.ensureMethods();
            }
            
            ensureMethods() {
                // Método show() padrão
                if (typeof this._instance.show !== 'function') {
                    this.show = (data) => {
                        console.log(`🖥️ Mostrando tela: ${this._className}`, data);
                        this.renderDefaultScreen();
                        return Promise.resolve();
                    };
                } else {
                    this.show = (data) => this._instance.show(data);
                }
                
                // Método hide() padrão
                if (typeof this._instance.hide !== 'function') {
                    this.hide = () => {
                        console.log(`🖥️ Escondendo tela: ${this._className}`);
                        return Promise.resolve();
                    };
                } else {
                    this.hide = () => this._instance.hide();
                }
                
                // Método render() padrão
                if (typeof this._instance.render !== 'function') {
                    this.render = () => {
                        console.log(`🖥️ Renderizando tela: ${this._className}`);
                        return this.renderDefaultScreen();
                    };
                } else {
                    this.render = () => this._instance.render();
                }
            }
            
            renderDefaultScreen() {
                // Conteúdo HTML baseado no tipo de tela
                let html = '';
                
                switch(this._className) {
                    case 'ProfileSelectionScreen':
                        html = this.getProfileSelectionHTML();
                        break;
                    case 'MainMenuScreen':
                        html = this.getMainMenuHTML();
                        break;
                    case 'GarageScreen':
                        html = this.getGarageHTML();
                        break;
                    default:
                        html = `<div class="screen">
                            <h2>${this._className}</h2>
                            <p>Tela em desenvolvimento</p>
                        </div>`;
                }
                
                if (this._container) {
                    this._container.innerHTML = html;
                    this.bindEvents();
                }
                
                return html;
            }
            
            getProfileSelectionHTML() {
                const profiles = ProfileManager ? ProfileManager.getAllProfiles() : [];
                const activeProfile = ProfileManager ? ProfileManager.getActiveProfile() : null;
                
                return `
                    <div class="screen profile-selection">
                        <h1>🔄 Seleção de Perfil</h1>
                        <div class="profiles-container">
                            ${profiles.map(profile => `
                                <div class="profile-card ${activeProfile?.id === profile.id ? 'active' : ''}">
                                    <h3>${profile.name}</h3>
                                    <p>Nível: ${profile.level || 1}</p>
                                    <p>Dinheiro: $${profile.money || 1000}</p>
                                    <button class="select-btn" data-id="${profile.id}">
                                        ${activeProfile?.id === profile.id ? '✅ ATIVO' : 'SELECIONAR'}
                                    </button>
                                    <button class="delete-btn" data-id="${profile.id}">🗑️</button>
                                </div>
                            `).join('')}
                            
                            <div class="profile-card new-profile">
                                <h3>+ NOVO PERFIL</h3>
                                <button class="create-btn">CRIAR</button>
                            </div>
                        </div>
                        ${activeProfile ? `
                            <div class="continue-container">
                                <button class="continue-btn">CONTINUAR COM ${activeProfile.name}</button>
                            </div>
                        ` : ''}
                    </div>
                `;
            }
            
            getMainMenuHTML() {
                const activeProfile = ProfileManager ? ProfileManager.getActiveProfile() : null;
                
                return `
                    <div class="screen main-menu">
                        <div class="profile-info">
                            <h2>👤 ${activeProfile ? activeProfile.name : 'Convidado'}</h2>
                            <p>Nível: ${activeProfile ? activeProfile.level : 1} | $${activeProfile ? activeProfile.money : 0}</p>
                        </div>
                        
                        <div class="menu-options">
                            <button class="menu-btn" data-screen="garage">
                                🚗 GARAGEM
                            </button>
                            <button class="menu-btn" data-screen="shop">
                                🛒 LOJA
                            </button>
                            <button class="menu-btn" data-screen="race">
                                🏁 CORRIDA
                            </button>
                            <button class="menu-btn" data-screen="settings">
                                ⚙️ CONFIGURAÇÕES
                            </button>
                        </div>
                        
                        <div class="menu-footer">
                            <button class="logout-btn">↩️ TROCAR PERFIL</button>
                        </div>
                    </div>
                `;
            }
            
            getGarageHTML() {
                const activeProfile = ProfileManager ? ProfileManager.getActiveProfile() : null;
                const cars = activeProfile ? (activeProfile.cars || []) : [];
                
                return `
                    <div class="screen garage">
                        <h1>🚗 MINHA GARAGEM</h1>
                        <div class="cars-grid">
                            ${cars.length > 0 ? cars.map(car => `
                                <div class="car-card">
                                    <h3>${car.name}</h3>
                                    <p>Potência: ${car.power}HP</p>
                                    <p>Velocidade: ${car.speed}km/h</p>
                                    <button class="select-car-btn" data-car="${car.id}">SELECIONAR</button>
                                </div>
                            `).join('') : `
                                <div class="empty-garage">
                                    <p>Sua garagem está vazia!</p>
                                    <button class="go-to-shop-btn">IR PARA LOJA</button>
                                </div>
                            `}
                        </div>
                        <button class="back-btn">⬅️ VOLTAR AO MENU</button>
                    </div>
                `;
            }
            
            bindEvents() {
                // Bind específico para cada tipo de tela
                switch(this._className) {
                    case 'ProfileSelectionScreen':
                        this.bindProfileSelectionEvents();
                        break;
                    case 'MainMenuScreen':
                        this.bindMainMenuEvents();
                        break;
                    case 'GarageScreen':
                        this.bindGarageEvents();
                        break;
                }
            }
            
            bindProfileSelectionEvents() {
                // Selecionar perfil
                document.querySelectorAll('.select-btn').forEach(btn => {
                    btn.onclick = (e) => {
                        const profileId = e.target.dataset.id;
                        if (ProfileManager) {
                            ProfileManager.setActiveProfile(profileId);
                            location.reload(); // Recarregar para aplicar
                        }
                    };
                });
                
                // Criar perfil
                document.querySelector('.create-btn')?.addEventListener('click', () => {
                    if (eventSystem) {
                        eventSystem.showScreen('profile-creation');
                    }
                });
                
                // Continuar
                document.querySelector('.continue-btn')?.addEventListener('click', () => {
                    if (eventSystem) {
                        eventSystem.showScreen('main-menu');
                    }
                });
            }
            
            bindMainMenuEvents() {
                document.querySelectorAll('.menu-btn').forEach(btn => {
                    btn.onclick = (e) => {
                        const screen = e.target.dataset.screen;
                        if (eventSystem && eventSystem.showScreen) {
                            eventSystem.showScreen(screen);
                        }
                    };
                });
                
                document.querySelector('.logout-btn')?.addEventListener('click', () => {
                    if (eventSystem) {
                        eventSystem.showScreen('profile-selection');
                    }
                });
            }
            
            bindGarageEvents() {
                document.querySelector('.back-btn')?.addEventListener('click', () => {
                    if (eventSystem) {
                        eventSystem.showScreen('main-menu');
                    }
                });
                
                document.querySelector('.go-to-shop-btn')?.addEventListener('click', () => {
                    if (eventSystem) {
                        eventSystem.showScreen('shop');
                    }
                });
            }
            
            // Delegar outras propriedades/métodos para a instância original
            get [Symbol.toStringTag]() {
                return `Adapted${this._className}`;
            }
        };
        
        console.log(`✅ ${className} adaptada com métodos show()/hide()/render()`);
    }
}