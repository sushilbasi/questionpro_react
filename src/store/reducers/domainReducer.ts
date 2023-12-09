import {USER_LOGIN_FAILURES, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS} from "../actions/userAction/authenticationTypes";
import {
    DOMAIN_ADD_SUCCESS,
    DOMAIN_FAILURE,
    DOMAIN_REQUEST,
    DOMAIN_SUCCESS,
    DOMAIN_UPDATE, DOMAIN_UPDATE_REQUEST,
    DOMAIN_UPDATE_SUCCESS, SET_CURRENT_DOMAIN
} from "../actions/domainAction/domainTypes";
import {UPDATE_ACTIVE_QUESTION} from "../actions/generateQuestionAction/GenerateQuestionTypes";

const initState = {
    isFetchingDomain: false,
    isUpdatingDomain:false,
    current_domain: {
        domain_id: "",
        domain_name: 'Untitle'
    },
    domain_list: [],
}


export const domainReducer = (state = initState, action: any): any => {
    switch (action.type) {
        case SET_CURRENT_DOMAIN :
            return {
                ...state,
                current_domain: action.payload
            };

        case DOMAIN_REQUEST :
            return {
                ...state,
                isFetchingDomain: true
            };

        case DOMAIN_FAILURE :
            return {
                ...state,
                isFetchingDomain: false
            };

        case DOMAIN_SUCCESS :
            return {
                ...state,
                isFetchingDomain: false,
                domain_list: action.payload

            };

        case DOMAIN_UPDATE :
            return {
                ...state,
                current_domain: {...state.current_domain, "domain_name": action.payload.title},
                domain_list: state?.domain_list.map((obj: any) =>
                    obj._id === state.current_domain.domain_id
                        ? { ...obj, domain_name: action.payload.title }
                        : obj
                ),
                
            };

        case DOMAIN_UPDATE_REQUEST:
            return {
                ...state,
                isUpdatingDomain:true,
            };

        case DOMAIN_ADD_SUCCESS:
            return {
                ...state,
                isUpdatingDomain:false,
                domain_list: [action.payload, ...state.domain_list]
            };

        case DOMAIN_UPDATE_SUCCESS:
            return {
                ...state,
                isUpdatingDomain:false,
                domain_list: state?.domain_list.map((obj: any) =>
                    obj._id === action.payload._id
                        ? { ...obj, domain_name: action.payload.domain_name }
                        : obj
                ),
            };

        default:
            return state;
    }
}