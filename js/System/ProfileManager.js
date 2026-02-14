// ProfileManager.js - Versão Mínima Funcional
console.log("👤 Carregando ProfileManager...");

class ProfileManager {
  constructor() {
    this.storageKey = "streetrod2_profiles";
    this.currentProfileKey = "streetrod2_current_profile";
    this.profiles = this.loadProfiles();
    this.currentProfile = null;

    console.log("✅ ProfileManager inicializado");
  }

  loadProfiles() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("❌ Erro ao carregar perfis:", error);
      return [];
    }
  }

  saveProfiles() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.profiles));
      return true;
    } catch (error) {
      console.error("❌ Erro ao salvar perfis:", error);
      return false;
    }
  }

  getAllProfiles() {
    return this.profiles;
  }

  getCurrentProfile() {
    if (this.currentProfile) return this.currentProfile;

    try {
      const profileName = localStorage.getItem(this.currentProfileKey);
      if (profileName) {
        return this.profiles.find((p) => p.name === profileName) || null;
      }
    } catch (error) {
      console.error("❌ Erro ao obter perfil atual:", error);
    }

    return null;
  }

  createProfile(name, initialData = {}) {
    if (!name || name.trim() === "") {
      console.error("❌ Nome do perfil inválido");
      return false;
    }

    if (this.profiles.length >= 3) {
      console.error("❌ Limite de perfis atingido (Máx: 3)");
      return false;
    }

    if (this.profiles.some((p) => p.name === name)) {
      console.error("❌ Já existe um perfil com este nome");
      return false;
    }

    const defaultProfile = {
      name: name.trim(),
      level: 1,
      cash: 10000,
      experience: 0,
      vehicles: [],
      stats: {
        races: 0,
        wins: 0,
        losses: 0,
      },
      created: new Date().toISOString(),
      ...initialData,
    };

    this.profiles.push(defaultProfile);
    this.saveProfiles();

    console.log(`✅ Perfil "${name}" criado`);
    return true;
  }

  selectProfile(profileName) {
    const profile = this.profiles.find((p) => p.name === profileName);
    if (!profile) {
      console.error(`❌ Perfil "${profileName}" não encontrado`);
      return false;
    }

    this.currentProfile = profile;
    localStorage.setItem(this.currentProfileKey, profileName);

    console.log(`✅ Perfil "${profileName}" selecionado`);
    return true;
  }

  saveProfile(profile) {
    const index = this.profiles.findIndex((p) => p.name === profile.name);
    if (index === -1) {
      console.error(`❌ Perfil "${profile.name}" não encontrado para salvar`);
      return false;
    }

    this.profiles[index] = profile;

    if (this.currentProfile && this.currentProfile.name === profile.name) {
      this.currentProfile = profile;
    }

    this.saveProfiles();

    console.log(`✅ Perfil "${profile.name}" salvo`);
    return true;
  }
}

// Exportar para window
if (typeof window !== "undefined") {
  window.profileManager = new ProfileManager();
  window.ProfileManager = ProfileManager;
  console.log("✅ ProfileManager exportado para window");
}
