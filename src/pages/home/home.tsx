import React, {useEffect, useState} from 'react';
import TextEditor from "./components/textEditor";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent, Checkbox, CircularProgress,
    Container,
    Divider, FormControl, FormLabel, InputLabel,
    List,
    ListItem, ListItemText, MenuItem, Modal,
    Paper, Select, TextField,
    Typography
} from "@mui/material";
import Grid from '@mui/material/Grid';
import {makeStyles} from '@mui/styles';
import RecentGenerate from "./components/recentGenerate";
import {isLabelWithInternallyDisabledControl} from "@testing-library/user-event/dist/utils";
import Dropzone from "./components/dropzone";
import QuestionproHeader from "../../components/questionproHeader";
import {useDispatch, useSelector} from "react-redux";
import {generateQuestionReducer} from "../../store/reducers/generateQuestionReducer";
import {
    publishActiveQuestion, removeActiveQuestions,
    saveActiveQuestions, storeActiveQuestions,
    storeGeneratedQuestions,
    updateActiveQuestions
} from "../../store/actions/generateQuestionAction/GenerateQuestion";
import {isUserLoggedIn} from "../../utils/auth.utils";
import {useNavigate} from "react-router-dom";
import {domainUpdate, domainUpdateRequest} from "../../store/actions/domainAction/domain";
import CopyAllIcon from '@mui/icons-material/CopyAll';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {green} from "@mui/material/colors";
import MySnackbar from "../../components/Snackbar";

const useStyles = makeStyles((theme: any) => ({
    card: {
        maxWidth: 900,
        margin: '20px',
        cursor: "pointer",
        padding: 20,
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
    background: {
        maxHeight: '100%',
        backgroundColor: '#F4F5F7'
    },
    cardHistory: {
        overflow:"auto",
        height: '84vh',
        padding: '10px'
    },
    emptyCardOnDomain: {

        height: '84vh',
        padding: '10px'
    },
    scrollableGeneratedOutcome: {
        overflowY: 'scroll',
        maxHeight: '37vh',
        minHeight: '37vh',
        padding: '10px',
        marginBottom: '20px'
    },
    ansDropbox: {
        maxHeight: '8vw',
        padding: '10px',
        marginBottom: '20px'
    },

    centerViewBoard: {
        height: '82vh',
        maxHeight: '42w',
        padding: '20px',
        overflow: 'auto'
    },

    scrollableCardDisplay: {
        overflow: 'auto',
        height: '82vh',
        padding: '20px',
    },

    displayOutcome: {
        padding: '10px',
        minHeight: '35vh'
    },

    displayPublishedUrl: {
        marginTop:"20px",
        padding: '10px',
    },

    displayOutcomeAction: {
        display:'flex',
        gap:'20px',
        marginTop: '20px',
        padding: '10px',
        textAlign: 'right',
        justifyContent:'right'
    },
    editorTitle: {
        height: '2vw',
        padding: '10px',
        marginBottom: '20px',
        boxShadow: 'none',
        width: '100%'

    },


}));

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const removeHtmlTags = (input: string | undefined): string => {
    if (typeof input === 'string') {
        input = input.replace(/<[^>]*>/g, '');
        input = input.replace(/\t/g, ' ');
        input = input.replace(/&nbsp;/g, ' ');
        return input
    } else {
        // Handle the case when input is undefined or not a string
        return '';
    }
};

const Home = (props: any) => {
    const [selectedModel, setModel] = useState(localStorage.getItem('data') || '');
    const [generated, setGenerate] = useState(false);
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user_id = localStorage.getItem('token');

    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);

    const {context_list, active_questions, publish_url, active_questions_saved, exam_list} = useSelector(
        (state: any) => state?.generateQuestionReducer
    );

    const {isFetchingDomain, current_domain, domain_list, isUpdatingDomain} = useSelector(
        (state: any) => state?.domainReducer || []
    );
    const {domain_name} = useSelector(
        (state: any) => state.domainReducer.current_domain
    );

    const handleSelectedQuestion = (e: any, context: string) => {
        const {value, checked} = e.target;
        console.log(checked)

        if (checked) {
            let dict_question = {
                "context": context,
                "question": value,
                "full_marks": 0
            }
            const hasKeyValue = active_questions.some((obj:any) => obj.hasOwnProperty("question") && obj["question"] === value);
            if(hasKeyValue){
                return false
            }

            // @ts-ignore
            dispatch(saveActiveQuestions(dict_question))
        }else{
            console.log("here")
            const hasKeyValue = active_questions.some((obj:any) => obj.hasOwnProperty("question") && obj["question"] === value);

            if(hasKeyValue){
                console.log("inside")
                // @ts-ignore
                dispatch(removeActiveQuestions(value))
            }else{
                return false
            }


        }
    }

    const saveDomain = () => {
        const new_domain = {
            "user_id": user_id,
            "domain_name": current_domain?.domain_name || '',
            "domain_id": current_domain.domain_id || ''
        }
        console.log(new_domain)
        // @ts-ignore
        dispatch(domainUpdateRequest(new_domain, 'update'))
    }

    const onSaveActiveQuestion = (e: any, index: number) => {
        const {value} = e.target;
        const update_active = {"key": index, "value": value}
        // @ts-ignore
        dispatch(updateActiveQuestions(update_active))
    }

    // Store and Publish the Active Question to the database
    const onStoreActiveQuestionDB = () => {
        let dict_active_ques = {
            "domain_id": current_domain.domain_id,
            "active_questions": active_questions
        }
        if(active_questions.length == 0){
            alert("Please add the questions to the active question list.")
        }else{
            // @ts-ignore
            dispatch(storeActiveQuestions(dict_active_ques))
            setOpen(true)
        }

    }

    // const onPublishActiveQuestion = () => {
    //     let dict_active_ques = {
    //         "domain_id": current_domain.domain_id,
    //     }
    //     // @ts-ignore
    //     dispatch(publishActiveQuestion(dict_active_ques))
    // }

    const updateDomainTitle = (e: any) => {
        // @ts-ignore
        dispatch(domainUpdate({"title": e.target.value}))
    }

    useEffect(() => {
        if(!isUserLoggedIn()){
            navigate("/login");
        }
    })

    const copyLink =(value:string)=>{
        value = window.location.origin + '/exam?i='+ value
        window.open(value);
        // const clipboardItem = new ClipboardItem({ "text/plain": new Blob([value], { type: "text/plain" }) });

        navigator.clipboard.writeText(value);
        // navigator.clipboard.write([clipboardItem])
        //     .then(() => {
        //         console.log('Text successfully copied to clipboard');
        //     })
        //     .catch(err => {
        //         console.error('Unable to copy text to clipboard', err);
        //     });
    }

    const onResultShow = (value:string) =>{
        value = window.location.origin + '/result?i='+ value;
        window.open(value);
    }


    return (
        <>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                    <QuestionproHeader/>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.cardHistory}>
                        <Typography variant="body1" component="div" style={{'margin': '20px 20px 0px 20px'}}>
                            Search History
                        </Typography>
                        <RecentGenerate/>
                    </Paper>

                </Grid>
                {domain_list.length == 0 &&
                    <Grid item xs={9}>
                    <Paper className={classes.emptyCardOnDomain}>
                        <div style={{position: "absolute",
                            textAlign:"center",
                            top: '50%',
                            left: '50%'}}
                            >
                            <Typography variant="h4" component="div">
                                Welcome to Question Pro.
                            </Typography>
                            <Typography variant="body2" component="div">
                               start your journey to generate new question by creating new domain.
                            </Typography>
                        </div>

                    </Paper>
                </Grid>
                }
                {domain_list.length >0 && <Grid item xs={6}>
                    <Paper className={classes.centerViewBoard}>
                        <div
                            style={{display: 'inline-flex', gap: '20px', paddingBottom: '10px', marginTop: '10px'}}>
                            <div style={{display: 'flex'}}>
                                <TextField label={"Title"} style={{minWidth: '200px'}} type="text"
                                           color='primary'
                                           onChange={updateDomainTitle}
                                           value={domain_name}/>
                            </div>

                            <FormControl>
                                <InputLabel id="generative-select-label">Generative Model</InputLabel>
                                <Select
                                    labelId="generative-model-select"
                                    id="generative-model-select"
                                    style={{width: "200px"}}
                                    value={selectedModel}
                                    label={"Generative Model"}
                                    variant={'outlined'}
                                    defaultValue={'t5'}
                                    onChange={(e) => setModel(e.target.value)}
                                >
                                    <MenuItem value={'custom'}>Custom Encode / Decoder</MenuItem>
                                    <MenuItem value={'t5'}>T5 Transformer</MenuItem>
                                    <MenuItem value={'sequence'}>Sequence</MenuItem>
                                </Select>
                            </FormControl>
                            <Box sx={{m: 1, position: 'relative'}}>
                                <Button variant="outlined"
                                        disabled={isUpdatingDomain}
                                        onClick={saveDomain}>Save</Button>

                                {isUpdatingDomain && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: green[500],
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                )}
                            </Box>
                            {/*{isUpdatingDomain == true && <MySnackbar show={true} message={"Domain Saved"}/>}*/}
                            <MySnackbar show={isUpdatingDomain == true} message={"Domain Saved"}/>
                            {/*<Button variant="outlined" onClick={saveDomain}>Save</Button>*/}
                        </div>
                        <Card className={classes.scrollableGeneratedOutcome} style={{overflowY: 'scroll'}}>
                            {context_list.length == 0 && (
                                <div style={{'padding': '100px'}}>
                                    <Typography variant="h5" style={{display: 'flex', justifyContent: 'center'}}>
                                        Generate Questions
                                    </Typography>
                                    <br/>
                                    <Typography variant="body2" style={{display: 'flex', justifyContent: 'center'}}
                                                color="text.secondary">
                                        Type below to generate short questions
                                    </Typography>
                                </div>
                            )}


                            <div style={{'padding': '10px'}}>
                                {context_list && context_list?.map((item: any, key: number) =>
                                    <>
                                        <Typography color="text.primary" key={key} variant="body1">
                                            {item && item.context}
                                        </Typography>
                                        <List>
                                            {item && item?.questions?.map((value: any, key: number) =>
                                                <ListItem key={key}>
                                                    <Checkbox
                                                        // checked={checked}
                                                        onChange={(e) => handleSelectedQuestion(e, item.context)}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                        value={value}
                                                    />
                                                    {/*<ListItemText primary={value}/>*/}
                                                    <Typography color="text.primary" variant="body2">
                                                        {value}
                                                    </Typography>
                                                    <br/>
                                                </ListItem>
                                            )}
                                        </List>
                                    </>
                                )}

                            </div>
                        </Card>

                        {/*## TO generate the questions. The following content are passed from the text editor*/}
                        <TextEditor setGenerate={setGenerate} selectedModel={selectedModel}/>

                        {/*<Button variant="contained">Generate</Button>*/}
                    </Paper>

                </Grid>}
                {domain_list.length >0 && <Grid item xs={3}>
                    <Paper className={classes.scrollableCardDisplay}>
                        <Typography variant="h5" component="div" style={{'marginBottom': '4px'}}>
                            Active Questions
                        </Typography>
                        <Typography variant="body2" component="div" style={{'marginBottom': '10px'}}
                                    color="text.secondary">
                            select the generated questions to make your active questions.
                        </Typography>

                        <Card variant="outlined" className={classes.displayOutcome}>
                            <List>
                                {active_questions.map((obj: any, index: number) => (
                                    <ListItem key={index} style={{gap: '10px'}}>
                                        <ListItemText primary={obj.question}/>
                                        <TextField
                                            id=""
                                            variant="outlined"
                                            type={'Number'}
                                            style={{maxWidth: '60px'}}
                                            key={index}
                                            InputProps={{
                                                inputProps: { min: 0 }
                                            }}
                                            onChange={(e) => onSaveActiveQuestion(e, index)}
                                            value={obj.full_marks}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Card>

                        <Card variant="outlined" className={classes.displayOutcomeAction}>
                            <Button variant="outlined" onClick={onStoreActiveQuestionDB}>Save & Publish</Button>
                            <MySnackbar show={active_questions_saved == true} message={"Active Question Saved"}/>
                        </Card>

                        <Card variant="outlined" sx={{maxHeight: '20vh', minHeight: '20vh', overflow: 'auto'}}
                              className={classes.displayPublishedUrl}>
                            <List>
                                {exam_list.map((obj: any, index: number) => (
                                    <ListItem key={index} style={{gap: '12px'}}>
                                        <Button variant="outlined" style={{minWidth: '0px', padding: "4px"}}
                                                onClick={(e: any) => copyLink(obj)}>
                                            <CopyAllIcon fontSize="small"/>
                                        </Button>
                                        <ListItemText
                                            primaryTypographyProps={{style: {color: '#808080', fontSize: '10px'}}}
                                            primary={'..../exam?i=' + obj}/>
                                        <Button variant="outlined" onClick={(e: any) => onResultShow(obj)}>
                                            Result <OpenInNewIcon fontSize={"small"}/>
                                        </Button>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Paper>
                </Grid>}
            </Grid>


            <Modal open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography variant="body2" component="div" style={{'marginBottom': '10px'}}
                                color="text.secondary">
                        Exam session is now created.You can share this link for the exam.
                    </Typography>
                    <div style={{display:"flex", gap:"20px"}} >
                        <Button  variant="outlined" style={{minWidth:'0px', padding: "4px"}} onClick={(e:any)=>copyLink(exam_list[0])}>
                            <CopyAllIcon fontSize="large"/>
                        </Button>
                            <TextField
                                id=""
                                variant="outlined"
                                type={'text'}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                value={publish_url}
                            />
                        <Button id="closePopup" onClick={handleClose}>Close</Button>
                    </div>
                </Box>
            </Modal>
        </>

    )
}

export default Home