const { useState, useEffect, useRef } = React;

// --- Dil ve Sabitler ---
const translations = {
  tr: {
    title: '🐢 SU Kadro Oluşturucu',
    fieldTitle: 'Taktik Tahtası',
    players: 'Oyuncu Havuzu',
    deleteAll: 'Sıfırla',
    addPlayerPlaceholder: 'Oyuncu adı...',
    team1: 'Takım 1 (Ev)',
    team2: 'Takım 2 (Dep)',
    selectAndClick: 'Oyuncuyu seç, takıma tıkla',
    moveHint: '💡 Yer değiştirmek için tıkla.',
    downloadPNG: 'İndir',
    copyRosters: 'Kopyala',
    copySuccess: 'Kopyalandı!',
    filterAll: 'Tümü',
    saveMatch: 'Maçı Geçmişe Kaydet',
    matchHistory: 'Geçmiş Karşılaşmalar',
    enterScore: 'Skor Gir',
    noMatches: 'Henüz kayıtlı maç yok.',
    saveScore: 'Kaydet',
    date: 'Tarih',
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
    moveHint: '💡 Click to move.',
    downloadPNG: 'Download',
    copyRosters: 'Copy',
    copySuccess: 'Copied!',
    filterAll: 'All',
    saveMatch: 'Save to History',
    matchHistory: 'Match History',
    enterScore: 'Enter Score',
    noMatches: 'No matches saved yet.',
    saveScore: 'Save',
    date: 'Date',
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

// --- Ikonlar ---
const Icons = {
  UserPlus: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  Trash: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-1 1-1h6c1 0 1 1 1 1v2"/></svg>,
  Download: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Copy: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Shield: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Save: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  History: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Edit: ({size=16}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
};

// --- Yardımcı Fonksiyonlar ---
const getAutoPosition = (team, posArray) => {
  const isTeam1 = team === 'team1';
  const primaryPos = Array.isArray(posArray) && posArray.length > 0 ? posArray[0] : 'MID';

  let x = 50, y = 50;
  const jitter = () => (Math.random() - 0.5) * 10;

  if (primaryPos === 'GK') {
    x = isTeam1 ? 5 : 95;
    y = 50;
  } else if (primaryPos === 'DEF') {
    x = isTeam1 ? 25 : 75;
    y = 30 + Math.random() * 40;
  } else if (primaryPos === 'MID') {
    x = isTeam1 ? 45 : 55;
    y = 20 + Math.random() * 60;
  } else if (primaryPos === 'FWD') {
    x = isTeam1 ? 60 : 40;
    y = 50 + jitter();
  }
  
  return { x, y };
};

// --- Ana Bileşen ---
function HalisahaKadro() {
  const [language, setLanguage] = useState('tr');
  const t = translations[language];

  // Başlangıç verileri
  const [players, setPlayers] = useState([
    { id: 1, name: 'Mert', pos: ['MID', 'FWD'] },
    { id: 2, name: 'Orhun', pos: ['DEF'] },
    { id: 3, name: 'Oktay', pos: ['GK'] },
    { id: 4, name: 'Hüseyin', pos: ['FWD'] },
    { id: 5, name: 'Kaan', pos: ['DEF', 'MID'] }
  ]);
  
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPos, setNewPlayerPos] = useState(['MID']);
  const [filterPos, setFilterPos] = useState('ALL');

  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  
  // Geçmiş Maçlar State'i (LocalStorage'dan çekelim)
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('su_matches');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [editingScoreId, setEditingScoreId] = useState(null);
  const [tempScore, setTempScore] = useState({ s1: '', s2: '' });

  const [selectedObj, setSelectedObj] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');
  const fieldRef = useRef(null);

  // Matches değişince LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('su_matches', JSON.stringify(matches));
  }, [matches]);

  const toggleNewPlayerPos = (posId) => {
    if (newPlayerPos.includes(posId)) {
      if (newPlayerPos.length > 1) {
        setNewPlayerPos(newPlayerPos.filter(p => p !== posId));
      }
    } else {
      setNewPlayerPos([...newPlayerPos, posId]);
    }
  };

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

  const getFilteredPlayers = () => {
    if (filterPos === 'ALL') return players;
    return players.filter(p => p.pos.includes(filterPos));
  };

  const handleSelectFromPool = (player) => {
    if (selectedObj && selectedObj.player.id === player.id) {
      setSelectedObj(null);
    } else {
      setSelectedObj({ type: 'pool', player });
    }
  };

  const handleSelectFromField = (teamName, index, player) => {
    setSelectedObj({ type: 'field', teamName, index, player });
  };

  const addToTeam = (targetTeamName) => {
    if (!selectedObj) return;
    const targetSetTeam = targetTeamName === 'team1' ? setTeam1 : setTeam2;
    const targetTeamList = targetTeamName === 'team1' ? team1 : team2;

    if (targetTeamList.length >= 7) return;

    if (selectedObj.type === 'pool') {
      const { x, y } = getAutoPosition(targetTeamName, selectedObj.player.pos);
      const playerOnField = { ...selectedObj.player, x, y };
      targetSetTeam([...targetTeamList, playerOnField]);
      setPlayers(players.filter(p => p.id !== selectedObj.player.id));
      setSelectedObj(null);
    } 
  };

  const handleFieldClick = (e) => {
    if (!selectedObj || selectedObj.type !== 'field') {
      setSelectedObj(null);
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

  const removeFromTeam = (teamName, index) => {
    const list = teamName === 'team1' ? team1 : team2;
    const setList = teamName === 'team1' ? setTeam1 : setTeam2;
    const player = list[index];
    setPlayers([...players, { id: player.id, name: player.name, pos: player.pos }]);
    setList(list.filter((_, i) => i !== index));
    setSelectedObj(null);
  };

  const handleDownload = () => {
    if (fieldRef.current) {
      const prevSelect = selectedObj;
      setSelectedObj(null);
      setTimeout(() => {
        html2canvas(fieldRef.current, { useCORS: true, backgroundColor: null }).then(canvas => {
          const link = document.createElement('a');
          link.download = `su-kadro-${Date.now()}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          setSelectedObj(prevSelect);
        });
      }, 50);
    }
  };
  
  const copyRosters = () => {
    const formatP = p => `${p.name} (${p.pos.join('/')})`;
    const text = `${t.team1}:\n${team1.map(formatP).join('\n')}\n\n${t.team2}:\n${team2.map(formatP).join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopyMessage(t.copySuccess);
      setTimeout(() => setCopyMessage(''), 2000);
    });
  };

  // --- YENİ: Maç Kaydetme ve Geçmiş ---
  const saveMatch = () => {
    if (team1.length === 0 && team2.length === 0) return;
    
    const newMatch = {
      id: Date.now(),
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour:'2-digit', minute:'2-digit' }),
      t1: [...team1],
      t2: [...team2],
      s1: '', 
      s2: ''
    };
    
    // En başa ekle
    setMatches([newMatch, ...matches]);
  };

  const startEditingScore = (match) => {
    setEditingScoreId(match.id);
    setTempScore({ s1: match.s1, s2: match.s2 });
  };

  const saveScore = (id) => {
    setMatches(matches.map(m => m.id === id ? { ...m, s1: tempScore.s1, s2: tempScore.s2 } : m));
    setEditingScoreId(null);
  };

  const deleteMatch = (id) => {
    if(confirm('Bu maçı silmek istediğine emin misin?')) {
      setMatches(matches.filter(m => m.id !== id));
    }
  };

  // --- Küçük Bileşenler ---
  const PosBadge = ({ posId }) => {
    const p = POSITIONS.find(x => x.id === posId) || POSITIONS[2];
    return (
      <span className={`${p.color} text-[9px] font-bold text-white px-1 py-0.5 rounded shadow-sm tracking-wide mr-1`}>
        {p.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Header */}
      <div className="w-full bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐢</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
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
        
        {/* SOL PANEL: Oyuncu Havuzu */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-xl p-4 shadow-xl flex flex-col h-[500px] lg:h-auto lg:sticky lg:top-24">
            
            {/* Başlık */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
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
            <div className="flex-shrink-0 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 mb-4">
              <input 
                type="text" 
                value={newPlayerName}
                onChange={e => setNewPlayerName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addPlayer()}
                placeholder={t.addPlayerPlaceholder}
                className="bg-transparent border-b border-slate-600 focus:border-indigo-500 outline-none text-sm py-1 placeholder-slate-500 w-full mb-3"
              />
              <div className="flex gap-1 mb-2">
                {POSITIONS.map(p => {
                  const isActive = newPlayerPos.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleNewPlayerPos(p.id)}
                      className={`flex-1 text-[10px] py-1 rounded border transition-colors
                        ${isActive 
                          ? `${p.color} border-transparent text-white shadow` 
                          : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                      {p.label}
                    </button>
                  )
                })}
              </div>
              <button 
                onClick={addPlayer}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-1.5 rounded transition shadow-lg shadow-indigo-500/20"
              >
                EKLE
              </button>
            </div>

            {/* FİLTRE MENU */}
            <div className="flex-shrink-0 flex gap-1 mb-2 overflow-x-auto pb-1 custom-scrollbar">
              <button 
                onClick={() => setFilterPos('ALL')}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border transition
                  ${filterPos === 'ALL' 
                    ? 'bg-white text-slate-900 border-white font-bold' 
                    : 'bg-transparent text-slate-400 border-slate-600 hover:border-slate-400'}`}
              >
                {t.filterAll}
              </button>
              {POSITIONS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setFilterPos(p.id)}
                  className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border transition
                    ${filterPos === p.id 
                      ? `${p.color} border-transparent text-white font-bold` 
                      : 'bg-transparent text-slate-400 border-slate-600 hover:border-slate-400'}`}
                >
                  {p.tr}
                </button>
              ))}
            </div>

            {/* Oyuncu Listesi */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 min-h-0">
              {getFilteredPlayers().map(player => {
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
                    <div className="flex flex-col">
                      <span className={`text-sm ${isSelected ? 'text-white font-semibold' : 'text-slate-300'}`}>
                        {player.name}
                      </span>
                      <div className="flex mt-1">
                        {player.pos.map(pid => <PosBadge key={pid} posId={pid} />)}
                      </div>
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
            </div>
          </div>
        </div>

        {/* ORTA PANEL: Saha ve Geçmiş */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Takım Seçiciler (Üst) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team 1 */}
            <div 
              onClick={() => addToTeam('team1')}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 cursor-pointer group
                ${selectedObj?.type === 'pool' 
                  ? 'border-indigo-500/50 bg-indigo-900/10 hover:bg-indigo-900/20' 
                  : 'border-slate-700 bg-slate-800/40'
                }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-red-400 flex items-center gap-2"><Icons.Shield size={16} /> {t.team1}</h3>
                <span className="text-xs bg-slate-900 px-2 py-0.5 rounded text-slate-400">{team1.length}/7</span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {team1.map((p, idx) => (
                   <div key={idx} className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs px-2 py-1 rounded flex items-center gap-2">
                     <span>{p.name}</span>
                     <button onClick={(e)=>{e.stopPropagation(); removeFromTeam('team1', idx)}} className="hover:text-white">×</button>
                   </div>
                ))}
              </div>
            </div>

            {/* Team 2 */}
            <div 
              onClick={() => addToTeam('team2')}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 cursor-pointer group
                ${selectedObj?.type === 'pool' 
                  ? 'border-indigo-500/50 bg-indigo-900/10 hover:bg-indigo-900/20' 
                  : 'border-slate-700 bg-slate-800/40'
                }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-cyan-400 flex items-center gap-2"><Icons.Shield size={16} /> {t.team2}</h3>
                <span className="text-xs bg-slate-900 px-2 py-0.5 rounded text-slate-400">{team2.length}/7</span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {team2.map((p, idx) => (
                   <div key={idx} className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs px-2 py-1 rounded flex items-center gap-2">
                     <span>{p.name}</span>
                     <button onClick={(e)=>{e.stopPropagation(); removeFromTeam('team2', idx)}} className="hover:text-white">×</button>
                   </div>
                ))}
              </div>
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
              <div className="absolute top-1/2 left-4 w-12 h-32 border-2 border-l-0 border-white/30 transform -translate-y-1/2 pointer-events-none"></div>
              <div className="absolute top-1/2 right-4 w-12 h-32 border-2 border-r-0 border-white/30 transform -translate-y-1/2 pointer-events-none"></div>

              {/* OYUNCULAR SAHADA */}
              {[...team1, ...team2].map((player, idx) => {
                 // Takımı belirle: team1 listesinde var mı?
                 // Not: Aynı isimli oyuncu nadir senaryo ama bu basit kontrol iş görür.
                 // Daha sağlamı: player objesine teamID eklemek.
                 const isTeam1 = team1.some(p => p.id === player.id); 
                 const isSel = selectedObj?.type === 'field' && selectedObj.player.id === player.id;
                 const mainPos = player.pos[0] || 'MID';
                 const posColor = POSITIONS.find(p => p.id === mainPos)?.color || 'bg-gray-500';
                 
                 return (
                   <div 
                    key={`${player.id}-${idx}`}
                    onClick={(e) => { e.stopPropagation(); handleSelectFromField(isTeam1 ? 'team1':'team2', isTeam1 ? team1.indexOf(player) : team2.indexOf(player), player); }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 flex flex-col items-center group z-10 hover:z-20`}
                    style={{ left: `${player.x}%`, top: `${player.y}%` }}
                   >
                     <div className={`w-8 h-8 rounded-full shadow-lg border-2 flex items-center justify-center text-[10px] font-bold text-white relative
                        ${isSel ? 'border-yellow-400 scale-125 ring-4 ring-yellow-400/30' : 'border-white group-hover:scale-110'}
                        ${posColor}
                     `}>
                       {mainPos}
                       <div className={`absolute inset-0 rounded-full border-2 opacity-50 ${isTeam1 ? 'border-red-500' : 'border-cyan-500'}`}></div>
                     </div>
                     <span className="mt-1 text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded shadow backdrop-blur-sm whitespace-nowrap">
                       {player.name}
                     </span>
                   </div>
                 );
              })}
            </div>

            {/* Alt Butonlar */}
            <div className="bg-slate-900/80 p-3 flex flex-wrap gap-2 justify-between items-center text-xs text-slate-400">
              <span className="hidden md:inline">{t.moveHint}</span>
              <div className="flex gap-2">
                 <button onClick={saveMatch} className="flex items-center gap-2 hover:text-white bg-indigo-600/20 hover:bg-indigo-600 px-3 py-1.5 rounded transition border border-indigo-500/30">
                   <Icons.Save size={14} /> {t.saveMatch}
                 </button>
                 <button onClick={handleDownload} className="flex items-center gap-2 hover:text-white bg-slate-700/50 hover:bg-slate-600 px-3 py-1.5 rounded transition">
                   <Icons.Download size={14} /> {t.downloadPNG}
                 </button>
                 <button onClick={copyRosters} className="flex items-center gap-2 hover:text-white bg-slate-700/50 hover:bg-slate-600 px-3 py-1.5 rounded transition">
                   <Icons.Copy size={14} /> {t.copyRosters}
                   {copyMessage && <span className="text-emerald-400 font-bold ml-1">{copyMessage}</span>}
                 </button>
              </div>
            </div>
          </div>

          {/* --- GEÇMİŞ MAÇLAR --- */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-300 border-b border-slate-700 pb-2">
              <Icons.History /> {t.matchHistory}
            </h2>

            {matches.length === 0 ? (
              <div className="text-center py-10 text-slate-500 border border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                {t.noMatches}
              </div>
            ) : (
              <div className="grid gap-4">
                {matches.map(match => (
                  <div key={match.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:border-slate-500 transition-all relative group">
                    {/* Silme Butonu */}
                    <button onClick={() => deleteMatch(match.id)} className="absolute top-2 right-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition">
                      <Icons.Trash size={16} />
                    </button>
                    
                    {/* Üst Bilgi */}
                    <div className="bg-slate-900/50 px-4 py-2 flex justify-between items-center text-xs text-slate-400">
                       <span>{match.date}</span>
                       <span className="font-mono text-[10px] opacity-50">ID: {match.id.toString().slice(-4)}</span>
                    </div>

                    <div className="p-4 grid grid-cols-12 gap-2 items-center">
                      
                      {/* Takım 1 */}
                      <div className="col-span-5 text-right">
                        <h4 className="font-bold text-red-400 mb-1">{t.team1}</h4>
                        <div className="flex flex-wrap justify-end gap-1">
                          {match.t1.map((p, i) => (
                            <span key={i} className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">{p.name}</span>
                          ))}
                        </div>
                      </div>

                      {/* SKOR ALANI */}
                      <div className="col-span-2 flex flex-col items-center justify-center">
                        {editingScoreId === match.id ? (
                           <div className="flex items-center gap-1 bg-slate-900 p-1 rounded border border-indigo-500">
                             <input 
                               type="text" 
                               value={tempScore.s1} 
                               onChange={e=>setTempScore({...tempScore, s1: e.target.value})}
                               className="w-6 text-center bg-transparent text-white font-bold outline-none border-b border-slate-600 focus:border-red-400"
                             />
                             <span className="text-slate-500">:</span>
                             <input 
                               type="text" 
                               value={tempScore.s2} 
                               onChange={e=>setTempScore({...tempScore, s2: e.target.value})}
                               className="w-6 text-center bg-transparent text-white font-bold outline-none border-b border-slate-600 focus:border-cyan-400"
                             />
                             <button onClick={() => saveScore(match.id)} className="text-green-400 hover:text-green-300 ml-1">✓</button>
                           </div>
                        ) : (
                          <div 
                            onClick={() => startEditingScore(match)}
                            className="cursor-pointer group/score flex flex-col items-center p-2 rounded hover:bg-slate-700/50 transition"
                          >
                            <div className="text-2xl font-black text-white tracking-widest">
                              {match.s1 !== '' ? match.s1 : '-'} : {match.s2 !== '' ? match.s2 : '-'}
                            </div>
                            <div className="text-[9px] text-indigo-400 opacity-0 group-hover/score:opacity-100 flex items-center gap-1">
                              <Icons.Edit size={10} /> {t.enterScore}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Takım 2 */}
                      <div className="col-span-5 text-left">
                        <h4 className="font-bold text-cyan-400 mb-1">{t.team2}</h4>
                        <div className="flex flex-wrap justify-start gap-1">
                          {match.t2.map((p, i) => (
                            <span key={i} className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">{p.name}</span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

const rootEl = document.getElementById('root');
ReactDOM.createRoot(rootEl).render(React.createElement(HalisahaKadro));
