import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {BrowserRouter as Router, Switch, Route, Link, RouteComponentProps} from 'react-router-dom'

import MainView from './mainview'
import Counter from './counter'
import Myeonbul from './myeonbul'
import NotFound from './404'
import {LoremIpsum} from "./util";
import {DrawerAppContent} from "@rmwc/drawer";
import {token} from "morgan";


interface IState {
}


class App extends React.Component<any, IState> {
    public render() {
        return <Router>
            <Switch>
                <Route exact path="/">
                    <MainView appCont={<LoremIpsum count={50}/>}/>
                </Route>
                <Route path="/counter">
                    <MainView appCont={<Counter startNumber={0}/>}/>
                </Route>
                <Route path="/myeonbul">
                    <MainView appCont={<Myeonbul token={''} request={{type: '', uid: 1}}/>}/>
                </Route>
                <Route>
                    <MainView appCont={<NotFound/>}/>
                </Route>
            </Switch>
        </Router>
    }
}


document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App/>, document.getElementById('app') as HTMLElement)
})


export default App;
