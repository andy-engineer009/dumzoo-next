import { useEffect } from "react";
import ReferralCode from "../../components/referralCode"

const ReferralPage = () => {
    // useEffect(() => {
    //     const referralCode = localStorage.getItem("referralCode");
    //     if (referralCode) {
    //         window.location.href = `/referral?code=${referralCode}`;
    //     }
    // }, []);
  return <ReferralCode />;
};

export default ReferralPage;    