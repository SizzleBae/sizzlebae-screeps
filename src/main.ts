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
import { BTNode, BTState } from "behaviour/parallel-behavior/BTNode";
import { BehaviourTree } from "behaviour/parallel-behavior/BehaviourTree";
import { Inverter } from "behaviour/parallel-behavior/Inverter";
import { DataFindInRoom } from "behaviour/parallel-behavior/DataFindInRoom";
import { DataObjectRoom } from "behaviour/parallel-behavior/DataObjectRoom";
import { DataPopArray } from "behaviour/parallel-behavior/DataPopArray";
import { ActionTransfer } from "behaviour/parallel-behavior/ActionTransfer";
import { DataSortArray } from "behaviour/parallel-behavior/DataSortArray";
import { Utils } from "utils/Utils";
import { ConditionCapacity } from "behaviour/parallel-behavior/ConditionCapacity";
import { ActionUpgrade } from "behaviour/parallel-behavior/ActionUpgrade";
import { Wait } from "behaviour/Wait";
import { ActionWait } from "behaviour/parallel-behavior/ActionWait";

export type ColonyStructure =
	Record<string, Record<string, {
		behaviour: BehaviourTree
	}>>

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

const BTMine = (targetAlias: string, agentAlias: string) =>
	new Sequence([
		BTWalkTo(targetAlias, agentAlias, { range: 1 }),
		new RepeatUntilFail(new Sequence([
			new ConditionCapacity(agentAlias, 'Free', 'MoreThan', 0),
			new ActionHarvest(targetAlias, agentAlias),
			new ActionWait(1)
		]))
	])

const colony: ColonyStructure = {
	Spawn1: {}
	// Spawn1: {
	// 	Lauren: {
	// 		body: ['work', 'carry', 'move', 'move'],
	// 		behaviour: new BehaviourTree(new Repeater(1,
	// 			new Sequence([
	// 				new Sequence([
	// 					new DataObjectRoom('agent', 'room'),
	// 					new DataFindInRoom('room', 'sources', FIND_SOURCES),
	// 					new DataSortArray<Source>('sources', (aId, bId, blackboard) => {
	// 						const agent = Utils.extractPosition(blackboard.agent);
	// 						const a = Utils.extractPosition(aId);
	// 						const b = Utils.extractPosition(bId);
	// 						if (agent && a && b) {
	// 							return agent.getRangeTo(b) - agent.getRangeTo(a);
	// 						}
	// 						return 0;
	// 					}),
	// 					new DataPopArray('sources', 'source'),
	// 					BTMine('source', 'agent')
	// 				]),
	// 				new Sequence([
	// 					new DataObjectRoom('agent', 'room'),
	// 					new DataFindInRoom('room', 'containers', FIND_STRUCTURES, structure => structure instanceof StructureSpawn || structure instanceof StructureExtension),
	// 					new RepeatUntilFail(new Sequence([
	// 						new ConditionCapacity('agent', 'Used', 'MoreThan', 0, 'energy'),
	// 						new DataPopArray('containers', 'container'),
	// 						new ConditionCapacity('container', 'Free', 'MoreThan', 0, 'energy'),
	// 						BTWalkTo('container', 'agent', { range: 1 }),
	// 						new ActionTransfer('container', 'agent', 'energy')
	// 					]))
	// 				]),
	// 				new Sequence([
	// 					new DataObjectRoom('agent', 'room'),
	// 					new DataFindInRoom('room', 'controllers', FIND_STRUCTURES, structure => structure instanceof StructureController),
	// 					new DataPopArray('controllers', 'controller'),
	// 					BTWalkTo('controller', 'agent', { range: 3 }),
	// 					new ActionUpgrade('controller', 'agent')
	// 				])
	// 			])
	// 		))
	// 	}
	// }
}

const createDefaultBehaviour = () =>
	new BehaviourTree(new Repeater(1,
		new Sequence([
			new Sequence([
				new DataObjectRoom('agent', 'room'),
				new DataFindInRoom('room', 'sources', FIND_SOURCES),
				new DataSortArray<Source>('sources', (aId, bId, blackboard) => {
					const agent = Utils.extractPosition(blackboard.agent);
					const a = Utils.extractPosition(aId);
					const b = Utils.extractPosition(bId);
					if (agent && a && b) {
						return agent.getRangeTo(b) - agent.getRangeTo(a);
					}
					return 0;
				}),
				new DataPopArray('sources', 'source'),
				BTMine('source', 'agent')
			]),
			new Sequence([
				new DataObjectRoom('agent', 'room'),
				new DataFindInRoom('room', 'containers', FIND_STRUCTURES, structure => structure instanceof StructureSpawn || structure instanceof StructureExtension),
				new RepeatUntilFail(new Sequence([
					new ConditionCapacity('agent', 'Used', 'MoreThan', 0, 'energy'),
					new DataPopArray('containers', 'container'),
					new ConditionCapacity('container', 'Free', 'MoreThan', 0, 'energy'),
					BTWalkTo('container', 'agent', { range: 1 }),
					new ActionTransfer('container', 'agent', 'energy'),
				]))
			]),
			new Sequence([
				new ConditionCapacity('agent', 'Used', 'MoreThan', 0, 'energy'),
				new DataObjectRoom('agent', 'room'),
				new DataFindInRoom('room', 'controllers', FIND_STRUCTURES, structure => structure instanceof StructureController),
				new DataPopArray('controllers', 'controller'),
				new ConditionCapacity('agent', 'Used', 'MoreThan', 0, 'energy'),
				BTWalkTo('controller', 'agent', { range: 3 }),
				new RepeatUntilFail(new Sequence([
					new ActionUpgrade('controller', 'agent'),
					new ActionWait(1)
				]))
			])
		])
	))


export const loop = ErrorMapper.wrapLoop(() => {
	Logger.verbosity = LogVerbosity.DEBUG;
	Logger.printTickStart();

	// Setup behaviours for creeps that dont have any
	for (const [creepName, creep] of Object.entries(Game.creeps)) {
		const creepData = colony['Spawn1'][creepName];
		if (!creepData) {
			colony['Spawn1'][creepName] = { behaviour: createDefaultBehaviour() };
		} else {
			if (creepName === '557211.3568914272') {
				creepData.behaviour.logState();
			}
		}
	}

	const spawn = Game.spawns['Spawn1'];
	if (!spawn.spawning) {
		spawn.spawnCreep(['work', 'carry', 'move', 'move'], '' + Math.random() * 10000000);
	}

	for (const [spawnName, spawnData] of Object.entries(colony)) {
		for (const [creepName, creepData] of Object.entries(spawnData)) {
			const creep = Game.creeps[creepName];
			if (creep) {
				// creepData.behaviour.logState();
				creepData.behaviour.blackboard.agent = creep.id;
				if (creepData.behaviour.state !== BTState.EXECUTING) {
					creepData.behaviour.run();
				}
			}
		}
	}


	TimeFlow.executeTick(Game.time);

	// Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name];
		}
	}
});
