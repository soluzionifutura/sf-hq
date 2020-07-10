import React, { Component, useEffect, useRef } from "react"
import { gantt } from "dhtmlx-gantt"
import "dhtmlx-gantt/codebase/dhtmlxgantt.css"

const dateToStr = gantt.date.date_to_str(gantt.config.task_date)
const Gantt = ({ tasks }) => {
  let ganttContainer = useRef()

  useEffect(() => {
    var zoomConfig = {
      levels: [
        {
          name:"day",
          scale_height: 27,
          min_column_width:80,
          scales:[
            {unit: "day", step: 1, format: "%d %M"}
          ]
        },
        {
          name:"week",
          scale_height: 50,
          min_column_width:50,
          scales:[
            {unit: "week", step: 1, format: function (date) {
                var dateToStr = gantt.date.date_to_str("%d %M");
                var endDate = gantt.date.add(date, -6, "day");
                var weekNum = gantt.date.date_to_str("%W")(date);
                return "#" + weekNum + ", " + dateToStr(date) + " - " + dateToStr(endDate);
              }},
            {unit: "day", step: 1, format: "%j %D"}
          ]
        },
        {
          name:"month",
          scale_height: 50,
          min_column_width:120,
          scales:[
            {unit: "month", format: "%F, %Y"},
            {unit: "week", format: "Week #%W"}
          ]
        },
        {
          name:"quarter",
          height: 50,
          min_column_width:90,
          scales:[
            {unit: "month", step: 1, format: "%M"},
            {
              unit: "quarter", step: 1, format: function (date) {
                var dateToStr = gantt.date.date_to_str("%M");
                var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                return dateToStr(date) + " - " + dateToStr(endDate);
              }
            }
          ]},
        {
          name:"year",
          scale_height: 50,
          min_column_width: 30,
          scales:[
            {unit: "year", step: 1, format: "%Y"}
          ]}
      ]
    }

    gantt.ext.zoom.init(zoomConfig)
    gantt.config.readonly = true
    gantt.config.columns = [
      { name: "text", label: "Resource", width: "*", tree: true }
    ]
    gantt.templates.task_text = function (start, end, task) {
      let out = ""

      if (task.title) {
        out += task.title
      }

      if (task.percentage) {
        out += ` (${Math.round(task.progress * 100)}%)`
      }

      return out
    }
    gantt.plugins({
      tooltip: true,
      marker: true
    })

    gantt.addMarker({
      start_date: new Date(),
      css: "today",
      text: "Now",
      title: dateToStr(new Date())
    })

    gantt.init(ganttContainer)
    gantt.parse({ data: tasks })
  }, [])

  useEffect(() => {
    gantt.clearAll()
    gantt.addMarker({
      start_date: new Date(),
      css: "today",
      text: "Now",
      title: dateToStr(new Date())
    })
    gantt.parse({ data: tasks })
    gantt.render()
  }, [tasks])

  return (
    <div
      ref={input => {
        ganttContainer = input
      }}
      style={{ width: "100%", height: "100%" }}
    />
  )
}

export default Gantt
