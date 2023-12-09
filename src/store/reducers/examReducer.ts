import {
    ANSWER_COMPLETE,
    EXAM_COMPLETED,
    EXAM_REQUEST,
    EXAM_REQUEST_FAILURE,
    EXAM_REQUEST_SUCCESS, EXAM_RESULT_FAILURE,
    EXAM_RESULT_REQUEST, EXAM_RESULT_SUCCESS,
    EXAM_SUBMITTED_FAILURE,
    EXAM_SUBMITTED_REQUEST,
    EXAM_SUBMITTED_SUCCESS,
    UPDATE_STUDENT_DETAIL
} from "../actions/examAction/examTypes";


const initState = {
    isFetchingExam: false,
    isExamSubmitted: false,
    isExamComplete: false,
    submitted_status: "",
    exam_id: "",
    active_questions: [],
    student_name:"",
    student_number:"",
    email:"",
    answers:[],
    exam_result: []
}


export const examReducer = (state = initState, action: any): any => {
    switch (action.type) {
        case EXAM_REQUEST:
            return {
                ...state,
                isFetchingExam: true
            };

        case EXAM_REQUEST_FAILURE:
            return {
                ...state,
                isFetchingExam: false
            };

        case EXAM_REQUEST_SUCCESS:
            return {
                ...state,
                isFetchingExam: false,
                active_questions: action.payload.active_questions,
                exam_id:action.payload.exam_id,
                answers: action.payload.active_questions.map((val: any, index:number) => ({
                    question_index: index,
                    answer: "", // You can set the initial value to whatever is appropriate
                }))
            };

        case ANSWER_COMPLETE:

            const updatedAnswers = state.answers.map((answer:any, index) =>
                index === action.payload.question_index
                    ? { ...answer, answer: action.payload.answer }
                    : answer
            );
            return {
                ...state,
                answers: updatedAnswers,
            };

        case UPDATE_STUDENT_DETAIL:
            return {
                ...state,
                student_name:action.payload.student_name,
                student_number:action.payload.student_number,
                email:action.payload.email,
            };

        case EXAM_SUBMITTED_REQUEST:
            return {
                ...state,
                isExamSubmitted: true
            };

        case EXAM_SUBMITTED_SUCCESS:
            return {
                ...state,
                isExamSubmitted: false,
                isExamComplete: true,
                submitted_status: "Exam Completed Successfully"
            };

        case EXAM_SUBMITTED_FAILURE:
            return {
                ...state,
                isExamSubmitted: false,
                submitted_status: action.payload.message
            };

        case EXAM_COMPLETED:
            return {
                ...state,
                isExamComplete: true,
                submitted_status: "Exam Completed Successfully"
            };


        case EXAM_RESULT_REQUEST:
            return {
                ...state,
                isExamSubmitted: true
            };

        case EXAM_RESULT_SUCCESS:
            return {
                ...state,
                isExamSubmitted: false,
                active_questions: action.payload.active_question.active_questions,
                exam_id:action.payload.active_question.exam_id,
                exam_result: action.payload.student_answers
            };

        case EXAM_RESULT_FAILURE:
            return {
                ...state,
                isExamSubmitted: false,
            };
        default:
            return state;
    }
}