import React from "react";
import { Container, Row, Col } from 'reactstrap';
var showdown  = require('showdown')
var converter = new showdown.Converter();
// ES modules
import ReactDOMServer from 'react-dom/server';
import Markdown from './Markdown';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: "Type here...",
            mdHtml: "Your markdown text is shown here!",
            blobURL: "",
            fileName: "temp",
            htmlText: "<!doctype html>\n <html lang=\"en\">\n <head>\n <meta charset=\"utf-8\">\n <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">\n <title>React With Webpack</title>\n </head>\n <style>\n h1   {color: blue;}\np    {color: red;}\n</style>\n<body>\n"
        };
        this.handleChange = this.handleChange.bind(this);
        this.downloadMarkdown = this.downloadMarkdown.bind(this);
        this.downloadHTML = this.downloadHTML.bind(this);
        this.updateFileName = this.updateFileName.bind(this);

    }


    handleChange(event) {
        this.setState({inputText: event.target.value});
        this.convertToMarkdown();
        this.downloadMarkdown();
      }

    convertToMarkdown() {
        var text = this.state.inputText;
        var html = converter.makeHtml(text);
        this.setState({mdHtml:html});
    }

    downloadMarkdown(){
        var myblob = new Blob([this.state.inputText], {
            type: 'text/plain'
        });
        var blobURL = URL.createObjectURL(myblob);
        this.setState({blobURL:blobURL});
    }

    downloadHTML(){
        var pageHTML = document.documentElement.outerHTML;
        var tempElement = document.createElement('a');
        var htmlText = this.state.htmlText;
        var mdHtml = this.state.mdHtml;
        var endOfHTML = "\n</body>\n</html>"
        var finalMarkdown = mdHtml.concat(endOfHTML);
        var finalHTML = htmlText.concat(finalMarkdown);

        tempElement.href = 'data:text/plain,' + finalHTML;
        tempElement.target = '_blank';
        tempElement.download = this.state.fileName+'.html';
        tempElement.click();
    }

    updateFileName(event){
        this.setState({fileName:event.target.value});
    }


    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                    <a className="navbar-brand" href="/">
                    CS-554 Assignment 4 -- A Markdown Note Downloader
                    </a>
                </nav>
                <main role="main">
                    <form>
                    <div className="jumbotron">
                            <h1 className="display-4">Tonee's Markdown Note Downloader</h1>
                            <label>Download Name (temp as default): <input type="text" name="fileName" onChange={this.updateFileName} /></label>
                            <br></br>
                            Download as:
                            <a href={this.state.blobURL} download={this.state.fileName}> .md </a>
                            or
                            <button onClick={this.downloadHTML}> .html </button>
                    </div>
                    <Container id="bigContainer">
                        <Row id="row">
                            <Col>
                                <textarea
                                    id="plainTextArea"
                                    type = "text"
                                    value = {this.state.inputText}
                                    onChange={this.handleChange}
                                />
                            </Col>
                            <Col >
                                <Markdown
                                    mdHtml = {this.state.mdHtml}
                                />
                            </Col>
                        </Row>
                    </Container>
                    </form>
                </main>
            </div>
        );
    }
}
export default App;
