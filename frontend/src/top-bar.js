import React from 'react';
import './top-bar.css';
import $ from 'jquery'

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clickMenu: props.clickMenu,
            showPage: props.showPage,
            userOpen: false,
            name: props.name,
        }
    }

    clickUserMenu() {
        this.setState((state) => {
            return { userOpen: !state.userOpen }
        });
    }

    logout() {
        $.ajax({
            url: "/api/logout/current",
            success: () => { window.location.reload() }
        })
    }

    render() {
        const menuOpen = this.props.menuOpen;
        return (
            <div id="top-bar">
                <div
                    className={`menu ms ${menuOpen ? "open" : ""}`}
                    onClick={this.state.clickMenu}
                />
                <img src="/static/img/logo.png" alt="Logo" onClick={() => { this.state.showPage(0) }} />
                <div className="empty" />
                <div className="user-tag" onClick={this.clickUserMenu.bind(this)}>
                    <img src="/api/info/user/current/icon" alt="User Logo" />
                    <div>{this.state.name}</div>
                </div>
                <div className={`user-menu ${this.state.userOpen ? "open" : ""}`}>
                    <div className="user-menu-tag" onClick={() => { this.state.showPage(1) }}>
                        <p className="ms">account_circle</p>
                        <p>帳號</p>
                    </div>
                    <div className="user-menu-tag" onClick={() => { this.state.showPage(2) }}>
                        <p className="ms">history</p>
                        <p>登入紀錄</p>
                    </div>
                    <div className="user-menu-tag" onClick={this.logout}>
                        <p className="ms">logout</p>
                        <p>登出</p>
                    </div>
                </div>
            </div>
        )
    }
}