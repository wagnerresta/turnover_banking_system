import React, {useEffect, useState} from 'react';
import PageWrapper from "../components/PageWrapper";
import {
    Backdrop,
    Button,
    CircularProgress,
    Grid,
    InputAdornment, makeStyles,
    TextField,
    Typography,
    useTheme
} from "@material-ui/core";
import {formatMoney} from "../utils/helpers";
import useStore from "../store/store";
import {useSnackbar} from "notistack";
import {Controller, useForm} from "react-hook-form";
import MoneyInput from "../components/MoneyInput";
import ImageDropzone from "../components/ImageDropzone";
import api from "../services/api";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const DepositCheckPage = () => {
    const classes = useStyles();
    let theme = useTheme();
    let history = useHistory();
    const store = useStore(state => state);
    const {control, handleSubmit} = useForm();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [selectedPhoto, setSelectedPhoto] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        if (!selectedPhoto) {
            showError("No picture selected.")
            return;
        }

        const formData = new FormData();
        formData.append("check_image", selectedPhoto);
        formData.append("amount", data.amount);
        
        try {
            await api.post("account/deposit", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            history.push("/");
        } catch (e) {
            showError(e.response?.data?.message);
        }
        setLoading(false);
    };

    const showError = (message = "An internal error has occurred") => {
        enqueueSnackbar(message, {variant: "error",})
    };

    const onImageDrop = (files) => {
        setSelectedPhoto(files[0]);
    };

    function getTotal(total, item) {
        return total + (item.amount);
    }

    const getUserBalance = async () => {
        try {
            const response = await api.post("/account/me");
            const balance = response.data;
            const purchases = response.data.purchase;
            const deposits = response.data.deposits;

            store.setUserBalance({
                currentBalance: parseFloat(balance.user.balance),
                currentExpenses : purchases.reduce(getTotal,0),
                currentIncomes : deposits.reduce(getTotal,0),
            })

            
        } catch (e) {
        }
    };

    useEffect(() => {
        getUserBalance();
    }, []);

    return (
        <PageWrapper pageName={"Check deposit"}>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Grid container style={{backgroundColor: "#2298AC", marginTop: -5}} xs={12}>
                <Grid style={{padding: 10, paddingLeft: 20}} xs={6} md={4}>
                    <Grid style={{paddingTop: 0}} xs={9} md={11}>
                        <Typography style={{color: "white", opacity: 0.5}}>Current balance</Typography>
                        <Typography style={{color: "white"}}
                                    variant="h6">{formatMoney(store.currentBalance)}</Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid style={{padding: 20, paddingTop: 40, }} xs={12}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="amount"
                        control={control}
                        rules={{required: 'Amount required'}}
                        render={({field, fieldState}) => (
                            <TextField
                                placeholder={"0,00"}
                                label={"AMOUNT"}
                                fullWidth={true}
                                error={fieldState.invalid}
                                helperText={fieldState?.error?.message || "The money will be deposited in your account once the check is accepted."}
                                value={field.value}
                                onChange={field.onChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                    inputComponent: MoneyInput
                                }}
                            />
                        )}
                    />
                   
                    <Grid style={{marginTop: 30}}>
                        {<ImageDropzone selectedPhoto={selectedPhoto} onDrop={onImageDrop}/>}
                    </Grid>
                    <Button fullWidth style={{marginTop: 40,backgroundColor:"#2298AC"}} type="submit" variant="contained" color="primary">
                        Deposit check
                    </Button>
                </form>
            </Grid>
        </PageWrapper>
    )
};

export default DepositCheckPage;