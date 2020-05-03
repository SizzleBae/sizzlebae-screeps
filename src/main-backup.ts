import { ErrorMapper } from 'utils/ErrorMapper';
import { BehaviourTree } from 'behaviour/BehaviourTree';
import { Sequence } from 'behaviour/Sequence';
import { GetPositionFromFlag as GetPositionFromFlag } from 'behaviour/GetPositionFromFlag';
import { WalkToPosition } from 'behaviour/WalkToPosition';
import { GetTargetAtPosition } from 'behaviour/GetTargetAtPosition';
import { HarvestTarget } from 'behaviour/HarvestTarget';
import { TransferToTarget } from 'behaviour/TransferToTarget';
import { GetTargetRoom } from 'behaviour/GetTargetRoom';
import { FindStackInRoom } from 'behaviour/FindStackInRoom';
import { RepeatUntilFail } from 'behaviour/RepeatUntilFail';
import { PopStackToTarget } from 'behaviour/PopStackToTarget';
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
import { AttackTarget } from 'behaviour/AttackTarget';
import { GetRoom } from 'behaviour/GetRoom';
// import { WalkTowardsPosition } from 'behaviour/WalkTowardsPosition';
import { Wait } from 'behaviour/Wait';
import { SetPosition } from 'behaviour/SetPosition';
import { RefreshTarget } from 'behaviour/RefreshTarget';
import { IsTargetInRange } from 'behaviour/IsTargetInRange';

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
		new WalkToPosition('position', { range: 3 }),
		new UpgradeController('target')
	])
}

const BTConstruct = (roomAlias: string) => {
	return new Sequence([
		new FindStackInRoom(FIND_CONSTRUCTION_SITES, undefined, 'sites', roomAlias),
		new RepeatUntilFail(
			new Sequence([
				new GetAgentAsTarget('agent'),
				new HasUsedCapacity('agent', 'energy'),
				new SortStackClosestFirst('agent', 'sites'),
				new PopStackToTarget('site', 'sites'),
				new AlwaysSucceed(new Sequence([
					new GetTargetPosition('site'),
					new WalkToPosition('position', { range: 3 }),
					new BuildTarget('site')
				]))
			])
		)
	])
}

const BTRepairStructures = (roomAlias: string, structureTypes: (_Constructor<Structure<StructureConstant>>)[], maxHitsRatio = 0.8) => {
	return new Sequence([
		new FindStackInRoom(FIND_STRUCTURES, {
			filter: structure => structure.hits / structure.hitsMax < maxHitsRatio && structureTypes.some(type => structure instanceof (type as Function))
		}, 'maintainables', roomAlias),
		new SortStackWithTarget<Structure, undefined>((a, b, target) => b.hits - a.hits, 'maintainables', 'agent'),
		new RepeatUntilFail(
			new Sequence([
				new GetAgentAsTarget('agent'),
				new HasUsedCapacity('agent', 'energy'),
				new PopStackToTarget('maintainable', 'maintainables'),
				new SortStackClosestFirst('agent', 'maintainables'),
				new AlwaysSucceed(new Sequence([
					new GetTargetPosition('maintainable'),
					new WalkToPosition('position', { range: 3 }),
					new RepeatUntilFail(new Sequence([
						new GetTargetId('maintainable', 'id'),
						new GetTargetFromId('id', 'maintainable'),
						new RepairTarget('maintainable')
					]))
				]))
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
			new PopStackToTarget('container', 'containers'),
			new SortStackClosestFirst('agent', 'containers'),
			new AlwaysSucceed(new Sequence([
				new GetTargetPosition('container'),
				new RepeatUntilFail(new Sequence([
					new RefreshTarget('agent'),
					new HasFreeCapacity('agent', resourceType),
					new RefreshTarget('container'),
					new HasUsedCapacity('container', resourceType),
					new WalkToPosition('position', { range: 1 }),
					// new WalkTowardsPosition('position', { range: 1 }),
					// new Inverter(new IsTargetInRange('agent', 'position', 1)),
					new Wait(1)
				])),
				new WithdrawFromTarget(resourceType, 'container')
			]))
		])),
	]);
};

const BTTranferToStructures = (roomAlias: string, structureTypes: (_Constructor<Structure<StructureConstant>>)[], resourceType: ResourceConstant) => {
	return new Sequence([
		new FindStackInRoom(FIND_STRUCTURES, { filter: structure => structureTypes.some(type => structure instanceof (type as Function)) }, 'containers', roomAlias),
		new RepeatUntilFail(new Sequence([
			new GetAgentAsTarget('agent'),
			new SortStackClosestFirst('agent', 'containers'),
			new PopStackToTarget('container', 'containers'),
			new GetTargetPosition('container', 'position'),
			new RepeatUntilFail(new Sequence([
				new WalkToPosition('position', { range: 1 }),
				new RefreshTarget('agent'),
				new HasUsedCapacity('agent', resourceType),
				new RefreshTarget('container'),
				new HasFreeCapacity('container', resourceType),
				new TransferToTarget(resourceType, 'container'),
			]))
		])),
	])
}

const BTPickupDrops = (roomAlias: string, resourceTypes?: ResourceConstant[]) => {
	return new Sequence([
		new GetAgentAsTarget('agent'),
		new FindStackInRoom(FIND_DROPPED_RESOURCES, { filter: dropped => resourceTypes ? resourceTypes.includes(dropped.resourceType) : true }, 'allDropped', roomAlias),
		new SortStackWithTarget<Resource, Creep>((a, b, agent) => a.amount - b.amount, 'allDropped', 'agent'),
		new RepeatUntilFail(new Sequence([
			new GetAgentAsTarget('agent'),
			new HasFreeCapacity('agent', 'energy'),
			new PopStackToTarget('dropped', 'allDropped'),
			new GetTargetPosition('dropped'),
			new WalkToPosition('position', { range: 1 }),
			new PickUpTarget('dropped'),
		])),
	])
}

const BTHarvestThenDrop = (sourceFlag: string) => {
	return new Sequence([
		new GetPositionFromFlag(sourceFlag),
		BTWalkTo('position', { range: 1 }),
		new GetTargetAtPosition('source', 'harvestable'),
		new GetAgentAsTarget('agent'),
		new GetTargetRoom('room', 'agent'),
		new FindStackInRoom(FIND_STRUCTURES, { filter: structure => structure instanceof StructureContainer }, 'containers', 'room'),
		new SortStackClosestFirst('agent', 'containers'),
		new AlwaysSucceed(new PopStackToTarget('container', 'containers')),
		new RepeatUntilFail(new Sequence([
			new Selector([
				new TransferToTarget('energy', 'container'),
				new DropStore('energy')
			]),
			new HarvestTarget('harvestable'),
			new Wait(1)
		]))
	])
}

const BTWalkTo = (positionAlias: string, options: FindPathOpts) =>
	new WalkToPosition('position', { range: 1 })
// new RepeatUntilFail(new Sequence([
// 	new GetAgentAsTarget('agent'),
// 	new Inverter(new IsTargetInRange('agent', positionAlias, options.range ? options.range : 0)),
// 	new Wait(1)
// ]))

const BTHarvest = (sourceFlag: string) => {
	return new Selector([
		new Sequence([
			new GetAgentAsTarget('agent'),
			new Inverter(new HasFreeCapacity('agent', 'energy'))
		]),
		new Sequence([
			new GetPositionFromFlag(sourceFlag),
			new WalkToPosition('position', { range: 1 }),
			new GetTargetAtPosition('source', 'harvestable'),
			new RepeatUntilFail(new Sequence([
				new HarvestTarget('harvestable'),
			]))
		])
	])
}

const structure: Record<string, Record<string, { body: string[], behaviour: BehaviourTree, spawnMe: boolean }>> = {
	Spawn1: {
		ddss: {
			body: ['work', 'work', 'work', 'work', 'work', 'work', 'work', 'work', 'work', 'work', 'work', 'carry', 'carry', 'carry', 'move'],
			behaviour: new BehaviourTree(new Sequence([
				new GetRoom('E33N38', 'room'),
				BTWithdrawFromStructures('room', [StructureStorage], 'energy'),
				new GetPositionFromFlag('Upgrader1', 'position'),
				new WalkToPosition('position', { range: 0 }),
				new FindStackInRoom(FIND_MY_STRUCTURES, { filter: structure => structure instanceof StructureController }, 'controllers', 'room'),
				new PopStackToTarget('controller', 'controllers'),
				new RepeatUntilFail(new Sequence([
					new UpgradeController('controller'),
					new Wait(1)
				]))
			])),
			spawnMe: true
		},
		ted: {
			body: ['carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move'],
			behaviour: new BehaviourTree(new Sequence([
				new GetRoom('E32N38', 'room'),
				BTPickupDrops('room'),
				BTWithdrawFromStructures('room', [StructureContainer], 'energy'),
				new GetRoom('E33N38', 'room'),
				BTTranferToStructures('room', [StructureStorage], 'energy')
			])),
			spawnMe: true
		},
		bob: {
			body: ['work', 'work', 'work', 'carry', 'move', 'move'],
			behaviour: new BehaviourTree(
				BTHarvestThenDrop('Source3')
			),
			spawnMe: true
		},
		ned: {
			body: ['work', 'carry', 'move', 'work', 'carry', 'move', 'work', 'carry', 'move', 'work', 'carry', 'move', 'work', 'carry', 'move'],
			behaviour: new BehaviourTree(
				new Sequence([
					new GetRoom('E33N38', 'room'),
					BTWithdrawFromStructures('room', [StructureStorage], 'energy'),
					new Sequence([
						BTTranferToStructures('room', [StructureExtension, StructureSpawn], 'energy'),
						BTTranferToStructures('room', [StructureTower], 'energy'),
						new GetRoom('E32N38', 'room'),
						BTConstruct('room'),
						BTRepairStructures('room', [StructureRoad, StructureContainer, StructureRampart, StructureWall]),
						new GetRoom('E33N38', 'room'),
						BTConstruct('room'),
						BTRepairStructures('room', [StructureRoad, StructureContainer, StructureRampart, StructureWall]),
						BTUpgrade()
					])
				])).debug(),
			spawnMe: true
		},
		com: {
			body: ['work', 'carry', 'move', 'work', 'carry', 'move', 'work', 'carry', 'move', 'work', 'carry', 'move', 'work', 'carry', 'move'],
			behaviour: new BehaviourTree(
				new Sequence([
					new GetRoom('E33N38', 'room'),
					BTWithdrawFromStructures('room', [StructureStorage], 'energy'),
					new Sequence([
						BTTranferToStructures('room', [StructureExtension, StructureSpawn], 'energy'),
						BTTranferToStructures('room', [StructureTower], 'energy'),
						new GetRoom('E33N38', 'room'),
						BTConstruct('room'),
						BTRepairStructures('room', [StructureRoad, StructureContainer, StructureRampart, StructureWall]),
						new GetRoom('E32N38', 'room'),
						BTConstruct('room'),
						BTRepairStructures('room', [StructureRoad, StructureContainer, StructureRampart, StructureWall]),
						BTUpgrade()
					])
				])),
			// new Sequence([
			// 	new GetRoom('E33N38', 'room'),
			// 	new GetPositionFromFlag('Controller', 'controllerPos'),
			// 	new GetTargetAtPosition('structure', 'controller', 'controllerPos'),
			// 	new SetPosition(new RoomPosition(1, 10, 'E33N38'), 'position'),
			// 	new RepeatUntilFail(new Sequence([
			// 		new WalkTowardsPosition('position', { range: 1 }),
			// 		new AlwaysSucceed(new UpgradeController('controller')),
			// 		new Wait(1)
			// 	])),
			// ])).debug(),
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
			])),
			spawnMe: true
		},
		tard: {
			body: ['work', 'work', 'work', 'work', 'work', 'work', 'carry', 'move'],
			behaviour: new BehaviourTree(
				BTHarvestThenDrop('Source2')
			),
			spawnMe: true
		},
		stud: {
			body: ['work', 'work', 'work', 'work', 'work', 'work', 'carry', 'move'],
			behaviour: new BehaviourTree(
				BTHarvestThenDrop('Source1')
			),
			spawnMe: true
		}
	}
};

const towerBehaviour = new BehaviourTree(
	new Sequence([
		new Sequence([
			new GetAgentAsTarget('agent'),
			new GetTargetRoom('room', 'agent'),
			new FindStackInRoom(FIND_HOSTILE_CREEPS, undefined, 'hostiles', 'room'),
			new RepeatUntilFail(new Sequence([
				new PopStackToTarget('hostile', 'hostiles'),
				new RepeatUntilFail(new AttackTarget('hostile'))
			]))
		]),
	]))

export const loop = ErrorMapper.wrapLoop(() => {
	// console.log(`Current game tick is ${Game.time}`);
	Logger.verbosity = LogVerbosity.DEBUG;

	// Logger.behaviour.setAgentsFilter([Game.creeps.com]);

	Logger.printTickStart();

	// console.log(Game.creeps.bob.pos.getRangeTo(Game.creeps.stud.pos));

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
