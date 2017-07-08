var actions = require('../actions/index.js');

import React from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

const styles = {
    wrapper: {
        width: 300,
        minHeight: 185,
        padding: 10,
    },
    btnWrapper: {
        display: 'block',
        marginTop: 10
    },
    button: {
        float: 'right'
    },
    clear: {
        clear: 'both'
    }
};
const errTxt = 'This field is required';

export default class AddHotelPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            error: false,
            helperText: ''
        };

        this.handleOnSbmit = this.handleOnSbmit.bind(this);
        this.handleOnCancel = this.handleOnCancel.bind(this);
        this.handleNameOnChange = this.handleNameOnChange.bind(this);
    }

    componentWillReceiveProps(newProps) {
        let { open, isEditMode, hotelEdit } = newProps;

        if(!open) {
            this.clearForm();
            return;
        }

        if(isEditMode && Object.keys(hotelEdit).length) {
            let { name } = hotelEdit;
            this.setState({ name });
        }
    }

    clearForm() {
        this.setState({
            name: '',
            error: false,
            helperText: ''
        });
    }

    handleOnSbmit() {
        let { name } = this.state;
        let { isEditMode } = this.props;

        if(!name) {
            this.setState({ error: true, helperText: errTxt });
            return;
        }

        let data = {
            name
        };

        if(isEditMode) {
            let { hotelEdit } = this.props;
            data.id = hotelEdit.id;
            this.editHotel(data);
        }
        else {
            this.createHotel(data);
        }
    }

    editHotel(data) {
        actions.hotels.edit(data)
            .then( (res) => {
                this.afterSubmit();
            })
            .catch( (err) => {
                console.error(err);
                this.handleOnCancel();
            });
    }

    createHotel(data) {
        actions.hotels.create(data)
            .then( (res) => {
                this.afterSubmit();
            })
            .catch( (err) => {
                console.error(err);
                this.handleOnCancel();
            });
    }

    afterSubmit() {
        let { close, onSubmit } = this.props;
        close();
        onSubmit();
    }

    handleOnCancel() {
        let { close } = this.props;
        close(); // close popup
    }

    handleNameOnChange(e) {
        let val = e.target.value;
        let hasVal = !!(val && val.trim());
        let helperText = !hasVal && errTxt || '';
        this.setState({ name: val, error: !hasVal, helperText });
    }

    render() {
        let { name, error, helperText } = this.state;
        let { open, close, isEditMode } = this.props;  
        const cancelBtn = {
            ...styles.button,
            marginRight: 10
        };
        let title = (isEditMode) ? 'Update Hotel' : 'Create New Hotel';
        let submit = (isEditMode) ? 'Update' : 'Submit';

        return (
            <Dialog 
                open={open}
                onRequestClose={close}
            >
                <div style={styles.wrapper}>
                    <DialogTitle>{title}</DialogTitle>
                    <TextField
                        required
                        label="Name"
                        error={error}
                        helperText={helperText}
                        value={name}
                        onChange={this.handleNameOnChange}
                        marginForm
                    />
                    <div style={styles.btnWrapper}>
                        <Button raised color="primary" style={styles.button} onClick={this.handleOnSbmit}>{submit}</Button>
                        <Button raised color="primary" style={cancelBtn} onClick={this.handleOnCancel}>Cancel</Button>
                        <div style={styles.clear}></div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

AddHotelPopup.propTypes = {
  isEditMode: PropTypes.bool,
  hotelEdit: PropTypes.object,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

AddHotelPopup.defaultProps = {
    isEditMode: false,
    hotelEdit: {}
};