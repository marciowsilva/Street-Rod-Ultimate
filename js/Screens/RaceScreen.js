// RaceScreen.js - v22.0 DRAG RACE SIDE VIEW (Classic Arrancada)

class RaceScreen {
  constructor(eventSystem) {
    this.eventSystem = eventSystem;
    this.screenId = "race-screen";
    this.isActive = false;

    this.gameState = "idle";
    this.playerCar = null;
    this.enemyCar = null;

    this.player = { pos: 0, vel: 0, rpm: 800, gear: 0 };
    this.enemy = { pos: 0, vel: 0 };
    this.trackLength = 400; // metros

    this.animationId = null;
    this.lastTime = null;
    this.raceTime = 0;
    this.perfectShiftWindow = false;
    this.fbTimeout = null;

    this.boundKeyDown = this.handleKeyDown.bind(this);
  }

  show(data) {
    data = data || {};
    this.isActive = true;
    this.updateProfileData();

    if (
      !this.profile ||
      !this.profile.vehicles ||
      !this.profile.vehicles.length
    ) {
      alert("Selecione um veiculo na garagem primeiro!");
      if (this.eventSystem) this.eventSystem.showScreen("garage");
      return this;
    }

    var idx = data.vehicleIndex !== undefined ? data.vehicleIndex : 0;
    this.playerCar = this.profile.vehicles[idx] || this.profile.vehicles[0];
    this.setupEnemy();
    this.resetState();
    this.render();
    this.attachEvents();
    window.addEventListener("keydown", this.boundKeyDown);
    return this;
  }

  hide() {
    this.isActive = false;
    this.stopRace();
    window.removeEventListener("keydown", this.boundKeyDown);
    var el = document.getElementById("rc-drag-root");
    if (el) el.remove();
  }

  cleanup() {
    this.hide();
  }

  resetState() {
    this.gameState = "idle";
    this.player = { pos: 0, vel: 0, rpm: 800, gear: 0 };
    this.enemy = { pos: 0, vel: 0 };
    this.raceTime = 0;
    this.perfectShiftWindow = false;
  }

  updateProfileData() {
    if (window.profileManager)
      this.profile = window.profileManager.getCurrentProfile();
  }

  setupEnemy() {
    var pwr =
      this.playerCar && this.playerCar.power ? this.playerCar.power : 180;
    var rival = {
      name: "Street King",
      power: pwr * (0.92 + Math.random() * 0.16),
      color: "#cc2200",
    };
    this.enemyCar = rival;
  }

  handleKeyDown(e) {
    if (e.repeat) return;
    if (this.gameState !== "racing") return;
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      this.shiftGear(1);
    } else if (e.code === "KeyS" || e.code === "ArrowDown") {
      e.preventDefault();
      this.shiftGear(-1);
    }
  }

  shiftGear(dir) {
    var old = this.player.gear;
    this.player.gear = Math.max(0, Math.min(6, this.player.gear + dir));
    if (old === this.player.gear) return;
    if (dir > 0) {
      var perfect = this.perfectShiftWindow;
      this.player.rpm = Math.max(1000, this.player.rpm * 0.62);
      if (perfect) {
        this.player.vel += 5;
        this.showFeedback("MARCHA PERFEITA!", "#00ff88");
      } else if (this.player.rpm > 2500) {
        this.showFeedback("BOA MARCHA", "#ffffff");
      } else {
        this.showFeedback("MARCHA PRECOCE", "#ffaa00");
      }
    }
  }

  showFeedback(text, color) {
    var el = document.getElementById("drag-feedback");
    if (!el) return;
    el.innerText = text;
    el.style.color = color;
    el.style.opacity = "1";
    el.style.transform = "scale(1.1)";
    if (this.fbTimeout) clearTimeout(this.fbTimeout);
    this.fbTimeout = setTimeout(function () {
      var e2 = document.getElementById("drag-feedback");
      if (e2) {
        e2.style.opacity = "0";
        e2.style.transform = "scale(1)";
      }
    }, 800);
  }

  // ─────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────
  render() {
    this.hide();

    var pColor =
      this.playerCar && this.playerCar.color ? this.playerCar.color : "#1a6bb5";
    var pName =
      this.playerCar && this.playerCar.name ? this.playerCar.name : "Seu Carro";
    var eColor = this.enemyCar.color;
    var eName = this.enemyCar.name;

    var root = document.createElement("div");
    root.id = "rc-drag-root";
    root.style.cssText = [
      "position:fixed;inset:0;overflow:hidden;z-index:1000;",
      "font-family:'Rajdhani',sans-serif;user-select:none;",
    ].join("");

    // ── BACKGROUND (Canvas) ──────────────────
    var bgStyle = ["position:absolute;inset:0;width:100%;height:100%;"].join(
      "",
    );

    // ── LANES ────────────────────────────────
    // Lane heights: enemy=top 50%, player=bottom 50%
    // Each lane splits the screen horizontally

    // Lane separators & road are drawn on canvas. Cars are HTML overlays.

    // ── HTML STRUCTURE ───────────────────────
    root.innerHTML = `
      <style id="race-layout-styles">
        #rc-drag-root {
          background: #000;
        }

        /* Top HUD Bar */
        #drag-top-hud {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.6));
          display: flex;
          align-items: center;
          padding: 10px 20px;
          gap: 15px;
          z-index: 40;
          border-bottom: 2px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        #drag-top-hud .player-label {
          color: #e74c3c;
          font-weight: 700;
          font-size: 0.9rem;
          min-width: 100px;
        }

        #drag-top-hud .progress-section {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        #drag-top-hud .progress-bar {
          flex: 1;
          height: 12px;
          background: rgba(255,255,255,0.12);
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        #drag-top-hud .finish-label {
          font-size: 0.65rem;
          color: #888;
          padding-right: 4px;
        }

        #drag-top-hud .player-you {
          color: #2ecc71;
          font-weight: 700;
          font-size: 0.9rem;
          min-width: 100px;
          text-align: right;
        }

        /* Racing Area */
        #drag-racing-area {
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          bottom: 180px;
        }

        /* Bottom HUD */
        #drag-bottom-hud {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 180px;
          background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
          display: flex;
          align-items: flex-end;
          padding: 20px 40px;
          justify-content: space-between;
          gap: 30px;
          z-index: 40;
          border-top: 2px solid rgba(255,255,255,0.1);
          box-shadow: 0 -4px 10px rgba(0,0,0,0.5);
        }

        #drag-bottom-hud > div {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        #drag-bottom-hud .hud-label {
          color: #aaa;
          font-size: 0.8rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        #drag-bottom-hud .hud-large-value {
          color: #fff;
          font-size: 4.5rem;
          font-weight: 900;
          line-height: 1;
          text-shadow: 0 0 20px rgba(255,255,255,0.3);
        }

        #drag-bottom-hud .hud-unit {
          color: #666;
          font-size: 0.9rem;
        }

        /* Center Tachometer Area */
        #drag-center-hud {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          margin-bottom: -20px;
        }
      </style>`
    root.innerHTML +=
      // Background canvas
      '<canvas id="drag-canvas" style="' +
      bgStyle +
      '"></canvas>' +
      // ─── TOP HUD ────────────────────────────
      '<div id="drag-top-hud">' +
      '<div class="player-label">' + eName.toUpperCase() + '</div>' +
      '<div class="progress-section">' +
      '<div class="progress-bar">' +
      '<div id="drag-prog-enemy" style="position:absolute;top:0;left:0;height:100%;width:0%;background:#e74c3c;border-radius:5px;box-shadow:0 0 8px #e74c3c;transition:width 0.1s;"></div>' +
      '<div id="drag-prog-player" style="position:absolute;top:0;left:0;height:100%;width:0%;background:#2ecc71;border-radius:5px;box-shadow:0 0 8px #2ecc71;transition:width 0.1s;"></div>' +
      '</div>' +
      '<div class="finish-label">META</div>' +
      '</div>' +
      '<div class="player-you">VOCÊ</div>' +
      '</div>' +
      // ─── RACING AREA ────────────────────────
      '<div id="drag-racing-area">' +
      // ─── ENEMY LANE (top half) ───
      '<div id="drag-lane-enemy" style="position:absolute;top:12%;left:0;right:0;height:36%;pointer-events:none;">' +
      '<div id="drag-enemy" style="position:absolute;top:50%;transform:translateY(-50%);height:80px;width:200px;left:30px;">' +
      this.buildCarHTML(eColor, false) +
      '</div>' +
      '<div style="position:absolute;top:4px;right:20px;color:#fff;font-size:0.85rem;font-weight:700;background:rgba(0,0,0,0.5);padding:3px 10px;border-radius:4px;letter-spacing:1px;">' +
      eName.toUpperCase() +
      '</div>' +
      '</div>' +
      // ─── PLAYER LANE (bottom half) ───
      '<div id="drag-lane-player" style="position:absolute;top:50%;left:0;right:0;height:36%;pointer-events:none;">' +
      '<div id="drag-player" style="position:absolute;top:50%;transform:translateY(-50%);height:90px;width:220px;left:30px;">' +
      this.buildCarHTML(pColor, true) +
      '</div>' +
      '<div style="position:absolute;bottom:4px;right:20px;color:#fff;font-size:0.85rem;font-weight:700;background:rgba(0,0,0,0.5);padding:3px 10px;border-radius:4px;letter-spacing:1px;">' +
      pName.toUpperCase() +
      '</div>' +
      '</div>' +
      // Feedback
      '<div id="drag-feedback" style="position:absolute;top:44%;width:100%;text-align:center;font-size:3rem;font-weight:900;letter-spacing:4px;opacity:0;transition:opacity 0.15s,transform 0.15s;z-index:50;pointer-events:none;text-shadow:0 4px 15px rgba(0,0,0,0.9);"></div>' +
      '</div>' +
      // ─── BOTTOM HUD ─────────────────────────
      '<div id="drag-bottom-hud">' +
      '<div>' +
      '<div class="hud-label">Velocidade</div>' +
      '<div id="drag-spd" class="hud-large-value">0</div>' +
      '<div class="hud-unit">KM/H</div>' +
      '</div>' +
      // Center: Full circular tachometer
      '<div id="drag-center-hud">' +
      // Shift lights row above gauge
      '<div style="display:flex;gap:6px;margin-bottom:8px;align-items:center;">' +
      '<div id="sl0" style="width:12px;height:12px;border-radius:50%;background:#111;border:2px solid #333;transition:all 0.08s;box-shadow:none;"></div>' +
      '<div id="sl1" style="width:14px;height:14px;border-radius:50%;background:#111;border:2px solid #333;transition:all 0.08s;box-shadow:none;"></div>' +
      '<div id="sl2" style="width:18px;height:18px;border-radius:50%;background:#111;border:2px solid #333;transition:all 0.08s;box-shadow:none;"></div>' +
      '<div id="sl3" style="width:14px;height:14px;border-radius:50%;background:#111;border:2px solid #333;transition:all 0.08s;box-shadow:none;"></div>' +
      '<div id="sl4" style="width:12px;height:12px;border-radius:50%;background:#111;border:2px solid #333;transition:all 0.08s;box-shadow:none;"></div>' +
      '</div>' +
      // SVG circular gauge
      '<div style="position:relative;width:180px;height:180px;margin-bottom:10px;">' +
      '<svg id="drag-tacho-svg" width="180" height="180" viewBox="0 0 180 180">' +
      // Outer ring glossy
      '<circle cx="90" cy="90" r="88" fill="url(#gaugeBody)" stroke="#444" stroke-width="2"/>' +
      '<circle cx="90" cy="90" r="88" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>' +
      // Defs for gradients
      "<defs>" +
      '<radialGradient id="gaugeBody" cx="40%" cy="30%" r="70%">' +
      '<stop offset="0%" stop-color="#2a2a2a"/>' +
      '<stop offset="100%" stop-color="#0a0a0a"/>' +
      "</radialGradient>" +
      '<radialGradient id="centerCap" cx="50%" cy="40%" r="60%">' +
      '<stop offset="0%" stop-color="#555"/>' +
      '<stop offset="100%" stop-color="#111"/>' +
      "</radialGradient>" +
      "</defs>" +
      // Background arc track (135deg to 405deg = 270deg sweep, standard gauge)
      '<circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="14" stroke-dasharray="1000" stroke-linecap="round"/>' +
      // Zone arcs: Green (0-60%), Yellow (60-80%), Red (80-100%)
      // Full arc = path M start A... covering 270 degrees starting from bottom-left
      // Using circle stroke with dasharray trick on background track
      '<path d="M 90 162 A 72 72 0 1 1 161.9 114" fill="none" stroke="#1a5c2a" stroke-width="14" stroke-linecap="round" opacity="0.8"/>' +
      '<path d="M 161.9 114 A 72 72 0 0 1 162 90" fill="none" stroke="#7a6000" stroke-width="14" stroke-linecap="round" opacity="0.8"/>' +
      '<path d="M 162 90 A 72 72 0 0 1 90 18" fill="none" stroke="#7a1a00" stroke-width="14" stroke-linecap="round" opacity="0.8"/>' +
      // Animated fill arc (full 270deg path, dashoffset-controlled)
      '<path id="drag-rpm-arc" d="M 90 162 A 72 72 0 1 1 90 18" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" stroke-dasharray="1000" stroke-dashoffset="1000"/>' +
      // Tick marks (major every 1000 RPM from 1k to 9k = 9 major ticks over 270deg)
      // 270 deg range, starting at 225deg (bottom-left), ending at -45deg (bottom-right)
      // Each 1000 RPM = 30deg
      // Major ticks at: 225, 195, 165, 135, 105, 75, 45, 15, -15 degrees (standard)
      (function () {
        var ticks = "";
        for (var t = 0; t <= 9; t++) {
          var angleDeg = 225 - t * 30;
          var angleRad = (angleDeg * Math.PI) / 180;
          var isMajor = true; // every mark is major for RPM gauge
          var r1 = 62,
            r2 = 54;
          var x1 = 90 + r1 * Math.cos(angleRad);
          var y1 = 90 - r1 * Math.sin(angleRad);
          var x2 = 90 + r2 * Math.cos(angleRad);
          var y2 = 90 - r2 * Math.sin(angleRad);
          var col =
            t >= 8 ? "#ff3300" : t >= 6 ? "#ffcc00" : "rgba(255,255,255,0.7)";
          ticks +=
            '<line x1="' +
            x1.toFixed(1) +
            '" y1="' +
            y1.toFixed(1) +
            '" x2="' +
            x2.toFixed(1) +
            '" y2="' +
            y2.toFixed(1) +
            '" stroke="' +
            col +
            '" stroke-width="2.5" stroke-linecap="round"/>';
          // Minor ticks (3 between each major)
          if (t < 9) {
            for (var m = 1; m <= 3; m++) {
              var minAngleDeg = 225 - (t + m / 4) * 30;
              var minRad = (minAngleDeg * Math.PI) / 180;
              var mx1 = 90 + 62 * Math.cos(minRad);
              var my1 = 90 - 62 * Math.sin(minRad);
              var mx2 = 90 + 58 * Math.cos(minRad);
              var my2 = 90 - 58 * Math.sin(minRad);
              ticks +=
                '<line x1="' +
                mx1.toFixed(1) +
                '" y1="' +
                my1.toFixed(1) +
                '" x2="' +
                mx2.toFixed(1) +
                '" y2="' +
                my2.toFixed(1) +
                '" stroke="rgba(255,255,255,0.25)" stroke-width="1" stroke-linecap="round"/>';
            }
          }
          // RPM number label
          var lx = 90 + 44 * Math.cos(angleRad);
          var ly = 90 - 44 * Math.sin(angleRad) + 4;
          var label = t === 0 ? "" : t;
          if (label) {
            var lcol =
              t >= 8 ? "#ff4400" : t >= 6 ? "#ffcc00" : "rgba(255,255,255,0.6)";
            ticks +=
              '<text x="' +
              lx.toFixed(1) +
              '" y="' +
              ly.toFixed(1) +
              '" text-anchor="middle" fill="' +
              lcol +
              '" font-size="11" font-family="Rajdhani,sans-serif" font-weight="700">' +
              label +
              "</text>";
          }
        }
        return ticks;
      })() +
      // Needle (rotates via transform on the group)
      '<g id="drag-needle-group" transform="rotate(-225 90 90)">' +
      // Needle body
      '<polygon points="90,26 87,90 93,90" fill="url(#needleGrad)" filter="drop-shadow(0 0 3px rgba(255,80,0,0.8))"/>' +
      // Counter-weight
      '<circle cx="90" cy="90" r="6" fill="#333" stroke="#555" stroke-width="1"/>' +
      "<defs>" +
      '<linearGradient id="needleGrad" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#ff4400"/>' +
      '<stop offset="60%" stop-color="#ff2200"/>' +
      '<stop offset="100%" stop-color="#aa1100"/>' +
      "</linearGradient>" +
      "</defs>" +
      "</g>" +
      // Center cap (chrome look)
      '<circle cx="90" cy="90" r="10" fill="url(#centerCap)" stroke="#666" stroke-width="1.5"/>' +
      '<circle cx="87" cy="87" r="3" fill="rgba(255,255,255,0.25)"/>' +
      "</svg>" +
      // RPM label at bottom inside gauge
      '<div style="position:absolute;bottom:22px;left:50%;transform:translateX(-50%);text-align:center;">' +
      '<div style="color:rgba(255,255,255,0.35);font-size:0.55rem;letter-spacing:3px;text-transform:uppercase;">x1000 RPM</div>' +
      "</div>" +
      // Gear display center (overlaid on gauge)
      '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-30%);text-align:center;pointer-events:none;">' +
      '<div style="color:rgba(255,255,255,0.4);font-size:0.6rem;letter-spacing:3px;text-transform:uppercase;margin-bottom:2px;">MARCHA</div>' +
      '<div id="drag-gear" style="color:#fff;font-size:2.8rem;font-weight:900;line-height:1;text-shadow:0 2px 10px rgba(255,255,255,0.4);">N</div>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div>' +
      '<div class="hud-label">Distância</div>' +
      '<div id="drag-dist" class="hud-large-value">0</div>' +
      '<div class="hud-unit">/ ' + this.trackLength + 'm</div>' +
      '</div>' +
      '</div>' +
      // ─── START OVERLAY ────────────────────────
      '<div id="drag-start" style="position:absolute;inset:0;background:rgba(0,0,0,0.75);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:60;backdrop-filter:blur(4px);">' +
      '<div style="font-size:1rem;color:#aaa;letter-spacing:6px;text-transform:uppercase;margin-bottom:8px;">Corrida de Arrancada</div>' +
      '<div style="font-size:3.5rem;font-weight:900;color:#fff;letter-spacing:3px;margin-bottom:6px;">' +
      pName.toUpperCase() +
      "</div>" +
      '<div style="display:flex;align-items:center;gap:20px;margin-bottom:40px;">' +
      '<div style="font-size:1.1rem;color:#aaa;">vs</div>' +
      '<div style="font-size:1.5rem;font-weight:700;color:#e74c3c;">' +
      eName.toUpperCase() +
      "</div>" +
      '<div style="background:#333;color:#aaa;padding:4px 12px;border-radius:4px;font-size:0.9rem;">' +
      Math.round(this.enemyCar.power) +
      " HP</div>" +
      "</div>" +
      '<div style="display:flex;gap:16px;margin-bottom:16px;">' +
      '<div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);padding:12px 24px;border-radius:8px;text-align:center;">' +
      '<div style="color:#aaa;font-size:0.75rem;letter-spacing:2px;">SEU CARRO</div>' +
      '<div style="color:#2ecc71;font-size:1.5rem;font-weight:900;">' +
      (this.playerCar && this.playerCar.power
        ? Math.round(this.playerCar.power)
        : 180) +
      " HP</div>" +
      "</div>" +
      '<div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);padding:12px 24px;border-radius:8px;text-align:center;">' +
      '<div style="color:#aaa;font-size:0.75rem;letter-spacing:2px;">PISTA</div>' +
      '<div style="color:#fff;font-size:1.5rem;font-weight:900;">' +
      this.trackLength +
      "m</div>" +
      "</div>" +
      "</div>" +
      '<button id="drag-btn-start" style="padding:18px 80px;font-size:2.2rem;font-weight:900;color:#fff;background:#e74c3c;border:none;border-radius:8px;cursor:pointer;letter-spacing:4px;font-family:\'Rajdhani\',sans-serif;box-shadow:0 8px 30px rgba(231,76,60,0.5);transition:all 0.2s;" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'">LARGAR</button>' +
      '<button id="drag-btn-back" style="margin-top:14px;background:transparent;border:1px solid rgba(255,255,255,0.2);color:#aaa;padding:10px 30px;border-radius:6px;cursor:pointer;font-family:\'Rajdhani\',sans-serif;font-size:1rem;letter-spacing:1px;">← Voltar para Garagem</button>' +
      "</div>" +
      // ─── COUNTDOWN ───────────────────────────
      '<div id="drag-countdown" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;z-index:55;pointer-events:none;">' +
      '<div id="drag-cd-text" style="font-size:14rem;font-weight:900;color:#fff;line-height:1;text-shadow:0 0 80px rgba(255,255,255,0.7);"></div>' +
      "</div>" +
      // ─── RESULTS ─────────────────────────────
      '<div id="drag-results" style="display:none;position:absolute;inset:0;background:rgba(0,0,0,0.92);flex-direction:column;align-items:center;justify-content:center;z-index:70;backdrop-filter:blur(8px);">' +
      '<div id="drag-res-title" style="font-size:7rem;font-weight:900;letter-spacing:8px;font-style:italic;text-transform:uppercase;text-shadow:0 0 40px currentColor;margin-bottom:10px;">VITORIA!</div>' +
      '<div id="drag-res-time"  style="font-size:1.5rem;color:#aaa;margin-bottom:6px;letter-spacing:2px;"></div>' +
      '<div id="drag-res-reward" style="font-size:3.5rem;font-weight:900;text-shadow:0 0 20px currentColor;margin-bottom:50px;">+ $2,500</div>' +
      '<button id="drag-res-back" style="padding:18px 55px;font-size:1.6rem;font-weight:700;background:transparent;color:#fff;border:2px solid #fff;border-radius:8px;cursor:pointer;letter-spacing:3px;font-family:\'Rajdhani\',sans-serif;transition:0.2s;" onmouseover="this.style.background=\'rgba(255,255,255,0.1)\'" onmouseout="this.style.background=\'transparent\'">VOLTAR A GARAGEM</button>' +
      "</div>";

    document.body.appendChild(root);

    this.canvas = document.getElementById("drag-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();
    this.drawBackground(0);
  }

  // ─────────────────────────────────────────
  //  Car HTML Builder (side profile CSS car)
  // ─────────────────────────────────────────
  buildCarHTML(color, isPlayer) {
    var scale = isPlayer ? 1 : 0.85;
    var h = isPlayer ? 90 : 76;
    var w = isPlayer ? 220 : 186;

    // Glass color slightly tinted
    var glass = "rgba(140,210,255,0.75)";
    // Wheel color
    var rim = "#cccccc";

    return [
      '<svg viewBox="0 0 220 90" width="' +
        w +
        'px" height="' +
        h +
        'px" style="filter:drop-shadow(0 6px 18px rgba(0,0,0,0.7));">',
      // Shadow
      '<ellipse cx="110" cy="86" rx="95" ry="6" fill="rgba(0,0,0,0.4)"/>',
      // BODY MAIN
      '<rect x="10" y="38" width="200" height="38" rx="6" fill="' +
        color +
        '"/>',
      // BODY side shine
      '<rect x="12" y="40" width="196" height="8" rx="4" fill="rgba(255,255,255,0.18)"/>',
      // CABIN
      '<path d="M 55 38 Q 65 10 90 8 L 160 8 Q 185 10 175 38 Z" fill="' +
        color +
        '" opacity="0.9"/>',
      // Roof shine
      '<path d="M 65 34 Q 72 14 92 12 L 155 12 Q 170 14 168 34 Z" fill="rgba(255,255,255,0.12)"/>',
      // WINDSHIELD front
      '<path d="M 160 38 Q 180 14 175 10 L 160 10 Q 186 12 178 38 Z" fill="' +
        glass +
        '"/>',
      // WINDSHIELD main
      '<path d="M 62 38 Q 70 12 93 10 L 158 10 Q 178 12 170 38 Z" fill="' +
        glass +
        '"/>',
      // Windshield tint bar
      '<path d="M 63 38 Q 70 24 93 22 L 158 22 Q 175 24 168 38 Z" fill="rgba(0,0,0,0.2)"/>',
      // Hood front — slope
      '<path d="M 175 38 L 210 38 L 210 52 L 175 52 Z" fill="' + color + '"/>',
      '<path d="M 178 40 L 208 40 L 208 44 L 178 44 Z" fill="rgba(255,255,255,0.1)"/>',
      // Trunk rear
      '<path d="M 10 38 L 30 38 L 30 52 L 10 52 Z" fill="' + color + '"/>',
      // Front bumper
      '<rect x="204" y="56" width="8" height="12" rx="2" fill="#555"/>',
      // Rear bumper
      '<rect x="8"   y="56" width="8" height="12" rx="2" fill="#555"/>',
      // HEADLIGHT front
      '<rect x="205" y="42" width="10" height="8" rx="2" fill="#fffde0"/>',
      '<rect x="206" y="43" width="8"  height="6" rx="1" fill="rgba(255,255,200,0.9)" style="filter:drop-shadow(0 0 6px #fff9a0);"/>',
      // TAILLIGHT rear
      '<rect x="6"  y="44" width="10" height="8" rx="2" fill="#cc1100"/>',
      '<rect x="7"  y="45" width="8"  height="6" rx="1" fill="#ff2200" style="filter:drop-shadow(0 0 6px #ff2200);"/>',
      // Door line
      '<line x1="115" y1="40" x2="115" y2="74" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>',
      // Door handle
      '<rect x="100" y="54" width="12" height="4" rx="2" fill="rgba(0,0,0,0.25)"/>',
      // WHEELS
      // Front wheel
      '<circle cx="170" cy="74" r="18" fill="#111"/>',
      '<circle cx="170" cy="74" r="14" fill="#222"/>',
      '<circle cx="170" cy="74" r="10" fill="#444"/>',
      '<circle cx="170" cy="74" r="6"  fill="' + rim + '"/>',
      '<circle cx="170" cy="74" r="3"  fill="#555"/>',
      // Front tire shine
      '<path d="M 155 65 A 18 18 0 0 1 170 56" stroke="rgba(255,255,255,0.15)" stroke-width="4" fill="none"/>',
      // Rear wheel
      '<circle cx="52"  cy="74" r="18" fill="#111"/>',
      '<circle cx="52"  cy="74" r="14" fill="#222"/>',
      '<circle cx="52"  cy="74" r="10" fill="#444"/>',
      '<circle cx="52"  cy="74" r="6"  fill="' + rim + '"/>',
      '<circle cx="52"  cy="74" r="3"  fill="#555"/>',
      // Rear tire shine
      '<path d="M 37 65 A 18 18 0 0 1 52 56" stroke="rgba(255,255,255,0.15)" stroke-width="4" fill="none"/>',
      "</svg>",
    ].join("");
  }

  // ─────────────────────────────────────────
  //  CANVAS BACKGROUND
  // ─────────────────────────────────────────
  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  drawBackground(scrollX) {
    var cv = this.canvas;
    var ctx = this.ctx;
    if (!cv || !ctx) return;

    var W = cv.width;
    var H = cv.height;
    var MID = H / 2; // Lane divider Y

    // ─── SKY (top half background) ───
    var sky = ctx.createLinearGradient(0, 0, 0, MID);
    sky.addColorStop(0, "#0d1a2e");
    sky.addColorStop(0.6, "#1a3355");
    sky.addColorStop(1, "#2a4a6a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, MID);

    // Stars in sky
    for (var s = 0; s < 60; s++) {
      // Pseudo random positions using index
      var sx = (s * 137 + 40) % W;
      var sy = (s * 97 + 20) % (MID * 0.7);
      var sr = 0.5 + (s % 3) * 0.4;
      var br = 0.4 + (s % 5) * 0.12;
      ctx.fillStyle = "rgba(255,255,255," + br + ")";
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Moon
    ctx.fillStyle = "#fffde0";
    ctx.beginPath();
    ctx.arc(W * 0.85, MID * 0.25, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a3355";
    ctx.beginPath();
    ctx.arc(W * 0.85 + 10, MID * 0.25 - 5, 18, 0, Math.PI * 2);
    ctx.fill();

    // City silhouette (top lane bg)
    ctx.fillStyle = "#0a1525";
    var buildings = [30, 70, 50, 90, 60, 40, 80, 55, 65, 45, 75];
    var bx = 0;
    for (var bi = 0; bi < buildings.length; bi++) {
      var bw = 40 + (bi % 3) * 20;
      var bh = buildings[bi] + (bi % 2) * 20;
      var bxo = (((bx - scrollX * 0.12) % W) + W) % W;
      ctx.fillRect(bxo, MID - bh - 10, bw - 2, bh);
      // Windows
      ctx.fillStyle = "rgba(255,220,80,0.5)";
      for (var wy = MID - bh; wy < MID - 20; wy += 14) {
        for (var wx2 = bxo + 6; wx2 < bxo + bw - 8; wx2 += 12) {
          if ((bi + wy + wx2) % 3 !== 0) {
            ctx.fillRect(wx2, wy, 6, 8);
          }
        }
      }
      ctx.fillStyle = "#0a1525";
      bx += bw + 10 + (bi % 4) * 15;
    }

    // ─── GROUND BASE (bottom half) ───
    var ground = ctx.createLinearGradient(0, MID, 0, H);
    ground.addColorStop(0, "#1a1a1a");
    ground.addColorStop(1, "#0a0a0a");
    ctx.fillStyle = ground;
    ctx.fillRect(0, MID, W, H - MID);

    // ─── LANE DIVIDER (center) ───
    // 3 pixel solid line at center
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, MID - 1.5, W, 3);

    // ─── ROAD MARKINGS (each lane) ───
    var dashW = 60,
      dashH = 6,
      dashGap = 40;
    var dashTotal = dashW + dashGap;
    var offsetX = (-scrollX * 1.5) % dashTotal;
    if (offsetX > 0) offsetX -= dashTotal;

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    // Enemy lane center line (at 25% vertical)
    var ey = MID * 0.5 - 4;
    // Player lane center line (at 75% vertical)
    var py = MID + (H - MID) * 0.5 - 4;

    for (var dx = offsetX; dx < W + dashW; dx += dashTotal) {
      ctx.fillRect(dx, ey, dashW, dashH);
      ctx.fillRect(dx, py, dashW, dashH);
    }

    // ─── ASPHALT TEXTURE ───
    // Subtle horizontal lines for texture
    for (var ty = MID + 10; ty < H; ty += 22) {
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(0, ty, W, 1);
    }
    for (var ty2 = 10; ty2 < MID - 10; ty2 += 22) {
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(0, ty2, W, 1);
    }

    // ─── FINISH LINE (at the right edge when close) ──
    // Handled in updateWorld
  }

  // ─────────────────────────────────────────
  //  EVENTS
  // ─────────────────────────────────────────
  attachEvents() {
    var self = this;
    document.getElementById("drag-btn-start").onclick = function (e) {
      e.target.blur();
      self.startCountdown();
    };
    document.getElementById("drag-btn-back").onclick = function () {
      self.hide();
      self.eventSystem.showScreen("garage");
    };
    document.getElementById("drag-res-back").onclick = function () {
      self.hide();
      self.eventSystem.showScreen("garage");
    };

    window.addEventListener("resize", function () {
      self.resizeCanvas();
    });
  }

  startCountdown() {
    var self = this;
    document.getElementById("drag-start").style.display = "none";
    var cd = document.getElementById("drag-countdown");
    var cdText = document.getElementById("drag-cd-text");
    cd.style.display = "flex";

    var seq = [
      { delay: 0, text: "3", color: "#e74c3c" },
      { delay: 900, text: "2", color: "#f1c40f" },
      { delay: 1800, text: "1", color: "#f1c40f" },
      { delay: 2700, text: "GO!", color: "#2ecc71" },
    ];
    seq.forEach(function (s) {
      setTimeout(function () {
        cdText.innerText = s.text;
        cdText.style.color = s.color;
        cdText.style.textShadow = "0 0 80px " + s.color;
      }, s.delay);
    });

    setTimeout(function () {
      cd.style.display = "none";
      self.player.gear = 1;
      self.player.rpm = 3000;
      self.startRace();
    }, 3500);
  }

  startRace() {
    this.gameState = "racing";
    this.lastTime = Date.now();
    this.animate();
  }

  animate() {
    if (this.gameState !== "racing") return;
    var now = Date.now();
    var dt = Math.min((now - this.lastTime) / 1000, 0.08);
    this.lastTime = now;
    this.raceTime += dt;

    // ── PLAYER PHYSICS ──
    var power =
      this.playerCar && this.playerCar.power ? this.playerCar.power : 200;
    var gears = [0, 3.2, 2.1, 1.45, 1.1, 0.88, 0.7];
    var gr = gears[this.player.gear] || 0;
    var force = this.player.gear > 0 ? (power / 10) * gr : 0;
    var drag =
      this.player.vel * 0.055 + this.player.vel * this.player.vel * 0.00045;
    this.player.vel = Math.max(0, this.player.vel + (force - drag) * dt);
    this.player.pos += this.player.vel * dt;

    var maxRpm = 9000;
    var trgRpm =
      this.player.gear === 0
        ? 900
        : Math.min(maxRpm + 400, this.player.vel * gr * 38);
    if (trgRpm > maxRpm) {
      this.player.rpm = maxRpm - Math.random() * 120;
    } else {
      this.player.rpm += (trgRpm - this.player.rpm) * dt * 12;
    }
    this.perfectShiftWindow =
      this.player.rpm >= 7500 && this.player.rpm <= 8700;

    // ── ENEMY PHYSICS ──
    var epwr = this.enemyCar ? this.enemyCar.power : 200;
    var eForce = Math.min(100, (epwr / 10) * 1.38);
    var eDrag =
      this.enemy.vel * 0.055 + this.enemy.vel * this.enemy.vel * 0.00045;
    this.enemy.vel = Math.max(0, this.enemy.vel + (eForce - eDrag) * dt);
    this.enemy.pos += this.enemy.vel * dt;

    // Finish check
    if (
      this.player.pos >= this.trackLength ||
      this.enemy.pos >= this.trackLength
    ) {
      this.finishRace();
      return;
    }

    this.updateUI();
    this.updateWorld();

    var self = this;
    this.animationId = requestAnimationFrame(function () {
      self.animate();
    });
  }

  updateUI() {
    var kmh = Math.floor(this.player.vel * 3.6);
    var el;
    el = document.getElementById("drag-spd");
    if (el) el.innerText = kmh;
    el = document.getElementById("drag-dist");
    if (el) el.innerText = Math.floor(this.player.pos);
    el = document.getElementById("drag-gear");
    if (el) el.innerText = this.player.gear || "N";

    // ── Progress bars ──
    var goal = this.trackLength;
    var pPct = Math.min(100, (this.player.pos / goal) * 100);
    var ePct = Math.min(100, (this.enemy.pos / goal) * 100);
    el = document.getElementById("drag-prog-player");
    if (el) el.style.width = pPct + "%";
    el = document.getElementById("drag-prog-enemy");
    if (el) el.style.width = ePct + "%";

    // ── Tachometer arc (stroke-dashoffset technique) ──
    var pct = Math.min(1, this.player.rpm / 9000);
    el = document.getElementById("drag-rpm-arc");
    if (el) {
      // On first call, measure total arc length and cache it
      if (!this._arcTotalLength) {
        this._arcTotalLength = el.getTotalLength() || 250;
        el.setAttribute("stroke-dasharray", this._arcTotalLength);
      }
      // Offset = total - filled portion (0% = fully offset = empty, 100% = no offset = full)
      var offset = this._arcTotalLength * (1 - pct);
      el.setAttribute("stroke-dashoffset", offset);
      el.setAttribute(
        "stroke",
        pct > 0.88 ? "#ff3300" : pct > 0.72 ? "#ffcc00" : "#ffffff",
      );
    }

    // ── Shift lights ──
    var rpmPct = this.player.rpm / 9000;
    var lights = [
      { id: "sl0", thr: 0.5, col: "#00cc44" },
      { id: "sl1", thr: 0.63, col: "#00cc44" },
      { id: "sl2", thr: 0.76, col: "#ffcc00" },
      { id: "sl3", thr: 0.88, col: "#ff5500" },
      { id: "sl4", thr: 0.96, col: "#ff0000" },
    ];
    for (var i = 0; i < lights.length; i++) {
      el = document.getElementById(lights[i].id);
      if (!el) continue;
      if (rpmPct >= lights[i].thr) {
        el.style.background = lights[i].col;
        el.style.boxShadow = "0 0 12px " + lights[i].col;
        el.style.borderColor = lights[i].col;
      } else {
        el.style.background = "#222";
        el.style.boxShadow = "none";
        el.style.borderColor = "#444";
      }
    }
  }

  updateWorld() {
    // Scroll background based on player speed
    var scrollX = this.player.pos * 8; // pixels of scroll per meter
    this.drawBackground(scrollX);

    // Draw finish line stripe if close
    this.drawFinishLineOverlay(scrollX);

    // ── Enemy car position ──
    // Enemy moves based on its position vs player position
    var gap = (this.enemy.pos - this.player.pos) * 8; // pixels ahead/behind
    var enemyEl = document.getElementById("drag-enemy");
    if (enemyEl) {
      var enemyLeft = 30 + gap; // base 30px from left + gap
      enemyEl.style.left =
        Math.max(-enemyEl.offsetWidth * 0.5, enemyLeft) + "px";
    }

    // ── Player car stays in lane, slight exhaust effect ──
    var playerEl = document.getElementById("drag-player");
    if (playerEl && this.player.vel > 5) {
      // High RPM = slight visual shake
      var shake = this.player.rpm > 8500 ? (Math.random() - 0.5) * 3 : 0;
      playerEl.style.transform =
        "translateY(calc(-50% + " + shake.toFixed(1) + "px))";
    }
  }

  drawFinishLineOverlay(scrollX) {
    var ctx = this.ctx;
    var W = this.canvas.width;
    var H = this.canvas.height;
    var MID = H / 2;

    // Finish line is at trackLength * 8 pixels from start
    var finishPixel = this.trackLength * 8 - scrollX;
    if (finishPixel > 0 && finishPixel < W + 50) {
      var squareSize = 20;
      for (var row = 0; row < Math.ceil(H / squareSize); row++) {
        for (var col = 0; col < 3; col++) {
          var isWhite = (row + col) % 2 === 0;
          ctx.fillStyle = isWhite ? "#ffffff" : "#000000";
          ctx.fillRect(
            finishPixel + col * squareSize,
            row * squareSize,
            squareSize,
            squareSize,
          );
        }
      }
    }
  }

  finishRace() {
    this.gameState = "finished";
    var win = this.player.pos >= this.enemy.pos;
    var reward = win ? 2500 : 500;
    var self = this;

    setTimeout(function () {
      var res = document.getElementById("drag-results");
      if (!res) return;
      res.style.display = "flex";

      var title = document.getElementById("drag-res-title");
      title.innerText = win ? "VITORIA!" : "DERROTA...";
      title.style.color = win ? "#2ecc71" : "#e74c3c";

      document.getElementById("drag-res-time").innerText =
        "Tempo: " +
        self.raceTime.toFixed(2) +
        "s   |   " +
        Math.floor(self.player.vel * 3.6) +
        " KM/H";

      var rewEl = document.getElementById("drag-res-reward");
      rewEl.innerText =
        (reward > 0 ? "+ " : "- ") + "$" + Math.abs(reward).toLocaleString();
      rewEl.style.color = win ? "#2ecc71" : "#aaa";

      if (window.profileManager && self.profile) {
        self.profile.cash += reward;
        window.profileManager.saveProfile(self.profile);
      }
    }, 1000);
  }

  stopRace() {
    this.gameState = "idle";
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.animationId = null;
  }
}

if (typeof window !== "undefined") {
  window.RaceScreen = RaceScreen;
  window.raceScreen = new RaceScreen(window.eventSystem);
}
