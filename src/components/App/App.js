import React from 'react';
import './App.css';
import { DragDropContext } from 'react-beautiful-dnd';
import popSnd from '../../assets/snd/pop.mp3';
import * as edit from '../../services/edit/edit';
import * as display from '../../services/display/display';
import * as util from '../../services/util/util';
import Frame from '../Frame/Frame';
import StatusBar from '../StatusBar/StatusBar';

// main app, governs everything
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hideComplete: window.data.settings.hideComplete,
      bank: React.createRef(),
      river: React.createRef(),
      theme: window.data.settings.theme,
      mode: window.data.settings.mode,
      focused: window.data.settings.focused,
      popSnd: new Audio(popSnd),
      zoomed: '',
      disableSelect: '',
      contextMenu: React.createRef(),
      deadlines: window.data.settings.deadlines,
      startdates: window.data.settings.startdates,
      displayTable: 'none',
    };
  }

  // hide/show completes
  toggleComplete() {
    var hideComplete;
    if (this.state.hideComplete === '') {
      hideComplete = 'hideComplete';
    } else {
      hideComplete = '';
    }
    this.setState({ hideComplete: hideComplete });
    edit.saveSetting('hideComplete', hideComplete);
    display.updateAllSizes();
  }
  onDragEnd = result => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId &&
      destination.index === source.index) {
      return;
    }
    const sourceSplit = source.droppableId.split('-');
    const destSplit = destination.droppableId.split('-');

    function buildList(listSplit) {
      var listObjs = [];
      listObjs.push(window.app.current.state[listSplit[0]]);
      listObjs.push(listObjs[0].current.frames.find(x =>
        x.current.props.id === listSplit[1]));
      var i = 2;
      var task;
      function getTask() {
        task = listObjs[i - 1].current.taskList.current
          .subtaskObjects.find(x => x.current.props.id === listSplit[i]);
        listObjs.push(task);
        i++;
      }
      while (i < listSplit.length) {
        getTask();
      }
      // returns the item to update
      return listObjs[listObjs.length - 1];
    }
    const sourceItem = buildList(sourceSplit);
    const sourceState = sourceItem.current.state.subtasks;
    const splicedTask = sourceState.splice(source.index, 1);
    sourceItem.current.setState({ subtasks: sourceState });
    const destItem = buildList(destSplit);
    const destState = destItem.current.state.subtasks;
    destState.splice(destination.index, 0, splicedTask[0]);
    destItem.current.setState({ subtasks: destState });
    // splice in the new DATA from the source into the OBJECT of the destination
    edit.save(sourceItem.current);
    edit.save(destItem.current);
    window.selected = undefined;
  }

  render() {
    this.statusBar = React.createRef();
    return (
      <>
        <StatusBar parent={this} ref={this.statusBar} 
          deadlines={this.state.deadlines} 
          startdates={this.state.startdates} />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className={'container ' + this.state.hideComplete + ' ' +
            this.state.zoomed + ' ' + this.state.disableSelect}>
            <Frame id='bank' info={{
              ...window.data.tasks['bank'].info,
              focused: window.data.settings.focused
            }}
              subtasks={window.data.tasks['bank'].subtasks} ref={this.state.bank} />
            <Frame id='river' info={{
              ...window.data.tasks['river'].info,
              focused: window.data.settings.focused,
            }}
              deadlines={this.state.deadlines}
              startdates={this.state.startdates}
              subtasks={window.data.tasks['river'].subtasks} ref={this.state.river} />
          </div>
        </DragDropContext>
        <SelectMenu ref={this.state.contextMenu}/>
        {window.selected && this.state.displayTable !== 'none' &&
          <TableDisplay />}
      </>
    )
  }
}

// extra function menu tacked on after the drag/drop context
class SelectMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { display: 'none', top: '0', left: '0' };
  }
  render() {
    this.self = React.createRef();
    return (
      <div className='selectMenu' ref={this.self} style={{ display: this.state.display,
        top: this.state.top, left: this.state.left }}>
        <p onClick={() => edit.newTask()}>
        new task (return)</p>
        <p onClick={() => edit.cutTask()}>
          cut (ctrl-x)</p>
        <p onClick={() => edit.copyTask()}>
          copy (ctrl-c)</p>
        <p onClick={() => edit.copyTask(true)}>
          mirror (ctrl-shift-C)</p>
        <p onClick={() => edit.pasteTask()}>
          paste (ctrl-v)</p>
        <p onClick={() => edit.pasteTask("task")}>
          paste as subtask (ctrl-shift-V)</p>
        <p onClick={() => edit.deleteTask()}>
          delete (ctrl-delete)</p>
        <p onClick={() => edit.moveTask(1)}>
          move down (ctrl-s)</p>
        <p onClick={() => edit.moveTask(-1)}>
          move up (ctrl-w)</p>
        <p onClick={() => display.switchView(1)}>
          following week/lists (ctrl-d)</p>
        <p onClick={() => display.switchView(-1)}>
          previous week/lists (ctrl-a)</p>
        <p onClick={() => edit.listEdit('migrate')}>
          migrate date</p>
        <p onClick={() => edit.listEdit('clear')}>
          clear list</p>
        <p onClick={() => display.displayTable()}>
          display as table</p>
      </div>
    )
  } 
}

class TableDisplay extends React.Component {
  render() {
    return (
      <table className='table'>
        <thead></thead>
        <tbody>
          {window.data.tasks[util.stripR(window.selected.props.id)].subtasks.map(x => (
            <tr key={x}>
              <td>{
                window.data.tasks[util.stripR(x)].title
              }</td>
              {window.data.tasks[x].subtasks.map(y => (
                <td key={y}>
                  {window.data.tasks[util.stripR(y)].title
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