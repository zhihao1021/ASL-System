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
            leaveData: [],
        };
        this.showMessage = props.showMessage;
        this.loading = props.loading;
        this.name = props.name;
        this.sid = props.sid;
        this.userClass = props.userClass;

        window.addEventListener("hashchange", this.hashChange.bind(this));
    }

    componentDidMount() {
        this.getLeaveData();
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

    getLeaveData() {
        this.loading(true);
        axios.get("/api/leave/sid/current").then(
            (response)=>{
                this.setState({
                    leaveData: response.data.data
                });
            }
        ).finally(
            () => {
                this.loading(false);
            }
        )
    }

    render() {
        const display = this.props.display;
        const lessonOptions = this.props.lessonOptions;
        const typeOptions = this.props.typeOptions;
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
                    typeOptions={typeOptions}
                    lessonOptions={lessonOptions}
                    getLeaveData={this.getLeaveData.bind(this)}
                />
                <OldLeave
                    showMessage={this.showMessage}
                    loading={this.loading}
                    name={this.name}
                    sid={this.sid}
                    userClass={this.userClass}
                    display={this.state.display === 1}
                    typeOptions={typeOptions}
                    lessonOptions={lessonOptions}
                    getLeaveData={this.getLeaveData.bind(this)}
                    data={this.state.leaveData}
                />
            </div>
        )
    }
}


