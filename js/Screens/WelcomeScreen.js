// WelcomeScreen.js - VERSÃO SIMPLIFICADA
console.log('🎬 Carregando WelcomeScreen...');

class WelcomeScreen {
    constructor(eventSystem) {
        console.log('🏗️  Criando WelcomeScreen');
        this.eventSystem = eventSystem;
        this.isVisible = false;
    }
    
    show(data = {}) {
        console.log('🖥️ Mostrando WelcomeScreen');
        this.isVisible = true;
        
        // Carregar perfis após mostrar
        if (this.eventSystem && this.eventSystem.loadSavedProfilesList) {
            setTimeout(() => {
                this.eventSystem.loadSavedProfilesList();
            }, 50);
        }
    }
    
    hide() {
        console.log('👋 Escondendo WelcomeScreen');
        this.isVisible = false;
    }
    
    render() {
        return `
            <div class="welcome-screen" style="
                width: 100%;
                height: 100vh;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                overflow-y: auto;
            ">
                <!-- Logo e Título -->
                <div style="text-align: center; margin-bottom: 40px;">
                    <div style="
                        font-size: 3.5rem;
                        color: #ff4757;
                        margin-bottom: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 15px;
                    ">
                        <span>🏎️</span>
                        <span>STREET ROD II</span>
                        <span>🔥</span>
                    </div>
                    <div style="
                        font-size: 1.8rem;
                        color: #ffcc00;
                        margin-bottom: 30px;
                    ">
                        ULTIMATE EDITION
                    </div>
                </div>
                
                <!-- Card Principal -->
                <div style="
                    background: linear-gradient(145deg, rgba(26, 26, 46, 0.8), rgba(15, 52, 96, 0.8));
                    border: 3px solid #ff4757;
                    border-radius: 20px;
                    padding: 30px;
                    width: 100%;
                    max-width: 500px;
                    margin-bottom: 30px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                ">
                    <h2 style="
                        color: #fff;
                        text-align: center;
                        margin-bottom: 25px;
                        font-size: 1.5rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                    ">
                        <span>🎮</span> COMEÇAR JOGO
                    </h2>
                    
                    <!-- Botões -->
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <button id="new-profile-btn" style="
                            padding: 16px;
                            background: linear-gradient(145deg, #ff4757, #ff6b81);
                            color: white;
                            border: none;
                            border-radius: 12px;
                            font-size: 1.1rem;
                            cursor: pointer;
                            font-family: 'Rajdhani', sans-serif;
                            font-weight: bold;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            transition: all 0.2s;
                        ">
                            <span>⭐</span> CRIAR NOVO PERFIL
                        </button>
                        
                        <button id="quick-start-btn" style="
                            padding: 16px;
                            background: linear-gradient(145deg, #1e90ff, #3742fa);
                            color: white;
                            border: none;
                            border-radius: 12px;
                            font-size: 1rem;
                            cursor: pointer;
                            font-family: 'Rajdhani', sans-serif;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            transition: all 0.2s;
                        ">
                            <span>⚡</span> INÍCIO RÁPIDO
                        </button>
                    </div>
                    
                    <!-- Divisor -->
                    <div style="
                        display: flex;
                        align-items: center;
                        margin: 25px 0;
                        color: #666;
                    ">
                        <div style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #666, transparent);"></div>
                        <div style="padding: 0 15px; font-size: 0.9rem;">OU</div>
                        <div style="flex: 1; height: 1px; background: linear-gradient(to left, transparent, #666, transparent);"></div>
                    </div>
                    
                    <!-- Perfis Salvos -->
                    <div id="saved-profiles">
                        <div style="text-align: center; padding: 20px; color: #666;">
                            <div style="font-size: 2.5rem; margin-bottom: 10px;">👤</div>
                            <p>Carregando perfis salvos...</p>
                        </div>
                    </div>
                </div>
                
                <!-- Créditos -->
                <div style="color: #666; font-size: 0.8rem; text-align: center; margin-top: 20px;">
                    <p>Street Rod II Ultimate Edition • Desenvolvido com ❤️</p>
                </div>
            </div>
        `;
    }
    
    attachEvents() {
        console.log('🔗 Anexando eventos da WelcomeScreen');
        
        // Botão Criar Novo Perfil
        const newProfileBtn = document.getElementById('new-profile-btn');
        if (newProfileBtn && this.eventSystem) {
            newProfileBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (this.eventSystem.showProfileCreationModal) {
                    this.eventSystem.showProfileCreationModal();
                } else {
                    const name = prompt('Digite seu nome:');
                    if (name && name.trim()) {
                        this.eventSystem.createProfile(name.trim());
                    }
                }
            };
            
            // Efeito hover
            newProfileBtn.addEventListener('mouseenter', () => {
                newProfileBtn.style.transform = 'scale(1.02)';
                newProfileBtn.style.boxShadow = '0 5px 20px rgba(255, 71, 87, 0.4)';
            });
            
            newProfileBtn.addEventListener('mouseleave', () => {
                newProfileBtn.style.transform = 'scale(1)';
                newProfileBtn.style.boxShadow = 'none';
            });
        }
        
        // Botão Início Rápido
        const quickStartBtn = document.getElementById('quick-start-btn');
        if (quickStartBtn && this.eventSystem) {
            quickStartBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Gerar nome único
                const names = ['Racer', 'Driver', 'Speedster', 'Champion', 'Pro'];
                const randomName = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
                
                if (this.eventSystem.createProfile) {
                    this.eventSystem.createProfile(randomName);
                }
            };
            
            // Efeito hover
            quickStartBtn.addEventListener('mouseenter', () => {
                quickStartBtn.style.transform = 'scale(1.02)';
                quickStartBtn.style.boxShadow = '0 5px 20px rgba(30, 144, 255, 0.4)';
            });
            
            quickStartBtn.addEventListener('mouseleave', () => {
                quickStartBtn.style.transform = 'scale(1)';
                quickStartBtn.style.boxShadow = 'none';
            });
        }
        
        console.log('✅ Eventos da WelcomeScreen anexados');
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.WelcomeScreen = WelcomeScreen;
    console.log('✅ WelcomeScreen exportada');
}