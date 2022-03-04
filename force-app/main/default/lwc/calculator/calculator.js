import { LightningElement, track } from "lwc";

export default class Calculator extends LightningElement {
	@track calculator = {
		displayValue: '0',
		firstOperand: null,
		waitingForSecondOperand: false,
		operator: null,
	};

	get displayString() {
		return this.calculator.displayValue;
	}

	inputDigit(digit) {
		const { displayValue, waitingForSecondOperand } = this.calculator;

		if (waitingForSecondOperand === true) {
			this.calculator.displayValue = digit;
			this.calculator.waitingForSecondOperand = false;
		} else {
			this.calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
		}
	}

	inputDecimal(dot) {
		if (this.calculator.waitingForSecondOperand === true) {
			this.calculator.displayValue = "0."
			this.calculator.waitingForSecondOperand = false;
			return
		}

		if (!this.calculator.displayValue.includes(dot)) {
			this.calculator.displayValue += dot;
		}
	}

	handleOperator(nextOperator) {
		const { firstOperand, displayValue, operator } = this.calculator;
		const inputValue = parseFloat(displayValue);

		if (operator && this.calculator.waitingForSecondOperand) {
			this.calculator.operator = nextOperator;
			return;
		}


		if (firstOperand == null && !isNaN(inputValue)) {
			this.calculator.firstOperand = inputValue;
		} else if (operator) {
			const result = this.calculate(firstOperand, inputValue, operator);

			this.calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
			this.calculator.firstOperand = result;
		}

		this.calculator.waitingForSecondOperand = true;
		this.calculator.operator = nextOperator;
	}

	calculate(firstOperand, secondOperand, operator) {
		if (operator === '+') {
			return firstOperand + secondOperand;
		} else if (operator === '-') {
			return firstOperand - secondOperand;
		} else if (operator === '*') {
			return firstOperand * secondOperand;
		} else if (operator === '/') {
			return firstOperand / secondOperand;
		}

		return secondOperand;
	}

	resetCalculator() {
		this.calculator.displayValue = '0';
		this.calculator.firstOperand = null;
		this.calculator.waitingForSecondOperand = false;
		this.calculator.operator = null;
	}


	handleClick(event) {

		const { target } = event;
		const { value } = target;

		if (!target.matches('button')) {
			return;
		}

		switch (value) {
			case '+':
			case '-':
			case '*':
			case '/':
			case '=':
				this.handleOperator(value);
				break;
			case '.':
				this.inputDecimal(value);
				break;
			case 'all-clear':
				this.resetCalculator();
				break;
			default:

				if (Number.isInteger(parseFloat(value))) {
					this.inputDigit(value);
				}
		}
	}

}