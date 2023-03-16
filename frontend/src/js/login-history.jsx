import axios from "axios";
import React from "react";

import TitleBar from "./title-bar";

import "../css/login-history.css";

export default class LoginHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessions: [],
            data: [],
        };
        this.showMessage = props.showMessage;
        this.display = false;
    }

    componentDidMount() {
        this.reload();
    }

    logout(session) {
        axios.get(`/api/logout/${session}`)
            .then(
                () => { this.showMessage("登出成功", "已成功登出。", "info"); }
            )
            .catch(
                () => { this.showMessage("登出失敗", "未成功登出。", "error"); }
            )
            .finally(
                this.reload.bind(this)
            );
    }

    logoutAll() {
        const sessions = this.state.sessions;
        function __logout(index = 0) {
            let session = sessions[index];
            if (session === undefined) {
                this.showMessage("登出成功", "已全部登出。", "info");
                this.reload.bind(this)();
            }
            else {
                axios.get(`/api/logout/${session}`)
                    .finally(
                        __logout.bind(this, ++index)
                    );
            }
        }
        __logout.bind(this)();
    }

    reload() {
        axios.get("/api/info/user/current/login-history")
            .then(
                (response) => {
                    const data = response.data.data;
                    this.setState({
                        sessions: data.filter(
                            (loginData) => {
                                return !loginData.current;
                            }
                        )
                            .map(
                                (loginData) => {
                                    return loginData.session;
                                }
                            ),
                        data: data.map((loginData, index) => {
                            return (
                                <LoginHistoryBox
                                    key={index}
                                    current={loginData.current}
                                    ip={loginData.ip}
                                    lastLogin={loginData.last_login}
                                    logoutFunc={this.logout.bind(this, loginData.session)}
                                />
                            );
                        }),
                    });
                }
            );
    }

    render() {
        const display = this.props.display;
        if (display && !this.display) {
            this.reload();
        }
        this.display = display;
        return (
            <div id="login-history" style={{ "display": display ? "" : "none" }}>
                <TitleBar title="登入紀錄">
                    <button className="logout-all" onClick={this.logoutAll.bind(this)}>
                        全部登出
                    </button>
                    <button className="reload" onClick={this.reload.bind(this)}>
                        重新整理
                    </button>
                </TitleBar>
                <hr />
                <div className="login-content">
                    {this.state.data}
                </div>
            </div>
        );
    }
}

class LoginHistoryBox extends React.Component {
    constructor(props) {
        super(props);
        let lastLogin = props.lastLogin;
        lastLogin = lastLogin.split(".", 1)[0].split("+", 1)[0];
        this.state = {
            current: props.current,
            ip: props.ip,
            lastLogin: lastLogin,
            logoutFunc: props.logoutFunc,
        };
    }

    render() {
        return (
            <div
                className={`login-history-box ${this.state.current ? "current" : ""}`}
            >
                <div className="content-box">
                    <p>IP位置</p>
                    <hr />
                    <p>{this.state.ip}</p>
                </div>
                <div className="content-box">
                    <p>上次活動時間</p>
                    <hr />
                    <p>{this.state.lastLogin}</p>
                </div>
                <button
                    className="logout-button"
                    onClick={this.state.logoutFunc}
                    disabled={this.state.current}
                >
                    登出
                </button>
            </div>
        );
    }
}
