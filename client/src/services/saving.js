import $ from 'jquery';
import * as util from './util';

export function reset() {
  var accept = window.confirm('Are you sure you want to reset all window.data?');
  if (accept) {
    window.data = window.resetData;
    localStorage.setItem('data', JSON.stringify(window.resetData));
    setTimeout(function () { window.location.reload() }, 200);
  }
}

export function restore() {
  window.preventReturn = true;
  const textarea = $('<textarea class="restore"></textarea>');
  $('#root').append(textarea);
  textarea.on('keydown', ev => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      window.data = JSON.parse(textarea.val());
      localStorage.setItem('data', JSON.stringify(window.data));
      window.location.reload();
    } else if (ev.key === 'Escape') {
      textarea.remove();
      setTimeout(() => window.preventReturn = false, 100);
    }
  })
}

export function backup() {
  alert('open console to copy window.data (file download option will be added soon)');
  util.consoleLog(JSON.stringify(window.data));
}

export function clean() {
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
  for (let id of Object.keys(window.data.tasks).filter(x =>
    !['river', 'bank'].includes(x))) {
    let found = false;
    for (let containerId of Object.keys(window.data.tasks)) {
      if (window.data.tasks[containerId].subtasks.map(x =>
        util.stripR(x)).includes(id)) {
        found = true;
        break;
      }
    }
    if (found === false) {
      delete window.data.tasks[id];
      removeDeadline(window.data.settings.deadlines, id);
      removeDeadline(window.data.settings.startdates, id);
    }
  }

  // clean out empty dates in the river view
  const dates = window.data.tasks['river'].subtasks;
  let i = dates.length - 1;
  const today = new Date().toDateString();

  while(window.data.tasks[dates[i]].subtasks.length === 0) {
    i --;
    const now = window.data.tasks[dates[i]].title;
    if (i == 0 || now === today) break;
  }
  if (i < dates.length - 1) {
    window.data.tasks['river'].subtasks = dates.slice(0, i + 1);
  }
}