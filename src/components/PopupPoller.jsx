import React, {useEffect} from 'react';

export default function PopupPoller({lsKey, title, width, height, location, active, onTimeout, onDone}) {
  useEffect(() => {
    if (active) {
      if (lsKey) {
        localStorage.setItem(lsKey, false.toString());
      }

      const popup = window.open(location, title, `height=${height},width=${width}`);
      if (window.focus) {
        popup.focus();
      }

      setTimeout(() => onTimeout(), 30000);

      const interval = setInterval(() => {
        if (lsKey) {
          if (JSON.parse(localStorage.getItem(lsKey))) {
            onDone();
            clearInterval(interval);
          }
        } else {
          if (popup.closed) {
            onDone();
            clearInterval(interval);
          }
        }
      }, 250);
    }
  }, [active]);

  return <></>
}
