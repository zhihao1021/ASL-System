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
                        <div className="user-menu-tag">
                            <p className="ms">logout</p>
                            <p>登出</p>
                        </div>
                    </div>
                </div>
                <div id="side-bar" className={this.state.open ? "open" : ""}>
                    <SideTag color="#FF0000" ms="event_available" title="請假" data={[]} />
                    <SideTag color="#FF8000" ms="select_check_box" title="審核" data={[]} />
                    <SideTag color="#FFFF00" ms="search" title="查詢" data={[]} />
                    <SideTag color="#00FF00" ms="more_horiz" title="其他" data={[]} />
                    <SideTag color="#00FFFF" ms="settings" title="設定" data={[]} />
                    <SideTag color="#8000FF" ms="manage_accounts" title="管理" data={[]} />
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
            title: props.title,
            data: props.data
        }
    }

    render() {
        let list = this.state.data.map((d) => {
            return (
                <div className="tab" onClick={() => { location.hash = d.src }}>
                    {d.name}
                </div>
            )
        })
        return (
            <div
                className="side-tag"
                style={{ "border-color": this.state.color }}
            >
                <div className="tag">
                    <p>{this.state.title}</p>
                    <p className="ms">{this.state.ms}</p>
                </div>
                <div className="page">
                    {list}
                </div>
            </div>
        )
    }
}

const root = ReactDOM.createRoot(document.querySelector("body"));
root.render(
    <MainContent />
)