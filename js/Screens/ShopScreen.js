// ShopScreen.js - LOJA DE PEÇAS ULTIMATE
console.log("🏪 Carregando ShopScreen (Parts)...");

class ShopScreen {
  constructor(eventSystem) {
    this.eventSystem = eventSystem;
    this.screenId = "shop-screen";
    this.isActive = false;

    // Catálogo de Peças Mockado (Posteriormente mover para Data/PartsCatalog.js)
    this.partsCatalog = {
      engine: [
        {
          id: "eng_carb_1",
          name: "Carburador Simples",
          price: 150,
          powerBonus: 5,
          slot: "carburetor",
          desc: "Melhora o fluxo de ar básico.",
          icon: "🔧",
        },
        {
          id: "eng_carb_2",
          name: "Carburador Duplo",
          price: 450,
          powerBonus: 12,
          slot: "carburetor",
          desc: "Dobro de entrada, dobro de resposta.",
          icon: "🔧",
        },
        {
          id: "eng_intake",
          name: "Admissão Esportiva",
          price: 300,
          powerBonus: 8,
          slot: "intake",
          desc: "Filtro de alto fluxo.",
          icon: "💨",
        },
        {
          id: "eng_pistons",
          name: "Pistões Forjados",
          price: 1200,
          powerBonus: 25,
          slot: "pistons",
          desc: "Aguenta mais compressão.",
          icon: "⚙️",
        },
      ],
      transmission: [
        {
          id: "trans_gb_4",
          name: "Câmbio 4 Marchas",
          price: 500,
          acc: 5,
          desc: "Relações curtas para arrancada.",
          icon: "🕹️",
        },
        {
          id: "trans_diff",
          name: "Diferencial Blocante",
          price: 800,
          acc: 10,
          desc: "Tração máxima nas duas rodas.",
          icon: "⛓️",
        },
      ],
      tires: [
        {
          id: "tire_street",
          name: "Pneus Radiais",
          price: 200,
          grip: 5,
          desc: "Borracha nova para o dia a dia.",
          icon: "🔘",
        },
        {
          id: "tire_sport",
          name: "Pneus Esportivos",
          price: 600,
          grip: 15,
          desc: "Composto macio para curvas.",
          icon: "🔘",
        },
        {
          id: "tire_slick",
          name: "Slicks de Arrancada",
          price: 1000,
          grip: 30,
          desc: "Aderência total no asfalto seco.",
          icon: "🔥",
        },
      ],
    };

    this.currentCategory = "engine";
  }

  show() {
    console.log("🏪 Abrindo Loja de Peças");
    this.isActive = true;
    this.updateProfileData();
    this.render();
    this.attachEvents();
    return this;
  }

  hide() {
    this.isActive = false;
    const container = document.getElementById("shop-container");
    if (container) container.remove();

    // Limpar estilos específicos se houver
    const style = document.getElementById("shop-styles");
    if (style) style.remove();
  }

  updateProfileData() {
    if (window.profileManager) {
      this.profile = window.profileManager.getCurrentProfile();
    }
  }

  render() {
    const container = document.createElement("div");
    container.id = "shop-container";
    container.className = "ps-root"; // Usar classes globais se existirem

    // Fundo (Reaproveitando o estilo do MainMenu ou um novo)
    // Vamos usar um fundo fixo de "Oficina" escuro para diferenciar
    const bgUrl = "./assets/images/backgrounds/bg-15.jpg"; // Usando um dos fundos da galeria como base

    container.innerHTML = `
            <style id="shop-styles">
                #shop-container {
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
                
                .shop-overlay {
                    position: fixed; /* Fixed Overlay */
                    inset: 0;
                    background: rgba(10, 10, 20, 0.85);
                    backdrop-filter: blur(8px);
                    z-index: 1;
                }

                .shop-content {
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

                /* Header */
                .shop-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 20px;
                }

                .shop-title h1 {
                    font-size: 3rem;
                    margin: 0;
                    color: #fff;
                    text-shadow: 0 0 20px rgba(46, 213, 115, 0.5);
                    letter-spacing: 5px;
                }
                .shop-title span { color: #2ed573; }

                .shop-wallet {
                    font-size: 2rem;
                    color: #2ed573;
                    font-weight: 700;
                    text-shadow: 0 0 15px rgba(46, 213, 115, 0.3);
                    background: rgba(0,0,0,0.5);
                    padding: 10px 25px;
                    border-radius: 50px;
                    border: 1px solid rgba(46, 213, 115, 0.3);
                }

                /* Layout Principal */
                .shop-main {
                    display: flex;
                    gap: 30px;
                    flex: 1;
                    /* overflow removido para permitir scroll global */
                    align-items: flex-start; /* Necessário para sticky funcionar bem se height for auto */
                }

                /* Sidebar Categorias */
                .shop-categories {
                    width: 250px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    position: sticky; /* FIXO AO ROLAR */
                    top: 20px;        /* Distância do topo */
                    height: fit-content;
                    z-index: 10;
                }

                .cat-btn {
                    background: rgba(255, 255, 255, 0.05);
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

                .cat-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    padding-left: 25px;
                }

                .cat-btn.active {
                    background: rgba(46, 213, 115, 0.15);
                    border-color: #2ed573;
                    color: #2ed573;
                    box-shadow: 0 0 20px rgba(46, 213, 115, 0.1);
                }

                /* Grid de Produtos */
                .shop-grid {
                    flex: 1;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    grid-auto-rows: max-content;
                    gap: 20px;
                    /* Scroll interno removido */
                    padding: 20px;
                    padding-right: 10px;
                }

                /* Scrollbar Custom */
                .shop-grid::-webkit-scrollbar { width: 6px; }
                .shop-grid::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
                .shop-grid::-webkit-scrollbar-thumb { background: #2ed573; border-radius: 3px; }

                /* Card de Produto */
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

                .part-icon {
                    font-size: 3rem;
                    align-self: center;
                    margin-bottom: 10px;
                    filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
                }

                .part-info h3 { margin: 0; font-size: 1.4rem; color: #fff; }
                .part-info p { margin: 5px 0 0; font-size: 0.9rem; color: #888; }
                
                .part-stats {
                    display: flex;
                    gap: 10px;
                    font-size: 0.85rem;
                    color: #2ed573;
                    background: rgba(46, 213, 115, 0.1);
                    padding: 5px 10px;
                    border-radius: 4px;
                    width: fit-content;
                }

                .part-price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fff;
                    margin-top: auto;
                }

                .buy-btn {
                    background: #2ed573;
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
                    box-shadow: 0 0 15px #2ed573;
                }

                .buy-btn:active { transform: scale(0.95); }

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

            </style>

            <div class="shop-overlay"></div>
            
            <button id="shop-back-btn" class="nav-btn">← VOLTAR</button>

            <div class="shop-content">
                <div class="shop-header">
                    <div class="shop-title" style="margin-left: 100px;">
                        <h1>LOJA DE <span style="color: #2ed573;">PEÇAS</span></h1>
                        <div style="font-size: 1rem; color: #666; letter-spacing: 2px;">PERFORMANCE & TUNING</div>
                    </div>
                    
                    <div class="shop-wallet">
                        $ <span id="wallet-amount">${this.profile ? this.profile.cash.toLocaleString() : "0"}</span>
                    </div>
                </div>

                <div class="shop-main">
                    <!-- Sidebar -->
                    <div class="shop-categories">
                        <button class="cat-btn ${this.currentCategory === "engine" ? "active" : ""}" data-cat="engine">MOTOR</button>
                        <button class="cat-btn ${this.currentCategory === "transmission" ? "active" : ""}" data-cat="transmission">TRANSMISSÃO</button>
                        <button class="cat-btn ${this.currentCategory === "tires" ? "active" : ""}" data-cat="tires">PNEUS & RODAS</button>
                        <button class="cat-btn" data-cat="visual">ESTÉTICA (Breve)</button>
                    </div>

                    <!-- Grid -->
                    <div class="shop-grid" id="shop-grid">
                        <!-- Items rendered via JS -->
                    </div>
                </div>
            </div>
        `;

    document.getElementById("game-container").appendChild(container);
    this.renderItems();
  }

  renderItems() {
    const grid = document.getElementById("shop-grid");
    grid.innerHTML = "";

    const items = this.partsCatalog[this.currentCategory] || [];

    if (items.length === 0) {
      grid.innerHTML =
        '<div style="color: #666; font-size: 1.5rem; padding: 20px;">Nenhuma peça disponível nesta categoria.</div>';
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "part-card anim-fade-up";

      // Construir string de stats
      let statHtml = "";
      if (item.powerBonus) statHtml += `<span>+${item.powerBonus} HP</span>`;
      if (item.acc) statHtml += `<span>-${item.acc}% 0-100</span>`;
      if (item.grip) statHtml += `<span>+${item.grip} GRIP</span>`;

      card.innerHTML = `
                <div class="part-icon">${item.icon}</div>
                <div class="part-info">
                    <h3>${item.name}</h3>
                    <p>${item.desc}</p>
                </div>
                ${statHtml ? `<div class="part-stats">${statHtml}</div>` : ""}
                <div class="part-price">$${item.price.toLocaleString()}</div>
                <button class="buy-btn" data-id="${item.id}" data-price="${item.price}">COMPRAR</button>
            `;

      const buyBtn = card.querySelector(".buy-btn");
      buyBtn.onclick = () => this.buyItem(item);

      grid.appendChild(card);
    });
  }

  buyItem(item) {
    if (!this.profile) return;

    if (this.profile.cash >= item.price) {
      // Sucesso
      this.profile.cash -= item.price;

      // Adicionar ao inventário (estrutura básica)
      if (!this.profile.inventory) this.profile.inventory = [];
      this.profile.inventory.push(item);

      // Salvar
      if (window.profileManager) {
        window.profileManager.saveProfile(this.profile);
      }

      // UI Feedback
      this.updateWalletUI();
      this.playSound("cash");

      // Notificação Global
      if (window.gameNotifications) {
        window.gameNotifications.success(`Comprado: ${item.name}`);
      }

      // Notificação visual (Alert temporário, idealmente um Toast Notification)
      const btn = document.querySelector(`button[data-id="${item.id}"]`);
      const originalText = btn.innerText;
      btn.innerText = "COMPRADO!";
      btn.style.background = "#fff";
      btn.style.color = "#2ed573";

      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "#2ed573";
        btn.style.color = "#000";
      }, 1000);
    } else {
      // Falha
      this.playSound("error");

      if (window.gameNotifications) {
        window.gameNotifications.error(
          `Dinheiro insuficiente! Faltam $${(item.price - this.profile.cash).toLocaleString()}`,
        );
      }

      const btn = document.querySelector(`button[data-id="${item.id}"]`);
      btn.classList.add("shake-anim"); // Assumindo keyframes globais ou inline
      btn.innerText = "DINHEIRO INSUFICIENTE";
      btn.style.background = "#ff4757";

      setTimeout(() => {
        btn.innerText = "COMPRAR";
        btn.style.background = "#2ed573";
        btn.classList.remove("shake-anim");
      }, 1500);
    }
  }

  updateWalletUI() {
    const walletEl = document.getElementById("wallet-amount");
    if (walletEl) {
      walletEl.innerText = this.profile.cash.toLocaleString();
    }
  }

  playSound(type) {
    // Implementação básica de som ou chamada ao AudioManager
    console.log(`🔊 Som tocado: ${type}`);
  }

  attachEvents() {
    // Voltar
    document.getElementById("shop-back-btn").onclick = () => {
      if (this.eventSystem) this.eventSystem.showScreen("main-menu");
    };

    // Categorias
    document.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.onclick = (e) => {
        // Remove active de todos
        document
          .querySelectorAll(".cat-btn")
          .forEach((b) => b.classList.remove("active"));
        // Add active ao clicado
        e.target.classList.add("active");

        this.currentCategory = e.target.dataset.cat;
        this.renderItems();
      };
    });
  }
}

// Registro global
if (typeof window !== "undefined") {
  window.ShopScreen = ShopScreen;
  window.shopScreen = new ShopScreen();
}
