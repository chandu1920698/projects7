import { LightningElement } from 'lwc';
import {countryCodeList} from 'c/countryCodeList'
import currencyConverterAssets from '@salesforce/resourceUrl/currencyConverterAssets'
import currecncyConvertorAccessKey from '@salesforce/label/c.Currency_Convertor_Access_Key';
export default class CurrencyConverterApp extends LightningElement {
    accessKey = currecncyConvertorAccessKey;
  currencyImage = currencyConverterAssets +'/currencyConverterAssets/currency.svg'
  countryList = countryCodeList
  countryFrom = "USD"
  countryTo = "AUD"
  amount =''
  result
  error 

  connectedCallback() {
    console.log("currecncyConvertorAccessKey -> " + this.accessKey);
  }
  handleChange(event){
    const {name, value} = event.target
    console.log("name", name)
    console.log("value", value)
    console.log("currecncyConvertorAccessKey -> " + this.accessKey);
    this[name] = value
  }
  submitHandler(event){
    event.preventDefault()
    this.convert()
  }
  
  async convert(){
    const API_URL = `https://v6.exchangerate-api.com/v6/${this.accessKey}/pair/${this.countryFrom}/${this.countryTo}`;
    try{
        const data = await fetch(API_URL)
        const jsonData = await data.json()
        debugger;
        // this.result = (Number(this.amount) * jsonData.result).toFixed(2)
        this.result = (Number(this.amount) * jsonData.conversion_rate).toFixed(2)
        console.log(this.result)
      } catch(error){
        console.log(error)
        this.error="An error occurred. Please try again..."
      }
    }
}