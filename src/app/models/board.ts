import * as _ from "lodash";

export class Board {
	board;
	dimension;

	constructor(board) {
		this.board = board;
		this.dimension = Math.sqrt(board.length);
	}

	neighbors() {
		let emptyTile = _.find(this.board, { value: null});
		return [
			this.neigborUp(emptyTile),
			this.neigborDown(emptyTile),
			this.neigborLeft(emptyTile),
			this.neigborRight(emptyTile)
		]
	}

	private neighborValue(x,y){
		if (this.isOnBoard(x,y)) {
			return this.valueAt(x,y);
		} else {
			return undefined;
		}
	}

	private valueAt(x,y) {
		return _.find(this.board, { x: x, y: y}).value;
	}

	private neigborUp(emptyTile) {
		return this.neighborValue(emptyTile.x, emptyTile.y - 1);
	}

	private neigborDown(emptyTile) {
		return this.neighborValue(emptyTile.x, emptyTile.y + 1);
	}

	private neigborLeft(emptyTile) {
		return this.neighborValue(emptyTile.x - 1, emptyTile.y);
	}

	private neigborRight(emptyTile) {
		return this.neighborValue(emptyTile.x + 1, emptyTile.y);
	}

	private isOnBoard(x, y) {
		if (this.withinDimensions(x) && this.withinDimensions(y)) {
			return true;
		} else {
			return false;
		}
	}

	private withinDimensions(n) {
		if (n >= 1 && n <= this.dimension) {
			return true;
		} else {
			return false;
		}
	}
}
