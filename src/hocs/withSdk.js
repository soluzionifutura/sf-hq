import React, { useEffect, useState } from "react"
import Sdk from "../helpers/Sdk"
import withPersistence from "../hocs/withPersistence.js"

const sdk = new Sdk({ token: localStorage.getItem("access_token") })

const withSdk = WrappedComponent => {
  return withPersistence(props => {
    const [error, setError] = useState(false)

    useEffect(() => {
      const execute = async () => {
        if (window.location.search) {
          // https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#web-application-flow
          const res = await fetch("https://wtrc7fvnyd.execute-api.eu-west-1.amazonaws.com/Prod/auth/", {
            method: "POST",
            body: JSON.stringify({
              code: new URLSearchParams(window.location.search).get("code"),
              state: Math.random()
            })
          })
          if (res.ok) {
            const { access_token } = await res.json()
            props.persistence.set("access_token", access_token)
            window.location.href = "/"
          } else {
            console.error(await res.json())
            setError(true)
          }
        }
      }

      execute()
    }, [])

    if (error) {
      return <span>Error while fetching GitHub access token using code</span>
    } else {
      return <WrappedComponent {...props} sdk={sdk} />
    }
  })
}

export default withSdk
