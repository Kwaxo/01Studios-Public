// ==UserScript==
// @name         01 Studios
// @namespace    01studios
// @version      1.0.0
// @description  01 Studios, Predictor
// @author       01Studios
// @match        https://bloxflip.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      bloxflip.com
// @connect      api.bloxflip.com
// @connect      rest-bf.blox.land
// @connect      blox.land
// @connect      ohoiapyzmyggkxpayvpi.supabase.co
// @connect      supabase.co
// @connect      api.01studiosecurity.xyz
// @connect      01studiosecurity.xyz
// @connect      discord.com
// @connect      *
// @run-at       document-end
// ==/UserScript==

(function () {
 'use strict';
GM_addStyle(`
/* Nav Hover Effects */
#_01studios_nav_bar button {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}
#_01studios_nav_bar button:hover {
    transform: translateY(-4px) scale(1.08) !important;
}
#nav_home:hover { background: rgba(255, 255, 255, 0.15) !important; border-color: #888 !important; box-shadow: 0 0 25px rgba(136, 136, 136, 0.5) !important; }
#nav_predictor:hover { background: rgba(0, 255, 136, 0.15) !important; border-color: #00ff88 !important; box-shadow: 0 0 25px rgba(0, 255, 136, 0.5) !important; }
#nav_settings:hover { background: rgba(255, 255, 255, 0.15) !important; border-color: #888 !important; box-shadow: 0 0 25px rgba(136, 136, 136, 0.5) !important; }

/* Predictor Map Tile Hover Effects */
._01studios_tile_hover {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
._01studios_tile_hover:hover {
    transform: scale(1.12) !important;
    filter: brightness(1.6) contrast(1.1) !important;
    z-index: 100 !important;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.25) !important;
    cursor: pointer !important;
}
`);
 var _01_KEY = 'free_user';
 var _01_HWID = 'free_user';
 var _01_predictorReady = true;
 var _01_predictorLaunched = false;
 var _01_LOADER_FONT = "'Inter', 'Segoe UI', system-ui, sans-serif";
var _01_LOGO = 'https://raw.githubusercontent.com/Kwaxo/01Studios-Public/refs/heads/main/lOGO.png';
 var _01_DISCORD = 'https://discord.gg/01studios';

 const VERSION = '5.2.4';
 var _01_autoClick = false;
 var _01_autoCash = false;
 var _01_autoStart = false;
 var _01_autoPredict = false; 
var _autoPredictFired = false; 
var _predictCount = 0; 

function _01_setPredictLabel() {
  try {
    var b = document.getElementById('_01studios_predict_btn');
    if (!b) return;
    if (_predictCount <= 0) { b.textContent = 'PREDICT'; b.title = 'Predict'; }
    else { b.textContent = 'RE-PREDICT (x' + (_predictCount + 1) + ')'; b.title = 'Re-predict'; }
  } catch (e) {}
}

const SUPABASE_CONFIG = {
  URL: 'https://ohoiapyzmyggkxpayvpi.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ob2lhcHl6bXlnZ2t4cGF5dnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NTk2ODcsImV4cCI6MjA4OTIzNTY4N30.yD09v_rNZ9x0ku13VlVKWDDkG24m5xrFnMXDZK6GxUI',
  TABLE_NAME: 'users'
};

const VERIFY_CONFIG = {
  VERIFY_API: 'https://api.01studiosecurity.xyz/api',   
  DISCORD_OAUTH_URL: 'https://api.01studiosecurity.xyz/auth/discord',  
  REQUIRE_DISCORD: true,
  REQUIRE_BLOXFLIP: false
};

let _01_loaderState = {
  isVerified: false,
  username: null,
  key: null,
  hwid: null,
  discordId: null,
  discordUsername: null,
  discordAvatar: null,
  bloxId: null,
  bloxUsername: null
};

function generateHWID() {
  try {
    const stored = localStorage.getItem('_01_hwid');
    if (stored && stored.length === 16) return stored;

    const parts = [];
    try { parts.push(navigator.userAgent || ''); } catch (e) {}
    try { parts.push(navigator.language || ''); } catch (e) {}
    try { parts.push((navigator.languages || []).join(',')); } catch (e) {}
    try { parts.push(navigator.platform || ''); } catch (e) {}
    try { parts.push(String(navigator.hardwareConcurrency || '')); } catch (e) {}
    try { parts.push(String(navigator.deviceMemory || '')); } catch (e) {}
    try { parts.push(screen.width + 'x' + screen.height + 'x' + screen.colorDepth); } catch (e) {}
    try { parts.push(String(new Date().getTimezoneOffset())); } catch (e) {}
    try { parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || ''); } catch (e) {}

    try {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = "14px 'Arial'";
        ctx.fillStyle = '#f60'; ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069'; ctx.fillText('01studios_hwid', 2, 15);
        ctx.fillStyle = 'rgba(102,204,0,0.7)'; ctx.fillText('01studios_hwid', 4, 17);
        parts.push(c.toDataURL());
      }
    } catch (e) {}

    try {
      const gl = document.createElement('canvas').getContext('webgl');
      if (gl) {
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        if (dbg) {
          parts.push(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || '');
          parts.push(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
        }
      }
    } catch (e) {}

    const hwid = _hwidHash(parts.join('|'));
    localStorage.setItem('_01_hwid', hwid);
    return hwid;
  } catch (e) {
    
    let fb = localStorage.getItem('_01_hwid_fb');
    if (!fb) { fb = _hwidHash(String(Math.random()) + Date.now()); localStorage.setItem('_01_hwid_fb', fb); }
    return fb;
  }
}

function _hwidHash(str) {
  let h1 = 0x811c9dc5, h2 = 0x1000193;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 ^= c; h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 = (h2 + c) >>> 0; h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
    h2 ^= h2 >>> 13;
  }
  const hex = (n) => ('00000000' + (n >>> 0).toString(16)).slice(-8);
  return (hex(h1) + hex(h2)).slice(0, 16);
}

function checkRateLimit(hwid) {
  const key = `_01_rate_limit_${hwid}`;
  const stored = localStorage.getItem(key);

  const RATE_LIMIT_WINDOW = 10 * 60 * 1000; 
  const MAX_ATTEMPTS = 20;

  if (!stored) {
    localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: Date.now() }));
    return true;
  }

  let data;
  try { data = JSON.parse(stored); } catch (e) { data = { count: 0, timestamp: Date.now() }; }
  const now = Date.now();

  if (now - data.timestamp > RATE_LIMIT_WINDOW) {
    localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: now }));
    return true;
  }

  if (data.count >= MAX_ATTEMPTS) {
    return false;
  }

  data.count++;
  localStorage.setItem(key, JSON.stringify(data));
  return true;
}

function clearRateLimit(hwid) {
  try { localStorage.removeItem(`_01_rate_limit_${hwid}`); } catch (e) {}
}

function _01_request(opts) {
  return new Promise((resolve, reject) => {
    if (typeof GM_xmlhttpRequest !== 'undefined') {
      GM_xmlhttpRequest({
        method: opts.method || 'GET',
        url: opts.url,
        headers: opts.headers || {},
        data: opts.body || null,
        onload: (r) => resolve({ ok: r.status >= 200 && r.status < 300, status: r.status, text: r.responseText }),
        onerror: () => reject(new Error('Request failed')),
        ontimeout: () => reject(new Error('Request timed out'))
      });
    } else {
      fetch(opts.url, { method: opts.method || 'GET', headers: opts.headers || {}, body: opts.body || undefined })
        .then(async (res) => resolve({ ok: res.ok, status: res.status, text: await res.text() }))
        .catch(reject);
    }
  });
}

async function validateKey(key, hwid) {
  
  try {
    if (!checkRateLimit(hwid)) {
      return { valid: false, error: 'RATE_LIMITED', message: 'Too many verification attempts. Try again later.' };
    }
    if (!VERIFY_CONFIG.VERIFY_API) {
      return { valid: false, error: 'SERVER_ERROR', message: 'Verify backend not configured' };
    }

    const response = await _01_request({
      method: 'POST',
      url: VERIFY_CONFIG.VERIFY_API + '/verify',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: key, hwid: hwid })
    });

    let data;
    try { data = JSON.parse(response.text); } catch (e) { data = null; }

    if (!data) {
      return { valid: false, error: 'SERVER_ERROR', message: 'Server error during validation' };
    }

    if (data.ok) {
      clearRateLimit(hwid);
      
      return {
        valid: true,
        key: {
          assigned_username: data.username || null,
          status: 'active',
          duration: data.duration || null,
          expires_at: data.expiresAt || null,
          discord_id: data.discord ? data.discord.id : null,
          discord_username: data.discord ? data.discord.username : null,
          discord_avatar: data.discord ? data.discord.avatar : null,
          blox_id: data.bloxflip ? data.bloxflip.id : null,
          blox_username: data.bloxflip ? data.bloxflip.username : null
        },
        message: 'Key valid.'
      };
    }

    const map = {
      NO_KEY: 'KEY_NOT_FOUND',
      INVALID_KEY: 'KEY_NOT_FOUND',
      EXPIRED: 'KEY_EXPIRED',
      REVOKED: 'KEY_REVOKED',
      HWID_MISMATCH: 'HWID_MISMATCH'
    };
    return {
      valid: false,
      error: map[data.error] || 'SERVER_ERROR',
      message: data.error || 'Invalid key'
    };
  } catch (e) {
    console.error('Key validation error:', e);
    return { valid: false, error: 'SERVER_ERROR', message: 'Server error during validation' };
  }
}

function detectBloxflipUser() {
  
  if (window._bloxflipUser && window._bloxflipUser.id) {
    return { id: String(window._bloxflipUser.id), username: window._bloxflipUser.username || '' };
  }
  
  try {
    const nd = window.__NEXT_DATA__;
    if (nd?.props?.pageProps?.user) {
      const u = nd.props.pageProps.user;
      if (u.id || u._id) return { id: String(u.id || u._id), username: u.robloxUsername || u.username || u.name || '' };
    }
  } catch (e) {}
  
  try {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u && (u.id || u._id)) return { id: String(u.id || u._id), username: u.robloxUsername || u.username || '' };
    }
  } catch (e) {}
  return null;
}

function getBloxflipToken() {
  
  try {
    const keys = ['app.rt', 'token', 'auth-token', 'authToken', 'x-auth-token'];
    for (const k of keys) {
      const v = localStorage.getItem(k) || sessionStorage.getItem(k);
      if (v && v.length > 10) return v.replace(/^"|"$/g, '');
    }
  } catch (e) {}
  
  try {
    const m = document.cookie.match(/(?:^|;\s*)app\.rt=([^;]+)/);
    if (m && m[1]) return decodeURIComponent(m[1]);
  } catch (e) {}
  
  try {
    const saved = localStorage.getItem('_01_bf_token');
    if (saved && saved.length > 10) return saved;
  } catch (e) {}
  return null;
}

function fetchBloxflipUser(tokenOverride) {
  return new Promise((resolve) => {
    if (typeof GM_xmlhttpRequest === 'undefined') { resolve(null); return; }
    const token = tokenOverride || getBloxflipToken();

    const endpoints = [
      'https://api.bloxflip.com/user',
      'https://rest-bf.blox.land/user',
      'https://bloxflip.com/api/user'
    ];

    function tryNext(i) {
      if (i >= endpoints.length) { resolve(null); return; }
      const headers = { 'Content-Type': 'application/json' };
      if (token) { headers['x-auth-token'] = token; }
      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url: endpoints[i],
          headers: headers,
          withCredentials: true,   
          onload: function(r) {
            try {
              const d = JSON.parse(r.responseText);
              const u = d && (d.user || d);
              if (u && (u.id || u._id)) {
                const info = { id: String(u.id || u._id), username: u.robloxUsername || u.username || '', wallet: u.wallet };
                window._bloxflipUser = info;
                if (token) { try { localStorage.setItem('_01_bf_token', token); } catch (e) {} }
                resolve(info); return;
              }
            } catch (e) {}
            tryNext(i + 1);
          },
          onerror: function() { tryNext(i + 1); },
          ontimeout: function() { tryNext(i + 1); }
        });
      } catch (e) { tryNext(i + 1); }
    }
    tryNext(0);
  });
}

async function submitVerifyLink(payload) {
  if (!VERIFY_CONFIG.VERIFY_API) return { ok: false, error: 'Verify backend not configured' };
  try {
    const res = await fetch(VERIFY_CONFIG.VERIFY_API + '/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data && data.success !== false) return { ok: true, data };
    return { ok: false, error: (data && data.error) || ('Server returned ' + res.status) };
  } catch (e) {
    return { ok: false, error: 'Network error contacting verify server' };
  }
}

function createLoaderPanel() {
  const panel = document.createElement('div');
  panel.id = '_01_loader_panel';
  panel.style.cssText = [
    'position:fixed','inset:0','width:100%','height:100%',
    'background:radial-gradient(ellipse at 50% 40%, rgba(20,22,30,0.92) 0%, rgba(6,7,10,0.97) 70%)',
    'display:flex','align-items:center','justify-content:center',
    'z-index:2147483647','backdrop-filter:blur(8px)','-webkit-backdrop-filter:blur(8px)',
    'opacity:0','transition:opacity 0.4s ease'
  ].join(';');

  panel.innerHTML = `
    <style>
      @keyframes _01l_cardin {
        0% { opacity:0; transform:translateY(24px) scale(0.96); }
        100% { opacity:1; transform:translateY(0) scale(1); }
      }
      @keyframes _01l_glow {
        0%,100% { box-shadow:0 24px 70px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px rgba(0,201,122,0.04); }
        50% { box-shadow:0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,201,122,0.10), 0 0 60px rgba(0,201,122,0.10); }
      }
      @keyframes _01l_shimmer { 0% { background-position:-300px 0; } 100% { background-position:300px 0; } }
      @keyframes _01l_orb {
        0%,100% { transform:translate(0,0) scale(1); opacity:0.5; }
        50% { transform:translate(30px,-20px) scale(1.15); opacity:0.8; }
      }
      @keyframes _01l_orb2 {
        0%,100% { transform:translate(0,0) scale(1); opacity:0.4; }
        50% { transform:translate(-26px,24px) scale(1.2); opacity:0.65; }
      }
      @keyframes _01l_spin { to { transform:rotate(360deg); } }
      @keyframes _01l_logospin { to { transform:rotate(360deg); } }
      #_01l_card * { box-sizing:border-box; }
      ._01l_input {
        width:100%; padding:13px 15px; background:rgba(255,255,255,0.03);
        border:1px solid rgba(255,255,255,0.10); border-radius:11px; color:#fff;
        font-size:13px; outline:none; transition:border-color 0.25s, background 0.25s, box-shadow 0.25s;
        font-family:'Segoe UI',system-ui,sans-serif; letter-spacing:0.4px;
      }
    </style>

    <!-- floating orbs -->
    <div style="position:absolute;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle, rgba(0,201,122,0.10), transparent 70%);top:18%;left:24%;filter:blur(40px);animation:_01l_orb 9s ease-in-out infinite;pointer-events:none;"></div>
    <div style="position:absolute;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle, rgba(79,195,247,0.08), transparent 70%);bottom:14%;right:22%;filter:blur(50px);animation:_01l_orb2 11s ease-in-out infinite;pointer-events:none;"></div>

    <div id="_01l_card" style="
      position:relative; z-index:2; width:90%; max-width:400px;
      background:linear-gradient(180deg, rgba(18,18,22,0.85) 0%, rgba(10,10,12,0.9) 100%);
      backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
      border:1px solid rgba(255,255,255,0.06); border-radius:22px;
      padding:40px 36px;
      animation:_01l_cardin 0.55s cubic-bezier(0.22,1,0.36,1), _01l_glow 5s ease-in-out infinite 0.55s;
      font-family:'Segoe UI',system-ui,sans-serif;
    ">
      <div style="text-align:center;margin-bottom:34px;">
        <div style="display:flex;align-items:center;justify-content:center;margin-bottom:18px;">
          <img id="_01l_logo" src="${_01_LOGO}" style="width:58px;height:58px;border-radius:50%;object-fit:cover;box-shadow:0 0 24px rgba(0,201,122,0.25);border:1.5px solid rgba(0,201,122,0.3);transition:transform 0.5s ease;">
        </div>
        <div style="font-size:24px;font-weight:900;color:#fff;letter-spacing:3px;text-transform:uppercase;">01 STUDIOS</div>
        <div style="height:2px;width:64px;margin:14px auto;border-radius:1px;background:linear-gradient(90deg,transparent,rgba(0,201,122,0.7),transparent);background-size:300px 100%;animation:_01l_shimmer 2.5s linear infinite;"></div>
        <div style="color:#666;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Authentication</div>
      </div>
      <div id="_01_loader_content"></div>
    </div>
  `;

  document.body.appendChild(panel);
  requestAnimationFrame(() => { panel.style.opacity = '1'; });

  const style = document.createElement('style');
  style.id = '_01_loader_hide_style';
  style.textContent = '#_01studios_nav_bar{display:none !important;} #_01studios_panel{display:none !important;}';
  document.head.appendChild(style);
  window._01_loaderHideStyle = style;

  const logo = document.getElementById('_01l_logo');
  if (logo) {
    logo.addEventListener('mouseenter', () => { logo.style.transform = 'rotate(360deg) scale(1.08)'; });
    logo.addEventListener('mouseleave', () => { logo.style.transform = 'rotate(0deg) scale(1)'; });
  }

  return panel;
}

function showVerificationForm() {
  const content = document.getElementById('_01_loader_content');
  const FOCUS = '#00c97a';

  content.innerHTML = `
    <div>
      <div style="margin-bottom:16px;">
        <label style="color:#888;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;display:block;margin-bottom:8px;font-weight:600;">Username</label>
        <input id="_01_username_input" type="text" placeholder="Enter your username" class="_01l_input" autocomplete="off" spellcheck="false">
      </div>

      <div style="margin-bottom:14px;">
        <label style="color:#888;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;display:block;margin-bottom:8px;font-weight:600;">Access Key</label>
        <div style="position:relative;">
          <input id="_01_key_input" type="password" placeholder="Enter your key" class="_01l_input" style="padding-right:42px;" autocomplete="off" spellcheck="false">
          <button id="_01_key_toggle" type="button" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:#555;cursor:pointer;font-size:11px;padding:4px 8px;font-weight:700;letter-spacing:0.5px;">SHOW</button>
        </div>
      </div>

      <div id="_01_error_msg" style="color:#ff6b6b;font-size:11px;margin-bottom:14px;text-align:center;min-height:15px;font-weight:500;transition:opacity 0.2s;"></div>

      <label style="display:flex;align-items:center;gap:8px;margin-bottom:20px;cursor:pointer;user-select:none;">
        <input id="_01_remember_me" type="checkbox" style="width:15px;height:15px;cursor:pointer;accent-color:${FOCUS};">
        <span style="color:#888;font-size:11px;">Remember me</span>
      </label>

      <button id="_01_verify_btn" style="
        width:100%;padding:14px;background:linear-gradient(135deg,#00c97a,#00a866);border:none;border-radius:11px;
        color:#001a10;font-weight:800;font-size:11px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;
        transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s,opacity 0.2s;
        box-shadow:0 8px 24px rgba(0,201,122,0.25);display:flex;align-items:center;justify-content:center;gap:8px;
      ">
        <span id="_01_verify_label">Verify Access</span>
      </button>

      <div style="text-align:center;margin-top:20px;font-size:8px;color:#444;letter-spacing:1.5px;text-transform:uppercase;">
        Secure verification &bull; HWID locked
      </div>
    </div>
  `;

  const usernameInput = document.getElementById('_01_username_input');
  const keyInput = document.getElementById('_01_key_input');
  const verifyBtn = document.getElementById('_01_verify_btn');
  const errEl = document.getElementById('_01_error_msg');
  const FOCUS_C = '#00c97a';

  [usernameInput, keyInput].forEach(inp => {
    inp.addEventListener('focus', () => {
      inp.style.borderColor = FOCUS_C;
      inp.style.background = 'rgba(0,201,122,0.04)';
      inp.style.boxShadow = '0 0 0 3px rgba(0,201,122,0.08)';
    });
    inp.addEventListener('blur', () => {
      inp.style.borderColor = 'rgba(255,255,255,0.10)';
      inp.style.background = 'rgba(255,255,255,0.03)';
      inp.style.boxShadow = 'none';
    });
  });

  const keyToggle = document.getElementById('_01_key_toggle');
  keyToggle.addEventListener('click', () => {
    if (keyInput.type === 'password') { keyInput.type = 'text'; keyToggle.textContent = 'HIDE'; }
    else { keyInput.type = 'password'; keyToggle.textContent = 'SHOW'; }
  });

  verifyBtn.addEventListener('mouseenter', () => {
    if (verifyBtn.disabled) return;
    verifyBtn.style.transform = 'translateY(-2px)';
    verifyBtn.style.boxShadow = '0 12px 32px rgba(0,201,122,0.35)';
  });
  verifyBtn.addEventListener('mouseleave', () => {
    verifyBtn.style.transform = 'translateY(0)';
    verifyBtn.style.boxShadow = '0 8px 24px rgba(0,201,122,0.25)';
  });

  function showError(msg) {
    errEl.textContent = msg;
    errEl.style.opacity = '1';
    
    const card = document.getElementById('_01l_card');
    if (card) {
      card.animate([
        { transform:'translateX(0)' }, { transform:'translateX(-8px)' },
        { transform:'translateX(8px)' }, { transform:'translateX(-5px)' },
        { transform:'translateX(5px)' }, { transform:'translateX(0)' }
      ], { duration:380, easing:'ease-in-out' });
    }
  }

  async function doVerify() {
    const key = keyInput.value.trim();
    if (!key) { showError('Please enter your access key'); return; }
    errEl.textContent = '';

    const label = document.getElementById('_01_verify_label');
    verifyBtn.disabled = true;
    verifyBtn.style.opacity = '0.7';
    verifyBtn.style.cursor = 'default';
    verifyBtn.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(0,26,16,0.3);border-top-color:#001a10;border-radius:50%;animation:_01l_spin 0.7s linear infinite;"></span><span style="letter-spacing:1px;">Verifying</span>';

    const hwid = generateHWID();
    let result;
    try { result = await validateKey(key, hwid); }
    catch (e) { result = { valid:false, message:'Connection error. Try again.' }; }

    if (result.valid) {
      _01_loaderState.username = result.key?.assigned_username || usernameInput.value.trim() || 'User';
      _01_loaderState.key = key;
      _01_loaderState.hwid = hwid;
      _01_KEY = key; _01_HWID = hwid;
      
      if (result.key?.discord_id) {
        _01_loaderState.discordId = result.key.discord_id;
        _01_loaderState.discordUsername = result.key.discord_username;
        _01_loaderState.discordAvatar = result.key.discord_avatar;
      }
      if (result.key?.blox_id) {
        _01_loaderState.bloxId = result.key.blox_id;
        _01_loaderState.bloxUsername = result.key.blox_username;
      }
      verifyBtn.innerHTML = '<span style="letter-spacing:1px;">&check; Key valid</span>';
      verifyBtn.style.background = 'linear-gradient(135deg,#00c97a,#00a866)';

      const discordSatisfied = !VERIFY_CONFIG.REQUIRE_DISCORD || !!_01_loaderState.discordId;
      const bloxSatisfied = !VERIFY_CONFIG.REQUIRE_BLOXFLIP || !!_01_loaderState.bloxId;
      const needsLink = !discordSatisfied || !bloxSatisfied;
      if (needsLink) {
        setTimeout(showLinkStep, 450);
      } else {
        _01_loaderState.isVerified = true;
        localStorage.setItem('_01_verified', JSON.stringify({
          username:_01_loaderState.username, key:key, hwid:hwid,
          discordId:_01_loaderState.discordId, discordUsername:_01_loaderState.discordUsername,
          discordAvatar:_01_loaderState.discordAvatar,
          bloxId:_01_loaderState.bloxId, bloxUsername:_01_loaderState.bloxUsername
        }));
        setTimeout(closeLoader, 600);
      }
      return;
    }

    const msgs = {
      HWID_MISMATCH: 'Key locked to another device. Open a Discord ticket for an HWID reset.',
      RATE_LIMITED: result.message || 'Too many attempts. Try again later.',
      KEY_EXPIRED: 'This key has expired.',
      KEY_REVOKED: 'This key has been revoked.',
      KEY_NOT_FOUND: 'Key not found. Check and try again.'
    };
    showError(msgs[result.error] || result.message || 'Invalid key');
    verifyBtn.disabled = false;
    verifyBtn.style.opacity = '1';
    verifyBtn.style.cursor = 'pointer';
    verifyBtn.innerHTML = '<span id="_01_verify_label">Verify Access</span>';
  }

  verifyBtn.addEventListener('click', doVerify);
  keyInput.addEventListener('keypress', e => { if (e.key === 'Enter') doVerify(); });
  usernameInput.addEventListener('keypress', e => { if (e.key === 'Enter') keyInput.focus(); });

  const rememberCheckbox = document.getElementById('_01_remember_me');
  const saved = localStorage.getItem('_01_remember_me');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      usernameInput.value = data.username || '';
      keyInput.value = data.key || '';
      rememberCheckbox.checked = true;
    } catch (e) {}
  }
  function persist() {
    if (rememberCheckbox.checked) {
      localStorage.setItem('_01_remember_me', JSON.stringify({ username:usernameInput.value, key:keyInput.value }));
    } else {
      localStorage.removeItem('_01_remember_me');
    }
  }
  rememberCheckbox.addEventListener('change', persist);
  usernameInput.addEventListener('input', persist);
  keyInput.addEventListener('input', persist);
}

function showLinkStep() {
  const content = document.getElementById('_01_loader_content');
  if (!content) return;

  let blox = detectBloxflipUser();
  let _bloxPoll = null;
  let _gaveUp = false;       

  let discord = (_01_loaderState.discordId) ? {
    id: _01_loaderState.discordId,
    username: _01_loaderState.discordUsername,
    avatar: _01_loaderState.discordAvatar
  } : null;
  let _dcPoll = null;
  let _dcWindow = null;

  function startDiscordPolling() {
    if (_dcPoll) return;
    let tries = 0;
    _dcPoll = setInterval(async () => {
      tries++;
      try {
        const res = await fetch(VERIFY_CONFIG.VERIFY_API + '/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: _01_loaderState.key })
        });
        const data = await res.json().catch(() => ({}));
        if (data && data.linked) {
          discord = { id: data.discordId, username: data.discordUsername, avatar: data.discordAvatar };
          _01_loaderState.discordId = data.discordId;
          _01_loaderState.discordUsername = data.discordUsername;
          _01_loaderState.discordAvatar = data.discordAvatar;
          clearInterval(_dcPoll); _dcPoll = null;
          if (_dcWindow && !_dcWindow.closed) { try { _dcWindow.close(); } catch (e) {} }
          render();
        }
      } catch (e) {}
      if (tries >= 150) { clearInterval(_dcPoll); _dcPoll = null; }  
    }, 2000);
  }

  function openDiscordLink() {
    const url = VERIFY_CONFIG.DISCORD_OAUTH_URL
      + '?key=' + encodeURIComponent(_01_loaderState.key)
      + '&hwid=' + encodeURIComponent(_01_loaderState.hwid || '');
    _dcWindow = window.open(url, '_01_discord_link', 'width=500,height=750');
    startDiscordPolling();
  }

  
  (async () => {
    if (!VERIFY_CONFIG.REQUIRE_BLOXFLIP) return;
    if (!blox) {
      const found = await fetchBloxflipUser();
      if (found) {
        blox = found;
        _01_loaderState.bloxId = found.id;
        _01_loaderState.bloxUsername = found.username;
        if (_bloxPoll) { clearInterval(_bloxPoll); _bloxPoll = null; }
        render();
      }
    }
  })();

  function startBloxPolling() {
    if (_bloxPoll) return;
    let tries = 0;
    _bloxPoll = setInterval(async () => {
      tries++;
      let found = detectBloxflipUser();
      if (!found) { found = await fetchBloxflipUser(); }
      if (found) {
        blox = found;
        _01_loaderState.bloxId = found.id;
        _01_loaderState.bloxUsername = found.username;
        clearInterval(_bloxPoll); _bloxPoll = null;
        render();
      } else if (tries >= 6) {
        clearInterval(_bloxPoll); _bloxPoll = null;
        _gaveUp = true;
        render();
      }
    }, 1000);
  }

  function finishVerify() {
    if (blox) { _01_loaderState.bloxId = blox.id; _01_loaderState.bloxUsername = blox.username; }
    if (discord) {
      _01_loaderState.discordId = discord.id;
      _01_loaderState.discordUsername = discord.username;
      _01_loaderState.discordAvatar = discord.avatar;
    }
    _01_loaderState.isVerified = true;
    localStorage.setItem('_01_verified', JSON.stringify({
      username: _01_loaderState.username,
      key: _01_loaderState.key,
      hwid: _01_loaderState.hwid,
      bloxId: _01_loaderState.bloxId,
      bloxUsername: _01_loaderState.bloxUsername,
      discordId: _01_loaderState.discordId,
      discordUsername: _01_loaderState.discordUsername,
      discordAvatar: _01_loaderState.discordAvatar
    }));
    if (_dcPoll) { clearInterval(_dcPoll); _dcPoll = null; }
  }

  function render() {
    
    const bloxOk = !!blox || !VERIFY_CONFIG.REQUIRE_BLOXFLIP || _gaveUp;
    const discordOk = !!discord || !VERIFY_CONFIG.REQUIRE_DISCORD;
    const ready = bloxOk && discordOk;

    let discordCard = '';
    if (VERIFY_CONFIG.REQUIRE_DISCORD) {
      if (discord) {
        const av = (discord.id && discord.avatar)
          ? `https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.${discord.avatar.startsWith('a_') ? 'gif' : 'png'}?size=64`
          : null;
        const avHtml = av
          ? `<img src="${av}" referrerpolicy="no-referrer" style="width:34px;height:34px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
          : `<div style="width:34px;height:34px;border-radius:50%;background:rgba(88,101,242,0.2);display:flex;align-items:center;justify-content:center;color:#aab2ff;font-weight:800;font-size:15px;flex-shrink:0;">${(discord.username||'D').slice(0,1).toUpperCase()}</div>`;
        discordCard = `<div style="display:flex;align-items:center;gap:11px;background:rgba(0,201,122,0.06);border:1px solid rgba(0,201,122,0.25);border-radius:11px;padding:11px 13px;">
                         ${avHtml}
                         <div style="min-width:0;flex:1;">
                           <div style="color:#888;font-size:9px;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:3px;">Discord Account</div>
                           <div style="color:#fff;font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${discord.username || discord.id}</div>
                         </div>
                         <span style="color:#00c97a;font-size:18px;flex-shrink:0;">&check;</span>
                       </div>`;
      } else {
        discordCard = `<div style="background:rgba(88,101,242,0.06);border:1px solid rgba(88,101,242,0.3);border-radius:11px;padding:14px 15px;text-align:center;">
                         <div style="color:#aab2ff;font-size:11px;font-weight:700;margin-bottom:3px;">Link your Discord</div>
                         <div style="color:#888;font-size:9px;line-height:1.4;margin-bottom:10px;">Verify your Discord account to continue.</div>
                         <button id="_01_dc_link" style="width:100%;padding:10px;background:linear-gradient(135deg,#5865F2,#4752c4);border:none;color:#fff;border-radius:8px;cursor:pointer;font-size:10px;font-weight:800;letter-spacing:0.5px;display:flex;align-items:center;justify-content:center;gap:7px;">
                           <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M20.317 4.369a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 00-5.487 0 12.6 12.6 0 00-.617-1.25.077.077 0 00-.079-.036A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.1 13.1 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.009c.12.099.246.198.373.292a.077.077 0 01-.006.127c-.598.349-1.22.645-1.873.892a.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.029 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.056c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                           Link Discord
                         </button>
                       </div>`;
      }
    }

    let middle;
    if (blox) {
      middle = `<div style="display:flex;align-items:center;justify-content:space-between;background:rgba(0,201,122,0.06);border:1px solid rgba(0,201,122,0.25);border-radius:11px;padding:13px 15px;">
                 <div style="min-width:0;">
                   <div style="color:#888;font-size:9px;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:3px;">BloxFlip Account</div>
                   <div style="color:#fff;font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;">${blox.username || blox.id}</div>
                 </div>
                 <span style="color:#00c97a;font-size:18px;flex-shrink:0;">&check;</span>
               </div>`;
    } else if (_gaveUp) {
      middle = `<div style="background:rgba(245,197,24,0.06);border:1px solid rgba(245,197,24,0.25);border-radius:11px;padding:14px 15px;text-align:center;">
                 <div style="color:#f5c518;font-size:11px;font-weight:700;margin-bottom:3px;">Couldn't auto-detect your account</div>
                 <div style="color:#888;font-size:9px;line-height:1.4;margin-bottom:10px;">Paste your BloxFlip token to link it, or just continue.</div>
                 <input id="_01_bf_token_input" type="password" placeholder="app.rt token (optional)" style="width:100%;box-sizing:border-box;padding:9px 11px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:11px;outline:none;margin-bottom:8px;font-family:monospace;">
                 <div style="display:flex;gap:6px;">
                   <button id="_01_bf_token_link" style="flex:2;padding:8px;background:rgba(0,201,122,0.12);border:1px solid rgba(0,201,122,0.35);color:#00c97a;border-radius:7px;cursor:pointer;font-size:9px;font-weight:700;">Link Token</button>
                   <button id="_01_blox_retry" style="flex:1;padding:8px;background:#141414;border:1px solid #2a2a2a;color:#888;border-radius:7px;cursor:pointer;font-size:9px;font-weight:700;">Retry</button>
                 </div>
                 <div style="color:#3a3a3a;font-size:8px;margin-top:8px;line-height:1.4;">Token is in DevTools (F12) → Application → Cookies → bloxflip.com → <b>app.rt</b></div>
               </div>`;
    } else {
      middle = `<div style="background:rgba(224,85,85,0.06);border:1px solid rgba(224,85,85,0.25);border-radius:11px;padding:14px 15px;text-align:center;">
                 <div style="display:inline-block;width:18px;height:18px;border:2px solid rgba(224,85,85,0.3);border-top-color:#e05555;border-radius:50%;animation:_01l_spin 0.7s linear infinite;margin-bottom:8px;"></div>
                 <div style="color:#e07a7a;font-size:11px;font-weight:700;margin-bottom:3px;">Detecting BloxFlip account…</div>
                 <div style="color:#888;font-size:9px;line-height:1.4;">Make sure you're logged into BloxFlip.</div>
               </div>`;
    }

    if (!VERIFY_CONFIG.REQUIRE_BLOXFLIP && !blox) middle = '';

    const headingText = VERIFY_CONFIG.REQUIRE_DISCORD && !discord
      ? 'Link your Discord account to finish.'
      : 'You\'re all set — launch when ready.';
    const btnLabel = ready ? 'Launch Predictor' : (VERIFY_CONFIG.REQUIRE_DISCORD && !discord ? 'Link Discord to continue' : 'Detecting…');

    content.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="text-align:center;color:#888;font-size:10px;line-height:1.5;">${headingText}</div>
        ${discordCard}
        ${middle}
        <div id="_01_link_error" style="color:#ff6b6b;font-size:11px;text-align:center;min-height:14px;font-weight:500;"></div>
        <button id="_01_link_finish" ${ready ? '' : 'disabled'} style="
          width:100%;padding:14px;border:none;border-radius:11px;font-weight:800;font-size:11px;letter-spacing:2px;
          text-transform:uppercase;cursor:${ready ? 'pointer' : 'default'};transition:all 0.2s;
          display:flex;align-items:center;justify-content:center;gap:8px;
          ${ready
            ? 'background:linear-gradient(135deg,#00c97a,#00a866);color:#001a10;box-shadow:0 8px 24px rgba(0,201,122,0.25);'
            : 'background:#1a1a1a;color:#555;'}
        ">${btnLabel}</button>
      </div>
    `;

    const dcBtn = document.getElementById('_01_dc_link');
    if (dcBtn) dcBtn.addEventListener('click', () => {
      dcBtn.innerHTML = 'Waiting for Discord…';
      dcBtn.disabled = true;
      openDiscordLink();
    });

    const retry = document.getElementById('_01_blox_retry');
    if (retry) retry.addEventListener('click', async () => {
      retry.textContent = 'Detecting…';
      _gaveUp = false;
      let b = detectBloxflipUser();
      if (!b) b = await fetchBloxflipUser();
      if (b) { blox = b; _01_loaderState.bloxId = b.id; _01_loaderState.bloxUsername = b.username; render(); }
      else { render(); startBloxPolling(); }
    });

    const tokenBtn = document.getElementById('_01_bf_token_link');
    if (tokenBtn) tokenBtn.addEventListener('click', async () => {
      const inp = document.getElementById('_01_bf_token_input');
      const errEl = document.getElementById('_01_link_error');
      const tok = inp ? inp.value.trim() : '';
      if (!tok || tok.length < 10) { if (errEl) errEl.textContent = 'Paste a valid token first.'; return; }
      tokenBtn.textContent = 'Linking…'; tokenBtn.disabled = true;
      const b = await fetchBloxflipUser(tok);
      if (b) {
        blox = b; _01_loaderState.bloxId = b.id; _01_loaderState.bloxUsername = b.username;
        try { localStorage.setItem('_01_bf_token', tok); } catch (e) {}
        render();
      } else {
        if (errEl) errEl.textContent = 'That token didn\'t work — make sure it\'s your current app.rt.';
        tokenBtn.textContent = 'Link Token'; tokenBtn.disabled = false;
      }
    });

    const finish = document.getElementById('_01_link_finish');
    if (finish) finish.addEventListener('click', () => {
      if (!ready) return;
      finish.disabled = true;
      finish.innerHTML = '<span>&check; Verified</span>';
      finishVerify();
      setTimeout(closeLoader, 500);
    });
  }

  if (blox) { _01_loaderState.bloxId = blox.id; _01_loaderState.bloxUsername = blox.username; }
  render();
  if (VERIFY_CONFIG.REQUIRE_BLOXFLIP && !blox) startBloxPolling();
}

function closeLoader() {
  const panel = document.getElementById('_01_loader_panel');
  const hideStyle = document.getElementById('_01_loader_hide_style');
  const card = document.getElementById('_01l_card');
  const logo = document.getElementById('_01l_logo');

  if (hideStyle && hideStyle.parentNode) {
    hideStyle.parentNode.removeChild(hideStyle);
  }

  if (!panel || !card) {
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
    buildGUI();
    const nb = document.getElementById('_01studios_nav_bar');
    if (nb) nb.style.display = '';
    return;
  }

  
  let targetSize = 36;
  let targetCx = document.documentElement.clientWidth / 2;
  let targetCy = window.innerHeight - 30 - 30;

  if (typeof createNavigationBar === 'function') createNavigationBar();
  else if (typeof window.createNavigationBar === 'function') window.createNavigationBar();

  const preNav = document.getElementById('_01studios_nav_bar');
  if (preNav) {
    preNav.style.visibility = 'hidden';     
    const navLogoImg = preNav.querySelector('#_01logo img') || preNav.querySelector('#_01logo');
    if (navLogoImg) {
      const r = navLogoImg.getBoundingClientRect();
      if (r.width > 0) {
        targetSize = r.width;
        targetCx = r.left + r.width / 2;
        targetCy = r.top + r.height / 2;
      }
    }
  }

  const cardRect = card.getBoundingClientRect();

  const ball = document.createElement('div');
  ball.id = '_01_morph_ball';
  const startSize = Math.max(cardRect.width, cardRect.height);
  const startCx = cardRect.left + cardRect.width / 2;
  const startCy = cardRect.top + cardRect.height / 2;
  ball.style.cssText = [
    'position:fixed',
    'left:' + (startCx - startSize / 2) + 'px',
    'top:' + (startCy - startSize / 2) + 'px',
    'width:' + startSize + 'px',
    'height:' + startSize + 'px',
    'border-radius:24px',
    'z-index:2147483647',
    'pointer-events:none',
    'overflow:hidden',
    'background:radial-gradient(circle at 50% 42%, rgba(18,18,22,0.96), rgba(8,8,11,0.98))',
    'border:1.5px solid rgba(0,255,136,0.30)',
    'box-shadow:0 14px 50px rgba(0,0,0,0.7), 0 0 36px rgba(0,255,136,0.12)',
    'display:flex','align-items:center','justify-content:center',
    'opacity:0',
    'transition:left 0.78s cubic-bezier(0.6,-0.2,0.3,1.3),' +
      'top 0.78s cubic-bezier(0.6,-0.2,0.3,1.3),' +
      'width 0.78s cubic-bezier(0.55,0.06,0.3,1),' +
      'height 0.78s cubic-bezier(0.55,0.06,0.3,1),' +
      'border-radius 0.78s ease,' +
      'box-shadow 0.6s ease,opacity 0.25s ease'
  ].join(';');

  const ballImg = document.createElement('img');
  ballImg.src = _01_LOGO;
  ballImg.style.cssText = [
    'width:46%','height:46%','border-radius:50%','object-fit:cover',
    'box-shadow:0 0 18px rgba(0,255,136,0.4)',
    'transition:width 0.78s ease, height 0.78s ease, box-shadow 0.6s ease'
  ].join(';');
  ball.appendChild(ballImg);
  document.body.appendChild(ball);

  card.style.transition = 'transform 0.4s cubic-bezier(0.5,0,0.75,0), opacity 0.35s ease';
  card.style.transformOrigin = '50% 50%';
  card.style.transform = 'scale(0.3)';
  card.style.opacity = '0';

  requestAnimationFrame(() => {
    ball.style.opacity = '1';
    requestAnimationFrame(() => {
      
      panel.style.transition = 'opacity 0.6s ease 0.15s';
      panel.style.opacity = '0';
      panel.style.pointerEvents = 'none';

      ball.style.left = (targetCx - targetSize / 2) + 'px';
      ball.style.top  = (targetCy - targetSize / 2) + 'px';
      ball.style.width = targetSize + 'px';
      ball.style.height = targetSize + 'px';
      ball.style.borderRadius = '50%';
      ball.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6), 0 0 14px rgba(0,255,136,0.5)';
      ballImg.style.width = '100%';
      ballImg.style.height = '100%';
    });
  });

  
  setTimeout(() => {
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);

    buildGUI();

    const navBar = document.getElementById('_01studios_nav_bar');
    if (navBar) {
      navBar.style.visibility = '';
      navBar.style.display = '';
    }

    const pp = document.getElementById('_01studios_panel');
    if (pp) {
      pp.style.display = 'block';
      pp.style.transformOrigin = 'bottom center';
      pp.style.transition = 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.34,1.4,0.64,1)';
      pp.style.opacity = '0';
      pp.style.transform = 'translateY(18px) scale(0.97)';
      requestAnimationFrame(() => {
        pp.style.opacity = '1';
        pp.style.transform = 'translateY(0) scale(1)';
      });
    }

    
    if (ball) {
      requestAnimationFrame(() => {
        ball.style.transition = 'opacity 0.45s ease';
        ball.style.opacity = '0';
        setTimeout(() => { if (ball.parentNode) ball.parentNode.removeChild(ball); }, 480);
      });
    }
  }, 840);
}

function initLoader() {
  try { if (typeof injectFiberBridge === 'function') injectFiberBridge(); } catch (e) {}

  const verified = localStorage.getItem('_01_verified');
  if (verified) {
    const data = JSON.parse(verified);
    _01_loaderState.isVerified = true;
    _01_loaderState.username = data.username;
    _01_loaderState.key = data.key;
    _01_loaderState.hwid = data.hwid;
    _01_loaderState.discordId = data.discordId || null;
    _01_loaderState.discordUsername = data.discordUsername || null;
    _01_loaderState.discordAvatar = data.discordAvatar || null;
    _01_loaderState.bloxId = data.bloxId || null;
    _01_loaderState.bloxUsername = data.bloxUsername || null;
    _01_KEY = data.key; _01_HWID = data.hwid;
    return;
  }

  createLoaderPanel();
  showVerificationForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoader);
} else {
  initLoader();
}

window._01_loaderState = _01_loaderState;
window._01_initLoader = () => {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (_01_loaderState.isVerified) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);
  });
};

 try {
 var _cv = localStorage.getItem('_01studios_cache_ver');
 if (_cv !== VERSION) {
  localStorage.removeItem('_01studios_script_cache');
  localStorage.removeItem('_01studios_session_ts');
  localStorage.removeItem('_01studios_t_hist_easy');
  localStorage.removeItem('_01studios_t_hist_normal');
  localStorage.removeItem('_01studios_t_hist_hard');
  localStorage.removeItem('_01studios_t_gc_easy');
  localStorage.removeItem('_01studios_t_gc_normal');
  localStorage.removeItem('_01studios_t_gc_hard');
  localStorage.setItem('_01studios_cache_ver', VERSION);
 }
 } catch(e) {}
 const POLL_MS = 300;
 const GOLD = '#ffffff';
 const DARK_BG = '#0a0a0a';
 const CARD_BG = '#111';
 const CARD_BORDER = '#1e1e1e';
 const TEXT_MAIN = '#f0f0f0';
 const TEXT_DIM = '#666';

 var _01_API = '';
 var _01_KEY = 'free_user';
 var _01_HWID = 'free_user';

 function _01_sign(key, hwid) {
 var ts = String(Date.now());
 var msg = (key || '') + ':' + (hwid || '') + ':' + ts;
 try {
 var hmacKey = [80,65,89,76,79,65,68,95,75,69,89,95,77,73,78,69,83].map(function(c){return String.fromCharCode(c);}).join('');
 var combined = msg + ':' + hmacKey;
 var hash = 0;
 for (var i = 0; i < combined.length; i++) {
 var chr = combined.charCodeAt(i);
 hash = ((hash << 5) - hash) + chr;
 hash |= 0;
 }
 return { ts: ts, sig: null };
 } catch(e) {
 return { ts: ts, sig: null };
 }
 }

 function _01_call(path, body) {
 return new Promise(function(resolve) {
 body.key = _01_KEY; body.hwid = _01_HWID;
 if (window._01_loaderState && window._01_loaderState.discordId) {
 body.discordId = window._01_loaderState.discordId;
 }
 if (_bloxflipUser && _bloxflipUser.id) {
 body.bloxflipUser = _bloxflipUser.id;
 body.bloxflipUsername = _bloxflipUser.username || '';
 }
 var signData = _01_sign(_01_KEY, _01_HWID);
 body._ts = signData.ts;
 if (signData.sig) body._sig = signData.sig;
 GM_xmlhttpRequest({
 method: 'POST', url: _01_API + path,
 headers: {
 'Content-Type': 'application/json',
 'X-01S-TS': signData.ts,
 ...(signData.sig ? { 'X-01S-Sig': signData.sig } : {})
 },
 data: JSON.stringify(body),
 onload: function(r) {
 try { resolve(JSON.parse(r.responseText)); }
 catch(e) { console.error('[01S] Parse:', r.responseText?.slice(0,200)); resolve({error:'parse'}); }
 },
 onerror: function() { resolve({error:'network'}); }
 });
 });
 }

 let currentMode = 'smart';
 let _01_predictLoading = false;
 let _01_predictSpinnerTimer = null;
 let gridSize = 5;
 let mineCount = 3;
 let prediction = [];
 let sessionWins = 0;
 let sessionLosses = 0;
 let sessionProfit = 0;
 let lastUUID = null;
 let lastActive = false;
 let lastUncovered = [];
 let gameRunning = false;
 let currentGameData = null;
 let lastMult = 1;
 let lastPayoutAmount = 0;
 let settings = loadSettings();
 let _anonStyleEl = null;
 let _noChatStyleEl = null;
 let analyticsLog = [];
 function _capLog() { if (analyticsLog.length > 200) analyticsLog = analyticsLog.slice(-150); }
 let panelMinimized = false;
 let isDragging = false;
 let dragOffsetX = 0, dragOffsetY = 0;
 let baseBet = 1;
 let currentBet = 1;
 let winStreak = 0;
 let lossStreak = 0;
 let _sessionStartTime = Date.now();
 let _sessionGamesPlayed = 0;
    let _rainAutoJoin = true;
    let _rainJoinCount = 0;
    let _rainTotalEarned = 0;
    let _rainLastJoinTime = 0;
    let _rainPollerStarted = false;
    let _unionCoreEnabled = localStorage.getItem('_01studios_union_core') !== '0';
    let _01_sessionWins = 0;
    let _01_sessionLosses = 0;
    let _01_sessionToken = null;
    let _01_sessionExpires = 0;
    let _bloxflipUser = null;
    let _bloxflipUsername = '';
 let martingaleMultiplier = 2;
 let targetTiles = 3;
 let currentAlgo = localStorage.getItem('_01studios_algo') || 'Quantum';
 let _lastActiveAlgo = 'Vector';
 let accentColor = localStorage.getItem('_01studios_accent') || GOLD;
 let _activeCore = 'union';
 let _securityIntegrityPassed = true;
 let _securityLastCheck = Date.now();
 let _securityThreats = [];
 let _discordVerified = true;
 let _discordUsername = '';
 let _discordVerifiedAt = null;
 try {
  const _dcData = JSON.parse(localStorage.getItem('_01studios_dc_verify') || 'null');
  if (_dcData && _dcData.ts) {
   _discordVerified = (Date.now() - _dcData.ts) < 7 * 24 * 60 * 60 * 1000;
   _discordUsername = _dcData.username || '';
   _discordVerifiedAt = _dcData.ts;
  }
 } catch(e) {}

 const RIG_LOSS_STREAK_THRESHOLD = 3;
 const RIG_WIN_STREAK_THRESHOLD = 5;
 const RIG_REPEAT_MINE_THRESHOLD = 3;
 const RIG_REPEAT_MINE_WINDOW = 5;
 const PREEMPTIVE_UNRIG_THRESHOLD = 5;
 let _rigDetected = false;
 let _rigReason = '';
 let _rigAlertShown = false;
 let _rigNotifUUID = null;
 let _rigLastNotifTime = 0;
 const _RIG_COOLDOWN_MS = 60000;
 let _lastBetAmount = 0;
 let _betChangedThisGame = false;
 let _winsSinceLastUnrig = 0;

 function getPredColor() { return accentColor; }

 function playRigAlert(message) {
 if (!settings.rigAlertSound) return;
 try {
 if (window.speechSynthesis) {
 window.speechSynthesis.cancel();
 const utt = new SpeechSynthesisUtterance(message);
 utt.rate = 0.95;
 utt.pitch = 1.0;
 utt.volume = 1.0;
 const voices = window.speechSynthesis.getVoices();
 const engVoice = voices.find(v => v.lang && v.lang.startsWith('en') && !v.name.includes('Google'));
 if (engVoice) utt.voice = engVoice;
 window.speechSynthesis.speak(utt);
 return;
 }
 } catch(e) {}
 try {
 const ctx = new (window.AudioContext || window.webkitAudioContext)();
 const osc = ctx.createOscillator();
 const gain = ctx.createGain();
 osc.connect(gain); gain.connect(ctx.destination);
 osc.type = 'sine';
 osc.frequency.setValueAtTime(880, ctx.currentTime);
 osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
 gain.gain.setValueAtTime(0.4, ctx.currentTime);
 gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
 osc.start(ctx.currentTime);
 osc.stop(ctx.currentTime + 0.6);
 } catch(e2) {}
 }

 function showRigNotification(reason, autoUnrig) {
 if (autoUnrig) {
 try { performSilentUnrig(); } catch(e) {}
 }
 return;
 }
 function _showRigNotification_OLD(reason, autoUnrig) {
 if (autoUnrig) {
 try { performSilentUnrig(); } catch(e) {}
 }

 if (currentMode !== 'aggressive') {
 currentMode = 'aggressive';
 try { updateModeButtons(); } catch(e) {}
 }

 if (Date.now() - _rigLastNotifTime < _RIG_COOLDOWN_MS) return;
 _rigLastNotifTime = Date.now();

 const existing = document.getElementById('_01studios_rig_notif');
 if (existing) existing.remove();

 const notif = document.createElement('div');
 notif.id = '_01studios_rig_notif';
 notif.style.cssText = [
 'position:fixed',
 'top:20px',
 'left:50%',
 'transform:translateX(-50%)',
 'background:linear-gradient(135deg,#1a0a0a,#2a0f0f)',
 'border:1.5px solid #e05555',
 'border-radius:14px',
 'padding:14px 20px',
 'z-index:2147483648',
 'box-shadow:0 8px 40px rgba(224,85,85,0.4),0 0 0 1px #e0555522',
 'font-family:Segoe UI,system-ui,sans-serif',
 'min-width:320px',
 'max-width:480px',
 'cursor:pointer',
 'animation:_01studios_rig_slide_in 0.4s cubic-bezier(0.34,1.56,0.64,1)',
 ].join(';');

 if (!document.getElementById('_01studios_rig_anim')) {
 const style = document.createElement('style');
 style.id = '_01studios_rig_anim';
 style.textContent = `
 @keyframes _01studios_rig_slide_in {
 from { opacity:0; transform:translateX(-50%) translateY(-20px) scale(0.92); }
 to { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
 }
 @keyframes _01studios_rig_pulse {
 0%,100% { box-shadow:0 8px 40px rgba(224,85,85,0.4),0 0 0 1px #e0555522; }
 50% { box-shadow:0 8px 50px rgba(224,85,85,0.7),0 0 0 2px #e0555555; }
 }
 #_01studios_rig_notif { animation:_01studios_rig_slide_in 0.4s cubic-bezier(0.34,1.56,0.64,1),_01studios_rig_pulse 2s 0.4s infinite ease-in-out; }
 `;
 document.head.appendChild(style);

  const card = document.getElementById("_01_loader_card");
  if (card) {
    document.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = (e.clientX - centerX) * 0.05;
      const distY = (e.clientY - centerY) * 0.05;

      card.style.transform = `translate(${distX}px, ${distY}px)`;
    });
  }
 }

 notif.innerHTML = `
 <div style="display:flex;align-items:flex-start;gap:12px;">
 <div style="font-size:26px;flex-shrink:0;line-height:1;">X</div>
 <div style="flex:1;">
 <div style="color:#e05555;font-size:13px;font-weight:900;letter-spacing:1.5px;margin-bottom:4px;">RIG DETECTED</div>
 <div style="color:#c0c0c0;font-size:11px;line-height:1.5;margin-bottom:8px;">${reason}</div>
 <div style="color:#ff9800;font-size:10px;font-weight:700;letter-spacing:1px;">&#9888; Play Later (Optional)</div>
 <div style="color:#555;font-size:9px;margin-top:3px;">Auto-unrig applied -- client seed rotated. Click to dismiss.</div>
 </div>
 <div style="color:#555;font-size:18px;flex-shrink:0;line-height:1;">x</div>
 </div>
 `;

 notif.addEventListener('click', () => notif.remove());
 document.body.appendChild(notif);

 setTimeout(() => { if (notif.parentNode) notif.remove(); }, 8000);

 playRigAlert('Rig detected. Play later.');
 }

 function performSilentUnrig() {
 _winsSinceLastUnrig = 0;

 const ts = Date.now().toString(36);
 const chars = '0123456789abcdef';
 const randBytes = crypto.getRandomValues(new Uint8Array(32));
 let rand32 = '';
 for (let i = 0; i < 32; i++) rand32 += chars[randBytes[i] % 16];
 const newSeed = rand32 + '-' + ts;

 fetch('https://bloxflip.com/api/user/seed', {
 method: 'POST',
 credentials: 'include',
 headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
 body: JSON.stringify({ clientSeed: newSeed })
 }).catch(() => {});
 }

 function collectSeedData() {}
 function checkRigDetection(result, minePos, currentMines, betAmt) {
 if (result === 'loss' && lossStreak >= RIG_LOSS_STREAK_THRESHOLD) {
 const reason = `${lossStreak} consecutive losses detected. BloxFlip may be rigging outcomes against you.`;
 if (!_rigAlertShown) {
 _rigDetected = true;
 _rigReason = reason;
 _rigAlertShown = true;
 showRigNotification(reason, true);
 }
 return;
 }

 if (result === 'loss' && analyticsLog.length >= RIG_LOSS_STREAK_THRESHOLD) {
 const recent = analyticsLog.slice(-RIG_LOSS_STREAK_THRESHOLD);
 const allWins = recent.every(e => e.result === 'win');
 if (allWins) {
 const reason = `Post-win punishment: you won ${RIG_LOSS_STREAK_THRESHOLD}+ games in a row and immediately hit a mine. BloxFlip often rigs after hot streaks.`;
 if (!_rigAlertShown) {
 _rigDetected = true;
 _rigReason = reason;
 _rigAlertShown = true;
 showRigNotification(reason, true);
 }
 return;
 }
 }

 if (result === 'loss' && minePos >= 0) {
 const recentHistory = getMineHistory(currentMines, RIG_REPEAT_MINE_WINDOW);
 let repeatCount = 0;
 for (const g of recentHistory) {
 if (Array.isArray(g.minePosArr) && g.minePosArr.includes(minePos)) repeatCount++;
 }
 if (repeatCount >= RIG_REPEAT_MINE_THRESHOLD) {
 const reason = `Cell ${minePos + 1} has been a mine ${repeatCount} times in your last ${RIG_REPEAT_MINE_WINDOW} games. Suspicious mine placement pattern detected.`;
 if (!_rigAlertShown) {
 _rigDetected = true;
 _rigReason = reason;
 _rigAlertShown = true;
 showRigNotification(reason, true);
 }
 return;
 }
 }

 if (result === 'loss' && _betChangedThisGame && betAmt > _lastBetAmount && _lastBetAmount > 0) {
 const reason = `Bet-change punishment: you raised your bet from ${_lastBetAmount.toFixed(1)} to ${betAmt.toFixed(1)} and immediately hit a mine. BloxFlip is known to punish bet increases.`;
 if (!_rigAlertShown) {
 _rigDetected = true;
 _rigReason = reason;
 _rigAlertShown = true;
 showRigNotification(reason, true);
 }
 _betChangedThisGame = false;
 _lastBetAmount = betAmt;
 return;
 }

 if (result === 'win' && winStreak >= RIG_WIN_STREAK_THRESHOLD) {
 const reason = `${winStreak} consecutive wins! BloxFlip may start rigging to recover losses. Consider cashing out and taking a break.`;
 if (!_rigAlertShown) {
 _rigDetected = true;
 _rigReason = reason;
 _rigAlertShown = true;
 showRigNotification(reason, false);
 }
 }

 if (result === 'win') {
 _rigDetected = false;
 _rigReason = '';

 _winsSinceLastUnrig++;
 if (settings.preemptiveUnrig && _winsSinceLastUnrig >= PREEMPTIVE_UNRIG_THRESHOLD) {
 performSilentUnrig();
 updateStatus(`OK Preemptive unrig applied after ${_winsSinceLastUnrig} wins`, accentColor);
 setTimeout(() => updateStatus('Waiting for game...', TEXT_DIM), 2000);
 }
 }
 if (betAmt > 0) {
 if (_lastBetAmount > 0 && betAmt !== _lastBetAmount) _betChangedThisGame = true;
 else _betChangedThisGame = false;
 _lastBetAmount = betAmt;
 }
 }

 const HISTORY_KEY = '_01studios_mine_history';
 const HISTORY_CAP = 500;

 function loadMineHistory() {
 try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}'); }
 catch { return {}; }
 }

 function saveMineHistory() {}
 let mineHistory = {};
 function recordMineHistory() {}
 function getMineHistory() { return []; }
 function getMineHistoryCount() { return 0; }
 function loadSettings() {
 try { return JSON.parse(localStorage.getItem('_01studios_settings') || '{}'); }
 catch { return {}; }
 }
 function saveSettings() { localStorage.setItem('_01studios_settings', JSON.stringify(settings)); }
 function getSavedPos() {
 try {
 const p = JSON.parse(localStorage.getItem('_01studios_pos') || 'null');
 if (!p) return null;
 const maxX = Math.max(0, window.innerWidth - 580);
 const maxY = Math.max(0, window.innerHeight - 200);
 return { x: Math.max(0, Math.min(p.x, maxX)), y: Math.max(60, Math.min(p.y, maxY)) };
 } catch { return null; }
 }
 function resetPos() { localStorage.removeItem('_01studios_pos'); }
 function savePos(x, y) { localStorage.setItem('_01studios_pos', JSON.stringify({ x, y })); }

 function calcMultiplier(mines, tiles, size = 25) {
 let m = 1.0;
 for (let i = 0; i < tiles; i++) m *= (size - i) / (size - mines - i);
 return m * 0.97;
 }
 function survivalProb(mines, tiles, size = 25) {
 let p = 1.0;
 for (let i = 0; i < tiles; i++) p *= (size - mines - i) / (size - i);
 return p;
 }
 function nextClickProb(mines, revealed, size = 25) {
 const rem = size - revealed, safe = size - mines - revealed;
 return safe <= 0 ? 0 : safe / rem;
 }
 function findOptimalCashout(mines, size = 25) {
 let best = 0, bestT = 1;
 for (let t = 1; t <= size - mines; t++) {
 const p = survivalProb(mines, t, size), m = calcMultiplier(mines, t, size);
 const score = p * m;
 if (p >= 0.50 && score > best) { best = score; bestT = t; }
 }
 return { tiles: bestT, prob: survivalProb(mines, bestT, size), mult: calcMultiplier(mines, bestT, size) };
 }

 function hashFNV1a(str) {
 let h = 0x811c9dc5;
 for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (Math.imul(h, 0x01000193) >>> 0); }
 return h >>> 0;
 }

 function mulberry32(seed) {
 return function () {
 seed = (seed + 0x6D2B79F5) >>> 0;
 let z = seed;
 z = Math.imul(z ^ (z >>> 15), z | 1);
 z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
 return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
 };
 }

 let _tileConfidence = null;

 const ALGO_DEFS = [
   { id:'Guardian',  label:'Guardian',   color:'#00c97a',  desc:'Low-risk. Targets tiles with the lowest historical mine frequency. Maximizes survival probability.' },
   { id:'Vector',    label:'Vector',     color:accentColor, desc:'Balanced / EV-optimal. Blends real survival probability with history signal. Best for steady play.' },
   { id:'Phantom',   label:'Phantom',    color:'#e05555',  desc:'Aggressive. Targets tiles that are historically cold AND recently cold — the "due" tile strategy.' },
   { id:'Quantum',   label:'Quantum',    color:'#f5c518',  desc:'Runs 2000 Monte Carlo simulations using weighted probabilities from past games. Each sim places mines historically. Tiles avoiding mines most across all sims are returned as safe. Results vary each run.' }
 ]

 let _bombScores = null;

 let _nonceLookahead = null;

 let _currentRegime = { regime: 'neutral', shift: 0, centroid: null };

 function computeLiveBombProb(mines, size, uncoveredSafe, uncoveredMines) {
 const total = size * size;
 const revealedSafe = uncoveredSafe.length;
 const revealedMines = uncoveredMines.length;
 const remainingTiles = total - revealedSafe - revealedMines;
 const remainingMines = mines - revealedMines;

 if (remainingTiles <= 0 || remainingMines <= 0) return new Float64Array(total);

 const baseBombProb = remainingMines / remainingTiles;

 const bombProb = new Float64Array(total);
 const revealedSet = new Set([...uncoveredSafe, ...uncoveredMines]);

 for (let i = 0; i < total; i++) {
 if (revealedSet.has(i)) { bombProb[i] = 0; continue; }
 const modelScore = _bombScores && _bombScores[i] >= 0 ? _bombScores[i] : 0.5;
 bombProb[i] = baseBombProb * 0.60 + modelScore * baseBombProb * 0.40;
 }
 return bombProb;
 }

 let _bridgeInjected = false;
 let _latestGameState = null;

 async function generatePrediction() {
   const total = gridSize * gridSize;
   const revealedSet = new Set(currentGameData?.uncoveredLocations || []);
   const minePosSet  = new Set(currentGameData?.mineLocations || []);

   const tiles = [];
   for (let i = 0; i < total; i++) {
     const isRevealed = revealedSet.has(i);
     const isMine     = minePosSet.has(i);
     tiles.push({ index:i, score:0, isRevealed, isMine,
                  isSafe:isRevealed&&!isMine, isSuggestedSafe:false, pickOrder:0 });
   }

   let picks = [];
   let _key = _01_KEY, _hwid = _01_HWID;
   if (!_key || _key === 'free_user') {
     try {
       const v = JSON.parse(localStorage.getItem('_01_verified') || '{}');
       if (v && v.key) { _key = v.key; _hwid = v.hwid || _hwid; _01_KEY = _key; _01_HWID = _hwid; }
     } catch (e) {}
   }
   try {
     const res = await _01_request({
       method: 'POST',
       url: VERIFY_CONFIG.VERIFY_API + '/predict',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         key: _key,
         hwid: _hwid,
         board: {
           gridSize: gridSize,
           mines: mineCount,
           targetTiles: targetTiles,
           algo: currentAlgo,
           revealed: Array.from(revealedSet),
           uuid: currentGameData?.uuid || '',
           history: (typeof analyticsLog !== 'undefined' ? analyticsLog.slice(-200) : [])
         }
       })
     });
     const data = JSON.parse(res.text);
     if (data && data.ok && Array.isArray(data.picks)) {
       picks = data.picks;
       if (Array.isArray(data.scores)) {
         for (let i = 0; i < total && i < data.scores.length; i++) tiles[i].score = data.scores[i];
       }
     } else {
       console.warn('[01S] predict rejected:', data && data.error, '(key sent:', (_key||'').slice(0,9) + '...)');
     }
   } catch (e) {
     console.warn('[01S] predict unavailable:', e && e.message);
   }

   for (let i = 0; i < picks.length; i++) {
     const idx = picks[i];
     if (idx >= 0 && idx < total && tiles[idx] && !tiles[idx].isRevealed) {
       tiles[idx].isSuggestedSafe = true;
       tiles[idx].pickOrder = i + 1;
     }
   }
   return tiles;
 }
 function injectFiberBridge() {
 if (_bridgeInjected) return;
 _bridgeInjected = true;
 window.addEventListener('message', function(e) {
 if (e.data && e.data.type === '__01studios_state') {
 _latestGameState = e.data.payload;
 if (e.data.payload && e.data.payload.bloxUser) {
 _bloxflipUser = e.data.payload.bloxUser;
 _bloxflipUsername = _bloxflipUser.username || '';
 window._bloxflipUser = _bloxflipUser;
 }
 }
 });
 const script = document.createElement('script');
 script.textContent = `
(function() {
 if (window.__01studios_bridge_v4) return;
 window.__01studios_bridge_v4 = true;

 var _cachedGame = null;
 var _cachedMult = 0.95;
 var _cachedBloxUser = null;

 function extractBloxUser() {
 if (_cachedBloxUser) return;
 try {
 var nextData = window.__NEXT_DATA__;
 if (nextData && nextData.props && nextData.props.pageProps && nextData.props.pageProps.user) {
 var u = nextData.props.pageProps.user;
 _cachedBloxUser = { id: u.id || u._id, username: u.robloxUsername || u.username || u.name };
 return;
 }
 } catch(e) {}
 try {
 var root = document.getElementById('__next');
 if (root) {
 var fk = null;
 var keys = Object.keys(root);
 for (var i = 0; i < keys.length; i++) { if (keys[i].indexOf('__reactFiber') === 0) { fk = keys[i]; break; } }
 if (fk) {
 var node = root[fk];
 while (node && node.return) node = node.return;
 var queue = [node]; var visited = new Set(); var maxSearch = 500;
 while (queue.length && maxSearch-- > 0) {
 var n = queue.shift();
 if (!n || visited.has(n)) continue;
 visited.add(n);
 if (n.memoizedState) {
 var ms = n.memoizedState;
 while (ms) {
 var v = ms.memoizedState;
 if (v && typeof v === 'object' && v.id && (v.robloxUsername || v.username) && typeof v.id === 'string' && v.id.length > 10) {
 _cachedBloxUser = { id: v.id, username: v.robloxUsername || v.username };
 return;
 }
 ms = ms.next;
 }
 }
 if (n.child) queue.push(n.child);
 if (n.sibling) queue.push(n.sibling);
 }
 }
 }
 } catch(e2) {}
 try {
 var bfUser = localStorage.getItem('user') || sessionStorage.getItem('user');
 if (bfUser) {
 var parsed = JSON.parse(bfUser);
 if (parsed && parsed.id) {
 _cachedBloxUser = { id: parsed.id, username: parsed.robloxUsername || parsed.username || '' };
 return;
 }
 }
 } catch(e3) {}
 }

 function isGameObj(v) {
 return v && typeof v === 'object' && !Array.isArray(v)
 && typeof v.uuid === 'string' && v.uuid.length > 8
 && typeof v.minesAmount === 'number';
 }

 function fiberSearch() {
 try {
        var anchor =
 document.querySelector('[class*="minesGameItem"]') ||
 document.querySelector('[class*="minesGame"]') ||
 document.getElementById('__next');
 if (!anchor) { _cachedGame = null; return; }

 var fk = null;
 var keys = Object.keys(anchor);
 for (var i = 0; i < keys.length; i++) {
 if (keys[i].indexOf('__reactFiber') === 0) { fk = keys[i]; break; }
 }
 if (!fk) { _cachedGame = null; return; }

 var node = anchor[fk];
 while (node.return) node = node.return;

 var queue = [node];
 var visited = new Set();
 var foundGame = null;
 var foundMult = 0.95;

 while (queue.length) {
 var n = queue.shift();
 if (!n || visited.has(n)) continue;
 visited.add(n);

 if (n.memoizedState) {
 var ms = n.memoizedState;
 var nodeGame = null;
 var allNums = [];
 while (ms) {
 var v = ms.memoizedState;
 if (isGameObj(v)) {
 nodeGame = v;
 } else if (typeof v === 'number' && v > 0.9 && v < 1000) {
 allNums.push(v);
 }
 ms = ms.next;
 }
 if (nodeGame) {
 foundGame = nodeGame;
 var bestMult = null;
 for (var ni = 0; ni < allNums.length; ni++) {
 var num = allNums[ni];
 var isNonInteger = (num % 1) !== 0;
 var inRange = num >= 0.94 && num <= 200;
 if (isNonInteger && inRange) {
 if (bestMult === null || Math.abs(num - 1) < Math.abs(bestMult - 1)) {
 bestMult = num;
 }
 }
 }
 if (bestMult !== null) foundMult = bestMult;
 break;
 }
 }

 if (n.child) queue.push(n.child);
 if (n.sibling) queue.push(n.sibling);
 }

 try {
 var btns = document.querySelectorAll('button');
 for (var bi = 0; bi < btns.length; bi++) {
 if (/cashout/i.test(btns[bi].textContent)) {
 var mMatch = btns[bi].textContent.match(/([\d.]+)\s*x/i);
 if (mMatch) {
 var btnMult = parseFloat(mMatch[1]);
 if (btnMult > 0.94) foundMult = btnMult;
 }
 break;
 }
 }
 } catch(e2) {}

 if (foundGame) {
 _cachedGame = {
 uuid: foundGame.uuid,
 active: !!foundGame.active,
 exploded: foundGame.exploded || false,
 minesAmount: foundGame.minesAmount,
 uncoveredLocations: foundGame.uncoveredLocations || [],
 betAmount: foundGame.betAmount || 0,
 badMineUncovered: foundGame.badMineUncovered,
 mineLocations: foundGame.mineLocations || foundGame.mine_locations || [],
 clientSeed: foundGame.clientSeed || foundGame.client_seed,
 nonce: foundGame.nonce,
 serverHash: foundGame.serverHash || foundGame.server_hash || foundGame.hashedServerSeed || foundGame.hashed_server_seed || null,
 serverSeed: foundGame.serverSeed || foundGame.server_seed || null,
 gridSize: foundGame.gridSize || 25
 };
 _cachedMult = foundMult;
 } else {
 _cachedGame = null;
 }
 } catch(e) {
 }
 }

 function poll() {
 fiberSearch();
 extractBloxUser();

 var payoutAmount = 0;
 var domMult = 0;
 try {
 var textInputs = document.querySelectorAll('input[type="text"]');
 for (var ii = 0; ii < textInputs.length; ii++) {
 var inp = textInputs[ii];
 var ggp = inp.parentElement && inp.parentElement.parentElement && inp.parentElement.parentElement.parentElement;
 if (ggp && ggp.innerText && ggp.innerText.indexOf('Total earnings') !== -1) {
 var pval = parseFloat(inp.value);
 if (!isNaN(pval) && pval > 0.95) { payoutAmount = pval; }
 break;
 }
 }
 var btns = document.querySelectorAll('button');
 for (var bi = 0; bi < btns.length; bi++) {
 if (/cashout/i.test(btns[bi].textContent)) {
 var mMatch = btns[bi].textContent.match(/([\d.]+)\s*x/i);
 if (mMatch) { domMult = parseFloat(mMatch[1]); }
 break;
 }
 }
 if (domMult > 0.94) _cachedMult = domMult;
 } catch(e3) {}

 window.postMessage({ type: '__01studios_state', payload: { game: _cachedGame, multiplier: _cachedMult, payoutAmount: payoutAmount, bloxUser: _cachedBloxUser }}, '*');
 }

 setInterval(poll, 150);
 poll();

 function fireClick(el) {
 var rect = el.getBoundingClientRect();
 var cx = rect.left + rect.width / 2;
 var cy = rect.top + rect.height / 2;
 var pOpts = { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy,
 screenX: cx, screenY: cy, pointerId: 1, pointerType: 'mouse', isPrimary: true };
 var mOpts = { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy };
 el.dispatchEvent(new PointerEvent('pointerover', pOpts));
 el.dispatchEvent(new PointerEvent('pointerenter', Object.assign({}, pOpts, { bubbles: false })));
 el.dispatchEvent(new MouseEvent('mouseover', mOpts));
 el.dispatchEvent(new MouseEvent('mouseenter', Object.assign({}, mOpts, { bubbles: false })));
 el.dispatchEvent(new PointerEvent('pointermove', pOpts));
 el.dispatchEvent(new MouseEvent('mousemove', mOpts));
 el.dispatchEvent(new PointerEvent('pointerdown', pOpts));
 el.dispatchEvent(new MouseEvent('mousedown', Object.assign({}, mOpts, { button: 0, buttons: 1 })));
 el.dispatchEvent(new PointerEvent('pointerup', pOpts));
 el.dispatchEvent(new MouseEvent('mouseup', Object.assign({}, mOpts, { button: 0, buttons: 0 })));
 el.dispatchEvent(new MouseEvent('click', Object.assign({}, mOpts, { button: 0, buttons: 0 })));
 }

 window.addEventListener('message', function(e) {
 if (!e.data) return;

 if (e.data.type === '__01studios_click') {
 var idx = e.data.idx;
 var tile = document.querySelector('[aria-label="Open mine ' + idx + '"]');
 if (tile) fireClick(tile);
 return;
 }

 if (e.data.type === '__01studios_cashout') {
 var btns = document.querySelectorAll('button');
 var cashBtn = null;
 for (var i = 0; i < btns.length; i++) {
 if (btns[i].textContent && btns[i].textContent.toLowerCase().indexOf('cashout') !== -1) {
 cashBtn = btns[i];
 break;
 }
 }
 if (cashBtn) fireClick(cashBtn);
 return;
 }

 if (e.data.type === '__01studios_start') {
 var allBtns = document.querySelectorAll('button');
 var startBtn = null;
 for (var j = 0; j < allBtns.length; j++) {
 var txt = allBtns[j].textContent ? allBtns[j].textContent.trim().toLowerCase() : '';
 if (txt === 'start new game' || txt === 'play again' || txt === 'start game') {
 startBtn = allBtns[j];
 break;
 }
 }
 if (startBtn) fireClick(startBtn);
 return;
 }
 });

})();
 `;
 (document.head || document.documentElement).appendChild(script);
 script.remove();
 }

 function getGameState() { return _latestGameState; }

 function getTileByIndex(idx) {
 return document.querySelector(`[aria-label="Open mine ${idx + 1}"]`);
 }

 function clickBloxFlipTile(zeroBasedIdx) {
 const oneBased = zeroBasedIdx + 1;
 window.postMessage({ type: '__01studios_click', idx: oneBased }, '*');
 return true;
 }

 var _lastOverlayKey = '';
 function updateBoardOverlay(retryCount) {
 if (!prediction || prediction.length === 0) {
  document.querySelectorAll('._01studios_overlay_marker').forEach(el => el.remove());
  _lastOverlayKey = '';
  return;
 }

 var overlayKey = prediction.filter(p => p && p.isSuggestedSafe && !p.isRevealed).map(p => p.index + ':' + p.pickOrder).join(',');
 if (overlayKey === _lastOverlayKey && document.querySelector('._01studios_overlay_marker')) return;

 document.querySelectorAll('._01studios_overlay_marker').forEach(el => el.remove());
 if (!prediction || prediction.length === 0) return;

 const testTile = document.querySelector('[aria-label="Open mine 1"]');
 if (!testTile) {
 if ((retryCount||0) < 20) setTimeout(() => updateBoardOverlay((retryCount||0)+1), 300);
 return;
 }
 const testRect = testTile.getBoundingClientRect();
 if (testRect.width === 0 || testRect.height === 0) {
 if ((retryCount||0) < 20) setTimeout(() => updateBoardOverlay((retryCount||0)+1), 300);
 return;
 }

 const tileW = testRect.width;
 const fontSize = tileW > 60 ? 14 : 11;
 const badgeSize = tileW > 60 ? 22 : 18;

 const safePicks = prediction.filter(p => p && p.isSuggestedSafe).sort((a, b) => a.pickOrder - b.pickOrder);
 safePicks.forEach(p => {
 const btn = getTileByIndex(p.index);
 if (!btn) return;
 btn.style.position = 'relative';
 const marker = document.createElement('div');
 marker.className = '_01studios_overlay_marker';
 marker.dataset.tileIndex = p.index;
 const pc = getPredColor();
 marker.style.cssText = `position:absolute;inset:0;z-index:9999;pointer-events:none;border-radius:10px;border:2px solid ${pc};box-shadow:0 0 20px ${pc}88,inset 0 0 14px ${pc}22;background:#0a0a0aee;display:flex;align-items:center;justify-content:center;animation:_01studios_breathe 2s ease-in-out infinite;`;
 const imgSize = Math.min(tileW * 0.65, 48);
 const mascot = document.createElement('img');
 mascot.src = _01_LOGO;
 mascot.style.cssText = `width:${imgSize}px;height:${imgSize}px;object-fit:contain;pointer-events:none;filter:drop-shadow(0 0 6px ${pc}88);animation:_01studios_mascot_pulse 2s ease-in-out infinite;`;
 const orderBadge = document.createElement('div');
 orderBadge.style.cssText = `position:absolute;top:3px;right:3px;background:${pc};color:#000;font-size:9px;font-weight:900;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',sans-serif;box-shadow:0 1px 4px rgba(0,0,0,0.6);pointer-events:none;`;
 orderBadge.textContent = p.pickOrder;
 marker.appendChild(mascot);
 marker.appendChild(orderBadge);
 btn.appendChild(marker);
 });

 prediction.filter(p => p && p.isRevealed && p.isSafe).forEach(p => {
 const btn = getTileByIndex(p.index);
 if (!btn) return;
 btn.style.position = 'relative';
 const marker = document.createElement('div');
 marker.className = '_01studios_overlay_marker';
 marker.style.cssText = `position:absolute;inset:0;z-index:9999;pointer-events:none;border-radius:10px;border:2px solid #00c97a;box-shadow:0 0 10px #00c97a44;background:#00c97a10;display:flex;align-items:center;justify-content:center;font-size:${tileW>60?18:14}px;color:#00c97a;font-weight:900;`;
 marker.textContent = 'v';
 btn.appendChild(marker);
 });
 _lastOverlayKey = overlayKey;
 }

 function injectOverlayStyles() {
 let style = document.getElementById('_01studios_overlay_styles');
 if (!style) {
 style = document.createElement('style');
 style.id = '_01studios_overlay_styles';
 document.head.appendChild(style);

  const card = document.getElementById("_01_loader_card");
  if (card) {
    document.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = (e.clientX - centerX) * 0.05;
      const distY = (e.clientY - centerY) * 0.05;

      card.style.transform = `translate(${distX}px, ${distY}px)`;
    });
  }
 }
 const pc = getPredColor();
 style.textContent = `
 @keyframes _01studios_breathe {
 0%, 100% {
 box-shadow: 0 0 14px ${pc}66, inset 0 0 10px ${pc}18;
 border-color: ${pc}aa;
 }
 50% {
 box-shadow: 0 0 22px ${pc}aa, inset 0 0 16px ${pc}28;
 border-color: ${pc};
 }
 }
 @keyframes _01studios_mascot_pulse {
 0%, 100% {
 filter: drop-shadow(0 0 4px ${pc}66);
 }
 50% {
 filter: drop-shadow(0 0 10px ${pc}cc);
 }
 }
 `;
 }

 function clearBoardOverlay() {
 document.querySelectorAll('._01studios_overlay_marker').forEach(el => el.remove());
 _lastOverlayKey = '';
 }

 function applyAccentColor() {
 const ac = accentColor;
 const pc = getPredColor();

 injectOverlayStyles();

 clearBoardOverlay();
 if (prediction && prediction.length > 0) updateBoardOverlay(0);

 updateAutoPressBtn();
 updateAutoCashoutBtn();
 updateAutoStartBtn();

 updateModeButtons();
 updateTileButtons();
 updateGridSizeButtons();

 const panel = document.getElementById('_01studios_panel');
 if (panel) panel.style.boxShadow = `0 8px 40px rgba(0,0,0,0.8),0 0 0 1px ${ac}14`;

 const badge = document.getElementById('_01studios_live_badge');
 if (badge) { badge.style.background = `${ac}22`; badge.style.borderColor = `${ac}66`; badge.style.color = ac; }

 const streak = document.getElementById('_01studios_streak');
 if (streak && streak.style.color !== '#00c97a' && streak.style.color !== '#e05555') streak.style.color = ac;
 const mult = document.getElementById('_01studios_mult');
 if (mult) mult.style.color = ac;

 updateGrid();
 }

 let autoPressEnabled = false;
 let autoPressActive = false;
 let _minesSequenceLock = false;
 let _minesSequenceComplete = false;

 function updateAutoPressBtn() {
 const btn = document.getElementById('_01studios_menu_autopress');
 if (!btn) return;
 const ac = accentColor;
 if (autoPressEnabled) {
 btn.textContent = '[STOP] AUTO ON';
 btn.style.borderColor = ac;
 btn.style.color = ac;
 btn.style.background = `linear-gradient(135deg,${ac}22,${ac}44)`;
 } else {
 btn.textContent = 'AUTO CLICK';
 btn.style.borderColor = '#333';
 btn.style.color = TEXT_DIM;
 btn.style.background = '#1a1a1a';
 }
 }

 function updateAutoPredictBtn() {
 const btn = document.getElementById('_01studios_menu_autopredict');
 if (!btn) return;
 const on = settings.autoPredict !== false;
 if (on) {
 btn.textContent = '[ON] AUTO PREDICT';
 btn.style.borderColor = accentColor;
 btn.style.color = accentColor;
 btn.style.background = `linear-gradient(135deg,${accentColor}22,${accentColor}44)`;
 } else {
 btn.textContent = 'AUTO PREDICT';
 btn.style.borderColor = '#333';
 btn.style.color = TEXT_DIM;
 btn.style.background = '#1a1a1a';
 }
 }

 let _lastMinesUUID = null;
 let _lastMinesRevealed = 0;
 let _minesTargetLock = [];

 function runAutoPress() {
 if (autoPressActive) return;
 if (!gameRunning || !currentGameData) return;

 _minesTargetLock = prediction
 .filter(p => p && p.isSuggestedSafe && !p.isRevealed)
 .sort((a, b) => a.pickOrder - b.pickOrder)
 .map(p => p.index);

 if (_minesTargetLock.length === 0) return;

 const revealedCount = (currentGameData.uncoveredLocations || []).length;
 const total = gridSize * gridSize;

 if (autoCashoutEnabled && revealedCount >= targetTiles) {
 setTimeout(performAutoCashout, 400);
 return;
 }

 autoPressActive = true;
 _minesSequenceLock = true;
 _minesSequenceComplete = false;
 _lastMinesUUID = currentGameData.uuid;
 _lastMinesRevealed = revealedCount;

 updateStatus(` Instant-clicking ${_minesTargetLock.length} tiles...`, accentColor);
 for (let k = 0; k < _minesTargetLock.length; k++) {
 clickBloxFlipTile(_minesTargetLock[k]);
 }

 let pollCount = 0;
 const maxPolls = 60;
 function checkCompletion() {
 pollCount++;
 if (!gameRunning || !currentGameData || currentGameData.uuid !== _lastMinesUUID || pollCount > maxPolls) {
 autoPressActive = false;
 _minesSequenceLock = false;
 _minesSequenceComplete = true;
 return;
 }
 const currentRevealed = (currentGameData.uncoveredLocations || []).length;
 if (currentRevealed >= revealedCount + _minesTargetLock.length || currentRevealed >= targetTiles) {
 autoPressActive = false;
 _minesSequenceLock = false;
 _minesSequenceComplete = true;
 if (autoCashoutEnabled) {
 updateStatus(`OK All ${_minesTargetLock.length} tiles clicked -- cashing out...`, '#00c97a');
 setTimeout(performAutoCashout, 300);
 } else {
 updateStatus(`OK All ${_minesTargetLock.length} tiles clicked -- waiting for cashout...`, '#00c97a');
 }
 return;
 }
 setTimeout(checkCompletion, 100);
 }
 setTimeout(checkCompletion, 150);
 }

 function autoPressTiles() {
 autoPressEnabled = !autoPressEnabled;
 _01_autoClick = autoPressEnabled;
 if (!autoPressEnabled) {
   autoPressActive = false;
   updateStatus('Auto click off.', TEXT_DIM);
 } else {
   updateStatus(' Auto click ON -- will fire on next prediction.', accentColor);
   if (gameRunning && prediction.some(p => p && p.isSuggestedSafe && !p.isRevealed)) {
     runAutoPress();
   }
 }
 updateAutoPressBtn();
 }

 let autoCashoutEnabled = false;

 function updateAutoCashoutBtn() {
 const btn = document.getElementById('_01studios_menu_autocash');
 if (!btn) return;
 if (autoCashoutEnabled) {
 btn.textContent = '[STOP] CASHOUT ON';
 btn.style.borderColor = '#00c97a';
 btn.style.color = '#00c97a';
 btn.style.background = 'linear-gradient(135deg,#00c97a22,#00c97a44)';
 } else {
 btn.textContent = 'AUTO CASHOUT';
 btn.style.borderColor = '#333';
 btn.style.color = TEXT_DIM;
 btn.style.background = '#1a1a1a';
 }
 }

 function performAutoCashout() {
 window.postMessage({ type: '__01studios_cashout' }, '*');
 }

 function toggleAutoCashout() {
 autoCashoutEnabled = !autoCashoutEnabled;
 _01_autoCash = autoCashoutEnabled;
 if (autoCashoutEnabled) {
   updateStatus(' Auto cashout ON -- will cashout after target tiles.', '#00c97a');
 } else {
   updateStatus('Auto cashout off.', TEXT_DIM);
 }
 updateAutoCashoutBtn();
 }

 let autoStartEnabled = false;

 function updateAutoStartBtn() {
 const btn = document.getElementById('_01studios_menu_autostart');
 if (!btn) return;
 if (autoStartEnabled) {
 btn.textContent = '[STOP] START ON';
 btn.style.borderColor = '#00c97a';
 btn.style.color = '#00c97a';
 btn.style.background = 'linear-gradient(135deg,#00c97a22,#00c97a44)';
 } else {
 btn.textContent = 'AUTO START';
 btn.style.borderColor = '#333';
 btn.style.color = TEXT_DIM;
 btn.style.background = '#1a1a1a';
 }
 }

 function performAutoStart() {
 window.postMessage({ type: '__01studios_start' }, '*');
 }

 function toggleAutoStart() {
 autoStartEnabled = !autoStartEnabled;
 _01_autoStart = autoStartEnabled;
 if (autoStartEnabled) {
   updateStatus(' Auto start ON -- will start new game after each round.', '#00c97a');
 } else {
   updateStatus('Auto start off.', TEXT_DIM);
 }
 updateAutoStartBtn();
 }

 function readMineCount() {
 const state = getGameState();
 if (state && state.game && state.game.minesAmount) return state.game.minesAmount;
 const inp = document.querySelector('[class*="gameBet"] input[type="text"]');
 if (inp) { const v = parseInt(inp.value); if (!isNaN(v) && v >= 1 && v <= 24) return v; }
 return mineCount;
 }

 const MODES = [
 { id:'smart', icon:'', label:'Smart Mode', sub:'Best of all modes' },
 { id:'safe', icon:'', label:'Low Risk', sub:'Conservative plays' },
 { id:'aggressive', icon:'', label:'High Risk', sub:'Max reward plays' },
 { id:'martingale', icon:'', label:'Unrigged', sub:'Anti-rig strategy' },
 ];

 function getLicenseBadge() { return ''; }

 const WHEEL_ITEMS = [
   { action: 'unrig',     label: 'UNRIG',    sub: 'Reset seed',    color: '#e05555' },
   { action: 'settings',  label: 'SETTINGS', sub: 'Configure',     color: '#ffffff' },
   { action: 'analytics', label: 'LOGS',     sub: 'Game history',  color: '#aaaaaa' },
   { action: 'stats',     label: 'STATS',    sub: 'Session recap', color: '#00c97a' },
   { action: 'support',   label: 'SUPPORT',  sub: 'FAQ & tickets', color: '#5865F2' }
 ];

 function injectRadialStyles() {
 const id = '_01studios_radial_styles';
 let style = document.getElementById(id);
 if (!style) {
 style = document.createElement('style');
 style.id = id;
 document.head.appendChild(style);

  const card = document.getElementById("_01_loader_card");
  if (card) {
    document.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = (e.clientX - centerX) * 0.05;
      const distY = (e.clientY - centerY) * 0.05;

      card.style.transform = `translate(${distX}px, ${distY}px)`;
    });
  }
 }
 style.textContent = `
 #_01studios_radial_overlay {
 position: fixed; inset: 0; background: rgba(0,0,0,0.75);
 backdrop-filter: blur(18px) contrast(1.1); -webkit-backdrop-filter: blur(18px) contrast(1.1);
 z-index: 2147483648; display: none; align-items: center; justify-content: center;
 transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0;
 }
 #_01studios_radial_overlay.open { display: flex; opacity: 1; }

 @keyframes _01studios_pulse_glow {
 0% { box-shadow: 0 0 40px ${accentColor}44, inset 0 0 20px ${accentColor}22; border-color: ${accentColor}88; }
 50% { box-shadow: 0 0 70px ${accentColor}88, inset 0 0 40px ${accentColor}44; border-color: ${accentColor}; }
 100% { box-shadow: 0 0 40px ${accentColor}44, inset 0 0 20px ${accentColor}22; border-color: ${accentColor}88; }
 }

 @keyframes _01studios_logo_spin {
 0% { transform: scale(1); filter: drop-shadow(0 0 15px ${accentColor}66); }
 50% { transform: scale(1.05); filter: drop-shadow(0 0 30px ${accentColor}); }
 100% { transform: scale(1); filter: drop-shadow(0 0 15px ${accentColor}66); }
 }

 .radial-wheel {
 position: relative; width: 520px; height: 520px;
 border-radius: 50%; display: flex; align-items: center; justify-content: center;
 overflow: visible; perspective: 1000px;
 }

 .radial-segment {
 position: absolute; width: 260px; height: 260px;
 top: 0; right: 0; transform-origin: 0% 100%;
 background: linear-gradient(135deg, rgba(25,25,25,0.9), rgba(15,15,15,0.95));
 border: 1px solid rgba(255,255,255,0.05);
 transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer;
 clip-path: polygon(0 100%, 0 0, 100% 0, 100% 100%);
 z-index: 2;
 }

 .radial-segment:hover {
 background: linear-gradient(135deg, rgba(45,45,45,0.95), rgba(30,30,30,1));
 border-color: ${accentColor}aa;
 z-index: 5;
 transform: scale(1.1) rotate(var(--rotation)) skewY(var(--skew));
 box-shadow: 0 0 40px ${accentColor}55;
 }

 .radial-content {
 position: absolute; transform: translate(-50%, -50%);
 text-align: center; pointer-events: none; width: 150px;
 z-index: 6; transition: all 0.3s ease;
 }

 .radial-segment:hover + .radial-content {
 transform: translate(-50%, -50%) scale(1.15);
 }

 .radial-center {
 position: absolute; width: 170px; height: 170px;
 background: #000; border: 3px solid ${accentColor}88;
 border-radius: 50%; z-index: 10; display: flex;
 align-items: center; justify-content: center;
 animation: _01studios_pulse_glow 3s infinite ease-in-out;
 overflow: visible;
 }

 .radial-center img {
 width: 110%; height: 110%; object-fit: contain;
 animation: _01studios_logo_spin 4s infinite ease-in-out;
 pointer-events: none;
 }

 .radial-vip-tag {
 position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%);
 background: ${accentColor}; color: #000; font-size: 8px; font-weight: 900;
 padding: 2px 12px; border-radius: 4px; letter-spacing: 1.5px;
 box-shadow: 0 0 15px ${accentColor}aa; text-transform: uppercase;
 white-space: nowrap;
 }
 `;
 }

 function renderRadialWheel() {
 let overlay = document.getElementById('_01studios_radial_overlay');
 if (!overlay) {
 overlay = document.createElement('div');
 overlay.id = '_01studios_radial_overlay';
 document.body.appendChild(overlay);
 }

 const wheel = document.createElement('div');
 wheel.className = 'radial-wheel';

 const count = WHEEL_ITEMS.length;
 const angleStep = 360 / count;
 const skewAngle = 90 - angleStep;

 WHEEL_ITEMS.forEach((item, i) => {
 const rotation = i * angleStep;
 const segment = document.createElement('div');
 segment.className = 'radial-segment';
 segment.style.setProperty('--rotation', `${rotation}deg`);
 segment.style.setProperty('--skew', `-${skewAngle}deg`);
 segment.style.transform = `rotate(${rotation}deg) skewY(-${skewAngle}deg)`;

 segment.onclick = (e) => {
 e.stopPropagation();
 closeRadial();
 openModal(item.action);
 };

 const midAngle = (rotation + angleStep / 2) * (Math.PI / 180);
 const radius = 185;
 const x = 260 + Math.sin(midAngle) * radius;
 const y = 260 - Math.cos(midAngle) * radius;

 const content = document.createElement('div');
 content.className = 'radial-content';
 content.style.left = `${x}px`;
 content.style.top = `${y}px`;
 content.innerHTML = `

 <div style="color:${item.color};font-size:15px;font-weight:900;letter-spacing:2px;text-shadow:0 0 15px ${accentColor}66;">${item.label}</div>
 <div style="color:#888;font-size:10px;margin-top:4px;font-weight:700;letter-spacing:1px;">${item.sub}</div>
 `;

 wheel.appendChild(segment);
 wheel.appendChild(content);
 });

 const center = document.createElement('div');
 center.className = 'radial-center';
 center.innerHTML = `
 <img src="${_01_LOGO}" alt="Logo">
 <div class="radial-vip-tag">01 STUDIO'S</div>
 `;

 wheel.appendChild(center);
 overlay.innerHTML = '';
 overlay.appendChild(wheel);
 overlay.onclick = closeRadial;
 }

 window.openRadial = function() {
 injectRadialStyles();
 renderRadialWheel();
 const overlay = document.getElementById('_01studios_radial_overlay');
 if (overlay) {
 overlay.style.display = 'flex';
 setTimeout(() => overlay.classList.add('open'), 10);
 }
 }

 function closeRadial() {
 const overlay = document.getElementById('_01studios_radial_overlay');
 if (overlay) {
 overlay.classList.remove('open');
 setTimeout(() => overlay.style.display = 'none', 300);
 }
 }

 function injectMainStyles() {
 const id = '_01studios_main_styles';
 let style = document.getElementById(id);
 if (!style) {
 style = document.createElement('style');
 style.id = id;
 document.head.appendChild(style);

  const card = document.getElementById("_01_loader_card");
  if (card) {
    document.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = (e.clientX - centerX) * 0.05;
      const distY = (e.clientY - centerY) * 0.05;

      card.style.transform = `translate(${distX}px, ${distY}px)`;
    });
  }
 }
 style.textContent = `
 @keyframes _01studios_panel_glow {
 0% { box-shadow: 0 8px 40px rgba(0,0,0,0.8), 0 0 20px ${accentColor}18; }
 50% { box-shadow: 0 8px 40px rgba(0,0,0,0.8), 0 0 35px ${accentColor}28; }
 100% { box-shadow: 0 8px 40px rgba(0,0,0,0.8), 0 0 20px ${accentColor}18; }
 }

 #_01studios_panel {
 animation: _01studios_panel_glow 4s infinite ease-in-out;
 border-color: #222 !important;
 overflow: hidden !important;
 width: 480px !important;
 }

 ._01studios_mode_btn {
 transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
 }

 ._01studios_mode_btn[style*="border: 1.5px solid ${accentColor}"] {
 box-shadow: 0 0 15px ${accentColor}33, inset 0 0 10px ${accentColor}11;
 background: linear-gradient(135deg, ${accentColor}11, ${accentColor}22) !important;
 }

 ._01studios_mode_btn:hover {
 border-color: ${accentColor}88 !important;
 box-shadow: 0 0 20px ${accentColor}22;
 transform: translateY(-2px);
 }

 #_01studios_autopress, #_01studios_autocashout, #_01studios_autostart {
 transition: all 0.2s ease !important;
 }

 #_01studios_autopress:hover, #_01studios_autocashout:hover, #_01studios_autostart:hover {
 border-color: #333 !important;
 color: #888 !important;
 }

 .grid-cell-glow {
 transition: box-shadow 0.2s ease;
 }
 .grid-cell-glow:hover {
 box-shadow: 0 0 12px ${accentColor}88;
 }

 ._01studios_core_tab:hover {
 background: #151515 !important;
 }

 @keyframes _01studios_breathe {
 0%, 100% { box-shadow: 0 0 6px ${accentColor}22, inset 0 0 4px ${accentColor}11; border-color: ${accentColor}66; }
 50% { box-shadow: 0 0 14px ${accentColor}44, inset 0 0 8px ${accentColor}22; border-color: ${accentColor}; }
 }

 @keyframes _01studios_name_shine {
 0%, 100% { background-position: 0% 50%; }
 50% { background-position: 100% 50%; }
 }

 @keyframes _01studios_logo_glow {
 0%, 100% { box-shadow: 0 0 8px ${accentColor}22; }
 50% { box-shadow: 0 0 18px ${accentColor}44; }
 }

 @keyframes _01_spin {
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
 }

 #_01studios_predict_btn {
 transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
 }

 #_01studios_predict_btn:hover {
 background: #1a1a1a !important;
 border-color: #333 !important;
 box-shadow: 0 0 12px rgba(255, 255, 255, 0.1) !important;
 transform: scale(1.05) !important;
 }

 #_01studios_predict_btn:active {
 transform: scale(0.97) !important;
 }
 `;
 }

 function buildGUI() {
  
  if (!window._01_loaderState || !window._01_loaderState.isVerified) {
    return; 
  }
 const existing = document.getElementById('_01studios_panel');
 if (existing) existing.remove();
 const pos = getSavedPos();
 const panel = document.createElement('div');
 panel.id = '_01studios_panel';
 panel.style.cssText = `position:fixed;left:${pos?pos.x:20}px;top:${pos?pos.y:80}px;width:480px;background:${DARK_BG};border:1px solid ${CARD_BORDER};border-radius:12px;font-family:'Segoe UI',system-ui,sans-serif;color:${TEXT_MAIN};z-index:2147483647;box-shadow:0 8px 40px rgba(0,0,0,0.8),0 0 0 1px ${accentColor}14;user-select:none;overflow:hidden;`;
 panel.innerHTML = renderPanel();
 document.body.appendChild(panel);
 injectMainStyles();
 attachEvents(panel);
 return panel;
 }

 function renderHomeUI() {
  const username = window._01_loaderState?.username || 'User';
  const key = window._01_loaderState?.key || '';
  const maskedKey = key ? key.substring(0, 4) + '*'.repeat(Math.max(0, key.length - 8)) + key.substring(key.length - 4) : 'N/A';
  const hwid = window._01_loaderState?.hwid || 'N/A';
  return `<div style="padding:12px;display:grid;grid-template-columns:200px 1fr;gap:16px;"><div style="display:flex;flex-direction:column;gap:12px;"><div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.3);border-radius:12px;padding:16px;text-align:center;"><div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Wins</div><div style="font-size:28px;font-weight:900;color:#00ff88;">0</div></div><div style="background:rgba(255,107,107,0.08);border:1px solid rgba(255,107,107,0.3);border-radius:12px;padding:16px;text-align:center;"><div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Losses</div><div style="font-size:28px;font-weight:900;color:#ff6b6b;">0</div></div><div style="background:rgba(100,200,255,0.08);border:1px solid rgba(100,200,255,0.3);border-radius:12px;padding:16px;text-align:center;"><div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Winrate</div><div style="font-size:24px;font-weight:900;color:#64c8ff;">0%</div></div></div><div style="display:flex;flex-direction:column;gap:12px;"><div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;"><div style="font-size:12px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">License Info</div><div style="display:grid;gap:8px;font-size:10px;"><div><div style="color:#888;">Username</div><div style="color:#00ff88;font-weight:700;">${username}</div></div><div><div style="color:#888;">Key</div><div style="color:#64c8ff;font-weight:700;font-family:monospace;">${maskedKey}</div></div><div><div style="color:#888;">HWID</div><div style="color:#fff;font-weight:600;font-family:monospace;font-size:9px;word-break:break-all;background:rgba(0,0,0,0.3);padding:6px;border-radius:6px;">${hwid}</div></div></div></div></div></div>`;
 }

 function renderPanel() {
 if (panelMinimized) return `${renderHeader()}`;
 if (window._01_activeTab === 'home') {
   return `${renderHeader()}<div id="_01studios_body" style="padding:0;">${renderHomeUI()}</div>`;
 }
 const coreSelector = renderCoreSelector();
 if (_activeCore === 'security') {
  return `${renderHeader()}${coreSelector}<div id="_01studios_body" style="padding:0 12px 10px;">${renderSecurityCore()}</div>`;
 }
 return `${renderHeader()}${coreSelector}<div id="_01studios_body" style="padding:0 12px 10px;">${renderStatusBar()}<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px;position:relative;"><div style="display:flex;flex-direction:column;gap:8px;position:relative;">${renderGridSection()}${renderSafeTilesSection()}</div> <div style="display:flex;flex-direction:column;gap:6px;"><div style="background:linear-gradient(135deg,rgba(255,255,255,0.03),rgba(0,0,0,0));border:1px solid #252525;border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:6px;flex:1;"><div style="color:#333;font-size:7px;letter-spacing:1px;text-transform:uppercase;font-weight:700;margin-bottom:2px;">Session</div><div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:8px;color:#3a3a3a;">Wins</span><span id="_01_rc_wins" style="font-size:11px;font-weight:800;color:#00c97a;">${sessionWins}</span></div><div style="height:1px;background:#1e1e1e;"></div><div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:8px;color:#3a3a3a;">Losses</span><span id="_01_rc_losses" style="font-size:11px;font-weight:800;color:#e05555;">${sessionLosses}</span></div><div style="height:1px;background:#1e1e1e;"></div><div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:8px;color:#3a3a3a;">Streak</span><span id="_01_rc_streak" style="font-size:11px;font-weight:800;color:#f5a623;">${winStreak > 0 ? "🔥"+winStreak : lossStreak > 0 ? "❄"+lossStreak : "--"}</span></div><div style="height:1px;background:#1e1e1e;"></div><div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:8px;color:#3a3a3a;">Mines</span><span id="_01_rc_mines" style="font-size:11px;font-weight:800;color:#888;">${mineCount}</span></div></div>${renderAlgoSelector()}<button id="_01studios_predict_btn" style="padding:10px 12px;background:linear-gradient(135deg,rgba(0,201,122,0.15),rgba(0,201,122,0.06));border:1px solid rgba(0,201,122,0.3);color:#00c97a;border-radius:10px;cursor:pointer;font-size:9px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase;transition:all 0.25s ease;" title="${_predictCount > 0 ? 'Re-predict' : 'Predict'}">${_predictCount > 0 ? 'RE-PREDICT (x' + (_predictCount + 1) + ')' : 'PREDICT'}</button><div id="_01studios_quick_menu" style="display:none;background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:8px;grid-template-columns:repeat(2,1fr);gap:6px;"><button id="_01studios_menu_autopress" style="padding:8px 4px;background:#111;border:1px solid #222;color:#555;border-radius:8px;cursor:pointer;font-size:7px;font-weight:700;letter-spacing:0.5px;transition:all 0.2s ease;" title="Auto Click">AUTO CLICK</button><button id="_01studios_menu_autocash" style="padding:8px 4px;background:#111;border:1px solid #222;color:#555;border-radius:8px;cursor:pointer;font-size:7px;font-weight:700;letter-spacing:0.5px;transition:all 0.2s ease;" title="Auto Cashout">AUTO CASH</button><button id="_01studios_menu_autostart" style="padding:8px 4px;background:#111;border:1px solid #222;color:#555;border-radius:8px;cursor:pointer;font-size:7px;font-weight:700;letter-spacing:0.5px;transition:all 0.2s ease;" title="Auto Start">AUTO START</button><button id="_01studios_menu_autopredict" style="padding:8px 4px;background:#111;border:1px solid #222;color:#555;border-radius:8px;cursor:pointer;font-size:7px;font-weight:700;letter-spacing:0.5px;transition:all 0.2s ease;" title="Auto Predict">AUTO PREDICT</button></div></div></div>${renderFooterBar()}</div>`;
 }

 function renderCoreSelector() {
 const uc = _getUnionCoreStatus();
 const ucStatus = 'ACTIVE';
  const ucStatusColor = '#00c97a';
 const histLabel = uc.histCount > 0 ? uc.histCount + ' games' : 'No data';
 return `<div style="padding:6px 12px;background:#080808;border-bottom:1px solid #1a1a1a;">
 <style>
  @keyframes _01core_sweep {
    0%   { background-position:-60% 0; }
    55%  { background-position:160% 0; }
    100% { background-position:160% 0; }
  }
  @keyframes _01core_breathe { 0%,100%{box-shadow:0 0 8px ${ucStatusColor}22, inset 0 0 10px ${ucStatusColor}08; border-color:${ucStatusColor}33;} 50%{box-shadow:0 0 20px ${ucStatusColor}55, inset 0 0 16px ${ucStatusColor}14; border-color:${ucStatusColor}99;} }
  @keyframes _01core_pulsering { 0%{transform:scale(1);opacity:.6;} 70%{transform:scale(2.6);opacity:0;} 100%{transform:scale(2.6);opacity:0;} }
  @keyframes _01core_dot { 0%,100%{box-shadow:0 0 5px ${ucStatusColor}, 0 0 9px ${ucStatusColor}88;} 50%{box-shadow:0 0 9px ${ucStatusColor}, 0 0 16px ${ucStatusColor};} }
  @keyframes _01core_spin { to { transform:rotate(360deg); } }
  #_01studios_core_btn { position:relative; overflow:hidden; }
  #_01studios_core_btn::after {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(105deg, transparent 38%, ${ucStatusColor}22 47%, ${ucStatusColor}3a 50%, ${ucStatusColor}22 53%, transparent 62%);
    background-size:55% 100%; background-repeat:no-repeat;
    animation:_01core_sweep 4.5s cubic-bezier(0.45,0,0.55,1) infinite;
  }
 </style>
 <div id="_01studios_core_btn" style="display:flex;align-items:center;justify-content:space-between;padding:9px 13px;background:linear-gradient(135deg, rgba(0,201,122,0.06), rgba(8,8,8,0.4) 60%), #121512;border:1px solid ${ucStatusColor}33;border-radius:11px;cursor:default;animation:_01core_breathe 3.4s ease-in-out infinite;">
  <div style="display:flex;align-items:center;gap:10px;position:relative;z-index:2;">
   <div style="position:relative;width:14px;height:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
    <svg width="14" height="14" viewBox="0 0 24 24" style="animation:_01core_spin 4s linear infinite;filter:drop-shadow(0 0 3px ${ucStatusColor}aa);">
     <circle cx="12" cy="12" r="9" fill="none" stroke="${ucStatusColor}" stroke-width="1.4" stroke-dasharray="6 5" opacity="0.85"/>
     <circle cx="12" cy="12" r="3.2" fill="${ucStatusColor}"/>
    </svg>
   </div>
   <span style="font-size:10px;font-weight:800;letter-spacing:1.5px;color:#fff;text-shadow:0 0 8px ${ucStatusColor}55;">CORE</span>
   <span style="position:relative;font-size:7px;font-weight:800;padding:2px 7px;border-radius:4px;background:${ucStatusColor}18;color:${ucStatusColor};border:1px solid ${ucStatusColor}55;letter-spacing:1px;">
    <span style="position:relative;display:inline-flex;align-items:center;gap:4px;">
     <span style="position:relative;width:5px;height:5px;border-radius:50%;background:${ucStatusColor};animation:_01core_dot 1.6s ease-in-out infinite;">
      <span style="position:absolute;inset:0;border-radius:50%;border:1px solid ${ucStatusColor};animation:_01core_pulsering 1.8s ease-out infinite;"></span>
     </span>
     ${ucStatus}
    </span>
   </span>
  </div>
  <div style="display:flex;gap:3px;align-items:center;position:relative;z-index:2;">
   ${Array.from({length:4}, (_, i) => `<div style="width:2.5px;height:${8 + (i%2)*4}px;border-radius:2px;background:${ucStatusColor};opacity:${0.35 + i*0.18};box-shadow:0 0 4px ${ucStatusColor}66;"></div>`).join('')}
  </div>
 </div>
 <div id="_01studios_core_popup" style="display:none;margin-top:6px;background:#111;border:1px solid #222;border-radius:10px;padding:8px;box-shadow:0 8px 32px rgba(0,0,0,0.6);">
  <div id="_01studios_union_core_btn" style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;cursor:pointer;border:1px solid ${ucStatusColor}33;background:${ucStatusColor}08;margin-bottom:4px;transition:all 0.15s;">
   <div style="position:relative;flex-shrink:0;">
    <img src="${_UNION_CORE_SVG}" style="width:36px;height:36px;display:block;filter:drop-shadow(0 0 6px ${accentColor}44);${uc.active ? 'animation:_01_uc_spin 8s linear infinite;' : ''}"/>
    <div style="position:absolute;bottom:-1px;right:-1px;width:8px;height:8px;border-radius:50%;background:${ucStatusColor};border:2px solid #111;box-shadow:0 0 4px ${ucStatusColor}88;"></div>
   </div>
   <div style="flex:1;">
    <div style="display:flex;align-items:center;gap:5px;margin-bottom:2px;">
     <span style="font-size:10px;font-weight:700;letter-spacing:1px;color:#e0e0e0;">UNION CORE</span>
     <span style="font-size:7px;font-weight:700;padding:1px 4px;border-radius:3px;background:${ucStatusColor}18;color:${ucStatusColor};border:1px solid ${ucStatusColor}44;">${ucStatus}</span>
    </div>
    <div style="font-size:7px;color:#444;">${uc.algoCount} algorithms · ${histLabel}</div>
    <div style="margin-top:4px;display:flex;gap:2px;">${Array.from({length:8}, (_, i) => `<div style="flex:1;height:2px;border-radius:1px;background:${i < Math.min(8, Math.ceil(uc.histCount / 6)) ? accentColor : '#222'};"></div>`).join('')}</div>
   </div>
   <span style="color:#333;font-size:12px;">›</span>
  </div>
  <div id="_01studios_core_security" style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;cursor:pointer;border:1px solid transparent;transition:all 0.15s;" onmouseover="this.style.borderColor='#4fc3f733';this.style.background='#4fc3f708'" onmouseout="this.style.borderColor='transparent';this.style.background='transparent'">
   <div style="position:relative;flex-shrink:0;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
    <svg width="36" height="36" viewBox="0 0 80 80" style="filter:drop-shadow(0 0 6px #4fc3f744);animation:_01_uc_spin 12s linear infinite;">
     <defs><linearGradient id="sg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a5276"/><stop offset="50%" stop-color="#4fc3f7"/><stop offset="100%" stop-color="#1a5276"/></linearGradient><linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a7ab5"/><stop offset="100%" stop-color="#0d3b5e"/></linearGradient></defs>
     <circle cx="40" cy="40" r="38" fill="none" stroke="url(#sg1)" stroke-width="2" opacity="0.35"/>
     <circle cx="40" cy="40" r="28" fill="url(#sg2)" stroke="url(#sg1)" stroke-width="1.5"/>
     <path d="M40 18L25 27v10c0 11.1 6.4 21.5 15 24 8.6-2.5 15-12.9 15-24V27L40 18z" fill="#4fc3f715" stroke="#4fc3f7" stroke-width="1.5"/>
     <path d="M34 40l4 4 8-8" stroke="#4fc3f7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
     <circle cx="40" cy="40" r="5" fill="#0d3b5e" stroke="#4fc3f7" stroke-width="1"/>
     <circle cx="40" cy="40" r="2" fill="#4fc3f7"/>
     <g stroke="url(#sg1)" stroke-width="1.5" stroke-linecap="round" opacity="0.5">
      <line x1="40" y1="4" x2="40" y2="12"/><line x1="40" y1="68" x2="40" y2="76"/>
      <line x1="4" y1="40" x2="12" y2="40"/><line x1="68" y1="40" x2="76" y2="40"/>
     </g>
    </svg>
    <div style="position:absolute;bottom:-1px;right:-1px;width:8px;height:8px;border-radius:50%;background:#4fc3f7;border:2px solid #111;box-shadow:0 0 4px #4fc3f788;"></div>
   </div>
   <div style="flex:1;">
    <div style="font-size:10px;font-weight:700;letter-spacing:1px;color:#b0d4e8;margin-bottom:2px;">LIVE STATS</div>
    <div style="font-size:7px;color:#555;">Bomb odds · EV · optimal play</div>
   </div>
   <span style="font-size:7px;font-weight:700;padding:1px 5px;border-radius:3px;background:#4fc3f718;color:#4fc3f7;border:1px solid #4fc3f744;">ON</span>
  </div>
 </div>
 </div>`;
 }

 function renderHeader() {
 return `
 <div id="_01studios_header" style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;cursor:move;border-bottom:1px solid #1c1c1c;background:linear-gradient(180deg,#0e0e0e 0%,${DARK_BG} 100%);">
 <div style="display:flex;align-items:center;gap:8px;">
 <img src="${_01_LOGO}" style="width:24px;height:24px;border-radius:5px;object-fit:cover;box-shadow:0 0 12px ${accentColor}33;animation:_01studios_logo_glow 3s ease-in-out infinite;">
 <div style="display:flex;flex-direction:column;line-height:1;">
 <span class="_01studios_logo_text" style="font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;background:linear-gradient(90deg,${accentColor} 0%,#fff 40%,${accentColor} 80%);background-size:200% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;">01 Studio's</span>
 <span style="font-size:7px;color:#444;font-weight:600;letter-spacing:1.5px;margin-top:1px;">v${VERSION}</span>
 </div>
 ${getLicenseBadge()}
 <div id="_01studios_auto_status" style="display:none;background:${accentColor}14;border:1px solid ${accentColor}33;color:${accentColor};font-size:7px;font-weight:700;padding:2px 6px;border-radius:10px;letter-spacing:0.8px;"></div>
 </div>
 <div style="display:flex;align-items:center;gap:6px;position:relative;">

 <button id="_01studios_minimize" style="background:#1a1a1a;border:1px solid #2a2a2a;color:${TEXT_DIM};width:26px;height:26px;border-radius:6px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;">-</button>
 </div>
 </div>`;
 }

 function renderStatusBar() {
  const total = sessionWins + sessionLosses;
  const wr = total > 0 ? Math.round(sessionWins / total * 100) + '%' : '--';
  const wrNum = total > 0 ? Math.round(sessionWins / total * 100) : 0;
  const profitStr = sessionProfit >= 0 ? '+' + sessionProfit.toFixed(1) : sessionProfit.toFixed(1);
  const profitColor = sessionProfit >= 0 ? '#00c97a' : '#e05555';
  const wrColor = total === 0 ? '#00c97a' : wrNum >= 60 ? '#00c97a' : wrNum >= 45 ? '#f5a623' : '#e05555';
  return `<div id="_01studios_status_bar" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin:8px 0 4px;">
    <div style="background:linear-gradient(135deg,rgba(0,201,122,0.06),rgba(0,0,0,0));border:1px solid #252525;border-radius:10px;padding:8px 6px;text-align:center;">
      <div style="color:#333;font-size:7px;letter-spacing:1px;margin-bottom:3px;">WIN RATE</div>
      <div id="_01studios_winrate" style="color:${wrColor};font-size:16px;font-weight:900;line-height:1;">${wr}</div>
    </div>
    <div style="background:linear-gradient(135deg,rgba(255,255,255,0.025),rgba(0,0,0,0));border:1px solid #252525;border-radius:10px;padding:8px 6px;text-align:center;">
      <div style="color:#333;font-size:7px;letter-spacing:1px;margin-bottom:3px;">GAMES</div>
      <div id="_01studios_games_ct" style="color:${accentColor};font-size:16px;font-weight:900;line-height:1;">${String(total)}</div>
    </div>
    <div style="background:linear-gradient(135deg,rgba(255,255,255,0.025),rgba(0,0,0,0));border:1px solid #252525;border-radius:10px;padding:8px 6px;text-align:center;">
      <div style="color:#333;font-size:7px;letter-spacing:1px;margin-bottom:3px;">PROFIT</div>
      <div id="_01studios_profit" style="color:${profitColor};font-size:16px;font-weight:900;line-height:1;">${profitStr}</div>
    </div>
  </div>`;
 }

    const _UNION_CORE_SVG = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#666"/><stop offset="50%" stop-color="#ddd"/><stop offset="100%" stop-color="#888"/></linearGradient><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#555"/><stop offset="100%" stop-color="#222"/></linearGradient></defs><circle cx="40" cy="40" r="38" fill="none" stroke="url(#g1)" stroke-width="2.5" opacity="0.4"/><circle cx="40" cy="40" r="28" fill="url(#g2)" stroke="url(#g1)" stroke-width="2"/><circle cx="40" cy="40" r="12" fill="url(#g1)" opacity="0.9"/><circle cx="40" cy="40" r="5" fill="#111"/><circle cx="40" cy="40" r="2" fill="#eee"/><g stroke="url(#g1)" stroke-width="2.5" stroke-linecap="round" opacity="0.7"><line x1="40" y1="4" x2="40" y2="14"/><line x1="40" y1="66" x2="40" y2="76"/><line x1="4" y1="40" x2="14" y2="40"/><line x1="66" y1="40" x2="76" y2="40"/><line x1="14.5" y1="14.5" x2="21" y2="21"/><line x1="59" y1="59" x2="65.5" y2="65.5"/><line x1="65.5" y1="14.5" x2="59" y2="21"/><line x1="21" y1="59" x2="14.5" y2="65.5"/></g></svg>')}`;
 function _getUnionCoreStatus() {
   const histCount  = (typeof analyticsLog !== 'undefined'
     ? analyticsLog.filter(e => e && e.mines === mineCount && Array.isArray(e.minePosArr)).length
     : 0);
   const isUnion    = currentAlgo === 'UnionCore';
   const activeAlgo = currentAlgo;
   return { histCount, algoCount: 5, active: isUnion, activeAlgo };
 }

 function renderSafeTilesSection() {
  const optimal = findOptimalCashout(mineCount, gridSize * gridSize);
  const maxSafe = Math.max(1, gridSize * gridSize - mineCount);
  return `<div style="background:linear-gradient(135deg,rgba(255,255,255,0.025),rgba(0,0,0,0));border:1px solid #252525;border-radius:10px;padding:10px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <div style="color:#444;font-size:7px;letter-spacing:1px;font-weight:700;text-transform:uppercase;">Safe Tiles</div>
      <div style="font-size:7px;color:#2d2d2d;">optimal: <span style="color:#3a3a3a;">${optimal.tiles}</span></div>
    </div>
    <div style="display:flex;align-items:center;gap:8px;">
      <button id="_01studios_tile_dec" style="width:28px;height:28px;border-radius:8px;cursor:pointer;font-size:16px;font-weight:700;background:#141414;border:1px solid #242424;color:#555;display:flex;align-items:center;justify-content:center;transition:all 0.15s ease;">-</button>
      <div style="flex:1;text-align:center;">
        <span id="_01studios_tile_count" style="color:${accentColor};font-size:22px;font-weight:900;">${targetTiles}</span>
        <span style="color:#2d2d2d;font-size:9px;margin-left:3px;">/ ${maxSafe}</span>
      </div>
      <button id="_01studios_tile_inc" style="width:28px;height:28px;border-radius:8px;cursor:pointer;font-size:16px;font-weight:700;background:#141414;border:1px solid #242424;color:#555;display:flex;align-items:center;justify-content:center;transition:all 0.15s ease;">+</button>
    </div>
    <div id="_01studios_tile_slider" style="margin-top:8px;background:#161616;border-radius:3px;height:4px;overflow:hidden;cursor:pointer;">
      <div id="_01studios_tile_bar" style="height:100%;width:${Math.round(targetTiles/maxSafe*100)}%;background:linear-gradient(90deg,${accentColor}99,${accentColor});border-radius:3px;transition:width 0.2s;box-shadow:0 0 6px ${accentColor}55;"></div>
    </div>
  </div>`;
 }

 function applyAnonMode(enabled) {
 if (_anonStyleEl) { _anonStyleEl.remove(); _anonStyleEl = null; }
 if (!enabled) return;
 const s = document.createElement('style');
 s.id = '_01studios_anon_css';
 s.textContent = `
 /* Hide usernames */
 [class*="username"], [class*="userName"], [class*="user-name"],
 [class*="UserName"], [class*="display-name"], [class*="displayName"],
 [data-testid*="user"], [class*="author"] > span,
 .chat-message-username, .chat-username {
 filter: blur(8px) !important;
 user-select: none !important;
 pointer-events: none !important;
 }
 /* Hide profile pictures / avatars */
 [class*="avatar"], [class*="Avatar"], [class*="pfp"],
 [class*="profile-pic"], [class*="profilePic"],
 [class*="user-image"], [class*="userImage"],
 img[src*="avatar"], img[src*="profile"],
 img[src*="roblox.com/headshot"], img[src*="tr.rbxcdn.com"] {
 filter: blur(10px) !important;
 pointer-events: none !important;
 }
 /* Hide wallet balance */
 [class*="balance"], [class*="Balance"], [class*="wallet"] > span {
 filter: blur(8px) !important;
 user-select: none !important;
 }
 /* Never blur the predictor UI */
 #_01studios_panel, #_01studios_panel *,
 #_01studios_modal_overlay, #_01studios_modal_overlay *,
 #_01studios_nav_bar, #_01studios_nav_bar *,
 #_01studios_radial_overlay, #_01studios_radial_overlay * {
 filter: none !important;
 pointer-events: auto !important;
 user-select: auto !important;
 }
 `;
 (document.head || document.documentElement).appendChild(s);
 _anonStyleEl = s;
 }

 function applyNoChatMode(enabled) {
 if (_noChatStyleEl) { _noChatStyleEl.remove(); _noChatStyleEl = null; }
 if (!enabled) return;
 const s = document.createElement('style');
 s.id = '_01studios_nochat_css';
 s.textContent = `
 [class*="chat-container"]:not(:has(#_01studios_panel)),
 [class*="chatContainer"]:not(:has(#_01studios_panel)),
 [class*="ChatContainer"]:not(:has(#_01studios_panel)),
 [class*="chat-panel"]:not(:has(#_01studios_panel)),
 [class*="chatPanel"]:not(:has(#_01studios_panel)),
 [class*="chat-wrapper"]:not(:has(#_01studios_panel)),
 [class*="ChatWrapper"]:not(:has(#_01studios_panel)),
 [class*="sidebar-chat"]:not(:has(#_01studios_panel)) {
 display: none !important;
 }
 `;
 (document.head || document.documentElement).appendChild(s);
 _noChatStyleEl = s;
 }

    function showRainNotification(msg, color) {
        var existing = document.getElementById('_01studios_rain_notif');
        if (existing) existing.remove();
        var notif = document.createElement('div');
        notif.id = '_01studios_rain_notif';
        notif.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#161616;border:1.5px solid ' + color + ';border-radius:10px;padding:10px 18px;z-index:2147483648;box-shadow:0 4px 20px rgba(0,0,0,0.6);font-family:Segoe UI,system-ui,sans-serif;cursor:pointer;display:flex;align-items:center;gap:8px;';
        notif.innerHTML = '<div style="color:' + color + ';font-size:11px;font-weight:700;">' + msg + '</div>';
        notif.addEventListener('click', function() { notif.remove(); });
        document.body.appendChild(notif);
        setTimeout(function() { if (notif.parentNode) notif.remove(); }, 5000);
    }

 function renderSecurityCore() {
  const size = gridSize * gridSize;
  const revealed = lastUncovered.length;
  const optimal = findOptimalCashout(mineCount, size);
  const nextSafe = nextClickProb(mineCount, revealed, size);
  const currentMult = calcMultiplier(mineCount, revealed, size);
  const targetSurvival = survivalProb(mineCount, targetTiles, size);
  const targetMult = calcMultiplier(mineCount, targetTiles, size);
  const targetEV = targetSurvival * targetMult;
  const nextColor = nextSafe >= 0.7 ? '#00c97a' : nextSafe >= 0.45 ? '#f5a623' : '#e05555';
  const live = gameRunning && currentGameData;

  const remainingMines = mineCount;
  const baseBomb = size - revealed > 0 ? (mineCount / (size - revealed)) : 0;

  return `
  <div style="margin-top:8px;">

   <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-bottom:8px;">
    <div style="background:linear-gradient(135deg,${nextColor}10,rgba(0,0,0,0));border:1px solid #252525;border-radius:10px;padding:10px 6px;text-align:center;">
     <div style="color:#333;font-size:7px;letter-spacing:1px;margin-bottom:4px;">NEXT SAFE</div>
     <div style="color:${nextColor};font-size:18px;font-weight:900;line-height:1;">${(nextSafe*100).toFixed(0)}%</div>
    </div>
    <div style="background:linear-gradient(135deg,rgba(255,255,255,0.025),rgba(0,0,0,0));border:1px solid #252525;border-radius:10px;padding:10px 6px;text-align:center;">
     <div style="color:#333;font-size:7px;letter-spacing:1px;margin-bottom:4px;">CUR. MULT</div>
     <div style="color:${accentColor};font-size:18px;font-weight:900;line-height:1;">${currentMult.toFixed(2)}x</div>
    </div>
    <div style="background:linear-gradient(135deg,rgba(255,255,255,0.025),rgba(0,0,0,0));border:1px solid #252525;border-radius:10px;padding:10px 6px;text-align:center;">
     <div style="color:#333;font-size:7px;letter-spacing:1px;margin-bottom:4px;">REVEALED</div>
     <div style="color:#888;font-size:18px;font-weight:900;line-height:1;">${revealed}</div>
    </div>
   </div>

   <div style="background:linear-gradient(135deg,rgba(0,201,122,0.05),rgba(0,0,0,0));border:1px solid #252525;border-radius:10px;padding:12px;margin-bottom:8px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
     <span style="color:#444;font-size:8px;letter-spacing:1.5px;font-weight:700;">OPTIMAL PLAY</span>
     <span style="color:#00c97a;font-size:8px;font-weight:700;background:rgba(0,201,122,0.1);padding:2px 8px;border-radius:20px;border:1px solid rgba(0,201,122,0.25);">${optimal.tiles} TILES</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:7px;">
     <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#888;font-size:9px;">Recommended cashout</span>
      <span style="color:#00c97a;font-size:11px;font-weight:800;">${optimal.mult.toFixed(2)}x</span>
     </div>
     <div style="height:1px;background:#1a1a1a;"></div>
     <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#888;font-size:9px;">Survival to ${optimal.tiles} tiles</span>
      <span style="color:${optimal.prob >= 0.6 ? '#00c97a' : optimal.prob >= 0.4 ? '#f5a623' : '#e05555'};font-size:11px;font-weight:800;">${(optimal.prob*100).toFixed(0)}%</span>
     </div>
    </div>
   </div>

   <div style="background:#161616;border:1px solid #252525;border-radius:10px;padding:12px;margin-bottom:8px;">
    <div style="color:#444;font-size:8px;letter-spacing:1.5px;font-weight:700;margin-bottom:10px;">YOUR TARGET (${targetTiles} TILES)</div>
    <div style="display:flex;flex-direction:column;gap:7px;">
     <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#888;font-size:9px;">Multiplier</span>
      <span style="color:${accentColor};font-size:11px;font-weight:800;">${targetMult.toFixed(2)}x</span>
     </div>
     <div style="height:1px;background:#1a1a1a;"></div>
     <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#888;font-size:9px;">Win probability</span>
      <span style="color:${targetSurvival >= 0.6 ? '#00c97a' : targetSurvival >= 0.4 ? '#f5a623' : '#e05555'};font-size:11px;font-weight:800;">${(targetSurvival*100).toFixed(0)}%</span>
     </div>
     <div style="height:1px;background:#1a1a1a;"></div>
     <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#888;font-size:9px;">Expected value</span>
      <span style="color:${targetEV >= 1 ? '#00c97a' : '#e05555'};font-size:11px;font-weight:800;">${targetEV.toFixed(2)}x</span>
     </div>
    </div>
    <div style="margin-top:10px;padding:8px 10px;border-radius:8px;background:${targetEV >= 1 ? 'rgba(0,201,122,0.08)' : 'rgba(224,85,85,0.08)'};border:1px solid ${targetEV >= 1 ? 'rgba(0,201,122,0.2)' : 'rgba(224,85,85,0.2)'};">
     <span style="color:${targetEV >= 1 ? '#00c97a' : '#e05555'};font-size:9px;font-weight:700;">${targetEV >= 1 ? '✓ Positive EV — favorable target' : '⚠ Negative EV — consider fewer tiles'}</span>
    </div>
   </div>

   <div style="background:#161616;border:1px solid #252525;border-radius:10px;padding:12px;margin-bottom:8px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
     <span style="color:#444;font-size:8px;letter-spacing:1.5px;font-weight:700;">BOARD STATE</span>
     <span style="color:${live ? '#00c97a' : '#555'};font-size:8px;font-weight:700;">${live ? '● LIVE' : '○ IDLE'}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
     <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#888;font-size:9px;">Mines on board</span>
      <span style="color:#e05555;font-size:10px;font-weight:700;">${mineCount}</span>
     </div>
     <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#888;font-size:9px;">Tiles remaining</span>
      <span style="color:#888;font-size:10px;font-weight:700;">${size - revealed}</span>
     </div>
     <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#888;font-size:9px;">Base bomb chance / tile</span>
      <span style="color:#f5a623;font-size:10px;font-weight:700;">${(baseBomb*100).toFixed(1)}%</span>
     </div>
    </div>
   </div>

   <button id="_01studios_sec_back" style="width:100%;padding:9px;background:#0d0d0d;border:1px solid #222;color:#666;border-radius:8px;cursor:pointer;font-size:9px;font-weight:700;letter-spacing:0.5px;">← BACK TO PREDICTIONS</button>
  </div>`;
 }

 function attachSecurityEvents() {
  const panel = document.getElementById('_01studios_panel');
  if (!panel) return;
  const backBtn = panel.querySelector('#_01studios_sec_back');
  if (backBtn) backBtn.addEventListener('click', () => {
   _activeCore = 'union';
   panel.innerHTML = renderPanel();
   attachEvents(panel);
  });
 }
 function refreshLiveStatsCore() {
  if (_activeCore !== 'security') return;
  const p = document.getElementById('_01studios_panel');
  const body = p && p.querySelector('#_01studios_body');
  if (body) { body.innerHTML = renderSecurityCore(); attachSecurityEvents(); }
 }

 function renderGridSection() {
 return ` <div style="background:#161616;border:1px solid #222;border-radius:10px;padding:10px;position:relative;box-sizing:border-box;"><div id="_01studios_grid" style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;">${buildGridCells()}</div><div id="_01studios_blur_overlay" style="display:none;position:absolute;inset:0;background:rgba(0,0,0,0.35);backdrop-filter:blur(4px);border-radius:10px;z-index:9;pointer-events:auto;align-items:center;justify-content:center;"><div id="_01studios_loading_spinner" style="width:40px;height:40px;border:3px solid #222;border-top:3px solid ${accentColor};border-radius:50%;animation:_01_spin 1s linear infinite;pointer-events:none;"></div></div></div>`;
 }

 function renderFooterBar() {
 return `
 <div style="display:flex;gap:4px;margin-top:8px;flex-wrap:wrap;">
 </div>
 <div style="display:flex;align-items:center;gap:6px;margin-top:6px;">
 <div id="_01studios_game_status_dot" style="display:none;width:8px;height:8px;border-radius:50%;background:#e05555;box-shadow:0 0 6px #e0555588;flex-shrink:0;transition:all 0.3s;"></div>
 <div id="_01studios_status_text" style="font-size:9px;color:transparent;flex:1;user-select:none;pointer-events:none;"></div>
 </div>
 <div id="_01studios_nonce_lookahead" style="display:none;gap:4px;margin-top:4px;"></div>`;
 }

 const ALGO_MODES = [
   { id:'Guardian',  label:'Guardian',   sub:'Low risk · cold zone',            color:'#00c97a' },
   { id:'Vector',    label:'Vector',     sub:'Balanced · EV optimal',            color:accentColor },
   { id:'Phantom',   label:'Phantom',    sub:'High risk · max reward',           color:'#e05555' },
   { id:'Quantum',   label:'Quantum',    sub:'2000 MC sims · history-weighted',  color:'#f5c518' },
 ];

 function renderAlgoSelector() {
   const uc = _getUnionCoreStatus();
   let rows = '';
   for (let i = 0; i < ALGO_MODES.length; i++) {
     const m = ALGO_MODES[i];
     const active = currentAlgo === m.id;
     const sub = '';
     const dot = active ? '<div style="width:6px;height:6px;border-radius:50%;background:' + m.color + ';box-shadow:0 0 6px ' + m.color + ';flex-shrink:0;"></div>' : '';
     rows += '<div class="_01studios_algo_btn" data-algo="' + m.id + '" style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-radius:8px;cursor:pointer;border:1.5px solid ' + (active ? m.color : '#222') + ';background:' + (active ? m.color + '18' : '#161616') + ';transition:all 0.2s;">'
           + '<div>'
           + '<span style="font-size:10px;font-weight:700;letter-spacing:0.8px;color:' + (active ? m.color : '#888') + ';">' + m.label + sub + '</span>'
           + '<div style="font-size:7px;color:#444;margin-top:1px;">' + m.sub + '</div>'
           + '</div>' + dot + '</div>';
   }
   return '<div style="margin:6px 0;">'
        + '<div style="color:#444;font-size:7px;letter-spacing:1.5px;font-weight:700;margin-bottom:5px;">ALGORITHM</div>'
        + '<div style="display:flex;flex-direction:column;gap:3px;">' + rows + '</div>'
        + '</div>';
 }

 function updateAlgoButtons() {
   document.querySelectorAll('._01studios_algo_btn').forEach(btn => {
     const id  = btn.dataset.algo;
     const def = ALGO_MODES.find(m => m.id === id);
     if (!def) return;
     const active = currentAlgo === id;
     btn.style.borderColor = active ? def.color : '#222';
     btn.style.background  = active ? def.color + '18' : '#161616';
     const label = btn.querySelector('span');
     if (label) label.style.color = active ? def.color : '#888';
   });
 }

 function openModal(type) {
 closeModal();
 const overlay = document.createElement('div');
 overlay.id = '_01studios_modal_overlay';
 overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:2147483646;display:flex;align-items:center;justify-content:center;`;
 overlay.addEventListener('click', e => { if(e.target===overlay) closeModal(); });

 const modal = document.createElement('div');
 modal.style.cssText = `background:${DARK_BG};border:1px solid ${CARD_BORDER};border-radius:16px;padding:24px;min-width:360px;max-width:460px;box-shadow:0 20px 60px rgba(0,0,0,0.9);position:relative;`;

 if (type === 'stats') {
 const total = sessionWins + sessionLosses;
 const wr = total > 0 ? Math.round(sessionWins / total * 100) : 0;
 const wrColor = total === 0 ? '#00c97a' : wr >= 60 ? '#00c97a' : wr >= 45 ? '#f5a623' : '#e05555';
 const profitStr = sessionProfit >= 0 ? '+' + sessionProfit.toFixed(1) : sessionProfit.toFixed(1);
 const profitColor = sessionProfit >= 0 ? '#00c97a' : '#e05555';
 const ms = Date.now() - _sessionStartTime;
 const totalSec = Math.floor(ms / 1000);
 const h = Math.floor(totalSec / 3600);
 const mn = Math.floor((totalSec % 3600) / 60);
 const sc = totalSec % 60;
 const elapsed = (h > 0 ? h + 'h ' : '') + (mn > 0 ? mn + 'm ' : '') + sc + 's';
 const streakLabel = winStreak > 1 ? '🔥 ' + winStreak + ' win streak' : lossStreak > 1 ? '❄ ' + lossStreak + ' loss streak' : 'None';
 const streakColor = winStreak > 1 ? '#00c97a' : lossStreak > 1 ? '#e05555' : '#555';
 modal.innerHTML = `
   <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
     <span style="color:#00c97a;font-size:13px;font-weight:700;letter-spacing:2px;">SESSION STATS</span>
     <button id="_01studios_modal_close" style="background:#1a1a1a;border:1px solid #2a2a2a;color:#666;width:28px;height:28px;border-radius:7px;cursor:pointer;font-size:14px;">✕</button>
   </div>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
     <div style="background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:14px;text-align:center;">
       <div style="color:#333;font-size:9px;letter-spacing:1px;margin-bottom:4px;">WINS</div>
       <div style="color:#00c97a;font-size:28px;font-weight:900;">${sessionWins}</div>
     </div>
     <div style="background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:14px;text-align:center;">
       <div style="color:#333;font-size:9px;letter-spacing:1px;margin-bottom:4px;">LOSSES</div>
       <div style="color:#e05555;font-size:28px;font-weight:900;">${sessionLosses}</div>
     </div>
     <div style="background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:14px;text-align:center;">
       <div style="color:#333;font-size:9px;letter-spacing:1px;margin-bottom:4px;">WIN RATE</div>
       <div style="color:${wrColor};font-size:28px;font-weight:900;">${total > 0 ? wr + '%' : '--'}</div>
     </div>
     <div style="background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:14px;text-align:center;">
       <div style="color:#333;font-size:9px;letter-spacing:1px;margin-bottom:4px;">PROFIT</div>
       <div style="color:${profitColor};font-size:28px;font-weight:900;">${profitStr}</div>
     </div>
   </div>
   <div style="background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:10px;">
     <div style="display:flex;justify-content:space-between;align-items:center;">
       <span style="color:#444;font-size:10px;">Session Time</span>
       <span style="color:#777;font-size:10px;font-weight:700;">${elapsed}</span>
     </div>
     <div style="height:1px;background:#1a1a1a;"></div>
     <div style="display:flex;justify-content:space-between;align-items:center;">
       <span style="color:#444;font-size:10px;">Current Streak</span>
       <span style="color:${streakColor};font-size:10px;font-weight:700;">${streakLabel}</span>
     </div>
     <div style="height:1px;background:#1a1a1a;"></div>
     <div style="display:flex;justify-content:space-between;align-items:center;">
       <span style="color:#444;font-size:10px;">Games Played</span>
       <span style="color:#777;font-size:10px;font-weight:700;">${total}</span>
     </div>
     <div style="height:1px;background:#1a1a1a;"></div>
     <div style="display:flex;justify-content:space-between;align-items:center;">
       <span style="color:#444;font-size:10px;">Mine Count</span>
       <span style="color:#777;font-size:10px;font-weight:700;">${mineCount} mines</span>
     </div>
   </div>
   ${total > 0 ? '<div style="margin-top:10px;"><div style="background:#e05555;border-radius:3px;height:4px;overflow:hidden;"><div style="background:#00c97a;height:100%;width:' + wr + '%;border-radius:3px;transition:width 0.4s ease;box-shadow:0 0 6px #00c97a55;"></div></div><div style="display:flex;justify-content:space-between;margin-top:4px;"><span style="font-size:8px;color:#3a3a3a;">Loss</span><span style="font-size:8px;color:#3a3a3a;">Win</span></div></div>' : ''}
 `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  modal.querySelector('#_01studios_modal_close').addEventListener('click', closeModal);

 } else if (type === 'unrig') {
  function randHex(n) {
    let s = ''; const chars = '0123456789abcdef';
    const bytes = crypto.getRandomValues(new Uint8Array(n));
    for (let i = 0; i < n; i++) s += chars[bytes[i] % 16];
    return s;
  }
  function genSeed() { return 'c0da-' + Date.now().toString(36) + '-' + randHex(16); }

  modal.style.cssText = 'background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:20px;min-width:340px;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,0.9);position:relative;';
  modal.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <div>
        <div style="color:#e05555;font-size:13px;font-weight:700;letter-spacing:1px;">UNRIG</div>
        <div style="color:#333;font-size:9px;margin-top:2px;">Resets your client seed on BloxFlip</div>
      </div>
      <button id="_01studios_modal_close" style="background:#161616;border:1px solid #242424;color:#555;width:28px;height:28px;border-radius:7px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>
    <div style="background:#0d0d0d;border:1px solid #1e1e1e;border-radius:10px;padding:12px;margin-bottom:12px;">
      <div style="font-size:9px;color:#333;margin-bottom:6px;letter-spacing:0.8px;">NEW SEED PREVIEW</div>
      <div id="_01_unrig_preview" style="font-family:monospace;font-size:10px;color:#555;word-break:break-all;line-height:1.5;">${genSeed()}</div>
      <button id="_01_unrig_regen" style="margin-top:8px;padding:4px 10px;background:#141414;border:1px solid #252525;color:#555;border-radius:6px;cursor:pointer;font-size:8px;font-weight:700;letter-spacing:0.8px;">↻ REGENERATE</button>
    </div>
    <div id="_01_unrig_status" style="text-align:center;font-size:10px;color:#555;min-height:14px;margin-bottom:10px;"></div>
    <div style="display:flex;gap:8px;">
      <button id="_01_unrig_cancel" style="flex:1;padding:10px;background:#141414;border:1px solid #222;color:#666;border-radius:8px;cursor:pointer;font-size:10px;font-weight:700;">Cancel</button>
      <button id="_01_unrig_apply" style="flex:2;padding:10px;background:linear-gradient(135deg,rgba(224,85,85,0.15),rgba(224,85,85,0.08));border:1.5px solid rgba(224,85,85,0.5);color:#e05555;border-radius:8px;cursor:pointer;font-size:10px;font-weight:800;letter-spacing:1px;">APPLY UNRIG</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  let currentSeed = modal.querySelector('#_01_unrig_preview').textContent;
  modal.querySelector('#_01studios_modal_close').addEventListener('click', closeModal);
  modal.querySelector('#_01_unrig_cancel').addEventListener('click', closeModal);
  modal.querySelector('#_01_unrig_regen').addEventListener('click', () => {
    currentSeed = genSeed();
    modal.querySelector('#_01_unrig_preview').textContent = currentSeed;
  });
  modal.querySelector('#_01_unrig_apply').addEventListener('click', async () => {
    const btn = modal.querySelector('#_01_unrig_apply');
    const st = modal.querySelector('#_01_unrig_status');
    btn.textContent = 'Applying...'; btn.disabled = true; btn.style.opacity = '0.6';
    st.style.color = '#555'; st.textContent = 'Sending to BloxFlip...';
    try {
      const res = await fetch('https://bloxflip.com/api/provably-fair/clientSeed', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientSeed: currentSeed })
      });
      if (res.ok) {
        st.style.color = '#00c97a'; st.textContent = '✓ Seed updated successfully';
        _winsSinceLastUnrig = 0;
        btn.textContent = '✓ Done'; btn.style.color = '#00c97a';
        btn.style.borderColor = 'rgba(0,201,122,0.5)'; btn.style.background = 'rgba(0,201,122,0.08)';
        setTimeout(closeModal, 1200);
      } else {
        st.style.color = '#e05555'; st.textContent = '✗ Failed (status ' + res.status + ')';
        btn.textContent = 'APPLY UNRIG'; btn.disabled = false; btn.style.opacity = '1';
      }
    } catch(err) {
      st.style.color = '#e05555'; st.textContent = '✗ Network error';
      btn.textContent = 'APPLY UNRIG'; btn.disabled = false; btn.style.opacity = '1';
    }
  });

 } else if (type === 'support') {
 modal.style.cssText = 'background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:0;min-width:400px;max-width:440px;box-shadow:0 20px 60px rgba(0,0,0,0.9);position:relative;overflow:hidden;';
 const faqs = [
 { q: 'How accurate is the predictor?', a: 'It reads mine history, streaks and board stats to suggest tiles, but it is not always right. BloxFlip is provably fair, so no tool can see the board ahead of time. Treat the picks as suggestions, not guarantees, and never bet more than you can lose.' },
 { q: 'How do I use it?', a: 'Open a Mines game, set your mine count (it auto-syncs), then hit PREDICT. Safe tiles get highlighted on the grid. Pick those tiles and cash out at or before the suggested target.' },
 { q: 'What is the UNRIG button?', a: 'It rotates your BloxFlip client seed, which resets the RNG sequence. Useful after a bad loss streak. You can also enable auto-unrig in Settings to do this automatically every 5 wins.' },
 { q: 'What do Auto Click / Auto Cash do?', a: 'Auto Click instantly clicks the predicted safe tiles for you. Auto Cash automatically cashes out once you hit your target tile count. Hold the PREDICT button to open the auto menu.' },
 { q: 'How many tiles should I pick?', a: 'Check the "optimal" number next to the Safe Tiles selector - it is calculated from expected value. Lower mine counts let you safely pick more tiles; high mine counts mean fewer.' },
 { q: 'Is this safe to use? Will I get banned?', a: 'The script runs locally in your browser. Auto-click mimics real clicks but use it at your own risk - we suggest keeping sessions short and not running it 24/7.' },
 { q: 'My predictions seem off / not loading', a: 'Make sure you are on a Mines page and have started a game. If predictions return errors, your session may have expired - refresh the page and log back into BloxFlip.' },
 ];
 modal.innerHTML = `
   <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #161616;">
     <div>
       <div style="color:#5865F2;font-size:13px;font-weight:700;letter-spacing:1px;">SUPPORT</div>
       <div style="color:#333;font-size:9px;margin-top:2px;">FAQ & contact</div>
     </div>
     <button id="_01studios_modal_close" style="background:#161616;border:1px solid #242424;color:#555;width:28px;height:28px;border-radius:7px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;">✕</button>
   </div>

   <div style="padding:12px 14px;max-height:360px;overflow-y:auto;">
     <div style="display:flex;flex-direction:column;gap:5px;">
       ${faqs.map((f, i) => `<div class="_01studios_faq_item" data-idx="${i}" style="cursor:pointer;">
         <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:8px;transition:all 0.2s;">
           <span style="color:#ccc;font-size:11px;font-weight:600;">${f.q}</span>
           <span class="_01studios_faq_arrow" style="color:#5865F2;font-size:11px;transition:transform 0.2s;flex-shrink:0;margin-left:8px;">▾</span>
         </div>
         <div class="_01studios_faq_answer" style="display:none;padding:10px 12px;color:#888;font-size:10px;line-height:1.6;background:#080808;border:1px solid #161616;border-top:none;border-radius:0 0 8px 8px;margin-top:-1px;">${f.a}</div>
       </div>`).join('')}
     </div>
   </div>

   <div style="padding:12px 14px;border-top:1px solid #161616;display:flex;flex-direction:column;gap:8px;">
     <div style="color:#333;font-size:9px;letter-spacing:1px;">NEED MORE HELP?</div>
     <button id="_01studios_ticket_discord" style="width:100%;padding:11px;background:linear-gradient(135deg,rgba(88,101,242,0.18),rgba(88,101,242,0.08));border:1px solid rgba(88,101,242,0.4);color:#7984f5;border-radius:9px;cursor:pointer;font-size:11px;font-weight:800;letter-spacing:0.5px;display:flex;align-items:center;justify-content:center;gap:8px;">Join our Discord</button>
   </div>
 `;

 overlay.appendChild(modal);
 document.body.appendChild(overlay);
 modal.querySelector('#_01studios_modal_close').addEventListener('click', closeModal);

 modal.querySelectorAll('._01studios_faq_item').forEach(item => {
 item.addEventListener('click', () => {
 const answer = item.querySelector('._01studios_faq_answer');
 const arrow = item.querySelector('._01studios_faq_arrow');
 const isOpen = answer.style.display !== 'none';
 modal.querySelectorAll('._01studios_faq_answer').forEach(a => a.style.display = 'none');
 modal.querySelectorAll('._01studios_faq_arrow').forEach(a => { a.style.transform = 'none'; });
 if (!isOpen) {
 answer.style.display = 'block';
 arrow.style.transform = 'rotate(180deg)';
 }
 });
 });

 modal.querySelector('#_01studios_ticket_discord').addEventListener('click', () => {
 window.open(_01_DISCORD, '_blank');
 });

 } else if (type === 'analytics') {
  const log = analyticsLog.slice(-100).reverse();
  const total = sessionWins + sessionLosses;
  const wr = total > 0 ? Math.round(sessionWins / total * 100) : 0;
  const rows = log.length === 0
    ? '<div style="text-align:center;color:#333;font-size:11px;padding:30px 0;">No games played yet this session.</div>'
    : log.map(e => {
        const win = e.result === 'win';
        const c = win ? '#00c97a' : '#e05555';
        const icon = win ? '✓' : '✗';
        const mult = e.mult ? e.mult.toFixed(2) + 'x' : '--';
        const betStr = e.bet ? (typeof e.bet === 'number' ? e.bet.toFixed(0) : e.bet) : '--';
        return `<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-bottom:1px solid #141414;">
          <div style="width:18px;height:18px;border-radius:5px;background:${c}18;border:1px solid ${c}44;color:${c};font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${icon}</div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="color:${c};font-size:11px;font-weight:700;">${win ? 'WIN' : 'LOSS'}</span>
              <span style="color:#666;font-size:10px;font-weight:700;">${mult}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;">
              <span style="color:#333;font-size:8px;">${e.mines} mines · ${e.uncovered || 0} safe</span>
              <span style="color:#2e2e2e;font-size:8px;">${e.time || ''}</span>
            </div>
          </div>
        </div>`;
      }).join('');

  modal.style.cssText = 'background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:0;min-width:380px;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.9);position:relative;overflow:hidden;';
  modal.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #161616;">
      <div>
        <div style="color:#fff;font-size:13px;font-weight:700;letter-spacing:1px;">GAME LOGS</div>
        <div style="color:#333;font-size:9px;margin-top:2px;">${total} games · ${wr}% win rate this session</div>
      </div>
      <button id="_01studios_modal_close" style="background:#161616;border:1px solid #242424;color:#555;width:28px;height:28px;border-radius:7px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#141414;border-bottom:1px solid #161616;">
      <div style="background:#0a0a0a;padding:10px;text-align:center;">
        <div style="color:#333;font-size:8px;letter-spacing:1px;margin-bottom:3px;">WINS</div>
        <div style="color:#00c97a;font-size:18px;font-weight:900;">${sessionWins}</div>
      </div>
      <div style="background:#0a0a0a;padding:10px;text-align:center;">
        <div style="color:#333;font-size:8px;letter-spacing:1px;margin-bottom:3px;">LOSSES</div>
        <div style="color:#e05555;font-size:18px;font-weight:900;">${sessionLosses}</div>
      </div>
      <div style="background:#0a0a0a;padding:10px;text-align:center;">
        <div style="color:#333;font-size:8px;letter-spacing:1px;margin-bottom:3px;">PROFIT</div>
        <div style="color:${sessionProfit>=0?'#00c97a':'#e05555'};font-size:18px;font-weight:900;">${sessionProfit>=0?'+':''}${sessionProfit.toFixed(1)}</div>
      </div>
    </div>
    <div style="max-height:340px;overflow-y:auto;">${rows}</div>
    <div style="padding:10px 14px;border-top:1px solid #161616;">
      <button id="_01_logs_clear" style="width:100%;padding:9px;background:#0d0d0d;border:1px solid rgba(224,85,85,0.25);color:#e05555;border-radius:8px;cursor:pointer;font-size:9px;font-weight:700;letter-spacing:1px;">CLEAR LOGS</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  modal.querySelector('#_01studios_modal_close').addEventListener('click', closeModal);
  modal.querySelector('#_01_logs_clear').addEventListener('click', () => {
    analyticsLog = []; _capLog();
    sessionWins = 0; sessionLosses = 0; sessionProfit = 0; winStreak = 0; lossStreak = 0; _sessionGamesPlayed = 0;
    updateStats();
    closeModal();
  });

 } else if (type === 'settings') {
  const AC = accentColor;
  const THEMES = [
    { color:'#00c97a', label:'Green' },
    { color:'#f5c518', label:'Gold' },
    { color:'#e05555', label:'Red' },
    { color:'#4fc3f7', label:'Blue' },
    { color:'#b57bee', label:'Purple' },
    { color:'#f06292', label:'Pink' },
    { color:'#ff9800', label:'Orange' },
    { color:'#f0f0f0', label:'White' },
  ];
  const DELAYS = [
    { id:'instant', label:'Instant' },
    { id:'fast', label:'Fast' },
    { id:'normal', label:'Normal' },
    { id:'slow', label:'Slow' },
  ];
  function tog(id, checked, label, desc) {
    return `<label style="background:#0d0d0d;border:1px solid ${checked ? AC+'33' : '#1e1e1e'};border-radius:8px;padding:9px 12px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:all 0.15s;">
      <div>
        <div style="color:#ccc;font-size:10px;">${label}</div>
        ${desc ? `<div style="color:#2e2e2e;font-size:7px;margin-top:1px;">${desc}</div>` : ''}
      </div>
      <div id="${id}_track" style="width:32px;height:16px;border-radius:8px;background:${checked ? AC : '#252525'};position:relative;flex-shrink:0;transition:background 0.2s;">
        <div id="${id}_thumb" style="width:12px;height:12px;border-radius:50%;background:${checked ? '#000' : '#555'};position:absolute;top:2px;left:${checked ? '18px' : '2px'};transition:all 0.2s;"></div>
      </div>
    </label>`;
  }
  const ap = settings.autoPredict !== false;
  const ct = !!settings.clickThrough;
  const pu = !!settings.preemptiveUnrig;
  const anon = !!settings.anonMode;
  const nochat = !!settings.noChatMode;
  const delay = settings.predDelay || 'normal';
  const customColor = settings.customAccent || '';
  modal.style.cssText = 'min-width:360px;max-width:400px;background:#0a0a0a;border:1px solid #1e1e1e;border-radius:14px;padding:0;overflow:hidden;';
  modal.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #161616;">
      <span style="color:#fff;font-size:12px;font-weight:700;letter-spacing:1px;">Settings</span>
      <button id="_01studios_modal_close" style="background:#161616;border:1px solid #242424;color:#555;width:26px;height:26px;border-radius:7px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>

    <div style="padding:12px 14px;display:flex;flex-direction:column;gap:12px;max-height:460px;overflow-y:auto;">

      <div>
        <div style="font-size:8px;color:#333;letter-spacing:2px;font-weight:700;margin-bottom:6px;">PREDICTOR</div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${tog('_01studios_s_autopredict', ap, 'Auto-predict on game start', '')}
          ${tog('_01studios_s_clickthrough', ct, 'Click-through safe tiles', 'Auto-clicks on BloxFlip grid')}
          ${tog('_01studios_s_preemptive', pu, 'Auto unrig every 5 wins', '')}
        </div>
      </div>

      <div>
        <div style="font-size:8px;color:#333;letter-spacing:2px;font-weight:700;margin-bottom:6px;">PRIVACY</div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${tog('_01studios_s_anon', anon, 'Anonymous mode', 'Blurs usernames & balance')}
          ${tog('_01studios_s_nochat', nochat, 'Hide chat sidebar', '')}
        </div>
      </div>

      <div>
        <div style="font-size:8px;color:#333;letter-spacing:2px;font-weight:700;margin-bottom:6px;">SPEED</div>
        <div style="background:#0d0d0d;border:1px solid #1e1e1e;border-radius:8px;padding:9px 12px;display:flex;justify-content:space-between;align-items:center;">
          <span style="color:#ccc;font-size:10px;">Prediction delay</span>
          <select id="_01studios_s_delay" style="background:#0a0a0a;border:1px solid #252525;color:${AC};border-radius:6px;padding:4px 8px;font-size:9px;cursor:pointer;outline:none;">
            ${DELAYS.map(d => `<option value="${d.id}" ${delay===d.id?'selected':''}>${d.label}</option>`).join('')}
          </select>
        </div>
      </div>

      <div>
        <div style="font-size:8px;color:#333;letter-spacing:2px;font-weight:700;margin-bottom:8px;">THEME</div>
        <div style="background:#0d0d0d;border:1px solid #1e1e1e;border-radius:8px;padding:10px 12px;">
          <div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin-bottom:8px;">
            ${THEMES.map(t => `<div class="_01studios_theme_swatch" data-color="${t.color}" title="${t.label}" style="width:20px;height:20px;border-radius:50%;background:${t.color};cursor:pointer;border:2px solid ${accentColor===t.color?'#fff':'transparent'};transition:all 0.15s;box-shadow:${accentColor===t.color?'0 0 8px '+t.color+'88':'none'};"></div>`).join('')}
            <input id="_01studios_s_colorwheel" type="color" value="${customColor||AC}" title="Custom" style="width:20px;height:20px;border:2px solid #252525;border-radius:50%;cursor:pointer;background:none;padding:0;outline:none;">
          </div>
          <div style="height:3px;border-radius:2px;background:linear-gradient(90deg,${AC}44,${AC});box-shadow:0 0 8px ${AC}55;"></div>
        </div>
      </div>

      <div>
        <div style="font-size:8px;color:#333;letter-spacing:2px;font-weight:700;margin-bottom:6px;">DATA</div>
        <div style="background:#0d0d0d;border:1px solid #1e1e1e;border-radius:8px;padding:9px 12px;display:flex;justify-content:space-between;align-items:center;">
          <span style="color:#ccc;font-size:10px;">Clear session stats</span>
          <button id="_01studios_clear_data" style="background:#0a0a0a;border:1px solid rgba(224,85,85,0.3);color:#e05555;border-radius:6px;padding:4px 10px;font-size:8px;font-weight:700;cursor:pointer;">CLEAR</button>
        </div>
      </div>

    </div>

    <div style="display:flex;gap:6px;padding:10px 14px;border-top:1px solid #161616;">
      <button id="_01studios_reset_pos_btn" style="flex:1;padding:9px;background:#0d0d0d;border:1px solid #1e1e1e;color:#444;border-radius:8px;cursor:pointer;font-size:9px;font-weight:700;">Reset pos</button>
      <button id="_01studios_settings_save" style="flex:2;padding:9px;background:linear-gradient(135deg,${AC}22,${AC}11);border:1px solid ${AC}44;color:${AC};border-radius:8px;cursor:pointer;font-size:10px;font-weight:800;letter-spacing:0.5px;">Save & close</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  modal.querySelector('#_01studios_modal_close').addEventListener('click', closeModal);

if (type === 'settings') {
  const toggleStates = {};
  function initToggle(id, initVal, onChange) {
    const track = modal.querySelector('#' + id + '_track');
    const thumb = modal.querySelector('#' + id + '_thumb');
    const label = track ? track.closest('label') : null;
    if (!track || !thumb) return;
    toggleStates[id] = initVal;
    function paint(val) {
      track.style.background = val ? accentColor : '#252525';
      thumb.style.left = val ? '18px' : '2px';
      thumb.style.background = val ? '#000' : '#555';
      if (label) label.style.borderColor = val ? accentColor + '33' : '#1e1e1e';
    }
    paint(initVal);
    function toggle(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      const nv = !toggleStates[id];
      toggleStates[id] = nv;
      paint(nv);
      onChange(nv);
    }
    if (label) label.addEventListener('click', toggle);
    else track.addEventListener('click', toggle);
  }

  initToggle('_01studios_s_autopredict', settings.autoPredict !== false, v => { settings.autoPredict = v; saveSettings(); });
  initToggle('_01studios_s_clickthrough', !!settings.clickThrough, v => { settings.clickThrough = v; saveSettings(); });
  initToggle('_01studios_s_preemptive', !!settings.preemptiveUnrig, v => { settings.preemptiveUnrig = v; saveSettings(); });
  initToggle('_01studios_s_anon', !!settings.anonMode, v => { settings.anonMode = v; saveSettings(); applyAnonMode(v); });
  initToggle('_01studios_s_nochat', !!settings.noChatMode, v => { settings.noChatMode = v; saveSettings(); applyNoChatMode(v); });

  let pendingAccent = accentColor;
  modal.querySelectorAll('._01studios_theme_swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      pendingAccent = sw.dataset.color;
      modal.querySelectorAll('._01studios_theme_swatch').forEach(s => {
        const on = s.dataset.color === pendingAccent;
        s.style.border = on ? '2px solid #fff' : '2px solid transparent';
        s.style.boxShadow = on ? '0 0 8px ' + pendingAccent + '88' : 'none';
      });
      const cw = modal.querySelector('#_01studios_s_colorwheel');
      if (cw) cw.value = pendingAccent;
    });
  });
  const cw = modal.querySelector('#_01studios_s_colorwheel');
  if (cw) cw.addEventListener('input', () => {
    pendingAccent = cw.value;
    modal.querySelectorAll('._01studios_theme_swatch').forEach(s => {
      s.style.border = '2px solid transparent';
      s.style.boxShadow = 'none';
    });
  });

  const dl = modal.querySelector('#_01studios_s_delay');
  if (dl) dl.addEventListener('change', () => { settings.predDelay = dl.value; saveSettings(); });

  const rp = modal.querySelector('#_01studios_reset_pos_btn');
  if (rp) rp.addEventListener('click', () => {
    resetPos();
    const p = document.getElementById('_01studios_panel');
    if (p) { p.style.left = '20px'; p.style.top = '80px'; }
    closeModal();
  });

  const cd = modal.querySelector('#_01studios_clear_data');
  if (cd) cd.addEventListener('click', () => {
    analyticsLog = []; _capLog(); sessionWins = 0; sessionLosses = 0; sessionProfit = 0; winStreak = 0; lossStreak = 0; _sessionGamesPlayed = 0;
    cd.textContent = 'CLEARED'; cd.style.color = '#00c97a'; cd.style.borderColor = '#00c97a33';
    setTimeout(() => { cd.textContent = 'CLEAR'; cd.style.color = '#e05555'; cd.style.borderColor = 'rgba(224,85,85,0.3)'; }, 1500);
    updateStats(); updateGrid();
  });

  const saveBtn = modal.querySelector('#_01studios_settings_save');
  if (saveBtn) saveBtn.addEventListener('click', () => {
    accentColor = pendingAccent;
    localStorage.setItem('_01studios_accent', accentColor);
    settings.customAccent = pendingAccent;
    settings.predColor = pendingAccent;
    saveSettings();
    closeModal();
    buildGUI();
    setTimeout(() => applyAccentColor(), 50);
  });
 }
 }

 }
 function closeModal() { document.getElementById('_01studios_modal_overlay')?.remove(); }

 function buildGridCells() {
 const total = gridSize * gridSize;
 const cellSize = gridSize<=4?52:gridSize<=5?44:gridSize<=6?36:30;
 const fontSize = cellSize>44?15:12;
 let html = '';
 for (let i = 0; i < total; i++) {
 const p = prediction[i];
 let bg='#111',border='#1e1e1e',content='',glow='',extra='';
 if (p) {
 if (p.isRevealed&&p.isSafe){
 bg='#00c97a18';border='#00c97a55';
 content=`<span style="color:#00c97a;font-size:${fontSize}px;font-weight:700;">v</span>`;
 glow='box-shadow:0 0 8px #00c97a33;';
 } else if(p.isRevealed&&p.isMine){
 bg='#e0555518';border='#e0555544';
 content=`<span style="font-size:${fontSize}px;"></span>`;
 glow='box-shadow:0 0 8px #e0555533;';
 } else if(p.isSuggestedSafe){
 const pc=getPredColor();
 const conf = p.confidence || 0;
 const confColor = conf >= 70 ? '#00c97a' : conf >= 45 ? accentColor : '#e07a30';
 const glowAlpha = Math.round(30 + conf * 0.5).toString(16).padStart(2,'0');
 bg=`linear-gradient(135deg,${pc}28,${pc}18)`;
 border=pc;
 glow=`box-shadow:0 0 ${8+Math.round(conf/10)}px ${pc}${glowAlpha},inset 0 1px 0 ${pc}33;`;
 content=`<div style="display:flex;flex-direction:column;align-items:center;gap:1px;">`
 +`<svg width="${fontSize}" height="${fontSize}" viewBox="0 0 24 24" fill="${pc}"><polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"/></svg>`
 +`<span style="color:${pc};font-size:8px;font-weight:700;opacity:0.9;">${p.pickOrder}</span>`
 +`<span style="color:${confColor};font-size:7px;font-weight:600;opacity:0.85;">${conf}%</span>`
 +`</div>`;
 extra='border-width:1.5px;';
 }
 }
 const isClickable = p && p.isSuggestedSafe && !p.isRevealed;
 const clickStyle = isClickable ? 'cursor:pointer;' : 'cursor:default;';
 html+=`<div data-cidx="${i}" class="_01studios_tile_hover" style="background:${bg};border:1px solid ${border};border-radius:8px;width:${cellSize}px;height:${cellSize}px;display:flex;align-items:center;justify-content:center;${glow}${extra}${clickStyle}overflow:hidden;">${content}</div>`;
 }
 return html;
 }

 function updateStatus(text, color) {
 const debugPhrases = [
 'Waiting for game', 'No game detected', 'AUTO ON', 'waiting for next',
 'Auto click off', 'Auto cashout off', 'Auto start off', 'Ready -- waiting',
 'Auto pressing', 'Clicking tile', 'Auto press done', 'will fire on next',
 'will start new game', 'will cashout after'
 ];
 const isDebug = debugPhrases.some(p => text.includes(p));
 const el=document.getElementById('_01studios_status_text');
 if(el){ el.textContent = isDebug ? '' : text; }
 const dot=document.getElementById('_01studios_game_status_dot');
 if(dot){
 const isActive = color==='#00c97a' || (text&&(text.includes('Game')||text.includes('game')||text.includes('Running')||text.includes('Won')||text.includes('Lost')));
 const noGame = isDebug || (text&&(text.includes('Waiting')||text.includes('No game')));
 if(noGame){dot.style.background='#e05555';dot.style.boxShadow='0 0 6px #e0555588';}
 else if(isActive){dot.style.background='#00c97a';dot.style.boxShadow='0 0 6px #00c97a88';}
 }
 const badge=document.getElementById('_01studios_live_badge');
 if(badge)badge.style.display=color==='#00c97a'?'block':'none';
 }
 function updateGrid() { const g=document.getElementById('_01studios_grid');if(g){g.innerHTML=buildGridCells();} }
 function updateStats(multiplier) {
   const set=(id,val,color)=>{const el=document.getElementById(id);if(el){el.textContent=val;if(color)el.style.color=color;}};
   const total = sessionWins + sessionLosses;
   const wr = total > 0 ? Math.round(sessionWins / total * 100) + '%' : '--';
   const wrNum = total > 0 ? Math.round(sessionWins / total * 100) : 0;
   const wrColor = total === 0 ? '#00c97a' : wrNum >= 60 ? '#00c97a' : wrNum >= 45 ? '#f5a623' : '#e05555';
   set('_01studios_winrate', wr, wrColor);
   set('_01studios_games_ct', String(total), accentColor);
   set('_01studios_profit',(sessionProfit>=0?'+':'')+sessionProfit.toFixed(1),sessionProfit>=0?'#00c97a':'#e05555');
   set('_01studios_mine_count', mineCount);
   set('_01_rc_wins', sessionWins, '#00c97a');
   set('_01_rc_losses', sessionLosses, '#e05555');
   const streakEl = document.getElementById('_01_rc_streak');
   if (streakEl) {
     if (winStreak > 1) { streakEl.textContent = '🔥' + winStreak; streakEl.style.color = '#00c97a'; }
     else if (lossStreak > 1) { streakEl.textContent = '❄' + lossStreak; streakEl.style.color = '#e05555'; }
     else { streakEl.textContent = '--'; streakEl.style.color = '#555'; }
   }
   updateSuggestedBet();updateStrategyBar(lastUncovered.length);
   if (_activeCore === 'security') refreshLiveStatsCore();
 }
 function updateStrategyBar(rc) {
 rc=rc||0;const optimal=findOptimalCashout(mineCount,gridSize*gridSize);const nextP=nextClickProb(mineCount,rc,gridSize*gridSize);
 const set=(id,val,color)=>{const el=document.getElementById(id);if(el){el.textContent=val;if(color)el.style.color=color;}};
 set('_01studios_next_prob',(nextP*100).toFixed(0)+'%',nextP>0.7?'#00c97a':nextP>0.4?accentColor:'#e05555');
 set('_01studios_optimal_tiles',targetTiles+' tiles',accentColor);set('_01studios_target_mult',optimal.mult.toFixed(2)+'x',accentColor);
 const bar=document.getElementById('_01studios_next_prob_bar');if(bar)bar.style.width=(nextP*100).toFixed(0)+'%';
 }
 function updateSuggestedBet() {
 let bet=baseBet;
 if(currentMode==='martingale')bet=Math.min(baseBet*Math.pow(martingaleMultiplier,lossStreak),baseBet*8);
 else if(currentMode==='aggressive')bet=baseBet*Math.pow(2,Math.min(winStreak,3));
 currentBet=Math.round(bet*10)/10;const el=document.getElementById('_01studios_suggested_bet');if(el)el.textContent=currentBet;
 }
 function updateAutoStatusIndicator() {
 const statusEl = document.getElementById('_01studios_auto_status');
 if(!statusEl) return;
 const statuses = [];
 if(_01_autoClick) statuses.push('CLICK');
 if(_01_autoCash) statuses.push('CASH');
 if(_01_autoStart) statuses.push('START');
 if(_01_autoPredict) statuses.push('PREDICT');
 statusEl.textContent = statuses.length > 0 ? statuses.join(' | ') : '';
 statusEl.style.display = statuses.length > 0 ? 'inline' : 'none';
 }

 function updateModeButtons() {
 document.querySelectorAll('._01studios_mode_btn').forEach(btn=>{const active=btn.dataset.mode===currentMode;btn.style.background=active?accentColor+'22':CARD_BG;btn.style.borderColor=active?accentColor:CARD_BORDER;const icon=btn.querySelector('div:first-child');const label=btn.querySelector('div:nth-child(2)');if(icon)icon.style.color=active?accentColor:TEXT_DIM;if(label)label.style.color=active?accentColor:TEXT_MAIN;});
 }
 function updateTileButtons() { updateTileDisplay(); }
 function updateTileDisplay() {
 const maxSafe=Math.max(1,gridSize*gridSize-mineCount);
 const el=document.getElementById('_01studios_tile_count');if(el)el.textContent=targetTiles;
 const bar=document.getElementById('_01studios_tile_bar');if(bar)bar.style.width=Math.round(targetTiles/maxSafe*100)+'%';
 }
 function updateGridSizeButtons() {
 document.querySelectorAll('._01studios_grid_btn').forEach(btn=>{const active=parseInt(btn.dataset.size)===gridSize;btn.style.background=active?accentColor:'#2a2a2a';btn.style.borderColor=active?accentColor:'#333';btn.style.color=active?'#000':TEXT_DIM;});
 }

 function updateLiveBombHeatmap(uncoveredSafe, uncoveredMines) {
 if (!_bombScores) return;
 const bombProb = computeLiveBombProb(mineCount, gridSize, uncoveredSafe, uncoveredMines);
 const total = gridSize * gridSize;
 const grid = document.getElementById('_01studios_grid');
 if (!grid) return;
 const cells = grid.querySelectorAll('[data-cidx]');
 cells.forEach(cell => {
 const i = parseInt(cell.dataset.cidx);
 if (isNaN(i) || i >= total) return;
 const p = prediction[i];
 if (p && !p.isRevealed && !p.isSuggestedSafe && bombProb[i] > 0) {
 const intensity = Math.min(0.45, bombProb[i] * 1.2);
 const alpha = Math.round(intensity * 255).toString(16).padStart(2,'0');
 cell.style.background = `rgba(224,85,85,${intensity.toFixed(2)})`;
 cell.style.borderColor = `#e05555${alpha}`;
 if (bombProb[i] > 0.4 && !cell.querySelector('._01studios_bomb_prob')) {
 const label = document.createElement('span');
 label.className = '_01studios_bomb_prob';
 label.style.cssText = 'color:#e05555;font-size:7px;font-weight:700;position:absolute;bottom:2px;right:3px;';
 label.textContent = Math.round(bombProb[i]*100)+'%';
 cell.style.position = 'relative';
 cell.appendChild(label);
 }
 }
 });
 }

 function updateNonceLookaheadUI() {
 const el = document.getElementById('_01studios_nonce_lookahead');
 if (!el) return;
 if (!_nonceLookahead || _nonceLookahead.length === 0) {
 el.style.display = 'none';
 return;
 }
 el.style.display = 'none'; return;
 const best = _nonceLookahead.reduce((a, b) => b.hotness > a.hotness ? b : a);
 el.innerHTML = _nonceLookahead.map(g => {
 const isBest = g.offset === best.offset;
 const color = g.hotness >= 70 ? '#00c97a' : g.hotness >= 45 ? accentColor : '#555';
 const bg = isBest ? color + '22' : '#1a1a1a';
 const border = isBest ? color : '#2a2a2a';
 return `<div style="background:${bg};border:1px solid ${border};border-radius:6px;padding:4px 6px;text-align:center;flex:1;">
 <div style="color:#555;font-size:8px;font-weight:600;">+${g.offset}</div>
 <div style="color:${color};font-size:10px;font-weight:700;">${g.hotness}%</div>
 ${isBest ? '<div style="color:'+color+';font-size:7px;">HOT</div>' : ''}
 </div>`;
 }).join('');
 }

 function updateRegimeUI() {
 const el = document.getElementById('_01studios_regime_badge');
 if (!el) return;
 const { regime, shift } = _currentRegime;
 const map = {
 shifting: { label: 'SHIFTING', color: '#e07a30', desc: 'Bombs moving -- DriftMap active' },
 stable: { label: 'STABLE', color: '#00c97a', desc: 'Bombs steady -- History Engine boosted' },
 neutral: { label: 'NEUTRAL', color: '#555', desc: 'Mixed pattern' }
 };
 const r = map[regime] || map.neutral;
 el.style.color = r.color;
 el.style.borderColor = r.color + '44';
 el.textContent = r.label;
 el.title = r.desc + (shift ? ` (shift: ${shift})` : '');
 }
 function updateAnalyticsLog() {
 const el=document.getElementById('_01studios_log_list');if(!el)return;
 if(analyticsLog.length===0){el.innerHTML='<span style="color:#444;">No games played yet.</span>';return;}
 el.innerHTML=analyticsLog.slice(-50).reverse().map(e=>{const c=e.result==='win'?'#00c97a':'#e05555';return`<div style="color:${c};padding:4px 0;border-bottom:1px solid #222;">[${e.time}] ${e.result.toUpperCase()} - ${e.mines} - ${e.mult?.toFixed(2)||'?'}x - ${e.uncovered} safe</div>`;}).join('');
 }
 function triggerPrediction(uncoveredSafe, uncoveredMines, delayOverlay) {
 const delayMap = { instant:0, fast:300, normal:800, slow:1500 };
 const predDelay = delayMap[settings.predDelay || 'instant'] ?? 0;
        async function doPredict() {
          mineCount = readMineCount();
          prediction = await generatePrediction();
          const algoLabel = currentAlgo;
          updateStatus(algoLabel + ' - ' + prediction.filter(p=>p.isSuggestedSafe).length + ' tiles marked', accentColor);
          updateGrid();
          updateStrategyBar(uncoveredSafe?uncoveredSafe.length:0);
          updateStats();
          updateTileButtons();
          clearBoardOverlay();
          injectOverlayStyles();
          updateBoardOverlay(0);
          updateLiveBombHeatmap(uncoveredSafe||[], uncoveredMines||[]);
        }

 async function afterPredict() {
 await doPredict();
 if (autoPressEnabled) {
 if (!autoPressActive) {
 _minesSequenceLock = false;
 _minesSequenceComplete = false;
 }
 setTimeout(() => runAutoPress(), 200);
 }
 }
 if (predDelay > 0) setTimeout(afterPredict, predDelay);
 else afterPredict();
 }
 function checkCashoutAlert(revealedCount) {
 const total = gridSize * gridSize;
 const optimal = findOptimalCashout(mineCount, total);
 const currentEV = survivalProb(mineCount, revealedCount, total) * calcMultiplier(mineCount, revealedCount, total);
 const nextEV = survivalProb(mineCount, revealedCount + 1, total) * calcMultiplier(mineCount, revealedCount + 1, total);
 const pastOptimal = revealedCount >= optimal.tiles;
 const evDropping = nextEV < currentEV * 0.97;

 if (settings.alertCashout && (pastOptimal || evDropping)) {
 const currentMult = calcMultiplier(mineCount, revealedCount, total);
 updateStatus(`* CASH OUT NOW! ${currentMult.toFixed(2)}x -- EV peak reached!`, accentColor);
 }

 if (autoCashoutEnabled && gameRunning && revealedCount > 0) {
 if (revealedCount < targetTiles) return;

 const evThreshold = settings.evCashoutThreshold || 0.97;
 if (nextEV < currentEV * evThreshold || pastOptimal) {
 if (autoPressEnabled) {
 if (!_minesSequenceComplete) return;
 } else {
 if (autoPressActive || _minesSequenceLock) return;
 }

 const currentMult = calcMultiplier(mineCount, revealedCount, total);
 updateStatus(` EV cashout -- ${currentMult.toFixed(2)}x (next click EV drops ${((1-nextEV/currentEV)*100).toFixed(0)}%)`, '#00c97a');
 setTimeout(() => {
 if (!autoPressActive && !_minesSequenceLock) performAutoCashout();
 }, 400);
 }
 }
 }

 function attachEvents(panel) {
 panel.addEventListener('mousedown', e => { e.stopPropagation(); });
 panel.addEventListener('click', e => { e.stopPropagation(); });

 const header=panel.querySelector('#_01studios_header');
 header.addEventListener('mousedown',e=>{if(!e.isTrusted)return;if(e.target.tagName==='BUTTON'||e.target.tagName==='INPUT')return;isDragging=true;const r=panel.getBoundingClientRect();dragOffsetX=e.clientX-r.left;dragOffsetY=e.clientY-r.top;panel.style.transition='none';e.preventDefault();});
 document.addEventListener('mousemove',e=>{if(!isDragging||!e.isTrusted)return;e.preventDefault();const x=Math.max(0,Math.min(window.innerWidth-panel.offsetWidth,e.clientX-dragOffsetX));const y=Math.max(0,Math.min(window.innerHeight-panel.offsetHeight,e.clientY-dragOffsetY));panel.style.left=x+'px';panel.style.top=y+'px';});
 document.addEventListener('mouseup',e=>{if(!e.isTrusted)return;if(isDragging){isDragging=false;panel.style.transition='';savePos(parseInt(panel.style.left),parseInt(panel.style.top));}});
 const homeBtn = panel.querySelector('#_01studios_home_btn'); if (homeBtn) { homeBtn.addEventListener('click', () => { window._01_activeTab = window._01_activeTab === 'home' ? 'main' : 'home'; panel.innerHTML = renderPanel(); attachEvents(panel); homeBtn.style.background = window._01_activeTab === 'home' ? accentColor + '33' : '#1a1a1a'; homeBtn.style.borderColor = window._01_activeTab === 'home' ? accentColor + '88' : '#2a2a2a'; }); } panel.querySelector('#_01studios_minimize').addEventListener('click',()=>{panelMinimized=!panelMinimized;const body=panel.querySelector('#_01studios_body');const cores=panel.querySelector('#_01studios_core_popup')?.parentElement;if(body)body.style.display=panelMinimized?'none':'';if(cores)cores.style.display=panelMinimized?'none':'';panel.querySelector('#_01studios_minimize').textContent=panelMinimized?'+':'-';});

 const secCoreItem = panel.querySelector('#_01studios_core_security');
 if (secCoreItem) secCoreItem.addEventListener('click', (e) => {
  e.stopPropagation();
  _activeCore = 'security';
  panel.innerHTML = renderPanel();
  attachEvents(panel);
  attachSecurityEvents();
 });

 if (_activeCore === 'security') attachSecurityEvents();

 const menuBtn = panel.querySelector('#_01studios_menu_btn');
 if (menuBtn) {
 menuBtn.addEventListener('click', (e) => {
 e.stopPropagation();
 openRadial();
 });
 }

 panel.querySelectorAll('._01studios_mode_btn').forEach(btn=>btn.addEventListener('click',()=>{currentMode=btn.dataset.mode;updateModeButtons();}));
 panel.querySelectorAll('._01studios_algo_btn').forEach(btn => {
   btn.addEventListener('click', () => {
     currentAlgo = btn.dataset.algo;
     localStorage.setItem('_01studios_algo', currentAlgo);
     updateAlgoButtons();
   });
 });
 
 setTimeout(() => { updateAutoPressBtn(); updateAutoCashoutBtn(); updateAutoStartBtn(); updateAutoPredictBtn(); }, 0);
 panel.querySelector('#_01studios_tile_dec')?.addEventListener('click',()=>{
 const maxSafe=Math.max(1,gridSize*gridSize-mineCount);
 if(targetTiles>1){targetTiles--;updateTileDisplay();}
 });
 panel.querySelector('#_01studios_tile_inc')?.addEventListener('click',()=>{
 const maxSafe=Math.max(1,gridSize*gridSize-mineCount);
 if(targetTiles<Math.min(20,maxSafe)){targetTiles++;updateTileDisplay();}
 });

 const tileSlider = panel.querySelector('#_01studios_tile_slider');
 if(tileSlider) {
 let isDraggingSlider = false;
 tileSlider.addEventListener('mousedown', (e) => {
 isDraggingSlider = true;
 const rect = tileSlider.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
 const maxSafe = Math.max(1, gridSize * gridSize - mineCount);
 targetTiles = Math.max(1, Math.min(Math.round((percent / 100) * maxSafe), Math.min(20, maxSafe)));
 updateTileDisplay();
 });
 document.addEventListener('mousemove', (e) => {
 if(!isDraggingSlider) return;
 const rect = tileSlider.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
 const maxSafe = Math.max(1, gridSize * gridSize - mineCount);
 targetTiles = Math.max(1, Math.min(Math.round((percent / 100) * maxSafe), Math.min(20, maxSafe)));
 updateTileDisplay();
 });
 document.addEventListener('mouseup', () => { isDraggingSlider = false; });
 }

 const predictBtn = panel.querySelector('#_01studios_predict_btn');

 function updatePredictBtnLabel() { _01_setPredictLabel(); }
 updatePredictBtnLabel();
 const quickMenu = panel.querySelector('#_01studios_quick_menu');
 if(predictBtn) {
 let holdTimer = null;
 let menuOpened = false;
 predictBtn.addEventListener('mousedown', (e) => {
 e.stopPropagation();
 menuOpened = false;
 holdTimer = setTimeout(() => {
 menuOpened = true;
 quickMenu.style.display = 'grid';
 }, 1200);
 });
 predictBtn.addEventListener('mouseup', (e) => {
 e.stopPropagation();
 if(holdTimer) {
 clearTimeout(holdTimer);
 holdTimer = null;
 }
  if(!menuOpened) {
   if(!gameRunning) {
     updateStatus('Start a game first', '#888');
     return;
   }
   if(_01_predictLoading) return;
   _01_predictLoading = true;
   if(_01_predictSpinnerTimer) clearTimeout(_01_predictSpinnerTimer);
   const blurOverlay = panel.querySelector('#_01studios_blur_overlay');
   if(blurOverlay) blurOverlay.style.display = 'flex';
   _01_predictSpinnerTimer = setTimeout(() => {
     if(blurOverlay) blurOverlay.style.display = 'none';
     _01_predictLoading = false;
     _01_predictSpinnerTimer = null;
   }, 1500);
   triggerPrediction(lastUncovered || [], []);
   _predictCount++;
   updatePredictBtnLabel();
  }
 });

 if(quickMenu) {
 document.getElementById('_01studios_menu_autopress').addEventListener('click', () => { autoPressTiles(); updateAutoPressBtn(); updateAutoStatusIndicator(); quickMenu.style.display = 'none'; });
 document.getElementById('_01studios_menu_autocash').addEventListener('click', () => { toggleAutoCashout(); updateAutoCashoutBtn(); updateAutoStatusIndicator(); quickMenu.style.display = 'none'; });
 document.getElementById('_01studios_menu_autostart').addEventListener('click', () => { toggleAutoStart(); updateAutoStartBtn(); updateAutoStatusIndicator(); quickMenu.style.display = 'none'; });
 
  const quickMenuButtons = document.querySelectorAll('[id^="_01studios_menu_"]');
  quickMenuButtons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.background = '#00ff8822';
      this.style.borderColor = '#00ff88';
      this.style.boxShadow = '0 0 15px #00ff8844';
      this.style.transform = 'scale(1.05)';
    });
    btn.addEventListener('mouseleave', function() {
      this.style.background = '#161616';
      this.style.borderColor = '#222';
      this.style.boxShadow = 'none';
      this.style.transform = 'scale(1)';
    });
  });

  document.getElementById('_01studios_menu_autopredict').addEventListener('click', () => {
    settings.autoPredict = (settings.autoPredict === false);
    _01_autoPredict = settings.autoPredict;
    saveSettings();
    updateAutoPredictBtn();
    updateAutoStatusIndicator();
    if (settings.autoPredict && gameRunning) triggerPrediction(lastUncovered || [], []);
  });
 quickMenu.addEventListener('click', (e) => e.stopPropagation());
 document.addEventListener('click', (e) => {
 if(quickMenu.style.display === 'grid' && !quickMenu.contains(e.target) && e.target !== predictBtn) {
 quickMenu.style.display = 'none';
 }
 });
 }
 }

 const mineDec = panel.querySelector('#_01studios_mine_dec');
 if (mineDec) mineDec.addEventListener('click',()=>{if(mineCount>1){mineCount--;updateStats();}});
 const mineInc = panel.querySelector('#_01studios_mine_inc');
 if (mineInc) mineInc.addEventListener('click',()=>{if(mineCount<gridSize*gridSize-1){mineCount++;updateStats();}});

 const gridEl = panel.querySelector('#_01studios_grid');
 if (gridEl) {
 gridEl.addEventListener('click', e => {
 const cell = e.target.closest('[data-cidx]');
 if (!cell) return;
 const idx = parseInt(cell.dataset.cidx, 10);
 const p = prediction[idx];
 if (!p || !p.isSuggestedSafe || p.isRevealed) return;
 clickBloxFlipTile(idx);
 });
 }
 const ridBtn = panel.querySelector('#_01studios_round_id');
 if (ridBtn) {
 ridBtn.addEventListener('click', () => {
 const uuid = ridBtn._fullUUID;
 if (!uuid) { updateStatus('No round ID yet -- start a game first.', TEXT_DIM); return; }
 const notif = document.createElement('div');
 notif.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a1a1a;border:1px solid ${accentColor}44;color:${accentColor};padding:10px 18px;border-radius:10px;font-size:11px;font-family:monospace;z-index:2147483648;box-shadow:0 4px 20px rgba(0,0,0,0.8);letter-spacing:1px;cursor:pointer;`;
 notif.textContent = uuid;
 notif.title = 'Click to copy';
 notif.addEventListener('click', () => { navigator.clipboard.writeText(uuid).catch(()=>{}); notif.textContent = 'Copied!'; setTimeout(()=>notif.remove(), 1000); });
 document.body.appendChild(notif);
 setTimeout(() => notif.remove(), 4000);
 });
 }
        var _mRainTgl = panel.querySelector('#_01studios_rain_toggle');
        if (_mRainTgl) _mRainTgl.addEventListener('click', function() {
            _rainAutoJoin = !_rainAutoJoin;
            this.style.background = _rainAutoJoin ? '#00c97a' : '#333';
            var th = this.querySelector('div'); if(th) th.style.left = _rainAutoJoin ? '18px' : '2px';
            var st = document.getElementById('_01studios_rain_status');
            if (st) { st.textContent = _rainAutoJoin ? 'Watching' : 'Off'; st.style.color = _rainAutoJoin ? '#00c97a' : '#e05555'; }
        });

 panel.querySelector('#_01studios_union_core_btn')?.addEventListener('click', () => {
            closeModal();
            const overlay = document.createElement('div');
            overlay.id = '_01studios_modal_overlay';
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:2147483646;display:flex;align-items:center;justify-content:center;';
            overlay.addEventListener('click', e => { if(e.target===overlay) closeModal(); });
            const modal = document.createElement('div');
            modal.style.cssText = `background:${DARK_BG};border:1px solid ${CARD_BORDER};border-radius:16px;padding:24px;min-width:360px;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.9);`;
            modal.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <img src="${_UNION_CORE_SVG}" style="width:24px;height:24px;"/>
                        <span style="color:${accentColor};font-size:13px;font-weight:700;letter-spacing:2px;">UNION CORE</span>
                    </div>
                    <button id="_01studios_uc_close" style="background:#2a2a2a;border:1px solid #333;color:#888;width:28px;height:28px;border-radius:7px;cursor:pointer;font-size:16px;">X</button>
                </div>
                <div style="color:#555;font-size:10px;margin-bottom:14px;">Choose how algorithms are selected each game.</div>
                <div id="_01studios_uc_auto" style="background:${_unionCoreEnabled?accentColor+'18':CARD_BG};border:1.5px solid ${_unionCoreEnabled?accentColor:CARD_BORDER};border-radius:12px;padding:14px 16px;cursor:pointer;margin-bottom:8px;transition:all 0.2s;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <div style="color:${_unionCoreEnabled?accentColor:TEXT_MAIN};font-size:13px;font-weight:700;">Auto Select</div>
                            <div style="color:#555;font-size:9px;margin-top:3px;">Union Core picks the best 4 algorithms each game based on mine count, history depth, and streak data.</div>
                        </div>
                        <div style="width:18px;height:18px;border-radius:50%;border:2px solid ${_unionCoreEnabled?accentColor:'#444'};background:${_unionCoreEnabled?accentColor:'transparent'};flex-shrink:0;margin-left:12px;display:flex;align-items:center;justify-content:center;">${_unionCoreEnabled?'<div style="width:8px;height:8px;border-radius:50%;background:#000;"></div>':''}</div>
                    </div>
                </div>
                <div id="_01studios_uc_manual" style="background:${!_unionCoreEnabled?accentColor+'18':CARD_BG};border:1.5px solid ${!_unionCoreEnabled?accentColor:CARD_BORDER};border-radius:12px;padding:14px 16px;cursor:pointer;margin-bottom:14px;transition:all 0.2s;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <div style="color:${!_unionCoreEnabled?accentColor:TEXT_MAIN};font-size:13px;font-weight:700;">Manual Select</div>
                            <div style="color:#555;font-size:9px;margin-top:3px;">Choose your own algorithms from all 31. Opens the full algorithm picker.</div>
                        </div>
                        <div style="width:18px;height:18px;border-radius:50%;border:2px solid ${!_unionCoreEnabled?accentColor:'#444'};background:${!_unionCoreEnabled?accentColor:'transparent'};flex-shrink:0;margin-left:12px;display:flex;align-items:center;justify-content:center;">${!_unionCoreEnabled?'<div style="width:8px;height:8px;border-radius:50%;background:#000;"></div>':''}</div>
                    </div>
                </div>
                <div style="color:#555;font-size:9px;border-top:1px solid #222;padding-top:8px;">Currently: ${currentAlgo} · Session: ${analyticsLog.length} games</div>
            `;
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            modal.querySelector('#_01studios_uc_close').addEventListener('click', closeModal);
            modal.querySelector('#_01studios_uc_auto').addEventListener('click', () => {
                _unionCoreEnabled = true;
                localStorage.setItem('_01studios_union_core', '1');
                closeModal();
                buildGUI();
                if (gameRunning) triggerPrediction(lastUncovered || [], []);
            });
            modal.querySelector('#_01studios_uc_manual').addEventListener('click', () => {
                _unionCoreEnabled = false;
                localStorage.setItem('_01studios_union_core', '0');
                closeModal();
                openModal('algo');
            });
        });
        const regenBtn = panel.querySelector('#_01studios_regen');
 if (regenBtn) {
   regenBtn.addEventListener('click',()=>{
     if (!currentGameData) { updateStatus('No active game to re-predict.', TEXT_DIM); return; }
     triggerPrediction(lastUncovered || [], []);
     updateStatus('Prediction refreshed.', accentColor);
     setTimeout(()=>updateStatus('Waiting for game...', TEXT_DIM), 1500);
   });
 }
 const newgameBtn = panel.querySelector('#_01studios_newgame');
 if (newgameBtn) newgameBtn.addEventListener('click',()=>{prediction=[];lastUUID=null;lastActive=false;lastUncovered=[];currentGameData=null;updateGrid();clearBoardOverlay();updateStatus('Ready -- waiting for game...',TEXT_DIM);});
 panel.querySelector('#_01studios_base_bet')?.addEventListener('change',e=>{baseBet=parseFloat(e.target.value)||1;updateSuggestedBet();});
 panel.querySelector('#_01studios_stop_loss')?.addEventListener('change',e=>{settings.stopLoss=parseFloat(e.target.value)||0;saveSettings();});
 panel.querySelector('#_01studios_take_profit')?.addEventListener('change',e=>{settings.takeProfit=parseFloat(e.target.value)||0;saveSettings();});
 document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;if((e.key==='p'||e.key==='P')&&gameRunning)triggerPrediction(lastUncovered,[]);if(e.key==='m'||e.key==='M')panel.querySelector('#_01studios_minimize').click();if(e.key==='1'){currentMode='smart';updateModeButtons();}if(e.key==='2'){currentMode='safe';updateModeButtons();}if(e.key==='3'){currentMode='aggressive';updateModeButtons();}if(e.key==='4'){currentMode='martingale';updateModeButtons();}});
 }

 let _minesPoller = null;
 function startPoller() {
 if (_minesPoller) clearInterval(_minesPoller);
 _minesPoller = setInterval(() => {
 if (settings.autoSync !== false && !gameRunning) {
 const nm = readMineCount();
 if (nm !== mineCount) {
 mineCount = nm;
 const el = document.getElementById('_01studios_mine_count');
 if (el) el.textContent = mineCount;
 const rcEl = document.getElementById('_01_rc_mines');
 if (rcEl) rcEl.textContent = mineCount;
 updateGrid();
 updateStrategyBar(lastUncovered.length);
 updateTileButtons();
 }
 }

 const state = getGameState();
 if (!state) return;
 const game = state.game;

 if (!game) {
 if (gameRunning) {
 gameRunning = false;
 autoPressActive = false;
 updateStatus(autoPressEnabled ? ' AUTO ON -- waiting for next game...' : 'Waiting for game...', autoPressEnabled ? accentColor : '#888');
 }
 return;
 }

 const { uuid, active, exploded, minesAmount, uncoveredLocations = [], betAmount } = game;
 const mines = minesAmount || mineCount;

 if (uuid !== lastUUID) {
 if (lastUUID !== null && currentGameData !== null && !currentGameData._recorded) {
 currentGameData._recorded = true;
 
 _predictCount = 0;
 _01_setPredictLabel();
 const prev = currentGameData;
 const prevMult = lastMult || 1;
 if (prev.exploded === true) {
 if (!prev._lossRecorded) {
 const minePos = prev.badMineUncovered;
 const prevMines = prev.minesAmount || mineCount;
 sessionLosses++; lossStreak++; winStreak = 0;
 sessionProfit -= (prev.betAmount || 0);
 const prevMinePosArr = minePos >= 0 ? [minePos] : [];
 analyticsLog.push({ time: new Date().toLocaleTimeString(), result: 'loss', mines: prevMines, mult: prevMult, uncovered: (prev.uncoveredLocations || []).length, minePos, minePosArr: prevMinePosArr, uncoveredSafe: prev.uncoveredLocations || [], bet: prev.betAmount, uuid: lastUUID });
 _capLog();
 recordMineHistory(prevMines, prevMinePosArr, 'loss', lastUUID, prev.uncoveredLocations || []);
 updateStats(prevMult); updateAnalyticsLog();
 }
 } else if (prev.active === false && prev.exploded === false) {
 if (!prev._winRecorded) {
 const prevMines = prev.minesAmount || mineCount;
 sessionWins++; winStreak++; lossStreak = 0;
 const prevBet = prev.betAmount || 0;
 const prevPayout = lastPayoutAmount > 0 ? lastPayoutAmount : 0;
 const prevProfit = prevPayout > 0 ? (prevPayout - prevBet) : ((prevMult - 1) * prevBet);
 const prevDispMult = prevPayout > 0 && prevBet > 0 ? (prevPayout / prevBet) : prevMult;
 sessionProfit += prevProfit;
 analyticsLog.push({ time: new Date().toLocaleTimeString(), result: 'win', mines: prevMines, mult: prevDispMult, uncovered: (prev.uncoveredLocations || []).length, minePosArr: [], uncoveredSafe: prev.uncoveredLocations || [], bet: prev.betAmount, uuid: lastUUID });
 _capLog();
 recordMineHistory(prevMines, [], 'win', lastUUID, prev.uncoveredLocations || []);
 updateStats(prevDispMult); updateAnalyticsLog();
 }
 } else if (prev.active === true && prev.exploded !== true && !prev._winRecorded) {
 const prevMines = prev.minesAmount || mineCount;
 sessionWins++; winStreak++; lossStreak = 0;
 const prevBet2 = prev.betAmount || 0;
 const prevPayout2 = lastPayoutAmount > 0 ? lastPayoutAmount : 0;
 const prevProfit2 = prevPayout2 > 0 ? (prevPayout2 - prevBet2) : ((prevMult - 1) * prevBet2);
 const prevDispMult2 = prevPayout2 > 0 && prevBet2 > 0 ? (prevPayout2 / prevBet2) : prevMult;
 sessionProfit += prevProfit2;
 analyticsLog.push({ time: new Date().toLocaleTimeString(), result: 'win', mines: prevMines, mult: prevDispMult2, uncovered: (prev.uncoveredLocations || []).length, minePosArr: [], uncoveredSafe: prev.uncoveredLocations || [], bet: prev.betAmount, uuid: lastUUID });
 _capLog();
 recordMineHistory(prevMines, [], 'win', lastUUID, prev.uncoveredLocations || []);
 updateStats(prevDispMult2); updateAnalyticsLog();
 }
 }

 lastUUID = uuid;
 lastActive = active;
 lastUncovered = [];
 mineCount = mines;
 currentGameData = game;
 prediction = [];
 lastPayoutAmount = 0;
 autoPressActive = false;
 _minesSequenceLock = false;
 _minesSequenceComplete = false;
 clearBoardOverlay();
 updateGrid();

 if (!exploded) {
 gameRunning = true;
 updateStatus(`LIVE GAME -- ${mines} mines`, '#00c97a');
 const rid = document.getElementById('_01studios_round_id');
 if (rid) { rid.textContent = 'ROUND ' + uuid.substring(0, 8) + '...'; rid.style.color = accentColor; }
 try { const ridBtn = document.getElementById('_01studios_round_id'); if (ridBtn) ridBtn._fullUUID = uuid; } catch {}
 _sessionGamesPlayed++;
 _autoPredictFired = false;
 _predictCount = 0;
 _01_setPredictLabel();
 if (settings.autoPredict !== false) {
 const capturedGame = game;
 _autoPredictFired = true;
 setTimeout(() => {
 currentGameData = capturedGame;
 triggerPrediction([], []);
 _01_setPredictLabel();
 }, 100);
 } else {
 updateStrategyBar(0);
 }
 updateStats(state.multiplier);
 } else {
 gameRunning = false;
 autoPressActive = false;
 _predictCount = 0;
 _01_setPredictLabel();
 prediction = []; clearBoardOverlay(); updateGrid();
 updateStatus('Waiting for game...', '#888');
 updateStats(state.multiplier);
 }
 return;
 }

 if (uuid === lastUUID && state.multiplier) lastMult = state.multiplier;
 if (uuid === lastUUID && state.payoutAmount > 0) lastPayoutAmount = state.payoutAmount;

 if (uuid === lastUUID && active === true && !exploded) {
 const newCells = uncoveredLocations.filter(i => !lastUncovered.includes(i));
 if (newCells.length > 0) {
 lastUncovered = [...uncoveredLocations];
 currentGameData = game;
 if (prediction.length > 0) {
 uncoveredLocations.forEach(idx => {
 if (prediction[idx]) {
 prediction[idx].isRevealed = true;
 prediction[idx].isSafe = true;
 prediction[idx].isMine = false;
 prediction[idx].isSuggestedSafe = false;
 }
 });
 }
 if (uncoveredLocations.length >= targetTiles) {
 updateGrid();
 injectOverlayStyles();
 updateBoardOverlay(0);
 updateStatus(`* TARGET REACHED -- cash out now! (${uncoveredLocations.length}/${targetTiles} tiles)`, accentColor);
 const canCashout = !autoPressEnabled || _minesSequenceComplete;
 if (autoCashoutEnabled && canCashout && !autoPressActive && !_minesSequenceLock) {
 setTimeout(() => {
 if (!autoPressActive && !_minesSequenceLock) performAutoCashout();
 }, 400);
 }
 } else {

 if (settings.autoPredict !== false && !autoPressActive && !_minesSequenceLock && !_autoPredictFired) {
 _autoPredictFired = true;
 generatePrediction().then(pred => {
 prediction = pred;
 uncoveredLocations.forEach(idx => {
 if (prediction[idx]) {
 prediction[idx].isRevealed = true;
 prediction[idx].isSafe = true;
 prediction[idx].isMine = false;
 prediction[idx].isSuggestedSafe = false;
 }
 });
 updateGrid();
 injectOverlayStyles();
 updateBoardOverlay(0);
 });
 }
 updateGrid();
 injectOverlayStyles();
 updateBoardOverlay(0);
 updateStatus(`LIVE -- ${uncoveredLocations.length} revealed - ${mines} mines`, '#00c97a');
 }
 updateStrategyBar(uncoveredLocations.length);
 updateStats(state.multiplier);
 checkCashoutAlert(uncoveredLocations.length);
 }
 return;
 }

 if (uuid === lastUUID && exploded === true && _predictCount !== 0) {
 _predictCount = 0;
 _01_setPredictLabel();
 prediction = []; clearBoardOverlay(); updateGrid();
 }

 if (uuid === lastUUID && exploded === true && gameRunning === true) {
 lastActive = false;
 gameRunning = false;
 autoPressActive = false;
 _predictCount = 0;
 _01_setPredictLabel();
 game._lossRecorded = true;
 game._recorded = true;
 currentGameData = game;
 const minePos = game.badMineUncovered;
 if (prediction.length > 0 && minePos >= 0) {
 prediction[minePos] = { index: minePos, isMine: true, isRevealed: true, isSafe: false, isSuggestedSafe: false };
 }
 let allMinePosArr = minePos >= 0 ? [minePos] : [];
 try {
 const totalCells = gridSize * gridSize;
 for (let ci = 0; ci < totalCells; ci++) {
 const tileEl = document.querySelector(`[aria-label="Open mine ${ci + 1}"]`);
 if (!tileEl) continue;
 const isMineCell = tileEl.querySelector('[class*="mine"]') || tileEl.querySelector('[class*="bomb"]') || tileEl.querySelector('img[src*="mine"]') || tileEl.querySelector('img[src*="bomb"]');
 const hasMineStyle = tileEl.className && (/mine|bomb|explod/i.test(tileEl.className) || /mine|bomb|explod/i.test(tileEl.innerHTML));
 if ((isMineCell || hasMineStyle) && !allMinePosArr.includes(ci)) {
 allMinePosArr.push(ci);
 }
 }
 if (game.mineLocations && Array.isArray(game.mineLocations)) {
 for (const pos of game.mineLocations) {
 if (typeof pos === 'number' && pos >= 0 && pos < totalCells && !allMinePosArr.includes(pos)) {
 allMinePosArr.push(pos);
 }
 }
 }
 } catch(scanErr) { console.warn('[01S] Mine scan error:', scanErr); }
 prediction = []; currentGameData = null; updateGrid(); clearBoardOverlay();
 sessionLosses++; lossStreak++; winStreak = 0;
 sessionProfit -= (betAmount || 0);
 analyticsLog.push({ time: new Date().toLocaleTimeString(), result: 'loss', mines, mult: state.multiplier, uncovered: uncoveredLocations.length, minePos, minePosArr: allMinePosArr, uncoveredSafe: uncoveredLocations, bet: betAmount, uuid });
 _capLog();
 recordMineHistory(mines, allMinePosArr, 'loss', uuid, uncoveredLocations || []);
 updateStatus(` Mine hit -- cell ${minePos + 1} - ${allMinePosArr.length} mines recorded - Loss streak: ${lossStreak}`, '#e05555');
 updateStats(state.multiplier); updateAnalyticsLog();
 checkRigDetection('loss', minePos, mines, betAmount || 0);
 collectSeedData(game, 'loss', allMinePosArr);
 if (settings.stopLoss > 0 && Math.abs(sessionProfit) >= settings.stopLoss) {
 updateStatus('STOP LOSS HIT -- stop playing!', '#e05555');
 } else if (autoStartEnabled) {
 setTimeout(() => performAutoStart(), 1200);
 }
 return;
 }

 if (uuid === lastUUID && active === false && exploded === false && _predictCount !== 0) {
 _predictCount = 0;
 _01_setPredictLabel();
 prediction = []; clearBoardOverlay(); updateGrid();
 }

 if (uuid === lastUUID && active === false && exploded === false && gameRunning === true) {
 lastActive = false;
 gameRunning = false;
 autoPressActive = false;
 game._winRecorded = true;
 game._recorded = true;
 currentGameData = game;
 sessionWins++; winStreak++; lossStreak = 0;
 const domPayout = lastPayoutAmount > 0 ? lastPayoutAmount : (state.payoutAmount || 0);
 const bet = betAmount || 0;
 const effectiveMult = state.multiplier || lastMult || 1;
 const profit = domPayout > 0 ? (domPayout - bet) : ((effectiveMult - 1) * bet);
 const displayMult = domPayout > 0 && bet > 0 ? (domPayout / bet) : effectiveMult;
 sessionProfit += profit;
 let winMinePosArr = [];
 if (game.mineLocations && Array.isArray(game.mineLocations) && game.mineLocations.length > 0) {
 winMinePosArr = game.mineLocations.filter(p => typeof p === 'number' && p >= 0 && p < gridSize * gridSize);
 }
 analyticsLog.push({ time: new Date().toLocaleTimeString(), result: 'win', mines, mult: displayMult, uncovered: uncoveredLocations.length, minePosArr: winMinePosArr, uncoveredSafe: uncoveredLocations, bet: betAmount, uuid });
 _capLog();
 recordMineHistory(mines, winMinePosArr, 'win', uuid, uncoveredLocations || []);
 clearBoardOverlay(); prediction = []; currentGameData = null;
 updateStatus(`OK Cashed out -- ${displayMult.toFixed(2)}x - Win streak: ${winStreak}`, '#00c97a');
 updateStats(displayMult); updateAnalyticsLog();
 checkRigDetection('win', -1, mines, betAmount || 0);
 collectSeedData(game, 'win', winMinePosArr);
 if (winMinePosArr.length > 0) {
 setTimeout(function() {
 var gState = getGameState();
 if (gState && gState.game && gState.game.mineLocations && gState.game.mineLocations.length > winMinePosArr.length) {
 var fullMines = gState.game.mineLocations.filter(function(p) { return typeof p === 'number' && p >= 0 && p < gridSize * gridSize; });
 if (fullMines.length > winMinePosArr.length) {
 var histKey = String(mines);
 if (mineHistory[histKey] && mineHistory[histKey].length > 0) {
 mineHistory[histKey][mineHistory[histKey].length - 1].minePosArr = fullMines;
 saveMineHistory(mineHistory);
 }
 }
 }
 }, 800);
 }
 if (settings.takeProfit > 0 && sessionProfit >= settings.takeProfit) {
 updateStatus(`TAKE PROFIT HIT! +${sessionProfit.toFixed(1)}`, accentColor);
 } else if (autoStartEnabled) {
 setTimeout(() => performAutoStart(), 1200);
 }
 return;
 }
 }, POLL_MS);
 }

 function seedHistoryFromAPI() {
 const SEED_KEY = '_01studios_api_seeded';
 if (sessionStorage.getItem(SEED_KEY)) return;
 sessionStorage.setItem(SEED_KEY, '1');
 try {
 fetch('https://bloxflip.com/api/mines/history?limit=50', {
 credentials: 'include',
 headers: { 'Accept': 'application/json' }
 })
 .then(r => r.ok ? r.json() : null)
 .then(data => {
 if (!data || !Array.isArray(data.data || data)) return;
 const games = data.data || data;
 let seeded = 0;
 for (const g of games) {
 const mines = g.minesAmount || g.mines_amount;
 const locs = g.mineLocations || g.mine_locations || [];
 const uuid = g.uuid || g.id;
 if (!mines || !Array.isArray(locs) || locs.length === 0) continue;
 const existing = getMineHistory(mines, HISTORY_CAP);
 if (existing.some(e => e.uuid === uuid)) continue;
 recordMineHistory(mines, locs, 'api', uuid, []);
 seeded++;
 }
 if (seeded > 0) {
 const el = document.getElementById('_01studios_status_text');
 if (el) el.textContent = `OK History Engine seeded with ${seeded} API games`;
 setTimeout(() => updateStatus('Waiting for game...', TEXT_DIM), 2500);
 }
 })
 .catch(() => {});
 } catch(e) {}
 }

 function launchApp() {
 var existing = document.getElementById('_01studios_panel');
 if (existing) existing.remove();
 if(settings.autoPredict===undefined)settings.autoPredict=true;
 if(settings.showRevealed===undefined)settings.showRevealed=true;
 if(settings.autoSync===undefined)settings.autoSync=true;
 saveSettings();
 injectFiberBridge();
 injectOverlayStyles();
 buildGUI();
 updateModeButtons();
 updateGridSizeButtons();
 updateTileButtons();
 startPoller();
 setTimeout(() => seedHistoryFromAPI(), 2000);
 setTimeout(() => _checkDiscordVerification(), 3000);
 }

 function _checkDiscordVerification() { return; }

 let _launched = false;

 function tryLaunch() {
 if (_launched) return;
 const path = window.location.pathname;
 if (!path.includes('/mines')) return;
 _launched = true;
 launchApp();
 }

 var _initTimer = null;
 function init() {
 if (!_01_predictorReady) return;
 if (_initTimer) clearTimeout(_initTimer);
 _initTimer = setTimeout(function() {
 _initTimer = null;
 tryLaunch();
 if (_launched) return;
 let attempts = 0;
 const poller = setInterval(() => { attempts++; tryLaunch(); if (_launched || attempts > 200) clearInterval(poller); }, 300);
 const obs = new MutationObserver(() => { tryLaunch(); if (_launched) obs.disconnect(); });
 obs.observe(document.documentElement, { childList: true, subtree: true });
 }, 100);
 }

 setInterval(function() {
 var el = document.getElementById('_01studios_session_timer');
 if (!el) return;
 var ms = Date.now() - _sessionStartTime;
 var s = Math.floor(ms / 1000); var h = Math.floor(s / 3600); s %= 3600; var m = Math.floor(s / 60); s %= 60;
 el.textContent = (h > 0 ? h + 'h ' : '') + (m > 0 ? m + 'm ' : '') + s + 's';
 var gEl = document.getElementById('_01studios_session_games');
 if (gEl) gEl.textContent = _sessionGamesPlayed;
 var tEl = document.getElementById('_01studios_t_session_timer');
 if (tEl) tEl.textContent = (h > 0 ? h + 'h ' : '') + (m > 0 ? m + 'm ' : '') + s + 's';
 var tgEl = document.getElementById('_01studios_t_session_games');
 if (tgEl) tgEl.textContent = _sessionGamesPlayed;
 }, 1000);

 function _01_startPredictor() {
 setTimeout(init, 300);
 setTimeout(function() {
 if (settings.anonMode) applyAnonMode(true);
 if (settings.noChatMode) applyNoChatMode(true);
 }, 1000);
 }
 if (_01_predictorReady) _01_startPredictor();

 const T_DIFF = {
 easy: { cols: 3, mines: 1, rows: 8 },
 normal: { cols: 2, mines: 1, rows: 8 },
 hard: { cols: 3, mines: 2, rows: 8 },
 };

  let _lastPath = window.location.pathname;
  setInterval(() => {
    const p = window.location.pathname;
    if (p !== _lastPath) {
      _lastPath = p;
      if (p.includes('/mines')) {
        _launched = false;
        if (_01_predictorReady) { setTimeout(init, 800); }
      }
    }
  }, 500);

  function createNavigationBar() {

    
    if (document.getElementById('_01studios_nav_bar')) return;

    if (!document.getElementById('_01_nav_styles')) {
      const s = document.createElement('style');
      s.id = '_01_nav_styles';
      s.textContent = [
        '@keyframes _01spin { to { transform:rotate(360deg); } }',
        '@keyframes _01pulse { 0%,100%{transform:scale(1);opacity:.45} 50%{transform:scale(1.18);opacity:.12} }',
        '#_01studios_nav_bar { position:fixed;bottom:30px;left:50%;transform:translateX(-50%);z-index:2147483646; }',
        '#_01pill { display:flex;align-items:center;height:60px;width:60px;background:rgba(8,8,8,0.97);border:1.5px solid rgba(0,255,136,0.22);border-radius:50px;backdrop-filter:blur(20px);box-shadow:0 8px 32px rgba(0,0,0,0.85);overflow:hidden;white-space:nowrap;cursor:pointer;transition:width 0.4s cubic-bezier(0.22,1,0.36,1),border-color 0.3s,box-shadow 0.3s; }',
        '#_01pill.open { width:282px;border-color:rgba(0,255,136,0.42);box-shadow:0 8px 40px rgba(0,0,0,0.9),0 0 18px rgba(0,255,136,0.06); }',
        '#_01logo { flex-shrink:0;width:60px;height:60px;display:flex;align-items:center;justify-content:center;position:relative; }',
        '#_01logo img { width:36px;height:36px;border-radius:50%;object-fit:cover;position:relative;z-index:2;transition:filter 0.3s,transform 0.3s; }',
        '#_01pill.open #_01logo img { filter:drop-shadow(0 0 7px rgba(0,255,136,0.6));transform:scale(0.88); }',
        '#_01sring { position:absolute;width:51px;height:51px;border-radius:50%;border:1.5px dashed rgba(0,255,136,0);transition:border-color 0.3s;pointer-events:none;z-index:1; }',
        '#_01pill.open #_01sring { border-color:rgba(0,255,136,0.32);animation:_01spin 3.5s linear infinite; }',
        '#_01pring { position:absolute;width:44px;height:44px;border-radius:50%;border:1px solid rgba(0,255,136,0);transition:border-color 0.3s;pointer-events:none;z-index:1; }',
        '#_01pill.open #_01pring { border-color:rgba(0,255,136,0.48);animation:_01pulse 1.6s ease-in-out infinite; }',
        '#_01btns { display:flex;align-items:center;gap:3px;padding:0 10px 0 0;opacity:0;transform:translateX(-10px);transition:opacity 0.22s ease 0.12s,transform 0.22s ease 0.12s;pointer-events:none; }',
        '#_01pill.open #_01btns { opacity:1;transform:translateX(0);pointer-events:auto; }',
        '.n01btn { display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 12px;background:transparent;border:1px solid transparent;border-radius:16px;cursor:pointer;transition:background 0.18s,border-color 0.18s,transform 0.15s,box-shadow 0.18s;flex-shrink:0; }',
        '.n01btn:hover { transform:scale(1.07); }',
        '.n01btn .ni { font-size:14px;line-height:1; }',
        '.n01btn .nl { font-size:8px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase; }'
      ].join('\n');
      document.head.appendChild(s);
    }

    const wrap = document.createElement('div');
    wrap.id = '_01studios_nav_bar';

    const pill = document.createElement('div');
    pill.id = '_01pill';

    const logo = document.createElement('div');
    logo.id = '_01logo';
    const sring = document.createElement('div');
    sring.id = '_01sring';
    const pring = document.createElement('div');
    pring.id = '_01pring';
    const img = document.createElement('img');
    img.src = _01_LOGO;
    logo.appendChild(pring);
    logo.appendChild(sring);
    logo.appendChild(img);

    const btns = document.createElement('div');
    btns.id = '_01btns';

    const navBtns = [
      { id:'nav_home',       icon:'⌂', label:'Home',     color:'#aaa' },
      { id:'nav_predictor',  icon:'◈', label:'Predict',  color:'#00ff88' },
      { id:'nav_settings',   icon:'⚙', label:'Settings', color:'#aaa' }
    ];

    navBtns.forEach(def => {
      const b = document.createElement('button');
      b.id = def.id;
      b.className = 'n01btn';
      const ni = document.createElement('span');
      ni.className = 'ni';
      ni.style.color = def.color;
      ni.textContent = def.icon;
      const nl = document.createElement('span');
      nl.className = 'nl';
      nl.style.color = def.color;
      nl.textContent = def.label;
      b.appendChild(ni);
      b.appendChild(nl);

      b.addEventListener('mouseenter', () => {
        b.style.background = def.color === '#00ff88' ? 'rgba(0,255,136,0.11)' : 'rgba(255,255,255,0.07)';
        b.style.borderColor = def.color;
        b.style.boxShadow = '0 0 12px ' + def.color + '44';
      });
      b.addEventListener('mouseleave', () => {
        b.style.background = '';
        b.style.borderColor = '';
        b.style.boxShadow = '';
      });
      b.onclick = e => {
        e.preventDefault(); e.stopPropagation();
        const panel = document.getElementById('_01studios_panel');
        if (def.id === 'nav_home' && panel) {
          panel.style.display = 'block';
          const body = panel.querySelector('#_01studios_body');
          if (body) { body.innerHTML = renderHomeTab(); startHomeTabUpdates(); }
        }
        if (def.id === 'nav_predictor' && panel) {
          panel.style.display = 'block'; panel.innerHTML = renderPanel(); attachEvents(panel);
        }
        if (def.id === 'nav_settings') {
          if (typeof openRadial === 'function') openRadial();
          else if (typeof window.openRadial === 'function') window.openRadial();
        }
      };
      btns.appendChild(b);
    });

    pill.appendChild(logo);
    pill.appendChild(btns);
    wrap.appendChild(pill);
    document.body.appendChild(wrap);

    pill.addEventListener('mouseenter', () => pill.classList.add('open'));
    pill.addEventListener('mouseleave', () => pill.classList.remove('open'));

    if (!window._01_navObserverStarted) {
      window._01_navObserverStarted = true;
      let _debounce;
      const observer = new MutationObserver(() => {
        clearTimeout(_debounce);
        _debounce = setTimeout(() => {
          
          if (document.getElementById('_01_loader_panel')) return;
          if (!(window._01_loaderState && window._01_loaderState.isVerified)) return;
          if (!document.getElementById('_01studios_nav_bar')) {
            createNavigationBar();
          }
        }, 50);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
  window.createNavigationBar = createNavigationBar;

  
  setTimeout(() => {
    if (window._01_loaderState && window._01_loaderState.isVerified) {
      createNavigationBar();
    }
  }, 2000);

 

function handleLogout() {
  localStorage.removeItem('_01_verified');
  localStorage.removeItem('_01_hwid');
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('_01_rate_limit_')) {
      localStorage.removeItem(key);
    }
  });
  _01_loaderState.isVerified = false;
  _01_loaderState.username = null;
  _01_loaderState.key = null;
  _01_loaderState.hwid = null;
  location.reload();
}

function renderHomeTab() {
   const username = _01_loaderState?.username || 'User';
   const key = _01_loaderState?.key || '';
   const maskedKey = key ? key.substring(0, 4) + '*'.repeat(Math.max(0, key.length - 8)) + key.substring(key.length - 4) : 'N/A';
   const hwid = _01_loaderState?.hwid || 'N/A';
   const dcUser = _01_loaderState?.discordUsername || null;
   const bfUser = _01_loaderState?.bloxUsername || null;
   const ms = Date.now() - _sessionStartTime;
   const totalSec = Math.floor(ms / 1000);
   const h = Math.floor(totalSec / 3600);
   const mn = Math.floor((totalSec % 3600) / 60);
   const sc = totalSec % 60;
   const elapsed = (h > 0 ? h + 'h ' : '') + (mn > 0 ? mn + 'm ' : '') + sc + 's';
   const total = sessionWins + sessionLosses;
   const wr = total > 0 ? Math.round(sessionWins / total * 100) : 0;
   const wrColor = wr >= 60 ? '#00ff88' : wr >= 45 ? '#f5a623' : '#ff5a5a';
   const hour = new Date().getHours();
   const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Night';
   const streakLabel = winStreak > 1 ? '🔥 ' + winStreak + ' win streak' : lossStreak > 1 ? '❄ ' + lossStreak + ' loss streak' : '&mdash;';
   const streakColor = winStreak > 1 ? '#00ff88' : lossStreak > 1 ? '#ff5a5a' : '#444';
   const perfBar = total > 0 ? `
     <div style="background:rgba(12,12,12,0.9);border:1px solid rgba(255,255,255,0.06);border-radius:11px;padding:10px 14px;">
       <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
         <span style="font-size:9px;color:#555;text-transform:uppercase;letter-spacing:0.8px;">Performance</span>
         <span style="font-size:9px;color:#444;"><span id="home_timer" style="color:#666;">${elapsed}</span> session</span>
       </div>
       <div style="background:rgba(255,90,90,0.2);border-radius:4px;height:5px;overflow:hidden;">
         <div style="background:${wrColor};height:100%;width:${wr}%;border-radius:4px;transition:width 0.4s ease;box-shadow:0 0 6px ${wrColor}88;"></div>
       </div>
       <div style="display:flex;justify-content:space-between;margin-top:5px;">
         <span style="font-size:8px;color:#444;">${total} games</span>
         <span style="font-size:8px;color:${streakColor};">${streakLabel}</span>
       </div>
     </div>` : `<div style="display:none;"><span id="home_timer"></span></div>`;

   return `
     <div style="padding:14px;display:flex;flex-direction:column;gap:10px;font-family:inherit;">

       <div style="background:linear-gradient(135deg,rgba(0,255,136,0.07) 0%,rgba(0,0,0,0) 70%),rgba(12,12,12,0.95);border:1px solid rgba(0,255,136,0.18);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;">
         ${(() => {
           const dcId = _01_loaderState?.discordId;
           const dcAv = _01_loaderState?.discordAvatar;
           const letter = username.slice(0,1).toUpperCase();
           const fallback = `<div style=\"width:42px;height:42px;border-radius:50%;background:rgba(0,255,136,0.1);border:1.5px solid rgba(0,255,136,0.3);display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:900;color:#00ff88;flex-shrink:0;\">${letter}</div>`;
           let url = null;
           if (dcAv && (dcAv.indexOf('http://') === 0 || dcAv.indexOf('https://') === 0)) {
             url = dcAv; // a full URL was stored directly
           } else if (dcId && dcAv) {
             const ext = dcAv.startsWith('a_') ? 'gif' : 'png';
             url = `https://cdn.discordapp.com/avatars/${dcId}/${dcAv}.${ext}?size=128`;
           }
           if (!url) return fallback;
           // Letter fallback shows if the image errors (deleted avatar, etc).
           return `<div style=\"width:42px;height:42px;border-radius:50%;border:1.5px solid rgba(0,255,136,0.3);flex-shrink:0;overflow:hidden;background:rgba(0,255,136,0.1);display:flex;align-items:center;justify-content:center;\">`
             + `<img src=\"${url}\" referrerpolicy=\"no-referrer\" style=\"width:100%;height:100%;object-fit:cover;display:block;\" `
             + `onerror=\"this.style.display='none';this.parentNode.innerHTML='<span style=&quot;font-size:19px;font-weight:900;color:#00ff88;&quot;>${letter}</span>';\">`
             + `</div>`;
         })()}
         <div style="flex:1;min-width:0;">
           <div style="font-size:9px;color:rgba(0,255,136,0.65);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:2px;">${greeting}</div>
           <div style="font-size:15px;font-weight:900;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${username}</div>
         </div>
         <button id="_01_logout_btn" style="padding:6px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#666;font-size:9px;font-weight:700;cursor:pointer;letter-spacing:0.8px;text-transform:uppercase;flex-shrink:0;white-space:nowrap;">Sign Out</button>
       </div>

       <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
         <div style="background:rgba(12,12,12,0.95);border:1px solid rgba(0,255,136,0.12);border-radius:11px;padding:10px 8px;text-align:center;">
           <div style="font-size:9px;color:#555;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Wins</div>
           <div id="home_wins" style="font-size:22px;font-weight:900;color:#00ff88;line-height:1;">${sessionWins}</div>
         </div>
         <div style="background:rgba(12,12,12,0.95);border:1px solid rgba(255,90,90,0.12);border-radius:11px;padding:10px 8px;text-align:center;">
           <div style="font-size:9px;color:#555;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Losses</div>
           <div id="home_losses" style="font-size:22px;font-weight:900;color:#ff5a5a;line-height:1;">${sessionLosses}</div>
         </div>
         <div style="background:rgba(12,12,12,0.95);border:1px solid rgba(255,255,255,0.06);border-radius:11px;padding:10px 8px;text-align:center;">
           <div style="font-size:9px;color:#555;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Win Rate</div>
           <div style="font-size:22px;font-weight:900;color:${wrColor};line-height:1;">${total > 0 ? wr + '%' : '--'}</div>
         </div>
       </div>

       ${perfBar}

       <div style="background:rgba(12,12,12,0.95);border:1px solid rgba(255,255,255,0.06);border-radius:11px;padding:10px 14px;">
         <div style="font-size:9px;color:#444;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">License</div>
         <div style="display:flex;flex-direction:column;gap:7px;">
           <div style="display:flex;justify-content:space-between;align-items:center;">
             <span style="font-size:9px;color:#444;">Key</span>
             <span style="font-size:10px;color:#666;font-family:monospace;">${maskedKey}</span>
           </div>
           <div style="height:1px;background:rgba(255,255,255,0.04);"></div>
           <div style="display:flex;justify-content:space-between;align-items:center;">
             <span style="font-size:9px;color:#444;">HWID</span>
             <span style="font-size:9px;color:#555;font-family:monospace;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${hwid}">${hwid}</span>
           </div>
           <div style="height:1px;background:rgba(255,255,255,0.04);"></div>
           <div style="display:flex;justify-content:space-between;align-items:center;">
             <span style="font-size:9px;color:#444;">BloxFlip</span>
             <span style="font-size:9px;font-weight:700;color:${bfUser ? '#00c97a' : '#444'};">${bfUser || 'Not linked'}</span>
           </div>
           <div style="height:1px;background:rgba(255,255,255,0.04);"></div>
           <div style="display:flex;justify-content:space-between;align-items:center;">
             <span style="font-size:9px;color:#444;">Plan</span>
             <span style="font-size:9px;color:#00ff88;font-weight:700;background:rgba(0,255,136,0.08);padding:2px 9px;border-radius:20px;border:1px solid rgba(0,255,136,0.2);">Unlimited</span>
           </div>
         </div>
       </div>

     </div>
   `;
 }

// Removed - was added at end

 let _homeTabUpdateInterval = null;
 function startHomeTabUpdates() {
   if(_homeTabUpdateInterval) clearInterval(_homeTabUpdateInterval);

   const logoutBtn = document.getElementById('_01_logout_btn');
   if (logoutBtn) {
     logoutBtn.addEventListener('click', handleLogout);
   }

   _homeTabUpdateInterval = setInterval(function() {
     const timerEl = document.getElementById('home_timer');
     const winsEl = document.getElementById('home_wins');
     const lossesEl = document.getElementById('home_losses');
     const gamesEl = document.getElementById('home_games');

     if(timerEl) {
       const ms = Date.now() - _sessionStartTime;
       const s = Math.floor(ms / 1000);
       const h = Math.floor(s / 3600);
       const m = Math.floor((s % 3600) / 60);
       const sec = s % 60;
       const elapsed = (h > 0 ? h + 'h ' : '') + (m > 0 ? m + 'm ' : '') + sec + 's';
       timerEl.textContent = elapsed;
     }
     if(winsEl) winsEl.textContent = sessionWins;
     if(lossesEl) lossesEl.textContent = sessionLosses;
     if(gamesEl) gamesEl.textContent = _sessionGamesPlayed;
   }, 1000);
 }

 // Initialize the loader system first
 window._01_initLoader().then(() => {
   // After loader completes, initialize the GUI
   setTimeout(() => {
     buildGUI();
   }, 100);
 }).catch(() => {
   // If loader fails, still initialize
   setTimeout(() => {
     buildGUI();
   }, 100);
 });
 })();