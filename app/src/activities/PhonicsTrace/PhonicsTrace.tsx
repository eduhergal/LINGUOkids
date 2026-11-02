import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import './PhonicsTrace.css';

interface Props {
  letter: string;
  svgPath: string;
  onComplete: (score: number) => void;
}

function parsePath(d: string): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const commands = d.match(/[MLQCZ][^MLQCZ]*/gi) ?? [];
  for (const cmd of commands) {
    const type = cmd[0].toUpperCase();
    if (type === 'Z') continue;
    const nums = cmd.slice(1).trim().split(/[\s,]+/).map(Number);
    for (let i = 0; i < nums.length - 1; i += 2) {
      points.push({ x: nums[i], y: nums[i + 1] });
    }
  }
  return points;
}

function samplePath(svg: SVGPathElement, count: number) {
  const len = svg.getTotalLength();
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= count; i++) {
    const p = svg.getPointAtLength((i / count) * len);
    pts.push({ x: p.x, y: p.y });
  }
  return pts;
}

export function PhonicsTrace({ letter, svgPath, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guidePath = useRef<SVGPathElement>(null);
  const [progress, setProgress] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const checkpointsRef = useRef<boolean[]>([]);
  const sampledRef = useRef<Array<{ x: number; y: number }>>([]);
  const scaleRef = useRef(1);

  const VIEWBOX = 100;
  const TOLERANCE = 14;
  const CHECKPOINTS = 20;

  useEffect(() => {
    if (!guidePath.current) return;
    const pts = samplePath(guidePath.current, CHECKPOINTS);
    sampledRef.current = pts;
    checkpointsRef.current = new Array(pts.length).fill(false);
  }, [svgPath]);

  const getCanvasPoint = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scale = VIEWBOX / rect.width;
      return {
        x: (clientX - rect.left) * scale,
        y: (clientY - rect.top) * scale,
      };
    },
    [],
  );

  const drawDot = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#5ac9fa';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const checkProgress = useCallback(
    (px: number, py: number) => {
      const pts = sampledRef.current;
      const checks = checkpointsRef.current;
      let hit = false;
      for (let i = 0; i < pts.length; i++) {
        if (checks[i]) continue;
        const dx = px - pts[i].x;
        const dy = py - pts[i].y;
        if (dx * dx + dy * dy < TOLERANCE * TOLERANCE) {
          checks[i] = true;
          hit = true;
        }
      }
      if (hit) {
        const done = checks.filter(Boolean).length;
        const pct = Math.round((done / checks.length) * 100);
        setProgress(pct);
        if (pct >= 90) {
          const score = pct === 100 ? 3 : 2;
          setTimeout(() => onComplete(score), 400);
        }
      }
    },
    [onComplete],
  );

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      setDrawing(true);
      const p = getCanvasPoint(clientX, clientY);
      drawDot(p.x, p.y);
      checkProgress(p.x, p.y);
    },
    [getCanvasPoint, drawDot, checkProgress],
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!drawing) return;
      const p = getCanvasPoint(clientX, clientY);
      drawDot(p.x, p.y);
      checkProgress(p.x, p.y);
    },
    [drawing, getCanvasPoint, drawDot, checkProgress],
  );

  const handleEnd = useCallback(() => setDrawing(false), []);

  return (
    <div className="phonics-trace">
      <div className="phonics-trace__display">
        <span className="phonics-trace__letter-bg">{letter}</span>
        <svg
          className="phonics-trace__guide"
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        >
          <path
            ref={guidePath}
            d={svgPath}
            fill="none"
            stroke="var(--color-neutral-300)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="4 6"
          />
        </svg>
        <canvas
          ref={canvasRef}
          className="phonics-trace__canvas"
          width={VIEWBOX}
          height={VIEWBOX}
          onPointerDown={(e) => handleStart(e.clientX, e.clientY)}
          onPointerMove={(e) => handleMove(e.clientX, e.clientY)}
          onPointerUp={handleEnd}
          onPointerLeave={handleEnd}
        />
      </div>
      <div className="phonics-trace__progress">
        <motion.div
          className="phonics-trace__bar"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', damping: 20 }}
        />
      </div>
    </div>
  );
}
