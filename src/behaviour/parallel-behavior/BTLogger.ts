import { BTNodeVisitor } from "./BTNodeVisitor";
import { BTNode, BTNodeDecorator, BTNodeComposite, BTState } from "./BTNode";
import { Logger, LogVerbosity } from "utils/Log";
import { Utils } from "utils/Utils";

export class BTLogger extends BTNodeVisitor {

	private indentLevel = 0;

	visitNode(node: BTNode): void {
		this.printNode(node, true);
	}

	visitDecorator(node: BTNodeDecorator): void {
		this.printNode(node, false);
		this.indentLevel++;
		node.child.accept(this);
		this.indentLevel--;
		this.printNode(node, true);
	}

	visitComposite(node: BTNodeComposite): void {
		this.printNode(node, false);
		this.indentLevel++;
		node.children.forEach(child => child.accept(this));
		this.indentLevel--;
		this.printNode(node, true);
	}

	private printNode(node: BTNode, withState: boolean) {
		Logger.print(`${this.getIndentString()}${node.constructor.name} ${withState ? Utils.btStateToString(node.state) : ''}`, LogVerbosity.DEBUG);
	}

	private getIndentString(): string {
		return new Array(this.indentLevel).fill('| ').join('');
	}

}
