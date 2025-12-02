const { useState, useEffect, useRef } = React;

// --- Dil ve Sabitler ---
const translations = {
  tr: {
    title: '🐢 SU Kadro Oluşturucu',
    fieldTitle: 'Taktik Tahtası',
    players: 'Oyuncu Havuzu',
    deleteAll: 'Sıfırla',
    addPlayerPlaceholder: 'Oyuncu adı...',
    team1: 'Takım 1 (Ev Sahibi)',
    team2: 'Takım 2 (Deplasman)',
    selectAndClick: 'Oyuncuyu seç, takıma tıkla',
    moveHint: '💡 İnce ayar için oyuncuya tıkla, sonra sahada yeni yerine dokun.',
    downloadPNG: 'Görüntüyü İndir',
    copyRosters: 'Listeyi Kopyala',
    copySuccess: 'Kopyalandı!',
    positions: {
      GK: 'Kaleci',
      DEF: 'Defans',
      MID: 'Ortasaha',
      FWD: 'Forvet'
    }
  },
  en: {
    title: '🐢 SU Team Builder',
    fieldTitle: 'Tactical Board',
    players: 'Player Pool',
    deleteAll: 'Reset',
    addPlayerPlaceholder: 'Player name...',
    team1: 'Team 1 (Home)',
    team2: 'Team 2 (Away)',
    selectAndClick: 'Select player, click team box',
    moveHint: '💡 Click player, then click field to fine-tune position.',
    downloadPNG: 'Download Image',
    copyRosters: 'Copy List',
    copySuccess: 'Copied!',
    positions: {
      GK: 'Goalkeeper',
      DEF: 'Defender',
      MID: 'Midfielder',
      FWD: 'Forward'
    }
  }
};

const POSITIONS = [
  { id: 'GK', label: 'KL', color: 'bg-yellow-500', tr: 'Kaleci' },
  { id: 'DEF', label: 'DF', color: 'bg-blue-500', tr: 'Defans' },
  { id: 'MID', label: 'OS', color: 'bg-emerald-500', tr: 'Ortasaha' },
  { id: 'FWD', label: 'FV', color: 'bg-rose-500', tr: 'Forvet' },
];

// --- Ikonlar (Icons) ---
const Icons = {
  UserPlus: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  Trash: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-1 1-1h6c1 0 1 1 1 1v2"/></svg>,
  Download: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Copy: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Shield: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
};

// --- Yardımcı Fonksiyonlar ---
// Mevkiye göre otomatik koordinat belirleme
const getAutoPosition = (team, posId) => {
  const isTeam1 = team === 'team1';
  // X ekseni: Team 1 soldan sağa, Team 2 sağdan sola
  let x = 50;
  let y = 50;

  // Rastgelelik ekle ki üst üste binmesinler
  const jitter = () => (Math.random() - 0.5) * 10;

  if (posId === 'GK') {
    x = isTeam1 ? 5 : 95;
    y = 50;
  } else if (posId === 'DEF') {
    x = isTeam1 ? 25 : 75;
    y = 30 + Math.random() * 40; // Defans hattı boyunca dağıl
  } else if (posId === 'MID') {
    x = isTeam1 ? 45 : 55;
    y = 20 + Math.random() * 60;
  } else if (posId === 'FWD') {
    x = isTeam1 ? 60 : 40;
    y = 50 + jitter();
  }
  
  return { x, y };
};

// --- Ana Bileşen ---
function HalisahaKadro() {
  const [language, setLanguage] = useState('tr');
  const t = translations[language];

  // Oyuncular artık obje: { id, name, pos }
  const [players, setPlayers] = useState([
    { id: 1, name: 'Mert', pos: 'MID' },
    { id: 2, name: 'Orhun', pos: 'DEF' },
    { id: 3, name: 'Oktay', pos: 'GK' },
    { id: 4, name: 'Hüseyin', pos: 'FWD' }
  ]);
  
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPos, setNewPlayerPos] = useState('MID');
  
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  
  const [selectedObj, setSelectedObj] = useState(null); // { type: 'pool'|'field', team?, index?, player }
  const [copyMessage, setCopyMessage] = useState('');
  const fieldRef = useRef(null);

  // Oyuncu Ekleme
  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newP = {
        id: Date.now(),
        name: newPlayerName.trim(),
        pos: newPlayerPos
      };
      setPlayers([...players, newP]);
      setNewPlayerName('');
    }
  };

  // Seçim Mantığı
  const handleSelectFromPool = (player) => {
    if (selectedObj && selectedObj.player.id === player.id) {
      setSelectedObj(null);
    } else {
      setSelectedObj({ type: 'pool', player });
    }
  };

  const handleSelectFromField = (teamName, index, player) => {
    // Sahadaki oyuncuyu seçip taşımak için
    setSelectedObj({ type: 'field', teamName, index, player });
  };

  // Takıma Ekleme (Havuzdan veya Transfer)
  const addToTeam = (targetTeamName) => {
    if (!selectedObj) return;

    const targetSetTeam = targetTeamName === 'team1' ? setTeam1 : setTeam2;
    const targetTeamList = targetTeamName === 'team1' ? team1 : team2;

    if (targetTeamList.length >= 7) return; // Maks 7 kişi

    if (selectedObj.type === 'pool') {
      // Havuzdan ekle
      const { x, y } = getAutoPosition(targetTeamName, selectedObj.player.pos);
      const playerOnField = { ...selectedObj.player, x, y };
      
      targetSetTeam([...targetTeamList, playerOnField]);
      setPlayers(players.filter(p => p.id !== selectedObj.player.id));
      setSelectedObj(null);
    } 
    // İleride takımlar arası transfer de eklenebilir
  };

  // Sahada Hareket Ettirme
  const handleFieldClick = (e) => {
    if (!selectedObj || selectedObj.type !== 'field') {
      setSelectedObj(null); // Seçimi kaldır
      return;
    }

    const rect = fieldRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const { teamName, index } = selectedObj;
    const teamList = teamName === 'team1' ? team1 : team2;
    const setTeam = teamName === 'team1' ? setTeam1 : setTeam2;

    const updated = [...teamList];
    updated[index] = { ...updated[index], x, y };
    
    setTeam(updated);
    setSelectedObj(null);
  };

  // Takımdan Çıkarma
  const removeFromTeam = (teamName, index) => {
    const list = teamName === 'team1' ? team1 : team2;
    const setList = teamName === 'team1' ? setTeam1 : setTeam2;
    const player = list[index];

    // Havuza geri koy
    setPlayers([...players, { id: player.id, name: player.name, pos: player.pos }]);
    // Takımdan sil
    setList(list.filter((_, i) => i !== index));
    setSelectedObj(null);
  };

  const clearTeam = (teamName) => {
    const list = teamName === 'team1' ? team1 : team2;
    const setList = teamName === 'team1' ? setTeam1 : setTeam2;
    
    // Hepsini havuza geri at (koordinatları temizleyerek)
    const returnedPlayers = list.map(p => ({ id: p.id, name: p.name, pos: p.pos }));
    setPlayers([...players, ...returnedPlayers]);
    setList([]);
    setSelectedObj(null);
  };

  // Resim İndirme
  const handleDownload = () => {
    if (fieldRef.current) {
      const prevSelect = selectedObj;
      setSelectedObj(null);
      setTimeout(() => {
        html2canvas(fieldRef.current, { useCORS: true, backgroundColor: null }).then(canvas => {
          const link = document.createElement('a');
          link.download = 'su-kadro-modern.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          setSelectedObj(prevSelect);
        });
      }, 50);
    }
  };
  
  // Kopyalama
  const copyRosters = () => {
    const text = `${t.team1}:\n${team1.map(p => `${p.name} (${p.pos})`).join('\n')}\n\n${t.team2}:\n${team2.map(p => `${p.name} (${p.pos})`).join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopyMessage(t.copySuccess);
      setTimeout(() => setCopyMessage(''), 2000);
    });
  };

  // --- Render Parçaları ---
  
  // Pozisyon Badge'i
  const PosBadge = ({ pos }) => {
    const p = POSITIONS.find(x => x.id === pos) || POSITIONS[2];
    return (
      <span className={`${p.color} text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow-sm tracking-wider`}>
        {p.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white pb-10">
      
      {/* Header */}
      <div className="w-full bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐢</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-sm ${language==='tr'?'bg-indigo-600 text-white':'text-slate-400 hover:text-white'}`}>TR</button>
            <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-sm ${language==='en'?'bg-indigo-600 text-white':'text-slate-400 hover:text-white'}`}>EN</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL PANEL: Oyuncu Havuzu & Ekleme */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Icons.UserPlus size={18} /> {t.players} <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">{players.length}</span>
              </h2>
              {players.length > 0 && (
                <button onClick={() => setPlayers([])} className="text-rose-400 hover:text-rose-300 text-xs font-medium uppercase tracking-wide">
                  {t.deleteAll}
                </button>
              )}
            </div>

            {/* Ekleme Formu */}
            <div className="flex flex-col gap-2 mb-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
              <input 
                type="text" 
                value={newPlayerName}
                onChange={e => setNewPlayerName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addPlayer()}
                placeholder={t.addPlayerPlaceholder}
                className="bg-transparent border-b border-slate-600 focus:border-indigo-500 outline-none text-sm py-1 placeholder-slate-500 w-full transition-colors"
              />
              <div className="flex gap-2">
                <select 
                  value={newPlayerPos} 
                  onChange={e => setNewPlayerPos(e.target.value)}
                  className="bg-slate-800 text-xs rounded border border-slate-600 px-2 py-1 outline-none focus:border-indigo-500"
                >
                  {POSITIONS.map(p => (
                    <option key={p.id} value={p.id}>{p.id} - {p.tr}</option>
                  ))}
                </select>
                <button 
                  onClick={addPlayer}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-1.5 rounded transition shadow-lg shadow-indigo-500/20"
                >
                  EKLE
                </button>
              </div>
            </div>

            {/* Oyuncu Listesi */}
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {players.map(player => {
                const isSelected = selectedObj?.type === 'pool' && selectedObj.player.id === player.id;
                return (
                  <div 
                    key={player.id}
                    onClick={() => handleSelectFromPool(player)}
                    className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-all duration-200
                      ${isSelected 
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                        : 'bg-slate-700/30 border-transparent hover:bg-slate-700/50 hover:border-slate-600'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <PosBadge pos={player.pos} />
                      <span className={`text-sm ${isSelected ? 'text-white font-semibold' : 'text-slate-300'}`}>
                        {player.name}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPlayers(players.filter(p => p.id !== player.id)); }}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Icons.Trash size={14} />
                    </button>
                  </div>
                );
              })}
              {players.length === 0 && (
                <div className="text-center py-8 text-slate-600 text-sm italic">
                  Henüz oyuncu yok...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ORTA & SAĞ: Saha ve Takımlar */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Takım Seçiciler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* TAKIM 1 */}
            <div 
              onClick={() => addToTeam('team1')}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 cursor-pointer group
                ${selectedObj?.type === 'pool' 
                  ? 'border-indigo-500/50 bg-indigo-900/10 hover:bg-indigo-900/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                  : 'border-slate-700 bg-slate-800/40'
                }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-red-400 flex items-center gap-2">
                  <Icons.Shield size={16} /> {t.team1}
                </h3>
                <span className="text-xs bg-slate-900 px-2 py-0.5 rounded text-slate-400">{team1.length}/7</span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {team1.map((p, idx) => (
                   <div key={idx} className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs px-2 py-1 rounded flex items-center gap-2">
                     <span>{p.name}</span>
                     <button onClick={(e)=>{e.stopPropagation(); removeFromTeam('team1', idx)}} className="hover:text-white">×</button>
                   </div>
                ))}
                {team1.length === 0 && <span className="text-xs text-slate-500 w-full text-center py-2 border border-dashed border-slate-700 rounded">{t.selectAndClick}</span>}
              </div>
              {/* Arka plan süsü */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* TAKIM 2 */}
            <div 
              onClick={() => addToTeam('team2')}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 cursor-pointer group
                ${selectedObj?.type === 'pool' 
                  ? 'border-indigo-500/50 bg-indigo-900/10 hover:bg-indigo-900/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                  : 'border-slate-700 bg-slate-800/40'
                }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-cyan-400 flex items-center gap-2">
                  <Icons.Shield size={16} /> {t.team2}
                </h3>
                <span className="text-xs bg-slate-900 px-2 py-0.5 rounded text-slate-400">{team2.length}/7</span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {team2.map((p, idx) => (
                   <div key={idx} className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs px-2 py-1 rounded flex items-center gap-2">
                     <span>{p.name}</span>
                     <button onClick={(e)=>{e.stopPropagation(); removeFromTeam('team2', idx)}} className="hover:text-white">×</button>
                   </div>
                ))}
                {team2.length === 0 && <span className="text-xs text-slate-500 w-full text-center py-2 border border-dashed border-slate-700 rounded">{t.selectAndClick}</span>}
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>

          </div>

          {/* --- SAHA --- */}
          <div className="relative bg-slate-800 rounded-xl p-1 shadow-2xl border border-slate-700 overflow-hidden">
            <h3 className="absolute top-4 left-0 w-full text-center text-white/20 font-bold text-4xl uppercase tracking-[1em] pointer-events-none z-0">
              {t.fieldTitle}
            </h3>
            
            <div 
              ref={fieldRef}
              onClick={handleFieldClick}
              className={`relative w-full aspect-[16/9] md:aspect-[2/1] bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-lg overflow-hidden border border-white/10 shadow-inner
                ${selectedObj?.type === 'field' ? 'cursor-crosshair ring-2 ring-yellow-400/50' : ''}`}
            >
              {/* Saha Çizgileri */}
              <div className="absolute inset-4 border-2 border-white/30 rounded-sm pointer-events-none"></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30 transform -translate-x-1/2 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              {/* Kale Alanları */}
              <div className="absolute top-1/2 left-4 w-12 h-32 border-2 border-l-0 border-white/30 transform -translate-y-1/2 pointer-events-none"></div>
              <div className="absolute top-1/2 right-4 w-12 h-32 border-2 border-r-0 border-white/30 transform -translate-y-1/2 pointer-events-none"></div>

              {/* OYUNCULAR: TAKIM 1 */}
              {team1.map((player, idx) => {
                 const isSel = selectedObj?.type === 'field' && selectedObj.teamName === 'team1' && selectedObj.index === idx;
                 const posColor = POSITIONS.find(p => p.id === player.pos)?.color || 'bg-gray-500';
                 
                 return (
                   <div 
                    key={`t1-${player.id}`}
                    onClick={(e) => { e.stopPropagation(); handleSelectFromField('team1', idx, player); }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 flex flex-col items-center group z-10 hover:z-20`}
                    style={{ left: `${player.x}%`, top: `${player.y}%` }}
                   >
                     <div className={`w-8 h-8 rounded-full shadow-lg border-2 flex items-center justify-center text-[10px] font-bold text-white relative
                        ${isSel ? 'border-yellow-400 scale-125 ring-4 ring-yellow-400/30' : 'border-white group-hover:scale-110'}
                        ${posColor}
                     `}>
                       {player.pos}
                       {/* Takım belirteci halkası */}
                       <div className="absolute inset-0 rounded-full border-2 border-red-500 opacity-50"></div>
                     </div>
                     <span className="mt-1 text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded shadow backdrop-blur-sm whitespace-nowrap">
                       {player.name}
                     </span>
                   </div>
                 );
              })}

              {/* OYUNCULAR: TAKIM 2 */}
              {team2.map((player, idx) => {
                 const isSel = selectedObj?.type === 'field' && selectedObj.teamName === 'team2' && selectedObj.index === idx;
                 const posColor = POSITIONS.find(p => p.id === player.pos)?.color || 'bg-gray-500';
                 
                 return (
                   <div 
                    key={`t2-${player.id}`}
                    onClick={(e) => { e.stopPropagation(); handleSelectFromField('team2', idx, player); }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 flex flex-col items-center group z-10 hover:z-20`}
                    style={{ left: `${player.x}%`, top: `${player.y}%` }}
                   >
                     <div className={`w-8 h-8 rounded-full shadow-lg border-2 flex items-center justify-center text-[10px] font-bold text-white relative
                        ${isSel ? 'border-yellow-400 scale-125 ring-4 ring-yellow-400/30' : 'border-white group-hover:scale-110'}
                        ${posColor}
                     `}>
                       {player.pos}
                       <div className="absolute inset-0 rounded-full border-2 border-cyan-500 opacity-50"></div>
                     </div>
                     <span className="mt-1 text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded shadow backdrop-blur-sm whitespace-nowrap">
                       {player.name}
                     </span>
                   </div>
                 );
              })}

            </div>

            {/* Alt Butonlar */}
            <div className="bg-slate-900/80 p-3 flex justify-between items-center text-xs text-slate-400">
              <span className="hidden md:inline">{t.moveHint}</span>
              <div className="flex gap-3">
                 <button onClick={handleDownload} className="flex items-center gap-2 hover:text-white transition">
                   <Icons.Download size={14} /> {t.downloadPNG}
                 </button>
                 <button onClick={copyRosters} className="flex items-center gap-2 hover:text-white transition">
                   <Icons.Copy size={14} /> {t.copyRosters}
                   {copyMessage && <span className="text-emerald-400 font-bold ml-1">{copyMessage}</span>}
                 </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const rootEl = document.getElementById('root');
ReactDOM.createRoot(rootEl).render(React.createElement(HalisahaKadro));