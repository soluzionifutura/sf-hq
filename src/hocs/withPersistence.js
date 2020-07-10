import React from "react"

const get = field => localStorage.getItem(field)

const set = (field, value) => localStorage.setItem(field, value)

const remove = field => localStorage.removeItem(field)

const withPersistence = WrappedComponent => {
  return (props) => <WrappedComponent {...props} persistence={{ get, set, remove }} />
}

export default withPersistence
