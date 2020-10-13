import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import {useProfile} from './hooks';
import Nav from './components/Nav'; 

function Index() {
  const usingProfile = useProfile();

  return (
    <React.StrictMode>
      <Nav {...usingProfile}/>
    </React.StrictMode>
  );
};

ReactDOM.render(<Index/>, document.getElementById('root'));
