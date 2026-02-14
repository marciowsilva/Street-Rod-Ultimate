// MainMenuScreen.js - VERSÃO LIMPA E OTIMIZADA
console.log("🏠 Carregando MainMenuScreen...");

class MainMenuScreen {
  constructor() {
    this.screenId = "main-menu";
  }

  initialize() {
    console.log("🏠 Inicializando menu principal...");
    this.updateProfileData();
    this.render();
    this.attachEvents();
  }

  // Atualizar dados do perfil
  updateProfileData() {
    try {
      if (window.profileManager && window.profileManager.getCurrentProfile) {
        const profile = window.profileManager.getCurrentProfile();
        if (profile) {
          window.currentProfile = profile;
          return;
        }
      }

      if (!window.currentProfile) {
        window.currentProfile = {
          name: "PILOTO",
          cash: 0,
          level: 1,
          vehicles: [],
        };
      }
    } catch (error) {
      console.error("❌ Erro ao atualizar dados do perfil:", error);
    }
  }

  render() {
    const container = document.getElementById("game-container");
    if (!container) return;

    // Forçar atualização antes do render
    this.updateProfileData();

    const profile = window.currentProfile;

    // Gerar lista de 50 fundos locais (assets/images/backgrounds/bg-0.jpg até bg-49.jpg)
    this.backgrounds = [];
    for (let i = 0; i < 50; i++) {
      this.backgrounds.push(`./assets/images/backgrounds/bg-${i}.jpg`);
    }

    // Backup de segurança: URL ultra-estável caso a pasta local esteja vazia
    this.fallbackBg =
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop";

    // Controle de estado do slideshow
    this.verifiedIndices = [];
    this.bgIndex = Math.floor(Math.random() * this.backgrounds.length);

    console.log(
      `🖼️ Slideshow iniciado: 50 slots locais configurados. (Iniciando com Fallback)`,
    );

    container.innerHTML = this.createMenuHTML(profile);
    this.addStyles();
    this.startBackgroundSlideshow();
  }

  // Criar HTML do menu (separado para clareza)
  createMenuHTML(profile) {
    return `
            <div id="mm-container" class="ps-root">
                <div id="mm-bg-layers">
                  <div class="mm-bg-layer current" style="background-image: url('${this.fallbackBg}')"></div>
                  <div class="mm-bg-layer next-ready"></div>
                </div>
                <div class="ps-glass-overlay"></div>
                
                <!-- CABEÇALHO -->
                <header class="ps-header anim-fade-down" style="display: flex; flex-direction: column; align-items: center; width: 100%; padding: 40px 0 20px; position: relative; z-index: 100;">
                    <h1 class="ps-game-title">STREET ROD <span class="ps-accent-text">II</span></h1>
                    <p class="ps-game-subtitle">MENU PRINCIPAL DO PILOTO</p>
                </header>
                
                <!-- INFORMAÇÕES DO PERFIL PREMIUM -->
                    <div class="mm-profile-hud anim-fade-up" style="
                        width: 90%;
                        max-width: 1200px; /* Padrão Global 1200px */
                        background: rgba(0, 0, 0, 0.4);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 20px;
                        padding: 20px 40px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        backdrop-filter: blur(15px);
                        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
                        margin: 0 auto 30px;
                        position: relative;
                        z-index: 20;
                    ">
                    <div class="ps-stat-item">
                        <span class="ps-stat-label">PILOTO ATIVO</span>
                        <span class="ps-stat-value" style="font-size: 1.4rem; color: #fff;">${profile.name}</span>
                    </div>
                    
                    <div style="height: 30px; width: 1px; background: rgba(255, 255, 255, 0.1);"></div>
                    
                    <div class="ps-stat-item" style="text-align: center;">
                        <span class="ps-stat-label">ORÇAMENTO ATUAL</span>
                        <span class="ps-stat-value ps-money" style="font-size: 1.6rem; color: #2ed573;">$${profile.cash.toLocaleString()}</span>
                    </div>
                    
                    <div style="height: 30px; width: 1px; background: rgba(255, 255, 255, 0.1);"></div>
                    
                    <div class="ps-stat-item" style="text-align: right;">
                        <span class="ps-stat-label">STATUS DA GARAGEM</span>
                        <span class="ps-stat-value" style="font-size: 1.4rem; color: #fff;">${profile.vehicles?.length || 0} VEÍCULOS</span>
                    </div>
                </div>
                
                <!-- GRID DE BOTÕES PREMIUM -->
                <main class="mm-menu-grid anim-fade-up" style="
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 25px;
                    width: 90%;
                    max-width: 1200px; /* Padrão Global 1200px */
                    margin: 0 auto;
                    position: relative;
                    z-index: 20;
                    flex: 1;
                    padding-bottom: 40px;
                    /* Scroll removido daqui e passado para o container */
                ">
                    <button id="race-button" class="mm-menu-card mm-card-race" style="grid-column: span 2;">
                        <div class="mm-card-glow"></div>
                        <span class="mm-icon">🏁</span>
                        <div class="mm-text-group">
                            <span class="mm-title">ENTRAR NA CORRIDA</span>
                            <span class="mm-desc">DESAFIE ADVERSÁRIOS E GANHE DINHEIRO</span>
                        </div>
                    </button>
                    
                    <button id="garage-button" class="mm-menu-card mm-card-garage">
                        <div class="mm-card-glow"></div>
                        <span class="mm-icon">🚗</span>
                        <span class="mm-title">GARAGEM</span>
                        <span class="mm-desc">GERENCIAR CARROS</span>
                    </button>
                    
                    <button id="shop-button" class="mm-menu-card mm-card-shop">
                        <div class="mm-card-glow"></div>
                        <span class="mm-icon">🔧</span>
                        <span class="mm-title">PEÇAS</span>
                        <span class="mm-desc">TUNING</span>
                    </button>

                    <button id="car-shop-button" class="mm-menu-card mm-card-carshop">
                        <div class="mm-card-glow"></div>
                        <span class="mm-icon">🚘</span>
                        <span class="mm-title">AGÊNCIA</span>
                        <span class="mm-desc">COMPRAR CARROS</span>
                    </button>
                    
                    <button id="profiles-button" class="mm-menu-card mm-card-profiles">
                        <div class="mm-card-glow"></div>
                        <span class="mm-icon">👤</span>
                        <span class="mm-title">PERFIS</span>
                        <span class="mm-desc">TROCAR PILOTO</span>
                    </button>
                    
                    <button id="settings-button" class="mm-menu-card mm-card-settings">
                        <div class="mm-card-glow"></div>
                        <span class="mm-icon">⚙️</span>
                        <span class="mm-title">AJUSTES</span>
                        <span class="mm-desc">SISTEMA</span>
                    </button>
                </main>
                
                <!-- RODAPÉ -->
                <footer class="ps-screen-footer" style="padding: 20px; text-align: center; background: rgba(0, 0, 0, 0.4); border-top: 1px solid rgba(255, 255, 255, 0.1); width: 100%; position: relative; z-index: 20;">
                    <p class="ps-stat-label" style="margin: 0; font-size: 0.8rem; letter-spacing: 2px;">
                        STREET ROD ULTIMATE EDITION • V2.5 PREMIUM
                    </p>
                </footer>
            </div>
        `;
  }

  addStyles() {
    const styleId = "mm-premium-styles-v1";
    if (document.getElementById(styleId))
      document.getElementById(styleId).remove();

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
            #mm-container.ps-root {
                height: 100vh;
                background: #000;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                overflow-y: auto; /* Scroll na tela inteira */
                overflow-x: hidden;
                font-family: 'Rajdhani', sans-serif;
            }

            #mm-bg-layers {
                position: fixed; /* Fixar fundo para não rolar junto */
                inset: 0;
                z-index: 0;
                background: #05050a; /* Cor de segurança */
            }

            .mm-bg-layer {
                position: absolute;
                inset: 0;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                transition: opacity 3s ease-in-out;
                opacity: 0;
                z-index: 1;
            }

            .mm-bg-layer.current {
                opacity: 1;
                z-index: 2;
            }
            
            /* Próximo fundo fica preparado atrás para evitar flickers */
            .mm-bg-layer.next-ready {
                opacity: 0;
                z-index: 1;
            }

            #mm-container .ps-glass-overlay {
                position: fixed; /* Fixar overlay */
                inset: 0;
                background: radial-gradient(circle at 50% 40%, 
                    rgba(10, 10, 20, 0.45) 0%, 
                    rgba(5, 5, 10, 0.85) 60%, 
                    rgba(0, 0, 0, 0.95) 100%);
                backdrop-filter: blur(4px);
                z-index: 10;
                pointer-events: none; /* Deixar scroll passar */
            }

            /* REPRODUZIR ELEMENTOS DAS OUTRAS TELAS */
            #mm-container .ps-game-title {
                font-size: 4rem;
                font-weight: 800;
                letter-spacing: 8px;
                margin: 0;
                color: white;
                text-shadow: 0 0 30px rgba(255, 71, 87, 0.5);
                line-height: 1.1;
            }
            #mm-container .ps-accent-text { color: #ff4757; }
            #mm-container .ps-game-subtitle {
                color: #aaa;
                font-size: 1.2rem;
                letter-spacing: 5px;
                margin-top: 8px;
                font-weight: 500;
                text-transform: uppercase;
            }

            #mm-container .ps-stat-label { color: #888; font-size: 0.75rem; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 5px; display: block; }
            #mm-container .ps-stat-value { font-weight: 800; letter-spacing: 1px; }

            /* MENU CARDS ESTILO PREMIUM */
            .mm-menu-card {
                background: rgba(255, 255, 255, 0.05); /* Cards claros / Vidro */
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 18px;
                padding: 25px;
                color: white;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
                position: relative;
                overflow: hidden;
                text-align: left;
                font-family: inherit;
                backdrop-filter: blur(10px);
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }

            .mm-menu-card .mm-card-glow {
                position: absolute;
                inset: 0;
                background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.1) 0%, transparent 60%);
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            }

            .mm-menu-card:hover {
                background: rgba(255, 255, 255, 0.06);
                border-color: rgba(255, 255, 255, 0.2);
                transform: translateY(-5px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            }

            .mm-menu-card:hover .mm-card-glow { opacity: 1; }

            .mm-icon { font-size: 2.2rem; margin-bottom: 5px; transition: transform 0.3s; }
            .mm-menu-card:hover .mm-icon { transform: scale(1.2) rotate(5deg); }

            .mm-title { font-size: 1.4rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
            .mm-desc { font-size: 0.75rem; color: #888; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }

            /* ESTILOS ESPECÍFICOS POR CARD */
            /* Padronização visual do fundo para harmonia total */
            .mm-card-race { 
                background: rgba(255, 71, 87, 0.08) !important; 
                border-color: rgba(255, 71, 87, 0.3) !important; 
                backdrop-filter: blur(15px) !important;
            }
            .mm-card-race:hover { 
                border-color: #ff4757 !important; 
                box-shadow: 0 0 30px rgba(255, 71, 87, 0.2) !important; 
                background: rgba(255, 71, 87, 0.15) !important;
            }
            .mm-card-race .mm-title { color: #ff4757; }
            .mm-card-race .mm-text-group { display: flex; flex-direction: column; gap: 5px; }
            .mm-card-race .mm-title { font-size: 1.8rem; }

            .mm-card-garage:hover { border-color: #1e90ff; box-shadow: 0 0 30px rgba(30, 144, 255, 0.2); }
            .mm-card-shop:hover { border-color: #2ed573; box-shadow: 0 0 30px rgba(46, 213, 115, 0.2); }
            .mm-card-carshop:hover { border-color: #f1c40f; box-shadow: 0 0 30px rgba(241, 196, 15, 0.2); }
            .mm-card-profiles:hover { border-color: #9c88ff; box-shadow: 0 0 30px rgba(156, 136, 255, 0.2); }
            .mm-card-settings:hover { border-color: #7f8c8d; box-shadow: 0 0 30px rgba(127, 140, 141, 0.2); }

            @media (max-width: 950px) {
                .mm-menu-grid { grid-template-columns: 1fr 1fr !important; }
                .mm-card-race { grid-column: span 2 !important; }
                .mm-profile-hud { flex-direction: column; gap: 20px; padding: 30px; text-align: center; }
                .mm-profile-hud div[style*="width: 1px"] { display: none; }
                .mm-profile-hud div { text-align: center !important; }
            }

            /* Scrollbar Personalizada para o Menu */
            .mm-menu-grid::-webkit-scrollbar { width: 6px; }
            .mm-menu-grid::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
            .mm-menu-grid::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 3px; }
            .mm-menu-grid::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }
        `;
    document.head.appendChild(style);
  }

  attachEvents() {
    // BOTÃO GARAGEM - Limpo e direto
    const garageBtn = document.getElementById("garage-button");
    if (garageBtn) {
      garageBtn.addEventListener("click", (e) => {
        e.preventDefault();

        console.log("🚗 Navegando para Garagem...");

        console.log("🚗 Navegando para Garagem...");
        if (window.eventSystem && window.eventSystem.showScreen) {
          window.eventSystem.showScreen("garage-screen");
        } else {
          console.error("❌ EventSystem não disponível para abrir Garagem");
        }
      });
    }

    // Efeito de brilho dinâmico nos botões
    document.querySelectorAll(".mm-menu-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
      });
    });

    // Outros botões
    this.setupButton("race-button", () => {
      console.log("🏁 Corrida selecionada");
      alert("🏁 Sistema de corridas em desenvolvimento");
    });

    this.setupButton("shop-button", () => {
      console.log("🛒 Loja de Peças selecionada");
      if (window.eventSystem && window.eventSystem.showScreen) {
        window.eventSystem.showScreen("shop-screen");
      }
    });

    this.setupButton("car-shop-button", () => {
      console.log("🚘 Agência selecionada");
      if (window.eventSystem && window.eventSystem.showScreen) {
        window.eventSystem.showScreen("car-shop-screen");
      }
    });

    this.setupButton("profiles-button", () => {
      console.log("👤 Perfis selecionados");
      if (window.eventSystem && window.eventSystem.showScreen) {
        window.eventSystem.showScreen("profile-selection", { canGoBack: true });
      } else {
        alert("👤 Sistema de perfis em desenvolvimento");
      }
    });

    this.setupButton("settings-button", () => {
      console.log("⚙️ Configurações selecionadas");
      alert("⚙️ Configurações em desenvolvimento");
    });
  }

  // Método auxiliar para configurar botões
  setupButton(buttonId, action) {
    const button = document.getElementById(buttonId);
    if (button && action) {
      button.addEventListener("click", action);
    }
  }

  // Iniciar slideshow com transição inteligente ( Wait-Before-Swap )
  startBackgroundSlideshow() {
    this.stopBackgroundSlideshow();

    this.bgTimer = setInterval(() => {
      // 1. Escolher um próximo índice aleatório que seja DIFERENTE do atual
      // Priorizamos a lista de verificados, mas tentamos descobrir novos
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * this.backgrounds.length);
      } while (nextIndex === this.bgIndex);

      this.prepareNextTransition(nextIndex);
    }, 15000);
  }

  // Prepara a transição e SÓ TROCA QUANDO ESTIVER PRONTA (Resiliente)
  prepareNextTransition(index, attempts = 0) {
    const layers = document.getElementById("mm-bg-layers");
    if (!layers) return;

    const nextLayer = layers.querySelector(".mm-bg-layer.next-ready");
    if (!nextLayer) return;

    // Se falhar persistentemente, usamos o fallback de segurança
    let targetUrl = this.backgrounds[index];
    if (attempts >= 3) {
      console.warn(
        `🛑 Tentativa ${attempts + 1}: Ativando fallback de segurança.`,
      );
      targetUrl = this.fallbackBg;
      index = -1; // Reset para indicar que não é um fundo local válido
    }

    console.log(
      `📡 Carregando background: ${index === -1 ? "Fallback" : "Local bg-" + index}...`,
    );

    const imgTester = new Image();
    imgTester.src = targetUrl;

    imgTester.onload = () => {
      const currentLayer = layers.querySelector(".mm-bg-layer.current");

      if (currentLayer && nextLayer) {
        nextLayer.style.backgroundImage = `url('${targetUrl}')`;

        nextLayer.classList.remove("next-ready");
        nextLayer.classList.add("current");

        currentLayer.classList.remove("current");
        currentLayer.classList.add("next-ready");

        if (index !== -1) {
          this.bgIndex = index;
          if (!this.verifiedIndices.includes(index))
            this.verifiedIndices.push(index);
        }
      }
    };

    imgTester.onerror = () => {
      if (index === -1) return; // Se o próprio fallback falhar, paramos

      console.warn(`⚠️ Erro ao carregar bg-${index}. Tentando outro...`);
      let nextRandomIndex = Math.floor(Math.random() * this.backgrounds.length);
      this.prepareNextTransition(nextRandomIndex, attempts + 1);
    };
  }

  // Pre-carregamento inicial silencioso
  preloadNextImage(index) {
    const img = new Image();
    img.src = this.backgrounds[index];
  }

  stopBackgroundSlideshow() {
    if (this.bgTimer) {
      clearInterval(this.bgTimer);
      this.bgTimer = null;
    }
  }

  cleanup() {
    console.log("🧹 Limpando MainMenuScreen");
    this.stopBackgroundSlideshow();
  }
}

// Exportar
if (typeof window !== "undefined") {
  window.MainMenuScreen = MainMenuScreen;
  window.mainMenuScreen = new MainMenuScreen();
  console.log("✅ MainMenuScreen carregado");
}
