import React, {useState} from 'react';
import QuestionproHeader from "../../components/questionproHeader";
import TestField from "./components/testField";
import {FormControl, FormLabel, Grid, Paper, TextField} from "@mui/material";
import {Form, useNavigate} from "react-router-dom";
import {makeStyles} from "@mui/styles";
import {isUserLoggedIn} from "../../utils/auth.utils";

const useStyles = makeStyles((theme: any) => ({
    mainBackground: {
        backgroundColor: '#F4F5F7',
        minHeight: '100vh',
        // maxHeight: '100vh'
    }

}));

function TestForm(props: any) {
    const classes = useStyles();
    const [isTest, setIsTest] = useState(true)

    return (
        <>
            <div className={classes.mainBackground}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <QuestionproHeader isTest={isTest}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TestField/>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default TestForm;