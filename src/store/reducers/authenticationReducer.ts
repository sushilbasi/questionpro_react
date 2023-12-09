import {
    GENERATE_QUESTION_FAILURE,
    GENERATE_QUESTION_REQUEST,
    GENERATE_QUESTION_SUCCESS
} from "../actions/generateQuestionAction/GenerateQuestionTypes";
import {
    SHOW_ALERT,
    USER_LOGIN_FAILURES,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS, USER_SIGNUP_FAILURES,
    USER_SIGNUP_REQUEST, USER_SIGNUP_SUCCESS
} from "../actions/userAction/authenticationTypes";

const initState = {
    isFetchingUser: false,
    login_status: null,
    user: null,
    showAlert: false,
    message:"",
}


export const authenticationReducer = (state = initState, action: any): any => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return {
                ...state,
                isFetchingUser: true
            };

        case USER_LOGIN_FAILURES:
            return {
                ...state,
                isFetchingUser: false,
                login_status:false
            }

        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                isFetchingUser: false,
                user: action.payload,
                login_status: true
            }


        case USER_SIGNUP_REQUEST:
            return {
                ...state,
                isFetchingUser: true
            };

        case USER_SIGNUP_FAILURES:
            return {
                ...state,
                isFetchingUser: false,
                login_status: fail
            }

        case USER_SIGNUP_SUCCESS:
            return {
                ...state,
                isFetchingUser: false,
                user: action.payload,
                login_status: true
            }

        case SHOW_ALERT:
            return {
                ...state,
                showAlert:true,
                message:action.payload
            }

        default:
            return state;
    }
}