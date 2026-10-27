import React, { useRef, useEffect, useCallback, useState } from 'react';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  mode: string;
  colors: { primary: string; secondary: string; tertiary: string };
  sensitivity: number;
  smoothing: number;
  audioLevel: number;
  backgroundImage: string | null;
  textOverlays: TextOverlay[];
  visualSettings: {
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
  };
  // For offline rendering
  offlineData?: {
    frequencyData: Uint8Array | null;
    timeData: Uint8Array | null;
    currentTime: number;
  };
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  animation: string;
  bold: boolean;
  italic: boolean;
  glow: boolean;
  opacity: number;
}

const Visualizer: React.FC<VisualizerProps> = ({
  analyser,
  mode,
  colors,
  sensitivity,
  smoothing,
  audioLevel,
  backgroundImage,
  textOverlays,
  visualSettings,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Array<{x: number; y: number; vx: number; vy: number; life: number; size: number; color: string}>>([]);
  const timeRef = useRef(0);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const bgLoadedRef = useRef(false);

  // Load background image once when it changes
  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        bgImageRef.current = img;
        bgLoadedRef.current = true;
      };
      img.onerror = () => {
        bgLoadedRef.current = false;
      };
      img.src = backgroundImage;
    } else {
      bgImageRef.current = null;
      bgLoadedRef.current = false;
    }
  }, [backgroundImage]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    if (backgroundImage && bgLoadedRef.current && bgImageRef.current) {
      ctx.globalAlpha = visualSettings.backgroundOpacity / 100;
      ctx.drawImage(bgImageRef.current, 0, 0, width, height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(0, 0, 0, ${0.3 * (1 - visualSettings.backgroundOpacity / 100)})`;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Custom gradient background
      let bgGrad;
      if (visualSettings.gradientType === 'radial') {
        bgGrad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
      } else {
        bgGrad = ctx.createLinearGradient(0, 0, width, height);
      }
      bgGrad.addColorStop(0, visualSettings.backgroundColor1);
      bgGrad.addColorStop(1, visualSettings.backgroundColor2);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // Grid lines
    if (visualSettings.gridLines) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    if (!analyser) {
      // Draw idle animation
      timeRef.current += 0.02;
      const idleGrad = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, 200);
      idleGrad.addColorStop(0, `rgba(139, 92, 246, ${0.1 + Math.sin(timeRef.current) * 0.05})`);
      idleGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = idleGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw text overlays even when idle
      drawTextOverlays(ctx, width, height);
      animFrameRef.current = requestAnimationFrame(draw);
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    analyser.getByteTimeDomainData(timeData);

    timeRef.current += 0.016;

    switch (mode) {
      case 'bars':
        drawBars(ctx, dataArray, width, height, bufferLength);
        break;
      case 'wave':
        drawWave(ctx, timeData, dataArray, width, height, bufferLength);
        break;
      case 'circular':
        drawCircular(ctx, dataArray, width, height, bufferLength);
        break;
      case 'particles':
        drawParticles(ctx, dataArray, width, height, bufferLength);
        break;
      case 'equalizer3d':
        drawEqualizer3D(ctx, dataArray, width, height, bufferLength);
        break;
      case 'galaxy':
        drawGalaxy(ctx, dataArray, width, height, bufferLength);
        break;
      case 'lightning':
        drawLightning(ctx, dataArray, width, height, bufferLength);
        break;
      default:
        drawBars(ctx, dataArray, width, height, bufferLength);
    }

    // Vignette effect
    if (visualSettings.vignette) {
      const vignetteGrad = ctx.createRadialGradient(width/2, height/2, width * 0.3, width/2, height/2, width * 0.7);
      vignetteGrad.addColorStop(0, 'transparent');
      vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw text overlays
    drawTextOverlays(ctx, width, height);

    animFrameRef.current = requestAnimationFrame(draw);
  }, [analyser, mode, colors, sensitivity, smoothing, backgroundImage, textOverlays, audioLevel]);

  const drawTextOverlays = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    textOverlays.forEach(overlay => {
      ctx.save();
      ctx.globalAlpha = overlay.opacity;
      ctx.font = `${overlay.italic ? 'italic ' : ''}${overlay.bold ? 'bold ' : ''}${overlay.fontSize}px ${overlay.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const x = (overlay.x / 100) * width;
      const y = (overlay.y / 100) * height;

      // Animation
      let offsetX = 0, offsetY = 0, scale = 1, alpha = 1;
      const t = timeRef.current;

      switch (overlay.animation) {
        case 'pulse':
          scale = 1 + Math.sin(t * 4) * 0.05 * (audioLevel / 255);
          break;
        case 'bounce':
          offsetY = Math.sin(t * 3) * 10;
          break;
        case 'float':
          offsetY = Math.sin(t * 1.5) * 8;
          offsetX = Math.cos(t * 1.2) * 5;
          break;
        case 'glow':
          ctx.shadowColor = overlay.color;
          ctx.shadowBlur = 10 + Math.sin(t * 3) * 10;
          break;
        case 'rotate':
          ctx.translate(x, y);
          ctx.rotate(Math.sin(t * 0.5) * 0.1);
          ctx.translate(-x, -y);
          break;
        case 'typewriter':
          const chars = Math.floor((t % 5) / 5 * overlay.text.length * 3);
          ctx.fillStyle = overlay.color;
          if (overlay.glow) {
            ctx.shadowColor = overlay.color;
            ctx.shadowBlur = 15;
          }
          ctx.fillText(overlay.text.substring(0, Math.min(chars, overlay.text.length)), x + offsetX, y + offsetY);
          ctx.restore();
          return;
        case 'fade':
          alpha = (Math.sin(t * 2) + 1) / 2;
          break;
      }

      ctx.translate(x + offsetX, y + offsetY);
      ctx.scale(scale, scale);
      ctx.translate(-(x + offsetX), -(y + offsetY));

      if (overlay.glow) {
        ctx.shadowColor = overlay.color;
        ctx.shadowBlur = 20;
      }

      ctx.globalAlpha = overlay.opacity * alpha;
      ctx.fillStyle = overlay.color;
      ctx.fillText(overlay.text, x + offsetX, y + offsetY);

      // Outline
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 2;
      ctx.strokeText(overlay.text, x + offsetX, y + offsetY);

      ctx.restore();
    });
  };

  const drawBars = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const barCount = visualSettings.barCount;
    const spacing = visualSettings.barSpacing;
    const totalBarWidth = (width - spacing * barCount) / barCount;
    const barWidth = totalBarWidth * (visualSettings.barWidth / 100);
    const step = Math.floor(bufferLength / barCount);

    ctx.save();
    
    // Apply rotation and zoom
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-width / 2, -height / 2);
    }

    // Apply blur
    if (visualSettings.blurAmount > 0) {
      ctx.filter = `blur(${visualSettings.blurAmount}px)`;
    }

    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i * step] * (sensitivity / 100);
      const barHeight = (value / 255) * height * 0.8;

      let gradient;
      if (visualSettings.gradientType === 'vertical') {
        gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
      } else if (visualSettings.gradientType === 'horizontal') {
        gradient = ctx.createLinearGradient(0, 0, width, 0);
      } else {
        gradient = ctx.createLinearGradient(0, height, width, 0);
      }
      
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.5, colors.secondary);
      gradient.addColorStop(1, colors.tertiary);

      ctx.fillStyle = gradient;
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = (value / 10) * (visualSettings.glowIntensity / 100);

      const x = i * (totalBarWidth + spacing);
      const radius = Math.min(barWidth / 2 - 1, visualSettings.barRadius);

      ctx.beginPath();
      ctx.moveTo(x + radius, height - barHeight);
      ctx.lineTo(x + barWidth - radius, height - barHeight);
      ctx.quadraticCurveTo(x + barWidth, height - barHeight, x + barWidth, height - barHeight + radius);
      ctx.lineTo(x + barWidth, height);
      ctx.lineTo(x, height);
      ctx.lineTo(x, height - barHeight + radius);
      ctx.quadraticCurveTo(x, height - barHeight, x + radius, height - barHeight);
      ctx.fill();

      // Stroke
      if (visualSettings.strokeEnabled) {
        ctx.strokeStyle = visualSettings.strokeColor;
        ctx.lineWidth = visualSettings.strokeWidth;
        ctx.stroke();
      }

      // Reflection
      if (visualSettings.reflection) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height, barWidth, barHeight * 0.3);
        ctx.globalAlpha = 1;
      }
    }
    
    ctx.restore();
    ctx.shadowBlur = 0;
    ctx.filter = 'none';
  };

  const drawWave = (ctx: CanvasRenderingContext2D, timeData: Uint8Array, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const waveLayers = visualSettings.waveLayers;
    
    ctx.save();
    
    // Apply rotation and zoom
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-width / 2, -height / 2);
    }

    if (visualSettings.blurAmount > 0) {
      ctx.filter = `blur(${visualSettings.blurAmount}px)`;
    }

    // Multiple wave layers
    for (let layer = 0; layer < waveLayers; layer++) {
      ctx.beginPath();
      const sliceWidth = width / bufferLength;

      for (let i = 0; i < bufferLength; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * height) / 2 + layer * 20;
        const x = i * sliceWidth;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const layerColors = [colors.primary, colors.secondary, colors.tertiary];
      const colorIndex = layer % layerColors.length;
      ctx.strokeStyle = layerColors[colorIndex];
      ctx.lineWidth = visualSettings.strokeWidth || (3 - layer * 0.5);
      ctx.globalAlpha = 1 - layer * 0.2;
      ctx.shadowColor = layerColors[colorIndex];
      ctx.shadowBlur = 10 * (visualSettings.glowIntensity / 100);
      ctx.stroke();
    }
    
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.filter = 'none';
  };

  const drawCircular = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.25;
    const bars = visualSettings.circularRings || 180;

    ctx.save();
    
    // Apply rotation and zoom
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(centerX, centerY);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-centerX, -centerY);
    }

    if (visualSettings.blurAmount > 0) {
      ctx.filter = `blur(${visualSettings.blurAmount}px)`;
    }

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
      ctx.lineWidth = visualSettings.strokeWidth || 2;
      ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
      ctx.shadowBlur = (value / 15) * (visualSettings.glowIntensity / 100);
      ctx.stroke();
    }

    // Center circle
    const avgLevel = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
    const pulseRadius = radius * 0.8 + (avgLevel / 255) * 20;
    const centerGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
    centerGrad.addColorStop(0, colors.primary + '80');
    centerGrad.addColorStop(0.7, colors.secondary + '40');
    centerGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    ctx.shadowBlur = 0;
    ctx.filter = 'none';
  };

  const drawParticles = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const avgLevel = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
    const spawnCount = Math.floor(avgLevel / 20);
    const maxParticles = visualSettings.particleCount || 500;

    ctx.save();
    
    // Apply rotation and zoom
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-width / 2, -height / 2);
    }

    if (visualSettings.blurAmount > 0) {
      ctx.filter = `blur(${visualSettings.blurAmount}px)`;
    }

    // Spawn new particles
    for (let i = 0; i < spawnCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (avgLevel / 255) * 5 + 1;
      particlesRef.current.push({
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed * (Math.random() + 0.5),
        vy: Math.sin(angle) * speed * (Math.random() + 0.5),
        life: 1,
        size: Math.random() * 4 + 2,
        color: [colors.primary, colors.secondary, colors.tertiary][Math.floor(Math.random() * 3)]
      });
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    particlesRef.current.forEach(p => {
      p.x += p.vx * (visualSettings.speed / 100);
      p.y += p.vy * (visualSettings.speed / 100);
      p.vy += 0.05; // gravity
      p.life -= 0.01;
      p.size *= 0.99;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10 * (visualSettings.glowIntensity / 100);
      ctx.fill();
    });
    
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.filter = 'none';

    // Limit particles
    if (particlesRef.current.length > maxParticles) {
      particlesRef.current = particlesRef.current.slice(-maxParticles);
    }
  };

  const drawEqualizer3D = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const rows = 16;
    const cols = visualSettings.barCount || 32;
    const cellW = width / cols;
    const cellH = 30;
    const step = Math.floor(bufferLength / cols);

    ctx.save();
    
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-width / 2, -height / 2);
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const dataIndex = col * step;
        const value = dataArray[dataIndex] * (sensitivity / 100);
        const barH = (value / 255) * 100;

        const x = col * cellW + (row * 5);
        const y = height - 50 - row * cellH - barH + row * 10;

        const alpha = 1 - (row / rows) * 0.5;
        const hue = (col / cols) * 120 + 250;

        ctx.fillStyle = `hsla(${hue}, 80%, 50%, ${alpha})`;
        ctx.shadowColor = `hsl(${hue}, 80%, 50%)`;
        ctx.shadowBlur = 5 * (visualSettings.glowIntensity / 100);

        ctx.fillRect(x, y, cellW - 4, barH);

        ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 5, y - 5);
        ctx.lineTo(x + cellW - 4 + 5, y - 5);
        ctx.lineTo(x + cellW - 4, y);
        ctx.fill();

        ctx.fillStyle = `hsla(${hue}, 80%, 30%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x + cellW - 4, y);
        ctx.lineTo(x + cellW - 4 + 5, y - 5);
        ctx.lineTo(x + cellW - 4 + 5, y + barH - 5);
        ctx.lineTo(x + cellW - 4, y + barH);
        ctx.fill();
      }
    }
    
    ctx.restore();
    ctx.shadowBlur = 0;
  };

  const drawGalaxy = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const avgLevel = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
    const centerX = width / 2;
    const centerY = height / 2;
    const starCount = visualSettings.particleCount || 200;

    ctx.save();
    
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(centerX, centerY);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-centerX, -centerY);
    }

    // Nebula background
    for (let i = 0; i < 5; i++) {
      const nebulaGrad = ctx.createRadialGradient(
        centerX + Math.sin(timeRef.current + i) * 100,
        centerY + Math.cos(timeRef.current + i) * 80,
        0,
        centerX, centerY, 300
      );
      const hue = (i * 72 + timeRef.current * 20) % 360;
      nebulaGrad.addColorStop(0, `hsla(${hue}, 80%, 50%, ${(avgLevel / 255) * 0.15})`);
      nebulaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // Stars
    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2 + timeRef.current * 0.1 * (visualSettings.speed / 100);
      const dist = 50 + (i / starCount) * (Math.min(width, height) * 0.4);
      const dataIndex = Math.floor((i / starCount) * bufferLength);
      const value = dataArray[dataIndex] * (sensitivity / 100);

      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist * 0.6;
      const size = (value / 255) * 4 + 1;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(i * 3) % 360}, 80%, 80%, ${0.5 + (value / 255) * 0.5})`;
      ctx.shadowColor = `hsl(${(i * 3) % 360}, 80%, 80%)`;
      ctx.shadowBlur = size * 3 * (visualSettings.glowIntensity / 100);
      ctx.fill();
    }
    
    ctx.restore();
    ctx.shadowBlur = 0;
  };

  const drawLightning = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const avgLevel = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

    ctx.save();
    
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-width / 2, -height / 2);
    }

    if (avgLevel > 100) {
      const boltCount = Math.floor(avgLevel / 80);
      for (let b = 0; b < boltCount; b++) {
        ctx.beginPath();
        let x = Math.random() * width;
        let y = 0;
        ctx.moveTo(x, y);

        const segments = 20;
        for (let i = 0; i < segments; i++) {
          x += (Math.random() - 0.5) * 60;
          y += height / segments;
          ctx.lineTo(x, y);
        }

        const hue = (timeRef.current * 50 + b * 60) % 360;
        ctx.strokeStyle = `hsla(${hue}, 80%, 70%, 0.8)`;
        ctx.lineWidth = 2 + Math.random() * 3;
        ctx.shadowColor = `hsl(${hue}, 80%, 70%)`;
        ctx.shadowBlur = 20 * (visualSettings.glowIntensity / 100);
        ctx.stroke();

        if (Math.random() > 0.5) {
          ctx.beginPath();
          let bx = x;
          let by = y - height / segments * 5;
          ctx.moveTo(bx, by);
          for (let i = 0; i < 8; i++) {
            bx += (Math.random() - 0.5) * 40;
            by += height / segments * 0.8;
            ctx.lineTo(bx, by);
          }
          ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.5)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Ground glow
    const groundGrad = ctx.createLinearGradient(0, height - 100, 0, height);
    groundGrad.addColorStop(0, 'transparent');
    groundGrad.addColorStop(1, `rgba(139, 92, 246, ${(avgLevel / 255) * 0.3})`);
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, height - 100, width, 100);
    
    ctx.restore();
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener('resize', resize);
    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      style={{ background: '#0a0a1a' }}
    />
  );
};

// Static render function for offline video rendering
export const renderFrame = (
  canvas: HTMLCanvasElement,
  props: {
    mode: string;
    colors: { primary: string; secondary: string; tertiary: string };
    sensitivity: number;
    backgroundImage: string | null;
    bgImage?: HTMLImageElement | null;
    textOverlays: TextOverlay[];
    visualSettings: any;
    frequencyData: Uint8Array;
    timeData: Uint8Array;
    currentTime: number;
  }
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const { mode, colors, sensitivity, visualSettings, frequencyData, timeData, currentTime, textOverlays } = props;
  const bufferLength = frequencyData.length;

  ctx.clearRect(0, 0, width, height);

  // Background
  if (props.backgroundImage && props.bgImage) {
    ctx.globalAlpha = visualSettings.backgroundOpacity / 100;
    ctx.drawImage(props.bgImage, 0, 0, width, height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = `rgba(0, 0, 0, ${0.3 * (1 - visualSettings.backgroundOpacity / 100)})`;
    ctx.fillRect(0, 0, width, height);
  } else {
    let bgGrad;
    if (visualSettings.gradientType === 'radial') {
      bgGrad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    } else {
      bgGrad = ctx.createLinearGradient(0, 0, width, height);
    }
    bgGrad.addColorStop(0, visualSettings.backgroundColor1);
    bgGrad.addColorStop(1, visualSettings.backgroundColor2);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // Grid lines
  if (visualSettings.gridLines) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // Draw visualizer based on mode
  const drawBarsStatic = () => {
    const barCount = visualSettings.barCount;
    const spacing = visualSettings.barSpacing;
    const totalBarWidth = (width - spacing * barCount) / barCount;
    const barWidth = totalBarWidth * (visualSettings.barWidth / 100);
    const step = Math.floor(bufferLength / barCount);

    ctx.save();
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-width / 2, -height / 2);
    }
    if (visualSettings.blurAmount > 0) ctx.filter = `blur(${visualSettings.blurAmount}px)`;

    for (let i = 0; i < barCount; i++) {
      const value = frequencyData[i * step] * (sensitivity / 100);
      const barHeight = (value / 255) * height * 0.8;

      let gradient;
      if (visualSettings.gradientType === 'vertical') {
        gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
      } else if (visualSettings.gradientType === 'horizontal') {
        gradient = ctx.createLinearGradient(0, 0, width, 0);
      } else {
        gradient = ctx.createLinearGradient(0, height, width, 0);
      }
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.5, colors.secondary);
      gradient.addColorStop(1, colors.tertiary);

      ctx.fillStyle = gradient;
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = (value / 10) * (visualSettings.glowIntensity / 100);

      const x = i * (totalBarWidth + spacing);
      const radius = Math.min(barWidth / 2 - 1, visualSettings.barRadius);

      ctx.beginPath();
      ctx.moveTo(x + radius, height - barHeight);
      ctx.lineTo(x + barWidth - radius, height - barHeight);
      ctx.quadraticCurveTo(x + barWidth, height - barHeight, x + barWidth, height - barHeight + radius);
      ctx.lineTo(x + barWidth, height);
      ctx.lineTo(x, height);
      ctx.lineTo(x, height - barHeight + radius);
      ctx.quadraticCurveTo(x, height - barHeight, x + radius, height - barHeight);
      ctx.fill();

      if (visualSettings.strokeEnabled) {
        ctx.strokeStyle = visualSettings.strokeColor;
        ctx.lineWidth = visualSettings.strokeWidth;
        ctx.stroke();
      }

      if (visualSettings.reflection) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height, barWidth, barHeight * 0.3);
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
    ctx.shadowBlur = 0;
    ctx.filter = 'none';
  };

  const drawCircularStatic = () => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.25;
    const bars = visualSettings.circularRings || 180;

    ctx.save();
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(centerX, centerY);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-centerX, -centerY);
    }

    for (let i = 0; i < bars; i++) {
      const angle = (i / bars) * Math.PI * 2;
      const dataIndex = Math.floor((i / bars) * bufferLength);
      const value = frequencyData[dataIndex] * (sensitivity / 100);
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
      ctx.lineWidth = visualSettings.strokeWidth || 2;
      ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
      ctx.shadowBlur = (value / 15) * (visualSettings.glowIntensity / 100);
      ctx.stroke();
    }

    const avgLevel = frequencyData.reduce((a, b) => a + b, 0) / bufferLength;
    const pulseRadius = radius * 0.8 + (avgLevel / 255) * 20;
    const centerGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
    centerGrad.addColorStop(0, colors.primary + '80');
    centerGrad.addColorStop(0.7, colors.secondary + '40');
    centerGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.shadowBlur = 0;
  };

  const drawWaveStatic = () => {
    const waveLayers = visualSettings.waveLayers;
    ctx.save();
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-width / 2, -height / 2);
    }

    for (let layer = 0; layer < waveLayers; layer++) {
      ctx.beginPath();
      const sliceWidth = width / bufferLength;
      for (let i = 0; i < bufferLength; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * height) / 2 + layer * 20;
        const x = i * sliceWidth;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const layerColors = [colors.primary, colors.secondary, colors.tertiary];
      ctx.strokeStyle = layerColors[layer % layerColors.length];
      ctx.lineWidth = visualSettings.strokeWidth || (3 - layer * 0.5);
      ctx.globalAlpha = 1 - layer * 0.2;
      ctx.shadowColor = layerColors[layer % layerColors.length];
      ctx.shadowBlur = 10 * (visualSettings.glowIntensity / 100);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  const drawParticlesStatic = () => {
    const avgLevel = frequencyData.reduce((a, b) => a + b, 0) / bufferLength;
    ctx.save();
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-width / 2, -height / 2);
    }

    // Deterministic particles based on currentTime
    const seed = Math.floor(currentTime * 30);
    const particleCount = visualSettings.particleCount || 500;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + currentTime * 0.5;
      const dist = 50 + ((i * 137.5) % (Math.min(width, height) * 0.4));
      const dataIndex = Math.floor((i / particleCount) * bufferLength);
      const value = frequencyData[dataIndex] * (sensitivity / 100);

      const x = width / 2 + Math.cos(angle) * dist;
      const y = height / 2 + Math.sin(angle) * dist;
      const size = (value / 255) * 4 + 1;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      const color = [colors.primary, colors.secondary, colors.tertiary][i % 3];
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.5 + (value / 255) * 0.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 3 * (visualSettings.glowIntensity / 100);
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  const drawGalaxyStatic = () => {
    const avgLevel = frequencyData.reduce((a, b) => a + b, 0) / bufferLength;
    const centerX = width / 2;
    const centerY = height / 2;
    const starCount = visualSettings.particleCount || 200;

    ctx.save();
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(centerX, centerY);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-centerX, -centerY);
    }

    for (let i = 0; i < 5; i++) {
      const nebulaGrad = ctx.createRadialGradient(
        centerX + Math.sin(currentTime + i) * 100,
        centerY + Math.cos(currentTime + i) * 80,
        0, centerX, centerY, 300
      );
      const hue = (i * 72 + currentTime * 20) % 360;
      nebulaGrad.addColorStop(0, `hsla(${hue}, 80%, 50%, ${(avgLevel / 255) * 0.15})`);
      nebulaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);
    }

    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2 + currentTime * 0.1 * (visualSettings.speed / 100);
      const dist = 50 + (i / starCount) * (Math.min(width, height) * 0.4);
      const dataIndex = Math.floor((i / starCount) * bufferLength);
      const value = frequencyData[dataIndex] * (sensitivity / 100);

      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist * 0.6;
      const size = (value / 255) * 4 + 1;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(i * 3) % 360}, 80%, 80%, ${0.5 + (value / 255) * 0.5})`;
      ctx.shadowColor = `hsl(${(i * 3) % 360}, 80%, 80%)`;
      ctx.shadowBlur = size * 3 * (visualSettings.glowIntensity / 100);
      ctx.fill();
    }
    ctx.restore();
    ctx.shadowBlur = 0;
  };

  const drawLightningStatic = () => {
    const avgLevel = frequencyData.reduce((a, b) => a + b, 0) / bufferLength;
    ctx.save();
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-width / 2, -height / 2);
    }

    if (avgLevel > 100) {
      const boltCount = Math.floor(avgLevel / 80);
      for (let b = 0; b < boltCount; b++) {
        ctx.beginPath();
        let x = ((currentTime * 100 + b * 300) % width);
        let y = 0;
        ctx.moveTo(x, y);
        const segments = 20;
        for (let i = 0; i < segments; i++) {
          x += (Math.sin(currentTime * 10 + i + b) * 30);
          y += height / segments;
          ctx.lineTo(x, y);
        }
        const hue = (currentTime * 50 + b * 60) % 360;
        ctx.strokeStyle = `hsla(${hue}, 80%, 70%, 0.8)`;
        ctx.lineWidth = 2 + Math.abs(Math.sin(currentTime + b)) * 3;
        ctx.shadowColor = `hsl(${hue}, 80%, 70%)`;
        ctx.shadowBlur = 20 * (visualSettings.glowIntensity / 100);
        ctx.stroke();
      }
    }

    const groundGrad = ctx.createLinearGradient(0, height - 100, 0, height);
    groundGrad.addColorStop(0, 'transparent');
    groundGrad.addColorStop(1, `rgba(139, 92, 246, ${(avgLevel / 255) * 0.3})`);
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, height - 100, width, 100);
    ctx.restore();
    ctx.shadowBlur = 0;
  };

  const drawEQ3DStatic = () => {
    const rows = 16;
    const cols = visualSettings.barCount || 32;
    const cellW = width / cols;
    const cellH = 30;
    const step = Math.floor(bufferLength / cols);

    ctx.save();
    if (visualSettings.rotation !== 0 || visualSettings.zoom !== 100) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((visualSettings.rotation * Math.PI) / 180);
      ctx.scale(visualSettings.zoom / 100, visualSettings.zoom / 100);
      ctx.translate(-width / 2, -height / 2);
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const dataIndex = col * step;
        const value = frequencyData[dataIndex] * (sensitivity / 100);
        const barH = (value / 255) * 100;

        const x = col * cellW + (row * 5);
        const y = height - 50 - row * cellH - barH + row * 10;

        const alpha = 1 - (row / rows) * 0.5;
        const hue = (col / cols) * 120 + 250;

        ctx.fillStyle = `hsla(${hue}, 80%, 50%, ${alpha})`;
        ctx.shadowColor = `hsl(${hue}, 80%, 50%)`;
        ctx.shadowBlur = 5 * (visualSettings.glowIntensity / 100);
        ctx.fillRect(x, y, cellW - 4, barH);

        ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 5, y - 5);
        ctx.lineTo(x + cellW - 4 + 5, y - 5);
        ctx.lineTo(x + cellW - 4, y);
        ctx.fill();

        ctx.fillStyle = `hsla(${hue}, 80%, 30%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x + cellW - 4, y);
        ctx.lineTo(x + cellW - 4 + 5, y - 5);
        ctx.lineTo(x + cellW - 4 + 5, y + barH - 5);
        ctx.lineTo(x + cellW - 4, y + barH);
        ctx.fill();
      }
    }
    ctx.restore();
    ctx.shadowBlur = 0;
  };

  switch (mode) {
    case 'bars': drawBarsStatic(); break;
    case 'wave': drawWaveStatic(); break;
    case 'circular': drawCircularStatic(); break;
    case 'particles': drawParticlesStatic(); break;
    case 'equalizer3d': drawEQ3DStatic(); break;
    case 'galaxy': drawGalaxyStatic(); break;
    case 'lightning': drawLightningStatic(); break;
    default: drawBarsStatic();
  }

  // Vignette
  if (visualSettings.vignette) {
    const vignetteGrad = ctx.createRadialGradient(width/2, height/2, width * 0.3, width/2, height/2, width * 0.7);
    vignetteGrad.addColorStop(0, 'transparent');
    vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    ctx.fillStyle = vignetteGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // Text overlays
  textOverlays.forEach(overlay => {
    ctx.save();
    ctx.globalAlpha = overlay.opacity;
    ctx.font = `${overlay.italic ? 'italic ' : ''}${overlay.bold ? 'bold ' : ''}${overlay.fontSize * 2}px ${overlay.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = (overlay.x / 100) * width;
    const y = (overlay.y / 100) * height;
    let offsetX = 0, offsetY = 0, scale = 1, alpha = 1;

    switch (overlay.animation) {
      case 'pulse': scale = 1 + Math.sin(currentTime * 4) * 0.05; break;
      case 'bounce': offsetY = Math.sin(currentTime * 3) * 10; break;
      case 'float': offsetY = Math.sin(currentTime * 1.5) * 8; offsetX = Math.cos(currentTime * 1.2) * 5; break;
      case 'glow': ctx.shadowColor = overlay.color; ctx.shadowBlur = 10 + Math.sin(currentTime * 3) * 10; break;
      case 'rotate': ctx.translate(x, y); ctx.rotate(Math.sin(currentTime * 0.5) * 0.1); ctx.translate(-x, -y); break;
      case 'fade': alpha = (Math.sin(currentTime * 2) + 1) / 2; break;
    }

    ctx.translate(x + offsetX, y + offsetY);
    ctx.scale(scale, scale);
    ctx.translate(-(x + offsetX), -(y + offsetY));

    if (overlay.glow) {
      ctx.shadowColor = overlay.color;
      ctx.shadowBlur = 20;
    }

    ctx.globalAlpha = overlay.opacity * alpha;
    ctx.fillStyle = overlay.color;
    ctx.fillText(overlay.text, x + offsetX, y + offsetY);
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 3;
    ctx.strokeText(overlay.text, x + offsetX, y + offsetY);
    ctx.restore();
  });
};

export default Visualizer;
