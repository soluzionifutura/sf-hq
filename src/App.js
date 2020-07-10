import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import OrganizationGantt from "./components/OrganizationGantt"
import Wiki from "./components/Wiki"
import Home from "./components/Home"

const App = () => {
  return (
    <Router basename='/'>
      <Switch>
        <Route exact path="/" component={ Home } />
        <Route path="/gantt/:organization" component={ OrganizationGantt } />
        <Route path="/wiki/:organization" render={ Wiki } />
      </Switch>
    </Router>
  )
}

export default App
