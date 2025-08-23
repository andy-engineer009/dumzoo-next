// A more standard and correct way to define common API routes in a TypeScript project is to use `export` instead of `module.exports`.
// Also, fix the typo "singup" to "signup".

export const API_ROUTES = {
    google_signup: "auth/google-signup",
    google_login: "auth/google-login",
    referral: "auth/referal-code",
    dropdownData: "dropdown-data",
    addInfulancer: "influencer/add",
    otpVerify: "auth/otp-verify",

    // influencer
    getInfluencerProfile: "influencer/profile-detail",
    addUpdateInfluencer: "influencer/addUpdateProfile",
    addUpdateOffers: "influencer/addUpdateOffers",
    offersList: "influencer/offersList",
    deleteOffer: "influencer/deleteOffer",
    uploadMedia: "upload",
    getBasicDetails: "influencer/detail",
    influencerProfileAddUpdate: "influencer/profile-image",
    getInfluencerProfileImage: "influencer/profileImageList",
    influencerList: "influencer/list",
    influencerCampaignList: "influencer/campaignList",
    influencerCampaignDetail: "influencer/campaign-detail",
    influencerCampaignApplied: "influencer/apply-campaign",


    // promoter
    createCampaign: "promoter/add-compaign",
    campaignList: "promoter/campaign-list",
    appliedCampaingsInfluencerList: "promoter/applied-campaign-influencers",
    // getInfluencerProfile: "promoter/profile",
    // influencerDetail: "influencer/detail",
    // goToSignup: "http://localhost:5000/api/auth/signup",
    // getdashboardData: "http://localhost:5000/api/user/dashboard",
    // withdraw: "http://localhost:5000/api/user/withdraw",
    // withdrawList: "http://localhost:5000/api/user/withdrawals-list",
    // updateWithdrawalStatus: "http://localhost:5000/api/user/withdraw-update-status",
};