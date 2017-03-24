import * as d3 from 'd3';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as utils from '../d3-utils.js';

import $ from 'jquery';

export default class Chart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      data: this.props.data
    };

    window.addEventListener("resize", this.setStateOnResize.bind(this));
    this.handleNewData = this.handleNewData.bind(this);
  }

  setStateOnResize() {
    this.setState({
      height: window.innerHeight - 50,
      width: window.innerWidth - 100
    });

    utils.renderChart(this.el, this.state);
  }

  handleNewData(data) {
    var d = this.state.data;
    d.push(data);
    this.setState({
      data: d
    });
    utils.renderChart(this.el, this.state);
  }

  componentDidMount() {
    var socket = io.connect("http://37.139.31.20:5000");
    socket.on('data', this.handleNewData);
    socket.emit('exchange', this.props.exchange);

    var el = ReactDOM.findDOMNode(this);
    utils.renderChart(el, this.state);
  }

  render() {
    console.log(this.props.exchange);
    return (<div className="Chart">
            </div>);

  }
}
