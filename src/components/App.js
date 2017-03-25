import * as React from 'react';
import * as d3 from 'd3';

import Chart from '../components/Chart';

import $ from 'jquery';

export default class App extends React.Component {

  constructor() {
    super();

    var intervals = {
      'five': 300000,
      'ten': 600000,
      'thirty': 1800000,
      'sixty': 3600000
    };
    var time = (new Date()).getTime();
    this.gt = time - intervals.sixty;
    this.lt = time;

    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }


  componentDidMount() {
    var host = window.location.host;
    var url = "http://" + host;
    console.log(url);
    $.getJSON(url + '/data/'
      + this.lt + '-' + this.gt + '-coinbase:btcusd?callback=?')
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
      });
  }
  render() {
    var cur = (new Date()).getTime();
    if (this.state.data) {
      return <Chart exchange={ 'coinbase:btcusd' } data={ this.state.data } />;
    } else {
      return <div>Loading...</div>;
    }
  }
}
