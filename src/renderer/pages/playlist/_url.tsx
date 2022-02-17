import React, { useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

const PlaylistUrlPage: React.FC = () => {
  const searchParams = useSearchParams();
  const { url } = useParams();

  useEffect(() => {
    console.log(url);
  }, [url]);
  return <div>123</div>;
};

export default PlaylistUrlPage;
