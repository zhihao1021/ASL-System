import axios from "axios";
import React from "react";

import "../css/login.css"


export default class LoginBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            school: props.school,               // 標題: 校名
            valid_src: "/api/login/valid-code", // 驗證碼網址
            message_dsplay: false,              // 錯誤框顯示
            message: ""                         // 錯誤框訊息
        };
        this.account = React.createRef();
        this.password = React.createRef();
        this.valid_code = React.createRef();

        this.empty_state = 0b1000;
        // 檢查碼
        // 0: 是否未進行第一次輸入
        // 1: 帳號是否為空
        // 2: 密碼是否為空
        // 3: 驗證碼是否為空

        document.addEventListener("keydown", (e) => { if (e.key === "Enter") { this.auth(); } });
    }

    // 檢查單個輸入框
    checkInputEmpty(ele) {
        // 元素
        let element = ele.nodeType ? ele : ele.target;
        // 取得輸入框class
        let class_name = element.classList[0];
        // 已進行第一次輸入
        this.empty_state = this.empty_state & 0b0111;

        // 檢查元素是否為空
        if (element.value === "") {
            // 新增紅框
            element.classList.add("empty");

            // 設置檢查碼
            switch (class_name) {
                case "account":
                    this.empty_state |= 0b0100;
                    break;
                case "password":
                    this.empty_state |= 0b0010;
                    break;
                case "valid-code":
                    this.empty_state |= 0b0001;
                    break;
                default:
            }
        }
        else {
            // 移除紅框
            element.classList.remove("empty");

            // 設置檢查碼
            switch (class_name) {
                case "account":
                    this.empty_state &= 0b0011;
                    break;
                case "password":
                    this.empty_state &= 0b0101;
                    break;
                case "valid-code":
                    this.empty_state &= 0b0110;
                    break;
                default:
            }
        }

        // 更新訊息框
        if (this.empty_state >= 0b0100) {
            this.setState({
                message_dsplay: true,
                message: "帳號未輸入。"
            });
        }
        else if (this.empty_state >= 0b0010) {
            this.setState({
                message_dsplay: true,
                message: "密碼未輸入。"
            });
        }
        else if (this.empty_state >= 0b0001) {
            this.setState({
                message_dsplay: true,
                message: "驗證碼未輸入。"
            });
        }
        else {
            this.setState({
                message_dsplay: false,
                message: ""
            });
        }
    }

    // 刷新驗證碼
    reloadValidCode() {
        this.setState({
            valid_src: `/api/login/valid-code?d=${Date.now()}`
        });
    }

    // 進行驗證
    auth() {
        let account = this.account.current;
        let password = this.password.current;
        let valid_code = this.valid_code.current;

        [account, password, valid_code].forEach((element) => {
            this.checkInputEmpty(element);
        });

        // 聚焦至元素
        if (this.empty_state >= 0b0100) {
            account.focus();
        }
        else if (this.empty_state >= 0b0010) {
            password.focus();
        }
        else if (this.empty_state >= 0b0001) {
            valid_code.focus();
        }
        else {
            // 進行驗證
            axios.post(
                "/api/login/auth",
                {
                    "account": account.value,
                    "password": password.value,
                    "valid_code": valid_code.value,
                },
            )
            .then(
                () => { window.location.reload() }
            )
            .catch(
                (result) => {
                    this.auth_error.bind(this, result.response)()
                }
            );
        }

    }

    // 驗證失敗
    auth_error(error) {
        let account = this.account.current;
        let password = this.password.current;
        let valid_code = this.valid_code.current;

        // 分辨錯誤並清除密碼
        // 查無帳號
        if (error.status === 400) {
            password.value = "";
            this.setState({
                message_dsplay: true,
                message: "驗證碼錯誤。"
            });
            valid_code.focus();
        }
        // 驗證碼錯誤
        else if (error.status === 404) {
            // 清除帳號
            account.value = "";
            password.value = "";
            this.setState({
                message_dsplay: true,
                message: "帳號有誤或不存在。"
            });
            account.focus();
        }
        // 密碼錯誤
        else if (error.status === 403) {
            password.value = "";
            this.setState({
                message_dsplay: true,
                message: "密碼錯誤。"
            });
            password.focus();
        }
        // 清除驗證碼
        valid_code.value = "";
        // 刷新驗證碼
        this.reloadValidCode();
    }

    render() {
        return (
            <div id="login-body">
                <img id="background" src="/static/img/background.jpg" alt="Background" />
                <div id="login-box">
                    <div className="title">{this.state.school}</div>
                    <hr />
                    <div className="title">線上請假系統</div>
                    <input ref={this.account} autoFocus={true} type="text" className="account"
                        placeholder="帳號" onChange={this.checkInputEmpty.bind(this)} />
                    <input ref={this.password} type="password" className="password"
                        placeholder="密碼" onChange={this.checkInputEmpty.bind(this)} />
                    <div id="valid-box">
                        <input ref={this.valid_code} type="number" className="valid-code"
                            placeholder="驗證碼" onChange={this.checkInputEmpty.bind(this)} />
                        <img id="valid-img" src={this.state.valid_src} title="點擊刷新"
                            onClick={this.reloadValidCode.bind(this)} alt="Valid Code" />
                    </div>
                    <div id="message-box" style={{ "display": this.state.message_dsplay ? "initial" : "none" }}>{this.state.message}</div>
                    <button id="login-button" onClick={this.auth.bind(this)}>登入</button>
                    <div id="login-copyright">
                        Copyright © {new Date().getFullYear()} <a href="https://github.com/AloneAlongLife/ASL-System" target="_blank" rel="noreferrer">莊智皓</a>
                    </div>
                </div>
            </div>
        );
    }
}