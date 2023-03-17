import React from "react";

import NewLeave from "./new-leave/main";

import TitleBar from "./title-bar";

import "../css/leave.css";

export default class Leave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 0,
        };
    }

    render() {
        const display = this.props.display;
        return (
            <div id="leave" style={{ "display": display ? "" : "none" }}>
                <TitleBar title="請假">
                    <button onClick={() => { this.setState({ display: 0 }) }}>新增請假</button>
                    <button onClick={() => { this.setState({ display: 1 }) }}>查看資料</button>
                </TitleBar>
                <hr />
                <NewLeave display={this.state.display === 0} />
            </div>
        )
    }
}


