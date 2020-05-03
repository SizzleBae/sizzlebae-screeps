import { TimeFlow } from "utils/TimeFlow";
import { Logger, LogVerbosity } from "utils/Log";
import { ErrorMapper } from "utils/ErrorMapper";
import { Parallel } from "behaviour/parallel-behavior/Parallel";
import { Sequence } from "behaviour/parallel-behavior/Sequence";
import { DataSet } from "behaviour/parallel-behavior/DataSet";
import { ActionWalkTowards } from "behaviour/parallel-behavior/ActionWalkTowards";
import { Blackboard } from "behaviour/parallel-behavior/Blackboard";
import { ActionHarvest } from "behaviour/parallel-behavior/ActionHarvest";
import { Repeater } from "behaviour/parallel-behavior/Repeater";
import { Condition } from "behaviour/parallel-behavior/Condition";
import { ConditionInRange } from "behaviour/parallel-behavior/ConditionInRange";
import { RepeatUntilFail } from "behaviour/parallel-behavior/RepeatUntilFail";
import { BTNode } from "behaviour/parallel-behavior/BTNode";
import { BehaviourTree } from "behaviour/parallel-behavior/BehaviourTree";
import { Inverter } from "behaviour/parallel-behavior/Inverter";
import { DataFindInRoom } from "behaviour/parallel-behavior/DataFindInRoom";
import { DataObjectRoom } from "behaviour/parallel-behavior/DataObjectRoom";
import { DataPopArray } from "behaviour/parallel-behavior/DataPopArray";
import { ActionTransfer } from "behaviour/parallel-behavior/ActionTransfer";

export type ColonyStructure = Record<string,
	Record<string, {
		body: BodyPartConstant[],
		behaviour: BehaviourTree
	}>
>


// const structure = {
// 	Spawn1: {
// 	}
// };

// const towerBehaviour = new BehaviourTree(
// 	new Sequence([
// 		new Sequence([
// 			new GetAgentAsTarget('agent'),
// 			new GetTargetRoom('room', 'agent'),
// 			new FindStackInRoom(FIND_HOSTILE_CREEPS, undefined, 'hostiles', 'room'),
// 			new RepeatUntilFail(new Sequence([
// 				new PopStackToTarget('hostile', 'hostiles'),
// 				new RepeatUntilFail(new AttackTarget('hostile'))
// 			]))
// 		]),
// 	]))

const BTWalkTo = (positionAlias: string, agentAlias: string, options?: FindPathOpts, predicate?: BTNode) => {

	const sequence = new Sequence([
		new Inverter(new ConditionInRange(positionAlias, agentAlias, options ? options.range ? options.range : 0 : 0)),
		new ActionWalkTowards(positionAlias, agentAlias, options)
	])

	if (predicate) {
		sequence.children.unshift(predicate);
	}

	return new RepeatUntilFail(sequence);

}
console.log('H I I AM MAIIIINN!!!!');
const behaviour = new BehaviourTree(new Repeater(1,
	new Sequence([
		new Sequence([
			new DataObjectRoom('agent', 'room'),
			new DataFindInRoom('room', 'sources', FIND_SOURCES),
			new DataPopArray('sources', 'source'),
			BTWalkTo('source', 'agent', { range: 1 }),
			new RepeatUntilFail(new Sequence([
				new Condition(blackboard => Game.getObjectById(blackboard.agent as Id<Creep>)!.store.getFreeCapacity() !== 0),
				new ActionHarvest('source', 'agent')
			]))
		]),
		new Sequence([
			new DataObjectRoom('agent', 'room'),
			new DataFindInRoom('room', 'containers', FIND_STRUCTURES, structure => structure instanceof StructureContainer),
			new DataPopArray('containers', 'container'),
			BTWalkTo('container', 'agent', { range: 1 }),
			new ActionTransfer('container', 'agent', 'energy')
		])
	])
)).debug()

const agent = Game.creeps.Lauren;
behaviour.blackboard.agent = agent.id;
behaviour.run();

export const init = () => {
	console.log('inititititititititi');
}

export const loop = ErrorMapper.wrapLoop(() => {
	Logger.verbosity = LogVerbosity.DEBUG;
	Logger.printTickStart();

	// behaviour.logState();
	TimeFlow.executeTick(Game.time);

	// Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name];
		}
	}
});
