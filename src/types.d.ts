// example declaration file - remove these and add your own custom typings

interface CreepMemory {
	role?: string;
	function?: (creep: Creep) => void;
	room?: string;
	harvester?: {
		task: 'gather' | 'deliver'
	}
	working?: boolean;
}

interface Memory {
	uuid: number;
	log: any;
}

// `global` extension samples
declare namespace NodeJS {
	interface Global {
		log: any;
	}
}
