class Plant {
	constructor(root, seeds) {
		this.root = root;
		this.cache = new Map;
		this.fragment = null;

		if(Array.isArray(seeds)) {
			this.fragment = this.from(seeds);
		}
	}
	find(value) {
		return this.cache.get(value);
	}
	cut(value) {
		this.cache.get(value).remove();
		this.cache.delete(value);
	}
	from(seeds) {
		const fragment = document.createDocumentFragment();
		let node, tag, attributes, children;

		seeds.forEach((seed, index, array) => {
			[tag, attributes, ...children] = seed;
			if(!tag) {
				return; //instead of continue
			}
			
			node = document.createElement(tag);
			if(attributes) {
				Object.keys(attributes).forEach(key => {					
					tag = key;
					if(tag === 'text') tag = 'textContent';
					if(tag === 'html') tag = 'innerHTML';
					if(tag === 'class') tag = 'className';

					// if(/^on.+/.test(key)) {
					// 	console.log('istener');
					// 	node.addEventListener(key, attributes[key]);
					// } else
					if(key !== '$') {
						node[tag] = attributes[key];
					} else {
						this.cache.set(attributes[key], node);
					}
				});
			}
			if(Array.isArray(children)) {
				let fragment = this.from(children, node);
				node.appendChild(fragment);
			}

			fragment.appendChild(node);
		});

		return fragment;
	}
	regrow(seeds) {
		Plant.purgeNode(this.root);
		this.root.appendChild(this.from(seeds));
	}
	grow(fresh = false) {
		if(fresh) {
			Plant.purgeNode(this.root);
		}
		
		this.root.appendChild(this.fragment);
	}
	static get title() {
		return document.title;
	}
	static get head() {
		return document.head;
	}
	static get body() {
		return document.body;
	}
	static ref(string) {
		return document.getElementById(string);
	}
	static refClass(string) {
		return document.getElementsByClassName(string);
	}
	static refTag(string) {
		return document.getElementsByTagName(string);
	}
	static refName(string) {
		return document.getElementsByName(string);
	}
	static purgeNode(node) {
		if(!node) {
			return;
		}
		
		let box = null;
		while(box = node.firstChild) {
			box.remove();
		}
	}
	static parent(node, number) {
		let parent = node.parentNode;
		while(--number) {
			parent = parent.parentNode;
			if(parent === null) {
				break;
			}
		}

		return parent;
	}
	watch(root, event, listener) {
		this.cache.get(root).addEventListener(event, listener);
	}
	unwatch(root, event, listener) {
		this.cache.get(root).removeEventListener(event, listener);
	}
	static watch(root, event, listener) {
		root.addEventListener(event, listener);
	}
	static unwatch(root, event, listener) {
		root.removeEventListener(event, listener);
	}
};
