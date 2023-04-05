import axios from "axios";
import React from "react";

import "../css/top-bar.css";

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
        };
        this.showPage = props.showPage;
        this.clickMenu = props.clickMenu;
        this.clickUserMenu = props.clickUserMenu;
    }

    logout() {
        axios.get("/api/logout/current")
        .then(
            () => {
                setTimeout(() => {window.location.reload()}, 100);
            }
        );
    }

    render() {
        const menuOpen = this.props.menuOpen;
        const userOpen = this.props.userOpen;
        return (
            <div id="top-bar">
                <div
                    className={`menu ms ${menuOpen ? "open" : ""}`}
                    onClick={this.clickMenu}
                />
                <img src="/static/img/logo.png" alt="Logo" onClick={() => { this.showPage(0) }} />
                <div className="empty" />
                <div className="user-tag" onClick={this.clickUserMenu}>
                    <img src="/api/info/user/current/icon" alt="User Logo" />
                    <div>{this.state.name}</div>
                </div>
                <div className={`user-menu ${userOpen ? "open" : ""}`}>
                    <div className="user-menu-tag" onClick={() => { this.showPage(1) }}>
                        <p className="ms">account_circle</p>
                        <p>帳號</p>
                    </div>
                    <div className="user-menu-tag" onClick={() => { this.showPage(2) }}>
                        <p className="ms">history</p>
                        <p>登入紀錄</p>
                    </div>
                    <div className="user-menu-tag" onClick={this.logout}>
                        <p className="ms">logout</p>
                        <p>登出</p>
                    </div>
                </div>
            </div>
        );
    }
}