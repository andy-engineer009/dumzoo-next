'use client';
import PromotorHome from "@/components/homePage/PromotorHome";
import InfluencerHome from "@/components/homePage/influencerHome";
import { useSelector } from "react-redux";
import { selectUserRole , selectIsLoggedIn} from "@/store/userRoleSlice";

export default function Home() {
  const userRole = useSelector(selectUserRole);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <>
    {userRole === null && ''}
    {(userRole == '3' || !isLoggedIn) && <PromotorHome />}

    {isLoggedIn && userRole === '2' && <InfluencerHome />}
    </>
  );
}
