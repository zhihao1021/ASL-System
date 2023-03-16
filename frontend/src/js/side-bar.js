import React from "react";

import "../css/side-bar.css";

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPage: props.showPage,
        };
    }

    render() {
        const open = this.props.open;
        return (
            <div id="side-bar" className={open ? "open" : ""}>
                <SideTag
                    color="#FF0000"
                    ms="notifications"
                    title="公告"
                    onClick={() => {this.state.showPage(0);}}
                />
                <SideTag
                    color="#FF8800"
                    ms="event_available"
                    title="請假"
                    onClick={() => {this.state.showPage(3);}}
                />
                <SideTag
                    color="#FFFF00"
                    ms="select_check_box"
                    title="審核"
                    onClick={() => {this.state.showPage(4);}}
                />
                <SideTag
                    color="#00FF00"
                    ms="search"
                    title="查詢"
                    onClick={() => {this.state.showPage(5);}}
                />
                <SideTag
                    color="#00FFFF"
                    ms="more_horiz"
                    title="其他"
                    onClick={() => {this.state.showPage(6);}}
                />
                <SideTag
                    color="#0066FF"
                    ms="settings"
                    title="設定"
                    onClick={() => {this.state.showPage(7);}}
                />
                <SideTag
                    color="#8800FF"
                    ms="manage_accounts"
                    title="管理"
                    onClick={() => {this.state.showPage(8);}}
                />
            </div>
        );
    }
}

class SideTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onClick: props.onClick,
            color: props.color,
            ms: props.ms,
            title: props.title
        };
    }

    render() {
        return (
            <div
                className="side-tag"
                style={{ borderColor: this.state.color }}
                onClick={this.state.onClick}
            >
                <div className="tag">
                    <p>{this.state.title}</p>
                    <p className="ms">{this.state.ms}</p>
                </div>
            </div>
        );
    }
}