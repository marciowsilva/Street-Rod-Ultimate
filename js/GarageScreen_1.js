// GarageScreen.js - TELA BÁSICA DA GARAGEM
class GarageScreen {
    constructor(eventSystem) {
        console.log('🏠 Criando GarageScreen');
        this.eventSystem = eventSystem;
    }

    show() {
        console.log('🖥️ Mostrando GarageScreen');
        return this;
    }

    hide() {
        console.log('👋 Escondendo GarageScreen');
    }

    render() {
        // Obter perfil atual
        const profile = window.profileManager ? window.profileManager.getCurrentProfile() : null;
        const cars = profile ? profile.cars || [] : [];
        
        return `
            <!-- Container Principal -->
            <div style="
                min-height: 100vh;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                padding: 20px;
                display: flex;
                flex-direction: column;
            ">
                
                <!-- Header -->
                <div style="
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    border-bottom: 2px solid #1e90ff;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                ">
                    <div>
                        <h1 style="margin: 0; color: #1e90ff; font-size: 24px; display: flex; align-items: center; gap: 10px;">
                            🏠 MINHA GARAGEM
                        </h1>
                        <div style="display: flex; gap: 20px; margin-top: 5px; font-size: 14px;">
                            <span>👤 ${profile ? profile.name : 'Jogador'}</span>
                            <span>💰 ${profile ? profile.money.toLocaleString() : '0'}</span>
                            <span>🏎️ ${cars.length} carro(s)</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button id="back-to-menu-btn" style="
                            background: #747d8c;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            font-family: 'Rajdhani', sans-serif;
                            font-weight: bold;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        ">
                            ← VOLTAR AO MENU
                        </button>
                        
                        <button id="go-to-shop-btn" style="
                            background: linear-gradient(145deg, #2ed573, #1dd1a1);
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            font-family: 'Rajdhani', sans-serif;
                            font-weight: bold;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        ">
                            🏪 IR PARA LOJA
                        </button>
                    </div>
                </div>
                
                <!-- Lista de Carros -->
                <div style="
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                ">
                    ${cars.length === 0 ? `
                        <div style="
                            text-align: center;
                            padding: 60px 20px;
                            background: rgba(255, 255, 255, 0.05);
                            border-radius: 15px;
                            border: 2px dashed #555;
                        ">
                            <div style="font-size: 4rem; margin-bottom: 20px;">🚗</div>
                            <h2 style="color: #aaa; margin-bottom: 15px;">GARAGEM VAZIA</h2>
                            <p style="color: #666; margin-bottom: 25px; max-width: 500px; margin-left: auto; margin-right: auto;">
                                Você ainda não possui nenhum carro.<br>
                                Visite a loja para comprar seu primeiro veículo!
                            </p>
                            <button id="empty-garage-shop-btn" style="
                                background: linear-gradient(145deg, #2ed573, #1dd1a1);
                                color: white;
                                border: none;
                                padding: 12px 25px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-family: 'Rajdhani', sans-serif;
                                font-weight: bold;
                                font-size: 1rem;
                            ">
                                🏪 IR PARA LOJA
                            </button>
                        </div>
                    ` : `
                        <div style="
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                            gap: 20px;
                        ">
                            ${cars.map(car => `
                                <div style="
                                    background: rgba(0, 0, 0, 0.6);
                                    border-radius: 10px;
                                    overflow: hidden;
                                    border: 2px solid ${car.color || '#1e90ff'};
                                ">
                                    <div style="
                                        height: 120px;
                                        background: linear-gradient(145deg, ${car.color || '#1e90ff'}20, ${car.color || '#1e90ff'}40);
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                    ">
                                        <div style="
                                            width: 160px;
                                            height: 60px;
                                            background: ${car.color || '#1e90ff'}40;
                                            border-radius: 8px 25px 25px 8px;
                                            position: relative;
                                        ">
                                            <div style="
                                                position: absolute;
                                                top: 15px;
                                                left: 20px;
                                                width: 50px;
                                                height: 20px;
                                                background: ${car.color || '#1e90ff'}60;
                                                border-radius: 4px;
                                            "></div>
                                        </div>
                                    </div>
                                    
                                    <div style="padding: 20px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                            <h3 style="margin: 0; color: ${car.color || '#1e90ff'}; font-size: 18px;">${car.name}</h3>
                                            <span style="
                                                background: ${car.equipped ? '#2ed573' : '#444'};
                                                color: white;
                                                padding: 4px 12px;
                                                border-radius: 15px;
                                                font-size: 12px;
                                            ">
                                                ${car.equipped ? '🏎️ EQUIPADO' : '🛠️ NA GARAGEM'}
                                            </span>
                                        </div>
                                        
                                        <div style="
                                            display: grid;
                                            grid-template-columns: repeat(2, 1fr);
                                            gap: 10px;
                                            margin-bottom: 15px;
                                        ">
                                            <div>
                                                <div style="color: #ff4757; font-size: 11px;">VELOCIDADE</div>
                                                <div style="color: white; font-size: 14px; font-weight: bold;">${car.stats?.speed || 0}</div>
                                            </div>
                                            <div>
                                                <div style="color: #2ed573; font-size: 11px;">ACELERAÇÃO</div>
                                                <div style="color: white; font-size: 14px; font-weight: bold;">${car.stats?.acceleration || 0}</div>
                                            </div>
                                            <div>
                                                <div style="color: #1e90ff; font-size: 11px;">CONTROLE</div>
                                                <div style="color: white; font-size: 14px; font-weight: bold;">${car.stats?.handling || 0}</div>
                                            </div>
                                            <div>
                                                <div style="color: #a55eea; font-size: 11px;">NITRO</div>
                                                <div style="color: white; font-size: 14px; font-weight: bold;">${car.stats?.nitro || 0}</div>
                                            </div>
                                        </div>
                                        
                                        <div style="display: flex; gap: 10px;">
                                            <button class="equip-car-btn" data-car-id="${car.id}" style="
                                                flex: 1;
                                                background: ${car.equipped ? '#747d8c' : '#1e90ff'};
                                                color: white;
                                                border: none;
                                                padding: 8px;
                                                border-radius: 6px;
                                                cursor: ${car.equipped ? 'default' : 'pointer'};
                                                font-family: 'Rajdhani', sans-serif;
                                                font-weight: bold;
                                                font-size: 12px;
                                            ">
                                                ${car.equipped ? '🏎️ EQUIPADO' : '🎮 EQUIPAR'}
                                            </button>
                                            
                                            <button class="upgrade-car-btn" data-car-id="${car.id}" style="
                                                background: #ffa502;
                                                color: white;
                                                border: none;
                                                padding: 8px 12px;
                                                border-radius: 6px;
                                                cursor: pointer;
                                                font-family: 'Rajdhani', sans-serif;
                                                font-weight: bold;
                                                font-size: 12px;
                                            ">
                                                ⬆️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
                
                <!-- Footer -->
                <div style="
                    padding: 15px;
                    background: rgba(0, 0, 0, 0.8);
                    border-top: 1px solid #444;
                    text-align: center;
                    color: #666;
                    font-size: 0.9rem;
                ">
                    🏠 Gerencie seus carros • Equipe um carro para usá-lo nas corridas
                </div>
            </div>
        `;
    }

    attachEvents() {
        console.log('🔗 Anexando eventos da GarageScreen');
        
        // Botão Voltar ao Menu
        const backBtn = document.getElementById('back-to-menu-btn');
        if (backBtn && this.eventSystem) {
            backBtn.onclick = () => {
                console.log('← Voltando ao Menu Principal');
                if (this.eventSystem.showScreen) {
                    this.eventSystem.showScreen('main-menu');
                }
            };
        }
        
        // Botão Ir para Loja
        const shopBtn = document.getElementById('go-to-shop-btn');
        if (shopBtn && this.eventSystem) {
            shopBtn.onclick = () => {
                console.log('🏪 Indo para Loja');
                if (this.eventSystem.showScreen) {
                    this.eventSystem.showScreen('shop');
                }
            };
        }
        
        // Botão Loja (garagem vazia)
        const emptyShopBtn = document.getElementById('empty-garage-shop-btn');
        if (emptyShopBtn && this.eventSystem) {
            emptyShopBtn.onclick = () => {
                console.log('🏪 Indo para Loja (garagem vazia)');
                if (this.eventSystem.showScreen) {
                    this.eventSystem.showScreen('shop');
                }
            };
        }
        
        // Botões Equipar Carro
        document.querySelectorAll('.equip-car-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carId = e.target.dataset.carId;
                console.log(`🎮 Equipando carro: ${carId}`);
                
                const profile = window.profileManager ? window.profileManager.getCurrentProfile() : null;
                if (!profile) return;
                
                // Desequipar todos os carros primeiro
                profile.cars.forEach(car => {
                    car.equipped = false;
                });
                
                // Equipar o carro selecionado
                const carToEquip = profile.cars.find(car => car.id === carId);
                if (carToEquip) {
                    carToEquip.equipped = true;
                    
                    // Atualizar perfil
                    window.profileManager.updateProfile(profile.name, {
                        cars: profile.cars
                    });
                    
                    // Recarregar tela
                    if (this.eventSystem && this.eventSystem.showScreen) {
                        this.eventSystem.showScreen('garage');
                    }
                    
                    // Notificação
                    if (window.GameNotifications) {
                        window.GameNotifications.success(`🎮 ${carToEquip.name} equipado!`);
                    }
                }
            });
        });
        
        // Botões Upgrade (placeholder)
        document.querySelectorAll('.upgrade-car-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carId = e.target.dataset.carId;
                console.log(`⬆️ Upgrading car: ${carId}`);
                
                if (window.GameNotifications) {
                    window.GameNotifications.info('Sistema de upgrades em desenvolvimento');
                }
            });
        });
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.GarageScreen = GarageScreen;
    console.log('✅ GarageScreen exportado');
}