import React, { Component } from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import OrganizationGantt from "./OrganizationGantt.js"
import Wiki from "./Wiki.js"
import Home from "./Home.js"

const App = () => {
  return (
    <Router basename='/'>
      <Switch>
        <Route exact path="/" component={ Home } />
        <Route exact path="/gantt/:organization" component={ OrganizationGantt } />
        <Route path="/wiki" render={ Wiki } />
      </Switch>
    </Router>
  )
}

export default App
