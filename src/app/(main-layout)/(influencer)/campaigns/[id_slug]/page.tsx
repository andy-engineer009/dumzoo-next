import CampaignsDetails from "@/components/campaigns/campaignsDetails";

export default function CampaignPage() {
    const data = {
        id: '1',
        title: 'Campaign 1',
        description: 'This is the first campaign',
        budget: 1000,
        image: 'https://via.placeholder.com/150',
        categories: ['Category 1', 'Category 2'],
        languages: ['Language 1', 'Language 2'],
        gender: 'Male',
        minimumFollowers: 1000,
        platforms: ['Platform 1', 'Platform 2'],
        genderPreferences: ['Gender 1', 'Gender 2'],
        ageGroups: ['Age Group 1', 'Age Group 2'],
        brand: 'Brand Name',
        postedDate: '2025-01-01',
    }
    return (
        <div>
            <CampaignsDetails {...data} />
        </div>
    )
}