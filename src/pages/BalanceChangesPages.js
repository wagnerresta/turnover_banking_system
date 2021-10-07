import React, {useEffect, useState} from 'react';
import PageWrapper from "../components/PageWrapper";
import {
    Divider,
    Fab,
    Grid,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
    useTheme
} from "@material-ui/core";
import Datepicker from "../components/Datepicker";
import AddIcon from "@material-ui/icons/Add";
import {formatDate, formatMoney} from "../utils/helpers";
import {useHistory} from "react-router-dom";
import api from "../services/api";
import ListItemsPlaceholder from "../components/ListItemsWrapper";
import ListItemsWrapper from "../components/ListItemsWrapper";
import {format} from "date-fns";

const  BalanceChangesPages = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    let theme = useTheme();
    let history = useHistory();

    const getExpenses = async () => {
        setLoading(true);
        try {
            
            const response = await api.get("/account/deposit/list");
            const expenses = response?.data;
            setExpenses(expenses);
        } catch (e) {
        }
        setLoading(false);
    };

    const handleDateChange = (date) => {
        setSelectedDate(new Date(date));
    };

    const renderExpenses = () => {
        return expenses.map((expense) => {
            const expenseAmount = parseFloat(expense.amount);

            return (
                <>
                    <ListItem>
                        
                        <ListItemText primary={expense.deposit != null ? "Deposit " : expense.buy.description } secondary={formatDate(expense?.created_at)}/>

                        <ListItemSecondaryAction>
                            <Typography style={expense.deposit == null ?{color: "red"} : {color: "blue"}} variant={"subtitle2"}>
                                {expense.deposit == null ?? '-'} {formatMoney(expenseAmount)}
                            </Typography>
                        </ListItemSecondaryAction>

                    </ListItem>
                    <Divider/>
                </>
            )
        });
    }

    useEffect(() => {
        getExpenses();
    }, [selectedDate]);

    return (
        <PageWrapper pageName={"Balance Change"}>
            <Grid container style={{backgroundColor: "#2298AC", marginTop: -5}} xs={12}>
                <Grid style={{padding: 10, paddingLeft: 20}} xs={6} md={3}>
                    
                </Grid>
            </Grid>
            <List style={{padding: 10}} dense={true}>
                <ListItemsWrapper loading={loading} placeholderItems={8} hasItems={expenses.length}>
                    {renderExpenses()}
                </ListItemsWrapper>
            </List>
            <Fab onClick={() => history.push("/purchases/create")} style={{
                margin: 0,
                top: 'auto',
                right: 20,
                bottom: 20,
                left: 'auto',
                position: 'absolute',
            }} color="success" aria-label="add">
                <AddIcon/>
            </Fab>
        </PageWrapper>
    )
};

export default BalanceChangesPages;