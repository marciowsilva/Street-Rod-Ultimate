// GarageScreen.js - LOJA DE PEÇAS / GARAGEM DO JOGADOR (Evolução v1.2)
console.log("🏠 Carregando GarageScreen...");

class GarageScreen {
  constructor(eventSystem) {
    this.eventSystem = eventSystem;
    this.screenId = "garage-screen";
    this.isActive = false;

    // Estado local
    this.currentFilter = "all"; // all, fav
    this.currentSort = "newest"; // newest, power, value
    this.selectedCarIndex = -1;
    this.sidebarMode = "filter"; // 'filter' or 'details'
  }

  show() {
    console.log("🏠 Abrindo Garagem");
    this.isActive = true;

    // Forçar reload do perfil para garantir dados atualizados
    if (window.profileManager) {
      window.profileManager.profiles = window.profileManager.loadProfiles();
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
    if (container) container.remove();
  }

  cleanup() {
    this.hide();
  }

  updateProfileData() {
    if (window.profileManager) {
      this.profile = window.profileManager.getCurrentProfile();
    }
    if (!this.profile) this.profile = { vehicles: [], cash: 0 };
    if (!this.profile.vehicles) this.profile.vehicles = [];

    // Garantir propriedades base
    this.profile.vehicles.forEach((car) => {
      if (typeof car.isFavorite === "undefined") car.isFavorite = false;
      if (typeof car.integrity === "undefined") car.integrity = 100;
    });
  }

  saveProfile() {
    if (window.profileManager) window.profileManager.saveProfile(this.profile);
  }

  calculateCarValue(car) {
    let base = car.price || 5000;
    let partsValue = 0;
    if (car.installedParts) {
      Object.values(car.installedParts).forEach((partId) => {
        partsValue += 1000; // Estimativa
      });
    }
    let total = base + partsValue;
    const integrity = car.integrity !== undefined ? car.integrity : 100;
    const conditionMultiplier = 0.5 + (integrity / 100) * 0.5;
    return Math.floor(total * 0.7 * conditionMultiplier);
  }

  getProcessedVehicles() {
    let list = this.profile.vehicles.map((car, index) => ({
      car,
      originalIndex: index,
    }));

    // Filtro
    if (this.currentFilter === "fav") {
      list = list.filter((item) => item.car.isFavorite);
    }

    // Ordenação
    list.sort((a, b) => {
      if (this.currentSort === "power") {
        return (b.car.power || 0) - (a.car.power || 0);
      } else if (this.currentSort === "value") {
        return this.calculateCarValue(b.car) - this.calculateCarValue(a.car);
      }
      return b.originalIndex - a.originalIndex;
    });

    return list;
  }

  render() {
    console.log("🏠 Renderizando GarageScreen");

    const oldContainer = document.getElementById("garage-container");
    if (oldContainer) oldContainer.remove();

    const container = document.createElement("div");
    container.id = "garage-container";
    container.className = "ps-root";

    const bgUrl = "./assets/images/backgrounds/bg-5.jpg";

    container.innerHTML = `
            <style id="garage-styles">
                #garage-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('${bgUrl}') no-repeat center center fixed;
                    background-size: cover;
                    font-family: 'Rajdhani', sans-serif;
                    color: white;
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                }
                
                .gr-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(10, 10, 20, 0.85);
                    backdrop-filter: blur(8px);
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
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                }

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
                    text-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
                    letter-spacing: 5px;
                }
                .gr-title span { color: #3498db; }

                .gr-count {
                    font-size: 1rem;
                    color: #888;
                    letter-spacing: 2px;
                    margin-top: 0;
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

                .gr-main {
                    display: flex;
                    gap: 30px;
                    flex: 1;
                    align-items: flex-start;
                }

                .gr-sidebar {
                    width: 250px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    position: sticky;
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
                .gr-filter-btn:hover { background: rgba(255, 255, 255, 0.1); color: white; padding-left: 25px; }
                .gr-filter-btn.active {
                    background: rgba(52, 152, 219, 0.15);
                    border-color: #3498db;
                    color: #3498db;
                    box-shadow: 0 0 20px rgba(52, 152, 219, 0.1);
                }

                .gr-grid-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .gr-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 20px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 8px;
                    margin-bottom: 20px;
                }

                .gr-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    grid-auto-rows: max-content;
                    gap: 20px;
                }

                .gr-card {
                    background: rgba(20, 20, 30, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                }
                .gr-card:hover {
                    transform: translateY(-5px);
                    background: rgba(20, 20, 30, 0.8);
                    border-color: rgba(52, 152, 219, 0.5);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .gr-card.active {
                    border-color: #3498db;
                    background: rgba(52, 152, 219, 0.1);
                    box-shadow: 0 0 20px rgba(52, 152, 219, 0.2);
                }

                .gr-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: #666; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; margin-bottom: 5px; padding-right: 30px; }
                .gr-icon { font-size: 4rem; align-self: center; filter: drop-shadow(0 0 15px rgba(52, 152, 219, 0.2)); margin: 10px 0; }
                .gr-info h3 { margin: 0; font-size: 1.4rem; color: #fff; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; }
                
                .gr-inline-stats { display:flex; gap:10px; margin-top:10px; }
                .gr-inline-stat-col { flex:1; }
                .gr-inline-stat-lbl { font-size:0.7rem; color:#666; font-weight:bold; }
                .gr-inline-bar-bg { height:4px; background:rgba(255,255,255,0.1); border-radius:2px; margin-top:2px; }
                
                .gr-fav-btn { position:absolute; top:15px; right:15px; font-size:1.2rem; background:none; border:none; cursor:pointer; opacity:0.5; transition:0.2s; color:#fff; }
                .gr-fav-btn:hover { opacity:1; transform:scale(1.1); }
                .gr-fav-btn.active { color:#f1c40f; opacity:1; text-shadow:0 0 10px rgba(241,196,15,0.5); }

                /* Sidebar Detalhes */
                .gr-details-sidebar { display: flex; flex-direction: column; gap: 20px; animation: fadeSide 0.3s; }
                @keyframes fadeSide { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

                .gr-detail-header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; position:relative; }
                .gr-detail-icon { font-size: 5rem; filter: drop-shadow(0 0 20px rgba(52,152,219,0.4)); transition: transform 0.3s; }
                .gr-detail-icon:hover { transform: scale(1.1) rotate(5deg); }
                .gr-detail-title { font-size: 1.5rem; color: white; margin: 10px 0 5px; text-transform: uppercase; letter-spacing: 1px; }
                .gr-detail-meta { color: #888; font-size: 0.8rem; display: flex; justify-content: center; gap: 15px; }

                .gr-stat-group { display: flex; flex-direction: column; gap: 8px; background:rgba(255,255,255,0.03); padding:15px; border-radius:8px; }
                .gr-stat-item { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
                .gr-stat-label { display: flex; justify-content: space-between; color: #aaa; font-size: 0.8rem; font-weight: 700; }
                .gr-stat-bar-bg { height: 6px; background: rgba(0,0,0,0.5); border-radius: 3px; overflow: hidden; }
                .gr-stat-bar-fill { height: 100%; transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1); border-radius: 3px; }

                .gr-actions { display: flex; flex-direction: column; gap: 10px; margin-top: auto; }
                .gr-btn { border: none; padding: 12px; font-family: inherit; font-weight: 700; cursor: pointer; border-radius: 6px; text-transform: uppercase; font-size: 0.9rem; transition: all 0.2s; text-align:center; }
                .btn-tune { background: #3498db; color: white; box-shadow: 0 5px 15px rgba(52,152,219,0.3); }
                .btn-tune:hover { background: #2980b9; transform: translateY(-2px); }
                .btn-drive { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); }
                .btn-drive:hover { background: rgba(255,255,255,0.2); border-color: white; }
                .btn-sell { background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.3); }
                .btn-sell:hover { background: #e74c3c; color: white; }

                .gr-back-filter { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #aaa; padding: 8px; border-radius: 6px; cursor: pointer; margin-bottom: 10px; font-size: 0.8rem; transition: 0.3s; }
                .gr-back-filter:hover { border-color: white; color: white; background: rgba(255,255,255,0.05); }

                .gr-repair-box { margin-top:10px; padding:15px; background:rgba(231,76,60,0.1); border:1px solid rgba(231,76,60,0.3); border-radius:6px; display:flex; justify-content:space-between; align-items:center; }

                /* Photo Mode Overlay */
                #gr-photo-mode { display:none; position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.95); backdrop-filter:blur(10px); justify-content:center; align-items:center; flex-direction:column; }
            </style>

            <div class="gr-overlay"></div>
            
            <button id="gr-back-btn" class="nav-btn">← VOLTAR</button>

            <div class="gr-content">
                <div class="gr-header">
                    <div class="gr-title">
                        <h1>MINHA <span style="color: #3498db;">GARAGEM</span></h1>
                        <div class="gr-count" id="gr-count-label">${this.profile.vehicles.length} VEÍCULOS NA COLEÇÃO</div>
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

                    <!-- Grid & Toolbar -->
                    <div class="gr-grid-container">
                        <div class="gr-toolbar">
                            <div style="color:#aaa; font-size:0.9rem;">EXIBIÇÃO COM BASE NOS FILTROS</div>
                            <div style="display:flex; gap:10px; align-items:center;">
                                <span style="color:#666; font-size:0.8rem; font-weight:bold;">ORDENAR POR:</span>
                                <select id="gr-sort-select" style="background:#111; color:#fff; border:1px solid #444; padding:5px 10px; border-radius:4px; cursor:pointer; font-family:inherit;">
                                    <option value="newest" ${this.currentSort === "newest" ? "selected" : ""}>Aquisição (Mais Novos)</option>
                                    <option value="power" ${this.currentSort === "power" ? "selected" : ""}>Potência (Maior-Menor)</option>
                                    <option value="value" ${this.currentSort === "value" ? "selected" : ""}>Valor (Maior-Menor)</option>
                                </select>
                            </div>
                        </div>

                        <div class="gr-grid" id="gr-grid">
                            <!-- Items rendered via JS -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- FOTO MODO OVERLAY -->
            <div id="gr-photo-mode">
                <button style="position:absolute; top:30px; right:30px; font-size:2rem; background:none; border:none; color:#fff; cursor:pointer;" onclick="document.getElementById('gr-photo-mode').style.display='none'">&times;</button>
                <div id="gr-pm-icon" style="font-size:15rem; filter:drop-shadow(0 0 50px rgba(52,152,219,0.5)); transition:transform 0.5s;">🚗</div>
                <h2 id="gr-pm-title" style="font-size:3rem; margin:10px 0 0; letter-spacing:3px; color:#fff;">-</h2>
                <div id="gr-pm-subtitle" style="color:#3498db; font-size:1.2rem; letter-spacing:1px; margin-bottom:30px;">-</div>
                
                <div id="gr-pm-parts" style="display:flex; gap:15px; flex-wrap:wrap; justify-content:center; max-width:800px;">
                    <!-- Peças injetadas aqui -->
                </div>
            </div>
        `;

    document.getElementById("game-container").appendChild(container);

    document
      .getElementById("gr-sort-select")
      .addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.renderVehicles();
      });

    this.renderSidebar();
    this.renderVehicles();
  }

  renderSidebar() {
    const sidebar = document.getElementById("gr-sidebar");
    if (!sidebar) return;

    if (this.sidebarMode === "filter") {
      sidebar.innerHTML = `
            <button class="gr-filter-btn ${this.currentFilter === "all" ? "active" : ""}" id="gr-filter-all">🚗 TODOS OS VEÍCULOS</button>
            <button class="gr-filter-btn ${this.currentFilter === "fav" ? "active" : ""}" id="gr-filter-fav">⭐ FAVORITOS</button>
            
            <div style="margin-top: 20px; padding: 15px; background: rgba(52, 152, 219, 0.1); border-radius: 8px; border: 1px solid rgba(52, 152, 219, 0.2);">
                <div style="font-size: 0.8rem; color: #3498db; font-weight: 700; margin-bottom: 5px;">DICA RÁPIDA</div>
                <div style="font-size: 0.85rem; color: #ccc; line-height: 1.4;">Clique em um veículo para ver os detalhes técnicos, realizar consertos ou acessar a oficina.</div>
            </div>
      `;
      document.getElementById("gr-filter-all").onclick = () =>
        this.setFilter("all");
      document.getElementById("gr-filter-fav").onclick = () =>
        this.setFilter("fav");
    } else if (this.sidebarMode === "details") {
      const car = this.profile.vehicles[this.selectedCarIndex];
      if (!car) {
        this.sidebarMode = "filter";
        this.renderSidebar();
        return;
      }

      const intPct = car.integrity !== undefined ? car.integrity : 100;
      const pwrPct = Math.min(((car.power || 100) / 700) * 100, 100);
      const sellVal = this.calculateCarValue(car);

      const bar = (label, val, max, col, formatFn = (v) => v) => `
        <div class="gr-stat-item">
            <div class="gr-stat-label"><span>${label}</span> <span>${formatFn(val)}</span></div>
            <div class="gr-stat-bar-bg">
                <div class="gr-stat-bar-fill" style="width: ${Math.min(100, (val / max) * 100)}%; background: ${col};"></div>
            </div>
        </div>
      `;

      let repairBlock = "";
      let hasRepair = false;
      let cost = 0;
      if (intPct < 100) {
        hasRepair = true;
        const damage = 100 - car.integrity;
        cost = damage * 25;
        repairBlock = `
             <div class="gr-repair-box">
                <div>
                   <div style="color:#e74c3c; font-size:0.85rem; font-weight:bold;">REPAROS NECESSÁRIOS</div>
                   <div style="color:#aaa; font-size:0.75rem;">Restaurar para 100%</div>
                </div>
                <button id="gr-repair-btn" style="padding:8px 15px; background:#e74c3c; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer; font-size:0.8rem;">
                   CONSERTAR ($${cost})
                </button>
             </div>
          `;
      }

      sidebar.innerHTML = `
            <button class="gr-back-filter" id="gr-back-filter-btn">← VOLTAR AOS FILTROS</button>
            
            <div class="gr-details-sidebar">
                <div class="gr-detail-header">
                    <button id="gr-pm-open-btn" style="position:absolute; top:0; right:0; background:rgba(255,255,255,0.1); border:none; padding:12px; border-radius:6px; color:#fff; cursor:pointer; font-size:1.2rem; z-index:100; transition:0.2s;" title="Ver Detalhes">🔍</button>

                    <div class="gr-image-card" style="width: 100%; height: 150px; margin-bottom: 15px;">
                        ${car.imageUrl ? `<img src="${car.imageUrl}" alt="${car.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ""}
                        <div class="gr-icon-fallback" style="color: ${car.color || "#fff"}; display: ${car.imageUrl ? "none" : "flex"}">${car.icon || "🚗"}</div>
                    </div>

                    <div class="gr-detail-title">${car.name}</div>
                    <div class="gr-detail-meta">
                        <span>${car.year}</span>
                        <span>•</span>
                        <span>${car.id ? "PERSONALIZADO" : "DE FÁBRICA"}</span>
                    </div>
                </div>

                <!-- TAB SYSTEM -->
                <div class="gr-tabs" id="gr-spec-tabs">
                    <button class="gr-tab-btn active" data-tab="performance">PERFORMANCE</button>
                    <button class="gr-tab-btn" data-tab="technical">TÉCNICA</button>
                    <button class="gr-tab-btn" data-tab="details">DETALHES</button>
                </div>

                <!-- PERFORMANCE TAB -->
                <div class="gr-tab-content active" data-tab="performance">
                    <div class="gr-stat-group">
                        <div style="font-size: 0.8rem; color: #666; font-weight: 700; margin-bottom: 5px;">PERFORMANCE</div>
                        ${bar("POTÊNCIA MÁX.", car.power || 100, 700, "#e74c3c", (v) => v + " HP")}
                        ${bar("TORQUE", car.torque || 0, 600, "#f39c12", (v) => v + " Nm")}
                        ${bar("DIRIGIBILIDADE", car.handling || 1, 5, "#3498db", (v) => Number(v).toFixed(1))}
                        ${bar("PESO", car.weight || 1000, 2000, "#95a5a6", (v) => v + " kg")}
                        ${bar("ACELERAÇÃO 0-100", car.acceleration || 10, 15, "#9b59b6", (v) => v + "s")}
                        ${bar("VELOCIDADE MÁX", car.topSpeed || 200, 300, "#1abc9c", (v) => v + " km/h")}
                        ${bar("INTEGRIDADE", intPct, 100, intPct > 50 ? "#2ecc71" : "#e74c3c", (v) => v + "%")}
                    </div>
                </div>

                <!-- TECHNICAL TAB -->
                <div class="gr-tab-content" data-tab="technical">
                    <div class="gr-tech-specs-grid">
                        <div class="gr-tech-spec-item">
                            <div class="gr-tech-spec-label">Cilindros</div>
                            <div class="gr-tech-spec-value">${car.cylinders || "N/A"}</div>
                        </div>
                        <div class="gr-tech-spec-item">
                            <div class="gr-tech-spec-label">Cilindrada</div>
                            <div class="gr-tech-spec-value">${car.displacement || "N/A"} cc</div>
                        </div>
                        <div class="gr-tech-spec-item">
                            <div class="gr-tech-spec-label">Motor</div>
                            <div class="gr-tech-spec-value">${(car.engineType || "N/A").toUpperCase()}</div>
                        </div>
                        <div class="gr-tech-spec-item">
                            <div class="gr-tech-spec-label">Transmissão</div>
                            <div class="gr-tech-spec-value">${car.transmission || "N/A"}</div>
                        </div>
                        <div class="gr-tech-spec-item">
                            <div class="gr-tech-spec-label">Tração</div>
                            <div class="gr-tech-spec-value">${(car.driveType || "N/A").toUpperCase()}</div>
                        </div>
                        <div class="gr-tech-spec-item">
                            <div class="gr-tech-spec-label">Combustível</div>
                            <div class="gr-tech-spec-value">${car.fuelType || "N/A"}</div>
                        </div>
                    </div>
                </div>

                <!-- DETAILS TAB -->
                <div class="gr-tab-content" data-tab="details">
                    <div style="display: grid; gap: 10px;">
                        <div class="gr-detail-block">
                            <div class="gr-detail-block-label">Categoria</div>
                            <div class="gr-detail-block-text">${(car.category || "N/A").toUpperCase()}</div>
                        </div>
                        <div class="gr-detail-block">
                            <div class="gr-detail-block-label">Condição</div>
                            <div class="gr-detail-block-text">${(car.condition || "new").toUpperCase()}</div>
                        </div>
                        <div class="gr-detail-block">
                            <div class="gr-detail-block-label">Produção</div>
                            <div class="gr-detail-block-text">${car.productionYears || "N/A"}</div>
                        </div>
                        <div class="gr-detail-block">
                            <div class="gr-detail-block-label">Descrição</div>
                            <div class="gr-detail-block-text">${car.description || "Sem descrição disponível"}</div>
                        </div>
                        ${
                          car.historicalNotes
                            ? `
                        <div class="gr-history-block">
                            <div class="gr-history-label">Histórico</div>
                            <div class="gr-history-text">${car.historicalNotes}</div>
                        </div>
                        `
                            : ""
                        }
                        ${
                          car.variants && car.variants.length > 0
                            ? `
                        <div class="gr-detail-block">
                            <div class="gr-detail-block-label">Variantes</div>
                            <div class="gr-detail-block-text">${car.variants.join(", ")}</div>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>

                <!-- REPAIR BOX -->
                ${repairBlock}

                <div class="gr-actions">
                    <button class="gr-btn btn-tune" id="gr-tune-btn">
                        🔧 ABRIR OFICINA
                    </button>
                    <div style="display:flex; gap:10px;">
                        <button class="gr-btn btn-drive" id="gr-drive-btn" style="flex:1;">DIRIGIR</button>
                        <button class="gr-btn btn-sell" id="gr-sell-btn" style="flex:1;">VENDER ($${sellVal.toLocaleString()})</button>
                    </div>
                </div>
            </div>
      `;

      // Delegação de Eventos na Sidebar para garantir que o clique funciona
      sidebar.onclick = (e) => {
        // TAB SWITCHING
        if (e.target.closest(".gr-tab-btn")) {
          const tabName =
            e.target.dataset.tab || e.target.closest(".gr-tab-btn").dataset.tab;

          // Deactivate all tabs
          sidebar
            .querySelectorAll(".gr-tab-btn")
            .forEach((btn) => btn.classList.remove("active"));
          sidebar
            .querySelectorAll(".gr-tab-content")
            .forEach((content) => content.classList.remove("active"));

          // Activate selected tab
          e.target.closest(".gr-tab-btn").classList.add("active");
          const tabContent = sidebar.querySelector(`[data-tab="${tabName}"]`);
          if (tabContent) {
            tabContent.classList.add("active");
          }
          e.stopPropagation();
          return;
        }

        // OTHER EVENT HANDLERS
        if (e.target.closest("#gr-pm-open-btn")) {
          this.openPhotoMode();
        } else if (e.target.closest("#gr-back-filter-btn")) {
          this.deselectCar();
        } else if (e.target.closest("#gr-repair-btn")) {
          this.repairCurrent();
        } else if (e.target.closest("#gr-tune-btn")) {
          this.openTuning(this.selectedCarIndex);
        } else if (e.target.closest("#gr-drive-btn")) {
          this.eventSystem.showScreen("race-screen", {
            vehicleIndex: this.selectedCarIndex,
          });
        } else if (e.target.closest("#gr-sell-btn")) {
          this.sellCar(this.selectedCarIndex);
        }
      };
    }
  }

  renderVehicles() {
    const grid = document.getElementById("gr-grid");
    const countLabel = document.getElementById("gr-count-label");
    grid.innerHTML = "";

    const processedList = this.getProcessedVehicles();

    // Atualizar labels reais (pode mostrar o total da coleção independentemente do filtro ou não)
    countLabel.innerText = `${this.profile.vehicles.length} VEÍCULOS NA COLEÇÃO`;

    if (processedList.length === 0) {
      grid.innerHTML = `<div style="color:#888; font-size:1.2rem; grid-column:1/-1; text-align:center; margin-top:50px;">Nenhum veículo encontrado. Suas vagas estão livres!</div>`;
      return;
    }

    processedList.forEach((item) => {
      const { car, originalIndex } = item;
      const isSelected = originalIndex === this.selectedCarIndex;
      const card = document.createElement("div");

      card.className = `gr-card ${isSelected ? "active" : ""}`;

      const intPct = car.integrity !== undefined ? car.integrity : 100;
      let intColor = "#2ecc71";
      if (intPct < 50) intColor = "#e74c3c";
      else if (intPct < 80) intColor = "#f1c40f";

      card.innerHTML = `
           <div class="gr-meta">
              <span style="display:flex; align-items:center; gap:5px;">
                  <span style="width:8px; height:8px; border-radius:50%; background:${intColor}; display:inline-block; box-shadow:0 0 5px ${intColor};" title="Integrity: ${intPct}%"></span>
                  ${car.year || "CLÁSSICO"}
              </span>
              <span>TIER ${car.tier || 1}</span>
           </div>
           
           <button class="gr-fav-btn ${car.isFavorite ? "active" : ""}" title="Favoritar">⭐</button>

           <div class="gr-image-card">
              <img src="${window.getCarImageURL(car)}" alt="${car.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="gr-icon-fallback" style="color: ${car.color || "#fff"}; display: none;">${car.icon || "🚗"}</div>
           </div>

           <div class="gr-info">
              <h3>${car.name}</h3>
           </div>
           
           <div class="gr-inline-stats">
              <div class="gr-inline-stat-col">
                 <div class="gr-inline-stat-lbl">POTÊNCIA</div>
                 <div class="gr-inline-bar-bg">
                     <div style="width:${Math.min(100, ((car.power || 100) / 700) * 100)}%; height:100%; background:#e74c3c;"></div>
                 </div>
              </div>
              <div class="gr-inline-stat-col">
                 <div class="gr-inline-stat-lbl">DIRIGIBILIDADE</div>
                 <div class="gr-inline-bar-bg">
                     <div style="width:${Math.min(100, ((car.handling || 1) / 5) * 100)}%; height:100%; background:#3498db;"></div>
                 </div>
              </div>
              <div class="gr-inline-stat-col">
                 <div class="gr-inline-stat-lbl">INTEGRIDADE</div>
                 <div class="gr-inline-bar-bg">
                     <div style="width:${intPct}%; height:100%; background:${intColor};"></div>
                 </div>
              </div>
           </div>
        `;

      card.onclick = (e) => {
        if (e.target.closest(".gr-fav-btn")) {
          e.stopPropagation();
          car.isFavorite = !car.isFavorite;
          this.saveProfile();
          this.renderVehicles();
          if (this.selectedCarIndex === originalIndex) this.renderSidebar();
          return;
        }
        this.selectCar(originalIndex);
      };
      grid.appendChild(card);
    });
  }

  setFilter(filter) {
    if (this.currentFilter === filter) return;
    this.currentFilter = filter;
    this.selectedCarIndex = -1;
    this.sidebarMode = "filter";
    this.renderVehicles();
    this.renderSidebar();
  }

  selectCar(index) {
    if (this.selectedCarIndex === index) {
      this.deselectCar();
    } else {
      this.selectedCarIndex = index;
      this.sidebarMode = "details";
      this.renderVehicles();
      this.renderSidebar();
    }
  }

  deselectCar() {
    this.selectedCarIndex = -1;
    this.sidebarMode = "filter";
    this.renderVehicles();
    this.renderSidebar();
  }

  repairCurrent() {
    const car = this.profile.vehicles[this.selectedCarIndex];
    if (!car || car.integrity >= 100) return;

    const damage = 100 - car.integrity;
    const cost = damage * 25;

    if (this.profile.cash >= cost) {
      if (confirm(`O conserto custa $${cost.toLocaleString()}. Confirmar?`)) {
        this.profile.cash -= cost;
        car.integrity = 100;
        this.saveProfile();
        document.getElementById("gr-wallet-amount").innerText =
          this.profile.cash.toLocaleString();
        this.renderVehicles();
        this.renderSidebar();
      }
    } else {
      alert(`Fundos insuficientes! Necessário $${cost.toLocaleString()}.`);
    }
  }

  openPhotoMode() {
    const car = this.profile.vehicles[this.selectedCarIndex];
    if (!car) return;

    document.getElementById("gr-photo-mode").style.display = "flex";

    // Display car image or emoji fallback
    const pmIconEl = document.getElementById("gr-pm-icon");
    const imageUrl = window.getCarImageURL(car);

    pmIconEl.innerHTML = `
      <img src="${imageUrl}" 
           alt="${car.name}" 
           style="width: 300px; height: 300px; object-fit: cover; border-radius: 12px;" 
           onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<div style=\\'font-size:15rem; color: ${car.color || "#fff"}\\'>${car.icon || "🚗"}</div>')">
    `;

    document.getElementById("gr-pm-title").innerText = car.name;

    // Enhanced subtitle with more info
    document.getElementById("gr-pm-subtitle").innerText =
      `${car.year} | ${(car.engineType || "N/A").toUpperCase()} | ${car.power} HP | ${car.topSpeed || "N/A"} km/h`;

    // Parts display (unchanged)
    const pContainer = document.getElementById("gr-pm-parts");
    pContainer.innerHTML = "";

    const slotTranslations = {
      engine: "Motor",
      transmission: "Transmissão",
      exhaust: "Escapamento",
      tires: "Pneus",
      brakes: "Freios",
      suspension: "Suspensão",
      turbo: "Turbo",
      ecu: "Central (ECU)",
      weight: "Alívio de Peso",
      carburetor: "Carburador",
      intake: "Admissão",
      pistons: "Pistões",
      differential: "Diferencial",
      generic: "Peça Genérica",
    };

    const baseSlots = [
      "engine",
      "transmission",
      "tires",
      "brakes",
      "suspension",
      "exhaust",
      "carburetor",
    ];
    const installedSlots = car.installedParts
      ? Object.keys(car.installedParts)
      : [];
    const allSlotsToDisplay = [...new Set([...baseSlots, ...installedSlots])];

    allSlotsToDisplay.forEach((slot) => {
      const ptSlot = slotTranslations[slot] || slot.toUpperCase();
      const partId = car.installedParts ? car.installedParts[slot] : null;
      let levelText = "ORIGINAL";
      let color = "#aaa";

      if (partId) {
        // Extrair o "nível" do final do ID da peça (ex: eng_carb_2 -> 2)
        const match = partId.match(/\d+$/);
        levelText = match ? `NÍVEL ${match[0]}` : "MELHORADO";
        color = "#fff";
      }

      const el = document.createElement("div");
      el.style.cssText =
        "background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:10px 20px; border-radius:4px; display:flex; flex-direction:column; align-items:center; min-width:120px;";

      if (partId) {
        el.style.background = "rgba(46, 204, 113, 0.1)";
        el.style.borderColor = "rgba(46, 204, 113, 0.3)";
        color = "#2ecc71";
      }

      el.innerHTML = `
            <div style="font-size:0.8rem; color:#888; text-transform:uppercase; margin-bottom:5px;">${ptSlot}</div>
            <div style="font-weight:bold; color:${color};">${levelText}</div>
          `;
      pContainer.appendChild(el);
    });
  }

  openTuning(vehicleIndex) {
    if (this.eventSystem) {
      this.eventSystem.showScreen("tuning-screen", { vehicleIndex });
    }
  }

  sellCar(idx) {
    const car = this.profile.vehicles[idx];
    const val = this.calculateCarValue(car);
    if (
      confirm(
        `Vender este veículo por $${val.toLocaleString()}? Essa ação não pode ser desfeita.`,
      )
    ) {
      this.profile.cash += val;
      this.profile.vehicles.splice(idx, 1);
      this.saveProfile();

      this.selectedCarIndex = -1;
      this.sidebarMode = "filter";
      document.getElementById("gr-wallet-amount").innerText =
        this.profile.cash.toLocaleString();
      this.renderVehicles();
      this.renderSidebar();
    }
  }

  attachEvents() {
    document.getElementById("gr-back-btn").onclick = () => {
      if (this.eventSystem) this.eventSystem.showScreen("main-menu");
    };
  }
}

if (typeof window !== "undefined") {
  window.GarageScreen = GarageScreen;
  window.garageScreen = new GarageScreen();
}
