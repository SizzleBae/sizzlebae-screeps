// import { BTNodeComposite, BTResult, BTState } from "./BTNode";
// import { Blackboard } from "./Blackboard";

// export class Parallel extends BTNodeComposite {

// 	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
// 		const results: BTResult[] = [];


// 		this.children.forEach(child => {
// 			child.state = BTState.EXECUTING;
// 			child.run(blackboard, result => {
// 				child.state = result as number;
// 				results.push(result);

// 				if (results.length === this.children.length) {
// 					let parallellResult = BTResult.SUCCESS;
// 					results.forEach(result => {
// 						if (result > parallellResult) {
// 							parallellResult = result;
// 						}
// 					})

// 					callback(result);
// 				}
// 			})
// 		});
// 	}

// }
