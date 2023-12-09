import React, {useEffect, useRef, useState} from 'react';
import ReactQuill, {Quill} from "react-quill";
import {makeStyles} from "@mui/styles";
import 'react-quill/dist/quill.snow.css';
import {Box, Button, Card, CircularProgress, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {
    getQuestionGenerationCustom,
    getQuestionGenerationPreTrain, getQuestionGenerationSequence, storeGeneratedQuestions
} from "../../../store/actions/generateQuestionAction/GenerateQuestion";
import {removeHtmlTags} from "../home";
import {generateQuestionReducer} from "../../../store/reducers/generateQuestionReducer";
import {green} from '@mui/material/colors';


const useStyles = makeStyles((theme) => ({
    container: {
        padding: 3,
    },
    editor: {
        // border: '1px solid #ccc',
        borderRadius: '4px',
        height: '0px',
        minHeight: '200px',
        padding: '8px',
    },
    button: {
        marginTop: '16px',
    },
}));

export const findTextBold = (html: any) => {
    const regex = /<strong>(.*?)<\/strong>/;
    const match = html.match(regex);
    return match ? match[1] : null;
}

export const findIndexOfBold = (main_text: string, answer: string) => {
    // const regex = new RegExp(answer, 'g');
    // console.log(regex)
    // const match = main_text.match(regex);
    return main_text.indexOf(answer);
}


function TextEditor(props: any) {
    const [value, setValue] = useState('');
    const dispatch = useDispatch();
    const classes = useStyles();
    const {context_list, isGeneratingQuestion} = useSelector((state: any) => state?.generateQuestionReducer || []);
    const [fetchFlag, setFetchFlag] = useState(false);

    const quillStyle = {
        height: "20vh",
        borderRadius: "20vh",
        marginBottom: '50px'
    }

    const handleGenerateQuestion = () => {
        if (!value) {
            alert("Please enter the context in the text area")
            return false
        }

        let new_value: string = removeHtmlTags(value);
        let selected_bold: string;
        let start_index: any;

        if (props.selectedModel == 'custom') {
            console.log("---Custom Question is generated. ----")
            // @ts-ignore
            dispatch(getQuestionGenerationCustom(new_value))
            setFetchFlag(true)
        } else if (props.selectedModel == 'sequence') {
            selected_bold = findTextBold(value)

            if (!selected_bold) {
                alert("Please BOLD your hint answer for the Sequence 2 Sequence model")
                return false
            }
            start_index = findIndexOfBold(new_value, selected_bold)

            const sequence_data = {
                "context": new_value,
                "answer": selected_bold,
                "answer_start": start_index
            }

            // @ts-ignore
            dispatch(getQuestionGenerationSequence(sequence_data))
            setFetchFlag(true)


        } else {
            console.log("---Pretrain Question is generated. ----")
            // @ts-ignore
            dispatch(getQuestionGenerationPreTrain(new_value))
            setFetchFlag(true)
        }
        props.setGenerate(true)
    }

    // useEffect(()=>{
    //     if(fetchFlag){
    //         console.log(context_list)
    //         // @ts-ignore
    //         dispatch(storeGeneratedQuestions(context_list))
    //         setFetchFlag(false)
    //     }
    // }, [fetchFlag])

    const toolbarOptions = [
        [
            // { font: ['Lato', 'sans-serif',], size:'80px' },
        ],
        [{'size': ['small', false, 'huge']}],

        ['bold',],
        // ['link'],
        // ['clean'],
    ];

    // let set = "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"

    // useEffect(() => {
    //     setValue(set)
    // }, [])


    const handleEditorChange = (html: any) => {
        // setValue(removeHtmlTags(html));

        setValue(html)
        console.log(html)
    };


    return (
        <>
            <ReactQuill
                style={quillStyle}
                modules={{
                    toolbar: {
                        container: toolbarOptions,
                    }
                }}
                // defaultValue={value}
                onChange={handleEditorChange}
            />
            <Card variant={'outlined'}
                  style={{display:"flex",padding: '10px', justifyContent: 'right', border: 'none',}}>
                {/*<Button variant="outlined" onClick={handleGenerateQuestion}>Generate Questions</Button>*/}
                <Box sx={{m: 1, position: 'relative', width:"fit-content"}}>
                    <Button
                        variant="outlined"
                        disabled={isGeneratingQuestion}
                        onClick={handleGenerateQuestion}>

                        Generate Questions
                    </Button>

                    {isGeneratingQuestion && (
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
            </Card>

        </>

        // </div>
    )
        ;
}

export default TextEditor;