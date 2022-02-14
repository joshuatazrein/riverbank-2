function getFrame(task) {
  let parent = task;
  while (parent.props.parent) {
    parent = parent.props.parent;
  }
  return parent;
}

function getList(task) {
  let parent = task;
  while (parent instanceof Task) {
    parent = parent.props.parent;
  }
  return parent;
}

function stripR(x) {
  if (x.charAt(0) === 'R') {
    return x.slice(1);
  } else {
    return x;
  }
}

function consoleLog(x) {
  console.log(x);
}

function getSubtasks(object) {
  if (object.subtasksCurrent) return object.subtasksCurrent;
  else return object.state.subtasks;
}

function dateFormat(title) {
  // reformat dateString (Day Mon -- ----) to usable title
  return title.slice(0, 4) +
    title.slice(8, 10);
}

function yearFormat(title) {
  return title.slice(4, 8) + '<br>' + title.slice(11);
}

function fixDates() {
  let today = new Date();
  var dates = [];
  for (let i = 0; i < 30; i++) {
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
      data.tasks[now] = { title: dateString, info: {}, subtasks: [] };
      dates.push(now);
    }
    today.setDate(today.getDate() + 1);
  }
  data.tasks['river'].subtasks = dates;
  localStorage.setItem('data', JSON.stringify(data));
  window.location.reload();
}

function getTime(timeList) {
  let currentTime = timeList[0] * 60 + timeList[1];
  if (currentTime <= 180) currentTime += 1440;
  return currentTime;
}