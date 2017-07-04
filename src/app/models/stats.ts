import * as _ from "lodash";
import { MovementService } from '../services/movement';
import {PuzzleCreatorService, times } from "../services/puzzle-creator";
import {AStar} from './aStar';


export class Stats {

	dimensions = [3,4];
	h_functions = [1,2];
	iterations = 2;

	results = [
		// {
		// 	board: [],
		// 	h1: 4,
		// 	h2: 7
		// }
	]
	puzzleCreator;
	constructor(puzzleCreator) {
		this.puzzleCreator = puzzleCreator;
	}

	run(){
		for (var dimension of this.dimensions) {
			times (this.iterations)  (() => {
				let result = {
					board: null,
					h1: null,
					h2: null
				};
				let board = this.puzzleCreator.createBoard(dimension);
				result = Object.assign({}, result, { board: board });
				let goal = this.puzzleCreator.createGoalState();
				for (var h_func of this.h_functions) {
					let aStar = new AStar(board, goal, h_func);
					let steps = aStar.run();
					if (h_func == 1) {
						result = Object.assign({}, result, { h1: steps });
					} else {
						result = Object.assign({}, result, { h2: steps });
					}
				}
				this.results.push(result);
			});
		}
		console.log("###### RESULTS ######");
		console.log(this.results);

	}

	compare(){
	}


}
