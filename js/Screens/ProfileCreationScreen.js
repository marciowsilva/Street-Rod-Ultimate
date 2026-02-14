// ProfileCreationScreen.js - VERSÃO PREMIUM HUD
console.log("🆕 [ProfileCreationScreen] Carregando versão visual premium...");

class ProfileCreationScreen {
  constructor() {
    this.screenId = "profile-creation";
  }

  initialize() {
    console.log("🆕 [ProfileCreationScreen] Inicializando HUD premium...");
    this.createScreen();
    this.attachEvents();
    return true;
  }

  createScreen() {
    const container = document.getElementById("game-container");
    if (!container) return;

    container.innerHTML = `
            <div id="pc-container" class="ps-root">
                <div class="ps-glass-overlay"></div>
                
                <header class="ps-header anim-fade-down" style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                    <h1 class="ps-game-title">STREET ROD <span class="ps-accent-text">II</span></h1>
                    <p class="ps-game-subtitle">CADASTRO DE NOVO PILOTO</p>
                </header>
                
                <main class="ps-profiles-section anim-fade-up" style="max-width: 900px; flex: 0 1 auto; margin-top: 20px;">
                    <div class="ps-section-header">
                        <h2><span class="ps-icon">👤</span> IDENTIDADE DO PILOTO</h2>
                        <div id="pc-load-progress" class="ps-badge">STATUS: AGUARDANDO</div>
                    </div>
                    
                    <div class="pc-creation-layout">
                        <!-- COLUNA 1: FORMULÁRIO -->
                        <div class="pc-form-side">
                            <div class="pc-field-group">
                                <label class="ps-stat-label" style="font-size: 0.8rem; margin-bottom: 10px; display: block;">NOME DO PILOTO:</label>
                                <input type="text" id="profile-name" class="ps-pilot-name" 
                                       placeholder="EX: SPEED_KING" maxlength="12" autocomplete="off"
                                       style="width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 15px 20px; color: white; font-family: inherit; font-size: 1.5rem;">
                                <div id="name-error" class="pc-error-msg"></div>
                            </div>

                            <div class="pc-field-group" style="margin-top: 30px;">
                                <label class="ps-stat-label" style="font-size: 0.8rem; margin-bottom: 15px; display: block;">NÍVEL DE EXPERIÊNCIA:</label>
                                <div class="pc-diff-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                                    <div class="ps-profile-card pc-diff-card" data-difficulty="easy">
                                        <div class="ps-level-tag">STREET</div>
                                        <div class="ps-stat-label">FÁCIL</div>
                                    </div>
                                    <div class="ps-profile-card pc-diff-card active" data-difficulty="normal">
                                        <div class="ps-level-tag">PRO</div>
                                        <div class="ps-stat-label">NORMAL</div>
                                    </div>
                                    <div class="ps-profile-card pc-diff-card" data-difficulty="hard">
                                        <div class="ps-level-tag">ELITE</div>
                                        <div class="ps-stat-label">DIFÍCIL</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- COLUNA 2: RESUMO -->
                        <div class="pc-summary-side">
                            <div class="ps-profile-card pc-status-card" style="cursor: default; height: 100%; min-width: auto; display: flex; flex-direction: column;">
                                <div class="ps-active-indicator" id="pc-clock">00:00:00</div>
                                <div class="ps-card-header">
                                    <div id="summary-name" class="ps-pilot-name" style="font-size: 1.4rem;">AGUARDANDO...</div>
                                    <div id="summary-difficulty" class="ps-level-tag">FIXANDO NÍVEL</div>
                                </div>
                                <div class="ps-card-stats-grid" style="grid-template-columns: 1fr;">
                                    <div class="ps-stat-item">
                                        <span class="ps-stat-label">ORÇAMENTO INICIAL</span>
                                        <span id="summary-cash" class="ps-stat-value ps-money" style="font-size: 1.8rem;">$0</span>
                                    </div>
                                </div>
                                <div style="margin-top: auto; padding-top: 25px;">
                                    <button id="create-btn" class="ps-btn-primary" style="width: 100%; justify-content: center;">CONFIRMAR CADASTRO</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                
                <footer class="ps-screen-footer anim-fade-up-alt">
                    <div class="ps-secondary-actions">
                        <button id="randomize-btn" class="ps-btn-secondary" style="display: flex; align-items: center; gap: 8px;">
                            <span>🎲</span> ALEATÓRIO
                        </button>
                        <button id="cancel-btn" class="ps-btn-secondary" style="display: flex; align-items: center; gap: 8px;">
                            <span>✖</span> CANCELAR
                        </button>
                    </div>
                </footer>
            </div>
        `;

    this.addStyles();
    this.updateSummary();
  }

  addStyles() {
    const oldStyle = document.getElementById("pc-premium-styles-v2");
    if (oldStyle) oldStyle.remove();
    const styleId = "pc-standard-styles-v4";
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) existingStyle.remove();

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
            #pc-container.ps-root {
                height: 100vh;
                background: url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070') center/cover no-repeat;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                overflow: hidden;
                font-family: 'Rajdhani', sans-serif;
            }

            #pc-container .ps-glass-overlay {
                position: absolute;
                inset: 0;
                background: radial-gradient(circle at center, rgba(10, 10, 20, 0.7) 0%, rgba(5, 5, 10, 0.95) 100%);
                backdrop-filter: blur(10px);
                z-index: 0;
            }

            #pc-container .ps-header, 
            #pc-container .ps-profiles-section, 
            #pc-container .ps-screen-footer {
                position: relative;
                z-index: 1;
            }

            #pc-container .ps-header {
                padding: 40px 0 20px;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
            }

            #pc-container .ps-game-title {
                font-size: 4rem;
                font-weight: 800;
                letter-spacing: 8px;
                margin: 0;
                color: white;
                text-shadow: 0 0 30px rgba(255, 71, 87, 0.5);
            }
            #pc-container .ps-accent-text { color: #ff4757; }
            #pc-container .ps-game-subtitle {
                color: #aaa;
                font-size: 1.2rem;
                letter-spacing: 4px;
                margin-top: 5px;
                font-weight: 500;
            }

            #pc-container .ps-profiles-section {
                flex: 0 1 auto;
                width: 90%;
                max-width: 950px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 35px;
                display: flex;
                flex-direction: column;
                backdrop-filter: blur(5px);
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                margin: 15px 0;
            }

            #pc-container .pc-creation-layout {
                display: grid;
                grid-template-columns: 1fr 340px;
                gap: 45px;
                padding: 10px 0;
                align-items: stretch;
            }

            #pc-container .pc-field-group { margin-bottom: 30px; }
            
            #pc-container .ps-pilot-name#profile-name {
                width: 100%;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 18px 25px;
                color: #fff;
                font-family: inherit;
                font-size: 1.6rem;
                margin-top: 10px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
            }
            #pc-container .ps-pilot-name#profile-name:focus {
                outline: none;
                border-color: #ff4757;
                background: rgba(255, 71, 87, 0.05);
                box-shadow: 0 0 20px rgba(255, 71, 87, 0.1), inset 0 2px 10px rgba(0,0,0,0.5);
            }

            #pc-container .pc-diff-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-top: 15px;
            }

            #pc-container .pc-diff-card {
                padding: 20px 15px;
                min-width: unset;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            #pc-container .pc-diff-card:hover {
                background: rgba(255, 255, 255, 0.05);
                transform: translateY(-3px);
            }
            #pc-container .pc-diff-card.active {
                border-color: #ff4757;
                background: rgba(255, 71, 87, 0.1);
                box-shadow: 0 10px 30px rgba(255, 71, 87, 0.15);
                transform: translateY(-5px);
            }
            #pc-container .pc-diff-card.active .ps-level-tag {
                background: #ff4757;
                color: #fff;
            }

            #pc-container .pc-status-card {
                cursor: default;
                height: 100%;
                display: flex;
                flex-direction: column;
                min-width: unset;
                border-color: rgba(255, 255, 255, 0.1);
            }

            #pc-container .pc-error-msg {
                color: #ff4757;
                font-size: 0.75rem;
                font-weight: 700;
                margin-top: 10px;
                height: 15px;
                letter-spacing: 1px;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            /* REPRODUZIR ELEMENTOS DA SELEÇÃO */
            #pc-container .ps-level-tag {
                display: inline-block;
                padding: 4px 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                font-size: 0.7rem;
                font-weight: 700;
                letter-spacing: 1px;
                margin-bottom: 10px;
            }
            #pc-container .ps-stat-label { color: #888; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; }
            #pc-container .ps-stat-value { color: #fff; font-size: 1.1rem; font-weight: 700; }
            #pc-container .ps-card-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
            #pc-container .ps-active-indicator { color: #ff4757; font-size: 0.8rem; font-weight: 800; margin-bottom: 10px; }
            #pc-container .ps-btn-primary { 
                background: #ff4757; color: white; border: none; padding: 15px 30px; border-radius: 12px;
                font-family: inherit; font-weight: 800; cursor: pointer; transition: 0.3s;
            }
            #pc-container .ps-btn-secondary {
                background: rgba(255, 255, 255, 0.05); color: white; border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 12px 20px; border-radius: 10px; cursor: pointer; transition: 0.3s;
                font-family: inherit; font-weight: 700; font-size: 0.85rem;
            }
            #pc-container .ps-btn-secondary:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); }
            #pc-container .ps-secondary-actions { display: flex; gap: 15px; padding: 15px 0; justify-content: center; width: 100%; }

            @media (max-width: 950px) {
                #pc-container .pc-creation-layout { grid-template-columns: 1fr; }
                #pc-container .ps-profiles-section { width: 95%; padding: 20px; }
                #pc-container .pc-status-card { min-height: 250px; }
            }
        `;

    document.head.appendChild(style);
  }

  attachEvents() {
    const nameInput = document.getElementById("profile-name");
    if (nameInput) {
      nameInput.addEventListener("input", () => this.updateSummary());
    }

    document.querySelectorAll(".pc-diff-card").forEach((card) => {
      card.addEventListener("click", () => {
        document
          .querySelectorAll(".pc-diff-card")
          .forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        this.updateSummary();
      });
    });

    document
      .getElementById("create-btn")
      ?.addEventListener("click", () => this.createProfile());
    document.getElementById("cancel-btn")?.addEventListener("click", () => {
      window.eventSystem.showScreen("profile-selection");
    });
    document
      .getElementById("randomize-btn")
      ?.addEventListener("click", () => this.randomizeProfile());

    this.startHudClock();
  }

  startHudClock() {
    const clockEl = document.getElementById("pc-clock");
    if (!clockEl) return;
    const update = () => {
      clockEl.textContent = new Date().toLocaleTimeString("pt-BR", {
        hour12: false,
      });
    };
    update();
    setInterval(update, 1000);
  }

  updateSummary() {
    const name = document.getElementById("profile-name")?.value.trim() || "";
    const summaryName = document.getElementById("summary-name");
    if (summaryName)
      summaryName.textContent = name ? name.toUpperCase() : "AGUARDANDO...";

    const activeDiff = document.querySelector(".pc-diff-card.active");
    const diff = activeDiff?.dataset.difficulty || "normal";
    const diffNames = {
      easy: "STREET / FÁCIL",
      normal: "PRO / NORMAL",
      hard: "ELITE / DIFÍCIL",
    };

    const summaryDiff = document.getElementById("summary-difficulty");
    if (summaryDiff) summaryDiff.textContent = diffNames[diff];

    const summaryCash = document.getElementById("summary-cash");
    if (summaryCash) {
      const cashMap = { easy: 30000, normal: 25000, hard: 18000 };
      const cash = cashMap[diff] || 25000;
      summaryCash.textContent = `$${cash.toLocaleString()}`;
    }

    const loadProgress = document.getElementById("pc-load-progress");
    if (loadProgress) {
      loadProgress.textContent =
        name.length > 0 ? "STATUS: PRONTO" : "STATUS: AGUARDANDO";
      loadProgress.className = name.length > 0 ? "ps-badge active" : "ps-badge";
    }
  }

  randomizeProfile() {
    const names = ["ZERO_K00L", "CYPHER", "REBEL", "GHOST", "BLADE", "NEON"];
    const input = document.getElementById("profile-name");
    if (input) {
      input.value = names[Math.floor(Math.random() * names.length)];
      this.updateSummary();
    }
  }

  createProfile() {
    const nameInput = document.getElementById("profile-name");
    const name = nameInput?.value.trim() || "";

    if (!name) {
      const error = document.getElementById("name-error");
      if (error) {
        error.textContent = "✖ PROTOCOLO_NEGADO: IDENTIDADE_AUSENTE";
        setTimeout(() => (error.textContent = ""), 3000);
      }
      return;
    }

    const diff =
      document.querySelector(".pc-diff-card.active")?.dataset.difficulty ||
      "normal";
    const cashMap = { easy: 30000, normal: 25000, hard: 18000 };
    const cash = cashMap[diff] || 25000;

    const profileData = {
      name,
      level: 1,
      cash: cash,
      money: cash,
      difficulty: diff,
      vehicles: [],
      cars: [],
      created: new Date().toISOString(),
      stats: { races: 0, wins: 0 },
    };

    if (window.profileManager?.createProfile(name, profileData)) {
      window.profileManager.selectProfile(name);
      if (window.eventSystem) window.eventSystem.setCurrentProfile(profileData);
      window.eventSystem.showScreen("main-menu");
    }
  }

  cancelCreation() {
    window.eventSystem.showScreen("profile-selection");
  }
}

if (typeof window !== "undefined") {
  window.profileCreationScreen = new ProfileCreationScreen();
  window.ProfileCreationScreen = ProfileCreationScreen;
}
