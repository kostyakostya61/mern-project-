import React, { useState, useEffect, useContext } from 'react';
// import { useMessage } from '../hooks/message.hook';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';

export const CreatePage = () => {
  const auth = useContext(AuthContext);
  const { request } = useHttp();
  const [link, setLink] = useState('');
  const [userName, setUserName] = useState({});
  const [usersCount, setUsersCount] = useState([]);
  const [user,setuser]= ([])

  useEffect(() => {
    userNick();
  }, []);

  useEffect(() => {
    usersNumber();
  }, []);

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

  const userNick = async () => {
    try {
      const info = await request(
        `/api/auth/nickname?userId=${auth.userId}`,
        'GET'
      );
      setUserName(info);
    } catch (e) {}
  };

  const usersNumber = async () => {
    try {
      const data = await request(`api/auth/count`, 'GET');
      setUsersCount(data);
    } catch (e) {}
  };

  // const list = usersCount.map(item,index)

  return (
    <div className="row">
      <div className="col s8 offset-s2" style={{ paddingTop: '2rem' }}>
        <h1>Create Page,</h1>

        <div className="input-field">
          <input
            placeholder="Вставьте ссылку вот сюда"
            id="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyPress={pressHadler}
          />

          <label className="active" htmlFor="link">
            Поделителсь ссылкой
          </label>

          <h4>
            <div>
              <a>Hello</a> {userName.nickname}
            </div>
          </h4>
          <table border="1">
            <ul>
              {usersCount.map((user) => (
                <table className="highlight">
                  <tr>
                    
                    <td>Email:{user.email}</td> <td>Nick:{user.nickname}</td> <td><button onClick={}>Delete</button></td>
                  </tr>
                </table>
              ))}
            </ul>
          </table>
        </div>
      </div>
    </div>
  );
};
