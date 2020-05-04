import { ErrorMapper } from 'utils/ErrorMapper';
import { BehaviourTree as OLDBehaviourTree } from 'behaviour/BehaviourTree';
import { Sequence as OLDSequence } from 'behaviour/Sequence';
import { GetPositionFromFlag as OLDGetPositionFromFlag } from 'behaviour/GetPositionFromFlag';
import { WalkToPosition as OLDWalkToPosition } from 'behaviour/WalkToPosition';
import { GetTargetAtPosition as OLDGetTargetAtPosition } from 'behaviour/GetTargetAtPosition';
import { HarvestTarget as OLDHarvestTarget } from 'behaviour/HarvestTarget';
import { TransferToTarget as OLDTransferToTarget } from 'behaviour/TransferToTarget';
import { GetTargetRoom as OLDGetTargetRoom } from 'behaviour/GetTargetRoom';
import { FindStackInRoom as OLDFindStackInRoom } from 'behaviour/FindStackInRoom';
import { RepeatUntilFail as OLDRepeatUntilFail } from 'behaviour/RepeatUntilFail';
import { PopStackToTarget } from 'behaviour/PopStackToTarget';
import { GetTargetPosition } from 'behaviour/GetTargetPosition';
import { BuildTarget } from 'behaviour/BuildTarget';
import { GetAgentAsTarget } from 'behaviour/GetAgentAsTarget';
import { SortStackClosestFirst } from 'behaviour/SortStackClosestFirst';
import { Selector as OLDSelector } from 'behaviour/Selector';
import { UpgradeController } from 'behaviour/UpgradeController';
import { HasFreeCapacity } from 'behaviour/HasFreeCapacity';
import { Inverter as OLDInverter } from 'behaviour/Inverter';
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
import { AlwaysSucceed as OLDAlwaysSucceed } from 'behaviour/AlwaysSucceed';
import { Wait } from 'behaviour/Wait';
import { GetRoom } from 'behaviour/GetRoom';
import { AttackTarget } from 'behaviour/AttackTarget';
import { TimeFlow } from 'utils/TimeFlow';
import { BehaviourTree } from 'behaviour/parallel-behavior/BehaviourTree';
import { Sequence } from 'behaviour/parallel-behavior/Sequence';
import { Selector } from 'behaviour/parallel-behavior/Selector';
import { ConditionInRange } from 'behaviour/parallel-behavior/ConditionInRange';
import { Inverter } from 'behaviour/parallel-behavior/Inverter';
import { ActionWalkTowards } from 'behaviour/parallel-behavior/ActionWalkTowards';
import { ActionWait } from 'behaviour/parallel-behavior/ActionWait';
import { ActionHarvest } from 'behaviour/parallel-behavior/ActionHarvest';
import { RepeatUntilFail } from 'behaviour/parallel-behavior/RepeatUntilFail';
import { DataTypesInStore } from 'behaviour/parallel-behavior/DataTypesInStore';
import { ActionDrop } from 'behaviour/parallel-behavior/ActionDrop';
import { DataPopArray } from 'behaviour/parallel-behavior/DataPopArray';
import { DataSet } from 'behaviour/parallel-behavior/DataSet';
import { ConditionCapacity } from 'behaviour/parallel-behavior/ConditionCapacity';
import { ActionTransfer } from 'behaviour/parallel-behavior/ActionTransfer';
import { ActionWithdraw } from 'behaviour/parallel-behavior/ActionWithdraw';
import { AlwaysSucceed } from 'behaviour/parallel-behavior/AlwaysSucceed';
import { DataFindInRoom } from 'behaviour/parallel-behavior/DataFindInRoom';
import { DataObjectRoom } from 'behaviour/parallel-behavior/DataObjectRoom';
import { Repeater } from 'behaviour/parallel-behavior/Repeater';
import { DataSortByDistance } from 'behaviour/parallel-behavior/DataSortByDistance';

export type ColonyStructure = Record<string,
	Record<string, {
		body: BodyPartConstant[],
		behaviour: OLDBehaviourTree | BehaviourTree,
		spawnMe: boolean
	}>
>

const BTUpgrade = () => {
	return new OLDSequence([
		new GetAgentAsTarget('agent'),
		new HasUsedCapacity('agent', 'energy'),
		new OLDGetTargetRoom('room', 'agent'),
		new OLDFindStackInRoom(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === 'controller' }),
		new PopStackToTarget(),
		new GetTargetPosition(),
		new OLDWalkToPosition('position', { range: 3 }),
		new UpgradeController('target')
	])
}

const BTConstruct = () => {
	return new OLDSequence([
		new GetAgentAsTarget('agent'),
		new OLDGetTargetRoom('room', 'agent'),
		new OLDFindStackInRoom(FIND_CONSTRUCTION_SITES, undefined, 'stack', 'room'),
		new SortStackClosestFirst('agent', 'stack'),
		new OLDRepeatUntilFail(
			new OLDSequence([
				new PopStackToTarget('energyContainer'),
				new HasUsedCapacity('agent', 'energy'),
				new GetTargetPosition('energyContainer'),
				new OLDWalkToPosition('position', { range: 3 }),
				new BuildTarget('energyContainer')
			])
		)
	])
}

const BTMaintain = () => {
	return new OLDSequence([
		new GetAgentAsTarget('agent'),
		new OLDGetTargetRoom('room', 'agent'),
		new OLDFindStackInRoom(FIND_STRUCTURES, { filter: structure => structure.hits < structure.hitsMax && !(structure instanceof StructureWall) }, 'maintainables', 'room'),
		new SortStackClosestFirst('agent', 'maintainables'),
		new OLDRepeatUntilFail(
			new OLDSequence([
				new HasUsedCapacity('agent', 'energy'),
				new PopStackToTarget('maintainable', 'maintainables'),
				new GetTargetPosition('maintainable'),
				new OLDWalkToPosition('position', { range: 3 }),
				new OLDRepeatUntilFail(new OLDSequence([
					new GetTargetId('maintainable', 'id'),
					new GetTargetFromId('id', 'maintainable'),
					new RepairTarget('maintainable')
				]))
			])
		)
	])
}

const BTDeliverSpawnEnergy = () => {
	return new OLDSequence([
		new GetAgentAsTarget('agent'),
		new HasUsedCapacity('agent', 'energy'),
		new OLDGetTargetRoom('room', 'agent'),
		new OLDFindStackInRoom(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === 'spawn' || structure.structureType === 'extension' }, 'stack', 'room'),
		new SortStackClosestFirst('agent', 'stack'),
		new OLDRepeatUntilFail(
			new OLDSequence([
				new PopStackToTarget('energyContainer'),
				new OLDSelector([
					new OLDInverter(new HasFreeCapacity('energyContainer', 'energy')),
					new OLDSequence([
						new GetTargetPosition('energyContainer'),
						new OLDWalkToPosition('position', { range: 1 }),
						new OLDTransferToTarget('energy', 'energyContainer')
					])
				])
			])
		)
	])
}

const BTWithdrawFromTombs = (roomAlias: string) => {
	return new OLDSequence([
		new GetAgentAsTarget('agent'),
		new OLDFindStackInRoom(FIND_TOMBSTONES, undefined, 'tombs', roomAlias),
		new OLDRepeatUntilFail(new OLDSequence([
			new GetAgentAsTarget('agent'),
			new HasFreeCapacity('agent'),
			new PopStackToTarget('tomb', 'tombs'),
			new OLDAlwaysSucceed(new OLDSequence([
				new GetTargetPosition('tomb'),
				new OLDWalkToPosition('position', { range: 1 }),
				new WithdrawFromTarget('GO', 'tomb'),
				new Wait(1),
				new WithdrawFromTarget('KO', 'tomb'),
				new Wait(1),
				new WithdrawFromTarget('ZH', 'tomb'),
				new Wait(1),
				new WithdrawFromTarget('UH', 'tomb'),
				new Wait(1),
				new WithdrawFromTarget('energy', 'tomb')
			]))
		])),
	]);
};

const BTWithdrawFromStructures = (roomAlias: string, structureTypes: (_Constructor<Structure<StructureConstant>>)[], resourceType: ResourceConstant) => {
	return new OLDSequence([
		new GetAgentAsTarget('agent'),
		new OLDFindStackInRoom(FIND_STRUCTURES, { filter: structure => structureTypes.some(type => structure instanceof (type as Function)) }, 'containers', roomAlias),
		new SortStackWithTarget<{ store: Store<ResourceConstant, false> }, Creep>((a, b, agent) => a.store.getUsedCapacity(resourceType) - b.store.getUsedCapacity(resourceType), 'containers', 'agent'),
		new OLDRepeatUntilFail(new OLDSequence([
			new GetAgentAsTarget('agent'),
			new HasFreeCapacity('agent', resourceType),
			new PopStackToTarget('container', 'containers'),
			new OLDAlwaysSucceed(new OLDSequence([
				new HasUsedCapacity('container', resourceType),
				new GetTargetPosition('container'),
				new OLDWalkToPosition('position', { range: 1 }),
				new WithdrawFromTarget(resourceType, 'container')
			]))
		])),
	]);
};

const BTTranferToStructures = (roomAlias: string, structureTypes: (_Constructor<Structure<StructureConstant>>)[], resourceType: ResourceConstant) => {
	return new OLDSequence([
		new OLDFindStackInRoom(FIND_STRUCTURES, { filter: structure => structureTypes.some(type => structure instanceof (type as Function)) }, 'containers', roomAlias),
		new SortStackClosestFirst('agent', 'containers'),
		new OLDRepeatUntilFail(new OLDSequence([
			new GetAgentAsTarget('agent'),
			new HasUsedCapacity('agent', resourceType),
			new PopStackToTarget('container', 'containers'),
			new OLDAlwaysSucceed(new OLDSequence([
				new HasFreeCapacity('container', resourceType),
				new GetTargetPosition('container'),
				new OLDWalkToPosition('position', { range: 1 }),
				new OLDTransferToTarget(resourceType, 'container')
			]))
		])),
	])
}

const BTRepairStructures = (roomAlias: string, structureTypes: (_Constructor<Structure<StructureConstant>>)[], maxHitsRatio = 0.8) => {
	return new OLDSequence([
		new OLDFindStackInRoom(FIND_STRUCTURES, {
			filter: structure => structure.hits / structure.hitsMax < maxHitsRatio && structureTypes.some(type => structure instanceof (type as Function))
		}, 'maintainables', roomAlias),
		new SortStackWithTarget<Structure, undefined>((a, b, target) => b.hits - a.hits, 'maintainables', 'agent'),
		new OLDRepeatUntilFail(
			new OLDSequence([
				new GetAgentAsTarget('agent'),
				new HasUsedCapacity('agent', 'energy'),
				new PopStackToTarget('maintainable', 'maintainables'),
				new OLDAlwaysSucceed(new OLDSequence([
					new GetTargetPosition('maintainable'),
					new OLDWalkToPosition('position', { range: 3 }),
					new OLDRepeatUntilFail(new OLDSequence([
						new GetTargetId('maintainable', 'id'),
						new GetTargetFromId('id', 'maintainable'),
						new RepairTarget('maintainable')
					]))
				]))
			])
		)
	])
}

const BTPickupDrops = (roomAlias: string, resourceTypes?: ResourceConstant[]) => {
	return new OLDSequence([
		new GetAgentAsTarget('agent'),
		new OLDFindStackInRoom(FIND_DROPPED_RESOURCES, { filter: dropped => resourceTypes ? resourceTypes.includes(dropped.resourceType) : true }, 'allDropped', roomAlias),
		new SortStackWithTarget<Resource, Creep>((a, b, agent) => a.amount - b.amount, 'allDropped', 'agent'),
		new OLDRepeatUntilFail(new OLDSequence([
			new GetAgentAsTarget('agent'),
			new HasFreeCapacity('agent', 'energy'),
			new PopStackToTarget('dropped', 'allDropped'),
			new GetTargetPosition('dropped'),
			new OLDWalkToPosition('position', { range: 1 }),
			new PickUpTarget('dropped'),
		])),
	])
}

const BTHarvestThenDrop = (sourceFlag: string) => {
	return new OLDSequence([
		new OLDGetPositionFromFlag(sourceFlag, 'position'),
		new OLDWalkToPosition('position', { range: 1 }),
		new OLDGetTargetAtPosition('source', 'harvestable'),
		new GetAgentAsTarget('agent'),
		new OLDGetTargetRoom('room', 'agent'),
		new OLDFindStackInRoom(FIND_STRUCTURES, { filter: structure => structure instanceof StructureContainer }, 'containers', 'room'),
		new SortStackClosestFirst('agent', 'containers'),
		new OLDAlwaysSucceed(new PopStackToTarget('container', 'containers')),
		new OLDRepeatUntilFail(new OLDSequence([
			new OLDSelector([
				new OLDTransferToTarget('energy', 'container'),
				new DropStore('energy')
			]),
			new OLDHarvestTarget('harvestable'),
			new Wait(1)
		]))
	])
}

const BTHarvest = (sourceFlag: string) => {
	return new OLDSelector([
		new OLDSequence([
			new GetAgentAsTarget('agent'),
			new OLDInverter(new HasFreeCapacity('agent', 'energy'))
		]),
		new OLDSequence([
			new OLDGetPositionFromFlag(sourceFlag),
			new OLDWalkToPosition('position', { range: 1 }),
			new OLDGetTargetAtPosition('source', 'harvestable'),
			new OLDRepeatUntilFail(new OLDSequence([
				new OLDHarvestTarget('harvestable'),
			]))
		])
	])
}
///////////////////////////////////////////////////////////////////////////////////////// NEW STUFF
const BTExchangeWithContainers = (containerListAlias: string, agentIdAlias: string, exchanges: { type: 'withdraw' | 'deposit', resourceType: ResourceConstant, amount?: number }[]) => {
	const BTCanExchangeAny = () => new Selector(
		exchanges.map(exchange => new Sequence([
			new ConditionCapacity(agentIdAlias, exchange.type === 'deposit' ? 'Used' : 'Free', 'MoreThan', 0, exchange.resourceType),
			new ConditionCapacity('container', exchange.type === 'deposit' ? 'Free' : 'Used', 'MoreThan', 0, exchange.resourceType)
		]))
	)

	// const withdraws = exchanges.filter(exchange => exchange.type === 'withdraw');
	// const deposits = exchanges.filter(exchange => exchange.type === 'deposit');
	// const merged = withdraws
	// const BTExchange = () => new Sequence([

	// ])

	return new RepeatUntilFail(new Sequence([
		new DataSortByDistance(containerListAlias, agentIdAlias),
		new DataPopArray(containerListAlias, 'container'),
		new RepeatUntilFail(
			new Sequence([
				BTCanExchangeAny(),
				new ActionWait(1),
				BTWalkTo('container', 'agent', 1)
			])
		),
		new AlwaysSucceed(true, new Sequence(exchanges.map((exchange, index) =>
			new Sequence([
				exchange.type === 'deposit'
					? new ActionTransfer('container', agentIdAlias, exchange.resourceType, exchange.amount)
					: new ActionWithdraw('container', agentIdAlias, exchange.resourceType, exchange.amount),
				new ActionWait(1)//new ActionWait(index < exchanges.length - 1 ? 1 : 0),
			])
		)))
	]))
}

const BTWalkTo = (positionAlias: string, agentIdAlias: string, range: number) =>
	new Sequence([
		new Inverter(new ConditionInRange(positionAlias, agentIdAlias, range)),
		new ActionWalkTowards(positionAlias, agentIdAlias, { range }),
	])

const BTDropAllInStore = (storeIdAlias: string) =>
	new RepeatUntilFail(new Sequence([
		new DataTypesInStore(storeIdAlias, 'storedTypes'),
		new DataPopArray('storedTypes', 'storedType'),
		new ActionDrop('storedType', storeIdAlias),
		new ActionWait(1)
	]))

const BTDropHarvest = (targetIdAlias: string, agentIdAlias: string, resourceType: ResourceConstant) =>
	new Sequence([
		new DataSet('resourceType', resourceType),
		new RepeatUntilFail(new Sequence([
			BTWalkTo(targetIdAlias, agentIdAlias, 1),
			new ActionWait(1)])
		),
		new RepeatUntilFail(new Sequence([
			new ActionHarvest(targetIdAlias, agentIdAlias),
			new ActionWait(1),
			new ActionDrop('resourceType', agentIdAlias),
		]))
	])

const structure: ColonyStructure = {
	Spawn1: {
		ddss: {
			body: ['work', 'work', 'work', 'work', 'work', 'work', 'work', 'work', 'carry', 'move'],
			behaviour: new OLDBehaviourTree(new OLDSequence([
				new GetAgentAsTarget('agent'),
				new OLDGetPositionFromFlag('Upgrader1', 'position'),
				new OLDWalkToPosition('position', { range: 0 }),
				new OLDGetTargetRoom('room', 'agent'),
				BTWithdrawFromStructures('room', [StructureStorage], 'energy'),
				new OLDSequence([
					BTUpgrade()
				])
			])),
			spawnMe: true
		},
		ted: {
			body: ['carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move'],
			behaviour: new OLDBehaviourTree(new OLDSequence([
				new GetRoom('E32N38', 'room'),
				new OLDGetPositionFromFlag('Source3', 'position'),
				new OLDWalkToPosition('position', { range: 1 }),
				BTPickupDrops('room'),
				BTWithdrawFromStructures('room', [StructureContainer], 'energy'),
				new GetRoom('E33N38', 'room'),
				BTTranferToStructures('room', [StructureStorage], 'energy')
			])),
			spawnMe: true
		},
		bob: {
			body: ['work', 'work', 'work', 'work', 'work', 'work', 'carry', 'move'],
			behaviour: new BehaviourTree(
				new Sequence([
					new DataSet('source', '5bbcaecc9099fc012e6398f9'),
					BTDropHarvest('source', 'agent', 'energy')
				])
			).debug(),
			spawnMe: true
		},
		ned: {
			body: ['work', 'carry', 'move', 'work', 'carry', 'move', 'work', 'carry', 'move', 'work', 'carry', 'move', 'work', 'carry', 'move'],
			behaviour: new OLDBehaviourTree(
				new OLDSequence([
					new GetAgentAsTarget('agent'),
					new OLDGetTargetRoom('room', 'agent'),
					BTWithdrawFromStructures('room', [StructureStorage], 'energy'),
					new OLDSequence([
						BTTranferToStructures('room', [StructureExtension, StructureSpawn], 'energy'),
						BTTranferToStructures('room', [StructureTower], 'energy'),
						BTConstruct(),
						BTRepairStructures('room', [StructureRoad, StructureWall, StructureRampart, StructureContainer]),
						BTUpgrade()
					])
				])),
			spawnMe: true
		},
		com: {
			body: ['work', 'carry', 'move', 'work', 'carry', 'move', 'work', 'carry', 'move', 'work', 'carry', 'move', 'work', 'carry', 'move'],
			// behaviour: new OLDBehaviourTree(new OLDSequence([
			// 	new GetAgentAsTarget('agent'),
			// 	new OLDGetTargetRoom('room', 'agent'),
			// 	BTWithdrawFromStructures('room', [StructureStorage], 'energy'),
			// 	new OLDSequence([
			// 		BTTranferToStructures('room', [StructureExtension, StructureSpawn], 'energy'),
			// 		BTTranferToStructures('room', [StructureTower], 'energy'),
			// 		BTConstruct(),
			// 		BTRepairStructures('room', [StructureRoad, StructureWall, StructureRampart, StructureContainer]),
			// 		BTUpgrade()
			// 	])
			behaviour: new BehaviourTree(
				new Repeater(1, new Sequence([
					new DataObjectRoom('agent', 'room'),
					new DataFindInRoom('room', 'storages', FIND_STRUCTURES, structure => structure instanceof StructureStorage),
					BTExchangeWithContainers('storages', 'agent', [{ type: 'withdraw', resourceType: 'energy' }]),
					new DataFindInRoom('room', 'extensions', FIND_STRUCTURES, structure => structure instanceof StructureExtension),
					BTExchangeWithContainers('extensions', 'agent', [{ type: 'deposit', resourceType: 'energy' }]),
				]))
			),
			spawnMe: true
		},
		krud: {
			body: ['carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move', 'carry', 'carry', 'move'],
			// behaviour: new OLDBehaviourTree(new OLDSequence([
			// 	new GetAgentAsTarget('agent'),
			// 	new OLDGetTargetRoom('room', 'agent'),
			// 	BTPickupDrops('room'),
			// 	BTWithdrawFromStructures('room', [StructureContainer], 'energy'),
			// 	BTTranferToStructures('room', [StructureStorage], 'energy')
			// ])),
			behaviour: new BehaviourTree(
				new Repeater(1, new Sequence([
					new DataObjectRoom('agent', 'room'),
					new DataFindInRoom('room', 'containers', FIND_STRUCTURES, structure => structure instanceof StructureContainer),
					BTExchangeWithContainers('containers', 'agent', [{ type: 'withdraw', resourceType: 'energy' }]),
					new DataFindInRoom('room', 'storages', FIND_STRUCTURES, structure => structure instanceof StructureStorage),
					BTExchangeWithContainers('storages', 'agent', [{ type: 'deposit', resourceType: 'energy' }]),
				]))
			),
			spawnMe: true
		},
		tard: {
			body: ['work', 'work', 'work', 'work', 'work', 'work', 'carry', 'move'],
			behaviour: new BehaviourTree(
				new Sequence([
					new DataSet('source', '5bbcaeda9099fc012e639a7e'),
					BTDropHarvest('source', 'agent', 'energy')
				])
			),
			spawnMe: true
		},
		stud: {
			body: ['work', 'work', 'work', 'work', 'work', 'work', 'carry', 'move'],
			behaviour: new BehaviourTree(
				new Sequence([
					new DataSet('source', '5bbcaeda9099fc012e639a7f'),
					BTDropHarvest('source', 'agent', 'energy')
				])
			),
			spawnMe: true
		}
	}
};

const towerBehaviour = new OLDBehaviourTree(
	new OLDSequence([
		new OLDSequence([
			new GetAgentAsTarget('agent'),
			new OLDGetTargetRoom('room', 'agent'),
			new OLDFindStackInRoom(FIND_HOSTILE_CREEPS, undefined, 'hostiles', 'room'),
			new OLDRepeatUntilFail(new OLDSequence([
				new PopStackToTarget('hostile', 'hostiles'),
				new OLDRepeatUntilFail(new AttackTarget('hostile'))
			]))
		]),
	]))

export const loop = ErrorMapper.wrapLoop(() => {
	TimeFlow.executeTick(Game.time);

	// console.log(`Current game tick is ${Game.time}`);
	Logger.verbosity = LogVerbosity.DEBUG;

	// Logger.behaviour.setAgentsFilter([Game.creeps.com]);

	Logger.printTickStart();

	for (const [spawnName, spawnData] of Object.entries(structure)) {
		for (const [creepName, creepData] of Object.entries(spawnData)) {
			const creep = Game.creeps[creepName];
			if (creep) {
				const behavior = creepData.behaviour;
				if (behavior instanceof OLDBehaviourTree) {
					behavior.tick(creep);
				} else {
					behavior.blackboard.agent = creep.id;
					behavior.run();
				}
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
