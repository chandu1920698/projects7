import { LightningElement } from 'lwc';

export default class BmiCalculatorLWC extends LightningElement {

    height = '';
    weight = '';
    bmiValue = '';
    result = '';

    handleInputChange(event) {
        ////console.log("event.target -> " + event.target);
        if(event.target) {
            if(event.target.name === "height") {
                this.height = Number(event.target.value);
            } else if(event.target.name === "weight") {
                this.weight = Number(event.target.value);
            }
        }
    }

    handleCalculate(event) {
        event.preventDefault();
        ////console.log("this.weight -> " + this.weight);
        ////console.log("this.height -> " + this.height);
        this.bmiValue = (this.weight/((this.height * this.height)/10000)).toFixed(2);

        if(this.bmiValue < 18.5) {
            this.result = "Underweight";
        } else if(this.bmiValue >= 18.5 && this.bmiValue < 24.9) {
            this.result = "Healthy";
        } else if(this.bmiValue >= 25 && this.bmiValue < 30) {
            this.result = "Over weight";
        } else {
            this.result = "Obese";
        }

        ////console.log("this.bmiValue -> " + this.bmiValue);
        ////console.log("this.result -> " + this.result);
    }

    handleRecalculate(){
        this.height = '';
        this.weight = '';
        this.bmiValue = '';
        this.result = '';
      }
}