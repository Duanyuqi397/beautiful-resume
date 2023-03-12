import './App.css';
import { MainPage } from './pages/MainPage';
import LoginPage from './pages/Login'
import ResumeList from './pages/ResumeList'
import store from './core/context/store'
import { Provider } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom';
import { lazy, Suspense, useEffect} from 'react'
import { useQuery } from './core/hooks'
import {client} from './core/network'



function NeedAuth(props: any){
  const [checkAuth, checkStatus] = useQuery(() => client.post("checkToken"))
  useEffect(() => {
    checkAuth()
  }, [])
  if(checkStatus === 'success'){
    return props.component
  }else if(checkStatus === 'failed'){
    return <Redirect to="login"/>
  }
  return "";
}


function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Switch>
          <Route path="/main"><MainPage/> </Route>
          <Route path="/login"><LoginPage/> </Route>
          <Route path="/register"><LoginPage/> </Route>
          <Route path="/resumes"><NeedAuth component={<ResumeList/>}/></Route>
          <Route path="/resume/:resumeId"><NeedAuth component={<MainPage/>}/></Route>
          <Route path="/"><NeedAuth component={<ResumeList/>}/></Route>
        </Switch>
      </Provider>
    </div>
  );
}

export default App;