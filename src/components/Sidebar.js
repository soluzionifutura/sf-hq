// import "./Sidebar.css"
import React from "react"

export const Sidebar = ({ width = "200", height = "100vh", children }) => {
  const [xPosition, setX] = React.useState(-width)

  const toggleMenu = () => {
    if (xPosition < 0) {
      setX(0)
    } else {
      setX(-width)
    }
  }

  React.useEffect(() => {
    setX(0)
  }, [])
  return (
    <React.Fragment>
      <div
        className="side-bar"
        style={{
          transform: `translatex(${xPosition}px)`,
          width,
          minHeight: height
        }}
      >
        <button
          onClick={() => toggleMenu()}
          className="toggle-menu"
          style={{
            transform: `translate(${width}px, 20vh)`
          }}
        />
        <div className="content">{children}</div>
      </div>
    </React.Fragment>
  )
}

export default Sidebar
