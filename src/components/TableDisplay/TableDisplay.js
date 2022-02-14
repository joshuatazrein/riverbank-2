class TableDisplay extends React.Component {
  render() {
    console.log(window.selected.props.id, window.data.tasks[stripR(window.selected.props.id)].subtasks);
    return (
      <table className='table'>
        <thead></thead>
        <tbody>
          {window.data.tasks[stripR(window.selected.props.id)].subtasks.map(x => (
            <tr key={x}>
              <td>{
                window.data.tasks[stripR(x)].title
              }</td>
              {window.data.tasks[x].subtasks.map(y => (
                <td key={y}>
                  {/* {<Task 
                    id={y}
                    info={window.data.tasks[stripR(y)].info}
                    title={window.data.tasks[stripR(y)].title}
                    subtasks={window.data.tasks[stripR(y)].subtasks}
                    parent={window.selected}
                  /> */
                  window.data.tasks[stripR(y)].title
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}