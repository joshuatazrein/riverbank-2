function keyComms(ev) {
  if (!ev.ctrlKey) {
    if (ev.key === 'Enter' && !window.preventReturn) {
      ev.preventDefault();
      if (ev.shiftKey) {
        newTask('task');
      } else {
        newTask();
      }
      return;
    } else if (ev.key === 'Escape' && !window.preventReturn) {
      ev.preventDefault();
      if (window.app.current.state.displayTable !== 'none') displayTable();
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
      case 'F':
        ev.preventDefault();
        zoom();
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
      case ']':
        ev.preventDefault();
        indentTask();
        break;
      case '[':
        ev.preventDefault();
        indentTask(true);
        break;
      case 'f':
        ev.preventDefault();
        focus();
        break;
      case 'z':
        ev.preventDefault();
        undo();
        break;
      case 'r':
        ev.preventDefault();
        updateAllSizes();
        break;
      case 'Backspace':
        ev.preventDefault();
        if (selected && selected instanceof Task) {
          selected.deleteThis();
        } else if (selected && selected instanceof List &&
          selected.props.parent.props.id === 'bank') {
          const confirm = window.confirm('delete this list?');
          if (confirm) {
            const subtasks = selected.props.parent.state.subtasks;
            window.undoData = localStorage.getItem('data');
            subtasks.splice(
              subtasks.findIndex(x => x === selected.props.id), 1);
            selected.props.parent.setState({ subtasks: subtasks });
          }
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
        switchView(-1);
        break;
      case 'd':
        ev.preventDefault();
        switchView(1);
        break;
      case 'h':
        ev.preventDefault();
        window.app.current.toggleComplete();
        break;
      case 't':
        ev.preventDefault();
        if (window.app.current.state.zoomed === 'zoomed') return;
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