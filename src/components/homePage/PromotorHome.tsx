'use client'

import Image from "next/image";
import { motion } from 'framer-motion';
import { selectUserRole, selectIsLoggedIn } from '@/store/userRoleSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Basic } from "next/font/google";
import Link from "next/link";
// const influencers = [ 
//   {
//     id:1,
//     name: "John Doe",
//     image: "/images/women.png",
//     isVerified: true,
//     location: "New York",
//     category: "Fashion",
//     followers: 1000,
//     startingPrice: 1000,
//     instagramUrl: "https://www.instagram.com/john_doe",
//     youtubeUrl: "https://www.youtube.com/john_doe", 
//     facebookUrl: "https://www.facebook.com/john_doe",
//     isFeatured: true,
//   },
//   {
//     id: 2,
//     name: "Andrii",
//     image: "/images/men.png",
//     isVerified: true,
//     location: "New York",
//     category: "Fashion",
//     followers: 1000,
//     startingPrice: 1000,
//     isFeatured: true,
//   },
//   {
//     id: 3,
//     name: "mak",
//     image: "/images/men.png",
//     isVerified: true,
//     location: "New York",
//     category: "Fashion",
//     followers: 1000,
//     startingPrice: 1000,
//   },
//   {
//     id: 4,
//     name: "Sasha",
//     image: "/images/women.png",
//     isVerified: true,
//     location: "New York",
//     category: "Fashion",
//     followers: 1000,
//     startingPrice: 1000,
//   },
// ];

const newCreators = [
  {
    image: '/images/women.png',
    name: 'Emma Smith',
    followers: '12.4k'
  },
  {
    image: '/images/men.png',
    name: 'James Wilson',
    followers: '45.2k'
  },
  {
    image: '/images/women.png',
    name: 'Sofia Garcia',
    followers: '89.7k'
  },
  {
    image: '/images/men.png',
    name: 'Lucas Chen',
    followers: '234.5k'
  },
  {
    image: '/images/women.png',
    name: 'Olivia Brown',
    followers: '567.8k'
  },
  {
    image: '/images/women.png',
    name: 'Aiden Taylor',
    followers: '1.2M'
  }
]

const paidPromotionsList = [
  {
    image: null,
    tilte: 'Fitness App Campaign',
    budget: 5000
  },
  {
    image: null,
    tilte: 'Food Delivery Service Launch',
    budget: 8000
  },
  {
    image: null,
    tilte: 'Fashion Brand Collection',
    budget: 12000
  },
  {
    image: null,
    tilte: 'Mobile Game Promotion',
    budget: 6500
  },
  {
    image: null,
    tilte: 'Beauty Products Campaign',
    budget: 9000
  },
  {
    image: null,
    tilte: 'Travel App Marketing',
    budget: 7500
  }
]

// Testimonials data array
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Influencer",
    message: "This platform has completely transformed my influencer journey. The opportunities are endless!",
    image: "/images/women.png"
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Business Founder",
    message: "Found the perfect influencers for my brand. ROI has been incredible!",
    image: "/images/men.png"
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Content Creator",
    message: "The collaboration process is so smooth. Love working with brands here!",
    image: "/images/women.png"
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    role: "Marketing Director",
    message: "Best platform for influencer marketing. Highly recommend to everyone!",
    image: "/images/men.png"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Fashion Influencer",
    message: "Amazing community and great opportunities. My follower growth has been phenomenal!",
    image: "/images/women.png"
  },
  {
    id: 6,
    name: "David Kim",
    role: "Tech Entrepreneur",
    message: "The platform connects the right people at the right time. Game changer!",
    image: "/images/men.png"
  }
];

export default function PromotorHome() {
    const router = useRouter();
    const userRole = useSelector(selectUserRole);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [activeTab, setActiveTab] = useState('influencer');

    // Helper function to render testimonials
    const renderTestimonials = (testimonialsData: typeof testimonials) => {
        return testimonialsData.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                 <p className="text-sm text-gray-700 leading-relaxed">
                            "{testimonial.message}"
                        </p>
                <div className="flex items-start space-x-3 mt-3">
                    <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex-shrink-0">
                        <Image
                            src={testimonial.image}
                            alt="User"
                            width={30}
                            height={30}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm">{testimonial.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{testimonial.role}</p>
                     
                    </div>
                </div>
            </div>
        ));
    };

    useEffect(() => {
        if(isLoggedIn) {    
            setIsLoadingData(false);
        }
    }, [isLoggedIn]);

    // useEffect(() => {
    //     console.log(userRole, 'userRole');
    // }, [userRole]);

  return (
    // {(!isLoggedIn || userRole === '3' || userRole === null) &&
    <>
    <div className="home-wrapper pb-[20px]">
    {/* <div className="fixed top-0 left-0 right-0 z-50 bg-black py-3 px-4 flex items-center justify-between">
      <div className="text-white text-sm font-bold">
       
<svg width="100" height="50" viewBox="0 0 239 87" fill="white" xmlns="http://www.w3.org/2000/svg">
<path d="M8.256 19.56C13.4187 19.9867 18.1973 21.2667 22.592 23.4C26.9867 25.5333 30.464 28.2213 33.024 31.464C35.584 34.664 36.864 38.0347 36.864 41.576C36.864 44.6907 35.4987 48.1253 32.768 51.88C30.0373 55.6347 26.7093 58.8133 22.784 61.416C18.9013 64.0187 15.36 65.32 12.16 65.32C11.0933 65.32 9.728 64.7867 8.064 63.72C6.44267 62.6533 5.01333 61.4373 3.776 60.072C2.53867 58.664 1.92 57.5547 1.92 56.744C1.92 56.0187 2.34667 53.992 3.2 50.664C4.05333 47.208 4.75733 44.0933 5.312 41.32C5.52533 40.2533 5.99467 38.376 6.72 35.688C6.80533 35.304 7.01867 34.536 7.36 33.384C7.70133 32.1893 7.95733 31.1013 8.128 30.12L5.504 29.992C4.82133 28.6267 4.48 27.2613 4.48 25.896C4.48 24.616 4.8 23.4427 5.44 22.376C6.08 21.2667 7.01867 20.328 8.256 19.56ZM12.16 56.936C16.4267 54.7173 19.968 52.008 22.784 48.808C25.6427 45.608 27.072 42.6 27.072 39.784C27.072 38.12 26.0693 36.52 24.064 34.984C22.1013 33.448 19.84 32.424 17.28 31.912C16.768 34.5147 16 38.248 14.976 43.112C13.696 49.1707 12.7573 53.7787 12.16 56.936ZM74.3475 21.928C74.8595 25.0427 75.1155 28.0507 75.1155 30.952C75.1155 37.3093 74.0915 43.112 72.0435 48.36C69.9955 53.608 67.3288 57.7467 64.0435 60.776C60.7582 63.8053 57.4088 65.32 53.9955 65.32C52.2888 65.32 50.3048 64.7013 48.0435 63.464C45.8248 62.184 43.9048 60.6693 42.2835 58.92C40.6622 57.128 39.8515 55.5493 39.8515 54.184C39.8515 51.1973 40.3635 46.3973 41.3875 39.784C42.4115 33.1707 43.6275 27.432 45.0355 22.568C46.4435 21.8853 47.9155 21.544 49.4515 21.544C51.0728 21.544 52.4808 21.992 53.6755 22.888C54.8702 23.7413 55.6808 24.9573 56.1075 26.536C54.8702 29.3947 53.6542 33.4267 52.4595 38.632C51.3075 43.8373 50.7315 48.0827 50.7315 51.368C50.7315 54.568 51.3502 56.168 52.5875 56.168C54.4222 56.168 56.2142 54.9947 57.9635 52.648C59.7128 50.2587 61.1422 47.1867 62.2515 43.432C63.3608 39.6347 63.9155 35.7947 63.9155 31.912C63.9155 29.0107 63.5742 26.28 62.8915 23.72C65.0248 21.3733 67.2862 20.2 69.6755 20.2C71.3395 20.2 72.8968 20.776 74.3475 21.928ZM85.414 65C84.4327 65 83.2593 64.6587 81.894 63.976C80.5713 63.2507 79.398 62.3973 78.374 61.416C77.3927 60.4347 76.902 59.624 76.902 58.984C76.8593 58.3013 77.0513 56.872 77.478 54.696C77.9473 52.4773 78.246 51.048 78.374 50.408C78.5447 49.5547 78.8647 47.9973 79.334 45.736C79.8033 43.432 80.1873 41.2987 80.486 39.336L80.998 36.328C81.8087 31.5493 82.5553 27.6667 83.238 24.68C83.9633 21.6933 84.6887 20.2 85.414 20.2C86.1393 20.2 87.1207 20.4987 88.358 21.096C89.638 21.6933 90.8327 22.4613 91.942 23.4C93.0513 24.296 93.798 25.1493 94.182 25.96C94.8647 27.496 95.7607 30.7813 96.87 35.816C97.638 39.3147 98.214 41.7253 98.598 43.048C100.433 40.2747 102.779 36.0293 105.638 30.312C107.473 26.6853 108.859 24.104 109.798 22.568C110.779 20.9893 111.654 20.2 112.422 20.2C113.233 20.2 114.321 20.5627 115.686 21.288C117.094 22.0133 118.31 22.8667 119.334 23.848C120.401 24.8293 120.934 25.6827 120.934 26.408C120.934 27.0053 120.678 28.6907 120.166 31.464C119.654 34.1947 119.334 35.9013 119.206 36.584L117.542 45.608C117.115 48.1253 116.667 51.432 116.198 55.528C115.771 59.0267 115.387 61.48 115.046 62.888C114.747 64.296 114.257 65 113.574 65C112.593 65 111.419 64.6587 110.054 63.976C108.731 63.2507 107.558 62.3973 106.534 61.416C105.553 60.4347 105.062 59.624 105.062 58.984C105.019 58.4293 105.169 57.256 105.51 55.464C105.894 53.6293 106.321 51.56 106.79 49.256C107.174 47.4213 107.387 46.376 107.43 46.12L109.734 39.016L108.838 38.696L108.198 39.976C106.534 43.3893 105.19 46.056 104.166 47.976C103.185 49.8533 102.374 51.1973 101.734 52.008C101.307 52.52 100.539 52.9467 99.43 53.288C98.3207 53.5867 97.2327 53.736 96.166 53.736C95.0567 53.736 94.31 53.544 93.926 53.16C93.542 52.8187 93.2007 52.1147 92.902 51.048C92.646 49.9387 92.2833 48.232 91.814 45.928C91.7287 45.4587 91.494 44.328 91.11 42.536C90.726 40.7013 90.2993 39.0373 89.83 37.544L89.382 45.608C88.9553 48.1253 88.5073 51.432 88.038 55.528C87.6113 59.0267 87.2273 61.48 86.886 62.888C86.5873 64.296 86.0967 65 85.414 65Z" fill="white"/>
<path d="M128.456 54.264C130.483 51.3627 132.52 48.5467 134.568 45.816C136.637 43.0853 138.685 40.376 140.712 37.688C142.76 35 144.733 32.2693 146.632 29.496C147.187 28.6853 147.347 28.0773 147.112 27.672C146.877 27.2453 146.291 27.0213 145.352 27C142.984 26.936 140.605 26.904 138.216 26.904C135.827 26.904 133.448 26.872 131.08 26.808C129.843 26.7653 128.893 26.552 128.232 26.168C127.571 25.784 127.24 25.1013 127.24 24.12C127.24 23.16 127.613 22.52 128.36 22.2C129.107 21.8587 130.12 21.7093 131.4 21.752C134.472 21.816 137.555 21.9013 140.648 22.008C143.741 22.1147 146.824 22.264 149.896 22.456C151.069 22.52 151.955 22.8827 152.552 23.544C153.149 24.2053 153.448 25.0267 153.448 26.008C153.448 26.6907 153.309 27.384 153.032 28.088C152.221 30.264 151.421 32.376 150.632 34.424C149.843 36.4507 149.021 38.5093 148.168 40.6C147.315 42.6693 146.397 44.856 145.416 47.16C143.432 46.2213 141.939 45.72 140.936 45.656C139.933 45.5707 139.272 45.9013 138.952 46.648C138.611 47.4373 138.835 48.1733 139.624 48.856C140.435 49.5173 141.811 50.296 143.752 51.192C143.603 51.64 143.411 52.152 143.176 52.728C142.941 53.304 142.728 53.816 142.536 54.264C140.019 52.8773 138.173 52.088 137 51.896C135.827 51.6827 135.048 51.9813 134.664 52.792C134.216 53.7093 134.472 54.552 135.432 55.32C136.392 56.0667 138.248 56.9733 141 58.04C140.957 58.1467 140.915 58.2533 140.872 58.36C140.829 58.4667 140.787 58.5733 140.744 58.68C140.701 58.7867 140.659 58.8933 140.616 59C140.275 59.896 140.285 60.7493 140.648 61.56C141.032 62.3493 141.811 62.7333 142.984 62.712C144.904 62.6693 146.717 62.5627 148.424 62.392C150.131 62.2 151.88 62.0933 153.672 62.072C155.144 62.0293 156.157 62.2213 156.712 62.648C157.288 63.0747 157.576 63.8 157.576 64.824C157.576 65.5067 157.395 66.04 157.032 66.424C156.691 66.808 156.211 67.0853 155.592 67.256C154.973 67.4267 154.248 67.5333 153.416 67.576C150.579 67.704 147.485 67.7467 144.136 67.704C140.808 67.6613 137.523 67.5333 134.28 67.32C131.912 67.1493 130.056 66.3173 128.712 64.824C127.368 63.3307 126.696 61.592 126.696 59.608C126.696 58.7333 126.835 57.8373 127.112 56.92C127.411 56.0027 127.859 55.1173 128.456 54.264ZM149.448 58.36C148.616 58.36 147.901 58.104 147.304 57.592C146.728 57.0587 146.44 56.376 146.44 55.544C146.44 54.3707 146.771 53.496 147.432 52.92C148.093 52.3227 148.936 52.024 149.96 52.024C150.899 52.024 151.645 52.2907 152.2 52.824C152.755 53.3573 153.032 54.2533 153.032 55.512C153.032 56.4507 152.701 57.1653 152.04 57.656C151.379 58.1253 150.515 58.36 149.448 58.36ZM149.448 65.4C149.448 65.2293 149.448 65.08 149.448 64.952C149.448 64.8027 149.448 64.6533 149.448 64.504C149.448 63.8853 149.683 63.48 150.152 63.288C150.643 63.0747 151.176 62.968 151.752 62.968C152.477 62.968 153.032 63.1173 153.416 63.416C153.8 63.7147 153.971 64.12 153.928 64.632C153.928 64.7813 153.917 64.952 153.896 65.144C153.875 65.3147 153.864 65.4853 153.864 65.656C153.843 66.1253 153.587 66.456 153.096 66.648C152.627 66.84 152.115 66.936 151.56 66.936C151.027 66.936 150.536 66.7973 150.088 66.52C149.661 66.2427 149.448 65.8693 149.448 65.4ZM140.04 64.952C140.104 64.76 140.168 64.5573 140.232 64.344C140.296 64.1307 140.36 63.928 140.424 63.736C140.509 63.4587 140.701 63.2667 141 63.16C141.299 63.032 141.651 62.968 142.056 62.968C142.696 62.968 143.315 63.128 143.912 63.448C144.509 63.768 144.755 64.2053 144.648 64.76C144.627 64.9093 144.595 65.08 144.552 65.272C144.531 65.4427 144.499 65.6133 144.456 65.784C144.371 66.2107 144.136 66.5307 143.752 66.744C143.389 66.936 142.984 67.032 142.536 67.032C142.045 67.032 141.576 66.9467 141.128 66.776C140.701 66.6053 140.381 66.36 140.168 66.04C139.955 65.72 139.912 65.3573 140.04 64.952ZM137.352 20.728C137.523 21.752 137.672 22.7653 137.8 23.768C137.928 24.7707 138.035 25.784 138.12 26.808C138.248 28.28 138.152 29.3787 137.832 30.104C137.533 30.8293 136.883 31.2453 135.88 31.352C134.92 31.416 134.259 31.096 133.896 30.392C133.533 29.688 133.256 28.6 133.064 27.128C132.936 26.168 132.819 25.1547 132.712 24.088C132.627 23.0213 132.552 21.9653 132.488 20.92C132.36 18.744 132.488 17.336 132.872 16.696C133.277 16.056 133.875 15.736 134.664 15.736C135.411 15.736 135.976 16.152 136.36 16.984C136.765 17.816 137.096 19.064 137.352 20.728ZM144.84 23.544L140.68 23.224C140.893 20.8773 141.107 19.096 141.32 17.88C141.555 16.664 141.853 15.8427 142.216 15.416C142.6 14.9893 143.133 14.776 143.816 14.776C144.968 14.776 145.587 15.4267 145.672 16.728C145.757 18.008 145.48 20.28 144.84 23.544ZM176.285 67.704C172.424 67.704 169.181 66.8293 166.557 65.08C163.954 63.3093 161.992 60.856 160.669 57.72C159.346 54.584 158.685 50.9573 158.685 46.84C158.685 41.7627 159.496 37.3467 161.117 33.592C162.76 29.816 165.042 26.8933 167.965 24.824C170.888 22.7333 174.28 21.688 178.141 21.688C180.85 21.688 183.24 22.1893 185.309 23.192C187.378 24.1947 189.117 25.6667 190.525 27.608C191.954 29.528 193.021 31.864 193.725 34.616C194.45 37.3467 194.802 40.4613 194.781 43.96C194.76 49.1653 193.96 53.528 192.381 57.048C190.824 60.568 188.658 63.224 185.885 65.016C183.112 66.808 179.912 67.704 176.285 67.704ZM179.869 58.808C181.853 58.808 183.581 58.264 185.053 57.176C186.546 56.088 187.698 54.4453 188.509 52.248C189.32 50.0293 189.725 47.2453 189.725 43.896C189.725 40.312 189.309 37.1867 188.477 34.52C187.645 31.8533 186.429 29.784 184.829 28.312C183.229 26.84 181.277 26.104 178.973 26.104C177.181 26.104 175.56 26.6267 174.109 27.672C172.658 28.7173 171.506 30.3173 170.653 32.472C169.8 34.6053 169.373 37.304 169.373 40.568C169.373 44.216 169.789 47.4053 170.621 50.136C171.474 52.8667 172.68 55 174.237 56.536C175.816 58.0507 177.693 58.808 179.869 58.808ZM171.421 58.872C170.632 58.872 170.045 59.0853 169.661 59.512C169.298 59.9173 169.117 60.664 169.117 61.752C169.117 62.392 169.341 62.904 169.789 63.288C170.258 63.672 170.952 63.864 171.869 63.864C172.573 63.864 173.117 63.672 173.501 63.288C173.906 62.8827 174.109 62.2853 174.109 61.496C174.109 60.536 173.896 59.864 173.469 59.48C173.064 59.0747 172.381 58.872 171.421 58.872ZM166.109 51.96C165.256 51.96 164.605 52.2053 164.157 52.696C163.709 53.1653 163.485 53.7733 163.485 54.52C163.485 55.544 163.741 56.312 164.253 56.824C164.786 57.336 165.448 57.592 166.237 57.592C167.133 57.592 167.837 57.368 168.349 56.92C168.861 56.4507 169.117 55.864 169.117 55.16C169.117 54.072 168.84 53.272 168.285 52.76C167.73 52.2267 167.005 51.96 166.109 51.96ZM164.573 43.576C163.677 43.576 163.037 43.8 162.653 44.248C162.269 44.6747 162.077 45.3893 162.077 46.392C162.077 46.968 162.28 47.4693 162.685 47.896C163.112 48.3013 163.805 48.504 164.765 48.504C165.405 48.504 165.938 48.312 166.365 47.928C166.792 47.544 167.005 46.9253 167.005 46.072C167.005 45.1333 166.792 44.4827 166.365 44.12C165.938 43.7573 165.341 43.576 164.573 43.576ZM185.437 26.616C185.032 27.4053 184.594 28.2053 184.125 29.016C183.656 29.8053 183.176 30.6053 182.685 31.416C181.832 32.824 181.106 33.7413 180.509 34.168C179.933 34.5733 179.336 34.6373 178.717 34.36C178.056 34.0187 177.757 33.464 177.821 32.696C177.885 31.9067 178.333 30.7333 179.165 29.176C179.613 28.344 180.082 27.512 180.573 26.68C181.085 25.848 181.597 25.0373 182.109 24.248C182.344 23.864 182.696 23.6507 183.165 23.608C183.634 23.544 184.072 23.608 184.477 23.8C184.968 24.0133 185.341 24.3653 185.597 24.856C185.853 25.3467 185.8 25.9333 185.437 26.616ZM175.869 24.312C175.912 24.3973 175.944 24.4933 175.965 24.6C176.008 24.6853 176.04 24.7813 176.061 24.888C176.168 25.2933 176.093 25.6453 175.837 25.944C175.602 26.2213 175.325 26.424 175.005 26.552C174.621 26.68 174.194 26.7653 173.725 26.808C173.256 26.8293 172.946 26.6907 172.797 26.392C172.712 26.2213 172.626 26.0613 172.541 25.912C172.477 25.7413 172.413 25.5813 172.349 25.432C172.221 25.1333 172.317 24.8347 172.637 24.536C172.978 24.216 173.341 23.992 173.725 23.864C174.152 23.736 174.578 23.6933 175.005 23.736C175.453 23.7573 175.741 23.9493 175.869 24.312ZM185.501 47.736C186.504 48.0347 187.528 48.3547 188.573 48.696C189.64 49.0373 190.685 49.4 191.709 49.784C192.221 49.976 192.562 50.2747 192.733 50.68C192.925 51.0853 192.968 51.512 192.861 51.96C192.776 52.4293 192.52 52.8453 192.093 53.208C191.666 53.5493 191.133 53.6453 190.493 53.496C189.469 53.24 188.434 52.9733 187.389 52.696C186.365 52.3973 185.352 52.088 184.349 51.768C182.109 51.064 180.722 50.4453 180.189 49.912C179.656 49.3573 179.464 48.7813 179.613 48.184C179.784 47.5013 180.253 47.0853 181.021 46.936C181.81 46.7653 183.304 47.032 185.501 47.736ZM160.925 38.392C161.032 38.3493 161.138 38.3173 161.245 38.296C161.373 38.2533 161.48 38.2213 161.565 38.2C161.714 38.1573 161.832 38.1467 161.917 38.168C162.024 38.1893 162.109 38.2427 162.173 38.328C162.258 38.392 162.333 38.4773 162.397 38.584C162.482 38.7333 162.525 38.872 162.525 39C162.546 39.1067 162.525 39.2133 162.461 39.32C162.418 39.4053 162.333 39.48 162.205 39.544C162.12 39.5653 162.024 39.608 161.917 39.672C161.832 39.7147 161.736 39.7573 161.629 39.8C161.48 39.864 161.341 39.832 161.213 39.704C161.085 39.576 160.968 39.416 160.861 39.224C160.797 39.032 160.765 38.8507 160.765 38.68C160.786 38.5093 160.84 38.4133 160.925 38.392ZM189.917 35.96C190.557 35.768 191.133 35.7573 191.645 35.928C192.157 36.0987 192.52 36.5573 192.733 37.304C192.968 38.0293 192.968 38.6053 192.733 39.032C192.498 39.4587 192.029 39.8 191.325 40.056C190.877 40.248 190.397 40.44 189.885 40.632C189.373 40.8027 188.637 41.016 187.677 41.272C185.864 41.72 184.584 41.912 183.837 41.848C183.09 41.784 182.6 41.4213 182.365 40.76C182.109 39.992 182.269 39.3413 182.845 38.808C183.421 38.2533 184.584 37.688 186.333 37.112C187.08 36.856 187.709 36.6427 188.221 36.472C188.754 36.28 189.32 36.1093 189.917 35.96ZM187.869 58.232C187.997 58.3813 188.114 58.5307 188.221 58.68C188.349 58.808 188.466 58.9573 188.573 59.128C188.808 59.4053 188.936 59.7787 188.957 60.248C188.978 60.696 188.68 61.1973 188.061 61.752C187.421 62.3493 186.856 62.5733 186.365 62.424C185.874 62.2747 185.48 62.0293 185.181 61.688C185.032 61.4533 184.904 61.272 184.797 61.144C184.712 60.9947 184.605 60.8347 184.477 60.664C184.2 60.216 184.104 59.7467 184.189 59.256C184.296 58.7653 184.605 58.3173 185.117 57.912C185.629 57.4853 186.141 57.336 186.653 57.464C187.186 57.592 187.592 57.848 187.869 58.232ZM218.049 68.344C214.166 68.344 210.87 67.4693 208.161 65.72C205.451 63.9493 203.393 61.4107 201.985 58.104C200.577 54.776 199.873 50.7653 199.873 46.072C199.873 41.5493 200.598 37.5067 202.049 33.944C203.521 30.36 205.707 27.544 208.609 25.496C211.51 23.4267 215.126 22.392 219.457 22.392C221.867 22.392 224.075 22.84 226.081 23.736C228.107 24.6107 229.857 25.9333 231.329 27.704C232.801 29.4533 233.942 31.6507 234.753 34.296C235.563 36.9413 235.969 40.0133 235.969 43.512C235.969 48.5893 235.286 52.984 233.921 56.696C232.555 60.408 230.539 63.2773 227.873 65.304C225.206 67.3307 221.931 68.344 218.049 68.344ZM219.457 56.248C221.782 56.248 223.809 55.6933 225.537 54.584C227.286 53.4747 228.641 51.832 229.601 49.656C230.561 47.4587 231.041 44.7493 231.041 41.528C231.041 38.8827 230.593 36.4293 229.697 34.168C228.822 31.9067 227.521 30.0827 225.793 28.696C224.065 27.3093 221.931 26.616 219.393 26.616C216.705 26.616 214.507 27.2987 212.801 28.664C211.094 30.0293 209.835 31.8107 209.025 34.008C208.214 36.184 207.809 38.4987 207.809 40.952C207.809 44.3653 208.257 47.2027 209.153 49.464C210.07 51.7253 211.393 53.4213 213.121 54.552C214.87 55.6827 216.982 56.248 219.457 56.248ZM220.929 58.744C220.267 58.744 219.745 58.9573 219.361 59.384C218.998 59.7893 218.817 60.4933 218.817 61.496C218.817 62.2213 219.009 62.776 219.393 63.16C219.798 63.544 220.353 63.736 221.057 63.736C222.081 63.736 222.795 63.544 223.201 63.16C223.606 62.7547 223.809 62.0293 223.809 60.984C223.809 60.344 223.585 59.8107 223.137 59.384C222.689 58.9573 221.953 58.744 220.929 58.744ZM213.889 58.616C212.843 58.616 212.075 58.8507 211.585 59.32C211.115 59.7893 210.881 60.408 210.881 61.176C210.881 62.1573 211.126 62.9147 211.617 63.448C212.129 63.9813 212.929 64.248 214.017 64.248C214.827 64.248 215.446 63.9813 215.873 63.448C216.299 62.9147 216.513 62.2853 216.513 61.56C216.513 60.664 216.278 59.9493 215.809 59.416C215.339 58.8827 214.699 58.616 213.889 58.616ZM207.745 54.2C207.019 54.2 206.433 54.4027 205.985 54.808C205.537 55.2133 205.312 55.9493 205.312 57.016C205.312 57.6773 205.505 58.2 205.889 58.584C206.294 58.9467 207.019 59.128 208.065 59.128C208.747 59.128 209.281 58.936 209.665 58.552C210.049 58.168 210.241 57.6133 210.241 56.888C210.241 56.0133 210.027 55.352 209.601 54.904C209.174 54.4347 208.555 54.2 207.745 54.2ZM229.505 30.968C228.673 31.9493 227.851 32.9307 227.041 33.912C226.23 34.872 225.409 35.768 224.577 36.6C223.617 37.624 222.795 38.2853 222.113 38.584C221.451 38.8827 220.865 38.84 220.353 38.456C219.755 38.008 219.542 37.4107 219.713 36.664C219.883 35.9173 220.417 35.0213 221.313 33.976C222.337 32.76 223.233 31.7147 224.001 30.84C224.769 29.944 225.537 29.112 226.305 28.344C226.795 27.8533 227.243 27.5973 227.649 27.576C228.075 27.5547 228.545 27.768 229.057 28.216C229.547 28.6213 229.835 29.08 229.921 29.592C230.006 30.0827 229.867 30.5413 229.505 30.968ZM217.857 26.872C217.921 27.3413 217.985 27.8427 218.049 28.376C218.113 28.888 218.155 29.4533 218.177 30.072C218.241 31.416 218.134 32.3333 217.857 32.824C217.601 33.3147 217.131 33.592 216.449 33.656C215.851 33.72 215.339 33.5387 214.913 33.112C214.486 32.664 214.123 31.8 213.825 30.52C213.697 29.944 213.579 29.3787 213.472 28.824C213.387 28.2693 213.291 27.704 213.185 27.128C213.099 26.5093 213.259 26.0293 213.665 25.688C214.07 25.3467 214.593 25.144 215.233 25.08C215.809 25.016 216.363 25.1333 216.897 25.432C217.451 25.7093 217.771 26.1893 217.857 26.872ZM206.081 39.288C207.083 39.3733 208.107 39.512 209.153 39.704C210.219 39.8747 211.243 40.0773 212.225 40.312C213.291 40.568 213.995 40.9093 214.337 41.336C214.678 41.7413 214.827 42.232 214.785 42.808C214.721 43.576 214.433 44.0987 213.921 44.376C213.409 44.632 212.651 44.7493 211.649 44.728C210.625 44.6853 209.611 44.6 208.609 44.472C207.606 44.344 206.593 44.216 205.569 44.088C204.971 44.024 204.555 43.7147 204.321 43.16C204.086 42.584 204.011 41.9973 204.097 41.4C204.161 40.7813 204.363 40.2587 204.705 39.832C205.046 39.4053 205.505 39.224 206.081 39.288ZM203.457 47.544C203.585 47.48 203.702 47.4267 203.809 47.384C203.915 47.3413 204.033 47.288 204.161 47.224C204.545 47.0533 204.897 46.9893 205.217 47.032C205.537 47.0747 205.803 47.2027 206.017 47.416C206.251 47.608 206.422 47.8427 206.529 48.12C206.657 48.3973 206.72 48.696 206.72 49.016C206.72 49.3147 206.646 49.6133 206.497 49.912C206.347 50.1893 206.123 50.424 205.825 50.616C205.697 50.7013 205.558 50.7867 205.409 50.872C205.259 50.936 205.121 51.0213 204.993 51.128C204.587 51.384 204.214 51.3627 203.873 51.064C203.553 50.7653 203.307 50.3813 203.137 49.912C202.987 49.4213 202.934 48.9413 202.977 48.472C203.019 47.9813 203.179 47.672 203.457 47.544ZM232.449 39.736C232.961 39.6933 233.387 39.832 233.729 40.152C234.07 40.4507 234.305 40.8453 234.433 41.336C234.561 41.8693 234.561 42.3813 234.433 42.872C234.326 43.3627 234.049 43.6613 233.601 43.768C232.641 43.9813 231.691 44.1733 230.753 44.344C229.835 44.4933 228.929 44.6213 228.033 44.728C227.179 44.8133 226.475 44.7387 225.921 44.504C225.366 44.2693 225.025 43.7893 224.897 43.064C224.769 42.2533 224.929 41.6453 225.377 41.24C225.846 40.8133 226.603 40.504 227.649 40.312C228.459 40.184 229.259 40.0667 230.049 39.96C230.859 39.8533 231.659 39.7787 232.449 39.736ZM229.889 54.84C229.953 54.9253 230.027 55.0107 230.113 55.096C230.198 55.16 230.273 55.2453 230.337 55.352C230.465 55.5013 230.518 55.672 230.497 55.864C230.475 56.0347 230.379 56.2053 230.208 56.376C230.017 56.568 229.761 56.7067 229.441 56.792C229.142 56.856 228.907 56.7813 228.737 56.568C228.651 56.44 228.555 56.312 228.449 56.184C228.363 56.056 228.267 55.928 228.161 55.8C228.011 55.5653 227.958 55.352 228.001 55.16C228.043 54.9467 228.161 54.776 228.353 54.648C228.545 54.52 228.79 54.456 229.089 54.456C229.409 54.456 229.675 54.584 229.889 54.84Z" fill="white"/>
</svg>

      </div>

      {
        !isLoggedIn &&
        <button
        className="text-white text-sm font-semibold bg-transparent border-1 border-white rounded-full px-4 py-1 hover:underline"
        onClick={() => router.push('/login')}
        style={{ background: 'none', outline: 'none', cursor: 'pointer' }}
      >
        Login
      </button>
      }
  
    </div> */}
    {/* hero section */}
    <div className="h-auto flex items-center justify-center bg-[#1A1A1A] px-4 py-4 w-[92%] mx-auto mt-4 rounded-xl">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Tagline */}
        <h1 className="text-[50px] md:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8ae6ff] to-[#ffefd1] drop-shadow-md">
          Influencers Earn.
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffefd1] to-[#8ae6ff] drop-shadow-md">
            Businesses Grow.
          </span>
        </h1>
        
        {/* Sub Heading */}
        <p className="text-[16px] md:text-2xl text-gray-100 mb-10 leading-relaxed max-w-3xl mx-auto ">
          A simple platform where influencer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   find paid work and businesses 
          Hand-Picked Influencers Who Help You Grow Your Business
          {/* find affordable promotions. */}
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => router.push('/login')} className="bg-white text-[#1A1A1A] font-semibold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center border border-white relative">
            Find Work as a Influencer
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap border border-green-200 shadow-sm flex flex-row items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" className="h-4 w-4"><path d="M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z"></path></svg> 100% free</div>
          </button>
          <button onClick={() => router.push('/login')} className="bg-transparent text-white font-semibold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center border border-white">
          Find Influencers for Your Business
          </button>
      </div>

      </div>
        </div>

      {/* Promotional Card - Pixel Perfect Recreation */}
      <div className="w-full my-4 px-4">
      <div className="bg-[#FF69B4] rounded-xl py-8 shadow-lg text-center">
        {/* Main Heading - Three Lines */}
        <h1 className="text-black font-black text-[40px] md:text-4xl leading-tight mb-6 text-center px-4">
          <div className="block">SEARCH & FILTER</div>
          <div className="block"> INFLUENCERS</div>
          {/* <div className="block">FILTER 350M+</div> */}
          <div className="block">FREE</div>
        </h1>
        
        {/* Description - Four Lines */}
        <p className="text-black text-base md:text-lg leading-relaxed mb-8 max-w-md px-4">
          Find creators with the perfect audience for your brand with dumzoo. Try for free
        </p>
        
        {/* CTA Button */}
        <button  onClick={() => router.push('/finder')} className="bg-black text-white font-bold py-3 px-8 rounded-full text-base hover:bg-gray-800 transition-colors relative px-4">
          Search for Influencers
          {/* <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap border border-green-200 shadow-sm flex flex-row items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" className="h-4 w-4"><path d="M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z"></path></svg> 100% free access</div> */}
        </button>
      </div>
    </div>

    <div className="px-4 ">
      <Image src="/images/india.png" alt="Influencer" width={1000} height={1000} className="rounded-xl" />
      </div> 

<div className="px-4 mt-3"  onClick={() => router.push('/login')}>
<Image src={"/images/follower.png"} alt="follower" width={1000} height={1000} className="rounded-xl" />
</div>

  
          {/* popular cities */}
    <div className="popular-cities mt-8 hidden">
    <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
              <h2 className="text-[14px] font-medium text-gray-800 uppercase px-0" style={{letterSpacing: '3px'}}>All India Cities</h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3  text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
        </div>
        </div>

        {/* popular cities cards */}
        <div className="mt-8 px-4">
          <div className="grid grid-cols-4 gap-3 max-w-4xl mx-auto">
            {/* Bengaluru */}
            <div className="relative bg-gradient-to-b from-blue-100 to-blue-200 rounded-[10px] h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">

              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Bengaluru</h3>
             <div>
              <Image src={"/images/india_gate.png"} alt="Bengaluru" width={100} height={100} />
             </div>
            </div>

            {/* Chennai */}
            <div className="relative bg-gradient-to-b from-teal-100 to-teal-200 rounded-[10px] h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Chandigrah</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
            </div>

            {/* Hyderabad */}
            <div className="relative bg-gradient-to-b from-orange-100 to-orange-200 rounded-[10px] h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Delhi</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
            </div>
       
         

            {/* Mumbai */}
            <div className="relative bg-gradient-to-b from-blue-200 to-blue-300 rounded-[10px] h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Mumbai</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
            </div>

            {/* Gurgaon */}
            <div className="relative bg-gradient-to-b from-blue-300 to-blue-400 rounded-[10px]  h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Gurgaon</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
            
              </div>

            {/* Delhi */}
            <div className="relative bg-gradient-to-b from-orange-200 to-orange-300 rounded-[10px]  h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Shimla</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
              </div>
            
            {/* Kolkata */}
            <div className="relative bg-gradient-to-b from-teal-200 to-teal-300 rounded-[10px]  h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Kolkata</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
              </div>

            {/* Pune */}
            <div className="relative bg-gradient-to-b from-blue-400 to-blue-500 rounded-[10px]  h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Pune</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
                
              
          </div>
        </div>
        </div>
      </div>

      <div className="w-full my-4 rounded-2xl px-4">
          <Image
            src="/images/referal.jpg"
            alt="Referral Banner"
            width={1200}
            height={150}
            className="w-full object-contain rounded-2xl shadow-md"
            priority
          />
    </div>

{/* Testimonials Section */}
<div className="px-4 py-8">
  <div className="text-center mb-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">What Our Users Say</h2>
    <p className="text-gray-600">Hear from our amazing community</p>
  </div>
  
  <div className="relative h-80 overflow-hidden">
    <div className="testimonials-container">
      {/* First set of testimonials */}
      <div className="testimonials-track">
        {testimonials.map((_, index) => {
          if (index % 2 === 0) {
            return (
              <div key={`row-${index}`} className="grid grid-cols-2 gap-4 mb-4">
                {renderTestimonials(testimonials.slice(index, index + 2))}
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Duplicate set for seamless loop */}
      <div className="testimonials-track">
        {testimonials.map((_, index) => {
          if (index % 2 === 0) {
            return (
              <div key={`duplicate-row-${index}`} className="grid grid-cols-2 gap-4 mb-4">
                {renderTestimonials(testimonials.slice(index, index + 2))}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  </div>
</div>

<div className="px-4 pt-7 hidden">
<div className=" mb-3">
            {/* <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg> */}
            <h2 className="text-[16px] font-bold text-gray-800  px-0" style={{letterSpacing: '1px', fontFamily: 'arial'}}>Newly Infulancer</h2>
            <p className="text-[13px] text-gray-500">Find the latest influencer</p>

          
        </div>
{/* <div className="flex justify-between mb-3">
        <h3 className="text-[15px] font-semibold text-gray-800 px-0"  style={{letterSpacing: '2px'}}> New Creators</h3>
        <button className="text-[12px] text-gray-800 px-0"  style={{letterSpacing: '2px'}} onClick={() => { router.push('/finder'); }}>View All</button>
      </div> */}
      {/* card */}
      <div className="grid grid-cols-1 gap-3">
        {newCreators.map((creator) => (
          <div key={creator.name} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-0 border border-gray-100 flex items-center">
            <div className="w-[100px] h-[100px] rounded-[8px] overflow-hidden flex-shrink-0 mr-3">
              <Image
                src={creator?.image || '/images/women.png'}
                alt="Influencer"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
          </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-black text-sm mb-1 truncate">
                {creator.name}
              </h3>
              <p className="text-xs text-gray-600 truncate">
                {creator.followers} followers
              </p>
          </div>
        </div>
      ))}
      </div>
</div>  

{/* <div className="w-full my-4 rounded-2xl">
          <Image
            src="/images/referal.jpg"
            alt="Referral Banner"
            width={1200}
            height={150}
            className="w-full object-contain rounded-2xl shadow-md"
            priority
          />
        </div> */}

{!isLoggedIn && (
    <div className="px-4 pt-2 hidden">
<div className="flex justify-between mb-3">
        <h3 className="text-[15px] font-semibold text-gray-800 px-0"  style={{letterSpacing: '2px'}}> Paid Promotions</h3>
        <button className="text-[12px] text-gray-800 px-0"  style={{letterSpacing: '2px'}} onClick={() => { router.push('/finder'); }}>View All</button>
      </div>
      {/* card */}
      <div className="grid grid-cols-2 gap-4">
        {paidPromotionsList.map((creator) => (
          <div className="flex-shrink-0 relative shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
          <div className="h-[130px]">
            {/* <img src="" alt="Influencer" className="w-full h-full object-cover" /> */}
            {
              creator.image ? (
                <Image src={creator?.image || '/images/promo1.jpg'} alt="Influencer" 
                width={1200}
                height={150}
                className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-lg">Campaign Image</span>
              </div>
              )
            }
          </div>
          <div className="p-4 bg-white">
            <h3 className="text-[#000] font-semibold text-sm mb-1 drop-shadow-lg">{creator.tilte}</h3>
            <p className="text-gray text-xs font-medium drop-shadow">INR {creator.budget}</p>
          </div>
        </div>
      ))}
      </div>
</div>  

  )
}

    {/* new on dumzoo */}
<div className="new-on-dumzoo mt-8 hidden">
<div className="text-center">
          <div className="flex items-center justify-center">
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-[14px] font-medium text-gray-800 uppercase px-0" style={{letterSpacing: '3px'}}>NEW ON <span className="text-purple-600">DUMZOO</span></h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3  text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
        </div>
        </div>

        {/* Influencer Cards Horizontal Scroll */}
        <div className="mt-6 px-4">
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
            {/* Card 1 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/women.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Sarah Johnson</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Food</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/men.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Mike Chen</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Travel</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/women.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Emma Davis</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Fashion</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/men.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Alex Rodriguez</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Technology</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/women.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Lisa Wang</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Beauty</p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/men.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">David Kim</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Fitness</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* new on dumzoo */}
<div className="new-on-dumzoo mt-8 hidden">
<div className="text-center">
          <div className="flex items-center justify-center">
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-[14px] font-medium text-gray-800 uppercase px-0" style={{letterSpacing: '3px'}}>Trending <span className="text-purple-600">DUMZOO</span></h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3  text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
        </div>
        </div>

        {/* Influencer Cards Horizontal Scroll */}
        <div className="mt-6 px-4">
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
            {/* Card 1 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/women.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Sarah Johnson</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Food</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/men.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Mike Chen</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Travel</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/women.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Emma Davis</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Fashion</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/men.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Alex Rodriguez</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Technology</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/women.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Lisa Wang</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Beauty</p>
              </div>
              </div>
              
            {/* Card 6 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/men.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">David Kim</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Fitness</p>
              </div>
              </div>
            </div>
        </div>
      </div>

    {/* categories section */}
    {/* <div className="categories-section pt-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-[14px] font-medium text-gray-800 uppercase px-0" style={{letterSpacing: '3px'}}>Browse Creators</h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3  text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
        </div>

        </div>

        <div className="mt-8">
          <div className="grid grid-cols-4 md:grid-cols-3 gap-4">
        
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="#5D22AC" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="#5D22AC"/>
                  <circle cx="8" cy="8" r="2" fill="#5D22AC"/>
                  <circle cx="16" cy="8" r="2" fill="#5D22AC"/>
                  <circle cx="8" cy="16" r="2" fill="#5D22AC"/>
                  <circle cx="16" cy="16" r="2" fill="#5D22AC"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Arts</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Beauty</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="#5D22AC" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Comedy & Memes</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Education</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="#5D22AC" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="#5D22AC" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Automotive</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Business & Startups</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Travel & Places</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Entertainment</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 cursor-pointer mt-8">
            <span className="text-purple-600 text-sm font-medium">See All</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
      </div>
    </div> */}

{/* <div className="text-center my-8">
          <div className="flex items-center justify-center">
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
              <h2 className="text-[14px] font-medium text-gray-800 uppercase px-0" style={{letterSpacing: '3px'}}>HOW WORKS</h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3  text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
        </div>
        </div>


<Image src={"/images/flow.png"} alt="Bengaluru" width={1000} height={1000} className="px-4" /> */}


      {/* footer  */}
      <footer className="text-white overflow-hidden relative">
        <div className="bg-image"></div>
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 z-[99] relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-3 justify-center">
            <a href="#" className="text-gray-400 hover:text-white transition-colors block">
                              {/* <Image src={"/images/main-logo.svg"} alt="logo" width={200} height={200} /> */}
                              {/* <svg width="150" height="39" viewBox="0 0 279 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.1211 2.3125C28.8555 2.46875 31.1016 3.52344 32.8594 5.47656C34.6172 7.39062 35.8867 9.57812 36.668 12.0391C37.4492 14.5 37.8398 17.0195 37.8398 19.5977C37.8398 22.1758 37.4492 24.6953 36.668 27.1562C35.9258 29.6172 34.6562 31.8242 32.8594 33.7773C31.1016 35.6914 28.8555 36.7266 26.1211 36.8828H4.55859C3.50391 36.8438 2.60547 36.4727 1.86328 35.7695C1.16016 35.0273 0.789063 34.1289 0.75 33.0742V18.543C0.789063 17.4492 1.19922 16.5508 1.98047 15.8477C2.76172 15.1055 3.69922 14.7344 4.79297 14.7344C5.84766 14.7734 6.74609 15.1641 7.48828 15.9062C8.23047 16.6094 8.62109 17.4883 8.66016 18.543V27.4492C8.66016 28.5039 9.20703 29.0312 10.3008 29.0312H24.1289C25.6133 28.9531 26.8438 28.3867 27.8203 27.332C28.7969 26.2773 29.5 25.0859 29.9297 23.7578C30.3984 22.3906 30.6328 21.0039 30.6328 19.5977C30.6328 18.1914 30.3984 16.8242 29.9297 15.4961C29.5 14.1289 28.7969 12.918 27.8203 11.8633C26.8438 10.8086 25.6133 10.2422 24.1289 10.1641H4.55859C2.21484 9.96875 0.945312 8.69922 0.75 6.35547C0.75 5.26172 1.10156 4.32422 1.80469 3.54297C2.54688 2.76172 3.46484 2.35156 4.55859 2.3125H26.1211ZM62.918 38.2305C60.8867 38.2305 58.875 37.9961 56.8828 37.5273C54.9297 37.0586 53.0547 36.375 51.2578 35.4766C49.4609 34.5391 47.8789 33.3086 46.5117 31.7852C45.1445 30.2617 44.4023 28.4453 44.2852 26.3359V23.875V5.18359C44.2852 4.08984 44.6758 3.19141 45.457 2.48828C46.2773 1.74609 47.2344 1.375 48.3281 1.375C50.6719 1.57031 51.9414 2.83984 52.1367 5.18359V24.5195C52.2148 25.7305 52.6641 26.7461 53.4844 27.5664C54.3438 28.3477 55.2812 28.9727 56.2969 29.4414C57.3516 29.9102 58.4258 30.2617 59.5195 30.4961C60.6523 30.7305 61.7852 30.8477 62.918 30.8477C64.0508 30.8477 65.1641 30.7305 66.2578 30.4961C67.3906 30.2617 68.4648 29.9102 69.4805 29.4414C70.5352 28.9727 71.4727 28.3477 72.293 27.5664C73.1523 26.7461 73.6211 25.7305 73.6992 24.5195V5.18359C73.6992 4.08984 74.0898 3.19141 74.8711 2.48828C75.6914 1.74609 76.6484 1.375 77.7422 1.375C80.0859 1.57031 81.375 2.83984 81.6094 5.18359V23.875V26.3359C81.4922 28.4453 80.7305 30.2617 79.3242 31.7852C77.957 33.3086 76.375 34.5391 74.5781 35.4766C72.7812 36.375 70.8867 37.0586 68.8945 37.5273C66.9414 37.9961 64.9492 38.2305 62.918 38.2305ZM101.824 0.730469C103.191 0.730469 104.52 0.964844 105.809 1.43359C107.137 1.90234 108.406 2.58594 109.617 3.48438C109.812 3.67969 110.027 3.875 110.262 4.07031C110.457 3.875 110.672 3.67969 110.906 3.48438C112.117 2.58594 113.367 1.90234 114.656 1.43359C115.984 0.964844 117.312 0.730469 118.641 0.730469C120.008 0.730469 121.336 0.964844 122.625 1.43359C123.953 1.90234 125.203 2.60547 126.375 3.54297C127.586 4.44141 128.641 5.65234 129.539 7.17578C130.477 8.69922 130.945 10.5156 130.945 12.625V33.7773C130.711 36.1211 129.422 37.3906 127.078 37.5859C125.984 37.5859 125.027 37.2344 124.207 36.5312C123.426 35.7891 123.035 34.8711 123.035 33.7773V13.0938C123.035 12.1562 122.859 11.375 122.508 10.75C122.156 10.0859 121.766 9.57812 121.336 9.22656C120.906 8.83594 120.457 8.5625 119.988 8.40625C119.52 8.21094 119.051 8.11328 118.582 8.11328C118.113 8.11328 117.645 8.21094 117.176 8.40625C116.746 8.5625 116.316 8.83594 115.887 9.22656C115.457 9.57812 115.066 10.0859 114.715 10.75C114.363 11.375 114.168 12.1562 114.129 13.0938V33.7773C113.895 36.1211 112.605 37.3906 110.262 37.5859C109.168 37.5859 108.211 37.2344 107.391 36.5312C106.609 35.7891 106.219 34.8711 106.219 33.7773V13.0938C106.219 12.1562 106.043 11.375 105.691 10.75C105.34 10.0859 104.949 9.57812 104.52 9.22656C104.09 8.83594 103.641 8.5625 103.172 8.40625C102.703 8.21094 102.234 8.11328 101.766 8.11328C101.297 8.11328 100.828 8.21094 100.359 8.40625C99.9297 8.5625 99.5 8.83594 99.0703 9.22656C98.6406 9.57812 98.25 10.0859 97.8984 10.75C97.5469 11.375 97.3516 12.1562 97.3125 13.0938V33.7773C97.1172 36.1211 95.8477 37.3906 93.5039 37.5859C92.4102 37.5859 91.4531 37.2344 90.6328 36.5312C89.8516 35.7891 89.4609 34.8711 89.4609 33.7773V12.625C89.5391 10.5156 90.0273 8.69922 90.9258 7.17578C91.8242 5.65234 92.8789 4.44141 94.0898 3.54297C95.3008 2.60547 96.5508 1.90234 97.8398 1.43359C99.168 0.964844 100.496 0.730469 101.824 0.730469ZM137.098 6.23828C137.098 5.14453 137.469 4.22656 138.211 3.48438C138.992 2.70312 139.93 2.3125 141.023 2.3125H175.125C176.219 2.3125 177.156 2.68359 177.938 3.42578C178.68 4.20703 179.051 5.14453 179.051 6.23828C179.051 7.33203 178.68 8.25 177.938 8.99219C177.703 9.22656 177.469 9.42188 177.234 9.57812L152.391 28.9141H175.125C176.219 28.9141 177.156 29.2852 177.938 30.0273C178.68 30.8086 179.051 31.7461 179.051 32.8398C179.051 33.9336 178.66 34.8711 177.879 35.6523C177.137 36.3945 176.219 36.7656 175.125 36.7656H141.023C139.93 36.7656 139.012 36.375 138.27 35.5938C137.488 34.8516 137.098 33.9336 137.098 32.8398C137.098 31.8242 137.43 30.9453 138.094 30.2031H138.035L138.27 30.0273C138.504 29.793 138.758 29.5977 139.031 29.4414L164.168 10.1641H141.023C139.93 10.1641 139.012 9.77344 138.27 8.99219C137.488 8.25 137.098 7.33203 137.098 6.23828ZM216.609 2.3125C218.602 2.35156 220.379 2.97656 221.941 4.1875C223.504 5.39844 224.754 6.84375 225.691 8.52344C226.668 10.2031 227.391 11.9805 227.859 13.8555C228.328 15.7305 228.562 17.6445 228.562 19.5977C228.562 22.1758 228.152 24.7148 227.332 27.2148C226.551 29.6758 225.242 31.8633 223.406 33.7773C221.609 35.6914 219.344 36.7266 216.609 36.8828H196.16C193.426 36.7656 191.141 35.75 189.305 33.8359C187.469 31.9219 186.16 29.7148 185.379 27.2148C184.637 24.7148 184.266 22.1758 184.266 19.5977C184.266 17.0195 184.656 14.5 185.438 12.0391C186.219 9.53906 187.508 7.33203 189.305 5.41797C191.141 3.46484 193.426 2.42969 196.16 2.3125H197.273H215.496H216.609ZM214.617 29.0312C216.102 28.9531 217.332 28.4062 218.309 27.3906C219.324 26.3359 220.047 25.125 220.477 23.7578C220.906 22.3906 221.121 21.0039 221.121 19.5977C221.121 18.1914 220.887 16.8242 220.418 15.4961C219.988 14.1289 219.285 12.918 218.309 11.8633C217.332 10.8086 216.102 10.2422 214.617 10.1641H197.977C196.492 10.2422 195.262 10.8086 194.285 11.8633C193.309 12.918 192.586 14.1289 192.117 15.4961C191.688 16.8242 191.473 18.1914 191.473 19.5977C191.473 21.0039 191.688 22.3906 192.117 23.7578C192.547 25.125 193.25 26.3359 194.227 27.3906C195.242 28.4062 196.492 28.9531 197.977 29.0312H214.617ZM266.414 2.3125C268.406 2.35156 270.184 2.97656 271.746 4.1875C273.309 5.39844 274.559 6.84375 275.496 8.52344C276.473 10.2031 277.195 11.9805 277.664 13.8555C278.133 15.7305 278.367 17.6445 278.367 19.5977C278.367 22.1758 277.957 24.7148 277.137 27.2148C276.355 29.6758 275.047 31.8633 273.211 33.7773C271.414 35.6914 269.148 36.7266 266.414 36.8828H245.965C243.23 36.7656 240.945 35.75 239.109 33.8359C237.273 31.9219 235.965 29.7148 235.184 27.2148C234.441 24.7148 234.07 22.1758 234.07 19.5977C234.07 17.0195 234.461 14.5 235.242 12.0391C236.023 9.53906 237.312 7.33203 239.109 5.41797C240.945 3.46484 243.23 2.42969 245.965 2.3125H247.078H265.301H266.414ZM264.422 29.0312C265.906 28.9531 267.137 28.4062 268.113 27.3906C269.129 26.3359 269.852 25.125 270.281 23.7578C270.711 22.3906 270.926 21.0039 270.926 19.5977C270.926 18.1914 270.691 16.8242 270.223 15.4961C269.793 14.1289 269.09 12.918 268.113 11.8633C267.137 10.8086 265.906 10.2422 264.422 10.1641H247.781C246.297 10.2422 245.066 10.8086 244.09 11.8633C243.113 12.918 242.391 14.1289 241.922 15.4961C241.492 16.8242 241.277 18.1914 241.277 19.5977C241.277 21.0039 241.492 22.3906 241.922 23.7578C242.352 25.125 243.055 26.3359 244.031 27.3906C245.047 28.4062 246.297 28.9531 247.781 29.0312H264.422Z" fill="black"/>
</svg> */}

<svg width="170" height="39" viewBox="0 0 279 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.1211 2.3125C28.8555 2.46875 31.1016 3.52344 32.8594 5.47656C34.6172 7.39062 35.8867 9.57812 36.668 12.0391C37.4492 14.5 37.8398 17.0195 37.8398 19.5977C37.8398 22.1758 37.4492 24.6953 36.668 27.1562C35.9258 29.6172 34.6562 31.8242 32.8594 33.7773C31.1016 35.6914 28.8555 36.7266 26.1211 36.8828H4.55859C3.50391 36.8438 2.60547 36.4727 1.86328 35.7695C1.16016 35.0273 0.789063 34.1289 0.75 33.0742V18.543C0.789063 17.4492 1.19922 16.5508 1.98047 15.8477C2.76172 15.1055 3.69922 14.7344 4.79297 14.7344C5.84766 14.7734 6.74609 15.1641 7.48828 15.9062C8.23047 16.6094 8.62109 17.4883 8.66016 18.543V27.4492C8.66016 28.5039 9.20703 29.0312 10.3008 29.0312H24.1289C25.6133 28.9531 26.8438 28.3867 27.8203 27.332C28.7969 26.2773 29.5 25.0859 29.9297 23.7578C30.3984 22.3906 30.6328 21.0039 30.6328 19.5977C30.6328 18.1914 30.3984 16.8242 29.9297 15.4961C29.5 14.1289 28.7969 12.918 27.8203 11.8633C26.8438 10.8086 25.6133 10.2422 24.1289 10.1641H4.55859C2.21484 9.96875 0.945312 8.69922 0.75 6.35547C0.75 5.26172 1.10156 4.32422 1.80469 3.54297C2.54688 2.76172 3.46484 2.35156 4.55859 2.3125H26.1211ZM137.098 6.23828C137.098 5.14453 137.469 4.22656 138.211 3.48438C138.992 2.70312 139.93 2.3125 141.023 2.3125H175.125C176.219 2.3125 177.156 2.68359 177.938 3.42578C178.68 4.20703 179.051 5.14453 179.051 6.23828C179.051 7.33203 178.68 8.25 177.938 8.99219C177.703 9.22656 177.469 9.42188 177.234 9.57812L152.391 28.9141H175.125C176.219 28.9141 177.156 29.2852 177.938 30.0273C178.68 30.8086 179.051 31.7461 179.051 32.8398C179.051 33.9336 178.66 34.8711 177.879 35.6523C177.137 36.3945 176.219 36.7656 175.125 36.7656H141.023C139.93 36.7656 139.012 36.375 138.27 35.5938C137.488 34.8516 137.098 33.9336 137.098 32.8398C137.098 31.8242 137.43 30.9453 138.094 30.2031H138.035L138.27 30.0273C138.504 29.793 138.758 29.5977 139.031 29.4414L164.168 10.1641H141.023C139.93 10.1641 139.012 9.77344 138.27 8.99219C137.488 8.25 137.098 7.33203 137.098 6.23828Z" fill="#D9748A"/>
<path d="M62.918 38.2305C60.8867 38.2305 58.875 37.9961 56.8828 37.5273C54.9297 37.0586 53.0547 36.375 51.2578 35.4766C49.4609 34.5391 47.8789 33.3086 46.5117 31.7852C45.1445 30.2617 44.4023 28.4453 44.2852 26.3359V23.875V5.18359C44.2852 4.08984 44.6758 3.19141 45.457 2.48828C46.2773 1.74609 47.2344 1.375 48.3281 1.375C50.6719 1.57031 51.9414 2.83984 52.1367 5.18359V24.5195C52.2148 25.7305 52.6641 26.7461 53.4844 27.5664C54.3438 28.3477 55.2812 28.9727 56.2969 29.4414C57.3516 29.9102 58.4258 30.2617 59.5195 30.4961C60.6523 30.7305 61.7852 30.8477 62.918 30.8477C64.0508 30.8477 65.1641 30.7305 66.2578 30.4961C67.3906 30.2617 68.4648 29.9102 69.4805 29.4414C70.5352 28.9727 71.4727 28.3477 72.293 27.5664C73.1523 26.7461 73.6211 25.7305 73.6992 24.5195V5.18359C73.6992 4.08984 74.0898 3.19141 74.8711 2.48828C75.6914 1.74609 76.6484 1.375 77.7422 1.375C80.0859 1.57031 81.375 2.83984 81.6094 5.18359V23.875V26.3359C81.4922 28.4453 80.7305 30.2617 79.3242 31.7852C77.957 33.3086 76.375 34.5391 74.5781 35.4766C72.7812 36.375 70.8867 37.0586 68.8945 37.5273C66.9414 37.9961 64.9492 38.2305 62.918 38.2305ZM216.609 2.3125C218.602 2.35156 220.379 2.97656 221.941 4.1875C223.504 5.39844 224.754 6.84375 225.691 8.52344C226.668 10.2031 227.391 11.9805 227.859 13.8555C228.328 15.7305 228.562 17.6445 228.562 19.5977C228.562 22.1758 228.152 24.7148 227.332 27.2148C226.551 29.6758 225.242 31.8633 223.406 33.7773C221.609 35.6914 219.344 36.7266 216.609 36.8828H196.16C193.426 36.7656 191.141 35.75 189.305 33.8359C187.469 31.9219 186.16 29.7148 185.379 27.2148C184.637 24.7148 184.266 22.1758 184.266 19.5977C184.266 17.0195 184.656 14.5 185.438 12.0391C186.219 9.53906 187.508 7.33203 189.305 5.41797C191.141 3.46484 193.426 2.42969 196.16 2.3125H197.273H215.496H216.609ZM214.617 29.0312C216.102 28.9531 217.332 28.4062 218.309 27.3906C219.324 26.3359 220.047 25.125 220.477 23.7578C220.906 22.3906 221.121 21.0039 221.121 19.5977C221.121 18.1914 220.887 16.8242 220.418 15.4961C219.988 14.1289 219.285 12.918 218.309 11.8633C217.332 10.8086 216.102 10.2422 214.617 10.1641H197.977C196.492 10.2422 195.262 10.8086 194.285 11.8633C193.309 12.918 192.586 14.1289 192.117 15.4961C191.688 16.8242 191.473 18.1914 191.473 19.5977C191.473 21.0039 191.688 22.3906 192.117 23.7578C192.547 25.125 193.25 26.3359 194.227 27.3906C195.242 28.4062 196.492 28.9531 197.977 29.0312H214.617Z" fill="#DDB067"/>
<path d="M101.824 0.730469C103.191 0.730469 104.52 0.964844 105.809 1.43359C107.137 1.90234 108.406 2.58594 109.617 3.48438C109.812 3.67969 110.027 3.875 110.262 4.07031C110.457 3.875 110.672 3.67969 110.906 3.48438C112.117 2.58594 113.367 1.90234 114.656 1.43359C115.984 0.964844 117.312 0.730469 118.641 0.730469C120.008 0.730469 121.336 0.964844 122.625 1.43359C123.953 1.90234 125.203 2.60547 126.375 3.54297C127.586 4.44141 128.641 5.65234 129.539 7.17578C130.477 8.69922 130.945 10.5156 130.945 12.625V33.7773C130.711 36.1211 129.422 37.3906 127.078 37.5859C125.984 37.5859 125.027 37.2344 124.207 36.5312C123.426 35.7891 123.035 34.8711 123.035 33.7773V13.0938C123.035 12.1562 122.859 11.375 122.508 10.75C122.156 10.0859 121.766 9.57812 121.336 9.22656C120.906 8.83594 120.457 8.5625 119.988 8.40625C119.52 8.21094 119.051 8.11328 118.582 8.11328C118.113 8.11328 117.645 8.21094 117.176 8.40625C116.746 8.5625 116.316 8.83594 115.887 9.22656C115.457 9.57812 115.066 10.0859 114.715 10.75C114.363 11.375 114.168 12.1562 114.129 13.0938V33.7773C113.895 36.1211 112.605 37.3906 110.262 37.5859C109.168 37.5859 108.211 37.2344 107.391 36.5312C106.609 35.7891 106.219 34.8711 106.219 33.7773V13.0938C106.219 12.1562 106.043 11.375 105.691 10.75C105.34 10.0859 104.949 9.57812 104.52 9.22656C104.09 8.83594 103.641 8.5625 103.172 8.40625C102.703 8.21094 102.234 8.11328 101.766 8.11328C101.297 8.11328 100.828 8.21094 100.359 8.40625C99.9297 8.5625 99.5 8.83594 99.0703 9.22656C98.6406 9.57812 98.25 10.0859 97.8984 10.75C97.5469 11.375 97.3516 12.1562 97.3125 13.0938V33.7773C97.1172 36.1211 95.8477 37.3906 93.5039 37.5859C92.4102 37.5859 91.4531 37.2344 90.6328 36.5312C89.8516 35.7891 89.4609 34.8711 89.4609 33.7773V12.625C89.5391 10.5156 90.0273 8.69922 90.9258 7.17578C91.8242 5.65234 92.8789 4.44141 94.0898 3.54297C95.3008 2.60547 96.5508 1.90234 97.8398 1.43359C99.168 0.964844 100.496 0.730469 101.824 0.730469ZM266.414 2.3125C268.406 2.35156 270.184 2.97656 271.746 4.1875C273.309 5.39844 274.559 6.84375 275.496 8.52344C276.473 10.2031 277.195 11.9805 277.664 13.8555C278.133 15.7305 278.367 17.6445 278.367 19.5977C278.367 22.1758 277.957 24.7148 277.137 27.2148C276.355 29.6758 275.047 31.8633 273.211 33.7773C271.414 35.6914 269.148 36.7266 266.414 36.8828H245.965C243.23 36.7656 240.945 35.75 239.109 33.8359C237.273 31.9219 235.965 29.7148 235.184 27.2148C234.441 24.7148 234.07 22.1758 234.07 19.5977C234.07 17.0195 234.461 14.5 235.242 12.0391C236.023 9.53906 237.312 7.33203 239.109 5.41797C240.945 3.46484 243.23 2.42969 245.965 2.3125H247.078H265.301H266.414ZM264.422 29.0312C265.906 28.9531 267.137 28.4062 268.113 27.3906C269.129 26.3359 269.852 25.125 270.281 23.7578C270.711 22.3906 270.926 21.0039 270.926 19.5977C270.926 18.1914 270.691 16.8242 270.223 15.4961C269.793 14.1289 269.09 12.918 268.113 11.8633C267.137 10.8086 265.906 10.2422 264.422 10.1641H247.781C246.297 10.2422 245.066 10.8086 244.09 11.8633C243.113 12.918 242.391 14.1289 241.922 15.4961C241.492 16.8242 241.277 18.1914 241.277 19.5977C241.277 21.0039 241.492 22.3906 241.922 23.7578C242.352 25.125 243.055 26.3359 244.031 27.3906C245.047 28.4062 246.297 28.9531 247.781 29.0312H264.422Z" fill="#7A92CA"/>
</svg>
</a>
            </div>
            {/* <p className="text-black text-sm leading-relaxed mb-3">
              Connect with the right creators. Fast. Put up a request or just browse through our curated network of influencers and content creators.
            </p> */}
            <div className="flex space-x-4 justify-center align-center">
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">
              <svg className="w-5 h-5" fill="#000" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
            
                <Image src={"/images/social-media/facebook-icon.svg"} alt="Bengaluru" width={23} height={23} />

              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">
                {/* <svg className="w-5 h-5" fill="#000" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg> */}
                                  <Image src={"/images/social-media/youtube-icon.svg"} alt="Bengaluru" width={23} height={23} />
              </a>
                  </div>
                    {/* Bottom Bar */}
        <div className="mt-2 pt-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p className="text-black text-sm">
              © 2025 Dumzoo. All rights reserved. 
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/privacy-policy" className="text-black text-sm hover:text-gray-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-black text-sm hover:text-gray-600 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <span className="text-black text-sm">Made with ❤️ in India</span>
            </div>
          </div>
        </div>
              </div>
              </div>
    </footer>
    </div>
    <style jsx>{`
    
      .hero-bg-image {
        background: #000 url('/images/hero.png') no-repeat center bottom;
        background-size: 100% 100px;
        background-position: bottom;
        background-repeat: no-repeat;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100px;
        z-index: 1;
        opacity: 0.1;
      }
        .footer-section {
          background: #e9c9c936 url('/images/footer.png') no-repeat center bottom;
          background-size: 100%;
          background-position: center bottom;
          background-repeat: no-repeat;
        padding-bottom: 150px;

        }
        
        .testimonials-container {
          display: flex;
          flex-direction: column;
          animation: scrollUp 20s linear infinite;
        }
        
        .testimonials-track {
          flex-shrink: 0;
        }
        
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        
        .testimonials-container:hover {
          animation-play-state: paused;
        }
    `}</style>
    </>
  );
}
