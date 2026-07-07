/* @ds-bundle: {"format":3,"namespace":"IPORFusionDesignSystem_a32fa3","components":[],"sourceHashes":{"ui_kits/website/HeroNav.jsx":"064f480c039c","ui_kits/website/LaunchModal.jsx":"d207e37eea49","ui_kits/website/Primitives.jsx":"c6713ef216a0","ui_kits/website/Sections.jsx":"18ec7fc6095b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.IPORFusionDesignSystem_a32fa3 = window.IPORFusionDesignSystem_a32fa3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/website/HeroNav.jsx
try { (() => {
// Fusion — Nav + Hero
const {
  useState: _useState,
  useEffect: _useEffect
} = React;
function Nav({
  theme,
  setTheme,
  onLaunch
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      height: 71,
      padding: '0 136px',
      background: theme === 'dark' ? 'rgba(9,14,20,0.8)' : 'rgba(245,245,250,0.8)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.03)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    style: {
      display: 'flex',
      alignItems: 'center',
      height: 32
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: theme === 'dark' ? '../../assets/fusion-logo-white.png' : '../../assets/fusion-logo-black.png',
    alt: "Fusion by IPOR",
    style: {
      height: 24
    }
  })), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      gap: 4,
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, ['Vaults', 'Solutions', 'Security', 'Docs'].map(label => /*#__PURE__*/React.createElement("li", {
    key: label
  }, /*#__PURE__*/React.createElement("a", {
    href: '#' + label.toLowerCase(),
    style: {
      display: 'inline-block',
      padding: '8px 14px',
      borderRadius: 9999,
      fontSize: 14,
      color: theme === 'dark' ? '#9BA3AF' : '#000',
      textDecoration: 'none',
      fontFamily: 'Poppins, sans-serif'
    }
  }, label))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    "aria-label": "Toggle theme",
    style: {
      width: 36,
      height: 36,
      borderRadius: 9999,
      border: '1px solid #9BA3AF',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme === 'dark' ? '#fff' : '#000',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: theme === 'dark' ? 'sun' : 'moon',
    size: 18,
    stroke: 1.6
  })), /*#__PURE__*/React.createElement(SecondaryButton, {
    size: "sm",
    onClick: () => alert('Builders portal')
  }, "Build"), /*#__PURE__*/React.createElement(PrimaryButton, {
    size: "sm",
    icon: "arrow-right",
    onClick: onLaunch
  }, "Launch App")));
}
function Hero({
  theme,
  onLaunch
}) {
  const isDark = theme === 'dark';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 168,
      paddingBottom: 96,
      paddingLeft: 136,
      paddingRight: 136,
      background: isDark ? 'radial-gradient(120% 80% at 50% 0%, rgba(132,41,255,0.18), rgba(9,14,20,0) 60%), #090E14' : '#F3F0FF'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      opacity: isDark ? 0.6 : 1,
      backgroundImage: 'url(../../assets/bg-02.png)',
      backgroundSize: '120% auto',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      mixBlendMode: isDark ? 'screen' : 'normal'
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.04,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1152,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 500,
      fontSize: 60,
      lineHeight: '75px',
      color: isDark ? '#fff' : '#000',
      letterSpacing: '-0.01em',
      maxWidth: 760
    }
  }, "Vault infrastructure for", /*#__PURE__*/React.createElement("br", null), "institutional-grade yield."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 32,
      marginBottom: 0,
      maxWidth: 672,
      fontFamily: 'Poppins, sans-serif',
      fontSize: 18,
      lineHeight: '28px',
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, "Deploy and manage onchain vault strategies or earn through professionally curated vaults. Modular infrastructure across Aave, Morpho, SparkLend, Euler, and more."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48,
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(PrimaryButton, {
    onClick: onLaunch
  }, "Launch App"), /*#__PURE__*/React.createElement(SecondaryButton, null, "Start Building")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 40,
      background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24
    }
  }, [{
    label: 'TVM',
    value: '$128.0M'
  }, {
    label: 'Vaults',
    value: '81'
  }, {
    label: 'Volume processed',
    value: '$10B+'
  }].map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: s.label
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 32,
      background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: isDark ? '#9BA3AF' : '#70747A',
      fontFamily: 'Poppins, sans-serif'
    }
  }, s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"Source Sans 3", "Source Sans Pro", sans-serif',
      fontWeight: 700,
      fontSize: 20,
      lineHeight: '28px',
      letterSpacing: '-0.025em',
      color: isDark ? '#fff' : '#000'
    }
  }, s.value))))))));
}
Object.assign(window, {
  Nav,
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HeroNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/LaunchModal.jsx
try { (() => {
// Fusion — "Launch App" demo modal. A faux vault dashboard the user
// can open from any "Launch App" CTA so the kit feels clickable.

function LaunchModal({
  open,
  onClose,
  theme
}) {
  const [deposit, setDeposit] = React.useState('');
  if (!open) return null;
  const isDark = theme === 'dark';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(960px, 100%)',
      maxHeight: '88vh',
      overflow: 'auto',
      borderRadius: 16,
      background: '#090E14',
      border: '1px solid #2E3137',
      color: '#fff',
      fontFamily: 'Poppins, sans-serif',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #2E3137'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/fusion-logo-white.png",
    style: {
      height: 22
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 11.5,
      color: '#9BA3AF',
      marginLeft: 8
    }
  }, "app.fusion.ipor.io")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 32,
      height: 32,
      borderRadius: 9999,
      border: '1px solid #2E3137',
      background: 'transparent',
      color: '#9BA3AF',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14,
    stroke: 2
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 9999,
      background: 'linear-gradient(135deg,#8429FF,#6C00FF)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600
    }
  }, "IPOR USDC Prime"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 11.5,
      color: '#9BA3AF'
    }
  }, "0x84F2\u202629Ff \xB7 Base"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginTop: 18
    }
  }, [{
    l: 'APY (7d)',
    v: '11.42%',
    accent: true
  }, {
    l: 'TVL',
    v: '$48.6M'
  }, {
    l: 'Strategy',
    v: 'Multi-lend'
  }, {
    l: 'Curator',
    v: 'Tau Labs'
  }].map(s => /*#__PURE__*/React.createElement("div", {
    key: s.l,
    style: {
      padding: 14,
      borderRadius: 12,
      background: '#161A20',
      border: '1px solid #2E3137'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter, Poppins',
      fontSize: 11,
      color: '#9BA3AF',
      fontWeight: 300
    }
  }, s.l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Source Sans 3", sans-serif',
      fontWeight: 700,
      fontSize: 22,
      marginTop: 4,
      color: s.accent ? '#A37FFF' : '#fff',
      letterSpacing: '-0.025em'
    }
  }, s.v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: 16,
      borderRadius: 12,
      background: '#161A20',
      border: '1px solid #2E3137'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, "Net yield \xB7 30 days"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, ['7d', '30d', '90d', 'ALL'].map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      padding: '3px 10px',
      borderRadius: 9999,
      fontSize: 11,
      background: i === 1 ? 'rgba(132,41,255,0.15)' : 'transparent',
      color: i === 1 ? '#A37FFF' : '#9BA3AF',
      border: i === 1 ? '1px solid rgba(132,41,255,0.35)' : '1px solid transparent'
    }
  }, t)))), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 420 120",
    style: {
      width: '100%',
      height: 120
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "fillGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#8429FF",
    stopOpacity: "0.5"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#8429FF",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M0,80 C40,70 70,72 110,55 C150,38 180,60 215,45 C250,32 280,40 315,28 C350,18 380,22 420,12 L420,120 L0,120 Z",
    fill: "url(#fillGrad)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,80 C40,70 70,72 110,55 C150,38 180,60 215,45 C250,32 280,40 315,28 C350,18 380,22 420,12",
    fill: "none",
    stroke: "#8429FF",
    strokeWidth: "2"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: 16,
      borderRadius: 12,
      background: '#161A20',
      border: '1px solid #2E3137'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 12
    }
  }, "Allocation by protocol"), [{
    name: 'Aave V3',
    pct: 42,
    color: '#8429FF'
  }, {
    name: 'Morpho',
    pct: 28,
    color: '#A37FFF'
  }, {
    name: 'SparkLend',
    pct: 18,
    color: '#3D88FF'
  }, {
    name: 'Euler',
    pct: 12,
    color: '#9BA3AF'
  }].map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '6px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 90,
      fontSize: 12.5
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 6,
      borderRadius: 9999,
      background: '#2E3137',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: p.pct + '%',
      height: '100%',
      background: p.color,
      borderRadius: 9999
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      textAlign: 'right',
      fontFamily: '"Source Sans 3"',
      fontWeight: 600,
      fontSize: 13
    }
  }, p.pct, "%"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      borderRadius: 12,
      background: '#161A20',
      border: '1px solid #2E3137',
      alignSelf: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      padding: 4,
      background: '#090E14',
      borderRadius: 9999,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      flex: 1,
      padding: '8px 0',
      borderRadius: 9999,
      background: '#fff',
      color: '#000',
      border: 0,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Deposit"), /*#__PURE__*/React.createElement("button", {
    style: {
      flex: 1,
      padding: '8px 0',
      borderRadius: 9999,
      background: 'transparent',
      color: '#9BA3AF',
      border: 0,
      fontSize: 13,
      cursor: 'pointer'
    }
  }, "Withdraw")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#9BA3AF',
      marginBottom: 6
    }
  }, "You deposit"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: 12,
      borderRadius: 10,
      background: '#090E14',
      border: '1px solid #2E3137'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: deposit,
    onChange: e => setDeposit(e.target.value.replace(/[^0-9.]/g, '')),
    placeholder: "0.0",
    style: {
      flex: 1,
      background: 'transparent',
      border: 0,
      outline: 'none',
      color: '#fff',
      fontFamily: '"Source Sans 3", sans-serif',
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: '-0.025em'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 10px',
      borderRadius: 9999,
      background: '#161A20',
      border: '1px solid #2E3137'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 9999,
      background: 'linear-gradient(135deg,#3D88FF,#006EF2)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, "USDC"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11,
      color: '#9BA3AF'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Balance: 12,480.50 USDC"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#A37FFF',
      cursor: 'pointer'
    }
  }, "Max")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      padding: 14,
      borderRadius: 10,
      background: '#090E14',
      border: '1px solid #2E3137'
    }
  }, [['Projected APY', '11.42%'], ['Performance fee', '8.0% of yield'], ['Curator', 'Tau Labs'], ['Risk band', 'Conservative']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '4px 0',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#9BA3AF'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#fff',
      fontFamily: k === 'Projected APY' ? '"Source Sans 3"' : 'inherit',
      fontWeight: k === 'Projected APY' ? 700 : 500
    }
  }, v)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => alert(deposit ? `Deposit of ${deposit} USDC submitted to IPOR USDC Prime (demo).` : 'Enter an amount.'),
    style: {
      marginTop: 18,
      width: '100%',
      padding: '14px 0',
      borderRadius: 9999,
      border: 0,
      background: 'linear-gradient(180deg,#8429FF,#6C00FF)',
      color: '#fff',
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: '0.04em',
      cursor: 'pointer',
      fontFamily: 'Poppins, sans-serif'
    }
  }, "Deposit USDC"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 12,
      fontSize: 10.5,
      color: 'rgba(155,163,175,0.55)',
      lineHeight: '15px'
    }
  }, "*Simulated. No actual transaction is signed. This UI kit is a design reference.")))));
}
Object.assign(window, {
  LaunchModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/LaunchModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Primitives.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Fusion website UI kit — primitives
// Buttons, icons, layout helpers. Loaded as Babel script;
// shares globals with App via window.* at end.

const {
  useState,
  useEffect,
  useRef
} = React;

/* ───────── Icons (Lucide-style outline, 1.5px stroke, monochrome) ───────── */
function Icon({
  name,
  size = 18,
  stroke = 1.5,
  color
}) {
  const s = {
    width: size,
    height: size,
    color: color || 'currentColor'
  };
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  const paths = {
    'arrow-right': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M5 12h14"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M13 6l6 6-6 6"
    })),
    'arrow-up-right': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M7 17 17 7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 7h8v8"
    })),
    'chevron-right': /*#__PURE__*/React.createElement("path", {
      d: "M9 6l6 6-6 6"
    }),
    'check': /*#__PURE__*/React.createElement("path", {
      d: "M4 12l5 5L20 6"
    }),
    'x': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M6 6l12 12"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 18 18 6"
    })),
    'sun': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
    })),
    'moon': /*#__PURE__*/React.createElement("path", {
      d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
    }),
    'eye': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
    })),
    'shield': /*#__PURE__*/React.createElement("path", {
      d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
    }),
    'shield-check': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 12l2 2 4-4"
    })),
    'layers': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 2 2 7l10 5 10-5-10-5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2 17l10 5 10-5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2 12l10 5 10-5"
    })),
    'sparkles': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9z"
    })),
    'grid': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "3",
      width: "7",
      height: "7"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "3",
      width: "7",
      height: "7"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "14",
      width: "7",
      height: "7"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "14",
      width: "7",
      height: "7"
    })),
    'database': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("ellipse", {
      cx: "12",
      cy: "5",
      rx: "9",
      ry: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"
    })),
    'chart': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 3v18h18"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 14l4-4 3 3 5-6"
    })),
    'coin': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 9c0-1.5 1.34-2 3-2s3 .67 3 2-1.34 2-3 2-3 .67-3 2 1.34 2 3 2 3-.5 3-2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 6v12"
    })),
    'wallet': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M21 12V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 12h5"
    })),
    'puzzle': /*#__PURE__*/React.createElement("path", {
      d: "M19 13a2 2 0 0 0-2 2v2h-2a2 2 0 1 1 0-4 2 2 0 0 0-4 0V9h-2a2 2 0 0 0 0 4H7a2 2 0 0 1-2-2V5h4a2 2 0 0 0 4 0h4v4a2 2 0 0 0 2 2h2v2z"
    }),
    'plug': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 22v-5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 8V2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 8V2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M18 8v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8h12z"
    })),
    'cube': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 2 2 7v10l10 5 10-5V7l-10-5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2 7l10 5 10-5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 22V12"
    })),
    'lock': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "11",
      width: "16",
      height: "10",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 11V7a4 4 0 1 1 8 0v4"
    })),
    'zap': /*#__PURE__*/React.createElement("path", {
      d: "M13 2 4 14h7l-1 8 9-12h-7l1-8z"
    }),
    'globe': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 12h18"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"
    })),
    'menu': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 6h18M3 12h18M3 18h18"
    })),
    'code': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M16 18l6-6-6-6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 6l-6 6 6 6"
    })),
    'x-social': /*#__PURE__*/React.createElement("path", {
      d: "M4 4l16 16M20 4 4 20"
    }),
    'github': /*#__PURE__*/React.createElement("path", {
      d: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z"
    }),
    'discord': /*#__PURE__*/React.createElement("path", {
      d: "M19 6c-.6-.3-1.3-.5-2-.6l-.2.4a8 8 0 0 0-2.4-.4 8 8 0 0 0-2.4.4l-.2-.4c-.7.1-1.4.3-2 .6a14 14 0 0 0-2.4 7c0 .1 0 .2.1.3.7.6 1.6 1 2.6 1.3.1 0 .2 0 .3-.1l.6-.9c-.6-.2-1.1-.4-1.6-.7.1-.1.2-.2.3-.2a8.7 8.7 0 0 0 7.4 0c.1 0 .2.1.3.2-.5.3-1 .5-1.6.7l.6.9c.1.1.2.1.3.1 1 -.3 1.9 -.7 2.6 -1.3.1-.1.1-.2.1-.3a14 14 0 0 0-2.4-7zM10 12c-.5 0-1-.5-1-1.1s.4-1.1 1-1.1 1 .5 1 1.1-.4 1.1-1 1.1zm4 0c-.5 0-1-.5-1-1.1s.4-1.1 1-1.1 1 .5 1 1.1-.4 1.1-1 1.1z"
    })
  };
  return /*#__PURE__*/React.createElement("svg", _extends({}, common, {
    style: s
  }), paths[name] || null);
}

/* ───────── Buttons ───────── */
function PrimaryButton({
  children,
  icon = 'arrow-right',
  size = 'lg',
  onClick,
  as = 'button'
}) {
  const Tag = as;
  const pad = size === 'lg' ? '12px 28px' : '8px 20px';
  return /*#__PURE__*/React.createElement(Tag, {
    onClick: onClick,
    className: "fz-btn fz-btn-primary",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: pad,
      borderRadius: 9999,
      background: 'linear-gradient(180deg,#8429FF 0%,#6C00FF 100%)',
      border: '1px solid #8429FF',
      color: '#fff',
      fontFamily: 'Poppins, sans-serif',
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: '0.04em',
      cursor: 'pointer',
      textDecoration: 'none',
      lineHeight: 1,
      transition: 'filter 220ms cubic-bezier(.22,1,.36,1), transform 220ms'
    }
  }, /*#__PURE__*/React.createElement("span", null, children), icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 14,
    stroke: 2
  }));
}
function SecondaryButton({
  children,
  size = 'lg',
  onClick,
  as = 'button'
}) {
  const Tag = as;
  const pad = size === 'lg' ? '12px 28px' : '8px 20px';
  return /*#__PURE__*/React.createElement(Tag, {
    onClick: onClick,
    className: "fz-btn fz-btn-secondary",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: pad,
      borderRadius: 9999,
      background: 'transparent',
      border: '1px solid #9BA3AF',
      color: '#000',
      fontFamily: 'Poppins, sans-serif',
      fontSize: 14,
      fontWeight: 400,
      letterSpacing: '0.04em',
      cursor: 'pointer',
      textDecoration: 'none',
      lineHeight: 1,
      transition: 'border-color 220ms, color 220ms'
    }
  }, children);
}

/* ───────── Card ───────── */
function Card({
  children,
  style,
  hover = false,
  padding = 32
}) {
  const [hov, setHov] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      background: '#fff',
      border: '1px solid #E5E5E5',
      borderRadius: 16,
      padding,
      transition: 'transform 220ms cubic-bezier(.22,1,.36,1), box-shadow 220ms',
      transform: hover && hov ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: hover && hov ? '0 8px 24px rgba(0,0,0,0.06)' : 'none',
      ...style
    }
  }, children);
}

/* ───────── Icon-tile (used in feature lists, lists, etc) ───────── */
function IconTile({
  name,
  size = 32,
  tone = 'tint'
}) {
  const styles = {
    tint: {
      bg: '#F3F0FF',
      fg: '#8429FF'
    },
    purple: {
      bg: 'linear-gradient(180deg,#8429FF,#6C00FF)',
      fg: '#fff'
    },
    neutral: {
      bg: '#F5F5FA',
      fg: '#000'
    }
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: size <= 28 ? 8 : 10,
      background: styles.bg,
      color: styles.fg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: Math.round(size * 0.55),
    stroke: 1.8
  }));
}

/* ───────── Section wrappers ───────── */
function Section({
  children,
  bg,
  paddingY = 112,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: bg || 'transparent',
      padding: `${paddingY}px 0`,
      position: 'relative',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1152,
      margin: '0 auto',
      padding: '0 24px'
    }
  }, children));
}
function PurpleGlow({
  left,
  right,
  top,
  size = 400
}) {
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left,
      right,
      top,
      width: size,
      height: size * 1.25,
      borderRadius: 9999,
      background: 'rgba(132,41,255,0.07)',
      filter: 'blur(40px)',
      pointerEvents: 'none'
    }
  });
}
Object.assign(window, {
  Icon,
  PrimaryButton,
  SecondaryButton,
  Card,
  IconTile,
  Section,
  PurpleGlow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Sections.jsx
try { (() => {
// Fusion — Marketing sections (transparency, testimonials, plug & play,
// audiences, comparison table, final CTA, footer)

function Transparency({
  theme
}) {
  const isDark = theme === 'dark';
  const features = [{
    icon: 'chart',
    title: 'Historical Allocation\nBreakdown'
  }, {
    icon: 'layers',
    title: 'Protocol-Level Credit\nMarkets'
  }, {
    icon: 'sparkles',
    title: 'Live Yield Metrics'
  }, {
    icon: 'shield-check',
    title: 'Transaction-Level\nAuditability'
  }, {
    icon: 'coin',
    title: 'Cost & Slippage\nTransparency'
  }];
  return /*#__PURE__*/React.createElement(Section, {
    paddingY: 112,
    bg: isDark ? '#090E14' : 'transparent'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 40,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid ' + (isDark ? '#2E3137' : '#E5E5E5'),
      background: '#161A20',
      aspectRatio: '16/18',
      backgroundImage: 'url(../../assets/vault-dashboard-screenshot.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'Poppins',
      fontWeight: 500,
      fontSize: 45,
      lineHeight: '60px',
      letterSpacing: '-0.01em',
      color: isDark ? '#fff' : '#000'
    }
  }, "See everything. Trust", /*#__PURE__*/React.createElement("br", null), "nothing blindly."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      marginBottom: 32,
      maxWidth: 540,
      fontFamily: 'Poppins',
      fontSize: 16,
      lineHeight: '26px',
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, "Every vault in Fusion exposes its full mechanics: allocations, performance, costs, and onchain activity. You always know exactly what's happening with your capital."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px 24px'
    }
  }, features.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.title,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: f.icon,
    size: 28
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Poppins',
      fontSize: 14,
      fontWeight: 600,
      lineHeight: '20px',
      color: isDark ? '#fff' : '#000',
      whiteSpace: 'pre-line'
    }
  }, f.title)))), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 24,
      fontSize: 12,
      lineHeight: '16px',
      color: isDark ? 'rgba(155,163,175,0.6)' : 'rgba(112,116,122,0.6)'
    }
  }, "*Product interface shown for illustrative purposes only. Displayed values are simulated and do not represent actual portfolio performance, balances, or guaranteed returns."))));
}
function Testimonials({
  theme
}) {
  const isDark = theme === 'dark';
  const TestCard = ({
    logo,
    quote,
    name,
    role,
    sub,
    avatar
  }) => /*#__PURE__*/React.createElement(Card, {
    hover: true,
    style: {
      background: isDark ? '#161A20' : '#fff',
      border: '1px solid ' + (isDark ? '#2E3137' : '#E5E5E5'),
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: logo,
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: 0.3,
      fontSize: 13,
      letterSpacing: '0.06em',
      color: isDark ? '#fff' : '#000',
      fontWeight: 600
    }
  }, name === 'James Harris' ? 'TESSERACT' : name === 'Vlad Sava' ? 'TAU LABS' : 'PARTNER')), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      marginBottom: 28,
      fontFamily: 'Poppins',
      fontSize: 15,
      lineHeight: '26px',
      color: isDark ? '#9BA3AF' : '#374151'
    }
  }, quote), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: isDark ? '#2E3137' : '#E5E5E5',
      margin: '0 0 22px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 9999,
      background: `url(${avatar}) center/cover no-repeat`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: isDark ? '#fff' : '#000'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, role), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: isDark ? 'rgba(155,163,175,0.5)' : 'rgba(112,116,122,0.5)'
    }
  }, sub))));
  return /*#__PURE__*/React.createElement(Section, {
    paddingY: 112,
    bg: isDark ? '#000' : '#E9E9F3'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'Poppins',
      fontWeight: 500,
      fontSize: 45,
      lineHeight: '60px',
      letterSpacing: '-0.01em',
      color: isDark ? '#fff' : '#000'
    }
  }, "Trusted by the teams building", /*#__PURE__*/React.createElement("br", null), "the future of onchain capital."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      marginBottom: 0,
      fontFamily: 'Poppins',
      fontSize: 18,
      lineHeight: '28px',
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, "Leading curators, asset managers and projects rely on", /*#__PURE__*/React.createElement("br", null), "Fusion to power their onchain strategies.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(TestCard, {
    logo: "cube",
    name: "James Harris",
    role: "CEO \xB7 Tesseract",
    sub: "$500M+ AUM, MiCA-Authorized",
    avatar: "../../assets/avatar-james-harris.png",
    quote: "\"Working with the IPOR Fusion team has been an exceptional experience. They bring deep technical expertise and market understanding, and partner closely on getting every detail right \u2014 combining strong infrastructure with a delivery-focused mindset.\""
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(TestCard, {
    logo: "layers",
    name: "Vlad Sava",
    role: "Founder \xB7 Tau Labs",
    avatar: "../../assets/avatar-3.png",
    quote: "\"IPOR Fusion drastically reduces our operational overhead, allowing us to launch better vaults, faster. Their team is always responsive and proactive in helping us optimize our strategies.\""
  }), /*#__PURE__*/React.createElement(TestCard, {
    logo: "zap",
    name: "Mei Suzuki",
    role: "Head of Strategy \xB7 Helix",
    avatar: "../../assets/avatar-4.png",
    quote: "\"Fusion gave us institutional-grade vault infrastructure without rebuilding from scratch. The fuse module library covers everything we needed and the team treats us like a real partner.\""
  }))));
}
function InfrastructureEdge({
  theme
}) {
  const isDark = theme === 'dark';
  const items = [{
    icon: 'puzzle',
    title: 'Modular Vault Architecture',
    body: 'Compose strategies from a curated fuse library. Swap any module in or out without redeploying.'
  }, {
    icon: 'lock',
    title: 'Discrete Off-Chain Execution',
    body: 'Sign strategy updates offchain, settle onchain. Quoter and Allocator separated by design.'
  }, {
    icon: 'shield',
    title: 'Institutional-Grade Risk Controls',
    body: 'Pre-trade caps, balance sheet limits, per-fuse exposure ceilings, oracle freshness checks.'
  }, {
    icon: 'globe',
    title: 'Multi-Chain Execution',
    body: 'Deploy the same vault contract across Ethereum, Base, Arbitrum and Optimism with shared accounting.'
  }, {
    icon: 'eye',
    title: 'Transparent Performance Analytics',
    body: 'On-chain auditability, transaction-level cost reporting, per-block allocation deltas — exposed by default.'
  }];
  return /*#__PURE__*/React.createElement(Section, {
    paddingY: 128
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 48,
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'Poppins',
      fontWeight: 500,
      fontSize: 45,
      lineHeight: '60px',
      letterSpacing: '-0.01em',
      color: isDark ? '#fff' : '#000'
    }
  }, "Infrastructure that", /*#__PURE__*/React.createElement("br", null), "enforces your edge."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      marginBottom: 0,
      fontFamily: 'Poppins',
      fontSize: 18,
      lineHeight: '28px',
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, "Every component of Fusion is designed for asset managers who need transparency, composability and predictable execution.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, items.map(it => /*#__PURE__*/React.createElement(Card, {
    key: it.title,
    hover: true,
    style: {
      background: isDark ? '#161A20' : '#fff',
      border: '1px solid ' + (isDark ? '#2E3137' : '#E5E5E5'),
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: it.icon,
    size: 32
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 16,
      fontWeight: 600,
      color: isDark ? '#fff' : '#000'
    }
  }, it.title)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13.5,
      lineHeight: '22px',
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, it.body)))));
}
function PlugAndPlay({
  theme
}) {
  const isDark = theme === 'dark';
  const protocols = ['Aave', 'Morpho', 'SparkLend', 'Euler', 'Compound', 'Pendle'];
  return /*#__PURE__*/React.createElement(Section, {
    paddingY: 128
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'Poppins',
      fontWeight: 500,
      fontSize: 45,
      lineHeight: '60px',
      letterSpacing: '-0.01em',
      color: isDark ? '#fff' : '#000'
    }
  }, "Plug & Play"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      marginBottom: 0,
      fontFamily: 'Poppins',
      fontSize: 18,
      lineHeight: '29px',
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, "Connect to leading onchain liquidity protocols", /*#__PURE__*/React.createElement("br", null), "through composable fuse modules.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, protocols.map((p, i) => /*#__PURE__*/React.createElement(Card, {
    key: p,
    hover: true,
    padding: 24,
    style: {
      background: isDark ? '#161A20' : '#fff',
      border: '1px solid ' + (isDark ? '#2E3137' : '#E5E5E5'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      minHeight: 88
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: ['plug', 'puzzle', 'cube', 'layers', 'wallet', 'grid'][i % 6],
    size: 40,
    tone: "tint"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      color: isDark ? '#fff' : '#000'
    }
  }, p)))));
}
function Audiences({
  theme
}) {
  const isDark = theme === 'dark';
  const groups = [{
    icon: 'code',
    title: 'Builders & Curators',
    desc: "Create automated onchain vaults without writing a single smart contract. Pick your fuses, set your parameters, and launch. Earn curator fees from the strategies you design.",
    bullets: ['Plug-and-play fuse library', 'One-click vault deployment via Factory', 'Composable across 20+ protocols', 'Earn fees as an Atomist']
  }, {
    icon: 'wallet',
    title: 'Liquidity Providers',
    desc: 'Access professionally curated, auto-optimized yield strategies with a single deposit. From lending optimization to leveraged looping, risk-adjusted to your preference.',
    bullets: ['One-click deposit into curated strategies', 'Automated rebalancing & compounding', 'Siloed risk, no socialized losses', 'Instant liquidity, no lockups']
  }, {
    icon: 'globe',
    title: 'Protocols & Distributors',
    desc: "Embed Fusion vaults as plug-and-play yield products. Wallets, exchanges, and fintechs can offer 'Earn' features powered by Fusion infrastructure without building from scratch.",
    bullets: ['Embed vaults into any interface', 'White-label for wallets & CEXs', 'Referral system built-in', 'Invisible infrastructure, visible yield']
  }];
  return /*#__PURE__*/React.createElement(Section, {
    paddingY: 128,
    bg: isDark ? '#090E14' : 'transparent'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 48,
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'Poppins',
      fontWeight: 500,
      fontSize: 45,
      lineHeight: '60px',
      letterSpacing: '-0.01em',
      color: isDark ? '#fff' : '#000'
    }
  }, "Built for every participant", /*#__PURE__*/React.createElement("br", null), "in the vault stack."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      marginBottom: 0,
      fontFamily: 'Poppins',
      fontSize: 18,
      lineHeight: '28px',
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, "Whether you're allocating treasury capital or building the next yield product, Fusion is the infrastructure layer underneath.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 16
    }
  }, groups.map(g => /*#__PURE__*/React.createElement(Card, {
    key: g.title,
    hover: true,
    style: {
      background: isDark ? '#161A20' : '#fff',
      border: '1px solid ' + (isDark ? '#2E3137' : '#E5E5E5'),
      padding: 28
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: g.icon,
    size: 40,
    tone: "tint"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '20px 0 8px',
      fontSize: 20,
      fontWeight: 600,
      color: isDark ? '#fff' : '#000'
    }
  }, g.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13.5,
      lineHeight: '22px',
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, g.desc), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: '20px 0 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, g.bullets.map(b => /*#__PURE__*/React.createElement("li", {
    key: b,
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start',
      fontSize: 13.5,
      color: isDark ? '#fff' : '#000'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#8429FF',
      flexShrink: 0,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    stroke: 2.2
  })), b)))))));
}
function Comparison({
  theme
}) {
  const isDark = theme === 'dark';
  const rows = [{
    label: 'Transparency',
    fusion: 'Block-by-block allocations exposed onchain',
    alt: 'Periodic, often-incomplete PDF reports'
  }, {
    label: 'Time-to-vault',
    fusion: 'Hours — Factory + fuse library',
    alt: 'Months — custom smart contract dev'
  }, {
    label: 'Multi-Protocol Routing',
    fusion: 'Aave, Morpho, Spark, Euler, Pendle (composable)',
    alt: 'Single-protocol, hard-coded'
  }, {
    label: 'Curator Economics',
    fusion: 'Onchain curator fees, programmable splits',
    alt: 'Off-chain billing, opaque flows'
  }, {
    label: 'Risk Isolation',
    fusion: 'Per-vault siloed risk, capped exposures',
    alt: 'Socialized losses, pool-level risk'
  }, {
    label: 'Auditability',
    fusion: 'Every action verifiable onchain',
    alt: 'Trust the operator'
  }, {
    label: 'Security',
    fusion: 'Audited contracts + isolated fuses + caps',
    alt: 'Custom code, custom audit, custom risk'
  }];
  return /*#__PURE__*/React.createElement(Section, {
    paddingY: 128,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(PurpleGlow, {
    left: -160,
    top: 399,
    size: 400
  }), /*#__PURE__*/React.createElement(PurpleGlow, {
    right: -160,
    top: 399,
    size: 400
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'Poppins',
      fontWeight: 500,
      fontSize: 45,
      lineHeight: '60px',
      letterSpacing: '-0.01em',
      color: isDark ? '#fff' : '#000'
    }
  }, "How Fusion Vaults outperform the alternative.")), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      background: isDark ? '#161A20' : '#fff',
      border: '1px solid ' + (isDark ? '#2E3137' : '#E5E5E5')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1.4fr 1.4fr',
      borderBottom: '1px solid ' + (isDark ? '#2E3137' : '#E5E5E5')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, "Capability"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/fusion-logo-purple.png",
    style: {
      height: 18
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: isDark ? '#fff' : '#000'
    }
  }, "Fusion")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18,
      fontSize: 14,
      fontWeight: 600,
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, "Custom-built vault")), rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r.label,
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1.4fr 1.4fr',
      borderBottom: i === rows.length - 1 ? 0 : '1px solid ' + (isDark ? '#2E3137' : '#F0F0F0')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px',
      fontSize: 14,
      fontWeight: 500,
      color: isDark ? '#fff' : '#000'
    }
  }, r.label), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px',
      fontSize: 13.5,
      color: isDark ? '#fff' : '#000',
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#8429FF',
      flexShrink: 0,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    stroke: 2.2
  })), r.fusion), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px',
      fontSize: 13.5,
      color: isDark ? '#9BA3AF' : '#70747A',
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: isDark ? '#70747A' : '#9BA3AF',
      flexShrink: 0,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14,
    stroke: 2.2
  })), r.alt)))));
}
function FinalCTA({
  theme,
  onLaunch
}) {
  const isDark = theme === 'dark';
  return /*#__PURE__*/React.createElement(Section, {
    paddingY: 160,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      width: 600,
      height: 400,
      borderRadius: 9999,
      background: 'rgba(132,41,255,0.1)',
      filter: 'blur(60px)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'Poppins',
      fontWeight: 500,
      fontSize: 45,
      lineHeight: '60px',
      letterSpacing: '-0.01em',
      color: isDark ? '#fff' : '#000'
    }
  }, "The Vault layer is ready."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      marginBottom: 32,
      fontFamily: 'Poppins',
      fontSize: 18,
      lineHeight: '28px',
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, "Deploy your first vault, deposit into a curated strategy, or", /*#__PURE__*/React.createElement("br", null), "embed Fusion into your product."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(PrimaryButton, {
    onClick: onLaunch
  }, "Launch App"), /*#__PURE__*/React.createElement(SecondaryButton, null, "Start Building"))));
}
function Footer({
  theme
}) {
  const isDark = theme === 'dark';
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid ' + (isDark ? '#2E3137' : '#E5E5E5'),
      padding: '48px 24px',
      background: isDark ? '#090E14' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1152,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: isDark ? '../../assets/fusion-logo-white.png' : '../../assets/fusion-logo-black.png',
    style: {
      height: 28
    },
    alt: "Fusion by IPOR"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 13,
      color: isDark ? '#9BA3AF' : '#70747A',
      maxWidth: 280
    }
  }, "Vault infrastructure for institutional-grade yield. A product by IPOR Labs."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 16,
      color: isDark ? '#9BA3AF' : '#70747A'
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x-social",
    size: 16
  })), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "github",
    size: 16
  })), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "discord",
    size: 16
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24
    }
  }, [{
    h: 'Product',
    links: ['Vaults', 'Solutions', 'Security', 'Docs']
  }, {
    h: 'Build',
    links: ['Atomist Portal', 'Fuse Modules', 'SDK', 'Audits']
  }, {
    h: 'Resources',
    links: ['Blog', 'Brand Assets', 'Terms of Use', 'Privacy']
  }, {
    h: 'Company',
    links: ['About IPOR', 'Careers', 'Contact']
  }].map(col => /*#__PURE__*/React.createElement("div", {
    key: col.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: isDark ? '#fff' : '#000',
      marginBottom: 14
    }
  }, col.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, col.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 13,
      color: isDark ? '#9BA3AF' : '#70747A',
      textDecoration: 'none'
    }
  }, l)))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1152,
      margin: '36px auto 0',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      color: isDark ? '#70747A' : '#9BA3AF'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2025 IPOR Labs \xB7 Fusion by IPOR"), /*#__PURE__*/React.createElement("span", null, "Vault infrastructure \xB7 MIT-licensed contracts \xB7 Audited by Spearbit & Cantina")));
}
Object.assign(window, {
  Transparency,
  Testimonials,
  InfrastructureEdge,
  PlugAndPlay,
  Audiences,
  Comparison,
  FinalCTA,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Sections.jsx", error: String((e && e.message) || e) }); }

})();
