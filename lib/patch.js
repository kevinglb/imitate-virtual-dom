var _ = require("./util");

var REPLACE = 0;
var REORDER = 1;
var PROPS = 2;
var TEXT = 3;

function patch(node, pathches){
	var walker = {index: 0};
	dfsWalk(node, walker, patches);
}

patch.REPLACE = REPLACE;
patch.REORDER = REORDER;
patch.PROPS = PROPS;
patch.TEXT = TEXT;

function dfsWalk(node, walk, patches){
	var currentPatches = patch[walk.index];

	var len = node.childNodes ? node.childNodes.length : 0;

	for(var i=0;i<len;i++){
		var child = node.childNodes[i];
		walk.index ++;
		dfsWalk(child, walk, patches);
	}

	if(currentPatches){
		applyPatchs(node, currentPatches);
	}
}

function applyPatches(node, cu) {
	_.each(currentPatches, function(currentPatch,i){
		switch(currentPatch){
			case REPLACE:
				var newNode = (typeof currentPatch.node === 'string') 
					? document.currentTextNode(currentPatch)
					: currentPatch.node.render();

				node.parentNode.replaceChild(newNode);
				break;

			case REORDER:
				reorderChildren(node, currentPatch.moves);
				break;

			case PROPS:
				setProps(node, currentPatch.props);
				break;

			case TEXT:
				if(node.textContent){
					node.textContent = currentPatch.content;
				}else{
					node.nodeValue = currentPatch.content;
				}
				break;

			default:
				throw new Error("Unknown patch type erroe");
				break;
		}
	});
}

function setProps(node, props){
	for(var key in props){
		if(props[key] === void 666){
			node.removeAttribute(key);
		}else{
			var value = props[key];
			_.setAttr(node, key,value);
		}
	}
}

function reorderChildren(node, moves){
	var staticNodeList = _.toArray(node.childNodes);
	var map = {};

	_.each(staticNodeList, function(node){
		if(node.NodeType === 1){
			var key = node.getAttribute('key');
			if(key){
				map[key] = node;
			}
		}
	});

	_.each(moves, function(move){
		var index = move.index;
		if(move.type === 0){
			if(staticNodeList[index] === node.childNodes[index]){
				node.removeChild(node.childNodes[index]);
			}
			staticNodeList.splice(index,1);

		}else if(move.type === 1){

		}
	})
}

