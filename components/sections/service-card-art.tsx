/**
 * The fifteen service cards, drawn.
 *
 * Each one is a composition in its own right — ribbons on gradient strokes,
 * glass pills, a bot's head built out of radial gradients, a phone, a terminal,
 * an orbit of avatars — and none of it is artwork on disk. It is all divs and
 * paths, which is why the whole section costs no image requests at all.
 *
 * Built from a design laid out in flat HTML and translated here, with the
 * reference's cyan-to-orange ramp swapped for one that travels pale lime to
 * forest. The brand value itself is never a hex in this file: it is
 * `var(--color-primary-green)` throughout, because scripts/check-brand-colour
 * holds the literal to exactly two declarations site-wide.
 *
 * Presentational only. The text inside a card is its own content, and the
 * section that renders these wraps each one in the link it belongs to.
 *
 * The three animations they use — bob, blink, pulse — are declared in
 * app/globals.css, because keyframes cannot live in an inline style.
 */

/**
 * The four ramps every card's ribbons are stroked with. Rendered once per
 * section: the ids are global to the document, so a second copy would define
 * them twice for nothing.
 */
export function Ramps() {
  return (
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
      <defs>
    <linearGradient id="tB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#effbd9"></stop><stop offset=".45" stopColor="#a9e85c"></stop><stop offset="1" stopColor="var(--color-primary-green)"></stop></linearGradient>
    <linearGradient id="tO" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#255c0a"></stop><stop offset=".6" stopColor="#3f7f10"></stop><stop offset="1" stopColor="#7cc32c"></stop></linearGradient>
    <linearGradient id="tV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c2f087"></stop><stop offset=".35" stopColor="var(--color-primary-green)"></stop><stop offset=".65" stopColor="#6fbb1f"></stop><stop offset="1" stopColor="#2b6a0d"></stop></linearGradient>
    <linearGradient id="tU" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#2b6a0d"></stop><stop offset=".45" stopColor="#5ea016"></stop><stop offset=".7" stopColor="var(--color-primary-green)"></stop><stop offset="1" stopColor="#c2f087"></stop></linearGradient>
  </defs>
    </svg>
  );
}

/** 01 — SaaS. */
function Card01() {
  return (
    <>
      <div style={{ position: "absolute", left: "-160px", bottom: "-200px", width: "620px", height: "620px", borderRadius: "50%", border: "1.5px dashed color-mix(in srgb, var(--color-primary-green) 38%, transparent)" }}></div>
      <div style={{ position: "absolute", left: "-60px", bottom: "-110px", width: "440px", height: "440px", borderRadius: "50%", border: "1.5px dashed color-mix(in srgb, var(--color-primary-green) 26%, transparent)" }}></div>
      <svg width="360" height="720" viewBox="0 0 360 720" style={{ position: "absolute", inset: "0", overflow: "visible" }}><path d="M 400 330 Q 250 360 250 560" stroke="url(#tB)" strokeWidth="40" fill="none" strokeLinecap="round"></path><path d="M 400 330 Q 250 360 250 560" stroke="#fff" strokeOpacity=".45" strokeWidth="9" fill="none" strokeLinecap="round" transform="translate(-6,-4)"></path><path d="M -30 660 Q 50 630 130 650" stroke="url(#tO)" strokeWidth="28" fill="none" strokeLinecap="round"></path></svg>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#9a9a9a" }}>01</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "54px", fontWeight: "700", letterSpacing: "-.055em", lineHeight: ".95", color: "#1a1a1a" }}><span style={{ color: "#5ea016" }}>SaaS</span><br />Platforms</div>
        <div style={{ fontSize: "20px", lineHeight: "1.25", letterSpacing: "-.015em", color: "#333" }}>Multi-tenant architecture</div>
      </div>
      <div style={{ position: "absolute", left: "60px", top: "290px", zIndex: "3", padding: "14px 20px", borderRadius: "18px", background: "#262626", color: "#fff", fontSize: "16px", fontWeight: "500", lineHeight: "1.3", transform: "rotate(-8deg)", boxShadow: "0 14px 30px rgba(0,0,0,.25)" }}>One codebase.<br />Every tenant isolated.</div>
      <div style={{ position: "absolute", left: "20px", top: "410px", width: "330px", height: "310px", transform: "rotate(-10deg) scale(1.1)", animation: "bob 4s ease-in-out infinite" }}>
        <div style={{ position: "absolute", left: "62px", top: "-8px", width: "28px", height: "74px", borderRadius: "16px", background: "linear-gradient(180deg,#fff,#d8dce4)", transform: "rotate(-16deg)" }}></div>
        <div style={{ position: "absolute", right: "62px", top: "-8px", width: "28px", height: "74px", borderRadius: "16px", background: "linear-gradient(180deg,#fff,#d8dce4)", transform: "rotate(16deg)" }}></div>
        <div style={{ position: "absolute", left: "0", top: "34px", width: "330px", height: "280px", borderRadius: "48% 48% 44% 44%", background: "radial-gradient(circle at 32% 22%,#fff 0%,#f6f7fa 35%,#dfe2e9 75%,#c4c8d2 100%)", boxShadow: "0 30px 60px rgba(40,50,80,.28),inset -12px -18px 30px rgba(0,0,0,.08)" }}></div>
        <div style={{ position: "absolute", left: "28px", top: "74px", width: "274px", height: "204px", borderRadius: "46%", background: "conic-gradient(from 200deg,#a9e85c,var(--color-primary-green),#a9e85c,#5ea016,#2b6a0d,#a9e85c)", padding: "13px", boxSizing: "border-box" }}><div style={{ width: "100%", height: "100%", borderRadius: "46%", background: "radial-gradient(circle at 35% 25%,#2c2c34,#050507 60%)", boxShadow: "inset 0 8px 20px rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", gap: "58px" }}><div style={{ width: "50px", height: "42px", borderRadius: "50%", background: "#fff", boxShadow: "0 0 26px rgba(255,255,255,.9)", animation: "blink 5s infinite" }}></div><div style={{ width: "50px", height: "42px", borderRadius: "50%", background: "#fff", boxShadow: "0 0 26px rgba(255,255,255,.9)", animation: "blink 5s infinite" }}></div></div></div>
        <div style={{ position: "absolute", left: "46px", top: "94px", width: "74px", height: "26px", borderRadius: "50%", background: "rgba(255,255,255,.35)", transform: "rotate(-24deg)", filter: "blur(2px)" }}></div>
      </div>
      <div style={{ position: "absolute", right: "-6px", top: "440px", zIndex: "3", padding: "10px 20px", borderRadius: "40px", background: "linear-gradient(135deg,rgba(140,150,170,.85),rgba(215,220,232,.6))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.9)", boxShadow: "0 12px 30px rgba(0,0,0,.2),inset 0 1px 0 #fff", fontSize: "22px", fontWeight: "600", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,.35)", transform: "rotate(30deg)" }}>+240 tenants</div>
      <div style={{ position: "absolute", left: "30px", bottom: "34px", zIndex: "3", padding: "8px 16px", borderRadius: "40px", background: "linear-gradient(135deg,rgba(140,150,170,.85),rgba(215,220,232,.6))", border: "1px solid rgba(255,255,255,.9)", boxShadow: "0 10px 24px rgba(0,0,0,.2)", fontSize: "17px", fontWeight: "600", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,.35)", transform: "rotate(-14deg)" }}>99.99%</div>
    </>
  );
}

/** 02 — eCommerce. */
function Card02() {
  return (
    <>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#8a8a8a" }}>02</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "54px", fontWeight: "700", letterSpacing: "-.055em", lineHeight: ".95", color: "#fff" }}><span style={{ color: "var(--color-primary-green)" }}>eCommerce</span></div>
        <div style={{ fontSize: "20px", lineHeight: "1.25", letterSpacing: "-.015em", color: "#c4c4c4" }}>B2C &amp; B2B storefronts</div>
      </div>
      <div style={{ position: "absolute", left: "28px", right: "-30px", top: "220px", bottom: "-40px", borderRadius: "40px", padding: "10px", background: "linear-gradient(180deg,#c2f087,var(--color-primary-green) 35%,#6fbb1f 75%,#2b6a0d)" }}>
        <div style={{ height: "100%", borderRadius: "32px", background: "#fff", padding: "22px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#eeeef0" }}></div><div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px" }}><div style={{ height: "8px", width: "70%", borderRadius: "4px", background: "#eeeef0" }}></div><div style={{ height: "8px", width: "45%", borderRadius: "4px", background: "#eeeef0" }}></div></div></div>
          <div style={{ height: "170px", borderRadius: "22px", background: "radial-gradient(circle at 60% 35%,#f4fbe4,#b7e577 40%,#5ea016 80%)", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", left: "22px", bottom: "22px", width: "150px", height: "56px", borderRadius: "30px 40px 14px 14px", background: "linear-gradient(180deg,#fff,#e8e8ec)", boxShadow: "0 10px 20px rgba(40,80,10,.25)" }}></div><div style={{ position: "absolute", left: "30px", bottom: "16px", width: "150px", height: "12px", borderRadius: "6px", background: "#1a1a1a" }}></div></div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", flexDirection: "column", gap: "3px" }}><div style={{ fontSize: "17px", fontWeight: "600", letterSpacing: "-.02em", color: "#1a1a1a" }}>Everyday Sneaker</div><div style={{ fontSize: "13px", color: "#777" }}>Wholesale · MOQ 24</div></div><div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-.03em", color: "#1a1a1a" }}>$89</div></div>
          <div style={{ alignSelf: "flex-start", padding: "12px 22px", borderRadius: "12px", background: "linear-gradient(90deg,#c2f087,var(--color-primary-green) 45%,#3f7f10)", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Add to cart</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "190px", top: "540px", width: "0", height: "0", borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderBottom: "26px solid #1a1a1a", transform: "rotate(-28deg)" }}></div>
      <div style={{ position: "absolute", right: "-10px", top: "200px", zIndex: "3", padding: "10px 20px", borderRadius: "40px", background: "linear-gradient(135deg,rgba(255,255,255,.35),rgba(255,255,255,.1))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.6)", boxShadow: "0 12px 30px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.7)", fontSize: "22px", fontWeight: "600", color: "#fff", transform: "rotate(24deg)" }}>+$1,230</div>
    </>
  );
}

/** 03 — DevOps. */
function Card03() {
  return (
    <>
      <svg width="360" height="720" viewBox="0 0 360 720" style={{ position: "absolute", inset: "0", overflow: "visible" }}><path d="M -40 470 C 80 420 200 480 230 600 S 300 760 420 700" stroke="url(#tO)" strokeWidth="38" fill="none" strokeLinecap="round"></path><path d="M -40 470 C 80 420 200 480 230 600 S 300 760 420 700" stroke="#fff" strokeOpacity=".4" strokeWidth="8" fill="none" strokeLinecap="round" transform="translate(-4,-6)"></path><path d="M 420 380 Q 300 420 330 520" stroke="url(#tB)" strokeWidth="32" fill="none" strokeLinecap="round"></path></svg>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#9a9a9a" }}>03</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "54px", fontWeight: "700", letterSpacing: "-.055em", lineHeight: ".95", color: "#1a1a1a" }}><span style={{ color: "#5ea016" }}>DevOps</span><br />&amp; Cloud</div>
        <div style={{ fontSize: "20px", lineHeight: "1.25", letterSpacing: "-.015em", color: "#333" }}>CI/CD pipelines</div>
      </div>
      <div style={{ position: "absolute", left: "30px", right: "30px", top: "330px", height: "140px", borderRadius: "24px", background: "rgba(40,40,40,.25)", transform: "translateY(28px) scale(.86)" }}></div>
      <div style={{ position: "absolute", left: "30px", right: "30px", top: "330px", height: "140px", borderRadius: "24px", background: "rgba(40,40,40,.45)", transform: "translateY(14px) scale(.93)" }}></div>
      <div style={{ position: "absolute", left: "24px", right: "24px", top: "320px", zIndex: "2", borderRadius: "24px", background: "linear-gradient(160deg,#2a2a2c,#121213)", border: "1px solid rgba(255,255,255,.12)", padding: "18px", display: "flex", gap: "14px", boxShadow: "0 24px 50px rgba(0,0,0,.3)" }}>
        <div style={{ width: "52px", height: "52px", flexShrink: "0", borderRadius: "16px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}><span style={{ width: "11px", height: "9px", borderRadius: "50%", background: "#111" }}></span><span style={{ width: "11px", height: "9px", borderRadius: "50%", background: "#111" }}></span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}><div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>Deploy succeeded</div><div style={{ fontSize: "13px", lineHeight: "1.35", color: "#b5b5b5" }}>main #1284 is live in eu-west-1. 412 tests passed.</div></div>
      </div>
      <div style={{ position: "absolute", left: "22px", top: "250px", zIndex: "3", padding: "10px 18px", borderRadius: "40px", background: "linear-gradient(135deg,rgba(140,150,170,.85),rgba(215,220,232,.6))", border: "1px solid rgba(255,255,255,.9)", boxShadow: "0 12px 30px rgba(0,0,0,.2),inset 0 1px 0 #fff", fontSize: "20px", fontWeight: "600", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,.35)", transform: "rotate(-12deg)", display: "flex", alignItems: "center", gap: "8px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-primary-green)", boxShadow: "0 0 10px var(--color-primary-green)" }}></span>2m 41s</div>
      <div style={{ position: "absolute", right: "30px", bottom: "60px", width: "74px", height: "74px", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#e4f9c0,var(--color-primary-green) 45%,#2b6a0d)", boxShadow: "0 16px 30px color-mix(in srgb, var(--color-primary-green) 35%, transparent)" }}></div>
    </>
  );
}

/** 04 — AI/ML. */
function Card04() {
  return (
    <>
      <svg width="360" height="720" viewBox="0 0 360 720" style={{ position: "absolute", inset: "0", overflow: "visible" }}><path d="M 300 380 C 200 330 30 380 60 480 C 90 580 320 540 300 650 C 290 720 180 740 120 760" stroke="url(#tV)" strokeWidth="74" fill="none" strokeLinecap="round"></path><path d="M 300 380 C 200 330 30 380 60 480 C 90 580 320 540 300 650" stroke="#fff" strokeOpacity=".3" strokeWidth="12" fill="none" strokeLinecap="round" transform="translate(-10,-12)"></path></svg>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#8a8a8a" }}>04</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "64px", fontWeight: "800", letterSpacing: "-.06em", lineHeight: ".9", color: "#fff" }}><span style={{ color: "var(--color-primary-green)" }}>AI/ML</span><br />&amp; Data</div>
        <div style={{ fontSize: "20px", lineHeight: "1.25", letterSpacing: "-.015em", color: "#b5b5b5" }}>Predictive analytics</div>
      </div>
      <div style={{ position: "absolute", right: "-8px", top: "330px", zIndex: "3", padding: "10px 20px", borderRadius: "40px", background: "linear-gradient(135deg,rgba(255,255,255,.4),rgba(255,255,255,.08))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.55)", boxShadow: "0 12px 30px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.7)", fontSize: "22px", fontWeight: "600", color: "#fff", transform: "rotate(28deg)" }}>+18.2%</div>
      <div style={{ position: "absolute", left: "22px", right: "22px", top: "480px", zIndex: "3", borderRadius: "22px", background: "rgba(28,28,30,.72)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.14)", padding: "16px", display: "flex", gap: "12px", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
        <div style={{ width: "46px", height: "46px", flexShrink: "0", borderRadius: "14px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><span style={{ width: "10px", height: "8px", borderRadius: "50%", background: "#111" }}></span><span style={{ width: "10px", height: "8px", borderRadius: "50%", background: "#111" }}></span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>Forecast ready</div><div style={{ fontSize: "13px", lineHeight: "1.35", color: "#b5b5b5" }}>Demand up 18.2% next quarter. Model accuracy 97.4%.</div></div>
      </div>
      <div style={{ position: "absolute", left: "24px", bottom: "40px", zIndex: "3", padding: "9px 18px", borderRadius: "40px", background: "linear-gradient(135deg,color-mix(in srgb, var(--color-primary-green) 78%, transparent),color-mix(in srgb, #2b6a0d 52%, transparent))", border: "1px solid rgba(228,249,192,.8)", boxShadow: "0 10px 24px rgba(0,0,0,.4)", fontSize: "18px", fontWeight: "600", color: "#fff", transform: "rotate(-16deg)" }}>v3 live</div>
    </>
  );
}

/** 05 — Consulting. */
function Card05() {
  return (
    <>
      <svg width="360" height="720" viewBox="0 0 360 720" style={{ position: "absolute", inset: "0", overflow: "visible" }}><path d="M -30 520 Q 90 470 200 540" stroke="url(#tO)" strokeWidth="30" fill="none" strokeLinecap="round"></path><path d="M 180 560 Q 280 640 320 760" stroke="url(#tB)" strokeWidth="34" fill="none" strokeLinecap="round"></path><path d="M 180 560 Q 280 640 320 760" stroke="#fff" strokeOpacity=".45" strokeWidth="8" fill="none" strokeLinecap="round" transform="translate(-6,-2)"></path></svg>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#9a9a9a" }}>05</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: "58px", fontWeight: "800", letterSpacing: "-.06em", lineHeight: ".9", color: "#0e0e0e" }}><span style={{ color: "#5ea016" }}>Consult</span>ing</div>
        <div style={{ fontSize: "20px", lineHeight: "1.25", letterSpacing: "-.015em", color: "#333" }}>Architecture assessments</div>
      </div>
      <div style={{ position: "absolute", left: "24px", top: "230px", zIndex: "3", display: "flex", flexDirection: "column", gap: "10px", padding: "18px", borderRadius: "22px", background: "#fff", boxShadow: "0 18px 44px rgba(0,0,0,.12)", transform: "rotate(-4deg)", width: "220px" }}>
        <div style={{ fontSize: "13px", color: "#777" }}>Findings</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#1a1a1a" }}><span>Risks</span><span style={{ fontWeight: "700", color: "#2b6a0d" }}>3</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#1a1a1a" }}><span>Quick wins</span><span style={{ fontWeight: "700", color: "var(--color-primary-green)" }}>7</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#1a1a1a" }}><span>Roadmap</span><span style={{ fontWeight: "700" }}>12 wk</span></div>
      </div>
      <div style={{ position: "absolute", right: "30px", top: "470px", zIndex: "2", width: "180px", height: "180px", borderRadius: "44px", background: "linear-gradient(145deg,#fff,#eef0f4)", boxShadow: "0 30px 60px rgba(30,40,70,.22),inset 0 -8px 16px rgba(0,0,0,.05)", transform: "rotate(14deg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px" }}>
        <div style={{ fontSize: "66px", fontWeight: "800", letterSpacing: "-.06em", lineHeight: "1", color: "#1a1a1a" }}>8.4</div>
        <div style={{ fontSize: "14px", color: "#777" }}>out of 10</div>
      </div>
    </>
  );
}

/** 06 — Mobile. */
function Card06() {
  return (
    <>
      <svg width="360" height="720" viewBox="0 0 360 720" style={{ position: "absolute", inset: "0", overflow: "visible" }}><path d="M -40 360 Q 140 330 200 420" stroke="url(#tB)" strokeWidth="36" fill="none" strokeLinecap="round"></path><path d="M -40 360 Q 140 330 200 420" stroke="#fff" strokeOpacity=".45" strokeWidth="8" fill="none" strokeLinecap="round" transform="translate(-2,-6)"></path></svg>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#9a9a9a" }}>06</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "54px", fontWeight: "700", letterSpacing: "-.055em", lineHeight: ".95", color: "#1a1a1a" }}><span style={{ color: "#5ea016" }}>Mobile</span><br />Apps</div>
        <div style={{ fontSize: "20px", lineHeight: "1.25", letterSpacing: "-.015em", color: "#333" }}>Native iOS &amp; Android</div>
      </div>
      <div style={{ position: "absolute", left: "70px", top: "260px", zIndex: "2", width: "250px", height: "520px", borderRadius: "48px", padding: "9px", background: "linear-gradient(200deg,#2b6a0d,#6fbb1f 30%,var(--color-primary-green) 70%,#c2f087)", transform: "rotate(8deg)", boxShadow: "0 30px 60px rgba(30,40,70,.25)" }}>
        <div style={{ height: "100%", borderRadius: "40px", background: "#fff", padding: "18px 16px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ width: "84px", height: "24px", borderRadius: "14px", background: "#111", alignSelf: "center" }}></div>
          <div style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-.04em", color: "#1a1a1a" }}>Good morning</div>
          <div style={{ padding: "16px", borderRadius: "20px", background: "#161616", display: "flex", flexDirection: "column", gap: "4px" }}><div style={{ fontSize: "12px", color: "#8a8a8a" }}>Balance</div><div style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-.03em", color: "#fff" }}>$4,330</div></div>
          <div style={{ display: "flex", gap: "10px" }}><div style={{ flex: "1", height: "70px", borderRadius: "18px", background: "#f0fadf" }}></div><div style={{ flex: "1", height: "70px", borderRadius: "18px", background: "#f2fadf" }}></div></div>
          <div style={{ height: "10px", width: "80%", borderRadius: "5px", background: "#eeeef0" }}></div>
          <div style={{ height: "10px", width: "60%", borderRadius: "5px", background: "#eeeef0" }}></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "18px", top: "520px", zIndex: "3", padding: "10px 18px", borderRadius: "40px", background: "linear-gradient(135deg,rgba(140,150,170,.85),rgba(215,220,232,.6))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.9)", boxShadow: "0 12px 30px rgba(0,0,0,.2),inset 0 1px 0 #fff", fontSize: "20px", fontWeight: "600", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,.35)", transform: "rotate(-14deg)" }}>★ 4.9</div>
    </>
  );
}

/** 07 — Cybersecurity. */
function Card07() {
  return (
    <>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#8a8a8a" }}>07</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "48px", fontWeight: "700", letterSpacing: "-.055em", lineHeight: ".95", color: "#fff" }}><span style={{ color: "var(--color-primary-green)" }}>Cyber</span>security</div>
        <div style={{ fontSize: "20px", lineHeight: "1.25", letterSpacing: "-.015em", color: "#b5b5b5" }}>Vulnerability assessments</div>
      </div>
      <div style={{ position: "absolute", left: "-30px", top: "330px", width: "420px", height: "420px", borderRadius: "50%", background: "conic-gradient(from 210deg,#c2f087,var(--color-primary-green),#a9e85c,#6fbb1f,#3f7f10,#2b6a0d,#c2f087)", boxShadow: "inset 0 10px 30px rgba(255,255,255,.35)" }}>
        <div style={{ position: "absolute", inset: "70px", borderRadius: "50%", background: "#050505", boxShadow: "0 0 40px rgba(0,0,0,.8)" }}></div>
      </div>
      <div style={{ position: "absolute", left: "115px", top: "470px", zIndex: "2", width: "130px", height: "130px", borderRadius: "36px", background: "linear-gradient(145deg,#fff,#e6e8ee)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: "52px", height: "60px" }}>
          <div style={{ position: "absolute", left: "10px", top: "0", width: "32px", height: "34px", border: "8px solid #1a1a1a", borderBottom: "none", borderRadius: "20px 20px 0 0", boxSizing: "border-box" }}></div>
          <div style={{ position: "absolute", left: "0", bottom: "0", width: "52px", height: "36px", borderRadius: "10px", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ width: "8px", height: "12px", borderRadius: "4px", background: "#fff" }}></span></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "22px", right: "22px", top: "250px", zIndex: "3", borderRadius: "22px", background: "rgba(28,28,30,.75)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.14)", padding: "16px", display: "flex", flexDirection: "column", gap: "6px", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", color: "#fff" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-primary-green)", boxShadow: "0 0 8px var(--color-primary-green)" }}></span>Scan complete</div>
        <div style={{ fontSize: "13px", lineHeight: "1.35", color: "#b5b5b5" }}>0 critical, 2 high across 142 hosts.</div>
      </div>
      <div style={{ position: "absolute", right: "-6px", top: "630px", zIndex: "3", padding: "10px 20px", borderRadius: "40px", background: "linear-gradient(135deg,rgba(255,255,255,.4),rgba(255,255,255,.08))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.55)", boxShadow: "0 12px 30px rgba(0,0,0,.5)", fontSize: "22px", fontWeight: "600", color: "#fff", transform: "rotate(-20deg)" }}>Score 86</div>
    </>
  );
}

/** 08 — Custom Software. */
function Card08() {
  return (
    <>
      <svg width="360" height="720" viewBox="0 0 360 720" style={{ position: "absolute", inset: "0", overflow: "visible" }}><path d="M 60 760 C 40 600 160 440 400 420" stroke="url(#tB)" strokeWidth="42" fill="none" strokeLinecap="round"></path><path d="M 60 760 C 40 600 160 440 400 420" stroke="#fff" strokeOpacity=".4" strokeWidth="10" fill="none" strokeLinecap="round" transform="translate(-6,-4)"></path><path d="M 200 350 Q 300 300 400 330" stroke="url(#tO)" strokeWidth="26" fill="none" strokeLinecap="round"></path></svg>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#9a9a9a" }}>08</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "54px", fontWeight: "700", letterSpacing: "-.055em", lineHeight: ".95", color: "#1a1a1a" }}><span style={{ color: "#5ea016" }}>Custom</span><br />Software</div>
        <div style={{ fontSize: "18px", lineHeight: "1.28", letterSpacing: "-.015em", color: "#333", textWrap: "pretty" }}>Systems written around how a business actually works, for when nothing off the shelf fits it.</div>
      </div>
      <div style={{ position: "absolute", left: "22px", right: "22px", bottom: "30px", zIndex: "2", borderRadius: "26px", background: "rgba(255,255,255,.9)", backdropFilter: "blur(12px)", boxShadow: "0 24px 50px rgba(30,40,70,.18)", padding: "56px 18px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ fontSize: "17px", fontWeight: "600", letterSpacing: "-.02em", lineHeight: "1.25", color: "#1a1a1a" }}>Your workflow, not a template.</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px" }}><div style={{ fontSize: "11px", fontWeight: "600", color: "#888" }}>Intake</div><div style={{ padding: "9px", borderRadius: "10px", background: "#f2f2f4", fontSize: "12px", color: "#1a1a1a" }}>Job #222</div></div>
          <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px" }}><div style={{ fontSize: "11px", fontWeight: "600", color: "#888" }}>On site</div><div style={{ padding: "9px", borderRadius: "10px", background: "#161616", fontSize: "12px", color: "#fff" }}>Job #219</div></div>
          <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px" }}><div style={{ fontSize: "11px", fontWeight: "600", color: "#888" }}>Invoiced</div><div style={{ padding: "9px", borderRadius: "10px", background: "linear-gradient(90deg,#5ea016,#35700d)", fontSize: "12px", fontWeight: "600", color: "#fff" }}>Job #214</div></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "30px", bottom: "232px", zIndex: "3", width: "330px", height: "310px", transformOrigin: "0 100%", transform: "scale(.3) rotate(-10deg)" }}>
        <div style={{ position: "absolute", left: "62px", top: "-8px", width: "28px", height: "74px", borderRadius: "16px", background: "linear-gradient(180deg,#fff,#d8dce4)", transform: "rotate(-16deg)" }}></div>
        <div style={{ position: "absolute", right: "62px", top: "-8px", width: "28px", height: "74px", borderRadius: "16px", background: "linear-gradient(180deg,#fff,#d8dce4)", transform: "rotate(16deg)" }}></div>
        <div style={{ position: "absolute", left: "0", top: "34px", width: "330px", height: "280px", borderRadius: "48% 48% 44% 44%", background: "radial-gradient(circle at 32% 22%,#fff 0%,#f6f7fa 35%,#dfe2e9 75%,#c4c8d2 100%)", boxShadow: "0 30px 60px rgba(40,50,80,.3)" }}></div>
        <div style={{ position: "absolute", left: "28px", top: "74px", width: "274px", height: "204px", borderRadius: "46%", background: "conic-gradient(from 200deg,#a9e85c,var(--color-primary-green),#a9e85c,#5ea016,#2b6a0d,#a9e85c)", padding: "13px", boxSizing: "border-box" }}><div style={{ width: "100%", height: "100%", borderRadius: "46%", background: "radial-gradient(circle at 35% 25%,#2c2c34,#050507 60%)", display: "flex", alignItems: "center", justifyContent: "center", gap: "58px" }}><div style={{ width: "50px", height: "42px", borderRadius: "50%", background: "#fff", boxShadow: "0 0 26px rgba(255,255,255,.9)", animation: "blink 5s infinite" }}></div><div style={{ width: "50px", height: "42px", borderRadius: "50%", background: "#fff", boxShadow: "0 0 26px rgba(255,255,255,.9)", animation: "blink 5s infinite" }}></div></div></div>
      </div>
    </>
  );
}

/** 09 — Web Apps. */
function Card09() {
  return (
    <>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#8a8a8a" }}>09</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "54px", fontWeight: "700", letterSpacing: "-.055em", lineHeight: ".95", color: "#fff" }}><span style={{ color: "var(--color-primary-green)" }}>Web</span><br />Applications</div>
        <div style={{ fontSize: "18px", lineHeight: "1.28", letterSpacing: "-.015em", color: "#c4c4c4", textWrap: "pretty" }}>Dashboards, portals and internal tools that stay quick once there is real data behind them.</div>
      </div>
      <div style={{ position: "absolute", left: "28px", right: "-80px", top: "340px", bottom: "-40px", borderRadius: "32px", padding: "9px", background: "linear-gradient(160deg,#c2f087,var(--color-primary-green) 40%,#6fbb1f 80%,#2b6a0d)" }}>
        <div style={{ height: "100%", borderRadius: "25px", background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ height: "34px", background: "#f2f2f4", display: "flex", alignItems: "center", gap: "6px", padding: "0 14px", flexShrink: "0" }}><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#2b6a0d" }}></span><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#5ea016" }}></span><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "var(--color-primary-green)" }}></span><span style={{ marginLeft: "10px", height: "16px", width: "140px", borderRadius: "8px", background: "#fff" }}></span></div>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ width: "110px", padding: "12px", borderRadius: "14px", background: "#161616", display: "flex", flexDirection: "column", gap: "3px" }}><div style={{ fontSize: "11px", color: "#8a8a8a" }}>p95 load</div><div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-.03em", color: "#c2f087" }}>180ms</div></div>
              <div style={{ width: "110px", padding: "12px", borderRadius: "14px", background: "#f2f2f4", display: "flex", flexDirection: "column", gap: "3px" }}><div style={{ fontSize: "11px", color: "#777" }}>Rows</div><div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-.03em", color: "#1a1a1a" }}>2.1M</div></div>
            </div>
            <div style={{ height: "120px", width: "240px", display: "flex", alignItems: "flex-end", gap: "8px" }}>
              <div style={{ flex: "1", height: "30%", borderRadius: "6px", background: "#e7e7ea" }}></div><div style={{ flex: "1", height: "48%", borderRadius: "6px", background: "#e7e7ea" }}></div><div style={{ flex: "1", height: "40%", borderRadius: "6px", background: "#e7e7ea" }}></div><div style={{ flex: "1", height: "64%", borderRadius: "6px", background: "linear-gradient(180deg,#c2f087,var(--color-primary-green))" }}></div><div style={{ flex: "1", height: "80%", borderRadius: "6px", background: "linear-gradient(180deg,#a9e85c,var(--color-primary-green))" }}></div><div style={{ flex: "1", height: "100%", borderRadius: "6px", background: "linear-gradient(180deg,#6fbb1f,#2b6a0d)" }}></div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", right: "-6px", top: "310px", zIndex: "3", padding: "10px 20px", borderRadius: "40px", background: "linear-gradient(135deg,rgba(255,255,255,.35),rgba(255,255,255,.1))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.6)", boxShadow: "0 12px 30px rgba(0,0,0,.35)", fontSize: "20px", fontWeight: "600", color: "#fff", transform: "rotate(22deg)" }}>12,480 users</div>
    </>
  );
}

/** 10 — ERP. */
function Card10() {
  return (
    <>
      <div style={{ position: "absolute", left: "30px", top: "30px", width: "300px", height: "300px", borderRadius: "50%", border: "1.5px solid color-mix(in srgb, var(--color-primary-green) 26%, transparent)" }}></div>
      <div style={{ position: "absolute", left: "-40px", top: "-40px", width: "440px", height: "440px", borderRadius: "50%", border: "1.5px dashed color-mix(in srgb, var(--color-primary-green) 26%, transparent)" }}></div>
      <div style={{ position: "absolute", left: "90px", top: "90px", width: "180px", height: "180px", borderRadius: "50%", border: "1.5px dashed color-mix(in srgb, #2b6a0d 30%, transparent)" }}></div>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#9a9a9a" }}>10</div>
      <div style={{ position: "absolute", left: "115px", top: "115px", width: "130px", height: "130px", borderRadius: "34px", background: "linear-gradient(145deg,#fff,#eceef3)", boxShadow: "0 26px 50px rgba(30,40,70,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", fontWeight: "800", letterSpacing: "-.05em", color: "#1a1a1a" }}>ERP</div>
      <div style={{ position: "absolute", left: "220px", top: "208px", width: "40px", height: "40px", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#e4f9c0,var(--color-primary-green) 45%,#2b6a0d)", boxShadow: "0 10px 20px color-mix(in srgb, var(--color-primary-green) 35%, transparent)" }}></div>
      <div style={{ position: "absolute", left: "112px", top: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}><div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "linear-gradient(135deg,#effbd9,#a9e85c)", border: "3px solid #fff", boxShadow: "0 6px 14px rgba(0,0,0,.12)" }}></div><div style={{ padding: "3px 8px", borderRadius: "10px", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.08)", fontSize: "11px", color: "#333" }}>Inventory</div></div>
      <div style={{ position: "absolute", right: "14px", top: "100px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}><div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg,#d5efa2,#3f7f10)", border: "3px solid #fff", boxShadow: "0 6px 14px rgba(0,0,0,.12)" }}></div><div style={{ padding: "3px 8px", borderRadius: "10px", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.08)", fontSize: "11px", color: "#333" }}>Production</div></div>
      <div style={{ position: "absolute", left: "10px", top: "150px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}><div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg,#dcf3b4,var(--color-primary-green))", border: "3px solid #fff", boxShadow: "0 6px 14px rgba(0,0,0,.12)" }}></div><div style={{ padding: "3px 8px", borderRadius: "10px", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.08)", fontSize: "11px", color: "#333" }}>Purchasing</div></div>
      <div style={{ position: "absolute", left: "170px", top: "300px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}><div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg,#1a1a1a,#444)", border: "3px solid #fff", boxShadow: "0 6px 14px rgba(0,0,0,.12)" }}></div><div style={{ padding: "3px 8px", borderRadius: "10px", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.08)", fontSize: "11px", color: "#333" }}>Accounts</div></div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "0 28px 40px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "54px", fontWeight: "700", letterSpacing: "-.055em", lineHeight: ".95", color: "#1a1a1a" }}><span style={{ color: "#5ea016" }}>ERP</span> Systems</div>
        <div style={{ fontSize: "18px", lineHeight: "1.28", letterSpacing: "-.015em", color: "#333", textWrap: "pretty" }}>Inventory, production, purchasing and accounts in one place, finally agreeing with each other.</div>
      </div>
    </>
  );
}

/** 11 — CRM. */
function Card11() {
  return (
    <>
      <svg width="360" height="720" viewBox="0 0 360 720" style={{ position: "absolute", inset: "0", overflow: "visible" }}><path d="M 420 430 C 240 420 120 520 150 760" stroke="url(#tV)" strokeWidth="64" fill="none" strokeLinecap="round"></path><path d="M 420 430 C 240 420 120 520 150 760" stroke="#fff" strokeOpacity=".3" strokeWidth="12" fill="none" strokeLinecap="round" transform="translate(-10,-8)"></path></svg>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#8a8a8a" }}>11</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "64px", fontWeight: "800", letterSpacing: "-.06em", lineHeight: ".9", color: "#fff" }}><span style={{ color: "var(--color-primary-green)" }}>CRM</span><br />Systems</div>
        <div style={{ fontSize: "18px", lineHeight: "1.28", letterSpacing: "-.015em", color: "#b5b5b5", textWrap: "pretty" }}>Pipelines, quotes and forecasts shaped around your sales motion rather than a template&apos;s stages.</div>
      </div>
      <div style={{ position: "absolute", left: "22px", width: "230px", top: "360px", zIndex: "3", borderRadius: "18px", background: "rgba(28,28,30,.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.14)", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", transform: "rotate(-4deg)" }}><div style={{ display: "flex", flexDirection: "column", gap: "2px" }}><div style={{ fontSize: "11px", color: "#8a8a8a" }}>Qualified</div><div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>Northwind</div></div><div style={{ fontSize: "15px", fontWeight: "600", color: "#c2f087" }}>$24k</div></div>
      <div style={{ position: "absolute", left: "62px", width: "230px", top: "450px", zIndex: "3", borderRadius: "18px", background: "rgba(28,28,30,.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.14)", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", transform: "rotate(-4deg)" }}><div style={{ display: "flex", flexDirection: "column", gap: "2px" }}><div style={{ fontSize: "11px", color: "#8a8a8a" }}>Quote sent</div><div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>Stark Ltd</div></div><div style={{ fontSize: "15px", fontWeight: "600", color: "#a9e85c" }}>$62k</div></div>
      <div style={{ position: "absolute", left: "102px", width: "230px", top: "540px", zIndex: "3", borderRadius: "18px", background: "linear-gradient(135deg,#5ea016,#2b6a0d)", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", transform: "rotate(-4deg)", boxShadow: "0 20px 40px color-mix(in srgb, #2b6a0d 35%, transparent)" }}><div style={{ display: "flex", flexDirection: "column", gap: "2px" }}><div style={{ fontSize: "11px", color: "rgba(255,255,255,.85)" }}>Won</div><div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>Wayne Co</div></div><div style={{ fontSize: "17px", fontWeight: "700", color: "#fff" }}>$118k</div></div>
      <div style={{ position: "absolute", left: "20px", bottom: "40px", zIndex: "3", padding: "10px 20px", borderRadius: "40px", background: "linear-gradient(135deg,rgba(255,255,255,.4),rgba(255,255,255,.08))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.55)", boxShadow: "0 12px 30px rgba(0,0,0,.5)", fontSize: "22px", fontWeight: "600", color: "#fff", transform: "rotate(-18deg)" }}>+32% win rate</div>
    </>
  );
}

/** 12 — Enterprise. */
function Card12() {
  return (
    <>
      <svg width="360" height="720" viewBox="0 0 360 720" style={{ position: "absolute", inset: "0", overflow: "visible" }}><path d="M -40 600 Q 120 520 180 620 T 420 640" stroke="url(#tO)" strokeWidth="34" fill="none" strokeLinecap="round"></path><path d="M -40 600 Q 120 520 180 620 T 420 640" stroke="#fff" strokeOpacity=".4" strokeWidth="8" fill="none" strokeLinecap="round" transform="translate(-4,-6)"></path></svg>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#9a9a9a" }}>12</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "54px", fontWeight: "700", letterSpacing: "-.055em", lineHeight: ".95", color: "#1a1a1a" }}><span style={{ color: "#5ea016" }}>Enterprise</span><br />Software</div>
        <div style={{ fontSize: "18px", lineHeight: "1.28", letterSpacing: "-.015em", color: "#333", textWrap: "pretty" }}>Platforms for the people who run the business — HR, payroll, operations, reporting.</div>
      </div>
      <div style={{ position: "absolute", left: "34px", right: "20px", top: "380px", zIndex: "2", borderRadius: "26px", background: "#fff", boxShadow: "0 26px 54px rgba(30,40,70,.18)", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", transform: "rotate(-5deg)" }}>
        <div style={{ fontSize: "13px", color: "#777" }}>Payroll · September</div>
        <div style={{ fontSize: "36px", fontWeight: "800", letterSpacing: "-.05em", lineHeight: "1", color: "#1a1a1a" }}>$482,190</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#effbd9,#a9e85c)", border: "3px solid #fff" }}></span>
          <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#dcf3b4,var(--color-primary-green))", border: "3px solid #fff", marginLeft: "-10px" }}></span>
          <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#d5efa2,#3f7f10)", border: "3px solid #fff", marginLeft: "-10px" }}></span>
          <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#1a1a1a", border: "3px solid #fff", marginLeft: "-10px", color: "#fff", fontSize: "10px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" }}>+210</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: "24px", top: "330px", zIndex: "3", padding: "12px 18px", borderRadius: "16px", background: "#262626", color: "#fff", fontSize: "15px", fontWeight: "500", transform: "rotate(-9deg)", boxShadow: "0 12px 26px rgba(0,0,0,.25)" }}>Approved for 6 countries</div>
    </>
  );
}

/** 13 — API. */
function Card13() {
  return (
    <>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#8a8a8a" }}>13</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "54px", fontWeight: "700", letterSpacing: "-.055em", lineHeight: ".95", color: "#fff" }}><span style={{ color: "var(--color-primary-green)" }}>API</span><br />Development</div>
        <div style={{ fontSize: "18px", lineHeight: "1.28", letterSpacing: "-.015em", color: "#c4c4c4", textWrap: "pretty" }}>Documented, versioned APIs another team can build against without reading your controllers.</div>
      </div>
      <div style={{ position: "absolute", left: "28px", right: "-30px", top: "360px", bottom: "-40px", borderRadius: "32px", padding: "9px", background: "linear-gradient(180deg,#c2f087,var(--color-primary-green) 40%,#6fbb1f 78%,#2b6a0d)" }}>
        <div style={{ height: "100%", borderRadius: "25px", background: "#0d0d0e", padding: "20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "8px", fontFamily: "var(--font-mono), monospace", fontSize: "14px", lineHeight: "1.55" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}><span style={{ padding: "3px 9px", borderRadius: "7px", background: "#c2f087", color: "#050505", fontWeight: "500" }}>GET</span><span style={{ color: "#fff" }}>/v2/orders/8841</span></div>
          <div style={{ color: "#6f6f6f" }}>{"{"}</div>
          <div style={{ color: "#a9e85c", paddingLeft: "16px" }}>&quot;id&quot;: <span style={{ color: "#6fbb1f" }}>&quot;ord_8841&quot;</span>,</div>
          <div style={{ color: "#a9e85c", paddingLeft: "16px" }}>&quot;total&quot;: <span style={{ color: "#6fbb1f" }}>1230.00</span>,</div>
          <div style={{ color: "#a9e85c", paddingLeft: "16px" }}>&quot;status&quot;: <span style={{ color: "#6fbb1f" }}>&quot;paid&quot;</span></div>
          <div style={{ color: "#6f6f6f" }}>{"}"}</div>
        </div>
      </div>
      <div style={{ position: "absolute", right: "-4px", top: "340px", zIndex: "3", padding: "10px 20px", borderRadius: "40px", background: "linear-gradient(135deg,rgba(255,255,255,.35),rgba(255,255,255,.1))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.6)", boxShadow: "0 12px 30px rgba(0,0,0,.35)", fontSize: "20px", fontWeight: "600", color: "#fff", transform: "rotate(22deg)", display: "flex", alignItems: "center", gap: "8px" }}><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "var(--color-primary-green)", boxShadow: "0 0 8px var(--color-primary-green)" }}></span>200 OK</div>
    </>
  );
}

/** 14 — Microservices. */
function Card14() {
  return (
    <>
      <svg width="360" height="720" viewBox="0 0 360 720" style={{ position: "absolute", inset: "0", overflow: "visible" }}><path d="M -40 420 C 100 380 260 460 180 560 S 200 700 420 690" stroke="url(#tB)" strokeWidth="36" fill="none" strokeLinecap="round"></path><path d="M -40 420 C 100 380 260 460 180 560 S 200 700 420 690" stroke="#fff" strokeOpacity=".45" strokeWidth="8" fill="none" strokeLinecap="round" transform="translate(-4,-6)"></path></svg>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#9a9a9a" }}>14</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "50px", fontWeight: "700", letterSpacing: "-.055em", lineHeight: ".95", color: "#1a1a1a" }}><span style={{ color: "#5ea016" }}>Micro</span>services</div>
        <div style={{ fontSize: "18px", lineHeight: "1.28", letterSpacing: "-.015em", color: "#333", textWrap: "pretty" }}>Services split along boundaries that exist in the business, when a monolith has stopped fitting.</div>
      </div>
      <div style={{ position: "absolute", left: "120px", top: "470px", zIndex: "2", width: "120px", height: "120px", borderRadius: "32px", background: "#161616", boxShadow: "0 24px 48px rgba(0,0,0,.3)", transform: "rotate(-8deg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "600", color: "#fff" }}>Gateway</div>
      <div style={{ position: "absolute", left: "24px", top: "340px", zIndex: "2", padding: "14px 16px", borderRadius: "20px", background: "linear-gradient(145deg,#fff,#eef0f4)", boxShadow: "0 16px 34px rgba(30,40,70,.16)", transform: "rotate(-10deg)", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: "600", color: "#1a1a1a" }}><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "var(--color-primary-green)" }}></span>Orders</div>
      <div style={{ position: "absolute", right: "22px", top: "380px", zIndex: "2", padding: "14px 16px", borderRadius: "20px", background: "linear-gradient(145deg,#fff,#eef0f4)", boxShadow: "0 16px 34px rgba(30,40,70,.16)", transform: "rotate(8deg)", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: "600", color: "#1a1a1a" }}><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "var(--color-primary-green)" }}></span>Billing</div>
      <div style={{ position: "absolute", left: "30px", top: "620px", zIndex: "2", padding: "14px 16px", borderRadius: "20px", background: "linear-gradient(145deg,#fff,#eef0f4)", boxShadow: "0 16px 34px rgba(30,40,70,.16)", transform: "rotate(6deg)", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: "600", color: "#1a1a1a" }}><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "var(--color-primary-green)" }}></span>Inventory</div>
      <div style={{ position: "absolute", right: "26px", top: "580px", zIndex: "2", padding: "14px 16px", borderRadius: "20px", background: "linear-gradient(135deg,#5ea016,#2b6a0d)", boxShadow: "0 16px 34px color-mix(in srgb, #2b6a0d 30%, transparent)", transform: "rotate(-12deg)", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: "600", color: "#fff" }}><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#fff", animation: "pulse 1.2s infinite" }}></span>Shipping</div>
    </>
  );
}

/** 15 — Automation. */
function Card15() {
  return (
    <>
      <svg width="360" height="720" viewBox="0 0 360 720" style={{ position: "absolute", inset: "0", overflow: "visible" }}><path d="M 50 660 L 160 560 L 120 490 L 240 420" stroke="url(#tU)" strokeWidth="44" fill="none" strokeLinecap="round" strokeLinejoin="round"></path><path d="M 50 660 L 160 560 L 120 490 L 240 420" stroke="#fff" strokeOpacity=".3" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(-6,-6)"></path><polygon points="306,382 266,460 214,382" fill="#c2f087" transform="rotate(-2 260 420)"></polygon></svg>
      <div style={{ position: "absolute", right: "28px", top: "30px", fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#8a8a8a" }}>15</div>
      <div style={{ position: "relative", zIndex: "2", padding: "40px 28px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: "54px", fontWeight: "700", letterSpacing: "-.055em", lineHeight: ".95", color: "#fff" }}><span style={{ color: "var(--color-primary-green)" }}>Business</span><br />Automation</div>
        <div style={{ fontSize: "18px", lineHeight: "1.28", letterSpacing: "-.015em", color: "#b5b5b5", textWrap: "pretty" }}>The manual steps between systems removed — reconciliations, exports, approvals.</div>
      </div>
      <div style={{ position: "absolute", right: "-6px", top: "300px", zIndex: "3", padding: "10px 18px", borderRadius: "40px", background: "linear-gradient(135deg,rgba(255,255,255,.4),rgba(255,255,255,.08))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.55)", boxShadow: "0 12px 30px rgba(0,0,0,.5)", fontSize: "19px", fontWeight: "600", color: "#fff", transform: "rotate(18deg)" }}>Reconciled</div>
      <div style={{ position: "absolute", left: "-6px", top: "470px", zIndex: "3", padding: "10px 18px", borderRadius: "40px", background: "linear-gradient(135deg,rgba(255,255,255,.4),rgba(255,255,255,.08))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.55)", boxShadow: "0 12px 30px rgba(0,0,0,.5)", fontSize: "19px", fontWeight: "600", color: "#fff", transform: "rotate(-16deg)" }}>Exported</div>
      <div style={{ position: "absolute", left: "150px", right: "22px", top: "570px", zIndex: "3", borderRadius: "20px", background: "rgba(28,28,30,.75)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.14)", padding: "14px", display: "flex", flexDirection: "column", gap: "6px", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", color: "#fff" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-primary-green)", boxShadow: "0 0 8px var(--color-primary-green)" }}></span>Approved</div>
        <div style={{ fontSize: "12px", lineHeight: "1.35", color: "#b5b5b5" }}>1,204 lines, no one touched a spreadsheet.</div>
      </div>
    </>
  );
}

export const GROUNDS = [
  "#fff",
  "#2b2b2b",
  "#fff",
  "#050505",
  "#fff",
  "#fff",
  "#050505",
  "#fff",
  "#2b2b2b",
  "#fff",
  "#050505",
  "#fff",
  "#2b2b2b",
  "#fff",
  "#050505",
];

export const BODIES = [
  Card01,
  Card02,
  Card03,
  Card04,
  Card05,
  Card06,
  Card07,
  Card08,
  Card09,
  Card10,
  Card11,
  Card12,
  Card13,
  Card14,
  Card15,
];
