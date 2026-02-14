// CarShopScreen.js - CONCESSIONÁRIA ULTIMATE (Clone Exato da ShopScreen)
console.log("🚘 Carregando CarShopScreen...");

class CarShopScreen {
  constructor(eventSystem) {
    this.eventSystem = eventSystem;
    this.screenId = "car-shop-screen";
    this.isActive = false;

    // Catálogo de Carros Mockado
    this.carsCatalog = [
      // COMPACTOS
      {
        id: "car_beetle_new",
        name: "Bettle 1300",
        year: 1970,
        price: 8500,
        condition: "new",
        integrity: 100,
        power: 46,
        desc: "Zero km. Clássico confiável.",
        icon: "🐞",
        color: "#f1c40f",
      },
      {
        id: "car_beetle_used",
        name: "Bettle 1300 (Usado)",
        year: 1968,
        price: 3500,
        condition: "used",
        integrity: 75,
        power: 42,
        desc: "Precisa de amor e graxa.",
        icon: "🐞",
        color: "#95a5a6",
      },
      // MUSCLE
      {
        id: "car_opala_new",
        name: "Opala SS",
        year: 1974,
        price: 25000,
        condition: "new",
        integrity: 100,
        power: 171,
        desc: "O monstro de 6 cilindros.",
        icon: "🦁",
        color: "#e74c3c",
      },
      {
        id: "car_opala_used",
        name: "Opala Std (Usado)",
        year: 1972,
        price: 12000,
        condition: "used",
        integrity: 65,
        power: 140,
        desc: "Motor fumando um pouco.",
        icon: "🦁",
        color: "#7f8c8d",
      },
      // V8
      {
        id: "car_maverick_new",
        name: "Maverick GT",
        year: 1975,
        price: 28000,
        condition: "new",
        integrity: 100,
        power: 197,
        desc: "V8 302. Torque bruto.",
        icon: "🐴",
        color: "#e67e22",
      },
      // RELIC
      {
        id: "car_legend_used",
        name: "Hot Rod Legend",
        year: 1932,
        price: 45000,
        condition: "used",
        integrity: 85,
        power: 300,
        desc: "Lenda das pistas.",
        icon: "🔥",
        color: "#8e44ad",
      },
    ];

    this.currentFilter = "all";
  }

  show() {
    console.log("🚘 Abrindo Concessionária");
    this.isActive = true;
    this.updateProfileData();
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
                    background: url('${bgUrl}') no-repeat center center fixed; /* Fixed BG */
                    background-size: cover;
                    font-family: 'Rajdhani', sans-serif;
                    color: white;
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto; /* Scroll Global */
                }
                
                .cs-overlay {
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
                    max-width: 1200px; /* Igual ShopScreen */
                    margin: 0 auto;
                    width: 100%;
                }

                /* Header Identico */
                .cs-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 20px;
                }

                .cs-title {
                    margin-left: 100px;
                }

                .cs-title h1 {
                    font-size: 3rem;
                    margin: 0;
                    color: #fff;
                    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
                    letter-spacing: 5px;
                }
                .cs-title span { color: #f1c40f; }

                .cs-wallet {
                    font-size: 2rem;
                    color: #f1c40f;
                    font-weight: 700;
                    text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
                    background: rgba(0,0,0,0.5);
                    padding: 10px 25px;
                    border-radius: 50px;
                    border: 1px solid rgba(255, 215, 0, 0.3);
                }

                /* Layout Principal */
                .cs-main {
                    display: flex;
                    gap: 30px;
                    flex: 1;
                    /* overflow removido */
                    align-items: flex-start; /* Necessário para sticky */
                }

                /* Sidebar */
                .cs-sidebar {
                    width: 250px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    position: sticky; /* FIXO AO ROLAR */
                    top: 20px;
                    height: fit-content;
                    z-index: 10;
                }

                .filter-btn {
                    background: rgba(255, 255, 255, 0.05); /* Exato */
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #aaa;
                    padding: 15px 20px;
                    font-size: 1.1rem;
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
                    background: rgba(255, 215, 0, 0.15); /* Gold Alpha */
                    border-color: #f1c40f;
                    color: #f1c40f;
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
                }

                /* Grid de Carros (Mesma classe de grid/scroll da Shop) */
                .cs-grid {
                    flex: 1;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    grid-auto-rows: max-content;
                    gap: 20px;
                    /* Scroll interno removido */
                    padding: 20px;
                    padding-right: 10px;
                }

                .cs-grid::-webkit-scrollbar { width: 6px; }
                .cs-grid::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
                .cs-grid::-webkit-scrollbar-thumb { background: #f1c40f; border-radius: 3px; }

                /* Card Carro (Clone do part-card) */
                .car-card {
                    background: rgba(20, 20, 30, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08); /* Exato */
                    border-radius: 12px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    position: relative;
                    overflow: hidden;
                }

                .car-card:hover {
                    transform: translateY(-5px);
                    background: rgba(20, 20, 30, 0.8);
                    border-color: rgba(255, 215, 0, 0.5); /* Gold Alpha */
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                .car-icon {
                    font-size: 5rem;
                    align-self: center;
                    margin-bottom: 10px;
                    filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
                    text-align: center;
                }

                .car-info h3 { margin: 0; font-size: 1.4rem; color: #fff; }
                .car-info p { margin: 5px 0 0; font-size: 0.9rem; color: #888; }

                .car-stats-row {
                    display: flex;
                    gap: 10px;
                    font-size: 0.85rem;
                    margin-top: 5px;
                }

                .car-stat-tag {
                    color: #f1c40f;
                    background: rgba(255, 215, 0, 0.1);
                    padding: 5px 10px;
                    border-radius: 4px;
                }

                .car-price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fff;
                    margin-top: auto;
                }

                .buy-btn {
                    background: #f1c40f;
                    color: #000;
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
                    background: #fff;
                    box-shadow: 0 0 15px #f1c40f;
                }
                .buy-btn:active { transform: scale(0.95); }

                /* Helper para Badge de Novo/Usado */
                .car-badge {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    padding: 3px 8px;
                    border-radius: 4px;
                    text-transform: uppercase;
                }
                .badge-new { background: #f1c40f; color: black; }
                .badge-used { background: #7f8c8d; color: white; }

            </style>

            <div class="cs-overlay"></div>
            
            <button id="cs-back-btn" class="nav-btn">← VOLTAR</button>

            <div class="cs-content">
                <div class="cs-header">
                    <div class="cs-title">
                        <h1>AGÊNCIA <span style="color: #f1c40f;">PREMIUM</span></h1>
                        <div style="font-size: 1rem; color: #666; letter-spacing: 2px;">VEÍCULOS EXCLUSIVOS</div>
                    </div>
                    
                    <div class="cs-wallet">
                        $ <span id="cs-wallet-amount">${this.profile ? this.profile.cash.toLocaleString() : "0"}</span>
                    </div>
                </div>

                <div class="cs-main">
                    <!-- Sidebar -->
                    <div class="cs-sidebar">
                        <button class="filter-btn active" data-filter="all">TUDO</button>
                        <button class="filter-btn" data-filter="new">NOVOS</button>
                        <button class="filter-btn" data-filter="used">SEMINOVOS</button>
                    </div>

                    <!-- Grid Único (Igual ShopScreen) -->
                    <div class="cs-grid" id="cs-grid">
                        <!-- Items rendered via JS -->
                    </div>
                </div>
            </div>
        `;

    document.getElementById("game-container").appendChild(container);
    this.renderCars();
  }

  renderCars() {
    const grid = document.getElementById("cs-grid");
    grid.innerHTML = "";

    let cars = this.carsCatalog;
    if (this.currentFilter !== "all") {
      cars = cars.filter((c) => c.condition === this.currentFilter);
    }

    if (cars.length === 0) {
      grid.innerHTML =
        '<div style="color: #666; font-size: 1.5rem; padding: 20px;">Nenhum veículo disponível nesta categoria.</div>';
      return;
    }

    cars.forEach((car) => {
      const card = document.createElement("div");
      card.className = "car-card anim-fade-up";

      const badge =
        car.condition === "new"
          ? '<span class="car-badge badge-new">NOVO</span>'
          : '<span class="car-badge badge-used">USADO</span>';

      const yearHtml = `<span style="opacity:0.7; font-size:0.8em; margin-left:8px"> ${car.year}</span>`;

      // Simular visual do ShopScreen (Icon + Info + Stats + Price + Button)
      card.innerHTML = `
                ${badge}
                <div class="car-icon" style="color:${car.color}">${car.icon}</div>
                <div class="car-info">
                    <h3>${car.name}${yearHtml}</h3>
                    <p>${car.desc}</p>
                </div>
                
                <div class="car-stats-row">
                    <div class="car-stat-tag">⚡ ${car.power} HP</div>
                    <div class="car-stat-tag" style="${car.integrity < 100 ? "color:#e74c3c; background:rgba(231,76,60,0.1)" : ""}">🛠️ ${car.integrity}%</div>
                </div>

                <div class="car-price">$${car.price.toLocaleString()}</div>
                <button class="buy-btn" onclick="window.carShopScreen.buyCar('${car.id}')">COMPRAR</button>
            `;
      grid.appendChild(card);
    });
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
        parts: [],
      };
      this.profile.vehicles.push(newVehicle);
      if (window.profileManager)
        window.profileManager.saveProfile(this.profile);

      this.updateUI();
      if (window.gameNotifications)
        window.gameNotifications.success(`${car.name} adquirido!`);
    } else {
      if (window.gameNotifications)
        window.gameNotifications.error("Dinheiro insuficiente!");
    }
  }

  updateUI() {
    const wallet = document.getElementById("cs-wallet-amount");
    if (wallet) wallet.innerText = this.profile.cash.toLocaleString();
  }

  attachEvents() {
    document.getElementById("cs-back-btn").onclick = () => {
      if (this.eventSystem) this.eventSystem.showScreen("main-menu");
    };

    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach((btn) => {
      btn.onclick = (e) => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentFilter = e.target.dataset.filter;
        this.renderCars();
      };
    });
  }
}

if (typeof window !== "undefined") {
  window.CarShopScreen = CarShopScreen;
  window.carShopScreen = new CarShopScreen();
}
