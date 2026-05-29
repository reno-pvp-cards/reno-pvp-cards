import React, { useState, useRef } from "react";
import domtoimage from "dom-to-image-more";

const JOB_LIST = [
  "ナイト","戦士","暗黒騎士","ガンブレイカー",
  "白魔道士","学者","占星術師","賢者",
  "モンク","竜騎士","忍者","侍","リーパー","ヴァイパー",
  "吟遊詩人","機工士","踊り子",
  "黒魔道士","召喚士","赤魔道士","ピクトマンサー"
];

const RANK_LIST = ["アルテマ","オメガ","クリスタル","ダイヤモンド","プラチナ","ゴールド","シルバー","ブロンズ"];

const PLAYSTYLE_LIST = [
  "ターゲッター","サポート重視","火力重視",
  "オールラウンダー","クリスタル運びます！","粘り型"
];

const DC_LIST = [
  { label: "─── Mana ───", value: "", disabled: true },
  { label: "Anima (Mana)", value: "Anima (Mana)" },
  { label: "Asura (Mana)", value: "Asura (Mana)" },
  { label: "Chocobo (Mana)", value: "Chocobo (Mana)" },
  { label: "Hades (Mana)", value: "Hades (Mana)" },
  { label: "Ixion (Mana)", value: "Ixion (Mana)" },
  { label: "Masamune (Mana)", value: "Masamune (Mana)" },
  { label: "Pandemonium (Mana)", value: "Pandemonium (Mana)" },
  { label: "Titan (Mana)", value: "Titan (Mana)" },
  { label: "─── Gaia ───", value: "", disabled: true },
  { label: "Alexander (Gaia)", value: "Alexander (Gaia)" },
  { label: "Bahamut (Gaia)", value: "Bahamut (Gaia)" },
  { label: "Durandal (Gaia)", value: "Durandal (Gaia)" },
  { label: "Fenrir (Gaia)", value: "Fenrir (Gaia)" },
  { label: "Ifrit (Gaia)", value: "Ifrit (Gaia)" },
  { label: "Ridill (Gaia)", value: "Ridill (Gaia)" },
  { label: "Tiamat (Gaia)", value: "Tiamat (Gaia)" },
  { label: "Ultima (Gaia)", value: "Ultima (Gaia)" },
  { label: "─── Meteor ───", value: "", disabled: true },
  { label: "Berias (Meteor)", value: "Berias (Meteor)" },
  { label: "Mandragora (Meteor)", value: "Mandragora (Meteor)" },
  { label: "Ramuh (Meteor)", value: "Ramuh (Meteor)" },
  { label: "Shinryu (Meteor)", value: "Shinryu (Meteor)" },
  { label: "Unicorn (Meteor)", value: "Unicorn (Meteor)" },
  { label: "Valefor (Meteor)", value: "Valefor (Meteor)" },
  { label: "Yojimbo (Meteor)", value: "Yojimbo (Meteor)" },
  { label: "Zeromus (Meteor)", value: "Zeromus (Meteor)" },
  { label: "─── Elemental ───", value: "", disabled: true },
  { label: "Aegis (Elemental)", value: "Aegis (Elemental)" },
  { label: "Atomos (Elemental)", value: "Atomos (Elemental)" },
  { label: "Carbuncle (Elemental)", value: "Carbuncle (Elemental)" },
  { label: "Garuda (Elemental)", value: "Garuda (Elemental)" },
  { label: "Gungnir (Elemental)", value: "Gungnir (Elemental)" },
  { label: "Kujata (Elemental)", value: "Kujata (Elemental)" },
  { label: "Tonberry (Elemental)", value: "Tonberry (Elemental)" },
  { label: "Typhon (Elemental)", value: "Typhon (Elemental)" },
];

const RANK_COLOR = {
  "オメガ":"#ff9de2","アルテマ":"#ffd700","クリスタル":"#a8d8ea",
  "ダイヤモンド":"#b8c8ff","プラチナ":"#c8e6c9","ゴールド":"#ffe082",
  "シルバー":"#b0b0b0","ブロンズ":"#ffcc80",
};
const RANK_COLOR_LIGHT = {
  "オメガ":"#d63faa","アルテマ":"#b8860b","クリスタル":"#2a7fa0",
  "ダイヤモンド":"#4455cc","プラチナ":"#3a8a5a","ゴールド":"#b8860b",
  "シルバー":"#666666","ブロンズ":"#a0622a",
};
const RANK_ICON = {
  "オメガ":"⚡","アルテマ":"🌟","クリスタル":"💎","ダイヤモンド":"🔷",
  "プラチナ":"🩶","ゴールド":"🥇","シルバー":"🥈","ブロンズ":"🥉",
};

const THEMES = {
  dark: {
    id:"dark", label:"🌙 ダーク",
    cardBg:"#0d0d18", pageBg:"#070710",
    screenshotBg:"#0a0a14",
    gradientColor:"#0d0d18",
    infoBorder:()=>"#a8d8ea22", infoGridBg:()=>"#a8d8ea18",
    labelColor:"#ffffff33", valueColor:"#ffffffcc",
    tournamentBorder:"rgba(255,255,255,0.06)",
    footerBorder:()=>"#a8d8ea18", footerText:"#ffffff1a",
    badgeBg:"#0d0d18cc", badgeBorder:()=>"#a8d8ea66",
    saveBtnBg:()=>"#a8d8ea18", saveBtnBorder:()=>"#a8d8ea44", saveBtnColor:()=>"#a8d8ea",
    editBtnBg:"rgba(255,255,255,0.07)", editBtnBorder:"rgba(255,255,255,0.15)", editBtnColor:"#ffffffaa",
    rankColor:(rank)=>RANK_COLOR[rank]||"#a8d8ea",
    itemBg:"rgba(13,13,24,0.75)",
    activeTagBg:"#a8d8ea18", activeTagBorder:"#a8d8ea55", activeTagColor:"#a8d8ea",
    inactiveTagBg:"rgba(13,13,24,0.4)", inactiveTagBorder:"rgba(255,255,255,0.07)", inactiveTagColor:"rgba(255,255,255,0.18)",
  },
  light: {
    id:"light", label:"☁️ ライト",
    cardBg:"#f0f0ec", pageBg:"#e8e8e2",
    screenshotBg:"#e8e8e4",
    gradientColor:"#f0f0ec",
    infoBorder:()=>"#d63faa44", infoGridBg:()=>"#d63faa18",
    labelColor:"#888888", valueColor:"#222233",
    tournamentBorder:"rgba(0,0,0,0.08)",
    footerBorder:()=>"#d63faa33", footerText:"#aaaaaa",
    badgeBg:"#f5f5f0ee", badgeBorder:()=>"#d63faa88",
    saveBtnBg:()=>"#d63faa22", saveBtnBorder:()=>"#d63faa88", saveBtnColor:()=>"#d63faa",
    editBtnBg:"rgba(0,0,0,0.06)", editBtnBorder:"rgba(0,0,0,0.15)", editBtnColor:"#444455",
    rankColor:(rank)=>RANK_COLOR_LIGHT[rank]||"#2a7fa0",
    itemBg:"rgba(245,245,240,0.85)",
    activeTagBg:"#d63faa18", activeTagBorder:"#d63faa55", activeTagColor:"#d63faa",
    inactiveTagBg:"rgba(245,245,240,0.5)", inactiveTagBorder:"rgba(0,0,0,0.08)", inactiveTagColor:"rgba(0,0,0,0.2)",
  },
};

const emptyPlayer = {
  firstName:"",lastName:"",nickname:"",server:"",mainJob:"",
  subJobs:[],highestRank:"",playstyle:[],team:"",
  screenshotDataUrl:"",freeText:"",sns:[],
};

// ===================== CARD VIEW =====================
// カードは 420×800px 固定。情報エリアはこの中に収める。
const CARD_W = 420;
const CARD_H = 800;
const PHOTO_H = 300; // スクショエリアの高さ

function PlayerCard({ player, theme, onEdit }) {
  const t = THEMES[theme] || THEMES.dark;
  const rc = t.rankColor(player.highestRank);
  const cardRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const fullName = [player.firstName, player.lastName].filter(Boolean).join(" ");

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    await document.fonts.ready;
    await new Promise(r => setTimeout(r, 150));

    let dataURL = null;
    try {
      const SCALE = 2;
      const W = CARD_W * SCALE;
      const H = CARD_H * SCALE;

      // ── ① スクショ部分を除いたカード全体を dom-to-image でキャプチャ ──
      // スクショdivを一時的に非表示にしてキャプチャ
      const bgDiv = cardRef.current.querySelector("[data-screenshot]");
      if (bgDiv) bgDiv.style.visibility = "hidden";

      const cardDataURL = await domtoimage.toJpeg(cardRef.current, {
        quality: 0.95,
        width: W, height: H,
        style: { transform:`scale(${SCALE})`, transformOrigin:"top left" },
        cacheBust: true,
        filter: () => true,
      });

      if (bgDiv) bgDiv.style.visibility = "visible";

      // ── ② 最終合成キャンバスを作成 ──
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width  = W;
      finalCanvas.height = H;
      const ctx = finalCanvas.getContext("2d");

      // ── ③ スクショ画像があればCanvasで直接描画（cover） ──
      if (player.screenshotDataUrl) {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const photoH = PHOTO_H * SCALE;
            // cover クロップ計算
            const scale = Math.max(W / img.naturalWidth, photoH / img.naturalHeight);
            const sw = W / scale, sh = photoH / scale;
            const sx = (img.naturalWidth  - sw) / 2;
            const sy = (img.naturalHeight - sh) / 2;
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, photoH);
            resolve();
          };
          img.onerror = resolve;
          img.src = player.screenshotDataUrl;
        });
      }

      // ── ④ カード（スクショなし）を上に重ねる ──
      await new Promise((resolve) => {
        const cardImg = new Image();
        cardImg.onload = () => {
          ctx.drawImage(cardImg, 0, 0, W, H);
          resolve();
        };
        cardImg.onerror = resolve;
        cardImg.src = cardDataURL;
      });

      dataURL = finalCanvas.toDataURL("image/jpeg", 0.95);

    } catch(e) {
      // スクショdivが非表示のままにならないよう復元
      const bgDiv = cardRef.current?.querySelector("[data-screenshot]");
      if (bgDiv) bgDiv.style.visibility = "visible";
      alert("画像の生成に失敗しました。");
      console.error(e);
    }

    if (!dataURL) { setSaving(false); return; }

    const fileName = `cc-card-${fullName||"player"}-${theme}.jpg`;
    const isIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
      try {
        const blob = await (await fetch(dataURL)).blob();
        const file = new File([blob], fileName, { type:"image/jpeg" });
        if (navigator.canShare && navigator.canShare({ files:[file] })) {
          await navigator.share({ files:[file], title:"CC Player Card" });
        } else {
          showFallback(dataURL);
        }
      } catch(e) {
        if (e.name !== "AbortError") showFallback(dataURL);
      }
    } else {
      const a = document.createElement("a");
      a.download = fileName; a.href = dataURL;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }
    setSaving(false);
  };

  const showFallback = (dataURL) => {
    const ov = document.createElement("div");
    ov.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;";
    const msg = document.createElement("p");
    msg.textContent = "📥 画像を長押しして「写真に追加」で保存できます";
    msg.style.cssText = "color:#ccc;font-size:14px;font-family:sans-serif;text-align:center;margin:0 0 1rem;line-height:1.6;";
    const img = document.createElement("img");
    img.src = dataURL;
    img.style.cssText = "max-width:100%;max-height:65vh;border-radius:4px;";
    const btn = document.createElement("button");
    btn.textContent = "✕ 閉じる";
    btn.style.cssText = "color:#fff;background:transparent;border:1px solid #555;border-radius:8px;padding:.5rem 1.5rem;font-size:14px;cursor:pointer;font-family:sans-serif;margin-top:1rem;";
    btn.onclick = () => document.body.removeChild(ov);
    ov.appendChild(msg); ov.appendChild(img); ov.appendChild(btn);
    document.body.appendChild(ov);
  };

  // タグ共通スタイル
  const tag = (active) => ({
    padding: ".1rem .4rem",
    background: active ? t.activeTagBg : t.inactiveTagBg,
    border: `1px solid ${active ? t.activeTagBorder : t.inactiveTagBorder}`,
    borderRadius: "999px", fontSize: ".58rem",
    color: active ? t.activeTagColor : t.inactiveTagColor,
    fontFamily: "'Noto Sans JP', sans-serif",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{
      minHeight:"100vh", background:t.pageBg,
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"flex-start", padding:"2rem 1rem 3rem",
      fontFamily:"'Rajdhani','Noto Sans JP',sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');
        @keyframes shimmer{0%{background-position:-400% center}100%{background-position:400% center}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .cc-card{animation:fadeUp .5s ease forwards}
        .cc-btn:hover{opacity:.8!important;transform:translateY(-1px)}
      `}</style>

      {/* ── カード本体：幅420px・高さ800px 固定 ── */}
      <div className="cc-card" ref={cardRef} style={{
        width:`${CARD_W}px`, height:`${CARD_H}px`,
        position:"relative", overflow:"hidden",
        background:t.cardBg,
        boxShadow: theme==="dark"
          ? "0 0 60px #a8d8ea18,0 20px 60px #00000080"
          : "0 0 40px #d63faa22,0 12px 40px #00000018",
        flexShrink:0,
      }}>

        {/* ── 上段：スクショ写真エリア（300px）── */}
        <div style={{
          position:"absolute", top:0, left:0,
          width:`${CARD_W}px`, height:`${PHOTO_H}px`,
          overflow:"hidden", zIndex:0,
        }}>
          {player.screenshotDataUrl ? (
            <div data-screenshot="true" style={{
              width:"100%", height:"100%",
              backgroundImage:`url(${player.screenshotDataUrl})`,
              backgroundSize:"cover",
              backgroundPosition:"center",
            }}/>
          ) : (
            <div style={{ width:"100%", height:"100%", background:t.screenshotBg }}/>
          )}
          {/* 写真→情報エリアへのグラデ */}
          <div style={{
            position:"absolute", bottom:0, left:0, right:0, height:"100px",
            background:`linear-gradient(to bottom, transparent, ${t.gradientColor})`,
          }}/>
        </div>

        {/* 上部カラーライン */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:"2px", zIndex:4,
          background:`linear-gradient(90deg,transparent,${rc},transparent)`,
          backgroundSize:"200% auto", animation:"shimmer 3s linear infinite",
        }}/>

        {/* ランクバッジ */}
        <div style={{
          position:"absolute", top:"1rem", right:"1rem", zIndex:4,
          background:t.badgeBg, border:`1px solid ${t.badgeBorder(rc)}`,
          borderRadius:"10px", padding:".4rem .8rem", textAlign:"center",
          backdropFilter:"blur(8px)",
        }}>
          <div style={{fontSize:"1.4rem",lineHeight:1}}>{RANK_ICON[player.highestRank]||"🎮"}</div>
          <div style={{fontSize:".62rem",color:rc,fontWeight:700,fontFamily:"Rajdhani,sans-serif",letterSpacing:".08em",marginTop:".2rem"}}>
            {player.highestRank||"—"}
          </div>
        </div>

        {/* プレイヤー名（写真の下部に重ねる） */}
        <div style={{
          position:"absolute", top:"210px", left:"1.2rem", right:"5.5rem", zIndex:3,
        }}>
          <div style={{fontSize:".52rem",letterSpacing:".25em",color:theme==="dark"?"#a8d8eadd":"#b0006e",fontFamily:"Rajdhani,sans-serif",textTransform:"uppercase",marginBottom:".1rem"}}>
            Crystal Conflict Player
          </div>
          <div style={{fontSize:"1.75rem",fontWeight:700,color:"#fff",fontFamily:"Rajdhani,sans-serif",lineHeight:1,textShadow:"0 2px 16px rgba(0,0,0,0.9),0 0 40px rgba(0,0,0,0.6)"}}>
            {fullName||"—"}
          </div>
          {player.nickname&&(
            <div style={{fontSize:".78rem",color:"#ffffffcc",fontFamily:"'Noto Sans JP',sans-serif",fontWeight:300,marginTop:".1rem",textShadow:"0 1px 8px rgba(0,0,0,0.9)"}}>
              {player.nickname}
            </div>
          )}
        </div>

        {/* ── 下段：情報エリア（300px〜800px）── */}
        <div style={{
          position:"absolute", top:`${PHOTO_H}px`, left:0, right:0,
          height:`${CARD_H - PHOTO_H}px`,
          padding:".6rem 1.1rem .4rem",
          display:"flex", flexDirection:"column",
          zIndex:2, overflow:"hidden",
        }}>

          {/* SERVER / TEAM */}
          <div style={{
            display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px",
            background:t.infoGridBg(rc),
            border:`1px solid ${t.infoBorder(rc)}`,
            borderRadius:"8px", overflow:"hidden", marginBottom:".5rem", flexShrink:0,
          }}>
            {[{label:"SERVER",value:player.server},{label:"TEAM",value:player.team||"—"}].map(item=>(
              <div key={item.label} style={{background:t.itemBg,padding:".25rem .6rem",backdropFilter:"blur(4px)"}}>
                <div style={{fontSize:".45rem",letterSpacing:".12em",color:t.labelColor,fontFamily:"Rajdhani,sans-serif",marginBottom:".05rem"}}>{item.label}</div>
                <div style={{fontSize:".72rem",color:t.valueColor,fontFamily:"'Noto Sans JP',sans-serif",fontWeight:500}}>{item.value||"—"}</div>
              </div>
            ))}
          </div>

          {/* JOBS */}
          <div style={{marginBottom:".4rem",flexShrink:0}}>
            <div style={{fontSize:".45rem",letterSpacing:".15em",color:t.labelColor,fontFamily:"Rajdhani,sans-serif",marginBottom:".2rem",textTransform:"uppercase"}}>Jobs</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:".18rem"}}>
              {JOB_LIST.map(j=>{
                const isMain = j===player.mainJob;
                const isActive = isMain||(player.subJobs||[]).includes(j);
                return(
                  <span key={j} style={{...tag(isActive),fontWeight:isMain?700:400}}>
                    {isMain?"★ ":""}{j}
                  </span>
                );
              })}
            </div>
          </div>

          {/* PLAY STYLE */}
          <div style={{marginBottom:".4rem",flexShrink:0}}>
            <div style={{fontSize:".45rem",letterSpacing:".15em",color:t.labelColor,fontFamily:"Rajdhani,sans-serif",marginBottom:".2rem",textTransform:"uppercase"}}>Play Style</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:".18rem"}}>
              {PLAYSTYLE_LIST.map(s=>{
                const isActive=(player.playstyle||[]).includes(s);
                return <span key={s} style={tag(isActive)}>{s}</span>;
              })}
            </div>
          </div>

          {/* NOTE */}
          <div style={{marginBottom:".4rem",flexShrink:0}}>
            <div style={{fontSize:".45rem",letterSpacing:".15em",color:t.labelColor,fontFamily:"Rajdhani,sans-serif",marginBottom:".2rem",textTransform:"uppercase"}}>Note</div>
            <div style={{
              padding:".3rem .6rem",
              background:t.itemBg,
              border:`1px solid ${t.tournamentBorder}`,
              borderRadius:"6px", fontSize:".65rem",
              color:player.freeText?t.valueColor:t.inactiveTagColor,
              fontFamily:"'Noto Sans JP',sans-serif",
              lineHeight:1.6, whiteSpace:"pre-wrap", wordBreak:"break-all",
              backdropFilter:"blur(4px)",
              height:"52px", overflow:"hidden",
            }}>
              {player.freeText||""}
            </div>
          </div>

          {/* SNS */}
          <div style={{marginBottom:".3rem",flexShrink:0}}>
            <div style={{display:"flex",gap:".18rem"}}>
              {["X","YouTube","Twitch"].map(s=>{
                const isActive=(player.sns||[]).includes(s);
                return <span key={s} style={{...tag(isActive),fontFamily:"Rajdhani,sans-serif",letterSpacing:".05em"}}>{s}</span>;
              })}
            </div>
          </div>

          {/* 下部スペーサー */}
          <div style={{flex:1}}/>

          {/* FINAL FANTASY XIV / © SQUARE ENIX */}
          <div style={{textAlign:"center",fontFamily:"Rajdhani,sans-serif",opacity:.7,marginBottom:".2rem"}}>
            <div style={{fontSize:".5rem",color:t.footerText,letterSpacing:".12em",marginBottom:".1rem"}}>FINAL FANTASY XIV</div>
            <div style={{fontSize:".44rem",color:t.footerText,letterSpacing:".05em"}}>© SQUARE ENIX</div>
          </div>

          {/* フッター */}
          <div style={{
            display:saving?"none":"flex",
            justifyContent:"space-between", alignItems:"center",
            paddingTop:".3rem",
            borderTop:`1px solid ${t.footerBorder(rc)}`,
            flexShrink:0,
          }}>
            <div style={{fontSize:".52rem",color:t.footerText,fontFamily:"Rajdhani,sans-serif",letterSpacing:".12em"}}>CC PLAYER CARD</div>
            <div style={{display:"flex",gap:".5rem"}}>
              <button onClick={handleSaveImage} className="cc-btn" style={{
                background:t.saveBtnBg(rc), border:`1px solid ${t.saveBtnBorder(rc)}`,
                borderRadius:"8px", color:t.saveBtnColor(rc),
                fontSize:".68rem", padding:".28rem .75rem", cursor:"pointer",
                fontFamily:"Rajdhani,sans-serif", letterSpacing:".1em", transition:"all .2s",
              }}>PNG保存</button>
              <button onClick={onEdit} className="cc-btn" style={{
                background:t.editBtnBg, border:`1px solid ${t.editBtnBorder}`,
                borderRadius:"8px", color:t.editBtnColor,
                fontSize:".68rem", padding:".28rem .75rem", cursor:"pointer",
                fontFamily:"Rajdhani,sans-serif", letterSpacing:".1em", transition:"all .2s",
              }}>EDIT</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ===================== FORM VIEW =====================
function PlayerForm({ initial, initialTheme, onSave }) {
  const [form, setForm] = useState(initial);
  const [theme, setTheme] = useState(initialTheme||"dark");
  const fileInputRef = useRef(null);
  const set = (key,val) => setForm(f=>({...f,[key]:val}));

  const handleImageUpload = e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => set("screenshotDataUrl", ev.target.result);
    reader.readAsDataURL(file);
  };

  const toggleSubJob = job => setForm(f=>{
    const cur=f.subJobs||[];
    return {...f,subJobs:cur.includes(job)?cur.filter(j=>j!==job):[...cur,job]};
  });
  const togglePlaystyle = s => setForm(f=>{
    const cur=f.playstyle||[];
    return {...f,playstyle:cur.includes(s)?cur.filter(x=>x!==s):[...cur,s]};
  });
  const toggleSns = s => setForm(f=>{
    const cur=f.sns||[];
    return {...f,sns:cur.includes(s)?cur.filter(x=>x!==s):[...cur,s]};
  });

  const isLight = theme==="light";
  const inp = {
    width:"100%",
    background:isLight?"#ffffff":"#1a1a2e",
    border:isLight?"1px solid rgba(0,0,0,0.12)":"1px solid rgba(255,255,255,0.1)",
    borderRadius:"8px", color:isLight?"#222233":"#ffffffcc",
    padding:".6rem .8rem", fontSize:".85rem",
    fontFamily:"'Noto Sans JP',sans-serif",
    boxSizing:"border-box", outline:"none",
  };
  const lbl = {
    fontSize:".62rem", letterSpacing:".15em",
    color:isLight?"#888888":"#ffffff44",
    display:"block", marginBottom:".3rem",
    fontFamily:"Rajdhani,sans-serif", textTransform:"uppercase",
  };
  const sec = { marginBottom:"1.5rem" };
  const tagStyle = (active) => ({
    padding:".25rem .7rem",
    background:active?(isLight?"rgba(42,127,160,0.15)":"rgba(168,216,234,0.15)"):(isLight?"rgba(0,0,0,0.05)":"rgba(255,255,255,0.04)"),
    border:`1px solid ${active?(isLight?"rgba(42,127,160,0.5)":"rgba(168,216,234,0.5)"):(isLight?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.07)")}`,
    borderRadius:"999px", fontSize:".75rem",
    color:active?(isLight?"#2a7fa0":"#a8d8ea"):(isLight?"#555566":"#ffffff55"),
    fontFamily:"'Noto Sans JP',sans-serif",
    cursor:"pointer", transition:"all .15s",
  });

  return (
    <div style={{
      minHeight:"100vh",
      background:isLight?"#e8e8e2":"linear-gradient(135deg,#0a0a0f,#0f0f1a 40%,#0a0a14)",
      display:"flex", justifyContent:"center", padding:"2rem 1rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500&display=swap');
        input::placeholder{color:${isLight?"#aaaaaa":"#ffffff33"}}
        select option{color:#000;background:#fff}
        input:focus,select:focus{border-color:${isLight?"rgba(0,0,0,0.3)":"rgba(168,216,234,0.4)"}!important}
        select{appearance:none}
        .upload-hover:hover{opacity:.85}
        .tag-toggle{cursor:pointer;transition:all .15s;user-select:none}
        .tag-toggle:hover{opacity:.75}
      `}</style>
      <div style={{width:"100%",maxWidth:"480px"}}>

        <div style={{fontSize:".6rem",letterSpacing:".25em",color:isLight?"#aaaaaa":"#ffffff33",marginBottom:".4rem",fontFamily:"Rajdhani,sans-serif"}}>CC PLAYER CARD</div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2rem"}}>
          <h1 style={{color:isLight?"#1a1a2e":"#ffffff",fontSize:"1.5rem",fontFamily:"Rajdhani,sans-serif",fontWeight:700,letterSpacing:".05em",margin:0}}>プロフィール編集</h1>
          <div style={{display:"flex",gap:".4rem",background:isLight?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.06)",borderRadius:"10px",padding:".25rem"}}>
            {Object.values(THEMES).map(th=>(
              <button key={th.id} onClick={()=>setTheme(th.id)} style={{
                padding:".3rem .75rem",
                background:theme===th.id?(isLight?"#ffffff":"rgba(255,255,255,0.12)"):"transparent",
                border:"none", borderRadius:"7px", fontSize:".72rem",
                color:theme===th.id?(isLight?"#1a1a2e":"#ffffff"):(isLight?"#888888":"#ffffff55"),
                cursor:"pointer", fontFamily:"Rajdhani,sans-serif", letterSpacing:".05em", transition:"all .2s",
                boxShadow:theme===th.id?"0 1px 4px rgba(0,0,0,0.1)":"none",
              }}>{th.label}</button>
            ))}
          </div>
        </div>

        {/* キャラ名 */}
        <div style={sec}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".8rem",marginBottom:".8rem"}}>
            <div><label style={lbl}>ファーストネーム</label><input style={inp} value={form.firstName} onChange={e=>set("firstName",e.target.value)}/></div>
            <div><label style={lbl}>ラストネーム</label><input style={inp} value={form.lastName} onChange={e=>set("lastName",e.target.value)}/></div>
          </div>
          <label style={lbl}>呼び名</label>
          <input style={inp} value={form.nickname} onChange={e=>set("nickname",e.target.value)}/>
        </div>

        {/* サーバー・ランク */}
        <div style={sec}>
          <div style={{marginBottom:".8rem"}}>
            <label style={lbl}>サーバー</label>
            <select style={inp} value={form.server} onChange={e=>set("server",e.target.value)}>
              <option value="">選択してください</option>
              {DC_LIST.map((d,i)=><option key={i} value={d.value} disabled={d.disabled}>{d.label}</option>)}
            </select>
          </div>
          <label style={lbl}>最高ランク</label>
          <select style={inp} value={form.highestRank} onChange={e=>set("highestRank",e.target.value)}>
            <option value="">選択</option>
            {RANK_LIST.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* メインジョブ */}
        <div style={sec}>
          <label style={lbl}>メインジョブ</label>
          <select style={inp} value={form.mainJob} onChange={e=>set("mainJob",e.target.value)}>
            <option value="">選択</option>
            {JOB_LIST.map(j=><option key={j} value={j}>{j}</option>)}
          </select>
        </div>

        {/* サブジョブ */}
        <div style={sec}>
          <label style={{...lbl,marginBottom:".3rem"}}>使用ジョブ（複数選択可）</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:".4rem"}}>
            {JOB_LIST.filter(j=>j!==form.mainJob).map(j=>{
              const active=(form.subJobs||[]).includes(j);
              return <span key={j} className="tag-toggle" onClick={()=>toggleSubJob(j)} style={tagStyle(active)}>{j}</span>;
            })}
          </div>
        </div>

        {/* プレイスタイル */}
        <div style={sec}>
          <label style={lbl}>プレイスタイル（複数選択可）</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:".4rem"}}>
            {PLAYSTYLE_LIST.map(s=>{
              const active=(form.playstyle||[]).includes(s);
              return <span key={s} className="tag-toggle" onClick={()=>togglePlaystyle(s)} style={tagStyle(active)}>{s}</span>;
            })}
          </div>
        </div>

        {/* チーム */}
        <div style={sec}>
          <label style={lbl}>チーム</label>
          <input style={inp} value={form.team} onChange={e=>set("team",e.target.value)} placeholder="チーム名（任意）"/>
        </div>

        {/* スクショ */}
        <div style={sec}>
          <label style={lbl}>スクリーンショット画像</label>
          <div style={{marginBottom:".6rem",padding:".45rem .75rem",background:isLight?"rgba(42,127,160,0.06)":"rgba(168,216,234,0.06)",border:isLight?"1px solid rgba(42,127,160,0.2)":"1px solid rgba(168,216,234,0.15)",borderRadius:"8px",fontSize:".7rem",color:isLight?"#2a7fa0":"#a8d8eaaa",fontFamily:"'Noto Sans JP',sans-serif",lineHeight:1.6}}>
            📐 推奨サイズ：横幅 <b>1280px 以上</b>・縦横比 <b>4:3 〜 16:9</b> 推奨
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{display:"none"}}/>
          {form.screenshotDataUrl ? (
            <div>
              <img src={form.screenshotDataUrl} alt="preview" style={{width:"100%",aspectRatio:"4/3",objectFit:"cover",borderRadius:"10px",border:isLight?"1px solid rgba(0,0,0,0.1)":"1px solid rgba(255,255,255,0.1)",display:"block",marginBottom:".6rem"}}/>
              <div style={{display:"flex",gap:".5rem"}}>
                <button onClick={()=>fileInputRef.current.click()} style={{flex:1,background:isLight?"rgba(42,127,160,0.08)":"rgba(168,216,234,0.08)",border:isLight?"1px solid rgba(42,127,160,0.3)":"1px solid rgba(168,216,234,0.3)",borderRadius:"8px",color:isLight?"#2a7fa0":"#a8d8ea",fontSize:".75rem",padding:".4rem",cursor:"pointer",fontFamily:"Rajdhani,sans-serif"}}>画像を変更</button>
                <button onClick={()=>set("screenshotDataUrl","")} style={{flex:1,background:"rgba(255,100,100,0.06)",border:"1px solid rgba(255,100,100,0.2)",borderRadius:"8px",color:"rgba(200,80,80,0.9)",fontSize:".75rem",padding:".4rem",cursor:"pointer",fontFamily:"Rajdhani,sans-serif"}}>削除</button>
              </div>
            </div>
          ) : (
            <div className="upload-hover" onClick={()=>fileInputRef.current.click()} style={{border:isLight?"2px dashed rgba(0,0,0,0.12)":"2px dashed rgba(255,255,255,0.12)",borderRadius:"12px",aspectRatio:"4/3",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:".4rem"}}>
              <div style={{fontSize:"2rem"}}>🖼️</div>
              <div style={{fontSize:".8rem",color:isLight?"#888888":"#ffffff44",fontFamily:"'Noto Sans JP',sans-serif"}}>クリックしてスクショを選択</div>
              <div style={{fontSize:".65rem",color:isLight?"#aaaaaa":"#ffffff22",fontFamily:"Rajdhani,sans-serif"}}>JPG / PNG　推奨：1280px幅以上</div>
            </div>
          )}
        </div>

        {/* NOTE */}
        <div style={sec}>
          <label style={lbl}>NOTE（大会履歴・活動内容・一言など）</label>
          <textarea value={form.freeText||""} onChange={e=>set("freeText",e.target.value)}
            placeholder={"例）くりこん杯 3位\n週末メインでプレイ中\n気軽に絡んでください！"}
            maxLength={120} style={{...inp,height:"90px",resize:"none",lineHeight:1.7}}/>
          <div style={{textAlign:"right",fontSize:".6rem",color:isLight?"#aaaaaa":"#ffffff33",fontFamily:"Rajdhani,sans-serif",marginTop:".2rem"}}>{(form.freeText||"").length} / 120</div>
        </div>

        {/* SNS */}
        <div style={sec}>
          <label style={lbl}>SNS（複数選択可）</label>
          <div style={{display:"flex",gap:".4rem"}}>
            {["X","YouTube","Twitch"].map(s=>{
              const active=(form.sns||[]).includes(s);
              return <span key={s} className="tag-toggle" onClick={()=>toggleSns(s)} style={{...tagStyle(active),fontFamily:"Rajdhani,sans-serif",letterSpacing:".05em",fontSize:".8rem",padding:".3rem .9rem"}}>{s}</span>;
            })}
          </div>
        </div>

        {/* 保存ボタン */}
        <button onClick={()=>onSave(form,theme)} style={{
          width:"100%",
          background:isLight?"linear-gradient(90deg,rgba(42,127,160,0.12),rgba(68,85,204,0.12))":"linear-gradient(90deg,rgba(168,216,234,0.12),rgba(184,200,255,0.12))",
          border:isLight?"1px solid rgba(42,127,160,0.4)":"1px solid rgba(168,216,234,0.4)",
          borderRadius:"12px", color:isLight?"#2a7fa0":"#a8d8ea",
          fontSize:".9rem", fontWeight:600, padding:".9rem",
          cursor:"pointer", fontFamily:"Rajdhani,sans-serif",
          letterSpacing:".15em", textTransform:"uppercase", transition:"all .2s",
          marginBottom:"3rem",
        }}>カードを表示 →</button>

        {/* フォーム最下部：FINAL FANTASY XIV / © SQUARE ENIX */}
        <div style={{
          textAlign:"center", marginBottom:"2rem", opacity:.5,
          fontFamily:"Rajdhani,sans-serif",
        }}>
          <div style={{fontSize:".55rem",color:isLight?"#888888":"#ffffff44",letterSpacing:".12em",marginBottom:".15rem"}}>FINAL FANTASY XIV</div>
          <div style={{fontSize:".5rem",color:isLight?"#888888":"#ffffff33",letterSpacing:".05em"}}>© SQUARE ENIX</div>
        </div>

      </div>
    </div>
  );
}

// ===================== APP =====================
export default function App() {
  const [view, setView]     = useState("form");
  const [player, setPlayer] = useState(emptyPlayer);
  const [theme, setTheme]   = useState("dark");

  const handleSave = (data, selectedTheme) => {
    setPlayer(data); setTheme(selectedTheme); setView("card");
  };

  if (view==="card") return <PlayerCard player={player} theme={theme} onEdit={()=>setView("form")}/>;
  return <PlayerForm initial={player} initialTheme={theme} onSave={handleSave}/>;
}
