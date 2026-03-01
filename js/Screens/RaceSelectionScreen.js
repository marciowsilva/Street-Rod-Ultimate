// RaceSelectionScreen.js - VERSÃO PREMIUM HUD
class RaceSelectionScreen {
  constructor() {
    this.screenId = "race-selection";
    this.selectedTrack = 0;
    this.selectedDifficulty = "normal";
    this.selectedOpponents = 3;
    this.tracks = this.getTracks();
  }

  getTracks() {
    return [
      {
        id: "drag-strip",
        name: "DRAG STRIP CLÁSSICA",
        desc: "Reta de 1/4 de milha tradicional sob o asfalto quente.",
        length: 1000,
        prize: 500,
        image:
          "https://images.unsplash.com/photo-1594145070208-89c096417755?auto=format&fit=crop&q=80&w=1000",
        difficulty: "easy",
      },
      {
        id: "neon-highway",
        name: "NEON HIGHWAY",
        desc: "Corrida ilegal noturna em uma rodovia iluminada por neon.",
        length: 2000,
        prize: 1200,
        image:
          "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1000",
        difficulty: "medium",
      },
      {
        id: "industrial-bay",
        name: "INDUSTRIAL BAY",
        desc: "Zona portuária com muitas curvas e perigos.",
        length: 1500,
        prize: 2500,
        image:
          "https://images.unsplash.com/photo-1541443131876-17586b5da522?auto=format&fit=crop&q=80&w=1000",
        difficulty: "hard",
      },
    ];
  }

  show(data = {}) {
    this.profile = window.profileManager?.getCurrentProfile();
    if (!this.profile) {
      if (window.eventSystem)
        window.eventSystem.showScreen("profile-selection");
      return;
    }

    this.render();
    this.attachEvents();
  }

  render() {
    const container = document.getElementById("game-container");
    if (!container) return;

    const track = this.tracks[this.selectedTrack];
    const playerCar = this.profile.vehicles ? this.profile.vehicles[0] : null;

    container.innerHTML = `
        <div id="rs-container" class="ps-root" style="
            background: #05050a;
            height: 100vh;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            font-family: 'Rajdhani', sans-serif;
            color: #white;
        ">
            <!-- Background Layer -->
            <div id="rs-bg" style="
                position: absolute;
                inset: 0;
                background: url('${track.image}') center/cover no-repeat;
                opacity: 0.3;
                filter: blur(5px);
                z-index: 0;
                transition: 0.8s ease-in-out;
            "></div>

            <div class="ps-header anim-fade-down" style="position: relative; z-index: 10; padding: 40px 0 20px; text-align: center;">
                <h1 class="ps-game-title" style="font-size: 3.5rem; font-weight: 800; letter-spacing: 10px; margin: 0; text-shadow: 0 0 30px rgba(255, 71, 87, 0.4);">
                    EVENTOS DE <span class="ps-accent-text" style="color: #ff4757;">RUA</span>
                </h1>
                <p class="ps-game-subtitle" style="color: #aaa; font-size: 1rem; letter-spacing: 5px; margin-top: 5px; text-transform: uppercase;">ESCOLHA SEU DESAFIO</p>
            </div>

            <main style="position: relative; z-index: 10; flex: 1; display: flex; padding: 20px 50px; gap: 30px; overflow: hidden;">
                
                <!-- TRACK SELECTOR -->
                <section class="rs-track-list anim-fade-right" style="flex: 1; overflow-y: auto; padding-right: 15px;">
                    <h2 style="font-size: 1.2rem; color: #ff4757; letter-spacing: 2px; margin-bottom: 20px;">LOCAIS DISPONÍVEIS</h2>
                    ${this.tracks
                      .map(
                        (t, idx) => `
                        <div class="rs-track-card ${this.selectedTrack === idx ? "active" : ""}" data-index="${idx}">
                            <div class="rs-card-img" style="background-image: url('${t.image}')"></div>
                            <div class="rs-card-info">
                                <h3>${t.name}</h3>
                                <div class="rs-card-meta">
                                    <span class="diff ${t.difficulty}">${t.difficulty.toUpperCase()}</span>
                                    <span>${t.length}M</span>
                                </div>
                            </div>
                            <div class="rs-card-prize">$${t.prize.toLocaleString()}</div>
                        </div>
                    `,
                      )
                      .join("")}
                </section>

                <!-- TRACK DETAILS & CONFIG -->
                <section class="rs-config-panel anim-fade-up" style="flex: 2; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 40px; backdrop-filter: blur(10px); display: flex; flex-direction: column; gap: 30px;">
                    <div style="display: flex; gap: 40px;">
                        <div style="flex: 1;">
                            <h2 style="font-size: 2.2rem; font-weight: 800; margin: 0; color: #fff;">${track.name}</h2>
                            <p style="color: #888; margin: 10px 0 20px; line-height: 1.6;">${track.desc}</p>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div class="rs-stat">
                                    <span class="label">PRÊMIO ESTIMADO</span>
                                    <span class="val" style="color: #2ed573;">$${this.calculatePrize().toLocaleString()}</span>
                                </div>
                                <div class="rs-stat">
                                    <span class="label">RECORD DA PISTA</span>
                                    <span class="val">09.42s</span>
                                </div>
                            </div>
                        </div>

                        <div style="flex: 1;">
                            <h3 style="font-size: 1rem; color: #aaa; letter-spacing: 2px; margin-bottom: 20px;">CONFIGURAÇÕES DA PROVA</h3>
                            
                            <div class="rs-ctrl-row">
                                <span class="label">DIFICULDADE</span>
                                <div class="rs-select-grp">
                                    <button class="rs-opt ${this.selectedDifficulty === "easy" ? "active" : ""}" data-val="easy">FÁCIL</button>
                                    <button class="rs-opt ${this.selectedDifficulty === "normal" ? "active" : ""}" data-val="normal">MÉDIO</button>
                                    <button class="rs-opt ${this.selectedDifficulty === "hard" ? "active" : ""}" data-val="hard">DIFÍCIL</button>
                                </div>
                            </div>

                            <div class="rs-ctrl-row" style="margin-top: 20px;">
                                <span class="label">ADVERSÁRIOS: <b id="opp-count-display">${this.selectedOpponents}</b></span>
                                <input type="range" class="rs-range" id="opp-range" min="1" max="5" value="${this.selectedOpponents}">
                            </div>
                        </div>
                    </div>

                    <!-- FOOTER OPTIONS -->
                    <div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                        <div class="rs-player-car-hud" style="display: flex; align-items: center; gap: 15px;">
                            <div style="width: 80px; height: 50px; background: rgba(255,255,255,0.05); border-radius: 8px; background-size: cover;"></div>
                            <div>
                                <span style="display: block; font-size: 0.7rem; color: #666; font-weight: 700; letter-spacing: 1px;">CARRO ATUAL</span>
                                <span style="font-weight: 800; color: #fff;">${playerCar ? playerCar.name : "NENHUM CARRO"}</span>
                            </div>
                        </div>

                        <div style="display: flex; gap: 15px;">
                            <button id="rs-back-btn" class="rs-btn-ghost">VOLTAR</button>
                            <button id="rs-start-btn" class="rs-btn-prime">INICIAR CORRIDA 🏁</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    `;

    this.addStyles();
  }

  addStyles() {
    const styleId = "rs-premium-styles";
    if (document.getElementById(styleId))
      document.getElementById(styleId).remove();

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
        .rs-track-card {
            display: flex; align-items: center; gap: 15px; padding: 15px;
            background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px; margin-bottom: 15px; cursor: pointer; transition: 0.3s;
        }
        .rs-track-card:hover { background: rgba(255, 255, 255, 0.06); transform: translateX(5px); }
        .rs-track-card.active { background: rgba(255, 71, 87, 0.1); border-color: #ff4757; box-shadow: 0 0 20px rgba(255, 71, 87, 0.2); }

        .rs-card-img { width: 100px; height: 60px; border-radius: 8px; background-size: cover; background-position: center; }
        .rs-card-info { flex: 1; }
        .rs-card-info h3 { margin: 0; font-size: 1.1rem; color: #fff; font-weight: 700; letter-spacing: 1px; }
        .rs-card-meta { display: flex; gap: 10px; margin-top: 5px; }
        .rs-card-meta span { font-size: 0.7rem; font-weight: 800; color: #666; }
        .rs-card-meta .diff.easy { color: #2ed573; }
        .rs-card-meta .diff.medium { color: #f1c40f; }
        .rs-card-meta .diff.hard { color: #ff4757; }

        .rs-card-prize { font-weight: 900; color: #2ed573; font-size: 1.2rem; }

        .rs-stat .label { display: block; font-size: 0.7rem; color: #666; font-weight: 700; letter-spacing: 2px; margin-bottom: 5px; }
        .rs-stat .val { display: block; font-size: 1.6rem; font-weight: 800; color: #fff; }

        .rs-ctrl-row .label { display: block; font-size: 0.8rem; color: #aaa; font-weight: 700; letter-spacing: 2px; margin-bottom: 12px; }
        
        .rs-select-grp { display: flex; gap: 5px; background: rgba(0, 0, 0, 0.2); padding: 5px; border-radius: 8px; }
        .rs-opt { 
            flex: 1; border: none; background: transparent; color: #666; padding: 10px; 
            font-family: inherit; font-weight: 800; font-size: 0.75rem; border-radius: 6px; cursor: pointer; transition: 0.2s;
        }
        .rs-opt.active { background: #ff4757; color: #fff; box-shadow: 0 0 15px rgba(255, 71, 87, 0.3); }

        .rs-range { -webkit-appearance: none; width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 5px; }
        .rs-range::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; background: #ff4757; border-radius: 50%; cursor: pointer; }

        .rs-btn-prime {
            background: #ff4757; color: #fff; border: none; padding: 15px 40px; border-radius: 12px;
            font-weight: 800; font-family: inherit; letter-spacing: 2px; cursor: pointer; transition: 0.3s;
        }
        .rs-btn-prime:hover { scale: 1.05; box-shadow: 0 10px 30px rgba(255, 71, 87, 0.4); }

        .rs-btn-ghost {
            background: transparent; color: #aaa; border: 1px solid rgba(255, 255, 255, 0.1); padding: 15px 30px; border-radius: 12px;
            font-weight: 700; font-family: inherit; cursor: pointer; transition: 0.3s;
        }
        .rs-btn-ghost:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
    `;
    document.head.appendChild(style);
  }

  attachEvents() {
    // Track selection
    document.querySelectorAll(".rs-track-card").forEach((card) => {
      card.onclick = () => {
        this.selectedTrack = parseInt(card.dataset.index);
        this.render();
        this.attachEvents();
      };
    });

    // Difficulty selection
    document.querySelectorAll(".rs-opt").forEach((btn) => {
      btn.onclick = () => {
        this.selectedDifficulty = btn.dataset.val;
        this.render();
        this.attachEvents();
      };
    });

    // Opponent range
    const range = document.getElementById("opp-range");
    if (range) {
      range.oninput = (e) => {
        this.selectedOpponents = parseInt(e.target.value);
        document.getElementById("opp-count-display").textContent =
          e.target.value;
      };
    }

    // Navigation
    document.getElementById("rs-back-btn").onclick = () => {
      if (window.eventSystem) window.eventSystem.showScreen("main-menu");
    };

    document.getElementById("rs-start-btn").onclick = () => {
      const track = this.tracks[this.selectedTrack];
      const playerCar = this.profile.vehicles ? this.profile.vehicles[0] : null;

      if (!playerCar) {
        if (window.eventSystem?.showNotification)
          window.eventSystem.showNotification(
            "Você precisa de um carro!",
            "error",
          );
        return;
      }

      const raceData = {
        track: track,
        difficulty: this.selectedDifficulty,
        opponentCount: this.selectedOpponents,
        playerCar: playerCar,
        prize: this.calculatePrize(),
      };

      if (window.eventSystem)
        window.eventSystem.showScreen("race-screen", raceData);
    };
  }

  calculatePrize() {
    const track = this.tracks[this.selectedTrack];
    let prize = track.prize;
    const diffMulti = { easy: 0.8, normal: 1, hard: 1.5 };
    prize *= diffMulti[this.selectedDifficulty] || 1;
    prize *= 1 + (this.selectedOpponents - 1) * 0.1;
    return Math.round(prize);
  }

  cleanup() {}
}

if (typeof window !== "undefined") {
  window.raceSelectionScreen = new RaceSelectionScreen();
  window.RaceSelectionScreen = RaceSelectionScreen;
}
