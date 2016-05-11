class FXComponent extends React.Component<{}, FXComponentState> {
  constructor(props) {
    super(props);
    this.state = { fxRates: [] };
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
  <td style={{ color: "green" }}>{(val !== 0) && "\u25b2"}</td>;

class FXRow extends React.Component<FXRowData, FXRowState> {
  constructor(props: FXRowData) {
    super(props);
    this.state = { direction: 0, changed: false };
  }
  componentWillReceiveProps(nextProps: FXRowData) {
    const { bidBig: prevBidBig, bidPips: prevBidPips } = this.props.data;
    const { bidBig, bidPips } = nextProps.data;

    const diff = (bidBig + bidPips) - (prevBidBig + prevBidPips);

    this.setState({ changed: !!diff })
    if (diff) this.setState({ direction: diff < 0 ? -1 : 1 });
  }

  render() {
    return (
      <tr>
        <td>{this.props.data.currencyPair}</td>
        <td className={"changed-" + this.state.changed}>{this.props.data.bidBig}<sup>{this.props.data.bidPips}</sup></td>
        <Direction val={this.state.direction}></Direction>
      </tr>);
  }
}

ReactDOM.render(
  <FXComponent></FXComponent>,
  document.getElementById("root")
);