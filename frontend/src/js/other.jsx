import axios from "axios";
import React from "react";

import "../css/other.css";

export default class Other extends React.Component {
    constructor(props) {
        super(props);
        this.showMessage = props.showMessage;
        this.loading = props.loading;
    }

    render() {
        const display = this.props.display;
        return (
            <div id="other" style={{"display": display ? "" : "none"}}>
                <SettingAnnouncement
                    showMessage={this.showMessage}
                    loading={this.loading}
                />
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
        this.showMessage = props.showMessage;
        this.loading = props.loading;
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
        this.loading(true);
        axios.put(
            `/api/announce?context=${this.editBlock.current.textContent}`,
        )
        .then(
            (response) => {
                this.setState({
                    context: response.data.data
                });
                this.showMessage("更改成功", "公告更改成功。", "info");
            }
        )
        .catch(
            () => {
                this.showMessage("更改失敗", "公告更改失敗。", "error");
            }
        )
        .finally(
            () => {
                this.loading(false);
            }
        );
    }

    render() {
        return (
            <div className="announcement block">
                <div className="title">變更公告</div>
                <hr />
                <div
                    ref={this.editBlock}
                    className="edit-block"
                    contentEditable
                />
                <div className="tool-bar">
                    <button onClick={this.getAnnouncement.bind(this)}>還原</button>
                    <button onClick={this.sendAnnouncement.bind(this)}>儲存</button>
                </div>
            </div>
        );
    }
}