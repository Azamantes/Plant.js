class Plant {
	constructor(root, seeds) {
		this.root = root;
		this.cache = new Map;
		this.fragment = null;

		if(Array.isArray(seeds)) {
			this.fragment = Plant.from.call(this, seeds);
		}
	}
	find(value) {
		return this.cache.get(value);
	}
	cut(value) {
		this.cache.get(value).remove();
		this.cache.delete(value);
	}
	static grow(root, seeds, bool = true) {
		if(bool) Plant.purge(root);
		root.appendChild(Plant.from(seeds));
	}
	static from(seeds) {
		const fragment = document.createDocumentFragment();
		let node, tag, attributes, children;
		const regexp = /on.+/;

		// console.log('seeds:', seeds);
		// console.log('seeds.forEach:', seeds.forEach);
		seeds.forEach((seed, index, array) => {
			[tag, attributes, ...children] = seed;
			if(!tag) {
				return; //instead of continue
			}			
			if(tag === 'space') {
				// attributes is the textContent in this particular case
				return fragment.appendChild(new window.Text(attributes || ' '));
			}

			node = document.createElement(tag);
			if(attributes) {
				Object.keys(attributes).forEach(key => {					
					tag = key;
					if(tag === 'text') tag = 'textContent';
					else if(tag === 'html') tag = 'innerHTML';
					else if(tag === 'class') tag = 'className';

					if(key === '$') {
						this.cache.set(attributes[key], node);
						return;
					}

					if(/data\-.+/.test(key)) {
						node.setAttribute(key, attributes[key]);
						return;
					}

					node[tag] = attributes[key];
				});
			}
			if(Array.isArray(children)) {
				let fragment = Plant.from.call(this, children);
				node.appendChild(fragment);
			}

			fragment.appendChild(node);
		});

		return fragment;
	}
	regrow(seeds) {
		Plant.purge(this.root);
		this.root.appendChild(Plant.from.call(this, seeds));
	}
	grow(fresh = false) {
		if(fresh) {
			Plant.purge(this.root);
		}
		
		this.root.appendChild(this.fragment);
		return this;
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
	static purge(node) {
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