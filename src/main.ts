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
import { GetTargetId } from 'behaviour/GetTargetId';
import { GetTargetFromId } from 'behaviour/GetTargetFromId';
import { SortStackWithTarget } from 'behaviour/SortStackWithTarget';
import { TargetCondition } from 'behaviour/TargetCondition';
import { AlwaysSucceed } from 'behaviour/AlwaysSucceed';

export type ColonyStructure = Record<string,
	Record<string, {
		body: BodyPartConstant[],
		behaviour: BehaviourTree
	}>
>

const BTUpgrade = () => {
	return new Sequence([
		new GetAgentAsTarget('agent'),
		new HasUsedCapacity('agent', 'energy'),
		new GetTargetRoom('room', 'agent'),
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
				new HasUsedCapacity('agent', 'energy'),
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
				new HasUsedCapacity('agent', 'energy'),
				new PopStackToTarget('maintainable', 'maintainables'),
				new GetTargetPosition('maintainable'),
				new WalkToPosition({ range: 3 }),
				new RepeatUntilFail(new Sequence([
					new GetTargetId('maintainable', 'id'),
					new GetTargetFromId('id', 'maintainable'),
					new RepairTarget('maintainable')
				]))
			])
		)
	])
}

const BTDeliverSpawnEnergy = () => {
	return new Sequence([
		new GetAgentAsTarget('agent'),
		new HasUsedCapacity('agent', 'energy'),
		new GetTargetRoom('room', 'agent'),
		new FindStackInRoom(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === 'spawn' || structure.structureType === 'extension' }, 'stack', 'room'),
		new SortStackClosestFirst('agent', 'stack'),
		new RepeatUntilFail(
			new Sequence([
				new PopStackToTarget('energyContainer'),
				new Selector([
					new Inverter(new HasFreeCapacity('energyContainer', 'energy')),
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

const BTWithdrawFromStructures = (roomAlias: string, structureTypes: (_Constructor<Structure<StructureConstant>>)[], resourceType: ResourceConstant) => {
	return new Sequence([
		new GetAgentAsTarget('agent'),
		new FindStackInRoom(FIND_STRUCTURES, { filter: structure => structureTypes.some(type => structure instanceof (type as Function)) }, 'containers', roomAlias),
		new SortStackWithTarget<{ store: Store<ResourceConstant, false> }, Creep>((a, b, agent) => a.store.getUsedCapacity(resourceType) - b.store.getUsedCapacity(resourceType), 'containers', 'agent'),
		new RepeatUntilFail(new Sequence([
			new GetAgentAsTarget('agent'),
			new HasFreeCapacity('agent', resourceType),
			new PopStackToTarget('container', 'containers'),
			new AlwaysSucceed(new Sequence([
				new HasUsedCapacity('container', resourceType),
				new GetTargetPosition('container'),
				new WalkToPosition({ range: 1 }),
				new WithdrawFromTarget(resourceType, 'container')
			]))
		])),
	]);
};

const BTTranferToStructures = (roomAlias: string, structureTypes: (_Constructor<Structure<StructureConstant>>)[], resourceType: ResourceConstant) => {
	return new Sequence([
		new GetAgentAsTarget('agent'),
		new GetTargetRoom(roomAlias, 'agent'),
		new FindStackInRoom(FIND_STRUCTURES, { filter: structure => structureTypes.some(type => structure instanceof (type as Function)) }, 'containers', roomAlias),
		new SortStackClosestFirst('agent', 'containers'),
		new RepeatUntilFail(new Sequence([
			new GetAgentAsTarget('agent'),
			new HasUsedCapacity('agent', resourceType),
			new PopStackToTarget('container', 'containers'),
			new AlwaysSucceed(new Sequence([
				new HasFreeCapacity('container', resourceType),
				new GetTargetPosition('container'),
				new WalkToPosition({ range: 1 }),
				new TransferToTarget(resourceType, 'container')
			]))
		])),
	])
}

const BTPickupDrops = (roomAlias: string, resourceTypes?: ResourceConstant[]) => {
	return new Sequence([
		new GetAgentAsTarget('agent'),
		new GetTargetRoom(roomAlias, 'agent'),
		new FindStackInRoom(FIND_DROPPED_RESOURCES, { filter: dropped => resourceTypes ? resourceTypes.includes(dropped.resourceType) : true }, 'allDropped', roomAlias),
		new SortStackWithTarget<Resource, Creep>((a, b, agent) => a.amount - b.amount, 'allDropped', 'agent'),
		new RepeatUntilFail(new Sequence([
			new GetAgentAsTarget('agent'),
			new HasFreeCapacity('agent', 'energy'),
			new PopStackToTarget('dropped', 'allDropped'),
			new GetTargetPosition('dropped'),
			new WalkToPosition({ range: 1 }),
			new PickUpTarget('dropped'),
		])),
	])
}

const BTHarvestThenDrop = (sourceFlag: string) => {
	return new Selector([
		new Sequence([
			new GetPositionFromFlag(sourceFlag),
			new WalkToPosition({ range: 1 }),
			new GetTargetAtPosition('source', 'harvestable'),
			new RepeatUntilFail(new Sequence([
				new HarvestTarget('harvestable'),
				new DropStore('energy')
			]))
		])
	])
}

const BTHarvest = (sourceFlag: string) => {
	return new Selector([
		new Sequence([
			new GetAgentAsTarget('agent'),
			new Inverter(new HasFreeCapacity('agent', 'energy'))
		]),
		new Sequence([
			new GetPositionFromFlag(sourceFlag),
			new WalkToPosition({ range: 1 }),
			new GetTargetAtPosition('source', 'harvestable'),
			new RepeatUntilFail(new Sequence([
				new HarvestTarget('harvestable'),
			]))
		])
	])
}

const structure = {
	Spawn1: {
		easy: {
			body: ['move', 'carry', 'work', 'move', 'carry', 'work', 'move', 'carry', 'work', 'move', 'work', 'work', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(new Sequence([
				new GetAgentAsTarget('agent'),
				new GetTargetRoom('room', 'agent'),
				BTWithdrawFromStructures('room', [StructureStorage], 'energy'),
				new Sequence([
					BTConstruct(),
					BTUpgrade()
				])
			])),
			spawnMe: false
		},
		ddss: {
			body: ['move', 'carry', 'work', 'move', 'carry', 'work', 'move', 'carry', 'work', 'move', 'work', 'work', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(new Sequence([
				new GetAgentAsTarget('agent'),
				new GetTargetRoom('room', 'agent'),
				BTWithdrawFromStructures('room', [StructureStorage], 'energy'),
				new Sequence([
					BTConstruct(),
					BTUpgrade()
				])
			])),
			spawnMe: true
		},
		ned: {
			body: ['move', 'carry', 'work', 'move', 'carry', 'work', 'move', 'carry', 'work', 'move', 'carry', 'work', 'move', 'carry', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					new GetAgentAsTarget('agent'),
					new GetTargetRoom('room', 'agent'),
					BTWithdrawFromStructures('room', [StructureStorage], 'energy'),
					new Sequence([
						BTTranferToStructures('room', [StructureExtension, StructureSpawn], 'energy'),
						BTTranferToStructures('room', [StructureTower], 'energy'),
						BTConstruct(),
						BTUpgrade()
					])
				])),
			spawnMe: true
		},
		com: {
			body: ['move', 'carry', 'work', 'move', 'carry', 'work', 'move', 'carry', 'work', 'move', 'carry', 'work', 'move', 'carry', 'work'],
			behaviour: new BehaviourTree(new Sequence([
				new GetAgentAsTarget('agent'),
				new GetTargetRoom('room', 'agent'),
				BTWithdrawFromStructures('room', [StructureStorage], 'energy'),
				new Sequence([
					BTTranferToStructures('room', [StructureExtension, StructureSpawn], 'energy'),
					BTTranferToStructures('room', [StructureTower], 'energy'),
					BTConstruct(),
					BTUpgrade()
				])
			])),
			spawnMe: true
		},
		krud: {
			body: ['carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move'],
			behaviour: new BehaviourTree(new Sequence([
				new GetAgentAsTarget('agent'),
				new GetTargetRoom('room', 'agent'),
				BTPickupDrops('room'),
				BTWithdrawFromStructures('room', [StructureContainer], 'energy'),
				BTTranferToStructures('room', [StructureStorage], 'energy')
			])).debug(),
			spawnMe: true
		},
		tard: {
			body: ['carry', 'move', 'work', 'work', 'work', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				BTHarvestThenDrop('Source2')
			),
			spawnMe: true
		},
		stud: {
			body: ['carry', 'move', 'work', 'work', 'work', 'work', 'work', 'work'],
			behaviour: new BehaviourTree(
				BTHarvestThenDrop('Source1')
			),
			spawnMe: true
		}
	}
};

const towerBehaviour = new BehaviourTree(
	new Sequence([
		new GetAgentAsTarget('agent'),
		new GetTargetRoom('room', 'agent'),
		new FindStackInRoom(FIND_STRUCTURES, { filter: structure => structure.hitsMax - structure.hits > 500 && !(structure instanceof StructureWall) }, 'repairables', 'room'),
		new RepeatUntilFail(new Sequence([
			new PopStackToTarget('repairable', 'repairables'),
			new RepeatUntilFail(new RepairTarget('repairable'))
		]))
	]))

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
			} else if (creepData.spawnMe) {
				Game.spawns[spawnName].spawnCreep(creepData.body as BodyPartConstant[], creepName);
			}
		}
	}

	for (const structure of Object.values(Game.structures)) {
		if (structure instanceof StructureTower) {
			towerBehaviour.tick(structure);
		}
	}

	// Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name];
		}
	}
});
