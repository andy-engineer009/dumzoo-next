'use client';

import { API_ROUTES } from "@/appApi";
import { api } from "@/common/services/rest-api/rest-api";
import CampaignsDetails from "@/components/campaigns/campaignsDetails";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/components/toast";
import CampaignDetailSkeleton from "@/components/campaigns/CampaignDetailSkeleton";

export default function CampaignPage() {
    // const data = {
    //     id: '1',
    //     title: 'Campaign 1',
    //     description: 'This is the first campaign',
    //     budget: 1000,
    //     image: 'https://via.placeholder.com/150',
    //     categories: ['Category 1', 'Category 2'],
    //     languages: ['Language 1', 'Language 2'],
    //     gender: 'Male',
    //     minimumFollowers: 1000,
    //     platforms: ['Platform 1', 'Platform 2'],
    //     genderPreferences: ['Gender 1', 'Gender 2'],
    //     ageGroups: ['Age Group 1', 'Age Group 2'],
    //     brand: 'Brand Name',
    //     postedDate: '2025-01-01',
    // }

    const [campaign, setCampaign] = useState<any>(null);
    const[loading, setLoading] = useState(false);
    const { id_slug } = useParams();
    const { showError } = useToast();

    useEffect(() => {
        const user_id = JSON.parse(localStorage.getItem('activeUser') || '{}')?.id;
        setLoading(true);
        api.post(API_ROUTES.influencerCampaignDetail, {
            campaign_id: id_slug,
            user_id: user_id
        }).then((res: any) => {
            setLoading(false);
            if(res.status == 1) {
                setCampaign(res.data);
            } else {
                showError(res.message, 2000);
            }
        })
    }, [])

    return (
        <div>
            {loading ? <CampaignDetailSkeleton /> : <CampaignsDetails {...campaign} />}
        </div>  
    )
}