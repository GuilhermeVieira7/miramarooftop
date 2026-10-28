(() => {
  const WA = "5598984142570";
  const TZ = "America/Fortaleza"; // fuso de São Luís (UTC-3)
  const LAT = -2.53, LON = -44.30;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (m) => { m = ((Math.round(m) % 1440) + 1440) % 1440; return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; };

  /* ---------- Hora e data em São Luís ---------- */
  function nowInSaoLuis() {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).map((p) => [p.type, p.value])
    );
    return { y: +parts.year, mo: +parts.month, d: +parts.day, minutes: +parts.hour * 60 + +parts.minute, iso: `${parts.year}-${parts.month}-${parts.day}` };
  }

  /* ---------- Nascer e pôr do sol (aproximação NOAA) ---------- */
  function sunTimes({ y, mo, d }) {
    const doy = Math.round((Date.UTC(y, mo - 1, d) - Date.UTC(y, 0, 0)) / 864e5);
    const rad = Math.PI / 180;
    const B = (2 * Math.PI / 365) * (doy - 81);
    const decl = 23.44 * Math.sin(B) * rad;
    const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    const cosH = (Math.sin(-0.833 * rad) - Math.sin(LAT * rad) * Math.sin(decl)) / (Math.cos(LAT * rad) * Math.cos(decl));
    const H = Math.acos(Math.min(1, Math.max(-1, cosH))) / rad;
    const noon = 720 - 4 * LON - eot - 180; // UTC-3
    return { sunrise: noon - 4 * H, sunset: noon + 4 * H, noon };
  }

  /* ---------- Paletas do céu ---------- */
  const P = {
    night:     { top: "#070E24", mid: "#0F1B3D", bot: "#1B2C5C", sea: "#0B1530", wave: "rgba(160,190,255,.28)", city: "#060B1D", sun: "#FFD27A", stars: 1,   lights: 1,   glint: 0 },
    predawn:   { top: "#14214A", mid: "#3D3F7A", bot: "#B86E6E", sea: "#1A2650", wave: "rgba(255,200,170,.32)", city: "#0E1634", sun: "#FFB86B", stars: .45, lights: .7,  glint: .2 },
    dawn:      { top: "#2E4F96", mid: "#C97C78", bot: "#F6B26B", sea: "#2C4A86", wave: "rgba(255,220,180,.45)", city: "#1B2A55", sun: "#FFC86E", stars: 0,   lights: .2,  glint: .7 },
    morning:   { top: "#2C74D1", mid: "#6FB0EA", bot: "#BFE1F6", sea: "#2B5DAE", wave: "rgba(255,255,255,.55)", city: "#3E5A8C", sun: "#FFE29A", stars: 0,   lights: 0,   glint: .5 },
    noon:      { top: "#1C66C9", mid: "#5EA6E8", bot: "#A9D7F4", sea: "#2861B8", wave: "rgba(255,255,255,.6)",  city: "#45619A", sun: "#FFF0B8", stars: 0,   lights: 0,   glint: .45 },
    afternoon: { top: "#2A6CC4", mid: "#79AEE0", bot: "#F2D9A0", sea: "#2B5DAE", wave: "rgba(255,240,210,.55)", city: "#3A5285", sun: "#FFD98A", stars: 0,   lights: 0,   glint: .6 },
    golden:    { top: "#3460A8", mid: "#E6A26A", bot: "#F6C77E", sea: "#2E4F92", wave: "rgba(255,215,160,.6)",  city: "#2A3B6A", sun: "#FFC260", stars: 0,   lights: .15, glint: .9 },
    sunset:    { top: "#2B3F7E", mid: "#E8735A", bot: "#F28A3B", sea: "#28407A", wave: "rgba(255,190,130,.6)",  city: "#1C274E", sun: "#FFB04A", stars: 0,   lights: .5,  glint: 1 },
    dusk:      { top: "#141F48", mid: "#4C3F80", bot: "#C0616A", sea: "#18254F", wave: "rgba(220,170,200,.38)", city: "#0D1532", sun: "#FF9A4A", stars: .4,  lights: .9,  glint: .25 },
  };
  const hexToRgb = (h) => { h = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
  const mixHex = (a, b, t) => { const A = hexToRgb(a), B = hexToRgb(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`; };
  const mixRgba = (a, b, t) => {
    const p = (s) => s.match(/[\d.]+/g).map(Number);
    const A = p(a), B = p(b);
    return `rgba(${A.map((v, i) => (i < 3 ? Math.round(v + (B[i] - v) * t) : (v + (B[i] - v) * t).toFixed(2))).join(",")})`;
  };
  const lerp = (a, b, t) => a + (b - a) * t;

  function paletteAt(m, st) {
    const { sunrise: sr, sunset: ss, noon } = st;
    const keys = [
      [sr - 80, P.night], [sr - 25, P.predawn], [sr + 15, P.dawn], [sr + 100, P.morning],
      [noon, P.noon], [ss - 110, P.afternoon], [ss - 40, P.golden], [ss, P.sunset],
      [ss + 28, P.dusk], [ss + 80, P.night],
    ];
    if (m <= keys[0][0] || m >= keys[keys.length - 1][0]) return P.night;
    for (let i = 0; i < keys.length - 1; i++) {
      const [m0, a] = keys[i], [m1, b] = keys[i + 1];
      if (m >= m0 && m <= m1) {
        const t = (m - m0) / (m1 - m0);
        return {
          top: mixHex(a.top, b.top, t), mid: mixHex(a.mid, b.mid, t), bot: mixHex(a.bot, b.bot, t),
          sea: mixHex(a.sea, b.sea, t), wave: mixRgba(a.wave, b.wave, t), city: mixHex(a.city, b.city, t),
          sun: mixHex(a.sun, b.sun, t), stars: lerp(a.stars, b.stars, t), lights: lerp(a.lights, b.lights, t), glint: lerp(a.glint, b.glint, t),
        };
      }
    }
    return P.night;
  }

  function momentAt(m, st) {
    const { sunrise: sr, sunset: ss } = st;
    if (m < sr - 60) return ["Madrugada", "A cidade dorme lá embaixo. Bom momento para garantir a mesa de amanhã."];
    if (m < sr + 60) return ["Amanhecer", "O céu clareia sobre a ilha e o mar do Calhau muda de cor."];
    if (m < 870) return ["Almoço com vista", "Luz clara sobre o Atlântico. Mesa na janela e um suco de cupuaçu."];
    if (m < ss - 60) return ["Tarde", "A luz vai baixando sobre a Avenida dos Holandeses. Hora do Aperol Spritz."];
    if (m < ss + 20) return ["Pôr do sol", "O momento mais disputado da casa. Chegue cedo e peça mesa na janela."];
    if (m < 1350) return ["Noite", "As luzes da orla acendem e o piano entra na trilha do jantar."];
    return ["Fim de noite", "Uma última taça com a cidade inteira acesa lá embaixo."];
  }

  /* ---------- Desenha o céu ---------- */
  const sky = $("[data-sky]");
  const sun = $("[data-sun]");
  const moon = $("[data-moon]");
  const glint = $("[data-glint]");
  let today = nowInSaoLuis();
  let st = sunTimes(today);

  function render(m) {
    const pal = paletteAt(m, st);
    const s = sky.style;
    s.setProperty("--sky-top", pal.top);
    s.setProperty("--sky-mid", pal.mid);
    s.setProperty("--sky-bot", pal.bot);
    s.setProperty("--sea-fill", pal.sea);
    s.setProperty("--wave", pal.wave);
    s.setProperty("--city", pal.city);
    s.setProperty("--sun-core", pal.sun);
    s.setProperty("--glint", pal.sun);
    s.setProperty("--stars", pal.stars.toFixed(2));
    s.setProperty("--lights", pal.lights.toFixed(2));
    s.setProperty("--glint-o", pal.glint.toFixed(2));

    // posição do sol no arco (abaixo do horizonte fica escondido pelo recorte)
    const f = (m - st.sunrise) / (st.sunset - st.sunrise);
    const th = Math.PI * (1 - Math.min(1.15, Math.max(-0.15, f)));
    const x = 800 + 680 * Math.cos(th);
    const y = 700 - 520 * Math.sin(th);
    sun.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    sun.style.opacity = f > -0.15 && f < 1.15 ? 1 : 0;
    glint.style.transform = `translateX(${(x - 800).toFixed(1)}px)`;
    moon.style.opacity = pal.stars > 0.3 ? Math.min(1, pal.stars) : 0;

    const [name, text] = momentAt(m, st);
    $("[data-moment-name]").textContent = name;
    $("[data-moment-text]").textContent = text;
    $("[data-dial-time]").textContent = fmt(m);
  }

  const range = $("[data-dial-range]");
  const nowBtn = $("[data-dial-now]");
  let previewing = false;

  function tick() {
    today = nowInSaoLuis();
    st = sunTimes(today);
    $$("[data-clock]").forEach((el) => (el.textContent = fmt(today.minutes)));
    $$("[data-sunset]").forEach((el) => (el.textContent = fmt(st.sunset)));
    if (!previewing) {
      range.value = today.minutes;
      render(today.minutes);
    }
  }
  tick();
  setInterval(tick, 30000);

  range.addEventListener("input", () => {
    previewing = true;
    nowBtn.hidden = false;
    render(+range.value);
  });
  nowBtn.addEventListener("click", () => {
    previewing = false;
    nowBtn.hidden = true;
    tick();
  });

  /* ---------- Cabeçalho e WhatsApp flutuante ---------- */
  const top = $("[data-top]");
  const fab = $(".wa-float");
  const onScroll = () => {
    const y = window.scrollY;
    top.classList.toggle("is-solid", y > 40);
    fab.classList.toggle("is-visible", y > sky.offsetHeight * 0.7);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Cardápio ---------- */
  const MENU = window.MIRAMAR_MENU || [];
  const list = $("[data-menu-list]");
  const tabsEl = $("[data-menu-tabs]");
  const search = $("[data-menu-search]");
  const money = (v) => `R$ ${v.toLocaleString("pt-BR")}`;
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  let filter = "maranhao";

  const tabs = [{ id: "maranhao", nome: "Sabores do Maranhão" }, ...MENU.map(({ id, nome }) => ({ id, nome }))];
  tabsEl.innerHTML = tabs.map((t) => `<button type="button" data-filter="${t.id}" aria-pressed="${t.id === filter}">${t.nome}</button>`).join("");
  tabsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter]");
    if (!b) return;
    filter = b.dataset.filter;
    $$("[data-filter]", tabsEl).forEach((x) => x.setAttribute("aria-pressed", x === b));
    renderMenu();
    const y = $("#cardapio").getBoundingClientRect().top + window.scrollY - 60;
    if (window.scrollY > y + 200) window.scrollTo({ top: y });
  });
  search.addEventListener("input", renderMenu);

  function dishHTML(it) {
    const tag = it.tag ? `<span class="dish-tag">${it.tag}</span>` : "";
    const mar = it.mar ? `<span class="mar" role="img" aria-label="Sabor do Maranhão"></span>` : "";
    const price = it.p2
      ? `${money(it.p)}<small>1 pessoa</small><small>${money(it.p2)} para 2</small>`
      : money(it.p);
    return `<article class="dish">
      <h4 class="dish-name">${it.n}${mar}${tag}</h4>
      <p class="dish-price">${price}</p>
      ${it.d ? `<p class="dish-desc">${it.d}</p>` : ""}
    </article>`;
  }

  function renderMenu() {
    const q = norm(search.value.trim());
    // Com busca ativa, procura no cardápio inteiro.
    tabsEl.classList.toggle("is-searching", !!q);
    const groups = MENU
      .filter((g) => q || filter === "maranhao" || g.id === filter)
      .map((g) => ({
        ...g,
        itens: g.itens.filter((it) => (q ? norm(`${it.n} ${it.d}`).includes(q) : filter !== "maranhao" || it.mar)),
      }))
      .filter((g) => g.itens.length);

    if (!groups.length) {
      list.innerHTML = `<p class="menu-empty">Nenhum prato com “${search.value.trim()}”. <button type="button" data-clear>Limpar a busca</button></p>`;
      $("[data-clear]", list).addEventListener("click", () => { search.value = ""; renderMenu(); search.focus(); });
      return;
    }
    list.innerHTML = groups.map((g) => `<section class="menu-group"><h3>${g.nome}</h3>${g.itens.map(dishHTML).join("")}</section>`).join("");
  }
  renderMenu();

  /* ---------- Reserva pelo WhatsApp ---------- */
  const form = $("[data-book]");
  const date = form.querySelector("#b-date");
  const people = $("[data-people]");
  const occ = $("[data-occasion-select]");
  const err = $("[data-form-error]");
  date.min = today.iso;
  date.value = today.iso;
  let n = 2;
  form.addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]");
    if (!b) return;
    n = Math.min(200, Math.max(1, n + +b.dataset.step));
    people.textContent = n;
  });

  $$("[data-occasion]").forEach((a) => {
    a.addEventListener("click", () => { occ.value = a.dataset.occasion; });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const nome = (fd.get("nome") || "").trim();
    const missing = [];
    [["data", "o dia"], ["hora", "o horário"], ["nome", "seu nome"]].forEach(([k, label]) => {
      const el = form.elements[k];
      const bad = !String(fd.get(k) || "").trim();
      el.setAttribute("aria-invalid", bad);
      if (bad) missing.push(label);
    });
    if (missing.length) {
      err.textContent = `Preencha ${missing.join(", ").replace(/, ([^,]*)$/, " e $1")} para montar a mensagem.`;
      err.hidden = false;
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    err.hidden = true;
    const [yy, mm, dd] = fd.get("data").split("-");
    const linhas = [
      "Olá! Gostaria de fazer uma reserva no Miramar Rooftop.",
      `Nome: ${nome}`,
      `Dia: ${dd}/${mm}/${yy}`,
      `Horário: ${fd.get("hora")}`,
      `Pessoas: ${n}`,
      `Ocasião: ${fd.get("ocasiao")}`,
    ];
    if (fd.get("janela")) linhas.push("Preferência: mesa perto da janela");
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(linhas.join("\n"))}`, "_blank", "noopener");
  });

  const year = $("[data-year]");
  if (year) year.textContent = today.y;
})();
