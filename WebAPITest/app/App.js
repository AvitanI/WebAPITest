import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root/Root.jsx';
import { MuiThemeProvider } from 'material-ui/styles';

export default class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <Root />
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<App />,
    document.getElementById('app'));