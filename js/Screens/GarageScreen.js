// GarageScreen.js - GARAGEM DO JOGADOR (Layout Padronizado)
console.log("🏠 Carregando GarageScreen...");

class GarageScreen {
  constructor(eventSystem) {
    this.eventSystem = eventSystem;
    this.screenId = "garage-screen";
    this.isActive = false;

    // Estado local
    this.currentFilter = "all"; // all, favorites
    this.selectedCarIndex = -1;
    this.sidebarMode = "filter"; // 'filter' or 'details'
  }

  show() {
    console.log("🏠 Abrindo Garagem");
    this.isActive = true;

    // Forçar reload do perfil para garantir dados atualizados
    if (window.profileManager) {
      // Recarregar perfis do localStorage
      window.profileManager.profiles = window.profileManager.loadProfiles();

      // Pegar perfil atual atualizado
      const currentProfileName = localStorage.getItem(
        window.profileManager.currentProfileKey,
      );
      if (currentProfileName) {
        window.profileManager.currentProfile =
          window.profileManager.profiles.find(
            (p) => p.name === currentProfileName,
          );
      }
    }

    this.updateProfileData();
    this.render();
    this.attachEvents();
    return this;
  }

  hide() {
    console.log("🏠 Escondendo GarageScreen");
    this.isActive = false;
    const container = document.getElementById("garage-container");
    if (container) {
      console.log("🗑️ Removendo garage-container");
      container.remove();
    }

    const style = document.getElementById("garage-styles");
    if (style) {
      console.log("🗑️ Removendo garage-styles");
      style.remove();
    }
  }

  cleanup() {
    console.log("🧹 Limpando GarageScreen (cleanup)");
    this.hide();
  }

  updateProfileData() {
    if (window.profileManager) {
      this.profile = window.profileManager.getCurrentProfile();
    }
    // Garantir array de veículos
    if (!this.profile) this.profile = { vehicles: [], cash: 0 };
    if (!this.profile.vehicles) this.profile.vehicles = [];
  }

  render() {
    console.log("🏠 Renderizando GarageScreen");

    // Garantir que não há containers antigos
    const oldContainer = document.getElementById("garage-container");
    if (oldContainer) {
      console.log("🗑️ Removendo garage-container antigo antes de renderizar");
      oldContainer.remove();
    }

    const oldStyle = document.getElementById("garage-styles");
    if (oldStyle) {
      console.log("🗑️ Removendo garage-styles antigo antes de renderizar");
      oldStyle.remove();
    }

    const container = document.createElement("div");
    container.id = "garage-container";
    container.className = "ps-root";

    // Background diferente para garagem (Interior mecânica/escuro)
    const bgUrl = "./assets/images/backgrounds/bg-5.jpg";

    container.innerHTML = `
            <style id="garage-styles">
                #garage-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('${bgUrl}') no-repeat center center fixed; /* Fixed BG */
                    background-size: cover;
                    font-family: 'Rajdhani', sans-serif;
                    color: white;
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto; /* Scroll Global */
                }
                
                /* Overlay Escuro (Base Padrão) */
                .gr-overlay {
                    position: fixed; /* Fixed Overlay */
                    inset: 0;
                    background: rgba(10, 10, 20, 0.85); /* Exato da ShopScreen */
                    backdrop-filter: blur(8px); /* Exato da ShopScreen */
                    z-index: 1;
                }

                .nav-btn {
                    position: absolute;
                    top: 30px;
                    left: 30px;
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    padding: 10px 20px;
                    cursor: pointer;
                    font-family: inherit;
                    font-weight: 600;
                    border-radius: 6px;
                    transition: all 0.3s;
                    z-index: 100;
                }
                .nav-btn:hover { background: rgba(255,255,255,0.1); border-color: white; }

                .gr-content {
                    position: relative;
                    z-index: 10;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 30px;
                    max-width: 1200px; /* Exato da ShopScreen (era 1400px) */
                    margin: 0 auto;
                    width: 100%;
                }

                /* Header Padronizado */
                .gr-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 20px;
                }

                .gr-title { margin-left: 100px; }

                .gr-title h1 {
                    font-size: 3rem;
                    margin: 0;
                    color: #fff;
                    text-shadow: 0 0 20px rgba(52, 152, 219, 0.5); /* Azul Garage */
                    letter-spacing: 5px;
                }
                .gr-title span { color: #3498db; }

                .gr-count {
                    font-size: 1rem; /* Exato da ShopScreen (era 1.2rem) */
                    color: #888; /* Cor mais suave */
                    letter-spacing: 2px;
                    margin-top: 0; /* Remover margin extra se houver diferença de altura de linha */
                }

                .gr-wallet {
                    font-size: 2rem;
                    color: #2ecc71;
                    font-weight: 700;
                    text-shadow: 0 0 15px rgba(46, 204, 113, 0.3);
                    background: rgba(0,0,0,0.5);
                    padding: 10px 25px;
                    border-radius: 50px;
                    border: 1px solid rgba(46, 204, 113, 0.3);
                }

                /* Layout Principal */
                .gr-main {
                    display: flex;
                    gap: 30px;
                    flex: 1;
                    /* overflow removido */
                    align-items: flex-start; /* Necessário para sticky */
                }

                /* Sidebar */
                .gr-sidebar {
                    width: 250px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    position: sticky; /* FIXO AO ROLAR */
                    top: 20px;
                    height: fit-content;
                    z-index: 10;
                }

                .gr-filter-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #aaa;
                    padding: 15px 20px;
                    font-size: 1.1rem;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.3s;
                    border-radius: 8px;
                    font-family: inherit;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .gr-filter-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    padding-left: 25px;
                }

                .gr-filter-btn.active {
                    background: rgba(52, 152, 219, 0.15);
                    border-color: #3498db;
                    color: #3498db;
                    box-shadow: 0 0 20px rgba(52, 152, 219, 0.1);
                }

                /* Grid */
                .gr-grid {
                    flex: 1;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    grid-auto-rows: max-content;
                    gap: 20px;
                    /* Scroll interno removido */
                    padding: 20px;
                    padding-right: 10px;
                }

                .gr-grid::-webkit-scrollbar { width: 6px; }
                .gr-grid::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
                .gr-grid::-webkit-scrollbar-thumb { background: #3498db; border-radius: 3px; }

                /* Card Veículo (Base Padrão) */
                .gr-card {
                    background: rgba(20, 20, 30, 0.6); /* Exato da ShopScreen */
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    position: relative;
                    overflow: hidden;
                }

                .gr-card:hover {
                    transform: translateY(-5px);
                    background: rgba(20, 20, 30, 0.8); /* Exato da ShopScreen */
                    border-color: rgba(52, 152, 219, 0.5); /* Azul Accent */
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                /* Layout horizontal para data de compra e ID */
                .gr-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.75rem;
                    color: #666;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    padding-bottom: 10px;
                    margin-bottom: 5px;
                }

                .gr-icon {
                    font-size: 4rem;
                    align-self: center;
                    filter: drop-shadow(0 0 15px rgba(52, 152, 219, 0.2));
                    margin: 10px 0;
                }

                .gr-info h3 { margin: 0; font-size: 1.4rem; color: #fff; }
                .gr-info p { margin: 5px 0 0; font-size: 0.9rem; color: #888; }
                
                .gr-stats {
                    display: flex;
                    gap: 10px;
                    font-size: 0.85rem;
                }

                .gr-stat-tag {
                    color: #3498db;
                    background: rgba(52, 152, 219, 0.1);
                    padding: 4px 8px;
                    border-radius: 4px;
                }

                .gr-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-top: auto;
                }

                .gr-btn {
                    border: none;
                    padding: 10px;
                    font-family: inherit;
                    font-weight: 700;
                    cursor: pointer;
                    border-radius: 6px;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }

                .btn-drive {
                    background: #3498db;
                    color: white;
                    grid-column: span 2;
                }
                .btn-drive:hover { background: #2980b9; box-shadow: 0 0 15px rgba(52, 152, 219, 0.4); }

                .btn-sell {
                    background: rgba(231, 76, 60, 0.1);
                    color: #e74c3c;
                    border: 1px solid rgba(231, 76, 60, 0.3);
                }
                .btn-sell:hover { background: #e74c3c; color: white; }

                .btn-tune {
                    background: rgba(46, 213, 115, 0.1);
                    color: #2ed573;
                    border: 1px solid rgba(46, 213, 115, 0.3);
                }
                .btn-tune:hover { background: #2ed573; color: black; }

                /* Sidebar Detalhes */
                .gr-details-sidebar {
                    display: flex; flex-direction: column; gap: 20px;
                    animation: fadeSide 0.3s;
                }
                @keyframes fadeSide { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

                .gr-detail-header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
                .gr-detail-icon { font-size: 5rem; filter: drop-shadow(0 0 20px rgba(52,152,219,0.4)); transition: transform 0.3s; }
                .gr-detail-icon:hover { transform: scale(1.1) rotate(5deg); }
                
                .gr-detail-title { font-size: 1.5rem; color: white; margin: 10px 0 5px; text-transform: uppercase; letter-spacing: 1px; }
                .gr-detail-meta { color: #888; font-size: 0.8rem; display: flex; justify-content: center; gap: 15px; }

                .gr-stat-group { display: flex; flex-direction: column; gap: 8px; }
                .gr-stat-item { display: flex; flex-direction: column; gap: 4px; }
                .gr-stat-label { display: flex; justify-content: space-between; color: #aaa; font-size: 0.75rem; font-weight: 700; }
                .gr-stat-bar-bg { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
                .gr-stat-bar-fill { height: 100%; background: #3498db; width: 0%; transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1); border-radius: 3px; }
                .gr-stat-bar-fill.danger { background: #e74c3c; }
                .gr-stat-bar-fill.warning { background: #f1c40f; }

                .gr-parts-list { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
                .gr-label-sec { font-size: 0.8rem; color: #666; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
                
                .gr-part-item { 
                    display: flex; align-items: center; gap: 12px; 
                    background: rgba(255,255,255,0.03); 
                    padding: 10px; border-radius: 8px; 
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .gr-part-icon { font-size: 1.2rem; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; }
                .gr-part-info { display: flex; flex-direction: column; }
                .gr-part-name { color: #ddd; font-size: 0.9rem; font-weight: 600; }
                .gr-part-level { color: #3498db; font-size: 0.7rem; }

                /* Botão Voltar Sidebar */
                .gr-back-filter {
                    background: transparent; border: 1px solid rgba(255,255,255,0.2);
                    color: #aaa; padding: 8px; border-radius: 6px; cursor: pointer;
                    margin-bottom: 10px; font-size: 0.8rem; transition: 0.3s;
                }
                .gr-back-filter:hover { border-color: white; color: white; background: rgba(255,255,255,0.05); }

            </style>

            <div class="gr-overlay"></div>
            
            <button id="gr-back-btn" class="nav-btn">← VOLTAR</button>

            <div class="gr-content">
                <div class="gr-header">
                    <div class="gr-title">
                        <h1>MINHA <span style="color: #3498db;">GARAGEM</span></h1>
                        <div class="gr-count">${this.profile.vehicles.length} VEÍCULOS NA COLEÇÃO</div>
                    </div>
                    
                    <div class="gr-wallet">
                        $ <span id="gr-wallet-amount">${this.profile.cash.toLocaleString()}</span>
                    </div>
                </div>

                <div class="gr-main">
                    <!-- Sidebar (Conteúdo Dinâmico) -->
                    <div class="gr-sidebar" id="gr-sidebar">
                        <!-- Renderizado via renderSidebar() -->
                    </div>

                    <!-- Grid -->
                    <div class="gr-grid" id="gr-grid">
                        <!-- Items rendered via JS -->
                    </div>
                </div>
            </div>
        `;

    document.getElementById("game-container").appendChild(container);
    this.renderSidebar(); // Initial Render
    this.renderVehicles();
  }

  // --- SIDEBAR LOGIC ---
  renderSidebar() {
    const sidebar = document.getElementById("gr-sidebar");
    if (!sidebar) return;

    if (this.sidebarMode === "filter") {
      // MODO FILTRO (Padrão)
      sidebar.innerHTML = `
            <button class="gr-filter-btn ${this.currentFilter === "all" ? "active" : ""}" onclick="window.garageScreen.setFilter('all')">TODOS</button>
            <button class="gr-filter-btn ${this.currentFilter === "fav" ? "active" : ""}" onclick="alert('Feature em breve!')">FAVORITOS</button>
            
            <div style="margin-top: 20px; padding: 15px; background: rgba(52, 152, 219, 0.1); border-radius: 8px; border: 1px solid rgba(52, 152, 219, 0.2);">
                <div style="font-size: 0.8rem; color: #3498db; font-weight: 700; margin-bottom: 5px;">DICA RÁPIDA</div>
                <div style="font-size: 0.85rem; color: #ccc; line-height: 1.4;">Clique em um veículo para ver os detalhes técnicos e peças instaladas.</div>
            </div>
        `;
    } else if (this.sidebarMode === "details") {
      // MODO DETALHES (Veículo Selecionado)
      const car = this.profile.vehicles[this.selectedCarIndex];
      if (!car) {
        this.sidebarMode = "filter";
        this.renderSidebar();
        return;
      }

      // Calcular porcentagens para barras
      const intPct = car.integrity || 100;
      const pwrPct = Math.min((car.power / 500) * 100, 100); // 500hp max ref

      sidebar.innerHTML = `
            <button class="gr-back-filter" onclick="window.garageScreen.deselectCar()">← VOLTAR PARA FILTROS</button>
            
            <div class="gr-details-sidebar">
                <div class="gr-detail-header">
                    <div class="gr-detail-icon" style="color: ${car.color || "#fff"}">${car.icon || "🚗"}</div>
                    <div class="gr-detail-title">${car.name}</div>
                    <div class="gr-detail-meta">
                        <span>${car.year}</span>
                        <span>•</span>
                        <span>${car.id ? "Personalizado" : "Stock"}</span>
                    </div>
                </div>

                <div class="gr-stat-group">
                    <div class="gr-label-sec">PERFORMANCE</div>
                    
                    <div class="gr-stat-item">
                        <div class="gr-stat-label"><span>INTEGRIDADE</span> <span>${intPct}%</span></div>
                        <div class="gr-stat-bar-bg">
                            <div class="gr-stat-bar-fill ${intPct < 50 ? "danger" : ""}" style="width: ${intPct}%"></div>
                        </div>
                    </div>

                    <div class="gr-stat-item">
                        <div class="gr-stat-label"><span>POTÊNCIA</span> <span>${car.power} HP</span></div>
                        <div class="gr-stat-bar-bg">
                            <div class="gr-stat-bar-fill warning" style="width: ${pwrPct}%"></div>
                        </div>
                    </div>
                </div>

                <div class="gr-parts-list">
                    <div class="gr-label-sec">PEÇAS INSTALADAS</div>
                    
                    ${this.renderInstalledParts(car)}
                </div>
            </div>
        `;
    }
  }

  renderInstalledParts(car) {
    console.log("🔧 Renderizando peças instaladas para:", car.name);
    console.log("📦 installedParts:", car.installedParts);

    // Carregar inventário do perfil para recuperar nomes das peças
    const allParts = this.getAllPartsCatalog();

    if (!car.installedParts || Object.keys(car.installedParts).length === 0) {
      return `
        <div class="gr-part-item" style="color: #666; font-style: italic;">
          <div class="gr-part-icon">📦</div>
          <div class="gr-part-info">
            <span class="gr-part-name">Nenhuma peça instalada</span>
            <span class="gr-part-level">Use a Oficina para fazer upgrades</span>
          </div>
        </div>
      `;
    }

    let partsHtml = "";

    // Iterar sobre peças instaladas
    for (const [slot, partId] of Object.entries(car.installedParts)) {
      console.log(`🔍 Procurando peça: slot=${slot}, partId=${partId}`);

      // Procurar peça no catálogo
      const part = allParts.find((p) => p.id === partId);

      if (part) {
        console.log(`✅ Peça encontrada:`, part);
        const stats = [];
        if (part.powerBonus) stats.push(`+${part.powerBonus} HP`);
        if (part.speedBonus) stats.push(`+${part.speedBonus} km/h`);

        partsHtml += this.renderPartItem(
          slot,
          part.name,
          stats.length > 0 ? stats.join(" • ") : "Upgrade",
        );
      } else {
        console.warn(`⚠️ Peça não encontrada no catálogo: ${partId}`);
        partsHtml += this.renderPartItem(
          slot,
          `Peça #${partId}`,
          "Desconhecida",
        );
      }
    }

    return partsHtml || this.renderPartItem("generic", "Nenhuma peça", "Stock");
  }

  getAllPartsCatalog() {
    // Retornar todas as peças do catálogo da ShopScreen
    // Se ShopScreen não estiver disponível, retornar array vazio
    if (!window.shopScreen || !window.shopScreen.partsCatalog) {
      console.warn("⚠️ ShopScreen ou catálogo de peças não disponível");
      return [];
    }

    const catalog = window.shopScreen.partsCatalog;
    const allParts = [];

    // Concatenar todas as categorias
    for (const category in catalog) {
      if (Array.isArray(catalog[category])) {
        allParts.push(...catalog[category]);
      }
    }

    console.log(`📚 Catálogo carregado com ${allParts.length} peças`);
    return allParts;
  }

  renderPartItem(iconType, name, level) {
    const icons = {
      engine: "🔧",
      tire: "🍩",
      gear: "⚙️",
      body: "🎨",
    };
    return `
        <div class="gr-part-item">
            <div class="gr-part-icon">${icons[iconType] || "📦"}</div>
            <div class="gr-part-info">
                <span class="gr-part-name">${name}</span>
                <span class="gr-part-level">${level}</span>
            </div>
        </div>
      `;
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.renderSidebar();
    // TODO: Implementar filtro real no grid se necessário
  }

  selectCar(index) {
    if (this.selectedCarIndex === index) return; // Já selecionado

    this.selectedCarIndex = index;
    this.sidebarMode = "details";

    this.renderSidebar();
    this.renderVehicles(); // Atualizar highlights no grid
  }

  deselectCar() {
    this.selectedCarIndex = -1;
    this.sidebarMode = "filter";
    this.renderSidebar();
    this.renderVehicles();
  }

  renderVehicles() {
    const grid = document.getElementById("gr-grid");
    grid.innerHTML = "";

    const vehicles = this.profile.vehicles;

    if (vehicles.length === 0) {
      grid.innerHTML =
        '<div style="color: #666; font-size: 1.5rem; padding: 20px;">Sua garagem está vazia. Visite a Agência!</div>';
      return;
    }

    vehicles.forEach((car, index) => {
      const isSelected = index === this.selectedCarIndex;
      const card = document.createElement("div");
      // Adicionar classe .active se selecionado
      card.className = `gr-card anim-fade-up ${isSelected ? "active" : ""}`;
      // Adicionar evento de clique para seleção
      card.onclick = (e) => {
        // Ignorar se clicou nos botões de ação
        if (e.target.tagName === "BUTTON") return;
        this.selectCar(index);
      };

      if (isSelected) {
        card.style.borderColor = "#3498db";
        card.style.backgroundColor = "rgba(52, 152, 219, 0.1)";
        card.style.transform = "scale(1.02)";
      }

      // Calcular valor de revenda (70% do valor se novo, + variação)
      const sellValue = Math.floor(car.price * 0.7);

      card.innerHTML = `
                <div class="gr-meta">
                    <span>#${index + 1}</span>
                    <span>${car.year}</span>
                </div>

                <div class="gr-icon" style="color: ${car.color || "#fff"}">${car.icon || "🚗"}</div>
                
                <div class="gr-info">
                    <h3>${car.name}</h3>
                    <p>${car.desc || "Veículo customizado"}</p>
                </div>
                
                <div class="gr-stats">
                    <div class="gr-stat-tag">⚡ ${car.power} HP</div>
                    <div class="gr-stat-tag">🛠️ ${car.integrity || 100}%</div>
                </div>

                <div class="gr-actions">
                    <button class="gr-btn btn-drive" onclick="alert('Sistema de direção em breve!')">DIRIGIR</button>
                    <button class="gr-btn btn-tune" onclick="window.garageScreen.openTuning(${index})">TUNAR</button>
                    <button class="gr-btn btn-sell" onclick="window.garageScreen.sellCar(${index}, ${sellValue})">VENDER ($${sellValue.toLocaleString()})</button>
                </div>
            `;
      grid.appendChild(card);
    });
  }

  sellCar(index, value) {
    if (
      confirm(
        `Tem certeza que deseja vender este veículo por $${value.toLocaleString()}?`,
      )
    ) {
      // Adicionar dinheiro
      this.profile.cash += value;

      // Remover carro
      this.profile.vehicles.splice(index, 1);

      // Salvar
      if (window.profileManager)
        window.profileManager.saveProfile(this.profile);

      // Atualizar UI
      this.updateUI();
      this.renderVehicles(); // Re-render grid

      // Notificação
      if (window.gameNotifications)
        window.gameNotifications.success(
          `Veículo vendido por $${value.toLocaleString()}`,
        );
    }
  }

  openTuning(vehicleIndex) {
    if (this.eventSystem) {
      this.eventSystem.showScreen("tuning-screen", { vehicleIndex });
    }
  }

  updateUI() {
    // Atualizar saldo e contador
    const wallet = document.getElementById("gr-wallet-amount");
    if (wallet) wallet.innerText = this.profile.cash.toLocaleString();

    const count = document.querySelector(".gr-count");
    if (count)
      count.innerText = `${this.profile.vehicles.length} VEÍCULOS NA COLEÇÃO`;
  }

  attachEvents() {
    // 1. Botão Voltar (topo esquerdo)
    const backBtn = document.getElementById("gr-back-btn");
    if (backBtn) {
      backBtn.onclick = (e) => {
        e.stopPropagation(); // Evitar disparar o deselect
        if (this.eventSystem) this.eventSystem.showScreen("main-menu");
      };
    }

    // 2. Clique Fora (Deselecionar)
    const container = document.getElementById("garage-container");
    if (container) {
      container.onclick = (e) => {
        // Se clicar em algo interativo (Card, Sidebar, Botão), ignorar
        const isInteractive =
          e.target.closest(".gr-card") ||
          e.target.closest(".gr-sidebar") ||
          e.target.closest("button");

        // Se clicar no vazio E tiver carro selecionado
        if (!isInteractive && this.selectedCarIndex !== -1) {
          this.deselectCar();
        }
      };
    }
  }
}

// Global Register
if (typeof window !== "undefined") {
  window.GarageScreen = GarageScreen;
  window.garageScreen = new GarageScreen();
}
