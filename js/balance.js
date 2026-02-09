// js/balance.js - Arquivo de balanceamento
const BALANCE_SETTINGS = {
    // Preços de carros
    carPrices: {
        street: [3000, 5000, 8000],
        drag: [10000, 15000, 20000],
        circuit: [12000, 18000, 25000]
    },
    
    // Custo de upgrades (nível 1-5)
    upgradeCosts: {
        engine: [500, 1000, 2000, 3500, 5000],
        tires: [300, 600, 1200, 2000, 3000],
        brakes: [400, 800, 1500, 2500, 4000],
        nitro: [200, 400, 800, 1500, 2500],
        body: [600, 1200, 2400, 4000, 6000]
    },
    
    // Recompensas de corrida
    raceRewards: {
        base: [1000, 700, 500, 300, 100, 50], // Por posição
        difficultyMultiplier: {
            easy: 0.7,
            medium: 1.0,
            hard: 1.5
        },
        trackMultiplier: {
            circuit: 1.0,
            drag: 1.2,
            street: 0.8
        },
        healthBonus: 500, // Bônus máximo por carro intacto
        damagePenalty: 300 // Penalidade máxima por dano
    },
    
    // Performance de upgrades
    upgradeEffects: {
        engine: {
            maxSpeed: 0.5, // +50% no total
            acceleration: 0.75 // +75% no total
        },
        tires: {
            handling: 1.0 // +100% no total
        },
        brakes: {
            braking: 1.0 // +100% no total
        },
        nitro: {
            multiplier: 0.5, // +50% no total
            efficiency: 0.4 // +40% de eficiência
        },
        body: {
            health: 0.5, // +50% de saúde
            damageReduction: 0.3 // -30% de dano recebido
        }
    },
    
    // Configurações da IA
    aiSettings: {
        easy: {
            speed: 0.8,
            mistakes: 0.3,
            aggression: 0.2,
            reactionTime: 0.5
        },
        medium: {
            speed: 1.0,
            mistakes: 0.15,
            aggression: 0.5,
            reactionTime: 0.3
        },
        hard: {
            speed: 1.2,
            mistakes: 0.05,
            aggression: 0.8,
            reactionTime: 0.1
        }
    },
    
    // Sistema de XP
    xpSystem: {
        xpPerLevel: 100,
        xpPerRace: {
            win: 50,
            podium: 30,
            finish: 20,
            dnf: 5
        },
        levelRewards: [
            { level: 2, money: 1000 },
            { level: 3, money: 2000, car: 'street' },
            { level: 5, money: 5000 },
            { level: 10, money: 10000, car: 'drag' }
        ]
    }
};

// Exportar para uso global
window.BALANCE = BALANCE_SETTINGS;