import axios from "axios";
import React from "react";

import "../css/other.css";

export default class Other extends React.Component {
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
        this.edit_block = React.createRef();
    }

    getAnnouncement() {
        axios.get("/api/announce?raw=true")
        .then(
            (response) => {
                this.setState({
                    context: response.data.data
                })
            }
        );
    }

    sendAnnouncement() {
        axios.put(
            "/api/announce?raw=true",
            {
                context: this.edit_block.current.textContent,
            }
        )
        .then(
            (response) => {
                this.setState({
                    context: response.data.data
                })
            }
        );
    }

    render() {
        return (
            <div className="announcement block">
                <div className="title">變更公告</div>
                <hr />
                <div
                    ref={this.edit_block}
                    className="edit-block"
                    contentEditable
                />
                <div className="tool-bar">
                    <button>還原</button>
                    <button>儲存</button>
                </div>
            </div>
        );
    }
}