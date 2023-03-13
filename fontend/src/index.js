import React from 'react';
import ReactDOM from 'react-dom/client';
import $ from 'jquery'
// import reportWebVitals from './reportWebVitals';

import LoginBox from './login';
import TopBar from './top-bar';
import SideBar from './side-bar';

import './index.css';
import './fonts/font.css'
import './fonts/material-symbols.css'

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

    render() {
        return (
            <React.StrictMode>
                <TopBar
                    clickMenu={this.clickMenu.bind(this)}
                    menuOpen={this.state.menuOpen}
                    name={this.state.userName}
                />
                <SideBar open={this.state.menuOpen} />
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
        // reportWebVitals();
    }
}

function renderLogin() {
    root.render(
        <LoginBox school="嘉義市嘉華中學" />
    );
}

$.getJSON({
    url: `/api/info/user/current`,
    success: (response) => {
        userSid = response.data.sid;
        userName = response.data.name;
        render();
    },
    error: (response) => {
        if (response.status === 403) {
            renderLogin()
        }
        else {
            setTimeout(window.location.reload, 1000);
        }
    }
});
