import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import './MemoryCardsGame.css';

interface Props {
  cards: string[];
  onComplete: (score: number) => void;
}

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

export function MemoryCardsGame({ cards: cardEmojis, onComplete }: Props) {
  const initialCards = useMemo(() => {
    const doubled = cardEmojis.flatMap((emoji, i) => [
      { id: i * 2, emoji, flipped: false, matched: false },
      { id: i * 2 + 1, emoji, flipped: false, matched: false },
    ]);
    return doubled.sort(() => Math.random() - 0.5);
  }, [cardEmojis]);

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);
  const [locked, setLocked] = useState(false);

  const handleFlip = useCallback(
    (id: number) => {
      if (locked) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.flipped || card.matched) return;

      const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
      setCards(next);
      const nextFlipped = [...flippedIds, id];
      setFlippedIds(nextFlipped);

      if (nextFlipped.length === 2) {
        setLocked(true);
        const [first, second] = nextFlipped.map((fid) => next.find((c) => c.id === fid)!);

        if (first.emoji === second.emoji) {
          const matched = next.map((c) =>
            c.id === first.id || c.id === second.id ? { ...c, matched: true } : c,
          );
          setCards(matched);
          setFlippedIds([]);
          setLocked(false);
          if (matched.every((c) => c.matched)) {
            const score = errors === 0 ? 3 : errors <= 3 ? 2 : 1;
            setTimeout(() => onComplete(score), 500);
          }
        } else {
          setErrors((e) => e + 1);
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first.id || c.id === second.id ? { ...c, flipped: false } : c,
              ),
            );
            setFlippedIds([]);
            setLocked(false);
          }, 700);
        }
      }
    },
    [cards, flippedIds, locked, errors, onComplete],
  );

  const cols = cardEmojis.length <= 4 ? 4 : 4;

  return (
    <div className="memory" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {cards.map((card) => (
        <motion.button
          key={card.id}
          className={`memory__card ${card.flipped || card.matched ? 'memory__card--face' : ''} ${card.matched ? 'memory__card--matched' : ''}`}
          onClick={() => handleFlip(card.id)}
          whileTap={{ scale: 0.9 }}
        >
          {card.flipped || card.matched ? (
            <span className="memory__emoji">{card.emoji}</span>
          ) : (
            <span className="memory__back">?</span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
