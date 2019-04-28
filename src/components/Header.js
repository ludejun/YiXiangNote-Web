import React from 'react';
import { Link } from 'react-router-dom';
import configs from '../configs';
import ComplexComponent from '../containers/App/ComplexComponent';

class Header extends ComplexComponent {
  render() {
    return (
      <div>
        <img src={require('../assets/react.svg')} height="50" alt="react" />
        <h1>{configs.name}</h1>
        <h2>
          {this.props.user.name}
          {new Date().toTimeString()}
        </h2>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/note">note</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Header;
