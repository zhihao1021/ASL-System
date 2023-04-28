import axios from "axios";
import React from "react";

import TitleBar from "./title-bar";

import { setLoading, showMessage } from "../utils";

import "../css/login-history.css";

export default class LoginHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessions: [],
            data: [],
        };

        this.reload = this.reload.bind(this);
        this.logoutAll = this.logoutAll.bind(this);
    }

    componentDidMount() {
        this.reload();
    }

    componentDidUpdate(props) {
        if (!props.display && this.props.display) {
            window.location.hash = "login-history";
            this.reload();
        }
    }

    logout(session) {
        setLoading(true);
        axios.get(`/api/logout/${session}`).then(
            () => { showMessage("登出成功", "已成功登出。", "success"); }
        ).catch(
            () => { showMessage("登出失敗", "未成功登出。", "error"); }
        ).finally(
            () => {
                setLoading(false);
                this.reload();
            }
        );
    }

    logoutAll() {
        setLoading(true);
        const sessions = this.state.sessions;
        axios.all(
            sessions.map(value => axios.get(`/api/logout/${value}`))
        ).then(
            () => { showMessage("登出成功", "已全部登出。", "success"); }
        ).catch(
            () => { showMessage("登出失敗", "未全部登出。", "error"); }
        ).finally(
            () => {
                setLoading(false);
                this.reload();
            }
        )
    }

    reload() {
        setLoading(true);
        axios.get(
            "/api/info/user/current/login-history"
        ).then(
            (response) => {
                const data = response.data.data;
                this.setState({
                    sessions: data.filter(
                        loginData => !loginData.current
                    ).map(
                        loginData => loginData.session
                    ),
                    data: data.map((loginData, index) => (
                        <LoginHistoryBox
                            key={index}
                            loginData={loginData}
                            logoutFunc={this.logout.bind(this, loginData.session)}
                        />
                    )),
                });
            }
        ).finally(
            () => { setLoading(false); }
        );
    }

    render() {
        const display = this.props.display;
        return (
            <div id="login-history" style={{ "display": display ? "" : "none" }}>
                <TitleBar title="登入紀錄">
                    <button className="logout-all" onClick={this.logoutAll}>
                        全部登出
                    </button>
                    <button className="reload" onClick={this.reload}>
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

function LoginHistoryBox(props) {
    const loginData = props.loginData;
    const lastLogin = loginData.last_login.split(".", 1)[0].split("+", 1)[0];
    const current = loginData.current;
    const ip = loginData.ip;
    const logoutFunc = props.logoutFunc;
    return (
        <div
            className={`login-history-box ${current ? "current" : ""}`}
        >
            <div className="content-box">
                <p>IP位置</p>
                <hr />
                <p>{ip}</p>
            </div>
            <div className="content-box">
                <p>上次活動時間</p>
                <hr />
                <p>{lastLogin}</p>
            </div>
            <button
                className="logout-button"
                onClick={logoutFunc}
                disabled={current}
            >
                登出
            </button>
        </div>
    );
}
