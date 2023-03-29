import React from "react";

import "../../css/old-leave/title-box.css"

export default class TitleBox extends React.Component {
    constructor(props) {
        super(props);
        this.icon = props.icon;
        this.title = props.title;
    }

    render() {
        return (
            <div className="title-box">
                <div className="sub-title">
                    <p className="ms">{this.icon}</p>
                    <p>{this.title}</p>
                </div>
                {this.props.children}
            </div>
        )
    }
}
