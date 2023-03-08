class MainContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    touchMenu() {
        this.setState((state) => {
            return { open: !state.open }
        });
    }

    render() {
        return (
            <div id="react-content">
                <div id="top-bar">
                    <div
                        className={`menu ms ${this.state.open ? "open" : ""}`}
                        onTouchStart={this.touchMenu.bind(this)}
                    />
                    <img src="/static/img/logo.png" />
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