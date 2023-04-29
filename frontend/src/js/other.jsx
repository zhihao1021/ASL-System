import axios from "axios";
import React from "react";

import { setLoading, showMessage } from "../utils";

import "../css/other.css";

export default class Other extends React.Component {
    componentDidUpdate(props) {
        if (!props.display && this.props.display) {
            window.location.hash = "other";
        }
    }

    render() {
        const display = this.props.display;
        return (
            <div id="other" style={{"display": display ? "" : "none"}}>
                <SettingAnnouncement />
            </div>
        );
    }
}

class SettingAnnouncement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            context: ""
        };
        this.editBlock = React.createRef();

        this.getAnnouncement = this.getAnnouncement.bind(this);
        this.sendAnnouncement = this.sendAnnouncement.bind(this);
    }

    componentDidMount() {
        this.getAnnouncement();
    }

    getAnnouncement() {
        axios.get("/api/announce?raw=true")
        .then(
            (response) => {
                this.editBlock.current.textContent = response.data.data;
            }
        );
    }

    sendAnnouncement() {
        setLoading(true);
        let data = new FormData();
        data.append("context", this.editBlock.current.textContent)
        axios.put(
            `/api/announce`,
            data
        )
        .then(
            (response) => {
                this.setState({
                    context: response.data.data
                });
                showMessage("更改成功", "公告更改成功。", "success");
            }
        )
        .catch(
            () => {
                showMessage("更改失敗", "公告更改失敗。", "error");
            }
        )
        .finally(
            () => {
                setLoading(false);
            }
        );
    }

    render() {
        return (
            <div className="announcement block">
                <div className="title">變更公告</div>
                <hr />
                <div className="description">換行時請使用"Shift"+"Enter"</div>
                <div
                    ref={this.editBlock}
                    className="edit-block"
                    contentEditable
                />
                <div className="tool-bar">
                    <button onClick={this.getAnnouncement}>還原</button>
                    <button onClick={this.sendAnnouncement}>儲存</button>
                </div>
            </div>
        );
    }
}