import React, { useEffect } from 'react';

const MetaComponent = ({ title, description, image }) => {
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute('content', description);
    document.querySelector('meta[property="og:title"]').setAttribute('content', title);
    document.querySelector('meta[property="og:description"]').setAttribute('content', description);
    document.querySelector('meta[property="og:image"]').setAttribute('content', image);
  }, [title, description, image]);

  return null; // MetaComponent doesn't render anything to the DOM
};

export default MetaComponent;