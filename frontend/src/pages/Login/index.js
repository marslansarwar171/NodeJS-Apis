import React, { Component } from "react";
import axios from "axios";
import { apiUrl } from "../../constant/urls";
import { setLocalStoreage } from "../../constant/sessions";
class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      error: "",
    };

    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  dismissError() {
    this.setState({ error: "" });
  }

  handleSubmit = async (evt) => {
    evt.preventDefault();

    if (!this.state.username) {
      return this.setState({ error: "Username is required" });
    }

    if (!this.state.password) {
      return this.setState({ error: "Password is required" });
    }
    const url = apiUrl + "/user/login";
    const responce = await axios.post(url, {
      email: this.state.username,
      password: this.state.password,
    });
    if (responce && responce.data.token) {
      setLocalStoreage(responce.data.token);
      this.props.history.push('/home');
    }

    return this.setState({ error: "" });
  };

  handleUserChange(evt) {
    this.setState({
      username: evt.target.value,
    });
  }

  handlePassChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }

  render() {
    // NOTE: I use data-attributes for easier E2E testing
    // but you don't need to target those (any css-selector will work)

    return (
      <div style={{ marginTop: "300px" }}>
        <form onSubmit={this.handleSubmit}>
          {this.state.error && (
            <h3 data-test="error" onClick={this.dismissError}>
              <button onClick={this.dismissError}>✖</button>
              {this.state.error}
            </h3>
          )}
          <label>User Name</label>
          <input
            type="text"
            data-test="username"
            value={this.state.username}
            onChange={this.handleUserChange}
          />
          <br />
          <label>Password</label>
          <input
            type="password"
            data-test="password"
            value={this.state.password}
            onChange={this.handlePassChange}
          />

          <input type="submit" value="Log In" data-test="submit" />
        </form>
      </div>
    );
  }
}

export default LoginPage;
