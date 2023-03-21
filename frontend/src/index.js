import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import Announcement from "./js/announcement";
import Leave from "./js/leave";
import Loading from "./js/loading";
import LoginHistory from "./js/login-history";
import MessageBox from "./js/message-box";
import Other from "./js/other";
import SideBar from "./js/side-bar";
import TopBar from "./js/top-bar";

import LoginBox from "./js/login";

import "./index.css";
import "./fonts/fonts.css"

const root = ReactDOM.createRoot(document.getElementById("root"));
const year = new Date().getFullYear()
const hashMap = [
    "announcement",
    "account",
    "login-history",
    "leave",
    "authorize",
    "query",
    "other",
    "setting",
    "management",
]
var needLoaded = 0;
var userSid, userName;


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
            nowDisplay: getHashIndex(),
            messageLevel: "error",
            messageTitle: "Test",
            messageContext: "Test",
            messageDisplay: false,
            loading: false,
        };
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                this.setState({
                    messageDisplay: false
                });
            }
        });
        window.addEventListener("hashchange", () => {
            this.showPage(getHashIndex());
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
        if (i === this.state.nowDisplay) {
            return
        }
        console.log(i);
        setIndexHash(i);
        this.setState({
            nowDisplay: i,
        });
        this.closeMenu();
    }

    showMessage(title, context, level) {
        this.setState({
            messageLevel: level,
            messageTitle: title,
            messageContext: context,
            messageDisplay: true,
        });
    }

    closeMessage(event) {
        const id = event.target.id;
        const classList = event.target.classList;
        if (id === "message-box" || classList.contains("close")) {
            this.setState({
                messageDisplay: false
            });
        }
    }

    setLoading(show) {
        this.setState({
            loading: show,
        });
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
                    close={this.closeMessage.bind(this)}
                    title={this.state.messageTitle}
                    context={this.state.messageContext}
                    level={this.state.messageLevel}
                    display={this.state.messageDisplay}
                />
                <Loading scale={0.5} display={this.state.loading} title="Loading..." />
                <div id="content" onClick={this.closeMenu.bind(this)}>
                    <Announcement
                        display={this.state.nowDisplay === 0}
                    />
                    <Leave
                        showMessage={this.showMessage.bind(this)}
                        loading={this.setLoading.bind(this)}
                        name={userName}
                        sid={userSid}
                        display={this.state.nowDisplay === 3}
                    />
                    <LoginHistory
                        showMessage={this.showMessage.bind(this)}
                        display={this.state.nowDisplay === 2}
                    />
                    <Other
                        showMessage={this.showMessage.bind(this)}
                        loading={this.setLoading.bind(this)}
                        display={this.state.nowDisplay === 6}
                    />
                </div>
                <CopyRight />
                {/* </React.StrictMode> */}
            </div>
        );
    }
}

function render() {
    if (needLoaded) {
        setTimeout(render, 100);
    }
    else {
        root.render(
            <MainContent />
        );
        reportWebVitals();
    }
}

function getHashIndex() {
    const hash = window.location.hash.slice(1);
    return Math.max(0, hashMap.indexOf(hash));
}

function setIndexHash(index) {
    const hash = hashMap[index];
    window.location.hash = hash === undefined ? "" : hash;
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
        () => { root.render(<LoginBox school="嘉義市嘉華中學" />); }
    );
