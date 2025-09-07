'use client';
import PromotorHome from "@/components/homePage/PromotorHome";
import InfluencerHome from "@/components/homePage/influencerHome";
import { useSelector } from "react-redux";
import { selectUserRole , selectIsLoggedIn} from "@/store/userRoleSlice";
import CampaignsPage from "./(influencer)/campaigns/page";
import Discover from "./(promoter)/discover/page";
export default function Home() {
  const userRole = useSelector(selectUserRole);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <>
    {(userRole === null || userRole === undefined) && ''}
    {(isLoggedIn && userRole === '2') && <CampaignsPage />} {/* Influencer Home */}
    {(isLoggedIn && userRole === '3') && <Discover />}
    {((!isLoggedIn && userRole != null && userRole != undefined )) && <PromotorHome />}

    {/* {(isLoggedIn && userRole === '2') && <InfluencerHome />} */}
    {/* {(userRole == '3' || (!isLoggedIn && userRole != null && userRole != undefined )) && <PromotorHome />} */}

    </>
  );
}
