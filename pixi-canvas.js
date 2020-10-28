(function () {
    var pixiVersion;
    var SpritePool = function (initialSize) {
        var i;
        // initialize        
        this.sprites = [];
        for (i = 0; i < initialSize; ++i) {
            this.sprites.push(new PIXI.Sprite());
        }
        this.index = 0;
    };
    SpritePool.prototype.reset = function () {
        this.index = 0;
    };
    SpritePool.prototype.getSprite = function () {
        var sprite = this.sprites[this.index];
        if (!sprite) {
            sprite = new PIXI.Sprite();
            this.sprites.push(sprite);
        }
        this.index += 1;
        return sprite;
    };

    var PixiContext = function (canvas) {
        // CanvasRenderingContext2D interface
        this.canvas = canvas;
        this.currentTransform = new PIXI.Matrix();
        this.globalAlpha = 1;
        this._globalCompositeOperation = "source-over";
        this.imageSmoothingEnabled = false;
        this.lineWidth = 1;
        this.lineCap = "butt";
        this.lineJoin = "miter";
        this.miterLimit = "10";
        this.font = "10px sans-serif";
        this.textAlign = "left";
        this.textBaseline = "bottom";
        this.direction = "inherit";
        this._fillStyle = "#000";
        this._strokeStyle = "#000";

        Object.defineProperties(this, {
            font: {
                get: function () {
                    // TODO: v4
                    return this.text._style.font;
                },
                set: function (value) {
                    this.text._style.font = value;
                }
            },
            textAlign: {
                get: function () {
                    return this.text._style.align;
                },
                set: function (value) {
                    this.text._style.align = value;
                }
            },
            textBaseline: {
                get: function () {
                    return this.text._style.textBaseline;
                },
                set: function (value) {
                    this.text._style.textBaseline = value;
                }
            },
            fillStyle: {
                get: function () {
                    return this._fillStyle;
                },
                set: function (value) {
                    this.fillStyleColor = getColor(value);
                    this._fillStyle = value;
                }
            },
            strokeStyle: {
                get: function () {
                    return this._strokeStyle;
                },
                set: function (value) {
                    this.strokeStyleColor = getColor(value);
                    this._strokeStyle = value;
                }
            },
            globalCompositeOperation: {
                get: function () {
                    return this._globalCompositeOperation;
                },
                set: function (value) {
                    var gl = this.renderer.gl;
                    if (this._globalCompositeOperation === value) {
                        // no need to change anything
                        return;
                    }
                    this._globalCompositeOperation = value;

                    this.flush();
                    if (value === 'source-out') {
                        gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ZERO);
                    } else if (value === 'source-in') {
                        gl.blendFunc(gl.DST_ALPHA, gl.ZERO);
                    } else if (value === 'destination-out') {
                        gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
                    } else if (value === 'destination-in') {
                        gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
                    } else {
                        // source-over
                        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    }
                    this.start();
                }
            }
        });

        // PixiContext stuff
        this.matrixStack = [];
        this.alphaStack = [];
        this.fillStyleColor = {
            color: 0x000000,
            alpha: 1
        };
        this.strokeStyleColor = {
            color: 0x000000,
            alpha: 1
        };
        // init pixi
        this.renderer = new PIXI.WebGLRenderer(
            canvas.width,
            canvas.height, {
                view: canvas,
                backgroundColor: 0x000000,
                clearBeforeRender: false,
                preserveDrawingBuffer: true
            }
        );
        this.spriteRenderer = this.renderer.plugins.sprite;
        this.graphicsRenderer = this.renderer.plugins.graphics;
        this.graphics = new PIXI.Graphics();
        this.text = new PIXI.Text("");
        this.width = canvas.width;
        this.height = canvas.height;
        this.spritePool = new SpritePool(2000);
        this.fakeParent = {
            worldTransform: null,
            worldAlpha: 1,
            children: []
        };
    };

    // start and flush: needed for webgl
    PixiContext.prototype.start = function () {
        // check if canvas changed size in the meantime 
        if (this.width !== this.canvas.width || this.height !== this.canvas.height) {
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.renderer.resize(this.width, this.height);
        }
        // v4
        if (pixiVersion === 4) {
            // this.renderer.reset();
            this.renderer.bindRenderTexture();
        }
        this.spriteRenderer.start();
    };
    PixiContext.prototype.flush = function () {
        this.spriteRenderer.flush();
        this.spritePool.reset();
    };

    // transforms
    PixiContext.prototype.rotate = function (angle) {
        var transform = new PIXI.Matrix();
        this.currentTransform.append(transform.rotate(angle));
    };
    PixiContext.prototype.scale = function (x, y) {
        var transform = new PIXI.Matrix();
        this.currentTransform.append(transform.scale(x, y));
    };
    PixiContext.prototype.translate = function (x, y) {
        var transform = new PIXI.Matrix();
        this.currentTransform.append(transform.translate(x, y));
    };
    PixiContext.prototype.transform = function (a, b, c, d, tx, ty) {
        var matrix = new PIXI.Matrix();
        matrix.a = a;
        matrix.b = b;
        matrix.c = c;
        matrix.d = d;
        matrix.tx = tx;
        matrix.ty = ty;
        this.currentTransform.append(matrix);
    };
    PixiContext.prototype.setTransform = function (a, b, c, d, tx, ty) {
        var matrix = this.currentTransform;
        matrix.a = a;
        matrix.b = b;
        matrix.c = c;
        matrix.d = d;
        matrix.tx = tx;
        matrix.ty = ty;
    };
    PixiContext.prototype.resetTransform = function () {
        this.currentTransform = new PIXI.Matrix();
    };
    PixiContext.prototype.save = function () {
        this.matrixStack.push(this.currentTransform.clone());
        this.alphaStack.push(this.globalAlpha);
    };
    PixiContext.prototype.restore = function () {
        this.currentTransform = this.matrixStack.pop();
        this.globalAlpha = this.alphaStack.pop();
    };

    // draw image
    PixiContext.prototype.drawImage = function (image, sx, sy, sw, sh, x, y, w, h) {
        var rectangle;
        var sprite = this.spritePool.getSprite();
        var texture;

        // there's multiple ways to call drawImage...
        // drawImage(image, x, y)
        // drawImage(image, x, y, w, h)
        // drawImage(image, sx, sy, sw, sh, x, y, w, h)
        if (sw === undefined) {
            x = sx;
            y = sy;
            sx = 0;
            sy = 0;
            sw = image.width;
            sh = image.height;
        } else if (x === undefined) {
            x = sx;
            y = sy;
            w = sw;
            h = sh;
            sx = 0;
            sy = 0;
            sw = image.width;
            sh = image.height;
        }

        if (!image.texture) {
            // initialize pixi textures, stored them in the image so they can be reused!
            // this however, has consequences if image is a canvas, the user must reset the texture manually
            image.texture = new PIXI.BaseTexture(image);
            image.frame = new PIXI.Texture(image.texture);
        }

        // apply x, y, w, h
        // this.save();
        this.translate(x, y);
        this.scale(w / sw, h / sh);

        // v4 transform property + calculateVertices method
        if (pixiVersion === 4) {
            // bugged!!
            // texture = image.frame;
            // rectangle = texture.frame;
            // rectangle.x = sx;
            // rectangle.y = sy;
            // rectangle.width = sw;
            // rectangle.height = sh;
            // texture._updateUvs();

            // make a new rectangle and texture...
            rectangle = new PIXI.Rectangle(sx, sy, sw, sh);
            texture = new PIXI.Texture(image.texture, rectangle);

            texture._updateUvs();
            sprite._texture = texture;

            sprite.transform.worldTransform = this.currentTransform;
            sprite.transform.worldAlpha = this.globalAlpha;
            sprite.calculateVertices();
        } else {
            texture = image.frame;
            rectangle = texture._frame;
            rectangle.x = sx;
            rectangle.y = sy;
            rectangle.width = sw;
            rectangle.height = sh;
            texture._updateUvs();
            sprite._texture = texture;

            sprite.worldTransform = this.currentTransform;
            sprite.worldAlpha = this.globalAlpha;
        }

        // push into batch
        this.renderer.setObjectRenderer(this.spriteRenderer);
        this.spriteRenderer.render(sprite);

        // restore after save
        this.translate(-x, -y);
        this.scale(sw / w, sh / h);
        // this.restore();

        // did the spriteRenderer flush in the meantime?
        if (this.spriteRenderer.currentBatchSize === 0) {
            // the spritepool can be reset as well then
            this.spritePool.reset();
        }
    };

    // rectangles
    PixiContext.prototype.clearRect = function () {
        var gl = this.renderer.gl;
        gl.clearColor(0, 0, 0, 0);
    };
    PixiContext.prototype.fillRect = function (x, y, w, h) {
        var graphics = new PIXI.Graphics();
        graphics.worldTransform = this.currentTransform;
        graphics.worldAlpha = this.globalAlpha;
        graphics.beginFill(this.fillStyleColor.color, this.fillStyleColor.alpha);
        graphics.drawRect(x, y, w, h);

        this.renderer.setObjectRenderer(this.graphicsRenderer);
        this.graphicsRenderer.render(graphics);
    };
    PixiContext.prototype.strokeRect = function (x, y, w, h) {
        var graphics = new PIXI.Graphics();
        graphics.worldTransform = this.currentTransform;
        graphics.worldAlpha = this.globalAlpha;
        graphics.lineWidth = this.lineWidth;
        graphics.lineColor = this.strokeStyleColor.color;
        graphics.lineAlpha = this.strokeStyleColor.alpha;
        graphics.drawRect(x, y, w, h);

        this.renderer.setObjectRenderer(this.graphicsRenderer);
        this.graphicsRenderer.render(graphics);
    };

    PixiContext.prototype.fillText = function (text, x, y) {
        this.text.text = text;
        this.text._style.fill = true;
        this.text._style.stroke = false;
        this.text.updateText();

        this.save();
        this.translate(x, y);
        this.text.worldTransform = this.currentTransform;
        this.text.worldAlpha = this.globalAlpha;

        // push into batch
        this.renderer.setObjectRenderer(this.spriteRenderer);
        this.spriteRenderer.render(this.text);
        this.restore();
    };
    PixiContext.prototype.strokeText = function (text, x, y) {
        this.text.text = text;
        this.text._style.fill = false;
        this.text._style.stroke = true;
        this.text._style.strokeThickness = this.lineWidth;
        this.text.updateText();
        this.save();
        this.translate(x, y);
        this.text.worldTransform = this.currentTransform;
        this.text.worldAlpha = this.globalAlpha;

        // push into batch
        this.renderer.setObjectRenderer(this.spriteRenderer);
        this.spriteRenderer.render(this.text);
        this.restore();
    };
    PixiContext.prototype.measureText = function (text) {
        this.text.text = text;
        return this.text.context.measureText(text);
    };
    // paths
    PixiContext.prototype.beginPath = function () {
        this.graphics = new PIXI.Graphics();
    };
    PixiContext.prototype.closePath = function () {
        this.graphics.currentPath.shape.closed = true;
    };
    PixiContext.prototype.moveTo = function (x, y) {
        this.graphics.moveTo(x, y);
    };
    PixiContext.prototype.lineTo = function (x, y) {
        this.graphics.lineTo(x, y);
    };
    PixiContext.prototype.bezierCurveTo = function (cpX, cpY, cpX2, cpY2, toX, toY) {
        this.graphics.bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY);
    };
    PixiContext.prototype.quadraticCurveTo = function (cpX, cpY, toX, toY) {
        this.graphics.quadraticCurveTo(cpX, cpY, toX, toY);
    };
    PixiContext.prototype.arc = function (cx, cy, radius, startAngle, endAngle, anticlockwise) {
        this.graphics.arc(cx, cy, radius, startAngle, endAngle, anticlockwise);
    };
    PixiContext.prototype.arcTo = function (x1, y1, x2, y2, radius) {
        this.graphics.arcTo(x1, y1, x2, y2, radius);
    };
    PixiContext.prototype.fill = function () {
        this.graphics.worldTransform = this.currentTransform;
        this.graphics.worldAlpha = this.globalAlpha;
        this.graphics.beginFill(this.fillStyleColor.color, this.fillStyleColor.alpha);
        this.graphics.drawShape(this.graphics.currentPath.shape);
        this.graphics.endFill();

        this.renderer.setObjectRenderer(this.graphicsRenderer);
        this.graphicsRenderer.render(this.graphics);
    };
    PixiContext.prototype.stroke = function () {
        this.graphics.worldTransform = this.currentTransform;
        this.graphics.worldAlpha = this.globalAlpha;
        this.graphics.lineWidth = this.lineWidth;
        this.graphics.lineColor = this.strokeStyleColor.color;
        this.graphics.lineAlpha = this.strokeStyleColor.alpha;
        this.graphics.drawShape(this.graphics.currentPath.shape);

        this.renderer.setObjectRenderer(this.graphicsRenderer);
        this.graphicsRenderer.render(this.graphics);
    };

    /**
     * Bonus feature: draws any Pixi displayObject
     */
    PixiContext.prototype.drawPixi = function (displayObject) {
        // trick the renderer by setting our own parent
        var transformObject = this.fakeParent;
        var oldParent = displayObject.parent;
        transformObject.worldTransform = this.currentTransform;
        transformObject.worldAlpha = this.globalAlpha;

        displayObject.parent = transformObject;
        displayObject.updateTransform();
        displayObject.renderWebGL(this.renderer);
        
        // reset
        displayObject.parent = oldParent;
    };

    // not sure what to do with these
    PixiContext.prototype.createImageData = function () {};
    PixiContext.prototype.getImageData = function () {};
    PixiContext.prototype.putImageData = function () {};

    // Unsupported stuff
    PixiContext.prototype.addHitRegion = function () {};
    PixiContext.prototype.removeHitRegion = function () {};
    PixiContext.prototype.clearHitRegion = function () {};
    PixiContext.prototype.ellipse = function () {};
    PixiContext.prototype.rect = function () {};
    PixiContext.prototype.getLineDash = function () {};
    PixiContext.prototype.setLineDash = function () {};
    PixiContext.prototype.lineDashOffset = function () {};
    PixiContext.prototype.createLinearGradient = function () {};
    PixiContext.prototype.createRadialGradient = function () {};
    PixiContext.prototype.createPattern = function () {};
    PixiContext.prototype.shadowBlur = function () {};
    PixiContext.prototype.shadowColor = function () {};
    PixiContext.prototype.shadowOffsetX = function () {};
    PixiContext.prototype.shadowOffsetY = function () {};
    PixiContext.prototype.drawFocusIfNeeded = function () {};
    PixiContext.prototype.scrollPathInView = function () {};
    PixiContext.prototype.clip = function () {};
    PixiContext.prototype.isPointInPath = function () {};
    PixiContext.prototype.isPointInStroke = function () {};

    var colorKeywords = {
        aliceblue: 0xf0f8ff,
        antiquewhite: 0xfaebd7,
        aqua: 0x00ffff,
        aquamarine: 0x7fffd4,
        azure: 0xf0ffff,
        beige: 0xf5f5dc,
        bisque: 0xffe4c4,
        black: 0x000000,
        blanchedalmond: 0xffebcd,
        blue: 0x0000ff,
        blueviolet: 0x8a2be2,
        brown: 0xa52a2a,
        burlywood: 0xdeb887,
        cadetblue: 0x5f9ea0,
        chartreuse: 0x7fff00,
        chocolate: 0xd2691e,
        coral: 0xff7f50,
        cornflowerblue: 0x6495ed,
        cornsilk: 0xfff8dc,
        crimson: 0xdc143c,
        cyan: 0x00ffff,
        darkblue: 0x00008b,
        darkcyan: 0x008b8b,
        darkgoldenrod: 0xb8860b,
        darkgray: 0xa9a9a9,
        darkgreen: 0x006400,
        darkkhaki: 0xbdb76b,
        darkmagenta: 0x8b008b,
        darkolivegreen: 0x556b2f,
        darkorange: 0xff8c00,
        darkorchid: 0x9932cc,
        darkred: 0x8b0000,
        darksalmon: 0xe9967a,
        darkseagreen: 0x8fbc8f,
        darkslateblue: 0x483d8b,
        darkslategray: 0x2f4f4f,
        darkturquoise: 0x00ced1,
        darkviolet: 0x9400d3,
        deeppink: 0xff1493,
        deepskyblue: 0x00bfff,
        dimgray: 0x696969,
        dodgerblue: 0x1e90ff,
        firebrick: 0xb22222,
        floralwhite: 0xfffaf0,
        forestgreen: 0x228b22,
        fuchsia: 0xff00ff,
        gainsboro: 0xdcdcdc,
        ghostwhite: 0xf8f8ff,
        gold: 0xffd700,
        goldenrod: 0xdaa520,
        gray: 0x808080,
        green: 0x008000,
        greenyellow: 0xadff2f,
        grey: 0x808080,
        honeydew: 0xf0fff0,
        hotpink: 0xff69b4,
        indianred: 0xcd5c5c,
        indigo: 0x4b0082,
        ivory: 0xfffff0,
        khaki: 0xf0e68c,
        lavender: 0xe6e6fa,
        lavenderblush: 0xfff0f5,
        lawngreen: 0x7cfc00,
        lemonchiffon: 0xfffacd,
        lightblue: 0xadd8e6,
        lightcoral: 0xf08080,
        lightcyan: 0xe0ffff,
        lightgoldenrodyellow: 0xfafad2,
        lightgrey: 0xd3d3d3,
        lightgreen: 0x90ee90,
        lightpink: 0xffb6c1,
        lightsalmon: 0xffa07a,
        lightseagreen: 0x20b2aa,
        lightskyblue: 0x87cefa,
        lightslategray: 0x778899,
        lightsteelblue: 0xb0c4de,
        lightyellow: 0xffffe0,
        lime: 0x00ff00,
        limegreen: 0x32cd32,
        linen: 0xfaf0e6,
        magenta: 0xff00ff,
        maroon: 0x800000,
        mediumaquamarine: 0x66cdaa,
        mediumblue: 0x0000cd,
        mediumorchid: 0xba55d3,
        mediumpurple: 0x9370d8,
        mediumseagreen: 0x3cb371,
        mediumslateblue: 0x7b68ee,
        mediumspringgreen: 0x00fa9a,
        mediumturquoise: 0x48d1cc,
        mediumvioletred: 0xc71585,
        midnightblue: 0x191970,
        mintcream: 0xf5fffa,
        mistyrose: 0xffe4e1,
        moccasin: 0xffe4b5,
        navajowhite: 0xffdead,
        navy: 0x000080,
        oldlace: 0xfdf5e6,
        olive: 0x808000,
        olivedrab: 0x6b8e23,
        orange: 0xffa500,
        orangered: 0xff4500,
        orchid: 0xda70d6,
        palegoldenrod: 0xeee8aa,
        palegreen: 0x98fb98,
        paleturquoise: 0xafeeee,
        palevioletred: 0xd87093,
        papayawhip: 0xffefd5,
        peachpuff: 0xffdab9,
        peru: 0xcd853f,
        pink: 0xffc0cb,
        plum: 0xdda0dd,
        powderblue: 0xb0e0e6,
        purple: 0x800080,
        red: 0xff0000,
        rosybrown: 0xbc8f8f,
        royalblue: 0x4169e1,
        saddlebrown: 0x8b4513,
        salmon: 0xfa8072,
        sandybrown: 0xf4a460,
        seagreen: 0x2e8b57,
        seashell: 0xfff5ee,
        sienna: 0xa0522d,
        silver: 0xc0c0c0,
        skyblue: 0x87ceeb,
        slateblue: 0x6a5acd,
        slategray: 0x708090,
        snow: 0xfffafa,
        springgreen: 0x00ff7f,
        steelblue: 0x4682b4,
        tan: 0xd2b48c,
        teal: 0x008080,
        thistle: 0xd8bfd8,
        tomato: 0xff6347,
        turquoise: 0x40e0d0,
        violet: 0xee82ee,
        wheat: 0xf5deb3,
        white: 0xffffff,
        whitesmoke: 0xf5f5f5,
        yellow: 0xffff00,
        yellowgreen: 0x9acd32
    };

    // returns color and alpha as integers from a string
    var getColor = function (str) {
        var color;
        var floats;

        if (!str) {
            return {
                color: 0xffffff,
                alpha: 1
            };
        }
        // in the form of "#fff" or "#ffffff"
        if (str[0] === "#") {
            if (str.length === 4) {
                str = "#" + str[1] + "0" + str[2] + "0" + str[3] + "0";
            }
            return {
                color: parseInt(str.replace("#", "0x")),
                alpha: 1
            };
        }
        // in the form of "rgba(1, 1, 1, 1)" or "rgb(1, 1, 1)"
        if (str.substring(0, 3) === "rgb") {
            str = str.replace("rgba(", "").replace("rgb(", "").replace(")", "");
            floats = str.split(",");
            color = floats[2] * 255 + (floats[1] * 255 << 8) + (floats[0] * 255 << 16);
            return {
                color: color,
                alpha: floats[3] || 0
            };
        }

        // todo: in the form of hsl() and hsla()

        // in the form of a color name
        return {
            color: colorKeywords[str.toLowerCase()] || 0,
            alpha: 1
        };
    };

    var init = function () {
        var getContext = HTMLCanvasElement.prototype.getContext;
        // is pixi available at all?
        if (!window.PIXI) {
            console.log('WARNING: PIXI library could not be found.');
            return;
        }
        // pixi verson check
        pixiVersion = parseInt(window.PIXI.VERSION);
        if (pixiVersion === 2) {
            console.log('WARNING: Please use pixi v3');
            return;
        } else if (pixiVersion === 4) {
            console.log('WARNING: Pixi v4 detected, v3 is recommended (not all features are implemented for v4)');
        }
        // overwrite getContext function to add pixi as context option
        HTMLCanvasElement.prototype.getContext = function (name) {
            if (name === 'pixi') {
                this.context = this.context || new PixiContext(this);
                return this.context;
            } else {
                return getContext.call(this, name);
            }
        };
    };

    init();
})();
