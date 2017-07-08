var actions = require('../actions/index.js');

import React from 'react';
import PropTypes from 'prop-types';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import DeleteIcon from 'material-ui-icons/Delete';
import AddHotelPopup from './AddHotelPopup.jsx';

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
    addBtn: {
        margin: 5,
        position: "absolute",
        top: 0,
        right: 0,
        width: 45,
        height: 45,
    },
    editBtn: {
        width: 35,
        height: 35,
    }
};

export default class HotelsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hotels: [],
            loading: false,
            openDialog: false,
            hotelEdit: {},
            isEditMode: false
        };

        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleAddBtnClick = this.handleAddBtnClick.bind(this);
        this.handleDialogRequestClose = this.handleDialogRequestClose.bind(this);
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        this.setState({ loading: true });

        actions.hotels.getAllHotels()
            .then( (res) => {
                let { body=[] } = res;
                // setTimeout( () => {
                    this.setState({ 
                        hotels: body, 
                        loading: false 
                    });
                // }, 700);
            })
            .catch( (err) => {
                console.error(err);
                this.setState({ loading: false });
            });
    }

    dateFormat(date) {
        let newDate = new Date(date);
        return newDate.getDate() + '/' + 
               (newDate.getMonth() + 1) + '/' + 
                newDate.getFullYear() + ' ' + 
                newDate.getHours() + ":" +
                newDate.getMinutes() + ":" + 
                newDate.getSeconds();
    }

    renderHotels(hotels) {
        return hotels.map( (hotel, i) => {
            let { id, name, date, lastUpdate } = hotel;
            date = this.dateFormat(date);
            lastUpdate = this.dateFormat(lastUpdate);

            return (
                <TableRow key={i}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{lastUpdate}</TableCell>
                    <TableCell>{this.renderActions(hotel)}</TableCell>
                </TableRow>
            );
        });
    }

    renderActions(hotel) {
        let { id } = hotel;
        const editBtn = {
            ...styles.editBtn,
            marginRight: 10
        };

        return (
            <div>
                <Button fab color="accent" style={editBtn} onClick={() => {this.handleEditClick(hotel)}}>
                    <ModeEditIcon />
                </Button>
                <Button fab color="accent" style={styles.editBtn} onClick={() => {this.handleRemoveClick(id)}}>
                    <DeleteIcon />
                </Button>
            </div>
        );
    }

    handleRemoveClick(id) {
        if(!id) { return; }

        actions.hotels.remove(id)
            .then( (res) => {
                this.loadData();
            })
            .catch( (err) => {
                console.error(err);
            });
    }

    handleEditClick(hotel) {
        this.setState({ openDialog: true, hotelEdit: hotel, isEditMode: true });
    }

    handleAddBtnClick() {
        this.setState({ openDialog: true, isEditMode: false });
    }

    handleDialogRequestClose() {
        this.setState({ openDialog: false });
    }

    handleOnSubmit() {
        this.loadData();
    }

    render() {
        let { hotels, loading, openDialog, hotelEdit, isEditMode } = this.state;
        const loaderSize = 50;

        return(
            <div style={styles.wrapper}>
                <Paper>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Last Update</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            { this.renderHotels(hotels) }
                        </TableBody>
                    </Table>
                    <Button fab color="primary" style={styles.addBtn} onClick={this.handleAddBtnClick}>
                        <AddIcon />
                    </Button>
                </Paper>
                <div style={styles.loader}>
                    { (loading) ? <CircularProgress size={loaderSize} /> : '' }
                </div>
                <AddHotelPopup 
                    open={openDialog} 
                    close={this.handleDialogRequestClose} 
                    onSubmit={this.handleOnSubmit} 
                    hotelEdit={hotelEdit} 
                    isEditMode={isEditMode} 
                />
            </div>  
        );
    }
}