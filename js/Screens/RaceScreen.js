// RaceScreen.js - v21.0 CLASSIC COCKPIT (Authentic Street Rod Experience)
console.log("🏎️ RaceScreen v21.0: Classic Cockpit Loading...");

class RaceScreen {
  constructor(eventSystem) {
    this.eventSystem = eventSystem;
    this.screenId = "race-screen";
    this.isActive = false;

    // 1. ENGINE & PHYSICS
    this.gameState = "idle";
    this.playerCar = null;
    this.enemyCar = null;

    this.player = { pos: 0, vel: 0, rpm: 800, gear: 0, wheelRot: 0, temp: 180 };
    this.enemy = { pos: 0, vel: 0, gear: 0 };
    this.trackLength = 1000; // 1km drag

    this.animationId = null;
    this.lastTime = 0;
    this.startTime = 0;
    this.raceTime = 0;

    // 2. MECHANICS
    this.perfectShiftWindow = false;
    this.boundKeyDown = this.handleKeyDown.bind(this);
  }

  show(data = {}) {
    this.isActive = true;
    this.updateProfileData();

    if (
      !this.profile ||
      !this.profile.vehicles ||
      this.profile.vehicles.length === 0
    ) {
      alert("Nenhum veículo encontrado!");
      if (this.eventSystem) this.eventSystem.showScreen("garage-screen");
      return this;
    }

    const idx = data.vehicleIndex !== undefined ? data.vehicleIndex : 0;
    this.playerCar = this.profile.vehicles[idx] || this.profile.vehicles[0];

    this.resetState();
    this.setupEnemy();
    this.render();
    this.attachEvents();
    this.stopRace();

    window.addEventListener("keydown", this.boundKeyDown);
    return this;
  }

  hide() {
    this.isActive = false;
    this.stopRace();
    window.removeEventListener("keydown", this.boundKeyDown);
    const el = document.getElementById("rc-classic-root");
    if (el) el.remove();
  }

  resetState() {
    this.gameState = "idle";
    this.player = { pos: 0, vel: 0, rpm: 800, gear: 0, wheelRot: 0, temp: 180 };
    this.enemy = { pos: 0, vel: 0, gear: 0 };
    this.raceTime = 0;
  }

  updateProfileData() {
    if (window.profileManager)
      this.profile = window.profileManager.getCurrentProfile();
  }

  setupEnemy() {
    const pwr = this.playerCar?.power || 150;
    this.enemyCar = {
      name: "Rival Local",
      power: pwr * (0.9 + Math.random() * 0.2),
      color: "#e74c3c",
    };
  }

  handleKeyDown(e) {
    if (e.repeat) return;
    if (this.gameState !== "racing" && this.gameState !== "ready") return;

    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      if (this.gameState === "racing") this.shiftGear(1);
    } else if (e.code === "KeyS" || e.code === "ArrowDown") {
      e.preventDefault();
      if (this.gameState === "racing") this.shiftGear(-1);
    }
  }

  shiftGear(dir) {
    const oldGear = this.player.gear;
    this.player.gear = Math.max(0, Math.min(6, this.player.gear + dir));

    if (oldGear !== this.player.gear) {
      if (dir > 0) {
        const isPerfect = this.player.rpm >= 7500 && this.player.rpm <= 8500;
        this.player.rpm = Math.max(1000, this.player.rpm * 0.6);

        if (isPerfect) this.showFeedback("MARCHA PERFEITA!", "#2ecc71");
        else this.showFeedback("BOA MARCHA", "#fff");
      }
    }
  }

  showFeedback(text, color) {
    const el = document.getElementById("rc-feedback");
    if (!el) return;
    el.innerText = text;
    el.style.color = color;
    el.style.opacity = 1;
    setTimeout(() => {
      if (el) el.style.opacity = 0;
    }, 800);
  }

  render() {
    this.hide();

    const root = document.createElement("div");
    root.id = "rc-classic-root";
    root.style.cssText = `
      position: fixed; inset: 0; background: #000; overflow: hidden; z-index: 1000;
      font-family: 'Rajdhani', sans-serif; user-select: none;
    `;

    root.innerHTML = `
      <!-- TOP: WINDSHIELD VIEW -->
      <div id="windshield" style="position:absolute; top:0; width:100%; height:65%; background:#1a1a2e; overflow:hidden;">
        <!-- ROAD ENVIRONMENT -->
        <div style="position:absolute; inset:0; background:linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 60%, #555 60%, #333 100%);"></div>
        
        <!-- HORIZON LINE -->
        <div style="position:absolute; top:60%; width:100%; height:2px; background:rgba(255,255,255,0.2);"></div>

        <!-- 3D ROAD GRID (CSS Perspective) -->
        <div style="position:absolute; top:60%; left:50%; transform:translateX(-50%); width:2000px; height:2000px; perspective: 1000px;">
           <div id="road-grid" style="width:100%; height:100%; transform:rotateX(75deg); transform-origin:top center;
                background-image: 
                  linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
                background-size: 100px 100px;">
           </div>
        </div>

        <!-- ENEMY CAR BOX (Seen through window) -->
        <div id="enemy-sprite" style="position:absolute; top:60%; left:50%; width:100px; height:60px; transform:translate(-50%, -100%); transition: transform 0.1s linear;">
           <div style="width:100%; height:100%; background:#a00; border-radius:10px 10px 2px 2px; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
              <div style="position:absolute; top:10px; left:10%; width:80%; height:20px; background:#111; border-radius:5px;"></div>
              <!-- Taillights -->
              <div style="position:absolute; bottom:5px; left:5px; width:15px; height:8px; background:#f00; box-shadow:0 0 5px #f00;"></div>
              <div style="position:absolute; bottom:5px; right:5px; width:15px; height:8px; background:#f00; box-shadow:0 0 5px #f00;"></div>
           </div>
        </div>

        <!-- FEEDBACK OVERLAY -->
        <div id="rc-feedback" style="position:absolute; top:30%; width:100%; text-align:center; font-size:4rem; font-weight:900; text-shadow:0 0 20px rgba(0,0,0,0.8); opacity:0; transition:0.3s; pointer-events:none; z-index:10;"></div>
      </div>

      <!-- BOTTOM: DASHBOARD (The Cockpit) -->
      <div id="dashboard" style="position:absolute; bottom:0; width:100%; height:45%; background:linear-gradient(to bottom, #1a1a1a, #0a0a0a); border-top: 8px solid #000; display:flex; justify-content:center; align-items:center; z-index:20;">
         
         <!-- REAR VIEW MIRROR -->
         <div id="mirror" style="position:absolute; top:-280px; left:50%; transform:translateX(-50%); width:300px; height:80px; background:#111; border:4px solid #444; border-radius:10px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.8); z-index:15;">
            <!-- Mirror Reflection (Inverted road) -->
            <div id="mirror-reflection" style="position:absolute; inset:0; background:linear-gradient(to bottom, #333, #555 60%, #222 60%);">
               <div id="mirror-grid" style="position:absolute; top:60%; left:50%; width:1000px; height:1000px; background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 100% 20px; transform:translate(-50%, -100%) rotateX(-60deg);"></div>
            </div>
            <div style="position:absolute; inset:0; box-shadow:inset 0 0 40px rgba(0,0,0,0.5);"></div>
         </div>

         <!-- GAUGE PANEL -->
         <div style="display:flex; gap:60px; padding:0 100px;">
            <!-- SPEEDOMETER -->
            <div class="gauge-ring" style="width:180px; height:180px; position:relative; background:#111; border:8px solid #444; border-radius:50%; box-shadow: inset 0 0 20px #000;">
               <div style="position:absolute; top:20px; left:50%; transform:translateX(-50%); font-size:0.8rem; color:#666;">SPEED</div>
               <div id="gauge-speed" style="position:absolute; top:45%; left:50%; transform:translateX(-50%); font-size:2.5rem; font-weight:bold; color:white;">0</div>
               <div style="position:absolute; bottom:30px; left:50%; transform:translateX(-50%); font-size:0.7rem; color:#444;">KM/H</div>
               <!-- Needle -->
               <div id="speed-needle" style="position:absolute; top:50%; left:50%; width:80px; height:3px; background:#f39c12; transform-origin:left center; transform:rotate(150deg); border-radius:3px;"></div>
            </div>

            <!-- TACHOMETER (CENTER) -->
            <div class="gauge-ring" style="width:240px; height:240px; position:relative; background:#111; border:10px solid #555; border-radius:50%; margin-top:-40px; box-shadow: 0 0 30px rgba(0,0,0,1);">
               <div style="position:absolute; top:30px; left:50%; transform:translateX(-50%); font-size:1rem; color:#888; letter-spacing:2px;">TACHOMETER</div>
               <div id="gauge-gear" style="position:absolute; bottom:40px; left:50%; transform:translateX(-50%); font-size:4rem; font-weight:900; color:#fff;">N</div>
               <div id="rpm-needle" style="position:absolute; top:50%; left:50%; width:100px; height:4px; background:#e74c3c; transform-origin:left center; transform:rotate(-45deg); border-radius:4px; box-shadow:0 0 10px #f00;"></div>
               <!-- Rev Limit area -->
               <div style="position:absolute; top:30%; right:10%; font-size:0.8rem; color:#f00; font-weight:bold;">LIMIT</div>
            </div>

            <!-- TEMP / FUEL -->
            <div class="gauge-ring" style="width:180px; height:180px; position:relative; background:#111; border:8px solid #444; border-radius:50%; box-shadow: inset 0 0 20px #000;">
               <div style="position:absolute; top:20px; left:50%; transform:translateX(-50%); font-size:0.8rem; color:#666;">TEMP °F</div>
               <div id="gauge-temp" style="position:absolute; top:45%; left:50%; transform:translateX(-50%); font-size:2rem; font-weight:bold; color:#2ecc71;">180</div>
               <div id="temp-needle" style="position:absolute; top:50%; left:50%; width:70px; height:3px; background:#3498db; transform-origin:left center; transform:rotate(200deg);"></div>
            </div>
         </div>

         <!-- STEERING WHEEL -->
         <div id="steering-wheel" style="position:absolute; bottom:-120px; left:50%; transform:translateX(-50%); width:600px; height:600px; border:45px solid #2d1c10; border-radius:50%; box-shadow: 0 0 50px #000; z-index:30; pointer-events:none;">
            <!-- Spokes -->
            <div style="position:absolute; top:50%; left:50%; width:100%; height:40px; background:#333; transform:translate(-50%, -50%);"></div>
            <div style="position:absolute; top:50%; left:50%; width:40px; height:50%; background:#333; transform:translate(-50%, 0);"></div>
            <div style="position:absolute; top:50%; left:50%; width:40px; height:40px; background:#555; border-radius:50%; transform:translate(-50%, -50%); border:3px solid #777;"></div>
         </div>
      </div>

      <!-- START OVERLAY -->
      <div id="start-overlay" style="position:absolute; inset:0; background:rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:100;">
         <button id="btn-start-race" style="padding:20px 80px; font-size:3rem; background:#f1c40f; color:#000; border:none; border-radius:10px; font-family:'Rajdhani', sans-serif; font-weight:900; cursor:pointer; box-shadow:0 10px 0 #9b59b6;">ACELERAR!</button>
      </div>

      <!-- RESULTS POPUP -->
      <div id="results-popup" style="position:absolute; inset:0; background:rgba(0,0,0,0.9); z-index:200; display:none; flex-direction:column; align-items:center; justify-content:center; color:white;">
         <h1 id="res-title" style="font-size:6rem; margin:0;">VITÓRIA!</h1>
         <div id="res-data" style="font-size:2rem; color:#2ecc71; margin:20px 0;">+ $1,500</div>
         <button onclick="window.raceScreen.hide(); window.raceScreen.eventSystem.showScreen('main-menu')" style="padding:15px 40px; font-size:1.5rem; background:#fff; color:#000; border:none; cursor:pointer; font-weight:bold;">VOLTAR AO MENU</button>
      </div>

      <!-- BACK BUTTON (Top Left) -->
      <button id="rc-back-btn" style="position:absolute; top:20px; left:20px; background:rgba(255,255,255,0.1); border:1px solid #fff; color:white; padding:10px 20px; cursor:pointer; font-family:inherit; z-index:110;">← VOLTAR</button>
    `;

    document.body.appendChild(root);
  }

  attachEvents() {
    const startBtn = document.getElementById("btn-start-race");
    if (startBtn) {
      startBtn.onclick = () => {
        document.getElementById("start-overlay").style.display = "none";
        this.startCountdown();
      };
    }
    document.getElementById("rc-back-btn").onclick = () => {
      this.hide();
      this.eventSystem.showScreen("main-menu");
    };
  }

  startCountdown() {
    this.showFeedback("3", "#fff");
    setTimeout(() => this.showFeedback("2", "#fff"), 1000);
    setTimeout(() => this.showFeedback("1", "#fff"), 2000);
    setTimeout(() => {
      this.showFeedback("VAI!!!", "#2ecc71");
      this.startRace();
    }, 3000);
  }

  startRace() {
    this.gameState = "racing";
    this.startTime = Date.now();
    this.lastTime = Date.now();
    this.animate();
  }

  animate() {
    if (this.gameState !== "racing") return;
    const now = Date.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.raceTime += dt;

    // --- PHYSICS ---
    const power = this.playerCar.power || 150;
    const gearRatios = [0, 3.5, 2.2, 1.6, 1.2, 0.9, 0.7];
    const gr = gearRatios[this.player.gear] || 0;

    // Engine torque force
    const activePower = this.player.gear > 0 ? (power / 12) * gr : 0;
    const drag = this.player.vel * 0.04;
    this.player.vel += (activePower - drag) * dt;
    this.player.pos += this.player.vel * dt * 25;

    // RPM Calculation
    const targetRpm =
      this.player.gear === 0
        ? 800 + Math.random() * 50
        : Math.min(9500, this.player.vel * gr * 40);
    this.player.rpm += (targetRpm - this.player.rpm) * dt * 6;

    // Enemy AI (Simplified)
    const ePower = this.enemyCar.power || 150;
    this.enemy.vel += ((ePower / 12) * 2.5 - this.enemy.vel * 0.04) * dt;
    this.enemy.pos += this.enemy.vel * dt * 25;

    // Heat up engine
    if (this.player.rpm > 7000) this.player.temp += 0.05;
    else if (this.player.temp > 180) this.player.temp -= 0.01;

    // Visuals Updates
    this.updateUI();
    this.updateWorld();

    if (
      this.player.pos >= this.trackLength * 20 ||
      this.enemy.pos >= this.trackLength * 20
    ) {
      this.finishRace();
      return;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  updateUI() {
    const kmh = Math.floor(this.player.vel * 3.6);
    document.getElementById("gauge-speed").innerText = kmh;
    document.getElementById("gauge-gear").innerText = this.player.gear || "N";
    document.getElementById("gauge-temp").innerText = Math.floor(
      this.player.temp,
    );

    // Needle rotations
    const speedDeg = 150 + kmh * 1.5;
    document.getElementById("speed-needle").style.transform =
      `rotate(${speedDeg}deg)`;

    const rpmPct = Math.min(1, this.player.rpm / 9000);
    const rpmDeg = -45 + rpmPct * 270;
    document.getElementById("rpm-needle").style.transform =
      `rotate(${rpmDeg}deg)`;

    const tempDeg = 200 + Math.max(0, this.player.temp - 180) * 2;
    document.getElementById("temp-needle").style.transform =
      `rotate(${tempDeg}deg)`;

    // Steering wheel shake
    const shake =
      this.player.vel > 40 ? (Math.random() - 0.5) * (this.player.vel / 10) : 0;
    document.getElementById("steering-wheel").style.transform =
      `translateX(-50%) rotate(${shake}deg)`;
  }

  updateWorld() {
    // Scroll road grid
    const road = document.getElementById("road-grid");
    const offset = (this.player.pos * 5) % 100;
    road.style.backgroundPosition = `0 ${offset}px`;

    // Enemy Visual
    const sprite = document.getElementById("enemy-sprite");
    const relativePos = this.enemy.pos - this.player.pos;

    // If enemy is ahead, they are at horizon (scale small)
    // If enemy is behind, they move down and get larger
    const distScale = 1 / (1 + Math.abs(relativePos) / 500);
    const screenY = 60; // horizon base %

    // Very simple perspective projection
    let scaleVal = 0.1 + distScale * 0.9;
    if (relativePos < 0) {
      // Enemy is behind
      scaleVal = 0.1 + distScale * 3.0; // Get really big as they fall behind
    }

    const xOffset = 50 + relativePos * 0.1; // Sway a bit
    sprite.style.transform = `translate(-50%, -100%) scale(${scaleVal})`;
    sprite.style.opacity = relativePos < -200 ? "0" : "1"; // Fade out if way behind
  }

  finishRace() {
    this.gameState = "finished";
    const win = this.player.pos >= this.enemy.pos;
    const popup = document.getElementById("results-popup");
    const title = document.getElementById("res-title");
    const rewardEl = document.getElementById("res-data");

    popup.style.display = "flex";
    title.innerText = win ? "VITÓRIA!" : "DERROTA...";
    title.style.color = win ? "#2ecc71" : "#e74c3c";

    const reward = win ? 1500 : 200;
    rewardEl.innerText =
      (win ? "+ $" : "- $") + Math.abs(reward).toLocaleString();
    rewardEl.style.color = win ? "#2ecc71" : "#e74c3c";

    if (window.profileManager) {
      this.profile.cash += win ? reward : -reward;
      window.profileManager.saveProfile(this.profile);
    }
  }

  stopRace() {
    this.gameState = "idle";
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}

if (typeof window !== "undefined") {
  window.RaceScreen = RaceScreen;
  window.raceScreen = new RaceScreen(window.eventSystem);
}
