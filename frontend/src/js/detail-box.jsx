import React from "react";

import { statusList } from "../variables";

import "../css/detail-box.css"

function show_reject_reason(status) {
    return statusList[status][1] === 2;
}

export default class DetailBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayImg: false
        };
        this.oldData = {};

        this.displayImg = this.displayImg.bind(this);
    }

    componentDidUpdate(props) {
        if (this.props.data === undefined) {
            return
        }
        const oldData = props.data || {};
        const newData = this.props.data || {};
        const newId = newData.id;
        if (oldData.id !== newId || (newId === undefined && this.state.displayImg)) {
            this.setState({
                displayImg: false
            });
        }
    }

    displayImg() {
        this.setState({
            displayImg: true
        });
    }

    render() {
        const name = this.props.name;
        const sid = this.props.sid;
        const userClass = this.props.userClass;
        const data = this.props.data || this.oldData;
        this.oldData = data;

        let startDate = data.start_date;
        if (startDate) {
            startDate = startDate.split("-");
            startDate = `${startDate[0]}年${startDate[1]}月${startDate[2]}日`;
        }
        let endDate = data.end_date;
        if (endDate) {
            endDate = endDate.split("-");
            endDate = `${endDate[0]}年${endDate[1]}月${endDate[2]}日`;
        }

        const imgList = Array.from(Array(data.files || 0).keys()).map((index) => {
            return <img key={index} src={`/api/leave/id/${data.id}/${index}`} alt="" />
        })

        const reject_reason = (
            <React.StrictMode>
                <div className="title">拒絕原因</div>
                <div className="reason">{data.reject_reason || "無"}</div>
            </React.StrictMode>
        )

        return (
            <div className={`detail ${this.props.data === undefined ? "empty" : ""}`}>
                <div className="icon">
                    <div className="ms">manage_search</div>
                    <div>未選擇任何資料</div>
                </div>
                <div className="context">
                    <div className="head">詳細資料</div>
                    <div className="title">個人資料</div>
                    <ul>
                        <li>
                            <p>姓名：{name}</p>
                        </li>
                        <li>
                            <p>學號：{sid}</p>
                        </li>
                        <li>
                            <p>班級：{userClass}</p>
                        </li>
                    </ul>
                    <div className="title">請假資料</div>
                    <ul>
                        <li>
                            <p>資料編號：{data.id}</p>
                        </li>
                        <li>
                            <p>請假時間：{(data.create_time || "").split(".", 1)[0]}</p>
                        </li>
                        <li>
                            <p>假別：{data.type}</p>
                        </li>
                        <li>
                            <p>開始時間：{startDate} {data.start_lesson}</p>
                        </li>
                        <li>
                            <p>結束時間：{endDate} {data.end_lesson}</p>
                        </li>
                    </ul>
                    <div className="title">請假事由</div>
                    <div className="reason">{data.remark || "無"}</div>
                    {show_reject_reason(data.status || 0) ? reject_reason : ""}
                    <div className="title">附件</div>
                    <div className="img-content">
                        {imgList.length === 0 ? "無" : this.state.displayImg ? imgList : (<button onClick={this.displayImg}>顯示附件</button>)}
                    </div>
                </div>
            </div>
        )
    }
}
