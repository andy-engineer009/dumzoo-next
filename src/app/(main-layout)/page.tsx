'use client';

import Filters from "@/components/Filters";
import InfluencerGrid from "@/components/InfluencerGrid";
import InfluencerCard from "@/components/InfulancerCard";
import SearchAndFilter from "@/components/searchAndFilter";
import UserRolePopup from "@/components/userRolePopup";
import ProfileSwitcher from "@/components/profile-switcher";
import Image from "next/image";

//theme color image
// https://dribbble.com/shots/20245319-fenzy-for-Sellers-Visual-Design

const influencers = [ 
  {
    id:1,
    name: "John Doe",
    image: "/images/women.png",
    isVerified: true,
    location: "New York",
    category: "Fashion",
    followers: 1000,
    startingPrice: 1000,
    instagramUrl: "https://www.instagram.com/john_doe",
    youtubeUrl: "https://www.youtube.com/john_doe", 
    facebookUrl: "https://www.facebook.com/john_doe",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Andrii",
    image: "/images/men.png",
    isVerified: true,
    location: "New York",
    category: "Fashion",
    followers: 1000,
    startingPrice: 1000,
    isFeatured: true,
  },
  {
    id: 3,
    name: "mak",
    image: "/images/men.png",
    isVerified: true,
    location: "New York",
    category: "Fashion",
    followers: 1000,
    startingPrice: 1000,
  },
  {
    id: 4,
    name: "Sasha",
    image: "/images/women.png",
    isVerified: true,
    location: "New York",
    category: "Fashion",
    followers: 1000,
    startingPrice: 1000,
  },
  // {
  //   id: 5,
  //   name: "Sasha",
  //   image: "https://apollo.olx.in/v1/files/1mfuey8oh35o3-IN/image;s=300x600;q=60",
  //   isVerified: true,
  //   location: "New York",
  //   category: "Fashion",
  //   followers: 1000,
  //   startingPrice: 1000,
  // },
  // {
  //   id: 6,
  //   name: "Sasha",
  //   image: "https://apollo.olx.in/v1/files/1mfuey8oh35o3-IN/image;s=300x600;q=60",
  //   isVerified: true,
  //   location: "New York",
  //   category: "Fashion",
  //   followers: 1000,
  //   startingPrice: 1000,
  // },
  // {
  //   id: 7,
  //   name: "Sasha",
  //   image: "https://apollo.olx.in/v1/files/1mfuey8oh35o3-IN/image;s=300x600;q=60",
  //   isVerified: true,
  //   location: "New York",
  //   category: "Fashion",
  //   followers: 1000,
  //   startingPrice: 1000,
  // },
  // {
  //   id: 8,
  //   name: "Sasha",
  //   image: "https://apollo.olx.in/v1/files/1mfuey8oh35o3-IN/image;s=300x600;q=60",
  //   isVerified: true,
  //   location: "New York",
  //   category: "Fashion",
  //   followers: 1000,
  //   startingPrice: 1000,
  // },
  // {
  //   id: 9,
  //   name: "Sasha",
  //   image: "https://apollo.olx.in/v1/files/1mfuey8oh35o3-IN/image;s=300x600;q=60",
  //   isVerified: true,
  //   location: "New York",
  //   category: "Fashion",
  //   followers: 1000,
  //   startingPrice: 1000,
  // },
  // {
  //   id: "1",
  //   name: "Sasha",
  //   image: "https://apollo.olx.in/v1/files/1mfuey8oh35o3-IN/image;s=300x600;q=60",
  //   isVerified: true,
  //   location: "New York",
  //   category: "Fashion",
  //   followers: 1000,
  //   startingPrice: 1000,
  // },
  // {
  //   id: "1",
  //   name: "Sasha",
  //   image: "https://apollo.olx.in/v1/files/1mfuey8oh35o3-IN/image;s=300x600;q=60",
  //   isVerified: true,
  //   location: "New York",
  //   category: "Fashion",
  //   followers: 1000,
  //   startingPrice: 1000,
  // },
  // {
  //   id: "1",
  //   name: "Sasha",
  //   image: "https://apollo.olx.in/v1/files/1mfuey8oh35o3-IN/image;s=300x600;q=60",
  //   isVerified: true,
  //   location: "New York",
  //   category: "Fashion",
  //   followers: 1000,
  //   startingPrice: 1000,
  // },
];

export default function Home() {
  return (
    <div>
      {/* logobar */}
    <div className=" top-0 left-0 right-0 z-50 px-4 py-3 flex justify-between items-center h-14 md:hidden absolute w-full
    ">
  <div className="flex items-center">
    <svg className="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1-9h-2V6h2v2zm0 4h-2v-2h2v2z"/>
    </svg>
    <span className="ml-2 font-bold text-lg text-white">Hi Andy</span>
  </div>

  {/* <div className="flex items-center space-x-2">
    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">v1.0</span>
    <button className="p-1 rounded-full hover:bg-gray-100">
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
      </svg>
    </button>
  </div> */}
  {/* <ProfileSwitcher></ProfileSwitcher> */}
</div>

  {/* hero section */}
  <div className="flex items-center h-[200px] bg-[#04308e] box-sizing: border-box overflow-hidden">
      {/* <div></div> */}
    <Image src="/images/offer-1.jpg" alt="home-banner" width={100} height={200} style={{width: '100%', height: '100%',objectFit :'contain'}} />
  </div>

  {/*  */}




            {/* <div className="w-full bg-white p-4">
              <div className="max-w-4xl mx-auto px-4">
                <SearchAndFilter
                  placeholder="Search for influencers, brands, or campaigns..."
                  className="w-full"
                  onSearch={(values) => {         
                    console.log('Search values:', values);
                    // Handle search here
                  }}
                />
              </div>
            </div> */}
              <UserRolePopup />

              {/* home bnner */}

              {/* <div>
                <Image src="/images/home-banner.png" alt="home-banner" width={1000} height={200} style={{width: '100%', height: '200px',objectFit :'cover'}} />
              </div> */}

        {/* category section */}

      {/* Category Section */}
      {(() => {
        const categories = [
          {
            id: 1,
            name: 'Fashion',
            icon: (
              <div className="w-[60px] h-[60px] flex items-center justify-center rounded-lg" style={{backgroundColor: '#d4e2e1'}}>
                <Image src="/images/icons/icon-1.svg" alt="fashion-beauty" width={24} height={24} />
              </div>
            )
          },
          {
            id: 2,
            name: 'Technology',
            icon: (
              <div className="w-[60px] h-[60px] flex items-center justify-center rounded-lg" style={{backgroundColor: '#d4e2e1'}}>
                <Image src="/images/icons/icon-2.svg" alt="fashion-beauty" width={24} height={24} />
              </div>
            )
          },
          {
            id: 3,
            name: 'Fitness',
            icon: (
              <div className="w-[60px] h-[60px] flex items-center justify-center rounded-lg" style={{backgroundColor: '#d4e2e1'}}>
                  <Image src="/images/icons/icon-3.svg" alt="fashion-beauty" width={24} height={24} />
              </div>
            )
          },
          {
            id: 4,
            name: 'Food',
            icon: (
              <div className="w-[60px] h-[60px] flex items-center justify-center rounded-lg" style={{backgroundColor: '#d4e2e1'}}>
                  <Image src="/images/icons/icon-4.svg" alt="fashion-beauty" width={24} height={24} />
              </div>
            )
          },
          {
            id: 5,
            name: 'Travel',
            icon: (
              <div className="w-[60px] h-[60px] flex items-center justify-center rounded-lg" style={{backgroundColor: '#d4e2e1'}}>
                <Image src="/images/icons/icon-5.svg" alt="fashion-beauty" width={24} height={24} />
              </div>
            )
          },
          {
            id: 6,
            name: 'Lifestyle',
            icon: (
              <div className="w-[60px] h-[60px] flex items-center justify-center rounded-lg" style={{backgroundColor: '#d4e2e1'}}>
                <Image src="/images/icons/icon-1.svg" alt="fashion-beauty" width={24} height={24} />
              </div>
            )
          },
          {
            id: 7,
            name: 'Gaming',
            icon: (
              <div className="w-[60px] h-[60px] flex items-center justify-center rounded-lg" style={{backgroundColor: '#d4e2e1'}}>
                <Image src="/images/icons/icon-2.svg" alt="fashion-beauty" width={24} height={24} />
              </div>
            )
          },
          {
            id: 8,
            name: 'All',
            icon: (
              <div className="w-[60px] h-[60px] flex items-center justify-center rounded-lg" style={{backgroundColor: '#d4e2e1'}}>
                <Image src="/images/icons/icon-3.svg" alt="fashion-beauty" width={24} height={24} />
              </div>
            )
          },
        ];

        return (
          <div
            className="max-w-5xl mx-auto px-4 py-6 rounded-t-[20px]"
            style={{
              background: '#FFFF',
              marginTop: '-23px',
              zIndex: 1,
              position: 'relative'
            }}
          >
            <div className="flex overflow-x-auto hide-scrollbar space-x-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col items-center min-w-[80px] flex-shrink-0 me-0"
                >
                  {category.icon}
                  <span className="text-sm text-[14px] font-[600] text-center mt-2 text-[#1f1f1f] whitespace-nowrap">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}


  {/* const categories = [
    {
      id: 1,
      name: 'Fashion & Beauty',
      icon: (
        <Image src="/images/icon_basket.svg" alt="fashion-beauty" width={30} height={30} />
      ),
      backgroundColor: '#f8e4ff'
    },
    {
      id: 2,
      name: 'Technology',
      icon: (
        <Image src="/images/icon_delete.svg" alt="technology" width={30} height={30} />
      ),
      backgroundColor: '#e4ffed'
    },
    {
      id: 3,
      name: 'Fitness & Health',
      icon: (
        <Image src="/images/icon_basket.svg" alt="fitness-health" width={30} height={30} />
      ),
      backgroundColor: '#ffe4e4'
    },
    {
      id: 4,
      name: 'Food & Cooking',
      icon: (
        <Image src="/images/icon_delete.svg" alt="food-cooking" width={30} height={30} />
      ),
      backgroundColor: '#fff5e4'
    },
    {
      id: 5,
      name: 'Travel',
      icon: (
        <Image src="/images/icon_basket.svg" alt="travel" width={30} height={30} />
      ),
      backgroundColor: '#e4f0ff'
    },
    {
      id: 6,
      name: 'Lifestyle',
      icon: (
        <Image src="/images/icon_delete.svg" alt="lifestyle" width={30} height={30} />
      ),
      backgroundColor: '#ffe4f7'
    },
    {
      id: 7,
      name: 'Gaming',
      icon: (
        <Image src="/images/icon_basket.svg" alt="gaming" width={30} height={30} />
      ),
      backgroundColor: '#e4fffc'
    },
    {
      id: 8,
      name: 'Education',
      icon: (
        <Image src="/images/icon_delete.svg" alt="education" width={30} height={30} />
      ),
      backgroundColor: '#fff3e4'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className=""
          >
            <div className=" h-[60px] flex flex-col items-center justify-center rounded-lg shadow-sm p-2 cursor-pointer transition-all hover:shadow-md group" style={{backgroundColor: category.backgroundColor}}>
              {category.icon}
            </div>
            <span className="text-sm text-[12px] font-[500] text-gray-900 text-center leading-tight text-center block mt-3">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
})()} */}



      {/* top featured influencers */}
     <div className="w-full mx-auto mt-2 px-4 md:px-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-gray-800">Top Trending </h3>
          <button className="text-blue-600 hover:text-blue-700 font-[500] text-[14px]">View All</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-4 md:pb-0">
          {influencers.slice(0, 10).map((influencer, index) => (
            <div key={index} className="">
              <InfluencerCard key={index} {...influencer} />
            </div>
          ))}
        </div>
      </div>
      
            <div className="w-full mx-auto mt-2 px-4 md:px-8">
              <div className="h-[60px] bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <div className="text-2xl font-bold text-white">Your Ads</div>
              </div>
            </div>
            

  {/*<div className="w-full mx-auto mt-5 px-4 md:px-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-gray-800">Trending Influencers</h3>
          <button className="text-blue-600 hover:text-blue-700 font-[500] text-[14px]">View All</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0">
          {influencers.slice(0, 10).map((influencer, index) => (
            <div key={index} className="">
              <InfluencerCard key={index} {...influencer} />
            </div>
          ))}
        </div>
      </div> */}


    

  
                  {/* trending influencers */}
          {/* <div className="w-full mx-auto mt-3 px-4 md:px-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-gray-800">Near By Influencers</h3>
          <button className="text-blue-600 hover:text-blue-700 font-[500] text-[14px]">View All</button>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar">
          {influencers.slice(0, 10).map((influencer, index) => (
            <div key={index} className="flex-none w-40">
              <InfluencerCard key={index} {...influencer} />
            </div>
          ))}
        </div>
      </div> */}


      {/* <div className="flex mt-4 p-4 md:p-8 items-start">
        <div className=" md:pl-9" style={{flex: 1}}>
          <InfluencerGrid influencers={influencers} />
        </div>
      </div> */}
    </div>
  );
}
