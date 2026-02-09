// LogSystem.js - Sistema de Logs Otimizado
console.log('🔇 Inicializando sistema de logs...');

(function() {
    'use strict';

    // Configuração de níveis
    const LOG_LEVELS = {
        DEBUG: 0,
        INFO: 1,
        QUIET: 2,
        SILENT: 3
    };

    // Nível padrão: INFO (mostra apenas logs importantes)
    let currentLevel = LOG_LEVELS.INFO;

    // Verificar parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const debugParam = urlParams.get('debug');

    if (debugParam === 'true' || debugParam === '1') {
        currentLevel = LOG_LEVELS.DEBUG;
        console.log('🔓 Modo DEBUG ativado via URL');
    } else if (debugParam === 'quiet') {
        currentLevel = LOG_LEVELS.QUIET;
    } else if (debugParam === 'silent') {
        currentLevel = LOG_LEVELS.SILENT;
    }

    // Salvar funções originais
    const originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        debug: console.debug
    };

    // Verificar se deve logar
    function shouldLog(level) {
        return currentLevel <= level;
    }

    // Verificar se é um log importante
    function isImportantLog(firstArg) {
        if (typeof firstArg !== 'string') return false;
        
        // Emojis que indicam logs importantes
        const importantMarkers = ['❌', '✅', '⚠️', '🎮', '🚗', '🎯', '🔧', '📢'];
        return importantMarkers.some(marker => firstArg.includes(marker));
    }

    // Sobrescrever console.log
    console.log = function(...args) {
        if (!shouldLog(LOG_LEVELS.DEBUG)) return;
        
        if (currentLevel === LOG_LEVELS.INFO && args.length > 0) {
            if (isImportantLog(args[0])) {
                originalConsole.log.apply(console, args);
            }
            return;
        }
        
        originalConsole.log.apply(console, args);
    };

    // Sobrescrever console.info
    console.info = function(...args) {
        if (shouldLog(LOG_LEVELS.INFO)) {
            originalConsole.info.apply(console, args);
        }
    };

    // Sobrescrever console.warn
    console.warn = function(...args) {
        if (shouldLog(LOG_LEVELS.QUIET)) {
            originalConsole.warn.apply(console, args);
        }
    };

    // console.error sempre mostra
    console.error = function(...args) {
        originalConsole.error.apply(console, args);
    };

    // Sobrescrever console.debug
    console.debug = function(...args) {
        if (shouldLog(LOG_LEVELS.DEBUG)) {
            originalConsole.debug.apply(console, args);
        }
    };

    // API pública
    window.setLogLevel = function(level) {
        currentLevel = level;
        const levelName = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level);
        originalConsole.log(`📊 Nível de log: ${levelName || level}`);
    };

    window.getLogLevel = function() {
        return currentLevel;
    };

    window.logLevels = LOG_LEVELS;

    // Log inicial
    if (currentLevel <= LOG_LEVELS.INFO) {
        originalConsole.log('✅ Sistema de logs configurado');
    }
})();