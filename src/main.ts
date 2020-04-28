import { ErrorMapper } from 'utils/ErrorMapper';
import { BehaviourTree } from 'behaviour/BehaviourTree';
import { Sequence } from 'behaviour/Sequence';
import { SetPositionFromFlag } from 'behaviour/SetPositionFromFlag';
import { WalkToPosition } from 'behaviour/WalkToPosition';
import { GetTargetAtPosition } from 'behaviour/GetTargetAtPosition';
import { HarvestTarget } from 'behaviour/HarvestTarget';
import { TransferToTarget } from 'behaviour/TransferToTarget';
import { GetTargetRoom } from 'behaviour/GetTargetRoom';
import { FindStackInRoom } from 'behaviour/FindStackInRoom';
import { RepeatUntilFail } from 'behaviour/RepeatUntilFail';
import { PopStack } from 'behaviour/PopStack';
import { GetTargetPosition } from 'behaviour/GetTargetPosition';
import { BuildTarget } from 'behaviour/BuildTarget';
import { GetAgentAsTarget } from 'behaviour/GetAgentAsTarget';
import { SortStackClosestFirst } from 'behaviour/SortStackClosestFirst';
import { Selector } from 'behaviour/Selector';
import { UpgradeController } from 'behaviour/UpgradeController';
import { HasRemainingCapacity } from 'behaviour/HasRemainingCapacity';
import { Inverter } from 'behaviour/Inverter';

export type ColonyStructure = Record<string,
	Record<string, {
		body: BodyPartConstant[],
		behaviour: BehaviourTree
	}>
>

const BTUpgrade = () => {
	return new Sequence([
		new GetAgentAsTarget(),
		new GetTargetRoom(),
		new FindStackInRoom(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === 'controller' }),
		new PopStack(),
		new GetTargetPosition(),
		new WalkToPosition({ range: 3 }),
		new UpgradeController()
	])
}

const BTConstruct = () => {
	return new Sequence([
		new GetAgentAsTarget(),
		new GetTargetRoom(),
		new FindStackInRoom(FIND_CONSTRUCTION_SITES),
		new SortStackClosestFirst(),
		new RepeatUntilFail(
			new Sequence([
				new PopStack(),
				new GetTargetPosition(),
				new WalkToPosition({ range: 3 }),
				new BuildTarget()
			])
		)
	])
}

const BTDeliverSpawnEnergy = () => {
	return new Sequence([
		new SetPositionFromFlag('Spawn1'),
		new GetTargetAtPosition('structure'),
		new GetTargetRoom(),
		new FindStackInRoom(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === 'spawn' || structure.structureType === 'extension' }),
		new SortStackClosestFirst(),
		new RepeatUntilFail(
			new Sequence([
				new PopStack(),
				new Selector([
					new Inverter(new HasRemainingCapacity('energy')),
					new Sequence([
						new GetTargetPosition(),
						new WalkToPosition({ range: 1 }),
						new TransferToTarget('energy')
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
			new Inverter(new HasRemainingCapacity('energy'))
		]),
		new Sequence([
			new SetPositionFromFlag(sourceFlag),
			new WalkToPosition({ range: 1 }),
			new GetTargetAtPosition('source'),
			new HarvestTarget(),
		])
	])
}

const structure: ColonyStructure = {
	Spawn1: {
		dylan: {
			body: ['carry', 'move', 'move', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source3'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		gard: {
			body: ['carry', 'move', 'move', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source3'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		bard: {
			body: ['carry', 'move', 'move', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source3'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		tard: {
			body: ['carry', 'move', 'move', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source3'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		god: {
			body: ['carry', 'move', 'move', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source3'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		bob: {
			body: ['carry', 'move', 'move', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source3'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		kun: {
			body: ['carry', 'move', 'move', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source3'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		jhon: {
			body: ['carry', 'move', 'move', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					BTHarvest('Source3'),
					new Sequence([
						BTDeliverSpawnEnergy(),
						BTConstruct(),
						BTUpgrade()
					])
				])
			)
		},
		eddy: {
			body: ['carry', 'move', 'move', 'work', 'work', 'work'],
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
		hector: {
			body: ['carry', 'move', 'move', 'work', 'work', 'work'],
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
		lars: {
			body: ['carry', 'move', 'move', 'work', 'work', 'work'],
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
		chris: {
			body: ['carry', 'move', 'move', 'work', 'work', 'work'],
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
		chan: {
			body: ['carry', 'move', 'move', 'work', 'work', 'work'],
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
		jackie: {
			body: ['carry', 'move', 'move', 'work', 'work', 'work'],
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
		larry: {
			body: ['carry', 'move', 'move', 'work', 'work', 'work'],
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
		omar: {
			body: ['carry', 'move', 'move', 'work', 'work', 'work'],
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
		ornn: {
			body: ['carry', 'move', 'move', 'work', 'work', 'work'],
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
		ashe: {
			body: ['carry', 'move', 'move', 'work', 'work', 'work'],
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
		oppa: {
			body: ['carry', 'move', 'work', 'work', 'work', 'work'],
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
		lamar: {
			body: ['carry', 'move', 'work', 'work', 'work', 'work'],
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
		victor: {
			body: ['carry', 'move', 'work', 'work', 'work', 'work'],
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
		}
	}
}

export const loop = ErrorMapper.wrapLoop(() => {
	// console.log(`Current game tick is ${Game.time}`);

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
