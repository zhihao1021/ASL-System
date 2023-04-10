import React from "react";

import InputBox from "../input-box";

import "../../css/query-by-sid/main.css"

export default class QueryBySid extends React.Component {
    constructor(props) {
        super(props);
        this.loading = props.loading;
        this.inputRef = React.createRef();
        this.setSelect = props.setSelect;
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
                <button>
                    查詢
                </button>
            </div>
        )
    }
}
