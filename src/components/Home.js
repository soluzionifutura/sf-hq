import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import withPersistence from "../hocs/withPersistence.js"
import withSdk from "../hocs/withSdk.js"
import githubLogo from "../assets/githubLogo.png"

const clientId =  process.env.NODE_ENV === "development" ? "d8055d9190e92dc16367" : "3a4d6f71dcd5a9385017"
const callbackUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://soluzionifutura.github.io/sf-hq"

const Home = (props) => {
  const [organizations, setOrganizations] = useState([])

  useEffect(() => {
    const execute = async () => {
      const organizations = await props.sdk.listOrganizations()
      setOrganizations(organizations)
    }

    if (props.persistence.get("access_token")) {
      void execute()
    }
  }, [])


  if (!props.persistence.get("access_token")) {
    return (
      <a href={ `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&scope=admin:org repo` }>
        <img width="100px" height="100px" src={githubLogo} />
      </a>
    )
  }

  return (
    <div className = "home">
      {/* <Link to = "/wiki">Wiki</Link> */}
      <ul>
        {
          organizations.map(organization => {
            return (
              <li>
                <Link to = { `/gantt/${organization.login}` }>{ organization.login } </Link>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default withPersistence(withSdk(Home))
