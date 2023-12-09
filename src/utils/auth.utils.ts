import {addAuthToLocalStorage, getAuthToken} from "./localStorage.util";

export const isUserLoggedIn = () => {
    if (!!getAuthToken()) {
        console.log("a")
        return true;
    }
    console.log("b")
    return false;
};


export const setUserActive = (data:any) => {
    addAuthToLocalStorage(data)
};