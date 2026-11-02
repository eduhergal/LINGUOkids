import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/themes/ThemeContext';
import { hapticFeedback, playTone } from '@/services/feedback';
import './FreeWriteGame.css';

const COLORS = [
  { name: 'black', hex: '#222222' },
  { name: 'blue', hex: '#2196F3' },
  { name: 'red', hex: '#F44336' },
  { name: 'green', hex: '#4CAF50' },
  { name: 'purple', hex: '#9C27B0' },
  { name: 'orange', hex: '#FF9800' },
];

const WIDTHS = [
  { label: 'thin', size: 2 },
  { label: 'medium', size: 5 },
  { label: 'thick', size: 10 },
];

const LETTER_PATHS: Record<string, string> = {
  A: 'M 20 80 L 50 20 L 80 80 M 32 55 L 68 55',
  B: 'M 25 20 L 25 80 M 25 20 Q 70 20 70 50 Q 70 80 25 80 M 25 50 Q 65 50 65 50',
  C: 'M 75 30 Q 20 10 20 50 Q 20 90 75 70',
  D: 'M 25 20 L 25 80 M 25 20 Q 80 20 80 50 Q 80 80 25 80',
  E: 'M 70 20 L 25 20 L 25 80 L 70 80 M 25 50 L 60 50',
  F: 'M 70 20 L 25 20 L 25 80 M 25 50 L 55 50',
  G: 'M 75 30 Q 20 10 20 50 Q 20 90 75 70 L 75 50 L 55 50',
  H: 'M 25 20 L 25 80 M 75 20 L 75 80 M 25 50 L 75 50',
  I: 'M 35 20 L 65 20 M 50 20 L 50 80 M 35 80 L 65 80',
  J: 'M 35 20 L 75 20 M 60 20 L 60 65 Q 60 80 45 80 Q 30 80 25 65',
  K: 'M 25 20 L 25 80 M 70 20 L 25 50 L 70 80',
  L: 'M 25 20 L 25 80 L 70 80',
  M: 'M 15 80 L 15 20 L 50 55 L 85 20 L 85 80',
  N: 'M 20 80 L 20 20 L 80 80 L 80 20',
  O: 'M 50 20 Q 80 20 80 50 Q 80 80 50 80 Q 20 80 20 50 Q 20 20 50 20',
  P: 'M 25 80 L 25 20 Q 75 20 75 40 Q 75 55 25 55',
  Q: 'M 50 20 Q 80 20 80 50 Q 80 80 50 80 Q 20 80 20 50 Q 20 20 50 20 M 60 65 L 80 85',
  R: 'M 25 80 L 25 20 Q 75 20 75 40 Q 75 55 25 55 M 50 55 L 75 80',
  S: 'M 70 28 Q 50 15 30 28 Q 15 40 50 50 Q 85 60 70 75 Q 50 88 30 75',
  T: 'M 20 20 L 80 20 M 50 20 L 50 80',
  U: 'M 20 20 L 20 60 Q 20 80 50 80 Q 80 80 80 60 L 80 20',
  V: 'M 20 20 L 50 80 L 80 20',
  W: 'M 10 20 L 30 80 L 50 40 L 70 80 L 90 20',
  X: 'M 20 20 L 80 80 M 80 20 L 20 80',
  Y: 'M 20 20 L 50 50 L 80 20 M 50 50 L 50 80',
  Z: 'M 20 20 L 80 20 L 20 80 L 80 80',
};

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

interface Props {
  letter?: string;
  onComplete: (stars: number) => void;
}

export function FreeWriteGame({ letter, onComplete }: Props) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeColor, setActiveColor] = useState(COLORS[0].hex);
  const [activeWidth, setActiveWidth] = useState(WIDTHS[1].size);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const drawingRef = useRef(false);
  const [, forceUpdate] = useState(0);

  const getCanvasPoint = useCallback((e: PointerEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    const gridSize = 30;
    ctx.strokeStyle = `${theme.colors.primary}18`;
    ctx.lineWidth = 1;
    for (let x = gridSize; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = gridSize; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw all strokes
    for (const stroke of strokesRef.current) {
      drawStroke(ctx, stroke);
    }

    // Draw current stroke
    if (currentStrokeRef.current.length > 0) {
      drawStroke(ctx, {
        points: currentStrokeRef.current,
        color: activeColor,
        width: activeWidth,
      });
    }
  }, [activeColor, activeWidth, theme.colors.primary]);

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const pts = stroke.points;
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const midX = (pts[i].x + pts[i + 1].x) / 2;
      const midY = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
    }
    if (pts.length > 1) {
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    }
    ctx.stroke();
  };

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    redraw();
  }, [redraw]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      drawingRef.current = true;
      const pt = getCanvasPoint(e);
      if (pt) {
        currentStrokeRef.current = [pt];
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      const pt = getCanvasPoint(e);
      if (pt) {
        currentStrokeRef.current.push(pt);
        redraw();
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      drawingRef.current = false;
      if (currentStrokeRef.current.length > 1) {
        strokesRef.current.push({
          points: [...currentStrokeRef.current],
          color: activeColor,
          width: activeWidth,
        });
      }
      currentStrokeRef.current = [];
      forceUpdate((n) => n + 1);
      redraw();
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, [activeColor, activeWidth, getCanvasPoint, redraw]);

  const handleUndo = () => {
    if (strokesRef.current.length === 0) return;
    strokesRef.current.pop();
    forceUpdate((n) => n + 1);
    redraw();
    hapticFeedback('light');
  };

  const handleClear = () => {
    strokesRef.current = [];
    currentStrokeRef.current = [];
    forceUpdate((n) => n + 1);
    redraw();
    hapticFeedback('light');
  };

  const handleDone = () => {
    hapticFeedback('success');
    playTone('complete');
    onComplete(3);
  };

  const modelPath = letter ? LETTER_PATHS[letter.toUpperCase()] : null;

  return (
    <div className="freewrite-game">
      <div className="freewrite-game__canvas-wrap" ref={wrapRef}>
        {modelPath && (
          <div className="freewrite-game__model">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path
                d={modelPath}
                fill="none"
                stroke={theme.colors.primary}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="freewrite-game__canvas"
          style={{ position: 'relative', zIndex: 2 }}
        />
      </div>

      <div className="freewrite-game__toolbar">
        <div className="freewrite-game__colors">
          {COLORS.map((c) => (
            <motion.button
              key={c.name}
              className={`freewrite-game__color ${activeColor === c.hex ? 'freewrite-game__color--active' : ''}`}
              style={{ background: c.hex }}
              onClick={() => setActiveColor(c.hex)}
              whileTap={{ scale: 0.9 }}
              aria-label={c.name}
            />
          ))}
        </div>

        <div className="freewrite-game__separator" />

        <div className="freewrite-game__widths">
          {WIDTHS.map((w) => (
            <button
              key={w.label}
              className={`freewrite-game__width ${activeWidth === w.size ? 'freewrite-game__width--active' : ''}`}
              onClick={() => setActiveWidth(w.size)}
              aria-label={w.label}
            >
              <div
                className="freewrite-game__width-dot"
                style={{ width: w.size * 2 + 4, height: w.size * 2 + 4 }}
              />
            </button>
          ))}
        </div>

        <div className="freewrite-game__separator" />

        <div className="freewrite-game__actions">
          <button
            className="freewrite-game__action-btn"
            onClick={handleUndo}
            disabled={strokesRef.current.length === 0}
            aria-label="Undo"
          >
            ↩️
          </button>
          <button
            className="freewrite-game__action-btn"
            onClick={handleClear}
            aria-label="Clear"
          >
            🗑️
          </button>
          <motion.button
            className="freewrite-game__action-btn freewrite-game__action-btn--done"
            onClick={handleDone}
            whileTap={{ scale: 0.9 }}
            style={{ background: theme.colors.primary }}
            aria-label="Done"
          >
            ✅
          </motion.button>
        </div>
      </div>
    </div>
  );
}
