/*
==========================================
BOOTSTRAP - COORDENADOR PRINCIPAL
==========================================

Responsabilidades:
1. Configurar ambiente global
2. Inicializar SystemInit
3. Coordenar eventos entre sistemas
4. Fornecer API de controle global
5. Gerenciar ciclo de vida do jogo

Centralized | Event-Driven | Modular
==========================================
*/

console.info('🚀 Bootstrap: Inicializando Street Rod II Ultimate Edition...');

(function GameBootstrap() {
    'use strict';

    // ============= CONFIGURAÇÃO GLOBAL =============

    // Prevenir múltiplas inicializações
    if (window.__gameBootstrapInitialized) {
        console.warn('⚠️ Bootstrap: Jogo já inicializado');
        return;
    }

    window.__gameBootstrapInitialized = true;

    // Configurações globais centralizadas
    window.GAME = {
        // Informações da versão
        version: '2.0.0',
        build: 'ultimate',
        environment: window.location.hostname === 'localhost' ? 'development' : 'production',

        // Estado do jogo
        state: {
            initialized: false,
            currentScreen: null,
            currentProfile: null,
            debugMode: false,
            performance: {
                startTime: Date.now(),
                loadTime: null,
                fps: 0,
                memory: null
            }
        },

        // Configurações
        config: {
            audio: {
                enabled: true,
                volume: 0.7,
                musicVolume: 0.5
            },
            graphics: {
                quality: 'high',
                shadows: true,
                reflections: true
            },
            controls: {
                sensitivity: 1.0,
                invertY: false,
                vibration: true
            }
        },

        // Estatísticas
        stats: {
            playTime: 0,
            racesCompleted: 0,
            carsOwned: 0,
            moneyEarned: 0
        }
    };

    // ============= SISTEMA DE EVENTOS GLOBAIS =============

    const GameEvents = {
        listeners: {},

        on(event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
            return () => this.off(event, callback);
        },

        off(event, callback) {
            if (!this.listeners[event]) return;
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        },

        emit(event, data) {
            console.debug(`🎯 Evento: ${event}`, data);

            // Disparar evento DOM também
            window.dispatchEvent(new CustomEvent(`game:${event}`, { detail: data }));

            // Executar listeners
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

    // ============= INICIALIZAÇÃO PRINCIPAL =============

    async function initialize() {
        console.info('🎮 Bootstrap: Iniciando sequência de inicialização...');

        try {
            // 1. Configurar sistema de logs
            setupLogging();

            // 2. Verificar compatibilidade
            if (!checkCompatibility()) {
                throw new Error('Navegador não compatível');
            }

            // 3. Configurar ambiente
            setupEnvironment();

            // 4. Inicializar SystemInit
            await initializeSystemInit();

            // 5. Aguardar sistema pronto
            await waitForSystemReady();

            // 6. Finalizar inicialização
            finalizeInitialization();

        } catch (error) {
            console.error('❌ Bootstrap: Erro na inicialização:', error);
            handleInitializationError(error);
        }
    }

    function setupLogging() {
        // Configurar nível de log baseado em URL
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('debug') || urlParams.has('verbose')) {
            GAME.state.debugMode = true;
            if (window.setLogLevel) {
                window.setLogLevel(window.logLevels?.DEBUG || 0);
            }
            console.info('🔍 Modo debug ativado');
        }

        // Log de performance
        console.info(`🏁 Build: ${GAME.version} (${GAME.build})`);
        console.info(`🌍 Ambiente: ${GAME.environment}`);
        console.info(`👤 User Agent: ${navigator.userAgent.substring(0, 80)}...`);
    }

    function checkCompatibility() {
        console.info('🔧 Bootstrap: Verificando compatibilidade...');

        const requirements = {
            // APIs obrigatórias
            required: [
                'localStorage',
                'requestAnimationFrame',
                'Promise',
                'fetch'
            ],

            // APIs recomendadas
            recommended: [
                'WebGL',
                'WebAudio',
                'serviceWorker',
                'indexedDB'
            ],

            // APIs opcionais
            optional: [
                'Gamepad',
                'Vibration',
                'WakeLock'
            ]
        };

        // Verificar obrigatórias
        const missingRequired = requirements.required.filter(api => !(api in window));

        if (missingRequired.length > 0) {
            console.error('❌ APIs obrigatórias faltando:', missingRequired);

            // Mostrar erro ao usuário
            const loadingScreen = document.getElementById('game-loading-screen');
            if (loadingScreen) {
                loadingScreen.innerHTML = `
                    <div style="text-align: center; color: #E13847; padding: 40px;">
                        <h2 style="margin-bottom: 20px;">⚠️ NAVEGADOR NÃO COMPATÍVEL</h2>
                        <p style="color: #A9A9A9; margin-bottom: 20px;">
                            Seu navegador não suporta todas as funcionalidades necessárias.
                        </p>
                        <p style="color: #666; font-size: 14px; margin-bottom: 30px;">
                            APIs faltando: ${missingRequired.join(', ')}
                        </p>
                        <button onclick="location.reload()" style="
                            padding: 12px 30px;
                            background: #F14144;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            font-family: 'Rajdhani';
                            font-weight: 600;
                            font-size: 16px;
                            cursor: pointer;
                        ">
                            🔄 TENTAR NOVAMENTE
                        </button>
                    </div>
                `;
            }

            return false;
        }

        // Verificar recomendadas
        const missingRecommended = requirements.recommended.filter(api => !(api in window));
        if (missingRecommended.length > 0) {
            console.warn('⚠️ APIs recomendadas faltando:', missingRecommended);
        }

        console.info('✅ Compatibilidade verificada');
        return true;
    }

    function setupEnvironment() {
        console.info('⚙️ Bootstrap: Configurando ambiente...');

        // Prevenir comportamentos indesejados
        preventUndesiredBehaviors();

        // Configurar performance
        setupPerformanceMonitoring();

        // Configurar service worker (se disponível)
        setupServiceWorker();
    }

    function preventUndesiredBehaviors() {
        // Prevenir zoom com double-tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300 && e.target.closest('#game-container')) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });

        // Prevenir menu de contexto no jogo
        document.addEventListener('contextmenu', function (e) {
            if (e.target.closest('#game-container')) {
                e.preventDefault();
            }
        });

        // Prevenir pull-to-refresh em mobile
        document.addEventListener('touchmove', function (e) {
            if (e.target.type === 'range') return;
            if (document.querySelector('#game-container').contains(e.target)) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    function setupPerformanceMonitoring() {
        // Monitorar FPS
        let frameCount = 0;
        let lastTime = Date.now();

        function updateFPS() {
            frameCount++;
            const now = Date.now();

            if (now - lastTime >= 1000) {
                GAME.state.performance.fps = Math.round((frameCount * 1000) / (now - lastTime));
                frameCount = 0;
                lastTime = now;

                // Log FPS baixo apenas em debug
                if (GAME.state.debugMode && GAME.state.performance.fps < 30) {
                    console.warn(`⚠️ FPS baixo: ${GAME.state.performance.fps}`);
                }
            }

            requestAnimationFrame(updateFPS);
        }

        // Iniciar monitoramento após inicialização
        setTimeout(updateFPS, 5000);
    }

    function setupServiceWorker() {
        if ('serviceWorker' in navigator && GAME.environment === 'production') {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => {
                    console.info('🔧 Service Worker registrado:', registration.scope);
                    GameEvents.emit('serviceWorkerRegistered', registration);
                })
                .catch(error => {
                    console.warn('⚠️ Falha ao registrar Service Worker:', error);
                });
        }
    }

    async function initializeSystemInit() {
        console.info('🔧 Bootstrap: Inicializando SystemInit...');

        return new Promise((resolve, reject) => {
            // Verificar se SystemInit existe
            if (!window.systemInit) {
                console.error('❌ SystemInit não encontrado');
                reject(new Error('SystemInit não disponível'));
                return;
            }

            // Escutar evento de sistema pronto
            const onSystemReady = () => {
                console.info('✅ Bootstrap: SystemReady recebido');
                GameEvents.off('systemReady', onSystemReady);
                GameEvents.off('systemError', onSystemError);
                resolve();
            };

            // Escutar evento de erro
            const onSystemError = (error) => {
                console.error('❌ Bootstrap: SystemError recebido:', error);
                GameEvents.off('systemReady', onSystemReady);
                GameEvents.off('systemError', onSystemError);
                reject(error);
            };

            // Registrar listeners
            GameEvents.on('systemReady', onSystemReady);
            GameEvents.on('systemError', onSystemError);

            // Inicializar SystemInit
            window.systemInit.initialize().catch(reject);

            // Timeout de segurança- 30 segundos
            const timeoutId = setTimeout(() => {
                console.warn('⚠️ Bootstrap: Timeout (30s) na inicialização do SystemInit');

                // Verificar se já está quase pronto
                const status = window.systemInit?.getStatus();
                if (status && (status.initialized || status.initializing)) {
                    console.warn('⚠️ SystemInit está em andamento, aguardando mais...');
                    // Não rejeitar, apenas continuar esperando
                } else {
                    GameEvents.off('systemReady', onSystemReady);
                    GameEvents.off('systemError', onSystemError);
                    reject(new Error('Timeout na inicialização do SystemInit'));
                }
            }, 30000); // 30 segundos
            // Limpar timeout se resolver
            Promise.resolve(window.systemInit.initialize())
                .then(() => clearTimeout(timeoutId))
                .catch(() => clearTimeout(timeoutId));
        });
    }

    async function waitForSystemReady() {
        console.info('⏳ Bootstrap: Aguardando sistema ficar pronto...');

        // Aguardar evento do SystemInit
        await new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (GAME.state.initialized) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);

            // Timeout após 30 segundos
            setTimeout(() => {
                clearInterval(checkInterval);
                console.warn('⚠️ Bootstrap: Timeout aguardando sistema');
                resolve(); // Continuar mesmo com timeout
            }, 30000);
        });
    }

    function finalizeInitialization() {
        console.info('🎉 Bootstrap: Finalizando inicialização...');

        // Atualizar estado
        GAME.state.initialized = true;
        GAME.state.performance.loadTime = Date.now() - GAME.state.performance.startTime;

        // Log de performance
        console.info(`⚡ Tempo de carregamento: ${GAME.state.performance.loadTime}ms`);

        // Disparar evento de inicialização completa
        GameEvents.emit('gameReady', {
            version: GAME.version,
            loadTime: GAME.state.performance.loadTime,
            environment: GAME.environment
        });

        // Mostrar notificação (se disponível)
        if (GAME.state.currentProfile && window.eventSystem?.showNotification) {
            setTimeout(() => {
                window.eventSystem.showNotification(
                    `Bem-vindo de volta, ${GAME.state.currentProfile.name}!`,
                    'success'
                );
            }, 1000);
        }

        console.info('✅ Bootstrap: Inicialização completa!');
    }

    function handleInitializationError(error) {
        console.error('💥 Bootstrap: Erro crítico na inicialização:', error);

        // Mostrar tela de erro
        showErrorScreen({
            title: 'ERRO NA INICIALIZAÇÃO',
            message: error.message || 'Falha ao inicializar o jogo',
            details: error.stack,
            actions: [
                {
                    text: '🔄 Recarregar',
                    action: () => location.reload()
                },
                {
                    text: '🔧 Tentar Novamente',
                    action: () => window.GameBootstrap.restart()
                },
                {
                    text: '🗑️ Limpar Dados',
                    action: () => {
                        localStorage.clear();
                        location.reload();
                    }
                }
            ]
        });

        // Disparar evento de erro
        GameEvents.emit('initializationError', error);
    }

    function showErrorScreen({ title, message, details, actions }) {
        const container = document.getElementById('game-container') || document.body;
        const loadingScreen = document.getElementById('game-loading-screen');

        // Esconder loading se existir
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }

        container.innerHTML = `
            <div class="bootstrap-error-screen">
                <div class="error-header">
                    <h1>${title}</h1>
                    <p class="error-subtitle">Street Rod II - Bootstrap</p>
                </div>
                
                <div class="error-content">
                    <div class="error-message">
                        <p>${message}</p>
                    </div>
                    
                    ${details ? `
                    <div class="error-details">
                        <details>
                            <summary>Detalhes técnicos</summary>
                            <pre>${details}</pre>
                        </details>
                    </div>
                    ` : ''}
                    
                    <div class="error-actions">
                        ${actions.map((action, index) => `
                            <button onclick="(${action.action.toString()})()" 
                                    class="error-action-btn action-${index}">
                                ${action.text}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="error-debug">
                        <p><strong>Informações de debug:</strong></p>
                        <ul>
                            <li>URL: ${window.location.href}</li>
                            <li>User Agent: ${navigator.userAgent.substring(0, 60)}...</li>
                            <li>Tempo: ${new Date().toLocaleTimeString()}</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // Adicionar estilos se necessário
        if (!document.querySelector('#bootstrap-error-styles')) {
            addErrorStyles();
        }
    }

    function addErrorStyles() {
        const style = document.createElement('style');
        style.id = 'bootstrap-error-styles';
        style.textContent = `
            .bootstrap-error-screen {
                min-height: 100vh;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                color: #f1f1f1;
                padding: 30px;
                font-family: 'Rajdhani', sans-serif;
            }
            
            .error-header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 2px solid #f14144;
                padding-bottom: 20px;
            }
            
            .error-header h1 {
                color: #f14144;
                font-size: 2.5rem;
                margin-bottom: 10px;
            }
            
            .error-subtitle {
                color: #aaa;
                font-size: 1.1rem;
            }
            
            .error-content {
                max-width: 700px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 30px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .error-message {
                background: rgba(241, 65, 68, 0.1);
                border: 1px solid #f14144;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                font-size: 1.1rem;
                line-height: 1.6;
            }
            
            .error-details {
                margin-bottom: 20px;
            }
            
            .error-details details {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                padding: 15px;
            }
            
            .error-details summary {
                cursor: pointer;
                color: #f1c40f;
                font-weight: 600;
                margin-bottom: 10px;
            }
            
            .error-details pre {
                margin: 10px 0 0 0;
                color: #aaa;
                font-size: 0.9rem;
                white-space: pre-wrap;
                word-wrap: break-word;
                max-height: 200px;
                overflow-y: auto;
            }
            
            .error-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin: 30px 0;
            }
            
            .error-action-btn {
                flex: 1;
                min-width: 180px;
                padding: 15px 20px;
                border: none;
                border-radius: 8px;
                font-family: 'Rajdhani', sans-serif;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .action-0 {
                background: linear-gradient(135deg, #f14144, #e13847);
                color: white;
            }
            
            .action-1 {
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
            }
            
            .action-2 {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
            }
            
            .error-action-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .error-debug {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 15px;
                font-size: 0.9rem;
                color: #aaa;
            }
            
            .error-debug ul {
                list-style: none;
                padding: 0;
                margin: 10px 0 0 0;
            }
            
            .error-debug li {
                padding: 5px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .error-debug li:last-child {
                border-bottom: none;
            }
            
            @media (max-width: 768px) {
                .bootstrap-error-screen {
                    padding: 20px;
                }
                
                .error-header h1 {
                    font-size: 2rem;
                }
                
                .error-actions {
                    flex-direction: column;
                }
                
                .error-action-btn {
                    min-width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ============= API PÚBLICA =============

    const GameBootstrapAPI = {
        // Controle
        initialize: initialize, // ← CORREÇÃO: Referência à função

        restart() {
            console.info('🔄 Bootstrap: Reiniciando jogo...');

            // Limpar estado
            localStorage.removeItem('sr2_currentProfile');

            // Reiniciar
            location.reload();
        },

        setDebug(enabled) {
            GAME.state.debugMode = enabled;
            if (window.setLogLevel) {
                window.setLogLevel(enabled ? (window.logLevels?.DEBUG || 0) : (window.logLevels?.INFO || 1));
            }
            console.info(`🔧 Debug ${enabled ? 'ativado' : 'desativado'}`);
        },

        // Informação
        getStatus() {
            return {
                initialized: GAME.state.initialized,
                version: GAME.version,
                environment: GAME.environment,
                debugMode: GAME.state.debugMode,
                currentScreen: GAME.state.currentScreen,
                currentProfile: GAME.state.currentProfile,
                performance: {
                    ...GAME.state.performance,
                    uptime: Date.now() - GAME.state.performance.startTime
                },
                config: GAME.config
            };
        },

        // Eventos
        on: GameEvents.on.bind(GameEvents),
        off: GameEvents.off.bind(GameEvents),
        emit: GameEvents.emit.bind(GameEvents),

        // Configuração
        updateConfig(section, values) {
            if (GAME.config[section]) {
                GAME.config[section] = { ...GAME.config[section], ...values };
                GameEvents.emit('configUpdated', { section, values });
                console.info(`⚙️ Configuração ${section} atualizada:`, values);
                return true;
            }
            return false;
        },

        // Utilitários
        saveGame() {
            const saveData = {
                profile: GAME.state.currentProfile,
                stats: GAME.stats,
                config: GAME.config,
                timestamp: Date.now()
            };

            try {
                localStorage.setItem('sr2_game_save', JSON.stringify(saveData));
                GameEvents.emit('gameSaved', saveData);
                console.info('💾 Jogo salvo');
                return true;
            } catch (error) {
                console.error('❌ Erro ao salvar jogo:', error);
                return false;
            }
        },

        loadGame() {
            try {
                const saveData = JSON.parse(localStorage.getItem('sr2_game_save'));
                if (saveData) {
                    // Aplicar dados salvos
                    if (saveData.profile && window.profileManager) {
                        window.profileManager.setCurrentProfile(saveData.profile);
                        GAME.state.currentProfile = saveData.profile;
                    }

                    if (saveData.stats) {
                        Object.assign(GAME.stats, saveData.stats);
                    }

                    GameEvents.emit('gameLoaded', saveData);
                    console.info('📂 Jogo carregado');
                    return saveData;
                }
            } catch (error) {
                console.error('❌ Erro ao carregar jogo:', error);
            }
            return null;
        }
    };

    // Exportar API
    window.GameBootstrap = GameBootstrapAPI;

    // ============= INICIALIZAÇÃO AUTOMÁTICA =============

    // Iniciar quando o DOM estiver pronto
    function startBootstrap() {
        console.info('🎬 Bootstrap: Iniciando sequência...');

        // Pequeno delay para garantir que outros scripts carregaram
        setTimeout(() => {
            // Usar a função diretamente, não via GameBootstrap
            initialize();
        }, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startBootstrap);
    } else {
        startBootstrap();
    }

    console.info('✅ Bootstrap: Sistema carregado e pronto');
})();