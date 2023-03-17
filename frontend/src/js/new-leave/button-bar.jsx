import React from "react";

export default class ButtonBar extends React.Component {
    constructor(props) {
        super(props)
        this.last = props.last;
        this.next = props.next;
        this.lastClick = props.lastClick;
        this.nextClick = props.nextClick;
        this.setPage = props.setPage;
    }

    onLastClick() {
        if (this.lastClick !== undefined) {
            if (this.lastClick()) {
                this.setPage(this.last);
            }
        }
        else {
            this.setPage(this.last);
        }
    }

    onNextClick() {
        if (this.nextClick !== undefined) {
            if (this.nextClick()) {
                this.setPage(this.next);
            }
        }
        else {
            this.setPage(this.next);
        }
    }

    render() {
        let list = [];
        let index = 0;
        if (this.last !== undefined) {
            list.push(
                <button
                    key={index++}
                    className="last"
                    onClick={this.onLastClick.bind(this)}
                >上一頁</button>
            );
        }
        list.push(<div key={index++} className="empty" />);
        if (this.next !== undefined) {
            list.push(
                <button
                    key={index++}
                    className="next"
                    onClick={this.onNextClick.bind(this)}
                >下一頁</button>
            );
        }

        return (
            <div className="button-bar">
                {list}
            </div>
        )
    }
}
