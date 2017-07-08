import React from 'react';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import HotelsList from '../components/HotelsList.jsx';
import Facilities from '../components/Facilities.jsx';

export default class Root extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			index: 0
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e, index) {
		this.setState({ index });
	}

	renderTabsContentByIndex(index) {
		let content = null;

		switch(index) {
			case 0: // render hotels
				content = <HotelsList />
				break;
			case 1: // render facilities by hotel id
				content = <Facilities />
			default:
				break;
		}

		return content;
	}

	render() {
		let { index } = this.state;

		return (
			<div>
			<AppBar position="static">
				<Tabs index={index} onChange={this.handleChange}>
					<Tab label="Hotels" />
					<Tab label="Facilities" />
				</Tabs>
			</AppBar>
			{ this.renderTabsContentByIndex(index) }
			</div>
		);
	}
}