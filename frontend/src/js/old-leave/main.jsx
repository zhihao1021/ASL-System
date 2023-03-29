import axios from "axios";
import React from "react";

import ResultBox from "./result-box";

import "../../css/old-leave/main.css"


export default class OldLeave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }
    
    componentDidMount() {
        this.getData();
    }

    getData() {
        axios.get("http://localhost:8080/api/leave/").then(
            (response)=>{
                this.setState({
                    data: response.data.data
                });
            }
        )
    }

    render() {
        const display = this.props.display;
        const typeOptions = this.props.typeOptions;
        const lessonOptions = this.props.lessonOptions;
        const list = this.state.data.map((data, index)=>{
            return (
                <ResultBox
                    key={index}
                    createTime={data.create_time}
                    startDate={data.start_date}
                    endDate={data.end_date}
                    startLesson={lessonOptions[data.start_lesson]}
                    endLesson={lessonOptions[data.end_lesson]}
                    remark={data.remark}
                    type={typeOptions[data.type]}
                    status={data.status}
                />
            );
        })
        return (
            <div className="old-leave" style={{ "display": display ? "" : "none" }}>
                {list}
            </div>
        );
    }
}
