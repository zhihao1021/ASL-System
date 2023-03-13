import React from 'react';
import ReactDOM from 'react-dom/client';
import $ from 'jquery'
import './index.css';
import reportWebVitals from './reportWebVitals';

import TopBar from './top-bar';

const root = ReactDOM.createRoot(document.getElementById('root'));
var need_loaded = 1;
var userSid, userName;

class MainContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userSid: userSid,
            userName: userName,
            open: false
        };
    }

    render() {
        console.log(123)
        return (
            <React.StrictMode>
                <TopBar
                    name={this.state.userName}
                    menuOpen={this.state.open}
                    userOpen={false}
                />
            </React.StrictMode>
        );
    }
}

function render() {
    if (need_loaded) {
        setTimeout(render, 100);
    }
    else {
        root.render(
            <MainContent />
        );
        reportWebVitals();
    }
}

$.getJSON(
    `/api/info/user/current`,
    (response) => {
        userSid = response.data.sid;
        userName = response.data.name;
        need_loaded--;
    }
);

render();
