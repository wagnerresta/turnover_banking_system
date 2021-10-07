import React, {useEffect} from 'react';
import useStore from "../store/store";
import {Link, useHistory} from "react-router-dom";
import {
    Button,
    Container,
    CssBaseline,
    Grid,
    InputAdornment,
    makeStyles,
    TextField,
    Typography
} from "@material-ui/core";
import {Controller, useForm} from "react-hook-form";
import {useSnackbar} from "notistack";
import api from "../services/api";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#2298AC"
    },
}));

const LoginPage = () => {
    let history = useHistory();
    const store = useStore(state => state);
    const classes = useStyles();
    const {control, handleSubmit} = useForm();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const checkIfUserIsLoggedIn = () => {
        const authToken = localStorage.getItem("auth_token");
        const isAdmin = JSON.parse(localStorage.getItem("is_admin"));
        if (authToken) {
            store.loginUser(isAdmin);

            if (isAdmin) {
                history.push("/admin");
                return;
            }

            history.push("/");
        }
    };

    const onSubmit = async (data) => {
        try {
            const response = await api.post("/auth/login", {
                email: data.username,
                password: data.password
            });

            var user = null;
            if(response.data.access_token){
                user = response.data;
                localStorage.setItem("auth_token", user.access_token);
                localStorage.setItem("is_admin", user.admin);
                store.loginUser(user.admin);
            }
            

            if (user.admin) {
                history.push("/admin")
                return;
            }

            history.push("/");

        } catch (e) {
            showError(e.response?.data.message?.message);
        }
    };

    const showError = (message = "An internal error has occurred") => {
        enqueueSnackbar(message, {variant: "error",})
    };

    useEffect(() => {
        checkIfUserIsLoggedIn();
    }, [])

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    <img width="100px" src="https://s5v7e6j9.stackpathcdn.com/wp-content/themes/marketing-site-stable-v1_3_7/assets/images/turnoverbnb.png"></img>
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="username"
                        control={control}
                        rules={{required: 'Username required'}}
                        render={({field, fieldState}) => (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                label="Username"
                                fullWidth
                                error={fieldState.invalid}
                                helperText={fieldState?.error?.message}
                                value={field.value}
                                onChange={field.onChange}
                                
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        rules={{required: 'Password required'}}
                        render={({field, fieldState}) => (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                label="Password"
                                type="password"
                                fullWidth
                                error={fieldState.invalid}
                                helperText={fieldState?.error?.message}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid justifyContent={"center"} container>
                            <Link to="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
};

export default LoginPage;