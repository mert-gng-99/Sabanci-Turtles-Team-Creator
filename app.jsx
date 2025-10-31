const { useState, useEffect, useRef } = React;


function Users(props) {
  return React.createElement(
    'svg',
    { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', width: props.size||20, height: props.size||20, fill:'none', stroke:'currentColor', 'stroke-width':2, 'stroke-linecap':'round', 'stroke-linejoin':'round' },
    React.createElement('path', { d:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
    React.createElement('circle', { cx:8, cy:7, r:4 }),
    React.createElement('path', { d:'M20 8a2 2 0 1 0-4 0v3' }),
    React.createElement('path', { d:'M22 21v-2a4 4 0 0 0-3-3.87' })
  );
}
function Trash2(props) {
  return React.createElement(
    'svg',
    { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', width: props.size||20, height: props.size||20, fill:'none', stroke:'currentColor', 'stroke-width':2, 'stroke-linecap':'round', 'stroke-linejoin':'round' },
    React.createElement('polyline', { points:'3 6 5 6 21 6' }),
    React.createElement('path', { d:'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' }),
    React.createElement('path', { d:'M10 11v6' }),
    React.createElement('path', { d:'M14 11v6' }),
    React.createElement('path', { d:'M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' })
  );
}



function HalisahaKadro() {
  const [players, setPlayers] = useState([
    'Ahmet', 'Mehmet', 'Ali', 'Veli', 'Can', 'Cem', 'Deniz', 'Emre',
    'Fatih', 'Hakan', 'İbrahim', 'Kerem', 'Murat', 'Oğuz'
  ]);
  const [newPlayer, setNewPlayer] = useState('');
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const fieldRef = useRef(null);

  const addPlayer = () => {
    if (newPlayer.trim()) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  };
  
  const handlePlayerSelect = (name, from, team = null, index = null) => {
    if (selectedPlayer && selectedPlayer.name === name && selectedPlayer.from === from) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer({ name, from, team, index });
    }
  };

  const handleTargetClick = (targetTeam) => {
    if (!selectedPlayer || selectedPlayer.from !== 'players') {
      if (selectedPlayer) setSelectedPlayer(null);
      return;
    }

    const team = targetTeam === 'team1' ? team1 : team2;
    const setTeam = targetTeam === 'team1' ? setTeam1 : setTeam2;

    if (team.length < 7) {
      setPlayers(players.filter(p => p !== selectedPlayer.name));
      setTeam([...team, { name: selectedPlayer.name, x: 50, y: 50 }]);
      setSelectedPlayer(null);
    }
  };
  
  const handleFieldClick = (e) => {
    if (!selectedPlayer || selectedPlayer.from !== 'field') {
      if (selectedPlayer) setSelectedPlayer(null);
      return;
    }

    const rect = fieldRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const newX = (clickX / rect.width) * 100;
    const newY = (clickY / rect.height) * 100;

    movePlayer(selectedPlayer.team, selectedPlayer.index, newX, newY);
    setSelectedPlayer(null);
  };

  const movePlayer = (team, index, newX, newY) => {
    if (team === 'team1') {
      const updated = [...team1];
      updated[index] = {
        ...updated[index],
        x: Math.max(0, Math.min(100, newX)),
        y: Math.max(0, Math.min(100, newY))
      };
      setTeam1(updated);
    } else {
      const updated = [...team2];
      updated[index] = {
        ...updated[index],
        x: Math.max(0, Math.min(100, newX)),
        y: Math.max(0, Math.min(100, newY))
      };
      setTeam2(updated);
    }
  };

  const removeFromTeam = (team, playerName) => {
    if (team === 'team1') {
      setTeam1(team1.filter(p => p.name !== playerName));
      setPlayers([...players, playerName]);
    } else {
      setTeam2(team2.filter(p => p.name !== playerName));
      setPlayers([...players, playerName]);
    }
    setSelectedPlayer(null);
  };

  const clearTeam = (team) => {
    if (team === 'team1') {
      setPlayers([...players, ...team1.map(p => p.name)]);
      setTeam1([]);
    } else {
      setPlayers([...players, ...team2.map(p => p.name)]);
      setTeam2([]);
    }
    setSelectedPlayer(null);
  };

  const FieldPlayer = ({ player, team, index, onSelect, isSelected }) => {
    return (
      <div
        className={`absolute flex flex-col items-center select-none ${isSelected ? 'z-50' : 'z-10'} cursor-pointer`}
        style={{ 
          left: `${player.x}%`, 
          top: `${player.y}%`,
          transform: 'translate(-50%, -50%)',
          userSelect: 'none'
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(player.name, 'field', team, index);
        }}
      >
        <div 
          className={`w-10 h-10 rounded-full shadow-lg transition-all ${
            team === 'team1' ? 'bg-red-600' : 'bg-blue-600'
          } ${
            isSelected 
              ? 'ring-4 ring-yellow-400 scale-110'
              : 'border-4 border-white scale-100'
          }`}
        />
        <span className="text-white font-bold text-xs mt-1 bg-black bg-opacity-70 px-2 py-0.5 rounded whitespace-nowrap shadow-md">
          {player.name}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🐢 SU Kadro Kurma
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users size={24} />
                  Oyuncular
                </h2>
                <button
                  onClick={() => {
                    setPlayers([]);
                    setSelectedPlayer(null);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  title="Tüm oyuncuları sil"
                >
                  <Trash2 size={18} />
                  <span className="text-sm font-semibold">Hepsini Sil</span>
                </button>
              </div>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPlayer}
                  onChange={(e) => setNewPlayer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="Oyuncu adı"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={addPlayer}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold"
                >
                  +
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {players.map((player, idx) => {
                  const isSelected = selectedPlayer && selectedPlayer.from === 'players' && selectedPlayer.name === player;
                  return (
                    <div
                      key={idx}
                      onClick={() => handlePlayerSelect(player, 'players')}
                      className={`text-white px-4 py-2 rounded cursor-pointer transition flex justify-between items-center ${
                        isSelected 
                          ? 'bg-green-600 font-bold'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <span>{player}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayers(players.filter((p) => p !== player));
                        }}
                        className="text-red-400 hover:text-red-300 ml-2 text-xl"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => handleTargetClick('team1')}
                className="bg-red-900 bg-opacity-30 border-2 border-red-600 rounded-lg p-4 cursor-pointer"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-red-400">Takım 1 ({team1.length}/7)</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearTeam('team1');
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {team1.map((player, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-red-800 bg-opacity-40 px-3 py-2 rounded">
                      <span className="text-white">{player.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromTeam('team1', player.name);
                        }}
                        className="text-red-300 hover:text-red-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {team1.length === 0 && (
                    <p className="text-red-300 text-center py-4">
                      Oyuncu seçip buraya tıklayın
                    </p>
                  )}
                </div>
              </div>

              <div
                onClick={() => handleTargetClick('team2')}
                className="bg-blue-900 bg-opacity-30 border-2 border-blue-600 rounded-lg p-4 cursor-pointer"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-blue-400">Takım 2 ({team2.length}/7)</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearTeam('team2');
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {team2.map((player, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-blue-800 bg-opacity-40 px-3 py-2 rounded">
                      <span className="text-white">{player.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromTeam('team2', player.name);
                        }}
                        className="text-blue-300 hover:text-blue-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {team2.length === 0 && (
                    <p className="text-blue-300 text-center py-4">
                      Oyuncu seçip buraya tıklayın
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Halı Saha</h3>
              <div 
                ref={fieldRef}
                onClick={handleFieldClick}
                className={`relative w-full aspect-[3/2] bg-gradient-to-b from-green-600 to-green-700 rounded-lg overflow-hidden border-4 border-white ${
                  selectedPlayer && selectedPlayer.from === 'field' ? 'cursor-crosshair' : ''
                }`}
                style={{ touchAction: 'none' }}
              >
                <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white opacity-60"></div>
                
                <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white opacity-60 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white opacity-60 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

                <div className="absolute top-1/2 left-0 w-16 h-32 border-2 border-t-white border-r-white border-b-white transform -translate-y-1/2 opacity-60"></div>
                <div className="absolute top-1/2 left-0 w-8 h-20 border-2 border-t-white border-r-white border-b-white transform -translate-y-1/2 opacity-60"></div>

                <div className="absolute top-1/2 right-0 w-16 h-32 border-2 border-t-white border-l-white border-b-white transform -translate-y-1/2 opacity-60"></div>
                <div className="absolute top-1/2 right-0 w-8 h-20 border-2 border-t-white border-l-white border-b-white transform -translate-y-1/2 opacity-60"></div>

                {team1.map((player, idx) => (
                  <FieldPlayer
                    key={`team1-${idx}`}
                    player={player}
                    team="team1"
                    index={idx}
                    onSelect={handlePlayerSelect}
                    isSelected={selectedPlayer && selectedPlayer.from === 'field' && selectedPlayer.index === idx && selectedPlayer.team === 'team1'}
                  />
                ))}

                {team2.map((player, idx) => (
                  <FieldPlayer
                    key={`team2-${idx}`}
                    player={player}
                    team="team2"
                    index={idx}
                    onSelect={handlePlayerSelect}
                    isSelected={selectedPlayer && selectedPlayer.from === 'field' && selectedPlayer.index === idx && selectedPlayer.team === 'team2'}
                  />
                ))}
              </div>
              <p className="text-gray-400 text-sm text-center mt-3">
                💡 Taşımak için oyuncuya, sonra sahada bir yere tıklayın
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const rootEl = document.getElementById('root');
ReactDOM.createRoot(rootEl).render(React.createElement(HalisahaKadro));
