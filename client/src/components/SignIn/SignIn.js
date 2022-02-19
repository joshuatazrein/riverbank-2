import './SignIn.css';
import '../App/App.css';
import { useState } from 'react';
import Axios from 'axios';
import imgSource from '../../assets/media/logo.png';

// props has init function
export default function SignIn (props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [format, setFormat] = useState('login');

  const login = () => {
    if (format === 'create') {
      console.log('create', username, password);
      Axios.post('http://localhost:3001/createuser', {
        username: username,
        password: password,
      });
    } else if (format === 'login') {
      console.log('login');
    }
  }

  const confirm = () => {
    props.init();
  }

  return (
    <div className='signIn'>
      <img 
        src={imgSource}
        className='logo'
      ></img>
      <span className='title titleLarge'>
        <span className='r'>River</span>
        <span className='b'>Bank</span>
      </span>
      <p className='slogan'>go with the flow</p>
      <div className='radioButtons'>
        <button
          className={`radioButton ${format === 'login' ? 'selected' : ''}`}
          onClick={() => setFormat('login')}
        >login</button>
        <button
          className={`radioButton ${format === 'create' ? 'selected' : ''}`}
          onClick={() => setFormat('create')}
        >create account</button>
      </div>
      <input 
        className='signInput'
        placeholder='username'
        onChange={(ev) => {
          setUsername(ev.target.value);
        }}
      ></input>
      <input 
        type='password'
        className='signInput'
        placeholder='password'
        onChange={(ev) => {
          setPassword(ev.target.value);
        }}
      ></input>
      {format === 'create' &&
      <input 
      type='password'
      className='signInput'
      placeholder='password again'
      onChange={(ev) => {
        setPassword2(ev.target.value);
      }}
    ></input>}
      <button 
        className='loginButton'
        onClick={login}
      >enter</button>
    </div>
  )
}