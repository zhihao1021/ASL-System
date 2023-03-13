import React from 'react';
import './side-bar.css';

export default class SideBar extends React.Component {
    render() {
        const open = this.props.open;
        return (
            <div id="side-bar" className={open ? "open" : ""}>
                <SideTag color="#FF0000" ms="event_available" title="請假" />
                <SideTag color="#FF8000" ms="select_check_box" title="審核" />
                <SideTag color="#FFFF00" ms="search" title="查詢" />
                <SideTag color="#00FF00" ms="more_horiz" title="其他" />
                <SideTag color="#00FFFF" ms="settings" title="設定" />
                <SideTag color="#8000FF" ms="manage_accounts" title="管理" />
            </div>
        )
    }
}

class SideTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: props.color,
            ms: props.ms,
            title: props.title
        }
    }

    render() {
        return (
            <div
                className="side-tag"
                style={{ borderColor: this.state.color }}
            >
                <div className="tag">
                    <p>{this.state.title}</p>
                    <p className="ms">{this.state.ms}</p>
                </div>
            </div>
        )
    }
}