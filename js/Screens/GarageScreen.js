// GarageScreen.js - VERSÃO LIMPA E OTIMIZADA
console.log('🚗 Carregando GarageScreen...');

class GarageScreen {
    constructor() {
        this.screenId = 'garage-screen';
        this.selectedVehicleIndex = null;
    }

    initialize() {
        console.log('🚗 Inicializando GarageScreen...');
        
        const container = document.getElementById('game-container');
        if (!container) {
            console.error('❌ Container não encontrado');
            return;
        }
        
        const profile = this.getCurrentProfile();
        container.innerHTML = this.createGarageHTML(profile);
        
        this.setupEvents();
        this.updateVehicleList(profile);
        
        console.log('✅ GarageScreen inicializada');
    }

    // Obter perfil atual
    getCurrentProfile() {
        if (window.ProfileManager && window.ProfileManager.getCurrentProfile) {
            return window.ProfileManager.getCurrentProfile();
        }
        
        if (window.currentProfile) {
            return window.currentProfile;
        }
        
        // Perfil padrão
        return {
            name: 'Jogador',
            cash: 10000,
            level: 1,
            vehicles: [
                {
                    name: 'Mustang 65',
                    speed: 85,
                    acceleration: 75,
                    handling: 65,
                    value: 15000
                }
            ],
            stats: { wins: 0, races: 0 }
        };
    }

    // Criar HTML da garagem
    createGarageHTML(profile) {
        return `
            <div id="${this.screenId}" class="garage-container">
                <!-- Cabeçalho -->
                <div class="garage-header">
                    <h1>🚗 GARAGEM</h1>
                    <div class="profile-display">
                        <div class="profile-name">${profile.name}</div>
                        <div class="profile-cash">$${profile.cash.toLocaleString()}</div>
                    </div>
                </div>
                
                <!-- Conteúdo -->
                <div class="garage-content">
                    <!-- Veículos -->
                    <div class="vehicles-section">
                        <h2>MEUS VEÍCULOS</h2>
                        <div id="vehicle-list" class="vehicles-list">
                            <!-- Lista de veículos será inserida aqui -->
                        </div>
                    </div>
                    
                    <!-- Estatísticas -->
                    <div class="stats-section">
                        <h2>ESTATÍSTICAS</h2>
                        <div class="stats-container">
                            ${this.createStatsHTML(profile)}
                        </div>
                    </div>
                </div>
                
                <!-- Botões -->
                <div class="garage-footer">
                    <button id="back-button" class="btn btn-back">
                        VOLTAR AO MENU
                    </button>
                    <button id="customize-button" class="btn btn-customize">
                        PERSONALIZAR
                    </button>
                    <button id="sell-button" class="btn btn-sell">
                        VENDER VEÍCULO
                    </button>
                </div>
            </div>
        `;
    }

    // Criar HTML das estatísticas
    createStatsHTML(profile) {
        const totalVehicles = profile.vehicles ? profile.vehicles.length : 0;
        const totalValue = profile.vehicles ? 
            profile.vehicles.reduce((sum, v) => sum + (v.value || 0), 0) : 0;
        const wins = profile.stats ? profile.stats.wins || 0 : 0;
        const races = profile.stats ? profile.stats.races || 0 : 0;
        
        return `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-label">Veículos</div>
                    <div class="stat-value">${totalVehicles}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Valor Total</div>
                    <div class="stat-value money">$${totalValue.toLocaleString()}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Vitórias</div>
                    <div class="stat-value">${wins}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Corridas</div>
                    <div class="stat-value">${races}</div>
                </div>
            </div>
        `;
    }

    // Configurar eventos
    setupEvents() {
        this.setupButton('back-button', () => this.goBackToMenu());
        this.setupButton('customize-button', () => this.customizeVehicle());
        this.setupButton('sell-button', () => this.sellVehicle());
    }

    // Método auxiliar para configurar botões
    setupButton(buttonId, action) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', action);
        }
    }

    // Voltar ao menu
    goBackToMenu() {
        console.log('🔙 Voltando ao menu...');
        
        if (window.mainMenuScreen && window.mainMenuScreen.initialize) {
            window.mainMenuScreen.initialize();
        } else {
            console.error('❌ MainMenuScreen não disponível');
        }
    }

    // Atualizar lista de veículos
    updateVehicleList(profile) {
        const container = document.getElementById('vehicle-list');
        if (!container) return;
        
        if (!profile.vehicles || profile.vehicles.length === 0) {
            container.innerHTML = this.createEmptyGarageHTML();
            return;
        }
        
        container.innerHTML = this.createVehicleCardsHTML(profile.vehicles);
    }

    // HTML para garagem vazia
    createEmptyGarageHTML() {
        return `
            <div class="empty-garage">
                <div class="empty-icon">🚗</div>
                <h3>Garagem Vazia</h3>
                <p>Visite a loja para comprar seu primeiro veículo!</p>
            </div>
        `;
    }

    // Criar cards de veículos
    createVehicleCardsHTML(vehicles) {
        let html = '<div class="vehicles-grid">';
        
        vehicles.forEach((vehicle, index) => {
            html += `
                <div class="vehicle-card" data-index="${index}" onclick="garageScreen.selectVehicle(${index})">
                    <div class="vehicle-header">
                        <div class="vehicle-name">${vehicle.name || 'Veículo'}</div>
                        <div class="vehicle-value">$${vehicle.value ? vehicle.value.toLocaleString() : 0}</div>
                    </div>
                    <div class="vehicle-stats">
                        <span title="Velocidade">⚡ ${vehicle.speed || 0}</span>
                        <span title="Aceleração">🚀 ${vehicle.acceleration || 0}</span>
                        <span title="Controle">🎮 ${vehicle.handling || 0}</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    // Selecionar veículo
    selectVehicle(index) {
        this.selectedVehicleIndex = index;
        
        // Remover seleção anterior
        document.querySelectorAll('.vehicle-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Adicionar seleção atual
        const selectedCard = document.querySelector(`.vehicle-card[data-index="${index}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        console.log(`🚗 Veículo ${index} selecionado`);
    }

    // Personalizar veículo
    customizeVehicle() {
        if (this.selectedVehicleIndex === null) {
            alert('Selecione um veículo primeiro!');
            return;
        }
        
        const profile = this.getCurrentProfile();
        const vehicle = profile.vehicles[this.selectedVehicleIndex];
        
        alert(`Personalizando: ${vehicle.name}\n\nFuncionalidade em desenvolvimento.`);
    }

    // Vender veículo
    sellVehicle() {
        if (this.selectedVehicleIndex === null) {
            alert('Selecione um veículo para vender!');
            return;
        }
        
        const profile = this.getCurrentProfile();
        const vehicle = profile.vehicles[this.selectedVehicleIndex];
        const saleValue = Math.floor(vehicle.value * 0.7);
        
        if (confirm(`Vender ${vehicle.name} por $${saleValue}?`)) {
            // Atualizar perfil
            profile.vehicles.splice(this.selectedVehicleIndex, 1);
            profile.cash += saleValue;
            
            // Salvar perfil
            if (window.ProfileManager && window.ProfileManager.saveProfile) {
                window.ProfileManager.saveProfile(profile);
            } else {
                window.currentProfile = profile;
            }
            
            // Recarregar garagem
            this.initialize();
            
            alert(`✅ Veículo vendido por $${saleValue}!`);
        }
    }
}

// Adicionar estilos
(function addGarageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .garage-container {
            padding: 20px;
            min-height: 100vh;
            background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
            color: white;
            font-family: 'Rajdhani', sans-serif;
        }
        
        .garage-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: rgba(30, 144, 255, 0.1);
            border-radius: 10px;
            margin-bottom: 30px;
            border: 2px solid #1e90ff;
        }
        
        .garage-header h1 {
            color: #1e90ff;
            font-size: 3rem;
            margin: 0;
        }
        
        .profile-display {
            text-align: right;
        }
        
        .profile-name {
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .profile-cash {
            color: #4cd137;
            font-size: 2rem;
            font-weight: bold;
        }
        
        .garage-content {
            display: flex;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .vehicles-section, .stats-section {
            flex: 1;
        }
        
        .vehicles-section {
            flex: 2;
        }
        
        h2 {
            color: white;
            font-size: 1.8rem;
            margin-bottom: 20px;
        }
        
        .vehicles-list, .stats-container {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 20px;
            min-height: 300px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .stat-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 5px;
        }
        
        .stat-label {
            color: #aaa;
            font-size: 0.9rem;
        }
        
        .stat-value {
            color: white;
            font-size: 1.8rem;
            font-weight: bold;
        }
        
        .stat-value.money {
            color: #4cd137;
            font-size: 1.5rem;
        }
        
        .garage-footer {
            display: flex;
            justify-content: center;
            gap: 20px;
            padding-top: 30px;
            border-top: 2px solid #333;
        }
        
        .btn {
            padding: 15px 40px;
            color: white;
            border: none;
            border-radius: 8px;
            font-family: 'Rajdhani', sans-serif;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .btn-back {
            background: #ff4757;
        }
        
        .btn-customize {
            background: #1e90ff;
        }
        
        .btn-sell {
            background: #e84118;
        }
        
        .empty-garage {
            text-align: center;
            padding: 60px 20px;
            color: #aaa;
        }
        
        .empty-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        .vehicles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .vehicle-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s;
        }
        
        .vehicle-card:hover {
            border-color: #1e90ff;
            background: rgba(30, 144, 255, 0.1);
        }
        
        .vehicle-card.selected {
            background: rgba(30, 144, 255, 0.2);
            border-color: #1e90ff;
        }
        
        .vehicle-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .vehicle-name {
            font-size: 1.2rem;
            font-weight: bold;
            color: white;
        }
        
        .vehicle-value {
            color: #4cd137;
            font-weight: bold;
        }
        
        .vehicle-stats {
            display: flex;
            justify-content: space-between;
            color: #aaa;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .garage-content {
                flex-direction: column;
            }
            
            .garage-footer {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
})();

// Exportar
if (typeof window !== 'undefined') {
    window.GarageScreen = GarageScreen;
    window.garageScreen = new GarageScreen();
    console.log('✅ GarageScreen carregada');
}