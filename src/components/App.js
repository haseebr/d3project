import * as React from 'react';
import * as d3 from 'd3';
import * as u from '../../utils';

import Chart from '../components/Chart';

import $ from 'jquery';

export default class App extends React.Component {

  constructor() {
    super();
  }


  componentDidMount() {
    // var host = window.location.host;
    // var url = "http://" + host;
    // $.getJSON(u.getHost() + '/data/'
    //   + this.lt + '-' + this.gt + '-coinbase:btcusd?callback=?')
    //   .then((data) => {
    //     var oy = 0;
    //     var _data = [];
    //     data.map((set) => {
    //       if (oy != set[1]) {
    //         oy = set[1];
    //         _data.push(set);
    //       }
    //     });
    //     this.setState({
    //       data: _data
    //     });
    //   });
  }
  render() {
    var cur = (new Date()).getTime();
    return <Chart exchange={ 'coinbase' } currency={ 'btcusd' } />;
  }
}
