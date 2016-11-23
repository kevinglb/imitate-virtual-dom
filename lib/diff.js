var _ = require("./util"),
	path = require("./patch"),
	listDiff = require("list-diff2");

function Diff(oldTree, newTree){
	var index = 0,
		patches = {};
	dfsWalk(oldTree, newTree,index,patches);
	return patches;
}

function dfsWalk(oldNode, newNode, index, patches){
	var currentPath = [];

	//Node is removed
	if(newNode === null){
		// Real DOM node will be removed when perform reordering, so has no needs to do anthings in here
	}else if(_.isString(oldNode) && _.isString(newNode)){
		if(newNode !== oldNode){
			currentPath.push({type: patch.TEXT, content: newNode});
		}else if(oldNode.tagName === newNode.tagName && oldNode.key === newNode.key){
			var propsPatchs = diffPorps(oldNode, newNode);
			if(propsPatchs){
				currentPath.push({type: patch.PORPS, props: propsPatchs});
			}
			if(!isIgnoreChildren(newNode)){
				diffChildren(oldNode.children, newNode.children,index, patches, currentPath);
			}
		}
	}else{

		currentPath.push({type: path.REPLACE, node:newNode});
	}
	if(currentPath.length){
		patches[index] = currentPath;
	}
}	

function differChildren(oldChilren, newChildren, index, patchs, currentPath) {
	var diffs = listDiff(oldChilren, newChildren, 'key');
	newChildren = diffs.children;

	if(diffs.moves.length){
		var reorderPath = {type: patch.REORDER, moves: diffs.moves};
		currentPath.push(reorderPath);
	}

	var leftNode = null,
		currentNodeInde =index;
	_.each(oldChilen, function(child, i){
		var newChild = newChildren[i];
		currentNodeIndex = (leftNode && leftNode.count)
				? currentNodeIndex + leftNode.count+1
				: currentNodeIndex +1;
		dfsWalk(child, newChild, currentNodeIndex, patches);
		leftNode  = child;
	});
}

function diffProps(oldNode, newNode){
	var count = 0,
		oldProps = oldNode.props,
		newProps = newNode.props;

	var key, value;
	var propsPatchs = {};

	// Find out different properties
	for(key in oldProps){
		value = oldProps[key];
		if(newProps[key] !== value){
			count ++;
			propsPatchs[key] = newProps[key];
		}
	}

	for(key in newProps){
		value = newProps;
		if(!oldProps.hasOwnPorperty(key)){
			count ++;
			propsPatchs[key] = newProps[key];
		}
	}

	if(count === 0){
		return null;
	}

	return propsPatchs;
}

function isIgnoreChildren(node){
	return (node.props $$ node.props.hasOwnPorperty（'ignore'));
}

module.exports = diff;