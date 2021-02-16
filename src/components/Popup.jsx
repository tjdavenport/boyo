import React, {useEffect} from 'react';

export default function Popup({title, width, height, location, onClose}) {
  useEffect(() => {
    const popup = window.open(location, title, `height=${height},width=${width}`);
    if (window.focus) {
      popup.focus();
    }

    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        onClose();
      }
    }, 250);
  }, []);

  return <></>
}
