import axios from "axios";
import React from "react";

import TitleBar from "./title-bar";

import "../css/announcement.css";

export default class Announcement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            announcements: [],
        };
    }

    componentDidMount() {
        this.getAnnouncement();
    }

    componentDidUpdate(props) {
        if (!props.display && this.props.display) {
            window.location.hash = "announcement";
        }
    }

    getAnnouncement() {
        axios.get("/api/announce")
            .then(
                (response) => {
                    let announcements = response.data.data.map(
                        (string, index) => {
                            return (<li key={index}>{string}</li>)
                        }
                    );
                    this.setState({
                        announcements: announcements
                    });
                }
            );
    }

    render() {
        const display = this.props.display;
        return (
            <div id="announcement" style={{ "display": display ? "" : "none" }}>
                <TitleBar title="公告">
                    <button onClick={this.getAnnouncement.bind(this)}>
                        <p className="ms">refresh</p>
                        <p>重新整理</p>
                    </button>
                </TitleBar>
                <hr />
                <ul>
                    {this.state.announcements}
                </ul>
            </div>
        );
    }
}
