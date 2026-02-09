// ProfileCreationScreen.js - VERSÃO COMPLETA
console.log('🆕 [ProfileCreationScreen] Carregando versão completa...');

class ProfileCreationScreen {
    constructor() {
        this.screenId = 'profile-creation';
        console.log('✅ [ProfileCreationScreen] Inicializado');
    }
    
    initialize() {
        console.log('🆕 [ProfileCreationScreen] Inicializando tela completa...');
        
        // Garantir que o container está limpo e sem estilos inline problemáticos
        const container = document.getElementById('game-container');
        if (container) {
            container.style.cssText = '';
            container.style.minHeight = '100vh';
            container.style.width = '100%';
        }
        
        this.createScreen();
        this.attachEvents();
        
        // Forçar reflow para garantir que os estilos sejam aplicados corretamente
        if (container) {
            container.offsetHeight; // Trigger reflow
        }
        
        return true;
    }
    
    createScreen() {
        const container = document.getElementById('game-container');
        if (!container) {
            console.error('❌ Container não encontrado');
            return;
        }
        
        // Limpar completamente o container antes de criar nova tela
        container.innerHTML = '';
        // Remover estilos inline que possam interferir e garantir layout desktop
        container.style.cssText = 'min-height: 100vh; width: 100%; position: relative;';
        
        container.innerHTML = `
            <div id="profile-creation-screen" class="screen-container">
                <!-- CABEÇALHO -->
                <div class="screen-header">
                    <div class="header-content">
                        <h1 class="game-title">CRIAR <span class="title-accent">PERFIL</span></h1>
                        <p class="game-subtitle">Comece sua jornada no Street Rod II</p>
                    </div>
                    <div class="header-decoration">
                        <div class="decoration-line"></div>
                        <div class="decoration-icon">🚗</div>
                        <div class="decoration-line"></div>
                    </div>
                </div>
                
                <!-- FORMULÁRIO -->
                <div class="screen-content">
                    <div class="creation-form">
                        <!-- NOME -->
                        <div class="form-section">
                            <div class="section-header">
                                <h2 class="section-title">
                                    <span class="title-icon">👤</span>
                                    INFORMAÇÕES BÁSICAS
                                </h2>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">
                                    <span class="label-icon">📛</span>
                                    NOME DO PERFIL
                                </label>
                                <input type="text" id="profile-name" class="form-input" placeholder="Digite seu nome de jogador" maxlength="20">
                                <div class="form-hint">Mínimo 3 caracteres, máximo 20</div>
                                <div id="name-error" class="form-error"></div>
                            </div>
                        </div>
                        
                        <!-- DIFICULDADE -->
                        <div class="form-section">
                            <div class="section-header">
                                <h2 class="section-title">
                                    <span class="title-icon">⚡</span>
                                    DIFICULDADE
                                </h2>
                            </div>
                            
                            <div class="difficulty-options">
                                <div class="difficulty-card" data-difficulty="easy">
                                    <div class="difficulty-icon">😊</div>
                                    <h3 class="difficulty-title">FÁCIL</h3>
                                    <div class="difficulty-desc">
                                        <p>• Mais dinheiro inicial</p>
                                        <p>• IA menos agressiva</p>
                                        <p>• Recompensas maiores</p>
                                    </div>
                                    <div class="difficulty-bonus">
                                        <span class="bonus-icon">💰</span>
                                        Bônus: $20,000
                                    </div>
                                </div>
                                
                                <div class="difficulty-card active" data-difficulty="normal">
                                    <div class="difficulty-icon">😐</div>
                                    <h3 class="difficulty-title">NORMAL</h3>
                                    <div class="difficulty-desc">
                                        <p>• Experiência balanceada</p>
                                        <p>• IA padrão</p>
                                        <p>• Recompensas normais</p>
                                    </div>
                                    <div class="difficulty-bonus">
                                        <span class="bonus-icon">💰</span>
                                        Bônus: $15,000
                                    </div>
                                    <div class="difficulty-badge">RECOMENDADO</div>
                                </div>
                                
                                <div class="difficulty-card" data-difficulty="hard">
                                    <div class="difficulty-icon">😠</div>
                                    <h3 class="difficulty-title">DIFÍCIL</h3>
                                    <div class="difficulty-desc">
                                        <p>• Menos dinheiro inicial</p>
                                        <p>• IA mais agressiva</p>
                                        <p>• Maior desafio</p>
                                    </div>
                                    <div class="difficulty-bonus">
                                        <span class="bonus-icon">🏆</span>
                                        Bônus: +50% XP
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- CARRO INICIAL -->
                        <div class="form-section">
                            <div class="section-header">
                                <h2 class="section-title">
                                    <span class="title-icon">🚗</span>
                                    CARRO INICIAL
                                </h2>
                            </div>
                            
                            <div class="car-options">
                                <div class="car-card" data-car="mustang">
                                    <div class="car-image">🐎</div>
                                    <h3 class="car-title">FORD MUSTANG GT</h3>
                                    <div class="car-stats">
                                        <div class="stat">
                                            <span class="stat-label">VELOCIDADE</span>
                                            <div class="stat-bar">
                                                <div class="stat-fill" style="width: 70%"></div>
                                            </div>
                                            <span class="stat-value">7/10</span>
                                        </div>
                                        <div class="stat">
                                            <span class="stat-label">ACELERAÇÃO</span>
                                            <div class="stat-bar">
                                                <div class="stat-fill" style="width: 80%"></div>
                                            </div>
                                            <span class="stat-value">8/10</span>
                                        </div>
                                        <div class="stat">
                                            <span class="stat-label">CONTROLE</span>
                                            <div class="stat-bar">
                                                <div class="stat-fill" style="width: 60%"></div>
                                            </div>
                                            <span class="stat-value">6/10</span>
                                        </div>
                                    </div>
                                    <div class="car-price">$15,000</div>
                                </div>
                                
                                <div class="car-card active" data-car="camaro">
                                    <div class="car-image">🏁</div>
                                    <h3 class="car-title">CHEVROLET CAMARO SS</h3>
                                    <div class="car-stats">
                                        <div class="stat">
                                            <span class="stat-label">VELOCIDADE</span>
                                            <div class="stat-bar">
                                                <div class="stat-fill" style="width: 80%"></div>
                                            </div>
                                            <span class="stat-value">8/10</span>
                                        </div>
                                        <div class="stat">
                                            <span class="stat-label">ACELERAÇÃO</span>
                                            <div class="stat-bar">
                                                <div class="stat-fill" style="width: 70%"></div>
                                            </div>
                                            <span class="stat-value">7/10</span>
                                        </div>
                                        <div class="stat">
                                            <span class="stat-label">CONTROLE</span>
                                            <div class="stat-bar">
                                                <div class="stat-fill" style="width: 70%"></div>
                                            </div>
                                            <span class="stat-value">7/10</span>
                                        </div>
                                    </div>
                                    <div class="car-price">$18,000</div>
                                    <div class="car-badge">POPULAR</div>
                                </div>
                                
                                <div class="car-card" data-car="skyline">
                                    <div class="car-image">🇯🇵</div>
                                    <h3 class="car-title">NISSAN SKYLINE GT-R</h3>
                                    <div class="car-stats">
                                        <div class="stat">
                                            <span class="stat-label">VELOCIDADE</span>
                                            <div class="stat-bar">
                                                <div class="stat-fill" style="width: 90%"></div>
                                            </div>
                                            <span class="stat-value">9/10</span>
                                        </div>
                                        <div class="stat">
                                            <span class="stat-label">ACELERAÇÃO</span>
                                            <div class="stat-bar">
                                                <div class="stat-fill" style="width: 80%"></div>
                                            </div>
                                            <span class="stat-value">8/10</span>
                                        </div>
                                        <div class="stat">
                                            <span class="stat-label">CONTROLE</span>
                                            <span class="stat-value">8/10</span>
                                            <div class="stat-bar">
                                                <div class="stat-fill" style="width: 80%"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="car-price">$25,000</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- RESUMO -->
                        <div class="summary-section">
                            <h2 class="section-title">
                                <span class="title-icon">📋</span>
                                RESUMO DO PERFIL
                            </h2>
                            
                            <div class="summary-card">
                                <div class="summary-item">
                                    <span class="summary-label">NOME:</span>
                                    <span id="summary-name" class="summary-value">---</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">DIFICULDADE:</span>
                                    <span id="summary-difficulty" class="summary-value">Normal</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">CARRO INICIAL:</span>
                                    <span id="summary-car" class="summary-value">Chevrolet Camaro SS</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">DINHEIRO INICIAL:</span>
                                    <span id="summary-cash" class="summary-value cash">$15,000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- RODAPÉ -->
                <div class="screen-footer">
                    <div class="footer-buttons">
                        <button id="create-btn" class="btn btn-primary btn-large">
                            <span class="btn-icon">🚀</span>
                            CRIAR PERFIL E COMEÇAR
                        </button>
                        
                        <div class="button-group">
                            <button id="cancel-btn" class="btn btn-secondary">
                                <span class="btn-icon">↩</span>
                                CANCELAR
                            </button>
                            <button id="randomize-btn" class="btn btn-secondary">
                                <span class="btn-icon">🎲</span>
                                ALEATÓRIO
                            </button>
                        </div>
                    </div>
                    
                    <div class="footer-info">
                        <p class="hint-text">Dica: Você pode ter múltiplos perfis para experimentar diferentes estilos de jogo!</p>
                    </div>
                </div>
            </div>
        `;
        
        this.addStyles();
        this.updateSummary();
        
        // Forçar reflow e garantir que os estilos sejam aplicados corretamente
        setTimeout(() => {
            const screen = document.getElementById('profile-creation-screen');
            if (screen) {
                // Trigger reflow para garantir que os estilos sejam aplicados
                screen.offsetHeight;
                
                // Verificar se estamos em modo desktop e forçar layout se necessário
                if (window.innerWidth > 768) {
                    const difficultyOptions = screen.querySelector('.difficulty-options');
                    const carOptions = screen.querySelector('.car-options');
                    
                    if (difficultyOptions) {
                        const computedStyle = window.getComputedStyle(difficultyOptions);
                        if (computedStyle.gridTemplateColumns === '1fr') {
                            difficultyOptions.style.gridTemplateColumns = 'repeat(3, 1fr)';
                        }
                    }
                    
                    if (carOptions) {
                        const computedStyle = window.getComputedStyle(carOptions);
                        if (computedStyle.gridTemplateColumns === '1fr') {
                            carOptions.style.gridTemplateColumns = 'repeat(3, 1fr)';
                        }
                    }
                }
            }
        }, 100);
    }
    
    addStyles() {
        // Remover estilos anteriores se existirem para evitar duplicação
        const existingStyle = document.getElementById('profile-creation-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.id = 'profile-creation-styles'; // ID para identificar e remover depois
        style.textContent = `
            /* ESTILOS BÁSICOS (reutilizando do ProfileSelectionScreen) */
            #profile-creation-screen.screen-container {
                min-height: 100vh;
                min-width: 100%;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                color: white;
                display: flex;
                flex-direction: column;
                font-family: 'Rajdhani', sans-serif;
                box-sizing: border-box;
            }
            
            .screen-header {
                padding: 40px 30px 20px;
                text-align: center;
            }
            
            .header-content {
                margin-bottom: 20px;
            }
            
            .game-title {
                font-size: 3.5rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 3px;
                margin-bottom: 5px;
                background: linear-gradient(90deg, #1e90ff, #00bfff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 30px rgba(30, 144, 255, 0.3);
            }
            
            .title-accent {
                color: #1e90ff;
                -webkit-text-fill-color: #1e90ff;
            }
            
            .game-subtitle {
                color: #aaa;
                font-size: 1.2rem;
                letter-spacing: 2px;
            }
            
            .header-decoration {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
            }
            
            .decoration-line {
                height: 2px;
                width: 100px;
                background: linear-gradient(90deg, transparent, #1e90ff, transparent);
            }
            
            .decoration-icon {
                font-size: 1.5rem;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
            }
            
            /* CONTEÚDO */
            .screen-content {
                flex: 1;
                padding: 0 30px 30px;
                max-width: 1200px;
                margin: 0 auto;
                width: 100%;
                box-sizing: border-box;
            }
            
            .creation-form {
                display: flex;
                flex-direction: column;
                gap: 30px;
            }
            
            /* SEÇÕES */
            .form-section {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 30px;
            }
            
            .section-header {
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid rgba(30, 144, 255, 0.3);
            }
            
            .section-title {
                font-size: 1.6rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .title-icon {
                font-size: 1.4rem;
            }
            
            /* FORMULÁRIO */
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-label {
                display: block;
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .label-icon {
                font-size: 1.2rem;
            }
            
            .form-input {
                width: 100%;
                padding: 15px 20px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                color: white;
                font-family: 'Rajdhani', sans-serif;
                font-size: 1.1rem;
                transition: all 0.3s ease;
            }
            
            .form-input:focus {
                outline: none;
                border-color: #1e90ff;
                box-shadow: 0 0 20px rgba(30, 144, 255, 0.2);
            }
            
            .form-hint {
                color: #666;
                font-size: 0.9rem;
                margin-top: 8px;
            }
            
            .form-error {
                color: #ff4757;
                font-size: 0.9rem;
                margin-top: 8px;
                min-height: 20px;
            }
            
            /* OPÇÕES DE DIFICULDADE */
            .difficulty-options {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
            
            @media (max-width: 1024px) {
                .difficulty-options {
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                }
            }
            
            .difficulty-card {
                background: rgba(255, 255, 255, 0.08);
                border-radius: 15px;
                padding: 25px;
                border: 2px solid transparent;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                text-align: center;
            }
            
            .difficulty-card:hover {
                background: rgba(255, 255, 255, 0.12);
                transform: translateY(-5px);
            }
            
            .difficulty-card.active {
                background: rgba(30, 144, 255, 0.15);
                border-color: #1e90ff;
                box-shadow: 0 10px 30px rgba(30, 144, 255, 0.2);
            }
            
            .difficulty-icon {
                font-size: 3rem;
                margin-bottom: 15px;
            }
            
            .difficulty-title {
                font-size: 1.4rem;
                font-weight: 700;
                margin-bottom: 15px;
                color: white;
            }
            
            .difficulty-desc {
                color: #aaa;
                font-size: 0.9rem;
                line-height: 1.5;
                margin-bottom: 20px;
                text-align: left;
            }
            
            .difficulty-desc p {
                margin: 5px 0;
            }
            
            .difficulty-bonus {
                background: rgba(76, 209, 55, 0.2);
                color: #4cd137;
                padding: 10px 15px;
                border-radius: 10px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .bonus-icon {
                font-size: 1.2rem;
            }
            
            .difficulty-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #ff4757;
                color: white;
                padding: 5px 10px;
                border-radius: 10px;
                font-size: 0.7rem;
                font-weight: 700;
                text-transform: uppercase;
            }
            
            /* OPÇÕES DE CARRO */
            .car-options {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
            
            @media (max-width: 1024px) {
                .car-options {
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                }
            }
            
            .car-card {
                background: rgba(255, 255, 255, 0.08);
                border-radius: 15px;
                padding: 20px;
                border: 2px solid transparent;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                text-align: center;
            }
            
            .car-card:hover {
                background: rgba(255, 255, 255, 0.12);
                transform: translateY(-5px);
            }
            
            .car-card.active {
                background: rgba(46, 213, 115, 0.15);
                border-color: #2ed573;
                box-shadow: 0 10px 30px rgba(46, 213, 115, 0.2);
            }
            
            .car-image {
                font-size: 3rem;
                margin-bottom: 15px;
            }
            
            .car-title {
                font-size: 1.3rem;
                font-weight: 700;
                margin-bottom: 20px;
                color: white;
            }
            
            .car-stats {
                margin-bottom: 20px;
            }
            
            .stat {
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .stat-label {
                color: #aaa;
                font-size: 0.8rem;
                min-width: 80px;
                text-align: left;
            }
            
            .stat-bar {
                flex: 1;
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                overflow: hidden;
            }
            
            .stat-fill {
                height: 100%;
                background: linear-gradient(90deg, #2ed573, #4cd137);
                border-radius: 3px;
            }
            
            .stat-value {
                color: white;
                font-weight: 600;
                min-width: 40px;
                text-align: right;
            }
            
            .car-price {
                background: rgba(30, 144, 255, 0.2);
                color: #1e90ff;
                padding: 10px;
                border-radius: 10px;
                font-weight: 700;
                font-size: 1.2rem;
            }
            
            .car-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #ff4757;
                color: white;
                padding: 5px 10px;
                border-radius: 10px;
                font-size: 0.7rem;
                font-weight: 700;
                text-transform: uppercase;
            }
            
            /* RESUMO */
            .summary-section {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 30px;
            }
            
            .summary-card {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 25px;
                margin-top: 20px;
            }
            
            .summary-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .summary-item:last-child {
                border-bottom: none;
            }
            
            .summary-label {
                color: #aaa;
                font-size: 1.1rem;
            }
            
            .summary-value {
                color: white;
                font-weight: 700;
                font-size: 1.2rem;
            }
            
            .summary-value.cash {
                color: #4cd137;
            }
            
            /* RODAPÉ */
            .screen-footer {
                padding: 30px;
                background: rgba(0, 0, 0, 0.3);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .footer-buttons {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .button-group {
                display: flex;
                gap: 15px;
            }
            
            /* BOTÕES */
            .btn {
                padding: 15px 30px;
                border: none;
                border-radius: 10px;
                font-family: 'Rajdhani', sans-serif;
                font-weight: 700;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            }
            
            .btn:active {
                transform: translateY(-1px);
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #2ed573, #26c46a);
                color: white;
                min-width: 300px;
            }
            
            .btn-primary:hover {
                background: linear-gradient(135deg, #26c46a, #20b858);
                box-shadow: 0 10px 20px rgba(46, 213, 115, 0.3);
            }
            
            .btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.3);
            }
            
            .btn-large {
                padding: 18px 40px;
                font-size: 1.2rem;
            }
            
            .btn-icon {
                font-size: 1.2rem;
            }
            
            /* INFORMAÇÕES DO RODAPÉ */
            .footer-info {
                text-align: center;
            }
            
            .hint-text {
                color: #aaa;
                font-size: 0.9rem;
                font-style: italic;
            }
            
            /* RESPONSIVO - Apenas para telas realmente pequenas */
            @media screen and (max-width: 768px) {
                .game-title {
                    font-size: 2.5rem;
                }
                
                .screen-content {
                    padding: 0 15px 20px;
                }
                
                .form-section, .summary-section {
                    padding: 20px;
                }
                
                .difficulty-options,
                .car-options {
                    grid-template-columns: 1fr;
                }
                
                .footer-buttons {
                    flex-direction: column;
                }
                
                .button-group {
                    flex-direction: column;
                    width: 100%;
                }
                
                .btn {
                    width: 100%;
                    justify-content: center;
                }
                
                .btn-primary {
                    min-width: unset;
                }
            }
            
            /* Garantir layout desktop em telas maiores */
            @media screen and (min-width: 769px) {
                .difficulty-options {
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
                }
                
                .car-options {
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
                }
                
                .footer-buttons {
                    flex-direction: row !important;
                }
                
                .button-group {
                    flex-direction: row !important;
                    width: auto !important;
                }
                
                .btn {
                    width: auto !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    attachEvents() {
        // Dificuldade - clique nas cards
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-card').forEach(c => {
                    c.classList.remove('active');
                });
                card.classList.add('active');
                this.updateSummary();
            });
        });
        
        // Carros - clique nas cards
        document.querySelectorAll('.car-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.car-card').forEach(c => {
                    c.classList.remove('active');
                });
                card.classList.add('active');
                this.updateSummary();
            });
        });
        
        // Input do nome
        const nameInput = document.getElementById('profile-name');
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                this.validateName();
                this.updateSummary();
            });
        }
        
        // Botão CRIAR
        const createBtn = document.getElementById('create-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.createProfile();
            });
        }
        
        // Botão CANCELAR
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelCreation();
            });
        }
        
        // Botão ALEATÓRIO
        const randomBtn = document.getElementById('randomize-btn');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                this.randomizeProfile();
            });
        }
    }
    
    validateName() {
        const nameInput = document.getElementById('profile-name');
        const nameError = document.getElementById('name-error');
        
        if (!nameInput || !nameError) return true;
        
        const name = nameInput.value.trim();
        
        // Validação básica
        if (name.length < 3) {
            nameError.textContent = 'Nome muito curto (mínimo 3 caracteres)';
            nameInput.style.borderColor = '#ff4757';
            return false;
        }
        
        if (name.length > 20) {
            nameError.textContent = 'Nome muito longo (máximo 20 caracteres)';
            nameInput.style.borderColor = '#ff4757';
            return false;
        }
        
        // Verificar se já existe
        if (window.profileManager) {
            const profiles = window.profileManager.getAllProfiles();
            const exists = profiles.some(p => p.name.toLowerCase() === name.toLowerCase());
            if (exists) {
                nameError.textContent = 'Já existe um perfil com este nome';
                nameInput.style.borderColor = '#ff4757';
                return false;
            }
        }
        
        // Nome válido
        nameError.textContent = '';
        nameInput.style.borderColor = '#2ed573';
        return true;
    }
    
    updateSummary() {
        // Nome
        const nameInput = document.getElementById('profile-name');
        const name = nameInput ? nameInput.value.trim() : '';
        document.getElementById('summary-name').textContent = name || '---';
        
        // Dificuldade
        const activeDifficulty = document.querySelector('.difficulty-card.active');
        const difficulty = activeDifficulty ? activeDifficulty.dataset.difficulty : 'normal';
        const difficultyNames = {
            'easy': 'Fácil',
            'normal': 'Normal', 
            'hard': 'Difícil'
        };
        document.getElementById('summary-difficulty').textContent = difficultyNames[difficulty] || 'Normal';
        
        // Carro
        const activeCar = document.querySelector('.car-card.active');
        const car = activeCar ? activeCar.dataset.car : 'camaro';
        const carNames = {
            'mustang': 'Ford Mustang GT',
            'camaro': 'Chevrolet Camaro SS',
            'skyline': 'Nissan Skyline GT-R'
        };
        document.getElementById('summary-car').textContent = carNames[car] || 'Chevrolet Camaro SS';
        
        // Dinheiro baseado na dificuldade
        const difficultyCash = {
            'easy': 20000,
            'normal': 15000,
            'hard': 10000
        };
        const cash = difficultyCash[difficulty] || 15000;
        document.getElementById('summary-cash').textContent = `$${cash.toLocaleString()}`;
    }
    
    randomizeProfile() {
        console.log('🎲 Gerando perfil aleatório...');
        
        // Nomes aleatórios
        const randomNames = [
            'Speed Demon', 'Night Rider', 'Road Warrior', 'Velocity', 'Turbo',
            'Dragster', 'Burnout', 'Drift King', 'Gearhead', 'Pitstop',
            'Checkered', 'Finish Line', 'Octane', 'Nitrous', 'Overdrive'
        ];
        
        // Gerar nome aleatório
        const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
        document.getElementById('profile-name').value = randomName;
        
        // Dificuldade aleatória
        const difficulties = document.querySelectorAll('.difficulty-card');
        const randomDiff = difficulties[Math.floor(Math.random() * difficulties.length)];
        document.querySelectorAll('.difficulty-card').forEach(c => c.classList.remove('active'));
        randomDiff.classList.add('active');
        
        // Carro aleatório
        const cars = document.querySelectorAll('.car-card');
        const randomCar = cars[Math.floor(Math.random() * cars.length)];
        document.querySelectorAll('.car-card').forEach(c => c.classList.remove('active'));
        randomCar.classList.add('active');
        
        // Validar e atualizar
        this.validateName();
        this.updateSummary();
        
        // Efeito visual
        const createBtn = document.getElementById('create-btn');
        if (createBtn) {
            createBtn.style.animation = 'none';
            setTimeout(() => {
                createBtn.style.animation = 'pulse 0.5s';
            }, 10);
        }
        
        console.log('✅ Perfil aleatório gerado:', randomName);
    }
    
    createProfile() {
        // Validar nome
        if (!this.validateName()) {
            if (window.eventSystem && window.eventSystem.showNotification) {
                window.eventSystem.showNotification('Corrija o nome do perfil', 'error');
            }
            return;
        }
        
        const nameInput = document.getElementById('profile-name');
        const profileName = nameInput.value.trim();
        
        // Obter dificuldade
        const activeDifficulty = document.querySelector('.difficulty-card.active');
        const difficulty = activeDifficulty ? activeDifficulty.dataset.difficulty : 'normal';
        
        // Obter carro
        const activeCar = document.querySelector('.car-card.active');
        const carType = activeCar ? activeCar.dataset.car : 'camaro';
        
        // Configurações baseadas na dificuldade
        const difficultySettings = {
            'easy': { 
                startingCash: 20000, 
                aiDifficulty: 0.7,
                xpMultiplier: 1.0
            },
            'normal': { 
                startingCash: 15000, 
                aiDifficulty: 1.0,
                xpMultiplier: 1.2
            },
            'hard': { 
                startingCash: 10000, 
                aiDifficulty: 1.3,
                xpMultiplier: 1.5
            }
        };
        
        const settings = difficultySettings[difficulty] || difficultySettings.normal;
        
        // Carros iniciais
        const startingCars = {
            'mustang': { 
                name: 'Ford Mustang GT', 
                value: 15000, 
                speed: 7, 
                acceleration: 8, 
                handling: 6,
                image: '🐎'
            },
            'camaro': { 
                name: 'Chevrolet Camaro SS', 
                value: 18000, 
                speed: 8, 
                acceleration: 7, 
                handling: 7,
                image: '🏁'
            },
            'skyline': { 
                name: 'Nissan Skyline GT-R', 
                value: 25000, 
                speed: 9, 
                acceleration: 8, 
                handling: 8,
                image: '🇯🇵'
            }
        };
        
        const selectedCar = startingCars[carType] || startingCars.camaro;
        
        // Criar objeto do perfil
        const newProfile = {
            name: profileName,
            level: 1,
            cash: settings.startingCash,
            experience: 0,
            difficulty: difficulty,
            created: new Date().toISOString(),
            lastPlayed: new Date().toISOString(),
            vehicles: [selectedCar],
            stats: {
                races: 0,
                wins: 0,
                losses: 0,
                totalEarnings: 0,
                playTime: 0
            },
            settings: {
                aiDifficulty: settings.aiDifficulty,
                xpMultiplier: settings.xpMultiplier,
                musicVolume: 80,
                sfxVolume: 90
            },
            achievements: [],
            unlocked: []
        };
        
        console.log('🆕 Criando perfil completo:', newProfile);
        
        // Salvar usando ProfileManager
        let success = false;
        
        if (window.profileManager && window.profileManager.createProfile) {
            success = window.profileManager.createProfile(profileName, newProfile);
        }
        
        if (success) {
            // Selecionar o perfil
            window.profileManager.selectProfile(profileName);
            window.eventSystem.setCurrentProfile(newProfile);
            
            console.log(`✅ Perfil "${profileName}" criado com sucesso!`);
            
            // Efeito visual
            const createBtn = document.getElementById('create-btn');
            if (createBtn) {
                createBtn.innerHTML = '<span class="btn-icon">✓</span> PERFIL CRIADO!';
                createBtn.style.background = 'linear-gradient(135deg, #2ed573, #26c46a)';
                createBtn.disabled = true;
            }
            
            // Notificação
            if (window.eventSystem && window.eventSystem.showNotification) {
                window.eventSystem.showNotification(`Perfil "${profileName}" criado com sucesso!`, 'success');
            }
            
            // Ir para menu principal após delay
            setTimeout(() => {
                window.eventSystem.showScreen('main-menu');
            }, 1500);
            
        } else {
            // Fallback se ProfileManager não estiver disponível
            console.warn('⚠️ ProfileManager não disponível, usando fallback');
            
            try {
                // Salvar no localStorage diretamente
                const profiles = JSON.parse(localStorage.getItem('streetrod2_profiles') || '[]');
                profiles.push(newProfile);
                localStorage.setItem('streetrod2_profiles', JSON.stringify(profiles));
                localStorage.setItem('streetrod2_current_profile', profileName);
                
                window.currentProfile = newProfile;
                window.eventSystem.setCurrentProfile(newProfile);
                
                console.log(`✅ Perfil "${profileName}" criado via fallback`);
                
                // Ir para menu principal
                setTimeout(() => {
                    window.eventSystem.showScreen('main-menu');
                }, 1000);
                
            } catch (error) {
                console.error('❌ Erro ao criar perfil:', error);
                if (window.eventSystem && window.eventSystem.showNotification) {
                    window.eventSystem.showNotification('Erro ao criar perfil. Tente novamente.', 'error');
                }
            }
        }
    }
    
    cancelCreation() {
        console.log('↩ Cancelando criação de perfil...');
        
        if (window.eventSystem && window.eventSystem.showScreen) {
            window.eventSystem.showScreen('profile-selection');
        }
    }
    
    cleanup() {
        console.log('🧹 [ProfileCreationScreen] Limpando');
    }
}

// Exportar para window
if (typeof window !== 'undefined') {
    window.profileCreationScreen = new ProfileCreationScreen();
    window.ProfileCreationScreen = ProfileCreationScreen;
    console.log('✅ [ProfileCreationScreen] Versão completa exportada para window');
}