import React, {useEffect} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import QuestionproHeader from "../../components/questionproHeader";
import {
    Button,
    Card,
    Checkbox,
    FormControl,
    InputLabel,
    List,
    ListItem, ListItemText,
    MenuItem,
    Paper,
    Select, TextField,
    Typography
} from "@mui/material";
import RecentGenerate from "../home/components/recentGenerate";
import TextEditor from "../home/components/textEditor";
import Dropzone from "../home/components/dropzone";
import {makeStyles} from "@mui/styles";
import ResultMainBody from "./resultMainBody";
import {isUserLoggedIn} from "../../utils/auth.utils";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles((theme: any) => ({
    mainBackground: {
        backgroundColor: '#F4F5F7',
        height: '100vh',
        // maxHeight: '100vh'
    },
    scrollableStudentParticipationCard: {
        overflow: 'auto',
        height: '100%',
        minHeight: '47vw',
        padding: '10px'
    },
}));


function Result(props: any) {
    const classes = useStyles();
    const navigate = useNavigate()


    useEffect(()=>{
        if(!isUserLoggedIn()){
            navigate("/login");
        }
    },[])

    return (
        <>
            <div className={classes.mainBackground}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid xs={12}>
                        <QuestionproHeader/>
                    </Grid>
                    <Grid xs={12}>
                        <ResultMainBody/>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default Result;