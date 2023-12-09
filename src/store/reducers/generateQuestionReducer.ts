import {
    ACTIVE_EXAM_FAILURE,
    ACTIVE_EXAM_REQUEST, ACTIVE_EXAM_SUCCESS, ACTIVE_QUESTION_FAILURE, ACTIVE_QUESTION_SUCCESS,
    CREATE_QUESTION_SUCCESS,
    FETCH_QUESTION_REQUEST,
    GENERATE_QUESTION_FAILURE,
    GENERATE_QUESTION_REQUEST,
    GENERATE_QUESTION_SUCCESS, PUBLISH_ACTIVE_QUESTION_FAILURE, PUBLISH_ACTIVE_QUESTION_SUCCESS,
    QUESTION_FAILURE,
    QUESTION_SUCCESS, REMOVE_ACTIVE_QUESTION, RESET_ACTIVE_QUESTION,
    SAVE_ACTIVE_QUESTION, STORE_ACTIVE_QUESTION_REQUEST,
    STORE_QUESTION_REQUEST,
    UPDATE_ACTIVE_QUESTION
} from "../actions/generateQuestionAction/GenerateQuestionTypes";

const initState = {
    isGeneratingQuestion: false,
    isFetchingDomain: false,
    isFetchingExamList: false,
    setActiveQuestion: false,
    context_list: [],
    created_date: "",
    active_questions: [],
    exam_list: [],
    active_questions_saved: false,
    publish_url: ""
}


export const generateQuestionReducer = (state = initState, action: any): any => {
    switch (action.type) {
        case GENERATE_QUESTION_REQUEST:
            return {
                ...state,
                isGeneratingQuestion: true,
            };

        case GENERATE_QUESTION_SUCCESS:
            return {
                ...state,
                isGeneratingQuestion: false,
                context_list: [...state.context_list, action.payload],
            }


        case GENERATE_QUESTION_FAILURE:
            return {
                ...state,
                isGeneratingQuestion: false,
            }

        case QUESTION_FAILURE:
            return {
                ...state,
                isFetchingDomain: true,
            }

        case QUESTION_SUCCESS:
            return {
                ...state,
                isFetchingDomain: false,
                context_list: action.payload.domain_context.context_list,
                created_date: action.payload.domain_context.created_date,
            }

        case STORE_QUESTION_REQUEST:
            return {
                ...state,
                isFetchingDomain: false,
            }

        case FETCH_QUESTION_REQUEST:
            return {
                ...state,
                isFetchingDomain: false,
            }

        case SAVE_ACTIVE_QUESTION:
            return {
                ...state,
                active_questions: [...state.active_questions, action.payload.data],
            }

        case UPDATE_ACTIVE_QUESTION:
            return {
                ...state,
                active_questions: state?.active_questions.map((obj: any, key) =>
                    key === action.payload.key
                        ? {...obj, full_marks: action.payload.full_marks}
                        : obj
                ),
            };

        case REMOVE_ACTIVE_QUESTION:
            return {
                ...state,
                active_questions: state?.active_questions.filter((item:any )=> item.question !== action.payload),
            };

        case STORE_ACTIVE_QUESTION_REQUEST:
            return {
                ...state,
                isFetchingDomain: true,
            }

        case ACTIVE_QUESTION_SUCCESS:
            return {
                ...state,
                isFetchingDomain: false,
                publish_url: window.location.origin + '/exam?i=' + action.payload,
                active_questions_saved: true,
                exam_list: [action.payload, ...state.exam_list]
            }

        case ACTIVE_QUESTION_FAILURE:
            return {
                ...state,
                isFetchingDomain: false,
            }


        case PUBLISH_ACTIVE_QUESTION_SUCCESS:
            return {
                ...state,
                isFetchingDomain: false,
                publish_url: window.location.origin + '/exam?i=' + action.payload,
                active_questions_saved: true
            }


        case PUBLISH_ACTIVE_QUESTION_FAILURE:
            return {
                ...state,
                isFetchingDomain: false,
            }

        case RESET_ACTIVE_QUESTION:
            return {
                ...state,
                active_questions: [],
                active_questions_saved: false
            }


        case ACTIVE_EXAM_REQUEST:
            return {
                ...state,
                isFetchingExamList: true,
            }

        case ACTIVE_EXAM_SUCCESS:
            return {
                ...state,
                isFetchingExamList: false,
                exam_list: action.payload
            }

        case ACTIVE_EXAM_FAILURE:
            return {
                ...state,
                isFetchingExamList: false,
            }

        default:
            return state;
    }
}