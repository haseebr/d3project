import * as d3 from 'd3';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as utils from '../d3-utils.js';
import * as u from '../../utils';


import $ from 'jquery';


export default class Chart extends React.Component {

  constructor(props) {
    super(props);

    var intervals = {
      'five': 300000,
      'ten': 600000,
      'thirty': 1800000,
      'sixty': 3600000
    };

    var lt = (new Date()).getTime();
    var gt = lt - intervals.sixty;

    this.state = {
      data: props.data,
      lt: lt,
      gt: gt
    };

    this.handleNewData = this.handleNewData.bind(this);
  }

  handleNewData(data) {


    this.setState((prevState, props) => {
      prevState.data.push(data);
      prevState.data.shift();
    });

    utils.renderChart(this.el, this.state);
  }

  componentDidMount() {

    var url = u.getHost();
    var socket = io.connect(url);
    var el = ReactDOM.findDOMNode(this);

    var exCur = this.props.exchange + ':' + this.props.currency;

    socket.on('data', this.handleNewData);
    socket.emit('exchange', exCur);

    // $.getJSON(url + '/data/'
    //   + this.lt + '-' + this.gt + '-coinbase:btcusd?callback=?')
    var urlString = `${url}/data/${this.state.lt}-${this.state.gt}-${exCur}?callback=?`;

    $.getJSON(urlString)
      .then((data) => {
        var oy = 0;
        var _data = [];
        data.map((set) => {
          if (oy != set[1]) {
            oy = set[1];
            _data.push(set);
          }
        });
        this.setState({
          data: _data
        });
        utils.renderChart(el, this.state);
      });
  }

  render() {
    return (<div className="Chart">
            </div>);

  }
}
