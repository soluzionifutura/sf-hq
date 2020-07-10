import React, { useEffect, useState, useRef } from "react"
import "../styles/App.scss"
import { gantt } from "dhtmlx-gantt"
import Gantt from "./Gantt.js"
import withPersistence from "../hocs/withPersistence.js"
import "dhx-suite/codebase/suite.min.css"
import withSdk from "../hocs/withSdk.js"

const fetchOrganizationData = async ({ sdk, organization }) => {
  const data = await sdk.listTeams(organization)

  return data.reduce((acc, team) => {
    if (!team.repositories.some(repo => repo.milestones && repo.milestones.length)) {
      return acc
    }

    const teamItem = {
      id: team.id,
      title: team.name,
      text: `<a href="${team.html_url}" target="_blank">${team.name}</a>`,
      type: gantt.config.types.project,
      color: "#f1f8ff",
      textColor: "black",
      open: true
    }
    acc.push(teamItem)

    if (team.repositories) {
      team.repositories.forEach(repo => {

        if (repo.milestones && repo.milestones.length) {

          const repoItem = {
            id: repo.id,
            parent: team.id,
            title: repo.name,
            text: `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`,
            type: gantt.config.types.project,
            color: "#fff3a1",
            textColor: "black",
            open: true
          }
          acc.push(repoItem)

          repo.milestones.forEach(milestone => {
            const progress = 1 - milestone.open_issues / (milestone.open_issues + milestone.closed_issues)
            const dueOn = new Date(milestone.due_on)
            const milestoneItem = {
              id: milestone.id,
              parent: repo.id,
              title: `#${milestone.number} ${milestone.title}`,
              text: `<a href="${milestone.html_url}" target="_blank">#${milestone.number} ${milestone.title}</a`,
              start_date: new Date(milestone.created_at),
              end_date: dueOn,
              type: gantt.config.types.task,
              progress,
              percentage: true,
              color: milestone.closed_at ? "#46ad51" : Date.now() > dueOn ? "#d81b1b" : "#46ad51",
              open: true
            }
            acc.push(milestoneItem)

            if (milestone.issues) {
              milestone.issues.forEach(issue => {
                // const isDocu = issue.labels.find(label => label.name === "documentation")
                if (issue.pull_request || issue.labels.find(label => label.name === "documentation")) {
                  return
                }

                const issueItem = {
                  id: issue.id,
                  parent: milestone.id,
                  title: `#${issue.number} ${issue.title}`,
                  text: `
                    <a href="${issue.html_url}" target="_blank">#${issue.number} ${issue.title}</a>
                    ${issue.assignee ? `
                      <a href="${issue.assignee.html_url}" target="_blank">
                        <img src="${issue.assignee.avatar_url}" alt="${issue.assignee.login}" class="thumb">
                      </a>` : ""}
                  `,
                  start_date: new Date(issue.created_at),
                  end_date: issue.closed_at ? new Date(issue.closed_at) : dueOn,
                  color: issue.closed_at ? "#1b668a9e" : "#1b668a",
                  open: true,
                  type: gantt.config.types.task
                }

                acc.push(issueItem)
              })
            }
          })
        }
      })
    }
    return acc
  }, [])
}

const MilestonesGantt = ({ persistence, organization, sdk }) => {
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    const execute = async organization => {
      if (!persistence.get("access_token")) {
        return setError(true)
      }

      setIsFetching(true)
      try {
        const data = await fetchOrganizationData({ sdk, organization })
        setData(data)
        setError(false)
        setIsFetching(false)
      } catch (err) {
        setData([])
        setError(true)
        setIsFetching(false)
      }
    }

    void execute(organization)
  }, [organization])

  gantt.attachEvent("onTaskClosed", id => {
    persistence.set(id, "closed")
  })

  gantt.attachEvent("onTaskOpened", id => {
    persistence.remove(id)
  })

  gantt.attachEvent("onParse", () => {
    gantt.eachTask(task => {
      if (persistence.get(task.id) === "closed") {
        task.$open = false
      }
    })
  })

  if (error) {
    return <span>Error while fetching data from GitHub</span>
  } else if (isFetching) {
    return <span>Loading...</span>
  } else {
    return <div className="milestones">
      <div className="gantt-container">
        {
          data && <Gantt tasks={data} zoom="Months"/>
        }
      </div>
    </div>
  }
}

export default withPersistence(withSdk(MilestonesGantt))
