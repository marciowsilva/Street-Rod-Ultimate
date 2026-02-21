// RaceScreen.js - v19.0 PRO DRAG CSR (The Photorealistic Standard)
console.log("☀️ RaceScreen v19.0: Pro Drag CSR Loading...");

class RaceScreen {
  constructor(eventSystem) {
    this.eventSystem = eventSystem;
    this.screenId = "race-screen";
    this.isActive = false;

    // 1. REALISTIC PHYSICS ENGINE
    this.gameState = "idle";
    this.playerCar = null;
    this.enemyCar = null;

    this.player = { pos: 0, vel: 0, rpm: 800, gear: 0, squat: 0, shake: 0 };
    this.enemy = { pos: 0, vel: 0, gear: 0 };
    this.trackLength = 1000; // 1km drag

    this.animationId = null;
    this.lastTime = 0;
    this.startTime = 0;
    this.raceTime = 0;

    // 2. CSR MECHANICS
    this.shiftLights = 0; // 0-5 lights
    this.perfectShiftWindow = false;

    this.boundKeyDown = this.handleKeyDown.bind(this);
  }

  show(data = {}) {
    this.isActive = true;
    this.updateProfileData();
    if (!this.profile || !this.profile.vehicles?.length) {
      alert("No vehicle found!");
      this.eventSystem.showScreen("garage-screen");
      return this;
    }
    this.playerCar = this.profile.vehicles[0];
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
    const el = document.getElementById("rc-v19-root");
    if (el) el.remove();
  }

  resetState() {
    this.gameState = "idle";
    this.player = { pos: 0, vel: 0, rpm: 800, gear: 0, squat: 0, shake: 0 };
    this.enemy = { pos: 0, vel: 0, gear: 0 };
    this.shiftLights = 0;
    this.raceTime = 0;
  }

  updateProfileData() {
    if (window.profileManager)
      this.profile = window.profileManager.getCurrentProfile();
  }

  setupEnemy() {
    const pwr = this.playerCar?.power || 150;
    this.enemyCar = {
      name: "Street King",
      power: pwr * (1.1 + Math.random() * 0.1),
    };
  }

  handleKeyDown(e) {
    if (this.gameState !== "racing" && this.gameState !== "ready") return;
    if (e.code === "Space" || e.code === "ArrowUp") this.shiftGear(1);
    else if (e.code === "KeyS" || e.code === "ArrowDown") this.shiftGear(-1);
  }

  shiftGear(dir) {
    const oldGear = this.player.gear;
    this.player.gear = Math.max(0, Math.min(5, this.player.gear + dir));

    if (oldGear !== this.player.gear) {
      if (dir > 0) {
        // Shift Physics
        const isPerfect = this.perfectShiftWindow;
        this.player.rpm = this.player.rpm * 0.6;
        this.player.squat = 15; // Visual kick
        this.player.shake = 10;

        // Feedback
        this.showFeedback(
          isPerfect ? "PERFECT SHIFT" : "GOOD SHIFT",
          isPerfect ? "#0f0" : "#fff",
        );
      }
    }
  }

  showFeedback(text, color) {
    const el = document.getElementById("v19-feedback");
    el.innerText = text;
    el.style.color = color;
    el.style.opacity = 1;
    el.style.transform = "scale(1.2)";
    setTimeout(() => {
      el.style.opacity = 0;
      el.style.transform = "scale(1)";
    }, 800);
  }

  render() {
    this.hide();

    const root = document.createElement("div");
    root.id = "rc-v19-root";
    // CSS INLINED FOR ATOMICITY
    root.style.cssText = `
      position: fixed; inset: 0; background: #000; overflow: hidden; z-index: 1000;
      font-family: 'Segoe UI', Roboto, sans-serif; user-select: none;
    `;

    root.innerHTML = `
      <!-- 1. DAYLIGHT ENVIRONMENT -->
      <div id="v19-sky" style="position:absolute; inset:0; height:60%; background:linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%);"></div>
      
      <!-- PARALLAX LAYERS -->
      <div id="v19-city" style="position:absolute; bottom:40%; left:0; width:400%; height:50%; 
           background: repeating-linear-gradient(90deg, #ccc 0, #ccc 20px, transparent 20px, transparent 100px);
           opacity: 0.5; filter: blur(2px);"></div>

      <!-- ROAD -->
      <div style="position:absolute; bottom:0; width:100%; height:40%; background:#333; overflow:hidden;">
         <div style="width:100%; height:10px; background:#222; position:absolute; top:0;"></div>
         <!-- ASPHALT TEXTURE -->
         <div style="position:absolute; inset:0; background:
             repeating-linear-gradient(0deg, transparent, transparent 48%, rgba(255,255,255,0.05) 50%, transparent 52%),
             repeating-linear-gradient(90deg, transparent, transparent 48%, rgba(255,255,255,0.05) 50%, transparent 52%);
             background-size: 10px 10px; opacity:0.3;"></div>
         
         <!-- LANES -->
         <div id="v19-lanes" style="position:absolute; top:40%; left:0; width:400%; height:4px; 
              background: repeating-linear-gradient(90deg, #fff 0, #fff 100px, transparent 100px, transparent 200px);"></div>
      </div>

      <!-- 2. CARS (METALLIC SHADERS) -->
      <div id="v19-stage" style="position:absolute; inset:0;">
         
         <!-- ENEMY -->
         <div id="v19-enemy" style="position:absolute; bottom:30%; left:200px; width:400px; height:120px;">
           <!-- Body -->
           <div style="position:absolute; bottom:10px; left:0; width:100%; height:60px; background:linear-gradient(to bottom, #a00, #500); border-radius:10px 40px 10px 10px; box-shadow: inset 0 5px 10px rgba(255,255,255,0.4);"></div>
           <!-- Roof -->
           <div style="position:absolute; bottom:70px; left:100px; width:200px; height:40px; background:#600; border-radius: 20px 20px 0 0;"></div>
           <!-- Wheels -->
           <div style="position:absolute; bottom:0; left:40px; width:60px; height:60px; background:#111; border-radius:50%; border:3px solid #ccc;"></div>
           <div style="position:absolute; bottom:0; right:60px; width:70px; height:70px; background:#111; border-radius:50%; border:3px solid #ccc;"></div>
         </div>

         <!-- PLAYER (METALLIC BLUE) -->
         <div id="v19-player" style="position:absolute; bottom:25%; left:200px; width:400px; height:120px;">
           <div id="v19-chassis" style="width:100%; height:100%; transform-origin: 20% 80%;">
             <!-- Body Gradient -->
             <div style="position:absolute; bottom:15px; left:0; width:100%; height:65px; 
                  background:linear-gradient(to bottom, #0055aa, #002244); 
                  border-radius:10px 50px 10px 10px; 
                  box-shadow: inset 0 10px 20px rgba(255,255,255,0.5), 0 10px 20px rgba(0,0,0,0.5);"></div>
             <!-- Roof -->
             <div style="position:absolute; bottom:80px; left:110px; width:180px; height:45px; 
                  background:linear-gradient(to right, #003366, #004488); 
                  border-radius: 30px 40px 0 0;"></div>
             <!-- Window -->
             <div style="position:absolute; bottom:82px; left:125px; width:140px; height:35px; background:#111; border-radius:20px 30px 0 0;"></div>
             
             <!-- Wheels (Spinning) -->
             <div class="v19-wheel" style="position:absolute; bottom:0; left:50px; width:64px; height:64px; background:#222; border-radius:50%; border:4px solid #ddd; display:flex; align-items:center; justify-content:center;">
                <div style="width:40px; height:4px; background:#555;"></div>
                <div style="width:4px; height:40px; background:#555;"></div>
             </div>
             <div class="v19-wheel" style="position:absolute; bottom:0; right:60px; width:72px; height:72px; background:#222; border-radius:50%; border:4px solid #ddd; display:flex; align-items:center; justify-content:center;">
                <div style="width:40px; height:4px; background:#555;"></div>
                <div style="width:4px; height:40px; background:#555;"></div>
             </div>
           </div>
         </div>
         
      </div>

      <!-- 3. PROFESSIONAL HUD -->
      <div style="position:absolute; bottom:0; width:100%; height:30%; background:linear-gradient(to top, #111 90%, transparent); display:flex; justify-content:center; align-items:flex-end; padding-bottom:20px;">
         
         <!-- LEFT: INFO -->
         <div style="position:absolute; left:40px; bottom:30px; color:#fff; font-family:'Courier New', monospace;">
            <div style="font-size:1.2rem; color:#888;">SPEED</div>
            <div style="font-size:4rem; font-weight:bold;" id="v19-spd">0</div>
            <div style="font-size:1rem; color:#666;">MPH</div>
         </div>

         <!-- CENTER: TACHOMETER (The Star) -->
         <div style="position:relative; width:300px; height:300px; margin-bottom:-100px;">
            <!-- Shift Lights -->
            <div style="position:absolute; top:20px; left:50%; transform:translate(-50%,0); display:flex; gap:5px; z-index:10;">
               <div id="v19-sl-1" style="width:20px; height:20px; background:#333; border-radius:50%; border:2px solid #555;"></div>
               <div id="v19-sl-2" style="width:20px; height:20px; background:#333; border-radius:50%; border:2px solid #555;"></div>
               <div id="v19-sl-3" style="width:20px; height:20px; background:#333; border-radius:50%; border:2px solid #555;"></div>
               <div id="v19-sl-4" style="width:20px; height:20px; background:#333; border-radius:50%; border:2px solid #555;"></div>
               <div id="v19-sl-5" style="width:30px; height:30px; background:#333; border-radius:50%; border:2px solid #fff;"></div>
            </div>

            <!-- Gauge Body -->
            <div style="width:100%; height:100%; background:radial-gradient(#222,#000); border-radius:50%; border:8px solid #444; box-shadow:0 0 20px rgba(0,0,0,0.8);">
               <!-- Ticks -->
               <div style="position:absolute; inset:20px; border-radius:50%; border:2px dashed #666;"></div>
               
               <!-- Needle -->
               <div id="v19-needle" style="position:absolute; top:50%; left:50%; width:130px; height:4px; background:#ff3300; 
                    transform-origin:0 50%; transform:rotate(140deg); box-shadow:0 0 5px #ff0000;"></div>
               
               <!-- Center Cap -->
               <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:30px; height:30px; background:#111; border-radius:50%; border:2px solid #666;"></div>
               
               <!-- Gear Display -->
               <div id="v19-gear" style="position:absolute; bottom:80px; left:50%; transform:translate(-50%,0); font-size:3rem; color:#fff; font-weight:bold;">N</div>
            </div>
         </div>

         <!-- RIGHT: DISTANCE -->
         <div style="position:absolute; right:40px; bottom:30px; color:#fff; text-align:right;">
             <div style="font-size:1.2rem; color:#888;">DIST</div>
             <div style="font-size:2rem;" id="v19-dist">0m</div>
         </div>
      </div>

      <!-- FEEDBACK OVERLAY -->
      <div id="v19-feedback" style="position:absolute; top:20%; width:100%; text-align:center; font-size:3rem; font-weight:900; text-shadow:0 2px 10px rgba(0,0,0,0.5); transition:all 0.2s;"></div>
      
      <!-- START BUTTON -->
      <button id="v19-btn-start" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); 
              padding:20px 80px; font-size:2rem; background:#ffcc00; border:none; border-radius:5px; 
              box-shadow:0 5px 0 #cc9900; cursor:pointer; font-weight:bold; color:#000;">RACE</button>

      <!-- RESULTS -->
      <div id="v19-results" style="position:absolute; inset:0; background:rgba(255,255,255,0.95); z-index:2000; display:none; flex-direction:column; justify-content:center; align-items:center; color:#000;">
          <h1 id="v19-res-text" style="font-size:5rem; font-weight:900;">WINNER</h1>
          <button onclick="window.raceScreen.hide(); window.raceScreen.eventSystem.showScreen('main-menu')" style="padding:15px 40px; font-size:1.5rem; background:#333; color:#fff; border:none; margin-top:20px;">CONTINUE</button>
      </div>
    `;

    document.body.appendChild(root);
  }

  attachEvents() {
    document.getElementById("v19-btn-start").onclick = () =>
      this.startCountdown();
  }

  startCountdown() {
    const btn = document.getElementById("v19-btn-start");
    btn.style.display = "none";
    this.gameState = "ready";

    // Quick simple lights
    this.showFeedback("READY", "#fff");
    setTimeout(() => this.showFeedback("SET", "#ffcc00"), 1000);
    setTimeout(() => {
      this.showFeedback("GO!!!", "#0f0");
      this.startRace();
    }, 2000);
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
    const gr = [0, 3.2, 2.1, 1.5, 1.1, 0.9][this.player.gear] || 0;
    const force = this.player.gear > 0 ? (power / 12) * gr : 0;

    // Drag
    const drag = this.player.vel * 0.04;
    this.player.vel += (force - drag) * dt;
    this.player.pos += this.player.vel * dt * 30;

    // RPM Logic
    const trgRpm =
      this.player.gear === 0
        ? 800 + Math.random() * 100
        : Math.min(9000, this.player.vel * gr * 40);
    this.player.rpm += (trgRpm - this.player.rpm) * dt * 8;

    // Enemy
    const ePower = this.enemyCar.power;
    this.enemy.vel += ((ePower / 12) * 2.5 - this.enemy.vel * 0.04) * dt;
    this.enemy.pos += this.enemy.vel * dt * 30;

    // --- VISUALS ---
    this.updateUI();
    this.updateWorld();

    // Check Finish
    if (this.player.pos >= this.trackLength * 20) {
      // Scale factor
      this.finishRace();
      return;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  updateUI() {
    // Tachometer
    const maxRpm = 9000;
    const pct = Math.min(1, this.player.rpm / maxRpm);
    const deg = 140 + pct * 260; // 140 to 400
    document.getElementById("v19-needle").style.transform = `rotate(${deg}deg)`;

    // Speed
    const mph = Math.floor(this.player.vel * 2.2);
    document.getElementById("v19-spd").innerText = mph;
    document.getElementById("v19-dist").innerText =
      Math.floor(this.player.pos / 20) + "m";
    document.getElementById("v19-gear").innerText = this.player.gear || "N";

    // Shift Lights
    const setL = (id, on, col) => {
      const el = document.getElementById(id);
      el.style.background = on ? col : "#333";
      el.style.boxShadow = on ? `0 0 10px ${col}` : "none";
    };

    setL("v19-sl-1", this.player.rpm > 5000, "#0f0");
    setL("v19-sl-2", this.player.rpm > 6000, "#0f0");
    setL("v19-sl-3", this.player.rpm > 7000, "#ffcc00");
    setL("v19-sl-4", this.player.rpm > 7500, "#ffcc00");
    setL("v19-sl-5", this.player.rpm > 8000, "#f00");

    this.perfectShiftWindow = this.player.rpm > 7800 && this.player.rpm < 8400;
  }

  updateWorld() {
    // Camera follows player
    const camX = this.player.pos - 200;

    // Parallax
    document.getElementById("v19-city").style.transform =
      `translateX(${-camX * 0.2}px)`;
    document.getElementById("v19-lanes").style.transform =
      `translateX(${-camX % 200}px)`;

    // Cars relative to camera
    const pEl = document.getElementById("v19-player");
    const eEl = document.getElementById("v19-enemy");

    // Squat
    this.player.squat = Math.max(0, this.player.squat * 0.9);
    const squatRot = -(this.player.squat * 0.2);
    document.getElementById("v19-chassis").style.transform =
      `rotate(${squatRot}deg)`;

    // Position
    const playerVisX = 200; // Fixed on screen
    const enemyVisX = 200 + (this.enemy.pos - this.player.pos);

    eEl.style.left = `${enemyVisX}px`;

    // Wheels Spin
    const wRot = (this.player.pos % 1000) * 10;
    document
      .querySelectorAll(".v19-wheel")
      .forEach((w) => (w.style.transform = `rotate(${wRot}deg)`));

    // Shake
    if (this.player.shake > 0) {
      const root = document.getElementById("rc-v19-root");
      root.style.transform = `translate(${(Math.random() - 0.5) * this.player.shake}px, ${(Math.random() - 0.5) * this.player.shake}px)`;
      this.player.shake *= 0.9;
    } else {
      document.getElementById("rc-v19-root").style.transform = "none";
    }
  }

  finishRace() {
    this.gameState = "finished";
    const win = this.player.pos > this.enemy.pos;
    const resDiv = document.getElementById("v19-results");
    resDiv.style.display = "flex";
    document.getElementById("v19-res-text").innerText = win
      ? "VICTORY"
      : "DEFEATED";
    document.getElementById("v19-res-text").style.color = win
      ? "#00aa00"
      : "#aa0000";

    if (window.profileManager) {
      this.profile.cash += win ? 1000 : -200;
      window.profileManager.saveProfile(this.profile);
    }
  }

  stopRace() {
    this.gameState = "idle";
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}

window.raceScreen = new RaceScreen(window.eventSystem);
