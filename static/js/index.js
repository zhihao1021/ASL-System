class MainContent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="react-content">
                <div id="top-bar">
                    <img src="/static/img/logo.png" />
                </div>
                <div id="side-bar">

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
            title: props.title
        }
    }

    render() {
        return (
            <div
                className="side-tag"
                style={{ "border-color": this.state.color }}
            >
                {this.state.title}
            </div>
        )
    }
}

const root = ReactDOM.createRoot(document.querySelector("body"));
root.render(
    <MainContent />
)