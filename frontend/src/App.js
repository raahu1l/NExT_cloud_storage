import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const register = async () => {
    try {
      const res = await axios.post(`${API_URL}/register`, { username, password });
      setMessage(res.data.message);
    } catch (e) {
      setMessage(e.response?.data?.message || 'Error');
    }
  };

  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      setToken(res.data.token);
      setMessage('Login successful');
      fetchFiles(res.data.token);
    } catch (e) {
      setMessage(e.response?.data?.message || 'Error');
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setMessage('Select a file first');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(res.data.message);
      fetchFiles(token);
    } catch (e) {
      setMessage(e.response?.data?.message || 'Upload error');
    }
  };

  const fetchFiles = async (authToken) => {
    try {
      const res = await axios.get(`${API_URL}/files`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setFiles(res.data);
    } catch (e) {
      setMessage(e.response?.data?.message || 'Error fetching files');
    }
  };

  const downloadFile = (filename) => {
    window.open(`${API_URL}/files/${filename}?token=${token}`, '_blank');
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>NEXT Cloud Storage</h1>
      <div>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>

      {token && (
        <>
          <h3>Upload File</h3>
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <button onClick={uploadFile}>Upload</button>

          <h3>Files</h3>
          <ul>
            {files.map(file => (
              <li key={file}>
                {file}{' '}
                <button onClick={() => downloadFile(file)}>Download</button>
              </li>
            ))}
          </ul>
        </>
      )}

      <p>{message}</p>
    </div>
  );
}

export default App;
