import axios from "axios";
import React from "react";

import { setLoading } from "../utils";
import { name } from "../variables";

import "../css/top-bar.css";

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.showPage = props.showPage;
        this.clickMenu = props.clickMenu;
        this.clickUserMenu = props.clickUserMenu;

        this.logout = this.logout.bind(this);
    }

    logout() {
        setLoading(true);
        axios.get("/api/logout/current").then(
            () => {
                window.location.reload();
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
                    <img src="/static/img/user_icon.png" alt="User Logo" />
                    <div>{name}</div>
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