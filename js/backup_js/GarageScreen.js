// GarageScreen.js - Tela de Garagem

class GarageScreen {
    constructor() {
        this.screenId = 'garage-screen';
        this.isInitialized = false;
        this.currentProfile = null;
    }

    // Inicializar tela
    initialize() {
        if (this.isInitialized) return;

        console.log('GarageScreen: Initializing...');

        // Obter referência ao container principal
        this.gameContainer = document.getElementById('game-container');

        // Carregar perfil atual
        this.currentProfile = window.currentProfile;

        // Criar estrutura HTML da garagem
        this.createScreenHTML();

        // Registrar eventos
        this.registerEvents();

        // Atualizar dados da garagem
        this.updateGarageData();

        this.isInitialized = true;
        console.log('GarageScreen: Initialized successfully');
    }

    // Criar HTML da tela
    createScreenHTML() {
        // Limpar container
        this.gameContainer.innerHTML = '';

        // Criar estrutura da tela
        this.gameContainer.innerHTML = `
            <div id="${this.screenId}" class="screen">
                <div class="screen-header">
                    <h1 class="screen-title">GARAGEM</h1>
                    <div class="profile-info">
                        <span class="profile-name">${this.currentProfile?.name || 'Jogador'}</span>
                        <span class="profile-cash">$${this.currentProfile?.cash || 0}</span>
                    </div>
                </div>
                
                <div class="screen-content">
                    <div class="garage-section">
                        <h2>MEUS VEÍCULOS</h2>
                        <div id="garage-vehicles" class="vehicles-container">
                            <!-- Veículos serão inseridos aqui dinamicamente -->
                        </div>
                    </div>
                    
                    <div class="garage-stats">
                        <h2>ESTATÍSTICAS</h2>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="stat-label">Veículos:</span>
                                <span id="total-vehicles" class="stat-value">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Valor Total:</span>
                                <span id="total-value" class="stat-value">$0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Vitórias:</span>
                                <span id="total-wins" class="stat-value">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Corridas:</span>
                                <span id="total-races" class="stat-value">0</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="screen-footer">
                    <button id="back-button" class="btn btn-secondary">
                        VOLTAR
                    </button>
                    <button id="customize-button" class="btn btn-primary">
                        PERSONALIZAR
                    </button>
                    <button id="sell-button" class="btn btn-danger">
                        VENDER VEÍCULO
                    </button>
                </div>
            </div>
        `;

        // Adicionar estilos específicos
        this.addStyles();
    }

    // Adicionar estilos
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #${this.screenId} {
                padding: 20px;
                height: 100vh;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                display: flex;
                flex-direction: column;
            }
            
            .screen-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 15px;
                border-bottom: 2px solid #ff4757;
            }
            
            .screen-title {
                font-size: 2.5rem;
                color: #ff4757;
                text-transform: uppercase;
                letter-spacing: 3px;
            }
            
            .profile-info {
                display: flex;
                gap: 20px;
                font-size: 1.2rem;
            }
            
            .profile-name {
                color: #fff;
                font-weight: bold;
            }
            
            .profile-cash {
                color: #4cd137;
                font-weight: bold;
            }
            
            .screen-content {
                flex: 1;
                display: flex;
                gap: 30px;
                overflow: hidden;
            }
            
            .garage-section {
                flex: 2;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                padding: 20px;
                overflow-y: auto;
            }
            
            .garage-section h2 {
                color: #fff;
                margin-bottom: 20px;
                font-size: 1.5rem;
            }
            
            .vehicles-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
            }
            
            .vehicle-card {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 15px;
                border: 2px solid transparent;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .vehicle-card:hover {
                border-color: #ff4757;
                transform: translateY(-5px);
            }
            
            .vehicle-card.selected {
                border-color: #4cd137;
                background: rgba(76, 209, 55, 0.1);
            }
            
            .vehicle-name {
                color: #fff;
                font-size: 1.2rem;
                margin-bottom: 10px;
            }
            
            .vehicle-stats {
                display: flex;
                justify-content: space-between;
                color: #aaa;
                font-size: 0.9rem;
            }
            
            .garage-stats {
                flex: 1;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                padding: 20px;
            }
            
            .garage-stats h2 {
                color: #fff;
                margin-bottom: 20px;
                font-size: 1.5rem;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            
            .stat-item {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
            }
            
            .stat-label {
                color: #aaa;
            }
            
            .stat-value {
                color: #fff;
                font-weight: bold;
            }
            
            .screen-footer {
                display: flex;
                justify-content: space-between;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #333;
            }
            
            .btn {
                padding: 12px 25px;
                border: none;
                border-radius: 5px;
                font-family: 'Rajdhani', sans-serif;
                font-weight: bold;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .btn-primary {
                background: #ff4757;
                color: white;
            }
            
            .btn-primary:hover {
                background: #ff2e43;
                transform: scale(1.05);
            }
            
            .btn-secondary {
                background: #333;
                color: white;
            }
            
            .btn-secondary:hover {
                background: #444;
                transform: scale(1.05);
            }
            
            .btn-danger {
                background: #e84118;
                color: white;
            }
            
            .btn-danger:hover {
                background: #c23616;
                transform: scale(1.05);
            }
        `;

        document.head.appendChild(style);
    }

    // Registrar eventos
    registerEvents() {
        // Botão Voltar
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.goBack();
            });
        }

        // Botão Personalizar
        const customizeButton = document.getElementById('customize-button');
        if (customizeButton) {
            customizeButton.addEventListener('click', () => {
                this.customizeVehicle();
            });
        }

        // Botão Vender
        const sellButton = document.getElementById('sell-button');
        if (sellButton) {
            sellButton.addEventListener('click', () => {
                this.sellVehicle();
            });
        }

        // Selecionar veículo
        document.addEventListener('click', (e) => {
            if (e.target.closest('.vehicle-card')) {
                const vehicleCard = e.target.closest('.vehicle-card');
                this.selectVehicle(vehicleCard);
            }
        });
    }

    // Atualizar dados da garagem
    updateGarageData() {
        if (!this.currentProfile) {
            console.warn('GarageScreen: No current profile found');
            return;
        }

        // Atualizar estatísticas
        this.updateStats();

        // Atualizar lista de veículos
        this.updateVehicleList();
    }

    // Atualizar estatísticas
    updateStats() {
        const profile = this.currentProfile;

        // Calcular estatísticas
        const totalVehicles = profile.vehicles ? profile.vehicles.length : 0;
        const totalValue = profile.vehicles ?
            profile.vehicles.reduce((sum, vehicle) => sum + (vehicle.value || 0), 0) : 0;
        const totalWins = profile.stats ? profile.stats.wins || 0 : 0;
        const totalRaces = profile.stats ? profile.stats.races || 0 : 0;

        // Atualizar DOM
        document.getElementById('total-vehicles').textContent = totalVehicles;
        document.getElementById('total-value').textContent = `$${totalValue.toLocaleString()}`;
        document.getElementById('total-wins').textContent = totalWins;
        document.getElementById('total-races').textContent = totalRaces;
    }

    // Atualizar lista de veículos
    updateVehicleList() {
        const vehiclesContainer = document.getElementById('garage-vehicles');
        if (!vehiclesContainer) return;

        const profile = this.currentProfile;

        if (!profile.vehicles || profile.vehicles.length === 0) {
            vehiclesContainer.innerHTML = `
                <div class="empty-garage">
                    <p style="color: #aaa; text-align: center; padding: 40px;">
                        Sua garagem está vazia!<br>
                        Vá à loja para comprar seu primeiro veículo.
                    </p>
                </div>
            `;
            return;
        }

        // Criar cartões de veículos
        vehiclesContainer.innerHTML = '';

        profile.vehicles.forEach((vehicle, index) => {
            const vehicleCard = document.createElement('div');
            vehicleCard.className = 'vehicle-card';
            vehicleCard.dataset.index = index;

            vehicleCard.innerHTML = `
                <div class="vehicle-name">${vehicle.name || 'Veículo'}</div>
                <div class="vehicle-stats">
                    <span>Vel: ${vehicle.speed || 0}</span>
                    <span>Acel: ${vehicle.acceleration || 0}</span>
                    <span>Cont: ${vehicle.handling || 0}</span>
                </div>
                <div style="margin-top: 10px; color: #4cd137;">
                    Valor: $${vehicle.value || 0}
                </div>
            `;

            vehiclesContainer.appendChild(vehicleCard);
        });

        // Selecionar primeiro veículo por padrão
        if (profile.vehicles.length > 0) {
            const firstCard = vehiclesContainer.querySelector('.vehicle-card');
            if (firstCard) {
                this.selectVehicle(firstCard);
            }
        }
    }

    // Selecionar veículo
    selectVehicle(vehicleCard) {
        // Remover seleção anterior
        document.querySelectorAll('.vehicle-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Adicionar seleção ao veículo clicado
        vehicleCard.classList.add('selected');

        // Armazenar veículo selecionado
        this.selectedVehicleIndex = parseInt(vehicleCard.dataset.index);

        console.log(`GarageScreen: Selected vehicle index ${this.selectedVehicleIndex}`);
    }

    // Voltar para menu principal
    goBack() {
        console.log('GarageScreen: Going back to main menu');

        // Usar EventSystem se disponível
        if (window.eventSystem && window.eventSystem.switchToScreen) {
            window.eventSystem.switchToScreen('main-menu');
        }
        // Fallback: voltar ao menu principal diretamente
        else if (window.mainMenuScreen && window.mainMenuScreen.initialize) {
            window.mainMenuScreen.initialize();
        }
    }

    // Personalizar veículo
    customizeVehicle() {
        if (this.selectedVehicleIndex === undefined) {
            alert('Selecione um veículo para personalizar!');
            return;
        }

        console.log(`GarageScreen: Customizing vehicle ${this.selectedVehicleIndex}`);

        // Em produção, aqui você abriria uma tela de personalização
        alert(`Personalizar veículo ${this.selectedVehicleIndex + 1} - Funcionalidade em desenvolvimento`);
    }

    // Vender veículo
    sellVehicle() {
        if (this.selectedVehicleIndex === undefined) {
            alert('Selecione um veículo para vender!');
            return;
        }

        const profile = this.currentProfile;
        if (!profile.vehicles || !profile.vehicles[this.selectedVehicleIndex]) {
            alert('Veículo não encontrado!');
            return;
        }

        const vehicle = profile.vehicles[this.selectedVehicleIndex];
        const confirmSell = confirm(`Vender ${vehicle.name} por $${vehicle.value * 0.7}? (70% do valor)`);

        if (confirmSell) {
            // Calcular valor da venda (70% do valor original)
            const saleValue = Math.floor(vehicle.value * 0.7);

            // Adicionar dinheiro ao perfil
            profile.cash += saleValue;

            // Remover veículo da lista
            profile.vehicles.splice(this.selectedVehicleIndex, 1);

            // Atualizar perfil no armazenamento
            if (window.profileManager && window.profileManager.saveProfile) {
                window.profileManager.saveProfile(profile);
            }

            // Atualizar display
            this.updateGarageData();

            console.log(`GarageScreen: Sold vehicle for $${saleValue}`);
            alert(`Veículo vendido! Você recebeu $${saleValue}`);
        }
    }

    // Limpar tela
    cleanup() {
        console.log('GarageScreen: Cleaning up');

        // Remover eventos
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.replaceWith(backButton.cloneNode(true));
        }

        this.isInitialized = false;
    }
}

// Criar instância global
window.garageScreen = new GarageScreen();

// Registrar no EventSystem se disponível
if (window.eventSystem) {
    window.eventSystem.registerScreen('garage', window.garageScreen);
}

console.log('GarageScreen: Module loaded');