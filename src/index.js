import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import $ from 'jquery';
import './style.css';
import { render } from '@testing-library/react';
import "react-datepicker/dist/react-datepicker.css";
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { Draggable } from 'react-beautiful-dnd';
import timerSnd from './snd/timer.mp3';
import popSnd from './snd/pop.mp3';
import startSnd from './snd/start.mp3';

var themes = {
  'earth-day': {
    "--font": "var(--fontSize) 'Caveat', Cochin, cursive",
    "--fontSize": "26px",
    "--fontWeight": "400",
    "--bold": "600",
    "--background": "rgb(218, 221, 216)",
    "--border": "rgba(60, 52, 31, 0.3)",
    "--select": "rgb(85, 107, 47)",
    "--event": "rgba(85, 107, 47, 0.3)",
    "--foreground": "rgb(59, 60, 54)",
    "--midground": "rgba(59, 60, 54, 0.1)",
    "--padding": "14px",
    "--important": "rgb(14, 41, 48)",
    "--maybe": "rgba(14, 41, 48, 0.5)",
    "--menufont": "18px Dosis",
    "--startDate": "rgba(14, 41, 48, 0.8)",
    "--endDate": "rgb(14, 41, 48)",
    "--headingSize": "125%",
    "--lineSpacing": "-5px",
    "--frontWidth": "2.5em",
    "--bank": "rgba(59, 60, 54, 0.1)",
    "--river": "rgba(85, 107, 47, 0.1)",
  },
  'earth-night': {
    "--font": "var(--fontSize) 'Caveat', Cochin, cursive",
    "--fontSize": "26px",
    "--fontWeight": "400",
    "--bold": "600",
    "--background": "rgb(35, 38, 33)",
    "--border": "rgba(224, 223, 225, 0.3)",
    "--select": "rgb(186, 208, 149)",
    "--event": "rgba(186, 208, 149, 0.3)",
    "--foreground": "rgb(218, 222, 200)",
    "--midground": "rgba(59, 60, 54, 0.1)",
    "--padding": "14px",
    "--important": "rgb(85, 107, 47)",
    "--maybe": "rgba(85, 107, 47, 0.5)",
    "--menufont": "18px Dosis",
    "--startDate": "rgba(85, 107, 47, 0.8)",
    "--endDate": "rgb(85, 107, 47)",
    "--headingSize": "125%",
    "--lineSpacing": "-5px",
    "--frontWidth": "2.5em",
    "--bank": "rgba(218, 222, 200, 0.1)",
    "--river": "rgba(186, 208, 149, 0.1)",
  },
  'fire-day': {
    "--font": "var(--fontSize) 'Josefin Sans', Cochin, sans-serif",
    "--fontSize": "23px",
    "--fontWeight": "300",
    "--bold": "500",
    "--background": "rgb(230, 230, 250)",
    "--border": "rgba(53, 3, 58, 0.3)",
    "--select": "rgb(242, 172, 229)",
    "--event": "rgba(251, 217, 253, 0.3)",
    "--foreground": "rgb(53, 3, 58)",
    "--midground": "rgba(200, 200, 230, 0.1)",
    "--padding": "14px",
    "--important": "rgb(226, 156, 210)",
    "--maybe": "rgba(212, 93, 194, 0.5)",
    "--menufont": "18px Dosis",
    "--startDate": "rgba(226, 156, 210, 0.8)",
    "--endDate": "rgb(226, 156, 210)",
    "--headingSize": "120%",
    "--lineSpacing": "-5px",
    "--frontWidth": "2.5em",
    "--bank": "rgba(53, 3, 58, 0.1)",
    "--river": "rgba(242, 172, 229, 0.1)",
  },
  'fire-night': {
    "--font": "var(--fontSize) 'Josefin Sans', Cochin, sans-serif",
    "--fontSize": "23px",
    "--fontWeight": "300",
    "--bold": "500",
    "--background": "rgb(5, 5, 26)",
    "--border": "rgba(212, 112, 162, 0.3)",
    "--select": "rgb(183, 104, 162)",
    "--event": "rgba(183, 104, 162, 0.3)",
    "--foreground": "rgb(248, 197, 252)",
    "--midground": "rgba(40, 6, 34, 0.1)",
    "--padding": "14px",
    "--important": "rgb(226, 156, 210)",
    "--maybe": "rgba(212, 93, 194, 0.5)",
    "--menufont": "18px Dosis",
    "--startDate": "rgba(226, 156, 210, 0.8)",
    "--endDate": "rgb(226, 156, 210)",
    "--headingSize": "125%",
    "--lineSpacing": "-5px",
    "--frontWidth": "2.5em",
    "--bank": "rgba(248, 197, 252, 0.1)",
    "--river": "rgba(183, 104, 162, 0.1)",
  },
  'sky-day': {
    "--font": "var(--fontSize) 'Helvetica Neue', Cochin, sans-serif",
    "--fontSize": "22px",
    "--fontWeight": "100",
    "--bold": "300",
    "--background": "#E4EDF1",
    "--border": "rgba(21, 35, 40, 0.3)",
    "--select": "rgb(119, 152, 171)",
    "--event": "rgba(119, 152, 171, 0.3)",
    "--foreground": "rgb(52, 64, 85)",
    "--midground": "rgba(128, 128, 128, 0.1)",
    "--padding": "14px",
    "--important": "rgb(29, 41, 81)",
    "--maybe": "rgba(29, 41, 81, 0.5)",
    "--menufont": "18px Dosis",
    "--startDate": "rgba(29, 41, 81, 0.8)",
    "--endDate": "rgb(29, 41, 81)",
    "--headingSize": "125%",
    "--lineSpacing": "0px",
    "--frontWidth": "3em",
    "--bank": "rgba(52, 64, 85, 0.1)",
    "--river": "rgba(119, 152, 171, 0.1)",
  },
  'sky-night': {
    "--font": "var(--fontSize) 'Helvetica Neue', Cochin, sans-serif",
    "--fontSize": "22px",
    "--fontWeight": "100",
    "--bold": "300",
    "--background": "rgb(14, 23, 27)",
    "--border": "rgba(36, 40, 43, 0.3)",
    "--select": "rgb(83, 117, 136)",
    "--event": "rgba(59, 75, 84, 0.3)",
    "--foreground": "rgb(170, 182, 203)",
    "--midground": "rgba(128, 128, 128, 0.1)",
    "--padding": "14px",
    "--important": "rgb(173, 185, 225)",
    "--maybe": "rgba(173, 185, 225, 0.5)",
    "--menufont": "18px Dosis",
    "--startDate": "rgba(173, 185, 225, 0.8)",
    "--endDate": "rgb(173, 185, 225)",
    "--headingSize": "125%",
    "--lineSpacing": "0px",
    "--frontWidth": "3em",
    "--bank": "rgba(170, 182, 203, 0.1)",
    "--river": "rgba(83, 117, 136, 0.1)",
  },
  'space-day': {
    "--font": "var(--fontSize) 'Cormorant Garamond', Cochin, serif",
    "--fontSize": "24px",
    "--fontWeight": "300",
    "--background": "rgb(201, 192, 187)",
    "--border": "rgba(128, 128, 128, 0.3)",
    "--select": "rgb(165, 113, 100)",
    "--event": "rgba(165, 113, 100, 0.3)",
    "--foreground": "rgba(59, 47, 47)",
    "--midground": "rgba(165, 113, 100, 0.5)",
    "--padding": "14px",
    "--important": "rgb(161, 122, 116)",
    "--maybe": "rgba(161, 122, 116, 0.5)",
    "--menufont": "18px Dosis",
    "--startDate": "rgba(161, 122, 116, 0.8)",
    "--endDate": "rgb(161, 122, 116)",
    "--bold": "600",
    "--headingSize": "125%",
    "--lineSpacing": "-5px",
    "--frontWidth": "2.5em",
    "--bank": "rgba(59, 47, 47, 0.1)",
    "--river": "rgba(165, 113, 100, 0.1)",
  },
  'space-night': {
    "--font": "var(--fontSize) 'Cormorant Garamond', Cochin, serif",
    "--fontSize": "24px",
    "--fontWeight": "300",
    "--background": "rgb(0, 0, 0)",
    "--border": "rgb(128, 128, 128, 0.3)",
    "--select": "rgb(101, 138, 149)",
    "--event": "rgba(101, 138, 149, 0.3)",
    "--foreground": "rgb(191, 193, 194)",
    "--midground": "rgba(101, 138, 149, 0.1)",
    "--padding": "14px",
    "--important": "skyblue",
    "--maybe": "darkblue",
    "--menufont": "18px Dosis",
    "--startDate": "rgba(135,206,235, 0.8)",
    "--endDate": "rgb(135,206,235)",
    "--bold": "600",
    "--headingSize": "125%",
    "--lineSpacing": "-5px",
    "--frontWidth": "2.5em",
    "--bank": "rgba(191, 193, 194, 0.1)",
    "--river": "rgba(101, 138, 149, 0.1)",
  },
  'water-day': {
    "--font": "var(--fontSize) 'Roboto Mono', Cochin, monospace",
    "--fontSize": "19px",
    "--fontWeight": "100",
    "--background": "rgb(188, 212, 230)",
    "--border": "rgba(36, 40, 43, 0.3)",
    "--select": "rgb(64, 71, 77)",
    "--event": "rgba(64, 71, 77, 0.3)",
    "--foreground": "rgb(10, 10, 10)",
    "--midground": "rgba(64, 71, 77, 0.1)",
    "--padding": "14px",
    "--important": "rgb(41, 74, 112)",
    "--maybe": "rgba(41, 74, 112, 0.5)",
    "--menufont": "18px Dosis",
    "--startDate": "rgb(41, 74, 112, 0.8)",
    "--endDate": "rgb(41, 74, 112)",
    "--bold": "400",
    "--headingSize": "1.15em",
    "--lineSpacing": "0px",
    "--frontWidth": "3.5em",
    "--bank": "rgba(10, 10, 10, 0.1)",
    "--river": "rgba(64, 71, 77, 0.1)",
  },
  'water-night': {
    "--font": "var(--fontSize) 'Roboto Mono', Cochin, monospace",
    "--fontSize": "19px",
    "--fontWeight": "100",
    "--background": "rgb(31, 40, 52)",
    "--border": "rgba(176, 194, 212, 0.3)",
    "--select": "rgb(145, 163, 176)",
    "--event": "rgba(145, 163, 176, 0.3)",
    "--foreground": "whitesmoke",
    "--midground": "rgba(145, 163, 176, 0.1)",
    "--padding": "14px",
    "--important": "rgb(143, 176, 214)",
    "--maybe": "rgba(143, 176, 214, 0.5)",
    "--menufont": "18px Dosis",
    "--startDate": "rgba(143, 176, 214, 0.8)",
    "--endDate": "rgb(143, 176, 214)",
    "--bold": "400",
    "--headingSize": "1.15em",
    "--lineSpacing": "0px",
    "--frontWidth": "3.5em",
    "--bank": "rgba(245, 245, 245, 0.1)",
    "--river": "rgba(145, 163, 176, 0.1)",
  }
}

var resetData = {
  bank:
  {
    info: { index: 0 }, subtasks: [
      { id: '1', title: 'first', subtasks: [], info: {} }
    ]
  },
  river:
  {
    info: { index: 0 }, subtasks: [
      {
        id: String(new Date().getTime()),
        title: new Date().toDateString(), subtasks: [], info: {}
      }
    ]
  },
  settings: {
    repeats: {
      'Mon': [], 'Tue': [], 'Wed': [], 'Thu': [],
      'Fri': [], 'Sat': [], 'Sun': [],
    },
    deadlines: {},
    startdates: {},
    theme: 'space',
    mode: 'night',
    focused: '',
    hideComplete: '',
  }
};

var data;
try {
  data = !localStorage.getItem('data') ? resetData :
    JSON.parse(localStorage.getItem('data'));
} catch (err) {
  data = resetData;
}


var selected;
var preventSelect;
var copiedTask;
var width;
var prevWidth;
var app;
var preventReturn;
var zoomed;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideComplete: data.settings.hideComplete,
      bank: React.createRef(),
      river: React.createRef(),
      theme: data.settings.theme,
      mode: data.settings.mode,
      focused: data.settings.focused,
      popSnd: new Audio(popSnd),
      zoomed: '',
      disableSelect: '',
    };
  }
  toggleComplete() {
    if (this.state.hideComplete == '') {
      var hideComplete = 'hideComplete';
    } else {
      var hideComplete = '';
    }
    this.setState({ hideComplete: hideComplete });
    saveSetting('hideComplete', hideComplete);
    updateAllSizes();
  }
  onDragEnd = result => {
    const { destination, source, draggableId } = result;
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
      listObjs.push(app.current.state[listSplit[0]]);
      listObjs.push(listObjs[0].current.frames.find(x =>
        x.current.props.id == listSplit[1]));
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
    save(sourceItem.current);
    save(destItem.current);
    selected = undefined;
  }
  render() {
    this.statusBar = React.createRef();
    return (
      <>
        <StatusBar parent={this} ref={this.statusBar} />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className={'container ' + this.state.hideComplete + ' ' + 
          this.state.zoomed + ' ' + this.state.disableSelect}>
            <Frame id='bank' info={{...data.tasks['bank'].info, 
              focused: data.settings.focused}}
              subtasks={data.tasks['bank'].subtasks} ref={this.state.bank} />
            <Frame id='river' info={{...data.tasks['river'].info, 
              focused: data.settings.focused}}
              subtasks={data.tasks['river'].subtasks} ref={this.state.river} />
          </div>
        </DragDropContext>
      </>
    )
  }
}

class StatusBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchString: '', foundTasks: {} };
  }
  search(ev) {
    if (this.state.searchString === '') {
      this.searches = {...data.tasks}; 
    }
    this.setState({ searchString: ev.target.value });
    for (let x of Object.keys(this.searches)) {
      if (!new RegExp(this.state.searchString, 'i').test(
        this.searches[x].title) ||
        this.searches[x].info.complete === 'complete') {
        delete this.searches[x];
      }
    }
    // id : {title, subtasks, info}
    this.setState({ foundTasks: this.searches });
  }
  goToSearch(id) {
    preventReturn = true;
    preventSelect = true;
    var idList = [id];
    function buildParents(otherId) {
      for (let x of Object.keys(data.tasks)) {
        if (data.tasks[stripR(x)].subtasks.includes(otherId)) {
          idList.splice(0, 0, x);
          buildParents(x);
          return;
        }
      }
    }
    buildParents(id);
    const frame = app.current.state[idList[0]].current;
    const listIndex = frame.state.subtasks.findIndex(x => x === idList[1]);
    frame.changeIndex(listIndex, true);
    setTimeout(() => {
      const list = frame.frames[0].current;
      let foundTask = list;
      let i = 2;
      console.log(foundTask);
      while (idList.length > i) {
        // find in tasks starting at index 2 (if it's there)
        let taskId = idList[i];
        let taskIndex;
        if (foundTask.subtasksCurrent && 
          foundTask.subtasksCurrent.length > 0) {
          taskIndex = foundTask.subtasksCurrent
            .findIndex(x => x === taskId);
        } else {
          taskIndex = foundTask.state.subtasks
            .findIndex(x => x === taskId);
        }
        foundTask = foundTask.taskList.current
          .subtaskObjects[taskIndex].current;
        i ++;
      }
      preventSelect = false;
      selectTask(foundTask);
      this.setState({ searchString: '', foundTasks: {} });
      // go through IDs and find the trace paths
      setTimeout(() => {
        preventReturn = false;
      }, 100);
    }, 100);
  }
  componentDidMount() {
    setTimeout(goToToday, 200);
  }
  goToFirst() {
    this.goToSearch($($(this.searchResults.current)
      .children()[0]).attr('value'));
  }
  render() {
    this.search = this.search.bind(this);
    this.goToSearch = this.goToSearch.bind(this);
    this.goToFirst = this.goToFirst.bind(this);
    this.searchResults = React.createRef();
    this.searchBar = React.createRef();
    this.options = React.createRef();
    this.functions = React.createRef();
    return (
      <div className='statusBar'>
        <span class='title'><span class='r'>River</span>
            <span class='b'>Bank</span></span>
        <div style={{
          display: 'flex', flexDirection: 'column',
          position: 'relative'
        }}>
          <input 
            ref={this.searchBar}
            className='searchBar' onChange={(ev) => this.search(ev)}
            value={this.state.searchString}
            onKeyDown={(ev) => {
              if (ev.key === 'Backspace') {
                ev.preventDefault();
                this.setState({ searchString: '', foundTasks: {} });
              } else if (ev.key === 'Enter') {
                ev.preventDefault();
                if ($(this.searchResults.current).children().length > 0) {
                  this.goToFirst();
                }
              }
            }}
            placeholder='search'></input>
          {this.state.searchString.length > 0 &&
            <select ref={this.searchResults} onChange={() => {
              this.goToSearch(this.searchResults.current.value)
            }} style={{ width: '130px' }}>
              {Object.keys(this.state.foundTasks).map(x =>
                <option key={x} value={x}>
                  {this.state.foundTasks[x].title}
                </option>)}
            </select>
          }
        </div>
        <Timer />
        <div className='buttonBar nowrap'>
          <select ref={this.functions} style={{width: '48px'}}
            onChange={() => {
            eval(this.functions.current.value);
            this.functions.current.value = '';
          }}>
            <option value="" selected disabled hidden>functions</option>
            <option value='newTask()'>
              new task (return)</option>
            <option value='cutTask()'>
              cut (ctrl-x)</option>
            <option value='copyTask()'>
              copy (ctrl-c)</option>
            <option value='copyTask(true)'>
              mirror (ctrl-shift-C)</option>
            <option value='pasteTask()'>
              paste (ctrl-v)</option>
            <option value="deleteTask()">
              delete (ctrl-delete)</option>
          </select>
          <select ref={this.options} onChange={() => {
            eval(this.options.current.value);
            this.options.current.value = '';
          }}
            style={{width: '40px'}}>
            <option value="" selected disabled hidden>settings</option>
            <option value='focus()'>toggle focus (ctrl-f)</option>
            <option value='app.current.toggleComplete()'>
              show/hide complete (ctrl-h)</option>
            <option value='backup()'>backup</option>
            <option value='restore()'>restore</option>
            <option value='fixDates()'>fix dates</option>
            <option value='reset()'>reset</option>
            <option value='toggleMode()'>toggle day/night</option>
            <option value='setTheme("space")'>theme: space</option>
            <option value='setTheme("sky")'>theme: sky</option>
            <option value='setTheme("water")'>theme: water</option>
            <option value='setTheme("earth")'>theme: earth</option>
            <option value='setTheme("fire")'>theme: fire</option>
          </select>
          <ListMenu />
        </div>
      </div>
    )
  }
}

class ListMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { bankLists: props.bankLists, riverLists: props.riverLists };
  }
  goToList(type) {
    if (type === 'river') {
      searchDate(this.riverLister.current.value);
    } else if (type === 'bank') {
      var parent = app.current.state.bank.current;
      var list = this.bankLister;
      parent.changeIndex(Number(list.current.value), true);
    }
    
    if (type === 'river') {
      this.riverLister.current.value = '';
    } else if (type === 'bank') {
      this.bankLister.current.value = '';
    }
  }
  render() {
    this.riverLister = React.createRef();
    this.bankLister = React.createRef();
    return (
      <>
        <select ref={this.bankLister} onChange={() => this.goToList('bank')}
          style={{width: '25px'}}>
          <option value="" selected disabled hidden>lists</option>
          {data.tasks['bank'].subtasks.filter(
            x => data.tasks[x].title != '--')
            .map((x, index) =>
            <option value={index}>{data.tasks[x].title}</option>)}
        </select>
        <select ref={this.riverLister} onChange={() => {
          if (this.riverLister.current.value == 'today') {
            goToToday();
            this.riverLister.current.value = '';
          } else {
            this.goToList('river')
          }
        }}
          style={{width: '30px'}}>
          <option value="" selected disabled hidden>dates</option>
          <option value='today'>today (ctrl-t)</option>
          {data.tasks['river'].subtasks.filter(x => new Date(
            data.tasks[x].title).getTime() >= 
            new Date().getTime())
            .map((x) =>
            <option value={data.tasks[x].title}>
            {data.tasks[x].title}</option>)}
        </select>
      </>
    )
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      seconds: 0, 
      audio: new Audio(timerSnd),
      start: new Audio(startSnd),
      startTime: undefined,
      ended: false,
    };
      
  }
  startTimer(val) {
    const endTime = 
      new Date(new Date().getTime() + val * 60 * 1000).getTime();
    this.setState({ endTime: endTime, seconds: val * 60 });
    this.state.start.play();
    this.play();
  }
  play(stopwatch, backwards) {
    var permission = Notification.requestPermission();
    const multiplier = backwards ? -1 : 1;
    clearInterval(this.interval);
    this.setState({ ended: false });
    if (stopwatch == 'stopwatch') {
      var add = 1;
    } else {
      var add = -1;
    }
    this.interval = setInterval(() => {
      this.setState({ seconds: Math.ceil((this.state.endTime - 
        new Date().getTime()) / 1000) });
      if (this.state.seconds <= 0 && this.state.ended === false ) {
        this.end();
      }
    }, 1000);
  }
  end() {
    this.setState({ play: true, ended: true });
    this.state.audio.play();
    this.options.current.value = '';
    var alert = new Notification('timer complete');
  }
  playPause() {
    clearInterval(this.interval);
    this.setState({ seconds: 0 });
    this.options.current.value = '';
  }
  render() {
    this.startTimer = this.startTimer.bind(this);
    this.playPause = this.playPause.bind(this);
    this.play = this.play.bind(this);
    this.audioRef = React.createRef();
    this.options = React.createRef();
    if (this.state.seconds >= 0) {
      var timeReadout = Math.floor(this.state.seconds / 60) + ':' +
        String(this.state.seconds -
          (Math.floor(this.state.seconds / 60) * 60))
          .padStart(2, '0')
    } else {
      if ((this.state.seconds / 60) === Math.floor(this.state.seconds / 60)
        && this.state.seconds != 0) {
        // right on minute
        var timeReadout = '-' +
          (-1 * (Math.floor(this.state.seconds / 60))) + ':00'
      } else {
        var timeReadout = '-' +
          (-1 * (Math.floor(this.state.seconds / 60) + 1)) + ':' +
          String(60 - (this.state.seconds -
            (Math.floor(this.state.seconds / 60) * 60)))
            .padStart(2, '0')
      }
    }
    return (
      <>
        <input className='timerBar' readOnly={true}
          value={timeReadout}></input>
        <select ref={this.options} onChange={() => {
          if (this.options.current.value == 'clear') {
            this.playPause();
            this.options.current.value = '';
          } else {
            this.startTimer(this.options.current.value);
            this.options.current.value = '';
          }
        }}
          style={{width: '30px'}}>
          <option value="" selected disabled hidden>timer</option>
          <option value={'clear'}>--:--</option>
          <option value={50}>50:00</option>
          <option value={25}>25:00</option>
          <option value={15}>15:00</option>
          <option value={10}>10:00</option>
          <option value={5}>5:00</option>
          <option value={0.1}>0:05</option>
        </select>
      </>
    )
  }
}

class Frame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subtasks: props.subtasks, info: props.info,
      width: processWidth(props.info.focused),
      zoomed: '',
    };
    if (props.id === 'river') {
      this.state.deadlines = data.settings.deadlines;
      this.state.startdates = data.settings.startdates;
      this.state.repeats = data.settings.repeats;
    }
  }
  changeIndex(val, set) {
    let newIndex;
    if (set === true) {
      newIndex = val;
    } else {
      newIndex = this.state.info.index + val;
    }
    if (newIndex > 0 && 
      data.tasks[this.state.subtasks[newIndex - 1]].title === '--') {
      return;
    }
    if (newIndex < 0) newIndex = 0
    this.setState(prevState => ({
      info: { ...prevState.info, index: newIndex }
    }));
  }
  render() {
    const lastDate = new Date(
      data.tasks[this.state.subtasks[this.state.subtasks.length - 1]].title);
    let j = 0;
    let c = Math.floor(Math.random() * 1000);
    while (this.state.subtasks.length < this.state.info.index + 7) {
      j ++;
      if (this.props.id === 'bank') {
        var title = '--';
      } else if (this.props.id === 'river') {
        const date = new Date(lastDate.getTime());
        date.setDate(lastDate.getDate() + j);
        var title = date.toDateString();
      }
      const now = new Date();
      const id = now.getTime();
      // preventing overlap
      let i = Math.floor(Math.random() * 1000) + c;
      while (data.tasks[String(id + i)] !== undefined) {
        i += 1;
      }
      data.tasks[String(id + i)] = {title: title, subtasks: [], info: {}};
      this.state.subtasks.push(String(id + i));
    }
    function resizeCheck() {
      if (this.state.width != processWidth(this.state.info.focused)) {
        this.setState({ width: processWidth(this.state.info.focused) });
      }
    }
    let endIndex = this.state.info.index + this.state.width;
    this.changeIndex = this.changeIndex.bind(this);
    resizeCheck = resizeCheck.bind(this);
    this.frames = [];
    window.addEventListener('resize', resizeCheck);
    const shownLists =
      this.state.subtasks.slice(this.state.info.index, endIndex);
    return (
      <div id={this.props.id}
        className={'frame ' + this.state.info.focused + ' ' + 
        this.state.zoomed}>
        <button className='changeButton'
          onClick={() => this.changeIndex(this.state.width * -1)}>&lt;
        </button>
        {shownLists.map(x => {
          this.frames.push(React.createRef());
          const task = data.tasks[x];
          if (this.props.id === 'river') {
            // render state correctly in original lists
            return (
              <List key={x} id={x} title={task.title}
                subtasks={task.subtasks} parent={this}
                deadlines={this.state.deadlines[task.title]}
                startdates={this.state.startdates[task.title]}
                repeats={this.state.repeats[dateFormat(task.title)
                  .slice(0, 3)]}
                ref={this.frames[this.frames.length - 1]} />
            )
          } else {
            return (
              <List key={x} id={x} title={task.title}
                subtasks={task.subtasks} parent={this}
                ref={this.frames[this.frames.length - 1]} />
            )
          }
        })}
        <button className='changeButton'
          onClick={() => this.changeIndex(this.state.width)}>&gt;</button>
      </div>
    );
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.taskList = React.createRef();
    this.state = {
      // filter subtasks here
      subtasks: props.subtasks.filter(x =>
        data.tasks[stripR(x)] &&
        !(x.charAt(0) === 'R' && !props.repeats.includes(x))), 
      title: props.title,
      info: {}, zoomed: ''
    };
    if (props.parent.props.id === 'river') {
      for (let task of props.repeats) {
        if (!this.state.subtasks.includes(task) && 
          !this.state.subtasks.includes(stripR(task))) {
          this.state.subtasks.push(task);
        }
      }
    }
  }
  changeTitle(ev) {
    this.setState({ title: ev.target.value });
  }
  render() {
    function selectThis() {
      selectTask(this);
    }
    selectThis = selectThis.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.listInput = React.createRef();
    this.subtasksCurrent = this.state.subtasks.filter(x =>
      !(x.charAt(0) === 'R' && !this.props.repeats.includes(x)));
    if (this.props.parent.props.id === 'river') {
      for (let task of this.props.repeats) {
        if (!this.subtasksCurrent.includes(task) && 
        !this.subtasksCurrent.includes(stripR(task))) {
          this.subtasksCurrent.push(task);
        }
      }
    }
    return (
      <div className={'list' + ' ' + this.state.zoomed} onClick={selectThis}>
        <div className='listInputBackground'>
          {this.props.parent.props.id === 'bank' ?
            <input className='listInput' value={this.state.title}
              onChange={this.changeTitle} ref={this.listInput}></input> :
            <>
              <div class='monthYear'>
                <span>{this.state.title.slice(4,8)}</span>
                <span>{this.state.title.slice(11)}</span>
              </div>
              <input readOnly className='listInput listTitle'
                value={dateFormat(this.state.title)} ref={this.listInput}>
                </input>
            </>
          }
        </div>
        <div className='listFrame'>
          {this.props.parent.props.id === 'river' &&
            this.props.deadlines &&
            <ul>
              {this.props.deadlines.map(x => {
                return <li
                  className='deadline' key={String(x)}
                  onClick={() => searchDate(data.tasks[stripR(x)].title, 'start')}>
                  {data.tasks[stripR(x)].title}</li>;
              })}
            </ul>}
          {this.props.parent.props.id === 'river' &&
            this.props.startdates &&
            <ul>
              {this.props.startdates.map(x => {
                return <li
                  className='startdate' key={String(x)}
                  onClick={() => searchDate(data.tasks[stripR(x)].title, 
                  'start')}>
                  {data.tasks[stripR(x)].title}</li>;
              })}
            </ul>}
          {<TaskList ref={this.taskList} subtasks={this.subtasksCurrent}
            parent={this} />}
        </div>
      </div>
    )
  }
}

class TaskList extends React.Component {
  render() {
    this.subtaskObjects = [];
    // subtasks are filtered for deleted tasks
    const tasksListed = this.props.subtasks.filter(x =>
      data.tasks[stripR(x)]).map((x, index) => {
      this.subtaskObjects.push(React.createRef());
      const task = (
        <Task
          key={x}
          id={x}
          info={data.tasks[stripR(x)].info}
          title={data.tasks[stripR(x)].title}
          subtasks={data.tasks[stripR(x)].subtasks}
          parent={this.props.parent}
          ref={this.subtaskObjects[this.subtaskObjects.length - 1]}
          index={index}
        />
      )
      return task;
    })
    let parent = this.props.parent;
    let id = [];
    while (parent) {
      id.push(parent.props.id);
      parent = parent.props.parent;
    }
    id = id.reverse().join('-');
    return (
      this.props.parent instanceof Task ?
      <ul className='listContent'>
        {tasksListed}
      </ul> :
      <Droppable droppableId={id}>
        {(provided) => {
          return (
            <ul className='listContent' {...provided.droppableProps}
              ref={provided.innerRef}>
              {tasksListed}
              {provided.placeholder}
            </ul>
          )
        }}
      </Droppable>
    )
  }
}

class Task extends React.Component {
  constructor(props) {
    super();
    this.state = {
      info: props.info, title: props.title,
      subtasks: props.subtasks.filter(x =>
        data.tasks[stripR(x)]), parent: props.parent,
      id: props.id, displayOptions: 'hide', riverTask: false,
      zoomed: ''
    };
    // TODO
    if (!this.state.info.startDate) this.state.info.startDate = ['--', '--'];
    if (!this.state.info.endDate) this.state.info.endDate = ['--', '--'];
    if (!this.state.info.notes) this.state.info.notes = '';
    if (!this.state.info.type) this.state.info.type = 'date';
    if (!this.state.info.collapsed) this.state.info.collapsed = '';
    if (!this.state.info.excludes) this.state.info.excludes = [];
    let parent = props.parent;
    while (parent.props.parent) {
      parent = parent.props.parent;
    }
  }
  displayOptions(ev, showHide) {
    save(this);
    if (this.freeze === true) return;
    console.trace();
    if (selected != this) {
      selectTask(this);
    }
    if (this.editBar.current) {
      this.editBar.current.focus();
    }
    if ($(ev.target).hasClass('options') ||
      $(ev.target).parent().hasClass('options')) {
      return
    }
    if (showHide === 'hide' || this.state.displayOptions === 'show') {
      this.setState({ displayOptions: 'hide' });
    } else if (showHide == 'show' || this.state.displayOptions === 'hide') {
      this.setState({ displayOptions: 'show' });
    }
  }
  changeTitle(ev) {
    this.setState({ title: ev.target.value });
    this.updateHeight();
  }
  updateHeight() {
    if (this.resizable != false) {
      this.editBar.current.style.height = '0px';
      this.editBar.current.style.height =
        (this.editBar.current.scrollHeight) + "px";
      this.resizable = false;
    }
    setTimeout(() => this.resizable = true, 100);
  }
  updateRiverDate(type, action) {
    // remove from startdates/deadlines
    var river = app.current.state.river.current;
    var date = new Date();
    var deadlineData;
    if (type === 'start') {
      if (this.state.info.startDate.includes('--')) return;
      deadlineData = river.state.startdates;
      date.setMonth(this.state.info.startDate[0] - 1);
      date.setDate(this.state.info.startDate[1]);
    } else if (type === 'end') {
      if (this.state.info.endDate.includes('--')) return;
      deadlineData = river.state.deadlines;
      date.setMonth(this.state.info.endDate[0] - 1);
      date.setDate(this.state.info.endDate[1]);
    }
    var dateString = date.toDateString();
    if (action === 'add') {
      if (!deadlineData[dateString]) { 
        deadlineData[dateString] = [this.props.id] }
      else { deadlineData[dateString].push(this.props.id) }
    } else if (action === 'remove') {
      if (!deadlineData[dateString]) return
      else { deadlineData[dateString].splice(deadlineData[dateString].findIndex(
        x => x === this.props.id), 1) };
    }
    // add to the things
    if (type === 'start') {
      river.setState( { startdates: { ...deadlineData }});
      saveSetting('startdates', deadlineData);
    } else if (type === 'end') {
      river.setState( { deadlines: { ...deadlineData }});
      saveSetting('deadlines', deadlineData);
    }
  }
  toggleComplete(change) {
    let status = this.state.info.complete
    if (status === 'complete') { status = '' }
    else { 
      status = 'complete';
      app.current.state.popSnd.play();
    }
    // excludes lets it put it in complete
    const repeats = app.current.state.river.current.state.repeats;
    let repeating = false;
    let parent = this.props.parent; /// find list it's in
    while (!parent instanceof List) {
      parent = parent.props.parent;
    }
    const excludes = this.state.info.excludes;
    for (let x of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      if (repeats[x].includes('R' + stripR(this.props.id))) {
        repeating = true;
        if (!excludes.includes(parent.state.title)) {
          excludes.push(parent.state.title);
        } else {
          excludes.splice(excludes
            .findIndex(x => x === parent.state.title), 1);
        }
      }
    }
    if (repeating === true) {
      this.setState({info: {...this.state.info, excludes: excludes}})
    } else {
      this.setState(prevState => ({
        info: { ...prevState.info, complete: status }
      }));
    }
    if (change != false) {
      this.displayOptions('hide');
    }
  }
  toggleImportant(change) {
    let status = this.state.info.important
    if (status === 'important') { status = '' }
    else { status = 'important' }
    this.setState(prevState => ({
      info: { ...prevState.info, important: status, maybe: '' }
    }));
    if (change != false) {
      this.displayOptions('hide');
    }
  }
  toggleMaybe(change) {
    let status = this.state.info.maybe
    if (status === 'maybe') { status = '' }
    else { status = 'maybe' }
    this.setState(prevState => ({
      info: { ...prevState.info, maybe: status, important: '' }
    }));
    if (change != false) {
      this.displayOptions('hide');
    }
  }
  toggleCollapse() {
    let status = this.state.info.collapsed
    if (status === 'collapsed') { status = '' }
    else { status = 'collapsed' }
    this.setState(prevState => ({
      info: { ...prevState.info, collapsed: status }
    }));
    this.displayOptions('hide');
  }
  deleteThis(removeData) {
    // TODO: remove deadline, repeat & startdate 
    // [[don't use global variable]]
    let parent = this.props.parent;
    while (parent.props.parent) {
      parent = parent.props.parent;
    }
    const subtasks = this.state.parent.state.subtasks;
    const currentTask = subtasks.findIndex(x => x == this.props.id);
    subtasks.splice(currentTask, 1);
    selected = this.state.parent;
    preventSelect = true;
    this.state.parent.setState({ subtasks: subtasks });
    if (removeData != false) {
      this.updateRiverDate('start', 'remove');
      this.updateRiverDate('end', 'remove');
      this.toggleRepeat('all', true);
      delete data.tasks[stripR(this.props.id)];
    }
    setTimeout(() => {
      preventSelect = false
      save(this.props.parent, 'list');
    }, 200);
  }
  componentDidMount() {
    this.editBar.current.focus();
    setTimeout(
      () => {
        if (this.editBar.current) this.updateHeight();
      }, 50
    )
    selectTask(this);
    this.resizable = true;
  }
  dateRender = (type) => {
    if (type === 'start') {
      var info = this.state.info.startDate;
    } else if (type === 'end') {
      var info = this.state.info.endDate;
    }
    if (this.state.info.type === 'event') {
      if (type === 'start') {
        return info[0] + ':' + String(info[1]).padStart(2, 0);
      } else if (type === 'end') {
        let string = '';
        if (info[0] != 0) string += info[0] + 'h';
        if (info[1] != 0) string += info[1] + 'm';
        return string;
      }
    } else if (this.state.info.type === 'date') {
      return info[0] + '-' + info[1];
    }
  }
  toggleRepeat = (dayInput, del) => {
    var days;
    if (dayInput === 'all') {
      days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else {
      days = [dayInput];
    }
    if (this.props.id.charAt(0) === 'R') {
      var repeatId = this.props.id;
    } else {
      var repeatId = 'R' + this.props.id;
    }
    const repeats = {...app.current.state.river.current.state.repeats};
    for (let day of days) {
      if (repeats[day].includes(repeatId) || del === true) {
        if (repeats[day].includes(repeatId)) {
          repeats[day].splice(repeats[day]
            .findIndex(x => x === repeatId), 1);
        }
      } else {
        repeats[day].push(repeatId);
      }
    }
    app.current.state.river.current.setState({
      repeats: repeats
    });
    saveSetting('repeats', repeats);
  }
  timeDrag = (ev, unit, type) => {
    var mouseup = () => {
      window.removeEventListener('mousemove', changeTime);
      app.current.setState({ disableSelect: '' });
      if (unit === 's') {
        this.setState({ displayOptions: 'show' });
      } else if (unit === 'e') {
        this.setState({ displayOptions: 'hide' });
      }
      this.freeze = true;
      setTimeout(() => this.freeze = false, 200);
      window.removeEventListener('mouseup', mouseup);
    }
    window.addEventListener('mouseup', mouseup);
    var change = 10;
    var pageY = ev.screenY;
    var updateTime = (value, unit) => {
      let val;
      let date;
      let infoOrig;
      let orig2;
      if (this.state.info.type === 'event') {
        if (type === 'start') {
          if (unit === 's') {
            infoOrig = this.state.info.startDate[0];
            orig2 = this.state.info.startDate[1];
            if (infoOrig === '--') {
              infoOrig = new Date().getHours();
            }
            if (orig2 === '--') {
              orig2 = 0;
            }
            val = infoOrig + value;
            if (val >= 24) {
              val -= 24;
            } else if (val < 0) {
              val = '--';
              orig2 = '--';
            }
            this.setState({ info: {...this.state.info, 
              startDate: [val, orig2]} });
          } else if (unit === 'e') {
            infoOrig = this.state.info.startDate[1];
            if (infoOrig === '--') {
              infoOrig = 0;
            }
            val = infoOrig + (value * 15);
            if (val >= 60) {
              val = 0;
              updateTime(1, 's');
            } else if (val < 0) {
              val = 45;
              updateTime(-1, 's');
            }
            orig2 = this.state.info.startDate[0];
            if (orig2 === '--') {
              orig2 = new Date().getHours();
            }
            this.setState({ info: {...this.state.info, 
              startDate: [orig2, val]} });
          }
        } else if (type === 'end') {
          if (unit === 's') {
            infoOrig = this.state.info.endDate[0];
            orig2 = this.state.info.endDate[1];
            if (orig2 === '--') {
              orig2 = 0;
            }
            if (infoOrig === '--') {
              infoOrig = 0;
            }
            val = infoOrig + value;
            if (val < 0) {
              val = '--';
              orig2 = '--';
            }
            this.setState({ info: {...this.state.info, 
              endDate: [val, orig2]} });
          } else if (unit === 'e') {
            if ((['--'].includes(this.state.info.endDate[0]) && 
              ['--'].includes(this.state.info.endDate[1]) && value == -1)) {
              return;
            }
            infoOrig = this.state.info.endDate[1];
            if (infoOrig === '--') {
              infoOrig = 0;
            }
            val = infoOrig + (value * 15);
            orig2 = this.state.info.endDate[0];
            if (orig2 === '--') {
              orig2 = 0;
            }
            if (val >= 60) {
              val = 0;
              updateTime(1, 's');
              orig2 = this.state.info.endDate[0];
            } else if (val < 0) {
              if (this.state.info.endDate[0] === 0) {
                val = '--';
                orig2 = '--';
              } else {
                val = 45;
                updateTime(-1, 's');
                orig2 = this.state.info.endDate[0];
              }
            }
            this.setState({ info: {...this.state.info, 
              endDate: [orig2, val]} });
          }
        }
      } else {
        // dates
        this.updateRiverDate(type, 'remove');
        if (unit === 's') {
          if (type === 'start') {
            infoOrig = this.state.info.startDate[0];
            orig2 = this.state.info.startDate[1];
          } else if (type === 'end') {
            infoOrig = this.state.info.endDate[0];
            orig2 = this.state.info.endDate[1];
          }
          if (infoOrig === '--' || Number.isNaN(infoOrig)) {
            infoOrig = new Date().getMonth() + 1;
          }
          if (orig2 === '--' || Number.isNaN(orig2)) {
            orig2 = 1;
          }
          val = infoOrig + value;
          if (val < new Date().getMonth() + 1 && value < 0) {
            val = '--';
            orig2 = '--';
          } else {
            date = new Date();
            date.setMonth(val - 1);
            val = date.getMonth() + 1;
          }
          if (type === 'start') {
            this.setState({ info: {...this.state.info,
              startDate: [val, orig2]
            }});
          } else if (type === 'end') {
            this.setState({ info: {...this.state.info,
              endDate: [val, orig2]
            }});
          }
        } else if (unit === 'e') {
          if (type === 'start') {
            infoOrig = this.state.info.startDate[1];
            orig2 = this.state.info.startDate[0];
          } else if (type === 'end') {
            infoOrig = this.state.info.endDate[1];
            orig2 = this.state.info.endDate[0];
          }
          if (infoOrig === '--' || Number.isNaN(infoOrig)) {
            infoOrig = new Date().getDate();
          }
          if (orig2 === '--' || Number.isNaN(orig2)) {
            orig2 = new Date().getMonth() + 1;
          }
          val = infoOrig + value;
          date = new Date();
          date.setMonth(orig2 - 1);
          date.setDate(val);
          date.setFullYear(new Date().getFullYear());
          if (date.getTime() < new Date().getTime()) {
            if (type === 'start') {
              this.setState({ info: {...this.state.info,
                startDate: ['--', '--']
              }});
            } else if (type === 'end') {
              this.setState({ info: {...this.state.info,
                endDate: ['--', '--']
              }});
            }
            return;
          }
          if (type === 'start') {
            this.setState({ info: {...this.state.info,
              startDate: [date.getMonth() + 1, date.getDate()]
            }});
          } else if (type === 'end') {
            this.setState({ info: {...this.state.info,
              endDate: [date.getMonth() + 1, date.getDate()]
            }});
          }
        }
        if (type === 'start' && !this.state.info.startDate.includes('--')) {
          this.updateRiverDate(type, 'add');
        } else if (type === 'end' && !this.state.info.endDate.includes('--')) {
          this.updateRiverDate(type, 'add');
        }
      }
    }
    var changeTime = (ev) => {
      var changeTime = false;
      if (ev.screenY < pageY - change) {
        pageY -= change;
        changeTime = -1;
      } else if (ev.screenY > pageY + change) {
        pageY += change;
        changeTime = 1;
      }
      if (changeTime !== false) {
        updateTime(changeTime, unit);
      }
    }
    app.current.setState({ disableSelect: 'disable-select' });
    window.addEventListener('mousemove', changeTime);
  }
  render() {
    // fuck react
    this.displayOptions = this.displayOptions.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.toggleImportant = this.toggleImportant.bind(this);
    this.toggleMaybe = this.toggleMaybe.bind(this);
    this.deleteThis = this.deleteThis.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.taskList = React.createRef();
    this.optionsButton = React.createRef();
    this.editBar = React.createRef();
    this.infoInput = React.createRef();
    const headingClass = this.state.subtasks.length > 0 ?
      'heading' : '';
    if (this.editBar.current) {
      this.editBar.current.style.height = '0px';
      this.editBar.current.style.height =
        (this.editBar.current.scrollHeight) + "px";
    }
    let parent = this;
    let id = [];
    while (parent) {
      id.push(parent.props.id);
      parent = parent.props.parent;
    }
    id = id.reverse().join('-');
    const hasTimes = this.state.info.type == 'event' &&
      !this.state.info.startDate.includes('--');
    let repeatsOn = {};
    for (let day of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      if (data.settings.repeats[day].map(x => stripR(x)).includes(
        stripR(this.props.id))) {
        repeatsOn[day] = 'repeatOn';
      } else {
        repeatsOn[day] = '';
      }
    }
    let completed = this.state.info.complete;
    parent = this.props.parent;
    // hacking completed for repeats
    while (!parent instanceof List) {
      parent = parent.props.parent;
    }
    if (this.state.info.excludes.includes(parent.state.title)) {
      completed = 'complete';
    }
    const listRender = (provided) => (<>
      <div className='taskContent'>
        <div className={'options ' + this.state.displayOptions}>
          <div className='buttonBar' style={{
            width: '100%',
            justifyContent: 'space-around',
            flexWrap: 'nowrap',
          }}>
            <div className='buttonBar'>
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
            <div className='buttonBar'>
              <button className={'button ' + repeatsOn['Mon']}
                onClick={() => {this.toggleRepeat('Mon');}}>M</button>
              <button className={'button ' + repeatsOn['Tue']} 
                onClick={() => {
                this.toggleRepeat('Tue');
              }}>T</button>
              <button className={'button ' + repeatsOn['Wed']} 
                onClick={() => {
                this.toggleRepeat('Wed');
              }}>W</button>
              <button className={'button ' + repeatsOn['Thu']} 
                onClick={() => {
                this.toggleRepeat('Thu');
              }}>R</button>
              <button className={'button ' + repeatsOn['Fri']} 
                onClick={() => {
                this.toggleRepeat('Fri');
              }}>F</button>
              <button className={'button ' + repeatsOn['Sat']} 
                onClick={() => {
                this.toggleRepeat('Sat');
              }}>S</button>
              <button className={'button ' + repeatsOn['Sun']} 
                onClick={() => {
                this.toggleRepeat('Sun');
              }}>U</button>
            </div>
          </div>
          <div className='timeDiv buttonBar' style={{
            flexWrap: 'nowrap',
          }}>
            <button className='button timeSwitch'
              onClick={() => {
                var changeValue = this.state.info.type === 'event' ? 
                  'date' : 'event';
                this.setState({info: {...this.state.info, 
                  type: changeValue,
                  startDate: ['--', '--'],
                  endDate: ['--', '--'],
                }})
              }}>
              {this.state.info.type}
            </button>
            <span className='startSpan start'>
              <span className='s' onMouseDown={(ev) => {
                this.timeDrag(ev, 's', 'start');
              }}>{this.state.info.startDate[0]}</span>
              <span className='m'>{
                this.state.info.type === 'event' ? ':' : '/'
              }</span>
              <span className='e' onMouseDown={(ev) => {
                this.timeDrag(ev, 'e', 'start');
              }}
              >{this.state.info.type === 'event' ?
                String(this.state.info.startDate[1]).padStart(2, 0) :
                this.state.info.startDate[1]
              }</span>
            </span>
            <span className='startSpan end'>
              <span className='s' onMouseDown={(ev) => {
                this.timeDrag(ev, 's', 'end');
              }}>{this.state.info.endDate[0]}</span>
              <span className='m'>{
                this.state.info.type === 'event' ? 'h' : '/'
              }</span>
              <span className='e' onMouseDown={(ev) => {
                this.timeDrag(ev, 'e', 'end');
              }}>{this.state.info.endDate[1]}</span>
              <span>{this.state.info.type === 'event' ?
                'm' : ''}</span>
            </span>
            <input ref={this.infoInput} className='infoSpan' placeholder='notes'
              style={{marginLeft: '5px'}} 
              value={this.state.info.notes}
              onChange={() => {
                this.setState({info: {...this.state.info,
                notes: this.infoInput.current.value}})
              }}></input>
          </div>
        </div>
        {provided ?
          !hasTimes ?
            <span className='info' 
              onClick={(ev) => this.displayOptions(ev)}
              ref={this.optionsButton}
              {...provided.dragHandleProps}></span> :
            <span className='startDate' 
              onClick={(ev) => this.displayOptions(ev)}
              ref={this.optionsButton}
              {...provided.dragHandleProps}>
              {this.dateRender('start')}
            </span>
          :
          !hasTimes ?
            <span className='info' 
              onClick={(ev) => this.displayOptions(ev)}
              ref={this.optionsButton}></span> :
            <span className='startDate' 
              onClick={(ev) => this.displayOptions(ev)}
              ref={this.optionsButton}>
              {this.dateRender('start')}
            </span>
        }
        <textarea className='editBar' value={this.state.title}
          onChange={(ev) => this.changeTitle(ev)} ref={this.editBar}
          spellCheck='false'></textarea>
        {this.state.info.notes.length == 0 &&
          <div style={{display: 'flex', flexDirection: 'column',
          marginRight: '5px'}}>
            {!hasTimes &&
              !this.state.info.startDate.includes('--') &&
              <span className='startDate'>
              {this.dateRender('start')}
            </span>}
            {!this.state.info.endDate.includes('--') &&
            <span className='endDate'>
              {this.dateRender('end')}
            </span>}
          </div>
        }
      </div>
      {this.state.info.notes.length > 0 &&
        <div className='taskInfo'>
          {this.state.info.notes.length > 0 &&
            <span className='notesSpan'>
              {this.state.info.notes}
            </span>}
          {!hasTimes &&
            !this.state.info.startDate.includes('--') &&
            <span className='startDate'>
            {this.dateRender('start')}
          </span>}
          {!this.state.info.endDate.includes('--') &&
          <span className='endDate'>
            {this.dateRender('end')}
          </span>}
        </div>
      }
      <TaskList ref={this.taskList} subtasks={this.state.subtasks}
        parent={this} />
    </>)
    return (
      this.props.parent instanceof List ?
        <Draggable draggableId={id} index={this.props.index}>
          {(provided) => {
            return (<li className={'task ' + this.state.info.important +
            ' ' + completed +
            ' ' + this.state.info.maybe +
            ' ' + headingClass +
            ' ' + this.state.info.type +
            ' ' + this.state.info.collapsed +
            ' ' + this.state.zoomed}
            onClick={() => { selectTask(this) }}
            {...provided.draggableProps}
            ref={provided.innerRef}>
            {listRender(provided)}
          </li>
          )}}
        </Draggable> :
        <li className={'task ' + this.state.info.important +
          ' ' + completed +
          ' ' + this.state.info.maybe +
          ' ' + headingClass +
          ' ' + this.state.info.type +
          ' ' + this.state.info.collapsed +
          ' ' + this.state.zoomed}
          onClick={() => { selectTask(this) }}>
          {listRender()}
        </li>
    )
  }
}

function stripR(x) {
  if (x.charAt(0) === 'R') {
    return x.slice(1);
  } else {
    return x;
  }
}

function deleteTask() {
  if (selected && selected instanceof Task) {
    selected.deleteThis();
  }
}

function newTask(type) {
  // create new task after selected
  if (!selected) return;
  let el;
  if (type == 'task' || !selected.state.parent) {
    el = selected;
  } else if (type == 'list' || selected.state.parent) {
    el = selected.state.parent;
  }
  const today = new Date();
  const now = today.getTime();
  const newTask = String(now);
  data.tasks[newTask] = {
    info: { complete: '', startDate: '', endDate: '' },
    title: '',
    subtasks: [],
  };
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
  setTimeout(function () { preventSelect = false }, 100);
  if (selected) {
    save(selected, 'task');
  }
  if (selected == el && !force) {
    return;
  }
  if (selected instanceof Task && el != selected) {
    selected.displayOptions({ target: undefined }, 'hide');
  }
  selected = el;
  if (el instanceof Task) {
    el.editBar.current.focus();
  } else if (el instanceof List) {
    el.listInput.current.focus();
  }
}

function save(task, saveType) {
  // save the new data
  if (saveType === 'list') {
    var saveObject = task.props.parent;
  } else {
    var saveObject = task;
  }
  data.tasks[stripR(saveObject.props.id)] = {title: saveObject.state.title,
    info: saveObject.state.info, subtasks: saveObject.state.subtasks};
  localStorage.setItem('data', JSON.stringify(data));
}

function saveSetting(setting, value) {
  data.settings[setting] = value;
  localStorage.setItem('data', JSON.stringify(data));
}

function cutTask() {
  if (!selected || selected instanceof List) return;
  copyTask();
  selected.deleteThis(false);
}

function copyTask(mirror) {
  if (!selected || selected instanceof List) return;
  if (mirror) {
    copiedTask = selected.props.id;
  } else {
    // only copy data
    const today = new Date();
    const now = today.getTime();
    const newTask = String(now);
    data.tasks[newTask] = {...data.tasks[stripR(selected.props.id)]};
    copiedTask = newTask;
  }
}

function pasteTask(type) {
  if (!selected) return;
  if (selected instanceof List || type === 'task') {
    const subtasks = selected.state.subtasks;
    subtasks.splice(0, 0, copiedTask);
    selected.setState({ subtasks: subtasks });
    save(selected, 'task');
  } else if (selected instanceof Task || type === 'list') {
    const subtasks = selected.state.parent.state.subtasks;
    const insertIndex = subtasks.findIndex(x => x == selected.props.id) + 1;
    subtasks.splice(insertIndex, 0, copiedTask);
    selected.state.parent.setState({ subtasks: subtasks });
    save(selected, 'list');
  }
}

function backup() {
  alert('open console to copy data (file download option will be added soon)');
  consoleLog(data);
}

function consoleLog(x) {
  console.log(x);
}

function keyComms(ev) {
  if (!ev.ctrlKey) {
    if (ev.key === 'Enter' && !preventReturn) {
      ev.preventDefault();
      if (ev.shiftKey) {
        newTask('task');
      } else {
        newTask();
      }
      return;
    } else if (ev.key === 'Escape') {
      ev.preventDefault();
      document.activeElement.blur();
      if (selected) {
        save(selected, 'task');
        if (selected instanceof Task && 
          selected.state.displayOptions === 'show') {
          selected.displayOptions('hide');
        } else {
          selected = undefined;
        }
      }
      return;
    }
  }
  if (ev.ctrlKey && ev.shiftKey) {
    switch (ev.key) {
      case 'V':
        pasteTask('task');
        break;
      case 'N':
        newTask('task');
        break;
      case 'C':
        // mirror task
        copyTask(true);
        break;
      default:
        break;
    }
  } else if (ev.ctrlKey) {
    switch (ev.key) {
      case 'x':
        ev.preventDefault();
        cutTask();
        break;
      case 'c':
        ev.preventDefault();
        copyTask();
        break;
      case 'v':
        ev.preventDefault();
        pasteTask();
        break;
      case 'n':
        ev.preventDefault();
        newTask();
        break;
      case 'f':
        ev.preventDefault();
        if (app.current.state.zoomed === 'zoomed') return;
        focus();
        break
      case 'r':
        ev.preventDefault();
        updateAllSizes();
        break;
      case 'z':
        ev.preventDefault();
        zoom();
        break;
      case 'Backspace':
        ev.preventDefault();
        if (selected && selected instanceof Task) {
          selected.deleteThis();
        }
        break;
      case 'w':
        ev.preventDefault();
        if (selected.props.parent.props.id != 'river') {
          moveTask(-1);
        }
        break;
      case 's':
        ev.preventDefault();
        if (selected.props.parent.props.id != 'river') {
          moveTask(1);
        }
        break;
      case 'a':
        ev.preventDefault();
        if (app.current.state.zoomed === 'zoomed') return;
        switchView(-1);
        break;
      case 'd':
        ev.preventDefault();
        if (app.current.state.zoomed === 'zoomed') return;
        switchView(1);
        break;
      case 'h':
        ev.preventDefault();
        app.current.toggleComplete();
        break;
      case 't':
        ev.preventDefault();
        if (app.current.state.zoomed === 'zoomed') return;
        goToToday();
        break;
      case '1':
        ev.preventDefault();
        if (selected instanceof Task) {
          selected.toggleComplete(false);
        }
        break;
      case '2':
        ev.preventDefault();
        if (selected instanceof Task) {
          selected.toggleImportant(false);
        }
        break;
      case '3':
        ev.preventDefault();
        if (selected instanceof Task) {
          selected.toggleMaybe(false);
        }
        break;
      case 'i':
        ev.preventDefault();
        if (selected && selected instanceof Task) {
          selected.displayOptions({ target: $('<p></p>') });
          if (selected.state.displayOptions === 'hide') {
            selected.editBar.current.focus();
          }
        };
        break;
      default:
        break;
    }
  }
}

function dateFormat(title) {
  // reformat dateString (Day Mon -- ----) to usable title
  return title.slice(0, 4) + 
    title.slice(8, 10);
}

function yearFormat(title) {
  return title.slice(4, 8) + '<br>' + title.slice(11);
}

function switchView(direction) {
  if (!selected) return;
  let parent = selected;
  while (parent instanceof Task) {
    parent = parent.props.parent;
  }
  parent.props.parent.changeIndex(direction);
  updateAllSizes();
}

function moveTask(direction) {
  if (!selected) return;
  if (selected.props.parent.subtasksCurrent) {
    var subtasks = selected.props.parent.subtasksCurrent.concat();
  } else {
    var subtasks = selected.props.parent.state.subtasks;
  }
  let selectedPlace =
    subtasks.findIndex(x => x === selected.props.id);
  const length = subtasks.length;
  if (selectedPlace == 0 && direction == -1) return;
  else if (selectedPlace == subtasks.length
    && direction == 1) return;
  if (direction == -1) {
    var subtasksChopped = subtasks.slice(0, selectedPlace).reverse();
  } else {
    var subtasksChopped = subtasks.slice(selectedPlace + 1);
  }
  if (data.settings.hideComplete == 'hideComplete') {
    var insertPlace = (subtasksChopped.findIndex(x => 
      data.tasks[stripR(x)].info.complete != 'complete') + 1) * direction;
  } else {
    var insertPlace = 1 * direction;
  }
  const spliceTask = subtasks.splice(selectedPlace, 1)[0];
  subtasks.splice(selectedPlace + insertPlace, 0, spliceTask);
  selected.props.parent.setState({ subtasks: subtasks });
  save(selected.props.parent, 'task');
}

function reset() {
  var accept = window.confirm('Are you sure you want to reset all data?');
  if (accept) {
    data = resetData;
    localStorage.setItem('data', JSON.stringify(resetData));
    setTimeout(function () { window.location.reload() }, 200);
  }
}

function fixDates() {
  let today = new Date();
  var dates = [];
  for (let i = 0; i < 30; i ++) {
    const dateString = today.toDateString();
    var found = false;
    for (let x of Object.keys(data.tasks)) {
      if (data.tasks[x].title == dateString) {
        dates.push(x);
        found = true;
        break;
      }
    }
    if (found === false) {
      let now = new Date().getTime();
      while (data.tasks[String(now)]) {
        now += 1;
      }
      now = String(now);
      data.tasks[now] = {title: dateString, info: {}, subtasks: []};
      dates.push(now);
    }
    today.setDate(today.getDate() + 1);
  }
  data.tasks['river'].subtasks = dates;
  localStorage.setItem('data', JSON.stringify(data));
  window.location.reload();
}

function restore() {
  preventReturn = true;
  const textarea = $('<textarea class="restore"></textarea>');
  $('#root').append(textarea);
  textarea.on('keydown', ev => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      data = JSON.parse(textarea.val());
      localStorage.setItem('data', JSON.stringify(data));
      window.location.reload();
    } else if (ev.key === 'Escape') {
      textarea.remove();
      setTimeout(() => preventReturn = false, 100);
    }
  })
}

function focus(set) {
  if (set != undefined) {
    var focusSet = set;
  } else {
    if (app.current.state.bank.current.state.info.focused == 'focused') {
      var focusSet = '';
    } else {
      var focusSet = 'focused';
    }
  }
  if (selected) {
    // set the index of the focused list to the selected list
    let focusView = selected
    while (focusView instanceof Task) {
      focusView = focusView.props.parent;
    }
    focusView.props.parent.changeIndex(focusView.props.parent.frames
      .findIndex(x => x.current.props.id == focusView.props.id));
  }
  app.current.state.bank.current.setState(prevState => (
    {
      info: {
        ...prevState.info,
        focused: focusSet,
      },
      width: processWidth(focusSet)
    }));
  app.current.state.river.current.setState(prevState => (
    {
      info: {
        ...prevState.info,
        focused: focusSet,
      },
      width: processWidth(focusSet),
    }));
  saveSetting('focused', focusSet);
  updateAllSizes();
}

function updateAllSizes() {
  function update(list) {
    if (list.current instanceof Task) { list.current.updateHeight(); }
    for (let task of list.current.taskList.current.subtaskObjects) {
      update(task);
    }
  }
  const riverLists = app.current.state.river.current.frames;
  const bankLists = app.current.state.bank.current.frames;
  for (let list of riverLists.concat(bankLists)) {
    update(list);
  }
}

function setTheme(theme) {
  const newTheme = themes[theme + '-' +
    data.settings.mode];
  for (let key of Object.keys(newTheme)) {
    document.documentElement.style.setProperty(
      key, newTheme[key]
    );
  }
  data.settings.theme = theme;
  localStorage.setItem('data', JSON.stringify(data));
  setTimeout(updateAllSizes, 100);
}

function toggleMode() {
  if (data.settings.mode == 'night') {
    data.settings.mode = 'day';
  } else {
    data.settings.mode = 'night';
  }
  setTheme(data.settings.theme);
  localStorage.setItem('data', JSON.stringify(data));
}

function processWidth(focused) {
  if (focused != 'focused') {
    var width = Math.floor(window.innerWidth / 200);
    $(':root').css('--frameWidth',
      ((window.innerWidth - 40) / width) + 'px');
  } else {
    // focus mode
    var width = 1;
    $(':root').css('--frameWidth', 'calc(100% - 24px)');
  }
  return width;
}

function goToToday() {
  searchDate(new Date().toDateString());
}

function searchDate(text, type) {
  setTimeout(() => {
    app.current.statusBar.current.search({ target: { value: text } });
    app.current.statusBar.current.goToFirst();
  }, 100);
}

function zoom() {
  // zoom everything upwards
  if (app.current.state.zoomed === 'zoomed') {
    var zoomedSetting = '';
  } else {
    var zoomedSetting = 'zoomed';
    if (!selected) { return }; // no zoomie
  }
  if (selected instanceof Task) {
    var zoomTask = selected.props.parent;
  } else {
    var zoomTask = selected;
  }
  zoomTask.setState({zoomed: zoomedSetting});
  let parent = zoomTask.props.parent;
  while (parent) {
    parent.setState({zoomed: zoomedSetting});
    parent = parent.props.parent;
  }
  app.current.setState({zoomed: zoomedSetting})
  if (!zoomed) {
    // unzoom
    zoomed = selected;
  } else {
    zoomed = undefined;
  }
  updateAllSizes();
}

function clean() {
  function removeDeadline(list, id) {
    for (let x of Object.keys(list)) {
      // switch it out of things
      let deadlineList = list[x];
      if (deadlineList.includes(id)) {
        deadlineList = 
          deadlineList.splice(deadlineList.findIndex(x => x === id), 1);
      }
    }
  }
  // clean out tasks which aren't in lists
  for (let id of Object.keys(data.tasks).filter(x => 
    !['river', 'bank'].includes(x))) {
    let found = false;
    for (let containerId of Object.keys(data.tasks)) {
      if (data.tasks[containerId].subtasks.map(x => 
        stripR(x)).includes(id)) {
        console.log('found', data.tasks[id].title);
        found = true;
        break;
      }
    }
    if (found == false) {
      delete data.tasks[id];
      removeDeadline(data.settings.deadlines, id);
      removeDeadline(data.settings.startdates, id);
    }
  }
}

function init() {
  selected = undefined;
  width = Math.floor(window.innerWidth / 200);
  prevWidth = Math.floor(window.innerWidth / 200);
  app = React.createRef();
  $('body').append("<link rel='stylesheet' id='theme' href='./themes/space-night.css' />");
  ReactDOM.render(<App ref={app} />, document.getElementById('root'));
  $(document).on('keydown', keyComms);
  focus(data.settings.focused);
  setTheme(data.settings.theme);
  window.addEventListener('resize', () => {
    if (window.innerWidth / 10 != Math.floor(window.innerWidth / 10)) return;
    updateAllSizes();
  });
}

// MIGRATION PROTOCOLS

if (!data.settings.migrated) {
  data.settings.migrated = [];
}

if (!data.settings.migrated.includes('12/1')) {
  data.settings.migrated.push('12/1');
  var tasksMigrated = {};
  var newData = JSON.parse(JSON.stringify(data));
  function treeSearch(task) {
    tasksMigrated[task.id] = {info: task.info, title: task.title, 
      subtasks: task.subtasks.map(x => x.id)};
    for (let subtask of task.subtasks) {
      treeSearch(subtask, task);
    }
    delete task.subtasks;
  }
  newData.river.id = 'river';
  newData.bank.id = 'bank';
  treeSearch(newData.river);
  treeSearch(newData.bank);
  delete newData.river;
  delete newData.bank;
  newData.tasks = tasksMigrated;
  data = newData;
}

if (!data.settings.migrated.includes('12/2')) {
  data.settings.migrated.push('12/2');
  for (let task of Object.keys(data.tasks)) {
    const foundTask = data.tasks[stripR(task)];
    delete foundTask.info.startDate;
    delete foundTask.info.endDate;
  }
}

if (!data.settings.migrated.includes('12/3')) {
  data.settings.migrated.push('12/3');
  data.settings.startdates = {};
  data.settings.deadlines = {};
}

clean();

init();