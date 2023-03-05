// 檢查必填
function auth() {

}

// 驗證失敗
function auth_error(error) {
    // 訊息框
    let message_box = document.querySelector("#message-box");
    // 帳號
    let account = document.querySelector("input.account");
    // 密碼
    let password = document.querySelector("input.password");
    // 驗證碼
    let valid_code = document.querySelector("input.valid-code");

    // 分辨錯誤並清除密碼
    // 查無帳號
    // 驗證碼錯誤
    if (error.status == 400) {
        password.value = "";
        message_box.textContent = "驗證碼錯誤。";
        message_box.style.display = "";
        valid_code.focus();
    }
    else if (error.status == 404) {
        // 清除帳號
        account.value = "";
        password.value = "";
        message_box.textContent = "帳號有誤或不存在。";
        message_box.style.display = "";
        account.focus();
    }
    // 密碼錯誤
    else if (error.status == 403) {
        password.value = "";
        message_box.textContent = "密碼錯誤。";
        message_box.style.display = "";
        password.focus();
    }
    // 清除驗證碼
    valid_code.value = "";
    // 刷新驗證碼
    reload_valid_code();
}


class LoginBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            school: props.school,
            valid_src: "/valid-code",
            message_dsplay: false,
        };
        this.account = React.createElement();
        this.password = React.createElement();
        this.valid_code = React.createElement();
    }

    checkInputEmpty() {
        let element = event.target;
        if (element.value === "") {
            element.classList.add("empty");
        }
        else {
            element.classList.remove("empty");
        }
    }

    reloadValidCode() {
        this.setState({
            valid_src: `/valid-code?d=${Date.now()}`
        })
    }

    auth() {
        // 訊息框
        let message_box = document.querySelector("#message-box");
        // 帳號
        let account = document.querySelector("input.account");
        // 密碼
        let password = document.querySelector("input.password");
        // 驗證碼
        let valid_code = document.querySelector("input.valid-code");

        if (!account.value) {
            message_box.textContent = "帳號未輸入。";
            message_box.style.display = "";
            account.focus();
            account.classList.add("warning");
            setTimeout(() => { account.classList.remove("warning") }, 1000);
            return;
        }
        if (!password.value) {
            message_box.textContent = "密碼未輸入。";
            message_box.style.display = "";
            password.focus();
            password.classList.add("warning");
            setTimeout(() => { password.classList.remove("warning") }, 1000);
            return;
        }
        if (!valid_code.value) {
            message_box.textContent = "驗證碼未輸入。";
            message_box.style.display = "";
            valid_code.focus()
            valid_code.classList.add("warning");
            setTimeout(() => { valid_code.classList.remove("warning") }, 1000);
            return;
        }

        // 進行驗證
        postJSON("/api/login/auth", {
            "account": account.value,
            "password": password.value,
            "valid_code": valid_code.value,
        }, location.reload, auth_error);
    }

    render() {
        return (
            <div id="login-box">
                <div className="title">{this.state.school}</div>
                <hr />
                <div className="title">線上請假系統</div>
                <input ref={this.account} autoFocus="true" type="text" className="account"
                    placeholder="帳號" onChange={this.checkInputEmpty} />
                <input ref={this.password} type="password" className="password"
                    placeholder="密碼" onChange={this.checkInputEmpty} />
                <div id="valid-box">
                    <input ref={this.valid_code} type="text" className="valid-code"
                        placeholder="驗證碼" onChange={this.checkInputEmpty} />
                    <img id="valid-img" src={this.state.valid_src} title="點擊刷新"
                        onClick={this.reloadValidCode.bind(this)} />
                </div>
                <div id="message-box"></div>
            </div>
        );
    }
}



const root = ReactDOM.createRoot(document.querySelector("#react-content"));
root.render(<LoginBox school="嘉義市嘉華中學" />)
// root.render()
React.createElement("input", {})