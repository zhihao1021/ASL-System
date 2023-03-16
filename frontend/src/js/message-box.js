import React from "react";

import "../css/message-box.css";

function get_color(level) {
    switch (level) {
        case "info":
            console.log(level)
            return "#5BE52B"
        case "warning":
            return "#FFF823"
        case "error":
            return "#FF0000"
        default:
            return "#0088FF"
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
                        style={{ backgroundColor: get_color(level) }}
                    >
                        {title}
                    </div>
                    <div className="content">
                        {context}
                    </div>
                </div>
            </div>
        )
    }
}