//variables to generalize regexp for if else cases
const isOperator = /[x/+-]/,
endsWithOperator = /[x/+-]$/,
haveDotSignal = /\./g,
endsWithNegativeSignal = /\d[x/+-]{1}-$/;

// the main component that have all the others components
// the states are all here
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formula: '', // to change formula display
      currentOutput: '0', // to change input/output display
      PrevVal: '0', // to save answers and previous formula expressions
      evaluated: false // changes the if else cases after evaluate button
    };
    // to handle the events originated by the buttons
    this.handleInitialize = this.handleInitialize.bind(this);
    this.handleNumber = this.handleNumber.bind(this);
    this.handleOperate = this.handleOperate.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
  }

  // handle the AC button. Clear all the states.
  handleInitialize() {
    this.setState({
      formula: '',
      currentOutput: '0',
      prevVal: '',
      evaluated: false });

  }

  // handle input numbers. 
  handleNumber(e) {
    const numberClicked = e.target.value;
    const { evaluated, formula, currentOutput } = this.state;
    if (evaluated) {// after "=" button
      this.setState({
        currentOutput: numberClicked,
        formula: numberClicked !== "0" ? numberClicked : '',
        evaluated: false });

    } else {
      this.setState({
        currentOutput: currentOutput === '0' || isOperator.test(currentOutput) ?
        numberClicked // after "0" or [+-/x] is the number clicked
        : currentOutput + numberClicked, // after a number 
        formula: currentOutput === '0' && numberClicked === '0' ?
        formula === '' // initialize or after "0"
        ? numberClicked :
        formula :
        /([^.0-9]0|^0)$/.test(formula) //after "0" changing to number clicked only and exclude the "0"
        ? formula.slice(0, -1) + numberClicked :
        formula + numberClicked });

    }
  }

  // to handle the input of operators
  handleOperate(e) {
    const operatorCliked = e.target.value;
    const { evaluated, formula, currentOutput, prevVal } = this.state;
    this.setState({ currentOutput: operatorCliked });
    if (evaluated) {// after "=" button
      this.setState({
        formula: prevVal + operatorCliked,
        evaluated: false });

    } else if (!endsWithOperator.test(formula)) {//case formula doesnt end with an operator
      this.setState({
        prevVal: formula,
        formula: formula + operatorCliked });

    } else if (!endsWithNegativeSignal.test(formula)) {//case formula doesnt end with a negative signal
      this.setState({
        formula: operatorCliked === '-' ?
        formula + operatorCliked :
        prevVal + operatorCliked });

    } else {// in other cases - like formula ends with an "-"
      if (operatorCliked !== '-') {// in case that the operator clicked is not an "-" but is after an "-"
        this.setState({
          formula: prevVal + operatorCliked });

      }
    }
  }

  // to handle the evaluate
  handleResult() {
    const expression = this.state.formula.
    replace(/x/g, '*').
    replace('--', '+0+0+0+'); // managing the string operators
    const answer = Math.round(10000000000 * eval(expression)) / 10000000000; // evaluate the expression on the string and turning to a number result
    this.setState({ // remember to change to a string again
      currentOutput: answer.toString(),
      formula: expression.
      replace(/\*/g, 'x').
      replace('+0+0+0+', '--') // case "--" is allowed and transforming to "+" 
      + "=" + answer,
      prevVal: answer, // saving the answer to the state
      evaluated: true // this states only changes here
    });
  }

  // to handle the input of a decimal
  handleDecimal(e) {
    const decimal = e.target.value;
    const { formula, currentOutput, evaluated } = this.state;
    if (evaluated) {
      this.setState({
        currentOutput: '0' + decimal,
        formula: '0' + decimal,
        evaluated: false });

    } else if (endsWithOperator.test(formula)) {// turning to "0." in case of formula ends with an operator
      this.setState({
        currentOutput: '0' + decimal,
        formula: formula + '0' + decimal });

    } else if (haveDotSignal.test(currentOutput)) {// only allowing one dot signal
      this.setState({
        currentOutput: currentOutput,
        formula: formula });

    } else {// to all other cases - inserting a "." after current formula 
      this.setState({
        currentOutput: currentOutput + decimal,
        formula: formula === '' ?
        '0' + decimal :
        formula + decimal });

    }
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "calculator" }, /*#__PURE__*/
      React.createElement(FormulaScreen, { formula: this.state.formula }), /*#__PURE__*/
      React.createElement(OutputScreen, { output: this.state.currentOutput }), /*#__PURE__*/
      React.createElement(Buttons, {
        initialize: this.handleInitialize,
        operate: this.handleOperate,
        number: this.handleNumber,
        result: this.handleResult,
        decimal: this.handleDecimal })));


  }}


// component of the formula, child of App
class FormulaScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "formula" },
      this.props.formula));


  }}


// component of the input/output display, child of App
class OutputScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "display" },
      this.props.output));


  }}


// component of the buttons, child of App
class Buttons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "buttons-structure" }, /*#__PURE__*/
      React.createElement("button", {
        id: "clear",
        value: "AC",
        onClick: this.props.initialize }, "AC"), /*#__PURE__*/


      React.createElement("button", {
        id: "divide",
        value: "/",
        onClick: this.props.operate }, "/"), /*#__PURE__*/


      React.createElement("button", {
        id: "multiply",
        value: "x",
        onClick: this.props.operate }, "x"), /*#__PURE__*/


      React.createElement("button", {
        id: "seven",
        value: "7",
        onClick: this.props.number }, "7"), /*#__PURE__*/


      React.createElement("button", {
        id: "eight",
        value: "8",
        onClick: this.props.number }, "8"), /*#__PURE__*/


      React.createElement("button", {
        id: "nine",
        value: "9",
        onClick: this.props.number }, "9"), /*#__PURE__*/


      React.createElement("button", {
        id: "subtract",
        value: "-",
        onClick: this.props.operate }, "-"), /*#__PURE__*/


      React.createElement("button", {
        id: "four",
        value: "4",
        onClick: this.props.number }, "4"), /*#__PURE__*/


      React.createElement("button", {
        id: "five",
        value: "5",
        onClick: this.props.number }, "5"), /*#__PURE__*/


      React.createElement("button", {
        id: "six",
        value: "6",
        onClick: this.props.number }, "6"), /*#__PURE__*/


      React.createElement("button", {
        id: "add",
        value: "+",
        onClick: this.props.operate }, "+"), /*#__PURE__*/



      React.createElement("button", {
        id: "one",
        value: "1",
        onClick: this.props.number }, "1"), /*#__PURE__*/


      React.createElement("button", {
        id: "two",
        value: "2",
        onClick: this.props.number }, "2"), /*#__PURE__*/


      React.createElement("button", {
        id: "three",
        value: "3",
        onClick: this.props.number }, "3"), /*#__PURE__*/


      React.createElement("button", {
        id: "equals",
        value: "=",
        onClick: this.props.result }, "="), /*#__PURE__*/


      React.createElement("button", {
        id: "zero",
        value: "0",
        onClick: this.props.number }, "0"), /*#__PURE__*/


      React.createElement("button", {
        id: "decimal",
        value: ".",
        onClick: this.props.decimal }, ".")));




  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("root"));