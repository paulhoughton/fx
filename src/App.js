import React, { Component } from 'react';
import io from 'socket.io-client';
import Row from './Row';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { fxRates: [] };
  }
  componentDidMount() {
    io("wss://fx.now.sh").on("data", data => this.setState({ fxRates: data }));
  }

  render() {
    return (
      <table>
        <tbody>
          {this.state.fxRates.map(rate => (
            <Row key={rate.currencyPair} data={rate}></Row>)
          )}
        </tbody>
      </table>);
  }
}

