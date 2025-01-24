import HttpClient from "../Utils/HttpClient"
import MainStorage from "../Utils/MainStorage";

const getAccount = async () => {
    return MainStorage.get('account');
}

const setAccount = async (data) => {
    return MainStorage.set('account', data);
}
async function setToken(data) {
    return await MainStorage.set('token', data);
}
async function getToken() {
    return await MainStorage.get('token');
}
const getregister = async (data) => {
    return HttpClient.post('/register', data);
}
const getEmailOTP = async (data) => {
    return HttpClient.post('/email-otp-verify', data);
}
const getlogin = async (data) => {
    return HttpClient.post('/get-login-otp', data);
}
const getlogOtp = async (data) => {
    return HttpClient.post('/login', data);
}
const getsectList = async () => {
    return HttpClient.post('/sects');
}
const getOccupationList = async () => {
    return HttpClient.post('/occupations');
}
const getEducationList = async () => {
    return HttpClient.post('/educations');
}
const getLanguagesList = async () => {
    return HttpClient.post('/languages');
}
const getStatusList = async () => {
    return HttpClient.post('/marital-status');
}
const getStateList = async () => {
    return HttpClient.post('/states');
}
const getCityList = async (data) => {
    return HttpClient.post('/cities', data);
}
const getMaslakList = async () => {
    return HttpClient.post('/maslaks');
}
const getCastkList = async () => {
    return HttpClient.post('/castes');
}
const getUpdateRegProfile = async (data) => {
    return HttpClient.post('/update-profile', data);
}
const getForgotPasswordEmail = async (data) => {
    return HttpClient.post('/forgot-password', data);
}
const getVerifyResendOTP = async (data) => {
    return HttpClient.post('/resend-otp', data);
}
const getForgotPasswordOTP = async (data) => {
    return HttpClient.post('/forgot-password-otp-check', data);
}
const getREsetForgotPassword = async (data) => {
    return HttpClient.post('/reset-password', data);
}
const getDeviceToken = async (data) => {
    return HttpClient.post('/update-device-token', data);
}
const getTermsData = async () => {
    return HttpClient.post('/terms-and-conditions');
}
const getPolicyData = async () => {
    return HttpClient.post('/privacy-policy');
}

const AuthService = {
    getAccount,
    setAccount,
    setToken,
    getToken,
    getregister,
    getEmailOTP,
    getlogin,
    getlogOtp,
    getsectList,
    getOccupationList,
    getEducationList,
    getLanguagesList,
    getStatusList,
    getStateList,
    getCityList,
    getMaslakList,
    getUpdateRegProfile,
    getForgotPasswordEmail,
    getVerifyResendOTP,
    getForgotPasswordOTP,
    getREsetForgotPassword,
    getDeviceToken,
    getCastkList,
    getTermsData,
    getPolicyData
}

export default AuthService;