import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import Announcement from "./js/announcement";
import LoginHistory from "./js/login-history";
import MessageBox from "./js/message-box";
import Other from "./js/other";
import SideBar from "./js/side-bar";
import TopBar from "./js/top-bar";

import LoginBox from "./js/login";

import "./index.css";
import "./fonts/font.css"
import "./fonts/material-symbols.css"

const root = ReactDOM.createRoot(document.getElementById("root"));
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
            menuOpen: false,
            userOpen: false,
            now_display: 0,
            message_level: "error",
            message_title: "Test",
            message_context: "Test",
            message_display: true,
        };
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                this.setState({
                    message_display: false
                });
            }
        });
    }

    clickMenu() {
        this.setState((state) => {
            return { menuOpen: !state.menuOpen }
        });
    }

    clickUserMenu() {
        this.setState((state) => {
            return { userOpen: !state.userOpen }
        });
    }

    closeMenu() {
        this.setState({
            menuOpen: false,
            userOpen: false,
        })
    }

    showPage(i) {
        console.log(i);
        this.setState({
            now_display: i,
        });
        this.closeMenu();
    }

    messageShow(title, context, level) {
        this.setState({
            message_level: level,
            message_title: title,
            message_context: context,
            message_display: true,
        });
    }

    messageClose(event) {
        const id = event.target.id;
        const classList = event.target.classList;
        if (id === "message-box" || classList.contains("close")) {
            this.setState({
                message_display: false
            });
        }
    }

    render() {
        return (
            // <React.StrictMode>
            <div id="body">
                <TopBar
                    showPage={this.showPage.bind(this)}
                    clickMenu={this.clickMenu.bind(this)}
                    clickUserMenu={this.clickUserMenu.bind(this)}
                    name={this.state.userName}
                    menuOpen={this.state.menuOpen}
                    userOpen={this.state.userOpen}
                />
                <SideBar
                    showPage={this.showPage.bind(this)}
                    open={this.state.menuOpen}
                />
                <MessageBox
                    close={this.messageClose.bind(this)}
                    title={this.state.message_title}
                    context={this.state.message_context}
                    level={this.state.message_level}
                    display={this.state.message_display}
                // onKeyDown={(e)=>{console.log(e)}}
                />
                <div id="content" onClick={this.closeMenu.bind(this)}>
                    <Announcement display={this.state.now_display === 0} />
                    <LoginHistory display={this.state.now_display === 2} />
                    <Other display={this.state.now_display === 6} />
                </div>
                <CopyRight />
                {/* </React.StrictMode> */}
            </div>
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
    );
