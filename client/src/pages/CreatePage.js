import React, { useState } from 'react';
import { useHttp } from '../hooks/http.hook';

export const CreatePage = () => {
  const { request } = useHttp();
  const [link, setLink] = useState('');

  const pressHadler = async (event) => {
    if (event.key === 'Enter') {
      try {
        const data = await request('/api/link/generate', 'POST', {
          from: link,
        });
        console.log(data);
      } catch (e) {}
    }
  };

  return (
    <div className="row">
      <div className="col s8 offset-s2" style={{ paddingTop: '2rem' }}>
        <h1>Create Page</h1>
        <div className="input-field">
          <input
            placeholder="Вставьте ссылку"
            id="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyPress={pressHadler}
          />

          <label className="active" htmlFor="link">
            Вставьте ссылку
          </label>
        </div>
      </div>
    </div>
  );
};
