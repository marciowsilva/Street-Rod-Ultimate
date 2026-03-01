// TuningScreen.js - OFICINA/TUNING (Sistema de Instalação de Peças)
// TuningScreen.js - OFICINA/TUNING (Sistema de Instalação de Peças)

class TuningScreen {
  constructor(eventSystem) {
    this.eventSystem = eventSystem;
    this.screenId = "tuning-screen";
    this.isActive = false;
    this.vehicleIndex = null; // Índice do veículo sendo tunado
  }

  show(data = {}) {
    // Abrindo Oficina de Tuning
    this.isActive = true;
    this.vehicleIndex = data.vehicleIndex ?? null;

    this.updateProfileData();

    if (this.vehicleIndex === null || !this.currentVehicle) {
      alert("Nenhum veículo selecionado!");
      this.eventSystem.showScreen("garage-screen");
      return this;
    }

    this.render();
    this.attachEvents();
    return this;
  }

  hide() {
    // Escondendo TuningScreen
    this.isActive = false;
    const container = document.getElementById("tuning-container");
    if (container) {
      container.remove();
    }

    const style = document.getElementById("tuning-styles");
    if (style) {
      style.remove();
    }
  }

  cleanup() {
    this.hide();
  }

  updateProfileData() {
    if (window.profileManager) {
      this.profile = window.profileManager.getCurrentProfile();
    }

    // Garantir estruturas
    if (!this.profile) this.profile = { vehicles: [], cash: 0, inventory: [] };
    if (!this.profile.vehicles) this.profile.vehicles = [];
    if (!this.profile.inventory) this.profile.inventory = [];

    // Obter veículo atual
    this.currentVehicle = this.profile.vehicles[this.vehicleIndex] || null;

    // Garantir estrutura de peças instaladas
    if (this.currentVehicle && !this.currentVehicle.installedParts) {
      this.currentVehicle.installedParts = {};
    }
  }

  render() {
    const container = document.createElement("div");
    container.id = "tuning-container";

    const bgUrl = "./assets/images/backgrounds/bg-3.jpg";

    container.innerHTML = `
            <style id="tuning-styles">
                #tuning-container {
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
                
                .tu-overlay {
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

                .tu-content {
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

                .tu-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 20px;
                }

                .tu-title {
                    margin-left: 100px;
                }

                .tu-title h1 {
                    font-size: 3rem;
                    margin: 0;
                    color: #fff;
                    text-shadow: 0 0 20px rgba(46, 213, 115, 0.5);
                    letter-spacing: 5px;
                }
                .tu-title span { color: #2ed573; }

                .tu-wallet {
                    font-size: 2rem;
                    color: #2ed573;
                    font-weight: 700;
                    text-shadow: 0 0 15px rgba(46, 213, 115, 0.3);
                    background: rgba(0,0,0,0.5);
                    padding: 10px 25px;
                    border-radius: 50px;
                    border: 1px solid rgba(46, 213, 115, 0.3);
                }

                .tu-main {
                    display: flex;
                    gap: 30px;
                    flex: 1;
                    align-items: flex-start;
                }

                /* Sidebar - Info do Veículo */
                .tu-sidebar {
                    width: 300px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    position: sticky;
                    top: 20px;
                    height: fit-content;
                    z-index: 10;
                }

                .tu-vehicle-card {
                    background: rgba(46, 213, 115, 0.1);
                    border: 1px solid rgba(46, 213, 115, 0.3);
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                }

                .tu-vehicle-icon {
                    font-size: 4rem;
                    margin-bottom: 10px;
                    filter: drop-shadow(0 0 15px rgba(46, 213, 115, 0.3));
                }

                .tu-vehicle-name {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #2ed573;
                    margin-bottom: 5px;
                }

                .tu-vehicle-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-top: 15px;
                }

                .tu-stat-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.9rem;
                }

                .tu-stat-label { color: #aaa; }
                .tu-stat-value { color: #2ed573; font-weight: 700; }

                /* Grid de Peças */
                .tu-grid {
                    flex: 1;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    grid-auto-rows: max-content;
                    gap: 20px;
                    padding: 20px;
                }

                .part-card {
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
                }

                .part-card:hover {
                    transform: translateY(-5px);
                    background: rgba(20, 20, 30, 0.8);
                    border-color: rgba(46, 213, 115, 0.5);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                .part-card.installed {
                    border-color: #2ed573;
                    background: rgba(46, 213, 115, 0.1);
                }

                .part-card.incompatible {
                    opacity: 0.6;
                    border-color: #ff4757;
                }

                .part-card.incompatible:hover {
                    border-color: #ff4757;
                    box-shadow: 0 10px 30px rgba(255,71,87,0.3);
                }

                .installed-badge, .incompatible-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #2ed573;
                    color: #000;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    z-index: 2;
                }

                .incompatible-badge {
                    background: #ff4757;
                    color: #fff;
                }

                .part-icon {
                    font-size: 4rem;
                    align-self: center;
                    margin-bottom: 10px;
                    filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
                }

                .part-info h3 { margin: 0; font-size: 1.3rem; color: #fff; }
                .part-info p { margin: 5px 0 0; font-size: 0.9rem; color: #888; }

                .part-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    font-size: 0.85rem;
                    margin-top: 5px;
                }

                .part-stat {
                    display: flex;
                    justify-content: space-between;
                    color: #2ed573;
                }

                .part-install-btn {
                    background: #2ed573;
                    color: #000;
                    border: none;
                    padding: 12px;
                    font-family: inherit;
                    font-weight: 800;
                    font-size: 1rem;
                    cursor: pointer;
                    border-radius: 6px;
                    transition: all 0.2s;
                    text-transform: uppercase;
                    margin-top: auto;
                }

                .part-install-btn:hover {
                    background: #fff;
                    box-shadow: 0 0 15px #2ed573;
                }
                .part-install-btn:active { transform: scale(0.95); }
                .part-install-btn:disabled, .part-install-btn.disabled {
                    background: #555;
                    color: #999;
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                .part-install-btn:disabled:hover, .part-install-btn.disabled:hover {
                    background: #555;
                    box-shadow: none;
                }

                .installed-badge {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #2ed573;
                    color: black;
                    font-size: 0.7rem;
                    font-weight: 800;
                    padding: 5px 10px;
                    border-radius: 4px;
                    text-transform: uppercase;
                }

                .empty-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px;
                    color: #666;
                }

                .empty-state-icon {
                    font-size: 5rem;
                    margin-bottom: 20px;
                    opacity: 0.3;
                }

            </style>

            <div class="tu-overlay"></div>
            
            <button id="tu-back-btn" class="nav-btn">← VOLTAR</button>

            <div class="tu-content">
                <div class="tu-header">
                    <div class="tu-title">
                        <h1>OFICINA <span>TUNING</span></h1>
                        <div style="font-size: 1rem; color: #666; letter-spacing: 2px;">UPGRADE DE PERFORMANCE</div>
                    </div>
                    
                    <div class="tu-wallet">
                        $ <span id="tu-wallet-amount">${this.profile ? this.profile.cash.toLocaleString() : "0"}</span>
                    </div>
                </div>

                <div class="tu-main">
                    <!-- Sidebar -->
                    <div class="tu-sidebar">
                        <div class="tu-vehicle-card">
                            <div class="tu-vehicle-icon" style="color: ${this.currentVehicle?.color || "#fff"}">${this.currentVehicle?.icon || "🚗"}</div>
                            <div class="tu-vehicle-name">${this.currentVehicle?.name || "Veículo"}</div>
                            <div class="tu-vehicle-stats">
                                <div class="tu-stat-row">
                                    <span class="tu-stat-label">Potência:</span>
                                    <span class="tu-stat-value">${this.currentVehicle?.power || 0} HP</span>
                                </div>
                                <div class="tu-stat-row">
                                    <span class="tu-stat-label">Integridade:</span>
                                    <span class="tu-stat-value">${this.currentVehicle?.integrity || 100}%</span>
                                </div>
                                <div class="tu-stat-row">
                                    <span class="tu-stat-label">Valor:</span>
                                    <span class="tu-stat-value">$ ${(this.currentVehicle?.price || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Grid -->
                    <div class="tu-grid" id="tu-grid">
                        <!-- Items rendered via JS -->
                    </div>
                </div>
            </div>
        `;

    document.getElementById("game-container").appendChild(container);
    this.renderParts();
  }

  renderParts() {
    const grid = document.getElementById("tu-grid");
    if (!grid) return;

    const inventory = this.profile.inventory || [];

    if (inventory.length === 0) {
      grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔧</div>
                    <h2 style="color: #aaa;">Inventário Vazio</h2>
                    <p>Compre peças na Loja para fazer upgrades no seu veículo!</p>
                </div>
            `;
      return;
    }

    grid.innerHTML = "";

    inventory.forEach((part, index) => {
      const isInstalled = this.isPartInstalled(part);
      const isCompatible = this.isPartCompatible(part, this.currentVehicle);
      const incompatibilityReason = !isCompatible
        ? this.getIncompatibilityReason(part, this.currentVehicle)
        : "";

      const card = document.createElement("div");
      card.className = `part-card ${isInstalled ? "installed" : ""} ${!isCompatible ? "incompatible" : ""}`;

      card.innerHTML = `
                ${isInstalled ? '<div class="installed-badge">INSTALADA</div>' : ""}
                ${!isCompatible && !isInstalled ? '<div class="incompatible-badge">INCOMPATÍVEL</div>' : ""}
                
                <div class="part-icon">${part.icon || "⚙️"}</div>
                
                <div class="part-info">
                    <h3>${part.name}</h3>
                    <p>${part.description || part.desc || "Peça de performance"}</p>
                    ${!isCompatible ? `<p style="color: #ff4757; font-size: 0.85rem; margin-top: 5px;">⚠️ ${incompatibilityReason}</p>` : ""}
                </div>

                <div class="part-stats">
                    ${part.powerBonus ? `<div class="part-stat"><span>Potência:</span><span>+${part.powerBonus} HP</span></div>` : ""}
                    ${part.speedBonus ? `<div class="part-stat"><span>Velocidade:</span><span>+${part.speedBonus} km/h</span></div>` : ""}
                </div>

                <button 
                    class="part-install-btn ${isInstalled || !isCompatible ? "disabled" : ""}" 
                    ${isInstalled || !isCompatible ? "disabled" : ""}
                    onclick="window.tuningScreen.installPart(${index})"
                >
                    ${isInstalled ? "JÁ INSTALADA" : !isCompatible ? "INCOMPATÍVEL" : "INSTALAR"}
                </button>
            `;

      grid.appendChild(card);
    });
  }

  isPartCompatible(part, vehicle) {
    // Verificando compatibilidade
    if (!part.compatibleWith) {
      console.log("✅ Peça universal - compatível");
      return true;
    }

    const compat = part.compatibleWith;

    // Verificar tipo de veículo
    if (
      compat.vehicleTypes &&
      !compat.vehicleTypes.includes(vehicle.vehicleType)
    ) {
      console.log(
        `❌ Incompatível: vehicleType ${vehicle.vehicleType} não está em ${compat.vehicleTypes}`,
      );
      return false;
    }

    // Verificar tipo de motor
    if (
      compat.engineTypes &&
      !compat.engineTypes.includes(vehicle.engineType)
    ) {
      console.log(
        `❌ Incompatível: engineType ${vehicle.engineType} não está em ${compat.engineTypes}`,
      );
      return false;
    }

    // Verificar tipo de tração
    if (compat.driveTypes && !compat.driveTypes.includes(vehicle.driveType)) {
      console.log(
        `❌ Incompatível: driveType ${vehicle.driveType} não está em ${compat.driveTypes}`,
      );
      return false;
    }

    // Verificar faixa de anos
    if (compat.yearRange) {
      const [minYear, maxYear] = compat.yearRange;
      if (vehicle.year < minYear || vehicle.year > maxYear) {
        console.log(
          `❌ Incompatível: ano ${vehicle.year} fora da faixa ${minYear}-${maxYear}`,
        );
        return false;
      }
    }

    // Verificar lista específica de veículos
    if (
      compat.specificVehicles &&
      !compat.specificVehicles.includes(vehicle.id)
    ) {
      console.log(
        `❌ Incompatível: veículo ${vehicle.id} não está na lista específica`,
      );
      return false;
    }

    console.log("✅ Peça compatível!");
    return true;
  }

  getIncompatibilityReason(part, vehicle) {
    if (!part.compatibleWith) {
      return "";
    }

    const compat = part.compatibleWith;
    const reasons = [];

    if (
      compat.vehicleTypes &&
      !compat.vehicleTypes.includes(vehicle.vehicleType)
    ) {
      const types = compat.vehicleTypes
        .map((t) => {
          const names = {
            muscle: "Muscle Cars",
            classic: "Clássicos",
            hotrod: "Hot Rods",
            sport: "Esportivos",
            import: "Importados",
          };
          return names[t] || t;
        })
        .join(", ");
      reasons.push(`Requer: ${types}`);
    }

    if (
      compat.engineTypes &&
      !compat.engineTypes.includes(vehicle.engineType)
    ) {
      const types = compat.engineTypes.map((t) => t.toUpperCase()).join(" ou ");
      reasons.push(`Motor: ${types}`);
    }

    if (compat.driveTypes && !compat.driveTypes.includes(vehicle.driveType)) {
      const types = compat.driveTypes
        .map((t) => {
          const names = { rwd: "Traseira", fwd: "Dianteira", awd: "4x4" };
          return names[t] || t;
        })
        .join(" ou ");
      reasons.push(`Tração: ${types}`);
    }

    if (compat.yearRange) {
      const [minYear, maxYear] = compat.yearRange;
      if (vehicle.year < minYear || vehicle.year > maxYear) {
        reasons.push(`Anos ${minYear}-${maxYear}`);
      }
    }

    return reasons.length > 0 ? reasons.join(" • ") : "Não compatível";
  }

  isPartInstalled(part) {
    if (!this.currentVehicle || !this.currentVehicle.installedParts)
      return false;

    // Verificar se a peça está instalada (por slot ou id)
    const slot = part.slot || "generic";
    return this.currentVehicle.installedParts[slot] === part.id;
  }

  installPart(partIndex) {
    const part = this.profile.inventory[partIndex];

    if (!part) {
      alert("Peça não encontrada!");
      return;
    }

    if (this.isPartInstalled(part)) {
      alert("Esta peça já está instalada!");
      return;
    }

    // Verificar compatibilidade ANTES de confirmar instalação
    if (!this.isPartCompatible(part, this.currentVehicle)) {
      const reason = this.getIncompatibilityReason(part, this.currentVehicle);
      alert(
        `❌ Peça Incompatível!\n\n${part.name} não pode ser instalada em ${this.currentVehicle.name}.\n\n${reason}`,
      );
      return;
    }

    // Confirmar instalação
    if (!confirm(`Instalar ${part.name} em ${this.currentVehicle.name}?`)) {
      return;
    }

    // Instalando peça
    // Aplicar upgrades DIRETAMENTE no veículo do array do perfil
    const slot = part.slot || "generic";

    // Garantir que installedParts existe
    if (!this.profile.vehicles[this.vehicleIndex].installedParts) {
      this.profile.vehicles[this.vehicleIndex].installedParts = {};
    }

    // Registrar instalação
    this.profile.vehicles[this.vehicleIndex].installedParts[slot] = part.id;

    // Atualizar potência
    if (part.powerBonus) {
      const oldPower = this.profile.vehicles[this.vehicleIndex].power || 0;
      this.profile.vehicles[this.vehicleIndex].power =
        oldPower + part.powerBonus;
      console.log(
        `📊 Potência DEPOIS: ${this.profile.vehicles[this.vehicleIndex].power} HP (+${part.powerBonus})`,
      );
    }

    // Remover peça do inventário
    this.profile.inventory.splice(partIndex, 1);

    // Salvar perfil ANTES de atualizar UI
    if (window.profileManager) {
      const saved = window.profileManager.saveProfile(this.profile);

      // Forçar reload do currentProfile no ProfileManager
      window.profileManager.currentProfile =
        window.profileManager.profiles.find(
          (p) => p.name === this.profile.name,
        );
    }

    // Feedback
    const newPower = this.profile.vehicles[this.vehicleIndex].power;
    alert(
      `${part.name} instalada com sucesso!\n\nPotência agora: ${newPower} HP`,
    );

    // Re-carregar dados do perfil para garantir sincronização
    this.updateProfileData();
    this.renderParts();

    // Atualizar stats na sidebar
    const container = document.getElementById("tuning-container");
    if (container) {
      const statsDiv = container.querySelector(".tu-vehicle-stats");
      if (statsDiv) {
        statsDiv.innerHTML = `
                <div class="tu-stat-row">
                    <span class="tu-stat-label">Potência:</span>
                    <span class="tu-stat-value">${this.currentVehicle.power} HP</span>
                </div>
                <div class="tu-stat-row">
                    <span class="tu-stat-label">Integridade:</span>
                    <span class="tu-stat-value">${this.currentVehicle.integrity || 100}%</span>
                </div>
                <div class="tu-stat-row">
                    <span class="tu-stat-label">Valor:</span>
                    <span class="tu-stat-value">$ ${(this.currentVehicle.price || 0).toLocaleString()}</span>
                </div>
            `;
      }
    }
  }

  attachEvents() {
    const backBtn = document.getElementById("tu-back-btn");
    if (backBtn) {
      backBtn.onclick = () => {
        if (this.eventSystem) this.eventSystem.showScreen("garage-screen");
      };
    }
  }
}

// Exportar para window
if (typeof window !== "undefined") {
  window.tuningScreen = new TuningScreen(window.eventSystem);
  window.TuningScreen = TuningScreen;
}
