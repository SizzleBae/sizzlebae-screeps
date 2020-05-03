// import { BTNode, BTResult } from "./BTNode";
// import { Blackboard } from "./Blackboard";

// export class DataRefresh extends BTNode {

// 	constructor(public refreshableAlias: string) {
// 		super();
// 	}

// 	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
// 		const refreshable = blackboard[this.refreshableAlias] as { id: Id<string> | undefined };

// 		if (!refreshable || !refreshable.id) {
// 			return callback(BTResult.PANIC);
// 		}

// 		const refreshed = Game.getObjectById(refreshable.id);
// 		if (!refreshed) {
// 			return callback(BTResult.PANIC);
// 		}

// 		blackboard[this.refreshableAlias] = refreshed;
// 		callback(BTResult.SUCCESS);
// 	}
// }
