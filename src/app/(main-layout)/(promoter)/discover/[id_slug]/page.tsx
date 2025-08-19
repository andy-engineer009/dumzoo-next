'use client'

import { api } from "@/common/services/rest-api/rest-api";
import InfluencerDetail from "@/components/influencer/InfulancerDetail";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_ROUTES } from "@/appApi";

export default function DetailPage() {
  const params = useParams();
  const uuid = params.id_slug;
  console.log(uuid);
  
  // const detail = {
  //     id: "1",
  //     name: "John Doe",
  //     username: "john_doe",
  //     image: "https://via.placeholder.com/150",
  //     isVerified: true,
  //     location: "New York",
  //     category: "Fashion",
  //     followers: 1000,
  //     overview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  //     posts: [],
  //     gender: "Male",
  //     age: 25,
  //     languages: ["English", "Spanish"],
  //     audienceType: "Male",
  //     audienceAgeGroup: "18-25",
  //     offers: [
  //       {
  //         id: "1",
  //         type: "single",
  //         name: "Single Post",
  //         price: 100,
  //         items: [{ contentType: "Post", quantity: 1 }]
  //       },
  //       {
  //         id: "2",
  //         type: "combo",
  //         name: "Combo Package",
  //         price: 200,
  //         items: [{ contentType: "Post", quantity: 1 }, { contentType: "Reel", quantity: 1 }]
  //       }
  //     ],
  //     instagramUrl: "https://www.instagram.com/john_doe",
  //     youtubeUrl: "https://www.youtube.com/john_doe",
  //     facebookUrl: "https://www.facebook.com/john_doe",
  //     startingPrice: 100
  // }  
   
  const [detail, setDetail] = useState<any>(null);
  
  useEffect(() => {
    if (!uuid) return; // Don't fetch if no ID
    
    const fetchData = async () => {
      try {
        const res = await api.post(API_ROUTES.getBasicDetails, {
          uuid: uuid
        });
        if(res.status == 1) {
          setDetail(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchData();
  }, [uuid]);
    
  return <div>
    <InfluencerDetail data={detail} />
  </div>;
}