const { useState, useEffect, useRef, useMemo } = React;

// --- Dil ve Sabitler ---
const translations = {
  tr: {
    title: '🐢 SU Kadro',
    tabField: 'Saha & Maçlar',
    tabLeaderboard: 'Liderlik Tablosu',
    fieldTitle: 'Taktik Tahtası',
    players: 'Oyuncu Havuzu',
    deleteAll: 'Sıfırla',
    addPlayerPlaceholder: 'Oyuncu adı...',
    team1: 'Takım 1 (Ev)',
    team2: 'Takım 2 (Dep)',
    moveHint: '💡 Yer değiştirmek için oyuncuya tıkla.',
    downloadPNG: 'İndir',
    copyRosters: 'Kopyala',
    copySuccess: 'Kopyalandı!',
    filterAll: 'Tümü',
    saveMatch: 'Maçı Kaydet',
    matchHistory: 'Geçmiş Karşılaşmalar',
    restoreMatch: 'Sahaya Diz (Rövanş)',
    restoreConfirm: 'Mevcut saha temizlenip bu kadro yüklenecek. Devam edilsin mi?',
    enterScore: 'Skor',
    noMatches: 'Henüz kayıtlı maç yok.',
    saveScore: 'Kaydet',
    stats: {
      rank: 'Sıra',
      player: 'Oyuncu',
      played: 'Maç',
      win: 'G',
      loss: 'M',
      winRate: 'Kaz.%'
    },
    positions: {
      GK: 'Kaleci',
      DEF: 'Defans',
      MID: 'Ortasaha',
      FWD: 'Forvet'
    }
  },
  en: {
    title: '🐢 SU Team',
    tabField: 'Field & Matches',
    tabLeaderboard: 'Leaderboard',
    fieldTitle: 'Tactical Board',
    players: 'Player Pool',
    deleteAll: 'Reset',
    addPlayerPlaceholder: 'Player name...',
    team1: 'Team 1 (Home)',
    team2: 'Team 2 (Away)',
    moveHint: '💡 Click player to move.',
    downloadPNG: 'Download',
    copyRosters: 'Copy',
    copySuccess: 'Copied!',
    filterAll: 'All',
    saveMatch: 'Save Match',
    matchHistory: 'Match History',
    restoreMatch: 'Load Squad',
    restoreConfirm: 'Current field will be cleared. Continue?',
    enterScore: 'Score',
    noMatches: 'No matches saved yet.',
    saveScore: 'Save',
    stats: {
      rank: '#',
      player: 'Player',
      played: 'P',
      win: 'W',
      loss: 'L',
      winRate: 'Win%'
    },
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
  Refresh: ({size=16}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>,
  Trophy: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  Layout: ({size=20}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
};

// --- Yardımcı Fonksiyonlar ---
const getAutoPosition = (team, posArray) => {
  const isTeam1 = team === 'team1';
  const primaryPos = Array.isArray(posArray) && posArray.length > 0 ? posArray[0] : 'MID';

  let x = 50, y = 50;
  const jitter = () => (Math.random() - 0.5) * 8; 

  if (primaryPos === 'GK') {
    x = isTeam1 ? 8 : 92;
    y = 50;
  } else if (primaryPos === 'DEF') {
    x = isTeam1 ? 25 : 75;
    y = 30 + Math.random() * 40;
  } else if (primaryPos === 'MID') {
    x = isTeam1 ? 48 : 52;
    y = 25 + Math.random() * 50;
  } else if (primaryPos === 'FWD') {
    x = isTeam1 ? 65 : 35;
    y = 50 + jitter();
  }
  
  return { x, y };
};

// --- Ana Bileşen ---
function HalisahaKadro() {
  const [language, setLanguage] = useState('tr');
  const [activeTab, setActiveTab] = useState('field'); // 'field' | 'leaderboard'
  const t = translations[language];

  // Başlangıç verileri
  // Başlangıç verileri - Ekran görüntülerinden alınan tam kadro
  const [players, setPlayers] = useState([
    { id: 1, name: 'Mert', pos: ['MID', 'FWD'] },       // Sen (Kaptan)
    { id: 2, name: 'Barkın', pos: ['DEF'] },            //
    { id: 3, name: 'Yakup', pos: ['MID'] },             //
    { id: 4, name: 'Baha', pos: ['FWD'] },              //
    { id: 5, name: 'Arınç', pos: ['DEF', 'MID'] },      //
    { id: 6, name: 'Gökberk', pos: ['MID'] },           //
    { id: 7, name: 'Alp Orkun', pos: ['FWD'] },         //
    { id: 8, name: 'Onat', pos: ['DEF'] },              //
    { id: 9, name: 'Mami', pos: ['MID', 'FWD'] },       //
    { id: 10, name: 'Mehmet Ali', pos: ['DEF'] },       //
    { id: 11, name: 'İbrahim', pos: ['MID'] },          //
    { id: 12, name: 'Kerem Z.', pos: ['FWD'] },         // (Kerem Zeybek)
    { id: 13, name: 'Oktay', pos: ['GK'] },             //
    { id: 14, name: 'Mirhat', pos: ['DEF'] },           //
    { id: 15, name: 'Kıvanç', pos: ['MID'] },           //
    { id: 16, name: 'Emir', pos: ['FWD'] },             //
    { id: 17, name: 'Kerem S.', pos: ['DEF', 'MID'] },  // (Kerem Sabancı)
    { id: 18, name: 'Taha', pos: ['GK', 'DEF'] },       //
    { id: 19, name: 'Orhun', pos: ['DEF'] },            //
    { id: 20, name: 'Yasin', pos: ['MID'] },            //
    { id: 21, name: 'Yusuf', pos: ['FWD'] },            // (Yuusf düzeltildi)
    { id: 22, name: 'Hamid Emin', pos: ['MID'] }        //
  ]);
  
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPos, setNewPlayerPos] = useState(['MID']);
  const [filterPos, setFilterPos] = useState('ALL');

  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('su_matches');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [editingScoreId, setEditingScoreId] = useState(null);
  const [tempScore, setTempScore] = useState({ s1: '', s2: '' });
  const [selectedObj, setSelectedObj] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');
  const fieldRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('su_matches', JSON.stringify(matches));
  }, [matches]);

  // --- İstatistik Hesaplama (Leaderboard) ---
  const leaderboardData = useMemo(() => {
    const stats = {};

    matches.forEach(match => {
      // Sadece skoru girilmiş maçları hesapla
      if(match.s1 === '' || match.s2 === '') return;
      const s1 = parseInt(match.s1);
      const s2 = parseInt(match.s2);
      if(isNaN(s1) || isNaN(s2)) return;

      const processPlayer = (p, isWin, isDraw) => {
        if (!stats[p.name]) stats[p.name] = { name: p.name, played: 0, win: 0, loss: 0 };
        stats[p.name].played += 1;
        if (isWin) stats[p.name].win += 1;
        else if (!isDraw) stats[p.name].loss += 1;
      };

      const isDraw = s1 === s2;
      match.t1.forEach(p => processPlayer(p, s1 > s2, isDraw));
      match.t2.forEach(p => processPlayer(p, s2 > s1, isDraw));
    });

    return Object.values(stats)
      .sort((a, b) => b.win - a.win || b.played - a.played) // Önce galibiyet, sonra maç sayısı
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [matches]);

  // --- Fonksiyonlar ---
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

  const saveMatch = () => {
    if (team1.length === 0 && team2.length === 0) return;
    const newMatch = {
      id: Date.now(),
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric', hour:'2-digit', minute:'2-digit' }),
      t1: [...team1],
      t2: [...team2],
      s1: '', 
      s2: ''
    };
    setMatches([newMatch, ...matches]);
    setActiveTab('leaderboard'); // Maç bitince skora/tabloya yönlendir
  };

  // --- MAÇI GERİ YÜKLEME ---
  const restoreMatch = (match) => {
    if(team1.length > 0 || team2.length > 0) {
      if(!confirm(t.restoreConfirm)) return;
    }
    
    // 1. Sahaya diz
    setTeam1([...match.t1]);
    setTeam2([...match.t2]);

    // 2. Havuzu güncelle: Sahada olmayan herkes havuza
    // Mevcut havuz + şu an sahada olanlar (eski) -> Hepsi potansiyel havuz
    // Ancak basitlik için: Bu maçtaki oyuncuların ID'lerini al, havuzdan çıkar.
    // Daha güvenli yöntem: Tüm bilinen oyunculardan sahadakileri çıkar.
    
    const playersOnFieldIds = new Set([...match.t1, ...match.t2].map(p => p.id));
    
    // Geçici çözüm: Mevcut havuzdan bu ID'leri çıkar. 
    // Not: Eğer havuzda olmayan bir oyuncu maç geçmişindeyse, havuza eklenmez (basit mantık).
    setPlayers(prevPlayers => {
       // Önce sahadakileri havuza geri atıyormuş gibi düşünelim (reset)
       // Sonra restore edilenleri çıkaralım.
       // Bu örnekte basitçe: Mevcut havuzdan çakışanları siliyoruz.
       return prevPlayers.filter(p => !playersOnFieldIds.has(p.id));
    });
    
    setActiveTab('field'); // Sahaya git
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if(confirm('Sil? / Delete?')) {
      setMatches(matches.filter(m => m.id !== id));
    }
  };

  const PosBadge = ({ posId }) => {
    const p = POSITIONS.find(x => x.id === posId) || POSITIONS[2];
    return (
      <span className={`${p.color} text-[8px] md:text-[9px] font-bold text-white px-1 py-0.5 rounded shadow-sm tracking-wide mr-1`}>
        {p.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Header & Tabs */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Bar */}
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">🐢</span>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                {t.title}
              </h1>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs font-medium ${language==='tr'?'bg-indigo-600 text-white':'text-slate-400'}`}>TR</button>
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs font-medium ${language==='en'?'bg-indigo-600 text-white':'text-slate-400'}`}>EN</button>
            </div>
          </div>
          
          {/* Tab Menu */}
          <div className="flex gap-6 text-sm font-medium">
             <button 
               onClick={() => setActiveTab('field')}
               className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'field' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
             >
               <Icons.Layout size={16} /> {t.tabField}
             </button>
             <button 
               onClick={() => setActiveTab('leaderboard')}
               className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'leaderboard' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
             >
               <Icons.Trophy size={16} /> {t.tabLeaderboard}
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-2 md:p-4 mt-2 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
        
        {/* --- TAB 1: SAHA VE OYUNCULAR --- */}
        {activeTab === 'field' && (
          <>
            {/* SOL PANEL: Oyuncu Havuzu */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-xl p-3 md:p-4 shadow-xl flex flex-col max-h-[400px] lg:h-auto lg:max-h-[calc(100vh-120px)] lg:sticky lg:top-32">
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                  <h2 className="font-bold text-white flex items-center gap-2 text-sm md:text-base">
                    <Icons.UserPlus size={18} /> {t.players} <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">{players.length}</span>
                  </h2>
                  {players.length > 0 && (
                    <button onClick={() => setPlayers([])} className="text-rose-400 hover:text-rose-300 text-[10px] md:text-xs font-medium uppercase tracking-wide">
                      {t.deleteAll}
                    </button>
                  )}
                </div>

                <div className="flex-shrink-0 bg-slate-900/50 p-2 md:p-3 rounded-lg border border-slate-700/50 mb-3">
                  <input 
                    type="text" 
                    value={newPlayerName}
                    onChange={e => setNewPlayerName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPlayer()}
                    placeholder={t.addPlayerPlaceholder}
                    className="bg-transparent border-b border-slate-600 focus:border-indigo-500 outline-none text-base py-1 placeholder-slate-500 w-full mb-2 text-white"
                  />
                  <div className="flex gap-1 mb-2">
                    {POSITIONS.map(p => {
                      const isActive = newPlayerPos.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => toggleNewPlayerPos(p.id)}
                          className={`flex-1 text-[10px] py-1.5 rounded border transition-colors
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
                  <button onClick={addPlayer} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded transition shadow-lg active:scale-95">
                    EKLE
                  </button>
                </div>

                <div className="flex-shrink-0 flex gap-1 mb-2 overflow-x-auto pb-1 custom-scrollbar">
                  <button onClick={() => setFilterPos('ALL')} className={`px-3 py-1 rounded-full text-[10px] md:text-xs whitespace-nowrap border transition ${filterPos === 'ALL' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 border-slate-600'}`}>{t.filterAll}</button>
                  {POSITIONS.map(p => (
                    <button key={p.id} onClick={() => setFilterPos(p.id)} className={`px-3 py-1 rounded-full text-[10px] md:text-xs whitespace-nowrap border transition ${filterPos === p.id ? `${p.color} border-transparent text-white font-bold` : 'text-slate-400 border-slate-600'}`}>{p.tr}</button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 min-h-[150px]">
                  {getFilteredPlayers().map(player => {
                    const isSelected = selectedObj?.type === 'pool' && selectedObj.player.id === player.id;
                    return (
                      <div 
                        key={player.id}
                        onClick={() => handleSelectFromPool(player)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-all duration-200 active:scale-[0.98] ${isSelected ? 'bg-indigo-600/20 border-indigo-500 shadow-md' : 'bg-slate-700/30 border-transparent hover:bg-slate-700/50'}`}
                      >
                        <div className="flex flex-col">
                          <span className={`text-sm ${isSelected ? 'text-white font-semibold' : 'text-slate-300'}`}>{player.name}</span>
                          <div className="flex mt-1">{player.pos.map(pid => <PosBadge key={pid} posId={pid} />)}</div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setPlayers(players.filter(p => p.id !== player.id)); }} className="text-slate-500 hover:text-rose-400 p-2"><Icons.Trash size={16} /></button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ORTA PANEL: Saha */}
            <div className="lg:col-span-9 space-y-4 md:space-y-6">
              {/* Takımlar */}
              <div className="grid grid-cols-2 gap-3 md:gap-6">
                {['team1', 'team2'].map((tm) => {
                  const list = tm === 'team1' ? team1 : team2;
                  const label = tm === 'team1' ? t.team1 : t.team2;
                  const colorClass = tm === 'team1' ? 'text-red-400' : 'text-cyan-400';
                  const bgBadge = tm === 'team1' ? 'bg-red-500/10' : 'bg-cyan-500/10';
                  return (
                    <div 
                      key={tm}
                      onClick={() => addToTeam(tm)}
                      className={`relative rounded-xl border p-2 md:p-4 transition-all cursor-pointer active:bg-slate-700/60 ${selectedObj?.type === 'pool' ? 'border-indigo-500/50 bg-indigo-900/10 animate-pulse' : 'border-slate-700 bg-slate-800/40'}`}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                        <h3 className={`font-bold ${colorClass} text-xs md:text-sm flex items-center gap-1`}><Icons.Shield size={14} /> <span className="truncate">{label}</span></h3>
                        <span className="text-[10px] md:text-xs bg-slate-900 px-2 py-0.5 rounded text-slate-400 w-fit mt-1 md:mt-0">{list.length}/7</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                        {list.map((p, idx) => (
                          <div key={idx} className={`${bgBadge} border border-white/10 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 text-slate-200`}>
                            <span className="truncate max-w-[60px] md:max-w-none">{p.name}</span>
                            <button onClick={(e)=>{e.stopPropagation(); removeFromTeam(tm, idx)}} className="hover:text-white font-bold">×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* SAHA */}
              <div className="relative bg-slate-800 rounded-xl p-1 shadow-2xl border border-slate-700 overflow-hidden">
                <div 
                  ref={fieldRef}
                  onClick={handleFieldClick}
                  className={`relative w-full aspect-[1.6/1] md:aspect-[2.2/1] bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-lg overflow-hidden border border-white/10 shadow-inner select-none touch-none ${selectedObj?.type === 'field' ? 'cursor-crosshair ring-2 ring-yellow-400/50' : ''}`}
                >
                  <h3 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-white/10 font-bold text-3xl md:text-5xl uppercase tracking-widest pointer-events-none z-0">CHATV</h3>
                  {/* Çizgiler */}
                  <div className="absolute inset-3 md:inset-5 border-2 border-white/30 rounded-sm pointer-events-none"></div>
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30 transform -translate-x-1/2 pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/2 w-16 h-16 md:w-24 md:h-24 border-2 border-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                  
                  {[...team1, ...team2].map((player, idx) => {
                    const isTeam1 = team1.some(p => p.id === player.id); 
                    const isSel = selectedObj?.type === 'field' && selectedObj.player.id === player.id;
                    const mainPos = player.pos[0] || 'MID';
                    const posColor = POSITIONS.find(p => p.id === mainPos)?.color || 'bg-gray-500';
                    return (
                      <div 
                        key={`${player.id}-${idx}`}
                        onClick={(e) => { e.stopPropagation(); handleSelectFromField(isTeam1 ? 'team1':'team2', isTeam1 ? team1.indexOf(player) : team2.indexOf(player), player); }}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 flex flex-col items-center z-10`}
                        style={{ left: `${player.x}%`, top: `${player.y}%`, touchAction: 'none' }}
                      >
                        <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full shadow-lg border-2 flex items-center justify-center text-[9px] md:text-[10px] font-bold text-white relative transition-transform ${isSel ? 'border-yellow-400 scale-125 z-50' : 'border-white'} ${posColor}`}>
                          {mainPos}
                          <div className={`absolute inset-0 rounded-full border-2 opacity-50 ${isTeam1 ? 'border-red-500' : 'border-cyan-500'}`}></div>
                        </div>
                        <span className="mt-1 text-[8px] md:text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded shadow backdrop-blur-sm whitespace-nowrap pointer-events-none">{player.name}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-900/80 p-2 md:p-3 flex flex-col md:flex-row gap-2 md:justify-between items-center text-xs text-slate-400">
                  <span className="hidden md:inline">{t.moveHint}</span>
                  <div className="flex w-full md:w-auto gap-2">
                    <button onClick={saveMatch} className="flex-1 md:flex-none justify-center flex items-center gap-1 hover:text-white bg-indigo-600/20 hover:bg-indigo-600 px-3 py-2 rounded transition border border-indigo-500/30 active:scale-95"><Icons.Save size={14} /> {t.saveMatch}</button>
                    <button onClick={handleDownload} className="flex-1 md:flex-none justify-center flex items-center gap-1 hover:text-white bg-slate-700/50 hover:bg-slate-600 px-3 py-2 rounded transition active:scale-95"><Icons.Download size={14} /> {t.downloadPNG}</button>
                    <button onClick={copyRosters} className="flex-1 md:flex-none justify-center flex items-center gap-1 hover:text-white bg-slate-700/50 hover:bg-slate-600 px-3 py-2 rounded transition active:scale-95"><Icons.Copy size={14} /> {t.copyRosters} {copyMessage && <span className="text-emerald-400 font-bold ml-1">✓</span>}</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- TAB 2: LİDERLİK & GEÇMİŞ --- */}
        {activeTab === 'leaderboard' && (
          <div className="col-span-1 lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Liderlik Tablosu */}
            <div className="space-y-4">
               <h2 className="text-xl font-bold text-indigo-300 flex items-center gap-2"><Icons.Trophy /> {t.tabLeaderboard}</h2>
               <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-slate-300">
                     <thead className="bg-slate-900/50 text-xs uppercase text-slate-400">
                       <tr>
                         <th className="px-4 py-3">{t.stats.rank}</th>
                         <th className="px-4 py-3">{t.stats.player}</th>
                         <th className="px-4 py-3 text-center">{t.stats.played}</th>
                         <th className="px-4 py-3 text-center text-green-400">{t.stats.win}</th>
                         <th className="px-4 py-3 text-center text-red-400">{t.stats.loss}</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-700">
                       {leaderboardData.map((stat, idx) => (
                         <tr key={stat.name} className="hover:bg-slate-700/30 transition">
                           <td className="px-4 py-3 font-medium flex items-center gap-2">
                             {idx === 0 && <span className="text-yellow-400">🥇</span>}
                             {idx === 1 && <span className="text-slate-300">🥈</span>}
                             {idx === 2 && <span className="text-amber-600">🥉</span>}
                             {idx > 2 && <span className="text-slate-500">#{idx + 1}</span>}
                           </td>
                           <td className="px-4 py-3 font-bold text-white">{stat.name}</td>
                           <td className="px-4 py-3 text-center">{stat.played}</td>
                           <td className="px-4 py-3 text-center font-bold text-green-400">{stat.win}</td>
                           <td className="px-4 py-3 text-center text-red-400 opacity-80">{stat.loss}</td>
                         </tr>
                       ))}
                       {leaderboardData.length === 0 && (
                         <tr><td colSpan="5" className="text-center py-8 text-slate-500 italic">{t.noMatches}</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
            </div>

            {/* Geçmiş Maçlar (Buraya Taşındı) */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-300">
                <Icons.History /> {t.matchHistory}
              </h2>
              {matches.length === 0 ? (
                <div className="text-center py-6 text-slate-500 border border-dashed border-slate-700 rounded-xl bg-slate-800/30 text-sm">{t.noMatches}</div>
              ) : (
                <div className="grid gap-3">
                  {matches.map(match => (
                    <div key={match.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg relative group">
                      <div className="absolute top-2 right-2 flex gap-2">
                        {/* Restore Button */}
                        <button onClick={() => restoreMatch(match)} className="text-slate-500 hover:text-emerald-400 p-1.5 bg-slate-900/50 rounded" title={t.restoreMatch}>
                           <Icons.Refresh size={14} />
                        </button>
                        <button onClick={() => deleteMatch(match.id)} className="text-slate-500 hover:text-rose-400 p-1.5 bg-slate-900/50 rounded">
                           <Icons.Trash size={14} />
                        </button>
                      </div>
                      
                      <div className="bg-slate-900/50 px-3 py-1.5 flex justify-between items-center text-[10px] md:text-xs text-slate-400">
                         <span>{match.date}</span>
                      </div>

                      <div className="p-3 grid grid-cols-12 gap-1 items-center">
                        <div className="col-span-5 text-right">
                          <h4 className="font-bold text-red-400 mb-1 text-xs">{t.team1}</h4>
                          <div className="flex flex-wrap justify-end gap-1">
                            {match.t1.map((p, i) => <span key={i} className="text-[9px] bg-slate-700 px-1 py-0.5 rounded text-slate-300 truncate max-w-[50px]">{p.name}</span>)}
                          </div>
                        </div>

                        <div className="col-span-2 flex flex-col items-center justify-center">
                          {editingScoreId === match.id ? (
                             <div className="flex items-center gap-1 bg-slate-900 p-1 rounded border border-indigo-500">
                               <input type="tel" value={tempScore.s1} onChange={e=>setTempScore({...tempScore, s1: e.target.value})} className="w-5 text-center bg-transparent text-white font-bold outline-none border-b border-slate-600 focus:border-red-400 text-sm"/>
                               <span className="text-slate-500">:</span>
                               <input type="tel" value={tempScore.s2} onChange={e=>setTempScore({...tempScore, s2: e.target.value})} className="w-5 text-center bg-transparent text-white font-bold outline-none border-b border-slate-600 focus:border-cyan-400 text-sm"/>
                               <button onClick={() => saveScore(match.id)} className="text-green-400 text-xs ml-0.5">✓</button>
                             </div>
                          ) : (
                            <div onClick={() => startEditingScore(match)} className="cursor-pointer bg-slate-900/50 px-2 py-1 rounded hover:bg-slate-700 transition text-center min-w-[50px]">
                              <div className="text-sm md:text-xl font-black text-white">{match.s1 || '-'} : {match.s2 || '-'}</div>
                            </div>
                          )}
                        </div>

                        <div className="col-span-5 text-left">
                          <h4 className="font-bold text-cyan-400 mb-1 text-xs">{t.team2}</h4>
                          <div className="flex flex-wrap justify-start gap-1">
                            {match.t2.map((p, i) => <span key={i} className="text-[9px] bg-slate-700 px-1 py-0.5 rounded text-slate-300 truncate max-w-[50px]">{p.name}</span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const rootEl = document.getElementById('root');
ReactDOM.createRoot(rootEl).render(React.createElement(HalisahaKadro));
