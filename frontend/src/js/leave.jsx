import axios from "axios";
import React from "react";

import NewLeave from "./new-leave/main";
import OldLeave from "./old-leave/main";

import TitleBar from "./title-bar";

import "../css/leave.css";

export default class Leave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: window.location.hash === "#old-leave" ? 1 : 0,
            typeOptions: [],
            lessonOptions: [],
        };
        this.showMessage = props.showMessage;
        this.loading = props.loading
        this.name = props.name;
        this.sid = props.sid;
        this.userClass = props.userClass;

        window.addEventListener("hashchange", this.hashChange.bind(this));
    }

    componentDidMount() {
        this.getLeaveType();
        this.getLeaveLesson();
    }

    componentDidUpdate() {
        if (this.props.display) {
            if (window.location.hash !== "#new-leave" && window.location.hash !== "#old-leave") {
                window.location.hash = this.state.display === 0 ? "new-leave" : "old-leave";
            }
        }
    }

    hashChange() {
        const hash = window.location.hash;
        if (hash === "#new-leave" || hash === "#old-leave") {
            this.setState({
                display: window.location.hash === "#old-leave" ? 1 : 0,
            });
        }
    }

    setPage(i) {
        this.setState({
            display: i
        });
        window.location.hash = i === 0 ? "new-leave" : "old-leave";
    }

    getLeaveType() {
        axios.get("/api/leave/type").then(
            (response) => {
                this.setState({
                    typeOptions: response.data.data
                });
            }
        )
    }
    
    getLeaveLesson() {
        axios.get("/api/leave/lesson").then(
            (response) => {
                this.setState({
                    lessonOptions: response.data.data
                });
            }
        )
    }

    render() {
        const display = this.props.display;
        return (
            <div id="leave" style={{ "display": display ? "" : "none" }}>
                <TitleBar title="請假">
                    <button onClick={this.setPage.bind(this, 0)}>新增請假</button>
                    <button onClick={this.setPage.bind(this, 1)}>查看資料</button>
                </TitleBar>
                <hr />
                <NewLeave
                    showMessage={this.showMessage}
                    loading={this.loading}
                    name={this.name}
                    sid={this.sid}
                    userClass={this.userClass}
                    display={this.state.display === 0}
                    typeOptions={this.state.typeOptions}
                    lessonOptions={this.state.lessonOptions}
                    />
                <OldLeave
                    display={this.state.display === 1}
                    typeOptions={this.state.typeOptions}
                    lessonOptions={this.state.lessonOptions}
                />
            </div>
        )
    }
}


