// ShopScreen.js - LOJA DE PEÇAS ULTIMATE
// ShopScreen.js - LOJA DE PEÇAS ULTIMATE

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
          compatibleWith: {
            engineTypes: ["v8", "v6", "inline6"],
            yearRange: [1960, 1985],
          },
        },
        {
          id: "eng_carb_2",
          name: "Carburador Duplo",
          price: 450,
          powerBonus: 12,
          slot: "carburetor",
          desc: "Dobro de entrada, dobro de resposta.",
          icon: "🔧",
          compatibleWith: {
            engineTypes: ["v8", "inline6"],
            yearRange: [1965, 1985],
          },
        },
        {
          id: "eng_intake",
          name: "Admissão Esportiva",
          price: 300,
          powerBonus: 8,
          slot: "intake",
          desc: "Filtro de alto fluxo.",
          icon: "💨",
          // Universal - funciona em qualquer motor
        },
        {
          id: "eng_pistons",
          name: "Pistões Forjados",
          price: 1200,
          powerBonus: 25,
          slot: "pistons",
          desc: "Aguenta mais compressão.",
          icon: "⚙️",
          compatibleWith: {
            vehicleTypes: ["muscle", "hotrod"],
            engineTypes: ["v8", "inline6"],
          },
        },
      ],
      transmission: [
        {
          id: "trans_gb_4",
          name: "Câmbio 4 Marchas",
          price: 500,
          acc: 5,
          slot: "transmission",
          desc: "Relações curtas para arrancada.",
          icon: "🕹️",
          // Universal - funciona em qualquer carro
        },
        {
          id: "trans_diff",
          name: "Diferencial Blocante",
          price: 800,
          acc: 10,
          slot: "differential",
          desc: "Tração máxima nas duas rodas.",
          icon: "⛓️",
          compatibleWith: {
            driveTypes: ["rwd"], // Apenas tração traseira
          },
        },
      ],
      tires: [
        {
          id: "tire_street",
          name: "Pneus Radiais",
          price: 200,
          grip: 5,
          slot: "tires",
          desc: "Borracha nova para o dia a dia.",
          icon: "🔘",
          // Universal
        },
        {
          id: "tire_sport",
          name: "Pneus Esportivos",
          price: 600,
          grip: 15,
          slot: "tires",
          desc: "Composto macio para curvas.",
          icon: "🔘",
          // Universal
        },
        {
          id: "tire_slick",
          name: "Slicks de Arrancada",
          price: 1000,
          grip: 30,
          slot: "tires",
          desc: "Aderência total no asfalto seco.",
          icon: "🔥",
          compatibleWith: {
            vehicleTypes: ["muscle", "hotrod"],
            driveTypes: ["rwd"],
          },
        },
      ],
    };

    this.currentCategory = "engine";
  }

  show() {
    // Abrindo Loja de Peças
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
    const container = document.getElementById("game-container");
    if (!container) return;

    const bgUrl =
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=2070";

    if (!document.getElementById("shop-container")) {
      container.innerHTML = `
            <div id="shop-container" class="ps-root" style="
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
                    backdrop-filter: blur(8px);
                    z-index: 0;
                "></div>

                <button id="shop-back-btn" class="nav-btn st-btn-secondary anim-fade-down" style="position: absolute; top: 30px; left: 30px; z-index: 100; font-size: 1rem; letter-spacing: 2px;">
                    &larr; VOLTAR
                </button>

                <header class="ps-header anim-fade-down" style="position: relative; z-index: 10; padding: 40px 0 20px; text-align: center;">
                    <h1 class="ps-game-title" style="font-size: 3.5rem; font-weight: 800; letter-spacing: 8px; margin: 0; text-shadow: 0 0 30px rgba(46, 213, 115, 0.5);">
                        AUTO <span class="ps-accent-text" style="color: #2ed573;">PARTS</span>
                    </h1>
                    <p class="ps-game-subtitle" style="color: #aaa; font-size: 1.1rem; letter-spacing: 4px; margin-top: 5px; text-transform: uppercase;">PERFORMANCE & TUNING</p>
                </header>

                <div class="anim-fade-down" style="position: absolute; top: 30px; right: 30px; z-index: 100;">
                    <div style="background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(46, 213, 115, 0.3); padding: 15px 30px; border-radius: 15px; backdrop-filter: blur(5px); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <div style="font-size: 0.8rem; color: #aaa; letter-spacing: 2px; text-transform: uppercase;">SALDO DISPONÍVEL</div>
                        <div style="font-size: 2rem; font-weight: 800; color: #2ed573; text-shadow: 0 0 15px rgba(46, 213, 115, 0.4);">
                            $ <span id="wallet-amount">${this.profile ? this.profile.cash.toLocaleString() : "0"}</span>
                        </div>
                    </div>
                </div>

                <main class="anim-fade-up" style="position: relative; z-index: 10; flex: 1; display: flex; gap: 30px; padding: 20px 40px 40px; max-width: 1400px; margin: 0 auto; width: 100%;">
                    
                    <aside style="width: 250px; display: flex; flex-direction: column; gap: 15px;">
                        <h3 style="color: #2ed573; font-size: 1.2rem; margin-bottom: 10px; letter-spacing: 2px;">CATEGORIAS</h3>
                        <button class="cat-btn ${this.currentCategory === "engine" ? "active" : ""}" data-cat="engine">MOTOR</button>
                        <button class="cat-btn ${this.currentCategory === "transmission" ? "active" : ""}" data-cat="transmission">TRANSMISSÃO</button>
                        <button class="cat-btn ${this.currentCategory === "tires" ? "active" : ""}" data-cat="tires">PNEUS & RODAS</button>
                        <button class="cat-btn" data-cat="visual">ESTÉTICA (Breve)</button>
                    </aside>

                    <div id="shop-grid" style="
                        flex: 1;
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        grid-auto-rows: max-content;
                        gap: 25px;
                        overflow-y: auto;
                        padding-right: 15px;
                    ">
                        <!-- Part Cards via JS -->
                    </div>
                </main>
            </div>
        `;

      this.addStyles();
    }
    this.renderItems();
  }

  addStyles() {
    if (document.getElementById("shop-premium-styles")) return;
    const style = document.createElement("style");
    style.id = "shop-premium-styles";
    style.textContent = `
        #shop-grid::-webkit-scrollbar { width: 8px; }
        #shop-grid::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 4px; }
        #shop-grid::-webkit-scrollbar-thumb { background: #2ed573; border-radius: 4px; }

        .cat-btn {
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
        .cat-btn:hover { background: rgba(255, 255, 255, 0.1); color: white; padding-left: 25px; }
        .cat-btn.active { background: rgba(46, 213, 115, 0.15); border-color: #2ed573; color: #2ed573; box-shadow: 0 0 20px rgba(46, 213, 115, 0.2); }

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
            backdrop-filter: blur(5px);
        }

        .part-card:hover {
            transform: translateY(-5px);
            background: rgba(20, 20, 30, 0.9);
            border-color: rgba(46, 213, 115, 0.5);
            box-shadow: 0 15px 35px rgba(0,0,0,0.6);
        }

        .part-icon { font-size: 3.5rem; align-self: center; margin-bottom: 10px; filter: drop-shadow(0 0 15px rgba(46, 213, 115, 0.3)); transition: transform 0.3s; }
        .part-card:hover .part-icon { transform: scale(1.1); }

        .part-info h3 { margin: 0; font-size: 1.3rem; color: #fff; letter-spacing: 1px; }
        .part-info p { margin: 5px 0 0; font-size: 0.9rem; color: #aaa; line-height: 1.4; }
        
        .part-stats {
            display: flex;
            gap: 10px;
            font-size: 0.85rem;
            color: #2ed573;
            background: rgba(46, 213, 115, 0.1);
            padding: 8px 12px;
            border-radius: 6px;
            width: fit-content;
            border: 1px solid rgba(46, 213, 115, 0.2);
            font-weight: bold;
            letter-spacing: 1px;
        }

        .part-price { font-size: 1.8rem; font-weight: 800; color: #fff; margin-top: auto; }

        .buy-action-btn {
            background: linear-gradient(135deg, #2ed573, #26ba62);
            color: #000;
            border: none;
            padding: 12px;
            font-family: inherit;
            font-weight: 800;
            font-size: 1rem;
            letter-spacing: 1px;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s;
            text-transform: uppercase;
        }

        .buy-action-btn:hover { background: #fff; box-shadow: 0 0 20px rgba(46, 213, 115, 0.6); transform: translateY(-2px); }
        .buy-action-btn:active { transform: translateY(1px); }
    `;
    document.head.appendChild(style);
  }

  renderItems() {
    const grid = document.getElementById("shop-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const items = this.partsCatalog[this.currentCategory] || [];

    if (items.length === 0) {
      grid.innerHTML =
        '<div style="color: #666; font-size: 1.5rem; padding: 20px;">Nenhuma peça disponível nesta categoria.</div>';
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "part-card";
      card.style.animation = "fadeInUp 0.5s ease backwards";

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
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:auto; padding-top:10px;">
            <div>
              <span style="font-size: 0.7rem; color: #2ed573; letter-spacing: 1px; display: block; margin-bottom: -5px;">PREÇO</span>
              <div class="part-price">$${item.price.toLocaleString()}</div>
            </div>
            <button class="buy-action-btn" data-id="${item.id}" data-price="${item.price}" style="padding: 10px 20px;">COMPRAR</button>
        </div>
      `;

      const buyBtn = card.querySelector(".buy-action-btn");
      buyBtn.onclick = () => this.buyItem(item);

      grid.appendChild(card);
    });
  }

  buyItem(item) {
    if (!this.profile) return;

    if (this.profile.cash >= item.price) {
      if (window.audioSystem) window.audioSystem.play("buy");

      this.profile.cash -= item.price;

      if (!this.profile.inventory) this.profile.inventory = [];
      this.profile.inventory.push(item);

      if (window.profileManager) {
        window.profileManager.saveProfile(this.profile);
      }

      this.updateWalletUI();

      if (window.gameNotifications) {
        window.gameNotifications.success(`Comprado: ${item.name}`);
      }

      const btn = document.querySelector(`button[data-id="${item.id}"]`);
      if (btn) {
        const originalText = btn.innerText;
        btn.innerText = "COMPRADO!";
        btn.style.background = "#fff";
        btn.style.color = "#2ed573";

        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.background = "";
          btn.style.color = "";
        }, 1000);
      }
    } else {
      if (window.audioSystem) window.audioSystem.play("error");

      if (window.gameNotifications) {
        window.gameNotifications.error(
          `Dinheiro insuficiente! Faltam $${(item.price - this.profile.cash).toLocaleString()}`,
        );
      }

      const btn = document.querySelector(`button[data-id="${item.id}"]`);
      if (btn) {
        btn.innerText = "SEM SALDO";
        btn.style.background = "#ff4757";
        btn.style.color = "#fff";

        setTimeout(() => {
          btn.innerText = "COMPRAR";
          btn.style.background = "";
          btn.style.color = "";
        }, 1500);
      }
    }
  }

  updateWalletUI() {
    const walletEl = document.getElementById("wallet-amount");
    if (walletEl && this.profile) {
      walletEl.innerText = this.profile.cash.toLocaleString();
    }
  }

  attachEvents() {
    const backBtn = document.getElementById("shop-back-btn");
    if (backBtn) {
      backBtn.onclick = () => {
        if (this.eventSystem) this.eventSystem.showScreen("main-menu");
      };
    }

    const catBtns = document.querySelectorAll(".cat-btn");
    catBtns.forEach((btn) => {
      btn.onclick = (e) => {
        catBtns.forEach((b) => b.classList.remove("active"));
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
