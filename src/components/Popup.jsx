import React, {useEffect, useRef} from 'react';

export default function Popup({title, width, height, location, onClose}) {
  const closed = useRef();

  useEffect(() => {
    const popup = window.open(location, title, `height=${height},width=${width}`);
    if (window.focus) {
      popup.focus();
    }

    const interval = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(interval);
        onClose();
        closed.current = true;
      }
    });

    return () => {
      if (!closed.current) {
        clearInterval(interval);
        onClose();
        popup.close();
      }
    };
  }, []);

  return <></>
}
