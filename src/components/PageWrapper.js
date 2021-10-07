import {AppBar, Container, IconButton, makeStyles, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import DrawerMenu from "./DrawerMenu";
import {useState} from "react";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        marginLeft: "-25px",
        
    },
    appbar: {
        backgroundColor: "white",
        
    },
    menuIconClass:{
        color: "#2298AC",
        marginLEft: "25px"
    }
}));

const PageWrapper = (props) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const classes = useStyles();

    return (
            <Container style={{boxShadow: "0 0.250em 0.375em rgba(50,50,93,.09), 0 0.063em", minHeight: '100vh'}} maxWidth={"lg"} disableGutters={true}>
                <AppBar elevation={0} color={"secondary"} className={classes.appbar} position="sticky">
                    <Toolbar>
                        <IconButton onClick={() => setDrawerOpen(!drawerOpen)} edge="start" color="inherit"
                                    aria-label="menu">
                            <MenuIcon className={classes.menuIconClass}/>
                        </IconButton>
                        <Typography align="center" variant="h6" className={classes.title}>
                            <img width="100px" src="https://s5v7e6j9.stackpathcdn.com/wp-content/themes/marketing-site-stable-v1_3_7/assets/images/turnoverbnb.png"></img>
                        </Typography>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <DrawerMenu open={drawerOpen} toggleDrawer={setDrawerOpen}/>
                {props.children}
            </Container>
    )
};

export default PageWrapper;