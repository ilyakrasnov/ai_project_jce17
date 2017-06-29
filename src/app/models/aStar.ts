import * as _ from "lodash";

export class AStar {
  goal;
  movement;
  dimension;
  start;
  fringe = [];
  closed = [];
  g = 0;
  heuristicFunction;

  readonly HEURISTIC_FUNCITONS = {
    1: this.nrOfMisplacedTiles,
    2: this.sumOfManattenDistances
  }

  constructor(goal, start, movement, dimension, h = 1) {
    this.goal = goal;
    this.movement = movement;
    this.dimension = dimension;
    this.heuristicFunction = h;
    this.start = start;
  }

  getFringe(){
    return this.fringe;
  }

  getClosed(){
    console.log("###### CLOSED IS ######");
    console.log(this.closed);

    return this.closed;
  }

  run(){
    this.pushToFringe({
      f: this.f(this.start),
      board: this.start
    });

    // console.log("###### FRINGE ######");
    // console.log(this.fringe);
    //
    // console.log("###### CLOSED ######");
    // console.log(this.closed);

    while(!_.isEmpty(this.fringe)) {
      let node = _.head(this.fringe);
      this.fringe = _.tail(this.fringe);
      if (node) {
        if (this.goalReached(node)) {
          console.log(`###### GOAL REACHED AFTER ${this.g} STEPS ######"`);
          return;
        } else {
          this.closed.push(node);
          this.g += 1;
          let children = this.children(node.board);

          // TODO sort children by value (number in the tile)
          console.log("###### GOT CHILDREN ######");
          console.log(this.fringe);

          for (var child of children) {
            if (child && this.isNotInClosed(child)) {
              let f = this.f(child);
              this.pushToFringe( {
                board: child,
                f: f
              });
            }
          }
        }
      } else {
        // console.log("###### FRINDGE EMPTY... :( ######");
      }
    }

  }

  isNotInClosed(board) {
    // let check = _.find(this.closed, board);
    // console.log("###### CHECKING... ######");
    // console.log(check);


    if (_.find(this.closed, board)) {
      return false;
    } else {
      return true;
    }

  }

  pushToFringe(node){
    if(_.isEmpty(this.fringe)) {
      this.fringe.push(node);
    } else {

      let index = _.findIndex(this.fringe, function(nodeInFringe) { return nodeInFringe.f > node.f });
      if(index == -1){
        this.fringe.push(node);
      } else {
        this.fringe.splice(index, 0, node);
      }

    }

    console.log("###### NEW FRINGE ######");
    console.log(this.fringe);
  }

  f(board){
    return this.g + this.hFunction(board);
  }

  hFunction(board){

    let heuristic = this.HEURISTIC_FUNCITONS[this.heuristicFunction];
    return heuristic(board, this.goal);
  }

  nrOfMisplacedTiles(board, goal){

    let misplaced = 0;
    for (var tile of board) {
      if (!_.find(goal, tile)) {
        misplaced = misplaced + 1;
      }
    }
    misplaced = misplaced - 1;
    return misplaced;
  }

  sumOfManattenDistances(board){
    console.log("###### I AM MANHATTEN ######");
    console.log();
  }

  goalReached(node){
    console.log("###### CHECKING IF REACHED GOAL ######");
    console.log(node.board);
    console.log(this.goal);

    for (var tile of node.board) {
      if (!_.find(this.goal, tile)) {
        return false;
      }
    }
    return true;
  }

  children(board) {
    let emptyTile = _.find(board, { value: null});

    return [
      this.childUp(board, emptyTile),
      this.childDown(board, emptyTile),
      this.childLeft(board, emptyTile),
      this.childRight(board, emptyTile)
    ]
  }

  private nextState(board, x, y) {

    console.log("###### IN NEXT STATE: ######");
    console.log(board);
    console.log(x,y);

    if (this.isOnBoard(x, y)){
      let value = _.find(board, { x: x, y: y }).value;

      let new_board = this.movement.make_move(board, value);

      return this.movement.make_move(board, value, this.dimension);
    }
  }

  private childUp(board, emptyTile) {
    let new_x = emptyTile.x;
    let new_y = emptyTile.y - 1;
    console.log("###### NEW COORDS ######");
    console.log(new_x, new_y);

    return this.nextState(board, new_x, new_y);
  }

  private childDown(board, emptyTile) {
    let new_x = emptyTile.x;
    let new_y = emptyTile.y + 1;

    return this.nextState(board, new_x, new_y);
  }

  private childLeft(board, emptyTile) {
    let new_x = emptyTile.x - 1;
    let new_y = emptyTile.y;

    return this.nextState(board, new_x, new_y);
  }
  private childRight(board, emptyTile) {
    let new_x = emptyTile.x + 1;
    let new_y = emptyTile.y;

    return this.nextState(board, new_x, new_y);
  }

  private isOnBoard(x, y) {
    if (this.withinDimensions(x) && this.withinDimensions(y)) {
      return true;
    } else {
      return false;
    }
  }

  private withinDimensions(n) {
    if (n >= 1 && n <= 3) {
      return true;
    } else {
      return false;
    }
  }

}