function reset() {
  var accept = window.confirm('Are you sure you want to reset all data?');
  if (accept) {
    data = resetData;
    localStorage.setItem('data', JSON.stringify(resetData));
    setTimeout(function () { window.location.reload() }, 200);
  }
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

function backup() {
  alert('open console to copy data (file download option will be added soon)');
  consoleLog(JSON.stringify(data));
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