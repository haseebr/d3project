import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as utils from '../d3-utils.js';

import $ from 'jquery';

export default class LastUpdated extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      seconds: (new Date()).getTime()
    };
  }

  componentDidMount() {
    var t = this.props.seconds;
    console.log(this.props.seconds);
    var diff = ((new Date()).getTime() - t) / 1000;

    this.setState({
      seconds: diff
    });
  }
  render() {

    return (
      <div>Last updated
        { this.state.seconds } ago </div>
      );
  }
}
