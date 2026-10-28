(() => {
  const WA = "5598984142570";
  const GOOGLE_REVIEW = "https://search.google.com/local/writereview?placeid=ChIJ22eFcQCN9gcRuGLMNSMmc7A";
  const TZ = "America/Fortaleza"; // fuso de São Luís (UTC-3)
  const LAT = -2.49, LON = -44.27;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (m) => { m = ((Math.round(m) % 1440) + 1440) % 1440; return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; };

  /* ---------- Data e hora em São Luís ---------- */
  function nowInSaoLuis() {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23" })
        .formatToParts(new Date()).map((p) => [p.type, p.value])
    );
    const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
    return { y: +parts.year, mo: +parts.month, d: +parts.day, wd, minutes: +parts.hour * 60 + +parts.minute, iso: `${parts.year}-${parts.month}-${parts.day}` };
  }

  /* ---------- Pôr do sol do dia (aproximação NOAA) ---------- */
  function sunset({ y, mo, d }) {
    const doy = Math.round((Date.UTC(y, mo - 1, d) - Date.UTC(y, 0, 0)) / 864e5);
    const rad = Math.PI / 180;
    const B = (2 * Math.PI / 365) * (doy - 81);
    const decl = 23.44 * Math.sin(B) * rad;
    const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    const cosH = (Math.sin(-0.833 * rad) - Math.sin(LAT * rad) * Math.sin(decl)) / (Math.cos(LAT * rad) * Math.cos(decl));
    const H = Math.acos(Math.min(1, Math.max(-1, cosH))) / rad;
    return 720 - 4 * LON - eot - 180 + 4 * H;
  }

  const today = nowInSaoLuis();
  $$("[data-sunset]").forEach((el) => (el.textContent = fmt(sunset(today))));

  /* ---------- Horário de hoje em destaque ---------- */
  $$("[data-hours] tr").forEach((tr) => {
    if (tr.dataset.days.split(",").map(Number).includes(today.wd)) tr.classList.add("is-today");
  });

  /* ---------- Cabeçalho e WhatsApp flutuante ---------- */
  const top = $("[data-top]");
  const fab = $(".wa-float");
  const hero = $(".hero");
  const onScroll = () => {
    const y = window.scrollY;
    top.classList.toggle("is-solid", y > 40);
    fab.classList.toggle("is-visible", y > hero.offsetHeight * 0.6);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Movimento ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("is-loaded")));

  // faixa: duplica o conteúdo para o loop não ter emenda
  const track = $("[data-ticker]");
  if (track && !reduce) track.innerHTML += track.innerHTML;

  // janelas da abertura se movem em velocidades diferentes ao rolar
  const wins = $$(".window");
  if (!reduce && wins.length) {
    let ticking = false;
    const par = () => {
      const y = Math.min(window.scrollY, 900);
      wins.forEach((w, i) => w.style.setProperty("--py", `${(i === 1 ? -0.06 : 0.05) * y}px`));
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(par); } }, { passive: true });
  }

  // seções e fotos aparecem ao entrar na tela
  const toReveal = $$("[data-reveal], .shot");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const sibs = el.classList.contains("shot") ? $$(".shot") : [];
        el.style.transitionDelay = sibs.length ? `${(sibs.indexOf(el) % 3) * 90}ms` : "";
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    toReveal.forEach((el) => io.observe(el));
  } else toReveal.forEach((el) => el.classList.add("is-in"));

  /* ---------- Galeria: foto ampliada ---------- */
  const lb = $("[data-lightbox]");
  const shots = $$("[data-shot]");
  const lbImg = $("[data-lb-img]");
  const lbCap = $("[data-lb-cap]");
  let cur = 0;
  function show(i) {
    cur = (i + shots.length) % shots.length;
    const img = $("img", shots[cur]);
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = $(".shot-cap", shots[cur]).textContent;
  }
  shots.forEach((s, i) => s.addEventListener("click", () => {
    show(i);
    if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
  }));
  const closeLb = () => (lb.close ? lb.close() : lb.removeAttribute("open"));
  $("[data-lb-close]").addEventListener("click", closeLb);
  $("[data-lb-prev]").addEventListener("click", () => show(cur - 1));
  $("[data-lb-next]").addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lightbox-figure")) closeLb(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "ArrowLeft") show(cur - 1);
  });
  let sx = null;
  lbImg.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  lbImg.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    sx = null;
  });

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
    search.value = "";
    $$("[data-filter]", tabsEl).forEach((x) => x.setAttribute("aria-pressed", x === b));
    renderMenu();
  });
  search.addEventListener("input", renderMenu);

  function dishHTML(it) {
    const tag = it.tag ? `<span class="dish-tag">${it.tag}</span>` : "";
    const mar = it.mar ? `<span class="mar" role="img" aria-label="Sabor do Maranhão"></span>` : "";
    const price = it.p2 ? `${money(it.p)}<small>1 pessoa</small><small>${money(it.p2)} para 2</small>` : money(it.p);
    return `<article class="dish">
      <h4 class="dish-name">${it.n}${mar}${tag}</h4>
      <p class="dish-price">${price}</p>
      ${it.d ? `<p class="dish-desc">${it.d}</p>` : ""}
    </article>`;
  }

  function renderMenu() {
    const q = norm(search.value.trim());
    tabsEl.classList.toggle("is-searching", !!q); // com busca, procura no cardápio inteiro
    const groups = MENU
      .filter((g) => q || filter === "maranhao" || g.id === filter)
      .map((g) => ({ ...g, itens: g.itens.filter((it) => (q ? norm(`${it.n} ${it.d}`).includes(q) : filter !== "maranhao" || it.mar)) }))
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
  const date = $("#b-date");
  const time = $("#b-time");
  const people = $("[data-people]");
  const occ = $("[data-occasion-select]");
  const err = $("[data-form-error]");
  const note = $("[data-closed-note]");
  date.min = today.iso;
  date.value = today.iso;
  let n = 2;

  // Avisa quando o dia ou horário escolhido está fora do funcionamento.
  const OPEN = { 0: [690, 1020], 1: null, 2: [690, 1350], 3: [690, 1350], 4: [690, 1350], 5: [690, 1410], 6: [690, 1410] };
  function checkOpen() {
    if (!date.value) { note.hidden = true; return; }
    const [y, m, d] = date.value.split("-").map(Number);
    const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    const slot = OPEN[wd];
    const [h, mi] = (time.value || "0:0").split(":").map(Number);
    const t = h * 60 + mi;
    if (!slot) { note.textContent = "O Miramar fecha às segundas. Que tal escolher outro dia?"; note.hidden = false; }
    else if (time.value && (t < slot[0] || t > slot[1] - 60)) {
      note.textContent = `Nesse dia a casa funciona das ${fmt(slot[0]).replace(":", "h")} às ${fmt(slot[1]).replace(":", "h")}. Escolha um horário até uma hora antes do fechamento.`;
      note.hidden = false;
    } else note.hidden = true;
  }
  date.addEventListener("change", checkOpen);
  time.addEventListener("change", checkOpen);
  checkOpen();

  form.addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]");
    if (!b) return;
    n = Math.min(200, Math.max(1, n + +b.dataset.step));
    people.textContent = n;
  });
  $$("[data-occasion]").forEach((a) => a.addEventListener("click", () => { occ.value = a.dataset.occasion; }));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
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
      $('[aria-invalid="true"]', form).focus();
      return;
    }
    err.hidden = true;
    const [yy, mm, dd] = fd.get("data").split("-");
    const linhas = [
      "Olá! Gostaria de fazer uma reserva no Miramar Rooftop.",
      `Nome: ${fd.get("nome").trim()}`,
      `Dia: ${dd}/${mm}/${yy}`,
      `Horário: ${fd.get("hora")}`,
      `Pessoas: ${n}`,
      `Ocasião: ${fd.get("ocasiao")}`,
    ];
    if (fd.get("janela")) linhas.push("Preferência: mesa perto da janela");
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(linhas.join("\n"))}`, "_blank", "noopener");
  });

  /* ---------- Cartão-postal: avaliação no Google ---------- */
  const chips = $("[data-chips]");
  const text = $("[data-review-text]");
  const go = $("[data-review-go]");
  const hint = $("[data-review-hint]");
  let typed = false;
  text.addEventListener("input", () => { typed = true; });

  const join = (arr) => (arr.length < 2 ? arr.join("") : `${arr.slice(0, -1).join(", ")} e ${arr[arr.length - 1]}`);
  function compose() {
    const picked = $$('[aria-pressed="true"]', chips).map((b) => b.dataset.chip);
    if (!picked.length) return "";
    return `Estive no Miramar Rooftop e o que mais marcou a minha visita foi ${join(picked)}. `;
  }
  chips.addEventListener("click", (e) => {
    const b = e.target.closest("[data-chip]");
    if (!b) return;
    b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true");
    if (!typed) text.value = compose();
    else hint.textContent = "Você já começou a escrever, então não mexemos no seu texto.";
  });

  go.addEventListener("click", () => {
    const msg = text.value.trim();
    if (msg && navigator.clipboard) {
      navigator.clipboard.writeText(msg).then(
        () => { hint.textContent = "Texto copiado. No Google, cole na caixa de comentário e escolha as estrelas."; },
        () => { hint.textContent = "Não deu para copiar automaticamente. Selecione o texto, copie e cole no Google."; }
      );
    }
    window.open(GOOGLE_REVIEW, "_blank", "noopener");
  });

  const year = $("[data-year]");
  if (year) year.textContent = today.y;
})();
