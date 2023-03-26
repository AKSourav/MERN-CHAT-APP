import { Route, Routes } from 'react-router-dom';
import './App.css';
import ChatProvider from './Context/ChatProvider';
import ChatPage from './Pages/ChatPage';
import Homepage from './Pages/Homepage';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/chats' element={<ChatPage/>}/>
        <Route path='*' element={<Homepage/>}/>
      </Routes>
    </div>
  );
}

export default App;
