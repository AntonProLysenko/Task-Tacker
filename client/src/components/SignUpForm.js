import React, { Component }  from 'react'

import {signUp} from '../utilities/user-service'

export default class SignUpForm extends Component {
  // state is always an object with a property for each "piece" of state
state = {
      name: '',
      email: '',
      password: '',
      confirm: '',
      error: ''
    };

    handleChange = (evt) => {
  this.setState({
    [evt.target.name]: evt.target.value,
    error: '',
  });
};

handleNewUser = async (evt) =>{
    evt.preventDefault();
    if (this.state.password !== this.state.confirm){
        this.setState({ error: "Passwords doesn't match" });
    }else{
      try {
        const formData = { ...this.state };
        delete formData.error;
        delete formData.confirm;

        const user = await signUp(formData);
        this.props.setUser(user);
        this.props.setButtonPressed(!this.props.buttonPressed);
      } catch (err) {
        this.setState({ error: err.message });
      }
    }
}

  

  render() {
  const disable=false
  //  = this.state.password !== this.state.confirm
  // if(disable)this.setState({ error: "Password doesn't match" });
  return (
    <div>
      <div className="authForm-container">
        <form className="authForm signUpForm" autoComplete="off" onSubmit={this.handleNewUser}>
          <h1 className="listTitile">Sign Up</h1>
          <label>Name</label>
          <input type="text" name="name" onChange={this.handleChange} required />
          <label>Email</label>
          <input type="email" name="email" onChange={this.handleChange} required />
          <label>Password</label>
          <input type="password" name="password"  onChange={this.handleChange} required />
          <label>Confirm</label>
          <input type="password" name="confirm"  onChange={this.handleChange} required />
          <button className="authBtn"type="submit" disabled={disable}>SIGN UP</button>
          <p className="error-message">&nbsp;{this.state.error}</p>
         <p>Already have an account? &nbsp;<span className="formChange" onClick={() => {this.props.setNewUser(false)}}>Sign In</span></p>
        </form>
      </div>
    </div>
  );
}
}