import "../css/title-bar.css";

export default function TitleBar(props) {
    const title = props.title;
    const children = props.children;
    return (
        <div className="title-bar">
            <p>{title}</p>
            {children}
        </div>
    )
}
