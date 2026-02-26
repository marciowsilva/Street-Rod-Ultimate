// CarShopScreen.js - CONCESSIONÁRIA COM CARROS REAIS E IMAGENS
console.log("🚘 Carregando CarShopScreen com Database...");

class CarShopScreen {
  constructor(eventSystem) {
    this.eventSystem = eventSystem;
    this.screenId = "car-shop-screen";
    this.isActive = false;

    // Usar a database global quando disponível
    this.carsCatalog = [];
    this.selectedCar = null;
    this.currentFilter = "all";
  }

  show() {
    console.log("🚘 Abrindo Concessionária");
    this.isActive = true;
    this.updateProfileData();
    this.loadCarsDatabase();
    this.render();
    this.attachEvents();
    return this;
  }

  hide() {
    this.isActive = false;
    const container = document.getElementById("car-shop-container");
    if (container) container.remove();

    const style = document.getElementById("car-shop-styles");
    if (style) style.remove();
  }

  loadCarsDatabase() {
    if (window.CARS_DATABASE) {
      this.carsCatalog = window.CARS_DATABASE.getAllCars();
      console.log(`✅ Carregou ${this.carsCatalog.length} carros da database`);
    } else {
      console.error("❌ CARS_DATABASE não encontrado!");
    }
  }

  updateProfileData() {
    if (window.profileManager) {
      this.profile = window.profileManager.getCurrentProfile();
    }
  }

  render() {
    const container = document.createElement("div");
    container.id = "car-shop-container";
    container.className = "ps-root";

    const bgUrl = "./assets/images/backgrounds/bg-2.jpg";

    container.innerHTML = `
      <style id="car-shop-styles">
        #car-shop-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #0a0a0f;
          font-family: 'Rajdhani', sans-serif;
          color: white;
          z-index: 100;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .cs-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 10, 20, 0.85);
          backdrop-filter: blur(8px);
          z-index: 0;
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
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          border-radius: 6px;
          transition: all 0.3s;
          z-index: 100;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.1); border-color: white; }

        .cs-content {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 30px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        /* Header */
        .cs-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 20px;
          gap: 30px;
        }

        .cs-title {
          flex: 1;
        }

        .cs-title h1 {
          font-size: 2.5rem;
          margin: 0;
          color: #fff;
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
          letter-spacing: 3px;
        }
        .cs-title span { color: #00ff88; }

        .cs-title > div {
          font-size: 0.9rem;
          color: #666;
          letter-spacing: 1px;
          margin-top: 5px;
        }

        .cs-wallet {
          font-size: 1.3rem;
          color: #00ff88;
          font-weight: 700;
          text-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
          background: rgba(0,0,0,0.5);
          padding: 12px 25px;
          border-radius: 50px;
          border: 1px solid rgba(0, 255, 136, 0.3);
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Sidebar */
        .cs-sidebar {
          width: 250px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          position: sticky;
          top: 20px;
          height: fit-content;
          z-index: 10;
        }

        .filter-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #aaa;
          padding: 15px 20px;
          font-size: 1rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 8px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding-left: 25px;
        }

        .filter-btn.active {
          background: rgba(0, 255, 136, 0.15);
          border-color: #00ff88;
          color: #00ff88;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
        }

        /* Main Layout */
        .cs-main {
          display: flex;
          gap: 30px;
          flex: 1;
          align-items: flex-start;
        }

        /* Grid */
        .cs-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          grid-auto-rows: max-content;
          gap: 20px;
          padding: 20px;
          padding-right: 10px;
        }

        .cs-grid::-webkit-scrollbar { width: 6px; }
        .cs-grid::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        .cs-grid::-webkit-scrollbar-thumb { background: #00ff88; border-radius: 3px; }

        /* Card */
        .car-card {
          background: rgba(20, 20, 30, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 15px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
          cursor: pointer;
        }

        .car-card:hover {
          transform: translateY(-5px);
          background: rgba(20, 20, 30, 0.8);
          border-color: rgba(0, 255, 136, 0.5);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .car-card-image {
          width: 100%;
          height: 180px;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .car-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .car-card-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          background: rgba(0, 0, 0, 0.7);
          color: white;
        }
        .car-card-badge.new { background: linear-gradient(135deg, #00ff88, #00cc66); color: black; }
        .car-card-badge.used { background: rgba(228, 108, 10, 0.8); }

        .car-card-body {
          padding: 15px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .car-card-name {
          font-size: 1.2rem;
          font-weight: bold;
          color: #fff;
          margin: 0;
        }

        .car-card-year {
          font-size: 0.8rem;
          color: #aaa;
        }

        .car-card-stats {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .car-stat-badge {
          background: rgba(0, 255, 136, 0.1);
          color: #00ff88;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .car-card-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f39c12;
          margin-top: auto;
        }

        .buy-btn {
          background: linear-gradient(135deg, #00ff88, #00cc66);
          color: black;
          border: none;
          padding: 12px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
          text-transform: uppercase;
        }

        .buy-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
        }
        .buy-btn:active { transform: scale(0.95); }
        .buy-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Modal */
        .car-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 200;
          overflow-y: auto;
        }

        .car-modal.open {
          display: flex;
        }

        .car-modal-content {
          background: rgba(20, 20, 30, 0.95);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 12px;
          padding: 30px;
          max-width: 900px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          backdrop-filter: blur(10px);
        }

        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .modal-close:hover {
          background: rgba(0, 255, 136, 0.2);
          border-color: #00ff88;
        }

        .modal-image {
          width: 100%;
          height: 300px;
          background: #000;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .modal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      </style>

      <div class="cs-overlay"></div>

      <button id="cs-back-btn" class="nav-btn">← VOLTAR</button>

      <div class="cs-content">
        <div class="cs-header">
          <div class="cs-title">
            <h1>AGÊNCIA <span style="color: #00ff88;">PREMIUM</span></h1>
            <div style="font-size: 0.9rem; color: #666; letter-spacing: 1px;">VEÍCULOS REAIS</div>
          </div>

          <div class="cs-wallet">
            $ <span id="cs-wallet-amount">${this.profile ? this.profile.cash.toLocaleString() : "0"}</span>
          </div>
        </div>

        <div class="cs-main">
          <!-- Sidebar -->
          <div class="cs-sidebar">
            <button class="filter-btn active" data-filter="all">Todos</button>
            <button class="filter-btn" data-filter="classic">Clássicos</button>
            <button class="filter-btn" data-filter="muscle">Muscle</button>
            <button class="filter-btn" data-filter="hotrod">Hot Rods</button>
            <button class="filter-btn" data-filter="modern">Modernos</button>
          </div>

          <!-- Grid -->
          <div class="cs-grid" id="cs-grid">
            <!-- Items rendered via JS -->
          </div>
        </div>
      </div>

      <!-- Modal para detalhes -->
      <div class="car-modal" id="car-modal">
        <div class="car-modal-content" id="car-modal-content">
          <button class="modal-close" onclick="window.carShopScreen.closeModal()">×</button>
          <!-- Filled by JS -->
        </div>
      </div>
    `;

    document.getElementById("game-container").appendChild(container);
    this.renderCars();
  }

  renderCars() {
    const grid = document.getElementById("cs-grid");
    if (!grid) return;

    grid.innerHTML = "";

    let cars = this.carsCatalog;
    if (this.currentFilter !== "all") {
      cars = cars.filter((c) => c.vehicleType === this.currentFilter);
    }

    if (cars.length === 0) {
      grid.innerHTML =
        '<div style="color: #666; font-size: 1.5rem; padding: 20px;">Nenhum veículo nesta categoria.</div>';
      return;
    }

    cars.forEach((car) => {
      const card = document.createElement("div");
      card.className = "car-card";

      const badgeClass = car.condition === "new" ? "new" : "used";
      const badgeText = car.condition === "new" ? "NOVO" : "USADO";

      const imageHtml = car.imageUrl
        ? `<img src="${car.imageUrl}" alt="${car.name}" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.parentElement.innerHTML='<div style=&quot;font-size:3rem&quot;>${car.icon}</div>'">`
        : `<div style="font-size:3rem">${car.icon}</div>`;

      card.innerHTML = `
        <div class="car-card-image">
          ${imageHtml}
          <div class="car-card-badge ${badgeClass}">${badgeText}</div>
        </div>
        <div class="car-card-body">
          <div>
            <div class="car-card-name">${car.name}</div>
            <div class="car-card-year">${car.year}</div>
          </div>
          <div class="car-card-stats">
            <div class="car-stat-badge">⚡ ${car.power} HP</div>
            <div class="car-stat-badge">⚙️ ${car.engineType.toUpperCase()}</div>
            <div class="car-stat-badge">🏎️ ${car.vehicleType}</div>
          </div>
          <div class="car-card-price">$${car.price.toLocaleString()}</div>
          <button class="buy-btn" onclick="window.carShopScreen.showDetails('${car.id}', event)">VER DETALHES</button>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  showDetails(carId, event) {
    event.preventDefault();
    event.stopPropagation();

    const car = this.carsCatalog.find((c) => c.id === carId);
    if (!car) return;

    this.selectedCar = car;
    const modal = document.getElementById("car-modal");
    const content = document.getElementById("car-modal-content");

    const imageHtml = car.imageUrl
      ? `<img src="${car.imageUrl}" alt="${car.name}" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.parentElement.innerHTML='<div style=&quot;font-size:5rem;display:flex;align-items:center;justify-content:center;height:100%&quot;>${car.icon}</div>'">`
      : `<div style="font-size:5rem;display:flex;align-items:center;justify-content:center;height:100%">${car.icon}</div>`;

    const canAfford = this.profile && this.profile.cash >= car.price;

    let specsHtml = `
      <div class="spec-item">
        <div class="spec-label">Cilindros</div>
        <div class="spec-value">${car.cylinders}</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Cilindrada</div>
        <div class="spec-value">${car.displacement} cc</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Transmissão</div>
        <div class="spec-value">${car.transmission}</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Tração</div>
        <div class="spec-value">${car.driveType.toUpperCase()}</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Torque</div>
        <div class="spec-value">${car.torque} Nm</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Peso</div>
        <div class="spec-value">${car.weight} kg</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">0-100</div>
        <div class="spec-value">${car.acceleration}s</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Velocidade Max</div>
        <div class="spec-value">${car.topSpeed} km/h</div>
      </div>
    `;

    content.innerHTML = `
      <button class="modal-close" onclick="window.carShopScreen.closeModal()">×</button>
      <div class="modal-image">
        ${imageHtml}
      </div>

      <h2 style="margin-top:0; color:#00ff88;">${car.name}</h2>
      <div style="color:#aaa; margin-bottom:10px;">${car.year} • ${car.vehicleType.toUpperCase()}</div>
      <p style="color:#ccc; line-height:1.6; margin-bottom:20px;">${car.description}</p>

      <h3 style="color:#00ff88; margin-top:20px; margin-bottom:15px;">Performance</h3>
      <div class="car-performance-stats">
        <div class="stat-box">
          <div class="stat-box-value">${car.power}</div>
          <div class="stat-box-label">Potência</div>
          <div class="stat-box-unit">HP</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-value">${car.torque}</div>
          <div class="stat-box-label">Torque</div>
          <div class="stat-box-unit">Nm</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-value">${car.acceleration}</div>
          <div class="stat-box-label">0-100</div>
          <div class="stat-box-unit">s</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-value">${car.topSpeed}</div>
          <div class="stat-box-label">Veloc. Máx</div>
          <div class="stat-box-unit">km/h</div>
        </div>
      </div>

      <h3 style="color:#00ff88; margin-top:20px; margin-bottom:15px;">Especificações Técnicas</h3>
      <div class="car-technical-specs">
        ${specsHtml}
      </div>

      <div class="car-historical">
        <div class="historical-section">
          <h4>História</h4>
          <div class="historical-text">${car.historicalNotes}</div>
          <div class="production-info">
            <div class="production-item">
              <div class="production-label">Produção</div>
              <div class="production-value">${car.productionYears}</div>
            </div>
            <div class="production-item">
              <div class="production-label">Variantes</div>
              <div class="production-value">${car.variants.join(", ")}</div>
            </div>
            <div class="production-item">
              <div class="production-label">Categoria</div>
              <div class="production-value">${car.category.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="car-price-section">
        <div class="car-price-label">Preço</div>
        <div class="car-price-value">$${car.price.toLocaleString()}</div>
      </div>

      <button class="buy-btn" style="width:100%; padding:15px; font-size:1.1rem; margin-top:20px;"
        onclick="window.carShopScreen.buyCar('${car.id}')" ${!canAfford ? "disabled" : ""}>
        ${canAfford ? "COMPRAR AGORA" : "DINHEIRO INSUFICIENTE"}
      </button>
    `;

    modal.classList.add("open");
  }

  closeModal() {
    const modal = document.getElementById("car-modal");
    if (modal) modal.classList.remove("open");
    this.selectedCar = null;
  }

  buyCar(carId) {
    if (!this.profile) return;
    const car = this.carsCatalog.find((c) => c.id === carId);

    if (this.profile.cash >= car.price) {
      this.profile.cash -= car.price;
      if (!this.profile.vehicles) this.profile.vehicles = [];

      const newVehicle = {
        ...car,
        instanceId: Date.now(),
        purchaseDate: new Date().toISOString(),
        installedParts: {},
      };

      this.profile.vehicles.push(newVehicle);
      if (window.profileManager) {
        window.profileManager.saveProfile(this.profile);
      }

      this.updateUI();
      this.closeModal();

      if (window.gameNotifications) {
        window.gameNotifications.success(`${car.name} adquirido! 🎉`);
      }
    } else {
      if (window.gameNotifications) {
        window.gameNotifications.error("Dinheiro insuficiente!");
      }
    }
  }

  updateUI() {
    const wallet = document.getElementById("cs-wallet-amount");
    if (wallet && this.profile) {
      wallet.innerText = this.profile.cash.toLocaleString();
    }
  }

  attachEvents() {
    // Back button
    const backBtn = document.getElementById("cs-back-btn");
    if (backBtn) {
      backBtn.onclick = () => {
        if (this.eventSystem) this.eventSystem.showScreen("main-menu");
      };
    }

    // Filter buttons
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach((btn) => {
      btn.onclick = (e) => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentFilter = e.target.dataset.filter;
        this.renderCars();
      };
    });

    // Modal close on overlay click
    const modal = document.getElementById("car-modal");
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      };
    }
  }
}

if (typeof window !== "undefined") {
  window.CarShopScreen = CarShopScreen;
  window.carShopScreen = new CarShopScreen();
}
