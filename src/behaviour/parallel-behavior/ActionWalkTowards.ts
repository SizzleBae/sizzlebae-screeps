import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { TimeFlow } from "../../utils/TimeFlow";
import { Utils } from "utils/Utils";

export class ActionWalkTowards extends BTNode {

	private agentLastPos!: RoomPosition;
	private cachedPath?: PathStep[];

	constructor(public positionAlias: string, public agentIdAlias: string, public options: FindPathOpts = {}) {
		super();
	}

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {

		const position = Utils.extractPosition(blackboard[this.positionAlias]);
		if (!position) {
			return callback(BTResult.PANIC);
		}

		this.attemptMove(blackboard[this.agentIdAlias] as Id<Creep>, position, callback);
	}

	private attemptMove(agentId: Id<Creep>, position: RoomPosition, callback: (result: BTResult) => void) {
		const agent = Utils.identify<Creep>(agentId, [Creep]);
		if (!agent) {
			return callback(BTResult.PANIC);
		}

		const path = this.findPath(agent.pos, position);
		const result = agent.moveByPath(path);
		// const result = refreshedAgent.moveTo(position, { visualizePathStyle: {} });

		this.agentLastPos = agent.pos;
		if (result === OK) {
			TimeFlow.submitAction(Game.time + 1, () => {
				const agent = Utils.identify<Creep>(agentId, [Creep]);
				if (!agent) {
					callback(BTResult.PANIC);
				} else if (agent.pos.isEqualTo(this.agentLastPos)) {
					callback(BTResult.FAILURE);
				} else {
					callback(BTResult.SUCCESS);
				}
			});
		}
		else if (result === ERR_TIRED) {
			TimeFlow.submitAction(Game.time + 1, () => this.attemptMove(agentId, position, callback));
		} else {
			callback(BTResult.FAILURE);
		}
	}

	private findPath(from: RoomPosition, to: RoomPosition): PathStep[] {
		if (this.cachedPath) {
			// return this.cachedPath;
		}

		this.cachedPath = from.findPathTo(to, this.options);
		this.cachedPath.forEach(path => Game.rooms[from.roomName].visual.circle(path.x, path.y));
		return this.cachedPath;

	}
}
