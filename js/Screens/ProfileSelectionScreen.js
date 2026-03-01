// ProfileSelectionScreen.js - Reconstruída com Padrão Garage

class ProfileSelectionScreen {
  constructor() {
    this.screenId = "profile-selection";
    this.profiles = [];

    // Configuração de Background (Slideshow)
    this.backgrounds = [];
    for (let i = 0; i < 50; i++) {
      this.backgrounds.push(`./assets/images/backgrounds/bg-${i}.jpg`);
    }
    this.fallbackBg =
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop";
    this.bgIndex = Math.floor(Math.random() * this.backgrounds.length);
    this.bgTimer = null;
  }

  initialize() {
    this.createScreen();
    this.loadProfiles();
    this.attachEvents();
  }

  show(data = {}) {
    // Mostrando ProfileSelectionScreen

    // Recriar se necessário (garantia de estado limpo)
    if (!document.getElementById("ps-container")) {
      this.createScreen();
      this.attachEvents();
    }

    this.loadProfiles();

    const container = document.getElementById("ps-container");
    const backBtn = document.getElementById("ps-back-btn");
    const title = document.getElementById("ps-main-title");
    const subtitle = document.getElementById("ps-sub-title");

    // Reset Slideshow
    this.stopBackgroundSlideshow();

    // MODO GESTÃO (Vindo do Menu)
    if (data.canGoBack) {
      container.classList.add("management-mode");
      backBtn.style.display = "block";
      this.startBackgroundSlideshow(); // Slideshow só no modo gestão (opcional)

      // Textos de Gestão
      if (title)
        title.innerHTML =
          'GESTÃO DE <span class="ps-accent-text">PERFIS</span>';
      if (subtitle) subtitle.innerText = "GERENCIE SEUS PILOTOS";
    }
    // MODO BOOT (Início do Jogo)
    else {
      container.classList.remove("management-mode");
      backBtn.style.display = "none";

      // Textos de Boot
      if (title)
        title.innerHTML = 'STREET ROD <span class="ps-accent-text">II</span>';
      if (subtitle) subtitle.innerText = "SELECIONE SEU PILOTO";
    }
  }

  createScreen() {
    const container = document.getElementById("game-container");
    if (!container) return;

    // Limpar anteriores
    const existing = document.getElementById("ps-container");
    if (existing) existing.remove();

    // Background Default (Boot)
    const bootBg =
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070";

    container.innerHTML = `
        <div id="ps-container" class="ps-root">
            <!-- Camadas de Background -->
            <div id="ps-bg-layers">
                <div class="ps-bg-layer current" style="background-image: url('${this.fallbackBg}')"></div>
                <div class="ps-bg-layer next-ready"></div>
            </div>

            <!-- Overlay Global -->
            <div class="ps-overlay"></div>
            
            <!-- Botão Voltar -->
            <button id="ps-back-btn" class="nav-btn">← VOLTAR</button>
            
            <!-- Conteúdo Principal Wrapper -->
            <div class="ps-content">
                
                <!-- HEADER -->
                <header class="ps-header">
                    <div class="ps-title-group">
                        <h1 id="ps-main-title" class="ps-game-title">STREET ROD <span class="ps-accent-text">II</span></h1>
                        <p id="ps-sub-title" class="ps-game-subtitle">SELECIONE SEU PILOTO</p>
                    </div>
                    
                    <!-- Stats / Info Extra (Opcional) -->
                    <div class="ps-header-info">
                        <!-- Pode ir contador ou versão aqui -->
                    </div>
                </header>

                <!-- MAIN AREA (Sidebar + Grid) -->
                <div class="ps-main">
                    
                    <!-- SIDEBAR (Apenas Modo Gestão vai mostrar via CSS) -->
                    <aside class="ps-sidebar">
                        <button id="sb-create-btn" class="ps-sidebar-btn">
                            <span class="icon">➕</span> NOVO PERFIL
                        </button>
                        <button id="sb-refresh-btn" class="ps-sidebar-btn">
                            <span class="icon">🔄</span> ATUALIZAR
                        </button>
                        <div class="ps-sidebar-info">
                            Máximo: 3 Perfis
                        </div>
                    </aside>

                    <!-- GRID -->
                    <div id="profiles-list" class="ps-grid">
                        <!-- Cards injetados via JS -->
                    </div>
                </div>
            </div>

            <!-- Footer Versão -->
            <div class="ps-version-footer">Street Rod Ultimate v2.5 • Premium Edition</div>
        </div>
    `;

    this.addStyles();
  }

  addStyles() {
    // Remover estilos antigos
    const oldStyles = [
      "profile-selection-styles",
      "ps-premium-styles-v2",
      "ps-premium-styles-v3",
      "ps-premium-styles-v4",
      "ps-premium-styles-v5",
      "ps-premium-styles-v6",
      "ps-premium-styles-v7",
      "ps-premium-styles-v8",
      "ps-premium-styles-v9",
      "ps-premium-styles-v10",
      "ps-premium-styles-v11",
      "ps-premium-styles-v12",
    ];
    oldStyles.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    const style = document.createElement("style");
    style.id = "ps-standard-styles";
    style.textContent = `
        /* --- VARIÁVEIS DE TEMA --- */
        #ps-container {
            --ps-primary: #2ed573; /* Verde (Boot Default) */
            --ps-primary-rgb: 46, 213, 115;
            --ps-bg-overlay: radial-gradient(circle at center, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%);
        }

        #ps-container.management-mode {
            --ps-primary: #9c88ff; /* Lilás (Gestão) */
            --ps-primary-rgb: 156, 136, 255;
            --ps-bg-overlay: rgba(10, 10, 20, 0.9);
        }

        /* --- ROOT CONTAINER --- */
        #ps-container {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            background: #000;
            color: white;
            font-family: 'Rajdhani', sans-serif;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            
            /* Boot Background: Restoring the high-quality car photo */
            background: url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070') center/cover no-repeat fixed;
        }

        #ps-container.management-mode {
            /* No modo gestão, background vem das layers (slideshow) */
            background: #111; 
        }

        /* --- BACKGROUND LAYERS (SLIDESHOW) --- */
        #ps-bg-layers {
            position: fixed;
            inset: 0;
            z-index: -1;
            display: none; /* Off no Boot */
        }
        #ps-container.management-mode #ps-bg-layers { display: block; }
        
        .ps-bg-layer {
            position: absolute; inset: 0; background-size: cover; background-position: center;
            transition: opacity 1.5s ease-in-out;
        }
        .ps-bg-layer.current { opacity: 1; z-index: 1; }
        .ps-bg-layer.next-ready { opacity: 0; z-index: 0; }

        /* --- OVERLAY --- */
        .ps-overlay {
            position: fixed;
            inset: 0;
            background: var(--ps-bg-overlay);
            backdrop-filter: blur(8px);
            z-index: 0;
            transition: background 0.5s;
        }

        /* --- BUTTONS --- */
        .nav-btn {
            position: absolute;
            top: 30px; left: 30px;
            background: transparent;
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            padding: 10px 20px;
            cursor: pointer;
            font-family: inherit; font-weight: 600;
            border-radius: 6px;
            z-index: 100;
            transition: all 0.3s;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.1); border-color: white; }

        /* --- CONTENT WRAPPER (Igual Garage .gr-content) --- */
        .ps-content {
            position: relative;
            z-index: 10;
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 30px;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
            /* Boot: Centraliza verticalmente */
            justify-content: center; 
        }

        #ps-container.management-mode .ps-content {
            justify-content: flex-start; /* Management: Topo (Padrão) */
            padding-top: 30px;
            align-items: flex-start; /* Alinhar tudo à esquerda */
        }

        /* --- HEADER --- */
        .ps-header {
            display: flex;
            justify-content: center; /* Boot: Center */
            align-items: center;
            margin-bottom: 40px;
            border-bottom: 1px solid transparent; /* Boot: Sem linha */
            padding-bottom: 20px;
            text-align: center;
            width: 100%;
        }

        #ps-container.management-mode .ps-header {
            justify-content: flex-start; /* Management: Left */
            text-align: left;
            border-bottom: 1px solid rgba(255,255,255,0.1); /* Management: Linha */
            width: 100%;
        }

        #ps-container.management-mode .ps-title-group {
            margin-left: 100px; /* Padrão Garage: Espaço para botão Voltar */
        }

        .ps-game-title {
            font-size: 4rem; /* Boot Size */
            margin: 0;
            font-weight: 800;
            letter-spacing: 8px;
            text-shadow: 0 0 30px rgba(var(--ps-primary-rgb), 0.5);
            line-height: 1;
        }

        #ps-container.management-mode .ps-game-title {
            font-size: 3rem; /* Management Size */
            letter-spacing: 5px;
        }

        .ps-accent-text { color: var(--ps-primary); }

        .ps-game-subtitle {
            color: #aaa;
            font-size: 1.2rem;
            letter-spacing: 4px;
            margin-top: 10px;
            text-transform: uppercase;
        }
        
        #ps-container.management-mode .ps-game-subtitle {
            font-size: 1rem;
            color: #888;
            letter-spacing: 2px;
            margin-top: 0;
        }

        /* --- MAIN LAYOUT --- */
        .ps-main {
            display: flex;
            gap: 30px;
            flex: 1;
            justify-content: center; /* Boot: Center Grid */
            align-items: flex-start;
        }

        #ps-container.management-mode .ps-main {
            justify-content: flex-start; /* Management: Left Align Grid */
            width: 100%;
        }

        /* --- SIDEBAR --- */
        .ps-sidebar {
            width: 250px;
            display: none; /* Default Hidden (Boot) */
            flex-direction: column;
            gap: 15px;
            background: rgba(20, 20, 30, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 20px;
            backdrop-filter: blur(10px);
            position: sticky;
            top: 20px;
        }

        #ps-container.management-mode .ps-sidebar {
            /* display: flex; - REMOVIDO SIDEBAR EM GESTÃO */
        }

        .ps-sidebar-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #ccc;
            padding: 12px 15px;
            text-align: left;
            cursor: pointer;
            transition: all 0.3s;
            border-radius: 6px;
            display: flex; align-items: center; gap: 10px;
            font-family: inherit; font-weight: 600;
        }
        .ps-sidebar-btn:hover {
            background: rgba(var(--ps-primary-rgb), 0.2);
            border-color: var(--ps-primary);
            color: white;
            padding-left: 20px;
        }

        .ps-sidebar-info {
            margin-top: auto; font-size: 0.8rem; color: #666; text-align: center;
            border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;
        }

        /* --- GRID --- */
        .ps-grid {
            display: grid;
            gap: 20px;
            /* Boot: Centralizado, largura fixa se necessário */
            grid-template-columns: repeat(3, 1fr); 
            max-width: 1000px;
        }

        #ps-container.management-mode .ps-grid {
            justify-content: center; /* Centralizar cards horizontalmente */
            /* Limitar largura máx da coluna para manter aspecto quadrado */
            grid-template-columns: repeat(auto-fill, minmax(280px, 320px)); 
            max-width: none;
            width: 100%;
        }

        /* Media Query para Boot Mobile */
        @media (max-width: 900px) {
            .ps-grid { grid-template-columns: 1fr; }
        }

        /* --- CARDS --- */
        .ps-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 25px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex; flex-direction: column; gap: 15px;
            position: relative; overflow: hidden;
            min-width: 280px;
            min-height: 300px; /* Altura Mínima Garantida (Robustez) */
            display: flex; flex-direction: column; justify-content: space-between; /* Espalhar conteúdo */
        }

        .ps-card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--ps-primary);
            box-shadow: 0 10px 30px rgba(var(--ps-primary-rgb), 0.2);
        }

        .ps-card.active {
            border-color: var(--ps-primary);
            background: rgba(var(--ps-primary-rgb), 0.1);
        }

        .ps-card h3 { margin: 0; font-size: 1.5rem; text-transform: uppercase; color: white; }
        .ps-level { color: var(--ps-primary); font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; }

        .ps-stats-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 12px 18px; 
            gap: 20px; 
            background: rgba(0, 0, 0, 0.5); 
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .ps-stat { display: flex; flex-direction: column; gap: 4px; }
        .ps-stat:first-child { align-items: flex-start; flex: 1; }
        .ps-stat:last-child { align-items: flex-end; text-align: right; flex: 1; }
        .ps-label { font-size: 0.65rem; color: #aaa; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
        .ps-value { font-size: 1.2rem; font-weight: 800; color: white; line-height: 1.2; }
        .ps-value.money { color: #2ecc71; background: transparent !important; }

        .ps-actions { 
            display: flex; gap: 10px; margin-top: 10px; opacity: 0; transition: 0.3s;
            pointer-events: none; /* Default hidden */
        }
        .ps-card:hover .ps-actions { opacity: 1; pointer-events: auto; }

        .ps-btn {
            flex: 1; border: none; padding: 10px; border-radius: 6px;
            font-weight: 700; cursor: pointer;
            background: var(--ps-primary); color: white;
        }
        .ps-btn.delete { background: rgba(255,255,255,0.1); color: var(--ps-primary); flex: 0; }
        .ps-btn.delete:hover { background: #ff4757; color: white; }

        /* Empty State (Slot Vazio) */
        .ps-empty {
            background: rgba(255, 255, 255, 0.02);
            border: 2px dashed rgba(255, 255, 255, 0.1);
            border-radius: 15px; /* Igual Card */
            padding: 25px; /* Igual Card */
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 300px; /* Igual Card (Robustez para 0 perfis) */
            box-sizing: border-box;
            min-width: 280px; /* Igual Card */
        }
        .ps-empty:hover { 
            border-color: var(--ps-primary); 
            color: white; 
            background: rgba(255,255,255,0.05); 
            transform: translateY(-5px); /* Igual card hover */
            box-shadow: 0 10px 30px rgba(var(--ps-primary-rgb), 0.1);
        }

        /* Footer Versão */
        .ps-version-footer {
            text-align: center; padding: 20px; color: #444; font-size: 0.8rem;
            position: relative; z-index: 10;
        }
        #ps-container.management-mode .ps-version-footer { display: none; }
    `;
    document.head.appendChild(style);
  }

  loadProfiles() {
    if (window.profileManager) {
      this.profiles = window.profileManager.getAllProfiles();
    }
    this.renderProfiles();
  }

  renderProfiles() {
    const list = document.getElementById("profiles-list");
    if (!list) return;

    // Atualizar subtítulo com contagem (apenas se existir perfis)
    const subtitle = document.getElementById("ps-sub-title");
    if (subtitle && this.profiles.length > 0) {
      // No boot, mostra msg fixa. Em gestão, mostra contagem.
      const isManagement = document
        .getElementById("ps-container")
        .classList.contains("management-mode");
      if (isManagement) {
        subtitle.innerText = `${this.profiles.length} PERFIS ENCONTRADOS`;
        subtitle.style.color = "var(--ps-primary)";
      }
    }

    // LISTAGEM (Slots Logic: Always 3 items)
    let html = "";

    const currentProfile = window.profileManager?.getCurrentProfile();

    // 1. Renderizar Perfis Existentes
    html += this.profiles
      .map((p, i) => {
        const isActive = currentProfile?.name === p.name;
        return `
            <div class="ps-card ${isActive ? "active" : ""} anim-fade-up" style="animation-delay: ${i * 0.1}s">
                <div class="ps-card-header">
                    <div class="ps-level">NÍVEL ${p.level || 1}</div>
                    <h3>${p.name}</h3>
                </div>
                
                <div class="ps-stats-row">
                    <div class="ps-stat">
                        <span class="ps-label">DINHEIRO</span>
                        <span class="ps-value money">$${(p.cash || 0).toLocaleString()}</span>
                    </div>
                    <div class="ps-stat">
                        <span class="ps-label">GARAGEM</span>
                        <span class="ps-value">${p.vehicles?.length || 0} CARROS</span>
                    </div>
                </div>

                <div class="ps-actions">
                    <button class="ps-btn" onclick="window.profileSelectionScreen.selectProfile('${p.name.replace(/'/g, "\\'")}')">
                        ${isActive ? "CONTINUAR" : "SELECIONAR"}
                    </button>
                    <button class="ps-btn delete" onclick="window.profileSelectionScreen.deleteProfile('${p.name.replace(/'/g, "\\'")}')">🗑️</button>
                </div>
            </div>
        `;
      })
      .join("");

    // 2. Preencher slots vazios até completar 3
    const emptySlots = 3 - this.profiles.length;
    for (let i = 0; i < emptySlots; i++) {
      const delay = (this.profiles.length + i) * 0.1;
      html += `
            <div class="ps-empty anim-fade-up" style="animation-delay: ${delay}s" onclick="window.profileSelectionScreen.createNewProfile()">
                <div style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;">➕</div>
                <h3 style="margin: 0; font-size: 1.2rem; color: #888; text-transform: uppercase;">NOVO PERFIL</h3>
                <p style="font-size: 0.8rem; margin-top: 5px; color: #666;">CLIQUE PARA CRIAR</p>
            </div>
        `;
    }

    list.innerHTML = html;
  }

  // --- LOGIC METHODS (Mantidos) ---

  createNewProfile() {
    if (this.profiles.length >= 3) {
      alert("Limite de 3 perfis atingido.");
      return;
    }
    if (window.eventSystem) window.eventSystem.showScreen("profile-creation");
  }

  selectProfile(profileName) {
    if (
      window.profileManager &&
      window.profileManager.selectProfile(profileName)
    ) {
      const profile = window.profileManager.getCurrentProfile();
      window.eventSystem.setCurrentProfile(profile);
      if (window.eventSystem?.showNotification)
        window.eventSystem.showNotification(
          `Bem-vindo, ${profileName}!`,
          "success",
        );
      setTimeout(() => window.eventSystem.showScreen("main-menu"), 300);
    }
  }

  deleteProfile(profileName) {
    if (!confirm(`Excluir ${profileName}?`)) return;
    if (window.profileManager) {
      const profiles = window.profileManager.getAllProfiles();
      const idx = profiles.findIndex((p) => p.name === profileName);
      if (idx !== -1) {
        profiles.splice(idx, 1);
        localStorage.setItem("streetrod2_profiles", JSON.stringify(profiles));
        // Check current
        const cur = window.profileManager.getCurrentProfile();
        if (cur?.name === profileName) {
          localStorage.removeItem("streetrod2_current_profile");
          window.currentProfile = null;

          // CRITICAL FIX: Reset to Boot Mode immediately
          const container = document.getElementById("ps-container");
          const backBtn = document.getElementById("ps-back-btn");
          const title = document.getElementById("ps-main-title");
          const subtitle = document.getElementById("ps-sub-title");

          if (container) container.classList.remove("management-mode");
          if (backBtn) backBtn.style.display = "none";
          if (title)
            title.innerHTML =
              'STREET ROD <span class="ps-accent-text">II</span>';
          if (subtitle) {
            subtitle.innerText = "SELECIONE SEU PILOTO";
            subtitle.style.color = "#aaa"; // Reset color
          }

          // Stop management slideshow
          this.stopBackgroundSlideshow();
        }
        this.loadProfiles();
      }
    }
  }

  stopBackgroundSlideshow() {
    if (this.bgTimer) {
      clearInterval(this.bgTimer);
      this.bgTimer = null;
    }
  }

  startBackgroundSlideshow() {
    this.stopBackgroundSlideshow();
    this.bgTimer = setInterval(() => {
      const next = Math.floor(Math.random() * this.backgrounds.length);
      this.transitionBackground(next);
    }, 8000);
  }

  transitionBackground(nextIndex) {
    const currentLayer = document.querySelector(
      "#ps-container .ps-bg-layer.current",
    );
    const nextLayer = document.querySelector(
      "#ps-container .ps-bg-layer.next-ready",
    );
    if (!currentLayer || !nextLayer) return;

    const imgUrl = this.backgrounds[nextIndex] || this.fallbackBg;
    const img = new Image();
    img.onload = () => {
      nextLayer.style.backgroundImage = `url('${imgUrl}')`;
      nextLayer.style.opacity = "1";
      nextLayer.style.zIndex = "2";
      currentLayer.style.zIndex = "1";
      setTimeout(() => {
        currentLayer.classList.remove("current");
        currentLayer.classList.add("next-ready");
        currentLayer.style.opacity = "0";
        currentLayer.style.zIndex = "0";
        nextLayer.classList.remove("next-ready");
        nextLayer.classList.add("current");
      }, 1500);
    };
    img.src = imgUrl; // Load
  }

  attachEvents() {
    document.getElementById("ps-back-btn").onclick = () =>
      window.eventSystem.showScreen("main-menu");
    const createBtn = document.getElementById("sb-create-btn");
    if (createBtn) createBtn.onclick = () => this.createNewProfile();
    const refreshBtn = document.getElementById("sb-refresh-btn");
    if (refreshBtn) refreshBtn.onclick = () => this.loadProfiles();
  }
}

if (typeof window !== "undefined") {
  window.profileSelectionScreen = new ProfileSelectionScreen();
  window.ProfileSelectionScreen = ProfileSelectionScreen;
}
