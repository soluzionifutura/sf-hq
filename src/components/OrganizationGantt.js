import React, { useEffect, useState } from "react"
import Sidebar from "./Sidebar"
import { withRouter, Link, Redirect } from "react-router-dom"
import withSdk from "../hocs/withSdk.js"
import withPersistence from "../hocs/withPersistence"
import MilestonesGantt from "./MilestonesGantt"

const OrganizationGantt = ({ sdk, match, persistence }) => {
  const [organizations, setOrganizations] = useState([])

  useEffect(() => {
    const execute = async () => {
      const organizations = await sdk.listOrganizations()
      setOrganizations(organizations)
    }

    if (persistence.get("access_token")) {
      void execute()
    }
  }, [])

  if (!persistence.get("access_token")) {
    return <Redirect to={"/"} />
  }

  return (
    <div className = "organization-gantt">
      <Sidebar>
        <h3>Organizations</h3>
        <ul>
          {
            organizations.map((organization, i) => {
              return (
                <li key={i}>
                  <img src = {organization.avatar_url} width={30}/><Link to = {`/gantt/${organization.login}`}>{ organization.login }</Link>
                </li>
              )
            })
          }
        </ul>
        <h3>Filters</h3>
      </Sidebar>
      <MilestonesGantt organization = { match.params.organization } />
    </div>
  )
}

export default withPersistence(withSdk(withRouter(OrganizationGantt)))
