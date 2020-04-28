import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class GetTargetAtPosition extends BTNode {
	constructor(public type: "constructionSite" | "creep" | "energy" | "exit" | "flag" | "mineral" | "deposit" | "nuke" | "resource" | "source" | "structure" | "terrain" | "tombstone" | "powerCreep" | "ruin"
		, public alias: string = 'target') {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		const position = blackboard.position;
		if (!position) {
			console.log('Failed to init GetTargetAtPosition: Missing position')
			return BTResult.FAILURE;
		}

		blackboard.targets[this.alias] = Game.rooms[position.roomName].lookForAt(this.type, position)[0];
		return BTResult.SUCCESS;
	}
}
