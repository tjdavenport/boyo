import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHandPeace} from '@fortawesome/free-regular-svg-icons';

export default function Logo() {
  return (
    <h4 className="m-0">
      <a href="/" className="color-string">'boyo.gg'</a> <FontAwesomeIcon className="color-string" icon={faHandPeace}/>
    </h4>
  );
}
