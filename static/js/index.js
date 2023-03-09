class MainContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            user_open: false,
            icon: "/api/info/user/current/icon",
            name: ""
        }
        $.getJSON(
            `/api/info/user/current`,
            (data) => {
                this.setState({
                    name: data.data.name
                })
            }
        )
    }

    clickMenu() {
        this.setState((state) => {
            return { open: !state.open }
        });
    }

    clickUserMenu() {
        this.setState((state) => {
            return { user_open: !state.user_open }
        });
    }

    clickLogout() {
        $.ajax({
            url: "/api/logout/current",
            success: ()=>{location.reload()}
        })
    }

    render() {
        return (
            <div id="react-content">
                <div id="top-bar">
                    <div
                        className={`menu ms ${this.state.open ? "open" : ""}`}
                        onClick={this.clickMenu.bind(this)}
                    />
                    <img src="/static/img/logo.png" />
                    <div className="empty" />
                    <div className="user-tag" onClick={this.clickUserMenu.bind(this)}>
                        <img src={this.state.icon} />
                        <div>{this.state.name}</div>
                    </div>
                    <div className={`user-menu ${this.state.user_open ? "open" : ""}`}>
                        <div className="user-menu-tag">
                            <p className="ms">account_circle</p>
                            <p>帳號</p>
                        </div>
                        <div className="user-menu-tag" onClick={this.clickLogout.bind(this)}>
                            <p className="ms">logout</p>
                            <p>登出</p>
                        </div>
                    </div>
                </div>
                <div id="side-bar" className={this.state.open ? "open" : ""}>
                    <SideTag color="#FF0000" ms="event_available" title="請假" />
                    <SideTag color="#FF8000" ms="select_check_box" title="審核" />
                    <SideTag color="#FFFF00" ms="search" title="查詢" />
                    <SideTag color="#00FF00" ms="more_horiz" title="其他" />
                    <SideTag color="#00FFFF" ms="settings" title="設定" />
                    <SideTag color="#8000FF" ms="manage_accounts" title="管理" />
                </div>
                <div id="copyright">
                    Copyright © {new Date().getFullYear()} <a href="https://github.com/AloneAlongLife/ASL-System" target="_blank">莊智皓</a>
                </div>
            </div>
        )
    }
}

class SideTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: props.color,
            ms: props.ms,
            title: props.title
        }
    }

    render() {
        return (
            <div
                className="side-tag"
                style={{ "border-color": this.state.color }}
            >
                <div className="tag">
                    <p>{this.state.title}</p>
                    <p className="ms">{this.state.ms}</p>
                </div>
            </div>
        )
    }
}

const root = ReactDOM.createRoot(document.querySelector("body"));
root.render(
    <MainContent />
)