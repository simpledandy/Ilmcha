export type Island = {
  id: string;
  title: string;
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
};

export const islands: Island[] = [
  {
    id: 'numbers',
    title: 'Numeriya',
    x: 400,
    y: 500,
    size: 'medium',
  },
  {
    id: 'letters',
    title: 'Alifboland',
    x: 100,
    y: 200,
    size: 'large',
  },
  {
    id: 'shapes',
    title: 'Shaklandiya',
    x: 700,
    y: 300,
    size: 'medium',
  },
  {
    id: 'colors',
    title: 'Rangoria',
    x: 900,
    y: 400,
    size: 'small',
  },
  {
    id: 'time',
    title: 'Vaqtriya',
    x: 1100,
    y: 500,
    size: 'large',
  }
]; 