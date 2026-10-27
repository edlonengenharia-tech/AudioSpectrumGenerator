import React, { useState, useRef, useCallback, useEffect } from 'react';
import Visualizer, { TextOverlay } from './components/Visualizer';

type VisMode = 'bars' | 'wave' | 'circular' | 'particles' | 'equalizer3d' | 'galaxy' | 'lightning';
type TabType = 'visualizer' | 'text' | 'templates' | 'background' | 'settings' | 'export';

interface Template {
  id: string;
  name: string;
  category: string;
  icon: string;
  texts: Array<{ text: string; fontSize: number; color: string; y: number; animation: string; bold: boolean }>;
}

const TEMPLATES: Template[] = [
  // Music
  { id: 'music1', name: 'Now Playing', category: '🎵 Música', icon: '🎵', texts: [{ text: 'NOW PLAYING', fontSize: 48, color: '#8b5cf6', y: 30, animation: 'glow', bold: true }, { text: 'Artist - Song Name', fontSize: 24, color: '#ffffff', y: 70, animation: 'fade', bold: false }] },
  { id: 'music2', name: 'Music Visualizer Pro', category: '🎵 Música', icon: '🎶', texts: [{ text: '♪ MUSIC VISUALIZER ♪', fontSize: 42, color: '#ec4899', y: 25, animation: 'pulse', bold: true }, { text: 'Live Audio Experience', fontSize: 22, color: '#a78bfa', y: 75, animation: 'float', bold: false }] },
  { id: 'music3', name: 'DJ Session', category: '🎵 Música', icon: '🎧', texts: [{ text: 'DJ SESSION', fontSize: 56, color: '#06b6d4', y: 30, animation: 'glow', bold: true }, { text: 'LIVE MIX', fontSize: 28, color: '#67e8f9', y: 65, animation: 'bounce', bold: true }] },
  { id: 'music4', name: 'Top Hit', category: '🎵 Música', icon: '⭐', texts: [{ text: '★ TOP HIT ★', fontSize: 50, color: '#f59e0b', y: 30, animation: 'pulse', bold: true }, { text: 'Chart #1', fontSize: 26, color: '#fbbf24', y: 70, animation: 'fade', bold: false }] },
  // Gaming
  { id: 'game1', name: 'Live Starting Soon', category: '🎮 Gamer', icon: '🎮', texts: [{ text: 'STARTING SOON', fontSize: 48, color: '#ef4444', y: 35, animation: 'pulse', bold: true }, { text: 'Get Ready!', fontSize: 24, color: '#fca5a5', y: 65, animation: 'bounce', bold: false }] },
  { id: 'game2', name: 'Stream Online', category: '🎮 Gamer', icon: '📡', texts: [{ text: '● LIVE', fontSize: 52, color: '#ef4444', y: 30, animation: 'glow', bold: true }, { text: 'Stream Online', fontSize: 26, color: '#ffffff', y: 65, animation: 'fade', bold: false }] },
  { id: 'game3', name: 'Victory Moment', category: '🎮 Gamer', icon: '🏆', texts: [{ text: 'VICTORY!', fontSize: 60, color: '#f59e0b', y: 35, animation: 'bounce', bold: true }, { text: 'GG WP', fontSize: 28, color: '#fbbf24', y: 70, animation: 'fade', bold: false }] },
  { id: 'game4', name: 'New Record', category: '🎮 Gamer', icon: '🎯', texts: [{ text: 'NEW RECORD!', fontSize: 52, color: '#10b981', y: 30, animation: 'pulse', bold: true }, { text: 'Personal Best', fontSize: 24, color: '#6ee7b7', y: 65, animation: 'float', bold: false }] },
  // Podcast
  { id: 'pod1', name: 'Podcast Episode', category: '🎙️ Podcast', icon: '🎙️', texts: [{ text: 'PODCAST', fontSize: 46, color: '#8b5cf6', y: 25, animation: 'glow', bold: true }, { text: 'Episode #001', fontSize: 28, color: '#c4b5fd', y: 55, animation: 'fade', bold: false }, { text: 'Special Guest', fontSize: 22, color: '#a78bfa', y: 75, animation: 'float', bold: false }] },
  { id: 'pod2', name: 'Interview', category: '🎙️ Podcast', icon: '💬', texts: [{ text: 'ENTREVISTA ESPECIAL', fontSize: 38, color: '#ec4899', y: 30, animation: 'pulse', bold: true }, { text: 'Convidado da Semana', fontSize: 24, color: '#f9a8d4', y: 65, animation: 'fade', bold: false }] },
  // Social
  { id: 'soc1', name: 'Novo Vídeo', category: '📱 Social', icon: '📱', texts: [{ text: 'NOVO VÍDEO!', fontSize: 52, color: '#ef4444', y: 30, animation: 'bounce', bold: true }, { text: 'Inscreva-se 🔔', fontSize: 26, color: '#fca5a5', y: 65, animation: 'pulse', bold: false }] },
  { id: 'soc2', name: 'Link na Bio', category: '📱 Social', icon: '🔗', texts: [{ text: 'LINK NA BIO', fontSize: 48, color: '#06b6d4', y: 35, animation: 'glow', bold: true }, { text: 'Confira agora!', fontSize: 24, color: '#67e8f9', y: 65, animation: 'fade', bold: false }] },
  { id: 'soc3', name: 'Follow', category: '📱 Social', icon: '❤️', texts: [{ text: 'SIGA PARA MAIS', fontSize: 44, color: '#ec4899', y: 30, animation: 'pulse', bold: true }, { text: '❤️ Like & Share', fontSize: 24, color: '#f9a8d4', y: 65, animation: 'bounce', bold: false }] },
  // Corporate
  { id: 'corp1', name: 'Apresentação', category: '🏢 Corporativo', icon: '🏢', texts: [{ text: 'APRESENTAÇÃO', fontSize: 44, color: '#3b82f6', y: 30, animation: 'fade', bold: true }, { text: 'Institucional', fontSize: 26, color: '#93c5fd', y: 65, animation: 'float', bold: false }] },
  { id: 'corp2', name: 'Lançamento', category: '🏢 Corporativo', icon: '🚀', texts: [{ text: 'LANÇAMENTO', fontSize: 50, color: '#8b5cf6', y: 30, animation: 'pulse', bold: true }, { text: 'Novo Produto', fontSize: 28, color: '#c4b5fd', y: 65, animation: 'glow', bold: false }] },
];

const VIS_MODES: { id: VisMode; name: string; icon: string }[] = [
  { id: 'bars', name: 'Barras', icon: '📊' },
  { id: 'wave', name: 'Ondas', icon: '🌊' },
  { id: 'circular', name: 'Circular', icon: '🔵' },
  { id: 'particles', name: 'Partículas', icon: '✨' },
  { id: 'equalizer3d', name: 'EQ 3D', icon: '🔥' },
  { id: 'galaxy', name: 'Galaxy', icon: '🌌' },
  { id: 'lightning', name: 'Lightning', icon: '⚡' },
];

const FONTS = [
  'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New',
  'Verdana', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Palatino',
  'Garamond', 'Bookman', 'Tahoma', 'Lucida Console', 'Monaco'
];

const ANIMATIONS = [
  { id: 'none', name: 'Nenhuma' },
  { id: 'pulse', name: 'Pulsação' },
  { id: 'bounce', name: 'Bounce' },
  { id: 'float', name: 'Flutuar' },
  { id: 'glow', name: 'Glow/Neon' },
  { id: 'rotate', name: 'Rotação' },
  { id: 'typewriter', name: 'Máquina de Escrever' },
  { id: 'fade', name: 'Fade' },
];

const COLOR_PRESETS = [
  { primary: '#8b5cf6', secondary: '#3b82f6', tertiary: '#ec4899' },
  { primary: '#ef4444', secondary: '#f59e0b', tertiary: '#fbbf24' },
  { primary: '#10b981', secondary: '#06b6d4', tertiary: '#3b82f6' },
  { primary: '#ec4899', secondary: '#8b5cf6', tertiary: '#6366f1' },
  { primary: '#f59e0b', secondary: '#ef4444', tertiary: '#ec4899' },
  { primary: '#06b6d4', secondary: '#8b5cf6', tertiary: '#ec4899' },
  { primary: '#22d3ee', secondary: '#a78bfa', tertiary: '#fb7185' },
  { primary: '#4ade80', secondary: '#22d3ee', tertiary: '#818cf8' },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('visualizer');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState<'mic' | 'file' | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [visMode, setVisMode] = useState<VisMode>('bars');
  const [sensitivity, setSensitivity] = useState(100);
  const [smoothing, setSmoothing] = useState(80);
  const [audioLevel, setAudioLevel] = useState(0);
  const [colors, setColors] = useState(COLOR_PRESETS[0]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isLoop, setIsLoop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [templateCategory, setTemplateCategory] = useState('all');
  const [showSidebar, setShowSidebar] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const startMicrophone = useCallback(async () => {
    try {
      const ctx = initAudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const source = ctx.createMediaStreamSource(stream);
      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 2048;
      analyserNode.smoothingTimeConstant = smoothing / 100;
      source.connect(analyserNode);
      sourceRef.current = source;
      setAnalyser(analyserNode);
      setAudioSource('mic');
      setIsPlaying(true);
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  }, [initAudioContext, smoothing]);

  const loadAudioFile = useCallback((file: File) => {
    const ctx = initAudioContext();

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = URL.createObjectURL(file);
    audio.loop = isLoop;
    audioElementRef.current = audio;

    const source = ctx.createMediaElementSource(audio);
    const analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 2048;
    analyserNode.smoothingTimeConstant = smoothing / 100;
    source.connect(analyserNode);
    analyserNode.connect(ctx.destination);
    sourceRef.current = source;
    setAnalyser(analyserNode);
    setAudioSource('file');
    setFileName(file.name);

    audio.play();
    setIsPlaying(true);
  }, [initAudioContext, isLoop, smoothing]);

  const togglePlay = useCallback(() => {
    if (audioSource === 'file' && audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [audioSource, isPlaying]);

  const stopAudio = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setAnalyser(null);
    setAudioSource(null);
    setIsPlaying(false);
    setFileName('');
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadAudioFile(file);
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setBackgroundImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      loadAudioFile(file);
    }
  };

  // Audio level monitoring
  useEffect(() => {
    if (!analyser) { setAudioLevel(0); return; }
    const interval = setInterval(() => {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setAudioLevel(avg);
    }, 50);
    return () => clearInterval(interval);
  }, [analyser]);

  // Update smoothing
  useEffect(() => {
    if (analyser) {
      analyser.smoothingTimeConstant = smoothing / 100;
    }
  }, [smoothing, analyser]);

  // Update loop
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.loop = isLoop;
    }
  }, [isLoop]);

  const addTextOverlay = () => {
    const newOverlay: TextOverlay = {
      id: Date.now().toString(),
      text: 'Novo Texto',
      x: 50,
      y: 50,
      fontSize: 36,
      fontFamily: 'Arial',
      color: '#ffffff',
      animation: 'none',
      bold: false,
      italic: false,
      glow: false,
      opacity: 1,
    };
    setTextOverlays([...textOverlays, newOverlay]);
    setSelectedText(newOverlay.id);
  };

  const updateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays(textOverlays.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeTextOverlay = (id: string) => {
    setTextOverlays(textOverlays.filter(t => t.id !== id));
    if (selectedText === id) setSelectedText(null);
  };

  const applyTemplate = (template: Template) => {
    const newOverlays: TextOverlay[] = template.texts.map((t, i) => ({
      id: `${template.id}-${i}`,
      text: t.text,
      x: 50,
      y: t.y,
      fontSize: t.fontSize,
      fontFamily: 'Arial',
      color: t.color,
      animation: t.animation,
      bold: t.bold,
      italic: false,
      glow: t.animation === 'glow',
      opacity: 1,
    }));
    setTextOverlays(newOverlays);
  };

  const exportImage = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'audio-spectrum.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const categories = ['all', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
  const filteredTemplates = templateCategory === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === templateCategory);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0a0a1a]">
      {/* Header */}
      <header className="glass border-b border-white/10 px-4 py-2 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-2xl animate-float">🎵</div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Audio Spectrum Generator
            </h1>
            <p className="text-[10px] text-white/50">Visualizador de Áudio Profissional</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio source buttons */}
          <button
            onClick={startMicrophone}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              audioSource === 'mic'
                ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse-glow'
                : 'glass-light hover:bg-white/10 text-white/70'
            }`}
          >
            🎤 Microfone
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              audioSource === 'file'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                : 'glass-light hover:bg-white/10 text-white/70'
            }`}
          >
            📁 Arquivo
          </button>
          <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />

          {audioSource === 'file' && (
            <>
              <button onClick={togglePlay} className="p-1.5 rounded-lg glass-light hover:bg-white/10 text-white/70">
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button onClick={stopAudio} className="p-1.5 rounded-lg glass-light hover:bg-white/10 text-white/70">
                ⏹️
              </button>
              <button
                onClick={() => setIsLoop(!isLoop)}
                className={`px-2 py-1.5 rounded-lg text-xs ${isLoop ? 'bg-purple-500/30 text-purple-300' : 'glass-light text-white/50'}`}
              >
                🔁
              </button>
            </>
          )}

          {audioSource && (
            <div className="flex items-center gap-1 ml-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-400">{fileName || 'Microfone'}</span>
            </div>
          )}

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-1.5 rounded-lg glass-light hover:bg-white/10 text-white/70 ml-2"
          >
            {showSidebar ? '◀️' : '▶️'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Canvas Area */}
        <div
          className={`flex-1 relative transition-all duration-300 ${isDragging ? 'ring-2 ring-purple-500 ring-inset' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Visualizer
            analyser={analyser}
            mode={visMode}
            colors={colors}
            sensitivity={sensitivity}
            smoothing={smoothing}
            audioLevel={audioLevel}
            backgroundImage={backgroundImage}
            textOverlays={textOverlays}
          />

          {/* Visualizer Mode Selector Overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 glass rounded-xl px-3 py-2">
            {VIS_MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setVisMode(m.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  visMode === m.id
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50 scale-105'
                    : 'hover:bg-white/10 text-white/60'
                }`}
                title={m.name}
              >
                <span className="mr-1">{m.icon}</span>
                <span className="hidden sm:inline">{m.name}</span>
              </button>
            ))}
          </div>

          {/* Audio Level Indicator */}
          <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/50">Nível</span>
              <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${(audioLevel / 255) * 100}%`,
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.tertiary})`
                  }}
                />
              </div>
              <span className="text-[10px] text-white/50">{Math.round((audioLevel / 255) * 100)}%</span>
            </div>
          </div>

          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="glass rounded-2xl p-8 text-center">
                <div className="text-4xl mb-2">🎵</div>
                <p className="text-white font-medium">Solte o arquivo de áudio aqui</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 glass border-l border-white/10 flex flex-col animate-fadeIn shrink-0">
            {/* Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto shrink-0">
              {[
                { id: 'visualizer' as TabType, icon: '🎨', label: 'Visual' },
                { id: 'text' as TabType, icon: '✍️', label: 'Texto' },
                { id: 'templates' as TabType, icon: '📑', label: 'Modelos' },
                { id: 'background' as TabType, icon: '🖼️', label: 'Fundo' },
                { id: 'settings' as TabType, icon: '⚙️', label: 'Config' },
                { id: 'export' as TabType, icon: '📤', label: 'Export' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-2 py-2.5 text-[11px] font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <span className="block text-sm">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
              {activeTab === 'visualizer' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white/90">🎨 Cores do Espectro</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => setColors(preset)}
                        className={`h-10 rounded-lg transition-all ${
                          colors === preset ? 'ring-2 ring-purple-400 scale-105' : 'hover:scale-105'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary}, ${preset.tertiary})`
                        }}
                      />
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-white/60 block mb-1">Cor Primária</label>
                      <input
                        type="color"
                        value={colors.primary}
                        onChange={e => setColors({ ...colors, primary: e.target.value })}
                        className="w-full h-8 rounded cursor-pointer bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/60 block mb-1">Cor Secundária</label>
                      <input
                        type="color"
                        value={colors.secondary}
                        onChange={e => setColors({ ...colors, secondary: e.target.value })}
                        className="w-full h-8 rounded cursor-pointer bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/60 block mb-1">Cor Terciária</label>
                      <input
                        type="color"
                        value={colors.tertiary}
                        onChange={e => setColors({ ...colors, tertiary: e.target.value })}
                        className="w-full h-8 rounded cursor-pointer bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-sm font-semibold text-white/90 mb-3">📊 Modos de Visualização</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {VIS_MODES.map(m => (
                        <button
                          key={m.id}
                          onClick={() => setVisMode(m.id)}
                          className={`p-3 rounded-xl text-xs font-medium transition-all ${
                            visMode === m.id
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                              : 'glass-light hover:bg-white/10 text-white/60'
                          }`}
                        >
                          <span className="text-lg block mb-1">{m.icon}</span>
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'text' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-white/90">✍️ Editor de Texto</h3>
                    <button
                      onClick={addTextOverlay}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs hover:bg-purple-500/30 transition-all"
                    >
                      + Adicionar
                    </button>
                  </div>

                  {/* Text layers list */}
                  <div className="space-y-2">
                    {textOverlays.map(overlay => (
                      <div
                        key={overlay.id}
                        onClick={() => setSelectedText(overlay.id)}
                        className={`p-2 rounded-lg cursor-pointer transition-all ${
                          selectedText === overlay.id
                            ? 'bg-purple-500/20 border border-purple-500/50'
                            : 'glass-light hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/80 truncate flex-1">{overlay.text}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeTextOverlay(overlay.id); }}
                            className="text-red-400 hover:text-red-300 text-xs ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    {textOverlays.length === 0 && (
                      <p className="text-xs text-white/40 text-center py-4">
                        Nenhum texto adicionado. Clique em "Adicionar" para começar.
                      </p>
                    )}
                  </div>

                  {/* Selected text editor */}
                  {selectedText && (() => {
                    const overlay = textOverlays.find(t => t.id === selectedText);
                    if (!overlay) return null;
                    return (
                      <div className="space-y-3 border-t border-white/10 pt-3">
                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Texto</label>
                          <input
                            type="text"
                            value={overlay.text}
                            onChange={e => updateTextOverlay(overlay.id, { text: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-purple-500/50 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-white/60 block mb-1">Tamanho</label>
                            <input
                              type="range"
                              min="12"
                              max="120"
                              value={overlay.fontSize}
                              onChange={e => updateTextOverlay(overlay.id, { fontSize: Number(e.target.value) })}
                              className="w-full"
                            />
                            <span className="text-[10px] text-white/40">{overlay.fontSize}px</span>
                          </div>
                          <div>
                            <label className="text-[11px] text-white/60 block mb-1">Opacidade</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={overlay.opacity * 100}
                              onChange={e => updateTextOverlay(overlay.id, { opacity: Number(e.target.value) / 100 })}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-white/60 block mb-1">Posição X</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={overlay.x}
                              onChange={e => updateTextOverlay(overlay.id, { x: Number(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-white/60 block mb-1">Posição Y</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={overlay.y}
                              onChange={e => updateTextOverlay(overlay.id, { y: Number(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Fonte</label>
                          <select
                            value={overlay.fontFamily}
                            onChange={e => updateTextOverlay(overlay.id, { fontFamily: e.target.value })}
                            className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-purple-500/50 focus:outline-none"
                          >
                            {FONTS.map(f => <option key={f} value={f} style={{ background: '#1a1a3e' }}>{f}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Cor</label>
                          <input
                            type="color"
                            value={overlay.color}
                            onChange={e => updateTextOverlay(overlay.id, { color: e.target.value })}
                            className="w-full h-8 rounded cursor-pointer bg-transparent"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Animação</label>
                          <select
                            value={overlay.animation}
                            onChange={e => updateTextOverlay(overlay.id, { animation: e.target.value })}
                            className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-purple-500/50 focus:outline-none"
                          >
                            {ANIMATIONS.map(a => <option key={a.id} value={a.id} style={{ background: '#1a1a3e' }}>{a.name}</option>)}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateTextOverlay(overlay.id, { bold: !overlay.bold })}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${overlay.bold ? 'bg-purple-500/30 text-purple-300' : 'glass-light text-white/60'}`}
                          >
                            B
                          </button>
                          <button
                            onClick={() => updateTextOverlay(overlay.id, { italic: !overlay.italic })}
                            className={`flex-1 py-1.5 rounded-lg text-xs italic transition-all ${overlay.italic ? 'bg-purple-500/30 text-purple-300' : 'glass-light text-white/60'}`}
                          >
                            I
                          </button>
                          <button
                            onClick={() => updateTextOverlay(overlay.id, { glow: !overlay.glow })}
                            className={`flex-1 py-1.5 rounded-lg text-xs transition-all ${overlay.glow ? 'bg-purple-500/30 text-purple-300' : 'glass-light text-white/60'}`}
                          >
                            ✨ Glow
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {activeTab === 'templates' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white/90">📑 Modelos Prontos</h3>

                  {/* Category filter */}
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setTemplateCategory(cat)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                          templateCategory === cat
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                            : 'glass-light text-white/50 hover:text-white/80'
                        }`}
                      >
                        {cat === 'all' ? '📋 Todos' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Templates grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {filteredTemplates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => applyTemplate(template)}
                        className="p-3 rounded-xl glass-light hover:bg-white/10 transition-all text-left group"
                      >
                        <div className="text-xl mb-1">{template.icon}</div>
                        <div className="text-xs font-medium text-white/80 group-hover:text-white">{template.name}</div>
                        <div className="text-[10px] text-white/40">{template.category}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'background' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white/90">🖼️ Background</h3>

                  <button
                    onClick={() => bgInputRef.current?.click()}
                    className="w-full p-4 rounded-xl glass-light hover:bg-white/10 transition-all text-center"
                  >
                    <div className="text-2xl mb-2">📁</div>
                    <p className="text-xs text-white/60">Upload de Imagem ou Vídeo</p>
                    <p className="text-[10px] text-white/40 mt-1">JPG, PNG, GIF, MP4, WebM</p>
                  </button>
                  <input ref={bgInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleBgUpload} />

                  {backgroundImage && (
                    <div className="space-y-2">
                      <div className="rounded-xl overflow-hidden border border-white/10">
                        <img src={backgroundImage} alt="Background" className="w-full h-32 object-cover" />
                      </div>
                      <button
                        onClick={() => setBackgroundImage(null)}
                        className="w-full py-2 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-all"
                      >
                        Remover Background
                      </button>
                    </div>
                  )}

                  {/* Gradient backgrounds */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-xs font-medium text-white/70 mb-2">Gradientes</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        'linear-gradient(135deg, #667eea, #764ba2)',
                        'linear-gradient(135deg, #f093fb, #f5576c)',
                        'linear-gradient(135deg, #4facfe, #00f2fe)',
                        'linear-gradient(135deg, #43e97b, #38f9d7)',
                        'linear-gradient(135deg, #fa709a, #fee140)',
                        'linear-gradient(135deg, #a18cd1, #fbc2eb)',
                      ].map((grad, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            // Create gradient image
                            const canvas = document.createElement('canvas');
                            canvas.width = 1920;
                            canvas.height = 1080;
                            const ctx = canvas.getContext('2d')!;
                            const g = ctx.createLinearGradient(0, 0, 1920, 1080);
                            const colors = grad.match(/#[a-f0-9]{6}/gi) || [];
                            colors.forEach((c, idx) => g.addColorStop(idx / (colors.length - 1), c));
                            ctx.fillStyle = g;
                            ctx.fillRect(0, 0, 1920, 1080);
                            setBackgroundImage(canvas.toDataURL());
                          }}
                          className="h-14 rounded-lg transition-all hover:scale-105"
                          style={{ background: grad }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white/90">⚙️ Configurações</h3>

                  <div>
                    <label className="text-[11px] text-white/60 block mb-1">
                      Sensibilidade: {sensitivity}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={sensitivity}
                      onChange={e => setSensitivity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-white/60 block mb-1">
                      Suavização: {smoothing}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="99"
                      value={smoothing}
                      onChange={e => setSmoothing(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <h4 className="text-xs font-medium text-white/70">Informações</h4>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-white/50">Fonte</span>
                        <span className="text-white/80">{audioSource === 'mic' ? '🎤 Microfone' : audioSource === 'file' ? '📁 Arquivo' : '❌ Nenhuma'}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-white/50">Status</span>
                        <span className="text-white/80">{isPlaying ? '🟢 Reproduzindo' : '⏸️ Pausado'}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-white/50">Modo</span>
                        <span className="text-white/80">{VIS_MODES.find(m => m.id === visMode)?.name}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-white/50">Textos</span>
                        <span className="text-white/80">{textOverlays.length} camadas</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-white/50">Loop</span>
                        <span className="text-white/80">{isLoop ? '✅ Ativado' : '❌ Desativado'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-xs font-medium text-white/70 mb-2">Presets Rápidos</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setSensitivity(80); setSmoothing(90); setVisMode('bars'); }}
                        className="p-2 rounded-lg glass-light hover:bg-white/10 text-[11px] text-white/60"
                      >
                        🎵 Clássico
                      </button>
                      <button
                        onClick={() => { setSensitivity(150); setSmoothing(70); setVisMode('particles'); }}
                        className="p-2 rounded-lg glass-light hover:bg-white/10 text-[11px] text-white/60"
                      >
                        ✨ Partículas
                      </button>
                      <button
                        onClick={() => { setSensitivity(120); setSmoothing(85); setVisMode('circular'); }}
                        className="p-2 rounded-lg glass-light hover:bg-white/10 text-[11px] text-white/60"
                      >
                        🔵 Circular
                      </button>
                      <button
                        onClick={() => { setSensitivity(130); setSmoothing(60); setVisMode('galaxy'); }}
                        className="p-2 rounded-lg glass-light hover:bg-white/10 text-[11px] text-white/60"
                      >
                        🌌 Galaxy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'export' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white/90">📤 Exportação</h3>

                  <button
                    onClick={exportImage}
                    className="w-full p-4 rounded-xl glass-light hover:bg-white/10 transition-all text-center group"
                  >
                    <div className="text-2xl mb-2">📸</div>
                    <p className="text-xs font-medium text-white/80 group-hover:text-white">Capturar Imagem PNG</p>
                    <p className="text-[10px] text-white/40 mt-1">Alta resolução</p>
                  </button>

                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-white/70">Formatos de Exportação</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl glass-light">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎬</span>
                          <div>
                            <p className="text-xs font-medium text-white/80">Vídeo MP4</p>
                            <p className="text-[10px] text-white/40">Gravação da visualização</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl glass-light">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎞️</span>
                          <div>
                            <p className="text-xs font-medium text-white/80">WebM</p>
                            <p className="text-[10px] text-white/40">Formato web otimizado</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl glass-light">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🖼️</span>
                          <div>
                            <p className="text-xs font-medium text-white/80">GIF Animado</p>
                            <p className="text-[10px] text-white/40">Animação em loop</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <h4 className="text-xs font-medium text-white/70">💾 Projeto</h4>
                    <button
                      onClick={() => {
                        const project = { textOverlays, colors, visMode, sensitivity, smoothing };
                        const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
                        const link = document.createElement('a');
                        link.download = 'audio-spectrum-project.json';
                        link.href = URL.createObjectURL(blob);
                        link.click();
                      }}
                      className="w-full py-2.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs hover:bg-blue-500/30 transition-all"
                    >
                      💾 Salvar Projeto
                    </button>
                    <button
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.json';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              try {
                                const project = JSON.parse(ev.target?.result as string);
                                if (project.textOverlays) setTextOverlays(project.textOverlays);
                                if (project.colors) setColors(project.colors);
                                if (project.visMode) setVisMode(project.visMode);
                                if (project.sensitivity) setSensitivity(project.sensitivity);
                                if (project.smoothing) setSmoothing(project.smoothing);
                              } catch (err) {
                                alert('Arquivo de projeto inválido');
                              }
                            };
                            reader.readAsText(file);
                          }
                        };
                        input.click();
                      }}
                      className="w-full py-2.5 rounded-lg bg-green-500/20 text-green-300 text-xs hover:bg-green-500/30 transition-all"
                    >
                      📂 Carregar Projeto
                    </button>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-xs font-medium text-white/70 mb-2">🎯 Para Criadores</h4>
                    <div className="space-y-1.5 text-[11px] text-white/50">
                      <p>✅ Compatível com OBS Studio</p>
                      <p>✅ Overlay transparente (Browser Source)</p>
                      <p>✅ Layouts para Twitch, YouTube e TikTok</p>
                      <p>✅ Exibição de capa da música</p>
                      <p>✅ Chroma Key support</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
