import {
    PUBLISH_ACTIVE_QUESTION_FAILURE,
    PUBLISH_ACTIVE_QUESTION_SUCCESS,
    STORE_ACTIVE_QUESTION_REQUEST
} from "../generateQuestionAction/GenerateQuestionTypes";
import axiosInstance from "../../../api/axios";
import {
    ANSWER_COMPLETE,
    EXAM_COMPLETED,
    EXAM_REQUEST,
    EXAM_REQUEST_FAILURE,
    EXAM_REQUEST_SUCCESS, EXAM_RESULT_FAILURE,
    EXAM_RESULT_REQUEST,
    EXAM_RESULT_SUCCESS,
    EXAM_SUBMITTED_FAILURE,
    EXAM_SUBMITTED_REQUEST,
    EXAM_SUBMITTED_SUCCESS,
    UPDATE_STUDENT_DETAIL
} from "./examTypes";

export const getExam = (data: any) => async (dispatch: any) => {
    try {
        dispatch({
            type: EXAM_REQUEST,
        })
        const response = await axiosInstance({
            method: "POST",
            url: `/api/exam`,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        dispatch({
            type: EXAM_REQUEST_SUCCESS,
            payload:response.data.data
        })

    } catch (error) {
        dispatch({
            type: EXAM_REQUEST_FAILURE,

        });
    }
    return true
}


export const storeExam = (data: any ) => async (dispatch: any) => {
    dispatch({
        type: ANSWER_COMPLETE,
        payload: data
    })
    return true
}

export const updateStudentDetail = (data: any ) => async (dispatch: any) => {
    dispatch({
        type: UPDATE_STUDENT_DETAIL,
        payload: data
    })
    return true
}

export const submitExam = (data: any) => async (dispatch: any) => {
    try {
        dispatch({
            type: EXAM_SUBMITTED_REQUEST,

        });

        const response = await axiosInstance({
            method: "POST",
            url: `/api/answer/domain/grade`,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if(response.status == 200){
            dispatch({
                type: EXAM_SUBMITTED_SUCCESS
            })
        }else{
            dispatch({
                type: EXAM_SUBMITTED_SUCCESS,
                payload: response.data
            })

        }

    } catch (error) {
        dispatch({
            type: EXAM_SUBMITTED_FAILURE,
            payload: error

        });
    }
    return true
}


export const getExamResult = (data: any) => async (dispatch: any) => {
    try {
        dispatch({
            type: EXAM_RESULT_REQUEST,

        });

        const response = await axiosInstance({
            method: "POST",
            url: `/api/exam/result`,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if(response.status == 200){
            dispatch({
                type: EXAM_RESULT_SUCCESS,
                payload: response.data.data
            })

        }else{
            console.log(response)
            dispatch({
                type: EXAM_RESULT_FAILURE
            })
        }
    } catch (error) {
        console.log(error)
        dispatch({
            type: EXAM_RESULT_FAILURE,
        });
    }
    return true
}