// src/components/Sprite.tsx
import { FC } from 'react';

interface ISpriteProps {
  src: string;
}

const Sprite: FC<ISpriteProps> = ({ src }) => <sprite src={src} />;

export default Sprite;