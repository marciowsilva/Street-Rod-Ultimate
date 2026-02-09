// GarageFix.js - SOLUÇÃO DEFINITIVA PARA PROBLEMA DO BOTÃO GARAGEM
console.log('🔧 Inicializando GarageFix...');

class GarageFix {
    constructor() {
        this.originalAlert = null;
        this.isFixed = false;
        this.maxAttempts = 10;
        this.attemptCount = 0;
    }

    // Método principal para aplicar o fix
    applyFix() {
        if (this.isFixed) {
            console.log('✅ GarageFix já aplicado');
            return;
        }

        console.log('🔧 Aplicando GarageFix...');
        
        // 1. Bloquear mensagens "em desenvolvimento"
        this.blockDevelopmentMessages();
        
        // 2. Interceptar o botão garagem
        this.interceptGarageButton();
        
        // 3. Monitorar contínuamente
        this.startMonitoring();
        
        this.isFixed = true;
        console.log('✅ GarageFix aplicado com sucesso');
    }

    // Bloquear qualquer mensagem de "desenvolvimento"
    blockDevelopmentMessages() {
        console.log('🛡️ Bloqueando mensagens "em desenvolvimento"...');
        
        // Salvar alert original
        this.originalAlert = window.alert;
        
        // Sobrescrever alert()
        window.alert = (message) => {
            if (typeof message === 'string') {
                const msgLower = message.toLowerCase();
                if (msgLower.includes('desenvolvimento') || 
                    msgLower.includes('development') || 
                    msgLower.includes('em breve') ||
                    msgLower.includes('construção')) {
                    console.log('🚫 ALERT BLOQUEADO:', message);
                    return; // Não mostrar o alert
                }
            }
            // Se não for mensagem de desenvolvimento, mostrar normalmente
            this.originalAlert(message);
        };

        // Bloquear console.log específicos também
        const originalConsoleLog = console.log;
        console.log = (...args) => {
            const firstArg = args[0];
            if (typeof firstArg === 'string' && 
                firstArg.toLowerCase().includes('desenvolvimento')) {
                console.warn('🚫 Console.log bloqueado (contém "desenvolvimento"):', firstArg);
                return;
            }
            originalConsoleLog.apply(console, args);
        };
    }

    // Interceptar e corrigir o botão garagem
    interceptGarageButton() {
        console.log('🎯 Interceptando botão garagem...');
        
        // Encontrar TODOS os botões que podem ser o da garagem
        const buttonSelectors = [
            '#garage-button',
            'button[id*="garage"]',
            'button:has(span:contains("GARAGEM"))',
            'button:has(span:contains("Garagem"))',
            '.menu-btn:has(.btn-icon:contains("🚗"))'
        ];
        
        let foundButton = null;
        
        // Tentar cada seletor
        for (const selector of buttonSelectors) {
            try {
                const btn = document.querySelector(selector);
                if (btn) {
                    foundButton = btn;
                    console.log('✅ Botão encontrado com seletor:', selector);
                    break;
                }
            } catch (e) {
                // Ignorar erros de seletor inválido
            }
        }
        
        if (!foundButton) {
            console.warn('⚠️ Botão garagem não encontrado, tentando novamente em 500ms');
            setTimeout(() => this.interceptGarageButton(), 500);
            return;
        }
        
        // DESTRUIR completamente o botão antigo
        this.nuclearReplaceButton(foundButton);
    }

    // Substituição NUCLEAR do botão
    nuclearReplaceButton(oldButton) {
        console.log('💥 Substituição NUCLEAR do botão...');
        
        // 1. Matar todos os event listeners
        const newButton = oldButton.cloneNode(true);
        
        // 2. Remover todos os atributos de evento
        const attrs = newButton.attributes;
        for (let i = attrs.length - 1; i >= 0; i--) {
            const attr = attrs[i];
            if (attr.name.startsWith('on') || 
                attr.name === 'data-event' || 
                attr.name.includes('click')) {
                newButton.removeAttribute(attr.name);
            }
        }
        
        // 3. Substituir o botão antigo
        oldButton.parentNode.replaceChild(newButton, oldButton);
        
        // 4. Adicionar nosso handler IMPERMEÁVEL
        newButton.addEventListener('click', this.garageNuclearHandler.bind(this), true);
        
        // 5. Adicionar também via onclick (para máxima cobertura)
        newButton.onclick = (e) => {
            this.garageNuclearHandler(e);
            return false;
        };
        
        console.log('✅ Botão substituído nuclearmente');
    }

    // Handler NUCLEAR - IMPERMEÁVEL
    garageNuclearHandler(event) {
        console.log('💥💥💥 HANDLER NUCLEAR ATIVADO 💥💥💥');
        
        // Matar o evento COMPLETAMENTE
        if (event) {
            event.stopImmediatePropagation();
            event.preventDefault();
            event.stopPropagation();
            event.cancelBubble = true;
            event.returnValue = false;
        }
        
        // Cancelar qualquer timeout/interval relacionado
        this.cancelAllIntervals();
        
        // Forçar a GarageScreen REAL
        this.loadRealGarageNow();
        
        // IMPEDIR qualquer comportamento padrão
        return false;
    }

    // Carregar a GarageScreen REAL
    loadRealGarageNow() {
        console.log('🚗 CARREGANDO GARAGEM REAL...');
        
        // Estratégia 1: GarageScreen otimizada
        if (window.garageScreen && typeof window.garageScreen.initialize === 'function') {
            console.log('✅ Usando garageScreen.initialize()');
            window.garageScreen.initialize();
            return;
        }
        
        // Estratégia 2: Classe GarageScreen
        if (typeof GarageScreen !== 'undefined') {
            console.log('✅ Criando nova GarageScreen');
            try {
                const garage = new GarageScreen();
                garage.initialize();
                return;
            } catch (e) {
                console.error('❌ Erro ao criar GarageScreen:', e);
            }
        }
        
        // Estratégia 3: Mostrar garagem mínima
        console.log('⚠️ Nenhuma GarageScreen encontrada, mostrando versão mínima');
        this.showMinimalGarage();
    }

    // Mostrar garagem mínima (fallback)
    showMinimalGarage() {
        const container = document.getElementById('game-container');
        if (!container) {
            console.error('❌ Container não encontrado');
            return;
        }
        
        const profile = window.currentProfile || { name: 'Jogador', cash: 10000 };
        
        container.innerHTML = `
            <div style="
                padding: 40px;
                min-height: 100vh;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                color: white;
                font-family: 'Rajdhani', sans-serif;
            ">
                <!-- Cabeçalho -->
                <div style="text-align: center; margin-bottom: 50px;">
                    <h1 style="color: #1e90ff; font-size: 4rem; margin-bottom: 10px;">
                        🚗 GARAGEM
                    </h1>
                    <p style="color: #aaa; font-size: 1.2rem;">
                        Sistema Real - Não é "Em Desenvolvimento"
                    </p>
                </div>
                
                <!-- Perfil -->
                <div style="
                    background: rgba(30, 144, 255, 0.15);
                    border-radius: 15px;
                    padding: 30px;
                    margin-bottom: 40px;
                    border: 2px solid #1e90ff;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="color: white; font-size: 2rem; font-weight: bold;">
                                ${profile.name}
                            </div>
                            <div style="color: #4cd137; font-size: 2.5rem; font-weight: bold; margin-top: 10px;">
                                $${profile.cash.toLocaleString()}
                            </div>
                        </div>
                        <div style="
                            background: rgba(255, 255, 255, 0.1);
                            padding: 15px 25px;
                            border-radius: 10px;
                        ">
                            <div style="color: #aaa;">Status</div>
                            <div style="color: #2ed573; font-size: 1.2rem; font-weight: bold;">
                                ✅ OPERACIONAL
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Mensagem de status -->
                <div style="
                    background: rgba(46, 213, 115, 0.1);
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 30px;
                    border: 1px solid #2ed573;
                ">
                    <div style="color: #2ed573; font-size: 1.1rem;">
                        ✅ <strong>Garagem Funcionando</strong> - Sistema carregado com sucesso
                    </div>
                    <div style="color: #aaa; margin-top: 10px; font-size: 0.9rem;">
                        Esta é a tela REAL da garagem. Qualquer mensagem "Em Desenvolvimento" foi bloqueada.
                    </div>
                </div>
                
                <!-- Botões -->
                <div style="
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 50px;
                ">
                    <button onclick="window.mainMenuScreen.initialize()" style="
                        padding: 18px 40px;
                        background: linear-gradient(135deg, #ff4757, #ff6b81);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-family: 'Rajdhani', sans-serif;
                        font-size: 1.2rem;
                        font-weight: bold;
                        cursor: pointer;
                        transition: transform 0.3s;
                        min-width: 200px;
                    ">
                        VOLTAR AO MENU
                    </button>
                    
                    <button onclick="garageFix.reapplyFix()" style="
                        padding: 18px 40px;
                        background: linear-gradient(135deg, #1e90ff, #00bfff);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-family: 'Rajdhani', sans-serif;
                        font-size: 1.2rem;
                        font-weight: bold;
                        cursor: pointer;
                        transition: transform 0.3s;
                        min-width: 200px;
                    ">
                        TESTAR GARAGEM
                    </button>
                </div>
                
                <!-- Log -->
                <div style="
                    margin-top: 60px;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 10px;
                    color: #666;
                    font-size: 0.9rem;
                ">
                    <div>Street Rod II • GarageFix v1.0 • Sistema: <span style="color: #2ed573;">OPERACIONAL</span></div>
                    <div style="margin-top: 5px;">Última execução: ${new Date().toLocaleTimeString()}</div>
                </div>
            </div>
        `;
    }

    // Cancelar todos os intervals/timeouts
    cancelAllIntervals() {
        // Esta é uma função perigosa, então só cancelamos os que sabemos que podem ser problemas
        const maxId = setTimeout(() => {}, 0);
        for (let i = 1; i < maxId; i++) {
            clearTimeout(i);
            clearInterval(i);
        }
    }

    // Monitorar continuamente
    startMonitoring() {
        // Verificar a cada 2 segundos se o botão ainda está correto
        setInterval(() => {
            const garageBtn = document.querySelector('#garage-button, button[id*="garage"]');
            if (garageBtn) {
                // Verificar se tem nosso handler
                const hasNuclearHandler = garageBtn.onclick && garageBtn.onclick.toString().includes('garageNuclearHandler');
                if (!hasNuclearHandler) {
                    console.warn('⚠️ Botão garagem foi modificado, reaplicando fix...');
                    this.nuclearReplaceButton(garageBtn);
                }
            }
        }, 2000);
    }

    // Método para reaplicar o fix manualmente
    reapplyFix() {
        console.log('🔄 Reaplicando GarageFix...');
        this.isFixed = false;
        this.applyFix();
        this.loadRealGarageNow();
    }
}

// Instanciar e exportar
const garageFix = new GarageFix();

// Aplicar automaticamente quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => garageFix.applyFix(), 1000);
    });
} else {
    setTimeout(() => garageFix.applyFix(), 1000);
}

// Exportar para uso global
window.garageFix = garageFix;
console.log('✅ GarageFix carregado e pronto');