import axiosInstance from "../../../api/axios";
import {
    SHOW_ALERT,
    USER_LOGIN_FAILURES,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_SIGNUP_FAILURES,
    USER_SIGNUP_REQUEST, USER_SIGNUP_SUCCESS
} from "./authenticationTypes";
import {GENERATE_QUESTION_SUCCESS} from "../generateQuestionAction/GenerateQuestionTypes";
import {setUserActive} from "../../../utils/auth.utils";

export const loginUser = (data: any) => async (dispatch: any) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        })

        const response = await axiosInstance({
            method: "POST",
            url: `/api/user/login`,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status == 200) {
            setUserActive(response.data.data.user)
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: response.data.data.user
            })
        }else{
            dispatch({
                type: USER_LOGIN_FAILURES,
            });
        }


    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAILURES,
        });
    }
    return true
}

export const signUpUser = (data: any) => async (dispatch: any) => {
    try {
        dispatch({
            type: USER_SIGNUP_REQUEST,
        })

        const response = await axiosInstance({
            method: "POST",
            url: `/api/user/create`,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response) {
            setUserActive(response.data.data.user)
        }
        console.log(response.data.data.user)
        dispatch({
            type: USER_SIGNUP_SUCCESS,
            payload: response.data.data.user
        })

    } catch (error) {
        dispatch({
            type: USER_SIGNUP_FAILURES,
        });
    }
    return true
}

export const showAlert = (message:string) => async(dispatch:any)=>{
    dispatch({
        type: SHOW_ALERT,
        payload:message
    })
}