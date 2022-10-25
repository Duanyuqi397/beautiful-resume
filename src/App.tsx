import './App.css';
import { MainPage } from './pages/MainPage';
import store from './core/context/store'
import { Provider } from 'react-redux'

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <MainPage />
      </Provider>
    </div>
  );
}

export default App;