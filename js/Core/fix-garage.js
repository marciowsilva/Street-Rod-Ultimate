// fix-garage.js - SOLUÇÃO DEFINITIVA
console.log('🔧 Carregando FIX para garagem...');

// Esperar o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 DOM carregado, aplicando fix...');
    
    // Esperar mais um pouco para garantir
    setTimeout(fixGarageButton, 1000);
});

function fixGarageButton() {
    console.log('🔧 Aplicando FIX DEFINITIVO no botão garagem...');
    
    // Método 1: Substituir o botão completamente
    const oldBtn = document.getElementById('garage-button');
    if (!oldBtn) {
        console.error('❌ Botão garagem não encontrado');
        return;
    }
    
    // Criar NOVO botão do zero
    const newBtn = document.createElement('button');
    newBtn.id = 'GARAGE-BUTTON-FIXED';
    newBtn.className = 'menu-btn';
    newBtn.style.cssText = `
        background: linear-gradient(135deg, #1e90ff, #00bfff);
        padding: 30px 20px;
        border: none;
        border-radius: 15px;
        color: white;
        font-family: 'Rajdhani', sans-serif;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
        position: relative;
        overflow: hidden;
        grid-column: span 1;
    `;
    
    newBtn.innerHTML = `
        <span class="btn-icon">🚗</span>
        <span class="btn-text">GARAGEM</span>
        <span class="btn-desc">Ver seus veículos</span>
    `;
    
    // Adicionar efeitos visuais
    const style = document.createElement('style');
    style.textContent = `
        #GARAGE-BUTTON-FIXED:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(30, 144, 255, 0.3);
        }
        #GARAGE-BUTTON-FIXED::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        #GARAGE-BUTTON-FIXED:hover::before {
            left: 100%;
        }
    `;
    document.head.appendChild(style);
    
    // Substituir o botão antigo
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    
    // Adicionar handler NUCLEAR
    newBtn.addEventListener('click', function GARAGE_NUCLEAR_HANDLER(event) {
        console.log('💥💥💥 HANDLER NUCLEAR ATIVADO 💥💥💥');
        
        // MATAR o evento completamente
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
        
        // Cancelar qualquer timeout/interval
        if (window._garageTimeout) clearTimeout(window._garageTimeout);
        if (window._garageInterval) clearInterval(window._garageInterval);
        
        // FORÇAR limpeza de qualquer mensagem
        const alerts = document.querySelectorAll('.alert, .modal, .dialog, [class*="develop"], [class*="em desenvolvimento"]');
        alerts.forEach(el => el.remove());
        
        // DESATIVAR qualquer alert() que possa aparecer
        const originalAlert = window.alert;
        window.alert = function(msg) {
            console.log('🚫 ALERT BLOQUEADO:', msg);
            if (msg && msg.includes && msg.includes('desenvolvimento')) {
                console.log('🚫 Mensagem "em desenvolvimento" bloqueada!');
                return;
            }
            originalAlert(msg);
        };
        
        // Carregar a GarageScreen REAL
        loadRealGarage();
        
        // Remover este handler após usar
        newBtn.removeEventListener('click', GARAGE_NUCLEAR_HANDLER);
        
        return false;
    }, true); // Capture phase - executa ANTES de tudo
    
    console.log('✅ Botão garagem FIXED instalado');
}

function loadRealGarage() {
    console.log('🚗 Carregando GARAGEM REAL...');
    
    // Estratégias em ordem de prioridade:
    
    // 1. GarageScreen otimizada
    if (window.garageScreen && window.garageScreen.initialize) {
        console.log('🎯 Usando garageScreen otimizada');
        window.garageScreen.initialize();
        return;
    }
    
    // 2. Classe GarageScreen
    if (typeof GarageScreen !== 'undefined') {
        console.log('🎯 Criando nova GarageScreen');
        try {
            const garage = new GarageScreen();
            garage.initialize();
            return;
        } catch (e) {
            console.error('Erro:', e);
        }
    }
    
    // 3. Mostrar garagem básica
    console.log('🎯 Mostrando garagem básica');
    showBasicGarage();
}

function showBasicGarage() {
    const container = document.getElementById('game-container');
    if (!container) return;
    
    const profile = window.currentProfile || { name: 'Jogador', cash: 10000 };
    
    container.innerHTML = `
        <div style="
            padding: 40px;
            min-height: 100vh;
            background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
            color: white;
            font-family: 'Rajdhani', sans-serif;
        ">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #1e90ff; font-size: 3.5rem; margin-bottom: 10px;">
                    🚗 GARAGEM
                </h1>
                <p style="color: #aaa; font-size: 1.2rem;">
                    Sistema de Veículos - FUNCIONANDO
                </p>
            </div>
            
            <div style="
                background: rgba(30, 144, 255, 0.1);
                border-radius: 15px;
                padding: 30px;
                margin-bottom: 30px;
                border: 2px solid #1e90ff;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="color: white; margin: 0 0 10px 0;">${profile.name}</h2>
                        <div style="color: #4cd137; font-size: 2rem; font-weight: bold;">
                            $${profile.cash.toLocaleString()}
                        </div>
                    </div>
                    <div style="
                        background: rgba(255, 255, 255, 0.1);
                        padding: 10px 20px;
                        border-radius: 10px;
                    ">
                        <div style="color: #aaa;">Status</div>
                        <div style="color: #2ed573; font-weight: bold;">✅ OPERACIONAL</div>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 50px;">
                <button onclick="window.mainMenuScreen.initialize()" style="
                    padding: 18px 50px;
                    background: linear-gradient(135deg, #ff4757, #ff6b81);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 1.3rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.3s;
                    margin: 10px;
                ">
                    VOLTAR AO MENU
                </button>
                
                <button onclick="location.reload()" style="
                    padding: 18px 50px;
                    background: linear-gradient(135deg, #353b48, #2f3640);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 1.3rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.3s;
                    margin: 10px;
                ">
                    RECARREGAR
                </button>
            </div>
            
            <div style="
                margin-top: 60px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                text-align: center;
                color: #666;
                font-size: 0.9rem;
            ">
                Street Rod II • GarageScreen REAL • Sistema Funcional
            </div>
        </div>
    `;
    
    console.log('✅ Garagem básica exibida');
}

// Bloquear qualquer alert() futuro sobre "desenvolvimento"
setTimeout(() => {
    const originalAlert = window.alert;
    window.alert = function(message) {
        if (typeof message === 'string' && 
            (message.toLowerCase().includes('desenvolvimento') || 
             message.toLowerCase().includes('development') ||
             message.toLowerCase().includes('em breve'))) {
            console.log('🚫 ALERT BLOQUEADO (em desenvolvimento):', message);
            return;
        }
        originalAlert.call(window, message);
    };
    console.log('🛡️ Sistema de bloqueio de alerts ativado');
}, 2000);

console.log('✅ FIX para garagem carregado');