// js/LoadingScreen.js
class LoadingScreen {
    constructor() {
        this.element = null;
        this.progressBar = null;
        this.progressText = null;
        this.messageElement = null;
        this.isVisible = false;
    }

    initialize() {
        // Criar elemento da tela de carregamento
        this.element = document.createElement('div');
        this.element.id = 'loading-screen';
        this.element.className = 'screen';
        this.element.style.cssText = `
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
            z-index: 1000;
            color: white;
            font-family: 'Arial', sans-serif;
        `;

        // Logo/Title
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 2rem;
            text-align: center;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(78, 205, 196, 0.3);
        `;
        title.innerHTML = 'STREET ROD II<br><span style="font-size: 1.5rem;">ULTIMATE EDITION</span>';

        // Container do progresso
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            width: 300px;
            margin: 20px 0;
        `;

        // Barra de progresso
        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.cssText = `
            width: 100%;
            height: 20px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 10px;
        `;

        this.progressBar = document.createElement('div');
        this.progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
            border-radius: 10px;
            transition: width 0.3s ease;
        `;

        progressBarContainer.appendChild(this.progressBar);
        progressContainer.appendChild(progressBarContainer);

        // Texto de progresso
        this.progressText = document.createElement('div');
        this.progressText.style.cssText = `
            text-align: center;
            font-size: 0.9rem;
            color: #aaa;
            margin-bottom: 10px;
        `;
        this.progressText.textContent = 'Carregando... 0%';

        // Mensagem de status
        this.messageElement = document.createElement('div');
        this.messageElement.style.cssText = `
            text-align: center;
            font-size: 1rem;
            color: #4ecdc4;
            margin-top: 10px;
            min-height: 24px;
        `;
        this.messageElement.textContent = 'Inicializando sistemas...';

        // Dicas de carregamento
        const tips = [
            "Dica: Complete corridas para ganhar dinheiro e comprar novos carros!",
            "Dica: Melhore seu carro na garagem para ter mais chances de vencer!",
            "Dica: Cada perfil tem seu próprio progresso e garagem!",
            "Dica: Ajuste a dificuldade nas configurações conforme sua experiência!"
        ];

        const tipElement = document.createElement('div');
        tipElement.style.cssText = `
            text-align: center;
            font-size: 0.8rem;
            color: #666;
            margin-top: 30px;
            max-width: 400px;
            font-style: italic;
        `;
        tipElement.textContent = tips[Math.floor(Math.random() * tips.length)];

        // Montar estrutura
        this.element.appendChild(title);
        this.element.appendChild(progressContainer);
        this.element.appendChild(this.progressText);
        this.element.appendChild(this.messageElement);
        this.element.appendChild(tipElement);

        // Adicionar ao body
        document.body.appendChild(this.element);

        // Inicialmente escondida
        this.hide();
    }

    show() {
        if (!this.element) {
            this.initialize();
        }
        this.element.style.display = 'flex';
        this.isVisible = true;
        return this;
    }

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
        this.isVisible = false;
    }

    setProgress(percent, message = '') {
        if (this.progressBar) {
            this.progressBar.style.width = `${percent}%`;
        }
        if (this.progressText) {
            this.progressText.textContent = `Carregando... ${Math.round(percent)}%`;
        }
        if (message && this.messageElement) {
            this.messageElement.textContent = message;
        }
        
        // Se chegou a 100%, esconder após breve delay
        if (percent >= 100) {
            setTimeout(() => {
                this.hide();
            }, 500);
        }
    }

    updateMessage(message) {
        if (this.messageElement) {
            this.messageElement.textContent = message;
        }
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Exportar para uso global
window.LoadingScreen = LoadingScreen;