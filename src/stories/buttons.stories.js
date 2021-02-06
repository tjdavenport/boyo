import React from 'react';
import Button from 'muicss/lib/react/button';
import {faDiscord} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default {
  title: 'Buttons',
  component: Button
};


export const accentRaisedLarge = () => {
  return (
    <Button className="m-0" color="accent" variant="raised">
      <FontAwesomeIcon style={{verticalAlign: 'middle'}} size="lg" className="mr-1" icon={faDiscord}/> Add to Discord
    </Button>
  );
};

export const accentLarge = () => {
  return (
    <Button className="m-0" color="accent">
      <FontAwesomeIcon style={{verticalAlign: 'middle'}} size="lg" className="mr-1" icon={faDiscord}/> Add to Discord
    </Button>
  );
};

export const primary = () => {
  return (
    <Button color="primary">Learn More</Button>
  );
};

export const primaryFlat = () => {
  return (
    <Button color="primary" variant="flat">Learn More</Button>
  );
};
