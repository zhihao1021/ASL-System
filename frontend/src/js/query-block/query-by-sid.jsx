import React from "react";

import InputBox from "../input-box";

import "../../css/query-block/query-by-sid.css"

export default class QueryBySid extends React.Component {
    constructor(props) {
        super(props);
        this.getResult = props.getResult;
        this.inputRef = React.createRef();
        this.setSelect = props.setSelect;

        this.send = this.send.bind(this);
    }

    componentDidMount() {
        let element = this.inputRef.current;
        element.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.send();
            }
        })
    }

    send() {
        this.getResult(this.inputRef.current.value, this.reset.bind(this))
    }

    reset() {
        this.inputRef.current.value = "";
        this.setSelect(0);
    }

    render() {
        const selected = this.props.selected;
        return (
            <div className={`query-sid ${selected ? "selected" : ""}`}>
                <div className="title">
                    依學號查詢
                </div>
                <InputBox
                    cref={this.inputRef}
                    title="學號"
                    onChangeFunc={(event) => {
                        if (event.target.value === "") {
                            this.setSelect(0);
                        }
                        else {
                            this.setSelect(1);
                        }
                    }}
                />
                <button onClick={this.send}>
                    查詢
                </button>
            </div>
        )
    }
}
