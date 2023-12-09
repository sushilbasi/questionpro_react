import React, {useEffect, useState} from 'react';
import {
    Box,
    Button, Card, Checkbox,
    Container,
    Divider,
    FormControl,
    FormLabel, List, ListItem, ListItemText, Modal, Paper, TableCell,
    TableHead,
    TableRow, TableSortLabel,
    TextField,
    Typography
} from "@mui/material";
import {makeStyles} from "@mui/styles";
import Grid from "@mui/material/Unstable_Grid2";
import QuestionproHeader from "../../components/questionproHeader";
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid';
import {getExamResult} from "../../store/actions/examAction/exam";
import {useDispatch, useSelector} from "react-redux";

const useStyles = makeStyles((theme: any) => ({
    mainContainer: {
        border: "solid",
        borderRadius: '20px',
        borderWidth: "thin",
        height: "80vh",
        backgroundColor: 'white',
        margin: '30px'
    },
    mainItems: {
        padding: '20px',

    },
    scrollableCardDisplay: {
        overflow: 'auto',
        height: '100%',
        padding: '20px',
    },
    displayQuestion: {
        padding: '10px'
    },
    contextItem: {
        margin: '30px',
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
        gap: 10
    },
    eachQuestionContainer: {
        display: 'flex',
        justifyContent: 'space-between', // Align items to left and right
        alignItems: 'center',
    }
}));


const style = {
    position: 'absolute' as 'absolute',
    overflow: 'auto',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


// const rows = [
//     {id: 1, lastName: 'Snow', firstName: 'Jon', age: 35},
//     {id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42},
//     {id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45},
//     {id: 4, lastName: 'Stark', firstName: 'Arya', age: 16},
//     {id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null},
//     {id: 6, lastName: 'Melisandre', firstName: null, age: 150},
//     {id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44},
//     {id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36},
//     {id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65},
// ];


function ResultMainBody(props: any) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const {exam_result, active_questions} = useSelector((state: any) => state?.examReducer)

    const [modelData, setModelData] = useState({
        student_name: undefined,
        student_number: undefined,
        email: undefined,
        graded_answer_list: []
    })
    const handleOpen = (e: any) => {
        const {row} = e
        console.log(exam_result[parseInt(row.id) - 1])
        setModelData(exam_result[parseInt(row.id) - 1])
        setOpen(true)
    };
    const handleClose = () => setOpen(false);

    const dispatch = useDispatch()
    const searchParams = new URLSearchParams(window.location.search);
    const exam_id = searchParams.get('i');

    const [row, setRow] = useState<any[]>([])

    useEffect(() => {
        // @ts-ignore
        dispatch(getExamResult({"exam_id": exam_id}))
    }, [])


    const [columns, setColumns] = useState<GridColDef[]>([
        // {
        //     field: 'fullName',
        //     headerName: 'Full name',
        //     description: 'This column has a value getter and is not sortable.',
        //     sortable: false,
        //     width: 160,
        //     valueGetter: (params: GridValueGetterParams) =>
        //         `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        // },
    ])


    useEffect(() => {
        if (active_questions) {
            let col_main = [
                {field: 'id', headerName: 'SN', width: 90},
                {
                    field: 'student_name',
                    headerName: 'Student',
                    width: 150,
                    editable: true,
                },
                {
                    field: 'student_number',
                    headerName: 'S.ID',
                    width: 150,
                    editable: true,
                },
            ]
            active_questions.map((item: any, index: number) => {
                const qno = "q" + index.toString();
                const qno_cap = "Q " + (index + 1).toString();
                const col = {
                    field: qno,
                    headerName: qno_cap,
                    width: 150,
                    editable: true,
                }
                col_main.push(col)
            });
            // @ts-ignore
            setColumns(col_main)
        }
    }, [active_questions])


    useEffect(() => {
        if (exam_result && active_questions) {
            const new_row: any[] = []
            const mappedResults = exam_result.map((item: any, index: number) => {
                let obj: any = {
                    id: index + 1,
                    student_name: item.student_name,
                    student_number: item.student_number,
                };
                active_questions.forEach((q: any, ind: number) => {
                    const q_ = "q" + ind.toString();
                    const data_: any = {
                        [q_]: Math.round(item.graded_answer_list[ind].marks * 100) / 100,
                    };
                    obj = {...obj, ...data_};
                });

                return obj;
            });

            mappedResults.forEach((obj: any) => {
                new_row.push(obj)
                // @ts-ignore

            });
            setRow(new_row)
        }
    }, [exam_result])
    return (
        <div>
            <Container maxWidth="xl" className={classes.mainContainer}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid xs={7}>
                        <div className={classes.mainItems}>
                            <div className={classes.contextItem}>
                                <Typography variant="body1" component="div" style={{'marginBottom': '10px'}}
                                            color="text.secondary">
                                    Student submissions are displayed in the table below.
                                </Typography>
                            </div>
                            <div>
                                <DataGrid
                                    rows={row}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 10,
                                            },
                                        },
                                    }}
                                    pageSizeOptions={[9]}
                                    // checkboxSelection
                                    onRowClick={handleOpen}
                                    autoHeight={true}
                                />
                            </div>
                        </div>
                    </Grid>
                    <Grid xs={5}>
                        <div className={classes.mainItems}>
                            <Typography variant="h5" component="div" style={{'marginBottom': '4px'}}>
                                Active Questions
                            </Typography>
                            <Typography variant="body2" component="div" style={{'marginBottom': '10px'}}
                                        color="text.secondary">
                                select the generated questions to make your active questions.
                            </Typography>

                            <Card variant="outlined" className={classes.displayQuestion}>
                                <List>
                                    {active_questions.map((item: any, index: number) => (
                                        <ListItem key={index} style={{gap: '10px'}}>
                                            <ListItemText primary={item.question}/>
                                            <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                type={'Number'}
                                                style={{maxWidth: '60px'}}
                                                value={item.full_marks}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Card>
                        </div>
                    </Grid>
                </Grid>
            </Container>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className={classes.formItems}>
                        <Typography variant="h6" color="text.Primary">
                            Name : {modelData?.student_name} |  {modelData?.student_number}<br/>
                        </Typography>
                        {/*<Typography variant="h6" color="text.Primary">*/}
                        {/*    Number :  <br/>*/}
                        {/*</Typography>*/}
                        <Typography variant="h6" color="text.Primary">
                            Email : {modelData?.email}<br/>
                        </Typography>
                    </div>

                    {modelData.graded_answer_list.map((item:any, index:number)=><div className={classes.formItems}>
                        <FormControl className={classes.formControl}>
                            <div className={classes.eachQuestionContainer}>
                                {item.question}<FormLabel>

                                [marks: {Math.round(item.marks * 100) / 100}/ {item.full_marks}]
                            </FormLabel>

                            </div>

                            <TextField
                                id="outlined-multiline-flexible"
                                multiline
                                // maxRows={4}
                                minRows={3}
                                value={item.answer}
                            />
                        </FormControl>
                    </div>)}
                </Box>
            </Modal>
        </div>
    );
}

export default ResultMainBody;