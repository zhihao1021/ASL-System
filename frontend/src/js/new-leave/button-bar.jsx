import React from "react";

export default class ButtonBar extends React.Component {
    constructor(props) {
        super(props)
        this.now = props.now;
        this.lastClick = props.lastClick;
        this.nextClick = props.nextClick;
        this.setPage = props.setPage;
        this.onKeyDown = (event) => {
            if (event.key === "Enter" && event.target.contentEditable !== "true") {
                this.onNextClick();
            }
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.onKeyDown);
    }
    
    onLastClick() {
        if (this.lastClick !== undefined) {
            if (this.lastClick()) {
                this.setPage(this.now - 1);
            }
        }
        else {
            this.setPage(this.now - 1);
        }
    }
    
    onNextClick() {
        if (this.nextClick !== undefined) {
            if (this.nextClick()) {
                this.setPage(this.now + 1);
                document.removeEventListener("keydown", this.onKeyDown);
            }
        }
        else {
            this.setPage(this.now + 1);
            document.removeEventListener("keydown", this.onKeyDown);
        }
    }

    render() {
        return (
            <div className="button-bar">
                <button
                    className="last"
                    onClick={this.onLastClick.bind(this)}
                >上一頁</button>
                <div className="empty" />
                <button
                    className="next"
                    onClick={this.onNextClick.bind(this)}
                >下一頁</button>
            </div>
        )
    }
}
