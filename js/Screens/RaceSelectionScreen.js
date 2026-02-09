// js/RaceSelectionScreen.js
class RaceSelectionScreen {
  constructor() {
    this.name = 'race-selection';
    this.container = null;
    this.selectedTrack = 0;
    this.selectedDifficulty = 'medium';
    this.selectedOpponents = 3;
    this.availableTracks = [];
    this.availableCars = []; // Carros do jogador
    this.opponentCars = [];
  }

  init() {
    console.log("RaceSelectionScreen: Inicializando...");
    this.container = document.getElementById('game-container');
    this.loadTracks();
  }

  loadTracks() {
    // Definir pistas disponíveis
    this.availableTracks = [
      {
        id: 1,
        name: "Downtown Streets",
        description: "Corrida urbana noturna pelas ruas da cidade",
        length: "2.5 km",
        laps: 3,
        difficulty: "easy",
        unlockLevel: 1,
        prize: 500,
        image: "🏙️",
        color: "#4a90e2",
        features: ["Curvas suaves", "Poucos obstáculos", "Iluminação noturna"]
      },
      {
        id: 2,
        name: "Desert Highway",
        description: "Estrada deserta sob o sol escaldante",
        length: "5.0 km",
        laps: 2,
        difficulty: "medium",
        unlockLevel: 2,
        prize: 1000,
        image: "🏜️",
        color: "#f5a623",
        features: ["Longas retas", "Calor extremo", "Visibilidade alta"]
      },
      {
        id: 3,
        name: "Mountain Pass",
        description: "Estrada sinuosa nas montanhas",
        length: "3.8 km",
        laps: 3,
        difficulty: "hard",
        unlockLevel: 3,
        prize: 1500,
        image: "⛰️",
        color: "#7ed321",
        features: ["Curvas fechadas", "Declives acentuados", "Névoa"]
      },
      {
        id: 4,
        name: "Industrial Zone",
        description: "Área industrial abandonada",
        length: "4.2 km",
        laps: 2,
        difficulty: "medium",
        unlockLevel: 4,
        prize: 1200,
        image: "🏭",
        color: "#bd10e0",
        features: ["Obstáculos variados", "Superfície irregular", "Túneis"]
      },
      {
        id: 5,
        name: "Coastal Road",
        description: "Estrada à beira-mar com vista para o oceano",
        length: "6.0 km",
        laps: 1,
        difficulty: "easy",
        unlockLevel: 5,
        prize: 800,
        image: "🌊",
        color: "#50e3c2",
        features: ["Vista panorâmica", "Ventos fortes", "Retas longas"]
      }
    ];
  }

  show(params = {}) {
    console.log("RaceSelectionScreen: Mostrando tela de seleção de corrida");
    
    // Obter perfil atual e carros
    const profile = ProfileManager.getCurrentProfile();
    if (!profile) {
      GameNotifications.show("Nenhum perfil carregado!");
      eventSystem.showScreen('profile-selection');
      return;
    }
    
    this.availableCars = profile.cars || [];
    if (this.availableCars.length === 0) {
      GameNotifications.show("Você precisa de um carro para correr!");
      eventSystem.showScreen('garage');
      return;
    }
    
    // Resetar seleções
    this.selectedTrack = 0;
    this.selectedDifficulty = profile.settings?.difficulty || 'medium';
    this.selectedOpponents = 3;
    
    // Gerar carros oponentes
    this.generateOpponentCars();
    
    // Criar interface
    const selectionHTML = `
      <div class="screen race-selection-screen">
        <div class="screen-header">
          <h1>🏁 SELECIONAR CORRIDA</h1>
          <div class="header-info">
            <div class="player-info">
              <span class="player-name">${profile.name}</span>
              <span class="money">$${profile.money.toFixed(2)}</span>
            </div>
            <button class="btn-back" onclick="eventSystem.showScreen('garage')">← Garagem</button>
          </div>
        </div>
        
        <div class="selection-container">
          <!-- Coluna Esquerda: Pistas Disponíveis -->
          <div class="tracks-column">
            <div class="section-header">
              <h2>📍 PISTAS DISPONÍVEIS</h2>
              <div class="unlocked-info">
                <span class="unlocked-count">${this.getUnlockedTracksCount()}/${this.availableTracks.length}</span>
                <span>pistas liberadas</span>
              </div>
            </div>
            
            <div class="tracks-list" id="tracks-list">
              ${this.generateTracksList()}
            </div>
          </div>
          
          <!-- Coluna Direita: Configurações e Detalhes -->
          <div class="config-column">
            <!-- Detalhes da Pista Selecionada -->
            <div class="track-details-section">
              <h2>📋 DETALHES DA PISTA</h2>
              <div id="track-details">
                ${this.generateTrackDetails()}
              </div>
            </div>
            
            <!-- Configurações da Corrida -->
            <div class="race-config-section">
              <h2>⚙️ CONFIGURAÇÕES</h2>
              
              <div class="config-group">
                <label for="difficulty-select">Dificuldade:</label>
                <select id="difficulty-select" class="config-select" 
                        onchange="window.currentRaceSelection.setDifficulty(this.value)">
                  <option value="easy" ${this.selectedDifficulty === 'easy' ? 'selected' : ''}>Fácil</option>
                  <option value="medium" ${this.selectedDifficulty === 'medium' ? 'selected' : ''}>Médio</option>
                  <option value="hard" ${this.selectedDifficulty === 'hard' ? 'selected' : ''}>Difícil</option>
                  <option value="expert" ${this.selectedDifficulty === 'expert' ? 'selected' : ''}>Especialista</option>
                </select>
              </div>
              
              <div class="config-group">
                <label for="opponents-slider">Oponentes: <span id="opponents-count">${this.selectedOpponents}</span></label>
                <input type="range" id="opponents-slider" min="1" max="7" value="${this.selectedOpponents}"
                       class="config-slider"
                       oninput="window.currentRaceSelection.updateOpponents(this.value)">
                <div class="slider-labels">
                  <span>1</span>
                  <span>3</span>
                  <span>5</span>
                  <span>7</span>
                </div>
              </div>
              
              <div class="config-group">
                <label for="car-select">Seu Carro:</label>
                <select id="car-select" class="config-select"
                        onchange="window.currentRaceSelection.selectCar(this.value)">
                  ${this.generateCarOptions()}
                </select>
              </div>
              
              <div class="prize-info">
                <h3>🏆 RECOMPENSA</h3>
                <div class="prize-amount" id="prize-amount">$0</div>
                <p class="prize-note">+ bônus por colocação e dificuldade</p>
              </div>
            </div>
            
            <!-- Opções de Início -->
            <div class="start-options">
              <button class="btn-quick-race" onclick="window.currentRaceSelection.startQuickRace()">
                🚀 CORRIDA RÁPIDA
                <small>Configurações padrão</small>
              </button>
              
              <button class="btn-start-race" onclick="window.currentRaceSelection.startCustomRace()">
                🏁 INICIAR CORRIDA
                <small>Configurações personalizadas</small>
              </button>
              
              <button class="btn-test-track" onclick="window.currentRaceSelection.testTrack()">
                🔧 TESTAR PISTA
                <small>Prática sem oponentes</small>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Visualização de Oponentes -->
        <div class="opponents-section">
          <h2>🏎️ OPONENTES</h2>
          <div class="opponents-grid" id="opponents-grid">
            ${this.generateOpponentsGrid()}
          </div>
        </div>
      </div>
    `;
    
    this.container.innerHTML = selectionHTML;
    
    // Expor instância atual
    window.currentRaceSelection = this;
    
    // Selecionar primeira pista por padrão
    this.selectTrack(0);
    
    // Atualizar prêmio
    this.updatePrize();
    
    GameNotifications.show("Selecione uma pista e configure sua corrida!");
  }

  generateTracksList() {
    const profile = ProfileManager.getCurrentProfile();
    const playerLevel = profile.level || 1;
    
    return this.availableTracks.map((track, index) => {
      const isUnlocked = track.unlockLevel <= playerLevel;
      const isSelected = index === this.selectedTrack;
      
      return `
        <div class="track-item ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}" 
             onclick="window.currentRaceSelection.selectTrack(${index})">
          <div class="track-icon" style="background: ${track.color}">${track.image}</div>
          <div class="track-info">
            <h4>${track.name}</h4>
            <div class="track-meta">
              <span class="track-length">📏 ${track.length}</span>
              <span class="track-laps">🔄 ${track.laps} voltas</span>
              <span class="track-diff ${track.difficulty}">${this.getDifficultyLabel(track.difficulty)}</span>
            </div>
            ${!isUnlocked ? 
              `<div class="locked-overlay">
                <span class="lock-icon">🔒</span>
                <span>Nível ${track.unlockLevel}+</span>
              </div>` : ''
            }
          </div>
          <div class="track-prize">$${track.prize}</div>
        </div>
      `;
    }).join('');
  }

  generateTrackDetails() {
    if (this.availableTracks.length === 0) {
      return '<p class="no-track">Nenhuma pista selecionada</p>';
    }
    
    const track = this.availableTracks[this.selectedTrack];
    const profile = ProfileManager.getCurrentProfile();
    const isUnlocked = track.unlockLevel <= (profile.level || 1);
    
    return `
      <div class="track-detail-card">
        <div class="track-header">
          <div class="track-icon-large" style="background: ${track.color}">
            ${track.image}
          </div>
          <div class="track-title">
            <h3>${track.name}</h3>
            <div class="track-status ${isUnlocked ? 'unlocked' : 'locked'}">
              ${isUnlocked ? '✅ LIBERADA' : `🔒 NÍVEL ${track.unlockLevel}+ REQUERIDO`}
            </div>
          </div>
        </div>
        
        <p class="track-description">${track.description}</p>
        
        <div class="track-stats">
          <div class="stat">
            <span class="stat-label">Distância:</span>
            <span class="stat-value">${track.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Voltas:</span>
            <span class="stat-value">${track.laps}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Dificuldade:</span>
            <span class="stat-value ${track.difficulty}">${this.getDifficultyLabel(track.difficulty)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Prêmio Base:</span>
            <span class="stat-value">$${track.prize}</span>
          </div>
        </div>
        
        <div class="track-features">
          <h4>✨ Características:</h4>
          <ul>
            ${track.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  generateCarOptions() {
    const profile = ProfileManager.getCurrentProfile();
    const selectedIndex = profile.selectedCarIndex || 0;
    
    return this.availableCars.map((car, index) => {
      return `<option value="${index}" ${index === selectedIndex ? 'selected' : ''}>
                ${car.name} (Nível ${car.level || 1})
              </option>`;
    }).join('');
  }

  generateOpponentsGrid() {
    let html = '';
    
    // Adicionar jogador primeiro
    const profile = ProfileManager.getCurrentProfile();
    const playerCar = this.availableCars[profile.selectedCarIndex || 0];
    
    if (playerCar) {
      html += `
        <div class="opponent-card player">
          <div class="opponent-avatar">👤</div>
          <div class="opponent-info">
            <h4>${profile.name}</h4>
            <p class="opponent-car">${playerCar.name}</p>
            <div class="opponent-level">Você</div>
          </div>
          <div class="opponent-stats">
            <div class="stat">⚡ ${playerCar.performance || 5}</div>
          </div>
        </div>
      `;
    }
    
    // Adicionar oponentes
    for (let i = 0; i < this.selectedOpponents; i++) {
      const opponent = this.opponentCars[i] || this.generateRandomOpponent(i);
      this.opponentCars[i] = opponent;
      
      html += `
        <div class="opponent-card">
          <div class="opponent-avatar">${opponent.avatar}</div>
          <div class="opponent-info">
            <h4>${opponent.name}</h4>
            <p class="opponent-car">${opponent.car}</p>
            <div class="opponent-level">Nível ${opponent.level}</div>
          </div>
          <div class="opponent-stats">
            <div class="stat">⚡ ${opponent.performance}</div>
            <div class="stat">🏆 ${opponent.wins || 0}</div>
          </div>
        </div>
      `;
    }
    
    return html;
  }

  generateRandomOpponent(index) {
    const names = ["Speed Demon", "Road Warrior", "Night Rider", "Turbo Queen", 
                   "Drift King", "Velocity", "Black Thunder", "Red Fury"];
    const cars = ["Muscle Max", "Speedster X", "Drift Pro", "Turbo GT", 
                  "Street Shark", "Road Rocket", "Velocity V12"];
    const avatars = ["👹", "👻", "🤖", "💀", "🐲", "🦅", "🐆", "🦈"];
    
    // Base do nível na pista selecionada
    const track = this.availableTracks[this.selectedTrack];
    const baseLevel = track.difficulty === 'easy' ? 1 : 
                     track.difficulty === 'medium' ? 2 : 3;
    
    return {
      name: names[index % names.length],
      car: cars[index % cars.length],
      avatar: avatars[index % avatars.length],
      level: baseLevel + Math.floor(Math.random() * 3),
      performance: 3 + Math.floor(Math.random() * 7),
      wins: Math.floor(Math.random() * 20)
    };
  }

  getUnlockedTracksCount() {
    const profile = ProfileManager.getCurrentProfile();
    const playerLevel = profile.level || 1;
    return this.availableTracks.filter(track => track.unlockLevel <= playerLevel).length;
  }

  getDifficultyLabel(difficulty) {
    const labels = {
      easy: "Fácil",
      medium: "Médio",
      hard: "Difícil",
      expert: "Especialista"
    };
    return labels[difficulty] || difficulty;
  }

  selectTrack(index) {
    const profile = ProfileManager.getCurrentProfile();
    const track = this.availableTracks[index];
    
    if (track.unlockLevel > (profile.level || 1)) {
      GameNotifications.show(`Pista bloqueada! Alcance o nível ${track.unlockLevel} para desbloquear.`);
      return;
    }
    
    this.selectedTrack = index;
    
    // Atualizar UI
    document.getElementById('tracks-list').innerHTML = this.generateTracksList();
    document.getElementById('track-details').innerHTML = this.generateTrackDetails();
    
    // Regenerar oponentes baseados na nova pista
    this.generateOpponentCars();
    document.getElementById('opponents-grid').innerHTML = this.generateOpponentsGrid();
    
    // Atualizar prêmio
    this.updatePrize();
    
    console.log(`Pista selecionada: ${track.name}`);
  }

  setDifficulty(difficulty) {
    this.selectedDifficulty = difficulty;
    
    // Atualizar perfil
    const profile = ProfileManager.getCurrentProfile();
    if (!profile.settings) profile.settings = {};
    profile.settings.difficulty = difficulty;
    ProfileManager.saveCurrentProfile();
    
    // Atualizar prêmio
    this.updatePrize();
  }

  updateOpponents(count) {
    this.selectedOpponents = parseInt(count);
    document.getElementById('opponents-count').textContent = count;
    
    // Atualizar grid de oponentes
    this.generateOpponentCars();
    document.getElementById('opponents-grid').innerHTML = this.generateOpponentsGrid();
    
    // Atualizar prêmio
    this.updatePrize();
  }

  selectCar(carIndex) {
    const profile = ProfileManager.getCurrentProfile();
    profile.selectedCarIndex = parseInt(carIndex);
    ProfileManager.saveCurrentProfile();
    
    // Atualizar grid de oponentes para mostrar novo carro
    document.getElementById('opponents-grid').innerHTML = this.generateOpponentsGrid();
  }

  generateOpponentCars() {
    this.opponentCars = [];
    for (let i = 0; i < this.selectedOpponents; i++) {
      this.opponentCars.push(this.generateRandomOpponent(i));
    }
  }

  updatePrize() {
    if (this.availableTracks.length === 0) return;
    
    const track = this.availableTracks[this.selectedTrack];
    let prize = track.prize;
    
    // Multiplicadores
    const difficultyMultiplier = {
      easy: 0.8,
      medium: 1.0,
      hard: 1.3,
      expert: 1.7
    };
    
    // Ajustar por dificuldade
    prize *= difficultyMultiplier[this.selectedDifficulty] || 1.0;
    
    // Ajustar por número de oponentes
    prize *= (1 + (this.selectedOpponents - 1) * 0.1);
    
    // Arredondar
    prize = Math.round(prize);
    
    document.getElementById('prize-amount').textContent = `$${prize}`;
  }

  startQuickRace() {
    // Configurações rápidas padrão
    this.selectedDifficulty = 'medium';
    this.selectedOpponents = 3;
    
    // Atualizar UI
    document.getElementById('difficulty-select').value = this.selectedDifficulty;
    document.getElementById('opponents-slider').value = this.selectedOpponents;
    document.getElementById('opponents-count').textContent = this.selectedOpponents;
    
    // Iniciar corrida
    this.startCustomRace();
  }

  startCustomRace() {
    const profile = ProfileManager.getCurrentProfile();
    const track = this.availableTracks[this.selectedTrack];
    
    // Verificar se pista está liberada
    if (track.unlockLevel > (profile.level || 1)) {
      GameNotifications.show(`Pista bloqueada! Alcance o nível ${track.unlockLevel}.`);
      return;
    }
    
    // Preparar dados da corrida
    const raceData = {
      track: track,
      difficulty: this.selectedDifficulty,
      opponentCount: this.selectedOpponents,
      opponents: this.opponentCars,
      playerCarIndex: profile.selectedCarIndex || 0,
      prize: this.calculateFinalPrize()
    };
    
    console.log("Iniciando corrida com:", raceData);
    GameNotifications.show(`Iniciando ${track.name}...`);
    
    // Salvar configurações da corrida globalmente
    window.currentRaceData = raceData;
    
    // Ir para tela de corrida
    setTimeout(() => {
      eventSystem.showScreen('race', raceData);
    }, 1000);
  }

  testTrack() {
    const track = this.availableTracks[this.selectedTrack];
    const profile = ProfileManager.getCurrentProfile();
    
    if (track.unlockLevel > (profile.level || 1)) {
      GameNotifications.show(`Pista bloqueada para teste!`);
      return;
    }
    
    const raceData = {
      track: track,
      difficulty: 'easy',
      opponentCount: 0,
      opponents: [],
      playerCarIndex: profile.selectedCarIndex || 0,
      prize: 0,
      isTest: true
    };
    
    GameNotifications.show(`Modo teste: ${track.name}`);
    window.currentRaceData = raceData;
    
    setTimeout(() => {
      eventSystem.showScreen('race', raceData);
    }, 800);
  }

  calculateFinalPrize() {
    const track = this.availableTracks[this.selectedTrack];
    let prize = track.prize;
    
    const difficultyMultiplier = {
      easy: 0.8,
      medium: 1.0,
      hard: 1.3,
      expert: 1.7
    };
    
    prize *= difficultyMultiplier[this.selectedDifficulty] || 1.0;
    prize *= (1 + (this.selectedOpponents - 1) * 0.1);
    
    return Math.round(prize);
  }

  hide() {
    console.log("RaceSelectionScreen: Escondendo");
    window.currentRaceSelection = null;
    
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Registrar a tela
window.RaceSelectionScreen = RaceSelectionScreen;
console.log("✅ RaceSelectionScreen registrada!");