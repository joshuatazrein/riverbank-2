function checkTimes() {
  const today = new Date();
  const now = [today.getHours(), today.getMinutes()];
  const dateString = today.toDateString();
  const list = window.data.tasks[Object.keys(window.data.tasks)
    .find(x => window.data.tasks[x].title === dateString)];
  if (!list) return;
  const todayList = list.subtasks;
  for (let task of todayList) {
    const taskEntry = window.data.tasks[stripR(task)];
    if (taskEntry.info.type === 'event' &&
      taskEntry.info.complete !== 'complete' &&
      !taskEntry.info.startDate.includes('--')) {
      if (
        taskEntry.info.startDate[0] === now[0] &&
        taskEntry.info.startDate[1] === now[1]
      ) {
        var permission = Notification.requestPermission();
        const notification = new Notification('Event: ' + taskEntry.title);
        break;
      } else {
        const newDate = new Date();
        newDate.setHours(taskEntry.info.startDate[0]);
        newDate.setMinutes(taskEntry.info.startDate[1]);
        newDate.setMinutes(newDate.getMinutes() - 15);
        if (
          taskEntry.info.type === 'event' && 
          newDate.getHours() === now[0] &&
          newDate.getMinutes() === now[1]
        ) {
          var permission = Notification.requestPermission();
          const notification = new Notification('in 15: ' + taskEntry.title);
        }
      }
    }
  }
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

function focus(set) {
  if (set != undefined) {
    var focusSet = set;
  } else {
    if (window.app.current.state.bank.current.state.info.focused == 'focused') {
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
  window.app.current.state.bank.current.setState(prevState => (
    {
      info: {
        ...prevState.info,
        focused: focusSet,
      },
      width: processWidth(focusSet)
    }));
  window.app.current.state.river.current.setState(prevState => (
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
  const riverLists = window.app.current.state.river.current.frames;
  const bankLists = window.app.current.state.bank.current.frames;
  for (let list of riverLists.concat(bankLists)) {
    update(list);
  }
}

function setTheme(theme) {
  const newTheme = window.themes[theme + '-' +
    window.data.settings.mode];
  for (let key of Object.keys(newTheme)) {
    document.documentElement.style.setProperty(
      key, newTheme[key]
    );
  }
  window.data.settings.theme = theme;
  localStorage.setItem('data', JSON.stringify(window.data));
  setTimeout(updateAllSizes, 100);
}

function displayTable() {
  if (window.app.current.state.displayTable === 'none' && selected) {
    window.app.current.setState({displayTable: 'true'});
  } else {
    window.app.current.setState({displayTable: 'none'});
  }
  console.log(window.app.current.state.displayTable);
}

function toggleMode() {
  if (window.data.settings.mode == 'night') {
    window.data.settings.mode = 'day';
  } else {
    window.data.settings.mode = 'night';
  }
  setTheme(window.data.settings.theme);
  localStorage.setItem('data', JSON.stringify(window.data));
}

function toggleSounds() {
  if (window.data.settings.sounds == 'false') {
    window.data.settings.sounds = 'true';
    alert('sounds on');
  } else {
    window.data.settings.sounds = 'false';
    alert('sounds off');
  }
}

function playSound(sound) {
  if (window.data.settings.sounds === 'true') {
    sound.play();
  }
}

function processWidth(focused) {
  if (focused != 'focused') {
    var width = Math.floor(window.innerWidth / 250);
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
    window.app.current.statusBar.current.search({ target: { value: text } });
    window.app.current.statusBar.current.goToFirst();
  }, 100);
}

function zoom() {
  // zoom everything upwards
  if (window.app.current.state.zoomed === 'zoomed') {
    var zoomedSetting = '';
  } else {
    var zoomedSetting = 'zoomed';
    if (!selected) { return }; // no zoomie
  }
  var zoomFrame = getFrame(selected);
  zoomFrame.setState({ zoomed: zoomedSetting });
  window.app.current.setState({ zoomed: zoomedSetting });
  if (!zoomed) {
    // unzoom
    zoomed = selected;
  } else {
    zoomed = undefined;
  }
  setTimeout(
    updateAllSizes, 200
  )
}