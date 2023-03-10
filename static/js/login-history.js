class LoginHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.updataData();
    }

    updataData() {
        $.getJSON(
            "/api/info/user/current/login-history",
            (data) => {
                this.setState({
                    data: data.data
                })
            }
        )
    }

    render() {
        let list = this.state.data.map((data)=>{
            return (
                <LoginBox
                    ip={data.ip}
                    session={data.session}
                    last_login={data.last_login}
                    current={data.current}
                />
            )
        })
        return (
            <div id="login-history">
                <div className="tool-bar">
                    <button onClick={this.updataData.bind(this)}>
                        <p>重新整理</p>
                    </button>
                </div>
                <div className="list">
                    {list}
                    {list}
                </div>
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
                    disabled={this.state.current}
                >
                    登出
                </button>
            </div>
        )
    }
}

const root = ReactDOM.createRoot(document.querySelector(".page.login-history"));
root.render(<LoginHistory />)