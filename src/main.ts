import { ErrorMapper } from 'utils/ErrorMapper';
import { BehaviourTree } from 'behaviour/BehaviourTree';
import { Sequence } from 'behaviour/Sequence';
import { SetPositionFromFlag as GetPositionFromFlag } from 'behaviour/GetPositionFromFlag';
import { WalkToPosition } from 'behaviour/WalkToPosition';
import { GetTargetAtPosition } from 'behaviour/GetTargetAtPosition';
import { HarvestTarget } from 'behaviour/HarvestTarget';
import { TransferToTarget } from 'behaviour/TransferToTarget';
import { GetTargetRoom } from 'behaviour/GetTargetRoom';
import { FindStackInRoom } from 'behaviour/FindStackInRoom';
import { RepeatUntilFail } from 'behaviour/RepeatUntilFail';
import { PopStack as PopStackToTarget } from 'behaviour/PopStackToTarget';
import { GetTargetPosition } from 'behaviour/GetTargetPosition';
import { BuildTarget } from 'behaviour/BuildTarget';
import { GetAgentAsTarget } from 'behaviour/GetAgentAsTarget';
import { SortStackClosestFirst } from 'behaviour/SortStackClosestFirst';
import { Selector } from 'behaviour/Selector';
import { UpgradeController } from 'behaviour/UpgradeController';
import { HasFreeCapacity } from 'behaviour/HasFreeCapacity';
import { Inverter } from 'behaviour/Inverter';
import { PickUpTarget } from 'behaviour/PickUpTarget';
import { DropStore } from 'behaviour/DropStore';
import { HasUsedCapacity } from 'behaviour/HasUsedCapacity';
import { Logger, LogVerbosity } from 'utils/Log';

export type ColonyStructure = Record<string,
	Record<string, {
		body: BodyPartConstant[],
		behaviour: BehaviourTree
	}>
>

const BTUpgrade = () => {
	return new Sequence([
		new GetAgentAsTarget(),
		new HasUsedCapacity('energy'),
		new GetTargetRoom(),
		new FindStackInRoom(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === 'controller' }),
		new PopStackToTarget(),
		new GetTargetPosition(),
		new WalkToPosition({ range: 3 }),
		new UpgradeController()
	])
}

const BTConstruct = () => {
	return new Sequence([
		new GetAgentAsTarget('agent'),
		new HasUsedCapacity('energy', 'agent'),
		new GetTargetRoom('room', 'agent'),
		new FindStackInRoom(FIND_CONSTRUCTION_SITES),
		new SortStackClosestFirst('agent'),
		new RepeatUntilFail(
			new Sequence([
				new PopStackToTarget('energyContainer'),
				new HasUsedCapacity('energy', 'agent'),
				new PopStackToTarget(),
				new GetTargetPosition(),
				new WalkToPosition({ range: 3 }),
				new BuildTarget()
			])
		)
	])
}

const BTDeliverSpawnEnergy = () => {
	return new Sequence([
		new GetAgentAsTarget('agent'),
		new HasUsedCapacity('energy', 'agent'),
		new GetPositionFromFlag('Spawn1'),
		new GetTargetAtPosition('structure'),
		new GetTargetRoom(),
		new FindStackInRoom(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === 'spawn' || structure.structureType === 'extension' }),
		new SortStackClosestFirst('agent'),
		new RepeatUntilFail(
			new Sequence([
				new PopStackToTarget('energyContainer'),
				new Selector([
					new Inverter(new HasFreeCapacity('energy', 'energyContainer')),
					new Sequence([
						new GetTargetPosition('energyContainer'),
						new WalkToPosition({ range: 1 }),
						new TransferToTarget('energy', 'energyContainer')
					])
				])
			])
		)
	])
}

const BTHarvest = (sourceFlag: string) => {
	return new Selector([
		new Sequence([
			new GetAgentAsTarget(),
			new Inverter(new HasFreeCapacity('energy'))
		]),
		new Sequence([
			new GetPositionFromFlag(sourceFlag),
			new WalkToPosition({ range: 1 }),
			new GetTargetAtPosition('source'),
			new HarvestTarget(),
		])
	])
}

const structure: ColonyStructure = {
	Spawn1: {

		ashe: {
			body: ['carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source2'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		lamar: {
			body: ['carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source2'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		victor: {
			body: ['carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source2'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		tard: {
			body: ['carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source2'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		ron: {
			body: ['carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source2'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		easy: {
			body: ['carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source2'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		hard: {
			body: ['carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source2'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		don: {
			body: ['carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source2'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		ned: {
			body: ['carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source1'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		com: {
			body: ['carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source1'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		// krud: {
		// 	body: ['carry', 'move', 'carry', 'move', 'carry', 'carry', 'carry', 'carry', 'move', 'move', 'move', 'move'],
		// 	behaviour: new BehaviourTree(
		// 		new Sequence([
		// 			new GetAgentAsTarget('agent'),
		// 			new GetTargetRoom('room', 'agent'),
		// 			new FindStackInRoom(FIND_DROPPED_RESOURCES, undefined, 'allDropped', 'room'),
		// 			new RepeatUntilFail(
		// 				new Sequence([
		// 					new HasRemainingCapacity('energy'),
		// 					new PopStackToTarget('dropped', 'allDropped'),
		// 					new GetTargetPosition('dropped'),
		// 					new WalkToPosition({ range: 1 }),
		// 					new PickUpTarget('dropped'),
		// 				])
		// 			),
		// 			new Sequence([
		// 				BTDeliverSpawnEnergy()
		// 			])
		// 		])
		// 	)
		// },
		// stud: {
		// 	body: ['carry', 'move', 'work', 'work', 'work', 'work', 'work', 'work'],
		// 	behaviour: new BehaviourTree(
		// 		new Sequence([
		// 			BTHarvest('Source1'),
		// 			new DropStore('energy')
		// 		])
		// 	)
		// }
	}
}

export const loop = ErrorMapper.wrapLoop(() => {
	// console.log(`Current game tick is ${Game.time}`);
	Logger.verbosity = LogVerbosity.DEBUG;

	// Logger.behaviour.setAgentsFilter([Game.creeps.com]);

	Logger.printTickStart();

	for (const [spawnName, spawnData] of Object.entries(structure)) {
		for (const [creepName, creepData] of Object.entries(spawnData)) {
			const creep = Game.creeps[creepName];
			if (creep) {
				creepData.behaviour.tick(creep);
			} else {
				Game.spawns[spawnName].spawnCreep(creepData.body, creepName);

			}
		}
	}

	// Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name];
		}
	}
});
