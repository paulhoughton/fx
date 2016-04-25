class FXComponent extends React.Component<{}, FXComponentState> {
  constructor(props) {
    super(props);
    this.state = {fxRates: []};
  }
  componentDidMount() {
    io().on("data", data => this.setState({ fxRates: data }));
  }
  render() {
    return (
      <table>
        <tbody>
          {this.state.fxRates.map((rate: FXRow) => (
            <FXRow key={rate.currencyPair} data={rate}></FXRow>))
          }
        </tbody>
      </table>);
  }
}

const Direction = ({val = 0}: DirectionValue) => val === -1 ?
  <td style={{ color: "red" }}>{"\u25bc"}</td> :
  <td style={{ color: "green" }}>{(val !== 0 ) && "\u25b2"}</td>;

class FXRow extends React.Component<FXRowData, FXRowState> {
  constructor(props: FXRowData) {
    super(props);
    this.state = { direction: 0 };
  }
  componentDidUpdate(prevProps: FXRowData, prevState) {
    if (prevState.direction !== this.state.direction) return;
    const prev = prevProps.data;
    const latest = this.props.data;

    const prevBid = +(prev.bidBig + prev.bidPips);
    const bid = +(latest.bidBig + latest.bidPips);

    if (prevBid > bid && this.state.direction !== -1)
      this.setState({ direction: -1 });
    else if (prevBid < bid && this.state.direction !== 1)
      this.setState({ direction: 1 });

  }

  render() {
    return (
      <tr>
        <td>{this.props.data.currencyPair}</td>
        <td>{this.props.data.offerBig}<sup>{this.props.data.offerPips}</sup></td>
        <Direction val={this.state.direction}></Direction>
      </tr>);
  }
}

ReactDOM.render(
  <FXComponent></FXComponent>,
  document.getElementById("root")
);