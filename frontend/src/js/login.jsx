import axios from "axios";
import React from "react";

import Loading from "./loading";
import InputBox from "./input-box";

import "../css/login.css";


export default class LoginBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            school: props.school,              // 標題: 校名
            validSrc: "/api/login/valid-code", // 驗證碼網址
            messageDisplay: false,             // 錯誤框顯示
            message: "",                       // 錯誤框訊息
            display: false,
            check: false
        };
        this.account = React.createRef();
        this.password = React.createRef();
        this.validCode = React.createRef();

        this.emptyState = 0b1000;
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
        let className = element.parentElement.classList[0];
        // 已進行第一次輸入
        this.emptyState = this.emptyState & 0b0111;

        // 檢查元素是否為空
        if (element.value === "") {
            // 設置檢查碼
            switch (className) {
                case "account":
                    this.emptyState |= 0b0100;
                    break;
                case "password":
                    this.emptyState |= 0b0010;
                    break;
                case "valid-code":
                    this.emptyState |= 0b0001;
                    break;
                default:
            }
        }
        else {
            // 設置檢查碼
            switch (className) {
                case "account":
                    this.emptyState &= 0b0011;
                    break;
                case "password":
                    this.emptyState &= 0b0101;
                    break;
                case "valid-code":
                    this.emptyState &= 0b0110;
                    break;
                default:
            }
        }

        // 更新訊息框
        if (this.emptyState >= 0b0100) {
            this.setState({
                messageDisplay: true,
                message: "帳號未輸入。"
            });
        }
        else if (this.emptyState >= 0b0010) {
            this.setState({
                messageDisplay: true,
                message: "密碼未輸入。"
            });
        }
        else if (this.emptyState >= 0b0001) {
            this.setState({
                messageDisplay: true,
                message: "驗證碼未輸入。"
            });
        }
        else {
            this.setState({
                messageDisplay: false,
                message: ""
            });
        }
    }

    // 刷新驗證碼
    reloadValidCode() {
        this.setState({
            validSrc: `/api/login/valid-code?d=${Date.now()}`
        });
    }

    // 進行驗證
    auth() {
        let account = this.account.current;
        let password = this.password.current;
        let validCode = this.validCode.current;

        [account, password, validCode].forEach((element) => {
            this.checkInputEmpty(element);
        });

        this.setState({
            check: true
        })

        // 聚焦至元素
        if (this.emptyState >= 0b0100) {
            account.focus();
        }
        else if (this.emptyState >= 0b0010) {
            password.focus();
        }
        else if (this.emptyState >= 0b0001) {
            validCode.focus();
        }
        else {
            // 進行驗證
            this.setState({
                display: true
            })
            axios.post(
                "/api/login/auth",
                {
                    "account": account.value,
                    "password": password.value,
                    "valid_code": validCode.value,
                },
            ).then(
                () => {
                    this.setState({
                        display: false
                    });
                    window.location.hash = "announcement";
                    setTimeout(() => {window.location.reload()}, 100);
                }
            ).catch(
                (result) => {
                    this.setState({
                        display: false
                    });
                    this.authError(result.response);
                }
            ).finally(
                () => {
                    this.setState({
                        display: false
                    });
                }
            )
        }

    }

    // 驗證失敗
    authError(error) {
        let account = this.account.current;
        let password = this.password.current;
        let validCode = this.validCode.current;

        // 分辨錯誤並清除密碼
        // 查無帳號
        if (error.status === 400) {
            password.value = "";
            this.setState({
                messageDisplay: true,
                message: "驗證碼錯誤。"
            });
            validCode.focus();
        }
        // 驗證碼錯誤
        else if (error.status === 404) {
            // 清除帳號
            account.value = "";
            password.value = "";
            this.setState({
                messageDisplay: true,
                message: "帳號有誤或不存在。"
            });
            account.focus();
        }
        // 密碼錯誤
        else if (error.status === 403) {
            password.value = "";
            this.setState({
                messageDisplay: true,
                message: "密碼錯誤。"
            });
            password.focus();
        }
        // 清除驗證碼
        validCode.value = "";
        // 刷新驗證碼
        this.reloadValidCode();
    }

    render() {
        return (
            <div id="login-body">
                <img id="background" src="/static/img/background.jpg" alt="Background" />
                <Loading title="Loading" display={this.state.display} />
                <div id="login-box">
                    <div className="title">{this.state.school}</div>
                    <hr />
                    <div className="title">線上請假系統</div>
                    <InputBox
                        cref={this.account}
                        title="帳號"
                        necessary={true}
                        type="text"
                        autoFocus={true}
                        onChangeFunc={this.checkInputEmpty.bind(this)}
                        className="account"
                        check={this.state.check}
                    />
                    <InputBox
                        cref={this.password}
                        title="密碼"
                        necessary={true}
                        type="password"
                        onChangeFunc={this.checkInputEmpty.bind(this)}
                        className="password"
                        check={this.state.check}
                    />
                    <div id="valid-box">
                        <InputBox
                            cref={this.validCode}
                            title="驗證碼"
                            necessary={true}
                            type="number"
                            onChangeFunc={this.checkInputEmpty.bind(this)}
                            className="valid-code"
                            check={this.state.check}
                        />
                        <img id="valid-img" src={this.state.validSrc} title="點擊刷新"
                            onClick={this.reloadValidCode.bind(this)} alt="Valid Code" />
                    </div>
                    <div className="message-box" style={{ "display": this.state.messageDisplay ? "initial" : "none" }}>{this.state.message}</div>
                    <button id="login-button" onClick={this.auth.bind(this)}>登入</button>
                    <div id="login-copyright">
                        Copyright © {new Date().getFullYear()} <a href="https://github.com/AloneAlongLife/ASL-System" target="_blank" rel="noreferrer">莊智皓</a>
                    </div>
                </div>
            </div>
        );
    }
}