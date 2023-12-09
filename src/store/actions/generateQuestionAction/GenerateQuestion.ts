import axiosInstance from "../../../api/axios";
import axios from "../../../api/axios";
import {
    ACTIVE_EXAM_FAILURE,
    ACTIVE_EXAM_REQUEST, ACTIVE_EXAM_SUCCESS,
    ACTIVE_QUESTION_FAILURE,
    ACTIVE_QUESTION_SUCCESS,
    FETCH_QUESTION_REQUEST,
    GENERATE_QUESTION_FAILURE,
    GENERATE_QUESTION_REQUEST,
    GENERATE_QUESTION_SUCCESS, PUBLISH_ACTIVE_QUESTION_FAILURE,
    PUBLISH_ACTIVE_QUESTION_SUCCESS,
    QUESTION_FAILURE,
    QUESTION_SUCCESS, REMOVE_ACTIVE_QUESTION,
    SAVE_ACTIVE_QUESTION,
    STORE_ACTIVE_QUESTION_REQUEST,
    STORE_QUESTION_REQUEST,
    UPDATE_ACTIVE_QUESTION
} from "./GenerateQuestionTypes";
import {USER_LOGIN_FAILURES, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS} from "../userAction/authenticationTypes";
import {setUserActive} from "../../../utils/auth.utils";
import {generateQuestionReducer} from "../../reducers/generateQuestionReducer";

export const getQuestionGenerationPreTrain = (data: any) => async (dispatch: any, getState:any) => {
    console.log("sldjfskd",data)
    try {
        dispatch({
            type: GENERATE_QUESTION_REQUEST,
        })

        axiosInstance({
            method: "POST",
            // url: `http://127.0.0.1:8000/t5/pretrained/generate_questions`,
            url: `http://question-pro.duedhwbaf6gnesev.eastus.azurecontainer.io/t5/onnx/pretrained/generate_questions`,
            data: JSON.stringify({'context': data}),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response: any) => {
            const generated_question_array: any[] = []
            response.data.forEach((item: any) => {
                item.generated_questions.forEach((question: any) => {
                    const questionArray = question.questions;
                    questionArray.forEach((ques: any) => {
                        generated_question_array.push(ques);
                    })
                });
            });

            dispatch({
                type: GENERATE_QUESTION_SUCCESS,
                payload: {
                    context: data,
                    questions: generated_question_array
                }
            })

            const currentState = getState();
            // console.log(currentState?.generateQuestionReducer?.context_list)
            let store_data = {
                "user_id":localStorage.getItem('token'),
                "domain_id":currentState?.domainReducer?.current_domain?.domain_id,
                "title": currentState?.domainReducer?.current_domain?.domain_name,
                "context_list": currentState?.generateQuestionReducer?.context_list
            }

            dispatch(storeGeneratedQuestions(store_data))
        }).catch(err => {
            dispatch({
                type: GENERATE_QUESTION_FAILURE,
            });
        })
    } catch (error) {
        console.log("aaa")
        dispatch({
            type: GENERATE_QUESTION_FAILURE,
        });
    }
    return true
}

export const getQuestionGenerationCustom = (data: any) => async (dispatch: any, getState:any) => {
    try {
        dispatch({
            type: GENERATE_QUESTION_REQUEST,
        })

        console.log('data,', data)
        axiosInstance({
            method: "POST",
            // url: `http://127.0.0.1:8000/t5/custom/generate_questions`,
            url: `http://question-pro.duedhwbaf6gnesev.eastus.azurecontainer.io/t5/onnx/custom/generate_questions`,
            data: JSON.stringify({'context': data}),
            headers: {
                'Content-Type': 'application/json',
            }

        }).then((response: any) => {
            const generated_question_array: any[] = []
            response.data.forEach((item: any) => {
                item.generated_questions.forEach((question: any) => {
                    const questionArray = question.questions;
                    questionArray.forEach((ques: any) => {
                        generated_question_array.push(ques);
                    })
                });
            });
            dispatch({
                type: GENERATE_QUESTION_SUCCESS,
                payload: {
                    context: data,
                    questions: generated_question_array
                }
            })

            const currentState = getState();
            // console.log(currentState?.generateQuestionReducer?.context_list)
            let store_data = {
                "user_id":localStorage.getItem('token'),
                "domain_id":currentState?.domainReducer?.current_domain?.domain_id,
                "title":currentState?.domainReducer?.current_domain?.domain_name,
                "context_list": currentState?.generateQuestionReducer?.context_list
            }

            dispatch(storeGeneratedQuestions(store_data))
        }).catch(err => {
            dispatch({
                type: GENERATE_QUESTION_FAILURE,
            });
        })
    } catch (error) {
        console.log("aaa")
        dispatch({
            type: GENERATE_QUESTION_FAILURE,
        });
    }
    return true
}

export const getQuestionGenerationSequence = (data: any) => async (dispatch: any, getState:any) => {
    try {
        dispatch({
            type: GENERATE_QUESTION_REQUEST,
        })

        axiosInstance({
            method: "POST",
            url: `/api/generate/sequence`,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }

        }).then((response: any) => {
            const generated_question_array: any[] = [response.data.question]
            dispatch({
                type: GENERATE_QUESTION_SUCCESS,
                payload: {
                    context: data.context,
                    questions: generated_question_array
                }
            })

            const currentState = getState();
            // console.log(currentState?.generateQuestionReducer?.context_list)
            let store_data = {
                "user_id":localStorage.getItem('token'),
                "domain_id":currentState?.domainReducer?.current_domain?.domain_id,
                "title":currentState?.domainReducer?.current_domain?.domain_name,
                "context_list": currentState?.generateQuestionReducer?.context_list
            }

            dispatch(storeGeneratedQuestions(store_data))
        }).catch(err => {
            dispatch({
                type: GENERATE_QUESTION_FAILURE,
            });
        })
    } catch (error) {
        console.log("aaa")
        dispatch({
            type: GENERATE_QUESTION_FAILURE,
        });
    }
    return true
}



export const storeGeneratedQuestions = (data: any) => async (dispatch: any) => {
    try {
        dispatch({
            type: STORE_QUESTION_REQUEST,
        })
        const response = await axiosInstance({
            method: "POST",
            url: `/api/question/domain/update`,
        // /question/domain/update
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response.status ==200){
            dispatch({
                type: QUESTION_SUCCESS,
            })
        }else{
            throw new Error("Server Error Generated Questions are failed to save.")
        }
    } catch (error) {
        dispatch({
            type: QUESTION_FAILURE,
        });
    }
    return true
}

export const fetchGeneratedQuestions = (data: any) => async (dispatch: any) => {
    try {
        dispatch({
            type: FETCH_QUESTION_REQUEST,
        })
        const response = await axiosInstance({
            method: "POST",
            url: `/api/question/domain/list`,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log(response.data.data)
        dispatch({
            type: QUESTION_SUCCESS,
            payload:response.data.data
        })

    } catch (error) {
        dispatch({
            type: QUESTION_FAILURE,
        });
    }
    return true
}



export const storeActiveQuestions = (data: any) => async (dispatch: any) => {
    try {
        dispatch({
            type: STORE_ACTIVE_QUESTION_REQUEST,
        })
        const response = await axiosInstance({
            method: "POST",
            url: `/api/question/domain/active_question`,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        dispatch({
            type: ACTIVE_QUESTION_SUCCESS,
            payload: response.data.data.exam_id
        })

    } catch (error) {
        dispatch({
            type: ACTIVE_QUESTION_FAILURE,
        });
    }
    return true
}


export const updateActiveQuestions = (data: any) => async (dispatch: any) => {
    console.log(data)
    dispatch({
        type: UPDATE_ACTIVE_QUESTION,
        payload:{
            key: data.key,
            full_marks: data.value
        }
    })
    return true
}

export const saveActiveQuestions = (data: any) => async (dispatch: any) => {
    dispatch({
        type: SAVE_ACTIVE_QUESTION,
        payload:{
            data: data,
        }
    })
    return true
}

export const removeActiveQuestions = (data: any) => async (dispatch: any) => {
    dispatch({
        type: REMOVE_ACTIVE_QUESTION,
        payload:data
    })
    return true
}


export const publishActiveQuestion = (data: any) => async (dispatch: any) => {
    try {
        dispatch({
            type: STORE_ACTIVE_QUESTION_REQUEST,
        })
        const response = await axiosInstance({
            method: "POST",
            url: `/api/question/domain/publish`,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        dispatch({
            type: PUBLISH_ACTIVE_QUESTION_SUCCESS,
            payload:response.data.data.exam_id
        })

    } catch (error) {
        dispatch({
            type: PUBLISH_ACTIVE_QUESTION_FAILURE,

        });
    }
    return true
}

export const getExamIdList = (data: any) => async (dispatch: any) => {
    try {
        dispatch({
            type: ACTIVE_EXAM_REQUEST,
        })
        const response = await axiosInstance({
            method: "POST",
            url: `/api/domain/exam_id/list`,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        dispatch({
            type: ACTIVE_EXAM_SUCCESS,
            payload:response.data.data.exam_list
        })

    } catch (error) {
        dispatch({
            type: ACTIVE_EXAM_FAILURE,

        });
    }
    return true
}


