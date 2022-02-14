function deleteTask() {
  if (selected && selected instanceof Task) {
    window.undoData = localStorage.getItem('data');
    selected.deleteThis();
  }
}

function newTask(type) {
  // create new task after selected
  if (!selected || window.preventReturn) return;
  let el;
  if (type == 'task' || !selected.state.parent) {
    el = selected;
  } else if (type == 'list' || selected.state.parent) {
    el = selected.state.parent;
  }
  const today = new Date();
  const now = today.getTime();
  const newTask = String(now);
  window.data.tasks[newTask] = {
    info: { complete: '', startDate: '', endDate: '' },
    title: '',
    subtasks: [],
  };
  window.copiedTask = newTask;
  pasteTask(type);
}

function selectTask(el, force) {
  // make this task selected
  if (window.preventSelect) return
  if (el instanceof TaskList) {
    return
  }
  window.preventSelect = true;
  setTimeout(function () { window.preventSelect = false }, 100);
  if (selected) {
    save(selected, 'task');
  }
  if (selected == el && !force) {
    return;
  }
  if (selected instanceof Task && selected != el) {
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
  // save the new window.data
  if (saveType === 'list') {
    var saveObject = task.props.parent;
  } else {
    var saveObject = task;
  }
  if (saveObject.subtasksCurrent) var subtasks = saveObject.subtasksCurrent;
  else var subtasks = saveObject.state.subtasks;
  window.data.tasks[stripR(saveObject.props.id)] = {
    title: saveObject.state.title,
    info: saveObject.state.info, subtasks: subtasks
  };
  localStorage.setItem('data', JSON.stringify(window.data));
}

function undo() {
  localStorage.setItem('data', window.undoData);
  setTimeout(() => window.location.reload(), 500);
}

function saveSetting(setting, value) {
  window.data.settings[setting] = value;
  localStorage.setItem('data', JSON.stringify(window.data));
}

function cutTask() {
  if (!selected || selected instanceof List) return;
  copyTask();
  selected.deleteThis(false);
  window.undoData = localStorage.getItem('data');
}

function copyTask(mirror) {
  if (!selected || selected instanceof List) return;
  save(selected);
  if (mirror) {
    window.copiedTask = selected.props.id;
  } else {
    // only copy window.data
    const today = new Date();
    const now = today.getTime();
    const newTask = String(now);
    window.data.tasks[newTask] = { ...window.data.tasks[stripR(selected.props.id)] };
    window.copiedTask = newTask;
  }
}

function pasteTask(type) {
  console.log(selected);
  if (!selected || !window.copiedTask) return;
  window.undoData = localStorage.getItem('data');
  if (selected instanceof List || type === 'task') {
    const subtasks = selected.state.subtasks;
    subtasks.splice(0, 0, window.copiedTask);
    selected.setState({ subtasks: subtasks });
    save(selected, 'task');
  } else if (selected instanceof Task || type === 'list') {
    const subtasks = selected.state.parent.state.subtasks;
    const insertIndex = subtasks.findIndex(x => x == selected.props.id) + 1;
    subtasks.splice(insertIndex, 0, window.copiedTask);
    selected.state.parent.setState({ subtasks: subtasks });
    save(selected, 'list');
  }
}

function indentTask(unindent) {
  // umm fix sometime
  if (!selected) return;
  const lastSelected = selected;
  save(selected);
  const subtasks = selected.props.parent.taskList.current.subtaskObjects;
  const here = subtasks
    .findIndex(x => 
    stripR(x.current.props.id) === stripR(selected.props.id));
  console.log(subtasks, here);
  if (unindent != true) {
    if (here === 0) return;
    const taskAbove = subtasks[here - 1].current;
    const theseSubtasks = getSubtasks(taskAbove);
    theseSubtasks.push(selected.props.id);
    const previousSubtasks = getSubtasks(selected.props.parent);
    previousSubtasks.splice(here, 1);
    console.log(previousSubtasks.map(x => window.data.tasks[stripR(x)].title));
    taskAbove.setState( { subtasks: theseSubtasks });
    console.log(window.data.tasks[stripR(selected.props.id)]);
    lastSelected.props.parent.setState({ subtasks: previousSubtasks });
    console.log(window.data.tasks[stripR(selected.props.id)]);
    save(taskAbove);
    console.log(window.data.tasks[stripR(selected.props.id)]);
    save(lastSelected.props.parent);
    console.log(window.data.tasks[stripR(selected.props.id)]);
  } else {
    if (selected.props.parent.props.parent instanceof Frame) return;
    const subtasks = selected.props.parent.props.parent
      .taskList.current.subtaskObjects;
    const here = subtasks.findIndex(
      x => x.current.props.id === selected.props.parent.props.id);
    const theseSubtasks = selected.props.parent.props.parent.state.subtasks;
    theseSubtasks.splice(here + 1, 0, selected.props.id);
    console.log(theseSubtasks);
    selected.props.parent.props.parent.setState({ subtasks: theseSubtasks });
    save(selected.props.parent.props.parent);
    const parentSubtasks = getSubtasks(lastSelected.props.parent);
    parentSubtasks.splice(parentSubtasks.findIndex(x => 
      x === lastSelected.props.id), 1);
    lastSelected.props.parent.setState({ subtasks: parentSubtasks });
    save(lastSelected.props.parent);
  }
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
  if (window.data.settings.hideComplete == 'hideComplete') {
    var insertPlace = (subtasksChopped.findIndex(x =>
      window.data.tasks[stripR(x)].info.complete != 'complete') + 1) * direction;
  } else {
    var insertPlace = 1 * direction;
  }
  const spliceTask = subtasks.splice(selectedPlace, 1)[0];
  subtasks.splice(selectedPlace + insertPlace, 0, spliceTask);
  selected.props.parent.setState({ subtasks: subtasks });
  save(selected.props.parent, 'task');
}

function listEdit(type) {
  if (!selected) {
    alert('select a list');
    return;
  }
  if (type === 'migrate' && getFrame(selected).props.id === 'bank') {
    alert('select a date');
    return;
  }
  var incompleteTasks = [];
  var subtasksCurrent = getList(selected).subtasksCurrent;
  function addIncomplete(task) {
    for (let x of task.taskList.current.subtaskObjects) {
      addIncomplete(x.current);
      if (x.current.state.info.complete !== 'complete') {
        if (type === 'clear') {
          x.current.toggleComplete();
          x.current.displayOptions({target: undefined}, 'hide');
          save(x.current);
        } else if (type === 'migrate' && 
          x.current.props.id.charAt(0) != 'R') {
          incompleteTasks.push(x.current.props.id);
          subtasksCurrent.splice(subtasksCurrent
            .findIndex(y => y === x.current.props.id), 1);
        }
      }
    }
  }
  addIncomplete(getList(selected));
  if (type === 'migrate') {
    const tomorrow = new Date(getList(selected).state.title);
    tomorrow.setDate(tomorrow.getDate() + 1);
    getList(selected).setState({
      subtasks: subtasksCurrent
    });
    save(getList(selected));
    searchDate(tomorrow.toDateString());
    setTimeout(() => {
      selected.setState(
        { subtasks: selected.subtasksCurrent.concat(incompleteTasks) });
      save(selected);
    }, 500);
  }
}