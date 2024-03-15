import { Quill } from 'react-quill';

const Parchment = Quill.import('parchment');

class IndentAttributor extends (Parchment as any).Attributor.Style {
	add(node: any, value: any) {
		if (value === 0) {
			this.remove(node);
			return true;
		} else {
			return super.add(node, `${value}em`);
		}
	}
}

// @ts-ignore
export const IndentStyle = new IndentAttributor('indent', 'text-indent', {
	scope: Parchment.Scope.BLOCK,
	whitelist: ['1em', '2em', '3em', '4em', '5em', '6em', '7em', '8em', '9em'],
});
