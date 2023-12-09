import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card, CircularProgress,
    Container,
    Divider,
    FormControl,
    FormLabel,
    Input,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {Form} from "react-router-dom";
import {TextareaAutosize as BaseTextareaAutosize} from '@mui/base/TextareaAutosize';
import {makeStyles} from "@mui/styles";
import {styled} from '@mui/system';
import {useDispatch, useSelector} from "react-redux";
import {getExam, storeExam, submitExam, updateStudentDetail} from "../../../store/actions/examAction/exam";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import {green} from "@mui/material/colors";
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const useStyles = makeStyles((theme: any) => ({

    mainContainer: {
        border: "solid",
        borderRadius: '20px',
        borderWidth: "thin",
        borderColor: 'grey',
        backgroundColor: 'White'
    },
    mainContainerAlter: {
        border: "solid",
        borderRadius: '20px',
        borderWidth: "thin",
        borderColor: 'grey',
        backgroundColor: 'White',
        height: "180px"
    },
    mainContainerAlterBody: {
        position: "absolute",
        display:"flex",
        gap:"20px",
        top:"160px",
    },
    formItems: {
        margin: '20px',
    },
    formStudentInfo: {
        width: '40%',
        gap: 10
    },
    formControl: {
        width: '100%',
        gap: 10,
    },
    eachQuestionContainer: {
        display: 'flex',
        justifyContent: 'space-between', // Align items to left and right
        alignItems: 'center',
    }

}));


function TestField(props: any) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        active_questions,
        answers,
        student_name,
        student_number,
        email,
        isExamSubmitted,
        isExamComplete
    } = useSelector((state: any) => state?.examReducer)
    const searchParams = new URLSearchParams(window.location.search);
    const exam_id = searchParams.get('i');
    const [show, setCompleteShow] = useState(false)

    useEffect(() => {
        if (exam_id) {
            // @ts-ignore
            dispatch(getExam({"exam_id": exam_id}))
        }

    }, [])

    const onUpdateTextField = (e: any, index: number) => {
        e.preventDefault()
        const {value} = e.target
        const dict_temp = {"question_index": index, "answer": value}

        // @ts-ignore
        dispatch(storeExam(dict_temp))
    }

    const [studentDetail, setStudentDetail] = useState({
        "student_name": "",
        "student_number": "",
        "email": ""
    })

    useEffect(() => {
        // @ts-ignore
        dispatch(updateStudentDetail(studentDetail))
    }, [studentDetail])

    const submitForm = () => {
        console.log("HERE")
        setCompleteShow(true)
        const formData = {
            "exam_id": exam_id,
            "student_name": student_name,
            "student_number": student_number,
            "email": email,
            "answer_list": answers
        }
        console.log(formData)
        if (student_name == '' || student_number == '' || email == '') {
            console.log("Information is missing")
            alert("Student Details Missing")
        } else {
            // @ts-ignore
            dispatch(submitExam(formData))
        }
    }

    return (
        <>
            {show == false && <Container maxWidth={"md"} className={classes.mainContainer}>
                <div className={classes.formItems}>
                    <Typography variant="body2" component="div" style={{'marginBottom': '10px'}}
                                color="text.primary">
                        Please complete the student information form accurately for our records.
                    </Typography>
                </div>

                <div className={classes.formItems}>
                    <FormControl className={classes.formStudentInfo}>
                        <FormLabel>Student Name</FormLabel>
                        <TextField
                            fullWidth style={{width: '100%'}}
                            type="text"
                            onChange={(e) =>
                                setStudentDetail((preValue) => ({
                                    ...preValue,
                                    ['student_name']: e.target.value
                                }))}
                            color='primary'/>
                    </FormControl>
                </div>
                <div className={classes.formItems}>
                    <FormControl className={classes.formStudentInfo}>
                        <FormLabel>Student Number</FormLabel>
                        <TextField fullWidth type="text"
                                   onChange={(e) =>
                                       setStudentDetail((preValue) => ({
                                           ...preValue,
                                           ['student_number']: e.target.value
                                       }))}
                                   color='primary'/>
                    </FormControl>
                </div>
                <div className={classes.formItems}>
                    <FormControl className={classes.formStudentInfo}>
                        <FormLabel>Email</FormLabel>
                        <TextField fullWidth type="email"
                                   onChange={(e) =>
                                       setStudentDetail((preValue) => ({
                                           ...preValue,
                                           ['email']: e.target.value
                                       }))}
                                   color='primary'/>
                    </FormControl>
                </div>
                <Divider/>
                {isExamComplete && <div className={classes.formItems}>
                    <Typography variant="h5" component="div" style={{'marginBottom': '10px'}}
                                color="text.Primary">
                        Thank you for completing the exam.
                    </Typography>
                </div>}

                {isExamComplete == false && <div className={classes.formItems}>
                    <Typography variant="body2" component="div" style={{'marginBottom': '10px'}}
                                color="text.Primary">
                        All the questions are in short question format which will
                        be graded by our model.
                    </Typography>
                </div>}

                {active_questions && isExamComplete == false && active_questions.map((item: any, index: number) =>
                    <div className={classes.formItems}>
                        <FormControl className={classes.formControl}>
                            <div className={classes.eachQuestionContainer}>
                                {item.question}<FormLabel>

                                [marks: {item.full_marks}]
                            </FormLabel>

                            </div>

                            <TextField
                                id="outlined-multiline-flexible"
                                multiline
                                // maxRows={4}
                                minRows={3}
                                onChange={(e) => onUpdateTextField(e, index)}
                            />
                        </FormControl>
                    </div>
                )}
                <div className={classes.formItems}>
                    <Button variant={"outlined"} onClick={submitForm}>Submit</Button>
                </div>
            </Container>}

            {show && <Container maxWidth={"md"} className={classes.mainContainerAlter}>
                <div className={classes.mainContainerAlterBody}>
                    {isExamSubmitted && <CircularProgress/>}
                    {isExamComplete == true && <TaskAltIcon fontSize="large" color="success" />}
                    <Typography variant="h5" component="div"
                                color="text.primary">
                        Thank you for completing the exam.<br/>
                        <Typography variant="body2" component="div"
                                    color="text.primary">
                            {isExamSubmitted? "calculating grades for your answers........":
                                "Grades has been successfully calculated."
                            }
                        </Typography>
                    </Typography>
                </div>
            </Container> }

        </>
    );
}

export default TestField;