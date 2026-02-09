// js/ScreenManager.js
class ScreenManager {
    constructor(eventSystem) {
        this.eventSystem = eventSystem;
        this.screens = {};
        this.currentScreen = null;
        this.previousScreen = null;
        
        console.log('📱 ScreenManager inicializado');
        
        // Expor globalmente para debug
        window.ScreenManagerInstance = this;
    }
    
    registerScreen(name, screenInstance) {
        if (!name || !screenInstance) {
            console.error('❌ Tentativa de registrar tela inválida:', { name, screenInstance });
            return false;
        }
        
        this.screens[name] = screenInstance;
        console.log(`📱 Tela registrada: "${name}"`);
        
        // Debug: listar todas as telas registradas
        console.log('📱 Telas registradas até agora:', Object.keys(this.screens));
        return true;
    }
    
    showScreen(name, params = {}) {
        console.log(`📱 Tentando mostrar tela: "${name}"`, params);
        
        // Esconder tela atual
        if (this.currentScreen && this.screens[this.currentScreen]) {
            console.log(`📱 Escondendo tela atual: "${this.currentScreen}"`);
            this.screens[this.currentScreen].hide();
            this.previousScreen = this.currentScreen;
        }
        
        // Verificar se a tela existe
        if (!this.screens[name]) {
            console.error(`❌ Tela não encontrada: "${name}"`);
            console.log('📱 Telas disponíveis:', Object.keys(this.screens));
            
            // Tentar fallback para main-menu
            if (name !== 'main-menu' && this.screens['main-menu']) {
                console.log('🔄 Fallback para main-menu');
                return this.showScreen('main-menu', params);
            }
            
            // Criar tela de erro
            this.showErrorScreen(`Tela "${name}" não encontrada. Telas disponíveis: ${Object.keys(this.screens).join(', ')}`);
            return false;
        }
        
        // Mostrar nova tela
        this.currentScreen = name;
        window.currentScreen = name; // Expor globalmente
        
        console.log(`📱 Mostrando tela: "${name}"`);
        this.screens[name].show(params);
        
        // Publicar evento
        if (this.eventSystem) {
            this.eventSystem.publish('screenChanged', { 
                from: this.previousScreen, 
                to: name,
                params: params 
            });
        }
        
        return true;
    }
    
    showErrorScreen(message) {
        console.error('❌ Erro crítico:', message);
        
        const errorHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: 'Rajdhani', sans-serif;
                color: white;
                text-align: center;
                padding: 20px;
                z-index: 10000;
            ">
                <div style="font-size: 48px; color: #ff4757; margin-bottom: 20px;">⚠️</div>
                <h1 style="color: #ff4757; font-size: 36px; margin-bottom: 20px;">ERRO NA TELA</h1>
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 10px;
                    max-width: 600px;
                    margin-bottom: 30px;
                    text-align: left;
                ">
                    <p style="margin-bottom: 10px;"><strong>Mensagem:</strong></p>
                    <p style="color: #aaa; margin-bottom: 20px;">${message}</p>
                    <p style="margin-bottom: 10px;"><strong>Solução:</strong></p>
                    <ul style="color: #aaa; margin-left: 20px;">
                        <li>Verifique se a tela está sendo registrada corretamente</li>
                        <li>Verifique se o nome da tela está correto</li>
                        <li>Verifique o console para mais detalhes</li>
                    </ul>
                </div>
                <div style="display: flex; gap: 15px; margin-top: 20px;">
                    <button onclick="location.reload()" style="
                        background: #ff4757;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 5px;
                        font-family: 'Rajdhani', sans-serif;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                        🔄 RECARREGAR
                    </button>
                    <button onclick="console.log('Telas registradas:', Object.keys(window.ScreenManagerInstance?.screens || {}))" style="
                        background: #34495e;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 5px;
                        font-family: 'Rajdhani', sans-serif;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                        📋 VER TELAS NO CONSOLE
                    </button>
                </div>
            </div>
        `;
        
        // Limpar container e mostrar erro
        const container = document.getElementById('game-container');
        if (container) {
            container.innerHTML = errorHTML;
        } else {
            document.body.innerHTML = errorHTML;
        }
    }
    
    getScreen(name) {
        return this.screens[name];
    }
    
    getCurrentScreenName() {
        return this.currentScreen;
    }
    
    getPreviousScreenName() {
        return this.previousScreen;
    }
}