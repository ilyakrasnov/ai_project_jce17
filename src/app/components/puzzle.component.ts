import { Component, Input } from '@angular/core';
import {MdGridListModule} from '@angular/material';
import { MovementService } from "../services/movement"
import { Book } from '../models/book';
import * as book from '../actions/puzzle';
import * as _ from "lodash";
import {PuzzleCreatorService} from "../services/puzzle-creator";
import {AStar} from "../models/aStar";
import {Stats} from "../models/stats";
import {MdSnackBar} from '@angular/material';


@Component({
  selector: 'puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.css']
})
export class PuzzleComponent {
  dimension = 3;
  newDimension = 3;
  newRandDegree = 5;
  randDegrees = _.range(31);
  GOAL_STATE = [];
  newHeuristic;

  heuristics = [
    { id: 1,
      displayName: 'Number of Misplaced Tiles'
    },
    { id: 2,
      displayName: 'Sum of Manhattan Distances'
    }
  ]


  board = [
    // { x: 1, y: 1, value: 1 }, { x: 2, y: 1, value: 2 }, { x: 3, y: 1, value: 3 },
    // { x: 1, y: 2, value: 4 }, { x: 2, y: 2, value: 8 }, { x: 3, y: 2, value: 5 },
    // { x: 1, y: 3, value: null }, { x: 2, y: 3, value: 7 }, { x: 3, y: 3, value: 6}
  ];

  moves = [ ];
  aStar;

  constructor(
    private movement: MovementService,
    private snackBar: MdSnackBar,
    private puzzleCreator: PuzzleCreatorService
  ) {
    }

    ngOnInit(){
      this.initializeBoardAndGoal();
    }

    initializeBoardAndGoal(){
      this.dimension = this.newDimension;
    	// let puzzleCreator = new PuzzleCreatorService(this.dimension);
      this.board = this.puzzleCreator.createBoard(this.dimension, this.newRandDegree);
      this.GOAL_STATE = this.puzzleCreator.createGoalState();
      this.aStar = new AStar(this.GOAL_STATE, this.board);
    }

  // this.initializeBoardAndGoal();

	runStats(){
    	new Stats(this.puzzleCreator).run();
	}

  runAlgorithm(){
    this.aStar = new AStar(this.GOAL_STATE, this.board, this.newHeuristic);
      let result = this.aStar.run();

      if(result){
        this.snackBar.open(`YEAH.. Reached goal in ${result} steps`, '',{
          duration: 5000,
        });
      }
    }

    boardRows() {
      return _.chunk(this.board, this.dimension);
    }

    closedRows(closedBoard){
      return _.chunk(closedBoard, this.dimension);
    }

    getFringe(){
      return this.aStar.getFringe();
    }

    getClosed(){
      return this.aStar.getClosed();
    }

    getClosedStates(){
      return this.aStar.getClosedStates();
    }

    getFringeStates(i){
      console.log("i: ",i)
      return this.aStar.getFringeStates(i);
    }

    finished(){
      return this.deepCompare(this.GOAL_STATE, this.board);
    }

    tileClicked(tile_number) {
      let newBoard = this.movement.make_move(this.board, tile_number, this.dimension);
      this.saveAndMove(newBoard);
    }

    private saveAndMove(newBoard) {
      if (newBoard) {
        this.moves.push(newBoard);
        this.board = newBoard;
      }
    }

    private deepCompare(goal, state) {
      for (var tile of state) {
        if (!_.find(goal, tile)) {
          return false;
        }
      }
      return true;
    }
}
