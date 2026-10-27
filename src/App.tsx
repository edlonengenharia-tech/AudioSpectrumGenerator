import React, { useState, useRef, useCallback, useEffect } from 'react';
import Visualizer, { TextOverlay, ImageOverlay, renderFrame } from './components/Visualizer';

type VisMode = 'bars' | 'wave' | 'circular' | 'particles' | 'equalizer3d' | 'galaxy' | 'lightning';
type TabType = 'visualizer' | 'text' | 'templates' | 'background' | 'settings' | 'extras' | 'export';

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

const DEFAULT_FONTS = [
  'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New',
  'Verdana', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Palatino',
  'Garamond', 'Bookman', 'Tahoma', 'Lucida Console', 'Monaco',
  'Segoe UI', 'Roboto', 'Open Sans', 'Montserrat', 'Lato',
  'Poppins', 'Oswald', 'Raleway', 'Nunito', 'Ubuntu',
  'PT Sans', 'Source Sans Pro', 'Fira Code', 'JetBrains Mono', 'Consolas'
];

interface VisualSettings {
  barCount: number;
  barWidth: number;
  barSpacing: number;
  barRadius: number;
  reflection: boolean;
  mirror: boolean;
  rotation: number;
  zoom: number;
  glowIntensity: number;
  blurAmount: number;
  backgroundOpacity: number;
  vignette: boolean;
  gridLines: boolean;
  particleCount: number;
  waveLayers: number;
  circularRings: number;
  speed: number;
  blendMode: string;
  backgroundColor1: string;
  backgroundColor2: string;
  strokeEnabled: boolean;
  strokeWidth: number;
  strokeColor: string;
  gradientType: string;
}

const DEFAULT_VISUAL_SETTINGS: VisualSettings = {
  barCount: 128,
  barWidth: 80,
  barSpacing: 2,
  barRadius: 4,
  reflection: true,
  mirror: false,
  rotation: 0,
  zoom: 100,
  glowIntensity: 100,
  blurAmount: 0,
  backgroundOpacity: 100,
  vignette: false,
  gridLines: false,
  particleCount: 500,
  waveLayers: 3,
  circularRings: 180,
  speed: 100,
  blendMode: 'normal',
  backgroundColor1: '#1a1a3e',
  backgroundColor2: '#0a0a1a',
  strokeEnabled: false,
  strokeWidth: 2,
  strokeColor: '#ffffff',
  gradientType: 'vertical',
};

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
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [visualSettings, setVisualSettings] = useState<VisualSettings>(DEFAULT_VISUAL_SETTINGS);
  const [systemFonts, setSystemFonts] = useState<string[]>(DEFAULT_FONTS);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [renderFPS, setRenderFPS] = useState(30);
  const [renderResolution, setRenderResolution] = useState<'720p' | '1080p' | '4k'>('1080p');
  const [renderStatus, setRenderStatus] = useState<'idle' | 'preparing' | 'rendering' | 'encoding' | 'done' | 'error'>('idle');
  const [renderCancel, setRenderCancel] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Environmental effects
  const [environmentalEffects, setEnvironmentalEffects] = useState({
    petals: false,
    rain: false,
    snow: false,
    bubbles: false,
    stars: false,
    fireflies: false,
    leaves: false,
    confetti: false,
  });
  
  // Image overlays (logos, animated images)
  const [imageOverlays, setImageOverlays] = useState<ImageOverlay[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // Detect audio duration
    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(audio.duration);
    });

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
    setAudioDuration(0);
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

  // Detect system fonts
  useEffect(() => {
    const detectFonts = async () => {
      try {
        // Try to use the Local Font Access API (Chrome/Edge)
        if ('queryLocalFonts' in window) {
          const fonts = await (window as any).queryLocalFonts();
          const fontNames = Array.from(new Set(fonts.map((f: any) => f.family))).sort() as string[];
          if (fontNames.length > 0) {
            setSystemFonts([...DEFAULT_FONTS, ...fontNames.filter((f: string) => !DEFAULT_FONTS.includes(f))]);
          }
        }
      } catch (error) {
        console.log('Font detection not available, using default fonts');
      }
    };
    detectFonts();
  }, []);

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
    setExportStatus('exporting');
    
    try {
      // Criar canvas offscreen de alta resolução
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1920;
      exportCanvas.height = 1080;
      const ctx = exportCanvas.getContext('2d');
      
      if (!ctx) {
        setExportStatus('error');
        setTimeout(() => setExportStatus('idle'), 3000);
        return;
      }

      // Renderizar background
      const doExport = () => {
        renderVisualizerAndTexts(ctx, exportCanvas);
      };

      if (backgroundImage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 1920, 1080);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(0, 0, 1920, 1080);
          doExport();
        };
        img.onerror = () => {
          // Se falhar, usar background padrão
          renderDefaultBackground(ctx, 1920, 1080);
          doExport();
        };
        img.src = backgroundImage;
      } else {
        renderDefaultBackground(ctx, 1920, 1080);
        doExport();
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  const renderDefaultBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bgGrad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    bgGrad.addColorStop(0, '#1a1a3e');
    bgGrad.addColorStop(1, '#0a0a1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  };

  const renderVisualizerAndTexts = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;

    // Renderizar visualização atual (simplificada para export)
    if (analyser) {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      switch (visMode) {
        case 'bars':
          renderBarsExport(ctx, dataArray, width, height, bufferLength);
          break;
        case 'circular':
          renderCircularExport(ctx, dataArray, width, height, bufferLength);
          break;
        default:
          renderBarsExport(ctx, dataArray, width, height, bufferLength);
      }
    } else {
      // Se não há áudio, renderizar um visual estático
      renderStaticVisualizer(ctx, width, height);
    }

    // Renderizar textos
    textOverlays.forEach(overlay => {
      ctx.save();
      ctx.globalAlpha = overlay.opacity;
      ctx.font = `${overlay.italic ? 'italic ' : ''}${overlay.bold ? 'bold ' : ''}${overlay.fontSize * 2}px ${overlay.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const x = (overlay.x / 100) * width;
      const y = (overlay.y / 100) * height;

      if (overlay.glow) {
        ctx.shadowColor = overlay.color;
        ctx.shadowBlur = 30;
      }

      ctx.fillStyle = overlay.color;
      ctx.fillText(overlay.text, x, y);

      // Outline
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 3;
      ctx.strokeText(overlay.text, x, y);

      ctx.restore();
    });

    // Fazer download
    setTimeout(() => {
      try {
        // Tentar exportar o canvas offscreen
        const dataUrl = canvas.toDataURL('image/png');
        
        if (!dataUrl || dataUrl === 'data:,' || dataUrl.length < 100) {
          throw new Error('Canvas vazio ou inválido');
        }

        const link = document.createElement('a');
        link.download = `audio-spectrum-${Date.now()}.png`;
        link.href = dataUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Limpar após um delay
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          URL.revokeObjectURL(link.href);
        }, 1000);
        
        setExportStatus('success');
        setTimeout(() => setExportStatus('idle'), 3000);
      } catch (error) {
        console.error('Erro ao fazer download:', error);
        // Tentar fallback: abrir em nova aba
        try {
          const dataUrl = canvas.toDataURL('image/png');
          const newWindow = window.open('');
          if (newWindow) {
            newWindow.document.write(`<img src="${dataUrl}" style="max-width:100%"/><br><a href="${dataUrl}" download="audio-spectrum.png">Clique aqui para salvar</a>`);
            setExportStatus('success');
          } else {
            setExportStatus('error');
          }
        } catch (e2) {
          setExportStatus('error');
        }
        setTimeout(() => setExportStatus('idle'), 3000);
      }
    }, 100);
  };

  const renderBarsExport = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const barCount = 128;
    const barWidth = width / barCount;
    const step = Math.floor(bufferLength / barCount);

    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i * step] * (sensitivity / 100);
      const barHeight = (value / 255) * height * 0.8;

      const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.5, colors.secondary);
      gradient.addColorStop(1, colors.tertiary);

      ctx.fillStyle = gradient;
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = value / 10;

      const x = i * barWidth;
      ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
    }
    ctx.shadowBlur = 0;
  };

  const renderCircularExport = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.25;
    const bars = 180;

    for (let i = 0; i < bars; i++) {
      const angle = (i / bars) * Math.PI * 2;
      const dataIndex = Math.floor((i / bars) * bufferLength);
      const value = dataArray[dataIndex] * (sensitivity / 100);
      const barLength = (value / 255) * radius * 1.5;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barLength);
      const y2 = centerY + Math.sin(angle) * (radius + barLength);

      const hue = (i / bars) * 360;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
      ctx.lineWidth = 3;
      ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
      ctx.shadowBlur = value / 15;
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  };

  const renderStaticVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Renderizar um visual estático quando não há áudio
    const barCount = 64;
    const barWidth = width / barCount;

    for (let i = 0; i < barCount; i++) {
      const barHeight = (Math.sin(i * 0.2) + 1) * 0.3 * height;
      const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.5, colors.secondary);
      gradient.addColorStop(1, colors.tertiary);

      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
    }
    ctx.globalAlpha = 1;
  };

  const categories = ['all', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
  const filteredTemplates = templateCategory === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === templateCategory);

  const startRendering = async () => {
    if (!audioElementRef.current && !streamRef.current) {
      alert('Carregue um áudio ou ative o microfone primeiro');
      return;
    }

    setRenderStatus('preparing');
    setRenderProgress(0);
    setRenderCancel(false);
    setIsRendering(true);

    try {
      // Get resolution
      const resolutions = {
        '720p': { width: 1280, height: 720 },
        '1080p': { width: 1920, height: 1080 },
        '4k': { width: 3840, height: 2160 }
      };
      const { width, height } = resolutions[renderResolution];

      // Create offscreen canvas
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      const ctx = offscreenCanvas.getContext('2d');
      if (!ctx) throw new Error('Não foi possível criar o canvas');

      // Load background image if exists
      let bgImage: HTMLImageElement | null = null;
      if (backgroundImage) {
        bgImage = new Image();
        bgImage.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          bgImage!.onload = () => resolve();
          bgImage!.onerror = () => resolve(); // Continue even if image fails
          bgImage!.src = backgroundImage;
        });
      }

      // Calculate frames
      const totalFrames = Math.ceil(audioDuration * renderFPS);
      const frameDuration = 1 / renderFPS;

      // Create audio element for playback during recording
      const audioForRecording = new Audio(audioElementRef.current?.src || '');
      audioForRecording.crossOrigin = 'anonymous';
      
      // Create audio context for mixing and analysis
      const recordingAudioCtx = new AudioContext();
      const audioSource = recordingAudioCtx.createMediaElementSource(audioForRecording);
      
      // Create analyser for real-time frequency data
      const recordingAnalyser = recordingAudioCtx.createAnalyser();
      recordingAnalyser.fftSize = 2048;
      recordingAnalyser.smoothingTimeConstant = smoothing / 100;
      
      const audioDestination = recordingAudioCtx.createMediaStreamDestination();
      audioSource.connect(recordingAnalyser);
      recordingAnalyser.connect(audioDestination);
      audioSource.connect(recordingAudioCtx.destination); // Also play through speakers

      // Setup canvas stream with manual frame capture
      const canvasStream = offscreenCanvas.captureStream(0); // 0 = manual frame capture
      const videoTrack = canvasStream.getVideoTracks()[0];
      
      // Combine video and audio tracks
      const combinedStream = new MediaStream([
        videoTrack,
        ...audioDestination.stream.getAudioTracks()
      ]);
      
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 8000000 // 8 Mbps for high quality
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.start(100);
      setRenderStatus('rendering');

      // Start audio playback
      await audioForRecording.play();
      const audioStartTime = performance.now();

      // Create arrays for real-time audio data
      const realFrequencyData = new Uint8Array(recordingAnalyser.frequencyBinCount);
      const realTimeData = new Uint8Array(recordingAnalyser.frequencyBinCount);

      // Render frames in real-time
      for (let frame = 0; frame < totalFrames; frame++) {
        if (renderCancel) {
          mediaRecorder.stop();
          audioForRecording.pause();
          setIsRendering(false);
          setRenderStatus('idle');
          return;
        }

        const currentTime = frame * frameDuration;
        
        // Get REAL audio data from the analyser (synchronized with playback)
        recordingAnalyser.getByteFrequencyData(realFrequencyData);
        recordingAnalyser.getByteTimeDomainData(realTimeData);

        // Render frame using the static render function with REAL audio data
        renderFrame(offscreenCanvas, {
          mode: visMode,
          colors,
          sensitivity,
          backgroundImage,
          bgImage,
          textOverlays,
          visualSettings,
          frequencyData: realFrequencyData,
          timeData: realTimeData,
          currentTime
        });

        // Request frame capture for this rendered frame
        if ('requestFrame' in videoTrack) {
          (videoTrack as any).requestFrame();
        }

        // Update progress
        const progress = ((frame + 1) / totalFrames) * 100;
        setRenderProgress(progress);

        // Wait for the next frame time to maintain real-time synchronization
        const expectedTime = audioStartTime + (frame + 1) * frameDuration * 1000;
        const currentTimeMs = performance.now();
        const delay = expectedTime - currentTimeMs;
        
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      // Stop recording and create video
      setRenderStatus('encoding');
      audioForRecording.pause();
      mediaRecorder.stop();

      await new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => resolve();
      });

      // Create and download video
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `audio-spectrum-${Math.round(audioDuration)}s-${renderResolution}-${Date.now()}.webm`;
      link.href = url;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);

      setRenderStatus('done');
      setTimeout(() => {
        setRenderStatus('idle');
        setIsRendering(false);
      }, 3000);

    } catch (error) {
      console.error('Render error:', error);
      setRenderStatus('error');
      setIsRendering(false);
      setTimeout(() => setRenderStatus('idle'), 3000);
    }
  };

  const stopRendering = () => {
    setRenderCancel(true);
  };





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
              {audioSource === 'file' && audioDuration > 0 && (
                <span className="text-[10px] text-white/50 font-mono">
                  ({Math.floor(audioDuration / 60)}:{Math.floor(audioDuration % 60).toString().padStart(2, '0')})
                </span>
              )}
            </div>
          )}

          {isRendering && (
            <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-500/50">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[10px] text-purple-400 font-mono">{Math.round(renderProgress)}%</span>
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
            visualSettings={visualSettings}
            environmentalEffects={environmentalEffects}
            imageOverlays={imageOverlays}
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
                { id: 'extras' as TabType, icon: '✨', label: 'Extras' },
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

                  {/* Font info */}
                  <div className="p-2 rounded-lg glass-light">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/60">🔤 Fontes disponíveis</span>
                      <span className="text-[10px] text-purple-300 font-medium">{systemFonts.length} fontes</span>
                    </div>
                    {systemFonts.length > DEFAULT_FONTS.length && (
                      <p className="text-[9px] text-green-400 mt-1">✅ Fontes do sistema detectadas!</p>
                    )}
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
                            {systemFonts.map((f: string) => <option key={f} value={f} style={{ background: '#1a1a3e', fontFamily: f }}>{f}</option>)}
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

                  {/* Advanced Visual Settings */}
                  <div className="border-t border-white/10 pt-4">
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full flex items-center justify-between p-2 rounded-lg glass-light hover:bg-white/10 transition-all"
                    >
                      <span className="text-xs font-medium text-white/80">🎨 Configurações Visuais Avançadas</span>
                      <span className="text-white/60">{showAdvanced ? '▼' : '▶'}</span>
                    </button>

                    {showAdvanced && (
                      <div className="mt-3 space-y-3">
                        {/* Bars Settings */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-medium text-white/70">Barras</h4>
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Quantidade: {visualSettings.barCount}</label>
                            <input
                              type="range"
                              min="32"
                              max="256"
                              value={visualSettings.barCount}
                              onChange={e => setVisualSettings({ ...visualSettings, barCount: Number(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Largura: {visualSettings.barWidth}%</label>
                            <input
                              type="range"
                              min="20"
                              max="100"
                              value={visualSettings.barWidth}
                              onChange={e => setVisualSettings({ ...visualSettings, barWidth: Number(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Espaçamento: {visualSettings.barSpacing}px</label>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              value={visualSettings.barSpacing}
                              onChange={e => setVisualSettings({ ...visualSettings, barSpacing: Number(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Raio: {visualSettings.barRadius}px</label>
                            <input
                              type="range"
                              min="0"
                              max="20"
                              value={visualSettings.barRadius}
                              onChange={e => setVisualSettings({ ...visualSettings, barRadius: Number(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                        </div>

                        {/* Effects */}
                        <div className="space-y-2 border-t border-white/10 pt-3">
                          <h4 className="text-[11px] font-medium text-white/70">Efeitos</h4>
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Intensidade do Glow: {visualSettings.glowIntensity}%</label>
                            <input
                              type="range"
                              min="0"
                              max="200"
                              value={visualSettings.glowIntensity}
                              onChange={e => setVisualSettings({ ...visualSettings, glowIntensity: Number(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Blur: {visualSettings.blurAmount}px</label>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              value={visualSettings.blurAmount}
                              onChange={e => setVisualSettings({ ...visualSettings, blurAmount: Number(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Velocidade: {visualSettings.speed}%</label>
                            <input
                              type="range"
                              min="10"
                              max="300"
                              value={visualSettings.speed}
                              onChange={e => setVisualSettings({ ...visualSettings, speed: Number(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                        </div>

                        {/* Transform */}
                        <div className="space-y-2 border-t border-white/10 pt-3">
                          <h4 className="text-[11px] font-medium text-white/70">Transformação</h4>
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Rotação: {visualSettings.rotation}°</label>
                            <input
                              type="range"
                              min="-180"
                              max="180"
                              value={visualSettings.rotation}
                              onChange={e => setVisualSettings({ ...visualSettings, rotation: Number(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Zoom: {visualSettings.zoom}%</label>
                            <input
                              type="range"
                              min="50"
                              max="200"
                              value={visualSettings.zoom}
                              onChange={e => setVisualSettings({ ...visualSettings, zoom: Number(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                        </div>

                        {/* Toggles */}
                        <div className="space-y-2 border-t border-white/10 pt-3">
                          <h4 className="text-[11px] font-medium text-white/70">Opções</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-white/60">Reflexo</span>
                            <button
                              onClick={() => setVisualSettings({ ...visualSettings, reflection: !visualSettings.reflection })}
                              className={`w-10 h-5 rounded-full transition-all ${visualSettings.reflection ? 'bg-purple-500' : 'bg-white/20'}`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${visualSettings.reflection ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-white/60">Vinheta</span>
                            <button
                              onClick={() => setVisualSettings({ ...visualSettings, vignette: !visualSettings.vignette })}
                              className={`w-10 h-5 rounded-full transition-all ${visualSettings.vignette ? 'bg-purple-500' : 'bg-white/20'}`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${visualSettings.vignette ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-white/60">Linhas de Grid</span>
                            <button
                              onClick={() => setVisualSettings({ ...visualSettings, gridLines: !visualSettings.gridLines })}
                              className={`w-10 h-5 rounded-full transition-all ${visualSettings.gridLines ? 'bg-purple-500' : 'bg-white/20'}`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${visualSettings.gridLines ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-white/60">Contorno</span>
                            <button
                              onClick={() => setVisualSettings({ ...visualSettings, strokeEnabled: !visualSettings.strokeEnabled })}
                              className={`w-10 h-5 rounded-full transition-all ${visualSettings.strokeEnabled ? 'bg-purple-500' : 'bg-white/20'}`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${visualSettings.strokeEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                          </div>
                        </div>

                        {/* Stroke Settings */}
                        {visualSettings.strokeEnabled && (
                          <div className="space-y-2 border-t border-white/10 pt-3">
                            <h4 className="text-[11px] font-medium text-white/70">Contorno</h4>
                            <div>
                              <label className="text-[10px] text-white/50 block mb-1">Espessura: {visualSettings.strokeWidth}px</label>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={visualSettings.strokeWidth}
                                onChange={e => setVisualSettings({ ...visualSettings, strokeWidth: Number(e.target.value) })}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-white/50 block mb-1">Cor</label>
                              <input
                                type="color"
                                value={visualSettings.strokeColor}
                                onChange={e => setVisualSettings({ ...visualSettings, strokeColor: e.target.value })}
                                className="w-full h-8 rounded cursor-pointer bg-transparent"
                              />
                            </div>
                          </div>
                        )}

                        {/* Background Settings */}
                        <div className="space-y-2 border-t border-white/10 pt-3">
                          <h4 className="text-[11px] font-medium text-white/70">Background</h4>
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Opacidade: {visualSettings.backgroundOpacity}%</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={visualSettings.backgroundOpacity}
                              onChange={e => setVisualSettings({ ...visualSettings, backgroundOpacity: Number(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Tipo de Gradiente</label>
                            <select
                              value={visualSettings.gradientType}
                              onChange={e => setVisualSettings({ ...visualSettings, gradientType: e.target.value })}
                              className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                            >
                              <option value="radial" style={{ background: '#1a1a3e' }}>Radial</option>
                              <option value="linear" style={{ background: '#1a1a3e' }}>Linear</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-white/50 block mb-1">Cor 1</label>
                              <input
                                type="color"
                                value={visualSettings.backgroundColor1}
                                onChange={e => setVisualSettings({ ...visualSettings, backgroundColor1: e.target.value })}
                                className="w-full h-8 rounded cursor-pointer bg-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-white/50 block mb-1">Cor 2</label>
                              <input
                                type="color"
                                value={visualSettings.backgroundColor2}
                                onChange={e => setVisualSettings({ ...visualSettings, backgroundColor2: e.target.value })}
                                className="w-full h-8 rounded cursor-pointer bg-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Mode-specific settings */}
                        {(visMode === 'particles' || visMode === 'galaxy') && (
                          <div className="space-y-2 border-t border-white/10 pt-3">
                            <h4 className="text-[11px] font-medium text-white/70">Partículas</h4>
                            <div>
                              <label className="text-[10px] text-white/50 block mb-1">Quantidade: {visualSettings.particleCount}</label>
                              <input
                                type="range"
                                min="100"
                                max="1000"
                                value={visualSettings.particleCount}
                                onChange={e => setVisualSettings({ ...visualSettings, particleCount: Number(e.target.value) })}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}

                        {visMode === 'wave' && (
                          <div className="space-y-2 border-t border-white/10 pt-3">
                            <h4 className="text-[11px] font-medium text-white/70">Ondas</h4>
                            <div>
                              <label className="text-[10px] text-white/50 block mb-1">Camadas: {visualSettings.waveLayers}</label>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={visualSettings.waveLayers}
                                onChange={e => setVisualSettings({ ...visualSettings, waveLayers: Number(e.target.value) })}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}

                        {visMode === 'circular' && (
                          <div className="space-y-2 border-t border-white/10 pt-3">
                            <h4 className="text-[11px] font-medium text-white/70">Circular</h4>
                            <div>
                              <label className="text-[10px] text-white/50 block mb-1">Anéis: {visualSettings.circularRings}</label>
                              <input
                                type="range"
                                min="60"
                                max="360"
                                value={visualSettings.circularRings}
                                onChange={e => setVisualSettings({ ...visualSettings, circularRings: Number(e.target.value) })}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}

                        {/* Reset button */}
                        <button
                          onClick={() => setVisualSettings(DEFAULT_VISUAL_SETTINGS)}
                          className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-all"
                        >
                          🔄 Resetar Configurações
                        </button>
                      </div>
                    )}
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

              {activeTab === 'extras' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white/90">✨ Efeitos Extras</h3>
                  
                  {/* Environmental Effects */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-white/70">🌸 Efeitos Ambientais</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setEnvironmentalEffects({ ...environmentalEffects, petals: !environmentalEffects.petals })}
                        className={`p-3 rounded-xl text-xs font-medium transition-all ${
                          environmentalEffects.petals
                            ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50'
                            : 'glass-light hover:bg-white/10 text-white/60'
                        }`}
                      >
                        <span className="text-lg block mb-1">🌸</span>
                        Pétalas
                      </button>
                      <button
                        onClick={() => setEnvironmentalEffects({ ...environmentalEffects, rain: !environmentalEffects.rain })}
                        className={`p-3 rounded-xl text-xs font-medium transition-all ${
                          environmentalEffects.rain
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                            : 'glass-light hover:bg-white/10 text-white/60'
                        }`}
                      >
                        <span className="text-lg block mb-1">🌧️</span>
                        Chuva
                      </button>
                      <button
                        onClick={() => setEnvironmentalEffects({ ...environmentalEffects, snow: !environmentalEffects.snow })}
                        className={`p-3 rounded-xl text-xs font-medium transition-all ${
                          environmentalEffects.snow
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                            : 'glass-light hover:bg-white/10 text-white/60'
                        }`}
                      >
                        <span className="text-lg block mb-1">❄️</span>
                        Neve
                      </button>
                      <button
                        onClick={() => setEnvironmentalEffects({ ...environmentalEffects, bubbles: !environmentalEffects.bubbles })}
                        className={`p-3 rounded-xl text-xs font-medium transition-all ${
                          environmentalEffects.bubbles
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                            : 'glass-light hover:bg-white/10 text-white/60'
                        }`}
                      >
                        <span className="text-lg block mb-1">🫧</span>
                        Bolhas
                      </button>
                      <button
                        onClick={() => setEnvironmentalEffects({ ...environmentalEffects, stars: !environmentalEffects.stars })}
                        className={`p-3 rounded-xl text-xs font-medium transition-all ${
                          environmentalEffects.stars
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                            : 'glass-light hover:bg-white/10 text-white/60'
                        }`}
                      >
                        <span className="text-lg block mb-1">⭐</span>
                        Estrelas
                      </button>
                      <button
                        onClick={() => setEnvironmentalEffects({ ...environmentalEffects, fireflies: !environmentalEffects.fireflies })}
                        className={`p-3 rounded-xl text-xs font-medium transition-all ${
                          environmentalEffects.fireflies
                            ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                            : 'glass-light hover:bg-white/10 text-white/60'
                        }`}
                      >
                        <span className="text-lg block mb-1">✨</span>
                        Vagalumes
                      </button>
                      <button
                        onClick={() => setEnvironmentalEffects({ ...environmentalEffects, leaves: !environmentalEffects.leaves })}
                        className={`p-3 rounded-xl text-xs font-medium transition-all ${
                          environmentalEffects.leaves
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                            : 'glass-light hover:bg-white/10 text-white/60'
                        }`}
                      >
                        <span className="text-lg block mb-1">🍂</span>
                        Folhas
                      </button>
                      <button
                        onClick={() => setEnvironmentalEffects({ ...environmentalEffects, confetti: !environmentalEffects.confetti })}
                        className={`p-3 rounded-xl text-xs font-medium transition-all ${
                          environmentalEffects.confetti
                            ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                            : 'glass-light hover:bg-white/10 text-white/60'
                        }`}
                      >
                        <span className="text-lg block mb-1">🎊</span>
                        Confete
                      </button>
                    </div>
                  </div>

                  {/* Image Overlays */}
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-medium text-white/70">🖼️ Imagens e Logos</h4>
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*,image/gif';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const newOverlay: ImageOverlay = {
                                  id: Date.now().toString(),
                                  src: ev.target?.result as string,
                                  x: 50,
                                  y: 50,
                                  width: 20,
                                  height: 20,
                                  opacity: 100,
                                  animated: file.type === 'image/gif',
                                  loop: true,
                                };
                                setImageOverlays([...imageOverlays, newOverlay]);
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs hover:bg-purple-500/30 transition-all"
                      >
                        + Adicionar
                      </button>
                    </div>

                    {/* Image overlays list */}
                    <div className="space-y-2">
                      {imageOverlays.map(overlay => (
                        <div key={overlay.id} className="p-3 rounded-lg glass-light space-y-2">
                          <div className="flex items-center gap-2">
                            <img src={overlay.src} alt="Overlay" className="w-12 h-12 object-contain rounded" />
                            <div className="flex-1">
                              <p className="text-[10px] text-white/60">
                                {overlay.animated ? '🎞️ GIF Animado' : '🖼️ Imagem'}
                              </p>
                            </div>
                            <button
                              onClick={() => setImageOverlays(imageOverlays.filter(o => o.id !== overlay.id))}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] text-white/50 block mb-1">Posição X: {overlay.x}%</label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={overlay.x}
                                onChange={e => setImageOverlays(imageOverlays.map(o => o.id === overlay.id ? { ...o, x: Number(e.target.value) } : o))}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-white/50 block mb-1">Posição Y: {overlay.y}%</label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={overlay.y}
                                onChange={e => setImageOverlays(imageOverlays.map(o => o.id === overlay.id ? { ...o, y: Number(e.target.value) } : o))}
                                className="w-full"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] text-white/50 block mb-1">Tamanho: {overlay.width}%</label>
                              <input
                                type="range"
                                min="5"
                                max="100"
                                value={overlay.width}
                                onChange={e => setImageOverlays(imageOverlays.map(o => o.id === overlay.id ? { ...o, width: Number(e.target.value), height: Number(e.target.value) } : o))}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-white/50 block mb-1">Opacidade: {overlay.opacity}%</label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={overlay.opacity}
                                onChange={e => setImageOverlays(imageOverlays.map(o => o.id === overlay.id ? { ...o, opacity: Number(e.target.value) } : o))}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {imageOverlays.length === 0 && (
                        <p className="text-[10px] text-white/40 text-center py-4">
                          Nenhuma imagem adicionada. Clique em "Adicionar" para upload de logos ou imagens.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-xs font-medium text-white/70 mb-2">💡 Dicas</h4>
                    <div className="space-y-1.5 text-[11px] text-white/50">
                      <p>• Combine múltiplos efeitos ambientais</p>
                      <p>• Use logos para marca d'água</p>
                      <p>• GIFs animados são suportados</p>
                      <p>• Ajuste posição e tamanho livremente</p>
                      <p>• Efeitos reagem ao áudio</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'export' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white/90">📤 Exportação</h3>

                  {/* Image Export */}
                  <button
                    onClick={exportImage}
                    disabled={exportStatus === 'exporting'}
                    className={`w-full p-4 rounded-xl transition-all text-center group ${
                      exportStatus === 'exporting'
                        ? 'bg-purple-500/20 border border-purple-500/50'
                        : exportStatus === 'success'
                        ? 'bg-green-500/20 border border-green-500/50'
                        : exportStatus === 'error'
                        ? 'bg-red-500/20 border border-red-500/50'
                        : 'glass-light hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {exportStatus === 'exporting' ? '⏳' : exportStatus === 'success' ? '✅' : exportStatus === 'error' ? '❌' : '📸'}
                    </div>
                    <p className={`text-xs font-medium ${
                      exportStatus === 'success' ? 'text-green-300' : 
                      exportStatus === 'error' ? 'text-red-300' : 
                      'text-white/80 group-hover:text-white'
                    }`}>
                      {exportStatus === 'exporting' ? 'Exportando...' : 
                       exportStatus === 'success' ? 'Imagem salva com sucesso!' : 
                       exportStatus === 'error' ? 'Erro na exportação' : 
                       'Capturar Imagem PNG'}
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      {exportStatus === 'idle' ? '1920x1080 - Alta resolução' : ''}
                    </p>
                  </button>

                  {/* Video Rendering */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-xs font-medium text-white/70 mb-2">🎬 Renderização de Vídeo</h4>
                    
                    {!isRendering ? (
                      <div className="space-y-3">
                        {/* Duration */}
                        <div className="p-3 rounded-lg glass-light">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-white/50">⏱️ Duração do Áudio</span>
                            <span className="text-xs font-mono text-purple-300">
                              {audioDuration > 0 ? `${Math.floor(audioDuration / 60)}:${Math.floor(audioDuration % 60).toString().padStart(2, '0')}` : '--:--'}
                            </span>
                          </div>
                          <p className="text-[9px] text-white/40 mt-1">O vídeo terá a mesma duração do áudio</p>
                        </div>

                        {/* Resolution */}
                        <div>
                          <label className="text-[10px] text-white/50 block mb-1">Resolução</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['720p', '1080p', '4k'] as const).map(res => (
                              <button
                                key={res}
                                onClick={() => setRenderResolution(res)}
                                className={`py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                                  renderResolution === res
                                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                                    : 'glass-light text-white/60 hover:text-white/80'
                                }`}
                              >
                                {res}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* FPS */}
                        <div>
                          <label className="text-[10px] text-white/50 block mb-1">FPS</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[24, 30, 60].map(fps => (
                              <button
                                key={fps}
                                onClick={() => setRenderFPS(fps)}
                                className={`py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                                  renderFPS === fps
                                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                                    : 'glass-light text-white/60 hover:text-white/80'
                                }`}
                              >
                                {fps}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Render button */}
                        <button
                          onClick={startRendering}
                          disabled={audioSource !== 'file'}
                          className="w-full p-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 transition-all text-center group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="text-2xl mb-2">🎬</div>
                          <p className="text-xs font-medium text-purple-300">Iniciar Renderização</p>
                          <p className="text-[10px] text-white/40 mt-1">
                            {audioSource === 'file' && audioDuration > 0
                              ? `Renderizar ${Math.floor(audioDuration / 60)}:${Math.floor(audioDuration % 60).toString().padStart(2, '0')} em ${renderResolution} @ ${renderFPS} FPS`
                              : audioSource === 'file'
                              ? 'Carregando áudio...'
                              : 'Carregue um arquivo de áudio'}
                          </p>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                              <span className="text-xs font-medium text-purple-300">
                                {renderStatus === 'preparing' && 'Preparando...'}
                                {renderStatus === 'rendering' && 'Renderizando...'}
                                {renderStatus === 'encoding' && 'Codificando...'}
                                {renderStatus === 'done' && 'Concluído!'}
                                {renderStatus === 'error' && 'Erro!'}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-white/80">{Math.round(renderProgress)}%</span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-2">
                            <div
                              className="h-full rounded-full transition-all duration-200"
                              style={{
                                width: `${renderProgress}%`,
                                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`
                              }}
                            />
                          </div>

                          {renderStatus !== 'done' && renderStatus !== 'error' && (
                            <button
                              onClick={stopRendering}
                              className="w-full py-2 rounded-lg bg-red-500/30 hover:bg-red-500/40 text-red-200 text-xs font-medium transition-all"
                            >
                              ❌ Cancelar
                            </button>
                          )}
                        </div>
                        
                        <p className="text-[10px] text-white/40 text-center">
                          {renderStatus === 'rendering' && 'Renderizando frames...'}
                          {renderStatus === 'encoding' && 'Codificando vídeo...'}
                          {renderStatus === 'done' && 'Vídeo salvo com sucesso!'}
                          {renderStatus === 'error' && 'Erro na renderização'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <h4 className="text-xs font-medium text-white/70">Formatos Suportados</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl glass-light">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📸</span>
                          <div>
                            <p className="text-xs font-medium text-white/80">PNG</p>
                            <p className="text-[10px] text-white/40">Imagem estática 1920x1080</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl glass-light">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎬</span>
                          <div>
                            <p className="text-xs font-medium text-white/80">WebM Video</p>
                            <p className="text-[10px] text-white/40">Renderização offline (até 4K, 60 FPS, 8 Mbps)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-xs font-medium text-white/70 mb-2">💡 Dicas</h4>
                    <div className="space-y-1.5 text-[11px] text-white/50">
                      <p>• Renderização em tempo real com áudio</p>
                      <p>• 🔊 O áudio tocará durante a renderização</p>
                      <p>• Use arquivos de áudio (não microfone)</p>
                      <p>• 1080p @ 30fps recomendado para YouTube</p>
                      <p>• 4K @ 60fps para máxima qualidade</p>
                      <p>• Formato WebM compatível com editores</p>
                      <p>• Não feche a aba durante a renderização</p>
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
