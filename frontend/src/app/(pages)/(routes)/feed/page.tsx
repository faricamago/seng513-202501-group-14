// app/feed/page.tsx
import React from 'react';
import Feed from '@/components/feed';

const FeedPage: React.FC = () => {
  return (
    <div className="p-4">
      <Feed className="w-full" />
    </div>
  );
};

export default FeedPage;
