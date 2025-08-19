export function flattenTrees<T extends { children?: T[] }>(
	trees: T[] = [],
): T[] {
	return trees.reduce<T[]>((result, node) => {
		result.push(node);
		if (node.children?.length) {
			result.push(...flattenTrees(node.children));
		}
		return result;
	}, []);
}

export function convertToTree<T extends { children?: T[] }>(items: T[]): T[] {
	const tree = items.map((item) => ({
		...item,
		children: convertToTree(item.children || []),
	}));

	return tree;
}

export function convertFlatToTree<T extends { id: string; parentId: string }>(
	items: T[],
): (T & { children: T[] })[] {
	const itemMap = new Map<string, T & { children: T[] }>();
	const result: (T & { children: T[] })[] = [];

	// First pass: create a map of all items
	for (const item of items) {
		itemMap.set(item.id, { ...item, children: [] });
	}

	// Second pass: build the tree
	for (const item of items) {
		const node = itemMap.get(item.id);
		if (!node) continue;

		if (item.parentId === "") {
			result.push(node);
		} else {
			const parent = itemMap.get(item.parentId);
			if (parent) {
				parent.children.push(node);
			}
		}
	}

	return result;
}
