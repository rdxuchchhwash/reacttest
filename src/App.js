import React, { Component } from "react";
import { Form ,Alert} from 'react-bootstrap';
import './App.css';
import axios from 'axios';
import { isValidSwedishPIN } from './components/isValidSwedishPIN'

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
const phoneRegex = RegExp(
  /^([+]46)\s*(7[0236])\s*(\d{4})\s*(\d{3})$/
);

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === "" && (valid = false);
  });

  return valid;
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ssn: "",
      phoneno: "",
      email: "",
      country: "",
      formErrors: {
        ssn: "",
        phoneno: "",
        email: "",
        country: "",
      },
      countries: [],
    };
  }

  handleSubmit = e => {
    e.preventDefault();

    if (formValid(this.state)) {
      console.log(`
        Form Submitted Successfully
        SSN: ${this.state.ssn}
        Phone No: ${this.state.phoneno}
        Email: ${this.state.email}
        Country: ${this.state.country}
      `);
      localStorage.removeItem("ssn")
      localStorage.removeItem("phoneno")
      localStorage.removeItem("email")
      localStorage.removeItem("country")
      alert("Submit Successful")
      // window.location.reload();
    } else {
      alert("Form Invalid! Fillup Data Correctly")
      console.error("Form Invalid! Fillup Data Correctly");
    }
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "ssn":
        formErrors.ssn =
          (value.length < 10 ? "10 Characters Required" : "" )||
          (value.length === 10 && !isValidSwedishPIN(value)) ? "Wrong SSN" : "" ||
          (value.length > 10 ? "SSN Must Be 10 Digit No" : "")
        // console.log(isValidSwedishPIN("6408233234"));
        break;
      case "phoneno":
        formErrors.phoneno = phoneRegex.test(value)
          ? ""
          : "Invalid Swedish Phone Number";
        //+46765195285
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address";
        break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value }, () => console.log(this.state));

  };

  componentDidMount() {
    //Checking Local Storage Value For Form 
    let data ={
      ssn: localStorage.getItem('ssn'),
      phoneno: localStorage.getItem('phoneno'),
      email: localStorage.getItem('email'),
      country: localStorage.getItem('country')
    }
    if (data != null) {
      this.setState({
        ssn: data.ssn != null ? data.ssn : "",
        phoneno: data.phoneno != null ? data.phoneno : "",
        email: data.email != null ? data.email : "",
        country: data.country != null ? data.country : "Sweden",
      })
    }

    //Checking Local Storage For Country List Data for Caching
    if (localStorage.getItem('countryList') === null) {
      axios.get(`https://restcountries.eu/rest/v2/all`).then(res => {
        this.setState({ countries: res.data });
        localStorage.setItem('countryList', JSON.stringify(this.state.countries));
      });
    }
    else {
      this.setState({
        countries: JSON.parse(localStorage.getItem('countryList'))
      })
    }

  }
  
  funcSsn = e => {
    this.handleChange(e)
    this.onChange = this.setState({ ssn: e.target.value })
    localStorage.setItem('ssn', e.target.value);
  }
  funcPhoneno = e => {
    this.handleChange(e)
    this.onChange = this.setState({ phoneno: e.target.value })
    localStorage.setItem('phoneno', e.target.value);
  }
  funcEmail = e => {
    this.handleChange(e)
    this.onChange = this.setState({ email: e.target.value })
    localStorage.setItem('email', e.target.value);
  }
  funcCountry = e => {
    this.handleChange(e)
    this.onChange = this.setState({ country: e.target.value })
    localStorage.setItem('country', e.target.value);
  }

  render() {
    const countryList = this.state.countries.map(function (country, index) {
      return (
        <option value={country.name} key={index}>{country.name}</option>
      )
    })

    const { formErrors } = this.state;


    return (
      <div className="wrapper">
        <div className="form-wrapper">
          <h1>SSN Check</h1>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="ssn">
              <label htmlFor="ssn">Social Security Number</label>
              <input
                className={formErrors.ssn.length > 0 ? "error" : null}
                placeholder="xxxxxxxxxx"
                type="text"
                name="ssn"
                value={this.state.ssn}
                noValidate
                onChange={this.funcSsn}
              />
              {formErrors.ssn.length > 0 && (
                <span className="errorMessage">{formErrors.ssn}</span>
              )}
            </div>
            <div className="phoneno">
              <label htmlFor="phoneno">Phone No</label>
              <input
                className={formErrors.phoneno.length > 0 ? "error" : null}
                placeholder="+46 XXXXXXXXXX"
                type="text"
                name="phoneno"
                value={this.state.phoneno}
                noValidate
                onChange={this.funcPhoneno}
              />
              {formErrors.phoneno.length > 0 && (
                <span className="errorMessage">{formErrors.phoneno}</span>
              )}
            </div>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                className={formErrors.email.length > 0 ? "error" : null}
                placeholder="Email"
                type="email"
                name="email"
                value={this.state.email}
                noValidate
                onChange={this.funcEmail}
              />
              {formErrors.email.length > 0 && (
                <span className="errorMessage">{formErrors.email}</span>
              )}
            </div>
            <label htmlFor="country">Country</label>
            <div className="country" >
              <Form.Control as="select" value={this.state.country} onChange={this.funcCountry}>
                {countryList}
              </Form.Control>
            </div>

            <div className="btnSubmit">
              <button type="submit" >Submit</button>
            </div>

          </form>
          
        </div>
      </div>
    );
  }
}

export default App;