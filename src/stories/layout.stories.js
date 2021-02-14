import React from 'react';
import Nav from '../components/Nav'; 
import Button from 'muicss/lib/react/button';
import {faDiscord} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default {
  title: 'Layout',
};


export const breadcrumbs = () => {
  return (
    <React.Fragment>
      <Nav profile={{username: 'IBoyota'}}/>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
           <li class="breadcrumb-item"><a href="#">Dashboard</a></li>
           <li class="breadcrumb-item active" aria-current="page">TheWalkingDead PVP RP</li>
        </ol>
      </nav>

      <Button className="m-0" color="accent" variant="raised">
        <FontAwesomeIcon style={{verticalAlign: 'middle'}} size="lg" className="mr-1" icon={faDiscord}/> Add to Discord
      </Button>
    </React.Fragment>
  );
};
