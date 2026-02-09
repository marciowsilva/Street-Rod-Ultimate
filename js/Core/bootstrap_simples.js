// bootstrap.js - VERSÃO MÍNIMA FUNCIONAL
console.log('🚀 Bootstrap: Inicializando...');

(function() {
    'use strict';
    
    window.GameBootstrap = {
        initialize: function() {
            console.log('✅ Bootstrap: Inicializando...');
            
            // Simples - esperar loading e mostrar menu
            setTimeout(() => {
                const loading = document.getElementById('game-loading-screen');
                if (loading) {
                    loading.style.opacity = '0';
                    setTimeout(() => {
                        loading.style.display = 'none';
                        
                        // Mostrar menu principal básico
                        const container = document.getElementById('game-container');
                        if (container) {
                            container.innerHTML = `
                                <div style="height:100vh; background:#0C0C0D; color:white; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'Rajdhani';">
                                    <h1 style="color:#F14144; margin-bottom:30px;">STREET ROD II</h1>
                                    <div style="display:flex; flex-direction:column; gap:15px; width:300px;">
                                        <button style="padding:15px; background:#2D2D2D; color:#A9A9A9; border:1px solid #444; border-radius:4px; font-family:'Rajdhani'; font-weight:600; cursor:pointer;">
                                            🏁 CORRER
                                        </button>
                                        <button style="padding:15px; background:#2D2D2D; color:#A9A9A9; border:1px solid #444; border-radius:4px; font-family:'Rajdhani'; font-weight:600; cursor:pointer;">
                                            🔧 GARAGEM
                                        </button>
                                        <button style="padding:15px; background:#2D2D2D; color:#A9A9A9; border:1px solid #444; border-radius:4px; font-family:'Rajdhani'; font-weight:600; cursor:pointer;">
                                            ⚙️ CONFIGURAÇÕES
                                        </button>
                                    </div>
                                </div>
                            `;
                        }
                    }, 500);
                }
            }, 2000); // 2 segundos de loading
        }
    };
    
    // Auto-iniciar
    setTimeout(() => {
        if (window.GameBootstrap && window.GameBootstrap.initialize) {
            window.GameBootstrap.initialize();
        }
    }, 100);
})();