import React from "react";

import "../css/title-bar.css";

export default class TitleBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            children: props.children,
        };
    }

    render() {
        return (
            <div className="title-bar">
                <p>{this.state.title}</p>
                {this.state.children}
            </div>
        )
    }
}
