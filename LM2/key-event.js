// 1. key events

(function() {
    var KeyEvent = function(data, type) {
        this.keyCode = 'keyCode' in data ? data.keyCode : 0;
        this.charCode = 'charCode' in data ? data.charCode : 0;

        var modifiers = 'modifiers' in data ? data.modifiers : [];

        this.ctrlKey = false;
        this.metaKey = false;
        this.altKey = false;
        this.shiftKey = false;

        for (var i = 0; i < modifiers.length; i++) {
            this[modifiers[i] + 'Key'] = true;
        }

        this.type = type || 'keypress';
    };

    KeyEvent.prototype.toNative = function() {
        var event = document.createEventObject ? document.createEventObject() : document.createEvent('Events');

        if (event.initEvent) {
            event.initEvent(this.type, true, true);
        }

        event.keyCode = this.keyCode;
        event.which = this.charCode || this.keyCode;
        event.shiftKey = this.shiftKey;
        event.metaKey = this.metaKey;
        event.altKey = this.altKey;
        event.ctrlKey = this.ctrlKey;

        return event;
    };

    KeyEvent.prototype.fire = function(element) {
        var event = this.toNative();
        if (element.dispatchEvent) {
            element.dispatchEvent(event);
            return;
        }

        element.fireEvent('on' + this.type, event);
    };

    // simulates complete key event as if the user pressed the key in the browser
    // triggers a keydown, then a keypress, then a keyup
    KeyEvent.simulate = function(charCode, keyCode, modifiers, element, repeat) {
        if (modifiers === undefined) {
            modifiers = [];
        }

        if (element === undefined) {
            element = document;
        }

        if (repeat === undefined) {
            repeat = 1;
        }

        var modifierToKeyCode = {
            'shift': 16,
            'ctrl': 17,
            'alt': 18,
            'meta': 91
        };

        // if the key is a modifier then take it out of the regular
        // keypress/keydown
        if (keyCode == 16 || keyCode == 17 || keyCode == 18 || keyCode == 91) {
            repeat = 0;
        }

        var modifiersToInclude = [];
        var keyEvents = [];

        // modifiers would go down first
        for (var i = 0; i < modifiers.length; i++) {
            modifiersToInclude.push(modifiers[i]);
            keyEvents.push(new KeyEvent({
                charCode: 0,
                keyCode: modifierToKeyCode[modifiers[i]],
                modifiers: modifiersToInclude
            }, 'keydown'));
        }

        // @todo factor in duration for these
        while (repeat > 0) {
            keyEvents.push(new KeyEvent({
                charCode: 0,
                keyCode: keyCode,
                modifiers: modifiersToInclude
            }, 'keydown'));

            keyEvents.push(new KeyEvent({
                charCode: charCode,
                keyCode: charCode,
                modifiers: modifiersToInclude
            }, 'keypress'));

            repeat--;
        }

        keyEvents.push(new KeyEvent({
            charCode: 0,
            keyCode: keyCode,
            modifiers: modifiersToInclude
        }, 'keyup'));

        // now lift up the modifier keys
        for (i = 0; i < modifiersToInclude.length; i++) {
            var modifierKeyCode = modifierToKeyCode[modifiersToInclude[i]];
            modifiersToInclude.splice(i, 1);
            keyEvents.push(new KeyEvent({
                charCode: 0,
                keyCode: modifierKeyCode,
                modifiers: modifiersToInclude
            }, 'keyup'));
        }

        for (i = 0; i < keyEvents.length; i++) {
            // console.log('firing', keyEvents[i].type, keyEvents[i].keyCode, keyEvents[i].charCode);
            keyEvents[i].fire(element);
        }
    };

    window.KeyEvent = KeyEvent;
}) ();



// 2. jquery replace
// Gary Haran => gary@talkerapp.com
// This code is released under MIT licence
(function($){
  var replacer = function(finder, replacement, element, blackList) {
    if (!finder || typeof replacement === 'undefined') {
      return
    }
    var regex = (typeof finder == 'string') ? new RegExp(finder, 'g') : finder;

    var childNodes = element.childNodes;
    var len = childNodes.length;

    var list = typeof blackList == 'undefined' ? 'html,head,style,title,link,meta,script,object,iframe,pre,a,' : blackList ;

    while (len--) {
      var node = childNodes[len];

      if (node.nodeType === 1 && true || (list.indexOf(node.nodeName.toLowerCase()) === -1)) {
        replacer(finder, replacement, node, list);
      }

      if (node.nodeType !== 3 || !regex.test(node.data)) {
        continue;
      }

      var frag = (function(){
        var html = node.data.replace(regex, replacement);
        var wrap = document.createElement('span');
        var frag = document.createDocumentFragment();

        wrap.innerHTML = html;

        while (wrap.firstChild) {
          frag.appendChild(wrap.firstChild);
        }

        return frag;
      })();

      var parent = node.parentNode;
      parent.insertBefore(frag, node);
      parent.removeChild(node);
    }
  }

  $.fn.replace = function(finder, replacement, blackList) {
    return this.each(function(){
      replacer(finder, replacement, $(this).get(0), blackList);
    });
  }
})(jQuery);

//3. Play Music
function playSound(url){
  var audio = document.createElement('audio');
  audio.style.display = "none";
  audio.src = url;
  audio.autoplay = true;
  audio.onended = function(){
    audio.remove() //Remove when played.
  };
  document.body.appendChild(audio);
}

//4. Copy CSS
(function($){
	
	$.fn.getStyles = function(only, except) {
		
		// the map to return with requested styles and values as KVP
		var product = {};
		
		// the style object from the DOM element we need to iterate through
		var style;
		
		// recycle the name of the style attribute
		var name;
		
		// if it's a limited list, no need to run through the entire style object
		if (only && only instanceof Array) {
			
			for (var i = 0, l = only.length; i < l; i++) {
				// since we have the name already, just return via built-in .css method
				name = only[i];
				product[name] = this.css(name);
			}
			
		} else {
		
			// prevent from empty selector
			if (this.length) {
				
				// otherwise, we need to get everything
				var dom = this.get(0);
				
				// standards
				if (window.getComputedStyle) {
					
					// convenience methods to turn css case ('background-image') to camel ('backgroundImage')
					var pattern = /\-([a-z])/g;
					var uc = function (a, b) {
							return b.toUpperCase();
					};			
					var camelize = function(string){
						return string.replace(pattern, uc);
					};
					
					// make sure we're getting a good reference
					if (style = window.getComputedStyle(dom, null)) {
						var camel, value;
						// opera doesn't give back style.length - use truthy since a 0 length may as well be skipped anyways
						if (style.length) {
							for (var i = 0, l = style.length; i < l; i++) {
								name = style[i];
								camel = camelize(name);
								value = style.getPropertyValue(name);
								product[camel] = value;
							}
						} else {
							// opera
							for (name in style) {
								camel = camelize(name);
								value = style.getPropertyValue(name) || style[name];
								product[camel] = value;
							}
						}
					}
				}
				// IE - first try currentStyle, then normal style object - don't bother with runtimeStyle
				else if (style = dom.currentStyle) {
					for (name in style) {
						product[name] = style[name];
					}
				}
				else if (style = dom.style) {
					for (name in style) {
						if (typeof style[name] != 'function') {
							product[name] = style[name];
						}
					}
				}
			}
		}
		
		// remove any styles specified...
		// be careful on blacklist - sometimes vendor-specific values aren't obvious but will be visible...  e.g., excepting 'color' will still let '-webkit-text-fill-color' through, which will in fact color the text
		if (except && except instanceof Array) {
			for (var i = 0, l = except.length; i < l; i++) {
				name = except[i];
				delete product[name];
			}
		}
		
		// one way out so we can process blacklist in one spot
		return product;
	
	};
	
	// sugar - source is the selector, dom element or jQuery instance to copy from - only and except are optional
	$.fn.copyCSS = function(source, only, except) {
		var styles = $(source).getStyles(only, except);
		this.css(styles);
		
		return this;
	};
	
})(jQuery);
