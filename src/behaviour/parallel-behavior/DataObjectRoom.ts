import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { Utils } from "utils/Utils";

export class DataObjectRoom extends BTNode {

	constructor(public objectIdAlias: string, public roomAlias: string) {
		super();
	}

	run(blackboard: Blackboard): BTResult {

		const object = Utils.identify<RoomObject>(blackboard[this.objectIdAlias], [RoomObject]);
		if (!object) {
			return BTResult.PANIC;
		}

		const room = object.room;
		if (room) {
			blackboard[this.roomAlias] = room;
			return BTResult.SUCCESS;
		}
		return BTResult.FAILURE;
	}
}
