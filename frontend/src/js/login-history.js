import axios from "axios";
import React from "react";

import "../css/login-history.css";

export default class LoginHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessions: [],
            data: [],
        };
    }

    componentDidMount() {
        this.reload();
    }

    logout(session) {
        axios.get(`/api/logout/${session}`)
        .finally(
            this.reload.bind(this)
        );
    }

    logoutAll() {
        const sessions = this.state.sessions;
        function __logout(index = 0) {
            let session = sessions[index];
            if (session === undefined) {
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
                        (login_data) => {
                            return !login_data.current;
                        }
                    )
                    .map(
                        (login_data) => {
                            return login_data.session;
                        }
                    ),
                    data: data.map((login_data, index) => {
                        return (
                            <LoginHistoryBox
                                key={index}
                                current={login_data.current}
                                ip={login_data.ip}
                                last_login={login_data.last_login}
                                logoutFunc={this.logout.bind(this, login_data.session)}
                            />
                        );
                    }),
                });
            }
        );
    }

    render() {
        const display = this.props.display;
        return (
            <div id="login-history" style={{"display": display ? "" : "none"}}>
                <div className="tool-bar">
                    <button className="logout-all" onClick={this.logoutAll.bind(this)}>
                        全部登出
                    </button>
                    <button className="reload" onClick={this.reload.bind(this)}>
                        重新整理
                    </button>
                </div>
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
        let last_login = props.last_login;
        last_login = last_login.split(".", 1)[0].split("+", 1)[0];
        this.state = {
            current: props.current,
            ip: props.ip,
            last_login: last_login,
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
                    <p>{this.state.last_login}</p>
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
