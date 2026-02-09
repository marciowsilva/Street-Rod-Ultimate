// js/GarageScreen.js - VERSÃO CORRIGIDA
class GarageScreen {
    constructor() {
        this.name = 'garage';
        this.container = null;
        this.selectedCarIndex = 0;
        this.playerCars = [];
        this.isInitialized = false;
    }

    init() {
        console.log("GarageScreen: Inicializando...");
        
        // Buscar container com fallback
        this.container = document.getElementById('game-container');
        
        if (!this.container) {
            console.warn("⚠️ #game-container não encontrado, criando fallback...");
            this.container = document.createElement('div');
            this.container.id = 'game-container-fallback';
            this.container.className = 'game-container';
            document.body.appendChild(this.container);
        }
        
        this.isInitialized = true;
        return true;
    }

    show(params = {}) {
        console.log("GarageScreen: Mostrando garagem...");
        
        // Verificar inicialização
        if (!this.isInitialized) {
            this.init();
        }
        
        // Verificar container
        if (!this.container) {
            console.error("❌ Container não disponível!");
            return false;
        }
        
        try {
            const profile = ProfileManager.getCurrentProfile();
            if (!profile) {
                GameNotifications.show("Nenhum perfil carregado!");
                eventSystem.showScreen('profile-selection');
                return false;
            }
            
            this.playerCars = profile.cars || [];
            this.selectedCarIndex = profile.selectedCarIndex || 0;
            
            // Limpar container primeiro
            this.container.innerHTML = '';
            
            // Criar HTML
            this.container.innerHTML = `
                <div class="screen garage-screen">
                    <div class="screen-header">
                        <h1>🏁 MINHA GARAGEM</h1>
                        <button class="btn-back" onclick="eventSystem.showScreen('main-menu')">
                            ← Voltar ao Menu
                        </button>
                    </div>
                    
                    <div class="garage-content">
                        <div class="garage-stats">
                            <h2>${profile.name}</h2>
                            <div class="stats">
                                <span class="stat">💰 $${profile.money.toFixed(2)}</span>
                                <span class="stat">🚗 ${this.playerCars.length} carros</span>
                            </div>
                        </div>
                        
                        <div id="cars-list-container" class="cars-list-container">
                            <h3>MEUS CARROS</h3>
                            ${this.generateCarsList()}
                        </div>
                        
                        <div class="garage-actions">
                            <button class="btn-action" onclick="eventSystem.showScreen('shop')">
                                🛒 VISITAR LOJA
                            </button>
                            <button class="btn-action" onclick="window.currentGarageScreen.showUpgrades()">
                                ⚙️ MELHORIAS
                            </button>
                            <button class="btn-action" onclick="window.currentGarageScreen.startRace()">
                                🏁 INICIAR CORRIDA
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Expor instância para event listeners
            window.currentGarageScreen = this;
            
            GameNotifications.show(`Garagem carregada: ${this.playerCars.length} carro(s)`);
            return true;
            
        } catch (error) {
            console.error("❌ Erro ao mostrar GarageScreen:", error);
            GameNotifications.show("Erro ao carregar garagem!");
            return false;
        }
    }

    generateCarsList() {
        if (this.playerCars.length === 0) {
            return `
                <div class="no-cars">
                    <p style="font-size: 1.2rem; margin-bottom: 20px;">
                        Você ainda não tem carros na garagem!
                    </p>
                    <button class="btn-buy" onclick="eventSystem.showScreen('shop')">
                        🛒 COMPRAR MEU PRIMEIRO CARRO
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="cars-grid">
                ${this.playerCars.map((car, index) => `
                    <div class="car-item ${index === this.selectedCarIndex ? 'selected' : ''}" 
                         onclick="window.currentGarageScreen.selectCar(${index})">
                        <div class="car-image">${car.icon || '🚗'}</div>
                        <div class="car-details">
                            <h4>${car.name}</h4>
                            <p class="car-model">${car.model || 'Street Rod'}</p>
                            <div class="car-stats">
                                <span>⚡ ${car.performance || 5}/10</span>
                                <span>💰 $${car.value || 1000}</span>
                            </div>
                        </div>
                        ${index === this.selectedCarIndex ? 
                            '<div class="selected-badge">✓ SELECIONADO</div>' : 
                            '<div class="select-badge">SELECIONAR</div>'}
                    </div>
                `).join('')}
            </div>
        `;
    }

    selectCar(index) {
        if (index >= 0 && index < this.playerCars.length) {
            this.selectedCarIndex = index;
            this.selectCurrentCar();
            
            // Atualizar visualização
            const container = document.getElementById('cars-list-container');
            if (container) {
                container.innerHTML = `
                    <h3>MEUS CARROS</h3>
                    ${this.generateCarsList()}
                `;
            }
        }
    }

    selectCurrentCar() {
        const profile = ProfileManager.getCurrentProfile();
        if (profile && this.playerCars.length > 0) {
            profile.selectedCarIndex = this.selectedCarIndex;
            ProfileManager.saveCurrentProfile();
            
            const carName = this.playerCars[this.selectedCarIndex].name;
            GameNotifications.show(`Carro selecionado: ${carName}`);
        }
    }

    showUpgrades() {
        if (this.playerCars.length === 0) {
            GameNotifications.show("Selecione um carro primeiro!");
            return;
        }
        GameNotifications.show("Sistema de melhorias em desenvolvimento!");
    }

    startRace() {
        console.log("GarageScreen: Iniciando corrida...");
        
        if (this.playerCars.length === 0) {
            GameNotifications.show("Você precisa de um carro para correr!");
            eventSystem.showScreen('shop');
            return;
        }
        
        // Garantir que o carro está selecionado
        this.selectCurrentCar();
        
        GameNotifications.show("Preparando para corrida...");
        
        // Navegar para Race Selection
        setTimeout(() => {
            eventSystem.showScreen('race-selection');
        }, 800);
    }

    hide() {
        console.log("GarageScreen: Escondendo tela...");
        
        // Limpar referência global
        window.currentGarageScreen = null;
        
        // Limpar container apenas se existir
        if (this.container && this.container.innerHTML) {
            try {
                this.container.innerHTML = '';
                console.log("✅ GarageScreen: Container limpo");
            } catch (error) {
                console.warn("⚠️ GarageScreen: Erro ao limpar container:", error);
            }
        } else {
            console.log("ℹ️ GarageScreen: Container já vazio ou não disponível");
        }
        
        // Manter container para reuso
        // Não resetar this.container = null
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.GarageScreen = GarageScreen;
    console.log("✅ GarageScreen registrado globalmente");
}