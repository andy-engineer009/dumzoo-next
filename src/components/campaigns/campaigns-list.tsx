'use client'

import { api } from "@/common/services/rest-api/rest-api";
import { useEffect } from "react";
import { API_ROUTES } from "@/appApi";

import { useState } from "react";

export default function CampaignsList() {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);   
        api.post(API_ROUTES.campaignList, {
            start: 0,
            length: 10
        }).then((res) => {
            setIsLoading(false);   
            console.log(res.data);
        })
        
    },[])
    
  return (
    <div>
      <h1>Campaigns List</h1>
    </div>
  );
}
