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
    "--midground": "rgba(59, 60, 54, 0.3)",
    "--padding": "14px",
    "--important": "rgb(14, 41, 48)",
    "--maybe": "rgba(14, 41, 48, 0.5)",
    "--menufont": "18px Courier New",
    "--startDate": "var(--maybe)",
    "--endDate": "var(--important)",
    "--headingSize": "125%",
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
    "--midground": "rgba(59, 60, 54, 0.3)",
    "--padding": "14px",
    "--important": "rgb(85, 107, 47)",
    "--maybe": "rgba(85, 107, 47, 0.5)",
    "--menufont": "18px Courier New",
    "--startDate": "var(--maybe)",
    "--endDate": "var(--important)",
    "--headingSize": "125%",
  },
  'fire-day': {
    "--font": "var(--fontSize) 'Josefin Sans', Cochin, sans-serif",
    "--fontSize": "21px",
    "--fontWeight": "300",
    "--bold": "500",
    "--background": "rgb(230, 230, 250)",
    "--border": "rgba(53, 3, 58, 0.3)",
    "--select": "rgb(242, 172, 229)",
    "--event": "rgba(251, 217, 253, 0.3)",
    "--foreground": "rgb(53, 3, 58)",
    "--midground": "rgba(200, 200, 230, 0.3)",
    "--padding": "14px",
    "--important": "rgb(226, 156, 210)",
    "--maybe": "rgba(212, 93, 194, 0.5)",
    "--menufont": "18px Courier New",
    "--startDate": "var(--maybe)",
    "--endDate": "var(--important)",
    "--headingSize": "125%",
  },
  'fire-night': {
    "--font": "var(--fontSize) 'Josefin Sans', Cochin, sans-serif",
    "--fontSize": "21px",
    "--fontWeight": "300",
    "--bold": "500",
    "--background": "rgb(5, 5, 26)",
    "--border": "rgba(212, 112, 162, 0.3)",
    "--select": "rgb(183, 104, 162)",
    "--event": "rgba(183, 104, 162, 0.3)",
    "--foreground": "rgb(248, 197, 252)",
    "--midground": "rgba(40, 6, 34)",
    "--padding": "14px",
    "--important": "rgb(226, 156, 210)",
    "--maybe": "rgba(212, 93, 194, 0.5)",
    "--menufont": "18px Courier New",
    "--startDate": "var(--maybe)",
    "--endDate": "var(--important)",
    "--headingSize": "125%",
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
    "--midground": "rgba(128, 128, 128, 0.3)",
    "--padding": "14px",
    "--important": "rgb(29, 41, 81)",
    "--maybe": "rgba(29, 41, 81, 0.5)",
    "--menufont": "18px Courier New",
    "--startDate": "var(--maybe)",
    "--endDate": "var(--important)",
    "--headingSize": "125%",
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
    "--midground": "rgba(128, 128, 128, 0.3)",
    "--padding": "14px",
    "--important": "rgb(173, 185, 225)",
    "--maybe": "rgba(173, 185, 225, 0.5)",
    "--menufont": "18px Courier New",
    "--startDate": "var(--maybe)",
    "--endDate": "var(--important)",
    "--headingSize": "125%",
  },
  'space-day': {
    "--font": "var(--fontSize) 'Cormorant Garamond', Cochin, serif",
    "--fontSize": "24px",
    "--fontWeight": "300",
    "--background": "rgb(201, 192, 187)",
    "--border": "rgba(128, 128, 128, 0.3)",
    "--select": "rgb(165, 113, 100)",
    "--event": "rgba(165, 113, 100, 0.3)",
    "--foreground": "rgb(59, 47, 47)",
    "--midground": "rgba(196, 174, 173, 0.5)",
    "--padding": "14px",
    "--important": "rgb(161, 122, 116)",
    "--maybe": "rgba(161, 122, 116, 0.5)",
    "--menufont": "18px Courier New",
    "--startDate": "var(--maybe)",
    "--endDate": "var(--important)",
    "--bold": "600",
    "--headingSize": "125%",
  },
  'space-night': {
    "--font": "var(--fontSize) 'Cormorant Garamond', Cochin, serif",
    "--fontSize": "24px",
    "--fontWeight": "300",
    "--background": "rgb(0, 0, 0)",
    "--border": "rgb(128, 128, 128, 0.3)",
    "--select": "rgb(101, 138, 149)",
    "--event": "rgba(136, 165, 174, 0.3)",
    "--foreground": "rgb(191, 193, 194)",
    "--midground": "rgb(128, 128, 128)",
    "--padding": "14px",
    "--important": "skyblue",
    "--maybe": "darkblue",
    "--menufont": "18px Courier New",
    "--startDate": "var(--maybe)",
    "--endDate": "var(--important)",
    "--bold": "600",
    "--headingSize": "125%",
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
    "--midground": "rgba(128, 128, 128, 0.3)",
    "--padding": "14px",
    "--important": "rgb(41, 74, 112)",
    "--maybe": "rgba(41, 74, 112, 0.5)",
    "--menufont": "18px Courier New",
    "--startDate": "var(--maybe)",
    "--endDate": "var(--important)",
    "--bold": "400",
    "--headingSize": "1.15em",
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
    "--midground": "rgba(128, 128, 128, 0.3)",
    "--padding": "14px",
    "--important": "rgb(143, 176, 214)",
    "--maybe": "rgba(143, 176, 214, 0.5)",
    "--menufont": "18px Courier New",
    "--startDate": "var(--maybe)",
    "--endDate": "var(--important)",
    "--bold": "400",
    "--headingSize": "1.15em",
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
    theme: 'space',
    mode: 'night',
    focused: '',
  }
};

var data;
try {
  data = !localStorage.getItem('data') ? { resetData } :
    JSON.parse(localStorage.getItem('data'));
} catch (err) {
  console.log(err);
  data = resetData;
}

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
    this.state = {
      hideComplete: '',
      bank: React.createRef(),
      river: React.createRef(),
      theme: data.settings.theme,
      mode: data.settings.mode,
      focused: data.settings.focused,
    };
  }
  toggleComplete() {
    if (this.state.hideComplete == '') {
      this.setState({ hideComplete: 'hideComplete' });
    } else {
      this.setState({ hideComplete: '' });
    }
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
    console.log(source, destination);
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
        console.log(listObjs[i - 1].current.taskList.current
          .subtaskObjects);
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
    return (
      <>
        <StatusBar parent={this} />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className={'container ' + this.state.hideComplete}>
            <Frame id='bank' info={data['river'].info}
              subtasks={data['bank'].subtasks} ref={this.state.bank} />
            <Frame id='river' info={data['river'].info}
              subtasks={data['river'].subtasks} ref={this.state.river} />
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
  treeSearch(task, idString) {
    // builds full tree list of IDs based on title contents
    let i = 0;
    for (let subtask of task.subtasks) {
      if (subtask.title.length > 0) {
        this.searches[subtask.title] = idString + ' ' + i;
      }
      this.treeSearch(subtask, idString + ' ' + i);
      i++;
    }
  }
  search(ev) {
    if (this.state.searchString === '') {
      this.searches = {};
      this.treeSearch(data.river, 'river');
      this.treeSearch(data.bank, 'bank');
    }
    this.setState({ searchString: ev.target.value });
    for (let x of Object.keys(this.searches)) {
      if (!new RegExp(this.state.searchString, 'i').test(x)) {
        delete this.searches[x];
      }
    }
    console.log(this.searches);
    this.setState({ foundTasks: this.searches });
  }
  goToSearch(title) {
    const splits = title.split(' ');
    const frame = app.current.state[splits[0]];
    frame.current.changeIndex(Number(splits[1]), true);
    setTimeout(() => {
      let currentTask = frame.current.frames[0];
      for (let place of splits.slice(2)) {
        // zoom into places until you find the task
        currentTask = currentTask.current.taskList.current.
          subtaskObjects[Number(place)];
      }
      console.log(currentTask.current);
      preventSelect = false;
      selectTask(currentTask.current, true);
    }, 50);
    this.setState({ searchString: '', foundTasks: {} });
  }
  componentDidMount() {
    setTimeout(goToToday, 200);
  }
  render() {
    this.search = this.search.bind(this);
    this.treeSearch = this.treeSearch.bind(this);
    this.goToSearch = this.goToSearch.bind(this);
    this.searchResults = React.createRef();
    this.options = React.createRef();
    this.functions = React.createRef();
    return (
      <div className='statusBar'>
        <div style={{
          display: 'flex', flexDirection: 'column',
          position: 'relative'
        }}>
          <input className='searchBar' onChange={(ev) => this.search(ev)}
            value={this.state.searchString}
            onKeyDown={(ev) => {
              if (ev.key === 'Backspace') {
                this.setState({ searchString: '', foundTasks: {} });
              } else if (ev.key === 'Enter') {
                if ($(this.searchResults.current).children().length > 0) {
                  this.goToSearch(this.state.foundTasks[
                    $($(this.searchResults.current)
                      .children()[0]).attr('value')])
                }
              }
            }}
            placeholder='search'></input>
          {this.state.searchString.length > 0 &&
            <select ref={this.searchResults} onChange={() => {
              this.goToSearch(this.state.foundTasks[
                this.searchResults.current.value])
            }} style={{ width: '130px' }}>
              {Object.keys(this.state.foundTasks).map(x =>
                <option key={x} value={x}>{x}</option>)}
            </select>
          }
        </div>
        <Timer />
        <div className='buttonBar nowrap'>
          <select ref={this.functions} onChange={() => {
            eval(this.functions.current.value);
            this.functions.current.value = '';
          }}>
            <option value="" selected disabled hidden>functions...</option>
            <option value='newTask()'>
              new task (return)</option>
            <option value='cutTask()'>
              cut (ctrl-x)</option>
            <option value='copyTask()'>
              copy (ctrl-c)</option>
            <option value='pasteTask()'>
              paste (ctrl-v)</option>
          </select>
          <select ref={this.options} onChange={() => {
            eval(this.options.current.value);
            this.options.current.value = '';
          }}>
            <option value="" selected disabled hidden>settings...</option>
            <option value='backup()'>backup</option>
            <option value='reset()'>reset</option>
            <option value='goToToday()'>today</option>
            <option value='focus()'>toggle focus</option>
            <option value='app.current.toggleComplete()'>
              toggle complete</option>
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
      var parent = app.current.state.river.current;
      var list = this.riverLister;
    } else if (type === 'bank') {
      var parent = app.current.state.bank.current;
      var list = this.bankLister;
    }
    console.log(list.current.value);
    parent.changeIndex(Number(list.current.value), true);
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
        <select ref={this.bankLister} onChange={() => this.goToList('bank')}>
          <option value="" selected disabled hidden>lists...</option>
          {data.bank.subtasks.filter(x => x.title != '').map((x, index) =>
            <option value={index}>{x.title}</option>)}
        </select>
        <select ref={this.riverLister} onChange={() => this.goToList('river')}>
          <option value="" selected disabled hidden>dates...</option>
          {data.river.subtasks.map((x, index) =>
            <option value={index}>{x.title}</option>)}
        </select>
      </>
    )
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0, repeats: repeats };
  }
  startTimer(val) {
    this.setState({ seconds: val * 60 });
    this.play();
  }
  play(stopwatch, backwards) {
    const multiplier = backwards ? -1 : 1;
    clearInterval(this.interval);
    if (stopwatch == 'stopwatch') {
      var add = 1;
    } else {
      var add = -1;
    }
    this.interval = setInterval(() => {
      this.setState({ seconds: this.state.seconds + add });
      if (this.state.seconds === 0) {
        this.end();
      }
    }, 1000);
  }
  end() {
    alert('timer complete');
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
    this.options = React.createRef();
    return (
      <>
        <select ref={this.options} onChange={() => {
          if (this.options.current.value == 'clear') {
            this.playPause();
            this.options.current.value = '';
          } else {
            this.startTimer(this.options.current.value);
          }
        }}>
          <option value="" selected disabled hidden>timer...</option>
          <option value={'clear'}>--:--</option>
          <option value={50}>50:00</option>
          <option value={25}>25:00</option>
          <option value={15}>15:00</option>
          <option value={10}>10:00</option>
          <option value={5}>5:00</option>
        </select>
        <input className='timerBar' readOnly={true}
          value={timeReadout}></input>
      </>
    )
  }
}

class Frame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subtasks: props.subtasks, info: props.info,
      width: Math.floor(window.innerWidth / 200)
    };
    $(window).on('resize', this.resizeCheck);
    if (props.id === 'river') {
      this.state.deadlines = deadlines;
      this.state.startdates = startdates;
      this.state.repeats = repeats;
    }
  }
  changeIndex(val, set) {
    let newIndex;
    if (set === true) {
      newIndex = val;
    } else {
      newIndex = this.state.info.index + val;
    }
    if (newIndex < 0) newIndex = 0
    this.setState(prevState => ({
      info: { ...prevState.info, index: newIndex }
    }));
  }
  render() {
    const now = new Date();
    let i = 0;
    var lastDate = 
      new Date(this.state.subtasks[this.state.subtasks.length - 1].title);
    while (this.state.subtasks.length < this.state.info.index + 7) {
      i++;
      if (this.props.id === 'bank') {
        var title = '';
      } else if (this.props.id === 'river') {
        const date = new Date(lastDate.getTime());
        date.setDate(lastDate.getDate() + i);
        var title = date.toDateString();
      }
      this.state.subtasks.push({
        id: String(now.getTime() + i),
        title: title, subtasks: [], info: {}
      });
    }
    function resizeCheck() {
      // TODO: debug "this" in this function
      if (this.state.info.focused != 'focused') {
        var width = Math.floor(window.innerWidth / 200);
        $(':root').css('--frameWidth',
          ((window.innerWidth - 40) / width) + 'px');
      } else {
        // focus mode
        var width = 1;
        $(':root').css('--frameWidth', 'calc(100% - 10px)');
      }
      
      if (width != this.state.width) {
        this.setState({ width: width });
      }
    }
    console.log(this.state.info.index, this.state.width);
    let endIndex = this.state.info.index + this.state.width;
    this.changeIndex = this.changeIndex.bind(this);
    resizeCheck = resizeCheck.bind(this);
    this.frames = [];
    window.addEventListener('resize', resizeCheck);
    resizeCheck();
    const shownLists =
      this.state.subtasks.slice(this.state.info.index, endIndex);
    console.log(shownLists);
    return (
      <div id={this.props.id}
        className={'frame ' + this.state.info.focused}>
        <button className='changeButton'
          onClick={() => this.changeIndex(this.state.width * -1)}>&lt;
        </button>
        {shownLists.map(x => {
          this.frames.push(React.createRef());
          if (this.props.id === 'river') {
            // render state correctly in original lists
            return (
              <List key={x.id} id={x.id} title={x.title}
                subtasks={x.subtasks} parent={this}
                deadlines={this.state.deadlines[x.title]}
                startdates={this.state.startdates[x.title]}
                ref={this.frames[this.frames.length - 1]} />
            )
          } else {
            return (
              <List key={x.id} id={x.id} title={x.title}
                subtasks={x.subtasks} parent={this}
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
      subtasks: props.subtasks, title: props.title,
      info: {}
    };
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
    return (
      <div className='list' onClick={selectThis}>
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
    this.state = { addTask: this.addTask };
  }
  render() {
    this.subtaskObjects = [];
    const tasksListed = this.props.subtasks.map((x, index) => {
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
          index={index}
        />
      )
      return task
    });
    let parent = this.props.parent;
    let id = [];
    while (parent) {
      id.push(parent.props.id);
      parent = parent.props.parent;
    }
    id = id.reverse().join('-');
    return (
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
      subtasks: props.subtasks, parent: props.parent,
      id: props.id, displayOptions: 'hide', riverTask: false
    };
    if (!this.state.info.startDate) this.state.info.startDate = '';
    if (!this.state.info.endDate) this.state.info.endDate = '';
    if (!this.state.info.collapsed) this.state.info.collapsed = '';
    let parent = props.parent;
    while (parent.props.parent) {
      parent = parent.props.parent;
    }
  }
  displayOptions(ev, showHide) {
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
    this.editBar.current.style.height = '0px';
    this.editBar.current.style.height =
      (this.editBar.current.scrollHeight) + "px";
  }
  changeEndDate(ev, type) {
    if (type == 'end') {
      var check1 = this.state.info.endDate;
    } else if (type === 'start') {
      var check1 = this.state.info.startDate;
    }
    if (check1.includes('-')) {
      // delete deadline string if no longer there
      const deadline = check1.split('-');
      const now = new Date();
      now.setMonth(Number(deadline[0]) - 1);
      now.setDate(Number(deadline[1]));
      const string = now.toDateString();
      if (type === 'end') {
        if (deadlines[string] &&
          deadlines[string][this.props.id]) {
          delete deadlines[string][this.props.id];
        }
      } else if (type === 'start') {
        if (startdates[string] &&
          startdates[string][this.props.id]) {
          delete startdates[string][this.props.id];
        }
      }
    }
    if (ev === 'init') {
      ev = { target: { value: check1 } };
    } else if (ev === 'destroy') {
      ev = { target: { value: ' ' } };
    } else {
      if (type === 'end') {
        this.setState(prevState => ({
          info: { ...prevState.info, endDate: ev.target.value }
        }));
      } else if (type === 'start') {
        this.setState(prevState => ({
          info: { ...prevState.info, startDate: ev.target.value }
        }));
      }
    }
    if (ev.target.value.includes('-')) {
      // process deadline string
      const deadline = ev.target.value.split('-');
      const now = new Date();
      now.setMonth(Number(deadline[0]) - 1);
      now.setDate(Number(deadline[1]));
      const string = now.toDateString();
      if (type === 'end') {
        if (!deadlines[string]) {
          deadlines[string] = {};
        }
        deadlines[string][this.props.id] =
          this.state.title;
      } else if (type === 'start') {
        if (!startdates[string]) {
          startdates[string] = {};
        }
        startdates[string][this.props.id] =
          this.state.title;
      }
      let parent = this.props.parent;
      while (parent.props.parent) {
        parent = parent.props.parent;
      }
      if (type === 'end') {
        parent.setState({ deadlines: deadlines });
      } else if (type === 'start') {
        parent.setState({ startdates: startdates });
      }
    }
  }
  toggleComplete(change) {
    let status = this.state.info.complete
    if (status === 'complete') { status = '' }
    else { status = 'complete' }
    this.setState(prevState => ({
      info: { ...prevState.info, complete: status }
    }));
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
  deleteThis() {
    // TODO: remove deadline, repeat & startdate 
    // [[don't use global variable]]
    let parent = this.props.parent;
    while (parent.props.parent) {
      parent = parent.props.parent;
    }
    this.changeEndDate('destroy', 'end');
    this.changeEndDate('destroy', 'start');
    const subtasks = this.state.parent.state.subtasks;
    const currentTask = subtasks.findIndex(x => {
      return x.id === this.state.id;
    });
    subtasks.splice(currentTask, 1);
    selected = this.state.parent;
    this.state.parent.setState({ subtasks: subtasks });
    preventSelect = true;
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
    this.changeEndDate('init', 'end');
    this.changeEndDate('init', 'start');
  }
  render() {
    // fuck react
    this.displayOptions = this.displayOptions.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.toggleImportant = this.toggleImportant.bind(this);
    this.toggleMaybe = this.toggleMaybe.bind(this);
    this.deleteThis = this.deleteThis.bind(this);
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
        onChange={(ev) => this.changeEndDate(ev, 'start')}
        ref={this.startDateSpan}></input>
    const endInput =
      <input className='optionsInput endDate'
        value={this.state.info.endDate}
        onChange={(ev) => this.changeEndDate(ev, 'end')}>
      </input>
    if (this.heightSpan.current) {
      console.log('setting height');
      this.setHeight();
    }
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
    return (
      <Draggable draggableId={id} index={this.props.index}>
        {(provided) => {
          return (<li className={'task ' + this.state.info.important +
            ' ' + this.state.info.complete +
            ' ' + this.state.info.maybe +
            ' ' + headingClass +
            ' ' + hasTimes +
            ' ' + this.state.info.collapsed}
            onClick={() => { selectTask(this) }}
            {...provided.draggableProps}
            ref={provided.innerRef}>
            <div className='taskContent'>
              <div className={'options ' + this.state.displayOptions}>
                <div className='buttonBar' style={{
                  width: '100%',
                  alignContent: 'center'
                }}>
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
                {startInput}
                {endInput}
              </div>
              <span className='info' onClick={(ev) => this.displayOptions(ev)}
                ref={this.optionsButton}
                {...provided.dragHandleProps}>
              </span>
              <div className='startEndSpans'>
                <span className='optionsSpan startDate'>{this.state.info.startDate}</span>
                <span className='optionsSpan endDate'>{this.state.info.endDate}
                </span>
              </div>
              <textarea className='editBar' value={this.state.title}
                onChange={(ev) => this.changeTitle(ev)} ref={this.editBar}></textarea>
            </div>
            <TaskList ref={this.taskList} subtasks={this.state.subtasks}
              parent={this} />
          </li>
          )
        }}
      </Draggable>
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
    info: { complete: '', startDate: '', endDate: '' },
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
  setTimeout(function () { preventSelect = false }, 100);
  console.log(selected);
  if (selected == el && !force) {
    console.log('selected and el are the same');
    return;
  }
  if (selected) {
    save(selected, 'task');
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

function saveSetting(setting, value) {
  data.settings[setting] = value;
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
  copiedTask = {
    title: state.title, id: selected.props.id,
    info: { ...state.info }, subtasks: state.subtasks.concat()
  };
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
    const insertIndex = subtasks
      .findIndex(x => x.id == selected.props.id) + 1;
    subtasks.splice(insertIndex, 0, copiedTask);
    selected.state.parent.setState({ subtasks: subtasks });
    save(selected, 'list');
  }
}

function backup() {
  const now = new Date();
  console.log(JSON.stringify(data));
}

function keyComms(ev) {
  if (!ev.ctrlKey) {
    if (ev.key === 'Enter' && !$(':focus').hasClass('searchBar')) {
      ev.preventDefault();
      if (ev.shiftKey) {
        newTask('task');
      } else {
        newTask();
      }
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
      case 'f':
        focus();
        break;
      case 'Backspace':
        if (selected && selected instanceof Task) {
          selected.deleteThis();
        }
        break;
      case 'w':
        if (selected.props.parent.props.id != 'river') {
          moveTask(-1);
        }
        break;
      case 's':
        if (selected.props.parent.props.id != 'river') {
          moveTask(1);
        }
        break;
      case 'a':
        switchView(-1);
        break;
      case 'd':
        switchView(1);
        break;
      case '1':
        if (selected instanceof Task) {
          selected.toggleComplete(false);
        }
        break;
      case '2':
        if (selected instanceof Task) {
          selected.toggleImportant(false);
        }
        break;
      case '3':
        if (selected instanceof Task) {
          selected.toggleMaybe(false);
        }
        break;
      case 'i':
        if (selected && selected instanceof Task) {
          selected.displayOptions({ target: $('<p></p>') });
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
  console.log(parent);
  parent.props.parent.changeIndex(direction);
}


function moveTask(direction) {
  console.log('movetask');
  if (!selected) return;
  const subtasks = selected.props.parent.state.subtasks;
  const selectedPlace =
    selected.props.parent.state.subtasks.findIndex(x => x.id === selected.props.id);
  if (selectedPlace == 0 && direction == -1) return;
  else if (selectedPlace == selected.props.parent.state.subtasks.length
    && direction == 1) return;
  const spliceTask = subtasks.splice(selectedPlace, 1)[0];
  subtasks.splice(selectedPlace + direction, 0, spliceTask);
  selected.props.parent.setState(subtasks);
}

function reset() {
  data = resetData;
  localStorage.setItem('data', JSON.stringify(resetData));
  setTimeout(function () { window.location.reload() }, 200);
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
    console.log(focusView);
    focusView.props.parent.changeIndex(focusView.props.parent.frames
      .findIndex(x => x.current.props.id == focusView.props.id));
  }
  app.current.state.bank.current.setState(prevState => (
    {
      info: {
        ...prevState.info,
        focused: focusSet
      }
    }));
  app.current.state.river.current.setState(prevState => (
    {
      info: {
        ...prevState.info,
        focused: focusSet
      }
    }));
  saveSetting('focused', focusSet);
  if (set == undefined) {
    setTimeout(updateAllSizes, 50);
  }
}

function updateAllSizes() {
  function update(list) {
    console.log(list);
    for (let task of list.current.taskList.current.subtaskObjects) {
      task.current.updateHeight();
      for (let subtask of task.current.taskList.current.subtaskObjects) {
        update(subtask);
      }
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
  console.log(theme + '-' + data.settings.mode);
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

function goToToday() {
  const today = new Date().toDateString();
  const river = app.current.state.river.current;
  const days = river.state.subtasks;
  const thisDay = days.findIndex(x => x.title === today);
  river.changeIndex(thisDay, true);
  console.log('went to today');
}

function init() {
  selected = undefined;
  width = Math.floor(window.innerWidth / 200);
  prevWidth = Math.floor(window.innerWidth / 200);
  app = React.createRef();
  $('body').append("<link rel='stylesheet' id='theme' href='./themes/space-night.css' />");
  ReactDOM.render(<App ref={app} />, document.getElementById('root'));
  $(document).on('keydown', keyComms);
  console.log(data.settings.focused);
  focus(data.settings.focused);
  setTheme(data.settings.theme);
}

init();