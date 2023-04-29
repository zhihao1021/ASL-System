import React from "react";

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

import { functionInit, getHashIndex } from "./utils";
import { role } from "./variables";

import "./index.css";
import "./fonts/fonts.css"

const year = new Date().getFullYear();

var displayBlock = [true, true, true, true, true, true, true];
displayBlock[5] = false;
displayBlock[6] = false;

function updateDisplayBlock() {
    if (role === 1) {
        displayBlock[2] = false;
        displayBlock[3] = false;
        displayBlock[4] = false;
        displayBlock[6] = false;
    }
    else if (role !== 0) {
        displayBlock[1] = false;
        displayBlock[6] = false;
    }
    if (role === 2) {
        displayBlock[4] = false;
    }
}

export default class MainContent extends React.Component {
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
        };
        this.clickMenu = this.clickMenu.bind(this);
        this.clickUserMenu = this.clickUserMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.showPage = this.showPage.bind(this)
        this.closeMessage = this.closeMessage.bind(this)

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

        functionInit(
            (show) => {
                this.setState({ loading: show });
            },
            (title, context, level) => {
                this.setState({
                    messageLevel: level,
                    messageTitle: title,
                    messageContext: context,
                    messageDisplay: true,
                });
            }
        );

        updateDisplayBlock();
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
        });
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

    closeMessage(event) {
        const id = event.target.id;
        const classList = event.target.classList;
        if (id === "message-box" || classList.contains("close")) {
            this.setState({
                messageDisplay: false
            });
        }
    }

    render() {
        return (
            <div id="body">
                <TopBar
                    showPage={this.showPage}
                    clickMenu={this.clickMenu}
                    clickUserMenu={this.clickUserMenu}
                    menuOpen={this.state.menuOpen}
                    userOpen={this.state.userOpen}
                />
                <SideBar
                    showPage={this.showPage}
                    open={this.state.menuOpen}
                    displayBlock={displayBlock}
                />
                <MessageBox
                    close={this.closeMessage}
                    title={this.state.messageTitle}
                    context={this.state.messageContext}
                    level={this.state.messageLevel}
                    display={this.state.messageDisplay}
                />
                <Loading display={this.state.loading} />
                <div id="content" onClick={this.closeMenu}>
                    <LoginHistory
                        display={this.state.nowDisplay === 2}
                    />
                    {displayBlock[0] ?
                        <Announcement
                        display={this.state.nowDisplay === 0}
                        /> : null
                    }
                    {displayBlock[1] ?
                        <Leave
                        display={this.state.nowDisplay === 3}
                        /> : null
                    }
                    {displayBlock[2] ?
                        <Authorize
                        display={this.state.nowDisplay === 4}
                        /> : null
                    }
                    {displayBlock[3] ?
                        <Query
                            display={this.state.nowDisplay === 5}
                        /> : null
                    }
                    {displayBlock[4] ?
                        <Other
                            display={this.state.nowDisplay === 6}
                        /> : null
                    }
                </div>
                <div id="copyright">
                    Copyright © {year} <a href="https://github.com/AloneAlongLife/ASL-System" target="_blank" rel="noreferrer">莊智皓</a>
                </div>
            </div>
        );
    }
}
