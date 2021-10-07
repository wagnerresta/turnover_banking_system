import React, {useEffect, useState} from 'react';
import PageWrapper from "../components/PageWrapper";
import {
    Button,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Typography, useTheme
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import {blue, lightGreen} from "@material-ui/core/colors";
import Datepicker from "../components/Datepicker";
import {formatDate, formatMoney} from "../utils/helpers";
import {useHistory} from "react-router-dom";
import api from "../services/api";
import useStore from "../store/store";
import ListItemsWrapper from "../components/ListItemsWrapper";
import {format} from 'date-fns'


const EXPENSE_TYPE = "expense";

const useStyles = makeStyles((theme) => ({
    balanceRow: {
        padding: 20,
        marginTop: -5,
    },
    balanceRowButton: {
        justifyContent: "center",
        alignItems: "center"
    },
    textColor: {
        color: theme.palette.primary.dark
    },
    currentBalanceRow: {
        backgroundColor: "#29C2AF",
        padding: "15px 20px 20px",
        marginTop: -5,
    },
    contrastText: {
        color: "white"
    },
}));

const BalanceRow = ({amount, label, actionText, color, route}) => {
    const classes = useStyles();
    let history = useHistory();

    return (
        <Grid style={{backgroundColor: color}} className={classes.balanceRow} container xs={12}>
            <Grid style={{paddingTop: 10}} xs={9} md={11}>
                <Typography className={classes.textColor} variant="subtitle2">{label}</Typography>
                <Typography className={classes.textColor} variant="h6">{formatMoney(amount)}</Typography>
            </Grid>
            <Grid justifyContent={"center"} container xs={3} md={1}>
                <Button onClick={() => history.push(route)}>
                    <Grid container justifyContent={"center"} xs={12}>
                        <Grid item xs={12}>
                            <AddIcon className={classes.textColor} fontSize={"medium"}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.textColor} variant={"button"}>{actionText}</Typography>
                        </Grid>
                    </Grid>
                </Button>
            </Grid>
        </Grid>
    )
}

const CurrentBalanceRow = ({amount, selectedDate, setSelectedDate}) => {
    const classes = useStyles();

    return (
        <Grid className={classes.currentBalanceRow} container xs={12}>
            <Grid style={{paddingTop: 10}} xs={6}>
                <Typography className={classes.contrastText} variant={"subtitle2"}>Current balance</Typography>
                <Typography className={classes.contrastText} variant="h5">{formatMoney(amount)}</Typography>
            </Grid>
            <Grid justifyContent={"flex-end"} alignContent={"flex-end"} container xs={6}>
                
            </Grid>
        </Grid>
    )
}

const HomePage = () => {
    const store = useStore(state => state);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    function getTotal(total, item) {
        return total + parseFloat(item.amount);
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

    const handleDateChange = (date) => {
        setSelectedDate(new Date(date));
    };

    useEffect(() => {
        getUserBalance();
    }, []);

    useEffect(() => {
        }, [selectedDate])

    return (
        <PageWrapper pageName={"Home"}>
            
            <CurrentBalanceRow amount={store.currentBalance} selectedDate={selectedDate} setSelectedDate={handleDateChange}/>
            
            <BalanceRow color={lightGreen[50]} amount={store.currentIncomes} label={"Deposit"} actionText={"DEPOSIT"} route="/checks/deposit"/>
            
            <BalanceRow color={lightGreen[50]} amount={store.currentExpenses} label={"Purchase"} actionText={"PURCHASE"} route="/purchases/create"/>
           
        </PageWrapper>
    )
};

export default HomePage;
