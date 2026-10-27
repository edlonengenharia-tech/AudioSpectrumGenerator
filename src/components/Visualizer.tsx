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
      ctx.drawImage(bgImageRef.current, 0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, width, height);
    } else {
      const bgGrad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
      bgGrad.addColorStop(0, '#1a1a3e');
      bgGrad.addColorStop(1, '#0a0a1a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
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
    const barCount = 128;
    const barWidth = width / barCount;
    const step = Math.floor(bufferLength / barCount);

    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i * step] * (sensitivity / 100);
      const barHeight = (value / 255) * height * 0.8;

      const hue = (i / barCount) * 120 + 250;
      const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.5, colors.secondary);
      gradient.addColorStop(1, colors.tertiary);

      ctx.fillStyle = gradient;
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = value / 10;

      const x = i * barWidth;
      const radius = Math.min(barWidth / 2 - 1, 4);

      ctx.beginPath();
      ctx.moveTo(x + radius, height - barHeight);
      ctx.lineTo(x + barWidth - 2 - radius, height - barHeight);
      ctx.quadraticCurveTo(x + barWidth - 2, height - barHeight, x + barWidth - 2, height - barHeight + radius);
      ctx.lineTo(x + barWidth - 2, height);
      ctx.lineTo(x, height);
      ctx.lineTo(x, height - barHeight + radius);
      ctx.quadraticCurveTo(x, height - barHeight, x + radius, height - barHeight);
      ctx.fill();

      // Reflection
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = gradient;
      ctx.fillRect(x, height, barWidth - 2, barHeight * 0.3);
      ctx.globalAlpha = 1;
    }
    ctx.shadowBlur = 0;
  };

  const drawWave = (ctx: CanvasRenderingContext2D, timeData: Uint8Array, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    // Multiple wave layers
    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      const layerOffset = layer * 0.3;
      const sliceWidth = width / bufferLength;

      for (let i = 0; i < bufferLength; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * height) / 2 + layer * 20;
        const x = i * sliceWidth;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const layerColors = [colors.primary, colors.secondary, colors.tertiary];
      ctx.strokeStyle = layerColors[layer];
      ctx.lineWidth = 3 - layer;
      ctx.globalAlpha = 1 - layer * 0.3;
      ctx.shadowColor = layerColors[layer];
      ctx.shadowBlur = 10;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  const drawCircular = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
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
      ctx.lineWidth = 2;
      ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
      ctx.shadowBlur = value / 15;
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
    ctx.shadowBlur = 0;
  };

  const drawParticles = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const avgLevel = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
    const spawnCount = Math.floor(avgLevel / 20);

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
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // gravity
      p.life -= 0.01;
      p.size *= 0.99;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Limit particles
    if (particlesRef.current.length > 500) {
      particlesRef.current = particlesRef.current.slice(-500);
    }
  };

  const drawEqualizer3D = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const rows = 16;
    const cols = 32;
    const cellW = width / cols;
    const cellH = 30;
    const step = Math.floor(bufferLength / cols);

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
        ctx.shadowBlur = 5;

        // 3D bar
        ctx.fillRect(x, y, cellW - 4, barH);

        // Top face
        ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 5, y - 5);
        ctx.lineTo(x + cellW - 4 + 5, y - 5);
        ctx.lineTo(x + cellW - 4, y);
        ctx.fill();

        // Side face
        ctx.fillStyle = `hsla(${hue}, 80%, 30%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x + cellW - 4, y);
        ctx.lineTo(x + cellW - 4 + 5, y - 5);
        ctx.lineTo(x + cellW - 4 + 5, y + barH - 5);
        ctx.lineTo(x + cellW - 4, y + barH);
        ctx.fill();
      }
    }
    ctx.shadowBlur = 0;
  };

  const drawGalaxy = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const avgLevel = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
    const centerX = width / 2;
    const centerY = height / 2;

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
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2 + timeRef.current * 0.1;
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
      ctx.shadowBlur = size * 3;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  };

  const drawLightning = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number) => {
    const avgLevel = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

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
        ctx.shadowBlur = 20;
        ctx.stroke();

        // Branch
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

export default Visualizer;
