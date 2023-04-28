import axios from "axios";
import React from "react";

import NewLeave from "./new-leave/main";
import OldLeave from "./old-leave/main";

import TitleBar from "./title-bar";

import { setLoading } from "../utils";

import "../css/leave.css";

export default class Leave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: window.location.hash === "#old-leave" ? 1 : 0,
            leaveData: [],
            pageUpdated: 0
        };
        this.updateLock = false;

        this.getLeaveData = this.getLeaveData.bind(this);
        this.updateLeaveData = this.updateLeaveData.bind(this);

        window.addEventListener("hashchange", () => {
            const hash = window.location.hash;
            if (hash === "#new-leave" || hash === "#old-leave") {
                this.setState({
                    display: window.location.hash === "#old-leave" ? 1 : 0,
                });
            }
        });
    }

    componentDidMount() {
        this.getLeaveData();
    }

    componentDidUpdate() {
        if (this.props.display) {
            if (window.location.hash !== "#new-leave" && window.location.hash !== "#old-leave") {
                window.location.hash = this.state.display === 0 ? "new-leave" : "old-leave";
                this.getLeaveData();
            }
        }
    }

    setPage(i) {
        this.setState({
            display: i
        });
        window.location.hash = i === 0 ? "new-leave" : "old-leave";
    }

    getLeaveData() {
        setLoading(true);
        axios.get("/api/leave/sid/current").then(
            (response) => {
                const data = response.data.data;
                this.setState({
                    leaveData: data,
                    pageUpdated: data.length < 10 ? -1 : 1
                });
            }
        ).finally(
            () => {
                setLoading(false);
            }
        )
    }

    updateLeaveData() {
        if (this.state.pageUpdated === -1 || this.updateLock) {
            return;
        }
        this.updateLock = true;
        axios.get(`/api/leave/sid/current?page=${this.state.pageUpdated}`).then(
            (response) => {
                const data = response.data.data;
                this.setState((state) => {
                    return {
                        leaveData: state.leaveData.concat(data),
                        pageUpdated: data.length < 10 ? -1 : state.pageUpdated + 1
                    }
                });
            }
        ).finally(
            () => {
                this.updateLock = false;
            }
        );
    }

    render() {
        const display = this.props.display;
        return (
            <div id="leave" style={{ "display": display ? "" : "none" }}>
                <TitleBar title="請假">
                    <button onClick={this.setPage.bind(this, 0)}>
                        <p className="ms-o">library_add</p>
                        <p>新增請假</p>
                    </button>
                    <button onClick={this.setPage.bind(this, 1)}>
                        <p className="ms">search</p>
                        <p>查看資料</p>
                    </button>
                </TitleBar>
                <hr />
                <NewLeave
                    display={this.state.display === 0}
                    getLeaveData={this.getLeaveData}
                />
                <OldLeave
                    display={this.state.display === 1}
                    getLeaveData={this.getLeaveData}
                    updateLeaveData={this.updateLeaveData}
                    hasUpdate={this.state.pageUpdated !== -1}
                    data={this.state.leaveData}
                />
            </div>
        )
    }
}


