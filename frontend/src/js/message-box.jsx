import React from "react";

import "../css/message-box.css";

function getColor(level) {
    switch (level) {
        case "info":
            return "#0088FF"
        case "warning":
            return "#FFF823"
        case "error":
            return "#FF0000"
        case "success":
            return "#44BB00"
        default:
            return "#0088FF"
    }
}

function getIcon(level) {
    switch (level) {
        case "info":
            return "info"
        case "warning":
            return "warning"
        case "error":
            return "report"
        case "success":
            return "task_alt"
        default:
            return "help"
    }
}

export default class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        this.close = props.close;
    }
    
    render() {
        const title = this.props.title;
        const context = this.props.context;
        const level = this.props.level;
        const display = this.props.display;
        return (
            <div
                id="message-box"
                className={display ? "display" : ""}
                onClick={this.close}
            >
                <div className="box">
                    <div className="close">close</div>
                    <div
                        className="title"
                        style={{ backgroundColor: getColor(level) }}
                    >
                        {title}
                    </div>
                    <div className="ms">
                        {getIcon(level)}
                    </div>
                    <div className="content">
                        {context}
                    </div>
                </div>
            </div>
        )
    }
}