class StatusBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchString: '', foundTasks: {} };
  }
  search(ev) {
    if (this.state.searchString === '') {
      this.searches = { ...window.data.tasks };
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
      for (let x of Object.keys(window.data.tasks)) {
        if (window.data.tasks[stripR(x)].subtasks.includes(otherId)) {
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
        i++;
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
    this.move = React.createRef();
    this.upcoming = React.createRef();
    console.log(Object.keys(this.props.deadlines));
    let deadlineItems = Object.keys(this.props.deadlines).filter(
      x => new Date(x).getTime() >= new Date().getTime()
    )
    console.log(deadlineItems);
    deadlineItems = deadlineItems.map(x => (
      this.props.deadlines[x].map(y => [x, y])
    )).flat().filter(x => x.length > 0);
    console.log(deadlineItems);
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
            <select ref={this.searchResults}
              style={{ width: '5em' }}
              onChange={() => {
                this.goToSearch(this.searchResults.current.value)
              }}>
              {Object.keys(this.state.foundTasks).map(x =>
                <option key={x} value={x}>
                  {this.state.foundTasks[x].title}
                </option>)}
            </select>
          }
        </div>
        <Timer />
        <div className='buttonBar nowrap'>
          <select ref={this.functions} style={{ width: '35px' }}
            onChange={() => {
              eval(this.functions.current.value);
              this.functions.current.value = '';
            }}>
            <option value="" window.selected disabled hidden>edit</option>
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
            <option value='pasteTask("task")'>
              paste as subtask (ctrl-shift-V)</option>
            <option value="deleteTask()">
              delete (ctrl-delete)</option>
          </select>
          <select ref={this.move} style={{ width: '45px' }}
            onChange={() => {
              eval(this.move.current.value);
              this.move.current.value = '';
            }}>
            <option value="" window.selected disabled hidden>move</option>
            <option value="moveTask(1)">
              move down (ctrl-s)</option>
            <option value="moveTask(-1)">
              move up (ctrl-w)</option>
            <option value="switchView(1)">
              following week/lists (ctrl-d)</option>
            <option value="switchView(-1)">
              previous week/lists (ctrl-a)</option>
            <option value="listEdit('migrate')">
              migrate date</option>
            <option value="listEdit('clear')">
              clear list</option>
            <option value="displayTable()">
              display as table</option>
          </select>
          <select ref={this.options} onChange={() => {
            eval(this.options.current.value);
            this.options.current.value = '';
          }}
            style={{ width: '60px' }}>
            <option value="" window.selected disabled hidden>settings</option>
            <option value='focus()'>focus on list (ctrl-f)</option>
            <option value='zoom()'>focus on view (ctrl-shift-F)</option>
            <option value='app.current.toggleComplete()'>
              show/hide complete (ctrl-h)</option>
            <option value='undo()'>undo (ctrl-z)</option>
            <option value='backup()'>backup</option>
            <option value='restore()'>restore</option>
            <option value='reset()'>reset</option>
            <option value='toggleSounds()'>toggle sounds</option>
            <option value='toggleMode()'>toggle day/night</option>
            <option value='setTheme("space")'>theme: space</option>
            <option value='setTheme("sky")'>theme: sky</option>
            <option value='setTheme("water")'>theme: water</option>
            <option value='setTheme("earth")'>theme: earth</option>
            <option value='setTheme("fire")'>theme: fire</option>
          </select>
          <ListMenu />
          <select ref={this.upcoming} onChange={() => {
            this.goToSearch(this.upcoming.current.value);
            this.upcoming.current.value = '';
          }} style={{width: '75px'}}>
            <option value="" window.selected disabled hidden>upcoming</option>
            {deadlineItems.map(x => (
              <option value={stripR(x[1])}>
                {x[0].slice(0, x[0].length - 5)}: {
                window.data.tasks[stripR(x[1])].title}
              </option>
            ))}
          </select>
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
          style={{ width: '35px' }}>
          <option value="" window.selected disabled hidden>lists</option>
          {window.data.tasks['bank'].subtasks.filter(
            x => window.data.tasks[x].title != '--')
            .map((x, index) =>
              <option value={index}>{window.data.tasks[x].title}</option>)}
        </select>
        <select ref={this.riverLister} onChange={() => {
          if (this.riverLister.current.value == 'today') {
            goToToday();
            this.riverLister.current.value = '';
          } else {
            this.goToList('river')
          }
        }}
          style={{ width: '45px' }}>
          <option value="" window.selected disabled hidden>dates</option>
          <option value='today'>today (ctrl-t)</option>
          {window.data.tasks['river'].subtasks.filter(x => new Date(
            window.data.tasks[x].title).getTime() >=
            new Date().getTime())
            .map((x) =>
              <option value={window.data.tasks[x].title}>
                {window.data.tasks[x].title}</option>)}
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
    playSound(this.state.start);
    this.play();
  }
  play(stopwatch, backwards) {
    var permission = Notification.requestPermission();
    const multiplier = backwards ? -1 : 1;
    clearInterval(this.interval);
    this.setState({ ended: false });
    if (stopwatch == 'stopwatch') {
      playSound(this.state.start);
      this.interval = setInterval(() => {
        this.setState({ seconds: this.state.seconds + 1 });
      }, 1000);
    } else {
      this.interval = setInterval(() => {
        this.setState({
          seconds: Math.ceil((this.state.endTime -
            new Date().getTime()) / 1000)
        });
        if (this.state.seconds <= 0 && this.state.ended === false) {
          this.end();
        }
      }, 1000);
    }
  }
  end() {
    this.setState({ play: true, ended: true });
    playSound(this.state.audio);
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
          if (this.options.current.value === 'clear') {
            this.playPause();
            this.options.current.value = '';
          } else if (this.options.current.value === 'stopwatch') {
            this.setState({ seconds: 0 });
            this.play('stopwatch');
            this.options.current.value = '';
          } else {
            this.startTimer(this.options.current.value);
            this.options.current.value = '';
          }
        }}
          style={{ width: '45px' }}>
          <option value="" window.selected disabled hidden>timer</option>
          <option value={'clear'}>--:--</option>
          <option value={50}>50:00</option>
          <option value={25}>25:00</option>
          <option value={15}>15:00</option>
          <option value={10}>10:00</option>
          <option value={5}>5:00</option>
          <option value={'stopwatch'} title='stopwatch'>&infin;</option>
        </select>
      </>
    )
  }
}

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
        <p onClick={() => newTask()}>
        new task (return)</p>
        <p onClick={() => cutTask()}>
          cut (ctrl-x)</p>
        <p onClick={() => copyTask()}>
          copy (ctrl-c)</p>
        <p onClick={() => copyTask(true)}>
          mirror (ctrl-shift-C)</p>
        <p onClick={() => pasteTask()}>
          paste (ctrl-v)</p>
        <p onClick={() => pasteTask("task")}>
          paste as subtask (ctrl-shift-V)</p>
        <p onClick={() => deleteTask()}>
          delete (ctrl-delete)</p>
        <p onClick={() => moveTask(1)}>
          move down (ctrl-s)</p>
        <p onClick={() => moveTask(-1)}>
          move up (ctrl-w)</p>
        <p onClick={() => switchView(1)}>
          following week/lists (ctrl-d)</p>
        <p onClick={() => switchView(-1)}>
          previous week/lists (ctrl-a)</p>
        <p onClick={() => listEdit('migrate')}>
          migrate date</p>
        <p onClick={() => listEdit('clear')}>
          clear list</p>
        <p onClick={() => displayTable()}>
          display as table</p>
      </div>
    )
  } 
}