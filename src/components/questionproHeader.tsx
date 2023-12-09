import React, {useEffect, useState} from 'react';
import {Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import Grid from "@mui/material/Grid";
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const useStyles = makeStyles((theme: any) => ({
    mainPageHead: {
        minHeight: '6vh',
        padding: '10px',
    },
}));

function QuestionproHeader(props: any) {
    const classes = useStyles();
    const navigate = useNavigate()
    const logout = (e: any) => {
        e.preventDefault();
        localStorage.clear();
        navigate('/login')
    }
    const {user} = useSelector((state:any)=> state?.authenticationReducer)


    const [userDetail, setUserDetail] = useState({
        first_name: undefined,
        last_name: undefined
    });

    useEffect(() => {
        // Retrieve the item from local storage
        const storedDataString = localStorage.getItem('user_detail');

        // Check if the item exists in local storage
        if (storedDataString) {
            try {
                // Parse the string into a JavaScript object
                const parsedData = JSON.parse(storedDataString);
                setUserDetail(parsedData);
            } catch (error) {
                // Handle parsing error, if any
                console.error('Error parsing JSON:', error);
            }
        }
    }, [user]);


    return (
        <>
            <Paper className={classes.mainPageHead}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={6}>
                        <Typography variant="h3" style={{
                            fontFamily: 'EB Garamond',
                            // margin: '14px 20px',
                            fontSize: '3vw'
                        }}> Question
                            Pro</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        {props?.isTest != true && <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            margin:'10px',
                            fontSize: "0.9vw", gap: "20px"
                        }}>
                            <div style={{margin: "10px"}}>
                                {userDetail.first_name} {userDetail.last_name}
                            </div>
                            <Button variant="outlined" onClick={logout}>
                                <LogoutIcon/> Logout
                            </Button>
                        </div>}
                    </Grid>

                </Grid>
            </Paper>
        </>
    );
}

export default QuestionproHeader;