var actions = require('../actions/index.js');

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';

const styles = {
    wrapper: {
        position: 'relative',
        minHeight: 260
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    button: {
        margin: '10px 0 0 10px'
    },
    noResults: {
        textAlign: "center",
        marginTop: 50,
    }
};

export default class Facilities extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            hotels: [],
            facilities: [],
            currentHotelId: -1,
            loading: false,
            anchorEl: undefined,
            open: false,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        actions.hotels.getAllHotels()
            .then( (res) => {
                let { body=[] } = res;
                this.setState({ hotels: body });
            })
            .catch( (err) => {
                console.error(err);
            });
    }

    renderFacilities(facilities) {
        if(!facilities.length) {
            return (
                <div style={styles.noResults}>There is no facilities to show</div>
            );
        }

        let facilitiesItems = facilities.map( (hotel, i) => {
            let { id, name } = hotel;

            return (
                <div key={i}>
                    <ListItem>
                        <ListItemText primary={id} />
                        <ListItemText primary={name} />
                    </ListItem>
                    <Divider light />
                </div>
            );
        });

        return (
            <List className={""}>
                { facilitiesItems }
            </List>
        );
    }

    handleClick(event) {
        this.setState({ open: true, anchorEl: event.currentTarget });
    }

    handleRequestClose() {
        this.setState({ open: false });
    }

    handleOptionClick(id) {
        this.handleRequestClose();
        
        if(!id || isNaN(id) || id < 0) { return; } // check for valid hotel id

        let { currentHotelId } = this.state;
        if(id === currentHotelId) { return; }

        this.setState({ loading: true });

        actions.facilities.getFacilitiesByHotel(id)
            .then( (res) => {
                let { body=[] } = res;
                this.setState({ currentHotelId: id, facilities: body, loading: false });
            })
            .catch( (err) => {
                console.error(err);
                this.setState({ currentHotelId: id, loading: false });
            });
    }

    renderHotels(hotels) {
        return hotels.map( (hotel, i) => {
            let { id, name } = hotel;

            return (
                <MenuItem key={id} onClick={() => { this.handleOptionClick(id) }}>{name}</MenuItem>
            );
        });
    }

    renderHotelsCombo() {
        let { hotels, anchorEl, open } = this.state;

        return (
            <div>
                <Button raised
                    style={styles.button} 
                    color="accent"
                    aria-owns="simple-menu" 
                    aria-haspopup="true" 
                    onClick={this.handleClick}
                >
                    Choose hotel...
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onRequestClose={this.handleRequestClose}
                >
                    { this.renderHotels(hotels) }
                </Menu>
            </div>
        );
    }

    render() {
        let { facilities, loading } = this.state;
        
        return(
            <div style={styles.wrapper}>
                { this.renderHotelsCombo() }
                { this.renderFacilities(facilities) }
                <div style={styles.loader}>
                    { (loading) ? <CircularProgress size={50} /> : '' }
                </div>
            </div>
        );
    }
}