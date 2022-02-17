import React from 'react';
import './Frame.css';
import * as display from '../../services/display/display';
import * as util from '../../services/util/util';
import List from '../List/List';

export default class Frame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subtasks: props.subtasks, info: props.info,
      width: display.processWidth(props.info.focused),
      zoomed: '',
    };
    if (props.id === 'river') {
      this.state.repeats = window.data.settings.repeats;
    }
  }
  addList = () => {
    // add a new list
    var title;
    if (this.props.id === 'river') {
      const lastDate = new Date(
        window.data.tasks[this.state.subtasks[this.state.subtasks.length - 1]].title);
      lastDate.setDate(lastDate.getDate() + 1);
      title = lastDate.toDateString();
    } else {
      title = '--';
    }

    const subtasks = this.state.subtasks;
    const id = String(new Date().getTime());
    window.data.tasks[id] = {
      title: title, subtasks: [], info: {}
    }
    subtasks.push(id);
    this.setState({subtasks: subtasks});
  }

  changeIndex = (val, set) => {
    let newIndex;
    if (set === true) {
      newIndex = val;
    } else {
      newIndex = this.state.info.index + val;
    }
    if (newIndex > 0 &&
      window.data.tasks[this.state.subtasks[newIndex - 1]].title === '--') {
      return;
    }
    if (
      set !== undefined && 
      newIndex > this.state.info.index && 
      this.props.id === 'bank'
    ) {
      newIndex -= (this.state.width - 1);
    }
    if (newIndex < 0) newIndex = 0;
    this.setState(prevState => ({
      info: { ...prevState.info, index: newIndex }
    }));
  }
  render() {
    var resizeCheck = () => {
      if (this.state.width !== display.processWidth(this.state.info.focused)) {
        this.setState({ width: display.processWidth(this.state.info.focused) });
      }
    }
    let endIndex = this.state.info.index + this.state.width;
    this.frames = [];
    window.addEventListener('resize', resizeCheck);
    // const shownLists =
    //   this.state.subtasks.slice(this.state.info.index, endIndex);
    const shownLists = this.state.subtasks;
    return (
      <div className={`frameContainer 
        ${this.state.info.focused} ${this.state.zoomed}`}>
        <div id={this.props.id}
          className={'frame'}>
          {shownLists.map(x => {
            this.frames.push(React.createRef());
            const task = window.data.tasks[x];
            if (this.props.id === 'river') {
              // render state correctly in original lists
              return (
                <List key={x} id={x} title={task.title}
                  subtasks={task.subtasks} parent={this}
                  deadlines={this.props.deadlines[task.title]}
                  startdates={this.props.startdates[task.title]}
                  repeats={this.state.repeats[util.dateFormat(task.title)
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
          <button className='changeButton' title='add list or date'
            onClick={() => this.addList()}>+</button>
        </div>
      </div>
    );
  }
}