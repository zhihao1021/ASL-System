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
        this.showMessage = props.showMessage;
        this.loading = props.loading
        this.name = props.name;
        this.sid = props.sid;
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
                <NewLeave
                    showMessage={this.showMessage}
                    loading={this.loading}
                    name={this.name}
                    sid={this.sid}
                    display={this.state.display === 0}
                />
            </div>
        )
    }
}


