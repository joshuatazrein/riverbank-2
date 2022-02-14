class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideComplete: window.data.settings.hideComplete,
      bank: React.createRef(),
      river: React.createRef(),
      theme: window.data.settings.theme,
      mode: window.data.settings.mode,
      focused: window.data.settings.focused,
      popSnd: new Audio(popSnd),
      window.zoomed: '',
      disableSelect: '',
      contextMenu: React.createRef(),
      deadlines: window.data.settings.deadlines,
      startdates: window.data.settings.startdates,
      displayTable: 'none',
    };
  }
  toggleComplete() {
    if (this.state.hideComplete == '') {
      var hideComplete = 'hideComplete';
    } else {
      var hideComplete = '';
    }
    this.setState({ hideComplete: hideComplete });
    saveSetting('hideComplete', hideComplete);
    updateAllSizes();
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
    const sourceSplit = source.droppableId.split('-');
    const destSplit = destination.droppableId.split('-');

    function buildList(listSplit) {
      var listObjs = [];
      listObjs.push(window.app.current.state[listSplit[0]]);
      listObjs.push(listObjs[0].current.frames.find(x =>
        x.current.props.id == listSplit[1]));
      var i = 2;
      var task;
      function getTask() {
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
    window.selected = undefined;
  }
  render() {
    this.statusBar = React.createRef();
    return (
      <>
        <StatusBar parent={this} ref={this.statusBar} 
          deadlines={this.state.deadlines} 
          startdates={this.state.startdates} />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className={'container ' + this.state.hideComplete + ' ' +
            this.state.zoomed + ' ' + this.state.disableSelect}>
            <Frame id='bank' info={{
              ...window.data.tasks['bank'].info,
              focused: window.data.settings.focused
            }}
              subtasks={window.data.tasks['bank'].subtasks} ref={this.state.bank} />
            <Frame id='river' info={{
              ...window.data.tasks['river'].info,
              focused: window.data.settings.focused,
            }}
              deadlines={this.state.deadlines}
              startdates={this.state.startdates}
              subtasks={window.data.tasks['river'].subtasks} ref={this.state.river} />
          </div>
        </DragDropContext>
        <SelectMenu ref={this.state.contextMenu}/>
        {window.selected && this.state.displayTable !== 'none' &&
          <TableDisplay />}
      </>
    )
  }
}