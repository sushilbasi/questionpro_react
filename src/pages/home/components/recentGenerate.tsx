import React, {useEffect, useState} from 'react';
import {Button, Card, Paper, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import QuestionproHeader from "../../../components/questionproHeader";
import {domainUpdateRequest, getDomainList, setCurrentDomain} from "../../../store/actions/domainAction/domain";
import {useDispatch, useSelector} from "react-redux";
import {domainReducer} from "../../../store/reducers/domainReducer";
import {fetchGeneratedQuestions, getExamIdList} from "../../../store/actions/generateQuestionAction/GenerateQuestion";

const useStyles = makeStyles((theme: any) => ({
    card: {
        maxWidth: 900,
        margin: '20px',
        cursor: "pointer",
        padding: '10px 20px',
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        }
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9 aspect ratio for the card image
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        '&:hover': {
            backgroundColor: '#0056b3',
        },
    },
    container: {
        padding: 3,
    },
    paper: {
        padding: 4,
    },
    addDomain: {
        marginTop: '20px',
        padding: '10px',
        display:"flex",
        justifyContent:'center'
    }
}));


function RecentGenerate(props: any) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const {domain_list, isFetchingDomain, isUpdatingDomain} = useSelector((state: any) => state?.domainReducer || [])
    const {user} = useSelector((state: any) => state?.authenticationReducer)
    const user_id = localStorage.getItem("token")
    const [flagDomain, setFlagDomain] = useState(false)

    const addNewDomain = () => {
        const new_domain = {
            "domain_name": "Untitled",
            "user_id": user_id,
            "domain_id": ""
        }
        // @ts-ignore
        dispatch(domainUpdateRequest(new_domain, 'add'))
        setFlagDomain(true)
    }

    const onClickDomain = (v: any) => {
        const obj_domain = {
            "domain_id": v._id,
            "domain_name": v.domain_name
        }
        // @ts-ignore
        dispatch(setCurrentDomain(obj_domain))

        const obj_domain_context = {
            "user_id":user_id,
            "domain_id": v._id
        }
        // @ts-ignore
        dispatch(fetchGeneratedQuestions(obj_domain_context))


        // @ts-ignore
        dispatch(getExamIdList({"domain_id":v._id}))

    }


    useEffect(() => {
        if(user_id){
            // @ts-ignore
            dispatch(getDomainList({"user_id": user_id}))
        }
    }, [user])

    // On Loading the page
    useEffect(()=>{
        if(domain_list.length>0){
            onClickDomain(domain_list[0])
        }
    },[isFetchingDomain, user])


    useEffect(()=>{
        if(domain_list.length>0){
            console.log(domain_list[0].domain_name)
            onClickDomain(domain_list[0])
            setFlagDomain(false)
        }
    },[isUpdatingDomain])


    return (
        <>
            <div style={{"height": "80%", overflow:"auto"}}>
                {domain_list && domain_list.map((v: any, i: number) =>
                    (<Card variant="outlined" key={i} className={classes.card} onClick={() => onClickDomain(v)}>
                        {v.domain_name === '' ? "Untitled": v.domain_name}
                    </Card> )
                )}

            </div>
            <div style={{"height": "20%"}}>
                <Card variant="outlined" className={classes.addDomain}>
                    <Button variant="outlined" onClick={addNewDomain}>New Domain</Button>
                </Card>
            </div>
        </>
    );
}

export default RecentGenerate;