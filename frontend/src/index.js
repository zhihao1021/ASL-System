import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import LoginBox from './js/login';
import TopBar from './js/top-bar';
import SideBar from './js/side-bar';

import './index.css';
import './fonts/font.css'
import './fonts/material-symbols.css'
import LoginHistory from './js/login-history';

const root = ReactDOM.createRoot(document.getElementById('root'));
var need_loaded = 0;
var userSid, userName;

const year = new Date().getFullYear()

function CopyRight() {
    return (
        <div id="copyright">
            Copyright © {year} <a href="https://github.com/AloneAlongLife/ASL-System" target="_blank" rel="noreferrer">莊智皓</a>
        </div>
    )
}

class MainContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userSid: userSid,
            userName: userName,
            menuOpen: false
        };
    }

    clickMenu() {
        this.setState((state) => {
            return { menuOpen: !state.menuOpen }
        });
    }

    showPage(i) {
        console.log(i);
    }

    render() {
        return (
            <React.StrictMode>
                <TopBar
                    clickMenu={this.clickMenu.bind(this)}
                    showPage={this.showPage.bind(this)}
                    menuOpen={this.state.menuOpen}
                    name={this.state.userName}
                />
                <SideBar
                    showPage={this.showPage.bind(this)}
                    open={this.state.menuOpen}
                />
                <div id="content">
                    <LoginHistory />
                </div>
                <CopyRight />
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

function renderLogin() {
    root.render(
        <LoginBox school="嘉義市嘉華中學" />
    );
}

axios.get(
    "/api/info/user/current"
)
.then(
    (response) => {
        userSid = response.data.data.sid;
        userName = response.data.data.name;
        render();
    }
)
.catch(
    renderLogin
)
