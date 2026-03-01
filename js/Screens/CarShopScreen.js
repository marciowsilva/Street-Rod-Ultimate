// CarShopScreen.js - CONCESSIONÁRIA COM CARROS REAIS E IMAGENS
// CarShopScreen.js - CONCESSIONÁRIA COM CARROS REAIS E IMAGENS

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
      // Database carregada
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
    const container = document.getElementById("game-container");
    if (!container) return;

    const bgUrl =
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2070";

    if (!document.getElementById("car-shop-container")) {
      container.innerHTML = `
            <div id="car-shop-container" class="ps-root" style="
                background: url('${bgUrl}') center/cover no-repeat;
                height: 100vh;
                display: flex;
                flex-direction: column;
                position: relative;
                overflow: hidden;
                font-family: 'Rajdhani', sans-serif;
                color: #fff;
            ">
                <div class="ps-glass-overlay" style="
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(10, 10, 25, 0.75) 0%, rgba(5, 5, 10, 0.95) 100%);
                    backdrop-filter: blur(10px);
                    z-index: 0;
                "></div>

                <!-- Botão Voltar -->
                <button id="cs-back-btn" class="nav-btn st-btn-secondary anim-fade-down" style="position: absolute; top: 30px; left: 30px; z-index: 100; font-size: 1rem; letter-spacing: 2px;">
                    &larr; VOLTAR
                </button>

                <header class="ps-header anim-fade-down" style="position: relative; z-index: 10; padding: 40px 0 20px; text-align: center;">
                    <h1 class="ps-game-title" style="font-size: 3.5rem; font-weight: 800; letter-spacing: 8px; margin: 0; text-shadow: 0 0 30px rgba(0, 255, 136, 0.5);">
                        AGÊNCIA <span class="ps-accent-text" style="color: #00ff88;">PREMIUM</span>
                    </h1>
                    <p class="ps-game-subtitle" style="color: #aaa; font-size: 1.1rem; letter-spacing: 4px; margin-top: 5px; text-transform: uppercase;">VEÍCULOS EXCLUSIVOS E IMPORTADOS</p>
                </header>

                <!-- Status Panel (Wallet) -->
                <div class="anim-fade-down" style="position: absolute; top: 30px; right: 30px; z-index: 100;">
                    <div style="background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(0, 255, 136, 0.3); padding: 15px 30px; border-radius: 15px; backdrop-filter: blur(5px); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <div style="font-size: 0.8rem; color: #aaa; letter-spacing: 2px; text-transform: uppercase;">SALDO DISPONÍVEL</div>
                        <div style="font-size: 2rem; font-weight: 800; color: #00ff88; text-shadow: 0 0 15px rgba(0, 255, 136, 0.4);">
                            $ <span id="cs-wallet-amount">${this.profile ? this.profile.cash.toLocaleString() : "0"}</span>
                        </div>
                    </div>
                </div>

                <main class="anim-fade-up" style="position: relative; z-index: 10; flex: 1; display: flex; gap: 30px; padding: 20px 40px 40px; max-width: 1400px; margin: 0 auto; width: 100%;">
                    
                    <!-- Sidebar (Filtros) -->
                    <aside style="width: 250px; display: flex; flex-direction: column; gap: 15px;">
                        <h3 style="color: #00ff88; font-size: 1.2rem; margin-bottom: 10px; letter-spacing: 2px;">CATEGORIAS</h3>
                        <button class="filter-btn active" data-filter="all">Todas as Classes</button>
                        <button class="filter-btn" data-filter="classic">Clássicos</button>
                        <button class="filter-btn" data-filter="muscle">Muscle Cars</button>
                        <button class="filter-btn" data-filter="hotrod">Hot Rods</button>
                        <button class="filter-btn" data-filter="modern">Modernos / JDM</button>
                    </aside>

                    <!-- Grid de Carros -->
                    <div id="cs-grid" style="
                        flex: 1;
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        grid-auto-rows: max-content;
                        gap: 25px;
                        overflow-y: auto;
                        padding-right: 15px;
                    ">
                        <!-- Car Cards via JS -->
                    </div>
                </main>

                <!-- Modal para detalhes -->
                <div class="car-modal" id="car-modal">
                    <div class="car-modal-content" id="car-modal-content">
                        <!-- Filled by JS -->
                    </div>
                </div>
            </div>
        `;

      this.addStyles();
    }
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
      card.style.animation = "fadeInUp 0.5s ease backwards";

      const badgeClass = car.condition === "new" ? "new" : "used";
      const badgeText = car.condition === "new" ? "ZERO KM" : "SEMI-NOVO";

      const imagePath = window.getCarImageURL(car);
      const imageHtml = `
        <img src="${imagePath}" 
             alt="${car.name}" 
             onerror="this.onerror=null; this.parentElement.innerHTML='<div style=&quot;font-size:3rem&quot;>${car.icon}</div>'">
      `;

      card.innerHTML = `
        <div class="car-card-image">
          ${imageHtml}
          <div class="car-card-badge ${badgeClass}">${badgeText}</div>
        </div>
        <div class="car-card-body">
          <div style="margin-bottom: 5px;">
            <div class="car-card-name">${car.name}</div>
            <div class="car-card-year">${car.year} • ${car.vehicleType.toUpperCase()}</div>
          </div>
          <div class="car-card-stats">
            <div class="car-stat-badge">⚡ ${car.power} HP</div>
            <div class="car-stat-badge">⚙️ ${car.transmission}</div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:auto; padding-top:10px;">
            <div>
              <span class="car-card-price-label">PREÇO</span>
              <div class="car-card-price">$${car.price.toLocaleString()}</div>
            </div>
            <button class="buy-btn st-btn-primary" style="padding: 8px 15px; font-size: 0.85rem;" data-id="${car.id}">DETALHES</button>
          </div>
        </div>
      `;

      // Clicar no card inteiro (exceto no botão, que já propaga se deixar)
      card.onclick = (e) => this.showDetails(car.id, e);
      grid.appendChild(card);
    });
  }

  showDetails(carId, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const car = this.carsCatalog.find((c) => c.id === carId);
    if (!car) return;
    this.selectedCar = car;

    if (window.audioSystem) window.audioSystem.play("click");

    const modal = document.getElementById("car-modal");
    const content = document.getElementById("car-modal-content");
    const imagePath = window.getCarImageURL(car);

    const canAfford = this.profile && this.profile.cash >= car.price;

    let specsHtml = `
      <div class="spec-item"><div class="spec-label">Motor</div><div class="spec-value">${car.cylinders} Cyl / ${car.displacement}cc</div></div>
      <div class="spec-item"><div class="spec-label">Potência</div><div class="spec-value">${car.power} HP</div></div>
      <div class="spec-item"><div class="spec-label">Torque</div><div class="spec-value">${car.torque} Nm</div></div>
      <div class="spec-item"><div class="spec-label">Transmissão</div><div class="spec-value">${car.transmission}</div></div>
      <div class="spec-item"><div class="spec-label">Tração</div><div class="spec-value">${car.driveType.toUpperCase()}</div></div>
      <div class="spec-item"><div class="spec-label">0-100 km/h</div><div class="spec-value">${car.acceleration}s</div></div>
      <div class="spec-item"><div class="spec-label">Velocidade Máx.</div><div class="spec-value">${car.topSpeed} km/h</div></div>
      <div class="spec-item"><div class="spec-label">Peso</div><div class="spec-value">${car.weight} kg</div></div>
    `;

    content.innerHTML = `
      <button class="modal-close" id="mc-close-btn">×</button>
      <div class="modal-image">
        <img src="${imagePath}" onerror="this.onerror=null; this.parentElement.innerHTML='<div style=&quot;font-size:5rem&quot;>${car.icon}</div>'">
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
            <h2 style="margin:0; font-size: 2.5rem; color:#fff; font-weight: 800; letter-spacing: 2px;">${car.name}</h2>
            <div style="color:#00ff88; font-size: 1.1rem; margin-bottom:15px; letter-spacing: 2px;">${car.year} • ${car.vehicleType.toUpperCase()}</div>
        </div>
        <div style="text-align: right;">
            <div style="color: #aaa; font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase;">Valor do Veículo</div>
            <div style="font-size: 2.5rem; color: ${canAfford ? "#00ff88" : "#ff4757"}; font-weight: 800;">$${car.price.toLocaleString()}</div>
        </div>
      </div>

      <p style="color:#aaa; font-size: 1.1rem; line-height:1.6; margin-bottom:20px; border-left: 3px solid #00ff88; padding-left: 15px;">${car.description}</p>

      <h3 style="color:#fff; margin-top:20px; font-size: 1.2rem; letter-spacing: 2px;">FICHA TÉCNICA</h3>
      <div class="spec-grid">
        ${specsHtml}
      </div>

      <button class="buy-action-btn" id="mc-buy-btn" style="width:100%; margin-top:20px;" ${!canAfford ? "disabled" : ""}>
        ${canAfford ? "ASSINAR CONTRATO DE COMPRA" : "FUNDOS INSUFICIENTES"}
      </button>
    `;

    modal.classList.add("open");

    document.getElementById("mc-close-btn").onclick = () => this.closeModal();
    document.getElementById("mc-buy-btn").onclick = () => this.buyCar(car.id);
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
      if (window.audioSystem) window.audioSystem.play("buy");

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
        window.gameNotifications.success(
          `${car.name} adquirido e enviado para a Garagem! 🎉`,
        );
      }
    } else {
      if (window.audioSystem) window.audioSystem.play("error");

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
    const backBtn = document.getElementById("cs-back-btn");
    if (backBtn) {
      backBtn.onclick = () => {
        if (this.eventSystem) this.eventSystem.showScreen("main-menu");
      };
    }

    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach((btn) => {
      btn.onclick = (e) => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentFilter = e.target.dataset.filter;
        this.renderCars();
      };
    });

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
