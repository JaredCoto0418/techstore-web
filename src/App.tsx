
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './router/AppRouter.tsx';
import './index.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <AppRouter />
    </div>
  );
}

export default App;
