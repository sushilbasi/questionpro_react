import {configureStore} from "@reduxjs/toolkit";
import {generateQuestionReducer} from "./reducers/generateQuestionReducer";
import {authenticationReducer} from "./reducers/authenticationReducer";
import {domainReducer} from "./reducers/domainReducer";
import {examReducer} from "./reducers/examReducer";

export const store = configureStore({
    reducer: {
        examReducer,
        domainReducer,
        authenticationReducer,
        generateQuestionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;