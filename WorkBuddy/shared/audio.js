/* ============================================================
 * WorkBuddy 共用音效库 —— 纯 WebAudio 合成，无任何外部音频素材
 * 用法：WB.sfx.play('click')  /  WB.sfx.tone(440, 0.1)
 * 所有音效由代码实时合成，不加载任何第三方版权资源。
 * ============================================================ */
(function (global) {
  'use strict';

  var ctx = null;          // AudioContext（首次交互时才创建，规避浏览器自动播放限制）
  var master = null;       // 总音量 GainNode
  var enabled = true;      // 静音开关

  function ensure() {
    if (!ctx) {
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.35;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /** 基础单音：type 波形，freq 频率，dur 时长，vol 音量，slideTo 滑音目标频率 */
  function tone(freq, dur, opt) {
    if (!enabled) return;
    var c = ensure(); if (!c) return;
    opt = opt || {};
    var t = c.currentTime;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = opt.type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    if (opt.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, opt.slideTo), t + dur);
    var vol = (opt.vol == null ? 0.5 : opt.vol);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.02, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  /** 噪声型打击音（用于消除、爆炸等） */
  function noise(dur, opt) {
    if (!enabled) return;
    var c = ensure(); if (!c) return;
    opt = opt || {};
    var rate = c.sampleRate;
    var len = Math.max(1, Math.floor(rate * dur));
    var buf = c.createBuffer(1, len, rate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = c.createBufferSource(); src.buffer = buf;
    var f = c.createBiquadFilter();
    f.type = opt.filter || 'bandpass';
    f.frequency.value = opt.freq || 900;
    var g = c.createGain(); g.gain.value = opt.vol == null ? 0.35 : opt.vol;
    src.connect(f); f.connect(g); g.connect(master);
    src.start();
  }

  // ---- 预置音效表 ----
  var PRESET = {
    click:    function () { tone(660, 0.06, { type: 'square',   vol: 0.18 }); },
    tap:      function () { tone(880, 0.05, { type: 'triangle', vol: 0.22 }); },
    move:     function () { tone(420, 0.07, { type: 'sine',     vol: 0.20 }); },
    merge:    function () { tone(520, 0.14, { type: 'triangle', vol: 0.28, slideTo: 780 }); },
    pop:      function () { tone(700, 0.09, { type: 'sine',     vol: 0.25, slideTo: 1200 }); },
    drop:     function () { tone(300, 0.12, { type: 'sine',     vol: 0.25, slideTo: 150 }); },
    clear:    function () { noise(0.22, { freq: 1400, vol: 0.25 }); tone(880, 0.16, { type: 'triangle', vol: 0.22, slideTo: 1320 }); },
    combo:    function (n) { var b = 520 + Math.min(n, 8) * 70; tone(b, 0.16, { type: 'square', vol: 0.20, slideTo: b * 1.5 }); },
    error:    function () { tone(180, 0.16, { type: 'sawtooth', vol: 0.18, slideTo: 120 }); },
    win:      function () {[0, 1, 2, 3].forEach(function (i) { setTimeout(function () { tone([523, 659, 784, 1047][i], 0.22, { type: 'triangle', vol: 0.26 }); }, i * 110); }); },
    lose:     function () {[0, 1, 2].forEach(function (i) { setTimeout(function () { tone([392, 330, 262][i], 0.28, { type: 'sine', vol: 0.24 }); }, i * 150); }); },
    start:    function () { tone(520, 0.12, { type: 'triangle', vol: 0.22, slideTo: 900 }); },
    undo:     function () { tone(400, 0.10, { type: 'sine', vol: 0.18, slideTo: 260 }); },
    shoot:    function () { tone(1200, 0.08, { type: 'square', vol: 0.14, slideTo: 500 }); },
    tick:     function () { tone(1000, 0.03, { type: 'square', vol: 0.10 }); }
  };

  var sfx = {
    /** 播放预置音效 */
    play: function (name, arg) {
      try { var f = PRESET[name]; if (f) f(arg); } catch (e) { /* 音频不可用时静默降级 */ }
    },
    tone: function (freq, dur, opt) { try { tone(freq, dur, opt); } catch (e) {} },
    noise: function (dur, opt) { try { noise(dur, opt); } catch (e) {} },
    /** 静音开关，返回切换后的状态 */
    toggle: function () { enabled = !enabled; return enabled; },
    setEnabled: function (v) { enabled = !!v; },
    isEnabled: function () { return enabled; },
    /** 首次用户交互时调用，解锁 AudioContext */
    unlock: function () { ensure(); }
  };

  global.WB = global.WB || {};
  global.WB.sfx = sfx;

  // 任意一次点击/触摸都尝试解锁音频上下文
  ['pointerdown', 'keydown'].forEach(function (ev) {
    global.addEventListener && global.addEventListener(ev, function once() {
      ensure();
      global.removeEventListener(ev, once);
    }, { once: true });
  });
})(window);
