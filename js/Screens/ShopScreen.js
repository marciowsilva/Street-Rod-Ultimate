// ShopScreen.js - VERSÃO CORRIGIDA
// ==================== SHOPSCREEN COM NAVEGAÇÃO CORRETA ====================

class ShopScreen {
    constructor(eventSystem) {
        this.eventSystem = eventSystem;
        this.screenId = 'shop-screen';
        this.isActive = false;
        this.elements = {};
        this.carsForSale = [];
        
        console.log('🏪 ShopScreen inicializado');
        
        // Inicializar carros à venda
        this.initCarsForSale();
    }
    
    show() {
        console.log('🏪 Mostrando ShopScreen');
        this.isActive = true;
        this.render();
        this.attachEvents();
        return this;
    }
    
    hide() {
        console.log('👋 Escondendo ShopScreen');
        this.isActive = false;
        
        // Remover container
        if (this.elements.container) {
            this.elements.container.remove();
            this.elements.container = null;
        }
    }
    
    render() {
        // Obter perfil atual
        const profile = window.profileManager ? window.profileManager.getCurrentProfile() : null;
        if (!profile) {
            console.error('❌ Nenhum perfil carregado para mostrar loja');
            return '<div>Erro: Nenhum perfil carregado</div>';
        }
        
        return `
            <!-- Container Principal -->
            <div style="
                min-height: 100vh;
                background: linear-gradient(135deg, #0c2461 0%, #1a1a2e 100%);
                color: white;
                font-family: 'Rajdhani', sans-serif;
                display: flex;
                flex-direction: column;
            ">
                
                <!-- Header -->
                <div style="
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    border-bottom: 2px solid #2ed573;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                ">
                    <div>
                        <h1 style="margin: 0; color: #2ed573; font-size: 24px; display: flex; align-items: center; gap: 10px;">
                            🏪 LOJA DE CARROS
                        </h1>
                        <div style="display: flex; gap: 20px; margin-top: 5px; font-size: 14px;">
                            <span>👤 ${profile.name}</span>
                            <span>💰 <span id="shop-money" style="color: #2ed573; font-weight: bold;">${profile.money.toLocaleString()}</span></span>
                            <span>🏎️ ${profile.cars ? profile.cars.length : 0} carros</span>
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
                        
                        <button id="go-to-garage-btn" style="
                            background: linear-gradient(145deg, #1e90ff, #3742fa);
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
                            🚗 IR PARA GARAGEM
                        </button>
                    </div>
                </div>
                
                <!-- Filtros -->
                <div style="
                    padding: 15px 20px;
                    background: rgba(0, 0, 0, 0.5);
                    border-bottom: 1px solid #333;
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    backdrop-filter: blur(5px);
                ">
                    <span style="color: #1e90ff; font-weight: bold;">FILTRAR:</span>
                    
                    <button class="filter-btn active" data-filter="all" style="
                        background: #ff4757;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 20px;
                        font-family: 'Rajdhani', sans-serif;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 14px;
                    ">
                        TODOS
                    </button>
                    
                    <button class="filter-btn" data-filter="street" style="
                        background: #444;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 20px;
                        font-family: 'Rajdhani', sans-serif;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 14px;
                    ">
                        STREET
                    </button>
                    
                    <button class="filter-btn" data-filter="drag" style="
                        background: #444;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 20px;
                        font-family: 'Rajdhani', sans-serif;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 14px;
                    ">
                        DRAG
                    </button>
                    
                    <button class="filter-btn" data-filter="circuit" style="
                        background: #444;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 20px;
                        font-family: 'Rajdhani', sans-serif;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 14px;
                    ">
                        CIRCUIT
                    </button>
                    
                    <div style="margin-left: auto; display: flex; gap: 10px; align-items: center;">
                        <span style="color: #aaa; font-size: 14px;">ORDENAR:</span>
                        <select id="sort-by" style="
                            background: #333;
                            color: white;
                            border: none;
                            padding: 8px 15px;
                            border-radius: 5px;
                            font-family: 'Rajdhani', sans-serif;
                            cursor: pointer;
                        ">
                            <option value="price-asc">Preço: Menor → Maior</option>
                            <option value="price-desc">Preço: Maior → Menor</option>
                            <option value="speed">Velocidade</option>
                            <option value="name">Nome</option>
                        </select>
                    </div>
                </div>
                
                <!-- Lista de Carros -->
                <div id="shop-items-container" style="
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 20px;
                    align-content: start;
                ">
                    <!-- Carros serão renderizados aqui -->
                    <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #666;">
                        Carregando carros disponíveis...
                    </div>
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
                    🏪 Street Rod II - Loja Oficial • Use setas para navegar • Pressione ESC para voltar
                </div>
            </div>
        `;
    }

    attachEvents() {
        console.log('🔗 Anexando eventos da ShopScreen');
        
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
        
        // Botão Ir para Garagem
        const garageBtn = document.getElementById('go-to-garage-btn');
        if (garageBtn && this.eventSystem) {
            garageBtn.onclick = () => {
                console.log('🏠 Indo para Garagem');
                if (this.eventSystem.showScreen) {
                    this.eventSystem.showScreen('garage');
                }
            };
        }
        
        // Carregar carros após um breve delay
        setTimeout(() => {
            this.loadShopItems();
            this.setupFiltersAndSort();
        }, 100);
        
        // Tecla ESC para voltar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive && this.eventSystem) {
                this.eventSystem.showScreen('main-menu');
            }
        });
    }
    
    initCarsForSale() {
        this.carsForSale = [
            {
                id: 'car_basic',
                name: 'Street Rod Basic',
                type: 'street',
                description: 'Carro inicial perfeito para começar suas corridas.',
                price: 0,
                stats: {
                    speed: 180,
                    acceleration: 50,
                    handling: 50,
                    nitro: 50,
                    durability: 50
                },
                color: '#ff4757',
                available: true
            },
            {
                id: 'car_speedster',
                name: 'Speedster GT',
                type: 'street',
                description: 'Velocidade pura. Perfeito para retas longas.',
                price: 10000,
                stats: {
                    speed: 220,
                    acceleration: 70,
                    handling: 40,
                    nitro: 60,
                    durability: 45
                },
                color: '#1e90ff',
                available: true
            },
            {
                id: 'car_drifter',
                name: 'Drift Master',
                type: 'street',
                description: 'Controle total nas curvas. Feito para derrapagens.',
                price: 15000,
                stats: {
                    speed: 190,
                    acceleration: 60,
                    handling: 80,
                    nitro: 50,
                    durability: 55
                },
                color: '#2ed573',
                available: true
            },
            {
                id: 'car_nitro',
                name: 'Nitro Blaze',
                type: 'drag',
                description: 'Aceleração explosiva. Domine as arrancadas.',
                price: 20000,
                stats: {
                    speed: 210,
                    acceleration: 90,
                    handling: 30,
                    nitro: 80,
                    durability: 40
                },
                color: '#a55eea',
                available: true
            },
            {
                id: 'car_tank',
                name: 'Urban Tank',
                type: 'circuit',
                description: 'Resistente e durável. Feito para colisões.',
                price: 25000,
                stats: {
                    speed: 170,
                    acceleration: 40,
                    handling: 60,
                    nitro: 40,
                    durability: 90
                },
                color: '#ffa502',
                available: true
            },
            {
                id: 'car_legend',
                name: 'Street Legend',
                type: 'circuit',
                description: 'O carro definitivo. Equilíbrio perfeito em todas as áreas.',
                price: 50000,
                stats: {
                    speed: 240,
                    acceleration: 80,
                    handling: 75,
                    nitro: 70,
                    durability: 70
                },
                color: '#ffd700',
                available: true
            }
        ];
    }
    
    loadShopItems() {
        const container = document.getElementById('shop-items-container');
        if (!container) return;
        
        // Obter perfil atual
        const profile = window.profileManager ? window.profileManager.getCurrentProfile() : null;
        if (!profile) {
            container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #ff4757;">Erro: Nenhum perfil carregado</div>';
            return;
        }
        
        // Verificar carros já possuídos
        const ownedCarIds = profile.cars ? profile.cars.map(car => car.id) : [];
        
        // Limpar container
        container.innerHTML = '';
        
        // Renderizar cada carro
        this.carsForSale.forEach(car => {
            const owned = ownedCarIds.includes(car.id);
            const carElement = this.createShopItem(car, owned);
            container.appendChild(carElement);
        });
        
        // Se não houver carros (improvável)
        if (this.carsForSale.length === 0) {
            container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #666;">Nenhum carro disponível no momento</div>';
        }
    }
    
    createShopItem(car, owned) {
        const item = document.createElement('div');
        item.className = `shop-item shop-item-${car.type}`;
        item.dataset.carId = car.id;
        
        item.style.cssText = `
            background: rgba(0, 0, 0, 0.6);
            border-radius: 10px;
            overflow: hidden;
            backdrop-filter: blur(5px);
            border: 2px solid ${car.color};
            transition: all 0.3s ease;
            position: relative;
        `;
        
        // Badge de proprietário
        const ownedBadge = owned ? `
            <div style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: #2ed573;
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                z-index: 2;
            ">
                🏆 PROPRIETÁRIO
            </div>
        ` : '';
        
        item.innerHTML = `
            ${ownedBadge}
            
            <!-- Imagem do carro -->
            <div class="car-image" style="
                height: 150px;
                background: linear-gradient(145deg, ${car.color}20, ${car.color}40);
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    width: 200px;
                    height: 80px;
                    background: ${car.color}30;
                    border-radius: 10px 30px 30px 10px;
                    position: relative;
                ">
                    <!-- Detalhes do carro -->
                    <div style="
                        position: absolute;
                        top: 20px;
                        left: 30px;
                        width: 60px;
                        height: 25px;
                        background: ${car.color}60;
                        border-radius: 5px;
                    "></div>
                    <div style="
                        position: absolute;
                        bottom: 15px;
                        left: 20px;
                        width: 25px;
                        height: 25px;
                        background: #111;
                        border-radius: 50%;
                    "></div>
                    <div style="
                        position: absolute;
                        bottom: 15px;
                        right: 20px;
                        width: 25px;
                        height: 25px;
                        background: #111;
                        border-radius: 50%;
                    "></div>
                </div>
            </div>
            
            <!-- Informações do carro -->
            <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <h3 style="margin: 0; color: ${car.color}; font-size: 20px;">${car.name}</h3>
                    <div style="
                        background: ${owned ? '#2ed573' : '#ff4757'};
                        color: white;
                        padding: 5px 15px;
                        border-radius: 20px;
                        font-weight: bold;
                        font-size: 14px;
                    ">
                        ${owned ? 'ADQUIRIDO' : `$${car.price.toLocaleString()}`}
                    </div>
                </div>
                
                <p style="color: #aaa; font-size: 14px; margin-bottom: 20px; line-height: 1.4;">
                    ${car.description}
                </p>
                
                <!-- Estatísticas -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                    margin-bottom: 20px;
                ">
                    <div>
                        <div style="color: #ff4757; font-size: 12px; margin-bottom: 5px;">⚡ VELOCIDADE</div>
                        <div style="
                            width: 100%;
                            height: 6px;
                            background: rgba(255, 71, 87, 0.2);
                            border-radius: 3px;
                            overflow: hidden;
                        ">
                            <div style="
                                width: ${car.stats.speed / 2.4}%;
                                height: 100%;
                                background: #ff4757;
                            "></div>
                        </div>
                    </div>
                    
                    <div>
                        <div style="color: #2ed573; font-size: 12px; margin-bottom: 5px;">🚀 ACELERAÇÃO</div>
                        <div style="
                            width: 100%;
                            height: 6px;
                            background: rgba(46, 213, 115, 0.2);
                            border-radius: 3px;
                            overflow: hidden;
                        ">
                            <div style="
                                width: ${car.stats.acceleration}%;
                                height: 100%;
                                background: #2ed573;
                            "></div>
                        </div>
                    </div>
                    
                    <div>
                        <div style="color: #1e90ff; font-size: 12px; margin-bottom: 5px;">🎮 MANUSEIO</div>
                        <div style="
                            width: 100%;
                            height: 6px;
                            background: rgba(30, 144, 255, 0.2);
                            border-radius: 3px;
                            overflow: hidden;
                        ">
                            <div style="
                                width: ${car.stats.handling}%;
                                height: 100%;
                                background: #1e90ff;
                            "></div>
                        </div>
                    </div>
                    
                    <div>
                        <div style="color: #a55eea; font-size: 12px; margin-bottom: 5px;">💨 NITRO</div>
                        <div style="
                            width: 100%;
                            height: 6px;
                            background: rgba(165, 94, 234, 0.2);
                            border-radius: 3px;
                            overflow: hidden;
                        ">
                            <div style="
                                width: ${car.stats.nitro}%;
                                height: 100%;
                                background: #a55eea;
                            "></div>
                        </div>
                    </div>
                </div>
                
                <!-- Botão de ação -->
                <button class="car-action-btn" data-car-id="${car.id}" style="
                    width: 100%;
                    background: ${owned ? '#747d8c' : '#2ed573'};
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 8px;
                    font-family: 'Rajdhani', sans-serif;
                    font-weight: bold;
                    cursor: ${owned ? 'default' : 'pointer'};
                    opacity: ${owned ? '0.6' : '1'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 16px;
                    transition: all 0.2s ease;
                ">
                    ${owned ? '🏆 JÁ ADQUIRIDO' : '💰 COMPRAR CARRO'}
                </button>
            </div>
        `;
        
        // Evento do botão de compra
        if (!owned) {
            const buyBtn = item.querySelector('.car-action-btn');
            buyBtn.addEventListener('click', () => {
                this.showPurchaseModal(car);
            });
            
            // Efeitos hover
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px)';
                item.style.boxShadow = `0 10px 30px ${car.color}40`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
                item.style.boxShadow = 'none';
            });
        }
        
        return item;
    }
    
    setupFiltersAndSort() {
        // Filtros
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                
                // Atualizar botões ativos
                filterBtns.forEach(b => {
                    if (b.dataset.filter === filter) {
                        b.classList.add('active');
                        b.style.background = '#ff4757';
                    } else {
                        b.classList.remove('active');
                        b.style.background = '#444';
                    }
                });
                
                // Aplicar filtro
                this.applyFilter(filter);
            });
        });
        
        // Ordenação
        const sortSelect = document.getElementById('sort-by');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.sortItems(sortSelect.value);
            });
        }
    }
    
    applyFilter(filter) {
        const items = document.querySelectorAll('.shop-item');
        
        items.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'block';
            } else {
                const carType = item.classList.contains(`shop-item-${filter}`);
                item.style.display = carType ? 'block' : 'none';
            }
        });
    }
    
    sortItems(sortBy) {
        const container = document.getElementById('shop-items-container');
        if (!container) return;
        
        const items = Array.from(container.querySelectorAll('.shop-item'));
        
        items.sort((a, b) => {
            const carA = this.carsForSale.find(car => car.id === a.dataset.carId);
            const carB = this.carsForSale.find(car => car.id === b.dataset.carId);
            
            if (!carA || !carB) return 0;
            
            switch(sortBy) {
                case 'price-asc':
                    return carA.price - carB.price;
                case 'price-desc':
                    return carB.price - carA.price;
                case 'speed':
                    return carB.stats.speed - carA.stats.speed;
                case 'name':
                    return carA.name.localeCompare(carB.name);
                default:
                    return 0;
            }
        });
        
        // Reordenar no DOM
        items.forEach(item => {
            container.appendChild(item);
        });
    }
    
    showPurchaseModal(car) {
        // Verificar perfil
        const profile = window.profileManager ? window.profileManager.getCurrentProfile() : null;
        if (!profile) {
            window.GameNotifications.error('❌ Nenhum perfil carregado');
            return;
        }
        
        // Verificar se já possui
        const owned = profile.cars ? profile.cars.some(c => c.id === car.id) : false;
        if (owned) {
            window.GameNotifications.error('❌ Você já possui este carro!');
            return;
        }
        
        // Verificar dinheiro
        if (profile.money < car.price) {
            window.GameNotifications.error(`❌ Dinheiro insuficiente! Necessário: $${car.price.toLocaleString()}`);
            return;
        }
        
        // Criar modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(10px);
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                padding: 40px;
                border-radius: 20px;
                border: 5px solid #2ed573;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
            ">
                <h1 style="color: #2ed573; margin-bottom: 20px; font-size: 36px;">💰 CONFIRMAR COMPRA</h1>
                
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 30px;
                ">
                    <div style="font-size: 24px; color: ${car.color}; font-weight: bold; margin-bottom: 15px;">
                        ${car.name}
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
                        <div style="
                            width: 100px;
                            height: 50px;
                            background: ${car.color};
                            border-radius: 5px 15px 15px 5px;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: 10px;
                                left: 15px;
                                width: 40px;
                                height: 20px;
                                background: rgba(173, 216, 230, 0.3);
                                border-radius: 3px;
                            "></div>
                        </div>
                        
                        <div style="font-size: 32px; color: #2ed573; font-weight: bold;">
                            $${car.price.toLocaleString()}
                        </div>
                    </div>
                    
                    <div style="color: #aaa; font-size: 16px; margin-bottom: 20px;">
                        ${car.description}
                    </div>
                    
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 10px;
                        margin-top: 20px;
                    ">
                        <div style="text-align: left;">
                            <div style="color: #ff4757; font-size: 12px;">⚡ Velocidade</div>
                            <div style="color: white; font-weight: bold;">${car.stats.speed}/240</div>
                        </div>
                        <div style="text-align: left;">
                            <div style="color: #2ed573; font-size: 12px;">🚀 Aceleração</div>
                            <div style="color: white; font-weight: bold;">${car.stats.acceleration}/100</div>
                        </div>
                        <div style="text-align: left;">
                            <div style="color: #1e90ff; font-size: 12px;">🎮 Manuseio</div>
                            <div style="color: white; font-weight: bold;">${car.stats.handling}/100</div>
                        </div>
                        <div style="text-align: left;">
                            <div style="color: #a55eea; font-size: 12px;">💨 Nitro</div>
                            <div style="color: white; font-weight: bold;">${car.stats.nitro}/100</div>
                        </div>
                    </div>
                </div>
                
                <div style="
                    background: rgba(255, 71, 87, 0.1);
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div>
                        <div style="color: #aaa; font-size: 14px;">SEU SALDO</div>
                        <div style="color: #2ed573; font-size: 24px; font-weight: bold;">
                            $${profile.money.toLocaleString()}
                        </div>
                    </div>
                    
                    <div style="font-size: 24px;">➡️</div>
                    
                    <div>
                        <div style="color: #aaa; font-size: 14px;">SALDO FINAL</div>
                        <div style="color: ${profile.money - car.price >= 0 ? '#2ed573' : '#ff4757'}; font-size: 24px; font-weight: bold;">
                            $${(profile.money - car.price).toLocaleString()}
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <button id="confirm-purchase-btn" style="
                        background: #2ed573;
                        color: white;
                        border: none;
                        padding: 18px;
                        border-radius: 10px;
                        font-family: 'Rajdhani', sans-serif;
                        font-size: 18px;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                        ✅ CONFIRMAR COMPRA
                    </button>
                    
                    <button id="cancel-purchase-btn" style="
                        background: #ff4757;
                        color: white;
                        border: none;
                        padding: 18px;
                        border-radius: 10px;
                        font-family: 'Rajdhani', sans-serif;
                        font-size: 18px;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                        ❌ CANCELAR
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners do modal
        document.getElementById('confirm-purchase-btn').addEventListener('click', () => {
            this.purchaseCar(car);
            modal.remove();
        });
        
        document.getElementById('cancel-purchase-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        // Fechar modal com ESC
        const closeModal = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeModal);
            }
        };
        document.addEventListener('keydown', closeModal);
    }
    
    purchaseCar(car) {
        const profile = window.profileManager ? window.profileManager.getCurrentProfile() : null;
        if (!profile || !window.profileManager) {
            window.GameNotifications.error('❌ Erro ao comprar carro');
            return;
        }
        
        // Verificar novamente
        if (profile.money < car.price) {
            window.GameNotifications.error(`❌ Dinheiro insuficiente!`);
            return;
        }
        
        // Verificar se já possui
        const alreadyOwned = profile.cars ? profile.cars.some(c => c.id === car.id) : false;
        if (alreadyOwned) {
            window.GameNotifications.error('❌ Você já possui este carro!');
            return;
        }
        
        // Criar objeto do carro
        const purchasedCar = {
            id: car.id,
            name: car.name,
            type: car.type,
            color: car.color,
            price: car.price,
            stats: { ...car.stats },
            purchased: true,
            equipped: false,
            upgrades: {
                engine: 0,
                tires: 0,
                brakes: 0,
                nitro: 0,
                body: 0
            }
        };
        
        // Adicionar carro ao perfil
        if (!profile.cars) profile.cars = [];
        profile.cars.push(purchasedCar);
        
        // Deduzir dinheiro
        profile.money -= car.price;
        
        // Atualizar perfil
        window.profileManager.updateProfile(profile.name, {
            cars: profile.cars,
            money: profile.money
        });
        
        // Atualizar display de dinheiro
        const moneyDisplay = document.getElementById('shop-money');
        if (moneyDisplay) {
            moneyDisplay.textContent = profile.money.toLocaleString();
        }
        
        // Notificação
        window.GameNotifications.success(`✅ ${car.name} comprado com sucesso!`);
        
        // Recarregar itens da loja
        setTimeout(() => {
            this.loadShopItems();
        }, 500);
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.ShopScreen = ShopScreen;
    console.log('✅ ShopScreen exportado');
}