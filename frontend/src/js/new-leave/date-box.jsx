import React from "react";

import InputBox from "../input-box";

export default class DateBox extends React.Component {
    constructor(props) {
        super(props);
        this.refList = props.refList;
        this.prefix = props.prefix;
        let date = new Date();
        let defaultData = props.defaultData || [];
        this.data = [
            ["西元", "year", defaultData[0] || date.getFullYear()],
            ["月", "month", defaultData[1] || date.getMonth() + 1],
            ["日", "date", defaultData[2] || date.getDate()],
            ["節次", "lesson", defaultData[3] || ""],
        ];
        this.onUnmount = props.onUnmount;
    }

    componentDidMount() {
        let find = false;
        this.refList.forEach((ref) => {
            if (find) {
                return;
            }
            if (ref.current.value === "") {
                ref.current.focus();
                find = true;
            }
        });
    }

    componentWillUnmount() {
        if (this.onUnmount) {
            this.onUnmount();
        }
    }

    render() {
        const check = this.props.check;
        const list = this.data.slice(0, 3).map((data, index) => {
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
        const options = this.props.lessonList.map((value, index)=>{
            return (
                <option key={index} value={index} >{value}</option>
            )
        });
        return (
            <div className="datetime-box">
                {list}
                <select
                    ref={this.refList[3]}
                    defaultValue={this.data[3][2]}
                >
                    {options}
                </select>
            </div>
        )
    }
}