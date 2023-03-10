class LoginHistory extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="login-history">
                <div>Hello World</div>
            </div>
        );
    }
}

class LoginBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ip: props.ip,
            session: props.session,
            last_login: props.last_login,
            current: props.current
        };
    }

    clickLogout() {
        $.ajax({
            url: `/api/logout/${this.state.session}`,
            success: () => { location.reload() }
        })
    }

    render() {
        return (
            <div className="login-box">
                <div className="ip">
                    <p className="title">IP位置: </p>
                    <p className="content">{this.state.ip}</p>
                </div>
                <div className="login-time">
                    <p className="title">上次活動時間: </p>
                    <p className="content">{this.state.last_login}</p>
                </div>
                <button
                    className="logout-button"
                    onClick={this.clickLogout.bind(this)}
                    disabled={!this.current}
                >
                    登出
                </button>
            </div>
        )
    }
}

const root = ReactDOM.createRoot(document.querySelector(".page.login-history"));
root.render(<LoginHistory />)