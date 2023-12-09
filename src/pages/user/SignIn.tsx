import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../../store/actions/userAction/authentication";
import {isUserLoggedIn, setUserActive} from "../../utils/auth.utils";
import {useEffect} from "react";
import MySnackbar from "../../components/Snackbar";



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user, isFetchingUser, login_status} = useSelector(
      (state: any) => state?.authenticationReducer || null
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form_data = new FormData(event.currentTarget);
    const data = {
      username: form_data.get('username') ,
      password: form_data.get('password'),
    }

    // @ts-ignore
    dispatch(loginUser(data))
    // navigate("/");
  };

  // const is_userlogged_in = isUserLoggedIn()
  // useEffect(() => {
  //   if (is_userlogged_in) {
  //     navigate("/");
  //   }
  // }, [is_userlogged_in]);

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate("/");
    }
  }, [user]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h3" style={{fontFamily: 'EB Garamond', margin: '14px 20px'}}> Question
            Pro</Typography>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/*<Link href="#" variant="body2">*/}
                {/*  Forgot password?*/}
                {/*</Link>*/}
              </Grid>
              <Grid item>
                <Link onClick={()=>navigate('/signup')} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <MySnackbar show={login_status == false} message={"Failed to login"}/>
      </Container>
    </ThemeProvider>
  );
}
