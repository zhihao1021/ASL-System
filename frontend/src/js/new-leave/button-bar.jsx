import React from "react";

export default class ButtonBar extends React.Component {
    constructor(props) {
        super(props)
        this.now = props.now;
        this.lastClick = props.lastClick;
        this.nextClick = props.nextClick;
        this.setPage = props.setPage;
        this.onKeyDown = (event) => {
            if (event.key === "Enter" && this.props.display && event.target.contentEditable !== "true") {
                this.onNextClick();
            }
        };
        this.final = props.final;
    }

    componentDidMount() {
        document.addEventListener("keydown", this.onKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown);
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
                >{this.final ? "完成" : "下一頁"}</button>
            </div>
        )
    }
}
