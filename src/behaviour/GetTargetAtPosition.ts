import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class GetTargetAtPosition extends BTNode {
	constructor(public type: "constructionSite" | "creep" | "energy" | "exit" | "flag" | "mineral" | "deposit" | "nuke" | "resource" | "source" | "structure" | "terrain" | "tombstone" | "powerCreep" | "ruin"
		, public targetAlias: string = 'target', public positionAlias: string = 'position') {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		const position = blackboard.getTarget<RoomPosition>(this.positionAlias);
		if (!position) {
			console.log('Failed to init GetTargetAtPosition: Missing position')
			return BTResult.FAILURE;
		}

		blackboard.setTarget(this.targetAlias, Game.rooms[position.roomName].lookForAt(this.type, position)[0]);
		return BTResult.SUCCESS;
	}
}
