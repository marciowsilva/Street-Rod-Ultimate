// GameNotifications.js - Sistema de notificações simplificado

class GameNotifications {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 3000; // 3 segundos
        this.autoRemove = true;
        
        console.log('[GameNotifications] Inicializado');
        
        // Criar container
        this.createContainer();
        
        // Configurar estilos
        this.setupStyles();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'game-notifications';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 350px;
            pointer-events: none;
        `;
        
        document.body.appendChild(this.container);
    }
    
    setupStyles() {
        // Adicionar estilos CSS para as notificações
        const style = document.createElement('style');
        style.textContent = `
            .game-notification {
                padding: 15px 20px;
                border-radius: 8px;
                font-family: 'Rajdhani', sans-serif;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                border-left: 5px solid;
                transform: translateX(100%);
                opacity: 0;
                animation: notificationSlideIn 0.3s ease-out forwards;
                pointer-events: auto;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .game-notification.fade-out {
                animation: notificationFadeOut 0.3s ease-out forwards;
            }
            
            @keyframes notificationSlideIn {
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes notificationFadeOut {
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Mostrar notificação
    show(message, type = 'info', duration = null) {
        if (!this.container) {
            console.warn('[GameNotifications] Container não inicializado');
            return null;
        }
        
        // Limitar número de notificações
        if (this.notifications.length >= this.maxNotifications) {
            this.removeOldest();
        }
        
        // Configurar duração
        const notificationDuration = duration !== null ? duration : this.defaultDuration;
        
        // Criar elemento da notificação
        const notification = document.createElement('div');
        notification.className = `game-notification notification-${type}`;
        
        // Configurar cor baseada no tipo
        let backgroundColor, borderColor, emoji;
        
        switch(type) {
            case 'success':
                backgroundColor = 'rgba(46, 213, 115, 0.9)';
                borderColor = '#2ed573';
                emoji = '✅';
                break;
            case 'error':
                backgroundColor = 'rgba(255, 71, 87, 0.9)';
                borderColor = '#ff4757';
                emoji = '❌';
                break;
            case 'warning':
                backgroundColor = 'rgba(255, 165, 2, 0.9)';
                borderColor = '#ffa502';
                emoji = '⚠️';
                break;
            case 'info':
            default:
                backgroundColor = 'rgba(30, 144, 255, 0.9)';
                borderColor = '#1e90ff';
                emoji = 'ℹ️';
                break;
        }
        
        notification.style.background = backgroundColor;
        notification.style.borderLeftColor = borderColor;
        
        // Conteúdo da notificação
        notification.innerHTML = `
            <span style="font-size: 18px;">${emoji}</span>
            <div class="notification-content">${message}</div>
            <button class="notification-close" title="Fechar">×</button>
        `;
        
        // Adicionar ao container
        this.container.appendChild(notification);
        
        // Adicionar à lista
        const notificationId = Date.now() + Math.random();
        this.notifications.push({
            id: notificationId,
            element: notification,
            type: type,
            message: message
        });
        
        // Configurar botão de fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.remove(notificationId);
        });
        
        // Remover automaticamente se configurado
        if (this.autoRemove && notificationDuration > 0) {
            setTimeout(() => {
                this.remove(notificationId);
            }, notificationDuration);
        }
        
        console.log(`[GameNotifications] ${type}: ${message}`);
        return notificationId;
    }
    
    // Métodos de conveniência
    success(message, duration = null) {
        return this.show(message, 'success', duration);
    }
    
    error(message, duration = null) {
        return this.show(message, 'error', duration);
    }
    
    warning(message, duration = null) {
        return this.show(message, 'warning', duration);
    }
    
    info(message, duration = null) {
        return this.show(message, 'info', duration);
    }
    
    // Remover notificação específica
    remove(notificationId) {
        const index = this.notifications.findIndex(n => n.id === notificationId);
        
        if (index !== -1) {
            const notification = this.notifications[index];
            
            // Animar saída
            notification.element.classList.add('fade-out');
            
            // Remover após animação
            setTimeout(() => {
                if (notification.element.parentNode) {
                    notification.element.remove();
                }
                this.notifications.splice(index, 1);
            }, 300);
            
            return true;
        }
        
        return false;
    }
    
    // Remover notificação mais antiga
    removeOldest() {
        if (this.notifications.length > 0) {
            const oldest = this.notifications[0];
            this.remove(oldest.id);
        }
    }
    
    // Limpar todas as notificações
    clearAll() {
        // Animar saída de todas
        this.notifications.forEach(notification => {
            notification.element.classList.add('fade-out');
        });
        
        // Remover após animação
        setTimeout(() => {
            this.notifications.forEach(notification => {
                if (notification.element.parentNode) {
                    notification.element.remove();
                }
            });
            this.notifications = [];
        }, 300);
        
        console.log('[GameNotifications] Todas as notificações limpas');
    }
    
    // Atualizar configurações
    updateSettings(settings) {
        if (settings.maxNotifications !== undefined) {
            this.maxNotifications = Math.max(1, settings.maxNotifications);
        }
        
        if (settings.defaultDuration !== undefined) {
            this.defaultDuration = settings.defaultDuration;
        }
        
        if (settings.autoRemove !== undefined) {
            this.autoRemove = settings.autoRemove;
        }
        
        console.log('[GameNotifications] Configurações atualizadas');
    }
    
    // Obter estatísticas
    getStats() {
        return {
            totalShown: this.notifications.length,
            currentCount: this.notifications.length,
            maxNotifications: this.maxNotifications,
            defaultDuration: this.defaultDuration,
            autoRemove: this.autoRemove
        };
    }
    
    // Destruir sistema
    destroy() {
        this.clearAll();
        
        if (this.container && this.container.parentNode) {
            this.container.remove();
            this.container = null;
        }
        
        console.log('[GameNotifications] Destruído');
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.GameNotifications = GameNotifications;
}

console.log('[GameNotifications] Módulo carregado');