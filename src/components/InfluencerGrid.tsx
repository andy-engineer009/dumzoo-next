'use client';

import InfluencerCard from './InfulancerCard';

interface Influencer {
  id: number;
  name: string;
  image: string;
  isVerified: boolean;
  location: string;
  category: string;
  followers: number;
  startingPrice: number;
  instagramUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
}

interface InfluencerGridProps {
  influencers: Influencer[];
//   onViewDetails: (id: string) => void;
}

const InfluencerGrid = ({ influencers, }: InfluencerGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0">
      {influencers.map((influencer) => (
        <InfluencerCard
          key={influencer.id}
          {...influencer}
        //   onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default InfluencerGrid; 