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
async function uploadimage(data) {
    let endpoint = '/business-account/upload-image';
    return HttpClient.upload(endpoint, 'POST', data, {});
};
const getOccupationList = async () => {
    return HttpClient.post('/occupations');
}
const getEducationList = async () => {
    return HttpClient.post('/educations');
}
const getStatusList = async () => {
    return HttpClient.post('/marital-status');
}
const getSubscriptionList = async () => {
    return HttpClient.post('/subscription-list');
}
const getSubscriptionPayment = async (data) => {
    return HttpClient.post('/subscription-purchase',data);
}
const getVisitorListData = async () => {
    return HttpClient.post('/my-visitors');
}
const getWishListData = async (data) => {
    return HttpClient.post('/wishlist',data);
}
const getuserListNdFilterData = async (data) => {
    return HttpClient.post('/user-serach',data);
}
const getuserFullData = async (data) => {
    return HttpClient.post('/user-details',data);
}
const getSubmitPayment = async (data) => {
    return HttpClient.post('/subscription-purchase',data);
}
const getMySubscriptionPlans = async () => {
    return HttpClient.post('/my-payments');
}
const getAddWislit = async (data) => {
    return HttpClient.post('/add-to-wishlist',data);
}
const getRemoveWislit = async (data) => {
    return HttpClient.post('/remove-to-wishlist',data);
}
const getFullProfile = async () => {
    return HttpClient.post('/user');
}
const getsectList = async () => {
    return HttpClient.post('/sects');
}
const getLanguagesList = async () => {
    return HttpClient.post('/languages');
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
const getUpdateRegProfile = async (data) => {
    return HttpClient.post('/update-profile', data);
}
const getChangePassword = async (data) => {
    return HttpClient.post('/change-password', data);
}
const getUserProfile = async (data) => {
    return HttpClient.post('/user', data);
}

const HomeService = {
    getAccount,
    setAccount,
    setToken,
    uploadimage,
    getOccupationList,
    getEducationList,
    getStatusList,
    getSubscriptionList,
    getSubscriptionPayment,
    getVisitorListData,
    getWishListData,
    getuserListNdFilterData,
    getuserFullData,
    getSubmitPayment,
    getMySubscriptionPlans,
    getAddWislit,
    getRemoveWislit,
    getFullProfile,
    getsectList,
    getLanguagesList,
    getStateList,
    getCityList,
    getMaslakList,
    getUpdateRegProfile,
    getChangePassword,
    getUserProfile
}

export default HomeService;