import React from "react";
import { Container, Row, Col } from 'reactstrap';
import ReactDOMServer from 'react-dom/server';




class Markdown extends React.Component {
    download(){
        alert("hello");
        console.log("REACT DOM SERVER"+ReactDOMServer.renderToString(<Markdown />))
    }

    render() {
        return (
            <div
            id = "markdown"
            dangerouslySetInnerHTML = {{__html: this.props.mdHtml}}
            >
            </div>
        );
      }
}


export default Markdown;
