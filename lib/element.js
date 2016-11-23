var _ = require('./util');


/*
	Virtual-dom Element Constructor
*/
function Element(tagName, props, children){
	if(!(this instanceof Element)){
		if(! _.isArray(children) && children !== null){
			children = _.slice(arguments,2).filter(_.truthy);
		}
		return new Element(tagName, props, children);
	}

	if(_.isArray(props)){
		children = props;
		props = {};
	}

	this.tagName = tagName;
	this.props = props || {};
	this.children = children || [];
	this.key = props ? props.key : void 666;

	var count = 0;
	_.each(this.children,function(child, i){
		if(child instanceof Element){
			//get the childrenNode number
			count += child.count;
		}else{
			//convert child into a String
			children[i] = ''+child;
		}
		count ++;
	});
	this.count = count;
}

/*
	Render the element tree
*/
Element.prototype.render = function(){
	//create element
	var el = document.createElement(this.tagName);
	//assign props if exist
	var props = this.props;
	for(var prorpName in props){
		var propValue = props[prorpName];
		_.setAttr(el,prorpName,propValue);
	}

	//
	_.each(this.children,function(child,i)){
		//create textNode if child element is not virtual elment && append to its parentNode
		var childEl = (child instanceof Element) ? child.render() : document.createTextNode(child);
		el.appendChild(childEl);
	});

	return el;
}

module.exports = Element;