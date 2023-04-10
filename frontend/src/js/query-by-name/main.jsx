import axios from "axios";
import React from "react";

import SelectOption from "./select-option";

import "../../css/query-by-name/main.css"

export default class QueryByName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 0,
            selected: -1,
            classData: [],
            userList: []
        };
        this.loading = props.loading;
        this.setSelect = props.setSelect;
    }

    componentDidMount() {
        this.getClass();
    }

    getClass() {
        this.loading(true);
        axios.get("/api/class").then(
            (response) => {
                const classData = response.data.data;
                this.setState({
                    classData: classData
                });
            }
        ).finally(()=>{
            this.loading(false);
        })
    }

    select(i) {
        this.setState({
            selected: i,
        });
        this.setSelect(2);
    }

    render() {
        const selected = this.props.selected;
        const classList = this.state.classData.map((data, index) => {
            return (
                <SelectOption
                    key={index}
                    id={index}
                    context={data.class_name}
                    select={this.select.bind(this)}
                    selected={index === this.state.selected}
                />
            )
        });
        return (
            <div className={`query-name ${selected ? "selected" : ""}`}>
                <div className="title">
                    依班級查詢
                </div>
                <div className={`select-page ${this.state.display === 0 ? "display" : ""}`}>
                    {classList}
                </div>
            </div>
        )
    }
}
