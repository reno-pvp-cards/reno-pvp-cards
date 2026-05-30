import React, { useState, useRef, useCallback } from 'react'

const JOB_LIST = {
  タンク: ['ナイト', '戦士', '暗黒騎士', 'ガンブレイカー'],
  ヒーラー: ['白魔道士', '学者', '占星術師', '賢者'],
  近接DPS: ['モンク', '竜騎士', '忍者', '侍', 'リーパー', 'ヴァイパー'],
  遠隔DPS: ['吟遊詩人', '機工士', '踊り子'],
  魔法DPS: ['黒魔道士', '召喚士', '赤魔道士', 'ピクトマンサー'],
}
const ALL_JOBS = Object.values(JOB_LIST).flat()
const PLAYSTYLE_LIST = ['ターゲッター', 'サポート重視', '火力重視', 'オールラウンダー', 'クリスタル運びます！', '粘り型']
const SNS_LIST = ['X', 'YouTube', 'Twitch']
const RANK_LIST = ['アルテマ', 'オメガ', 'クリスタル', 'ダイヤモンド', 'プラチナ', 'ゴールド', 'シルバー', 'ブロンズ']
const RANK_CONFIG = {
  アルテマ:    { icon: '🌟' },
  オメガ:      { icon: '⚡' },
  クリスタル:  { icon: '💎' },
  ダイヤモンド:{ icon: '🔷' },
  プラチナ:    { icon: '🩶' },
  ゴールド:    { icon: '🥇' },
  シルバー:    { icon: '🥈' },
  ブロンズ:    { icon: '🥉' },
}
const DC_SERVERS = {
  Mana:      ['Anima', 'Asura', 'Chocobo', 'Hades', 'Ixion', 'Masamune', 'Pandemonium', 'Titan'],
  Gaia:      ['Alexander', 'Bahamut', 'Durandal', 'Fenrir', 'Ifrit', 'Ridill', 'Tiamat', 'Ultima'],
  Meteor:    ['Berias', 'Mandragora', 'Ramuh', 'Shinryu', 'Unicorn', 'Valefor', 'Yojimbo', 'Zeromus'],
  Elemental: ['Aegis', 'Atomos', 'Carbuncle', 'Garuda', 'Gungnir', 'Kujata', 'Tonberry', 'Typhon'],
}
const emptyPlayer = {
  firstName: '', lastName: '', nickname: '', server: '',
  mainJob: '', subJobs: [], highestRank: '', playstyle: [],
  team: '', screenshotDataUrl: '', freeText: '', sns: [],
}

const DARK_COLOR  = '#a8d8ea'
const LIGHT_COLOR = '#e87db0'

const THEME = {
  dark: {
    cardBg: '#0d0d18', pageBg: '#070710',
    label: 'rgba(255,255,255,0.35)', value: 'rgba(255,255,255,0.85)',
    activeTag: DARK_COLOR, activeTagMainText: '#0a0a15',
    inactiveTagBg: 'rgba(255,255,255,0.06)', inactiveTagBorder: 'rgba(255,255,255,0.15)',
    inactiveTagText: 'rgba(255,255,255,0.45)',
    border: 'rgba(255,255,255,0.1)', sectionBg: 'rgba(255,255,255,0.04)',
    inputBg: 'rgba(255,255,255,0.07)', inputBorder: 'rgba(255,255,255,0.15)',
    inputText: 'rgba(255,255,255,0.85)', buttonBg: DARK_COLOR, buttonText: '#0d1a20',
    accentColor: DARK_COLOR,
    rankBadgeBg: 'rgba(0,0,0,0.65)',
    playerNameColor: '#ffffff',
    noteBg: 'rgba(255,255,255,0.04)', noteBorder: 'rgba(255,255,255,0.1)',
    selectBg: 'rgba(255,255,255,0.07)', selectBorder: 'rgba(255,255,255,0.15)',
    selectText: 'rgba(255,255,255,0.85)', selectHover: 'rgba(168,216,234,0.12)',
    selectActive: 'rgba(168,216,234,0.2)', dropdownBg: '#181830',
    dropdownBorder: 'rgba(168,216,234,0.25)', groupLabel: 'rgba(168,216,234,0.45)',
    deleteBg: 'rgba(255,80,80,0.12)', deleteBorder: 'rgba(255,80,80,0.35)', deleteText: '#ff8888',
    themeBtnActiveBg: 'rgba(255,255,255,0.15)', themeBtnInactiveBg: 'transparent',
    themeBtnActiveText: '#ffffff', themeBtnInactiveText: 'rgba(255,255,255,0.4)',
    themeBtnBorder: 'rgba(255,255,255,0.15)',
  },
  light: {
    cardBg: '#f2eeec', pageBg: '#e8e4e2',
    label: '#aaa', value: '#2a2a3a',
    activeTag: LIGHT_COLOR, activeTagMainText: '#ffffff',
    inactiveTagBg: 'rgba(0,0,0,0.04)', inactiveTagBorder: 'rgba(0,0,0,0.12)',
    inactiveTagText: 'rgba(0,0,0,0.38)',
    border: 'rgba(0,0,0,0.1)', sectionBg: 'rgba(255,255,255,0.75)',
    inputBg: 'rgba(255,255,255,0.9)', inputBorder: 'rgba(0,0,0,0.12)',
    inputText: '#2a2a3a', buttonBg: LIGHT_COLOR, buttonText: '#ffffff',
    accentColor: LIGHT_COLOR,
    rankBadgeBg: 'rgba(255,255,255,0.92)',
    playerNameColor: '#111122',
    noteBg: 'rgba(255,255,255,0.85)', noteBorder: 'rgba(0,0,0,0.1)',
    selectBg: 'rgba(255,255,255,0.9)', selectBorder: 'rgba(0,0,0,0.12)',
    selectText: '#2a2a3a', selectHover: 'rgba(232,125,176,0.1)',
    selectActive: 'rgba(232,125,176,0.18)', dropdownBg: '#fff8fb',
    dropdownBorder: 'rgba(232,125,176,0.3)', groupLabel: 'rgba(200,100,150,0.55)',
    deleteBg: 'rgba(220,50,50,0.07)', deleteBorder: 'rgba(220,50,50,0.25)', deleteText: '#cc4444',
    themeBtnActiveBg: 'rgba(0,0,0,0.1)', themeBtnInactiveBg: 'transparent',
    themeBtnActiveText: '#2a2a3a', themeBtnInactiveText: 'rgba(0,0,0,0.35)',
    themeBtnBorder: 'rgba(0,0,0,0.12)',
  },
}

const GlobalStyle = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Rajdhani', 'Noto Sans JP', sans-serif; }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes dropDown {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    input, textarea { font-family: 'Noto Sans JP', sans-serif; }
  `}</style>
)

function ThemeToggle({ theme, onToggle }) {
  const t = THEME[theme]
  return (
    <div style={{
      display: 'flex', background: t.inactiveTagBg,
      border: `1px solid ${t.themeBtnBorder}`, borderRadius: '24px', padding: '3px', gap: '2px',
    }}>
      {[{ key: 'dark', label: '🌙 ダーク' }, { key: 'light', label: '☁️ ライト' }].map(({ key, label }) => (
        <button key={key} onClick={() => onToggle(key)} style={{
          padding: '5px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
          fontSize: '13px', fontFamily: "'Noto Sans JP',sans-serif",
          background: theme === key ? t.themeBtnActiveBg : t.themeBtnInactiveBg,
          color: theme === key ? t.themeBtnActiveText : t.themeBtnInactiveText,
          fontWeight: theme === key ? 600 : 400,
          transition: 'all 0.2s ease',
        }}>{label}</button>
      ))}
    </div>
  )
}

function CustomSelect({ value, onChange, options, placeholder, theme }) {
  const t = THEME[theme]
  const [open, setOpen] = useState(false)
  const ref = useRef()

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selectedLabel = (() => {
    for (const g of options) {
      if (g.items) { const f = g.items.find(i => i.value === value); if (f) return f.label }
      else if (g.value === value) return g.label
    }
    return null
  })()

  return (
    <div ref={ref} style={{ position: 'relative', userSelect: 'none' }}>
      <div onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: t.selectBg, border: `1px solid ${open ? t.accentColor + '88' : t.selectBorder}`,
        borderRadius: '8px', padding: '9px 36px 9px 12px', color: selectedLabel ? t.selectText : t.label,
        fontSize: '14px', fontFamily: "'Noto Sans JP',sans-serif", cursor: 'pointer',
        display: 'flex', alignItems: 'center', transition: 'border-color 0.15s', position: 'relative',
      }}>
        <span style={{ flex: 1, textAlign: 'left' }}>{selectedLabel || placeholder}</span>
        <span style={{
          position: 'absolute', right: '12px', color: t.accentColor, fontSize: '11px',
          transform: `rotate(${open ? 180 : 0}deg)`, transition: 'transform 0.2s',
        }}>▼</span>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200,
          background: t.dropdownBg, border: `1px solid ${t.dropdownBorder}`,
          borderRadius: '10px', animation: 'dropDown 0.15s ease',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)', maxHeight: '260px', overflowY: 'auto',
        }}>
          {options.map((g, gi) => g.items ? (
            <div key={gi}>
              <div style={{ padding: '5px 12px 2px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: t.groupLabel, textTransform: 'uppercase', fontFamily: "'Rajdhani',sans-serif", textAlign: 'left' }}>
                {g.label}
              </div>
              {g.items.map((item, ii) => {
                const active = item.value === value
                return (
                  <div key={ii} onClick={() => { onChange(item.value); setOpen(false) }}
                    style={{ padding: '5px 12px 5px 16px', fontSize: '13px', fontFamily: "'Noto Sans JP',sans-serif", cursor: 'pointer', background: active ? t.selectActive : 'transparent', color: active ? t.accentColor : t.selectText, fontWeight: active ? 600 : 400, textAlign: 'left' }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = t.selectHover }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >{active ? '✓ ' : ''}{item.label}</div>
                )
              })}
            </div>
          ) : (
            <div key={gi} onClick={() => { onChange(g.value); setOpen(false) }}
              style={{ padding: '9px 14px', fontSize: '14px', fontFamily: "'Noto Sans JP',sans-serif", cursor: 'pointer', background: g.value === value ? t.selectActive : 'transparent', color: g.value === value ? t.accentColor : t.selectText, textAlign: 'left' }}
              onMouseEnter={e => { if (g.value !== value) e.currentTarget.style.background = t.selectHover }}
              onMouseLeave={e => { if (g.value !== value) e.currentTarget.style.background = 'transparent' }}
            >{g.value === value ? '✓ ' : ''}{g.label}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children, theme }) {
  const t = THEME[theme]
  return (
    <div style={{
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em',
      color: t.label, textTransform: 'uppercase', marginBottom: '8px',
      textAlign: 'left', fontFamily: "'Barlow Condensed',sans-serif",
    }}>{children}</div>
  )
}

function PlayerCard({ player, theme, cardRef }) {
  const t = THEME[theme]
  const rank = player.highestRank
  const rankCfg = RANK_CONFIG[rank]
  const ac = t.accentColor

  const sectionLabel = {
    fontFamily: "'Barlow Condensed',sans-serif", fontSize: '11px', fontWeight: 600,
    letterSpacing: '0.15em', color: t.label, textTransform: 'uppercase',
    marginBottom: '2px', textAlign: 'left',
  }
  const tagBase = {
    display: 'inline-flex', alignItems: 'center', padding: '1px 8px', borderRadius: '20px',
    fontSize: '9px', fontWeight: 500, fontFamily: "'Noto Sans JP',sans-serif",
    border: '1px solid', margin: '2px', whiteSpace: 'nowrap', minWidth: '34px', justifyContent: 'center',
  }
  const activeTag   = { ...tagBase, background: ac + '22', borderColor: ac + '88', color: ac }
  const inactiveTag = { ...tagBase, background: t.inactiveTagBg, borderColor: t.inactiveTagBorder, color: t.inactiveTagText }
  const mainTag     = { ...tagBase, background: t.inactiveTagBg, borderColor: ac + '88', color: ac, fontWeight: 700 }

  return (
    <div ref={cardRef} style={{
      width: '420px', height: '800px', background: t.cardBg, position: 'relative',
      overflow: 'hidden', flexShrink: 0, animation: 'fadeUp 0.5s ease',
      fontFamily: "'Barlow Condensed','Rajdhani','Noto Sans JP',sans-serif",
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px', zIndex: 10,
        background: `linear-gradient(90deg, transparent, ${ac}, ${ac}bb, ${ac}, transparent)`,
        backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite',
      }} />

      {/* スクショ 300px */}
      <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
        {player.screenshotDataUrl ? (
          <img data-screenshot src={player.screenshotDataUrl} alt="ss"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: theme === 'dark'
              ? 'linear-gradient(135deg,#0d0d30,#1a0a2e,#0a1520)'
              : 'linear-gradient(135deg,#f0e8f0,#e8d8e8,#d8e8f0)',
          }}>
            <span style={{ color: t.label, fontSize: '13px', letterSpacing: '0.1em' }}>NO IMAGE</span>
          </div>
        )}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px', pointerEvents: 'none',
          background: `linear-gradient(to top, ${t.cardBg} 0%, ${t.cardBg}cc 30%, transparent 100%)`,
        }} />
        <div style={{ position: 'absolute', bottom: '12px', left: '18px', right: '20px', textAlign: 'left' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: t.accentColor, fontWeight: 500, marginBottom: '1px', textTransform: 'uppercase', fontFamily: "'Barlow Condensed',sans-serif" }}>Crystal Conflict Player</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: t.playerNameColor, lineHeight: 1.0, fontFamily: "'Barlow Condensed','Rajdhani',sans-serif" }}>
            {player.firstName || 'First'} {player.lastName || 'Last'}
          </div>
          {player.nickname && <div style={{ fontSize: '13px', color: t.value, marginTop: '1px', fontFamily: "'Noto Sans JP',sans-serif" }}>{player.nickname}</div>}
        </div>
        {rank && (
          <div style={{
            position: 'absolute', top: '14px', right: '14px', background: t.rankBadgeBg,
            border: `1px solid ${ac}66`, borderRadius: '10px', padding: '6px 10px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '56px',
          }}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{rankCfg?.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: ac, letterSpacing: '0.05em', fontFamily: "'Noto Sans JP',sans-serif", whiteSpace: 'nowrap' }}>{rank}</span>
          </div>
        )}
      </div>

      {/* 情報エリア 500px */}
      <div style={{ height: '500px', padding: '8px 16px 10px', display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden' }}>
        <div style={{ background: t.sectionBg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '0' }}>
          {[{ label: 'SERVER', value: player.server || '—' }, { label: 'TEAM', value: player.team || '—' }].map(({ label, value }, i) => (
            <div key={label} style={{ flex: 1, borderLeft: i === 1 ? `1px solid ${t.border}` : 'none', paddingLeft: i === 1 ? '12px' : '0', marginLeft: i === 1 ? '12px' : '0', textAlign: 'left' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color: t.label, textTransform: 'uppercase', fontFamily: "'Barlow Condensed',sans-serif", marginBottom: '1px' }}>{label}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: t.value, fontFamily: "'Noto Sans JP',sans-serif", lineHeight: 1.3 }}>{value}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={sectionLabel}>Jobs</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-2px' }}>
            {ALL_JOBS.map(job => {
              const isMain = job === player.mainJob
              const isSub = player.subJobs.includes(job)
              return <span key={job} style={isMain ? mainTag : isSub ? activeTag : inactiveTag}>{isMain ? '★ ' : ''}{job}</span>
            })}
          </div>
        </div>
        <div>
          <div style={sectionLabel}>Play Style</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-2px' }}>
            {PLAYSTYLE_LIST.map(ps => <span key={ps} style={player.playstyle.includes(ps) ? activeTag : inactiveTag}>{ps}</span>)}
          </div>
        </div>
        <div>
          <div style={sectionLabel}>Note</div>
          <div style={{
            background: t.noteBg, border: `1px solid ${t.noteBorder}`, borderRadius: '8px',
            padding: '6px 10px', fontSize: '11px', color: player.freeText ? t.value : t.label,
            fontFamily: "'Noto Sans JP',sans-serif", lineHeight: 1.55, height: '52px', overflow: 'hidden', textAlign: 'left',
          }}>{player.freeText || ''}</div>
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {SNS_LIST.map(s => {
            const snsTag = { ...(player.sns.includes(s) ? activeTag : inactiveTag), padding: '1px 6px', fontSize: '9px' }
            return <span key={s} style={snsTag}>{s}</span>
          })}
        </div>
        <div style={{ marginTop: '4px', borderTop: `1px solid ${t.border}`, paddingTop: '6px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: ac, textTransform: 'uppercase' }}>CC Player Card</div>
          <div style={{ fontSize: '9px', color: t.label, marginTop: '1px', letterSpacing: '0.05em' }}>FINAL FANTASY XIV © SQUARE ENIX</div>
        </div>
      </div>
    </div>
  )
}

function PlayerForm({ onSubmit, theme, onToggleTheme, initialData }) {
  const t = THEME[theme]
  const [form, setForm] = useState({ ...initialData })
  const fileRef = useRef()
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const toggleArr = (key, val) => setForm(f => {
    const arr = f[key]
    return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
  })
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set('screenshotDataUrl', ev.target.result)
    reader.readAsDataURL(file)
  }

  const inputStyle = {
    width: '100%', background: t.inputBg, border: `1px solid ${t.inputBorder}`,
    borderRadius: '8px', padding: '9px 12px', color: t.inputText,
    fontSize: '14px', fontFamily: "'Noto Sans JP',sans-serif", outline: 'none',
  }
  const tagBtn = (active) => ({
    display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: '20px',
    fontSize: '13px', fontWeight: 500, fontFamily: "'Noto Sans JP',sans-serif",
    border: `1px solid ${active ? t.activeTag + '88' : t.inactiveTagBorder}`,
    background: active ? t.activeTag + '22' : t.inactiveTagBg,
    color: active ? t.activeTag : t.inactiveTagText,
    cursor: 'pointer', margin: '3px', transition: 'all 0.15s ease',
  })

  const serverOptions = Object.entries(DC_SERVERS).map(([dc, servers]) => ({
    label: dc, items: servers.map(s => ({ label: `${s} (${dc})`, value: `${s} (${dc})` }))
  }))
  const jobOptions = Object.entries(JOB_LIST).map(([role, jobs]) => ({
    label: role, items: jobs.map(j => ({ label: j, value: j }))
  }))
  const rankOptions = RANK_LIST.map(r => ({ label: `${RANK_CONFIG[r].icon} ${r}`, value: r }))

  return (
    <div style={{ minHeight: '100vh', background: t.pageBg, padding: '24px 16px 40px', color: t.value }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* ヘッダー */}
        <div style={{ textAlign: 'center', marginBottom: '6px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: t.label, textTransform: 'uppercase', marginBottom: '2px' }}>CC Player Card</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: t.value, fontFamily: "'Noto Sans JP',sans-serif" }}>プロフィール編集</div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 名前 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <SectionLabel theme={theme}>ファーストネーム</SectionLabel>
              <input style={inputStyle} value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="First Name" />
            </div>
            <div>
              <SectionLabel theme={theme}>ラストネーム</SectionLabel>
              <input style={inputStyle} value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Last Name" />
            </div>
          </div>

          {/* 呼び名 */}
          <div>
            <SectionLabel theme={theme}>呼び名</SectionLabel>
            <input style={inputStyle} value={form.nickname} onChange={e => set('nickname', e.target.value)} placeholder="" />
          </div>

          {/* サーバー */}
          <div>
            <SectionLabel theme={theme}>サーバー</SectionLabel>
            <CustomSelect value={form.server} onChange={v => set('server', v)} options={serverOptions} placeholder="選択してください" theme={theme} />
          </div>

          {/* 最高ランク */}
          <div>
            <SectionLabel theme={theme}>最高ランク</SectionLabel>
            <CustomSelect value={form.highestRank} onChange={v => set('highestRank', v)} options={rankOptions} placeholder="選択" theme={theme} />
          </div>

          {/* メインジョブ */}
          <div>
            <SectionLabel theme={theme}>メインジョブ</SectionLabel>
            <CustomSelect value={form.mainJob} onChange={v => set('mainJob', v)} options={jobOptions} placeholder="選択" theme={theme} />
          </div>

          {/* 使用ジョブ */}
          <div>
            <SectionLabel theme={theme}>使用ジョブ（複数選択可）</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-3px' }}>
              {ALL_JOBS.filter(j => j !== form.mainJob).map(j => (
                <button key={j} onClick={() => toggleArr('subJobs', j)} style={tagBtn(form.subJobs.includes(j))}>{j}</button>
              ))}
            </div>
          </div>

          {/* プレイスタイル */}
          <div>
            <SectionLabel theme={theme}>プレイスタイル</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-3px' }}>
              {PLAYSTYLE_LIST.map(ps => (
                <button key={ps} onClick={() => toggleArr('playstyle', ps)} style={tagBtn(form.playstyle.includes(ps))}>{ps}</button>
              ))}
            </div>
          </div>

          {/* チーム */}
          <div>
            <SectionLabel theme={theme}>チーム</SectionLabel>
            <input style={inputStyle} value={form.team} onChange={e => set('team', e.target.value)} placeholder="チーム名（任意）" />
          </div>

          {/* スクショ */}
          <div>
            <SectionLabel theme={theme}>スクリーンショット画像</SectionLabel>
            <div style={{
              background: t.accentColor + '12', border: `1px solid ${t.accentColor}40`,
              borderRadius: '8px', padding: '8px 12px', marginBottom: '8px',
              fontSize: '12px', color: t.value, fontFamily: "'Noto Sans JP',sans-serif",
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span>📐</span>
              <span>推奨サイズ：横幅 1280px 以上・縦横比 4:3 〜 16:9 推奨</span>
            </div>
            {form.screenshotDataUrl ? (
              <div>
                {/* カードと同じ比率でプレビュー */}
                <div style={{
                  width: '100%', aspectRatio: '420 / 300', borderRadius: '10px',
                  overflow: 'hidden', marginBottom: '8px', border: `1px solid ${t.border}`,
                }}>
                  <img src={form.screenshotDataUrl} alt="preview" style={{
                    width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block',
                  }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button onClick={() => fileRef.current.click()} style={{
                    padding: '10px', background: t.inputBg, border: `1px solid ${t.inputBorder}`,
                    borderRadius: '8px', color: t.value, fontSize: '13px', cursor: 'pointer',
                    fontFamily: "'Noto Sans JP',sans-serif",
                  }}>画像を変更</button>
                  <button onClick={() => set('screenshotDataUrl', '')} style={{
                    padding: '10px', background: t.deleteBg, border: `1px solid ${t.deleteBorder}`,
                    borderRadius: '8px', color: t.deleteText, fontSize: '13px', cursor: 'pointer',
                    fontFamily: "'Noto Sans JP',sans-serif",
                  }}>削除</button>
                </div>
              </div>
            ) : (
              <div onClick={() => fileRef.current.click()} style={{
                border: `2px dashed ${t.inactiveTagBorder}`, borderRadius: '10px',
                padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ fontSize: '32px' }}>🖼️</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: t.value, fontFamily: "'Noto Sans JP',sans-serif" }}>クリックしてスクショを選択</span>
                <span style={{ fontSize: '12px', color: t.label, fontFamily: "'Noto Sans JP',sans-serif" }}>JPG / PNG　推奨：1280px幅以上</span>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </div>

          {/* NOTE */}
          <div>
            <SectionLabel theme={theme}>NOTE（大会履歴・活動内容・一言など）</SectionLabel>
            <textarea
              style={{ ...inputStyle, height: '110px', resize: 'none', lineHeight: 1.7 }}
              value={form.freeText}
              onChange={e => set('freeText', e.target.value.slice(0, 120))}
              placeholder={'例）くりこん杯 3位\n週末メインでプレイ中\n気軽に絡んでください！'}
            />
            <div style={{ textAlign: 'right', fontSize: '11px', color: t.label, marginTop: '4px' }}>{form.freeText.length} / 120</div>
          </div>

          {/* SNS */}
          <div>
            <SectionLabel theme={theme}>SNS</SectionLabel>
            <div style={{ display: 'flex', gap: '8px' }}>
              {SNS_LIST.map(s => (
                <button key={s} onClick={() => toggleArr('sns', s)} style={tagBtn(form.sns.includes(s))}>{s}</button>
              ))}
            </div>
          </div>

          <button onClick={() => onSubmit(form)} style={{
            width: '100%', padding: '14px', background: t.buttonBg, color: t.buttonText,
            border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700,
            fontFamily: "'Rajdhani',sans-serif", letterSpacing: '0.08em', cursor: 'pointer', marginTop: '4px',
          }}>カードを表示 →</button>
          <div style={{ textAlign: 'center', fontSize: '11px', color: t.label, paddingTop: '4px' }}>
            FINAL FANTASY XIV © SQUARE ENIX
          </div>
        </div>
      </div>
    </div>
  )
}

function CardView({ player, theme, onEdit }) {
  const t = THEME[theme]
  const cardRef = useRef()
  const [generating, setGenerating] = useState(false)
  const [showSave, setShowSave] = useState(false)
  const [cardImgSrc, setCardImgSrc] = useState(null)

  const handleRenderCard = useCallback(async () => {
    if (!cardRef.current) return
    setGenerating(true)
    setCardImgSrc(null)

    try {
      await document.fonts.ready

      // スクショがある場合：html2canvas用にImageオブジェクトへ事前デコード
      if (player.screenshotDataUrl) {
        await new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = async () => {
            try { await img.decode() } catch(e) {}
            resolve()
          }
          img.onerror = reject
          img.src = player.screenshotDataUrl
        })
      }

      // html2canvas を動的ロード（未ロードなら scriptタグで注入）
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
          s.onload = resolve
          s.onerror = reject
          document.head.appendChild(s)
        })
      }
      const html2canvas = window.html2canvas

      // html2canvas でキャプチャ
      // useCORS不要（base64 dataURLは同一オリジン扱い）、allowTaint:trueで確実に描画
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: false,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 0,
      })

      const dataUrl = canvas.toDataURL('image/png')
      setCardImgSrc(dataUrl)
      setShowSave(true)
    } catch (err) {
      console.error('render error:', err)
      alert('画像生成に失敗しました。再試行してください。')
    } finally {
      setGenerating(false)
    }
  }, [player])

  // 自動生成なし：ユーザーがボタンを押したときのみ生成

  // ファイル名生成 cc-card-FirstLast-dark/white
  const getFileName = () => {
    const name = [player.firstName, player.lastName].filter(Boolean).join('') || 'player'
    const mode = theme === 'dark' ? 'dark' : 'white'
    return `cc-card-${name}-${mode}.png`
  }

  const handleDownload = () => {
    if (!cardImgSrc) return
    const a = document.createElement('a')
    a.href = cardImgSrc
    a.download = getFileName()
    a.click()
  }

  if (showSave && cardImgSrc) {
    return (
      <div style={{ minHeight: '100vh', background: t.pageBg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 40px' }}>
        <img src={cardImgSrc} alt="Generated card" style={{
          width: '420px', maxWidth: '100%', display: 'block',
          borderRadius: '4px', border: `1px solid ${t.border}`, animation: 'fadeIn 0.4s ease',
        }} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => { setShowSave(false); setCardImgSrc(null) }} style={{
            padding: '7px 14px', background: t.inactiveTagBg, border: `1px solid ${t.inactiveTagBorder}`,
            borderRadius: '20px', color: t.value, fontSize: '12px', fontWeight: 500,
            cursor: 'pointer', fontFamily: "'Noto Sans JP',sans-serif",
          }}>← 戻る</button>
          <button onClick={handleDownload} style={{
            padding: '7px 16px', background: t.buttonBg, border: 'none', borderRadius: '20px',
            color: t.buttonText, fontSize: '12px', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Noto Sans JP',sans-serif",
          }}>💾 ダウンロード</button>
          <button onClick={handleRenderCard} disabled={generating} style={{
            padding: '7px 14px', background: t.inactiveTagBg, border: `1px solid ${t.inactiveTagBorder}`,
            borderRadius: '20px', color: t.value, fontSize: '12px',
            cursor: generating ? 'wait' : 'pointer', fontFamily: "'Noto Sans JP',sans-serif",
            opacity: generating ? 0.7 : 1,
          }}>{generating ? '生成中...' : '↺ 再生成'}</button>
        </div>
        <div style={{
          width: '420px', maxWidth: '100%', marginTop: '12px',
          background: t.accentColor + '12', border: `1px solid ${t.accentColor}35`,
          borderRadius: '8px', padding: '8px 14px',
          color: t.label, fontFamily: "'Noto Sans JP',sans-serif", fontSize: '11px', lineHeight: 1.8,
        }}>
          💾 ダウンロードボタン または
          📱 スマホ：長押し →「写真に追加」／
          💻 PC：右クリック →「名前を付けて保存」
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: t.pageBg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 40px' }}>
      {/* プレビュー：生成完了前のみ表示 */}
      {!showSave && (
        <>
          <PlayerCard player={player} theme={theme} cardRef={cardRef} />
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={onEdit} style={{
              padding: '10px 20px', background: t.inactiveTagBg, border: `1px solid ${t.inactiveTagBorder}`,
              borderRadius: '8px', color: t.value, fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Rajdhani',sans-serif",
            }}>← 編集に戻る</button>
            <button onClick={handleRenderCard} disabled={generating} style={{
              padding: '10px 20px', background: t.buttonBg, border: 'none', borderRadius: '8px',
              color: t.buttonText, fontSize: '14px', fontWeight: 700,
              cursor: generating ? 'wait' : 'pointer', fontFamily: "'Rajdhani',sans-serif",
              opacity: generating ? 0.7 : 1,
            }}>{generating ? '⏳ 生成中...' : '🖼️ カードを生成'}</button>
          </div>
          {generating && (
            <div style={{
              marginTop: '14px', padding: '10px 18px',
              background: t.accentColor + '15', border: `1px solid ${t.accentColor}40`,
              borderRadius: '8px', textAlign: 'center',
              color: t.label, fontFamily: "'Noto Sans JP',sans-serif", fontSize: '12px', lineHeight: 1.8,
            }}>
              ⏳ 生成中…しばらくお待ちください
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function App() {
  const [view, setView]     = useState('form')
  const [player, setPlayer] = useState(emptyPlayer)
  const [theme, setTheme]   = useState('dark')
  return (
    <>
      <GlobalStyle />
      {view === 'form' ? (
        <PlayerForm
          onSubmit={(data) => { setPlayer(data); setView('card') }}
          theme={theme}
          onToggleTheme={(t) => setTheme(t)}
          initialData={player}
        />
      ) : (
        <CardView player={player} theme={theme} onEdit={() => setView('form')} />
      )}
    </>
  )
}
