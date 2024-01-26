import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import './App.css';
import Signup from './Auth/Signup';
import Login from './Auth/Login';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/dashboard/:id' element={<Dashboard />} />
          <Route path="/" element={<Login />}></Route>
          <Route path="signup" element={<Signup />}></Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
