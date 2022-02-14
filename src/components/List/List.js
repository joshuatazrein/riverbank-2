class List extends React.Component {
  constructor(props) {
    super(props);
    this.taskList = React.createRef();
    this.state = {
      // filter subtasks here
      subtasks: props.subtasks,
      title: props.title,
      info: {}, zoomed: ''
    };
  }
  changeTitle(ev) {
    this.setState({ title: ev.target.value });
  }
  sortList() {
    // sort the given list by time
    let ordered = true;
    let currentTime = 0;
    for (let x of this.subtasksCurrent) {
      const task = window.data.tasks[stripR(x)];
      const thisTime = getTime(task.info.startDate);
      if (
        task.info.type == 'event' &&
        thisTime < currentTime
      ) {
        ordered = false;
        break;
      }
      currentTime = thisTime;
    }
    if (ordered) return;
    // sort the list
    let sortedList = [];
    let currentSort = ['start'];
    for (let task of this.subtasksCurrent) {
      const taskData = window.data.tasks[stripR(task)];
      if (taskData.info.type === 'event' && 
        !taskData.info.startDate.includes('--')) {
        sortedList.push(currentSort);
        currentSort = [];
        currentSort.push(task);
      } else {
        currentSort.push(task);
      }
    }
    sortedList.push(currentSort); // add last thing
    sortedList = sortedList.sort((a, b) => {
      if (a[0] === 'start' || a.length === 0) {
        a = a.splice(0, 1);
        return -1;
      } else if (b[0] === 'start' || b.length === 0) {
        b = b.splice(0, 1);
        return 1;
      } else {
        return getTime(window.data.tasks[stripR(a[0])].info.startDate) - 
          getTime(window.data.tasks[stripR(b[0])].info.startDate)
      }
    }).flat();
    this.subtasksCurrent = sortedList;
  }
  updateHeights = () => {
    if (!this.taskList.current) return;
    const objects = this.taskList.current.subtaskObjects.filter(
      x => x.current.isComplete() !== 'complete'
    );
    for (
      let i = 0; i < objects.length - 1; i++
    ) {
      const thisObject = objects[i].current;
      const nextObject = objects[i + 1].current;
      let minHeight = 1;
      if (
        thisObject.state.info.type === 'event'
      ) {
        const endDate = thisObject.state.info.endDate;
        if (!endDate.includes('--')) {
          // rounded to 30 minutes
          minHeight = (endDate[0] * 60 + endDate[1]) / 60;
        } else if (nextObject.state.info.type === 'event') {
          // no end date
          const startDate = nextObject.state.info.startDate;
          if (!startDate.includes('--')) {
            const difference = 
              getTime(startDate) - getTime(thisObject.state.info.startDate);
            minHeight = difference / 60;
          }
        }
      }
      thisObject.setState({ minHeight: minHeight });
    }
    if (objects.length > 0) {
      let minHeight = 1;
      const lastObject = objects[objects.length - 1].current;
      const endDate = lastObject.state.info.endDate;
      if (lastObject.state.info.type === 'event' &&
        !endDate.includes('--')) {
        // rounded to 30 minutes
        minHeight = (endDate[0] * 60 + endDate[1]) / 60;
      }
      lastObject.setState({ minHeight: minHeight });
    }
  }
  render() {
    function selectThis() {
      selectTask(this);
    }
    selectThis = selectThis.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.listInput = React.createRef();
    this.subtasksCurrent = this.state.subtasks.filter(x =>
      !(x.charAt(0) === 'R' && !this.props.repeats.includes(x)) &&
      window.data.tasks[stripR(x)]);
    if (this.props.parent.props.id === 'river') {
      for (let task of this.props.repeats) {
        if (!this.subtasksCurrent.includes(task) &&
          !this.subtasksCurrent.includes(stripR(task))) {
          this.subtasksCurrent.push(task);
        }
      }
    }
    if (getFrame(this).props.id === 'river') {
      this.sortList();
      setTimeout(this.updateHeights, 100);
    }
    return (
      <div className={'list' + ' ' + this.state.zoomed} onClick={selectThis}>
        <div className='listInputBackground'>
          {this.props.parent.props.id === 'bank' ?
            <input className='listInput' value={this.state.title}
              onChange={this.changeTitle} ref={this.listInput}></input> :
            <>
              <div class='monthYear'>
                <span>{this.state.title.slice(4, 8)}</span>
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
                  onClick={() => searchDate(window.data.tasks[stripR(x)].title, 'start')}>
                  {window.data.tasks[stripR(x)].title}</li>;
              })}
            </ul>}
          {this.props.parent.props.id === 'river' &&
            this.props.startdates &&
            <ul>
              {this.props.startdates.map(x => {
                return (<li
                  className='startdate' key={String(x)}
                  onClick={() => searchDate(window.data.tasks[stripR(x)].title,
                    'start')}>
                  {window.data.tasks[stripR(x)].title}</li>);
              })}
            </ul>}
          {<TaskList ref={this.taskList} subtasks={this.subtasksCurrent}
            parent={this} />}
        </div>
      </div>
    )
  }
}