import React from "react";

import InputBox from "../input-box";

export default class DateBox extends React.Component {
    constructor(props) {
        super(props);
        this.refList = props.refList;
        this.prefix = props.prefix;
        let date = new Date();
        this.data = [
            ["西元", "year", date.getFullYear()],
            ["月", "month", date.getMonth()],
            ["日", "date", date.getDate()],
            ["節次", "lesson", ""],
        ];
    }

    render() {
        const check = this.props.check;
        const list = this.data.map((data, index) => {
            return (
                <InputBox
                    key={index}
                    cref={this.refList[index]}
                    title={data[0]}
                    necessary={true}
                    className={`${this.prefix}-${data[1]}`}
                    type="number"
                    check={check}
                    default={data[2]}
                />
            )
        })
        return (
            <div className="datetime-box">
                {list}
            </div>
        )
    }
}