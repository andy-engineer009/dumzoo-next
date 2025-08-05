// A more standard and correct way to define common API routes in a TypeScript project is to use `export` instead of `module.exports`.
// Also, fix the typo "singup" to "signup".

export const API_ROUTES = {
    google_signup: "auth/google-signup",
    referral: "auth/referal-code",
    dropdownData: "dropdown-data",
    addInfulancer: "influencer/add",
    otpVerify: "auth/otp-verify"
    // goToSignup: "http://localhost:5000/api/auth/signup",
    // getdashboardData: "http://localhost:5000/api/user/dashboard",
    // withdraw: "http://localhost:5000/api/user/withdraw",
    // withdrawList: "http://localhost:5000/api/user/withdrawals-list",
    // updateWithdrawalStatus: "http://localhost:5000/api/user/withdraw-update-status",
};