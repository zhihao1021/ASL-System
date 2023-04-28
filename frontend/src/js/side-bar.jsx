import React from "react";

import "../css/side-bar.css";

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.showPage = props.showPage;
        this.displayBlock = props.displayBlock;
    }

    render() {
        const open = this.props.open;
        return (
            <div id="side-bar" className={open ? "open" : ""}>
                {this.displayBlock[0] ?
                    <SideTag
                        ms="notifications"
                        title="公告"
                        onClick={() => { this.showPage(0); }}
                    /> : null
                }
                {this.displayBlock[1] ?
                    <SideTag
                        ms="event_available"
                        title="請假"
                        onClick={() => { this.showPage(3); }}
                    /> : null
                }
                {this.displayBlock[2] ?
                    <SideTag
                        ms="select_check_box"
                        title="審核"
                        onClick={() => { this.showPage(4); }}
                    /> : null
                }
                {this.displayBlock[3] ?
                    <SideTag
                        ms="search"
                        title="查詢"
                        onClick={() => { this.showPage(5); }}
                    /> : null
                }
                {this.displayBlock[4] ?
                    <SideTag
                        ms="more_horiz"
                        title="其他"
                        onClick={() => { this.showPage(6); }}
                    /> : null
                }
                {this.displayBlock[5] ?
                    <SideTag
                        ms="settings"
                        title="設定"
                        onClick={() => { this.showPage(7); }}
                    /> : null
                }
                {this.displayBlock[6] ?
                    <SideTag
                        ms="manage_accounts"
                        title="管理"
                        onClick={() => { this.showPage(8); }}
                    /> : null
                }
            </div>
        );
    }
}

class SideTag extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = props.onClick;
        this.ms = props.ms;
        this.title = props.title;
    }

    render() {
        return (
            <div
                className="side-tag"
                onClick={this.onClick}
            >
                <div className="tag">
                    <p>{this.title}</p>
                    <p className="ms">{this.ms}</p>
                </div>
            </div>
        );
    }
}