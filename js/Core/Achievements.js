// js/Achievements.js
class AchievementsManager {
    constructor(profileManager) {
        this.profileManager = profileManager;
        this.achievements = this.loadAchievements();
    }
    
    loadAchievements() {
        return [
            {
                id: 'first_win',
                title: 'Primeira Vitória',
                description: 'Ganhe sua primeira corrida',
                icon: '🥇',
                reward: 200,
                condition: (profile) => profile.stats.wins >= 1,
                unlocked: false
            },
            {
                id: 'perfect_race',
                title: 'Corrida Perfeita',
                description: 'Termine uma corrida em 1º lugar sem danos',
                icon: '👑',
                reward: 500,
                condition: (profile, raceStats) => 
                    raceStats.position === 1 && raceStats.damageTaken === 0,
                unlocked: false
            },
            {
                id: 'speed_demon',
                title: 'Demônio da Velocidade',
                description: 'Alcance 200 km/h',
                icon: '⚡',
                reward: 300,
                condition: (profile, raceStats) => raceStats.topSpeed >= 200,
                unlocked: false
            },
            {
                id: 'wealthy',
                title: 'Rico',
                description: 'Acumule $10,000',
                icon: '💰',
                reward: 1000,
                condition: (profile) => profile.money >= 10000,
                unlocked: false
            },
            {
                id: 'veteran',
                title: 'Veterano',
                description: 'Complete 50 corridas',
                icon: '🏁',
                reward: 1500,
                condition: (profile) => profile.stats.races >= 50,
                unlocked: false
            },
            {
                id: 'collector',
                title: 'Colecionador',
                description: 'Possua 5 carros',
                icon: '🚗',
                reward: 800,
                condition: (profile) => profile.cars.length >= 5,
                unlocked: false
            },
            {
                id: 'upgrade_master',
                title: 'Mestre em Upgrades',
                description: 'Tença um carro com todos os upgrades no máximo',
                icon: '🔧',
                reward: 1200,
                condition: (profile) => {
                    return profile.cars.some(car => 
                        car.upgrades && 
                        car.upgrades.engine === 5 &&
                        car.upgrades.tires === 5 &&
                        car.upgrades.brakes === 5 &&
                        car.upgrades.nitro === 5 &&
                        car.upgrades.body === 5
                    );
                },
                unlocked: false
            },
            {
                id: 'night_rider',
                title: 'Piloto da Noite',
                description: 'Vença 5 corridas noturnas',
                icon: '🌙',
                reward: 600,
                condition: (profile) => profile.stats.nightWins >= 5,
                unlocked: false
            },
            {
                id: 'rain_master',
                title: 'Mestre da Chuva',
                description: 'Vença 3 corridas na chuva',
                icon: '🌧️',
                reward: 700,
                condition: (profile) => profile.stats.rainWins >= 3,
                unlocked: false
            },
            {
                id: 'no_collisions',
                title: 'Evasivo',
                description: 'Complete uma corrida sem colisões',
                icon: '🛡️',
                reward: 400,
                condition: (profile, raceStats) => raceStats.collisions === 0,
                unlocked: false
            }
        ];
    }
    
    checkRaceAchievements(raceStats, weather, timeOfDay) {
        const profile = this.profileManager.getProfile();
        const unlocked = [];
        
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.condition(profile, raceStats)) {
                achievement.unlocked = true;
                unlocked.push(achievement);
                
                // Atualizar estatísticas especiais
                if (achievement.id === 'night_rider' && timeOfDay === 'night') {
                    profile.stats.nightWins = (profile.stats.nightWins || 0) + 1;
                }
                
                if (achievement.id === 'rain_master' && weather === 'rain') {
                    profile.stats.rainWins = (profile.stats.rainWins || 0) + 1;
                }
                
                // Adicionar recompensa
                profile.money += achievement.reward;
                
                // Salvar perfil
                this.profileManager.saveProfile(profile);
            }
        });
        
        return unlocked;
    }
    
    getUnlockedAchievements() {
        return this.achievements.filter(a => a.unlocked);
    }
    
    getLockedAchievements() {
        return this.achievements.filter(a => !a.unlocked);
    }
    
    reset() {
        this.achievements.forEach(a => a.unlocked = false);
    }
}