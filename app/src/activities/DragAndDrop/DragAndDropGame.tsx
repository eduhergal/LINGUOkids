import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import './DragAndDropGame.css';

interface DragItem {
  id: string;
  emoji: string;
  label: { en: string; es: string };
}

interface DropZone {
  id: string;
  label: { en: string; es: string };
  accepts: string[];
}

interface Props {
  items: DragItem[];
  zones: DropZone[];
  onComplete: (score: number) => void;
}

export function DragAndDropGame({ items, zones, onComplete }: Props) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState(0);
  const [dragging, setDragging] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const remaining = items.filter((it) => !placed[it.id]);

  const handleDragEnd = useCallback(
    (itemId: string, e: PointerEvent | MouseEvent | TouchEvent) => {
      setDragging(null);

      const clientX = 'touches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;

      const zoneEls = containerRef.current?.querySelectorAll<HTMLElement>('[data-zone-id]');
      if (!zoneEls) return;

      for (const el of zoneEls) {
        const rect = el.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          const zoneId = el.dataset.zoneId!;
          const zone = zones.find((z) => z.id === zoneId);
          if (zone?.accepts.includes(itemId)) {
            setPlaced((prev) => {
              const next = { ...prev, [itemId]: zoneId };
              if (Object.keys(next).length === items.length) {
                const score = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
                setTimeout(() => onComplete(score), 500);
              }
              return next;
            });
          } else {
            setErrors((e) => e + 1);
          }
          return;
        }
      }
    },
    [zones, items, errors, onComplete],
  );

  return (
    <div className="dnd" ref={containerRef}>
      <div className="dnd__zones">
        {zones.map((zone) => {
          const placedItems = items.filter((it) => placed[it.id] === zone.id);
          return (
            <div key={zone.id} className="dnd__zone" data-zone-id={zone.id}>
              <span className="dnd__zone-label">{zone.label.es || zone.label.en}</span>
              <div className="dnd__zone-items">
                {placedItems.map((it) => (
                  <span key={it.id} className="dnd__placed">{it.emoji}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="dnd__items">
        {remaining.map((item) => (
          <motion.div
            key={item.id}
            className={`dnd__item ${dragging === item.id ? 'dnd__item--dragging' : ''}`}
            drag
            dragSnapToOrigin
            onDragStart={() => setDragging(item.id)}
            onDragEnd={(_, info) => {
              const el = containerRef.current;
              if (!el) return;
              const fakeEvent = new MouseEvent('mouseup', {
                clientX: (info.point as any).x,
                clientY: (info.point as any).y,
              });
              handleDragEnd(item.id, fakeEvent);
            }}
            whileDrag={{ scale: 1.15, zIndex: 10 }}
          >
            <span className="dnd__item-emoji">{item.emoji}</span>
            <span className="dnd__item-label">{item.label.es || item.label.en}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
