import React from 'react';
import './style.css';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            value0: "",
            value1: "",
            error: "",
            calculated: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.calculate = this.calculate.bind(this);
        this.reset = this.reset.bind(this);
    }

    calculate() {
        let error = false
        if (this.state.value0==="" && this.state.value1==="") {
            error = "both of the inputs are empty!"
        } else if (this.state.value0==="" || this.state.value1==="") {
            error = "one of the inputs is empty!"
        } else if (this.state.value0.toLowerCase()===this.state.value1.toLowerCase()) {
            error = "the inputs are the same!"
        }

        if (error) {
            this.setState({error: error})
        } else {
            let smallValue0 = this.state.value0.toLowerCase()
            let smallValue1 = this.state.value1.toLowerCase()

            //figure out which comes first alphabetically
            let valueAstart = null
            let valueBstart = null
            let maxLength = smallValue0.length
            if (smallValue1.length < smallValue0.length) maxLength = smallValue1.length
            for (let i=0; i<maxLength; i++) {
                if (smallValue0.charCodeAt(i) < smallValue1.charCodeAt(i)) {
                    valueAstart = smallValue0
                    valueBstart = smallValue1
                    break
                } else if (smallValue0.charCodeAt(i) > smallValue1.charCodeAt(i)) {
                    valueAstart = smallValue1
                    valueBstart = smallValue0
                    break
                }
            }
            if (!valueAstart) {
                if (smallValue0.length < smallValue1.length) {
                    valueAstart = smallValue0
                    valueBstart = smallValue1
                } else if (smallValue0.length > smallValue1.length) {
                    valueAstart = smallValue1
                    valueBstart = smallValue0
                }
            }

            function deleteAtIndex(string, index) {
                return (string.slice(0, index) + string.slice(index + 1, string.length))
            }

            let largerLength = valueAstart.length
            if (valueBstart.length > largerLength) largerLength = valueBstart.length

            let indexA = 0
            let indexB = 0
            let result = 0
            let valueA = valueAstart
            let valueB = valueBstart
            for (let i=0; i<largerLength; i++) {
                result = (result + (valueA.charCodeAt(indexA)%2 + valueB.charCodeAt(indexB)%2))%2
                if (valueA.length > 1) valueA = deleteAtIndex(valueA, indexA)
                if (valueB.length > 1) valueB = deleteAtIndex(valueB, indexB)
                indexA = (valueB.charCodeAt(indexB)-96) % valueA.length
                indexB = (valueA.charCodeAt(indexA)-96) % valueB.length
                console.log(result, valueA, valueB)
            }
            if (smallValue0!==valueAstart) result = (result + 1)%2 //so results stay the same if you switch values
            result = result.toString()
            this.setState({calculated: result})
        }
    }

    reset() {
        this.setState(
            {
                value0: "",
                value1: "",
                error: "",
                calculated: false
            }
        )
    }

    handleInputChange(e) {
        let property = e.target.name
        let value = e.target.value
        let theAlphabet = "abcdefghijklmnopqrstuvwxyz"
        let smallValue = value.toLowerCase()

        let valueArray = smallValue.split("")
        let valueIsGood = true
        for (let char of valueArray) {
            if (!theAlphabet.includes(char)) {
                valueIsGood = false
                break
            }
        }
        if (valueIsGood) this.setState({[property]: value, error: ""})
    }

    render() {
        if (!this.state.calculated) {
            return (
                <div id="main">
                    <h2>Rock, Paper, Scissors, Infinity</h2>
                    <div id="values">
                        <input
                            type="text" onChange={this.handleInputChange} maxLength="16" name="value0"
                            value={this.state.value0} className="value"
                        />
                        <label>vs</label>
                        <input
                            type="text" onChange={this.handleInputChange} maxLength="16" name="value1"
                            value={this.state.value1} className="value"
                        />
                    </div>
                    <label id="error" style={{color: "red"}}><strong>{this.state.error}</strong></label>
                    <button onClick={this.calculate}>calculate</button>
                </div>
            )
        } else {
            let value0Style = {}
            let value1Style = {}
            let resultMessage
            if (this.state.calculated==="0") {
                value0Style = {border: "2px solid red"}
                resultMessage = `${this.state.value0} beats ${this.state.value1}`
            } else if (this.state.calculated==="1") {
                value1Style = {border: "2px solid red"}
                resultMessage = `${this.state.value1} beats ${this.state.value0}`
            }
            return (
                <div id="main">
                    <h2>Rock, Paper, Scissors, Infinity</h2>
                    <div id="values">
                        <div className="value" style={value0Style}>
                            <label>{this.state.value0}</label>
                        </div>
                        <div className="value" style={value1Style}>
                            <label>{this.state.value1}</label>
                        </div>
                    </div>
                    <label id="result">{resultMessage}</label>
                    <button onClick={this.reset}>try again</button>
                </div>
            )
        }
    }
}

export default App;