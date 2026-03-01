// bootstrap.js - Inicialização à prova de falhas

// Configuração global
window.game = window.game || {
  version: "2.0.0",
  isInitialized: false,
  currentScreen: "",
};

window.currentProfile = window.currentProfile || null;

// Cache de scripts já carregados
const loadedScripts = new Set();

// Função para carregar scripts dinamicamente
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Verificar se já foi carregado
    if (loadedScripts.has(src)) {
      // Script já carregado
    }

    // Verificar se já existe no DOM
    const existingScript = Array.from(
      document.querySelectorAll("script[src]"),
    ).find((s) => s.src.includes(src.split("/").pop()));

    if (existingScript) {
      // Script já no DOM
      resolve();
      return;
    }

    // Carregando script

    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      // Carregado
      loadedScripts.add(src);
      resolve();
    };

    script.onerror = () => {
      console.error(`❌ Falha ao carregar: ${src}`);
      reject(new Error(`Falha ao carregar ${src}`));
    };

    document.head.appendChild(script);
  });
}

// Função para inicializar o sistema
async function initializeSystem() {
  // Inicializando sistema

  try {
    // 1. Carregar scripts essenciais se não estiverem carregados
    const essentialScripts = [
      "js/System/ProfileManager.js",
      "js/System/GameNotifications.js",
      "js/System/EventSystem.js",
      "js/Screens/MainMenuScreen.js",
      "js/Screens/ProfileSelectionScreen.js",
      "js/Screens/ProfileCreationScreen.js",
      "js/Screens/GarageScreen.js",
      "js/Screens/SettingsScreen.js",
      "js/Screens/ShopScreen.js",
      "js/Screens/CarShopScreen.js",
      "js/Screens/TuningScreen.js",
      "js/Screens/RaceScreen.js",
    ];

    for (const script of essentialScripts) {
      // Verificar se a instância da tela já existe
      const fileName = script.split("/").pop(); // Extrair apenas o nome do arquivo
      const instanceMap = {
        "MainMenuScreen.js": "mainMenuScreen",
        "ProfileSelectionScreen.js": "profileSelectionScreen",
        "ProfileCreationScreen.js": "profileCreationScreen",
        "GarageScreen.js": "garageScreen",
        "SettingsScreen.js": "settingsScreen",
        "ShopScreen.js": "shopScreen",
        "CarShopScreen.js": "carShopScreen",
        "TuningScreen.js": "tuningScreen",
        "RaceScreen.js": "raceScreen",
        "ProfileManager.js": "profileManager",
        "GameNotifications.js": "gameNotifications",
        "EventSystem.js": "eventSystem",
      };

      const instanceCheck = instanceMap[fileName];
      const hasInstance = instanceCheck ? window[instanceCheck] : false;

      // Se já tem a instância, não precisa carregar novamente
      // Já tem instância

      // Tentar carregar (a função loadScript já verifica duplicação)
      await loadScript(script);
    }

    // 2. Aguardar EventSystem
    if (!window.eventSystem) {
      console.warn("⚠️ EventSystem não carregado, tentando novamente...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!window.eventSystem) {
        throw new Error("EventSystem não carregado após tentativa");
      }
    }

    // 3. Registrar todas as telas
    // Registrando telas

    const screens = [
      { id: "main-menu", instance: window.mainMenuScreen },
      { id: "profile-selection", instance: window.profileSelectionScreen },
      { id: "profile-creation", instance: window.profileCreationScreen },
      { id: "garage", instance: window.garageScreen },
      { id: "settings", instance: window.settingsScreen },
      { id: "shop-screen", instance: window.shopScreen },
      { id: "car-shop-screen", instance: window.carShopScreen },
      { id: "garage-screen", instance: window.garageScreen },
      { id: "tuning-screen", instance: window.tuningScreen },
      { id: "race-screen", instance: window.raceScreen },
    ];

    screens.forEach((screen) => {
      if (screen.instance) {
        window.eventSystem.registerScreen(screen.id, screen.instance);
        // Tela registrada
      } else {
        console.warn(`   ⚠️ ${screen.id} não disponível`);
      }
    });

    // 4. Esconder loading
    // Escondendo loading
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      loadingScreen.style.transition = "opacity 0.5s ease";

      setTimeout(() => {
        loadingScreen.style.display = "none";
        // Loading escondido

        // 5. Mostrar tela apropriada
        showFirstScreen();
      }, 500);
    } else {
      // Se não tem loading, mostrar diretamente
      showFirstScreen();
    }

    window.game.isInitialized = true;
    // Sistema inicializado
  } catch (error) {
    console.error("❌ Erro na inicialização:", error);
    showErrorScreen(`Erro: ${error.message}`);
  }
}

function showFirstScreen() {
  // Decidindo primeira tela

  let targetScreen = "profile-selection";

  // Verificar perfis
  if (window.profileManager) {
    const profiles = window.profileManager.getAllProfiles();

    // Perfis encontrados

    // Sempre mostrar seleção de perfis para garantir consistência
    // A tela de seleção já lida com o estado vazio e convida à criação
    targetScreen = "profile-selection";

    const currentProfile = window.profileManager.getCurrentProfile();
    if (currentProfile) {
      // Limpando perfil atual para seleção
      localStorage.removeItem("streetrod2_current_profile");
      localStorage.removeItem("sr2_currentProfile");
      window.currentProfile = null;
      if (window.eventSystem) window.eventSystem.setCurrentProfile(null);
    }
  }

  // Mostrando tela alvo

  // Mostrar tela
  if (window.eventSystem.showScreen(targetScreen)) {
    // Tela mostrada
  } else {
    console.error(`❌ Falha ao mostrar ${targetScreen}`);

    // Fallback para seleção de perfis
    window.eventSystem.showScreen("profile-selection");
  }
}

function showErrorScreen(message) {
  const container = document.getElementById("game-container");
  if (container) {
    container.innerHTML = `
            <div style="
                min-height: 100vh;
                background: #0a0a0f;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 40px;
                text-align: center;
            ">
                <h1 style="color: #ff4757; margin-bottom: 20px;">ERRO DE SISTEMA</h1>
                <p style="color: #aaa; margin-bottom: 30px; max-width: 500px;">
                    ${message}
                </p>
                <div style="display: flex; gap: 15px; margin-top: 20px;">
                    <button onclick="location.reload()" style="
                        padding: 12px 25px;
                        background: #ff4757;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-family: 'Rajdhani', sans-serif;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                        RECARREGAR
                    </button>
                    <button onclick="window.initializeSystem()" style="
                        padding: 12px 25px;
                        background: #1e90ff;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-family: 'Rajdhani', sans-serif;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                        TENTAR NOVAMENTE
                    </button>
                </div>
            </div>
        `;
  }

  // Esconder loading
  const loading = document.getElementById("loading-screen");
  if (loading) {
    loading.style.display = "none";
  }
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // DOM carregado
    setTimeout(initializeSystem, 100);
  });
} else {
  // DOM já carregado
  setTimeout(initializeSystem, 100);
}

// Expor função para uso manual
window.initializeSystem = initializeSystem;
window.showFirstScreen = showFirstScreen;

// Utilitário global para imagens de carros
window.getCarImageURL = function (car) {
  // Se já tiver uma URL completa (http), usa ela
  if (car.imageUrl && car.imageUrl.startsWith("http")) {
    return car.imageUrl;
  }

  // Se for um caminho local, garante que comece corretamente
  if (car.imageUrl) {
    return car.imageUrl;
  }

  // Fallback padrão baseado no ID do carro para facilitar troca de arquivos
  // O usuário pode simplesmente colocar uma foto com o nome [id].jpg em assets/cars/
  const fileName = car.id.replace("car_", "") + ".jpg";
  return `assets/cars/${fileName}`;
};

// Bootstrap pronto
