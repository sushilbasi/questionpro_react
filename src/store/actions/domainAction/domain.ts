import axiosInstance from "../../../api/axios";
import {
    DOMAIN_ADD_SUCCESS,
    DOMAIN_FAILURE,
    DOMAIN_REQUEST,
    DOMAIN_SUCCESS,
    DOMAIN_UPDATE, DOMAIN_UPDATE_REQUEST,
    DOMAIN_UPDATE_SUCCESS, SET_CURRENT_DOMAIN
} from "./domainTypes";
import {
    CREATE_QUESTION_SUCCESS,
    RESET_ACTIVE_QUESTION,
    SAVE_ACTIVE_QUESTION
} from "../generateQuestionAction/GenerateQuestionTypes";
import {storeGeneratedQuestions} from "../generateQuestionAction/GenerateQuestion";

export const getDomainList = (data: any) => async (dispatch: any) => {
    try {
        dispatch({
            type: DOMAIN_REQUEST,
        })
        const response = await axiosInstance({
            method: "POST",
            url: `/api/domain/list`,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log("fetch Domain")
        console.log(response.data.data.domain_list)
        dispatch({
            type: DOMAIN_SUCCESS,
            payload: response.data.data.domain_list
        })

    } catch (error) {
        dispatch({
            type: DOMAIN_FAILURE,
        });
    }
    return true
}


export const domainUpdate = (data: any) => async (dispatch: any) => {
    dispatch({
        type: DOMAIN_UPDATE,
        payload: data
    })
    return true
}

// This Function will add the domain as well as update the domain. Here type parameter is either add or update.
export const domainUpdateRequest = (data: any, type: string) => async (dispatch: any, getState: any) => {
    try {
        dispatch({
            type: DOMAIN_UPDATE_REQUEST,
        })
        const response = await axiosInstance({
            method: "POST",
            url: `/api/domain/add`,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (type == 'add') {
            dispatch({
                type: DOMAIN_ADD_SUCCESS,
                payload: response.data.data.domain_detail
            })

        } else {
            dispatch({
                type: DOMAIN_UPDATE_SUCCESS,
                payload: response.data.data.domain_detail
            })
        }
    } catch (error) {
        dispatch({
            type: DOMAIN_FAILURE,
        });
    }
    return true
}


export const setCurrentDomain = (data: any) => async (dispatch: any) => {
    dispatch({
        type: SET_CURRENT_DOMAIN,
        payload: data
    })

    dispatch({
        type: RESET_ACTIVE_QUESTION,
    })
    return true
}