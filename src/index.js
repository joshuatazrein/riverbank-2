import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import $ from 'jquery';
import './style.css';
import { render } from '@testing-library/react';
import "react-datepicker/dist/react-datepicker.css";
// import "./react-datepicker.css";
const fs = require('fs');

var resetData = {
  bank: 
    {info: {index: 0}, subtasks: [
      {id:'1', title:'first', subtasks: [], info: {}}
    ]}, 
  river:
    {info: {index: 0}, subtasks: [
      {id:String(new Date().getTime()), title: new Date().toDateString(), subtasks: [], info: {}}
    ]}, 
  settings: {repeats: {'Mon': [], 'Tue': [], 'Wed': [], 'Thu': [], 
  'Fri': [], 'Sat': [], 'Sun': [], }}
};

var data = !localStorage.getItem('data') ? { resetData } :
  JSON.parse(localStorage.getItem('data'));

var deadlines = {};
var startdates = {};

try {
  var repeats = data.settings.repeats;
} catch (err) {
  console.log('error');
  var data = resetData;
}

var selected;
var preventSelect;
var copiedTask;
var width;
var prevWidth;
var app;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hideComplete: '', 
      bank: React.createRef(),
      river: React.createRef(),
    };
  }
  toggleComplete() {
    if (this.state.hideComplete == '') {
      this.setState({hideComplete: 'hideComplete'});
    } else {
      this.setState({hideComplete: ''});
    }
  }
  render () {
    return (
      <>
        <StatusBar parent={this} />
        <div className={'container ' + this.state.hideComplete}>
          <Frame id='bank' info={data['river'].info} 
            subtasks={data['bank'].subtasks} ref={this.state.bank} />
          <Frame id='river' info={data['river'].info} 
            subtasks={data['river'].subtasks} ref={this.state.river} />
        </div>
      </>
    )
  }
}

class StatusBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchString: '', foundTasks: {}};
  }
  treeSearch(task, idString) {
    let i = 0;
    for (let subtask of task.subtasks) {
      if (subtask.title.length > 0) {
        this.searches[subtask.title] = idString + ' ' + i;
      }
      this.treeSearch(subtask, idString + ' ' + i);
      i ++;
    }
  }
  search(ev) {
    if (this.state.searchString === '') {
      this.searches = {};
      this.treeSearch(data.river, 'river');
      this.treeSearch(data.bank, 'bank');
    }
    this.setState({searchString: ev.target.value});
    for (let x of Object.keys(this.searches)) {
      if (!x.includes(this.state.searchString)) {
        delete this.searches[x];
      }
    }
    console.log(this.searches);
    this.setState({foundTasks: this.searches});
  }
  goToSearch(title) {
    const splits = title.split(' ');
    const frame = app.current.state[splits[0]];
    frame.current.changeIndex(Number(splits[1]));
    setTimeout(() => {
      console.log(frame.current.frames.map(x => x.current));
      let currentTask = frame.current.frames[0];
      for (let place of splits.slice(2)) {
        // zoom into places until you find the task
        currentTask = currentTask.current.taskList.current.
          subtaskObjects[Number(place)];
      }
      console.log(currentTask.current);
      setTimeout(() => {
        preventSelect = false;
        selectTask(currentTask.current, true);
      }, 50)
    }, 50)
    this.setState({searchString: '', foundTasks: {}});
  }
  render() {
    this.search = this.search.bind(this);
    this.treeSearch = this.treeSearch.bind(this);
    this.goToSearch = this.goToSearch.bind(this);
    this.searchResults = React.createRef();
    return (
      <div className='statusBar'>
        <input className='searchBar' onChange={(ev) => this.search(ev)}
          value={this.state.searchString}
          onKeyDown={(ev) => {
            if (ev.key === 'Backspace') {
              this.setState({searchString: '', foundTasks: {}});
            }
          }}></input>
        <select ref={this.searchResults} onChange={() => {
          this.goToSearch(this.state.foundTasks[
            this.searchResults.current.value])
          }}>
          <option></option>
          {Object.keys(this.state.foundTasks).map(x => 
            <option key={x} value={x}>{x}</option>)}
        </select>
        <div className='buttonBar'>
          <button className='button' onClick={newTask}>+</button>
          <button className='button' onClick={cutTask}>x</button>
          <button className='button' onClick={copyTask}>c</button>
          <button className='button' onClick={pasteTask}>v</button>
          <button className='button' onClick={backup}>backup</button>
          <button 
            className={'button ' + this.props.parent.state.hideComplete} onClick={() => {
              this.props.parent.toggleComplete();
            }}>+√/-√</button>
          <Timer />
        </div>
      </div>
    )
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {minutes: 0, seconds: 0, repeats: repeats};
  }
  startTimer(val) {
    this.setState({minutes: this.state.minutes + val, seconds: 0});
    this.play();
  }
  play(stopwatch, backwards) {
    const multiplier = backwards ? -1 : 1;
    clearInterval(this.interval);
    if (stopwatch === 'stopwatch') {
      this.interval = setInterval(() => {
        if (this.state.seconds === 60) {
          this.setState({minutes: (this.state.minutes + 1) * multiplier, 
            seconds: 0});
        } else {
          this.setState({seconds: this.state.seconds + 1});
        }
      }, 1000);
    } else {
      this.interval = setInterval(() => {
        if (this.state.seconds === 0) {
          if (this.state.minutes === 0) {
            this.end();
            this.play('stopwatch', true);
          }
          this.setState({minutes: (this.state.minutes - 1) * multiplier, 
            seconds: 59});
        } else {
          this.setState({seconds: this.state.seconds - 1});
        }
      }, 1000);
    }
  }
  end() {
    alert('timer complete');
  }
  playPause() {
    clearInterval(this.interval);
    this.setState({minutes: 0, seconds: 0});
  }
  render () {
    this.startTimer = this.startTimer.bind(this);
    this.playPause = this.playPause.bind(this);
    this.play = this.play.bind(this);
    this.audioRef = React.createRef();
    return (
      <div>
        <div className='buttonBar'>
          <button className='button' onClick={() => this.startTimer(50)}>50</button>
          <button className='button' onClick={() => this.startTimer(25)}>25</button>
          <button className='button' onClick={() => this.startTimer(10)}>10</button>
          <button className='button' onClick={() => this.startTimer(5)}>5</button>
          <button className='button' onClick={() => {
            this.setState({minutes: 0, seconds: 1});
            this.play();
          }}>:5</button>
          <button className='button' onClick={() => this.playPause()}>&#9632;</button>
        </div>
        <input className='timerBar' readOnly={true}
          value={this.state.minutes + ':' + 
          String(this.state.seconds).padStart(2, '0')}></input>
      </div>
    )
  }
}

class Frame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {lists: props.subtasks, info: props.info,
      width: Math.floor(window.innerWidth / 200)};
    $(window).on('resize', this.resizeCheck);
    if (props.id === 'river') {
      this.state.deadlines = deadlines;
      this.state.startdates = startdates;
      this.state.repeats = repeats;
    }
  }
  changeIndex(val) {
    let newIndex = this.state.info.index + val
    if (newIndex < 0) newIndex = 0
    this.setState(prevState => ({
      info: {...prevState.info, index: newIndex}
    }));
  }
  render() {
    const now = new Date();
    let i = 0;
    var lastDate = new Date(
      this.state.lists[this.state.lists.length - 1].title
    );
    while (this.state.lists.length < this.state.info.index + 7) {
      i ++;
      if (this.props.id === 'bank') {
        var title = '';
      } else if (this.props.id === 'river') {
        const date = new Date(lastDate.getTime());
        date.setDate(lastDate.getDate() + i);
        var title = date.toDateString();
      }
      this.state.lists.push({id: String(now.getTime() + i), 
        title: title, subtasks: [], info: {}});
    }
    function resizeCheck() {
      // TODO: debug "this" in this function
      const width = Math.floor(window.innerWidth / 200);
      if (width != this.state.width) {
        this.setState({width: width});
      }
    }
    let endIndex = this.state.info.index + this.state.width;
    this.changeIndex = this.changeIndex.bind(this);
    resizeCheck = resizeCheck.bind(this);
    this.frames = [];
    // $(window).off('resize', () => resizeCheck);
    window.addEventListener('resize', resizeCheck);
    const shownLists = 
      this.state.lists.slice(this.state.info.index, endIndex);
    const div = (
      <div id={this.props.id} className='frame'>
        <button className='changeButton'
          onClick={() => this.changeIndex(this.state.width * -1)}>&lt;</button>
        {shownLists.map(x => {
          this.frames.push(React.createRef());
          if (this.props.id === 'river') {
            // render state correctly in original lists
            return (
              <List key={x.id} id={x.id} title={x.title}
                subtasks={x.subtasks} parent={this} 
                deadlines={this.state.deadlines[x.title]} 
                startdates={this.state.startdates[x.title]} 
                repeats={this.state.repeats[x.title.slice(0, 3)]}
                ref={this.frames[this.frames.length - 1]} />
            )
          } else {
            return (
              <List key={x.id} id={x.id} title={x.title}
                subtasks={x.subtasks} parent={this} />
            )
          }
        })}
        <button className='changeButton' 
          onClick={() => this.changeIndex(this.state.width)}>&gt;</button>
      </div>
    )
    return div;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.taskList = React.createRef();
    this.state = {subtasks: props.subtasks, title: props.title,
      info: {}};
  }
  changeTitle(ev) {
    this.setState({title: ev.target.value})
  }
  updateRepeats() {
    const subtaskIDs = this.state.subtasks.map(x => x.id);
    const newSubs = this.state.subtasks;
    console.log(subtaskIDs);
    if (this.props.parent.props.id === 'river') {
      console.log('river');
      for (let repeat of repeats[this.props.title.slice(0, 3)]) {
        if (!subtaskIDs.includes(repeat.id)) {
          newSubs.push(repeat);
        }
      }
    }
    console.log(newSubs);
    if (Object.keys(newSubs).length != 
      Object.keys(this.state.subtasks).length) {
      this.setState({subtasks: newSubs});
    }
  }
  render() {
    function selectThis() {
      selectTask(this);
    }
    this.updateRepeats = this.updateRepeats.bind(this);
    this.updateRepeats();
    selectThis = selectThis.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    return (
      <div className='list' onClick={selectThis}>
        {this.props.parent.props.id === 'bank' ?
          <input className='listInput' value={this.state.title} 
          onChange={this.changeTitle}></input> :
          <input readOnly className='listInput listTitle'
            value={this.state.title}></input>
        }
        {this.props.parent.props.id === 'river' && 
        this.props.deadlines &&
        <ul>
          {Object.keys(this.props.deadlines).map(x => {
            return <li 
              className='deadline' key={String(x)}>
              {this.props.deadlines[x]}</li>;
          })}
        </ul>}
        {this.props.parent.props.id === 'river' && 
        this.props.startdates &&
        <ul>
          {Object.keys(this.props.startdates).map(x => {
            return <li 
              className='startdate' key={String(x)}>
              {this.props.startdates[x]}</li>;
          })}
        </ul>}
        {<TaskList ref={this.taskList} subtasks={this.state.subtasks} 
          parent={this} />}
      </div>
    )
  }
}

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {addTask: this.addTask};
  }
  render() {
    this.subtaskObjects = [];
    const tasksListed = this.props.subtasks.map(x => {
      this.subtaskObjects.push(React.createRef());
      const task = (
        <Task 
          key={x.id}
          id={x.id}
          info={x.info}
          title={x.title}
          subtasks={x.subtasks}
          parent={this.props.parent}
          ref={this.subtaskObjects[this.subtaskObjects.length - 1]}
        />
      )
      return task});
    return (
      <ul className='listContent'>
        {this.props.addTasks && this.props.addTasks}
        {tasksListed}
      </ul>
    )
  }
}

class Task extends React.Component {
  constructor(props) {
    super();
    this.state = {
      info: props.info, title: props.title, 
      subtasks: props.subtasks, parent: props.parent, 
      id: props.id, displayOptions: 'hide', riverTask: false,
      this: this
    };
    if (!this.state.info.startDate) this.state.info.startDate = '';
    if (!this.state.info.endDate) this.state.info.endDate = '';
    if (!this.state.info.collapsed) this.state.info.collapsed = '';
    let parent = props.parent;
    while (parent.props.parent) {
      parent = parent.props.parent;
    }
    if (parent.props.id === 'river') {
      this.state.riverTask = true;
      this.state.repeats = {
        'Mon': repeats['Mon'].includes(this.state.title),
        'Tue': repeats['Tue'].includes(this.state.title),
        'Wed': repeats['Wed'].includes(this.state.title),
        'Thu': repeats['Thu'].includes(this.state.title),
        'Fri': repeats['Fri'].includes(this.state.title),
        'Sat': repeats['Sat'].includes(this.state.title),
        'Sun': repeats['Sun'].includes(this.state.title),
      }
    }
  }
  displayOptions(ev, showHide) {
    if ($(ev.target).hasClass('options') || 
      $(ev.target).parent().hasClass('options')) {
      return
    }
    if (showHide === 'hide' || this.state.displayOptions === 'show') {
      this.setState({displayOptions: 'hide'});
    } else if (showHide == 'show' || this.state.displayOptions === 'hide') {
      this.setState({displayOptions: 'show'});
    }
  }
  changeTitle(ev) { 
    this.setState({title: ev.target.value, editHeight: 
    'calc(' + String(this.heightSpan.current.offsetHeight) + 'px + 0.25em)'});
  }
  changeStartDate(ev) { 
    if (this.state.info.startDate.includes('-')) {
      // delete deadline string if no longer there
      const deadline = this.state.info.startDate.split('-');
      const now = new Date();
      now.setMonth(Number(deadline[0]) - 1);
      now.setDate(Number(deadline[1]));
      if (startdates[now.toDateString()] && 
        startdates[now.toDateString()][this.props.id]) {
        delete startdates[now.toDateString()][this.props.id];
      }
    }
    if (ev === 'init') {
      ev = {target: {value: this.state.info.startDate}};
    } else if (ev === 'destroy') {
      let parent = this.props.parent;
      while (parent.props.parent) {
        parent = parent.props.parent;
      }
      parent.setState({startdates: startdates});
      return;
    } else {
      this.setState(prevState => ({
        info: {...prevState.info, startDate: ev.target.value}})); 
    }
    console.log(ev);
    if (ev.target.value.includes('-')) {
      // process deadline string
      const deadline = ev.target.value.split('-');
      const now = new Date();
      now.setMonth(Number(deadline[0]) - 1);
      now.setDate(Number(deadline[1]));
      if (!startdates[now.toDateString()]) {
        startdates[now.toDateString()] = {};
      }
      startdates[now.toDateString()][this.props.id] = this.state.title;
      let parent = this.props.parent;
      while (parent.props.parent) {
        parent = parent.props.parent;
      }
      parent.setState({startdates: startdates});
    }
  }
  changeEndDate(ev) { 
    if (this.state.info.endDate.includes('-')) {
      // delete deadline string if no longer there
      const deadline = this.state.info.endDate.split('-');
      const now = new Date();
      now.setMonth(Number(deadline[0]) - 1);
      now.setDate(Number(deadline[1]));
      if (deadlines[now.toDateString()] && 
        deadlines[now.toDateString()][this.props.id]) {
        delete deadlines[now.toDateString()][this.props.id];
      }
    }
    if (ev === 'init') {
      ev = {target: {value: this.state.info.endDate}};
    } else if (ev === 'destroy') {
      ev = {target: {value: ' '}};
    } else {
      this.setState(prevState => ({
        info: {...prevState.info, endDate: ev.target.value}})); 
    }
    if (ev.target.value.includes('-')) {
      // process deadline string
      const deadline = ev.target.value.split('-');
      const now = new Date();
      now.setMonth(Number(deadline[0]) - 1);
      now.setDate(Number(deadline[1]));
      if (!deadlines[now.toDateString()]) {
        deadlines[now.toDateString()] = {};
      }
      deadlines[now.toDateString()][this.props.id] = this.state.title;
      let parent = this.props.parent;
      while (parent.props.parent) {
        parent = parent.props.parent;
      }
      parent.setState({deadlines: deadlines});
    }
  }
  changeRepeat(day) {
    if (repeats[day].map(x => x.id).includes(this.props.id)) {
      repeats[day].splice(repeats[day].findIndex(x => 
        x.id == this.props.id), 1);
    } else {
      const dataObject = {title: this.state.title, id: this.props.id, 
        subtasks: this.state.subtasks, info: this.state.info};
      repeats[day].push(dataObject);
      let parent = this.props.parent;
      while (parent.props.parent) {
        parent = parent.props.parent;
      }
      parent.setState({repeats: repeats});
    }
    const subtasks = this.state.parent.state.subtasks;
    const currentTask = subtasks.findIndex(x => {
      return x.id === this.state.id;
    });
    subtasks.splice(currentTask, 1);
    this.resetRepeats();
  }
  resetRepeats() {
    this.setState({repeats: {
      'Mon': repeats['Mon'].map(x => x.id).includes(this.props.id),
      'Tue': repeats['Tue'].map(x => x.id).includes(this.props.id),
      'Wed': repeats['Wed'].map(x => x.id).includes(this.props.id),
      'Thu': repeats['Thu'].map(x => x.id).includes(this.props.id),
      'Fri': repeats['Fri'].map(x => x.id).includes(this.props.id),
      'Sat': repeats['Sat'].map(x => x.id).includes(this.props.id),
      'Sun': repeats['Sun'].map(x => x.id).includes(this.props.id),
    }});
    data.settings.repeats = repeats;
    localStorage.setItem('data', JSON.stringify(data));
  }
  toggleComplete() {
    let status = this.state.info.complete
    if (status === 'complete') { status = '' }
    else { status = 'complete' }
    this.setState(prevState => ({
      info: {...prevState.info, complete: status}})); 
    this.displayOptions('hide');
  }
  toggleImportant() {
    let status = this.state.info.important
    if (status === 'important') { status = '' }
    else { status = 'important' }
    this.setState(prevState => ({
      info: {...prevState.info, important: status, maybe: ''}})); 
    this.displayOptions('hide');
  }
  toggleMaybe() {
    let status = this.state.info.maybe
    if (status === 'maybe') { status = '' }
    else { status = 'maybe' }
    this.setState(prevState => ({
      info: {...prevState.info, maybe: status, important: ''}})); 
    this.displayOptions('hide');
  }
  toggleCollapse() {
    let status = this.state.info.collapsed
    if (status === 'collapsed') { status = '' }
    else { status = 'collapsed' }
    this.setState(prevState => ({
      info: {...prevState.info, collapsed: status}})); 
    this.displayOptions('hide');
  }
  deleteThis() {
    // TODO: remove deadline, repeat & startdate 
      // [[don't use global variable]]
    let parent = this.props.parent;
    while (parent.props.parent) {
      parent = parent.props.parent;
    }
    this.changeEndDate('destroy');
    this.changeStartDate('destroy');
   for (let day of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      if (repeats[day].map(x => x.id).includes(this.props.id)) {
        this.changeRepeat(day);
        console.log(repeats);
      }
    }
    const subtasks = this.state.parent.state.subtasks;
    const currentTask = subtasks.findIndex(x => {
      return x.id === this.state.id;
    });
    subtasks.splice(currentTask, 1);
    selected = this.state.parent;
    this.state.parent.setState({subtasks: subtasks});
    preventSelect = true;
    setTimeout(() => {
      preventSelect = false
      save(this.props.parent, 'list');
    }, 200);
  }
  componentDidMount() {
    this.changeTitle({target: {value: this.state.title}});
    this.editBar.current.focus();
    selectTask(this);
    this.changeEndDate('init');
    this.changeStartDate('init');
    if (this.state.riverTask) {
      this.resetRepeats();
    }
  }
  render() {
    // fuck react
    this.displayOptions = this.displayOptions.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.toggleImportant = this.toggleImportant.bind(this);
    this.toggleMaybe = this.toggleMaybe.bind(this);
    this.deleteThis = this.deleteThis.bind(this);
    this.resetRepeats = this.resetRepeats.bind(this);
    this.changeRepeat = this.changeRepeat.bind(this);
    this.taskList = React.createRef();
    this.optionsButton = React.createRef();
    this.editBar = React.createRef();
    this.heightSpan = React.createRef();
    this.startDateSpan = React.createRef();
    const headingClass = this.state.subtasks.length > 0 ? 
      'heading' : '';
    const hasTimes = this.state.info.startDate.length > 0 && 
      this.state.info.endDate.length > 0 ? 'event' : '';
    const startInput = 
      <input className='optionsInput startDate' 
      value={this.state.info.startDate} 
      onChange={(ev) => this.changeStartDate(ev)}
      ref={this.startDateSpan}></input>
    const endInput = 
      <input className='optionsInput endDate' 
      value={this.state.info.endDate} 
      onChange={(ev) => this.changeEndDate(ev)}>
      </input>
    // task with info and subtasks
    return (
      <li 
      className={'task ' + this.state.info.important + 
        ' ' + this.state.info.complete + 
        ' ' + this.state.info.maybe + 
        ' ' + headingClass + 
        ' ' + hasTimes + 
        ' ' + this.state.info.collapsed} 
      onClick={() => {selectTask(this)}}
      >
        <span className='info' onClick={(ev) => this.displayOptions(ev)}
          ref={this.optionsButton}>
          <div className={'options ' + this.state.displayOptions}>
            <div className='buttonBar' style={{width: '100%', 
              alignContent: 'center'}}>
              <button 
                className={'button ' + this.state.info.complete}
                onClick={this.toggleComplete}>
                √</button>
              <button 
                className={'button ' + this.state.info.important}
                onClick={this.toggleImportant}>
                !</button>
              <button 
                className={'button ' + this.state.info.maybe}
                onClick={this.toggleMaybe}>
                ?</button>
              <button 
                className={'button'}
                onClick={this.deleteThis}>
                x</button>
              <button 
                className={'button'}
                onClick={() => {
                  newTask('task');
                  this.displayOptions('hide');
                }}>
                +</button>
              <button 
                className={'button'}
                onClick={() => this.toggleCollapse()}>
                {'[]'}</button>
            </div>
            {this.state.riverTask &&
              <div className='buttonBar' style={{width: '100%', 
              alignContent: 'center'}}>
                <button 
                  className={'button repeatButton ' + 
                  this.state.repeats['Mon']} 
                  onClick={() => this.changeRepeat('Mon')}>M</button>
                <button 
                  className={'button repeatButton ' + 
                  this.state.repeats['Tue']} 
                  onClick={() => this.changeRepeat('Tue')}>T</button>
                <button 
                  className={'button repeatButton ' + 
                  this.state.repeats['Wed']} 
                  onClick={() => this.changeRepeat('Wed')}>W</button>
                <button 
                  className={'button repeatButton ' + 
                  this.state.repeats['Thu']} 
                  onClick={() => this.changeRepeat('Thu')}>R</button>
                <button 
                  className={'button repeatButton ' + 
                  this.state.repeats['Fri']} 
                  onClick={() => this.changeRepeat('Fri')}>F</button>
                <button 
                  className={'button repeatButton ' + 
                  this.state.repeats['Sat']} 
                  onClick={() => this.changeRepeat('Sat')}>S</button>
                <button 
                  className={'button repeatButton ' + 
                  this.state.repeats['Sun']} 
                  onClick={() => this.changeRepeat('Sun')}>U</button>
              </div>
            }
            {startInput}
            {endInput}
          </div>
        </span>
        <span className='optionsSpan startDate'>{this.state.info.startDate}</span>
        <span className='optionsSpan endDate'>{this.state.info.endDate}</span>
        <textarea className='editBar' value={this.state.title}
          onChange={(ev) => this.changeTitle(ev)} ref={this.editBar}
          style={{height: this.state.editHeight}}></textarea>
        <span className='editBar editSpan'
          ref={this.heightSpan} 
          style={{width: this.state.editWidth}}>
          {this.state.title + 'x'}</span>
        <TaskList ref={this.taskList} subtasks={this.state.subtasks} 
          parent={this} />
      </li>
    )
  }
}

function newTask(type) {
  // create new task after selected
  let el;
  if (type == 'task' || !selected.state.parent) {
    el = selected;
  } else if (type == 'list' || selected.state.parent) {
    el = selected.state.parent;
  }
  const today = new Date();
  const now = today.getTime();
  const newTask = {
    id: String(now),
    info: {complete: '', startDate: '', endDate: ''},
    title: '',
    subtasks: [],
  }
  copiedTask = newTask;
  pasteTask(type);
}

function selectTask(el, force) {
  // make this task selected
  if (preventSelect) return
  if (el instanceof TaskList) {
    return
  }
  preventSelect = true;
  setTimeout(function () { preventSelect = false }, 250);
  console.log(selected);
  if (selected == el && !force) {
    console.log('selected and el are the same');
    return;
  }
  if (selected) {
    save(selected, 'task');
  }
  if (selected instanceof Task && el != selected) {
    selected.displayOptions({target: undefined}, 'hide');
  }
  selected = el;
  if (el instanceof Task) {
    el.editBar.current.focus();
  }
}

function save(task, saveType) {
  // save the new data
  let parent = task.props.parent;
  let parents = [task.props.id];
  while (parent && parent.props.id) {
    parents.push(parent.props.id);
    parent = parent.props.parent;
  }
  parents = parents.reverse();
  let parentObject = data[parents[0]];
  let endIndex;
  if (saveType === 'task') {
    // save the TaskList which this task is in
    endIndex = 0
  } else if (saveType === 'list' || !saveType) {
    // save this task's data
    endIndex = -1
  }
  for (let parentId of parents.slice(1, parents.length - endIndex)) {
    parentObject = parentObject.subtasks.find(x => x.id === parentId);
  }
  if (!parentObject) return;
  parentObject.title = task.state.title;
  parentObject.subtasks = task.state.subtasks;
  parentObject.info = task.state.info;
  localStorage.setItem('data', JSON.stringify(data));
}

function cutTask() {
  if (!selected || selected instanceof List) return;
  copyTask();
  selected.deleteThis();
}

function copyTask() {
  if (!selected || selected instanceof List) return;
  const state = selected.state;
  copiedTask = {title: state.title, id: selected.props.id, 
    info: {...state.info}, subtasks: state.subtasks.concat()};
}

function pasteTask(type) {
  if (!selected) return;
  if (selected instanceof List || type === 'task') {
    const subtasks = selected.state.subtasks;
    subtasks.splice(0, 0, copiedTask);
    selected.setState({subtasks: subtasks});
    save(selected, 'task');
  } else if (selected instanceof Task || type === 'list') {
    const subtasks = selected.state.parent.state.subtasks;
    const insertIndex = subtasks.findIndex(x => x.id == selected.props.id) + 1;
    subtasks.splice(insertIndex, 0, copiedTask);
    selected.state.parent.setState({subtasks: subtasks});
    save(selected, 'list');
  }
}

function backup() {
  const now = new Date();
  // fs.writeFile('file.txt', JSON.stringify('data'), 
}

function keyComms(ev) {
  if (ev.ctrlKey && ev.shiftKey) {
    switch (ev.key) {
      case 'V':
        pasteTask('task');
        break;
      case 'N':
        newTask('task');
        break;
      default:
        break;
    }
  } else if (ev.ctrlKey) {
    switch (ev.key) {
      case 'x':
        cutTask();
        break;
      case 'c':
        copyTask();
        break;
      case 'v':
        pasteTask();
        break;
      case 'n':
        newTask();
        break;
      case 'Backspace':
        if (selected && selected instanceof Task) {
          selected.deleteThis();
        }
      case 'i':
        if (selected && selected instanceof Task) {
          selected.displayOptions({target: $('<p></p>')});
          if (selected.state.displayOptions === 'show') {
            selected.startDateSpan.current.focus();
          } else {
            selected.editBar.current.focus();
          }
        };
        break;
      default:
        break;
    }
  } else if (!ev.metaKey && !ev.ctrlKey && !ev.altKey) {
    switch (ev.key) {
      case 'Escape':
        ev.preventDefault();
        document.activeElement.blur();
        selectTask(undefined);
        break;
      default:
        break;
    }
  }
}

function init() {
  selected = undefined;
  width = Math.floor(window.innerWidth / 200);
  prevWidth = Math.floor(window.innerWidth / 200);
  app = React.createRef();
  ReactDOM.render(<App ref={app} />, document.getElementById('root'));
  $(document).on('keydown', keyComms);
}

try {
  init()
} catch (err) {
  data = resetData;
  init();
}
