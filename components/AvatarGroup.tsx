import React from 'react';

const AvatarGroup: React.FC<{ count?: number }> = ({ count = 3 }) => {
  const avatars = [
    "https://picsum.photos/id/64/100/100",
    "https://picsum.photos/id/65/100/100",
    "https://picsum.photos/id/91/100/100",
    "https://picsum.photos/id/103/100/100",
    "https://picsum.photos/id/129/100/100",
  ];

  return (
    <div className="flex -space-x-2">
      {avatars.slice(0, count).map((src, i) => (
        <img
          key={i}
          className="w-6 h-6 rounded-full border-2 border-white object-cover"
          src={src}
          alt={`User ${i}`}
        />
      ))}
    </div>
  );
};

export default AvatarGroup;