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
import { PopStackToTarget as PopStackToTarget } from 'behaviour/PopStackToTarget';
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
import { WithdrawFromTarget } from 'behaviour/WithdrawFromTarget';
import { RepairTarget } from 'behaviour/RepairTarget';

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
		new GetTargetRoom('room', 'agent'),
		new FindStackInRoom(FIND_CONSTRUCTION_SITES, undefined, 'stack', 'room'),
		new SortStackClosestFirst('agent', 'stack'),
		new RepeatUntilFail(
			new Sequence([
				new PopStackToTarget('energyContainer'),
				new HasUsedCapacity('energy', 'agent'),
				new GetTargetPosition('energyContainer'),
				new WalkToPosition({ range: 3 }),
				new BuildTarget('energyContainer')
			])
		)
	])
}

const BTMaintain = () => {
	return new Sequence([
		new GetAgentAsTarget('agent'),
		new GetTargetRoom('room', 'agent'),
		new FindStackInRoom(FIND_STRUCTURES, { filter: structure => structure.hits < structure.hitsMax && !(structure instanceof StructureWall) }, 'maintainables', 'room'),
		new SortStackClosestFirst('agent', 'maintainables'),
		new RepeatUntilFail(
			new Sequence([
				new HasUsedCapacity('energy', 'agent'),
				new PopStackToTarget('maintainable', 'maintainables'),
				new GetTargetPosition('maintainable'),
				new WalkToPosition({ range: 3 }),
				new RepairTarget('maintainable')
			])
		)
	])
}

const BTDeliverSpawnEnergy = () => {
	return new Sequence([
		new GetAgentAsTarget('agent'),
		new HasUsedCapacity('energy', 'agent'),
		new GetTargetRoom('room', 'agent'),
		new FindStackInRoom(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === 'spawn' || structure.structureType === 'extension' }, 'stack', 'room'),
		new SortStackClosestFirst('agent', 'stack'),
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

const BTWithdrawFromContainers = (type: ResourceConstant) => {
	return new Sequence([
		new GetAgentAsTarget('agent'),
		new GetTargetRoom('room', 'agent'),
		new FindStackInRoom(FIND_STRUCTURES, { filter: structure => structure instanceof StructureContainer || structure instanceof StructureStorage }, 'containers', 'room'),
		new SortStackClosestFirst('agent', 'containers'),
		new RepeatUntilFail(
			new Sequence([
				new HasFreeCapacity(type, 'agent'),
				new PopStackToTarget('container', 'containers'),
				new HasUsedCapacity(type, 'container'),
				new GetTargetPosition('container'),
				new WalkToPosition({ range: 1 }),
				new WithdrawFromTarget(type, 'container')
			])
		),
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
		don: {
			body: ['carry', 'carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTWithdrawFromContainers('energy'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTMaintain(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		ron: {
			body: ['carry', 'carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTWithdrawFromContainers('energy'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTUpgrade(),
						BTConstruct()
					])
				])
			)
		},
		easy: {
			body: ['carry', 'carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTWithdrawFromContainers('energy'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTMaintain(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		asd: {
			body: ['carry', 'carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTWithdrawFromContainers('energy'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTMaintain(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		wasf: {
			body: ['carry', 'carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTWithdrawFromContainers('energy'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTMaintain(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		ddss: {
			body: ['carry', 'carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTWithdrawFromContainers('energy'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTMaintain(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		hard: {
			body: ['carry', 'carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTWithdrawFromContainers('energy'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTMaintain(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		ned: {
			body: ['carry', 'carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTWithdrawFromContainers('energy'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTMaintain(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		com: {
			body: ['carry', 'carry', 'carry', 'move', 'move', 'move', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTWithdrawFromContainers('energy'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTMaintain(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		krud: {
			body: ['carry', 'move', 'carry', 'move', 'carry', 'move', 'carry', 'move', 'carry', 'move', 'carry', 'move', 'carry', 'move', 'carry', 'move'],
			behaviour: new BehaviourTree(
				new Sequence([
					new GetAgentAsTarget('agent'),
					new GetTargetRoom('room', 'agent'),
					new FindStackInRoom(FIND_DROPPED_RESOURCES, undefined, 'allDropped', 'room'),
					new SortStackClosestFirst('agent', 'allDropped'),
					new RepeatUntilFail(
						new Sequence([
							new HasFreeCapacity('energy', 'agent'),
							new PopStackToTarget('dropped', 'allDropped'),
							new GetTargetPosition('dropped'),
							new WalkToPosition({ range: 1 }),
							new PickUpTarget('dropped'),
						])
					),
					new Sequence([
						new GetAgentAsTarget('agent'),
						new GetTargetRoom('room', 'agent'),
						new FindStackInRoom(FIND_STRUCTURES, { filter: structure => structure instanceof StructureContainer || structure instanceof StructureStorage }, 'containers', 'room'),
						new SortStackClosestFirst('agent', 'containers'),
						new RepeatUntilFail(
							new Sequence([
								new HasUsedCapacity('energy', 'agent'),
								new PopStackToTarget('container', 'containers'),
								new GetTargetPosition('container'),
								new WalkToPosition({ range: 1 }),
								new TransferToTarget('energy', 'container')
							])
						)
					])
				])
			)
		},
		tard: {
			body: ['carry', 'carry', 'move', 'work', 'work', 'work', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Selector([
					new Inverter(new DropStore('energy')),
					BTHarvest('Source2')
				])
			)
		},
		stud: {
			body: ['carry', 'carry', 'move', 'work', 'work', 'work', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Selector([
					new Inverter(new DropStore('energy')),
					BTHarvest('Source1')
				])
			)
		}
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
