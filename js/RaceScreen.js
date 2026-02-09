// js/RaceScreen.js - VERSÃO FINAL COMPLETA
class RaceScreen {
    constructor(screenManager, eventSystem) {
        this.screenManager = screenManager;

        // ✅ SOLUÇÃO: Aceitar eventSystem OU usar window.eventSystem
        this.eventSystem = eventSystem || window.eventSystem;

        if (!this.eventSystem) {
            console.warn('⚠️ RaceScreen: eventSystem não disponível no construtor');
            console.warn('⚠️ RaceScreen será criada mas não registrada ainda');

            // Criar objeto dummy temporário
            this.eventSystem = {
                registerScreen: function (id, screen) {
                    console.log(`📝 RaceScreen dummy register: ${id}`);
                    this.screens = this.screens || {};
                    this.screens[id] = screen;
                },
                showScreen: function () { console.log('🔄 showScreen dummy') },
                screens: {}
            };
        }

        // ✅ Registrar APENAS se eventSystem tem o método
        if (this.eventSystem && typeof this.eventSystem.registerScreen === 'function') {
            try {
                this.eventSystem.registerScreen('race-screen', this);
                console.log('✅ RaceScreen registrada como race-screen');
            } catch (error) {
                console.error('❌ Erro ao registrar race-screen:', error);
            }
        } else {
            console.warn('⚠️ RaceScreen não registrada (registerScreen não disponível)');
        }

        this.isActive = false;
        this.isPaused = false;
        this.isRaceFinished = false;
        this.raceStarted = false;

        // Controles
        this.keys = {};
        this.touchControls = {
            left: false,
            right: false,
            up: false,
            down: false,
            nitro: false
        };

        // Estado da corrida
        this.cars = [];
        this.playerCar = null;
        this.trackType = "circuit"; // circuit, drag, street
        this.raceLength = 5; // km
        this.difficulty = "medium";
        this.weather = "clear";
        this.timeOfDay = "day";

        // Física e tempo
        this.lastTime = 0;
        this.raceTime = 0;
        this.distanceTraveled = 0;
        this.currentSpeed = 0;
        this.maxSpeed = 200;
        this.acceleration = 0;
        this.lane = 1; // 0 = esquerda, 1 = centro, 2 = direita

        // Sistemas
        this.nitroActive = false;
        this.nitroAmount = 100;
        this.carHealth = 100;
        this.shieldActive = false;
        this.shieldTime = 0;
        this.gear = 1;
        this.rpm = 0;

        // IA
        this.aiCars = [];
        this.aiDifficultySettings = {
            easy: { speed: 0.8, mistakes: 0.3, aggression: 0.2 },
            medium: { speed: 1.0, mistakes: 0.1, aggression: 0.5 },
            hard: { speed: 1.2, mistakes: 0.05, aggression: 0.8 }
        };

        // Power-ups
        this.activePowerUps = [];
        this.powerUpSpawnTimer = 0;

        // Efeitos visuais
        this.particles = [];
        this.screenShake = 0;

        // Referências DOM
        this.container = null;
        this.canvas = null;
        this.ctx = null;
        this.uiElements = {};

        // Sistema de áudio (simples)
        this.sounds = {};
        this.soundEnabled = true;

        // Achievements
        this.raceStats = {
            time: 0,
            position: 1,
            collisions: 0,
            nitroUsed: 0,
            topSpeed: 0,
            perfectLaps: 0,
            damageTaken: 0,
            powerUpsCollected: 0
        };

        this.init();
    }

    // Adicione este método como fallback:
    createFallbackContainer() {
        console.log('⚠️ Criando game-container como fallback...');
        const container = document.createElement('div');
        container.id = 'game-container';
        container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    `;
        document.body.appendChild(container);

        // Agora adicione o container da tela
        container.appendChild(this.container);
    }

    init() {
        this.createUI();
        this.setupEventListeners();
        this.preloadSounds();
    }

    createUI() {
        this.container = document.createElement('div');
        this.container.className = 'race-screen';
        this.container.innerHTML = `
            <div class="race-container">
                <!-- Canvas para renderização do jogo -->
                <canvas id="raceCanvas"></canvas>
                
                <!-- Overlay de UI -->
                <div class="race-ui-overlay">
                    <!-- HUD Topo -->
                    <div class="race-hud-top">
                        <div class="race-timer">00:00.00</div>
                        <div class="race-distance">0.0 / 5.0 km</div>
                        <div class="race-position">POS: 1/6</div>
                    </div>
                    
                    <!-- HUD Esquerda -->
                    <div class="race-hud-left">
                        <div class="speedometer">
                            <div class="speed-value">0</div>
                            <div class="speed-unit">KM/H</div>
                            <div class="speed-bar">
                                <div class="speed-fill"></div>
                            </div>
                        </div>
                        <div class="rpm-indicator">
                            <div class="rpm-label">RPM</div>
                            <div class="rpm-bar">
                                <div class="rpm-fill"></div>
                            </div>
                            <div class="gear-display">N</div>
                        </div>
                    </div>
                    
                    <!-- HUD Direita -->
                    <div class="race-hud-right">
                        <div class="health-bar">
                            <div class="health-label">SAÚDE</div>
                            <div class="health-container">
                                <div class="health-fill"></div>
                                <div class="health-text">100%</div>
                            </div>
                        </div>
                        <div class="nitro-bar">
                            <div class="nitro-label">NITRO</div>
                            <div class="nitro-container">
                                <div class="nitro-fill"></div>
                                <div class="nitro-text">100%</div>
                            </div>
                        </div>
                        <div class="shield-indicator">
                            <div class="shield-icon">🛡️</div>
                            <div class="shield-timer">0.0s</div>
                        </div>
                    </div>
                    
                    <!-- Mini Mapa -->
                    <div class="mini-map">
                        <div class="map-title">MAPA</div>
                        <div class="map-container">
                            <canvas id="miniMapCanvas"></canvas>
                        </div>
                        <div class="map-legend">
                            <span class="player-dot"></span> Você
                            <span class="ai-dot"></span> Oponentes
                        </div>
                    </div>
                    
                    <!-- Posições -->
                    <div class="positions-panel">
                        <div class="positions-title">POSIÇÕES</div>
                        <div class="positions-list">
                            <!-- Preenchido dinamicamente -->
                        </div>
                    </div>
                    
                    <!-- Notificações -->
                    <div class="race-notifications">
                        <!-- Notificações dinâmicas aparecem aqui -->
                    </div>
                    
                    <!-- Controles Mobile -->
                    <div class="mobile-controls">
                        <div class="mobile-controls-row">
                            <button class="mobile-btn left-btn" data-action="left">←</button>
                            <button class="mobile-btn up-btn" data-action="up">↑</button>
                            <button class="mobile-btn right-btn" data-action="right">→</button>
                        </div>
                        <div class="mobile-controls-row">
                            <button class="mobile-btn down-btn" data-action="down">↓</button>
                            <button class="mobile-btn nitro-btn" data-action="nitro">⚡</button>
                            <button class="mobile-btn pause-btn" data-action="pause">⏸</button>
                        </div>
                    </div>
                </div>
                
                <!-- Tela de Pause -->
                <div class="pause-screen hidden">
                    <div class="pause-content">
                        <h2>JOGO PAUSADO</h2>
                        <button class="pause-option resume-btn">CONTINUAR</button>
                        <button class="pause-option restart-btn">REINICIAR</button>
                        <button class="pause-option settings-btn">CONFIGURAÇÕES</button>
                        <button class="pause-option quit-btn">SAIR</button>
                    </div>
                </div>
                
                <!-- Tela de Resultados -->
                <div class="results-screen hidden">
                    <div class="results-content">
                        <h2>CORRIDA CONCLUÍDA!</h2>
                        <div class="result-stats">
                            <div class="result-stat">
                                <span>Posição Final:</span>
                                <span class="result-value position">1º</span>
                            </div>
                            <div class="result-stat">
                                <span>Tempo:</span>
                                <span class="result-value time">00:00.00</span>
                            </div>
                            <div class="result-stat">
                                <span>Velocidade Máxima:</span>
                                <span class="result-value top-speed">0 km/h</span>
                            </div>
                            <div class="result-stat">
                                <span>Dano do Carro:</span>
                                <span class="result-value damage">0%</span>
                            </div>
                            <div class="result-stat">
                                <span>Colisões:</span>
                                <span class="result-value collisions">0</span>
                            </div>
                            <div class="result-stat total-reward">
                                <span>Prêmio:</span>
                                <span class="result-value money">$0</span>
                            </div>
                        </div>
                        <div class="achievements-earned">
                            <h3>CONQUISTAS DESBLOQUEADAS</h3>
                            <div class="achievements-list">
                                <!-- Preenchido dinamicamente -->
                            </div>
                        </div>
                        <div class="results-buttons">
                            <button class="results-btn continue-btn">CONTINUAR</button>
                            <button class="results-btn replay-btn">REPETIR CORRIDA</button>
                            <button class="results-btn garage-btn">VOLTAR À GARAGEM</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        //document.getElementById('gameContainer').appendChild(this.container);

        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) {
            console.error('❌ RaceScreen: Elemento game-container não encontrado no DOM');
            console.error('❌ Verifique se o index.html tem <div id="game-container"></div>');
            // Crie o container se não existir (fallback)
            this.createFallbackContainer();
            return;
        }

        // Só então adicione o container
        gameContainer.appendChild(this.container);

        // Configurar canvas
        this.canvas = document.getElementById('raceCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Referências aos elementos UI
        this.uiElements = {
            timer: this.container.querySelector('.race-timer'),
            distance: this.container.querySelector('.race-distance'),
            position: this.container.querySelector('.race-position'),
            speedValue: this.container.querySelector('.speed-value'),
            speedFill: this.container.querySelector('.speed-fill'),
            rpmFill: this.container.querySelector('.rpm-fill'),
            gearDisplay: this.container.querySelector('.gear-display'),
            healthFill: this.container.querySelector('.health-fill'),
            healthText: this.container.querySelector('.health-text'),
            nitroFill: this.container.querySelector('.nitro-fill'),
            nitroText: this.container.querySelector('.nitro-text'),
            shieldTimer: this.container.querySelector('.shield-timer'),
            positionsList: this.container.querySelector('.positions-list'),
            notifications: this.container.querySelector('.race-notifications'),
            pauseScreen: this.container.querySelector('.pause-screen'),
            resultsScreen: this.container.querySelector('.results-screen'),
            miniMapCanvas: document.getElementById('miniMapCanvas')
        };

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.container.getBoundingClientRect();
        this.canvas.width = container.width;
        this.canvas.height = container.height;

        if (this.uiElements.miniMapCanvas) {
            this.uiElements.miniMapCanvas.width = 200;
            this.uiElements.miniMapCanvas.height = 150;
        }
    }

    setupEventListeners() {
        // Teclado
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Pause com ESC
            if (e.key === 'Escape' && this.isActive && this.raceStarted) {
                this.togglePause();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Controles mobile
        this.container.querySelectorAll('.mobile-btn').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                this.touchControls[action] = true;
                btn.classList.add('active');

                if (action === 'pause') {
                    this.togglePause();
                }
            });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                this.touchControls[action] = false;
                btn.classList.remove('active');
            });
        });

        // Botões de pause
        this.container.querySelector('.resume-btn').addEventListener('click', () => this.togglePause());
        this.container.querySelector('.restart-btn').addEventListener('click', () => this.restartRace());
        this.container.querySelector('.quit-btn').addEventListener('click', () => this.exitRace());

        // Botões de resultados
        this.container.querySelector('.continue-btn').addEventListener('click', () => this.exitRace());
        this.container.querySelector('.replay-btn').addEventListener('click', () => this.restartRace());
        this.container.querySelector('.garage-btn').addEventListener('click', () => {
            this.screenManager.showScreen('garage');
        });
    }

    preloadSounds() {
        // Sistema de áudio simples
        this.sounds = {
            engine: this.createSound('engine', 0.3, true),
            nitro: this.createSound('nitro', 0.5, false),
            collision: this.createSound('collision', 0.7, false),
            shift: this.createSound('shift', 0.4, false),
            powerup: this.createSound('powerup', 0.6, false),
            win: this.createSound('win', 0.8, false),
            lose: this.createSound('lose', 0.8, false)
        };

        // Verificar configurações de áudio
        const profile = this.screenManager.profileManager.getProfile();
        this.soundEnabled = profile.settings.sfxVolume > 0;

        // Configurar volumes
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.volume = profile.settings.sfxVolume || 0.7;
            }
        });
    }

    createSound(name, defaultVolume, loop) {
        // Sistema simples - em produção, usaríamos arquivos de áudio reais
        // Por enquanto, criamos objetos de áudio fictícios
        return {
            play: () => {
                if (this.soundEnabled) {
                    console.log(`Playing sound: ${name}`);
                    // Em implementação real, tocaríamos o áudio
                }
            },
            stop: () => console.log(`Stopping sound: ${name}`),
            volume: defaultVolume,
            loop: loop
        };
    }

    show(params = {}) {
        this.isActive = true;
        this.isPaused = false;
        this.isRaceFinished = false;
        this.raceStarted = false;
        this.container.classList.remove('hidden');

        // Inicializar corrida com parâmetros
        this.trackType = params.trackType || "circuit";
        this.difficulty = params.difficulty || "medium";
        this.raceLength = params.length || 5;

        // Configurar carro do jogador
        this.playerCar = this.initializePlayerCar(params.car);

        // Configurar IA
        this.initializeAICars();

        // Configurar clima
        this.initializeWeather();

        // Resetar estatísticas
        this.resetRaceStats();

        // Iniciar contagem regressiva
        this.startCountdown();

        // Iniciar loop do jogo
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    hide() {
        this.isActive = false;
        this.container.classList.add('hidden');
        this.cleanup();
    }

    initializePlayerCar(carData) {
        // Carro do jogador
        const car = {
            x: 100,
            y: 300,
            width: 60,
            height: 120,
            color: carData?.color || '#3498db',
            speed: 0,
            maxSpeed: carData?.maxSpeed || 200,
            acceleration: carData?.acceleration || 0.5,
            braking: carData?.braking || 0.8,
            handling: carData?.handling || 1.0,
            nitroMultiplier: carData?.nitroMultiplier || 1.5,
            health: 100,
            name: "Jogador",
            position: 1,
            distance: 0,
            isPlayer: true
        };

        // Aplicar upgrades
        if (carData?.upgrades) {
            car.maxSpeed *= (1 + carData.upgrades.engine * 0.1);
            car.acceleration *= (1 + carData.upgrades.engine * 0.15);
            car.braking *= (1 + carData.upgrades.brakes * 0.2);
            car.handling *= (1 + carData.upgrades.tires * 0.25);
            car.nitroMultiplier += carData.upgrades.nitro * 0.1;
        }

        return car;
    }

    initializeAICars() {
        this.aiCars = [];
        const aiCount = 5;
        const difficulty = this.aiDifficultySettings[this.difficulty];

        const aiNames = [
            "Rival 1", "Corredor 2", "Veloz 3",
            "Competidor 4", "Oponente 5", "Desafiante 6"
        ];

        const aiColors = ['#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#34495e'];

        for (let i = 0; i < aiCount; i++) {
            const aiSpeed = difficulty.speed * (0.9 + Math.random() * 0.2);

            this.aiCars.push({
                x: 100 + (i * 100),
                y: 100 + (i * 150),
                width: 60,
                height: 120,
                color: aiColors[i % aiColors.length],
                speed: 60 + Math.random() * 40,
                maxSpeed: 180 * aiSpeed,
                acceleration: 0.4 * aiSpeed,
                braking: 0.7,
                handling: 0.8 + (Math.random() * 0.4),
                aggression: difficulty.aggression * (0.8 + Math.random() * 0.4),
                mistakeChance: difficulty.mistakes,
                health: 100,
                name: aiNames[i],
                position: i + 2,
                distance: 0,
                isPlayer: false,
                targetLane: 1,
                laneChangeTimer: 0,
                behaviorState: 'racing', // racing, overtaking, blocking, recovering
                nextActionTime: 0
            });
        }

        this.cars = [this.playerCar, ...this.aiCars];
    }

    initializeWeather() {
        const rand = Math.random();
        if (rand < 0.7) {
            this.weather = "clear";
            this.timeOfDay = "day";
        } else if (rand < 0.9) {
            this.weather = "rain";
            this.timeOfDay = "day";
        } else {
            this.weather = "clear";
            this.timeOfDay = "night";
        }

        // Aplicar efeitos do clima
        if (this.weather === "rain") {
            // Chuva reduz atrito
            this.playerCar.handling *= 0.8;
            this.aiCars.forEach(car => car.handling *= 0.8);
        }

        if (this.timeOfDay === "night") {
            // Noite reduz visibilidade
            document.body.classList.add('night-mode');
        }
    }

    resetRaceStats() {
        this.raceStats = {
            time: 0,
            position: 1,
            collisions: 0,
            nitroUsed: 0,
            topSpeed: 0,
            perfectLaps: 0,
            damageTaken: 0,
            powerUpsCollected: 0
        };

        this.raceTime = 0;
        this.distanceTraveled = 0;
        this.currentSpeed = 0;
        this.lane = 1;
        this.nitroAmount = 100;
        this.carHealth = 100;
        this.shieldActive = false;
        this.shieldTime = 0;
        this.gear = 1;
        this.rpm = 0;
        this.particles = [];
        this.activePowerUps = [];
        this.powerUpSpawnTimer = 0;
    }

    startCountdown() {
        let countdown = 3;
        this.showNotification(`Corrida começando em ${countdown}...`, 'info');

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                this.showNotification(countdown.toString(), 'countdown');
            } else if (countdown === 0) {
                this.showNotification("VAI!", 'go');
                this.raceStarted = true;
                this.sounds.engine.play();
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    gameLoop(currentTime) {
        if (!this.isActive) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (this.isPaused || !this.raceStarted || this.isRaceFinished) {
            requestAnimationFrame((time) => this.gameLoop(time));
            return;
        }

        // Atualizar física
        this.updatePhysics(deltaTime);

        // Atualizar IA
        this.updateAI(deltaTime);

        // Atualizar power-ups
        this.updatePowerUps(deltaTime);

        // Atualizar efeitos
        this.updateEffects(deltaTime);

        // Verificar colisões
        this.checkCollisions();

        // Verificar fim da corrida
        this.checkRaceFinish();

        // Renderizar
        this.render();

        // Atualizar UI
        this.updateUI();

        // Continuar loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    updatePhysics(deltaTime) {
        // Controles
        let targetAcceleration = 0;
        let targetBraking = 0;

        // Keyboard
        if (this.keys['arrowup'] || this.keys['w'] || this.touchControls.up) {
            targetAcceleration = this.playerCar.acceleration;
        }

        if (this.keys['arrowdown'] || this.keys['s'] || this.touchControls.down) {
            targetBraking = this.playerCar.braking;
        }

        // Mudança de faixa
        if ((this.keys['arrowleft'] || this.keys['a'] || this.touchControls.left) && this.lane > 0) {
            this.lane--;
            this.keys['arrowleft'] = false;
            this.keys['a'] = false;
        }

        if ((this.keys['arrowright'] || this.keys['d'] || this.touchControls.right) && this.lane < 2) {
            this.lane++;
            this.keys['arrowright'] = false;
            this.keys['d'] = false;
        }

        // Nitro
        if ((this.keys[' '] || this.keys['shift'] || this.touchControls.nitro) && this.nitroAmount > 0) {
            this.activateNitro();
        } else {
            this.deactivateNitro();
        }

        // Calcular aceleração final
        this.acceleration = targetAcceleration - targetBraking;

        // Aplicar nitro
        if (this.nitroActive && this.nitroAmount > 0) {
            this.acceleration *= this.playerCar.nitroMultiplier;
            this.nitroAmount = Math.max(0, this.nitroAmount - 80 * deltaTime);
            this.raceStats.nitroUsed += 80 * deltaTime;
        } else {
            // Recarregar nitro
            if (this.nitroAmount < 100 && !this.nitroActive) {
                this.nitroAmount = Math.min(100, this.nitroAmount + 20 * deltaTime);
            }
        }

        // Atualizar velocidade
        this.currentSpeed += this.acceleration * deltaTime;

        // Limitar velocidade baseado em dano
        const speedMultiplier = this.carHealth / 100;
        const effectiveMaxSpeed = this.playerCar.maxSpeed * speedMultiplier;

        this.currentSpeed = Math.max(0, Math.min(this.currentSpeed, effectiveMaxSpeed));

        // Atualizar distância
        const speedKmh = this.currentSpeed * 3.6; // Convert to km/h
        this.distanceTraveled += (speedKmh / 3600) * deltaTime; // km per second

        // Atualizar RPM e marcha
        this.updateGearAndRPM();

        // Atualizar saúde do carro
        this.updateCarHealth(deltaTime);

        // Atualizar escudo
        this.updateShield(deltaTime);

        // Atualizar estatísticas
        if (speedKmh > this.raceStats.topSpeed) {
            this.raceStats.topSpeed = speedKmh;
        }

        this.raceTime += deltaTime;
    }

    updateGearAndRPM() {
        const speedKmh = this.currentSpeed * 3.6;

        // Sistema de marchas automático simples
        if (speedKmh < 30) {
            this.gear = 1;
            this.rpm = (speedKmh / 30) * 3000;
        } else if (speedKmh < 60) {
            this.gear = 2;
            this.rpm = 2000 + ((speedKmh - 30) / 30) * 2000;
        } else if (speedKmh < 100) {
            this.gear = 3;
            this.rpm = 3000 + ((speedKmh - 60) / 40) * 2000;
        } else if (speedKmh < 150) {
            this.gear = 4;
            this.rpm = 4000 + ((speedKmh - 100) / 50) * 2000;
        } else {
            this.gear = 5;
            this.rpm = 5000 + ((speedKmh - 150) / 50) * 3000;
        }

        this.rpm = Math.min(8000, this.rpm);

        // Som de mudança de marcha
        if (Math.floor(this.rpm / 1000) !== Math.floor((this.rpm - 10) / 1000)) {
            this.sounds.shift.play();
        }
    }

    updateCarHealth(deltaTime) {
        // Dano por velocidade alta
        if (this.currentSpeed > this.playerCar.maxSpeed * 0.9) {
            this.carHealth -= 5 * deltaTime;
            this.raceStats.damageTaken += 5 * deltaTime;
        }

        // Dano por colisão (aplicado em checkCollisions)

        // Recuperação em baixa velocidade
        if (this.currentSpeed < this.playerCar.maxSpeed * 0.3 && this.carHealth < 100) {
            this.carHealth += 2 * deltaTime;
        }

        this.carHealth = Math.max(0, Math.min(100, this.carHealth));

        // Efeito de fumaça quando danificado
        if (this.carHealth < 30 && Math.random() < 0.1) {
            this.createParticle(
                this.playerCar.x + this.playerCar.width / 2,
                this.playerCar.y + 10,
                '#333',
                2,
                2,
                1
            );
        }
    }

    updateShield(deltaTime) {
        if (this.shieldActive) {
            this.shieldTime -= deltaTime;
            if (this.shieldTime <= 0) {
                this.shieldActive = false;
                this.showNotification("Escudo desativado", 'warning');
            }
        }
    }

    updateAI(deltaTime) {
        this.aiCars.forEach((car, index) => {
            // Comportamento da IA
            this.updateAIBehavior(car, deltaTime, index);

            // Atualizar posição
            car.distance += (car.speed * 3.6 / 3600) * deltaTime;

            // Limitar velocidade
            car.speed = Math.min(car.speed + car.acceleration * deltaTime, car.maxSpeed);

            // Erros aleatórios
            if (Math.random() < car.mistakeChance * deltaTime) {
                car.speed *= 0.8;
                this.createParticle(
                    car.x + car.width / 2,
                    car.y + car.height,
                    '#f39c12',
                    3,
                    5,
                    0.5
                );
            }
        });

        // Ordenar por distância
        this.cars.sort((a, b) => b.distance - a.distance);

        // Atualizar posições
        this.cars.forEach((car, index) => {
            car.position = index + 1;
        });

        this.raceStats.position = this.playerCar.position;
    }

    updateAIBehavior(car, deltaTime, index) {
        // Máquina de estados simples da IA
        car.laneChangeTimer -= deltaTime;

        switch (car.behaviorState) {
            case 'racing':
                // Comportamento normal de corrida
                if (car.laneChangeTimer <= 0) {
                    const shouldChangeLane = Math.random() < car.aggression * 0.1;
                    if (shouldChangeLane) {
                        car.targetLane = Math.floor(Math.random() * 3);
                        car.laneChangeTimer = 2 + Math.random() * 3;
                        car.behaviorState = 'overtaking';
                    }
                }
                break;

            case 'overtaking':
                // Tentar ultrapassar
                if (car.laneChangeTimer <= 0) {
                    car.behaviorState = 'racing';
                }
                break;

            case 'blocking':
                // Bloquear jogador
                car.targetLane = this.lane;
                if (Math.random() < 0.5) {
                    car.behaviorState = 'racing';
                }
                break;

            case 'recovering':
                // Recuperar após erro
                car.speed *= 0.95;
                if (car.speed < car.maxSpeed * 0.7) {
                    car.behaviorState = 'racing';
                }
                break;
        }

        // Atualizar posição X baseado na faixa alvo
        const targetX = 100 + (car.targetLane * 150);
        car.x += (targetX - car.x) * car.handling * deltaTime;

        // Ajustar velocidade baseado na posição
        const playerAhead = this.playerCar.distance > car.distance;
        if (playerAhead && car.behaviorState === 'racing') {
            car.speed += car.acceleration * deltaTime * 1.2;
        }
    }

    updatePowerUps(deltaTime) {
        // Spawn de power-ups
        this.powerUpSpawnTimer -= deltaTime;
        if (this.powerUpSpawnTimer <= 0) {
            this.spawnPowerUp();
            this.powerUpSpawnTimer = 10 + Math.random() * 20;
        }

        // Atualizar power-ups ativos
        this.activePowerUps = this.activePowerUps.filter(powerUp => {
            powerUp.duration -= deltaTime;
            return powerUp.duration > 0;
        });
    }

    spawnPowerUp() {
        const powerUpTypes = [
            { type: 'nitro', icon: '⚡', color: '#f1c40f' },
            { type: 'repair', icon: '🔧', color: '#2ecc71' },
            { type: 'shield', icon: '🛡️', color: '#3498db' }
        ];

        const powerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

        this.powerUps = this.powerUps || [];
        this.powerUps.push({
            x: 100 + Math.random() * 400,
            y: 50 + Math.random() * 300,
            width: 40,
            height: 40,
            ...powerUp,
            collected: false
        });
    }

    updateEffects(deltaTime) {
        // Atualizar partículas
        this.particles = this.particles.filter(particle => {
            particle.life -= deltaTime;
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.vy += 0.1; // Gravity
            return particle.life > 0;
        });

        // Screen shake
        if (this.screenShake > 0) {
            this.screenShake -= deltaTime * 5;
        }
    }

    checkCollisions() {
        // Colisão entre carros
        for (let i = 0; i < this.cars.length; i++) {
            for (let j = i + 1; j < this.cars.length; j++) {
                const car1 = this.cars[i];
                const car2 = this.cars[j];

                if (this.isColliding(car1, car2)) {
                    this.handleCollision(car1, car2);
                }
            }
        }

        // Colisão com power-ups
        if (this.powerUps) {
            this.powerUps.forEach(powerUp => {
                if (!powerUp.collected && this.isColliding(this.playerCar, powerUp)) {
                    this.collectPowerUp(powerUp);
                }
            });
        }
    }

    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y;
    }

    handleCollision(car1, car2) {
        // Calcular dano baseado na velocidade relativa
        const relativeSpeed = Math.abs(car1.speed - car2.speed);
        const damage = relativeSpeed * 5;

        // Aplicar dano
        if (!car1.isPlayer || !this.shieldActive) {
            car1.health = Math.max(0, car1.health - damage);
            if (car1.isPlayer) {
                this.carHealth = car1.health;
                this.raceStats.collisions++;
                this.raceStats.damageTaken += damage;
            }
        }

        if (!car2.isPlayer || !this.shieldActive) {
            car2.health = Math.max(0, car2.health - damage);
            if (car2.isPlayer) {
                this.carHealth = car2.health;
                this.raceStats.collisions++;
                this.raceStats.damageTaken += damage;
            }
        }

        // Efeitos visuais
        this.createCollisionEffects(car1, car2);

        // Som
        this.sounds.collision.play();

        // Screen shake
        this.screenShake = 1;

        // Notificação
        if (car1.isPlayer || car2.isPlayer) {
            this.showNotification("COLISÃO!", 'warning');
        }

        // Empurrar carros para longe
        const pushForce = 5;
        if (car1.x < car2.x) {
            car1.x -= pushForce;
            car2.x += pushForce;
        } else {
            car1.x += pushForce;
            car2.x -= pushForce;
        }

        // Reduzir velocidade
        car1.speed *= 0.5;
        car2.speed *= 0.5;

        // Se um dos carros for jogador, atualizar saúde
        if (car1.isPlayer) {
            this.carHealth = car1.health;
        }
        if (car2.isPlayer) {
            this.carHealth = car2.health;
        }
    }

    createCollisionEffects(car1, car2) {
        const centerX = (car1.x + car2.x) / 2;
        const centerY = (car1.y + car2.y) / 2;

        // Partículas de impacto
        for (let i = 0; i < 20; i++) {
            this.createParticle(
                centerX,
                centerY,
                '#e74c3c',
                Math.random() * 10 - 5,
                Math.random() * 10 - 5,
                1
            );
        }

        // Partículas de metal
        for (let i = 0; i < 10; i++) {
            this.createParticle(
                centerX,
                centerY,
                '#bdc3c7',
                Math.random() * 8 - 4,
                Math.random() * 8 - 4,
                2
            );
        }
    }

    collectPowerUp(powerUp) {
        powerUp.collected = true;
        this.sounds.powerup.play();
        this.raceStats.powerUpsCollected++;

        switch (powerUp.type) {
            case 'nitro':
                this.nitroAmount = Math.min(100, this.nitroAmount + 50);
                this.showNotification("⚡ +50% NITRO", 'powerup');
                break;

            case 'repair':
                this.carHealth = Math.min(100, this.carHealth + 30);
                this.showNotification("🔧 +30% REPARO", 'powerup');
                break;

            case 'shield':
                this.shieldActive = true;
                this.shieldTime = 5;
                this.showNotification("🛡️ ESCUDO ATIVADO", 'powerup');
                break;
        }

        // Efeitos visuais
        for (let i = 0; i < 15; i++) {
            this.createParticle(
                powerUp.x + powerUp.width / 2,
                powerUp.y + powerUp.height / 2,
                powerUp.color,
                Math.random() * 6 - 3,
                Math.random() * 6 - 3,
                1.5
            );
        }
    }

    createParticle(x, y, color, vx, vy, life) {
        this.particles.push({
            x, y, color, vx, vy, life,
            size: Math.random() * 5 + 2
        });
    }

    checkRaceFinish() {
        if (this.distanceTraveled >= this.raceLength && !this.isRaceFinished) {
            this.finishRace();
        }
    }

    finishRace() {
        this.isRaceFinished = true;
        this.raceStarted = false;
        this.sounds.engine.stop();

        // Parar todos os carros
        this.cars.forEach(car => {
            car.speed = 0;
        });

        // Tocar som apropriado
        if (this.playerCar.position === 1) {
            this.sounds.win.play();
            this.showNotification("VITÓRIA!", 'victory');
        } else {
            this.sounds.lose.play();
            this.showNotification("Corrida concluída", 'info');
        }

        // Calcular recompensas
        this.calculateRewards();

        // Mostrar tela de resultados
        setTimeout(() => {
            this.showResultsScreen();
        }, 2000);
    }

    calculateRewards() {
        const profile = this.screenManager.profileManager.getProfile();
        const position = this.playerCar.position;
        const totalCars = this.cars.length;

        // Base reward por posição
        let baseReward = 0;
        switch (position) {
            case 1: baseReward = 1000; break;
            case 2: baseReward = 700; break;
            case 3: baseReward = 500; break;
            case 4: baseReward = 300; break;
            default: baseReward = 100; break;
        }

        // Multiplicador de dificuldade
        const difficultyMultiplier = {
            easy: 0.7,
            medium: 1.0,
            hard: 1.5
        }[this.difficulty] || 1.0;

        // Bônus por carro intacto
        const healthBonus = (this.carHealth / 100) * 500;

        // Penalidade por dano
        const damagePenalty = ((100 - this.carHealth) / 100) * 300;

        // Bônus por achievements
        let achievementBonus = 0;
        const achievements = this.checkAchievements();

        achievements.forEach(achievement => {
            if (achievement.reward) {
                achievementBonus += achievement.reward;
            }
        });

        // Cálculo final
        let totalReward = Math.max(0,
            (baseReward * difficultyMultiplier) +
            healthBonus -
            damagePenalty +
            achievementBonus
        );

        // Arredondar
        totalReward = Math.round(totalReward);

        // Salvar recompensa
        profile.money += totalReward;
        profile.stats.races++;
        if (position === 1) profile.stats.wins++;
        profile.stats.totalMoneyEarned += totalReward;
        profile.stats.totalDamage += (100 - this.carHealth);

        // XP por corrida
        const xpEarned = position === 1 ? 50 : 20;
        profile.xp += xpEarned;

        // Level up
        if (profile.xp >= 100) {
            profile.level++;
            profile.xp -= 100;
            this.showNotification(`LEVEL UP! Nível ${profile.level}`, 'levelup');
        }

        this.screenManager.profileManager.saveProfile(profile);

        // Salvar reward para exibir
        this.raceReward = {
            base: baseReward,
            difficultyMultiplier: difficultyMultiplier,
            healthBonus: Math.round(healthBonus),
            damagePenalty: Math.round(damagePenalty),
            achievementBonus: achievementBonus,
            total: totalReward,
            xp: xpEarned
        };
    }

    checkAchievements() {
        const achievements = [];

        // Primeira vitória
        if (this.playerCar.position === 1) {
            achievements.push({
                id: 'first_win',
                title: 'Primeira Vitória!',
                description: 'Ganhou sua primeira corrida',
                reward: 200
            });
        }

        // Sem colisões
        if (this.raceStats.collisions === 0 && this.carHealth > 90) {
            achievements.push({
                id: 'clean_race',
                title: 'Corrida Limpa',
                description: 'Completou a corrida sem colisões',
                reward: 100
            });
        }

        // Uso máximo de nitro
        if (this.raceStats.nitroUsed > 80) {
            achievements.push({
                id: 'nitro_king',
                title: 'Rei do Nitro',
                description: 'Usou mais de 80% do nitro',
                reward: 50
            });
        }

        // Velocidade alta
        if (this.raceStats.topSpeed > 180) {
            achievements.push({
                id: 'speed_demon',
                title: 'Demônio da Velocidade',
                description: 'Alcançou mais de 180 km/h',
                reward: 75
            });
        }

        // Muitos power-ups
        if (this.raceStats.powerUpsCollected >= 3) {
            achievements.push({
                id: 'collector',
                title: 'Colecionador',
                description: 'Coletou 3 ou mais power-ups',
                reward: 60
            });
        }

        return achievements;
    }

    showResultsScreen() {
        this.uiElements.resultsScreen.classList.remove('hidden');

        // Atualizar estatísticas
        this.uiElements.resultsScreen.querySelector('.position').textContent =
            `${this.playerCar.position}º`;

        this.uiElements.resultsScreen.querySelector('.time').textContent =
            this.formatTime(this.raceTime);

        this.uiElements.resultsScreen.querySelector('.top-speed').textContent =
            `${Math.round(this.raceStats.topSpeed)} km/h`;

        this.uiElements.resultsScreen.querySelector('.damage').textContent =
            `${Math.round(100 - this.carHealth)}%`;

        this.uiElements.resultsScreen.querySelector('.collisions').textContent =
            this.raceStats.collisions;

        this.uiElements.resultsScreen.querySelector('.money').textContent =
            `$${this.raceReward.total}`;

        // Mostrar achievements
        const achievements = this.checkAchievements();
        const achievementsList = this.uiElements.resultsScreen.querySelector('.achievements-list');
        achievementsList.innerHTML = '';

        if (achievements.length > 0) {
            achievements.forEach(achievement => {
                const div = document.createElement('div');
                div.className = 'achievement-item';
                div.innerHTML = `
                    <div class="achievement-icon">🏆</div>
                    <div class="achievement-info">
                        <div class="achievement-title">${achievement.title}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                    </div>
                    <div class="achievement-reward">+$${achievement.reward}</div>
                `;
                achievementsList.appendChild(div);
            });
        } else {
            achievementsList.innerHTML = '<div class="no-achievements">Nenhuma conquista desta vez</div>';
        }
    }

    activateNitro() {
        if (!this.nitroActive && this.nitroAmount > 0) {
            this.nitroActive = true;
            this.sounds.nitro.play();

            // Efeitos visuais
            for (let i = 0; i < 10; i++) {
                this.createParticle(
                    this.playerCar.x + this.playerCar.width / 2,
                    this.playerCar.y + this.playerCar.height,
                    '#f1c40f',
                    Math.random() * 10 - 15,
                    Math.random() * 5 - 2.5,
                    0.5
                );
            }
        }
    }

    deactivateNitro() {
        if (this.nitroActive) {
            this.nitroActive = false;
            this.sounds.nitro.stop();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        this.uiElements.notifications.appendChild(notification);

        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 10);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    updateUI() {
        if (!this.isActive) return;

        // Timer
        this.uiElements.timer.textContent = this.formatTime(this.raceTime);

        // Distância
        this.uiElements.distance.textContent =
            `${this.distanceTraveled.toFixed(1)} / ${this.raceLength.toFixed(1)} km`;

        // Posição
        this.uiElements.position.textContent =
            `POS: ${this.playerCar.position}/${this.cars.length}`;

        // Velocidade
        const speedKmh = this.currentSpeed * 3.6;
        this.uiElements.speedValue.textContent = Math.round(speedKmh);

        // Barra de velocidade
        const speedPercent = Math.min(100, (speedKmh / this.playerCar.maxSpeed) * 100);
        this.uiElements.speedFill.style.width = `${speedPercent}%`;

        // RPM
        const rpmPercent = Math.min(100, (this.rpm / 8000) * 100);
        this.uiElements.rpmFill.style.width = `${rpmPercent}%`;

        // Marcha
        this.uiElements.gearDisplay.textContent = this.gear;

        // Saúde
        this.uiElements.healthFill.style.width = `${this.carHealth}%`;
        this.uiElements.healthText.textContent = `${Math.round(this.carHealth)}%`;

        // Nitro
        this.uiElements.nitroFill.style.width = `${this.nitroAmount}%`;
        this.uiElements.nitroText.textContent = `${Math.round(this.nitroAmount)}%`;

        // Escudo
        if (this.shieldActive) {
            this.uiElements.shieldTimer.textContent = `${this.shieldTime.toFixed(1)}s`;
            this.uiElements.shieldTimer.parentElement.classList.add('active');
        } else {
            this.uiElements.shieldTimer.parentElement.classList.remove('active');
        }

        // Lista de posições
        this.updatePositionsList();

        // Mapa minimizado
        this.renderMiniMap();
    }

    updatePositionsList() {
        let html = '';
        this.cars.forEach(car => {
            const isPlayer = car === this.playerCar;
            html += `
                <div class="position-item ${isPlayer ? 'player' : ''}">
                    <div class="position-rank">${car.position}º</div>
                    <div class="position-name">${car.name}</div>
                    <div class="position-distance">${car.distance.toFixed(2)} km</div>
                    <div class="position-health">
                        <div class="position-health-bar" style="width: ${car.health}%"></div>
                    </div>
                </div>
            `;
        });

        this.uiElements.positionsList.innerHTML = html;
    }

    render() {
        if (!this.ctx) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Limpar canvas com efeito de screen shake
        const shakeX = this.screenShake > 0 ? Math.random() * 10 - 5 : 0;
        const shakeY = this.screenShake > 0 ? Math.random() * 10 - 5 : 0;

        ctx.save();
        ctx.translate(shakeX, shakeY);

        // Fundo baseado no clima
        this.drawBackground(ctx, width, height);

        // Desenhar pista
        this.drawTrack(ctx, width, height);

        // Desenhar power-ups
        if (this.powerUps) {
            this.powerUps.forEach(powerUp => {
                if (!powerUp.collected) {
                    this.drawPowerUp(ctx, powerUp);
                }
            });
        }

        // Desenhar carros
        this.cars.forEach(car => {
            this.drawCar(ctx, car);
        });

        // Desenhar partículas
        this.particles.forEach(particle => {
            this.drawParticle(ctx, particle);
        });

        // Efeitos de clima
        if (this.weather === 'rain') {
            this.drawRain(ctx, width, height);
        }

        ctx.restore();
    }

    drawBackground(ctx, width, height) {
        // Gradiente baseado no horário
        let gradient;
        switch (this.timeOfDay) {
            case 'night':
                gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, '#0c1445');
                gradient.addColorStop(1, '#1a237e');
                break;
            case 'sunset':
                gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, '#ff6b6b');
                gradient.addColorStop(0.5, '#4ecdc4');
                gradient.addColorStop(1, '#556270');
                break;
            default: // day
                gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, '#87CEEB');
                gradient.addColorStop(1, '#E0F7FA');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Nuvens (apenas durante o dia)
        if (this.timeOfDay === 'day') {
            this.drawClouds(ctx, width, height);
        }

        // Estrelas (apenas durante a noite)
        if (this.timeOfDay === 'night') {
            this.drawStars(ctx, width, height);
        }
    }

    drawTrack(ctx, width, height) {
        // Asfalto
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(50, 0, width - 100, height);

        // Faixas da pista (3 faixas)
        const laneWidth = (width - 100) / 3;

        // Linhas divisórias
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 20]);

        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(50 + (laneWidth * i), 0);
            ctx.lineTo(50 + (laneWidth * i), height);
            ctx.stroke();
        }

        ctx.setLineDash([]);

        // Linhas centrais
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 20]);

        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();

        ctx.setLineDash([]);

        // Efeito de velocidade (linhas que se movem)
        if (this.currentSpeed > 10) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;

            const speedLines = Math.floor(this.currentSpeed / 20);
            const lineSpacing = 30;

            for (let i = 0; i < speedLines; i++) {
                const yPos = (Date.now() / 10 + i * lineSpacing) % (height * 2) - height;

                ctx.beginPath();
                ctx.moveTo(75, yPos);
                ctx.lineTo(width - 75, yPos);
                ctx.stroke();
            }
        }
    }

    drawCar(ctx, car) {
        const isPlayer = car === this.playerCar;

        // Corpo do carro
        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, car.y, car.width, car.height);

        // Detalhes do carro
        ctx.fillStyle = '#000';
        ctx.fillRect(car.x + 5, car.y + 10, car.width - 10, 20); // Vidro frontal
        ctx.fillRect(car.x + 5, car.y + car.height - 30, car.width - 10, 20); // Vidro traseiro

        // Rodas
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(car.x - 5, car.y + 20, 5, 30); // Roda esquerda frontal
        ctx.fillRect(car.x + car.width, car.y + 20, 5, 30); // Roda direita frontal
        ctx.fillRect(car.x - 5, car.y + car.height - 50, 5, 30); // Roda esquerda traseira
        ctx.fillRect(car.x + car.width, car.y + car.height - 50, 5, 30); // Roda direita traseira

        // Faróis
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(car.x, car.y + 5, 10, 5); // Farol esquerdo
        ctx.fillRect(car.x + car.width - 10, car.y + 5, 10, 5); // Farol direito

        // Lanternas
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(car.x, car.y + car.height - 10, 10, 5); // Lanterna esquerda
        ctx.fillRect(car.x + car.width - 10, car.y + car.height - 10, 10, 5); // Lanterna direita

        // Nome do jogador
        ctx.fillStyle = isPlayer ? '#2ecc71' : '#e74c3c';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(car.name, car.x + car.width / 2, car.y - 5);

        // Barra de saúde (se danificado)
        if (car.health < 100) {
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(car.x, car.y - 15, car.width * (car.health / 100), 5);

            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(car.x + (car.width * (car.health / 100)), car.y - 15,
                car.width * ((100 - car.health) / 100), 5);
        }

        // Efeito de nitro
        if (isPlayer && this.nitroActive) {
            ctx.fillStyle = 'rgba(241, 196, 15, 0.7)';
            ctx.fillRect(car.x + car.width / 2 - 10, car.y + car.height, 20, 30);
        }

        // Escudo
        if (isPlayer && this.shieldActive) {
            ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(car.x + car.width / 2, car.y + car.height / 2,
                Math.max(car.width, car.height) / 2 + 10, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    drawPowerUp(ctx, powerUp) {
        ctx.save();
        ctx.translate(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);

        // Pulsar efeito
        const pulse = Math.sin(Date.now() / 200) * 5;
        ctx.scale(1 + pulse / 50, 1 + pulse / 50);

        // Fundo
        ctx.fillStyle = powerUp.color;
        ctx.beginPath();
        ctx.arc(0, 0, powerUp.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Borda
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ícone
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(powerUp.icon, 0, 0);

        ctx.restore();
    }

    drawParticle(ctx, particle) {
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawRain(ctx, width, height) {
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
        ctx.lineWidth = 1;

        const rainCount = 100;
        const rainSpeed = this.currentSpeed * 2 + 10;

        for (let i = 0; i < rainCount; i++) {
            const x = (Date.now() / 2 + i * 10) % width;
            const y = (Date.now() / 3 + i * 20) % height;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - rainSpeed * 0.1, y + rainSpeed * 0.3);
            ctx.stroke();
        }
    }

    drawClouds(ctx, width, height) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        // Algumas nuvens em posições fixas com movimento lento
        const cloudPositions = [
            { x: (Date.now() / 50) % (width * 2) - width, y: 50 },
            { x: (Date.now() / 70 + 200) % (width * 2) - width, y: 100 },
            { x: (Date.now() / 90 + 400) % (width * 2) - width, y: 150 }
        ];

        cloudPositions.forEach(pos => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
            ctx.arc(pos.x + 25, pos.y - 10, 25, 0, Math.PI * 2);
            ctx.arc(pos.x + 50, pos.y, 30, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawStars(ctx, width, height) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        // Estrelas fixas
        for (let i = 0; i < 50; i++) {
            const x = (i * 12345) % width;
            const y = (i * 6789) % (height / 2);
            const size = (i % 3) + 1;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    renderMiniMap() {
        const canvas = this.uiElements.miniMapCanvas;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Limpar
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, width, height);

        // Desenhar pista simplificada
        ctx.fillStyle = '#34495e';
        ctx.fillRect(20, 0, width - 40, height);

        // Desenhar carros no mapa
        this.cars.forEach((car, index) => {
            const isPlayer = car === this.playerCar;

            // Posição no mapa (baseado na distância)
            const mapX = 20 + ((car.x - 50) / (this.canvas.width - 100)) * (width - 40);
            const mapY = (car.distance / this.raceLength) * height;

            ctx.fillStyle = isPlayer ? '#2ecc71' : '#e74c3c';
            ctx.fillRect(mapX - 3, mapY - 3, 6, 6);

            // Nome apenas do jogador
            if (isPlayer) {
                ctx.fillStyle = '#fff';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Você', mapX, mapY - 8);
            }
        });

        // Linha de chegada
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, 10);
        ctx.lineTo(width - 20, 10);
        ctx.stroke();

        ctx.fillStyle = '#f1c40f';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CHEGADA', width / 2, 25);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);

        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }

    togglePause() {
        if (!this.raceStarted || this.isRaceFinished) return;

        this.isPaused = !this.isPaused;
        this.uiElements.pauseScreen.classList.toggle('hidden');

        if (this.isPaused) {
            this.sounds.engine.stop();
        } else {
            this.sounds.engine.play();
        }
    }

    restartRace() {
        // Resetar estado da corrida
        this.hide();
        setTimeout(() => {
            this.show({
                trackType: this.trackType,
                difficulty: this.difficulty,
                length: this.raceLength,
                car: this.playerCar
            });
        }, 100);
    }

    exitRace() {
        this.hide();
        this.screenManager.showScreen('garage');
    }

    cleanup() {
        // Parar sons
        Object.values(this.sounds).forEach(sound => {
            if (sound && typeof sound.stop === 'function') {
                sound.stop();
            }
        });

        // Limpar estado
        this.keys = {};
        this.touchControls = {
            left: false,
            right: false,
            up: false,
            down: false,
            nitro: false
        };

        // Remover modo noturno
        document.body.classList.remove('night-mode');

        // Resetar variáveis
        this.isActive = false;
        this.isPaused = false;
        this.isRaceFinished = false;
        this.raceStarted = false;
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.RaceScreen = RaceScreen;
    console.log('✅ RaceScreen exportado');
}