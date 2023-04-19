import React from "react";

import "../css/loading.css"

export default class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
        };
    }

    render() {
        const display = this.props.display;
        return (
            <div className={`loading-page ${display ? "display" : ""}`}>
                {/* <div style={{transform: `scale(${scale})`}}>
                    <div className="ring-text font">{this.state.title}</div>
                    <svg className="ring">
                        <circle cx="128px" cy="128px" r="120px"></circle>
                    </svg>
                </div> */}
                <div className="loading-box">
                    <p className="ring-text">Loading...</p>
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        )
    }
}