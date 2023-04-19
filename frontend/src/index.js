import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import Announcement from "./js/announcement";
import Authorize from "./js/authorize";
import Leave from "./js/leave";
import Loading from "./js/loading";
import LoginHistory from "./js/login-history";
import MessageBox from "./js/message-box";
import Other from "./js/other";
import Query from "./js/query";
import SideBar from "./js/side-bar";
import TopBar from "./js/top-bar";

import LoginBox from "./js/login";

import "./index.css";
import "./fonts/fonts.css"

import { getHashIndex } from "./utils";

const root = ReactDOM.createRoot(document.getElementById("root"));
const year = new Date().getFullYear();

var needLoaded = 0;
var userSid, userName, userClass, classId;
var displayBlock = [true, true, true, true, true, true, true];
displayBlock[5] = false;
displayBlock[6] = false;


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
            menuOpen: false,
            userOpen: false,
            nowDisplay: getHashIndex(),
            messageLevel: "error",
            messageTitle: "Test",
            messageContext: "Test",
            messageDisplay: false,
            loading: false,
            typeOptions: [],
            lessonOptions: []
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

    componentDidMount() {
        this.getLeaveType();
        this.getLeaveLesson();
    }

    getLeaveType() {
        axios.get("/api/leave/type").then(
            (response) => {
                this.setState({
                    typeOptions: response.data.data
                });
            }
        )
    }

    getLeaveLesson() {
        axios.get("/api/leave/lesson").then(
            (response) => {
                this.setState({
                    lessonOptions: response.data.data
                });
            }
        )
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
                    name={userName}
                    menuOpen={this.state.menuOpen}
                    userOpen={this.state.userOpen}
                    loading={this.setLoading.bind(this)}
                />
                <SideBar
                    showPage={this.showPage.bind(this)}
                    open={this.state.menuOpen}
                    displayBlock={displayBlock}
                />
                <MessageBox
                    close={this.closeMessage.bind(this)}
                    title={this.state.messageTitle}
                    context={this.state.messageContext}
                    level={this.state.messageLevel}
                    display={this.state.messageDisplay}
                />
                <Loading display={this.state.loading}/>
                <div id="content" onClick={this.closeMenu.bind(this)}>
                    <LoginHistory
                        loading={this.setLoading.bind(this)}
                        showMessage={this.showMessage.bind(this)}
                        display={this.state.nowDisplay === 2}
                    />
                    {displayBlock[0] ?
                        <Announcement
                            display={this.state.nowDisplay === 0}
                        /> : null
                    }
                    {displayBlock[1] ?
                        <Leave
                            showMessage={this.showMessage.bind(this)}
                            loading={this.setLoading.bind(this)}
                            name={userName}
                            sid={userSid}
                            userClass={userClass}
                            display={this.state.nowDisplay === 3}
                            typeOptions={this.state.typeOptions}
                            lessonOptions={this.state.lessonOptions}
                        /> : null
                    }
                    {displayBlock[2] ?
                        <Authorize
                            showMessage={this.showMessage.bind(this)}
                            loading={this.setLoading.bind(this)}
                            display={this.state.nowDisplay === 4}
                            typeOptions={this.state.typeOptions}
                            lessonOptions={this.state.lessonOptions}
                        /> : null
                    }
                    {displayBlock[3] ?
                        <Query
                            showMessage={this.showMessage.bind(this)}
                            loading={this.setLoading.bind(this)}
                            display={this.state.nowDisplay === 5}
                            typeOptions={this.state.typeOptions}
                            lessonOptions={this.state.lessonOptions}
                        /> : null
                    }
                    {displayBlock[4] ?
                        <Other
                            showMessage={this.showMessage.bind(this)}
                            loading={this.setLoading.bind(this)}
                            display={this.state.nowDisplay === 6}
                        /> : null
                    }
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

function getData(index = 0) {
    switch (index) {
        case 0:
            axios.get(
                "/api/info/user/current"
            ).then(
                (response) => {
                    userSid = response.data.data.sid;
                    userName = response.data.data.name;
                    classId = response.data.data.class_id;
                    let role = response.data.data.role;
                    if (role === 1) {
                        displayBlock[2] = false;
                        displayBlock[3] = false;
                        displayBlock[4] = false;
                        displayBlock[6] = false;
                    }
                    else if (role !== 32) {
                        displayBlock[1] = false;
                        displayBlock[6] = false;
                    }

                    if (role === 2) {
                        displayBlock[4] = false;
                    }
                    getData(index + 1);
                }
            ).catch(
                () => { root.render(<LoginBox school="嘉義市嘉華中學" />); }
            );
            break;
        case 1:
            if (classId) {
                axios.get(
                    `/api/class/${classId}`
                ).then(
                    (response) => {
                        userClass = response.data.data.class_name;
                        userClass = userClass === "None" ? "無" : userClass;
                        getData(index + 1);
                    }
                );
            }
            break;
        default:
            render();
    }
}

getData();
