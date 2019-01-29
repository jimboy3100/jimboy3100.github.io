// WARNING! This file contains some subset of JS that is not supported by type inference.
// You can try checking 'Transpile to ES5' checkbox if you want the types to be inferred
'use strict';
!function(options) {
  function BirdLoader() {
    this.canvas = [];
    this.context = [];
    this.lastViewScale = 0;
    this.__proto__ = o;
  }
  function hookExceptionUnwind() {
    a.forEach((t) => {
      l.create(t);
    });
    r.create(a[0]);
    Object.defineProperty(options.vanilla.settings, "optDotsColor", {
      get : function() {
        return this._optDotsColor;
      },
      set : function(f) {
        if ("string" == typeof f) {
          this._optDotsColor = f;
          r.redrawEx(f);
        }
      }
    });
  }
  function init(global, o, buffer) {
    function addSpiro(index) {
      index = index | 0;
      currentChartType = index | 0;
    }
    function render(t, i, size, s, count, width, height, id, point, result, value, depth, type, left, src, filename) {
      t = t | 0;
      i = i | 0;
      size = +size;
      s = +s;
      count = +count;
      width = +width;
      height = +height;
      id = id | 0;
      point = point | 0;
      result = result | 0;
      value = value | 0;
      depth = depth | 0;
      type = type | 0;
      left = left | 0;
      src = src | 0;
      filename = filename | 0;
      var rs1 = 0;
      var _ = 0;
      var longNameFlag = 0;
      var shortNameFlag = 0;
      var tmpb = 0;
      var currentSamplingIntervalMs = 0;
      var fps = 0;
      var alpha = 0;
      var dx = 0;
      var dy = 0;
      var x = 0;
      var y = 0;
      var option = 0;
      var H = 0;
      var U = 0;
      H = mapFragmentAndProps(1) | 0;
      U = mapFragmentAndProps(3) | 0;
      x = width - s * size - padding;
      y = height - count * size - padding;
      option = size * 100 * .01;
      value = value << 3;
      if (H) {
        dispatchEvent(option);
        do {
          _ = hexValues[t >> 2] | 0;
          if ((ctx[_ + id >> 0] | 0) == 0) {
            break;
          }
          rs1 = _ + result | 0;
          alpha = (+wavetones[value >> 3] - +wavetones[rs1 >> 3]) * .01;
          alpha = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;
          currentSamplingIntervalMs = +a[_ + depth >> 2];
          fps = +a[_ + type >> 2];
          dx = currentSamplingIntervalMs + alpha * (+a[_ + left >> 2] - currentSamplingIntervalMs);
          dy = fps + alpha * (+a[_ + src >> 2] - fps);
          getHeight(x + dx * size, y + dy * size);
          t = t + 4 | 0;
        } while ((t | 0) != (i | 0));
      } else {
        $(option);
        do {
          _ = hexValues[t >> 2] | 0;
          if ((ctx[_ + id >> 0] | 0) == 0) {
            break;
          }
          rs1 = _ + result | 0;
          alpha = (+wavetones[value >> 3] - +wavetones[rs1 >> 3]) * .01;
          alpha = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;
          currentSamplingIntervalMs = +a[_ + depth >> 2];
          fps = +a[_ + type >> 2];
          dx = currentSamplingIntervalMs + alpha * (+a[_ + left >> 2] - currentSamplingIntervalMs);
          dy = fps + alpha * (+a[_ + src >> 2] - fps);
          rs1 = _ + filename | 0;
          longNameFlag = char_changed[rs1 >> 0] | 0;
          shortNameFlag = char_changed[rs1 + 1 >> 0] | 0;
          tmpb = char_changed[rs1 + 2 >> 0] | 0;
          rs1 = longNameFlag << 16 | shortNameFlag << 8 | tmpb;
          drawArc(mul(rs1 | 0, 10) | 0, x + dx * size, y + dy * size);
          t = t + 4 | 0;
        } while ((t | 0) != (i | 0));
      }
      return t | 0;
    }
    function update(val, index, pts, x, y, res, n) {
      val = +val;
      index = +index;
      pts = pts | 0;
      x = x | 0;
      y = y | 0;
      res = +res;
      n = n | 0;
      var u = 0;
      var str = 0;
      var count = 0;
      t: do {
        if ((x | 0) >= 0) {
          x = 0;
          for (; 1;) {
            u = (x | 0) % (y | 0) | 0;
            count = +a[pts + (u * 28 | 0) + 20 >> 2] + res;
            count = (x & 1 | 0) == 0 & n ? count + 5 : count;
            str = val + +a[pts + (u * 28 | 0) + 12 >> 2] * count;
            count = index + +a[pts + (u * 28 | 0) + 16 >> 2] * count;
            if (!x) {
              test(+str, +count);
            } else {
              parseFloat(+str, +count);
            }
            if ((x | 0) >= (y | 0)) {
              break t;
            }
            x = x + 1 | 0;
          }
        }
      } while (0);
    }
    function read(port, size, type, ptr) {
      port = port | 0;
      size = size | 0;
      type = type | 0;
      ptr = ptr | 0;
      var r = 0;
      var ppc = 0;
      var fence = 0;
      r = hexValues[port + size >> 2] | 0;
      ppc = hexValues[type << 2 >> 2] | 0;
      fence = hexValues[ptr << 2 >> 2] | 0;
      t: do {
        if ((ppc | 0) != (fence | 0)) {
          for (; 1;) {
            if ((hexValues[ppc >> 2] | 0) == (r | 0)) {
              break t;
            }
            ppc = ppc + 4 | 0;
            if ((ppc | 0) == (fence | 0)) {
              ppc = fence;
              break;
            }
          }
        }
      } while (0);
      return (ppc | 0) != (fence | 0) | 0;
    }
    "use asm";
    const ctx = new global.Int8Array(buffer);
    const char_changed = new global.Uint8Array(buffer);
    const hexValues = new global.Int32Array(buffer);
    const a = new global.Float32Array(buffer);
    const wavetones = new global.Float64Array(buffer);
    const test = o.moveTo;
    const parseFloat = o.lineTo;
    const getHeight = o.dotMDraw;
    const dispatchEvent = o.dotMRedraw;
    const drawArc = o.dotDraw;
    const $ = o.dotRedraw;
    const mul = o.bsColor;
    const mapFragmentAndProps = o.getOption;
    const padding = +o.radius;
    var currentChartType = 0;
    return {
      drawPolygon : update,
      isPlayerCell : read,
      drawDots : render,
      setBrowserState : addSpiro
    };
  }
  function main() {
    obj = document.querySelector("#canvas");
    ctx = obj.getContext("2d");
    let property = Object.assign({}, res, second, {
      radius : current_radius
    });
    Object.assign(res, init(options, property, inputs.buffer));
    res.setMetric(obj.width, obj.height);
    (new MutationObserver(function(wrappersTemplates) {
      wrappersTemplates.forEach(function(a) {
        if ("attributes" === a.type) {
          res.setMetric(obj.width, obj.height);
        }
      });
    })).observe(obj, {
      attributes : true
    });
  }
  let obj = null;
  let ctx = null;
  let buffer = new ArrayBuffer(65536);
  (new Int32Array(buffer)).set([461823, 463359, 464895, 466431, 467967, 469247, 470783, 472319, 473855, 475135, 476671, 478207, 479743, 481279, 482559, 484095, 485631, 487167, 488703, 489983, 491519, 493055, 494591, 496127, 497407, 498943, 500479, 502015, 503295, 504831, 506367, 507903, 509439, 510719, 512255, 513791, 515327, 516863, 518143, 519679, 521215, 522751, 524031, 524040, 524046, 524052, 524058, 524064, 524069, 524075, 524081, 524087, 524093, 524098, 524104, 524110, 524116, 524122, 524127, 
  524133, 524139, 524145, 524150, 524156, 524162, 524168, 524174, 524179, 524185, 524191, 524197, 524203, 524208, 524214, 524220, 524226, 524232, 524237, 524243, 524249, 524255, 524260, 524266, 524272, 524278, 524284, 526335, 786183, 919551, 1179399, 1312767, 1572615, 1705983, 1965831, 2099199, 2359047, 2426879, 2686727, 2820095, 3079943, 3213311, 3473159, 3606527, 3866375, 3999743, 4194055, 4327423, 4587271, 4720639, 4980487, 5113855, 5373703, 5507071, 5766919, 5900287, 6094599, 6227967, 6487815, 
  6621183, 6881031, 7014399, 7274247, 7407615, 7667463, 7735295, 7995143, 8128511, 8388359, 8521727, 8781575, 8914943, 9174791, 9308159, 9568007, 9635839, 9895687, 10029055, 10288903, 10422271, 10682119, 10815487, 11075335, 11208703, 11403015, 11536383, 11796231, 11929599, 12189447, 12322815, 12582663, 12716031, 12975879, 13109247, 13303559, 13436927, 13696775, 13830143, 14089991, 14223359, 14483207, 14616575, 14876423, 14944255, 15204103, 15337471, 15597319, 15730687, 15990535, 16123903, 16383751, 
  16517119, 16711431, 16713495, 16713501, 16713507, 16713512, 16713518, 16713524, 16713530, 16713535, 16713541, 16713547, 16713553, 16713559, 16713564, 16713570, 16713576, 16713582, 16713588, 16713593, 16713599, 16713605, 16713611, 16713617, 16713622, 16713628, 16713634, 16713640, 16713645, 16713651, 16713657, 16713663, 16713669, 16713674, 16713680, 16713686, 16713692, 16713698, 16713703, 16713709, 16713715, 16713721, 16713726, 16713735, 16715271, 16716807, 16718343, 16719879, 16721159, 16722695, 
  16724231, 16725767, 16727303, 16728583, 16730119, 16731655, 16733191, 16734727, 16736007, 16737543, 16739079, 16740615, 16741895, 16743431, 16744967, 16746503, 16748039, 16749319, 16750855, 16752391, 16753927, 16755463, 16756743, 16758279, 16759815, 16761351, 16762887, 16764167, 16765703, 16767239, 16768775, 16770055, 16771591, 16773127, 16774663, 16776199]);
  let a = ["#FF0751", "#FF7107", "#FF3705", "#FFB405", "#CDFF05", "#B405FF", "#05CDFF", "#FF05CD", "#05FFB4", "#0550FF"];
  let statHeader = a.length;
  let o = function() {
    function draw_shape(context, scale) {
      let i = 0;
      context.beginPath();
      context.moveTo(x + scale * tar1[i], height + scale * e2Sensor[i]);
      for (; ++i < numPoistiveTicks;) {
        context.lineTo(x + scale * tar1[i], height + scale * e2Sensor[i]);
      }
      context.closePath();
    }
    const x = 16;
    const height = 16;
    const edgePointAtAngle = Math.cos;
    const pol = Math.sin;
    const numPoistiveTicks = 6;
    const i = 2 * Math.PI / numPoistiveTicks;
    const tar1 = [edgePointAtAngle(0), edgePointAtAngle(1 * i), edgePointAtAngle(2 * i), edgePointAtAngle(3 * i), edgePointAtAngle(4 * i), edgePointAtAngle(5 * i)];
    const e2Sensor = [pol(0), pol(1 * i), pol(2 * i), pol(3 * i), pol(4 * i), pol(5 * i)];
    return {
      create : function(img) {
        let elem = document.createElement("canvas");
        let ctx = elem.getContext("2d");
        elem.width = elem.height = 32;
        ctx.translate(x, height);
        ctx.rotate(90 * Math.PI / 180);
        ctx.translate(-x, -height);
        draw_shape(ctx, 16);
        ctx.fillStyle = img;
        ctx.fill();
        this.canvas.push(elem);
        this.context.push(ctx);
      },
      redraw : function(viewer) {
        if (viewer > 1 && (viewer = 1), this.lastViewScale === viewer) {
          return;
        }
        this.lastViewScale = viewer;
        let shape = 16 * viewer;
        let context = null;
        for (context of this.context) {
          context.clearRect(0, 0, 32, 32);
          draw_shape(context, shape);
          context.fill();
        }
      },
      redrawEx : function(f) {
        let shape = 16 * this.lastViewScale;
        let context = null;
        for (context of this.context) {
          context.clearRect(0, 0, 32, 32);
          draw_shape(context, shape);
          context.fillStyle = f;
          context.fill();
        }
      },
      radius : 16
    };
  }();
  let l = new BirdLoader;
  let r = new BirdLoader;
  let images = l.canvas;
  let rgbks = r.canvas;
  let current_radius = l.radius;
  const second = {
    beginPath : () => {
      return ctx.beginPath();
    },
    moveTo : (x, y) => {
      return ctx.moveTo(x, y);
    },
    lineTo : (aX, aY) => {
      return ctx.lineTo(aX, aY);
    },
    stroke : () => {
      return ctx.stroke();
    },
    lineFromTo : (list, e, x, y0) => {
      ctx.moveTo(list, e);
      ctx.lineTo(x, y0);
    },
    setGridStyle : (alpha, i) => {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = i ? "rgb(0,0,0)" : "rgb(170,170,170)";
      ctx.lineWidth = 1;
    },
    strokeGrid : () => {
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
    dotMDraw : (sx, sy) => {
      return ctx.drawImage(rgbks[0], sx, sy);
    },
    dotMRedraw : (that) => {
      return r.redraw(that);
    },
    dotDraw : (i, sx, sy) => {
      return ctx.drawImage(images[i], sx, sy);
    },
    dotRedraw : (that) => {
      return l.redraw(that);
    }
  };
  let res = function(global, canvas, buffer) {
    function scaffoldType(contentType) {
      contentType = contentType | 0;
      var e = 0;
      var n = 0;
      var o = 0;
      var i = firstDisplayed;
      for (; (i | 0) > (n | 0);) {
        o = i + n >> 1 | 0;
        e = (memoryClient[o << 2 >> 2] | 0) - contentType | 0;
        if ((e | 0) < 0) {
          n = o + 1 | 0;
        } else {
          if ((e | 0) > 0) {
            i = o | 0;
          } else {
            return o | 0;
          }
        }
      }
      return n | 0;
    }
    function _tryFeature(dy, y) {
      dy = dy | 0;
      y = y | 0;
      var x = 0;
      var bitmask = 128;
      var prevX = 0;
      do {
        prevX = x | bitmask;
        if ((memoryClient[prevX << 2 >> 2] | 0) <= (dy | 0)) {
          x = prevX;
        }
        bitmask = bitmask >> 1;
      } while (bitmask);
      return (x | 0) % (y | 0) | 0;
    }
    function drawGrid(step, width, scale, x) {
      step = +step;
      width = +width;
      scale = +scale;
      x = x | 0;
      var PL$15 = 0;
      var PL$16 = 0;
      var sum = 0;
      var PL$39 = 0;
      var target = 0;
      var item = 0;
      if (!(min(0) | 0)) {
        return;
      }
      sum = scale * .2;
      if (+sum < .02) {
        return;
      }
      gridPath();
      traceHasBarsOrFill(+sum, x | 0);
      PL$15 = ~~(+(off | 0) / scale);
      PL$16 = ~~(+(whatToScale | 0) / scale);
      PL$39 = ~~(+(PL$15 >> 1) - step) % 50 | 0;
      if ((PL$39 | 0) < (PL$15 | 0)) {
        target = +(PL$16 | 0) * scale;
        do {
          item = +(PL$39 | 0) * scale;
          debug(item, 0, item, target);
          PL$39 = PL$39 + 50 | 0;
        } while ((PL$39 | 0) < (PL$15 | 0));
      }
      PL$39 = ~~(+(PL$16 >> 1) - width) % 50 | 0;
      if ((PL$39 | 0) < (PL$16 | 0)) {
        target = +(PL$15 | 0) * scale;
        do {
          item = +(PL$39 | 0) * scale;
          debug(0, item, target, item);
          PL$39 = PL$39 + 50 | 0;
        } while ((PL$39 | 0) < (PL$16 | 0));
      }
      path();
    }
    function justinImageSize(height, width) {
      height = height | 0;
      width = width | 0;
      off = height;
      whatToScale = width;
    }
    function setOption(index, value) {
      index = index | 0;
      value = value | 0;
      if ((index | 0) > table_limit) {
        return;
      }
      memoryClient[controlsCount + index << 2 >> 2] = value;
    }
    function min(index) {
      index = index | 0;
      var e = 0;
      if ((index | 0) <= table_limit) {
        e = memoryClient[controlsCount + index << 2 >> 2] | 0;
      }
      return e | 0;
    }
    "use asm";
    const firstDisplayed = 256;
    const controlsCount = 256;
    const table_limit = 60;
    const memoryClient = new global.Int32Array(buffer);
    const s = global.Math.imul;
    const l = global.Math.log;
    const gridPath = canvas.beginPath;
    const u = canvas.moveTo;
    const f = canvas.lineTo;
    const debug = canvas.lineFromTo;
    const traceHasBarsOrFill = canvas.setGridStyle;
    const path = canvas.strokeGrid;
    var off = 0;
    var whatToScale = 0;
    return {
      bsColor : _tryFeature,
      drawGrid : drawGrid,
      setMetric : justinImageSize,
      setOption : setOption,
      getOption : min
    };
  }(options, second, buffer);
  let inputs = {};
  let lastTrackInfoUrl = {};
  res.__proto__ = {
    get coreStrapping() {
      return inputs;
    },
    set coreStrapping(me) {
      try {
        me.postRun.push(main, hookExceptionUnwind);
      } catch (t) {
      }
      inputs = me;
    },
    get coreBinding() {
      return lastTrackInfoUrl;
    },
    set coreBinding(trackInfoUrl) {
      lastTrackInfoUrl = trackInfoUrl;
    }
  };
  let maxy = 0;
  let mouse_y = Date.now();
  let spec = [0];
  res.fpsOMeter = function(y) {
    let failure = y - mouse_y;
    if (maxy < y) {
      let intendedBet = spec.reduce((buckets, name) => {
        return buckets + name;
      }) / spec.length;
      vanilla.dsValue = Math.ceil(intendedBet);
      maxy = y + 1E3;
      spec = [];
    }
    spec.push(failure);
    mouse_y = y;
  };
  res.getOption(0);
  res.bsColor(0, statHeader);
  options.asmjsHelper = res;
}(window);
!function(self, e) {
  if ("function" == typeof define && define.amd) {
    define([], e);
  } else {
    if ("object" == typeof module && module.exports) {
      module.exports = e();
    } else {
      self.anime = e();
    }
  }
}(window, () => {
  function get(t, type) {
    return t.indexOf(type) > -1;
  }
  function $(value) {
    if (!_this.col(value)) {
      try {
        return document.querySelectorAll(value);
      } catch (t) {
        return;
      }
    }
  }
  function setTimeout(callback, scope) {
    const pixCount = callback.length;
    const data = arguments.length >= 2 ? arguments[1] : void 0;
    let ret = [];
    for (let i = 0; i < pixCount; i++) {
      if (i in callback) {
        const result = callback[i];
        if (scope.call(data, result, i, callback)) {
          ret.push(result);
        }
      }
    }
    return ret;
  }
  function filter(t) {
    return t.reduce((keys, key) => {
      return keys.concat(_this.arr(key) ? filter(key) : key);
    }, []);
  }
  function require(value) {
    return _this.arr(value) ? value : (_this.str(value) && (value = $(value) || value), value instanceof NodeList || value instanceof HTMLCollection ? [].slice.call(value) : [value]);
  }
  function has(element, i) {
    return element.some((numberOfTableNameParts) => {
      return numberOfTableNameParts === i;
    });
  }
  function round(val) {
    let data = {};
    for (let k in val) {
      data[k] = val[k];
    }
    return data;
  }
  function add(val, message) {
    let conflict = round(val);
    for (let key in val) {
      conflict[key] = message.hasOwnProperty(key) ? message[key] : val[key];
    }
    return conflict;
  }
  function callback(a, b) {
    let passes = round(a);
    for (let i in b) {
      passes[i] = _this.und(a[i]) ? b[i] : a[i];
    }
    return passes;
  }
  function parseColor(color) {
    const isCloseUp = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(color);
    return isCloseUp ? `rgba(${isCloseUp[1]},1)` : color;
  }
  function fn(param) {
    const full_conversation_url = param.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (canCreateDiscussions, i, id, date) => {
      return i + i + id + id + date + date;
    });
    const sArrDayId = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full_conversation_url);
    return `rgba(${parseInt(sArrDayId[1], 16)},${parseInt(sArrDayId[2], 16)},${parseInt(sArrDayId[3], 16)},1)`;
  }
  function hex(hex) {
    function add(r, q, t) {
      return t < 0 && (t = t + 1), t > 1 && (t = t - 1), t < 1 / 6 ? r + 6 * (q - r) * t : t < .5 ? q : t < 2 / 3 ? r + (q - r) * (2 / 3 - t) * 6 : r;
    }
    const sArrDayId = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hex) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hex);
    const value = parseInt(sArrDayId[1]) / 360;
    const S = parseInt(sArrDayId[2]) / 100;
    const L = parseInt(sArrDayId[3]) / 100;
    const j = sArrDayId[4] || 1;
    let a;
    let d;
    let c;
    if (0 == S) {
      a = d = c = L;
    } else {
      const i = L < .5 ? L * (1 + S) : L + S - L * S;
      const args = 2 * L - i;
      a = add(args, i, value + 1 / 3);
      d = add(args, i, value);
      c = add(args, i, value - 1 / 3);
    }
    return `rgba(${255 * a},${255 * d},${255 * c},${j})`;
  }
  function harmonize(color) {
    return _this.rgb(color) ? parseColor(color) : _this.hex(color) ? fn(color) : _this.hsl(color) ? hex(color) : void 0;
  }
  function isFunction(obj) {
    const e = /([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(obj);
    if (e) {
      return e[2];
    }
  }
  function rotate(node) {
    return get(node, "translate") || "perspective" === node ? "px" : get(node, "rotate") || get(node, "skew") ? "deg" : void 0;
  }
  function log(i, level, n) {
    return Math.min(Math.max(i, level), n);
  }
  function next(callback, self) {
    return _this.fnc(callback) ? callback(self.target, self.id, self.total) : callback;
  }
  function check(parent, name) {
    if (name in parent.style) {
      return getComputedStyle(parent).getPropertyValue(name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()) || "0";
    }
  }
  function start(options, key) {
    return _this.dom(options) && has(name, key) ? "transform" : _this.dom(options) && (options.getAttribute(key) || _this.svg(options) && options[key]) ? "attribute" : _this.dom(options) && "transform" !== key && check(options, key) ? "css" : null != options[key] ? "object" : void 0;
  }
  function transform(d, v) {
    const n = rotate(v);
    const ast = get(v, "scale") ? 1 : 0 + n;
    const full_conversation_url = d.style.transform;
    if (!full_conversation_url) {
      return ast;
    }
    let splitOnPrefix = [];
    let tokens = [];
    let dispatchRules = [];
    const exp = /(\w+)\((.+?)\)/g;
    for (; splitOnPrefix = exp.exec(full_conversation_url);) {
      tokens.push(splitOnPrefix[1]);
      dispatchRules.push(splitOnPrefix[2]);
    }
    const cnameParts = setTimeout(dispatchRules, (canCreateDiscussions, m) => {
      return tokens[m] === v;
    });
    return cnameParts.length ? cnameParts[0] : ast;
  }
  function parse(item, name) {
    switch(start(item, name)) {
      case "transform":
        return transform(item, name);
      case "css":
        return check(item, name);
      case "attribute":
        return item.getAttribute(name);
    }
    return item[name] || 0;
  }
  function wrap(value, parameter) {
    const numbers = /^(\*=|\+=|-=)/.exec(value);
    if (!numbers) {
      return value;
    }
    const px = isFunction(value) || 0;
    const x = parseFloat(parameter);
    const w = parseFloat(value.replace(numbers[0], ""));
    switch(numbers[0][0]) {
      case "+":
        return x + w + px;
      case "-":
        return x - w + px;
      case "*":
        return x * w + px;
    }
  }
  function resolve(prop, id) {
    if (_this.col(prop)) {
      return harmonize(prop);
    }
    const m = isFunction(prop);
    const easyErpTaskskanban = m ? prop.substr(0, prop.length - m.length) : prop;
    return id && !/\s/g.test(prop) ? easyErpTaskskanban + id : easyErpTaskskanban;
  }
  function d(e, t) {
    return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
  }
  function create(element) {
    return 2 * Math.PI * element.getAttribute("r");
  }
  function extend(e) {
    return 2 * e.getAttribute("width") + 2 * e.getAttribute("height");
  }
  function updateDisplay(link) {
    return d({
      x : link.getAttribute("x1"),
      y : link.getAttribute("y1")
    }, {
      x : link.getAttribute("x2"),
      y : link.getAttribute("y2")
    });
  }
  function setPoint(p) {
    const points = p.points;
    let e;
    let result = 0;
    for (let i = 0; i < points.numberOfItems; i++) {
      const o = points.getItem(i);
      if (i > 0) {
        result = result + d(e, o);
      }
      e = o;
    }
    return result;
  }
  function updateConnectors(c) {
    const seglist = c.points;
    return setPoint(c) + d(seglist.getItem(seglist.numberOfItems - 1), seglist.getItem(0));
  }
  function factory(el) {
    if (el.getTotalLength) {
      return el.getTotalLength();
    }
    switch(el.tagName.toLowerCase()) {
      case "circle":
        return create(el);
      case "rect":
        return extend(el);
      case "line":
        return updateDisplay(el);
      case "polyline":
        return setPoint(el);
      case "polygon":
        return updateConnectors(el);
    }
  }
  function render(options, type) {
    function syncVerticalScroll(tagTypeNumber = 0) {
      const charMidX = type + tagTypeNumber >= 1 ? type + tagTypeNumber : 0;
      return options.el.getPointAtLength(charMidX);
    }
    const xhair = syncVerticalScroll();
    const Cpoints = syncVerticalScroll(-1);
    const point = syncVerticalScroll(1);
    switch(options.property) {
      case "x":
        return xhair.x;
      case "y":
        return xhair.y;
      case "angle":
        return 180 * Math.atan2(point.y - Cpoints.y, point.x - Cpoints.x) / Math.PI;
    }
  }
  function normalize(data, options) {
    const content = /-?\d*\.?\d+/g;
    const text = resolve(_this.pth(data) ? data.totalLength : data, options) + "";
    return {
      original : text,
      numbers : text.match(content) ? text.match(content).map(Number) : [0],
      strings : _this.str(data) || options ? text.split(content) : []
    };
  }
  function write(t) {
    return setTimeout(t ? filter(_this.arr(t) ? t.map(require) : require(t)) : [], (sceneUid, canCreateDiscussions, scenes) => {
      return scenes.indexOf(sceneUid) === canCreateDiscussions;
    });
  }
  function each(to) {
    const chapterSlugs = write(to);
    return chapterSlugs.map((slicedTarget, newWayId) => {
      return {
        target : slicedTarget,
        id : newWayId,
        total : chapterSlugs.length
      };
    });
  }
  function run(o, p) {
    let n = round(p);
    if (_this.arr(o)) {
      const rate = o.length;
      if (2 !== rate || _this.obj(o[0])) {
        if (!_this.fnc(p.duration)) {
          n.duration = p.duration / rate;
        }
      } else {
        o = {
          value : o
        };
      }
    }
    return require(o).map((g, noDelay) => {
      const _self = noDelay ? 0 : p.delay;
      let cfg = _this.obj(g) && !_this.pth(g) ? g : {
        value : g
      };
      return _this.und(cfg.delay) && (cfg.delay = _self), cfg;
    }).map((t) => {
      return callback(t, n);
    });
  }
  function set(params, t, target) {
    let result = [];
    const ui = callback(params, t);
    for (let index in target) {
      if (!(ui.hasOwnProperty(index) || "targets" === index)) {
        result.push({
          name : index,
          offset : ui.offset,
          tweens : run(target[index], t)
        });
      }
    }
    return result;
  }
  function apply(array, link) {
    let args = {};
    for (let idx in array) {
      let source = next(array[idx], link);
      if (_this.arr(source) && 1 === (source = source.map((job) => {
        return next(job, link);
      })).length) {
        source = source[0];
      }
      args[idx] = source;
    }
    return args.duration = parseFloat(args.duration), args.delay = parseFloat(args.delay), args;
  }
  function insert(name) {
    return _this.arr(name) ? item.apply(this, name) : easings[name];
  }
  function update(props, path) {
    let child;
    return props.tweens.map((transformer) => {
      let options = apply(transformer, path);
      const obj = options.value;
      const fallback = parse(path.target, props.name);
      const picked = child ? child.to.original : fallback;
      const value = _this.arr(obj) ? obj[0] : picked;
      const x = wrap(_this.arr(obj) ? obj[1] : obj, value);
      const file = isFunction(x) || isFunction(value) || isFunction(fallback);
      return options.from = normalize(value, file), options.to = normalize(x, file), options.start = child ? child.end : props.offset, options.end = options.start + options.delay + options.duration, options.easing = insert(options.easing), options.elasticity = (1E3 - log(options.elasticity, 1, 999)) / 1E3, options.isPath = _this.pth(obj), options.isColor = _this.col(options.from.original), options.isColor && (options.round = 1), child = options, options;
    });
  }
  function clean(options, e) {
    const GET_USER_PROFILE_SUCCESS = start(options.target, e.name);
    if (GET_USER_PROFILE_SUCCESS) {
      const transitions = update(e, options);
      return {
        type : GET_USER_PROFILE_SUCCESS,
        property : e.name,
        animatable : options,
        tweens : transitions,
        duration : transitions[transitions.length - 1].end,
        delay : transitions[0].delay
      };
    }
  }
  function handle(p, ds) {
    return setTimeout(filter(p.map((password) => {
      return ds.map((children) => {
        return clean(password, children);
      });
    })), (t) => {
      return !_this.und(t);
    });
  }
  function validate(interval, args, config, data) {
    const isStemUp = "delay" === interval;
    return args.length ? (isStemUp ? Math.min : Math.max).apply(Math, args.map((xdriller) => {
      return xdriller[interval];
    })) : isStemUp ? data.delay : config.offset + data.delay + data.duration;
  }
  function notify(t) {
    const name = add(instrNode, t);
    const day = add(top, t);
    const op = each(t.targets);
    const d2 = handle(op, set(name, day, t));
    return callback(name, {
      children : [],
      animatables : op,
      animations : d2,
      duration : validate("duration", d2, name, day),
      delay : validate("delay", d2, name, day)
    });
  }
  function init(prop = {}) {
    function group() {
      return window.Promise && new Promise((b) => {
        return view = b;
      });
    }
    function put() {
      self.reversed = !self.reversed;
    }
    function callback(val) {
      return self.reversed ? self.duration - val : val;
    }
    function set(key) {
      const tweens = self.children;
      const pixCount = tweens.length;
      if (key >= self.currentTime) {
        for (let i = 0; i < pixCount; i++) {
          tweens[i].seek(key);
        }
      } else {
        for (let i = pixCount; i--;) {
          tweens[i].seek(key);
        }
      }
    }
    function render(time) {
      let i = 0;
      let rowSet = {};
      const onCompleteBindings = self.animations;
      const cell_amount = onCompleteBindings.length;
      for (; i < cell_amount;) {
        const handler = onCompleteBindings[i];
        const e = handler.animatable;
        const dispatchRules = handler.tweens;
        const indexLookupKey = dispatchRules.length - 1;
        let options = dispatchRules[indexLookupKey];
        if (indexLookupKey) {
          options = setTimeout(dispatchRules, (event) => {
            return time < event.end;
          })[0] || options;
        }
        const t = log(time - options.start - options.delay, 0, options.duration) / options.duration;
        const progress = isNaN(t) ? 1 : options.easing(t, options.elasticity);
        const cellL = options.to.strings;
        const xFactor = options.round;
        let value;
        let h = [];
        const pixCount = options.to.numbers.length;
        for (let i = 0; i < pixCount; i++) {
          let x;
          const endAngle = options.to.numbers[i];
          const startAngle = options.from.numbers[i];
          x = options.isPath ? render(options.value, progress * endAngle) : startAngle + progress * (endAngle - startAngle);
          if (xFactor) {
            if (!(options.isColor && i > 2)) {
              x = Math.round(x * xFactor) / xFactor;
            }
          }
          h.push(x);
        }
        const rows_new = cellL.length;
        if (rows_new) {
          value = cellL[0];
          for (let i = 0; i < rows_new; i++) {
            cellL[i];
            const url = cellL[i + 1];
            const origin = h[i];
            if (!isNaN(origin)) {
              value = value + (url ? origin + url : origin + " ");
            }
          }
        } else {
          value = h[0];
        }
        events[handler.type](e.target, handler.property, value, rowSet, e.id);
        handler.currentValue = value;
        i++;
      }
      const rown = Object.keys(rowSet).length;
      if (rown) {
        for (let j = 0; j < rown; j++) {
          if (!type) {
            const b = "transform";
            type = check(document.body, b) ? b : `-webkit-${b}`;
          }
          self.animatables[j].target.style[type] = rowSet[j].join(" ");
        }
      }
      self.currentTime = time;
      self.progress = time / self.duration * 100;
    }
    function $(name) {
      if (self[name]) {
        self[name](self);
      }
    }
    function pause() {
      if (self.remaining && true !== self.remaining) {
        self.remaining--;
      }
    }
    function next(time) {
      const end = self.duration;
      const start = self.offset;
      const scaledMargin = start + self.delay;
      const idx = self.currentTime;
      const b = self.reversed;
      const i = callback(time);
      if (self.children.length) {
        set(i);
      }
      if (i >= scaledMargin || !end) {
        if (!self.began) {
          self.began = true;
          $("begin");
        }
        $("run");
      }
      if (i > start && i < end) {
        render(i);
      } else {
        if (i <= start && 0 !== idx) {
          render(0);
          if (b) {
            pause();
          }
        }
        if (i >= end && idx !== end || !end) {
          render(end);
          if (!b) {
            pause();
          }
        }
      }
      $("update");
      if (time >= end) {
        if (self.remaining) {
          distance = i;
          if ("alternate" === self.direction) {
            put();
          }
        } else {
          self.pause();
          if (!self.completed) {
            self.completed = true;
            $("complete");
            if ("Promise" in window) {
              view();
              finished = group();
            }
          }
        }
        pby = 0;
      }
    }
    let i;
    let distance;
    let pby = 0;
    let view = null;
    let finished = group();
    let self = notify(prop);
    return self.reset = function() {
      const undefined = self.direction;
      const name = self.loop;
      self.currentTime = 0;
      self.progress = 0;
      self.paused = true;
      self.began = false;
      self.completed = false;
      self.reversed = "reverse" === undefined;
      self.remaining = "alternate" === undefined && 1 === name ? 2 : name;
      render(0);
      for (let i = self.children.length; i--;) {
        self.children[i].reset();
      }
    }, self.tick = function(now) {
      i = now;
      if (!distance) {
        distance = i;
      }
      next((pby + i - distance) * init.speed);
    }, self.seek = function(data) {
      next(callback(data));
    }, self.pause = function() {
      const firstObjInGroup = group.indexOf(self);
      if (firstObjInGroup > -1) {
        group.splice(firstObjInGroup, 1);
      }
      self.paused = true;
    }, self.play = function() {
      if (self.paused) {
        self.paused = false;
        distance = 0;
        pby = callback(self.currentTime);
        group.push(self);
        if (!timer) {
          allVideoIdsReady();
        }
      }
    }, self.reverse = function() {
      put();
      distance = 0;
      pby = callback(self.currentTime);
    }, self.restart = function() {
      self.pause();
      self.reset();
      self.play();
    }, self.finished = finished, self.reset(), self.autoplay && self.play(), self;
  }
  const instrNode = {
    update : void 0,
    begin : void 0,
    run : void 0,
    complete : void 0,
    loop : 1,
    direction : "normal",
    autoplay : true,
    offset : 0
  };
  const top = {
    duration : 1e3,
    delay : 0,
    easing : "easeOutElastic",
    elasticity : 500,
    round : 0
  };
  const name = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skewX", "skewY", "perspective"];
  let type;
  const _this = {
    arr : (obj) => {
      return Array.isArray(obj);
    },
    obj : (name) => {
      return get(Object.prototype.toString.call(name), "Object");
    },
    pth : (num) => {
      return _this.obj(num) && num.hasOwnProperty("totalLength");
    },
    svg : (parent) => {
      return parent instanceof SVGElement;
    },
    dom : (options) => {
      return options.nodeType || _this.svg(options);
    },
    str : (val) => {
      return "string" == typeof val;
    },
    fnc : (value) => {
      return "function" == typeof value;
    },
    und : (s) => {
      return void 0 === s;
    },
    hex : (string) => {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(string);
    },
    rgb : (string) => {
      return /^rgb/.test(string);
    },
    hsl : (string) => {
      return /^hsl/.test(string);
    },
    col : (value) => {
      return _this.hex(value) || _this.rgb(value) || _this.hsl(value);
    }
  };
  const item = (() => {
    function compare(n, elem) {
      return 1 - 3 * elem + 3 * n;
    }
    function r(b, a) {
      return 3 * a - 6 * b;
    }
    function write(o) {
      return 3 * o;
    }
    function cb(f, a, b) {
      return ((compare(a, b) * f + r(a, b)) * f + write(a)) * f;
    }
    function i(t, e, a) {
      return 3 * compare(e, a) * t * t + 2 * r(e, a) * t + write(e);
    }
    function get(p, x, n, a, b) {
      let num;
      let s;
      let u = 0;
      do {
        if ((num = cb(s = x + (n - x) / 2, a, b) - p) > 0) {
          n = s;
        } else {
          x = s;
        }
      } while (Math.abs(num) > 1e-7 && ++u < 10);
      return s;
    }
    function f(y, t, h, n) {
      for (let o = 0; o < 4; ++o) {
        const s = i(t, h, n);
        if (0 === s) {
          return t;
        }
        t = t - (cb(t, h, n) - y) / s;
      }
      return t;
    }
    const pixCount = 11;
    const b = 1 / (pixCount - 1);
    return function(c, name, n, value) {
      function f(value) {
        let a = 0;
        let index = 1;
        const undefined = pixCount - 1;
        for (; index !== undefined && data[index] <= value; ++index) {
          a = a + b;
        }
        const t = a + (value - data[--index]) / (data[index + 1] - data[index]) * b;
        const number = i(t, c, n);
        return number >= .001 ? f(value, t, c, n) : 0 === number ? t : get(value, a, a + b, c, n);
      }
      if (!(0 <= c && c <= 1 && 0 <= n && n <= 1)) {
        return;
      }
      let data = new Float32Array(pixCount);
      if (c !== name || n !== value) {
        for (let i = 0; i < pixCount; ++i) {
          data[i] = cb(i * b, c, n);
        }
      }
      return (type) => {
        return c === name && n === value ? type : 0 === type ? 0 : 1 === type ? 1 : cb(f(type), name, value);
      };
    };
  })();
  const easings = (() => {
    function f(token, i) {
      return 0 === token || 1 === token ? token : -Math.pow(2, 10 * (token - 1)) * Math.sin((token - 1 - i / (2 * Math.PI) * Math.asin(1)) * (2 * Math.PI) / i);
    }
    const nullChars = ["Quad", "Cubic", "Quart", "Quint", "Sine", "Expo", "Circ", "Back", "Elastic"];
    const plugins = {
      In : [[.55, .085, .68, .53], [.55, .055, .675, .19], [.895, .03, .685, .22], [.755, .05, .855, .06], [.47, 0, .745, .715], [.95, .05, .795, .035], [.6, .04, .98, .335], [.6, -.28, .735, .045], f],
      Out : [[.25, .46, .45, .94], [.215, .61, .355, 1], [.165, .84, .44, 1], [.23, 1, .32, 1], [.39, .575, .565, 1], [.19, 1, .22, 1], [.075, .82, .165, 1], [.175, .885, .32, 1.275], (precision, item_index) => {
        return 1 - f(1 - precision, item_index);
      }],
      InOut : [[.455, .03, .515, .955], [.645, .045, .355, 1], [.77, 0, .175, 1], [.86, 0, .07, 1], [.445, .05, .55, .95], [1, 0, 0, 1], [.785, .135, .15, .86], [.68, -.55, .265, 1.55], (value, item_index) => {
        return value < .5 ? f(2 * value, item_index) / 2 : 1 - f(-2 * value + 2, item_index) / 2;
      }]
    };
    let $union = {
      linear : item(.25, .25, .75, .75)
    };
    for (let name in plugins) {
      plugins[name].forEach((values, index) => {
        $union["ease" + name + nullChars[index]] = _this.fnc(values) ? values : item.apply(this, values);
      });
    }
    return $union;
  })();
  const events = {
    css : (elem, name, value) => {
      return elem.style[name] = value;
    },
    attribute : (_element, event, _value) => {
      return _element.setAttribute(event, _value);
    },
    object : (obj, sourcePropKey, sourcePropVal) => {
      return obj[sourcePropKey] = sourcePropVal;
    },
    transform : (plugins, p, n, t, term) => {
      if (!t[term]) {
        t[term] = [];
      }
      t[term].push(`${p}(${n})`);
    }
  };
  let group = [];
  let timer = 0;
  const allVideoIdsReady = (() => {
    function b() {
      timer = requestAnimationFrame(render);
    }
    function render(now) {
      const cell_amount = group.length;
      if (cell_amount) {
        let i = 0;
        for (; i < cell_amount;) {
          if (group[i]) {
            group[i].tick(now);
          }
          i++;
        }
        b();
      } else {
        cancelAnimationFrame(timer);
        timer = 0;
      }
    }
    return b;
  })();
  return init.version = "2.2.0", init.speed = 1, init.running = group, init.remove = function(to) {
    const focusedWishElement = write(to);
    for (let l = group.length; l--;) {
      const model = group[l];
      const idPage = model.animations;
      for (let i = idPage.length; i--;) {
        if (has(focusedWishElement, idPage[i].animatable.target)) {
          idPage.splice(i, 1);
          if (!idPage.length) {
            model.pause();
          }
        }
      }
    }
  }, init.getValue = parse, init.path = function(value, id1) {
    const rect = _this.str(value) ? $(value)[0] : value;
    const size = id1 || 100;
    return function(p) {
      return {
        el : rect,
        property : p,
        totalLength : factory(rect) * (size / 100)
      };
    };
  }, init.setDashoffset = function(el) {
    const styleElId = factory(el);
    return el.setAttribute("stroke-dasharray", styleElId), styleElId;
  }, init.bezier = item, init.easings = easings, init.timeline = function(options) {
    let self = init(options);
    return self.pause(), self.duration = 0, self.add = function(r) {
      return self.children.forEach((self) => {
        self.began = true;
        self.completed = true;
      }), require(r).forEach((r) => {
        let params = callback(r, add(top, options || {}));
        params.targets = params.targets || options.targets;
        const n = self.duration;
        const s = params.offset;
        params.autoplay = false;
        params.direction = self.direction;
        params.offset = _this.und(s) ? n : wrap(s, n);
        self.began = true;
        self.completed = true;
        self.seek(params.offset);
        const results = init(params);
        results.began = true;
        results.completed = true;
        if (results.duration > n) {
          self.duration = results.duration;
        }
        self.children.push(results);
      }), self.seek(0), self.reset(), self.autoplay && self.restart(), self;
    }, self;
  }, init.random = (intervalLow, intervalHigh) => {
    return Math.floor(Math.random() * (intervalHigh - intervalLow + 1)) + intervalLow;
  }, init;
});
var _0x131a = ["addr", "clearSkins", "serverClosed", "appendSkins", "addMessage", "skin", "playerspawn", "playerspectate", "playerdeath", "input", "psk", "password", "roomKey", "blur", "ACTK", '<div class="b-chat-input-form"><div class="smiles-preview"></div><input class="chat-input-message" placeholder="..."></div>', ".b-chat-input-form", ".smiles-preview", ".chat-input-message", "closeChatWindow", "fillPreview", "data-tag", "insertTag", "openchat", "openChatWindow", "sendchat", "chat", "concat", 
"closechat", '<div class="b-description">', "serverDisonnected", '</div></div><div class="service-message server-opened"><div class="left-panel"><div class="b-icon-svg b-icon-robot"></div></div><div class="right-panel">', '</div></div></div><div id="chat-message-area"></div></div>', ".chat-window", "#service-message-area", "#chat-message-area", ".server-opened", ".need-update", "stopImmediatePropagation", "player", "scaleRatio", "getSelectedTheme", "rgba(128,139,142,0.7)", "deepskyblue", "rgba(232,242,244,0.9)", 
"rgba(0,0,0, 0.4)", "strokeStyle", "strokeRect", "tempX", "tempY", "rgb(255, 193, 7)", "#664c04", "moveTo", "#90ee90", "deadX", "deadY", ":party", "input#nick", "#settings select[id]", "getState", "rgba(32,34,39,0.8)", "rgba(218,227,230,0.8)", "map", "/emblem/gca_clan-min.png", "/emblem/ec_clan.jpg", "/emblem/ind_clan-min.png", "/emblem/baseball-head.png", "/emblem/vs-rf.png", "/emblem/gagarin.png", "/emblem/cinco-de-mayo-web.png", "/emblem/9-may-girl.jpg", "imgURL", "sectorColor", "globalAlpha", 
"globalCompositeOperation", "copy", "bgColor", "offsetX", "offsetY", "rect", "stroke", "getDate", "borderColor", "isSettingEnabled", "showSectors", "#4e535f", "#9eb5bd", "#f4fff2", "#3999e6", "#7d22d8", "#d62222", "mousemove", "clientX", "clientY", "showHints", "butt", "miter", "onerror", "stats", "$1\u2009", "arcTo", "inGame", "num", "#4dd679", "highestMass", "  \u2044  ", "#282c35", "#4b5363", "#ffd700", "#cbcfd8", "tab", "/iconset.png", "foregroundDrawCallbacks", "hotkey-", "hotkeys", "\u0412\u044b\u0441\u0442\u0440\u0435\u043b \u043c\u0430\u0441\u0441\u043e\u0439", 
"\u041c\u0430\u043a\u0440\u043e-\u0432\u044b\u0441\u0442\u0440\u0435\u043b", "\u0414\u0432\u043e\u0439\u043d\u043e\u0435 \u0434\u0435\u043b\u0435\u043d\u0438\u0435", "\u041e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430", "\u041f\u043e\u043a\u0430\u0437 \u0441\u0435\u043a\u0442\u043e\u0440\u043e\u0432 (4 \u0432 1)", "\u041a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 TOP-10", "\u0414\u0435\u043b\u0435\u043d\u0438\u0435 \u043d\u0430 16 \u0447\u0430\u0441\u0442\u0435\u0439", "\u0423\u043f\u0440\u043e\u0449\u0451\u043d\u043d\u043e\u0435 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435", 
"\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435", "\u041b\u0438\u043c\u0438\u0442 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439", "\u0421\u043a\u0440\u044b\u0432\u0430\u0442\u044c \u0447\u0430\u0442 \u0447\u0435\u0440\u0435\u0437 (n) \u0441\u0435\u043a\u0443\u043d\u0434", "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0439 \u0448\u0440\u0438\u0444\u0442", "Macro eject mass", "Double split", "Pause", "Show hints", "The split into 16 pieces", "Simplified draw", 
"Hide chat through (n) seconds", "Font used", "Macro \u00e7\u0131karma kitle", "\u00c7ift b\u00f6lme", "\u0130pu\u00e7lar\u0131n\u0131 g\u00f6ster", "16 par\u00e7aya b\u00f6l\u00fcnd\u00fc.", "Sohbet (n) saniye boyunca gizle", "Kullan\u0131lan yaz\u0131 tipi", "Macro espulsione massa", "Doppia Split", "Pausa", "Copia Leaderboard", "Mostra suggerimenti", "La divisione in 16 pezzi", "Tiraggio semplificato", "Tasti", "Impostazioni", "Nascondi chat (n) secondi", "Carattere utilizzato", "Schnelles schuss mit Masse", 
"Zweichfache splitt", "Stop", "Anzeige der sektoren (4 in 1)", "Tips", "Die Aufteilung in 16 St\u00fccke", "Vereinfachte anzeige", "Einstellungen", "Message-Limit", "Chat durch (n) Sekunden ausblenden", "Verwendete Schriftart", "charRepresentation", "key", "#tab-hotkeys", '<div class="form-group" id="', 'container"></div>', "div#", "container", "dontShow", '<label for="', "</label>", "documentElement", "clientWidth", "clientHeight", "resize", "quality", "removeItem", "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u0441\u0432\u043e\u0435\u0433\u043e \u0441\u043a\u0438\u043d\u0430", 
"\u041b\u043e\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u043a\u0438\u043d", "\u0423\u0431\u0440\u0430\u0442\u044c", "\u0412\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0441\u044e\u0434\u0430 \u0441\u0441\u044b\u043b\u043a\u0443 \u043d\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435...", "Set custom skin", "Local skin", "Apply", "Remove", "Insert image link here...", "\u00d6zel bir kaplama ayarla", "Yerel cilt", "Uygula", "Kald\u0131r", "G\u00f6r\u00fcnt\u00fc ba\u011flant\u0131s\u0131 burada ekle...", 
"Configurar la piel personalizada", "Quitar", "Insertar enlace de imagen aqu\u00ed...", "Imposta skin personalizzata", "Applicare", "Rimuovere", "Festlegen benutzerdefinierter Skin", "Lokale Haut", "Gelten", "Entfernen", "Bild link hier einf\u00fcgen...", "Peau locale", "Appliquer", "charAt", "/skins/", "#c1c1c1", "solid", "backgroundImage", "borderStyle", "span", "unload", "action", "APPLY", "CLEAR", "SHOW", "show-skin-input", '<div id="skinCustomButton">', '<div class="local-skin cur-pointer" data-action="show"><span>', 
"localSkin", '<div id="skinFormInput"><div class="caption">', "<span>", "setCustomSkin", "</span>", '<span class="glyphicon glyphicon-remove cur-pointer" data-action="close"></span></div><div style="padding: 8px 4px"><div class="skin-collection"></div>', '<input type="text" class="form-control" onfocus="this.select();" placeholder="', "placeholder", "</button>", "#skinFormInput", 'button[data-action="apply"]', ".local-skin", "onShopLoaded", ".skin-collection", "shopItems", "shopItemsList", "get_owned", 
"get_title", "cloneNode", "scrollLeft", "children", "offsetLeft", "offsetWidth", "scrollWidth", "animDeltaX", "deltaY", "anime", "easeInOutQuad", "scroll", "qUWcM2qypxMlMJIQo2yhpj==", "D29lMD==", "qKAypt==", "loggedIn", "MaWyMHAinJ5HnJ1yGTIzqN==", "radio", "http://icecastlb.pulsradio.com/pulsHD.mp3", "current", "selected", "controls", "autoplay", "preload", ' style="display: none"', '><div class="rd-song-title"></div><div class="pulse-radio"><div class="pulse-radio-play"></div><input class="pulse-radio-volume" type="range" min="0" max="100" step="1" value="', 
'"></div></div>', ".pulse-radio-volume", ".rd-song-title", "class", "pulse-radio-play", "metadata", "currentTime", "pulse-radio-pause", "CURRENTLISTENERS", "PEAKLISTENERS", "MAXLISTENERS", "UNIQUELISTENERS", "BITRATE", "SONGTITLE", "valueAsNumber", "onended", "onstalled", "oncanplay", "onabort", "onemptied", "oninvalid", "onratechange", "onsuspend", "onseeked", "https://cors-anywhere.herokuapp.com/", "/7.html", "timeout", "sendNick", "nullCoords", "cleanAddr", "party_id", "data:image/svg+xml;base64,", 
"btoa", "copyLeaderboard", "textarea", "copyleaderboard", "execCommand", "UTF8ToString", "setTarget", "onpause", "onAgarioCoreReload", "shadowColor", "#222", "shadowBlur", "rgb(240,240,240)", "fillRect", "playerZoom", "log", "\u041f\u0440\u0438\u0433\u043e\u0442\u043e\u0432\u044c\u0441\u044f", "\u0422\u0440\u0438\u043a-\u0442\u0440\u0438\u043a-\u0442\u0440\u0438\u043a", "\u0412\u0430\u043b\u0438\u043c", "\u0423\u0445\u043e\u0434\u0438\u043c", "\u0412\u043b\u0438\u0432\u0430\u0439 \u0440\u0435\u0449\u0435", 
"\u0411\u044b\u0441\u0442\u0440\u043e \u0432\u043b\u0435\u0439 \u043c\u043d\u0435", "Be ready", "Jump", "Go trick", "Back", "All mass fast", "Give me the mass", "Go center", "className", "macroFeed", "feed", "toggleSectors", "splitTo16", "doubleSplit", "optFeedMouse", "button", "toDateString", "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=", '<div class="b-list-allies" v-show="canShow" @wheel.stop="" style="display: none"><div><span class="badge">{{ list.length }}</span></div><div><div class="b-ae-player" :data-state="item.state" :data-summary="item.summary" @click="onClick(item)" v-for="item in list"><div class="circle bordered ae-player-skin" :data-spine="item.skin.spine" :style="{backgroundImage: item.skin.src }"></div><div>{{ item.nick }}</div></div></div></div>', 
'<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="m22 0c0 16.9-9.1 32-22 32 12.9 0 22 15.1 22 32 0-16.9 9.1-32 22-32-12.9 0-22-15.1-22-32" fill="#ffcc33"/><path d="m53 0c0 8.4-4.6 16-11 16 6.4 0 11 7.6 11 16 0-8.4 4.6-16 11-16-6.4 0-11-7.6-11-16" fill="#33ccff"/><path d="m48 32c0 8.4-4.6 16-11 16 6.4 0 11 7.6 11 16 0-8.4 4.6-16 11-16-6.4 0-11-7.6-11-16" fill="#ff33cc"/></svg>', "//imaster.space/agar.io/imgs", "function", "add", "isFunction", "unshift", "push", "remove", "indexOf", 
"length", "clear", "totalListeners", "keys", "_default", "emit", "get", "normal", "run", "once", "bind", "addEx", "Options", "getOwnPropertyDescriptor", "__wrap__", "undefined", "\u041e\u0431\u044a\u0435\u043a\u0442 \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u0444\u0443\u043d\u043a\u0446\u0438\u0435\u0439 \u0438\u043b\u0438 undefined", "override", "_value", "call", "_listeners", "_obj", "_prop", "_options", "_setter", "prototype", "create", "_getter", "set", "defineProperty", 
"off", "max", "min", "lastAccess", "now", "_id", "createElement", "img", "_url", "src", "ready", "assign", "_UTF8ArrayToString", ".png", "getConfigUrl", "lastIndexOf", "onload", "apply", "getUTCDate", "getUTCMonth", "[?&]", "=([^&]*)", "exec", "replace", "charCodeAt", "options", "gameMode", "setGameMode", "toLowerCase", "region", "setRegion", "core", "disconnect", "wss://", "toStronger32", "preventExtensions", "enum", "size", "hash", "maxCell", "color", "count", "language", "substr", "fonts", "load", 
"then", "userAgent", " Vivaldi/", "Function", "touch", "have", '"this" is null or not defined', "safeParse", "parse", "fromCharCode", "constructor", "'))(", "[0])", "type", "isArray", "keyup", "mousedown", "mouseup", "wheel", "change", "forEach", "addEventListener", "Vue", "shift", "body", "insertAdjacentHTML", "UIReady", "loginComplete", "agarApp", "home", "_isMounted", "API", "getUserInfo", "inside", "Core", "$children", "toString", "login", "OUT", "$watch", "gameState", "isHome", "UIToggle", "UIHidden", 
"gameOver", "spectate", "\u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435", "General", "Hotkeys", "Genel", "K\u0131sayol tu\u015flar\u0131", "Basic", "Management", "div", "afterbegin", "homeTab", '<li role="presentation"><a href="#tab-hotkeys" aria-controls="tab-hotkeys" role="tab" data-toggle="tab">', "hotkeysTab", "</ul>", "SpineAnimation", "render", "pause", "querySelector", "#canvas", "classList", "clear-canvas", "#playnick", "parentNode", "insertBefore", "nextSibling", "moved", "firstChild", 
"dataset", "true", "#socialButtons", "beforebegin", "toUTCString", ")</div>", "account", "gplus", "googleRelogin", "relogin", "darkTheme", "skinId", "models", "shopSkinsModel", "defaultSkin", "gamePlayInfo", "image", "source", "productIdToQuantify", "spineFileName", "spine", "getItemById", "getSpineAnimations", "_hi.png", "get_cellColor", "slice", "vanilla", "dispatchEvent", "services", "config", "skinList", "shopSkinTabs", "MYSTERY", "VETERAN", "PREMIUM", "tabDescription", "skinType", "toUpperCase", 
"isOfferable", "price", "getBouncerRequestMessage", "getMessageDataBytes", "makeMasterRequest", "v4/findServer", "invalid_client", "status", "showOutdatedClientDialog", "0.0.0.0:0", "endpoints", "http", "LJqupzyiYz1iMUIfMF5mnT9jYaMcMKphH2uipSAenJ5mIzyyqj==", "M2I0H2gcoyOuL2gm", "registerListener", "getSupportLanguage", "ru_texts", "M2I0K2I2MJ50pj==", "LJExEKMyoaEZnKA0MJ5ypt==", "IKAypxI2MJ50BwcIH0IFK0kCE0qSEN==", "user", "getItem", "DHAHFj==", "setValue", "onReady", "addOnce", "LJqupzyiYaAyL3IlnKE5YxS1qTuyoaEcL2S0nJ9hH2IlqzywMD==", 
"environment", "Google", "open", "GET", "ontimeout", "responseType", "send", "o2SeqUWyMF5yrUDhp2IlqzywMKZhH2IlqzywMH1uozSaMKV=", "getService", "sendGoogleAnalyticsEvent", "sendGoliathAnalytics", "network", "set_connecting", "set_connected", "disconnectDialog", "close", "onDisconnect", "get_host", "connecting", "isPlayerAlive", "getUserAuthResponse", "_manager", "state", "getOwnPropertyNames", "_settings", "settings", "onUserDataUpdate", "socialId", "noColors", "lastNick", "showMass", "showQuest", 
"showOnlineStatus", "matches", "isUserLoggedIn", "registerCallback", "sendSpectate", "#nick", "get_currentConfig", "lastRequest", "token", "set_partyToken", "_host", "connect", "setItem", "getContext", "onAgarioLoaded", "asmjsHelper", "setOption", "\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u043d\u044b\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438", "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0447\u0430\u0442\u0430", "\u041f\u043b\u0430\u0432\u043d\u0430\u044f \u0430\u043d\u0438\u043c\u0430\u0446\u0438\u044f \u043a\u043b\u0435\u0442\u043e\u043a", 
"\u0421\u0433\u043b\u0430\u0436\u0438\u0432\u0430\u043d\u0438\u0435 \u0433\u0440\u0430\u0444\u0438\u043a\u0438", "\u0424\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u044b\u0439 \u0437\u0443\u043c", "\u0418\u043d\u0434\u0438\u043a\u0430\u0442\u043e\u0440 \u043d\u0430\u0434 \u0441\u043e\u044e\u0437\u043d\u0438\u043a\u0430\u043c\u0438", "\u041c\u0438\u043d\u0438\u043a\u0430\u0440\u0442\u0430", "\u0421\u0442\u0440\u0435\u043b\u044f\u0442\u044c \u043c\u044b\u0448\u043a\u043e\u0439", "\u0414\u0435\u043b\u0438\u0442\u0441\u044f \u043c\u044b\u0448\u043a\u043e\u0439", 
"\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0432\u0440\u0435\u043c\u044f", "\u0422\u0440\u0435\u043d\u0434 \u0441\u0435\u0437\u043e\u043d\u0430", "\u042d\u043b\u0435\u043c\u0435\u043d\u0442 \u0434\u0435\u043a\u043e\u0440\u0430, \u0447\u0430\u0441\u0442\u044c \u00ab\u0448\u0430\u0440\u043c\u0430\u00bb \u0438\u0433\u0440\u044b", "\u0423\u0441\u0442\u0440\u0430\u043d\u044f\u0435\u0442 \u043c\u0435\u0440\u0446\u0430\u043d\u0438\u0435 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f \u0437\u0430 \u0441\u0447\u0451\u0442 \u043d\u0435\u0431\u043e\u043b\u044c\u0448\u043e\u0433\u043e \u0440\u0430\u0437\u043c\u044b\u0442\u0438\u044f", 
"\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442 \u0432\u0435\u043a\u0442\u043e\u0440 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u044f \u0432\u044b\u0441\u0442\u0440\u0435\u043b\u043e\u0432.\n\u041e\u0431\u043b\u0435\u0433\u0447\u0430\u0435\u0442 \u043f\u0440\u0438\u0446\u0435\u043b\u0438\u0432\u0430\u043d\u0438\u0435 \u043f\u0440\u0438 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0438 \u0431\u043e\u043b\u044c\u0448\u0438\u043c \u0447\u0438\u0441\u043b\u043e\u043c \u0448\u0430\u0440\u043e\u0432.", 
"\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u0435\u0442\u0441\u044f \u043e\u0442\u043a\u043b\u044e\u0447\u0430\u0442\u044c \u043d\u0430 \u0441\u043b\u0430\u0431\u044b\u0445 \u043a\u043e\u043c\u043f\u044c\u044e\u0442\u0435\u0440\u0430\u0445", "\u041e\u0442\u043a\u043b\u044e\u0447\u0430\u0435\u0442 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u0437\u0443\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u0440\u0438 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0438 \u043c\u0430\u0441\u0441\u044b \u043a\u043b\u0435\u0442\u043e\u043a", 
"Advanced settings", "Chat settings", "Grid", "Dots of the same color", "Dots color", "Animation", "Smooth animation of the cells", "Fixed zoom", "Cursor tracking", "Allied indicators", "Minimap", "Shoot with the mouse", "Split the mouse", "Show clock", "Message limit", "Hide in .. seconds", "Roboto font", "Ubuntu font", "The trend of the season :)", "Fixes image flicker due to the slight blur", "Shows the motion vector of the shots.\nFacilitates aiming when managing a large number of balls.", "Can add a ~4 fps", 
"Disables automatic zooming when the cell mass changes", "The animation makes the game look nicer, but requires more computations.\nDisabling animations can add a few fps.", "vexMenu", "#v-ex-menu", "toggle-grid", "grid", "descGrid", "toggle-food", "foodMonoColor", "descFoodMonoColor", "#ff0751", "optDotsColor", "optAnimationOn", "descAnimation", "optSmoothAnimation", "smoothAnimation", "descSmoothAnimation", "toggle-smgr", "smoothGraphic", "descSmoothGraphic", "toggle-fxzo", "optAutozoomOff", "fixedZoom", 
"descFixedZoom", "toggle-crtr", "optCursorTracking", "cursorTracking", "descCursorTracking", "optShowIndicators", "descShowIndicators", "toggle-mnmp", "optShowMinimap", "minimap", "toggle-fdms", "feedMouse", "optSplitMouse", "splitMouse", "input-msglim", "chatHistoryLimit", "messageLimit", "input-chtimo", "chatHideTimeout", "hideChat", "Roboto Condensed", "keydown", "tagName", "onClickEar", "preventDefault", "firstStart", "toggle-anim", "massDisable", "toggle-dotc", "upload", "disabled", "chatOptions", 
"order", "alias", "value", "font", "setFont", "selectedFont", "save", "getOptionById", "onChange", "stringify", "nJ5mnJEy", "nJLtXUEbnKZhK2yhp2yxMFxtpzI0qKWhVUEbnKZhK2yhp2yxMGftqUW5VUftpzI0qKWhVPu0nTymYy9coaAcMTHtCFO3nJ5xo3phqzShnJkfLF5coaAcMTHcVU0tL2S0L2ttXTHcVUftsD==", "nJLtXUEbnKZhK0AipzHcVUWyqUIlovO0nTymYy9Qo3WyBlO0paxtrlOlMKE1pz4tXUEbnKZhK0AipzHtCFO3nJ5xo3phqzShnJkfLF5coaAcMTHhD29lMFxtsFOwLKEwnPNbMFxtrlO9", "nJLtXUEbnKZhK3ImMKVcVUWyqUIlovO0nTymYy91p2IlBlO0paxtrlOlMKE1pz4tXUEbnKZhK3ImMKVtCFO3nJ5xo3phqzShnJkfLF5coaAcMTHhD29lMF51p2IlXFO9VTAuqTAbVPuyXFO7VU0=", 
"ON_GET", "onGet", "ON_SET", "onSet", "_isWrapped", "smartOff", "onceSet", "listenerCount", "eject", "split", "onLoad", "onAgarioCoreLoaded", "width", "overview", "height", "fixed", "changeMapMetric", "Y1changed", "fixCoords", "#33ff33", "SPACE", "SHIFT", "px Roboto Condensed", "px ", "module", "drawImage", "getImageData", "data", "000000", "cellColor", "frame_1", "frame_2", "frames", "setStrokeColor", "?_=", "crossOrigin", "Anonymous", "scale_setting", "foodEaten", "timeAlive", "cellsEaten", "topPosition", 
"virusesEaten", "playerBestMass", "playerMass", "gContexts", "green", "\u0423\u0445\u043e\u0434\u0438\u0442\u0435 \u0432 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u0443\u044e \u043e\u0431\u043b\u0430\u0441\u0442\u044c!", "\u0411\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c \u0443\u043c\u0435\u043d\u044c\u0448\u0438\u0442\u0441\u044f \u0437\u0430 %t", "\u0416\u0438\u0432\u044b\u0445 \u0438\u0433\u0440\u043e\u043a\u043e\u0432: ", "\u0418\u0433\u0440\u043e\u043a\u043e\u0432 \u0433\u043e\u0442\u043e\u0432\u043e: ", 
"\u0411\u0438\u0442\u0432\u0430 \u043d\u0430\u0447\u043d\u0451\u0442\u0441\u044f \u0432: %t", "\u0412\u044b\u0436\u0438\u0432\u0430\u0439\u0442\u0435 \u0434\u043e \u043f\u043e\u0431\u0435\u0434\u044b, \u043e\u0441\u0442\u0430\u0432\u0430\u044f\u0441\u044c \u0432\u043d\u0443\u0442\u0440\u0438 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438!", "\u041f\u043e\u0432\u0435\u0437\u0451\u0442 \u0432 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u0440\u0430\u0437!", 
"\u0418\u0433\u0440\u043e\u043a\u043e\u0432 \u0441\u044a\u0435\u0434\u0435\u043d\u043e:", "\u041d\u0430\u0438\u0431\u043e\u043b\u044c\u0448\u0430\u044f \u043c\u0430\u0441\u0441\u0430:", "\u041a\u043e\u043d\u0435\u0447\u043d\u0430\u044f \u043f\u043e\u0437\u0438\u0446\u0438\u044f:", "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0431\u0438\u0442\u0432\u044b", "\u041f\u043e\u0437\u0434\u0440\u0430\u0432\u043b\u044f\u0435\u043c! \u0412\u044b \u043f\u043e\u0431\u0435\u0434\u0438\u043b\u0438!", 
"\u0423\u0442\u0440\u043e\u0435\u043d\u043d\u044b\u0439 \u043e\u043f\u044b\u0442 \u043d\u0430 24 \u0447\u0430\u0441\u0430", "\u0425\u0430\u043b\u044f\u0432\u043d\u044b\u0435 \u043c\u043e\u043d\u0435\u0442\u043a\u0438", "      \u041f\u043e\u043a\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e", "\u0420\u0435\u0439\u0442\u0438\u043d\u0433", "\u0423\u0434\u0432\u043e\u0435\u043d\u043d\u0430\u044f \u043c\u0430\u0441\u0441\u0430 \u043d\u0430 24 \u0447\u0430\u0441\u0430", "\u0423\u0442\u0440\u043e\u0435\u043d\u043d\u0430\u044f \u043c\u0430\u0441\u0441\u0430 \u043d\u0430 1 \u0447\u0430\u0441", 
"\u0423\u0442\u0440\u043e\u0435\u043d\u043d\u0430\u044f \u043c\u0430\u0441\u0441\u0430 \u043d\u0430 24 \u0447\u0430\u0441\u0430", "\u0420\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a\u0438 Agar.io", "\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f\\n\u043f\u043e \u0445\u0430\u043b\u044f\u0432\u0435", "\u0417\u0430\u043b\u043e\u0433\u0438\u043d\u044c\u0442\u0435\u0441\u044c \u0438 \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u0435:", "\u0412\u0435\u0440\u043d\u0438\u0442\u0435\u0441\u044c \u0447\u0435\u0440\u0435\u0437", 
"\u0438 \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u0435:", "Free Coins\r\nTake Survey!", "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u043c\u0430\u0442\u0447\u0430:", "\u041d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e \u0433\u043e\u0441\u0442\u044f\u043c", "\u0411\u0415\u0421\u041f\u041b\u0410\u0422\u041d\u041e", "\u0418\u0433\u0440\u0430\u0442\u044c", "\u0420\u0435\u043a\u043e\u0440\u0434 \u0441\u044a\u0435\u0434\u0435\u043d\u043d\u044b\u0445 \u043a\u043b\u0435\u0442\u043e\u043a:", 
"\u0420\u0435\u043a\u043e\u0440\u0434\u043d\u044b\u0439 \u0441\u0447\u0435\u0442:", "C\u044b\u0433\u0440\u0430\u043d\u043d\u044b\u0445 \u0438\u0433\u0440:", "\u0420\u0435\u043a\u043e\u0440\u0434 \u0432\u044b\u0436\u0438\u0432\u0430\u043d\u0438\u044f:", "\u0420\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u043a\u043d\u043e\u043f\u043e\u043a", "\u043d\u0430 1 \u0447\u0430\u0441", "\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c", "\u0431\u043e\u043d\u0443\u0441", "%hours_value% \u0447\u0430\u0441\u043e\u0432", 
"\u041f\u0420\u0418\u041c\u0415\u041d\u0418\u0422\u042c", "\u0411\u043e\u043d\u0443\u0441\u043d\u0430\u044f \u0441\u0442\u0430\u0440\u0442\u043e\u0432\u0430\u044f \u043c\u0430\u0441\u0441\u0430!", "\u0421\u043e\u0445\u0440\u0430\u043d\u044f\u0439 \u0441\u0432\u043e\u0438 \u0434\u0430\u043d\u043d\u044b\u0435!", "\u0418\u0433\u0440\u0430\u0439 \u043d\u0430 \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u0438\u0445 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430\u0445!", "\u25cf \u0425\u0430\u043b\u044f\u0432\u043d\u044b\u0435 \u043c\u043e\u043d\u0435\u0442\u044b \u043a\u0430\u0436\u0434\u044b\u0439 \u0447\u0430\u0441!", 
"\u0412\u044b\u043f\u043e\u043b\u043d\u0438 \u0437\u0430\u0434\u0430\u043d\u0438\u0435, \u0438 \u043f\u043e\u043b\u0443\u0447\u0438 \u0441\u044e\u0440\u043f\u0440\u0438\u0437!", "\u0417\u0430\u0434\u0430\u043d\u0438\u044f", "\u041f\u043e\u0434\u0430\u0440\u043a\u0438", "\u0420\u0430\u0437\u044b\u0433\u0440\u0430\u043b\u0441\u044f \u0430\u043f\u043f\u0435\u0442\u0438\u0442? \u0417\u0430\u043c\u043e\u0440\u0438 \u0447\u0435\u0440\u0432\u044f\u0447\u043a\u0430 \u0432 Agar.io!", "\u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f", 
"\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c", "\u0413\u0440\u0430\u0444\u0438\u043a\u0430: \u0410\u0432\u0442\u043e", "\u0413\u0440\u0430\u0444\u0438\u043a\u0430: \u0412\u044b\u0441\u043e\u043a\u0430\u044f", "\u0413\u0440\u0430\u0444\u0438\u043a\u0430: \u041d\u0438\u0437\u043a\u0430\u044f", "\u0413\u0440\u0430\u0444\u0438\u043a\u0430: Retina", "\u0423\u043f\u0440\u0430\u0432\u043b\u044f\u0439\u0442\u0435 \u043a\u043b\u0435\u0442\u043a\u043e\u0439 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u044f\u043c\u0438 \u043c\u044b\u0448\u0438", 
"\u041d\u0430\u0436\u043c\u0438\u0442\u0435 <b>\u043f\u0440\u043e\u0431\u0435\u043b</b> \u0447\u0442\u043e\u0431\u044b \u0440\u0430\u0437\u0434\u0435\u043b\u0438\u0442\u0441\u044f", "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 <b>W</b> \u0447\u0442\u043e\u0431\u044b \u0432\u044b\u0441\u0442\u0440\u0435\u043b\u0438\u0442\u044c \u043c\u0430\u0441\u0441\u043e\u0439", "\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u0441\u044f", "\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435...", 
"\u041b\u0438\u0433\u0430 \u0421\u043f\u0440\u0443\u0442\u0430", "\u0421\u0442\u0440\u0430\u043d\u0430", "\u0422\u0430\u0431\u043b\u0438\u0446\u0430 \u043b\u0438\u0434\u0435\u0440\u043e\u0432", "\u0417\u0435\u043b\u044c\u044f", "\u0418\u0434\u0451\u0442 \u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435", "\u0417\u0430\u043b\u043e\u0433\u0438\u043d\u0438\u0442\u0441\u044f", "\u0412\u044b\u0445\u043e\u0434", "\u0412\u043e\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 Google", "\u0425\u0430\u043b\u044f\u0432\u0430", 
"\u0418\u0433\u0440\u0430 \u0441 \u0434\u0440\u0443\u0437\u044c\u044f\u043c\u0438 \u043d\u0430 \u043e\u0434\u043d\u043e\u0439 \u043a\u0430\u0440\u0442\u0435", "\u041f\u043e\u043b\u0438\u0442\u0438\u043a\u0430 \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u0438", "\u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u044f", "\u041a\u0438\u0442\u0430\u0439", "\u0415\u0432\u0440\u043e\u043f\u0430", "\u0421\u0435\u0432\u0435\u0440\u043d\u0430\u044f \u0410\u043c\u0435\u0440\u0438\u043a\u0430", 
"\u041e\u043a\u0435\u0430\u043d\u0438\u044f", "\u042e\u0436\u043d\u0430\u044f \u0410\u043c\u0435\u0440\u0438\u043a\u0430", "\u0422\u0443\u0440\u0446\u0438\u044f", "\u041d\u0430\u0431\u043b\u044e\u0434\u0430\u0442\u044c", "\u0423\u0441\u043b\u043e\u0432\u0438\u044f \u043e\u0431\u0441\u043b\u0443\u0436\u0438\u0432\u0430\u043d\u0438\u044f", "\u0421\u0451\u0440\u0444\u0435\u0440", "\u0427\u0451\u0440\u043d\u0430\u044f \u0411\u043e\u0440\u043e\u0434\u0430", "\u0427\u0451\u0440\u043d\u044b\u0439 \u043a\u043e\u0442", 
"\u0427\u0451\u0440\u043d\u0430\u044f \u0414\u044b\u0440\u0430", "\u041a\u0430\u0431\u0430\u043d", "\u0413\u0420\u0423", "\u0421\u043e\u0431\u0430\u043a\u0430", "\u0414\u043e\u0433\u0438", "\u041f\u043e\u043d\u0447\u0438\u043a", "\u041e\u0440\u0451\u043b", "\u0413\u0430\u043c\u043c\u0430", "\u041e\u043c\u0438\u043a\u0440\u043e\u043d", "\u0413\u0440\u0438\u043d\u043c\u044d\u043d", "\u041c\u0438\u043a\u043e", "\u0422\u043e\u043a\u043e", "\u0420\u0436\u0430\u0447", "\u0420\u0430\u0434\u0430\u0440", 
"\u0420\u0430\u0434\u0443\u0433\u0430", "\u0420\u0430\u043f\u0442\u043e\u0440 ", "\u0420\u0430\u043a\u0435\u0442\u0430", "\u0421\u043c\u0438\u0433", "\u041a\u043e\u0441\u043c\u043e\u043f\u0451\u0441", "\u0422\u0440\u043e\u043b\u043b\u044c", "\u0414\u0443\u0445 \u0432\u043e\u0434\u044b", "\u041f\u0443\u0441\u0442\u044b\u043d\u043d\u044b\u0439 \u041b\u0438\u0441", "\u0417\u043e\u043b\u043e\u0442\u0430\u044f \u043c\u043e\u043d\u0435\u0442\u043a\u0430", "\u0422\u0435\u0445\u043d\u043e\u043f\u0430\u0446\u0430\u043d", 
"\u041c\u043e\u0449\u043d\u044b\u0439 \u0431\u043e\u0435\u0446", "\u041f\u0438\u043a\u0441\u0435\u043b\u044c-\u043a\u043e\u043d\u0433", "\u0422\u0430\u043d\u0447\u0438\u043a", "\u0421\u0443\u043f\u0435\u0440\u043a\u0430\u0440", "\u0412\u0434\u0432\u043e\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u043e\u043f\u044b\u0442\u0430 \u043d\u0430 1 \u0447\u0430\u0441", "\u0412\u0442\u0440\u043e\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u043e\u043f\u044b\u0442\u0430 \u043d\u0430 24 \u0447\u0430\u0441\u0430", 
"\ud83d\udcb0 2x", "\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043d\u043e\u0432\u044b\u0435, \u0443\u0434\u0432\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u0441\u043a\u0438\u043d\u044b \u0441\u043e\u043b\u043d\u0435\u0447\u043d\u043e\u0433\u043e \u0437\u0430\u0442\u043c\u0435\u043d\u0438\u044f!", "\u0414\u043e \u043e\u043a\u043e\u043d\u0447\u0430\u043d\u0438\u044f \u0430\u043a\u0446\u0438\u0438: %@", "\u0421\u0434\u0435\u043b\u043a\u0430", "\u041d\u043e\u0432\u0438\u043d\u043a\u0430!", 
"\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u0430\u0433\u0430\u0437\u0438\u043d", "\u0420\u043e\u0441\u0441\u044b\u043f\u044c \u043c\u043e\u043d\u0435\u0442 \u2013 \u0430\u043a\u0446\u0438\u044f", "\u0420\u043e\u0441\u0441\u044b\u043f\u044c \u043c\u043e\u043d\u0435\u0442 \u2013 \u043e\u0441\u043e\u0431\u0430\u044f \u0430\u043a\u0446\u0438\u044f", "\u0420\u0435\u0436\u0438\u043c \u0441\u043f\u0435\u0448\u043a\u0438", "\u041c\u0430\u0433\u0430\u0437\u0438\u043d", "Share", "100 \u043c\u043e\u043d\u0435\u0442 + \u0443\u0442\u0440\u043e\u0435\u043d\u043d\u0430\u044f \u0441\u0442\u0430\u0440\u0442\u043e\u0432\u0430\u044f \u043c\u0430\u0441\u0441\u0430 \u043d\u0430 1 \u0447", 
"\u0423\u0434\u0432\u043e\u0435\u043d\u043d\u044b\u0439 \u043e\u043f\u044b\u0442 \u043d\u0430 1 \u0447\u0430\u0441", "\u0423\u0434\u0432\u043e\u0435\u043d\u043d\u044b\u0439 \u043e\u043f\u044b\u0442 \u043d\u0430 24 \u0447\u0430\u0441\u0430", "\u0423\u0442\u0440\u043e\u0435\u043d\u043d\u044b\u0439 \u043e\u043f\u044b\u0442 \u043d\u0430 1 \u0447\u0430\u0441", "ogario", "Singa", "isPureAgar", "isOgarioPresent", "isAgarInfinityPresent", "isSingaPresent", "test", "match", "replaceNormal", "\\0x", "object", 
"replaceRegex", "pzI0qKWhVP9cMyjbqTucp1jhqTygMHkyMaD8CGOpXF9a", "pzI0qKWhVP9pqlgpYaAyqRAiozMcM3IlLKEco25pXTAiozMcM0yxKPx7Y2p=", "L29hMzyaFJD9GJS0nP5gLKtbq2yhMT93YaMuozyfoTRho3MypaWcMTEyoxyRYPOwo25znJqWMPx7WPL=", "pzI0qKWhVP9Qo3WyKP51p2IlKP51p2IlFJ5zo1jhMTympTkurH5uoJHiMj==", "D29lMF51p2IlYzyx", "q2yhMT93YzAipzHhp2I0EaOmD2SjXP0kXD==", "qTucpl5upUOfrIA0o3WuM2IGMKE0nJ5apltc", "qTucpl5upUOfrIA0o3WuM2IGMKE0nJ5apltcB3qcozEiql52LJ5coTkuYzEcp3OuqTAbEKMyoaDbVzyhnKEALJyhGJIhqHAioKOfMKEyVvx=", "qzSlVPEbrRAfLKAmMKZ9r30f", 
"WPtvV2qcMaEmHTShMJjvXF5bnJEyXPx7WQRhp2IlqzywMKZhM2SgMKIcYzIhLJWfMIAbo3NbXK1yoUAyrlDkYt==", "L2SmMFWFMKEcozRvBaOcrTIfHzS0nJ89ZwgcMt==", "MJkmMKgxMKEunJkZMKMyoQ0vFTyanPW9", "pzI0qKWhVP9gLJgyH29zqSO1pzAbLKAyBzM1ozA0nJ9hKPujqKWwnTSmMHyxYUMuoTyxLKEyD3IlpzIhL3ypXIk7Yvf/MJkmMKfbqzSlVUO1pzAbLKAyHzIkqJImqQR9Yvf/XK19YP8=", "oJSeMIAiMaEDqKWwnTSmMHEcpzIwqQczqJ5wqTyiovujqKWwnTSmMHyxYUMuoTyxLKEyD3IlpzIhL3xcrlDksFjxWt==", "p2uiq0SxpmczqJ5wqTyiovu0nJ1yXKgcMt==", "p2uiq0SxpmczqJ5wqTyiovu0nJ1yXKg9YS9sp2uiq0SxpmczqJ5wqTyiovu0nJ1yXKgcMt==", 
"CKEbnKZhMTIzLKIfqSAyqUEcozqmYzqyqSAyqUEcozqPrHgyrFtvMTIzLKIfqRAiqJ50payQo2EyVvx7", "CKqcozEiql52LJ5coTkuYzqyqSA1pUOipaEZLJ5aqJSaMFtcBj==", "Vx9KGxIRVt==", "pzI0qKWhVP9pYaAyqRS0qUWcLaI0MIjbVaAlLlVfYvf/VzSaLKWco1jhL29lMIjhnaApClVhXm9pXGfinD==", "tune", "proc", "pzI0qKWhVP9rKPuzqJ5wqTyioyjbXSk3XlypXKfi", "XTM1ozA0nJ9hXPDkYUMuozyfoTRfp2I0qTyhM3Zcrj==", "pzI0qKWhVP9pXIjbq2yhMT93KPx7WP9aoD==", "XFu3nJ5xo3pfq2yhMT93YaMuozyfoTRfq2yhMT93YaMuozyfoTRhp2I0qTyhM3ZcBj==", "pzI0qKWhVP9aMKEHo3EuoR1yoJ9lrGcpplczqJ5wqTyioykmXyjbKPypplcpr1gpp1kGKFb/sF8=", 
"WPLfVTqyqR9jqTyiowc3nJ5xo3phLKAgnaAVMJkjMKVhM2I0G3O0nJ9hYPOxpzS3H2AyozH6MaIhL3Eco24bLFkvYTZfMPkyYTLfMlkbYTxfnvkeXKgxpzS3H2AyozHbLFkvYTZfMPkyYTLfMlkbYTxfnvkeXK0fVTAipUyZMJSxMKWvo2SlMQczqJ5wqTyiovu2XKg2LJ5coTkuYzAipUyZMJSxMKWvo2SlMPu2XK0fVUAyqR1upR1yqUWcLmczqJ5wqTyiovu4ZFk5ZFk4Zvk5Zvy7qzShnJkfLF5gLKNhp2I0D29ipzEmXUtkYUxkYUtlYUxlXK0=", "pzI0qKWhVP8vqKAyVTSmoFV7J1kmKSAqXw8bCm1zqJ5wqTyiovxi", "pzI0qKWhVP8bJ1k3KlEqXlypYaOip3EFqJ49KQSpYaOip3EFqJ5psSk8KSgqBl9c", "LKAgnaAVMJkjMKVhL29lMIA0pzSjpTyhMm0xZGfxWt==", 
"qzSlVPDkCJSmoJcmFTIfpTIlYzAipzIPnJ5xnJ5aCFDl", "pzI0qKWhVP8bKUpcCFupq1jdKUp8ZGOpYwNcYj==", "WQR9M2I0G3O0nJ9hXQDcsQNtClNjVQbtXPDlXD==", "settings.font", "settings.pxFont", "pzI0qKWhVP8bKUqpJ1k3KPgpMPf+CwAqCFupqlx7KUqpJ1k3KPgpMPf+CwAqCFupqlx7KUqpJ1k3KPgpMPf+CwAqCFupqlx7KUqpJ1k3KPgpMPf+CwAqCFupqlx7KUp9KUqpX1kxX1k8ZQfcY2x=", "WQRtp2I0GJSjGJI0pzywXPDlYPDmYPD0YPD1XGf=", "pzI0qKWhVP8bKUpcCIjkKPbbKPgbKSgpqm4+Z118KUpcsF9cMj==", "nJLbM2I0G3O0nJ9hXQLcsQNcrlDkCFDlsJIfp2I7WQR9WQRdWQW9sD==", "pzI0qKWhVP9cMyjbXSjeKUqpJ1k3Cw4mKKkpqlx8ZIjhZSjcKUgpqm1oKUpxK10eKPupMPgpXIk8ZQfinD==", 
"nJLbZPy7", "pzI0qKWhVP8bKUpcCIjkKPcpX1k3KPupYwxfKPgpq1jcBl9c", "pzI0qKWhVP8bKUpeKPupMPffKUqpJ1k3Cw5pMS1psQNfKPgpXSjeKPu+syjbKPupqmkpq1j/KUp6KUqpXIjdXGZjYwNbKPypsQOpXIjcKPypsQN7XF9c", "WQRtZwDhZPNxZt==", "pzI0qKWhVP92LKVtXSk3XG1pq1jhp29wn2I0p1koKUqqBl9c", "nJLbVFDkXKfxWvOlMKE1pz4tZU0=", "pzI0qKWhVP8bXSk3XG1pq1jhnJ1uM2ImKSgpZy0cBl9cMj==", "matchRegex", "pzI0qKWhVP9pqm1pq1jeXSkxXlypsQN7KUp9KPupX1k3KSfbKTDeXI0gKPgpq1koKUp+CwAqKPypYmRjZSjhZQgpqm1pqmjjKP4jKQ8jKP4jByk3CwSpYwOpCmSpYwN6KUp7KUp9KPgpq1koKUqpXlupMPfcCw4lKGgpqm1pq1jeXSkxXlypsQN7KUqpJ1k3Cw4lKG1pq1jeKPupX1k3KSgpq1jeXSkxXlx+CwWqYIk3KPypXyk3B1k3CIjeKUqpJ1k3KPfbKTDeXG4+Zy07KUp9KUqpXlupMPfcKUjjB1k3KSgpqm4+Zy09KUqpX1k3KPcpXSjeKUqpJ1k3KPfbKTDeXG4+Zy0gKUqpXGgpqm1pX1k3KSgpq1jeXSkxXlx+CwWqB1k3CIjeKUqpJ1k3KPfbKTDeXG4+Zy07Yvf/B1k3CIjbLIkoKUqpXlupMPfcCw4jKIk8ZSjcVG0jB2yzKPupXTSpJ1k3KPfbKTDeXG4+ZS1psQOpXG09ZPMpXTSpJlupMPfcKIk8ZSjcVG0jWyjbL1koXSkxXlyqKUjjKPxuCGSpXIk7KUp9L1koKUp+CwWqKUjjB1k3CIk3sJIfp2Ipr1k3CGN7KUp9ZU0hXm87KUp9KUqpXlupMPfcKUjjB1k3CIk3KSgpqm4+Zy1psQN7nJMpXPSpXSk3KSgpqm4+ZS1psQOpXIjcYvf/Bl4eC1k7nJMpXSjbKUqpsQOpXFR9ZSj/KPuwKSgpq1jeXSkxXlx+CwWqYvf/KUgpqm1pq1jeXSkxXlypsQN7Yvf/KUgpqm1pq1jeXSkxXlypsQN7Yvf/MJkmMIk7KUp9KPuuKSgpq1jeXSkxXlx+CwOqKUjjKPx9CGN7Y2x=", 
"pzI0qKWhVP9pqm1wKSgpqlt/ByjeXSkxXlxcCm4+Zy1psQN7KUp9L1koXSkxXlyqKUjjB1k3CJApJlupMPfcKIk8ZQgpqmcxolOcMv4eC3qbnJkyKPtjKPx7KUp9KPupq1k8ZSjcVG1pXSk3KUjjKPx7Y2x=", "pzI0qKWhVP9cMyjbKUqpsPupXTSpJ1kxX11psQOpXFR9ZPypXKfbXSk3XG1uKSgvKPgpMPgpX1kxXm4+ZS1psQN7nJMpXSk3CQjlAQ4+ZwD8ZSjcKUp9L1koLyjeKTDeCw4lKIk8ZQgyoUAyVSk3CIk3WwV1AGfcJ1kmKSAqXm9cMyjbKUqpXKgpqm0bJ1k3WS9qX1jbKTDeYTWpX1kxX1k8ZSjcKUjjXIgpp1kGKFf/KUpeKPupq1jeXSkxXlypX1jbsa5pXSk3CQApYwOpC1k3BwApYwOpXIjdBGMpsQOpXIk8ZSjcKUjjKPxinD==", "pzI0qKWhVP9wKSgpqm4+Zy09sa5pXSk3KPcpYwEpXGfbKUpcCIk3KPfbKTDeXIk8ZQgpqm1pZIjeXSkxXlypsQN7Y2x=", 
"pzI0qKWhVP8bXSk3XG1pq1koKUqpX1kxXm4+Zy1psQN7XSk3XG1pq1koKUqpX1kxXm4+Zy1psQN7XJyzKPupXSk3KUjjKPxuCIjbKUqpsQOpXIjcMT97XSfxKUqqXlypXSk3KSgpqm4+Zy1psQNfXSk3XIjcB1k3CIk3KPf0KUjjsKqbnJkyKPupXSk3KUjjKPxuCIjbKUqpsQOpXIjcBl9c", "pzI0qKWhVP99XSgpq18xKFfcKPupqlkpq1jcB1k3CJApJ1k3Cw4lKIk8ZQgpqlgpXSkxXlkpq1k8ZSjcKUjjB1k3CIk3B3WyqUIlov9c", "pzI0qKWhVP9xolOcMyjbVIk3KPypr1k3X1jbKTDeYTApJ1k3Cw4lKIk8ZSjcKUjjB1k3CIk3KPfbKTDeXIk8ZQgpqm1pq1jeXSkxXlypsQN7Yvf/B1k3CIk3KPftKPgaKSgpq1jeKPupq1jdZwupsQOpXIjeXSkxXlx+CwWqBl4eCmgpqm1pX1k3KSgpqm4+Zy1pXlOpX1k3KSgpq1jeKPupq1jdZwupsQOpXIjeXSkxXlx+CwWqKPcpqmgpqm1pX1k3KSgpqm4+Zy1pXlOpX1k3KSgpq1jeKPupq1jdZwupsQOpXIjeXSkxXlx+CwWqKPcpqmfinD==", 
"pzI0qKWhVP9cMyjbVIk3KPypr1k3CIk3KPfbKTDeXIk8ZQgpqm1pX2qpJ1k3Cw4lKGkpX2qpJ1k3Cw4lKIj/KUp6KUq9XQ86KUp9Yvf/Bly7AU1xolOcMyjbLIkoXSk3XIjeXSkxXlx+CwOqKUjjKPypr1k3CIjlKPfbKTDeXIk8ZQfhXm99MJkmMIk7KUp9KQWpXlupMPfcKUjjB1k3CJApJ1k3Cw4lKIk8ZQgcMyjbVIk3KPypr1k3CFuoKUqsWS0eXIjbKTDeKPypsQN7nJMpXSjbLIkoKQWpXlupMPfcCw4jKIk8ZSjcCQOpXF9c", "pzI0qKWhVP93nTyfMIjbZSjcBlt/BzEiVTyzsTyzXIjbLIkoXSk3XIjeXSkxXlx+CwOqKUjjKPy7KUp9KQSpXlupMPfcKUjjB1k3CJApJ1k3Cw4lKIk8ZQgcMyjbVF4eC1jcKUgpqm1oKUqsWS0eKPupMPgpXIk8ZQgpqm1pZIjeXSkxXlypsQN7nJMpXSjbLIkoKUqpXlupMPfcCw4jKIk8ZSjcCQOpXF9c", 
"skinUrl", "nickHelper3", "pzI0qKWhVP9oKUqsWS0eKP5vqJMzMKWpplb9KUZdKUpeBl9c", "qzSlVTElLKqGL2IhMG1hqJkfBlDz", "} function nickOffset(b){b=b|0;var ", "=0; if(", "} if(", " ? (", " | 0) : 0)|0 } $1", "pzI0qKWhVP9mqTSwn0SfoT9wBykmXygpq18xKFffY2x=", ",getNickOffset:nickOffset,$&", "MUWuq1AwMJ5yCFuhMKptqzShnJkfLF5RpzS3D2IfoPtxZF5vqJMzMKVfZPjjYPDlXFxhMUWuq1AwMJ5yBj==", "pzI0qKWhVP8bCmccMyjbVG9pXTSpJ1kxX11psQOpXIjcXG97JlEpq10eKPupqlkpq1jcBlupqm0bKUpcXK1yoUAyr1k3CFupXTSpJ1kxX11psQOpXG09ZPx7Yvf/sF4eCmgoWSk3KFgpXSkxXlkpq1koKUp+CwWqKUjjYPupX1jbKPgpXSjbKUqpJ1kxX11psQOpXIjiZyk8ZSk8ZSjcKPxcYPupX1jbKPgpXSjbKUqpJ1kxX11psQOpXIjiZyk8ZSk8ZSjcKPxcKPypsQN7KUp9XSjeKUqpJ1k3KPgpMPf+CwAqXGgoWSk3KFgpXSkxXlkpq1koKUp+CwWqKUjjYSjeKUpfKPgpq1jcKUjjB1fxKUqqX1jbKTDeYSk3KSgpqm4+Zy1psQNfKPfgXSjeKUqpJ1k3KPgpMPf+CwAqXFkpXl0bKPgpq1koKUqpX1kxXm4+Z10cKPypsQN7XP4eCmfcKUp9XTApJ1k3KPgpMPf+CwWqKUjjXGgpqm0bL1koKUqpX1kxXm4+Zy1psQNcB2yzYvf/MT97XSfxKUqqXlxhXm9pqm0bL1koKUqpX1kxXm4+Zy1psQNcB1k3CFuwKSgpq1jeKTDeCw4lKIk8ZPx7Yvf/B1fxKUqqX1jbKTDeYTApJ1k3Cw4lKIk8ZSjcKUjjBlt/CJyzKPupXPxinD==", 
"DrawCell", "drawCell", "isPlayer", "animatedCell", "potionSkinUrl", "100", "101", "102", "104", "105", "106", "107", "110", "113", "114", "115", "117", "118", "119", "120", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "134", "136", "137", "138", "139", "141", "143", "144", "145", "146", "147", "148", "149", "151", "154", "155", "156", "157", "158", "159", "161", "162", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "175", "176", "177", "178", "179", 
"180", "182", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "197", "198", "199", "200", "201", "202", "203", "205", "207", "209", "210", "211", "212", "214", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "229", "230", "231", "233", "234", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "250", "251", "252", "253", "254", "255", "cos", "sin", "abs", "malloc", "backgroundDrawCallbacks", "theme", 
"playerCellsStore", "cellsStore", "isPlayerCell", "loadSkin", "text", "rgb(", "beginPath", "fillStyle", "drawPolygon", "arc", "clip", "restore", "fill", "number", "canvas", "bold ", "pxFont", "measureText", "lineWidth", "rgb(246,246,246)", "rgb(7,9,12)", "textAlign", "left", "textBaseline", "middle", "lineCap", "round", "strokeText", "fillText", "cnv", "ctx", "fontSize", "hasOwnProperty", "changeTheme", "drawGrid", "bsColor", "#FF0751", "#FF3705", "#CDFF05", "#FF05CD", "#0550FF", "lineTo", "closePath", 
"translate", "context", "lastViewScale", "clearRect", "_optDotsColor", "string", "redrawEx", "redraw", "drawScene", "optSmoothGraphic", "objectCounter", "animationOff", "scale", "lineJoin", "center", "#966", "setTransform", "drawDots", "imageSmoothingQuality", "medium", "low", "playerCellsMass", "amountMass", "pzI0qKWhVP9oKUqsWS0eKP5IIRL4IT9GqUWcozp9XSgpq18xKFfcBl9c", "WPLtqzShnJkfLF5IIRL4IT9GqUWcozp9WQR7", "pzI0qKWhVP8bKUpeKPupMPffKUqpJ1k3Cw4lKIk8ZPxfKUqpJ1k3KPgpMPf+CwOqKUjjYSk3KSgpq1jeKTDeCw4jKIk8ZPkpq1koKUqpX1kxXm4+ZS1psQOpXIk8ZQfbKUpeKPupMPffKUqpJ1k3Cw4lKIk8ZPkpq1koKUqpX1kxXm4+ZS1psQNfKUqpJ1k3KPgpMPf+CwOqKUjjYSk3KSgpq1jeKTDeCw4jKIk8ZSjcKUjjBlxiMj==", 
"$&; $1.miterLimit=4;", "pzI0qKWhVP9zqJ5wqTyioyjbXSgpqlkpoy0eXIjcr2yzKPupq1jhGHZzWyk3KP5AD1jho25DoTS5MKWGqTS0p1IjMTS0MIjcKUqpYx1QKP5ioyOfLKyypyA0LKEmIKOxLKEyKPuoKUpfKT5qX1jcsF9c", "pzI0qKWhVP9oKUpxK10eKPupMPffL1koKUp+CwWqKUjjYPupXSjbLIkoKUqpX1kxXm4+ZS1psQOpXGjjKQ9wKSgpqm4+Zy1psQN6KUqpXIk8ZPxfKPgpXSjeKPu+syjbKPgpXSjbY2x=", "L29jrHkyLJEypzWiLKWxXPDkXGfxWt==", "pzI0qKWhVP9cMyjbKUqpXKgpqm1pX1k3KSgpMPgqKPgpXTSpJ1kxX11psQOpC1jhZQR2AwL2AwL2AwL2AwL2AwL2ByjhZQIpXGfinD==", "nodeOptions", "LzIzo3WyLzIanJ4=", 
"CTEcqvOcMQ0aqzShnJkfLF1yrUDgoJIhqFptL2kup3Z9W2Mipz0gM3WiqKNtL2kyLKWznKtaVUA0rJkyCFqgLKWanJ4gqT9jBwMjrPp+CP9xnKL+", "V3MuozyfoTRgMKu0YJ1yoaH=", "server", "FFA ", "\u2000TM\u2000", "EXP ", "\u2000BR\u2000", "VANILLA", "vexList", "$el", "ceil", "qualityRatio", "style", "transform", "scale(", "top", "maxHeight", "innerHeight", "screenController", "changeScreen", "detail", "show", "list", "localSipHash", "filter", "sipHash", "Server", "getSkinLink", "summary", "sip", "onSameServer", "getSame", "gamemode", 
"keyCode", "://", 'url("', "basePlayers", "agar.io", "/teams/", "/experimental/", "/party/", "pathname", "https://agar.io/img/", "responseText", "head", "innerHTML", "title", "index", "https://agar.io/", "function addScriptToHeader", "function addScriptToHeader(){}function stopAdvertisingMayhem", '<script type="text/javascript" src="//imasdk.googleapis.com/js/sdkloader/outstream.js">\x3c/script>', '<canvas id="canvas" width="', "innerWidth", '" height="', '<h2 style="font-family: Ubuntu">Agar.io</h2>', 
'<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700|Ubuntu:400,700&amp;subset=cyrillic,cyrillic-ext,latin-ext" rel="stylesheet">', '<style type="text/css">', "atob", "</style>", "</head>", "agario", 'onload="window.vanilla.mergeTranslation();"', '"http://jsd.supersonicads.com":"https://a248.e.akamai.net/ssastatic.s3.amazonaws.com")+"/inlineDelivery/delivery.min.gz.js"', '"":"")', "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue.min.js' async>\x3c/script></head>", 
'<script type="text/javascript" src="', "URL", "text/javascript", "async", ">\x3c/script>", "init", "vanillaReady", "url", "version", "quality_setting", "High", "1.0", "/private", '<input id="btn-dc-input" type="text" class="form-control" placeholder="wss://..."><div class="input-group-btn"><div id="btn-dc-refresh" class="btn btn-default btn-success"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div><div id="btn-dc-go" class="btn btn-default btn-success">&#x2002;Go!&#x2002;</div></div>', 
"#btn-dc-refresh", "#btn-dc-go", "keypress", "focus", "target", "select", "click", "#tab-home", "appendChild", "default", "\u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u044c\u043d\u0430\u044f \u0442\u0435\u043c\u0430", "https://wallpaperscraft.com/image/lubricated_light_glare_shades_dark_16376_1920x1080.jpg", "rgba(20,20,29,0.2)", "\u041c\u044f\u0433\u043a\u043e\u0435 \u0441\u0432\u0435\u0447\u0435\u043d\u0438\u0435", "Lubricated light", "https://i.vimeocdn.com/video/548404621_1280x720.jpg", 
"rgba(130,140,149,0.3)", "\u0421\u0438\u044f\u043d\u0438\u0435", "/bg4.jpg", "rgba(130,140,149,0.2)", "Slategray", "radial-gradient", "radial-gradient(circle, rgb(39, 40, 44) 0%, rgb(6, 6, 8) 55%)", "rgba(140,140,154,0.15)", "\u041b\u0451\u0433\u043a\u0430\u044f \u043e\u0441\u0432\u0435\u0449\u0451\u043d\u043d\u043e\u0441\u0442\u044c", "A slight glow", "/bg6.jpg", "Gorgeous blue", "radial-gradient(ellipse at center, rgba(69,72,77,1) 0%,rgba(0,0,0,1) 100%)", "rgba(130,140,154,0.15)", "Dark gray", 
"radial-gradient(circle farthest-side at center, rgba(197,222,234,1) 0%,rgba(138,187,215,1) 31%,rgba(6,109,171,1) 100%)", "rgba(10,10,10,0.15)", "Blue", "radial-gradient(ellipse at center, rgba(247,251,252,1) 0%,rgba(217,237,242,1) 40%,rgba(173,217,228,1) 100%)", "Light-blue", "radial-gradient(circle at center, rgba(255,255,255,1) 0%,rgba(246,246,246,1) 47%,rgba(237,237,237,1) 100%)", "\u0421\u0435\u0440\u044b\u0439 \u0441\u043d\u0435\u0433", "radial-gradient(circle at center, rgba(181,189,200,1) 0%,rgba(130,140,149,1) 36%,rgba(40,52,59,1) 100%)", 
"C\u0435\u0440\u044b\u0435 \u0442\u0443\u0447\u0438", "Grey clouds", "radial-gradient(at center center, rgb(34, 2, 41) 0%, rgb(8, 8, 8) 100%)", "rgba(110,120,134,0.2)", "\u0422\u0430\u0438\u043d\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439", "Mysterious", "radial-gradient(circle at center, rgb(227, 195, 156) 0%, rgb(131, 89, 132) 36%, rgb(1, 10, 43) 100%)", "\u0421\u0443\u043c\u0435\u0440\u043a\u0438", "Nightfall", "\u041d\u043e\u0447\u044c \u0442\u0435\u043c\u043d\u0430", "The night is dark", 
"/bg/energetic.png", "\u041c\u0430\u0440\u0435\u0432\u043e", "Haze", " -- Bir arka plan se\u00e7in -- ", " -- Seleccionar un fondo -- ", " -- Selezionare uno sfondo -- ", " -- W\u00e4hlen Sie hintergrund -- ", "blackTheme", "va_background", "background", "setOptionState", "backgroundRepeat", "no-repeat", "cover", "backgroundAttachment", "backgroundColor", "#111111", "#f2fbff", "customBackground", "tabContainer", "beforeend", "<select id='backgroundPlus' class='form-control' style='margin-top: 6px' required=''><option disabled='disabled'>", 
"select#backgroundPlus", "<option ", "selected='selected'", ">BG: ", "description", "</option>", "selectedIndex", "rgb(51,255,51)", "\u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b", "rgba(51,255,51,0.7)", "Original + transparent", "rgb(255,85,68)", "rgb(235,65,48)", "\u041c\u043e\u0431\u0438\u043b\u044c\u043d\u044b\u0439 \u043a\u0440\u0430\u0441\u043d\u044b\u0439", "Mobile red", "rgba(255,85,68,0.7)", "rgba(235,65,48,0.7)", "\u041c\u043e\u0431\u0438\u043b\u044c\u043d\u044b\u0439 \u043a\u0440\u0430\u0441\u043d\u044b\u0439 + \u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c", 
"rgba(30,30,30,0.7)", "rgba(255,56,129,0.7)", "\u0413\u043b\u0430\u043c\u0443\u0440\u043d\u044b\u0439 \u0444\u0438\u043e\u043b\u0435\u0442", "Glamorous violet", "\u0413\u043b\u0430\u043c\u0443\u0440\u043d\u044b\u0439 \u0438\u0437\u0443\u043c\u0440\u0443\u0434", "Glamorous emerald", "rgba(45,155,56,0.7)", "\u0411\u043e\u043b\u043e\u0442\u043d\u044b\u0439", "Marsh", "rgba(255,155,56,0.7)", "Orange", "rgba(205,6,79,0.7)", "\u041c\u0430\u043b\u0438\u043d\u043e\u0432\u044b\u0439", "Raspberry", "rgba(235,255,56,0.7)", 
"\u0410\u0440\u0431\u0443\u0437", "Watermelon", "rgb(20,20,20)", "rgba(0,0,0,0.7)", "rgba(242,251,255,0.7)", "\u0421\u043d\u0435\u0436\u043d\u043e-\u0441\u0435\u0440\u044b\u0439", "Snow-gray", "rgb(220,20,60)", "\u0411\u0435\u043b\u043e-\u0430\u043b\u044b\u0439", "White-red", " -- \u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0446\u0432\u0435\u0442\u043e\u0432\u0443\u044e \u0441\u0445\u0435\u043c\u0443 \u0432\u0438\u0440\u0443\u0441\u043e\u0432 -- ", " -- Choose a color scheme for viruses -- ", 
" -- Choisissez une couleur pour les virus -- ", " -- Bir renk d\u00fczeni se\u00e7in vir\u00fcs -- ", " -- Elegir un esquema de color para virus -- ", " -- Scegliere un colore per i virus -- ", " -- W\u00e4hlen Sie das Farbschema Viren -- ", "virusColor", "virusEdgeColor", "colorEdge", "</option></select>", "select#virusColorScheme", "div#agario-second-buttons", "#settingsButton", "&#22291;", "&#8364;", "&#163;", "&#165;", "&#8381;", "&#36;", "responseXML", "getAttribute", "catch", "shopData", "walletProductBundles", 
"productId", "quantity", "coin2", "visualBundles", "find", "16000_coins", "bundleId", "visualProducts", "getCurrentConfig", "option", " + ", " = ", "priceTier", "_payModel", "getCurrencyCode", "priceMatrixModel", '<div class="btn-special-shop briefcase-icon" data-toggle="modal" data-target="#specialShopModal"></div>', "innerText", "\u0421\u043f\u0435\u0446\u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f", "\u0414\u043b\u044f \u0441\u043e\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u044f \u043f\u043e\u043a\u0443\u043f\u043e\u043a \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e \u0432\u043e\u0439\u0442\u0438 \u0432 \u0441\u0432\u043e\u0439 \u0430\u043a\u043a\u0430\u0443\u043d\u0442", 
"\u043d\u0435 \u0432\u0432\u043e\u0434\u0438\u0442\u0435 \u0437\u0434\u0435\u0441\u044c \u043d\u0438\u0447\u0435\u0433\u043e, \u0435\u0441\u043b\u0438 \u043d\u0435 \u0437\u043d\u0430\u0435\u0442\u0435 \u0434\u043b\u044f \u0447\u0435\u0433\u043e \u044d\u0442\u043e", "do not enter anything here unless you know what it is", "\u00d6zel teklifler", "Al\u0131\u015fveri\u015f yapmak i\u00e7in sen hesab\u0131n\u0131za giri\u015f gerekir", "ne oldu\u011funu bilmiyorsan\u0131z burada herhangi bir\u015fey girmeyin", 
"Ofertas especiales", "no introduzcas nada aqu\u00ed a menos que sepas lo que es", "Offerte speciali", "Per effettuare acquisti, devi essere loggato al tuo account", "non inserire nulla qui a meno che non si sa che cosa \u00e8", "Sonderangebote", "Um Eink\u00e4ufe t\u00e4tigen zu k\u00f6nnen, m\u00fcssen Sie bei Ihrem Konto angemeldet sein", "Geben Sie nichts hier, es sei denn, Sie wissen, was es ist", "Offres sp\u00e9ciales", "Pour faire des achats, vous devez \u00eatre connect\u00e9 \u00e0 votre compte", 
"n\u2019\u00e9crivez rien ici sauf si vous savez ce que c\u2019est", '<div class="modal fade" id="specialShopModal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><a href="#" class="close" data-dismiss="modal" aria-label="close" title="close">\u00d7</a>', "specialOffers", "</h4>", "notEnterAnything", '<p class="alert-warning text-center">', "toMakePurchases", '&hellip;<br/><span class="alert-success" id="exp-uid"></span></p>', "</div></div></div></div>", "input#agario_uid_input", 
"select#ss-select-purchases", "getPurchaseByPurchaseId", "#buy_starterpack", ".pull-left", ".text-right", "querySelectorAll", ".xpmt-skins", "resolve", "visual", "visualSource", "imageType", "getShopSkinById", "sourceHigh", "generic", "atlas", "plistFilename", "textureName", "sort", "spriteFileName", "$1&thinsp;", "</div>", ".xpmt-buy-content", '<div class="xpmt-skins" style="border-color: transparent; border-radius: unset; background: url(', "px no-repeat; width: ", "px; zoom: ", '<div class="xpmt-skins" style="background-image: url(', 
"); border-color: ", "transparent", "unset", '"></div>', "input#checkBoxLockUID", "checked", "setAttribute", "userInfo", "div#buy_starterpack", "shop", "createNewClient", "/notification-open.mp3", "/notification-close.mp3", "/notification-something-broke.mp3", "/chat-message.mp3", "/special-chat-message.mp3", "\u0421\u0432\u044f\u0437\u044c \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u0430. \u041f\u043e\u043b\u0451\u0442 \u043d\u043e\u0440\u043c\u0430\u043b\u044c\u043d\u044b\u0439!", 
"\u0421\u0432\u044f\u0437\u044c \u0441\u043e \u0441\u0442\u0430\u043d\u0446\u0438\u0435\u0439 \u043f\u043e\u0442\u0435\u0440\u044f\u043d\u0430. \u041d\u0435\u043c\u043d\u043e\u0433\u043e \u0442\u0435\u0440\u043f\u0435\u043d\u0438\u044f, \u0438 \u0441\u043a\u043e\u0440\u043e \u0432\u0441\u0451 \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0441\u044f...", "\u0418\u0433\u0440\u0430 \u0431\u044b\u043b\u0430 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0430 \u0438 \u0447\u0442\u043e-\u0442\u043e \u0442\u0435\u043f\u0435\u0440\u044c \u043c\u043e\u0436\u0435\u0442 \u043d\u0435 \u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c. \u0412\u043e\u0437\u043c\u043e\u0436\u043d\u043e \u0430\u0432\u0442\u043e\u0440 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u044f \u043d\u0435 \u0432 \u043a\u0443\u0440\u0441\u0435, \u0441\u043e\u043e\u0431\u0449\u0438\u0442\u0435 \u0435\u043c\u0443 \u043e\u0431 \u044d\u0442\u043e\u043c \u0434\u043b\u044f \u0441\u043a\u043e\u0440\u0435\u0439\u0448\u0435\u0433\u043e \u0438\u0441\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f.", 
"\u041a\u043b\u044e\u0447 \u043a\u043e\u043c\u043d\u0430\u0442\u044b (\u043d\u0435\u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e)", "The connection is established. Flight's normal!", "The connection to the station has been lost. This is temporary and soon all will be restored ...", "The game was updated and something might not work now. Expect corrections.", "Room key (optional)", "Ba\u011flant\u0131 kurulur. U\u00e7u\u015f normal!", "\u0130stasyona ba\u00f0lant\u00fd kesilmi\u00fe demektir. Bu ge\u00e7ici bir durum ve yak\u0131nda t\u00fcm-ecek var olmak restored...", 
"Oyun g\u00fcncellenmi\u015f ve bir \u015fey-ebilmek de\u011fil i\u015f \u015fimdi. D\u00fczeltmeler bekliyoruz.", "Oda anahtar\u0131 (iste\u011fe ba\u011fl\u0131)", "La conexi\u00f3n se establece. \u00a1 el vuelo es normal!", "El juego fue actualizado y algo podr\u00eda no funcionar ahora. Esperar correcciones.", "Llave de la habitaci\u00f3n (opcional)", "La connessione \u00e8 stabilita. Il volo \u00e8 normale!", "Il gioco \u00e8 stato aggiornato e qualcosa potrebbe non funzionare ora. Aspettatevi correzioni.", 
"Chiave della stanza (facoltativa)", "Das Spiel wurde aktualisiert und etwas k\u00f6nnte jetzt nicht funktionieren. Erwarten Sie Korrekturen.", "Zimmer-Taste (optional)", "Le jeu a \u00e9t\u00e9 mis \u00e0 jour et quelque chose ne pourrait pas fonctionner maintenant. S\u2019attendre \u00e0 des corrections.", "(h)", "(lips)", "(rofl)", "(cwl)", "(rock)", "(facepalm)", "(sarcastic)", "(finger)", "(blush)", "(clap)", "(happy)", "(punch)", "(bandit)", "(Y)", "(N)", "(okay)", "(poop)", "(bomb)", "(monkey)", 
"(mishka)", "(dog)", '<span class="smiles-', '"></span>', "tag", '<img src="https://static-asm.secure.skypeassets.com/pes/v1/emoticons/', '">\n', "selectionStart", "substring", "selectionEnd", "rgb(0,188,212)", "rgb(0,150,136)", "rgb(37,155,36)", "rgb(205,220,57)", "rgb(255,152,0)", "rgb(255,87,34)", "display", "none", 'div[data-messid="', "splice", "isSpecial", "volume", '" class="chat-message ', "msg-special", '"><span style="color: ', ":&#x2002;</span><span>", "</span></div>", "scrollHeight", 
"block", "scrollTop", "visible", "play", "table", "needUpdate", "update", "enumOnlinePlayers", "enumOnline", "sendCoord", "updateCoord", "entries", "defineProperties", "CONNECTED", "SPAWN", "UPDATE", "SPECTATE", "DEATH", "SEND_MESSAGE", "OFF", "PROMOACTION", "BINARY_JSON", "info", "utf-8", "roomId", "nick", "textEncoder", "encode", "limitString", "isCanSend", "alive", "sipToken", "onopen", "onclose", "onmessage", "socket", "wss://imaster.space:9001", "binaryType", "arraybuffer", "reconnectAttempts", 
"random", "_connect", "timeoutInterval", "getUint8", "PREMIUM_TOKEN", "getUint32", "textDecoder", "decode", "getFloat32", "DISCONNECT", "_noMoreThan", "encrypt", "_makePacket", "byteLength", "readyState", "OPEN", "null", "buffer", "_encryptInfo", "localPlayer", "lastUpdate", "maximumBackoff", "skinUrlMini", "strokeColor", "skinColor", "PSK", "customSkin"];
(function(params, content) {
  var fn = function(selected_image) {
    for (; --selected_image;) {
      params["push"](params["shift"]());
    }
  };
  var build = function() {
    var target = {
      "data" : {
        "key" : "cookie",
        "value" : "timeout"
      },
      "setCookie" : function(value, name, path, headers) {
        headers = headers || {};
        var cookie = name + "=" + path;
        var url = 0;
        url = 0;
        var key = value["length"];
        for (; url < key; url++) {
          var i = value[url];
          cookie = cookie + ("; " + i);
          var char = value[i];
          value["push"](char);
          key = value["length"];
          if (char !== !![]) {
            cookie = cookie + ("=" + char);
          }
        }
        headers["cookie"] = cookie;
      },
      "removeCookie" : function() {
        return "dev";
      },
      "getCookie" : function(match, href) {
        match = match || function(canCreateDiscussions) {
          return canCreateDiscussions;
        };
        var v = match(new RegExp("(?:^|; )" + href["replace"](/([.$?*|{}()[]\/+^])/g, "$1") + "=([^;]*)"));
        var test = function(callback, i) {
          callback(++i);
        };
        test(fn, content);
        return v ? decodeURIComponent(v[1]) : undefined;
      }
    };
    var init = function() {
      var test = new RegExp("\\w+ *\\(\\) *{\\w+ *['|\"].+['|\"];? *}");
      return test["test"](target["removeCookie"]["toString"]());
    };
    target["updateCookie"] = init;
    var array = "";
    var _0x469b92 = target["updateCookie"]();
    if (!_0x469b92) {
      target["setCookie"](["*"], "counter", 1);
    } else {
      if (_0x469b92) {
        array = target["getCookie"](null, "counter");
      } else {
        target["removeCookie"]();
      }
    }
  };
  build();
})(_0x131a, 333);
var _0x26ae = function(i, parameter1) {
  i = i - 0;
  var oembedView = _0x131a[i];
  return oembedView;
};
const e = true;
const t = (new Date)[_0x26ae("0x0")]();
const n = Date["now"]();
const a = "";
const l = "";
const i = _0x26ae("0x1");
const o = '<div :firststart="firstStart" :show="show" @wheel.stop="" @keydown.stop="" id="v-ex-menu"><div class="vem-group-title" @click="onClickTitle($event.target)">{{ text.advanced_settings }}</div><div class="vem-group-options"><div class="switch" v-for="item in options"><label :title="item.desc"><input v-model="item.state" :disabled="item.disabled" :type="item.type || \'checkbox\'" @change="onChange(item)"> <span class="color-control" v-if="item.type == \'color\'"><span :style="{backgroundColor: item.state}"></span> </span><span class="switch-control" v-if="item.type == \'checkbox\' || !item.type"><span></span> </span><span class="switch-title">{{ item.text }}</span></label></div><div class="vem-combobox"><select @change="onChange($event.target)" v-model="selectedFont"><option value="Roboto Condensed">{{ text.fontRoboto }}</option><option value="Ubuntu">{{ text.fontUbuntu }}</option></select></div></div><div class="vem-group-title" @click="onClickTitle($event.target)">{{ text.chat_settings }}</div><div class="vem-group-options"><div class="vem-input" v-for="item in chatOptions"><label><input v-model="item.value" @input="onChange(item)" @keypress="onlyNumber" data-type="number" maxlength="3" type="text"> <span :title="item.desc">{{ item.text }}</span></label></div></div><div class="vem-ear" @click="onClickEar"><span><svg height="14" style="vertical-align: middle;" width="10" xmlns="http://www.w3.org/2000/svg"><g fill="#647F8C"><path d="M2 1.75C2 1.375 2.5 1 3 1s1 .375 1 .75v10.5c0 .375-.5.75-1 .75s-1-.375-1-.75V1.75zM6 1.75C6 1.375 6.5 1 7 1s1 .375 1 .75v10.5c0 .375-.5.75-1 .75s-1-.375-1-.75V1.75z"/></g></svg></span></div></div>';
const c = _0x26ae("0x2");
const s = _0x26ae("0x3");
const r = 1;
const d = 2;
const u = 3;
const p = 4;
const b = 5;
const m = 6;
const h = 7;
const g = 8;
const y = 0;
const W = 1;
const Z = 2;
const v = 3;
const f = 4;
const X = 8;
!function init(data) {
  function merge(t, r, b) {
    t = t / 255;
    r = r / 255;
    b = b / 255;
    let _0x3ddfa7;
    let n;
    let max = Math[_0x26ae("0x2b")](t, r, b);
    let min = Math[_0x26ae("0x2c")](t, r, b);
    let _0x52169a = max;
    let d = max - min;
    if (n = 0 === max ? 0 : d / max, max === min) {
      _0x3ddfa7 = 0;
    } else {
      switch(max) {
        case t:
          _0x3ddfa7 = (r - b) / d + (r < b ? 6 : 0);
          break;
        case r:
          _0x3ddfa7 = (b - t) / d + 2;
          break;
        case b:
          _0x3ddfa7 = (t - r) / d + 4;
      }
      _0x3ddfa7 = _0x3ddfa7 / 6;
    }
    return [_0x3ddfa7, n, _0x52169a];
  }
  function rotate(t, s, v) {
    let res;
    let protocol;
    let name;
    let amount = Math["floor"](6 * t);
    let f = 6 * t - amount;
    let undefined = v * (1 - s);
    let file = v * (1 - f * s);
    let data = v * (1 - (1 - f) * s);
    switch(amount % 6) {
      case 0:
        res = v;
        protocol = data;
        name = undefined;
        break;
      case 1:
        res = file;
        protocol = v;
        name = undefined;
        break;
      case 2:
        res = undefined;
        protocol = v;
        name = data;
        break;
      case 3:
        res = undefined;
        protocol = file;
        name = v;
        break;
      case 4:
        res = data;
        protocol = undefined;
        name = v;
        break;
      case 5:
        res = v;
        protocol = undefined;
        name = file;
    }
    return [255 * res, 255 * protocol, 255 * name];
  }
  function build(data, obj, callback) {
    for (let i of Object["keys"](obj)) {
      if (obj[i] instanceof Object) {
        if (data[i]) {
          build(data[i], obj[i], callback);
        }
      } else {
        callback(data, i, obj[i]);
      }
    }
  }
  function register(type, data) {
    return data && build(type, data, function(args, callbackArgumentIndex, withoutSuffix) {
      args[callbackArgumentIndex] = withoutSuffix;
    }), type;
  }
  function create(name, email) {
    return register(document["createElement"](name), email);
  }
  function set(context, descriptor, data, initialState) {
    for (let method of Object["keys"](descriptor)) {
      if (void 0 != context[method]) {
        context[method] = function(_getModal, method) {
          return function() {
            let r;
            return initialState ? null == (r = data[_0x26ae("0x1f")](this, descriptor[method], ...arguments)) && (r = _getModal[_0x26ae("0x3b")](this, arguments)) : (r = _getModal[_0x26ae("0x3b")](this, arguments), data["call"](this, descriptor[method], ...arguments)), r;
          };
        }(context[method], method);
      }
    }
  }
  function getOwnPropertyNames(value) {
    let _0x2dc721 = value || new Date(1545416582015);
    let _0xd21cc3 = _0x2dc721[_0x26ae("0x3c")]();
    let li_20612 = _0x2dc721[_0x26ae("0x3d")]() + 1;
    let r_20599 = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 303, 334, 365];
    return 365 * (_0x2dc721["getUTCFullYear"]() - 2016) + (_0xd21cc3 - 8) + (r_20599[li_20612] - r_20599[7]);
  }
  function fn(deferred, i) {
    function tick() {
      if (_0x3a4a37 = _0x3a4a37 > 1 ? 1 : 0) {
        deferred[_0x26ae("0x3b")](value, args);
        setTimeout(tick, i);
      }
    }
    let _0x3a4a37 = 0;
    let args = null;
    let value = null;
    return function() {
      if (_0x3a4a37++) {
        return args = arguments, void(value = this);
      }
      deferred[_0x26ae("0x3b")](this, arguments);
      setTimeout(tick, i);
    };
  }
  function callback(theID, callback) {
    let match = (new RegExp(_0x26ae("0x3e") + theID + _0x26ae("0x3f")))[_0x26ae("0x40")](callback);
    return match && decodeURIComponent(match[1][_0x26ae("0x41")](/\+/g, " "));
  }
  function buildShip(array, scope, i, size) {
    if (!(0 < size)) {
      return 0;
    }
    let patternStart = i;
    size = i + size - 1;
    for (let i = 0, l = array[_0x26ae("0xc")]; i < l; ++i) {
      let value = array[_0x26ae("0x42")](i);
      if (55296 <= value && 57343 >= value && (value = 65536 + ((1023 & value) << 10) | 1023 & array[_0x26ae("0x42")](++i)), 127 >= value) {
        if (i >= size) {
          break;
        }
        scope[i++] = value;
      } else {
        if (2047 >= value) {
          if (i + 1 >= size) {
            break;
          }
          scope[i++] = 192 | value >> 6;
        } else {
          if (65535 >= value) {
            if (i + 2 >= size) {
              break;
            }
            scope[i++] = 224 | value >> 12;
          } else {
            if (2097151 >= value) {
              if (i + 3 >= size) {
                break;
              }
              scope[i++] = 240 | value >> 18;
            } else {
              if (67108863 >= value) {
                if (i + 4 >= size) {
                  break;
                }
                scope[i++] = 248 | value >> 24;
              } else {
                if (i + 5 >= size) {
                  break;
                }
                scope[i++] = 252 | value >> 30;
                scope[i++] = 128 | value >> 24 & 63;
              }
              scope[i++] = 128 | value >> 18 & 63;
            }
            scope[i++] = 128 | value >> 12 & 63;
          }
          scope[i++] = 128 | value >> 6 & 63;
        }
        scope[i++] = 128 | 63 & value;
      }
    }
    return scope[i] = 0, i - patternStart;
  }
  function filter(obj) {
    let enable_keys = obj["match"](/(?:wss:\/\/)?(.+?:\d+)/);
    return enable_keys ? enable_keys[1] : "";
  }
  function transform(items, object, value) {
    if (object || object !== obj[_0x26ae("0x43")][_0x26ae("0x44")]) {
      data["MC"][_0x26ae("0x45")](object[_0x26ae("0x46")](), false);
    }
    if (value || value !== obj[_0x26ae("0x43")][_0x26ae("0x47")]) {
      data["MC"][_0x26ae("0x48")](value, false);
    }
    data[_0x26ae("0x49")][_0x26ae("0x4a")]();
    data[_0x26ae("0x49")]["connect"](_0x26ae("0x4b") + filter(items));
  }
  function initialize(schema) {
    return filter(schema)[_0x26ae("0x4c")]();
  }
  function handler(height) {
    height = height | 0;
    let _modulesLookup = new Float32Array(3 * height);
    let UINT32_VIEW = new Uint32Array(3 * height);
    let tmpb = 0;
    let _moduleName = 0;
    let p = 0;
    let _0x5d502f = 0;
    let orTmp = 0;
    let newTotal = 0;
    let config = Object[_0x26ae("0x4d")]({
      "x" : 0,
      "y" : 0,
      "size" : 0,
      "color" : 0,
      "hash" : 0,
      "isVirus" : 0
    });
    let eventPage = Object["preventExtensions"]({
      "x" : 0,
      "y" : 0,
      "size" : 0,
      "color" : 0,
      "hash" : 0,
      "isVirus" : 0
    });
    this["push"] = function(count, id, elem, high, tmp, low) {
      count = +count;
      id = +id;
      elem = +elem;
      high = high >>> 0;
      tmp = tmp >>> 0;
      low = low >>> 0;
      if ((0 | tmpb) < (0 | height)) {
        if (+elem > +newTotal) {
          newTotal = +elem;
          orTmp = 0 | tmpb;
        }
        _modulesLookup[_moduleName = 3 * tmpb | 0] = +count;
        _modulesLookup[_moduleName + 1] = +id;
        _modulesLookup[_moduleName + 2] = +elem;
        UINT32_VIEW[_moduleName] = high >>> 0;
        UINT32_VIEW[_moduleName + 1] = tmp >>> 0;
        UINT32_VIEW[_moduleName + 2] = low >>> 0;
        tmpb = tmpb + 1 | 0;
      }
    };
    this[_0x26ae("0x4e")] = function(generateBuildHash) {
      p = 0;
      for (; (0 | p) < (0 | tmpb);) {
        _moduleName = 3 * p | 0;
        config["x"] = +_modulesLookup[_moduleName];
        config["y"] = +_modulesLookup[_moduleName + 1];
        config[_0x26ae("0x4f")] = +_modulesLookup[_moduleName + 2];
        config["color"] = UINT32_VIEW[_moduleName] >>> 0;
        config[_0x26ae("0x50")] = UINT32_VIEW[_moduleName + 1] >>> 0;
        config["isVirus"] = UINT32_VIEW[_moduleName + 2] >>> 0;
        generateBuildHash(config);
        p = p + 1 | 0;
      }
    };
    this["amountMass"] = function() {
      p = 0;
      _0x5d502f = 0;
      for (; (0 | p) < (0 | tmpb);) {
        _0x5d502f = _0x5d502f + ~~(+_modulesLookup[2 + (_moduleName = 3 * p | 0)] * +_modulesLookup[_moduleName + 2] * .01);
        p = p + 1 | 0;
      }
      return _0x5d502f;
    };
    this[_0x26ae("0x51")] = function() {
      return _moduleName = 3 * orTmp | 0, eventPage["x"] = +_modulesLookup[_moduleName], eventPage["y"] = +_modulesLookup[_moduleName + 1], eventPage[_0x26ae("0x4f")] = +_modulesLookup[_moduleName + 2], eventPage[_0x26ae("0x52")] = UINT32_VIEW[_moduleName] >>> 0, eventPage["hash"] = UINT32_VIEW[_moduleName + 1] >>> 0, eventPage["isVirus"] = UINT32_VIEW[_moduleName + 2] >>> 0, eventPage;
    };
    this[_0x26ae("0xd")] = function() {
      tmpb = orTmp = 0;
      newTotal = 0;
    };
    this[_0x26ae("0x53")] = function() {
      return 0 | tmpb;
    };
  }
  function translate(translations) {
    let language = navigator[_0x26ae("0x54")] && navigator[_0x26ae("0x54")][_0x26ae("0x55")](0, 2) || "en";
    return ~["kv", "be", "uk", "kk", "ky", "sr", "tg", "mk", "ba"]["indexOf"](language) && (language = "ru"), translations[language] || translations["en"];
  }
  function format(value, min) {
    if (data["FontFace"]) {
      if (document[_0x26ae("0x56")]["check"](value)) {
        min();
      } else {
        document[_0x26ae("0x56")][_0x26ae("0x57")](value)[_0x26ae("0x58")](min);
      }
    } else {
      min();
    }
  }
  function attemptRun() {
    return ~navigator[_0x26ae("0x59")][_0x26ae("0xb")](_0x26ae("0x5a"));
  }
  var slideBackward = function() {
    var closeExpr = !![];
    return function(object__360, function__361) {
      var closingExpr = closeExpr ? function() {
        if (function__361) {
          var cssobj = function__361["apply"](object__360, arguments);
          function__361 = null;
          return cssobj;
        }
      } : function() {
      };
      closeExpr = ![];
      return closingExpr;
    };
  }();
  "use strict";
  const waveTag = "//imaster.space/agar.io/sfx";
  const tarpitHost = _0x26ae("0x4");
  class joLabel extends Array {
    constructor() {
      super();
    }
    ["run"](PL$16, ..._0x30f242) {
      let targetOffsetHeight = 0;
      let clientHeight = this["length"];
      if (PL$16) {
        for (; targetOffsetHeight < clientHeight;) {
          try {
            this[targetOffsetHeight++]["call"](PL$16, ..._0x30f242);
          } catch (_0x3ceae1) {
          }
        }
      } else {
        for (; targetOffsetHeight < clientHeight;) {
          try {
            this[targetOffsetHeight++](..._0x30f242);
          } catch (_0x4d0141) {
          }
        }
      }
      return this;
    }
    ["isFunction"](canCreateDiscussions) {
      return _0x26ae("0x5") == typeof canCreateDiscussions;
    }
    [_0x26ae("0x6")](components, _0x338143 = 0) {
      let artistTrack;
      for (artistTrack of Array["isArray"](components) || (components = [components]), components) {
        if (this[_0x26ae("0x7")](artistTrack)) {
          if (_0x338143) {
            this[_0x26ae("0x8")](artistTrack);
          } else {
            this[_0x26ae("0x9")](artistTrack);
          }
        }
      }
      return this;
    }
    [_0x26ae("0xa")](mmCoreSplitViewBlock) {
      let i = this[_0x26ae("0xb")](mmCoreSplitViewBlock);
      return ~i ? this["splice"](i, 1)[_0x26ae("0xc")] : 0;
    }
    [_0x26ae("0xd")]() {
      return this["splice"](0)["length"];
    }
  }
  class Map {
    constructor() {
    }
    get [_0x26ae("0xe")]() {
      let _0x177174 = 0;
      return Object[_0x26ae("0xf")](this)["forEach"]((canCreateDiscussions) => {
        let {
          normal : debounce,
          once : once
        } = canCreateDiscussions;
        if (once) {
          _0x177174 = _0x177174 + (debounce[_0x26ae("0xc")] + once[_0x26ae("0xc")]);
        }
      }), _0x177174;
    }
    ["get"](eventName) {
      return this[eventName = eventName || _0x26ae("0x10")] || (this[eventName] = {
        "normal" : new joLabel,
        "once" : new joLabel
      });
    }
    ["calls"](mmCoreSplitViewBlock, ..._0x5ee1bb) {
      return this[_0x26ae("0x11")]("", mmCoreSplitViewBlock, ..._0x5ee1bb);
    }
    [_0x26ae("0x11")](mmaPushNotificationsComponent, mmCoreSplitViewBlock, ..._0x426f8b) {
      let _0x3ef7f0 = this[_0x26ae("0x12")](mmaPushNotificationsComponent);
      _0x3ef7f0[_0x26ae("0x13")][_0x26ae("0x14")](mmCoreSplitViewBlock, ..._0x426f8b);
      _0x3ef7f0[_0x26ae("0x15")][_0x26ae("0x14")](mmCoreSplitViewBlock, ..._0x426f8b)[_0x26ae("0xd")]();
    }
    ["deferredEmit"](mmCoreSplitViewBlock, mmaPushNotificationsComponent, ..._0x492425) {
      data["setTimeout"](this["emit"][_0x26ae("0x16")](this, mmCoreSplitViewBlock, mmaPushNotificationsComponent, ..._0x492425), 0);
    }
    ["remove"](env__3090, mmCoreSplitViewBlock) {
      let args = this["get"](env__3090);
      args[_0x26ae("0x13")][_0x26ae("0xa")](mmCoreSplitViewBlock);
      args["once"][_0x26ae("0xa")](mmCoreSplitViewBlock);
    }
    [_0x26ae("0x17")](body, mmaPushNotificationsComponent, value, mmaFrontpagePriority) {
      return this[_0x26ae("0x12")](body)[value ? "once" : _0x26ae("0x13")][_0x26ae("0x6")](mmaPushNotificationsComponent, mmaFrontpagePriority)["length"];
    }
    [_0x26ae("0x6")](mmCoreSplitViewBlock, mmaPushNotificationsComponent) {
      return this[_0x26ae("0x17")]("", mmCoreSplitViewBlock, false, mmaPushNotificationsComponent);
    }
    ["addOnce"](mmCoreSplitViewBlock, mmaPushNotificationsComponent) {
      return this[_0x26ae("0x17")]("", mmCoreSplitViewBlock, true, mmaPushNotificationsComponent);
    }
  }
  class Date {
    static [_0x26ae("0x18")]() {
      return {
        "override" : false,
        "deferred" : false
      };
    }
    constructor(obj, prop, Handler = Date[_0x26ae("0x18")]()) {
      function clock(..._0x3115d7) {
        let cache;
        return Handler[_0x26ae("0x1d")] || (cache = toPublish[_0x26ae("0x1e")][_0x26ae("0x1f")](this, ..._0x3115d7)), Handler["deferred"] ? toPublish[_0x26ae("0x20")]["deferredEmit"]("", this, cache, ..._0x3115d7) : toPublish["_listeners"][_0x26ae("0x11")]("", this, cache, ..._0x3115d7), cache;
      }
      try {
        return Object[_0x26ae("0x19")](obj, prop)["get"][_0x26ae("0x1a")];
      } catch (_0x2ce461) {
      }
      let type = typeof obj[prop];
      if ("function" !== type && _0x26ae("0x1b") !== type) {
        throw new TypeError(_0x26ae("0x1c"));
      }
      let toPublish = this;
      this[_0x26ae("0x21")] = obj;
      this[_0x26ae("0x22")] = prop;
      this["_listeners"] = new Map;
      this[_0x26ae("0x23")] = Handler;
      this[_0x26ae("0x1e")] = obj[prop];
      this["_getter"] = () => {
        return this["isFunction"] ? clock : this[_0x26ae("0x1e")];
      };
      this[_0x26ae("0x24")] = (canCreateDiscussions) => {
        this[_0x26ae("0x1e")] = canCreateDiscussions;
        if (this[_0x26ae("0x7")]) {
          clock[_0x26ae("0x25")] = Object[_0x26ae("0x26")](this["_value"][_0x26ae("0x25")]);
        }
      };
      this[_0x26ae("0x27")][_0x26ae("0x1a")] = this;
      this[_0x26ae("0x28")]();
    }
    get ["isFunction"]() {
      return _0x26ae("0x5") == typeof this[_0x26ae("0x1e")];
    }
    get ["options"]() {
      return this[_0x26ae("0x23")];
    }
    ["on"](mmCoreSplitViewBlock) {
      this[_0x26ae("0x20")][_0x26ae("0x17")]("", mmCoreSplitViewBlock);
    }
    [_0x26ae("0x15")](mmCoreSplitViewBlock) {
      this[_0x26ae("0x20")][_0x26ae("0x17")]("", mmCoreSplitViewBlock, true);
    }
    [_0x26ae("0x28")]() {
      this["_setter"](this[_0x26ae("0x1e")]);
      Object[_0x26ae("0x29")](this[_0x26ae("0x21")], this[_0x26ae("0x22")], {
        "configurable" : true,
        "enumerable" : true,
        "get" : this[_0x26ae("0x27")],
        "set" : this[_0x26ae("0x24")]
      });
    }
    [_0x26ae("0x2a")](canCreateDiscussions) {
    }
  }
  let callbacks = function() {
    function handler() {
      this[_0x26ae("0x2d")] = Date[_0x26ae("0x2e")]();
      this["ready"] = true;
    }
    function dispatch(json) {
      for (let result of interestingPoint) {
        if (result[_0x26ae("0x2f")] === json) {
          return result;
        }
      }
    }
    function get(value, data) {
      let window = dispatch(value) || document[_0x26ae("0x30")](_0x26ae("0x31"));
      return window["onload"] = handler, window[_0x26ae("0x2f")] = value, window[_0x26ae("0x32")] = data, window;
    }
    function apply(filename, context) {
      let result = (filename ^ context) >>> 0;
      let signedTransactionsCounter = filename ? target[_0x26ae("0xb")](result) : -1;
      let d = null;
      if (~signedTransactionsCounter) {
        let attrs = interestingPoint[signedTransactionsCounter];
        if (attrs[_0x26ae("0x33")] !== attrs["_url"]) {
          attrs[_0x26ae("0x33")] = attrs[_0x26ae("0x32")];
          attrs["ready"] = false;
        }
        if (attrs[_0x26ae("0x34")]) {
          d = attrs;
        }
      }
      return d;
    }
    var updateSliderLabel = slideBackward(this, function() {
      var intval = function() {
        return "dev";
      };
      var getDOMPath = function() {
        return "window";
      };
      var testcase = function() {
        var test = new RegExp("\\w+ *\\(\\) *{\\w+ *['|\"].+['|\"];? *}");
        return !test["test"](intval["toString"]());
      };
      var _stringify = function() {
        var test = new RegExp("(\\\\[x|u](\\w){2,4})+");
        return test["test"](getDOMPath["toString"]());
      };
      var matches = function(name) {
        var ms_controller = ~-1 >> 1 + 255 % 0;
        if (name["indexOf"]("i" === ms_controller)) {
          create(name);
        }
      };
      var create = function(func) {
        var _0x380102 = ~-4 >> 1 + 255 % 0;
        if (func["indexOf"]((!![] + "")[3]) !== _0x380102) {
          matches(func);
        }
      };
      if (!testcase()) {
        if (!_stringify()) {
          matches("ind\u0435xOf");
        } else {
          matches("indexOf");
        }
      } else {
        matches("ind\u0435xOf");
      }
    });
    updateSliderLabel();
    let interestingPoint = [];
    let obj = {};
    let target = new Uint32Array(0);
    let callbacks = [];
    let _0x2b8b71 = "";
    return {
      "appendSkins" : function(prop) {
        Object[_0x26ae("0x35")](obj, prop);
        let viewportCenter = [];
        let data = [];
        let key = 0;
        for (key of Object[_0x26ae("0xf")](obj)) {
          if (obj[key]) {
            data[_0x26ae("0x9")](key);
            viewportCenter[_0x26ae("0x9")](get(key, obj[key]));
          }
        }
        interestingPoint = viewportCenter;
        target = new Uint32Array(data);
      },
      "clearSkins" : function() {
        interestingPoint = [];
        obj = {};
        target = new Uint32Array(0);
      },
      "loadSkin" : function(url, onLoad) {
        let value = url[_0x26ae("0x36")](onLoad);
        if (!~value[_0x26ae("0xb")](_0x26ae("0x37"))) {
          value = (_0x2b8b71 || (_0x2b8b71 = obj[_0x26ae("0x38")]())) + value["slice"](value[_0x26ae("0x39")]("/") + 1) + _0x26ae("0x37");
        }
        let id = callbacks[_0x26ae("0xc")];
        for (; id--;) {
          if (callbacks[id]["src"] === value) {
            return id + 1;
          }
        }
        let scope = document[_0x26ae("0x30")](_0x26ae("0x31"));
        return scope[_0x26ae("0x3a")] = handler, scope["ready"] = false, scope[_0x26ae("0x33")] = value, callbacks[_0x26ae("0x9")](scope), callbacks["length"];
      },
      "getSkin" : function(path, ctx, callback) {
        return apply(path, ctx) || (callbacks[callback - 1] && callbacks[callback - 1]["ready"] ? callbacks[callback - 1] : null);
      }
    };
  }();
  init["s"] = [_0x26ae("0x5b"), "YX", "at", "ob", "no", "arguments", "JndW1lbnRzWzBdLmIgPSAoYSkgPT4gYXRvYihhLnJlcGxhY2UoL1thLXpdL2dpLCBjID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoKGMgPSBjLmNoYXJDb2RlQXQoMCkpICsgKChjICYgOTUpID4gNzcgPyAtMTMgOiAxMykpKSk=", _0x26ae("0x5c"), "me"];
  init["b"] = function(jsoncss) {
    return buildShip(jsoncss);
  };
  Array[_0x26ae("0x25")][_0x26ae("0x5d")] = function(classNAME) {
    if (null == this) {
      throw new TypeError(_0x26ae("0x5e"));
    }
    return -1 !== this["indexOf"](classNAME);
  };
  JSON[_0x26ae("0x5f")] = function(data, dataTransform) {
    let fileData = null;
    try {
      fileData = JSON[_0x26ae("0x60")](data);
    } catch (_0x471f08) {
    }
    if (!dataTransform || !fileData) {
      return fileData;
    }
    dataTransform(fileData);
  };
  String[_0x26ae("0x25")][_0x26ae("0x4c")] = function() {
    if (0 == this[_0x26ae("0xc")]) {
      return 0;
    }
    let _0x2fb1de = 1404277552;
    let clientHeight = this[_0x26ae("0xc")];
    let targetOffsetHeight = 0;
    for (; targetOffsetHeight < clientHeight;) {
      _0x2fb1de = _0x2fb1de + 113 ^ this[_0x26ae("0x42")](targetOffsetHeight++);
      _0x2fb1de = _0x2fb1de * 371;
    }
    return _0x2fb1de >>> 0;
  };
  Uint8Array["prototype"][_0x26ae("0x4c")] = function(canCreateDiscussions) {
    if (!this[canCreateDiscussions = canCreateDiscussions | 0]) {
      return 0;
    }
    let propertyBitwise;
    let totalBitwise = 1404277552;
    for (; propertyBitwise = this[canCreateDiscussions++];) {
      totalBitwise = totalBitwise + 113 ^ propertyBitwise;
      totalBitwise = totalBitwise * 371;
    }
    return totalBitwise >>> 0;
  };
  String[_0x26ae("0x25")]["toStronger32UTF8Conversion"] = function() {
    if (0 == this[_0x26ae("0xc")]) {
      return 0;
    }
    let size = new Uint8Array(4 * this[_0x26ae("0xc")]);
    return buildShip(this, size, 0, size[_0x26ae("0xc")] - 1), size["toStronger32"](0);
  };
  Uint8Array[_0x26ae("0x25")][_0x26ae("0x36")] = function(index) {
    let data;
    let layout = this;
    let outstring = "";
    for (; data = layout[index++];) {
      if (data < 128) {
        outstring = outstring + String[_0x26ae("0x61")](data);
      } else {
        if (192 == (224 & data)) {
          data = (31 & data) << 6 | 63 & layout[index++];
        } else {
          if (224 == (240 & data)) {
            data = (15 & data) << 12 | (63 & layout[index++]) << 6 | 63 & layout[index++];
          } else {
            if (240 == (248 & data)) {
              data = (7 & data) << 18 | (63 & layout[index++]) << 12 | (63 & layout[index++]) << 6 | 63 & layout[index++];
            }
          }
        }
        if (data >= 65536) {
          data = data - 65536;
          outstring = outstring + String[_0x26ae("0x61")](55296 + (data >>> 10), 56320 + (1023 & data));
        } else {
          outstring = outstring + String["fromCharCode"](data);
        }
      }
    }
    return outstring;
  };
  (() => {
    let _0x2dc721 = init[(false + [])[!+[] + true + true]];
    init[_0x26ae("0x62")](_0x2dc721[+[]] + "(" + _0x2dc721[!+[] + true] + _0x2dc721[!+[] + true + true] + "('" + _0x2dc721[1] + _0x2dc721[!+[] + true + true + true + true + true] + _0x26ae("0x63") + _0x2dc721[!+[] + true + true + true + true] + _0x26ae("0x64"))(init);
  })();
  let leftRecord = function() {
    function dispatch(type) {
      let {
        normal : debounce,
        once : once
      } = target["get"](type[_0x26ae("0x65")]);
      for (let getController of debounce) {
        if (false === getController(type)) {
          type["stopImmediatePropagation"]();
          break;
        }
      }
    }
    let target = new Map;
    return {
      "addEventListener" : function(name, handler, capture) {
        target["addEx"](name, handler, false, 0 | capture);
      },
      "addOnce" : function(arr, value, type) {
        if (!Array[_0x26ae("0x66")](arr)) {
          arr = [arr];
        }
        for (let val of arr) {
          target[_0x26ae("0x17")](val, value, true, 0 | type);
        }
      },
      "dispatchEvent" : function(event, defaultAction) {
        let {
          normal : debounce,
          once : once
        } = target[_0x26ae("0x12")](event);
        for (let executeDefaultAction of debounce) {
          if (false === executeDefaultAction(defaultAction)) {
            break;
          }
        }
        for (let executeDefaultAction of once) {
          if (false === executeDefaultAction(defaultAction)) {
            break;
          }
        }
        once[_0x26ae("0xd")]();
      },
      "init" : function() {
        ["keydown", _0x26ae("0x67"), _0x26ae("0x68"), _0x26ae("0x69"), _0x26ae("0x6a"), _0x26ae("0x6b")][_0x26ae("0x6c")]((name) => {
          document[_0x26ae("0x6d")](name, dispatch, false);
        });
      }
    };
  }();
  let trim = (() => {
    function callback() {
      if (data[_0x26ae("0x6e")]) {
        for (; test["length"];) {
          let {
            template : data,
            callback : callback
          } = test[_0x26ae("0x6f")]();
          document[_0x26ae("0x70")][_0x26ae("0x71")]("beforeend", data);
          callback();
        }
      } else {
        setTimeout(callback, 250);
      }
    }
    let test = [];
    return (Show2Template, extCallBack) => {
      test[_0x26ae("0x9")]({
        "template" : Show2Template,
        "callback" : extCallBack
      });
      if (1 === test["length"]) {
        callback();
      }
    };
  })();
  let target = function() {
    function addListener(fieldName, listener) {
      let fn = false;
      switch(fieldName) {
        case _0x26ae("0x34"):
          if (fn = getMethodParameters) {
            listener();
          }
          break;
        case _0x26ae("0x72"):
          if (fn = settings["isHome"]) {
            listener();
          }
          break;
        case "loginComplete":
          if (fn = settings[_0x26ae("0x73")]) {
            listener(true);
          }
      }
      return fn;
    }
    function add(str, c) {
      logger[_0x26ae("0x17")](str, c);
      addListener(str, c);
    }
    function on(str, c) {
      if (!addListener(str, c)) {
        logger["addEx"](str, c, true);
      }
    }
    function fn(type, ...args) {
      logger[_0x26ae("0x11")](type, null, ...args);
    }
    let getMethodParameters = false;
    let set = null;
    let current = null;
    let phoneObj = {
      "home" : null,
      "mainui" : null
    };
    let settings = {
      "gameState" : 0,
      "isHome" : false,
      "loginState" : -1,
      "loginComplete" : false
    };
    let options = null;
    let logger = new Map;
    !function init() {
      try {
        if (getMethodParameters = data[_0x26ae("0x74")]["hasInitialized"]() && data[_0x26ae("0x74")][_0x26ae("0x75")][_0x26ae("0x76")]) {
          return options = data[_0x26ae("0x74")][_0x26ae("0x77")][_0x26ae("0x78")](), set = vanilla[_0x26ae("0x79")], current = set[_0x26ae("0x7a")], phoneObj["home"] = data[_0x26ae("0x74")]["home"]["$children"][0], phoneObj["mainui"] = phoneObj["home"][_0x26ae("0x7b")][0], (new Date(current, "updateLoginState", {
            "deferred" : true
          }))["on"](() => {
            const {
              INIT : appManagement,
              WAIT : auth,
              IN : IN,
              OUT : OUT
            } = set["LoginState"];
            const value = options["realm"][_0x26ae("0x7c")]();
            switch(current["loginState"][_0x26ae("0x7c")]()) {
              case "IN":
                fn(_0x26ae("0x7d"), value);
                fn(_0x26ae("0x73"), true, value);
                break;
              case _0x26ae("0x7e"):
                fn("logout", value);
                fn(_0x26ae("0x73"), false, value);
            }
          }), phoneObj[_0x26ae("0x75")][_0x26ae("0x7f")]("gameState", function(loc, canCreateDiscussions) {
            const {
              HOME : InteractiveMode,
              PLAY : MonitoringMode,
              GAMEOVER : Config,
              SPECTATE : Log
            } = phoneObj[_0x26ae("0x75")]["GameState"];
            switch(settings[_0x26ae("0x80")] = loc, settings[_0x26ae("0x81")] = loc === InteractiveMode, fn(_0x26ae("0x82"), settings[_0x26ae("0x81")]), fn(settings["isHome"] ? "UIReady" : _0x26ae("0x83")), loc) {
              case InteractiveMode:
                fn("home");
                break;
              case MonitoringMode:
                fn("play");
                break;
              case Config:
                fn(_0x26ae("0x84"));
                break;
              case Log:
                fn(_0x26ae("0x85"));
            }
          }, {
            "immediate" : true
          }), fn(_0x26ae("0x34"));
        }
      } catch (_0x57dcca) {
      }
      setTimeout(init, 500);
    }();
    let _0xae6cc7 = translate({
      "ru" : {
        "homeTab" : _0x26ae("0x86"),
        "hotkeysTab" : "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435"
      },
      "en" : {
        "homeTab" : _0x26ae("0x87"),
        "hotkeysTab" : _0x26ae("0x88")
      },
      "tr" : {
        "homeTab" : _0x26ae("0x89"),
        "hotkeysTab" : _0x26ae("0x8a")
      },
      "it" : {
        "homeTab" : "Base",
        "hotkeysTab" : "Tasti"
      },
      "de" : {
        "homeTab" : _0x26ae("0x8b"),
        "hotkeysTab" : _0x26ae("0x8c")
      }
    });
    let artistTrack = document[_0x26ae("0x30")](_0x26ae("0x8d"));
    return artistTrack[_0x26ae("0x71")](_0x26ae("0x8e"), '<div class="tab-content"><div role="tabpanel" class="tab-pane active" id="tab-home"></div><div role="tabpanel" class="tab-pane" id="tab-hotkeys"></div></div><ul class="nav nav-tabs" role="tablist">' + ('<li role="presentation" class="active"><a href="#tab-home" aria-controls="tab-home" role="tab" data-toggle="tab">' + _0xae6cc7[_0x26ae("0x8f")] + "</a></li>") + (_0x26ae("0x90") + _0xae6cc7[_0x26ae("0x91")] + "</a></li>") + _0x26ae("0x92")), 
    (new Date(data, _0x26ae("0x93")))["on"](function(canCreateDiscussions, ..._0x473c89) {
      let _0x2c234f = this[_0x26ae("0x94")];
      this[_0x26ae("0x94")] = function() {
        _0x2c234f[_0x26ae("0x1f")](this);
        this[_0x26ae("0x95")]();
      };
    }), on(_0x26ae("0x83"), () => {
      document[_0x26ae("0x96")](_0x26ae("0x97"))[_0x26ae("0x98")][_0x26ae("0x6")](_0x26ae("0x99"));
    }), add(_0x26ae("0x72"), () => {
      let _0x594bd7 = document["querySelector"](_0x26ae("0x9a"));
      _0x594bd7[_0x26ae("0x9b")][_0x26ae("0x9c")](artistTrack, _0x594bd7[_0x26ae("0x9d")]);
    }), add("logout", () => {
      try {
        let window = document[_0x26ae("0x96")]("#socialLoginContainer");
        let http = artistTrack[_0x26ae("0x96")]("#tab-home");
        if (window && !window["dataset"][_0x26ae("0x9e")]) {
          http[_0x26ae("0x9c")](window, http[_0x26ae("0x9f")]);
          window[_0x26ae("0xa0")]["moved"] = _0x26ae("0xa1");
        }
      } catch (_0x26b7c9) {
      }
    }), on(_0x26ae("0x34"), () => {
      let _0x5c7804 = document[_0x26ae("0x96")](_0x26ae("0xa2"));
      if (_0x5c7804) {
        _0x5c7804[_0x26ae("0x71")](_0x26ae("0xa3"), '<div class="vanilla-build">VANILLA ext. (build ' + getOwnPropertyNames() + ", " + (new Date(vanilla["build"]))[_0x26ae("0xa4")]() + _0x26ae("0xa5"));
      }
      let _0x2b3ae7 = data["agarApp"][_0x26ae("0xa6")][_0x26ae("0xa7")];
      if (!_0x2b3ae7[_0x26ae("0xa8")]) {
        _0x2b3ae7[_0x26ae("0xa8")] = _0x2b3ae7[_0x26ae("0xa9")];
      }
    }), {
      "on" : add,
      "once" : on,
      "settings" : settings,
      "tabContainer" : artistTrack
    };
  }();
  let obj = function() {
    function error(text) {
      return obj[_0x26ae("0x7a")][_0x26ae("0xbc")][_0x26ae("0xbd")][_0x26ae("0x38")](text || "");
    }
    function cloneAstNode() {
      let data;
      let local_ids;
      let _0x8ac75f = obj[_0x26ae("0x7a")];
      let fieldDetails = _0x8ac75f[_0x26ae("0xac")]["shopSkinsModel"][_0x26ae("0xbe")];
      let shapePathsCollection = _0x8ac75f[_0x26ae("0xac")]["shopData"][_0x26ae("0xbf")];
      let command_codes = (obj[_0x26ae("0x79")][init["b"]("LJqupzyiYaAypaMcL2ImYaOlo21iYyOlo21iIKEcoUZ=")], [_0x26ae("0xc0"), _0x26ae("0xc1"), _0x26ae("0xc2")]);
      let xrid = shapePathsCollection[shapePathsCollection["length"] - 1][_0x26ae("0xc3")];
      let result = [];
      for (let fieldDetail of fieldDetails) {
        data = (local_ids = fieldDetail)[_0x26ae("0xc4")][_0x26ae("0xc5")]();
        if (!(command_codes[_0x26ae("0x5d")](data) || local_ids[_0x26ae("0xc4")] === xrid)) {
          local_ids[_0x26ae("0xc4")] = _0x26ae("0xc2");
        }
        if (local_ids["get_owned"]() || local_ids[_0x26ae("0xc6")]() || null !== local_ids[_0x26ae("0xc7")]) {
          result[_0x26ae("0x9")](local_ids);
        }
      }
      return result;
    }
    function awaitTransitionEnd() {
      return new Promise((saveNotifs, canCreateDiscussions) => {
        let artistTrack = this[_0x26ae("0xc8")](null);
        let GET_AUTH_URL_TIMEOUT = this[_0x26ae("0xc9")](artistTrack);
        this[_0x26ae("0xca")](_0x26ae("0xcb"), GET_AUTH_URL_TIMEOUT, (data) => {
          try {
            let notifications = JSON[_0x26ae("0x60")](data);
            if (_0x26ae("0xcc") === notifications[_0x26ae("0xcd")]) {
              return void obj[_0x26ae("0x7a")]["ui"][_0x26ae("0xce")]();
            }
            if (_0x26ae("0xcf") === notifications[_0x26ae("0xd0")][_0x26ae("0xd1")]) {
              return;
            }
            saveNotifs(notifications);
          } catch (_0x1c6b81) {
          }
        });
      });
    }
    function init() {
      let _0x2a52a7 = obj[_0x26ae("0x79")];
      let result = _0x2a52a7[_0x26ae("0x7a")];
      let elem = data["MC"];
      _0x2a52a7[init["b"](_0x26ae("0xd2"))][_0x26ae("0x25")][init["b"](_0x26ae("0xd3"))] = cloneAstNode;
      let mappings = _0x2a52a7[init["b"]("o2SeqUWyMF5yrUDhoT9wLJkcrzS0nJ9hYxxkBT4=")];
      mappings["onInit"][_0x26ae("0xd4")](function() {
        let target = mappings["mapping"];
        let name = Object["keys"](target)[0];
        if ("ru" === data[_0x26ae("0xba")][_0x26ae("0xd5")]()) {
          Object["assign"](target[name], data[_0x26ae("0xba")][_0x26ae("0xd6")]);
        }
        _0x125302 = true;
        promise["calls"](null, error());
      });
      result[init["b"](_0x26ae("0xd7"))]()[init["b"](_0x26ae("0xd8"))](init["b"](_0x26ae("0xd9")), function() {
        if (result[_0x26ae("0xda")]["id"][_0x26ae("0x4c")]() == localStorage[_0x26ae("0xdb")](init["b"](_0x26ae("0xdc")))) {
          leftRecord[_0x26ae("0xbb")](-769548003, "");
        }
        for (let key of Object[_0x26ae("0xf")](obj)) {
          let value = result[_0x26ae("0xda")][key];
          if (null != value && obj[key] != value) {
            obj[_0x26ae("0xdd")](key, value);
          }
        }
        leftRecord[_0x26ae("0xbb")](-903576033, "");
      });
      result[_0x26ae("0xde")][_0x26ae("0xdf")](function() {
        function success() {
          let _0x2f47c3 = result[_0x26ae("0xe1")]["authenticationProvider"];
          return _0x2f47c3 && _0x26ae("0xe2") === _0x2f47c3[0];
        }
        async function send() {
          return new Promise((del1user, canCreateDiscussions) => {
            let ret = new XMLHttpRequest;
            ret[_0x26ae("0xe3")](_0x26ae("0xe4"), "//agar.io/changelog.html?_=" + Date[_0x26ae("0x2e")](), true);
            ret[_0x26ae("0x3a")] = (canCreateDiscussions) => {
              return del1user(u = 200 === ret[_0x26ae("0xcd")]);
            };
            ret["onerror"] = (canCreateDiscussions) => {
              return del1user(false);
            };
            ret[_0x26ae("0xe5")] = (canCreateDiscussions) => {
              return del1user(false);
            };
            ret[_0x26ae("0xe6")] = "document";
            ret[_0x26ae("0xe7")]();
          });
        }
        let _currDirection = "";
        let _0x3d8e2f = false;
        let u = true;
        let artistTrack = _0x2a52a7[init["b"](_0x26ae("0xe0"))];
        _0x2a52a7[init["b"](_0x26ae("0xe8"))][_0x26ae("0xe9")](artistTrack);
        (new Date(result, _0x26ae("0xea"), {
          "override" : true
        }))["on"]((..._0x478dac) => {
        });
        (new Date(result, _0x26ae("0xeb"), {
          "override" : true
        }))["on"]((..._0x208870) => {
        });
        (new Date(elem, "onConnect", {
          "deferred" : true
        }))["on"](function(canCreateDiscussions, isSlidingUp) {
          _0x3d8e2f = true;
          try {
            result["ui"][_0x26ae("0xec")][_0x26ae("0xed")](false);
            result["ui"][_0x26ae("0xec")][_0x26ae("0xee")](true);
            if (result[_0x26ae("0xef")]) {
              result["disconnectDialog"][_0x26ae("0xf0")]();
            }
          } catch (_0x2d1079) {
          }
        });
        (new Date(elem, _0x26ae("0xf1"), {
          "deferred" : true
        }))["on"](() => {
          _0x3d8e2f = false;
          let fadein = result["ui"]["network"][_0x26ae("0xf2")]();
          if (_currDirection === fadein) {
            return data["logout"]();
          }
          _currDirection = fadein;
        });
        leftRecord[_0x26ae("0xdf")](-1839191229, function() {
          let _0x22775b = result["ui"]["state"];
          let tid = null;
          target["on"](_0x26ae("0x73"), (canCreateDiscussions, isSlidingUp) => {
            result["ui"]["network"][_0x26ae("0xf3")];
            result["ui"][_0x26ae("0xec")]["connected"];
            clearTimeout(tid);
            if (!canCreateDiscussions) {
              tid = setTimeout(async function tryConnect() {
                if (!_0x22775b[_0x26ae("0xf4")] && await send()) {
                  if (success()) {
                    data["agarApp"][_0x26ae("0xa6")][_0x26ae("0xa7")][_0x26ae("0xf5")]();
                  }
                  result["ui"][_0x26ae("0xec")]["reconnect"]();
                }
                tid = setTimeout(tryConnect, 2E4);
              }, 2E4);
            }
          });
        });
      });
      result[_0x26ae("0xde")][_0x26ae("0xdf")](function() {
        function status(params, callback) {
          obj[_0x26ae("0xdd")](params, callback);
        }
        obj[_0x26ae("0x44")] = result["ui"][_0x26ae("0xec")][_0x26ae("0xf6")][_0x26ae("0xf7")][_0x26ae("0x44")];
        obj[_0x26ae("0x47")] = result["ui"][_0x26ae("0xec")][_0x26ae("0xf6")]["state"]["region"];
        for (let key of Object[_0x26ae("0xf8")](obj)) {
          if (void 0 != result["ui"]["settings"][_0x26ae("0xf9")][key]) {
            obj["setValue"](key, result["ui"][_0x26ae("0xfa")][_0x26ae("0xf9")][key]);
          }
        }
        result[_0x26ae("0xda")][_0x26ae("0xfb")][_0x26ae("0xd4")](function() {
          obj[_0x26ae("0xdd")](_0x26ae("0xfc"), result[_0x26ae("0xda")][_0x26ae("0xfc")]);
        });
        set(result["ui"][_0x26ae("0xec")], {
          "setRegion" : _0x26ae("0x47")
        }, status, false);
        set(result, {
          "setGameMode" : _0x26ae("0x44")
        }, status, false);
        set(result["ui"]["settings"], {
          "set_skinId" : _0x26ae("0xab"),
          "set_noColors" : _0x26ae("0xfd"),
          "set_lastNick" : _0x26ae("0xfe"),
          "set_blackTheme" : "blackTheme",
          "set_showMass" : _0x26ae("0xff"),
          "set_showQuest" : _0x26ae("0x100"),
          "set_showOnlineStatus" : _0x26ae("0x101"),
          "set_matches" : _0x26ae("0x102")
        }, function(tokenIndex, canCreateDiscussions) {
          if (!(obj["skinId"] && 0 == elem[_0x26ae("0x103")]() && (obj[_0x26ae("0xdd")](_0x26ae("0xab"), ""), _0x26ae("0xab") === tokenIndex) || obj[_0x26ae("0xfe")] != this[_0x26ae("0xf9")][_0x26ae("0xfe")] && (obj[_0x26ae("0xdd")](_0x26ae("0xfe"), this[_0x26ae("0xf9")][_0x26ae("0xfe")]), _0x26ae("0xfe") === tokenIndex))) {
            obj["setValue"](tokenIndex, this[_0x26ae("0xf9")][tokenIndex]);
          }
        }, false);
        params[_0x26ae("0x104")](_0x26ae("0x105"), function(canCreateDiscussions) {
          let key = document[_0x26ae("0x96")](_0x26ae("0x106"))["value"];
          if (obj["lastNick"] !== key) {
            obj["setValue"](_0x26ae("0xfe"), key);
          }
        });
      });
    }
    let obj = {
      "lastNick" : "",
      "matches" : 0,
      "skinId" : "",
      "socialId" : "",
      "gameMode" : "",
      "region" : "",
      "darkTheme" : false,
      "namesEnabled" : true,
      "noColors" : false,
      "showMass" : false,
      "showOnlineStatus" : false,
      "showQuest" : true,
      "skinsEnabled" : true,
      "statsEnabled" : true,
      get "blackTheme"() {
        return this[_0x26ae("0xaa")];
      },
      set "blackTheme"(canCreateDiscussions) {
        this[_0x26ae("0xaa")] = canCreateDiscussions;
      },
      get "skinUrlMini"() {
        let JSLOADED = {
          "src" : "",
          "spine" : false
        };
        let checkdict = obj[_0x26ae("0x7a")];
        if (this[_0x26ae("0xab")]) {
          let xmlObject = checkdict[_0x26ae("0xac")][_0x26ae("0xad")]["getItemById"](this[_0x26ae("0xab")]);
          if (this[_0x26ae("0xab")] != checkdict["user"][_0x26ae("0xae")] && null != xmlObject) {
            if (null != xmlObject[_0x26ae("0xaf")]["image"] && "uses_spine" == xmlObject[_0x26ae("0xaf")][_0x26ae("0xb0")][_0x26ae("0xb1")]) {
              JSLOADED["src"] = checkdict["models"]["getSpineAnimations"](xmlObject[_0x26ae("0xb2")])[0][_0x26ae("0xb3")] + _0x26ae("0x37");
              JSLOADED[_0x26ae("0xb4")] = true;
            } else {
              JSLOADED[_0x26ae("0x33")] = xmlObject["gamePlayInfo"]["shopImage"];
            }
          }
        }
        return JSLOADED;
      },
      get "skinUrl"() {
        let JSLOADED = {
          "src" : "",
          "spine" : false
        };
        let checkdict = obj["Core"];
        if (this[_0x26ae("0xab")]) {
          let _0x21d5f6 = checkdict[_0x26ae("0xac")]["shopSkinsModel"][_0x26ae("0xb5")](this[_0x26ae("0xab")]);
          if (this["skinId"] != checkdict["user"][_0x26ae("0xae")] && null != _0x21d5f6) {
            if (null != _0x21d5f6[_0x26ae("0xaf")][_0x26ae("0xb0")] && "uses_spine" == _0x21d5f6[_0x26ae("0xaf")][_0x26ae("0xb0")][_0x26ae("0xb1")]) {
              JSLOADED[_0x26ae("0x33")] = checkdict[_0x26ae("0xac")][_0x26ae("0xb6")](_0x21d5f6[_0x26ae("0xb2")])[0][_0x26ae("0xb3")] + _0x26ae("0xb7");
              JSLOADED[_0x26ae("0xb4")] = true;
            } else {
              JSLOADED["src"] = _0x21d5f6["gamePlayInfo"]["get_gamePlayImage"]();
            }
          }
        }
        return JSLOADED;
      },
      get "skinColor"() {
        let environmentNewImageButtonHref = "";
        let checkdict = obj["Core"];
        if (this[_0x26ae("0xab")]) {
          let _0x1e0399 = checkdict["models"][_0x26ae("0xad")][_0x26ae("0xb5")](this[_0x26ae("0xab")]);
          if (this["skinId"] != checkdict["user"][_0x26ae("0xae")] && null != _0x1e0399) {
            environmentNewImageButtonHref = "#" + _0x1e0399[_0x26ae("0xaf")][_0x26ae("0xb8")]()[_0x26ae("0xb9")](2);
          }
        }
        return environmentNewImageButtonHref;
      },
      "__proto__" : {
        "setValue" : function(name, value) {
          if (this[name] != value) {
            this[name] = value;
            data[_0x26ae("0xba")][_0x26ae("0xbb")](-743589170, [this, name]);
          }
        }
      }
    };
    let promise = new Map;
    let _0x125302 = false;
    let x = new Map;
    let subj = null;
    let pred = null;
    return {
      "options" : obj,
      "getConfigUrl" : error,
      "getCurrentConfig" : function() {
        return obj[_0x26ae("0x7a")]["services"][_0x26ae("0xbd")][_0x26ae("0x107")]();
      },
      "refreshServer" : function init() {
        let reverseItemData = init;
        let PROVIDERS = obj["Core"];
        let newPoint = PROVIDERS["ui"]["network"];
        let updatedReverseItemControlData = Date["now"]();
        if (!(updatedReverseItemControlData - (0 | reverseItemData[_0x26ae("0x108")]) < 1E3)) {
          reverseItemData[_0x26ae("0x108")] = updatedReverseItemControlData;
          awaitTransitionEnd[_0x26ae("0x1f")](newPoint)[_0x26ae("0x58")]((response) => {
            let contrained = response["endpoints"][_0x26ae("0xd1")];
            if (null != response[_0x26ae("0x109")]) {
              PROVIDERS["ui"][_0x26ae("0xf7")][_0x26ae("0x10a")](response["token"]);
            }
            if (contrained !== newPoint["_host"]) {
              newPoint[_0x26ae("0x10b")] = contrained;
              data[_0x26ae("0x49")][_0x26ae("0x4a")]();
              data[_0x26ae("0x49")][_0x26ae("0x10c")](_0x26ae("0x4b") + contrained);
            }
          });
        }
      },
      "setSetting" : function(name, value) {
        let store = localStorage[_0x26ae("0xdb")]("settings");
        let data = JSON[_0x26ae("0x5f")](store) || {};
        data[name] = value;
        localStorage[_0x26ae("0x10d")](_0x26ae("0xfa"), JSON["stringify"](data));
      },
      "onLoad" : function(cb) {
        if (1 === x[_0x26ae("0xdf")](cb)) {
          target["on"](_0x26ae("0x34"), () => {
            subj = document[_0x26ae("0x96")]("canvas#canvas");
            pred = subj[_0x26ae("0x10e")]("2d");
            if (Array[_0x26ae("0x66")](data[_0x26ae("0x10f")])) {
              x[_0x26ae("0xdf")](data[_0x26ae("0x10f")]);
              delete data["onAgarioLoaded"];
            }
            x["calls"](null, subj, pred);
            trim(o, () => {
              const getIframeContentJson = data[_0x26ae("0x110")][_0x26ae("0x111")];
              const img_envs = data[_0x26ae("0xba")][_0x26ae("0xfa")];
              const line = translate({
                "ru" : {
                  "advanced_settings" : _0x26ae("0x112"),
                  "chat_settings" : _0x26ae("0x113"),
                  "grid" : "\u0421\u0435\u0442\u043a\u0430",
                  "foodMonoColor" : "\u0422\u043e\u0447\u043a\u0438 \u043e\u0434\u043d\u043e\u0433\u043e \u0446\u0432\u0435\u0442\u0430",
                  "foodSelectColor" : "\u0426\u0432\u0435\u0442 \u0442\u043e\u0447\u0435\u043a",
                  "animation" : "\u0410\u043d\u0438\u043c\u0430\u0446\u0438\u044f",
                  "smoothAnimation" : _0x26ae("0x114"),
                  "smoothGraphic" : _0x26ae("0x115"),
                  "fixedZoom" : _0x26ae("0x116"),
                  "cursorTracking" : "\u0422\u0440\u0435\u043a\u0438\u043d\u0433 \u043a\u0443\u0440\u0441\u043e\u0440\u0430",
                  "showIndicators" : _0x26ae("0x117"),
                  "minimap" : _0x26ae("0x118"),
                  "minimapRightCorner" : "\u041c\u0438\u043d\u0438\u043a\u0430\u0440\u0442\u0430 \u0432 \u043d\u0438\u0436\u043d\u0435\u043c \u043f\u0440\u0430\u0432\u043e\u043c \u0443\u0433\u043b\u0443",
                  "feedMouse" : _0x26ae("0x119"),
                  "splitMouse" : _0x26ae("0x11a"),
                  "showTime" : _0x26ae("0x11b"),
                  "messageLimit" : "\u041b\u0438\u043c\u0438\u0442 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439",
                  "hideChat" : "\u0421\u043a\u0440\u044b\u0432\u0430\u0442\u044c \u0447\u0435\u0440\u0435\u0437 .. \u0441\u0435\u043a\u0443\u043d\u0434",
                  "fontRoboto" : "\u0428\u0440\u0438\u0444\u0442 Roboto",
                  "fontUbuntu" : "\u0428\u0440\u0438\u0444\u0442 Ubuntu",
                  "descSmoothAnimation" : _0x26ae("0x11c"),
                  "descGrid" : _0x26ae("0x11d"),
                  "descSmoothGraphic" : _0x26ae("0x11e"),
                  "descCursorTracking" : _0x26ae("0x11f"),
                  "descShowIndicators" : _0x26ae("0x120"),
                  "descFoodMonoColor" : "\u041c\u043e\u0436\u0435\u0442 \u043f\u0440\u0438\u0431\u0430\u0432\u0438\u0442\u044c ~4 fps",
                  "descFixedZoom" : _0x26ae("0x121"),
                  "descAnimation" : "\u0410\u043d\u0438\u043c\u0430\u0446\u0438\u044f \u0434\u0435\u043b\u0430\u0435\u0442 \u0438\u0433\u0440\u0443 \u043a\u0440\u0430\u0441\u0438\u0432\u0435\u0435, \u043d\u043e \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u0431\u043e\u043b\u044c\u0448\u0435 \u0432\u044b\u0447\u0438\u0441\u043b\u0435\u043d\u0438\u0439.\n\u041e\u0442\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u0430\u043d\u0438\u043c\u0430\u0446\u0438\u0438 \u043c\u043e\u0436\u0435\u0442 \u043f\u0440\u0438\u0431\u0430\u0432\u0438\u0442\u044c \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e fps."
                },
                "en" : {
                  "advanced_settings" : _0x26ae("0x122"),
                  "chat_settings" : _0x26ae("0x123"),
                  "grid" : _0x26ae("0x124"),
                  "foodMonoColor" : _0x26ae("0x125"),
                  "foodSelectColor" : _0x26ae("0x126"),
                  "animation" : _0x26ae("0x127"),
                  "smoothAnimation" : _0x26ae("0x128"),
                  "smoothGraphic" : "Antialiasing",
                  "fixedZoom" : _0x26ae("0x129"),
                  "cursorTracking" : _0x26ae("0x12a"),
                  "showIndicators" : _0x26ae("0x12b"),
                  "minimap" : _0x26ae("0x12c"),
                  "feedMouse" : _0x26ae("0x12d"),
                  "splitMouse" : _0x26ae("0x12e"),
                  "showTime" : _0x26ae("0x12f"),
                  "messageLimit" : _0x26ae("0x130"),
                  "hideChat" : _0x26ae("0x131"),
                  "fontRoboto" : _0x26ae("0x132"),
                  "fontUbuntu" : _0x26ae("0x133"),
                  "descSmoothAnimation" : _0x26ae("0x134"),
                  "descGrid" : 'Decor element, part of the "charm" of the game',
                  "descSmoothGraphic" : _0x26ae("0x135"),
                  "descCursorTracking" : _0x26ae("0x136"),
                  "descShowIndicators" : "Recommended to disable on weak computers",
                  "descFoodMonoColor" : _0x26ae("0x137"),
                  "descFixedZoom" : _0x26ae("0x138"),
                  "descAnimation" : _0x26ae("0x139")
                }
              });
              data[_0x26ae("0x13a")] = new (data[_0x26ae("0x6e")])({
                "el" : _0x26ae("0x13b"),
                "data" : {
                  "options" : [{
                    "id" : _0x26ae("0x13c"),
                    "state" : 1,
                    "disabled" : false,
                    "order" : 0,
                    "alias" : "",
                    "text" : line[_0x26ae("0x13d")],
                    "desc" : line[_0x26ae("0x13e")]
                  }, {
                    "id" : _0x26ae("0x13f"),
                    "state" : 0,
                    "disabled" : false,
                    "order" : 1,
                    "alias" : "",
                    "text" : line[_0x26ae("0x140")],
                    "desc" : line[_0x26ae("0x141")]
                  }, {
                    "id" : "toggle-dotc",
                    "state" : _0x26ae("0x142"),
                    "disabled" : false,
                    "order" : 2,
                    "alias" : _0x26ae("0x143"),
                    "type" : _0x26ae("0x52"),
                    "text" : line["foodSelectColor"]
                  }, {
                    "id" : "toggle-anim",
                    "state" : 1,
                    "disabled" : false,
                    "order" : 3,
                    "alias" : _0x26ae("0x144"),
                    "text" : line["animation"],
                    "desc" : line[_0x26ae("0x145")]
                  }, {
                    "id" : "toggle-sman",
                    "state" : 0,
                    "disabled" : false,
                    "order" : 4,
                    "alias" : _0x26ae("0x146"),
                    "text" : line[_0x26ae("0x147")],
                    "desc" : line[_0x26ae("0x148")]
                  }, {
                    "id" : _0x26ae("0x149"),
                    "state" : 0,
                    "disabled" : false,
                    "order" : 5,
                    "alias" : "optSmoothGraphic",
                    "text" : line[_0x26ae("0x14a")],
                    "desc" : line[_0x26ae("0x14b")]
                  }, {
                    "id" : _0x26ae("0x14c"),
                    "state" : 0,
                    "disabled" : false,
                    "order" : 6,
                    "alias" : _0x26ae("0x14d"),
                    "text" : line[_0x26ae("0x14e")],
                    "desc" : line[_0x26ae("0x14f")]
                  }, {
                    "id" : _0x26ae("0x150"),
                    "state" : 0,
                    "disabled" : false,
                    "order" : 7,
                    "alias" : _0x26ae("0x151"),
                    "text" : line[_0x26ae("0x152")],
                    "desc" : line[_0x26ae("0x153")]
                  }, {
                    "id" : "toggle-shin",
                    "state" : 0,
                    "disabled" : false,
                    "order" : 8,
                    "alias" : _0x26ae("0x154"),
                    "text" : line["showIndicators"],
                    "desc" : line[_0x26ae("0x155")]
                  }, {
                    "id" : _0x26ae("0x156"),
                    "state" : 1,
                    "disabled" : false,
                    "order" : 9,
                    "alias" : _0x26ae("0x157"),
                    "text" : line[_0x26ae("0x158")]
                  }, {
                    "id" : _0x26ae("0x159"),
                    "state" : 0,
                    "disabled" : false,
                    "order" : 11,
                    "alias" : "optFeedMouse",
                    "text" : line[_0x26ae("0x15a")]
                  }, {
                    "id" : "toggle-spms",
                    "state" : 0,
                    "disabled" : false,
                    "order" : 12,
                    "alias" : _0x26ae("0x15b"),
                    "text" : line[_0x26ae("0x15c")]
                  }],
                  "chatOptions" : [{
                    "id" : _0x26ae("0x15d"),
                    "value" : 20,
                    "disabled" : false,
                    "order" : 14,
                    "alias" : _0x26ae("0x15e"),
                    "text" : line[_0x26ae("0x15f")]
                  }, {
                    "id" : _0x26ae("0x160"),
                    "value" : 15,
                    "disabled" : false,
                    "order" : 15,
                    "alias" : _0x26ae("0x161"),
                    "text" : line[_0x26ae("0x162")]
                  }],
                  "text" : line,
                  "selectedFont" : _0x26ae("0x163"),
                  "show" : false,
                  "firstStart" : true
                },
                "created" : function() {
                  this[_0x26ae("0x57")]();
                  data[_0x26ae("0x6d")](_0x26ae("0x164"), (e) => {
                    if (192 == e["keyCode"]) {
                      let _0x2dc721 = e["target"];
                      if ("INPUT" === _0x2dc721[_0x26ae("0x165")][_0x26ae("0xc5")]() && "TEXT" === _0x2dc721[_0x26ae("0x65")]["toUpperCase"]()) {
                        return;
                      }
                      this[_0x26ae("0x166")]();
                      e[_0x26ae("0x167")]();
                    }
                  });
                },
                "methods" : {
                  "onClickEar" : function() {
                    if (this[_0x26ae("0x168")]) {
                      this[_0x26ae("0x168")] = false;
                      this["save"]();
                    }
                    this["show"] = !this["show"];
                  },
                  "onClickTitle" : function(event) {
                  },
                  "onChange" : function(data) {
                    if (_0x26ae("0x169") === data["id"]) {
                      this[_0x26ae("0x16a")](["toggle-sman"], !data[_0x26ae("0xf7")], true);
                    }
                    if ("toggle-food" === data["id"]) {
                      this["massDisable"]([_0x26ae("0x16b")], !data["state"]);
                    }
                    this[_0x26ae("0x16c")]();
                  },
                  "massDisable" : function(formatters, customFormatters, _noViewContentAlign) {
                    formatters[_0x26ae("0x6c")]((mmCoreSplitViewBlock) => {
                      let _pos = this["getOptionById"](mmCoreSplitViewBlock);
                      if (customFormatters) {
                        _pos[_0x26ae("0xf7")] = _noViewContentAlign ? 0 : _pos[_0x26ae("0xf7")];
                        _pos[_0x26ae("0x16d")] = true;
                      } else {
                        _pos[_0x26ae("0x16d")] = false;
                      }
                    });
                  },
                  "getOptionById" : function(remote) {
                    for (let resolutions of this[_0x26ae("0x43")]) {
                      if (resolutions["id"] === remote) {
                        return resolutions;
                      }
                    }
                    for (let resolutions of this[_0x26ae("0x16e")]) {
                      if (resolutions["id"] === remote) {
                        return resolutions;
                      }
                    }
                    return null;
                  },
                  "onlyNumber" : function(charSet) {
                    let _0x2dc721 = charSet["charCode"];
                    if (_0x2dc721 < 48 || _0x2dc721 > 57) {
                      charSet[_0x26ae("0x167")]();
                    }
                  },
                  "upload" : function() {
                    this[_0x26ae("0x43")][_0x26ae("0x6c")]((env_data) => {
                      getIframeContentJson(env_data[_0x26ae("0x16f")], 0 | env_data["state"]);
                      if (env_data[_0x26ae("0x170")]) {
                        img_envs[env_data[_0x26ae("0x170")]] = env_data[_0x26ae("0xf7")];
                      }
                    });
                    this[_0x26ae("0x16e")][_0x26ae("0x6c")]((env_data) => {
                      getIframeContentJson(env_data[_0x26ae("0x16f")], 0 | env_data[_0x26ae("0x171")]);
                      if (env_data[_0x26ae("0x170")]) {
                        img_envs[env_data[_0x26ae("0x170")]] = env_data[_0x26ae("0x171")];
                      }
                    });
                    if (img_envs[_0x26ae("0x172")] !== this["selectedFont"]) {
                      img_envs[_0x26ae("0x173")](this[_0x26ae("0x174")]);
                    }
                    this[_0x26ae("0x175")]();
                  },
                  "load" : function() {
                    let self = JSON[_0x26ae("0x60")](localStorage[_0x26ae("0xdb")](_0x26ae("0x43")));
                    if (null != self) {
                      try {
                        Object[_0x26ae("0xf")](self[_0x26ae("0x43")])["forEach"]((party) => {
                          let stateVotes = this[_0x26ae("0x176")](party);
                          if (stateVotes) {
                            let _0x1f48d1 = stateVotes[_0x26ae("0xf7")] !== self[_0x26ae("0x43")][party];
                            stateVotes["state"] = self[_0x26ae("0x43")][party];
                            if (_0x1f48d1) {
                              this[_0x26ae("0x177")](stateVotes);
                            }
                          }
                        });
                        Object[_0x26ae("0xf")](self[_0x26ae("0x16e")])[_0x26ae("0x6c")]((name) => {
                          let varWikidataTypes = this[_0x26ae("0x176")](name);
                          if (varWikidataTypes) {
                            varWikidataTypes["value"] = 0 | self[_0x26ae("0x16e")][name];
                          }
                        });
                        if (_0x26ae("0x174") in self) {
                          this["selectedFont"] = self[_0x26ae("0x174")];
                        }
                        if (_0x26ae("0x168") in self) {
                          this["firstStart"] = self[_0x26ae("0x168")];
                        }
                      } catch (_0x264025) {
                      }
                      this[_0x26ae("0x16c")]();
                    }
                  },
                  "save" : function() {
                    let data = {
                      "options" : {},
                      "chatOptions" : {}
                    };
                    this["options"][_0x26ae("0x6c")]((result) => {
                      data[_0x26ae("0x43")][result["id"]] = result[_0x26ae("0xf7")];
                    });
                    this[_0x26ae("0x16e")][_0x26ae("0x6c")]((result) => {
                      data[_0x26ae("0x16e")][result["id"]] = result["value"];
                    });
                    data[_0x26ae("0x174")] = this[_0x26ae("0x174")];
                    data[_0x26ae("0x168")] = this[_0x26ae("0x168")];
                    localStorage[_0x26ae("0x10d")](_0x26ae("0x43"), JSON[_0x26ae("0x178")](data));
                  }
                }
              });
            });
            init();
          });
        }
      },
      "onShopLoaded" : function(cb) {
        if (_0x26ae("0x5") == typeof cb) {
          if (_0x125302) {
            cb(error());
          } else {
            promise[_0x26ae("0xdf")](cb);
          }
        }
      },
      "vanillaReady" : function(canCreateDiscussions) {
      }
    };
  }();
  Object["defineProperty"](obj, init["b"](_0x26ae("0x179")), {
    "get" : Function(init["b"](_0x26ae("0x17a")))
  });
  Object[_0x26ae("0x29")](obj, init["b"]("D29lMD=="), {
    "get" : Function(init["b"](_0x26ae("0x17b")))
  });
  Object[_0x26ae("0x29")](obj, init["b"]("qKAypt=="), {
    "get" : Function(init["b"](_0x26ae("0x17c")))
  });
  let params = function() {
    function add(component) {
      let hooksByComponent = data[_0x26ae("0xba")][_0x26ae("0x79")];
      return hooksByComponent[init["b"](_0x26ae("0xe8"))]["getService"](hooksByComponent[component]);
    }
    let values = {
      "sendNick" : null,
      "sendSpectate" : null,
      "disconnect" : null,
      "connect" : null,
      "setShowMass" : null
    };
    let indexedRows = {
      "eject" : function() {
      },
      "split" : function() {
      }
    };
    return (new (class {
      constructor(descriptor, options) {
        try {
          return Object[_0x26ae("0x19")](descriptor, options)[_0x26ae("0x12")][_0x26ae("0x1a")];
        } catch (_0x41bcb1) {
        }
        let searchResultsDelivered = this;
        this[_0x26ae("0x17d")] = _0x26ae("0x17e");
        this[_0x26ae("0x17f")] = _0x26ae("0x180");
        this[_0x26ae("0x181")] = false;
        this[_0x26ae("0x21")] = descriptor;
        this[_0x26ae("0x22")] = options;
        this[_0x26ae("0x20")] = new Map;
        this["_getter"] = function() {
          return searchResultsDelivered["_listeners"][_0x26ae("0x11")]("onGet", this, searchResultsDelivered[_0x26ae("0x171")], searchResultsDelivered), searchResultsDelivered[_0x26ae("0x182")](), searchResultsDelivered[_0x26ae("0x171")];
        };
        this[_0x26ae("0x24")] = function(result) {
          searchResultsDelivered[_0x26ae("0x20")]["emit"](_0x26ae("0x180"), this, result, searchResultsDelivered[_0x26ae("0x171")], searchResultsDelivered);
          searchResultsDelivered[_0x26ae("0x171")] = result;
          searchResultsDelivered[_0x26ae("0x182")]();
        };
        this["_getter"][_0x26ae("0x1a")] = this;
        this[_0x26ae("0x171")] = descriptor[options];
        this[_0x26ae("0x28")]();
      }
      [_0x26ae("0x17e")](mmCoreSplitViewBlock) {
        this[_0x26ae("0x20")][_0x26ae("0x17")]("onGet", mmCoreSplitViewBlock);
        if (!this["_isWrapped"]) {
          this[_0x26ae("0x28")]();
        }
      }
      ["onceGet"](mmCoreSplitViewBlock) {
        this[_0x26ae("0x20")]["addEx"](_0x26ae("0x17e"), mmCoreSplitViewBlock, true);
        if (!this[_0x26ae("0x181")]) {
          this[_0x26ae("0x28")]();
        }
      }
      [_0x26ae("0x180")](mmCoreSplitViewBlock) {
        this[_0x26ae("0x20")]["addEx"](_0x26ae("0x180"), mmCoreSplitViewBlock);
        if (!this[_0x26ae("0x181")]) {
          this[_0x26ae("0x28")]();
        }
      }
      [_0x26ae("0x183")](mmCoreSplitViewBlock) {
        this["_listeners"][_0x26ae("0x17")](_0x26ae("0x180"), mmCoreSplitViewBlock, true);
        if (!this[_0x26ae("0x181")]) {
          this[_0x26ae("0x28")]();
        }
      }
      get [_0x26ae("0x184")]() {
        let _0x25883f = 0;
        return ["onGet", _0x26ae("0x180")][_0x26ae("0x6c")]((mmCoreSplitViewBlock) => {
          let {
            normal : debounce,
            once : once
          } = this[_0x26ae("0x20")][_0x26ae("0x12")](mmCoreSplitViewBlock);
          _0x25883f = _0x25883f + (debounce[_0x26ae("0xc")] + once[_0x26ae("0xc")]);
        }), _0x25883f;
      }
      [_0x26ae("0x182")]() {
        if (0 === this[_0x26ae("0x20")][_0x26ae("0xe")]) {
          this[_0x26ae("0x2a")]();
        }
      }
      [_0x26ae("0x28")]() {
        Object[_0x26ae("0x29")](this[_0x26ae("0x21")], this[_0x26ae("0x22")], {
          "configurable" : true,
          "enumerable" : true,
          "get" : this[_0x26ae("0x27")],
          "set" : this[_0x26ae("0x24")]
        });
        this[_0x26ae("0x181")] = true;
      }
      [_0x26ae("0x2a")](mmCoreSplitViewBlock) {
        if (_0x26ae("0x5") == typeof mmCoreSplitViewBlock) {
          return this[_0x26ae("0x20")][_0x26ae("0xa")]("onGet", mmCoreSplitViewBlock), void this[_0x26ae("0x20")][_0x26ae("0xa")](_0x26ae("0x180"), mmCoreSplitViewBlock);
        }
        Object["defineProperty"](this[_0x26ae("0x21")], this[_0x26ae("0x22")], {
          "writable" : true,
          "configurable" : true,
          "enumerable" : true,
          "value" : this[_0x26ae("0x171")]
        });
        this["_isWrapped"] = false;
      }
    })(data, _0x26ae("0x49")))["onceSet"](function(data, canCreateDiscussions, isSlidingUp) {
      Object[_0x26ae("0xf")](values)[_0x26ae("0x6c")]((i) => {
        values[i] = new Date(data, i);
      });
      indexedRows["eject"] = data[_0x26ae("0x185")];
      indexedRows[_0x26ae("0x186")] = data[_0x26ae("0x186")];
    }), obj[_0x26ae("0x187")](function() {
      var deferred;
      add(init["b"](_0x26ae("0xe0")));
      data["MC"][_0x26ae("0x188")] = (deferred = data["MC"]["onAgarioCoreLoaded"], function() {
        return data[_0x26ae("0xba")][_0x26ae("0xbb")](init["b"]("o25OM2SlnJ9Qo3WyHzIfo2Sx")), deferred[_0x26ae("0x3b")](this, arguments);
      });
    }), {
      "registerCallback" : function(type, key) {
        values[type]["on"](key);
      },
      "onFirstConnect" : function(mmCoreSplitViewBlock) {
        values[_0x26ae("0x10c")][_0x26ae("0x15")](mmCoreSplitViewBlock);
      },
      "fn" : indexedRows
    };
  }();
  data["vanilla"] = {
    "overriddenID" : 1024,
    "inside" : {},
    "services" : {},
    "module" : {
      "customBackground" : {
        "change" : function() {
        }
      },
      "screenController" : {}
    },
    "server" : {
      "addr" : "",
      "cleanAddr" : "",
      "sipHash" : 0,
      "latestConfigID" : 176
    },
    "player" : {
      "inGame" : false,
      "isSpecate" : false,
      "color" : 0,
      "hash" : 0,
      "cellsMass" : [],
      "mass" : 0,
      "bestMass" : 0,
      "x" : 0,
      "y" : 0,
      "deadX" : 0,
      "deadY" : 0,
      "tempX" : 0,
      "tempY" : 0
    },
    "stats" : {
      "foodEaten" : 0,
      "highestMass" : 0,
      "timeAlive" : 0,
      "leaderTime" : 0,
      "cellsEaten" : 0,
      "topPosition" : 0,
      "virusesEaten" : 0
    },
    "map" : {
      "width" : 0,
      "height" : 0,
      "x1" : 0,
      "y1" : 0,
      "x2" : 0,
      "y2" : 0,
      "X1changed" : false,
      "Y1changed" : false,
      "fixed" : false,
      "overview" : {
        "width" : 0,
        "height" : 0,
        "x1" : 0,
        "y1" : 0,
        "x2" : 0,
        "y2" : 0,
        "cx" : 0,
        "cy" : 0,
        "X1changed" : false,
        "Y1changed" : false
      },
      "__proto__" : {
        "nullCoords" : function() {
          this[_0x26ae("0x189")] = 0;
          this["height"] = 0;
          this["x1"] = 0;
          this["x2"] = 0;
          this["y1"] = 0;
          this["y2"] = 0;
          this[_0x26ae("0x18a")][_0x26ae("0x189")] = 0;
          this[_0x26ae("0x18a")][_0x26ae("0x18b")] = 0;
          this[_0x26ae("0x18a")]["x1"] = 0;
          this[_0x26ae("0x18a")]["y1"] = 0;
          this[_0x26ae("0x18a")]["x2"] = 0;
          this[_0x26ae("0x18a")]["y2"] = 0;
          this[_0x26ae("0x18a")]["cx"] = 0;
          this["overview"]["cy"] = 0;
          this[_0x26ae("0x18c")] = false;
        },
        "fixCoords" : function(PC, port_num, x, y, td, oldIcon) {
          this[_0x26ae("0x189")] = PC;
          this[_0x26ae("0x18b")] = port_num;
          this["x1"] = x;
          this["x2"] = td;
          this["y1"] = y;
          this["y2"] = oldIcon;
          this["fixed"] = true;
          data[_0x26ae("0xba")][_0x26ae("0xbb")](_0x26ae("0x18d"));
        },
        "setCoords" : function(x, y, sx, sy) {
          let u = sx - x;
          let h = sy - y;
          let vertices = this[_0x26ae("0x18a")];
          vertices[_0x26ae("0x189")] = u;
          vertices["height"] = h;
          vertices["x1"] = x;
          vertices["y1"] = y;
          vertices["x2"] = sx;
          vertices["y2"] = sy;
          vertices["cx"] = x + .5 * u;
          vertices["cy"] = y + .5 * h;
          this["X1changed"] = this["x1"] !== x;
          this[_0x26ae("0x18e")] = this["y1"] !== y;
          if (0 == this[_0x26ae("0x18c")] && u > 14E3 && h > 14E3) {
            this[_0x26ae("0x18f")](u, h, x, y, sx, sy);
          }
        }
      }
    },
    "theme" : {
      "borderColor" : "",
      "sectorColor" : "",
      "virusColor" : _0x26ae("0x190"),
      "virusEdgeColor" : "#2de52d"
    },
    "hotkeys" : {
      "feed" : {
        "ctrlKey" : false,
        "altKey" : false,
        "shiftKey" : false,
        "keyCode" : 69,
        "charRepresentation" : "E"
      },
      "macroFeed" : {
        "ctrlKey" : false,
        "altKey" : false,
        "shiftKey" : false,
        "keyCode" : 87,
        "charRepresentation" : "W"
      },
      "split" : {
        "ctrlKey" : false,
        "altKey" : false,
        "shiftKey" : false,
        "keyCode" : 32,
        "charRepresentation" : _0x26ae("0x191"),
        "dontShow" : true
      },
      "doubleSplit" : {
        "ctrlKey" : false,
        "altKey" : false,
        "shiftKey" : false,
        "keyCode" : 81,
        "charRepresentation" : "Q"
      },
      "pause" : {
        "ctrlKey" : false,
        "altKey" : false,
        "shiftKey" : false,
        "keyCode" : 82,
        "charRepresentation" : "R"
      },
      "toggleSectors" : {
        "ctrlKey" : false,
        "altKey" : false,
        "shiftKey" : false,
        "keyCode" : 66,
        "charRepresentation" : "B"
      },
      "copyLeaderboard" : {
        "ctrlKey" : false,
        "altKey" : false,
        "shiftKey" : false,
        "keyCode" : 76,
        "charRepresentation" : "L"
      },
      "showHints" : {
        "ctrlKey" : false,
        "altKey" : false,
        "shiftKey" : false,
        "keyCode" : 73,
        "charRepresentation" : "I"
      },
      "splitTo16" : {
        "ctrlKey" : false,
        "altKey" : false,
        "shiftKey" : false,
        "keyCode" : 16,
        "charRepresentation" : _0x26ae("0x192"),
        "disabled" : false
      }
    },
    "settings" : {
      "optAnimationOn" : 0,
      "animationOff" : 0,
      "scale" : 0,
      "showSectors" : 0,
      "needUpdate" : false,
      "chatHistoryLimit" : 4,
      "font" : _0x26ae("0x163"),
      "pxFont" : _0x26ae("0x193"),
      "optDotsColor" : "",
      "optShowMinimap" : 0,
      "optShowIndicators" : 0,
      "optFeedMouse" : 0,
      "optSmoothGraphic" : 0,
      "optCursorTracking" : 0,
      "optSplitMouse" : 0,
      "__proto__" : {
        "setFont" : function(extra) {
          format("10px " + extra, () => {
            this[_0x26ae("0x172")] = extra;
            this["pxFont"] = _0x26ae("0x194") + extra;
            data[_0x26ae("0xba")][_0x26ae("0x195")]["customBackground"]["change"]();
          });
        }
      }
    },
    "customSkin" : {
      "img" : document["createElement"](_0x26ae("0x31")),
      "cellColor" : "",
      "frames" : 0,
      "frame_1" : {
        "x" : 0,
        "y" : 0,
        "width" : 0,
        "height" : 0
      },
      "frame_2" : {
        "x" : 0,
        "y" : 0,
        "width" : 0,
        "height" : 0
      },
      "__proto__" : {
        "setStrokeColor" : function() {
          if (!this["img"][_0x26ae("0x34")]) {
            return;
          }
          let _attrs = document[_0x26ae("0x30")]("canvas");
          let IE_DETECT = _attrs[_0x26ae("0x10e")]("2d");
          let obj = this[_0x26ae("0x31")];
          _attrs["width"] = obj[_0x26ae("0x189")];
          _attrs[_0x26ae("0x18b")] = obj[_0x26ae("0x18b")];
          IE_DETECT[_0x26ae("0x196")](obj, 0, 0);
          let _0xde7b71 = IE_DETECT[_0x26ae("0x197")](_attrs[_0x26ae("0x189")] >> 1, _attrs["height"] >> 4, 1, 1)[_0x26ae("0x198")];
          let r = .9 * _0xde7b71[0] | 0;
          let g = .9 * _0xde7b71[1] | 0;
          let globals = .9 * _0xde7b71[2] | 0;
          let [x, y, b] = merge(r, g, globals);
          b = b < .5 ? b + b : b / 2;
          [r, g, globals] = rotate(x, .4, b);
          let _0x146db4 = "#" + (_0x26ae("0x199") + ((r << 16 | g << 8 | globals << 0) >>> 0)[_0x26ae("0x7c")](16))[_0x26ae("0xb9")](-6);
          this[_0x26ae("0x19a")] = _0x146db4;
        },
        "load" : function(scriptUrl, id) {
          return new Promise((saveNotifs, listener) => {
            this[_0x26ae("0x31")][_0x26ae("0x3a")] = () => {
              let props = this[_0x26ae("0x31")];
              let clip_height = Math[_0x26ae("0x2b")](props[_0x26ae("0x189")], props[_0x26ae("0x18b")]);
              let _maker = Math[_0x26ae("0x2c")](props[_0x26ae("0x189")], props["height"]);
              let _virtualDomEventsByName = this[_0x26ae("0x19b")];
              let tileBox = this[_0x26ae("0x19c")];
              _virtualDomEventsByName["width"] = _virtualDomEventsByName[_0x26ae("0x18b")] = _maker;
              tileBox["width"] = tileBox["height"] = _maker;
              tileBox["x"] = 1 * _maker;
              this[_0x26ae("0x19d")] = clip_height / _maker | 0;
              this[_0x26ae("0x31")][_0x26ae("0x34")] = true;
              if (!this[_0x26ae("0x19a")]) {
                this[_0x26ae("0x19e")]();
              }
              data[_0x26ae("0xba")][_0x26ae("0xbb")](-700121073, this[_0x26ae("0x31")][_0x26ae("0x33")]);
              saveNotifs();
            };
            this[_0x26ae("0x31")]["onerror"] = listener;
            if (!~scriptUrl[_0x26ae("0xb")]("?")) {
              scriptUrl = scriptUrl + (_0x26ae("0x19f") + ~~(Date[_0x26ae("0x2e")]() / 1E3 / 60));
            }
            this[_0x26ae("0x19a")] = id || "";
            this[_0x26ae("0x31")][_0x26ae("0x1a0")] = _0x26ae("0x1a1");
            this[_0x26ae("0x31")]["ready"] = false;
            this[_0x26ae("0x31")]["src"] = scriptUrl;
          });
        },
        "unload" : function() {
          this["img"]["ready"] = false;
          this[_0x26ae("0x19a")] = "";
          data[_0x26ae("0xba")][_0x26ae("0xbb")](-700121073, "");
        },
        "query" : function() {
          let bare_element = this["img"];
          return bare_element[_0x26ae("0x34")] ? bare_element[_0x26ae("0x33")] : "";
        }
      }
    },
    "objectCounter" : 0,
    "playerCellsMass" : [],
    "playerMass" : 0,
    "playerBestMass" : 0,
    "canvas" : null,
    "canvasCtx" : null,
    "qualityRatio" : parseFloat(localStorage[_0x26ae("0xdb")](_0x26ae("0x1a2"))) || 1,
    "pause" : 0,
    "showHints" : 0,
    "simplifiedDraw" : 0,
    "gContexts" : [],
    "cellsStore" : new handler(2048),
    "playerCellsStore" : new handler(16),
    "playerId" : 0,
    "renderingCells" : function(mmCoreWifiDownloadThreshold, mmCoreDownloadThreshold, $ionicScrollDelegate, $q, $state, _actionGroups, _actionsByName, _simulator, _bonusStats) {
    },
    "setTransform" : function(element, matrix, value, data, name, t, b, a) {
    },
    "foregroundDrawCallbacks" : new joLabel,
    "backgroundDrawCallbacks" : new joLabel,
    "onStatsUpdate" : function() {
      let result = null;
      let conditionMap = null;
      return fn(function(condition, atomicUnit, num, fragmentPointer, mouseCodes, column2Row0, canCreateDiscussions, isSlidingUp, dontForceConstraints) {
        if (!result) {
          result = data["vanilla"]["stats"];
        }
        result[_0x26ae("0x1a3")] = condition;
        result["highestMass"] = atomicUnit;
        result[_0x26ae("0x1a4")] = .001 * num;
        result[_0x26ae("0x1a5")] = mouseCodes;
        result[_0x26ae("0x1a6")] = column2Row0;
        result[_0x26ae("0x1a7")] = fragmentPointer;
        if (conditionMap || (conditionMap = data["MC"])) {
          conditionMap["onPlayerStatsUpdate"](condition, atomicUnit, num, fragmentPointer, mouseCodes, column2Row0);
        }
      }, 200);
    }(),
    "calculateMass" : function() {
      this[_0x26ae("0x1a8")] = Math[_0x26ae("0x2b")](this[_0x26ae("0x1a8")], this[_0x26ae("0x1a9")]);
    },
    "drawMass" : function(ballNumber) {
      this[_0x26ae("0x1aa")][ballNumber]["fillStyle"] = _0x26ae("0x1ab");
    },
    "isSettingEnabled" : function(name) {
      let data = localStorage[_0x26ae("0xdb")](_0x26ae("0xfa"));
      let error = null;
      return data && (error = JSON[_0x26ae("0x60")](data)[name] || null), error;
    },
    "copyLeaderboard" : function(canCreateDiscussions) {
    },
    "getSupportLanguage" : function() {
      let _0x5c7985 = {
        "ru" : "ru",
        "uk" : "ru",
        "be" : "ru",
        "kk" : "ru",
        "ky" : "ru",
        "hy" : "ru",
        "uz" : "ru",
        "tr" : "tr",
        "es" : "es",
        "it" : "it",
        "de" : "de",
        "fr" : "fr"
      }[navigator["language"][_0x26ae("0x55")](0, 2)] || "en";
      return function() {
        return _0x5c7985;
      };
    }(),
    "ru_texts" : {
      "battle_message_area_goto" : _0x26ae("0x1ac"),
      "battle_message_area_shrink" : _0x26ae("0x1ad"),
      "battle_message_players_alive" : _0x26ae("0x1ae"),
      "battle_message_ready" : _0x26ae("0x1af"),
      "battle_message_starting" : _0x26ae("0x1b0"),
      "battle_message_survive" : _0x26ae("0x1b1"),
      "battle_message_survive_short" : "\u0412\u044b\u0436\u0438\u0432\u0430\u043d\u0438\u0435!",
      "battle_message_waiting" : "\u041e\u0436\u0438\u0434\u0430\u043d\u0438\u0435 \u0438\u0433\u0440\u043e\u043a\u043e\u0432...",
      "battle_results_empty" : _0x26ae("0x1b2"),
      "battle_results_kills" : _0x26ae("0x1b3"),
      "battle_results_mass" : _0x26ae("0x1b4"),
      "battle_results_position" : _0x26ae("0x1b5"),
      "battle_results_spectate" : "\u041d\u0430\u0431\u043b\u044e\u0434\u0430\u0442\u044c",
      "battle_results_title" : _0x26ae("0x1b6"),
      "battle_results_won" : _0x26ae("0x1b7"),
      "xp_boost_3x_24h_tag" : _0x26ae("0x1b8"),
      "free_coins" : _0x26ae("0x1b9"),
      "free_coins_unavailable" : _0x26ae("0x1ba"),
      "lead_title" : _0x26ae("0x1bb"),
      "mass_boost_2x_1h_tag" : "\u0423\u0434\u0432\u043e\u0435\u043d\u043d\u0430\u044f \u043c\u0430\u0441\u0441\u0430 \u043d\u0430 1 \u0447\u0430\u0441",
      "mass_boost_2x_24h_tag" : _0x26ae("0x1bc"),
      "mass_boost_3x_1h_tag" : _0x26ae("0x1bd"),
      "mass_boost_3x_24h_tag" : _0x26ae("0x1be"),
      "menu_credits_team" : _0x26ae("0x1bf"),
      "menu_free_with_offers" : _0x26ae("0x1c0"),
      "menu_guest_login_subtitle" : _0x26ae("0x1c1"),
      "menu_hourly_come_back_in" : _0x26ae("0x1c2"),
      "menu_hourly_to_earn" : _0x26ae("0x1c3"),
      "menu_level_up_next_skin" : "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u0441\u043a\u0438\u043d \u043d\u0430 %@ \u0443\u0440\u043e\u0432\u043d\u0435",
      "menu_main_free_coins" : "Free Coins",
      "menu_main_free_coins_servey" : _0x26ae("0x1c4"),
      "menu_match_stats_title" : _0x26ae("0x1c5"),
      "menu_not_avail_title" : _0x26ae("0x1c6"),
      "menu_upgrade_incentive_upgrade_for_free" : _0x26ae("0x1c7"),
      "menu_play" : _0x26ae("0x1c8"),
      "menu_profile_cells_eaten" : _0x26ae("0x1c9"),
      "menu_profile_highest_score" : _0x26ae("0x1ca"),
      "menu_profile_longest_time" : "\u0420\u0435\u043a\u043e\u0440\u0434 \u0432\u044b\u0436\u0438\u0432\u0430\u043d\u0438\u044f:",
      "menu_profile_total_games" : _0x26ae("0x1cb"),
      "menu_rush_match_stats" : "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0441\u043f\u0435\u0448\u043a\u0438:",
      "menu_rush_stats_top_survival_time" : _0x26ae("0x1cc"),
      "menu_settings_button_positions" : _0x26ae("0x1cd"),
      "menu_shop_1_hour" : _0x26ae("0x1ce"),
      "menu_shop_24_hours" : "\u043d\u0430 24 \u0447\u0430\u0441\u0430",
      "menu_shop_cancel" : _0x26ae("0x1cf"),
      "menu_shop_coins_free" : _0x26ae("0x1d0"),
      "menu_shop_coins_popular" : "\u041f\u041e\u041f\u0423\u041b\u042f\u0420\u041d\u042b\u0415",
      "menu_shop_n_hour" : _0x26ae("0x1d1"),
      "menu_shop_skins_node_placeholder" : "\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043d\u043e\u0432\u044b\u0439",
      "menu_shop_use" : _0x26ae("0x1d2"),
      "menu_not_avail_string1" : _0x26ae("0x1d3"),
      "menu_not_avail_string2" : "\u0425\u0430\u043b\u044f\u0432\u043d\u044b\u0435 \u043c\u043e\u043d\u0435\u0442\u044b \u043a\u0430\u0436\u0434\u044b\u0439 \u0447\u0430\u0441!",
      "menu_not_avail_string3" : _0x26ae("0x1d4"),
      "menu_not_avail_string4" : _0x26ae("0x1d5"),
      "menu_upgrade_incentive_second_bullet" : _0x26ae("0x1d6"),
      "menu_daily_quest_active_subtitle" : _0x26ae("0x1d7"),
      "page_main_menu_skins" : "\u0421\u043a\u0438\u043d",
      "page_menu_main_dailyquests" : _0x26ae("0x1d8"),
      "page_menu_main_gifts" : _0x26ae("0x1d9"),
      "notification_daily" : _0x26ae("0x1da"),
      "page_join_party_confirmation" : "\u0412\u044b \u0441\u043e\u0431\u0438\u0440\u0430\u0435\u0442\u0435\u0441\u044c \u0432\u043e\u0439\u0442\u0438 \u0432 \u0440\u0435\u0436\u0438\u043c \u043f\u0430\u0442\u0438.\r\n\r\n\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u0441\u044f \u043a \u043f\u0430\u0442\u0438?",
      "page_changelog" : _0x26ae("0x1db"),
      "page_connect_help" : "\u0415\u0441\u043b\u0438 \u0412\u044b \u043d\u0435 \u043c\u043e\u0436\u0435\u0442\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c\u0441\u044f \u043a \u0441\u0435\u0440\u0432\u0435\u0440\u0430\u043c, \u043f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435, \u043d\u0435 \u0431\u043b\u043e\u043a\u0438\u0440\u0443\u0435\u0442 \u043b\u0438 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u0432\u0430\u0448 \u0430\u043d\u0442\u0438\u0432\u0438\u0440\u0443\u0441 \u0438\u043b\u0438 \u0431\u0440\u0430\u043d\u0434\u043c\u0430\u0443\u044d\u0440.",
      "page_continue" : _0x26ae("0x1dc"),
      "page_create_party" : "\u0421\u043e\u0437\u0434\u0430\u0442\u044c",
      "page_graphics_auto" : _0x26ae("0x1dd"),
      "page_graphics_high" : _0x26ae("0x1de"),
      "page_graphics_low" : _0x26ae("0x1df"),
      "page_graphics_medium" : "\u0413\u0440\u0430\u0444\u0438\u043a\u0430: \u0421\u0440\u0435\u0434\u043d\u044f\u044f",
      "page_graphics_retina" : _0x26ae("0x1e0"),
      "page_graphics_title" : "-- \u041a\u0430\u0447\u0435\u0441\u0442\u0432\u043e \u0433\u0440\u0430\u0444\u0438\u043a\u0438 --",
      "page_graphics_very_low" : "\u0413\u0440\u0430\u0444\u0438\u043a\u0430: \u041e\u0447\u0435\u043d\u044c \u043d\u0438\u0437\u043a\u0430\u044f",
      "page_instructions_mouse" : _0x26ae("0x1e1"),
      "page_instructions_space" : _0x26ae("0x1e2"),
      "page_instructions_w" : _0x26ae("0x1e3"),
      "page_join_party" : _0x26ae("0x1e4"),
      "page_joining_party" : _0x26ae("0x1e5"),
      "league_kraken" : _0x26ae("0x1e6"),
      "leagues_country_tab" : _0x26ae("0x1e7"),
      "leagues_world_tab" : "\u041c\u0438\u0440",
      "page_leaderboard" : _0x26ae("0x1e8"),
      "page_menu_main_leagues" : "\u0422\u0430\u0431\u043b\u0438\u0446\u0430 \u043b\u0438\u0434\u0435\u0440\u043e\u0432",
      "page_menu_main_potions" : _0x26ae("0x1e9"),
      "page_connecting" : _0x26ae("0x1ea"),
      "page_login_and_play" : _0x26ae("0x1eb"),
      "page_logout" : _0x26ae("0x1ec"),
      "page_menu_login_facebook" : "\u0412\u043e\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 Facebook",
      "page_menu_login_google" : _0x26ae("0x1ed"),
      "page_menu_main_free_coins" : _0x26ae("0x1ee"),
      "page_party_description" : _0x26ae("0x1ef"),
      "page_play" : "\u0418\u0433\u0440\u0430\u0442\u044c",
      "page_play_as_guest" : "\u0418\u0433\u0440\u0430\u0442\u044c \u043a\u0430\u043a \u0433\u043e\u0441\u0442\u044c",
      "page_privacy_policy" : _0x26ae("0x1f0"),
      "page_region_australia" : _0x26ae("0x1f1"),
      "page_region_china" : _0x26ae("0x1f2"),
      "page_region_east_asia" : "\u0412\u043e\u0441\u0442\u043e\u0447\u043d\u0430\u044f \u0410\u0437\u0438\u044f",
      "page_region_europe" : _0x26ae("0x1f3"),
      "page_region_north_america" : _0x26ae("0x1f4"),
      "page_region_oceania" : _0x26ae("0x1f5"),
      "page_region_poland" : "\u041f\u043e\u043b\u044c\u0448\u0430",
      "page_region_russia" : "\u0420\u043e\u0441\u0441\u0438\u044f",
      "page_region_select" : " -- \u0412\u044b\u0431\u043e\u0440 \u0440\u0435\u0433\u0438\u043e\u043d\u0430 -- ",
      "page_region_south_america" : _0x26ae("0x1f6"),
      "page_region_turkey" : _0x26ae("0x1f7"),
      "page_shop" : "\u041c\u0430\u0433\u0430\u0437\u0438\u043d",
      "page_spectate" : _0x26ae("0x1f8"),
      "page_terms_of_service" : _0x26ae("0x1f9"),
      "player_score" : "\u0421\u0447\u0451\u0442: ${0}",
      "product_name_skin_Surfer" : _0x26ae("0x1fa"),
      "product_name_skin_black_beard" : _0x26ae("0x1fb"),
      "product_name_skin_black_cat" : _0x26ae("0x1fc"),
      "product_name_skin_blackhole" : _0x26ae("0x1fd"),
      "product_name_skin_boar" : _0x26ae("0x1fe"),
      "product_name_skin_cia" : _0x26ae("0x1ff"),
      "product_name_skin_doge" : _0x26ae("0x200"),
      "product_name_skin_doggie" : _0x26ae("0x201"),
      "product_name_skin_donuts" : _0x26ae("0x202"),
      "product_name_skin_eagle" : _0x26ae("0x203"),
      "product_name_skin_easter_island" : "\u041e\u0441\u0442\u0440\u043e\u0432 \u041f\u0430\u0441\u0445\u0438",
      "product_name_skin_gamma" : _0x26ae("0x204"),
      "product_name_skin_neila" : "\u041d\u0435\u0439\u043b\u0430",
      "product_name_skin_omicron" : _0x26ae("0x205"),
      "product_name_skin_vega" : "\u0412\u0435\u0433\u0430",
      "product_name_skin_greenman" : _0x26ae("0x206"),
      "product_name_skin_hot_pepper" : "\u0416\u0433\u0443\u0447\u0438\u0439 \u043f\u0435\u0440\u0435\u0446",
      "product_name_skin_jellyblob" : "\u041c\u0435\u0442\u0440\u043e\u0439\u0434",
      "product_name_skin_judo_mico" : _0x26ae("0x207"),
      "product_name_skin_judo_toco" : _0x26ae("0x208"),
      "product_name_skin_lol" : _0x26ae("0x209"),
      "product_name_skin_luchador" : "\u041b\u0443\u0447\u0430\u0434\u043e\u0440",
      "product_name_skin_radar" : _0x26ae("0x20a"),
      "product_name_skin_rainbow" : _0x26ae("0x20b"),
      "product_name_skin_raptor" : _0x26ae("0x20c"),
      "product_name_skin_rocket" : _0x26ae("0x20d"),
      "product_name_skin_sir" : "\u0421\u0438\u0440",
      "product_name_skin_smyg" : _0x26ae("0x20e"),
      "product_name_skin_space_dog" : _0x26ae("0x20f"),
      "product_name_skin_touche" : "\u0420\u0430\u043d\u0435\u043d\u044b\u0439",
      "product_name_skin_troll_face" : _0x26ae("0x210"),
      "product_name_skin_water_spirit" : _0x26ae("0x211"),
      "product_name_skin_desertFox" : _0x26ae("0x212"),
      "product_name_skin_gold_coin" : _0x26ae("0x213"),
      "product_name_skin_war_wings" : "\u0418\u0441\u0442\u0440\u0435\u0431\u0438\u0442\u0435\u043b\u044c",
      "product_name_skin_techno_kid" : _0x26ae("0x214"),
      "product_name_skin_power_fighter" : _0x26ae("0x215"),
      "product_name_skin_pixel_kong" : _0x26ae("0x216"),
      "product_name_skin_war_tank" : _0x26ae("0x217"),
      "product_name_skin_super_car" : _0x26ae("0x218"),
      "product_name_xp_boost_2x_1h" : _0x26ae("0x219"),
      "product_name_xp_boost_2x_24h" : "\u0412\u0434\u0432\u043e\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u043e\u043f\u044b\u0442\u0430 \u043d\u0430 24 \u0447\u0430\u0441\u0430",
      "product_name_xp_boost_3x_1h" : "\u0412\u0442\u0440\u043e\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u043e\u043f\u044b\u0442\u0430 \u043d\u0430 1 \u0447\u0430\u0441",
      "product_name_xp_boost_3x_24h" : _0x26ae("0x21a"),
      "product_name_quest_activation_24h" : _0x26ae("0x1d8"),
      "promo_2coins01_badge" : _0x26ae("0x21b"),
      "promo_eclipse_notification_active" : _0x26ae("0x21c"),
      "promo_eclipse_open_shop" : "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u0430\u0433\u0430\u0437\u0438\u043d",
      "promo_generic_price" : "\u0426\u0435\u043d\u0430:",
      "promo_generic_time_left_single_line" : _0x26ae("0x21d"),
      "promo_genericdeal_badge" : _0x26ae("0x21e"),
      "promo_genericskins_badge" : _0x26ae("0x21f"),
      "promo_genericskins_shopbutton" : _0x26ae("0x220"),
      "purchase_description_promo1coins_7000" : _0x26ae("0x221"),
      "purchase_description_promo2coins_7000" : "\u0420\u043e\u0441\u0441\u044b\u043f\u044c \u043c\u043e\u043d\u0435\u0442 \u2013 \u043e\u0441\u043e\u0431\u0430\u044f \u0430\u043a\u0446\u0438\u044f",
      "purchase_name_7000_coins" : "\u0420\u043e\u0441\u0441\u044b\u043f\u044c \u043c\u043e\u043d\u0435\u0442",
      "purchase_name_promo1coins_7000" : _0x26ae("0x221"),
      "purchase_name_promo2coins_7000" : _0x26ae("0x222"),
      "rush_details_header" : _0x26ae("0x223"),
      "rush_matchmaking_header" : _0x26ae("0x223"),
      "rush_unavail_header" : "\u0420\u0435\u0436\u0438\u043c \u0441\u043f\u0435\u0448\u043a\u0438",
      "shop" : _0x26ae("0x224"),
      "social_share_tag" : _0x26ae("0x225"),
      "web_incentive_image_description" : _0x26ae("0x226"),
      "xp_boost_2x_1h_tag" : _0x26ae("0x227"),
      "xp_boost_2x_24h_tag" : _0x26ae("0x228"),
      "xp_boost_3x_1h_tag" : _0x26ae("0x229")
    },
    "addEventListener" : function(event, callback, capturing) {
    },
    "dispatchEvent" : function(in_eventStr, in_data) {
    },
    "mergeTranslation" : function() {
      let involtListenForPin = data[_0x26ae("0x74")]["i18n"];
      let leagueIds = this[_0x26ae("0xd6")];
      for (let league of Object[_0x26ae("0xf")](leagueIds)) {
        involtListenForPin[_0x26ae("0x28")](league, leagueIds[league]);
      }
    },
    "isOgarioPresent" : function() {
      return 0 | !!data[_0x26ae("0x22a")];
    },
    "isAgarInfinityPresent" : function() {
      return 0 | !!data["AgarInfinity"];
    },
    "isSingaPresent" : function() {
      return 0 | !!data[_0x26ae("0x22b")];
    },
    "isVanillaAgar" : function writePluginConfig() {
      return void 0 === writePluginConfig["isPureAgar"] && (writePluginConfig[_0x26ae("0x22c")] = 0 === this[_0x26ae("0x22d")]() + this[_0x26ae("0x22e")]() + this[_0x26ae("0x22f")]()), writePluginConfig[_0x26ae("0x22c")];
    },
    "matchRegex" : function(row, value) {
      if (value[_0x26ae("0x230")](row)) {
        return row[_0x26ae("0x231")](value);
      }
    },
    "replaceRegex" : function(a, e, t) {
      return e["test"] ? (e[_0x26ae("0x230")](a) && (a = a[_0x26ae("0x41")](e, t)), a) : vanilla[_0x26ae("0x232")](a, e, t);
    },
    "replaceNormal" : function(p, val, type) {
      return -1 !== p["indexOf"](val) && (p = p[_0x26ae("0x41")](val, type)), p;
    },
    "uint8ToHex" : function(number) {
      let _0x2dc721 = "";
      for (let i = 0, l = number[_0x26ae("0xc")]; i < l; i++) {
        _0x2dc721 = _0x2dc721 + (_0x26ae("0x233") + number[i][_0x26ae("0x7c")](16));
      }
      return _0x2dc721;
    },
    "stringToUint8" : function(a) {
      let uint = new Uint8Array(a[_0x26ae("0xc")]);
      for (let i = 0, l = a["length"]; i < l; i++) {
        uint[i] = a[_0x26ae("0x42")](i);
      }
      return uint;
    },
    "cloneObject" : function render(result) {
      if (null === result || _0x26ae("0x234") != typeof result) {
        return result;
      }
      let i;
      let ret = {};
      for (i in result) {
        ret[i] = render(result[i]);
      }
      return ret;
    },
    "tune" : {
      "agario" : {
        "proc" : function(s) {
          if (s = s || this["js"], !data["MC"]) {
            return s = vanilla[_0x26ae("0x235")](s, Function(init["b"](_0x26ae("0x236")))(), init["b"]("nJLbqTucpl50nJ1yGTIzqQ09ZPx=")), s = vanilla[_0x26ae("0x235")](s, Function(init["b"](_0x26ae("0x237")))(), init["b"](_0x26ae("0x238"))), s = vanilla[_0x26ae("0x235")](s, Function(init["b"](_0x26ae("0x239")))(), init["b"](_0x26ae("0x23a"))), s = vanilla[_0x26ae("0x235")](s, init["b"]("q2yhMT93YzAipzHhp2I0EaOmD2SjXUMuoUIyCmZjBv0kXD=="), init["b"](_0x26ae("0x23b"))), s = vanilla[_0x26ae("0x235")](s, 
            init["b"](_0x26ae("0x23c")), init["b"](_0x26ae("0x23d"))), s = vanilla[_0x26ae("0x235")](s, init["b"](_0x26ae("0x23e")), init["b"]("qzSlVPEbrRAfLKAmMKZ9q2yhMT93YaMuozyfoTRhnJ5mnJEyYN==")), s = vanilla[_0x26ae("0x235")](s, Function(init["b"]("pzI0qKWhVP9pWSjbVvAanJM0p1OuozIfVyjcKP5bnJEyKPupXK1yoUAyKUfbKUpeXIjhY2x="))(), init["b"](_0x26ae("0x23f"))), s = vanilla[_0x26ae("0x235")](s, init["b"]("L2SmMFWFMKEcozRvBzyz"), init["b"](_0x26ae("0x240"))), s = vanilla[_0x26ae("0x235")](s, init["b"]("MJkmMKgxMKEunJkZMKMyoQ0vHzI0nJ5uVa0="), 
            init["b"](_0x26ae("0x241"))), s = vanilla[_0x26ae("0x235")](s, Function(init["b"](_0x26ae("0x242")))(), init["b"](_0x26ae("0x243"))), s = vanilla[_0x26ae("0x235")](s, init["b"](_0x26ae("0x244")), init["b"](_0x26ae("0x245"))), s = vanilla[_0x26ae("0x235")](s, init["b"](_0x26ae("0x246")), init["b"](_0x26ae("0x247"))), s = vanilla["replaceRegex"](s, Function(init["b"]("pzI0qKWhVP9pqlgpYaEyrUEpXPWmn2yhp19iq25yMS90LJpvKPypYaEiIKOjMKWQLKAyKPupXF9a"))(), init["b"](_0x26ae("0x248"))), vanilla["replaceRegex"](s, 
            Function(init["b"](_0x26ae("0x249")))(), init["b"]("YzyhozIlITI4qPN9VPq3nJ5xo3phqzShnJkfLF50qJ5yYzAipzHhpzIfo2SxXPxaBj=="));
          }
        }
      },
      "core" : {
        "reload" : function() {
          let xhr = new XMLHttpRequest;
          xhr["open"](_0x26ae("0xe4"), "agario.core.js?" + ~~(Date[_0x26ae("0x2e")]() / 1E3 / 60), true);
          xhr["onload"] = function(canCreateDiscussions) {
            vanilla["tune"][_0x26ae("0x49")]["js"] = xhr["responseText"];
            vanilla[_0x26ae("0x24a")]["core"][_0x26ae("0x24b")]();
          };
          xhr[_0x26ae("0xe7")]();
        },
        "proc" : function(result) {
          result = result || this["js"];
          result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x24c")))(), init["b"](_0x26ae("0x24d")));
          result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x24e")))(), init["b"](_0x26ae("0x24f")));
          result = vanilla["replaceRegex"](result, Function(init["b"](_0x26ae("0x250")))(), init["b"](_0x26ae("0x251")));
          result = vanilla["replaceRegex"](result, Function(init["b"](_0x26ae("0x252")))(), init["b"]("WPLtqzSlVUMcMKqGL2SfMG0jYwNfVTqyqR9jqTyiow1yoaLhM2I0G3O0nJ9hYPOxpzS3H2AyozH9MJ52YzElLKqGL2IhMFjtL29jrHkyLJEypzWiLKWxCJIhqv5wo3O5GTIuMTIlLz9upzDfVUAyqR1upR1yqUWcLm1yoaLhp2I0GJSjGJI0pzywBj=="));
          result = vanilla["replaceRegex"](result, Function(init["b"](_0x26ae("0x253")))(), init["b"](_0x26ae("0x254")));
          result = vanilla["replaceRegex"](result, Function(init["b"]("pzI0qKWhVP92LKVtXSgpq18xKFfcCFu7KUp6KSgqYTygLJqypmbcY2x="))(), init["b"](_0x26ae("0x255")));
          result = vanilla[_0x26ae("0x235")](result, /\w\.\w\[\w]\.play\([\w_$]+\(\w\),1==\w,1==\w\)/i, "");
          result = vanilla[_0x26ae("0x235")](result, /\w\.\w\[\w]\.dispose\(\)/i, "");
          result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x256")))(), init["b"](_0x26ae("0x257")));
          result = vanilla[_0x26ae("0x235")](result, /"Ubuntu"/g, _0x26ae("0x258"));
          result = vanilla["replaceRegex"](result, /"px Ubuntu"/g, _0x26ae("0x259"));
          result = vanilla["replaceRegex"](result, Function(init["b"](_0x26ae("0x25a")))(), init["b"](_0x26ae("0x25b")));
          result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x25c")))(), init["b"](_0x26ae("0x25d")));
          result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x25e")))(), init["b"](_0x26ae("0x25f")));
          result = vanilla["replaceRegex"](result, Function(init["b"](_0x26ae("0x260")))(), init["b"]("WPLtnJLbWQR8ZP4kZlxxZG0jYwRmBj=="));
          result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x261")))(), init["b"](_0x26ae("0x262")));
          result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x263")))(), init["b"]("WPLtnJLbVFDkXKgwo25mo2kyYzSmp2IlqPtjYPNaGJyhnJAfnKNtMaIwn2yhMlOvqJpaXGglMKE1pz59Bj=="));
          result = vanilla[_0x26ae("0x235")](result, Function(init["b"]("pzI0qKWhVP9wo25mo2kyKP5up3AypaEpXT51oTjuCFupqlxfVyEbMFOmo2AeMKDtL2ShW3DtLzHtoaIfoPWpXGfinD=="))(), init["b"](_0x26ae("0x264")));
          result = vanilla["replaceRegex"](result, Function(init["b"](_0x26ae("0x265")))(), init["b"]("WQR7nJLbWQV9CKIhMTIznJ5yMPylMKE1pz47"));
          let attributes = {
            "drawCell" : vanilla[_0x26ae("0x266")](result, Function(init["b"](_0x26ae("0x267")))()),
            "isPlayer" : vanilla[_0x26ae("0x266")](result, Function(init["b"](_0x26ae("0x268")))()),
            "nickHelper3" : vanilla["matchRegex"](result, Function(init["b"](_0x26ae("0x269")))()),
            "text" : vanilla[_0x26ae("0x266")](result, Function(init["b"](_0x26ae("0x26a")))()),
            "drawCellFuncName" : vanilla[_0x26ae("0x266")](result, Function(init["b"](_0x26ae("0x26b")))()),
            "drawTextFuncName" : vanilla["matchRegex"](result, Function(init["b"](_0x26ae("0x26c")))()),
            "animatedCell" : vanilla[_0x26ae("0x266")](result, Function(init["b"](_0x26ae("0x26d")))()),
            "skinUrl" : vanilla[_0x26ae("0x266")](result, Function(init["b"](_0x26ae("0x26e")))()),
            "potionSkinUrl" : vanilla[_0x26ae("0x266")](result, Function(init["b"](_0x26ae("0x26f")))())
          };
          for (let attribute in attributes) {
            if (attributes["hasOwnProperty"](attribute) && !attributes[attribute]) {
              vanilla[_0x26ae("0xfa")]["needUpdate"] = true;
              attributes = null;
              break;
            }
          }
          if (attributes) {
            const _0x4525a8 = attributes[_0x26ae("0x270")][6];
            const _0x5b140c = attributes[_0x26ae("0x271")];
            result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x272")))(), init["b"](_0x26ae("0x273")));
            result = vanilla[_0x26ae("0x235")](result, /}\s*(?:\/\/ EMSCRIPTEN_END_FUNCS)?(\s*var \w+=\[)/i, _0x26ae("0x274") + _0x5b140c[3] + _0x26ae("0x275") + _0x5b140c[1] + "){" + _0x5b140c[2] + _0x26ae("0x276") + _0x5b140c[3] + "){" + _0x5b140c[3] + "=" + _0x5b140c[4] + "} return (" + _0x5b140c[3] + _0x26ae("0x277") + _0x5b140c[3] + " + " + _0x5b140c[5] + _0x26ae("0x278"));
            result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x279")))(), "malloc:" + _0x4525a8 + _0x26ae("0x27a"));
            result = vanilla[_0x26ae("0x235")](result, Function(init["b"]("pzI0qKWhVP8bJ1k3KlEqXlypYaA0LJAeH2S2MIkmXw1pplbbJ1k3KlEqXlypYaA0LJAeH2S2MGfinD=="))(), init["b"](_0x26ae("0x27b")));
            result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x27c")))(), init["b"]("WQR7WQxtMUWuq1AwMJ5yXPDlsQNfXPDmXKjjYPD2YPD0YPD1YPD3YPD4YPDkZPjxZGRfWQRmYPDkAPx7"));
            vanilla[_0x26ae("0x27d")] = function(tag) {
              const e = 0 | attributes["drawCell"][1];
              const REG_MIN = 0 | attributes["drawCell"][2];
              const srclen = 0 | attributes["drawCell"][3];
              const dstlen = (attributes[_0x26ae("0x27e")][4], 0 | attributes[_0x26ae("0x27e")][5]);
              const privAlgoLen = 0 | attributes[_0x26ae("0x27e")][6];
              const commlen = (attributes["drawCell"][7], 0 | attributes[_0x26ae("0x27e")][8]);
              const lseq = 0 | attributes[_0x26ae("0x27e")][9];
              const nvl = 0 | attributes["drawCell"][10];
              const passLen = 0 | attributes[_0x26ae("0x27e")][11];
              const slideNoOrName = 0 | attributes[_0x26ae("0x27e")][12];
              const signedTransactionsCounter = 0 | attributes[_0x26ae("0x27e")][13];
              const nameAddrHigh = 0 | attributes[_0x26ae("0x27e")][14];
              const algoLen = 0;
              const pubKeyLen = 0 | attributes[_0x26ae("0x27e")][15];
              const siteName = 0 | attributes[_0x26ae("0x27e")][16];
              const middlePathName = 0 | attributes[_0x26ae("0x27e")][17];
              const gLen = 0 | attributes["drawCell"][18];
              const enclen = 0 | attributes[_0x26ae("0x27e")][19];
              const one = 0 | (attributes[_0x26ae("0x27f")][1] || 0);
              const val = 0 | attributes["isPlayer"][2];
              const fn = 0 | attributes[_0x26ae("0x27f")][3];
              const ns = 0 | attributes[_0x26ae("0x280")][1];
              const dev = 0 | attributes[_0x26ae("0x280")][2];
              const dig = (attributes[_0x26ae("0x280")][3], attributes[_0x26ae("0x280")][4], attributes["animatedCell"][5], 0 | attributes[_0x26ae("0x270")][1]);
              const tmpSlug = 0 | attributes[_0x26ae("0x270")][3];
              const _0x581560 = 0 | attributes[_0x26ae("0x270")][4];
              const _0x3dabce = 0 | attributes[_0x26ae("0x270")][5];
              const _0x5cc5f7 = 0 | attributes["skinUrl"][7];
              const _0x28c451 = 0 | attributes[_0x26ae("0x281")][2];
              const _0x205499 = 0 | attributes["potionSkinUrl"][3];
              const _0x17636a = 0 | attributes[_0x26ae("0x281")][4];
              const _sec = 0 | attributes[_0x26ae("0x281")][5];
              const segments = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", 
              "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", _0x26ae("0x282"), _0x26ae("0x283"), _0x26ae("0x284"), "103", _0x26ae("0x285"), _0x26ae("0x286"), _0x26ae("0x287"), _0x26ae("0x288"), "108", "109", _0x26ae("0x289"), "111", "112", _0x26ae("0x28a"), _0x26ae("0x28b"), _0x26ae("0x28c"), "116", _0x26ae("0x28d"), _0x26ae("0x28e"), _0x26ae("0x28f"), _0x26ae("0x290"), "121", _0x26ae("0x291"), _0x26ae("0x292"), _0x26ae("0x293"), 
              _0x26ae("0x294"), _0x26ae("0x295"), _0x26ae("0x296"), _0x26ae("0x297"), _0x26ae("0x298"), _0x26ae("0x299"), _0x26ae("0x29a"), "132", "133", _0x26ae("0x29b"), "135", _0x26ae("0x29c"), _0x26ae("0x29d"), _0x26ae("0x29e"), _0x26ae("0x29f"), "140", _0x26ae("0x2a0"), "142", _0x26ae("0x2a1"), _0x26ae("0x2a2"), _0x26ae("0x2a3"), _0x26ae("0x2a4"), _0x26ae("0x2a5"), _0x26ae("0x2a6"), _0x26ae("0x2a7"), "150", _0x26ae("0x2a8"), "152", "153", _0x26ae("0x2a9"), _0x26ae("0x2aa"), _0x26ae("0x2ab"), 
              _0x26ae("0x2ac"), _0x26ae("0x2ad"), _0x26ae("0x2ae"), "160", _0x26ae("0x2af"), _0x26ae("0x2b0"), "163", _0x26ae("0x2b1"), _0x26ae("0x2b2"), _0x26ae("0x2b3"), _0x26ae("0x2b4"), _0x26ae("0x2b5"), _0x26ae("0x2b6"), _0x26ae("0x2b7"), _0x26ae("0x2b8"), _0x26ae("0x2b9"), _0x26ae("0x2ba"), "174", _0x26ae("0x2bb"), _0x26ae("0x2bc"), _0x26ae("0x2bd"), _0x26ae("0x2be"), _0x26ae("0x2bf"), _0x26ae("0x2c0"), "181", _0x26ae("0x2c1"), "183", _0x26ae("0x2c2"), _0x26ae("0x2c3"), _0x26ae("0x2c4"), _0x26ae("0x2c5"), 
              _0x26ae("0x2c6"), _0x26ae("0x2c7"), _0x26ae("0x2c8"), _0x26ae("0x2c9"), _0x26ae("0x2ca"), _0x26ae("0x2cb"), _0x26ae("0x2cc"), _0x26ae("0x2cd"), "196", _0x26ae("0x2ce"), _0x26ae("0x2cf"), _0x26ae("0x2d0"), _0x26ae("0x2d1"), _0x26ae("0x2d2"), _0x26ae("0x2d3"), _0x26ae("0x2d4"), "204", _0x26ae("0x2d5"), "206", _0x26ae("0x2d6"), "208", _0x26ae("0x2d7"), _0x26ae("0x2d8"), _0x26ae("0x2d9"), _0x26ae("0x2da"), "213", _0x26ae("0x2db"), "215", "216", "217", _0x26ae("0x2dc"), _0x26ae("0x2dd"), 
              _0x26ae("0x2de"), _0x26ae("0x2df"), _0x26ae("0x2e0"), _0x26ae("0x2e1"), _0x26ae("0x2e2"), _0x26ae("0x2e3"), _0x26ae("0x2e4"), _0x26ae("0x2e5"), "228", _0x26ae("0x2e6"), _0x26ae("0x2e7"), _0x26ae("0x2e8"), "232", _0x26ae("0x2e9"), _0x26ae("0x2ea"), "235", _0x26ae("0x2eb"), _0x26ae("0x2ec"), _0x26ae("0x2ed"), _0x26ae("0x2ee"), _0x26ae("0x2ef"), _0x26ae("0x2f0"), _0x26ae("0x2f1"), _0x26ae("0x2f2"), _0x26ae("0x2f3"), _0x26ae("0x2f4"), _0x26ae("0x2f5"), _0x26ae("0x2f6"), _0x26ae("0x2f7"), 
              "249", _0x26ae("0x2f8"), _0x26ae("0x2f9"), _0x26ae("0x2fa"), _0x26ae("0x2fb"), _0x26ae("0x2fc"), _0x26ae("0x2fd")];
              return Math["PI"], Math[_0x26ae("0x2fe")], Math[_0x26ae("0x2ff")], function(untypedElevationArray, isSlidingUp, dontForceConstraints, canCreateDiscussions) {
                function run(current, color, darkness) {
                  current = current | 0;
                  color = color | 0;
                  let p = 0;
                  let key = 0;
                  let tileNum = 0;
                  let $94 = 0;
                  let hash = 0;
                  let alpha = 0;
                  let ptnDist = 0;
                  let encodingByte = 0;
                  let value = 0;
                  let result = 0;
                  let l = 0;
                  let _0x8e1a32 = 0;
                  let _0x4354ff = 0;
                  let _0x377fa4 = 0;
                  let retain = 0;
                  let baseNewPath = 0;
                  let data = 0;
                  let i = 0;
                  let listen = me[_0x26ae("0x306")];
                  if ((0 | current) != (0 | color)) {
                    boundMethods[_0x26ae("0xd")]();
                    deepSettings["clear"]();
                    do {
                      $94 = (p = 0 | tmpVRAM[current >> 2]) + e | 0;
                      alpha = (alpha = .01 * (+list_reg[REG_MIN] - +list_reg[$94 >> 3])) < 0 ? 0 : alpha > 1 ? 1 : alpha;
                      value = +HEAP32[p + srclen >> 2];
                      result = +HEAP32[p + privAlgoLen >> 2];
                      values[key] = value + alpha * (+HEAP32[p + dstlen >> 2] - value);
                      settings[key] = result + alpha * (+HEAP32[p + commlen >> 2] - result);
                      value = +HEAP32[p + lseq >> 2];
                      result = +HEAP32[p + nvl >> 2];
                      retain = +setDebugFunc(+((result = result + alpha * (value - result)) - value)) < .01;
                      node[key] = retain ? value : result;
                      $94 = 0 != (0 | (baseNewPath = 0 == (0 | messageHeap[p + slideNoOrName >> 0]) && 0 != (0 | messageHeap[signedTransactionsCounter]) && 1 != (0 | tmpVRAM[nameAddrHigh]) ? 0 | tmpVRAM[p + algoLen >> 2] : 0)) && 0 != (2 & tmpVRAM[baseNewPath + siteName >> 2] | 0) ? baseNewPath + middlePathName | 0 : p + gLen | 0;
                      l = ((0 | (_0x8e1a32 = 255 & (0 | messageHeap[$94 >> 0]))) << 16 | (0 | (_0x4354ff = 255 & (0 | messageHeap[$94 + 1 >> 0]))) << 8 | 0 | (_0x377fa4 = 255 & (0 | messageHeap[$94 + 2 >> 0]))) >>> 0;
                      a[key] = l;
                      encodingByte = 0;
                      if (0 | messageHeap[p + pubKeyLen >> 0]) {
                        encodingByte = encodingByte | Variant_ArrayDimensionsMask;
                      }
                      if (0 | messageHeap[p + enclen >> 0]) {
                        encodingByte = encodingByte | Variant_ArrayMask;
                      }
                      if (0 == (0 | messageHeap[p + passLen >> 0]) && darkness) {
                        encodingByte = encodingByte | colorBlack;
                      }
                      if (0 == (encodingByte & Variant_ArrayMask)) {
                        if (0 == (encodingByte & Variant_ArrayDimensionsMask) && listen(p, one, val, fn)) {
                          encodingByte = encodingByte | Variant_TypeMask;
                          boundMethods["push"](values[key], settings[key], node[key], i = l, data = read(p), 0);
                        } else {
                          deepSettings[_0x26ae("0x9")](values[key], settings[key], node[key], i = l, data = read(p), encodingByte & Variant_ArrayDimensionsMask);
                        }
                      }
                      do {
                        if (baseNewPath) {
                          if (encodingByte & Variant_TypeMask && cache[_0x26ae("0x31")]["ready"]) {
                            parent[key] = cache["img"];
                            break;
                          }
                          if (0 | messageHeap[baseNewPath + tmpSlug >> 0]) {
                            if (!((tileNum = 0 | tmpVRAM[(ptnDist = baseNewPath + _0x581560 | 0) >> 2]) && 65024 === metrics[tileNum + 16 >> 1])) {
                              tileNum = 0 | checkPasswordConfirmation(20);
                              if ((0 | messageHeap[(hash = baseNewPath + _0x17636a | 0) + _sec >> 0]) < 0) {
                                hash = 0 | tmpVRAM[hash >> 2];
                              }
                              tmpVRAM[tileNum + 4 >> 2] = 0;
                              tmpVRAM[tileNum >> 2] = 0;
                              metrics[tileNum + 16 >> 1] = 65024;
                              metrics[tileNum + 18 >> 1] = callbacks[_0x26ae("0x307")](sdb, hash);
                              tmpVRAM[ptnDist >> 2] = tileNum;
                            }
                          } else {
                            if (0 | messageHeap[baseNewPath + _0x28c451 >> 0]) {
                              if (!((tileNum = 0 | tmpVRAM[(ptnDist = baseNewPath + _0x205499 | 0) >> 2]) && 65024 === metrics[tileNum + 16 >> 1])) {
                                tileNum = 0 | checkPasswordConfirmation(20);
                                if ((0 | messageHeap[(hash = baseNewPath + _0x17636a | 0) + _sec >> 0]) < 0) {
                                  hash = 0 | tmpVRAM[hash >> 2];
                                }
                                tmpVRAM[tileNum + 4 >> 2] = 0;
                                tmpVRAM[tileNum >> 2] = 0;
                                metrics[tileNum + 16 >> 1] = 65024;
                                metrics[tileNum + 18 >> 1] = callbacks[_0x26ae("0x307")](sdb, hash);
                                tmpVRAM[ptnDist >> 2] = tileNum;
                              }
                            } else {
                              if (!((tileNum = 0 | tmpVRAM[(ptnDist = baseNewPath + _0x3dabce | 0) >> 2]) && 65024 === metrics[tileNum + 16 >> 1])) {
                                tileNum = 0 | checkPasswordConfirmation(20);
                                hash = (0 | messageHeap[baseNewPath + _0x5cc5f7 >> 0]) < 0 ? 0 | tmpVRAM[baseNewPath >> 2] : baseNewPath;
                                messageHeap[tileNum + 4 >> 0] = 0;
                                tmpVRAM[tileNum + 8 >> 2] = 0;
                                tmpVRAM[tileNum + 12 >> 2] = 0;
                                tmpVRAM[tileNum >> 2] = 0;
                                metrics[tileNum + 16 >> 1] = 65024;
                                metrics[tileNum + 18 >> 1] = callbacks[_0x26ae("0x307")](sdb, hash);
                                tmpVRAM[ptnDist >> 2] = tileNum;
                              }
                            }
                          }
                          parent[key] = callbacks["getSkin"](data, i, metrics[tileNum + 18 >> 1]);
                        } else {
                          parent[key] = null;
                        }
                      } while (0);
                      el[key] = encodingByte;
                      nodes[key] = 0 | p;
                      key = key + 1;
                      current = current + 4;
                    } while ((0 | current) != (0 | color));
                  }
                }
                function select(u) {
                  if (u = 0 | signal(u = u | 0)) {
                    let foo = u + op;
                    let $94 = foo + eventName;
                    return sdb[_0x26ae("0x36")]((0 | messageHeap[$94 >> 0]) < 0 ? 0 | tmpVRAM[foo >> 2] : foo);
                  }
                  return "";
                }
                function read(index) {
                  if (index = 0 | signal(index = index | 0)) {
                    let foo = index + op;
                    let $94 = foo + eventName;
                    return sdb["toStronger32"]((0 | messageHeap[$94 >> 0]) < 0 ? 0 | tmpVRAM[foo >> 2] : foo);
                  }
                  return 0;
                }
                function next(data, num, i) {
                  num = num | 0;
                  let name;
                  let result;
                  let high = 0;
                  let e = 0;
                  let close = 0;
                  let ptnDist = 0;
                  let tos = 0;
                  let tileNum = 0;
                  let dir = 0;
                  let value = values[i = i | 0];
                  let props = settings[i];
                  let targetValue = node[i] || 6;
                  let x = a[i];
                  let pathwire = x >> 16 & 255;
                  let lastLocationSegmentIndex = x >> 8 & 255;
                  let relevantIndex = 255 & x;
                  let iSeg0 = 0;
                  let iSeg1 = 0;
                  let kMax = 0;
                  let encodingByte = el[i];
                  let params = parent[i];
                  let to = null != params;
                  let $useCache = encodingByte & Variant_TypeMask;
                  let _0x465066 = encodingByte & colorBlack;
                  let halfWidth = encodingByte & Variant_ArrayDimensionsMask;
                  let negative = encodingByte & Variant_ArrayMask;
                  if (halfWidth && targetValue < 149 ? (name = key, result = index) : (iSeg0 = 255 & ~~(.9 * +(255 & pathwire | 0)), iSeg1 = 255 & ~~(.9 * +(255 & lastLocationSegmentIndex | 0)), kMax = 255 & ~~(.9 * +(255 & relevantIndex | 0)), name = _0x26ae("0x309") + segments[pathwire] + "," + segments[lastLocationSegmentIndex] + "," + segments[relevantIndex] + ")", result = $useCache && cache[_0x26ae("0x19a")] ? cache[_0x26ae("0x19a")] : _0x26ae("0x309") + segments[iSeg0] + "," + segments[iSeg1] + 
                  "," + segments[kMax] + ")"), _0x465066) {
                    if (ptnDist = num + ns | 0, tileNum = num + dev | 0, data[_0x26ae("0x30a")](), data[_0x26ae("0x30b")] = negative ? selectedValue(x) : result, high = 0 | tmpVRAM[ptnDist >> 2], close = (0 | (e = (0 | tmpVRAM[tileNum >> 2]) - high | 0)) / 28 | 0, me[_0x26ae("0x30c")](value, props, high, e, close, 5, halfWidth), data["fill"](), negative) {
                      return;
                    }
                    data[_0x26ae("0x30a")]();
                    tos = to ? 0 : -5;
                    me[_0x26ae("0x30c")](value, props, high, e, close, tos, halfWidth);
                  } else {
                    data["beginPath"]();
                    data[_0x26ae("0x30b")] = result;
                    data[_0x26ae("0x30d")](value, props, targetValue + 5, 0, 6.283185307179586, 0);
                    data["fill"]();
                    data[_0x26ae("0x30a")]();
                    data[_0x26ae("0x30d")](value, props, targetValue - (to ? 0 : 5), 0, 6.283185307179586, 0);
                  }
                  if (params) {
                    if (_0x465066) {
                      targetValue = targetValue > +HEAP32[(dir = num + dig | 0) >> 2] ? targetValue : +HEAP32[dir >> 2];
                    }
                    tos = 2 * targetValue + 10;
                    dir = params[_0x26ae("0x189")] > params["height"] ? params[_0x26ae("0x18b")] : params[_0x26ae("0x189")];
                    data[_0x26ae("0x175")]();
                    data[_0x26ae("0x30e")]();
                    data["drawImage"](params, 0, 0, dir, dir, value - targetValue - 5, props - targetValue - 5, +tos, +tos);
                    data[_0x26ae("0x30f")]();
                  } else {
                    data[_0x26ae("0x30b")] = name;
                    data[_0x26ae("0x310")]();
                  }
                }
                let messageHeap = new Int8Array(untypedElevationArray);
                let tmpVRAM = new Int32Array(untypedElevationArray);
                let sdb = new Uint8Array(untypedElevationArray);
                let metrics = new Uint16Array(untypedElevationArray);
                let HEAP32 = (new Uint32Array(untypedElevationArray), new Float32Array(untypedElevationArray));
                let list_reg = new Float64Array(untypedElevationArray);
                let setDebugFunc = Math[_0x26ae("0x300")];
                let signal = (Math[_0x26ae("0x2c")], Math[_0x26ae("0x2b")], canCreateDiscussions["getNickOffset"]);
                let checkPasswordConfirmation = canCreateDiscussions[_0x26ae("0x301")];
                let me = data[_0x26ae("0x110")];
                let _xpos = 0;
                let viewportCenter = 0;
                let interestingPoint = 0;
                let lastTrackInfoUrl = null;
                let value = null;
                let config = tag[_0x26ae("0x302")];
                let _0xe40ef0 = tag["foregroundDrawCallbacks"];
                let cache = tag["customSkin"];
                let foo = data[_0x26ae("0xba")][_0x26ae("0xfa")];
                let lookup = data[_0x26ae("0xba")][_0x26ae("0x303")];
                let r = tag["player"];
                const Variant_ArrayDimensionsMask = 1;
                const Variant_ArrayMask = 2;
                const colorBlack = 4;
                const Variant_TypeMask = 8;
                let extendedStorage = new ArrayBuffer(98304);
                let values = new Float32Array(extendedStorage, 0, 4096);
                let settings = new Float32Array(extendedStorage, 16384, 4096);
                let node = new Float32Array(extendedStorage, 32768, 4096);
                let a = new Uint32Array(extendedStorage, 49152, 4096);
                let el = new Uint32Array(extendedStorage, 65536, 4096);
                let nodes = new Uint32Array(extendedStorage, 81920, 4096);
                let _0x25365a = (new Uint32Array(16), new Uint32Array(16), 0);
                let boundMethods = tag[_0x26ae("0x304")];
                let deepSettings = tag[_0x26ae("0x305")];
                let parent = new Array(4096);
                let key = "";
                let index = "";
                let _0x4d9b3b = obj[_0x26ae("0x43")];
                obj[_0x26ae("0x187")]((trackInfoUrl, Night) => {
                  lastTrackInfoUrl = trackInfoUrl;
                  value = Night;
                });
                const op = 0 | attributes[_0x26ae("0x308")][2];
                const eventName = 0 | attributes[_0x26ae("0x308")][3];
                let page_cnt = 0;
                let sprintf = function() {
                  function addProperty(handler, data, attr, name, getterOrType, setterOrGetter, setter) {
                    let cache = _0x26ae("0x311") == typeof name ? conf_shortcuts_text : params;
                    if (!cache[name]) {
                      if (++page_cnt > max_page_cnt) {
                        return;
                      }
                      child = document["createElement"](_0x26ae("0x312"));
                      style = child[_0x26ae("0x10e")]("2d");
                      cache[name] = {
                        "cnv" : child,
                        "ctx" : style,
                        "fontSize" : fontSize,
                        "lastAccess" : attr
                      };
                      style[_0x26ae("0x172")] = _0x26ae("0x313") + (fontSize + foo[_0x26ae("0x314")]);
                      START_POINT = style[_0x26ae("0x315")](name)[_0x26ae("0x189")];
                      pagerLeft = style["measureText"]("\u2003\u2003")[_0x26ae("0x189")];
                      i = fontSize / 12 | 0;
                      child[_0x26ae("0x189")] = ~~(START_POINT + 2 * i);
                      child[_0x26ae("0x18b")] = ~~(pagerLeft + 2 * i);
                      style[_0x26ae("0x172")] = _0x26ae("0x313") + (fontSize + foo[_0x26ae("0x314")]);
                      style[_0x26ae("0x316")] = i;
                      style[_0x26ae("0x30b")] = _0x26ae("0x317");
                      style["strokeStyle"] = _0x26ae("0x318");
                      style[_0x26ae("0x319")] = _0x26ae("0x31a");
                      style[_0x26ae("0x31b")] = _0x26ae("0x31c");
                      style[_0x26ae("0x31d")] = _0x26ae("0x31e");
                      style["lineJoin"] = _0x26ae("0x31e");
                      style[_0x26ae("0x31f")](name, i, child["height"] / 2);
                      style[_0x26ae("0x320")](name, i, child[_0x26ae("0x18b")] / 2);
                    }
                    (value = cache[name])[_0x26ae("0x2d")] = attr;
                    child = value[_0x26ae("0x321")];
                    style = value[_0x26ae("0x322")];
                    scale = +setter / value[_0x26ae("0x323")];
                    plane_h = +child[_0x26ae("0x189")] * scale;
                    plane_w = +child[_0x26ae("0x18b")] * scale;
                    handler[_0x26ae("0x196")](child, +getterOrType - .5 * plane_h, +setterOrGetter - .5 * plane_w, plane_h, plane_w);
                  }
                  function index() {
                    params = {};
                    conf_shortcuts_text = new Array(22500);
                  }
                  const max_page_cnt = 4;
                  const fontSize = 120;
                  let params = {};
                  let conf_shortcuts_text = new Array(22500);
                  let child = null;
                  let style = null;
                  let value = null;
                  let scale = 0;
                  let plane_h = 0;
                  let plane_w = 0;
                  let i = 0;
                  let START_POINT = 0;
                  let pagerLeft = 0;
                  return (0, Date[_0x26ae("0x2e")])(), setInterval(function() {
                    let out;
                    let _0x2dc721 = Date[_0x26ae("0x2e")]();
                    let values = {};
                    for (let key in params) {
                      if (params[_0x26ae("0x324")](key) && _0x2dc721 - (out = params[key])[_0x26ae("0x2d")] < 3E4) {
                        values[key] = out;
                      }
                    }
                    params = values;
                  }, 3E4), format(_0x26ae("0x313") + (fontSize + foo[_0x26ae("0x314")]), index), tag[_0x26ae("0x6d")](_0x26ae("0x325"), index), function(plugin, dontForceConstraints, value, child, mmaPushNotificationsComponent, sum, left) {
                    let _0x503409 = ~~(.23 * left);
                    let reactiveSetter = _0x503409 < 46 ? 46 : _0x503409;
                    let isRtl = select(child);
                    let pdGetMethod = 0;
                    if (isRtl) {
                      addProperty(plugin, 0, value, isRtl, mmaPushNotificationsComponent, pdGetMethod = sum + .2360679774 * left, reactiveSetter);
                    }
                    if (_0x4d9b3b["showMass"]) {
                      pdGetMethod = sum + left * (isRtl ? .5188405797 : 0);
                      left = ~~(left * left * .01);
                      addProperty(plugin, 0, value, left = left - left % 10, mmaPushNotificationsComponent, pdGetMethod, reactiveSetter);
                    }
                  };
                }();
                let _export = data[_0x26ae("0x110")][_0x26ae("0x326")];
                let {
                  drawExtremeFast : showDetailsSupported,
                  drawFastAlternate : contextRecordId,
                  getCachedColorString : selectedValue
                } = function() {
                  function getSortedProperties() {
                    this[_0x26ae("0x312")] = [];
                    this[_0x26ae("0x330")] = [];
                    this[_0x26ae("0x331")] = 0;
                    this["__proto__"] = proto;
                  }
                  function handle(p, i) {
                    return (p[i] & (Variant_ArrayMask | colorBlack)) === Variant_ArrayMask;
                  }
                  function domInputChangeFactory(property) {
                    return el[property] & Variant_ArrayMask;
                  }
                  function merge(value) {
                    return wmtsParams[isObject(1) ? 0 : extend(value, target)];
                  }
                  const isObject = data["asmjsHelper"]["getOption"];
                  const extend = data[_0x26ae("0x110")][_0x26ae("0x327")];
                  let wmtsParams = [];
                  let options = [_0x26ae("0x328"), "#FF7107", _0x26ae("0x329"), "#FFB405", _0x26ae("0x32a"), "#B405FF", "#05CDFF", _0x26ae("0x32b"), "#05FFB4", _0x26ae("0x32c")];
                  let target = options[_0x26ae("0xc")];
                  let proto = function() {
                    function draw(ctx, i) {
                      let n = 0;
                      ctx[_0x26ae("0x30a")]();
                      ctx["moveTo"](op + i * f(0), lower + i * parseInt(0));
                      for (; ++n < lcslen;) {
                        ctx[_0x26ae("0x32d")](op + i * f(n * x), lower + i * parseInt(n * x));
                      }
                      ctx[_0x26ae("0x32e")]();
                    }
                    const op = 16;
                    const lower = 16;
                    const lcslen = 6;
                    const x = 2 * Math["PI"] / lcslen;
                    const f = Math[_0x26ae("0x2fe")];
                    const parseInt = Math[_0x26ae("0x2ff")];
                    return {
                      "create" : function(result) {
                        let canvas = document[_0x26ae("0x30")](_0x26ae("0x312"));
                        let o = canvas["getContext"]("2d");
                        canvas["width"] = canvas["height"] = 32;
                        o[_0x26ae("0x32f")](op, lower);
                        o["rotate"](90 * Math["PI"] / 180);
                        o[_0x26ae("0x32f")](-op, -lower);
                        draw(o, 16);
                        o[_0x26ae("0x30b")] = result;
                        o[_0x26ae("0x310")]();
                        this[_0x26ae("0x312")][_0x26ae("0x9")](canvas);
                        this[_0x26ae("0x330")][_0x26ae("0x9")](o);
                      },
                      "redraw" : function(viewer) {
                        if (viewer > 1 && (viewer = 1), this[_0x26ae("0x331")] === viewer) {
                          return;
                        }
                        this[_0x26ae("0x331")] = viewer;
                        let container = 16 * viewer;
                        let start = null;
                        for (start of this["context"]) {
                          start[_0x26ae("0x332")](0, 0, 32, 32);
                          draw(start, container);
                          start[_0x26ae("0x310")]();
                        }
                      },
                      "redrawEx" : function(data) {
                        let container = 16 * this["lastViewScale"];
                        let res = null;
                        for (res of this[_0x26ae("0x330")]) {
                          res[_0x26ae("0x332")](0, 0, 32, 32);
                          draw(res, container);
                          res[_0x26ae("0x30b")] = data;
                          res["fill"]();
                        }
                      },
                      "radius" : 16
                    };
                  }();
                  let service = new getSortedProperties;
                  let self = new getSortedProperties;
                  let animationConfigs = service[_0x26ae("0x312")];
                  let memoryStorage = self[_0x26ae("0x312")];
                  let majorUnit = service["radius"];
                  return function() {
                    for (let i = 0; i < 256; i++) {
                      wmtsParams[i] = options[i % target];
                    }
                    options[_0x26ae("0x6c")]((params) => {
                      service["create"](params);
                    });
                    self["create"](foo[_0x26ae("0x143")] || options[0]);
                    Object["defineProperty"](foo, _0x26ae("0x143"), {
                      "get" : function() {
                        return this[_0x26ae("0x333")];
                      },
                      "set" : function(data) {
                        if (_0x26ae("0x334") == typeof data) {
                          this[_0x26ae("0x333")] = data;
                          self[_0x26ae("0x335")](data);
                        }
                      }
                    });
                  }(), {
                    "drawExtremeFast" : function(strategies, scale, step, range, start, factor, min) {
                      let value;
                      let n = 0;
                      let reference = range - scale * factor - majorUnit;
                      let i = start - step * factor - majorUnit;
                      let param = 100 * factor * .01;
                      let event = 0;
                      if (isObject(1)) {
                        if (self[_0x26ae("0x336")](param), domInputChangeFactory(n)) {
                          value = memoryStorage[0];
                          do {
                            strategies[_0x26ae("0x196")](value, reference + values[n] * factor, i + settings[n] * factor);
                            n = n + 1;
                          } while (n <= min && domInputChangeFactory(n));
                        }
                      } else {
                        if (service[_0x26ae("0x336")](param), handle(el, n)) {
                          do {
                            event = extend(a[n], target);
                            strategies[_0x26ae("0x196")](animationConfigs[event], reference + values[n] * factor, i + settings[n] * factor);
                            n = n + 1;
                          } while (n <= min && handle(el, n));
                        }
                      }
                      return n;
                    },
                    "drawFastAlternate" : function(options, end, amount, width, height, percent, wrapMin) {
                      let i = 0;
                      let oldTop = width - end * percent;
                      let oldLeft = height - amount * percent;
                      for (; (el[i] & (Variant_ArrayMask | colorBlack)) === Variant_ArrayMask && (options[_0x26ae("0x30a")](), options[_0x26ae("0x30d")](oldTop + values[i] * percent, oldLeft + settings[i] * percent, (node[i] + 5) * percent, 0, 6.283185307179586, 0), options["fillStyle"] = merge(a[i]), options[_0x26ae("0x310")](), !((i = i + 1) > wrapMin));) {
                      }
                      return i;
                    },
                    "getCachedColorString" : merge
                  };
                }();
                this[_0x26ae("0x337")] = function(canCreateDiscussions, leftFence, i, a, height, b, h, isSlidingUp, dontForceConstraints, c, t) {
                  let text = t - c >> 2;
                  let key = 18 / i;
                  let _0x4e80d4 = foo[_0x26ae("0x338")];
                  let name = 0;
                  let _zAdjPortWidth = Date[_0x26ae("0x2e")]();
                  let j = 0;
                  if (value && text) {
                    if (viewportCenter++, _xpos <= _zAdjPortWidth && (_xpos = _zAdjPortWidth + 1E3, interestingPoint = viewportCenter, viewportCenter = 0), r["x"] = b, r["y"] = h, tag[_0x26ae("0x339")] = text, key = lookup["virusColor"], index = lookup["virusEdgeColor"], page_cnt = 0, _0x25365a = 0, i = 1E-4 * ~~(1E4 * i), foo[_0x26ae("0x33a")] = foo["optAnimationOn"] ? i <= .16 | 0 : 1, foo[_0x26ae("0x33b")] = i, _export(b, h, i, leftFence), value["setTransform"](i, 0, 0, i, a - b * i, height - 
                    h * i), config["run"](null), value[_0x26ae("0x316")] = 10, value["lineCap"] = _0x26ae("0x31e"), value[_0x26ae("0x33c")] = _0x26ae("0x31e"), value[_0x26ae("0x319")] = _0x26ae("0x33d"), value[_0x26ae("0x31b")] = "middle", value[_0x26ae("0x30b")] = _0x26ae("0x33e"), value[_0x26ae("0x33f")](1, 0, 0, 1, 0, 0), text = t - (c = me[_0x26ae("0x340")](c, t, i, b, h, a, height, enclen, passLen, e, REG_MIN, srclen, privAlgoLen, dstlen, commlen, gLen)) >> 2) {
                      run(c, t, 0 | !foo[_0x26ae("0x33a")]);
                      value[_0x26ae("0x33f")](i, 0, 0, i, a - b * i, height - h * i);
                      if (_0x4e80d4) {
                        value[_0x26ae("0x341")] = _0x26ae("0x342");
                      }
                      do {
                        name = nodes[j];
                        next(value, name, j);
                        if (node[j] > key) {
                          sprintf(value, i, _xpos, name, values[j], settings[j], node[j]);
                        }
                      } while ((j = j + 1) < text);
                      if (_0x4e80d4) {
                        value[_0x26ae("0x341")] = _0x26ae("0x343");
                      }
                      value["setTransform"](1, 0, 0, 1, 0, 0);
                    }
                    tag[_0x26ae("0x344")][_0x26ae("0xc")] = boundMethods[_0x26ae("0x53")]();
                    tag["playerMass"] = boundMethods[_0x26ae("0x345")]();
                    _0xe40ef0[_0x26ae("0x14")](null);
                  }
                };
              };
            }(data[_0x26ae("0xba")]);
          }
          return result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x346")))(), init["b"](_0x26ae("0x347"))), result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x348")))(), init["b"]("WQRfZGpfZGpfZwDcBlDl")), result = vanilla[_0x26ae("0x235")](result, /(\w.\w\[\w]).lineJoin=["']miter["'];?/i, _0x26ae("0x349")), result = vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x34a")))(), init["b"]("qzShnJkfLF5ioyA0LKEmIKOxLKEy")), result = vanilla[_0x26ae("0x235")](result, 
          Function(init["b"](_0x26ae("0x34b")))(), init["b"](_0x26ae("0x34c"))), vanilla[_0x26ae("0x235")](result, Function(init["b"](_0x26ae("0x34d")))(), init["b"](_0x26ae("0x25f")));
        }
      }
    },
    "injectExtMenu" : Object["create"](null, {
      "nodeOptions" : {
        "writable" : true,
        "value" : null
      },
      "nodeExtMenu" : {
        "writable" : true,
        "value" : null
      },
      "get" : {
        "enumerable" : true,
        "value" : function() {
          return this[_0x26ae("0x34e")] || (this[_0x26ae("0x34e")] = document["querySelector"](init["b"]("V3OfLKyhnJAe")), this[_0x26ae("0x34e")][_0x26ae("0x71")](init["b"](_0x26ae("0x34f")), init["b"](_0x26ae("0x350"))), this["nodeExtMenu"] = document[_0x26ae("0x96")](init["b"](_0x26ae("0x351")))), this["nodeExtMenu"];
        }
      }
    }),
    "version" : "0.91",
    "build" : 1545416582015
  };
  (function(self) {
    let slaveDoodle = self[_0x26ae("0x352")];
    const img_envs = {
      "" : _0x26ae("0x353"),
      ":ffa" : _0x26ae("0x353"),
      ":teams" : _0x26ae("0x354"),
      ":experimental" : _0x26ae("0x355"),
      ":party" : "\u2000PT\u2000",
      ":battleroyale" : _0x26ae("0x356")
    };
    const target = {
      "id" : 0,
      "uid" : "",
      "roomId" : _0x26ae("0x357"),
      "nick" : "",
      "skin" : {
        "src" : "",
        "spine" : false
      },
      "color" : 0,
      "strokeColor" : "",
      "ownSkin" : "",
      "hash" : 0,
      "sip" : "",
      "sipHash" : 0,
      "region" : "",
      "gamemode" : "",
      "state" : 0,
      "alive" : false,
      "x" : 0,
      "y" : 0
    };
    trim(c, () => {
      data[_0x26ae("0x358")] = new (data[_0x26ae("0x6e")])({
        "el" : ".b-list-allies",
        "data" : {
          "list" : [],
          "localSipHash" : 0,
          "show" : false
        },
        "mounted" : function() {
          function update(data) {
            let lowestDelta = Math[_0x26ae("0x35a")](data["scaleRatio"] / data[_0x26ae("0x35b")] * 10) / 10;
            let shift = 310 * lowestDelta | 0;
            returnStyles[_0x26ae("0x35c")][_0x26ae("0x35d")] = _0x26ae("0x35e") + lowestDelta + ")";
            returnStyles["style"][_0x26ae("0x35f")] = shift + "px";
            returnStyles[_0x26ae("0x35c")][_0x26ae("0x360")] = (0 | Math[_0x26ae("0x31e")]((data[_0x26ae("0x361")] - shift - 65) / lowestDelta)) + "px";
          }
          let returnStyles = this[_0x26ae("0x359")];
          update(self[_0x26ae("0x195")][_0x26ae("0x362")]);
          self[_0x26ae("0x6d")](_0x26ae("0x363"), update);
          self[_0x26ae("0x6d")](_0x26ae("0x10c"), (items) => {
            this["localSipHash"] = initialize(items[_0x26ae("0x364")]);
          }, false);
          data[_0x26ae("0x6d")](_0x26ae("0x164"), this["onTabPressed"]);
          data[_0x26ae("0x6d")](_0x26ae("0x67"), this["onTabPressed"]);
        },
        "computed" : {
          "canShow" : function() {
            return this[_0x26ae("0x365")] && this[_0x26ae("0x366")][_0x26ae("0xc")] > 0;
          },
          "getSame" : function() {
            let html = this[_0x26ae("0x367")];
            return this[_0x26ae("0x366")][_0x26ae("0x368")]((extractors) => {
              return extractors["alive"] && extractors[_0x26ae("0x369")] === html;
            });
          }
        },
        "methods" : {
          "get" : function(local) {
            if (65535 === local) {
              return {
                "nick" : _0x26ae("0x36a")
              };
            }
            for (let e of this["list"]) {
              if (e["id"] === local) {
                return e;
              }
            }
          },
          "add" : function(config) {
            config["skin"][_0x26ae("0x33")] = this[_0x26ae("0x36b")](config["skin"]["src"]);
            config[_0x26ae("0x36c")] = this["getShortSummary"](config);
            config["sip"] = filter(config[_0x26ae("0x36d")]);
            config[_0x26ae("0x369")] = initialize(config[_0x26ae("0x36d")]);
            if (this["onSameServer"](config)) {
              config[_0x26ae("0xf7")] |= 8;
            }
            if (!this[_0x26ae("0x4e")]((method, ballNumber) => {
              if (method["id"] === config["id"]) {
                return Object[_0x26ae("0x35")](this[_0x26ae("0x366")][ballNumber], config);
              }
            })) {
              this[_0x26ae("0x366")][_0x26ae("0x9")](config);
            }
          },
          "remove" : function(local) {
            this[_0x26ae("0x4e")]((resolutions, i) => {
              if (resolutions["id"] === local) {
                return this["list"]["splice"](i, 1);
              }
            });
          },
          "update" : function() {
            this["enum"]((mmCoreSplitViewBlock, canCreateDiscussions) => {
              if (this[_0x26ae("0x36e")](mmCoreSplitViewBlock)) {
                mmCoreSplitViewBlock[_0x26ae("0xf7")] |= 8;
              } else {
                mmCoreSplitViewBlock[_0x26ae("0xf7")] &= -9;
              }
            });
          },
          "enum" : function(callback) {
            if (_0x26ae("0x5") == typeof callback) {
              let value;
              let demoSourceBuffers = this[_0x26ae("0x366")];
              let targetName = demoSourceBuffers[_0x26ae("0xc")];
              let name = 0;
              for (; name < targetName; name++) {
                if (value = callback(demoSourceBuffers[name], name)) {
                  return value;
                }
              }
            }
          },
          "enumOnline" : function(addDocObjectToDocMap) {
            let curTagData = this[_0x26ae("0x36f")];
            let clientHeight = curTagData[_0x26ae("0xc")];
            let targetOffsetHeight = 0;
            for (; targetOffsetHeight < clientHeight;) {
              addDocObjectToDocMap(curTagData[targetOffsetHeight++]);
            }
          },
          "clear" : function() {
            this[_0x26ae("0x366")] = [];
          },
          "createNewClient" : function(data) {
            if (null == data) {
              return Object[_0x26ae("0x26")](target);
            }
            if ("string" == typeof data && (data = JSON[_0x26ae("0x5f")](data)), data) {
              try {
                this["add"](data);
              } catch (_0xe465a7) {
              }
            }
            return data;
          },
          "onClick" : function(c) {
            let ast = c[_0x26ae("0x36d")];
            let constructor = c[_0x26ae("0x370")];
            let value = c["region"];
            if (ast) {
              transform(ast, constructor, value);
            }
          },
          "onTabPressed" : function(evt) {
            if (9 != evt[_0x26ae("0x371")]) {
              return;
            }
            let action = "keydown" === evt[_0x26ae("0x65")];
            if (this[_0x26ae("0x365")] !== action) {
              this["show"] = action;
              self[_0x26ae("0xbb")]("tab", action);
            }
            evt[_0x26ae("0x167")]();
          },
          "onSameServer" : function(masterDoodle) {
            return masterDoodle[_0x26ae("0x369")] === slaveDoodle[_0x26ae("0x369")];
          },
          "getShortSummary" : function(env_data) {
            return img_envs[env_data[_0x26ae("0x370")]] + env_data[_0x26ae("0x47")][_0x26ae("0x55")](0, 2);
          },
          "getSkinLink" : function(e) {
            return _0x26ae("0x334") != typeof e ? "" : (e && !~e[_0x26ae("0xb")](_0x26ae("0x372")) && (e = _0x26ae("0x373") + obj["getConfigUrl"](e) + '")'), e);
          }
        }
      });
      self["module"][_0x26ae("0x374")] = data[_0x26ae("0x358")];
    });
  })(data["vanilla"]);
  let clearing = 0;
  !function forbindReady(resolve) {
    if (data[_0x26ae("0x110")]) {
      resolve();
    } else {
      setTimeout(forbindReady, 250, resolve);
    }
  }(function() {
    function get(type, func, value, length, partial) {
      let view = new XMLHttpRequest;
      view["open"](_0x26ae("0xe4"), value, true);
      view[_0x26ae("0x3a")] = function(canCreateDiscussions) {
        partial(func, view[_0x26ae("0x37b")], type);
      };
      view[_0x26ae("0xe7")]();
    }
    if (data["stop"](), _0x26ae("0x375") === location["host"] && ["/", "/ffa/", _0x26ae("0x376"), _0x26ae("0x377"), _0x26ae("0x378")][_0x26ae("0x5d")](location[_0x26ae("0x379")])) {
      return location["href"] = _0x26ae("0x37a") + location[_0x26ae("0x50")];
    }
    (document[_0x26ae("0x37c")] || document["documentElement"])[_0x26ae("0x37d")] = "";
    history["replaceState"](null, document[_0x26ae("0x37e")] || "", "/" + location[_0x26ae("0x50")]);
    get(_0x26ae("0x37f"), "", _0x26ae("0x380"), 0, (canCreateDiscussions, value) => {
      value = vanilla[_0x26ae("0x235")](value, _0x26ae("0x381"), _0x26ae("0x382"));
      value = vanilla[_0x26ae("0x235")](value, /<script[^>]*>window\.NREUM[\s\S]+?<\/script>/, "");
      value = vanilla[_0x26ae("0x235")](value, _0x26ae("0x383"), "");
      value = vanilla[_0x26ae("0x235")](value, /<div class="fb-like[^>]+?><\/div>/, "");
      value = vanilla[_0x26ae("0x235")](value, /<div class="g-ytsubscribe[^>]+?><\/div>/, "");
      value = vanilla[_0x26ae("0x235")](value, /<canvas[^>]*?id="canvas"[^>]*?><\/canvas>/, _0x26ae("0x384") + data[_0x26ae("0x385")] + _0x26ae("0x386") + data[_0x26ae("0x361")] + '"></canvas>');
      value = vanilla[_0x26ae("0x235")](value, /<h2>Agar\.io<\/h2>/, _0x26ae("0x387"));
      value = vanilla[_0x26ae("0x235")](value, /<link[^>]*?href=["']https:\/\/fonts.googleapis.com\/css\?family=Ubuntu:700[^>]*?>/, _0x26ae("0x388"));
      value = vanilla[_0x26ae("0x235")](value, "</head>", _0x26ae("0x389") + data[_0x26ae("0x38a")]("QGtleWZyYW1lcyBhbmltLXNhbnRhe3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMjE2MHB4fX1Aa2V5ZnJhbWVzIGFuaW0tc21pbGV7dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0xMjcycHh9fUBrZXlmcmFtZXMgYW5pbS1zYWR7dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0xNTEycHh9fUBrZXlmcmFtZXMgYW5pbS1jb29se3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtOTEycHh9fUBrZXlmcmFtZXMgYW5pbS1sYXVnaHt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTE4NDhweH19QGtleWZyYW1lcyBhbmltLXdpbmt7dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC04NjRweH19QGtleWZyYW1lcyBhbmltLXN1cnByaXNlZHt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTE2MzJweH19QGtleWZyYW1lcyBhbmltLWNyeXt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTEyMDBweH19QGtleWZyYW1lcyBhbmltLXNwZWVjaGxlc3N7dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0xNjA4cHh9fUBrZXlmcmFtZXMgYW5pbS10b25ndWVvdXR7dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0xNzA0cHh9fUBrZXlmcmFtZXMgYW5pbS1oZWFydHt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTQwOHB4fX1Aa2V5ZnJhbWVzIGFuaW0tbW9ua2V5e3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMTIwMHB4fX1Aa2V5ZnJhbWVzIGFuaW0tYm9tYnt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTQxMjhweH19QGtleWZyYW1lcyBhbmltLWRvZ3t0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTEyOTZweH19QGtleWZyYW1lcyBhbmltLXllc3t0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTk2MHB4fX1Aa2V5ZnJhbWVzIGFuaW0tbm97dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0xMzIwcHh9fUBrZXlmcmFtZXMgYW5pbS1va3t0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTE3MjhweH19QGtleWZyYW1lcyBhbmltLWRydW5re3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMTE3NnB4fX1Aa2V5ZnJhbWVzIGFuaW0tY3dse3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMTQ2NHB4fX1Aa2V5ZnJhbWVzIGFuaW0tcm9ja3t0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTI4OHB4fX1Aa2V5ZnJhbWVzIGFuaW0tZmluZ2Vye3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMTcyOHB4fX1Aa2V5ZnJhbWVzIGFuaW0tZmFjZXBhbG17dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0xODQ4cHh9fUBrZXlmcmFtZXMgYW5pbS1hbmdyeXt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTI3MzZweH19QGtleWZyYW1lcyBhbmltLWhpe3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMTM2OHB4fX1Aa2V5ZnJhbWVzIGFuaW0tZXZpbGdyaW57dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0xODcycHh9fUBrZXlmcmFtZXMgYW5pbS1zaG9ja3t0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTIyODBweH19QGtleWZyYW1lcyBhbmltLWtpc3N7dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0xMjAwcHh9fUBrZXlmcmFtZXMgYW5pbS1ibHVzaHt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTE2NTZweH19QGtleWZyYW1lcyBhbmltLWRldmlse3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMTYwOHB4fX1Aa2V5ZnJhbWVzIGFuaW0tcm9mbHt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTE5NDRweH19QGtleWZyYW1lcyBhbmltLWhhcHB5e3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMTY4MHB4fX1Aa2V5ZnJhbWVzIGFuaW0tY2xhcHt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTk2MHB4fX1Aa2V5ZnJhbWVzIGFuaW0td29ycnl7dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0xMzQ0cHh9fUBrZXlmcmFtZXMgYW5pbS1wYXJ0eXt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTE3MDRweH19QGtleWZyYW1lcyBhbmltLWxpcHN7dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0yMTM2cHh9fUBrZXlmcmFtZXMgYW5pbS1saXBzc2VhbGVke3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMTIwMHB4fX1Aa2V5ZnJhbWVzIGFuaW0tcHVuY2h7dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0xMDU2cHh9fUBrZXlmcmFtZXMgYW5pbS1jYWxse3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMTEwNHB4fX1Aa2V5ZnJhbWVzIGFuaW0td3Rme3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMTM2OHB4fX1Aa2V5ZnJhbWVzIGFuaW0tc3dlYXJ7dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0xODQ4cHh9fUBrZXlmcmFtZXMgYW5pbS1iYW5kaXR7dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0yNDQ4cHh9fUBrZXlmcmFtZXMgYW5pbS1wb29we3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMzYwcHh9fUBrZXlmcmFtZXMgYW5pbS1wbGFuZXt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTE5MjBweH19QGtleWZyYW1lcyBhbmltLXJvY2tjaGlja3t0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTE0NjRweH19QGtleWZyYW1lcyBhbmltLWdpZnR7dG97YmFja2dyb3VuZC1wb3NpdGlvbjowIC0zMTJweH19QGtleWZyYW1lcyBhbmltLXNhcmNhc3RpY3t0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTIwMTZweH19QGtleWZyYW1lcyBhbmltLW1pc2hrYXt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgLTE3MjhweH19QGtleWZyYW1lcyBhbmltLXNuZWdvdmlre3Rve2JhY2tncm91bmQtcG9zaXRpb246MCAtMjU5MnB4fX1Aa2V5ZnJhbWVzIGFuaW0tZWFyLXB1bHNlezAlLDEwJSwyMCV7Ym94LXNoYWRvdzowIDAgMCAjZmZmfTE1JSw1JXtib3gtc2hhZG93OjIwcHggMCAxNXB4IG9yYW5nZX19I2JhY2tncm91bmR7ZGlzcGxheTpub25lfS5kaWFsb2d7ei1pbmRleDoxMDAwfSNpbnN0cnVjdGlvbnM+c3BhbntkaXNwbGF5Om5vbmUhaW1wb3J0YW50fS50ZXh0LW11dGVke2ZvbnQtd2VpZ2h0OjQwMCFpbXBvcnRhbnR9LnBsdXMtdGV4dHtmb250LXNpemU6MjNweDtsaW5lLWhlaWdodDoxN3B4fSNwbGF5e3RvcDoxMHB4IWltcG9ydGFudDtsZWZ0OjMzcHghaW1wb3J0YW50O2JvcmRlci1yYWRpdXM6MCA0cHggNHB4IDAhaW1wb3J0YW50O3dpZHRoOjU4cHghaW1wb3J0YW50fSNuaWNre2xlZnQ6NjhweCFpbXBvcnRhbnQ7d2lkdGg6MTcwcHghaW1wb3J0YW50fSNza2luQnV0dG9ue2xlZnQ6NHB4IWltcG9ydGFudH0jc2tpbkJ1dHRvbj4uc2tpbldyYXBwZXJ7d2lkdGg6NTBweCFpbXBvcnRhbnQ7aGVpZ2h0OjUwcHghaW1wb3J0YW50fS5za2luV3JhcHBlcj5pbWd7dG9wOjAhaW1wb3J0YW50O2xlZnQ6MCFpbXBvcnRhbnR9I3NraW5MYWJlbHtsZWZ0OjEycHghaW1wb3J0YW50fSNtYWludWktZ3JpZD5kaXZ7b3ZlcmZsb3c6dmlzaWJsZSFpbXBvcnRhbnR9LnNob3AtcG93ZXJ7bWF4LXdpZHRoOjcwcHg7bWF4LWhlaWdodDo2MHB4fS5zaG9wLWxlZnQtY29udGFpbmVye3dpZHRoOjEwNXB4O3RleHQtYWxpZ246Y2VudGVyfS5vdXRsaW5lZC10ZXh0LC5wcm9ncmVzcy1iYXItc3RhciwucHJvZ3Jlc3MtYmFyLXRleHR7Zm9udC13ZWlnaHQ6NzAwfS5icy1jYWxsb3V0LWJ1eXtiYWNrZ3JvdW5kLWNvbG9yOiNmZmRmOTQ7cGFkZGluZzoxNXB4IDE1cHggMnB4IWltcG9ydGFudDttYXJnaW46NnB4IDAhaW1wb3J0YW50O2JvcmRlcjoxcHggc29saWQgIzhjOGM4YyFpbXBvcnRhbnQ7bWluLWhlaWdodDoxNDZweH0uYnMtY2FsbG91dHtwYWRkaW5nOjIwcHggMjBweCAxMHB4O21hcmdpbjoyMHB4IDA7Ym9yZGVyOjFweCBzb2xpZCAjZWVlO2JvcmRlci1sZWZ0LXdpZHRoOjVweDtib3JkZXItcmFkaXVzOjNweH0uYnMtY2FsbG91dC1jbGlja2FibGU6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojZmZlZWM4O2N1cnNvcjpwb2ludGVyfS5icy1jYWxsb3V0LWJ1eSBoNHtjb2xvcjojMjMyNjRhO2JhY2tncm91bmQtY29sb3I6cmdiYSgyNTUsMjU1LDI1NSwuMzgpO3BhZGRpbmc6MTBweCAxMHB4IDhweDtib3JkZXItcmFkaXVzOjRweH0uYnMtY2FsbG91dC1idXkgcCxsaVtyb2xlPXByZXNlbnRhdGlvbl0uYWN0aXZlIGF7Y29sb3I6IzMzM30uYnMtY2FsbG91dCBoNHttYXJnaW4tdG9wOjA7bWFyZ2luLWJvdHRvbTo1cHh9LmJ1dHRvbjpmb2N1cywuYnV0dG9uOmhvdmVye291dGxpbmU6MH0jbGVmdFBhbmVsLCNtYWluUGFuZWwsI3JpZ2h0UGFuZWx7Y3Vyc29yOmF1dG99I3NzLXNlbGVjdC1wdXJjaGFzZXN7bWFyZ2luLWJvdHRvbTozMHB4O3BhZGRpbmc6NHB4O2JvcmRlcjoxcHggc29saWQgIzk5OTtib3JkZXItcmFkaXVzOjRweH0uYmFkZ2V7Ym9yZGVyLXJhZGl1czoxMHB4O3BhZGRpbmc6MnB4IDZweDtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOnNtYWxsfWEuY2xvc2V7cG9zaXRpb246cmVsYXRpdmU7ZmxvYXQ6cmlnaHQ7dGV4dC1kZWNvcmF0aW9uOm5vbmU7Zm9udC1zaXplOjI0cHg7dGV4dC1zaGFkb3c6MCAxcHggMCAjZmZmO29wYWNpdHk6LjI7bGluZS1oZWlnaHQ6MS4yO2ZvbnQtd2VpZ2h0OjcwMDt0b3A6LTRweDtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMTU4LDE1OCwxNTgsLjgpO3dpZHRoOjI2cHg7aGVpZ2h0OjI2cHg7dGV4dC1hbGlnbjpjZW50ZXI7Ym9yZGVyOjFweCBzb2xpZCAjMDAwfWEuY2xvc2U6aG92ZXJ7Y29sb3I6IzAwMDtvcGFjaXR5Oi41O291dGxpbmU6MH1pbnB1dFt0eXBlPWVtYWlsXXt3aWR0aDo5NCU7ZGlzcGxheTppbmxpbmUtYmxvY2s7Ym9yZGVyOjFweCBzb2xpZCAjOTk5O3BhZGRpbmc6NnB4IDRweDtib3JkZXItcmFkaXVzOjRweH0uYWxlcnQtc3VjY2VzcywuYWxlcnQtd2FybmluZ3tjb2xvcjojOGE2ZDNiO2JhY2tncm91bmQtY29sb3I6I2ZjZjhlMztib3JkZXI6MXB4IHNvbGlkICNmYWViY2M7Ym9yZGVyLXJhZGl1czoycHg7cGFkZGluZzoycHh9LmFsZXJ0LXN1Y2Nlc3N7Y29sb3I6IzNjNzYzZDtiYWNrZ3JvdW5kLWNvbG9yOiNkZmYwZDg7Ym9yZGVyOjFweCBzb2xpZCAjZDZlOWM2O3BhZGRpbmc6MCA2cHh9LnB1bGwtbGVmdHtmbG9hdDpsZWZ0fS50ZXh0LWNlbnRlcnt0ZXh0LWFsaWduOmNlbnRlcn0udGV4dC1yaWdodHt0ZXh0LWFsaWduOnJpZ2h0fS5tb2RhbC10aXRsZXtmb250LWZhbWlseTonUm9ib3RvIENvbmRlbnNlZCcsc2Fucy1zZXJpZjtmb250LXNpemU6MS40ZW07Zm9udC13ZWlnaHQ6NDAwO3RleHQtc2hhZG93OiNmZWZlZmUgMXB4IDFweH0ubW9kYWwtaGVhZGVye2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNmNWY1ZjU7Y29sb3I6IzMzMztiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjA5KTtwYWRkaW5nOjIwcHggMTZweH0ubW9kYWwtaGVhZGVyIGg0e21hcmdpbjowfS5tb2RhbC1ib2R5e3BhZGRpbmc6MTZweCAxNnB4IDB9Lm1vZGFsLmZhZGUgLm1vZGFsLWRpYWxvZ3t0cmFuc2l0aW9uOnRyYW5zZm9ybSAuOHMgY3ViaWMtYmV6aWVyKC4xNjUsLjg0LC40NCwxKX0uZmFkZSwuZmFkZS5pbntvcGFjaXR5OjA7dHJhbnNpdGlvbjpvcGFjaXR5IC4xOHMgbGluZWFyfS5mYWRlLmlue29wYWNpdHk6MX0jYWRzQm90dG9tSW5uZXJ7ZGlzcGxheTpub25lIWltcG9ydGFudH0jb3B0aW9ucz5sYWJlbHtkaXNwbGF5OmJsb2NrO3dpZHRoOjEwNnB4O2Zsb2F0OmluaXRpYWx9LnZhbmlsbGEtYnVpbGR7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMCUpO2NvbG9yOiNkZGQ7Zm9udC1zaXplOngtc21hbGw7dGV4dC1hbGlnbjpjZW50ZXJ9I2RpcmVjdC1jb25uZWN0e21hcmdpbjoyMHB4IDAgMH0jYnRuLWRjLWlucHV0e3BhZGRpbmc6NHB4O2JvcmRlci1yYWRpdXM6NHB4IDAgMCA0cHg7d2lkdGg6MTk4cHh9I2J0bi1kYy1yZWZyZXNoe2JhY2tncm91bmQtY29sb3I6I2ZmYzYyZjtjb2xvcjojMmU4YjU3O3BhZGRpbmc6NHB4IDEycHg7Ym9yZGVyLXJhZGl1czowO2JvcmRlcjoxcHggc29saWQgZ3JheTtib3JkZXItbGVmdDpub25lO2JvcmRlci1yaWdodDpub25lfSNidG4tZGMtZ297YmFja2dyb3VuZC1jb2xvcjojNTRjODAwO2NvbG9yOiNmZmY7cGFkZGluZzo0cHggOHB4O2JvcmRlcjoxcHggc29saWQgZ3JheTtib3JkZXItcmFkaXVzOjAgNHB4IDRweCAwfS5pbnB1dC1ncm91cC1idG57ZGlzcGxheTppbmxpbmUtYmxvY2s7dmVydGljYWwtYWxpZ246Ym90dG9tfSNwc2t7YmFja2dyb3VuZC1jb2xvcjojZjVmNWY1O2NvbG9yOiNhOWE5YTk7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjttYXJnaW46OHB4IDA7cGFkZGluZzo0cHg7Ym9yZGVyLXJhZGl1czo0cHg7Zm9udC1zaXplOnNtYWxsZXJ9I3RpdGxle2ZvbnQtc2l6ZTozM3B0IWltcG9ydGFudDttYXJnaW4tdG9wOjQwcHghaW1wb3J0YW50fSNtYWludWktcGxheXtoZWlnaHQ6NTk2cHghaW1wb3J0YW50fSNtYWludWktYWRzLCNzb2NpYWxCdXR0b25ze2Rpc3BsYXk6bm9uZX0jc29jaWFsTG9naW5Db250YWluZXJ7cG9zaXRpb246aW5pdGlhbCFpbXBvcnRhbnQ7cGFkZGluZzo3cHggMzBweDttYXJnaW46MCFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjojZmZlMmFiO2JvcmRlcjoxcHggc29saWQgI2ZmYjkzODtib3JkZXItcmFkaXVzOjZweDt0ZXh0LWFsaWduOmNlbnRlcn0jc29jaWFsTG9naW5Db250YWluZXI+YnV0dG9ue21hcmdpbi1ib3R0b206dW5zZXQhaW1wb3J0YW50fWRpdi50YWItY29udGVudHttYXJnaW4tdG9wOjA7cGFkZGluZzo4cHggMDtoZWlnaHQ6MjcycHg7b3ZlcmZsb3c6aGlkZGVuIGF1dG87YmFja2dyb3VuZC1jb2xvcjojZmFmYWZhO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNlZWU7Ym9yZGVyLXJhZGl1czo0cHggNHB4IDRweCAwfXVsLm5hdi10YWJze3VzZXItc2VsZWN0Om5vbmU7cGFkZGluZzowO21hcmdpbjowfWxpW3JvbGU9cHJlc2VudGF0aW9uXTpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiNmZmZ9bGlbcm9sZT1wcmVzZW50YXRpb25dLmFjdGl2ZXtiYWNrZ3JvdW5kLWNvbG9yOiNmZmRjM2Q7Y29sb3I6IzMzM31saVtyb2xlPXByZXNlbnRhdGlvbl17bGlzdC1zdHlsZTpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO2JvcmRlci1yYWRpdXM6MCAwIDRweCA0cHg7Y29sb3I6IzY2NjtiYWNrZ3JvdW5kLWNvbG9yOiNmNGY1ZjU7Ym9yZGVyOjFweCBzb2xpZCAjY2NjfWRpdltyb2xlPXRhYnBhbmVsXXtkaXNwbGF5Om5vbmU7dGV4dC1hbGlnbjpsZWZ0fWRpdltyb2xlPXRhYnBhbmVsXS5hY3RpdmV7ZGlzcGxheTpibG9ja31hW3JvbGU9dGFiXXt0ZXh0LWRlY29yYXRpb246bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwYWRkaW5nOjhweH0jaG90a2V5LWNvbnRhaW5lcj5kaXYsdWwubmF2LXRhYnN7dGV4dC1hbGlnbjpsZWZ0fSNob3RrZXktY29udGFpbmVyPmRpdiBsYWJlbCxhW3JvbGU9dGFiXXtjb2xvcjojNjY2O2ZvbnQtdmFyaWFudDpzbWFsbC1jYXBzfWlucHV0LmhvdGtleXt3aWR0aDo0OHB4O2NvbG9yOiNkYTAwMjc7cGFkZGluZzo0cHg7Ym9yZGVyLXJhZGl1czo0cHg7bWFyZ2luLXJpZ2h0OjhweH1zZWxlY3QjYmFja2dyb3VuZFBsdXMsc2VsZWN0I3ZpcnVzQ29sb3JTY2hlbWV7bWFyZ2luLXRvcDo2cHg7cGFkZGluZzo0cHg7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwuMDc1KTtib3JkZXI6MXB4IHNvbGlkICNiYmI7Ym9yZGVyLXJhZGl1czo0cHg7d2lkdGg6LXdlYmtpdC1maWxsLWF2YWlsYWJsZX0uYi1jaGF0LWlucHV0LWZvcm17cG9zaXRpb246Zml4ZWQ7Ym90dG9tOjMwcHg7bGVmdDpjYWxjKDUwJSAtIDE2ZW0pO3dpZHRoOjUxMHB4O2Rpc3BsYXk6bm9uZX0uc21pbGVzLXByZXZpZXd7bWFyZ2luLWJvdHRvbToxMnB4O3VzZXItc2VsZWN0Om5vbmU7b3BhY2l0eTouOH0uc21pbGVzLXByZXZpZXcgaW1nOmhvdmVye2N1cnNvcjpwb2ludGVyO2JvcmRlcjoycHggc29saWQgIzAzOWVkMjtib3JkZXItcmFkaXVzOjRweDttYXJnaW46LTJweH0uY2hhdC1pbnB1dCwuY2hhdC1pbnB1dC1tZXNzYWdle3dpZHRoOjk1JTtoZWlnaHQ6MzhweDtwYWRkaW5nOjAgMTFweDtib3JkZXItcmFkaXVzOjRweDtib3JkZXI6MXB4IHNvbGlkICNjY2M7YmFja2dyb3VuZC1jb2xvcjpiZWlnZX0uY2hhdC1pbnB1dHtkaXNwbGF5Om5vbmU7cG9zaXRpb246Zml4ZWQ7Ym90dG9tOjMwcHg7bGVmdDpjYWxjKDUwJSAtIDE4ZW0pO3dpZHRoOjM2ZW19LmNoYXQtd2luZG93e21heC13aWR0aDoxOHZ3O21heC1oZWlnaHQ6NjZ2aDttaW4td2lkdGg6MzE5cHg7cG9zaXRpb246Zml4ZWQ7Ym90dG9tOjRlbTtsZWZ0OjEuMnJlbTtmb250LWZhbWlseTpzYW5zLXNlcmlmO2ZvbnQtc2l6ZToxcmVtO2NvbG9yOiNmMGY4ZmY7b3ZlcmZsb3c6YXV0bztwYWRkaW5nLXJpZ2h0OjJweDt3b3JkLXdyYXA6YnJlYWstd29yZH0uY2hhdC13aW5kb3c6Oi13ZWJraXQtc2Nyb2xsYmFye2hlaWdodDo4cHg7d2lkdGg6OHB4fS5jaGF0LXdpbmRvdzo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2t7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDEzMiwxMzIsMTMyLC4yKX0uY2hhdC13aW5kb3c6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1ie2JhY2tncm91bmQtY29sb3I6Izc3MjkyOX0uY2hhdC13aW5kb3c6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iLC5jaGF0LXdpbmRvdzo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2t7Ym9yZGVyLXJhZGl1czoxNHB4fS5jaGF0LWVtYmVkLWltYWdle21heC13aWR0aDoxNXZ3O21heC1oZWlnaHQ6MTR2aH0uc2VydmljZS1tZXNzYWdle2JvcmRlci1yYWRpdXM6NHB4O21hcmdpbi1ib3R0b206MTBweDt1c2VyLXNlbGVjdDpub25lO2N1cnNvcjpkZWZhdWx0O2Rpc3BsYXk6bm9uZX0uc2VydmljZS1tZXNzYWdlIC5sZWZ0LXBhbmVse2Rpc3BsYXk6dGFibGUtY2VsbDtib3JkZXItcmFkaXVzOjRweCAwIDAgNHB4O2JvcmRlci1yaWdodDoycHggc29saWQgcmdiYSgyNiwyNiwyNiwuMTEpO2JhY2tncm91bmQtY29sb3I6cmdiYSgxMiwxOCwyNCwuMjYpfS5zZXJ2aWNlLW1lc3NhZ2UgLnJpZ2h0LXBhbmVse2Rpc3BsYXk6dGFibGUtY2VsbDtib3JkZXItcmFkaXVzOjAgNHB4IDRweCAwO2JvcmRlcjoxcHggc29saWQgcmdiYSgwLDAsMCwuMyk7Ym9yZGVyLWxlZnQ6bm9uZTtwYWRkaW5nOjhweH0uc2VydmljZS1tZXNzYWdlIC5iLWRlc2NyaXB0aW9ue2Rpc3BsYXk6aW5saW5lLWJsb2NrO3ZlcnRpY2FsLWFsaWduOm1pZGRsZTtmb250LXNpemU6LjhyZW19LnNlcnZlci1vcGVuZWR7YmFja2dyb3VuZC1jb2xvcjojMzlhNTNmfS5uZWVkLXVwZGF0ZSwuc2VydmVyLWNsb3NlZHtiYWNrZ3JvdW5kLWNvbG9yOiM4MjJmMmZ9LmNoYXQtbWVzc2FnZXtib3JkZXItcmFkaXVzOjAgNHB4IDRweCAwO3BhZGRpbmc6NnB4IDEycHg7bWFyZ2luLWJvdHRvbToxcHg7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDI2LDM1LDQyLC42KTtib3JkZXItbGVmdDoycHggc29saWQgcmdiYSgyNiwzNSw0MiwuOCk7bGluZS1oZWlnaHQ6MjJweH06bGFzdC1jaGlsZC5jaGF0LW1lc3NhZ2V7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDM1LDQ3LDU3LC44KX0uY2hhdC1tZXNzYWdlLm1zZy1zcGVjaWFse2JhY2tncm91bmQtY29sb3I6IzYzOX0uY2hhdC1tZXNzYWdlIHNwYW46bnRoLWNoaWxkKDEpe2ZvbnQtc2l6ZToxLjFyZW07Y29sb3I6I2FlZmYwMH0uYi1pY29uLXN2Z3tkaXNwbGF5OmlubGluZS1ibG9jazt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7aGVpZ2h0OjQ0cHg7d2lkdGg6NDRweDttYXJnaW46NnB4O2JvcmRlci1yYWRpdXM6NTAlfS5iLWljb24td2FybmluZy5iLWljb24tc3Zne2JhY2tncm91bmQ6dXJsKGRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0NzdmclMjB4bWxucyUzRCUyMmh0dHAlM0ElMkYlMkZ3d3cudzMub3JnJTJGMjAwMCUyRnN2ZyUyMiUyMHZpZXdCb3glM0QlMjIwJTIwMCUyMDI5NSUyMDI5NSUyMiUyMHdpZHRoJTNEJTIyNjQlMjIlMjBoZWlnaHQlM0QlMjI2NCUyMiUzRSUzQ2NpcmNsZSUyMGZpbGwlM0QlMjIlMjMzYTQ3NTclMjIlMjBjeCUzRCUyMjE0Ny41JTIyJTIwY3klM0QlMjIxNDcuNSUyMiUyMHIlM0QlMjIxNDUlMjIlMkYlM0UlM0NwYXRoJTIwZmlsbCUzRCUyMiUyM2ZlYmU0ZCUyMiUyMGQlM0QlMjJNMTQ3LjM1NCUyMDIwOS44ODFjLTIzLjU4OSUyMDAtNDcuMTc4LjAwNi03MC43NjctLjAwMy0xMC42NTktLjAwNC0xOC44NS04LjIxOS0xOC4zNjMtMTguODAyLjEyOC0yLjc3OC45NTUtNS43OTclMjAyLjMzNi04LjIwMyUyMDIzLjQ4MS00MC45MjIlMjA0Ny4xMTMtODEuNzU2JTIwNzAuNjcyLTEyMi42MzMlMjAzLjY2NC02LjM1OCUyMDguOTk0LTkuOTI4JTIwMTYuMzU1LTkuOTA3JTIwNi44MzIuMDIlMjAxMi4xNjIlMjAzLjEzMiUyMDE1LjU4OCUyMDkuMDUzJTIwMjMuNDUyJTIwNDAuNTI5JTIwNDYuODI5JTIwODEuMTAyJTIwNzAuMjkyJTIwMTIxLjYyNSUyMDMuMDQ5JTIwNS4yNjUlMjA0LjM4NCUyMDEwLjYxOCUyMDIuMzc5JTIwMTYuNTQtMi41MiUyMDcuNDQ2LTkuMjQ0JTIwMTIuMzE2LTE3LjE5NCUyMDEyLjMyMi0yMy43NjYuMDItNDcuNTMyLjAwOC03MS4yOTguMDA4em05LjA1Ni0xMTYuMTU4aC0xNy44MnY2OC4xMDloMTcuODE5VjkzLjcyM3ptMCUyMDc4LjE0MWgtMTcuODJ2MTkuNTM1aDE3LjgxOXYtMTkuNTM1eiUyMiUyRiUzRSUzQyUyRnN2ZyUzRSkgNTAlIG5vLXJlcGVhdDtiYWNrZ3JvdW5kLXNpemU6Y292ZXI7Ym9yZGVyOjJweCBzb2xpZCAjYzE3YzE5fS5iLWljb24tcm9ib3QuYi1pY29uLXN2Z3tiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjIpIHVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUdZQUFBQm1DQVlBQUFBNTMrUmlBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFBSmNFaFpjd0FBRHNNQUFBN0RBY2R2cUdRQUFBQVpkRVZZZEZOdlpuUjNZWEpsQUhCaGFXNTBMbTVsZENBMExqQXVNVFpFYWEvMUFBQUo3VWxFUVZSNFh1M2MrMU5VNXhrSDhQdzViWFB4emxVUUJLS0lVcWg0YldKUjQ2U1p0TG1NcWVQRW1Vd25ZMjFUbTdUSjlJZGswblk2MDR2M1ZOT3FXRVNNWEJJRkJLMGdpOEt5TEFzTDdCMVcvTzNwZVk3em11WGxDNTQ5ZTNiZnMvSDg4UG5sOGJEbmZaN252Tzk1ejFud0dTSnkyQkFNT3RTRFFZZDZNT2hRRHdZZDZzR2dRejBZZEtnSGd3NzFZTkNoSGd3NjFJTkJoM293NkZBUEJoM3F3YUJEUFJoMHFBZUREdlZnMEtFZUREclVnMEdIZWpEb1VBOEdIZXJCb0VNOUdIU29CNE4yMDlrelJQY0doeTNSMkhwZiswaDhIanVCUWJ2cHYrZUdSVFpML253N2drRzdHUnIya3RzemFobjU4KzBJQmpQaFpJT1hXanNueVRVVUlmL1VORVZqRDJoNjVnSE54T2VLeDJmcHdheTE0dEk1WnJUejhybkQwVGo1L05OMFp5QkVYOTJZMElhSng1NEpNSmhPalcxK3JSQ3o5UERodzZ3UWpjVzFZZU5jMGdrRzArSHNaUjhGUWpNd2VidWIxV2FaMnh2VjBzQzVwUU1NV20xZ09Ld3ZTU2pwYk1MTDNiV096Q3h4TUdpbGtiRVlUREtiOVdyM0lEbFBxOEdnVmNZbXB2VmxBQ1dYelRnbjExQllTeEhuYlFVWXRFSXduSjMzazJUYzA1Wm9PVytyd0dDcXZ1bVpNalZUZW03ZHB2K2N2MENuem54QkowNmV6b2d6WDV5bGl3My9wWUdCZTZiR2ZLN0pwNldNNjVBS0dFelY3Q3hPQWhrZjk5T2JiNzlEejc2d25MNzM3QktsbHEzTW82Ty8rNGlDd1NBY0t4TFJubjNrL0swQWc2a0lHRnpDK2wwdU9uRHdYWHB1eVFwWUpKVlc1YTJtanovNUkzbTlYamgyV1hkdlVFc2QxOE1zR0RUclVzczRITGlzdTZlSFZoZXZoVVd4aSs4L3Q1U3FhK3EwaCtFblgyaThCTXExU0JVTW1zVTdGVFJ3Z1JOb2EvK2FjZ3VLWVRIc3FLeWlranllRVpoUG9wdTlBYTBFdUM1bXdLQlovTDRMRFZvSWg4TlV0YWtHRm9Edk1TOHNXMFZMbHVmUTBoVzVHY1huZkg3cFN2ckI4OHZnMk41OGF6K0ZRaUdZazhEdjJPUjZwQUlHelVJREZuaTJ2TDMvd0p5RWVibmdncXpNTGFTYy9DSmJXSkZUQURjaURaY2FZVjRDdndpVjY1RUtHRFNqNSs3aU81bU96aTY5RVNKUnZ1bHpFVkJ4Vk9PYlArL1FFaHRVV0ZSSzBXZ1U1c2FzdnMvQW9Cbmh5RFFjc1BEKzRTTnptc0xKTTFRWU8rQ3g4VXhPdkppT25UZ0pjeFBjSTliZFoyQXdXWDB1TnoxNHNQRDloZGZuUGErOHFpZkhTNWVkR3lMajVvaDd6enNIRHNMOGhFZ2tTdjBEYnEwa3VFN0pnRUdqTGpUZkovRzE3MkpQelVORGJscGJzVjYvK3V4MFB6R0NMNkxscS9MMXh0VHYzYmZvY2hhTFRldTE0Sm8wWEUzdGR3dGcwS2pFNzlIUlFJWCtmcGVlSksvYmN1TFpnbWQ2emVhdE5Pcnp3UnpaOVBTanhnaHl2WklCZzBZMHR3L09HUVFhcUhEM2JqOU1OcHZ3VEsrdTJVeWVrWVdmYWVUR1hMcytxSlVLMSs5SllOQUl2cThrRGdJTlZPREdGR3BQK2lqaG5LSWlLbnhsSGEzOXZJNUtqdFpRM3FaU3lpa0F4NlZKM3ZvU1duTzRtc28rcTZPaS9WV1VVMXdNajJPMWRkdVNhc3pkRk80M01HaEU0Z0FZR3FqQWIyN0xYdHd3UDFtdENHVi8yVUliZXZkUWxXdXZycks3bm9vUGJjeEljd3AyVmRENmxwY2ZuNXRWbk5sT2VSdTFpd01jdjJYYnpxUWF3K1M2R1FXRFJzZ0RRQU1WK09aZlZWMDdMOUdpWDFUUmh2NXZteUp3c2ZKckZwaGhGcW80dDRPcXBQUHplRXFPL0JBZXYvUGxldklsY1k5aGN0Mk1na0VqNUFHZ2dRckR3eDZxcnQweUwxRmV2aEtMSWxUMjFGTmgvWXZ6anJkYTRreE5WSEZxT3p6K0ozdjIwY1RFQk15UlpWMWpQQjZQdHFQWk5pL1IwazkrQkF0VDJWVlBCUzlWekR2ZWFud2VkUDd5djIyRngrL2Q5MU9hbWdyQUhGa1dObWFFYWtGakNuYVVhN05qOTd6Q1ZIeTVnM0lyMXN3NzNtcWxmNmlsRFgzU1VuWjdONjErdlJJZXJ6Y204QlEwaHEzK2VTV3RhM3JwVVZIdTdLYnlZOXNvZjBzWlBOWnF1ZXRLYU8ybm0vWHo4dmtyTytwcHpYdWJLR2NOM3BrOVZZMFI4amV0cGR6eTlNOFNxS2hZMjZacm00MG43QVMvYzQzaHArWHRPM2ZCWkxQSmE2Ky9RWkZJQk9iSWJOR1l2bjdqRDVnQjdTcDc5Yldmd1dTenlidUgzbHYwbmFEY0dINElsK3RtRkF3YWNVVjZKYlBZZ1BuTjgrRWp2NEhKWnBQakowN0IvQVM1TVVwZXliREVRU3pXR05aNHVRa21teTBLaWtwcHhEc0tjeFBFMjJWQnJsY3lZTkNvODFlTXZmWm44WGljNnJidWhFbG5ndzkvL3pITUsxRTArcWd4THEwbUYxVys5aGQ2dGZ2TllsK1VDZDA5dDZoOEhYaG5abk0vM3JXYnZLT0x6eFlXRGtmcGJncjNsVVF3YU1iTVRCd09OaEUzNzlQUFBxZThRa1hiWWhONENidmMxQXp6a1huSHJQdkZQeGcwSXhReDlwdjl3V0NJUGpqNjRjSmZBOWhJeGZxTjlNL2pKd3l0QnB4NzE1MHByUlM0UHNtQ1FUTW1BMUZEaldHeFdJeE9uL2tYbFphdmh3V3hBMzRiZnEybHhYQk9mTnlOVzliOVVSTU1tdUVkQ3h1NnNoTDE5dmJSZ1lPSHFMcTJqdkpYbDhBQ1pWSlJTWm0rUWZudDBZL0k3MS80TFRMQ201dVdUcjlXQ2x5ZlpNR2dHZjJEQVVPLzV5dmpuK0V2MHE0MFg2VS8vZm12OU9zUGp0SXYzLzlWUm5Fai92NlBZOVRTMmtiREhvOWVaRFRXaGZCczRXZVlTNjFqV2lsd2ZaSUZnMmEwZGZuMXdTVTdhN0lkTjRVYnljdno4Zk1qV2lsd2ZaSUZnMmFjdkRpaU40WVpYWmUvQy9oQzVKeEQ0WmhXQmx3Yk0yRFFyR0FvcWcrU3I2Q25wVG04RkhQT1hwKzFmL1lIZzJiZGN3Y2Z6eG9ybHpSdXNsWFE1NXZCbjhVWG9NaTN1OWU2clRLRFFiT2F2eGwvUEZDcm1zUEpCNmFtS0RBNWFZbFFNSmh5ZytTbU1Ma1dxWUxCVklTMXRUWnh3TnljVkFvUmkwWnBZbnpjVW5FVHUwY0JOY1h0dGY3di9tRXdGZisrTWpwbjBJelhZYlBOU1VkanpHenJHZWNnN2lrQzMxZmxHbGdCQmxQbEdnenEyOGZFQkppWVBjazBTWFZqeEhqRjdrdldmak05LzRVSkRGb2hHSDYwUTVOeFVaTFp0YWxxakdnR2oxV2VKWUxQSDlGU3hmbW5DZ2F0d2w4Y29ZUUUwYVRGTmdtWmJzeVRtaUh3dTBFNVh5dkJvRlhPWHZiU1ZCRFBIS1A4L3NrNTN3cGFJUkQ0ZGx0dlJqcG5pZ0NEVmd1azBCeTdOU1lkT3pBRUJ0T2g3MzZBb3RINUc0SW5zVXRqZVBmVmNYdFNTd1huWnpVWVRKZlRsN3cwNkFuQkhkdENWRGVHeDNxNzM5cW5laU5nTUJQdUQyc05Bb1dRcVdvTXorNmV2c3czUklEQlRPTk5RdFBYWS9UVmpYSGlydzhTdFhaNnFhM0RiYW5XVHQvY2MyaXVYaCtueHJZeE9xUE5hbmw4S3NDZ1F6MFlkS2dIZ3c3MVlOQ2hIZ3c2MUlQQlREcDNlWlJhT3Z6VWRXZVM3Z3dFbFBtZks2QTlRRTdvdTdOVEY5WHZ6R0F3blk1ZkdLR2J2Wk0wRlVqdEhWcTY4WVBsMkVTRTJyV3R0SnhESnNCZ09uelo3Q1BmZU5qVWF4bVYrQTE1T0JJanoyaDYvd05zR1F5bVM4TTFId1ZEMmRVWXhtUG1zY3Y1cEJNTXBodi84alVxZ0IxWitZdml5WURCVExGemcxUTFSSURCVE9NaTJHR0o0ekdvYm9nQWc2cWNheHJWdDYyb2FPbkU1enpWWUkrWGx3SU0yZ0VYcXIxN2t0emVNQ3htS3ZneitiUHQxb3hFTUdoWFBLT2FyL3YxSzl3MUZOS2hKWkJqNHQvNVdQNFovbG41OCt3TUJoM3F3YUJEUFJoMHFBZUREdlZnMEtFZUREcFVvMmYrRHlHb0g0Y1BJTTJHQUFBQUFFbEZUa1N1UW1DQykgLTFweCAtNHB4IG5vLXJlcGVhdDtiYWNrZ3JvdW5kLXNpemU6NDZweDtib3JkZXI6MnB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsLjQpfSNjaGF0SGlkZVRpbWVvdXQsI2NoYXRIaXN0b3J5TGltaXR7d2lkdGg6NjBweDt0ZXh0LWFsaWduOnJpZ2h0fSNjYW52YXN7ZmlsdGVyOmJsdXIoNnB4KTt0cmFuc2l0aW9uOmZpbHRlciAxMDAwbXN9I2NhbnZhcy5jbGVhci1jYW52YXN7ZmlsdGVyOmJsdXIoMCl9I3NraW5DdXN0b21CdXR0b257cG9zaXRpb246cmVsYXRpdmU7bWFyZ2luOjQwcHggMCAwO3RleHQtYWxpZ246Y2VudGVyfS5za2luLWNvbGxlY3Rpb257aGVpZ2h0Ojg2cHg7bWFyZ2luLWJvdHRvbTo2cHg7b3ZlcmZsb3cteDphdXRvO292ZXJmbG93LXk6aGlkZGVuO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpyb3c7YWxpZ24taXRlbXM6Y2VudGVyO2JhY2tncm91bmQtY29sb3I6cmdiYSg1MSw0MiwxNiwuMjMpO2JvcmRlci1yYWRpdXM6NHB4fS5za2luLWNvbGxlY3Rpb24gLnNraW4taXRlbSwuc2tpbi1jb2xsZWN0aW9uIGltZ3tiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsLjUpO2JhY2tncm91bmQtc2l6ZToyMDAlO2JvcmRlcjoycHggc29saWQgcmdiYSgyMzAsMjMwLDIzMCwuNSk7Ym9yZGVyLXJhZGl1czo1MCU7bWFyZ2luOjAgMnB4O2N1cnNvcjpwb2ludGVyO3dpZHRoOjYycHg7aGVpZ2h0OjYycHg7ZmxleDpub25lO2ZsZXgtYmFzaXM6NjJweH0uc2tpbi1jb2xsZWN0aW9uIDpmaXJzdC1jaGlsZHttYXJnaW4tbGVmdDo0cHh9LnNraW4tY29sbGVjdGlvbiAuc2tpbi1pdGVtOmhvdmVyLC5za2luLWNvbGxlY3Rpb24gaW1nOmhvdmVye3RyYW5zZm9ybTpzY2FsZSgxLjEzKX0uc2tpbi1jb2xsZWN0aW9uOjotd2Via2l0LXNjcm9sbGJhcntoZWlnaHQ6OHB4O3dpZHRoOjhweH0uc2tpbi1jb2xsZWN0aW9uOjotd2Via2l0LXNjcm9sbGJhci10cmFja3tiYWNrZ3JvdW5kLWNvbG9yOiM5ZTllOWV9LnNraW4tY29sbGVjdGlvbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWJ7YmFja2dyb3VuZC1jb2xvcjojNWM2MjY1fS50cmlhbmdsZXt3aWR0aDoyMHB4O2hlaWdodDoyMHB4O3Bvc2l0aW9uOmFic29sdXRlO3RyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTtvdmVyZmxvdzpoaWRkZW47bGVmdDo2MSV9LnRyaWFuZ2xlOjphZnRlcntjb250ZW50OicnO2JhY2tncm91bmQtY29sb3I6I2UwZTBkNztkaXNwbGF5OmJsb2NrO2hlaWdodDoxMDAlO3Bvc2l0aW9uOnJlbGF0aXZlO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpO3RvcDo3MCU7Ym9yZGVyOjFweCBzb2xpZCAjYmJifSNza2luRm9ybUlucHV0e3Bvc2l0aW9uOmFic29sdXRlO2JvdHRvbToxMDQlO3JpZ2h0Oi0xNyU7d2lkdGg6NDEwcHg7YmFja2dyb3VuZC1jb2xvcjojZTBkZmQ3O2JvcmRlcjoxcHggc29saWQgI2JiYjtib3JkZXItcmFkaXVzOjZweDt0cmFuc2Zvcm06c2NhbGUoMCk7ei1pbmRleDoxO2N1cnNvcjpkZWZhdWx0O3Zpc2liaWxpdHk6aGlkZGVuO3RyYW5zaXRpb24tcHJvcGVydHk6dmlzaWJpbGl0eSx0cmFuc2Zvcm07dHJhbnNpdGlvbi1kdXJhdGlvbjoyNTBtczt0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjpjdWJpYy1iZXppZXIoLjY4LC0uNTUsLjI2NSwxLjU1KX0jc2tpbkZvcm1JbnB1dC5zaG93LXNraW4taW5wdXR7dmlzaWJpbGl0eTp2aXNpYmxlO3RyYW5zZm9ybTpzY2FsZSgxKX0jc2tpbkZvcm1JbnB1dDo6YWZ0ZXJ7Y29udGVudDonJztwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjIzNnB4O2JvdHRvbTotMjBweDtib3JkZXI6MTBweCBzb2xpZCB0cmFuc3BhcmVudDtib3JkZXItdG9wOjEwcHggc29saWQgI2UwZTBkN30jc2tpbkZvcm1JbnB1dCAuZm9ybS1jb250cm9sOjotd2Via2l0LWlucHV0LXBsYWNlaG9sZGVye2NvbG9yOiNhYWE7Zm9udC1zaXplOnNtYWxsZXJ9I3NraW5Gb3JtSW5wdXQgLmZvcm0tY29udHJvbHtib3JkZXItcmFkaXVzOjRweDtwYWRkaW5nOjJweCA0cHg7d2lkdGg6OTYlfSNza2luRm9ybUlucHV0IC5idG57Y29sb3I6I2ZmZjtwYWRkaW5nOjdweH0jc2tpbkZvcm1JbnB1dCAuYnRuLXdhcm5pbmd7YmFja2dyb3VuZC1jb2xvcjojZjBhZDRlO2JvcmRlci1jb2xvcjojZWVhMjM2fSNza2luRm9ybUlucHV0IC5idG4taW5mb3tiYWNrZ3JvdW5kLWNvbG9yOiM0ZmJhZjA7Ym9yZGVyLWNvbG9yOiMzOGIxZWV9I3NraW5Gb3JtSW5wdXQgaW5wdXR7bWFyZ2luLWJvdHRvbTo1cHg7Zm9udC1zaXplOnNtYWxsfSNza2luRm9ybUlucHV0IC5jYXB0aW9ue2hlaWdodDozNHB4O2JhY2tncm91bmQtY29sb3I6IzY4NzY3OTtib3JkZXItcmFkaXVzOjZweCA2cHggMCAwO2NvbG9yOiNmNWY1ZjU7bGluZS1oZWlnaHQ6MzRweDt0ZXh0LWFsaWduOmxlZnQ7cGFkZGluZzowIDExcHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2JiYn0jc2tpbkZvcm1JbnB1dCAuY2FwdGlvbiAuZ2x5cGhpY29uLXJlbW92ZXtmbG9hdDpyaWdodDt0b3A6MTBweH0uZ2x5cGhpY29uLXJlbW92ZTo6YmVmb3Jle2NvbnRlbnQ6IlwyNzRDIjtmb250LXNpemU6MTRweDtsaW5lLWhlaWdodDoxMjAlfS5nbHlwaGljb24tcmVmcmVzaDo6YmVmb3Jle2NvbnRlbnQ6IlwyMUJCIjtmb250LXdlaWdodDo3MDB9LmxvY2FsLXNraW57Y29sb3I6Z3JheTtiYWNrZ3JvdW5kOiNmNWY1ZjUgdXJsKGRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBQUFBQUN3QUFBQUFBUUFCQUFBPSkgMCA1MCUgbm8tcmVwZWF0O2JhY2tncm91bmQtc2l6ZTpjb3Zlcjtmb250LXNpemU6c21hbGxlcjtsaW5lLWhlaWdodDoxMnB4O2JvcmRlci1yYWRpdXM6NTAlO2JvcmRlcjoycHggZGFzaGVkICNkZWRlZGU7d2lkdGg6ODBweDtoZWlnaHQ6ODBweDttYXJnaW46MCBhdXRvfS5sb2NhbC1za2luOmhvdmVye2JvcmRlci1jb2xvcjojYzFjMWMxfS5sb2NhbC1za2luIHNwYW57cG9pbnRlci1ldmVudHM6bm9uZTtkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlO3RvcDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSl9LnNtaWxlcy1zYW50YXtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL3NhbnRhL3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1zYW50YSA0LjVzIHN0ZXBzKDkwKSBpbmZpbml0ZX0uc21pbGVzLXNhZCwuc21pbGVzLXNhbnRhLC5zbWlsZXMtc21pbGV7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjRweDtoZWlnaHQ6MjRweDtiYWNrZ3JvdW5kLXNpemU6MjRweCwyNHB4IWltcG9ydGFudDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9LnNtaWxlcy1zbWlsZXtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL3NtaWxlL3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1zbWlsZSAyLjY1cyBzdGVwcyg1MykgaW5maW5pdGV9LnNtaWxlcy1zYWR7YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9zYWQvdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLXNhZCAzLjE1cyBzdGVwcyg2MykgaW5maW5pdGV9LnNtaWxlcy1jb29se2JhY2tncm91bmQ6dXJsKGh0dHBzOi8vc3RhdGljLWFzbS5zZWN1cmUuc2t5cGVhc3NldHMuY29tL3Blcy92MS9lbW90aWNvbnMvY29vbC92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tY29vbCAxLjlzIHN0ZXBzKDM4KSBpbmZpbml0ZX0uc21pbGVzLWNvb2wsLnNtaWxlcy1sYXVnaCwuc21pbGVzLXdpbmt7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjRweDtoZWlnaHQ6MjRweDtiYWNrZ3JvdW5kLXNpemU6MjRweCwyNHB4IWltcG9ydGFudDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9LnNtaWxlcy1sYXVnaHtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL2xhdWdoL3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1sYXVnaCAzLjg1cyBzdGVwcyg3NykgaW5maW5pdGV9LnNtaWxlcy13aW5re2JhY2tncm91bmQ6dXJsKGh0dHBzOi8vc3RhdGljLWFzbS5zZWN1cmUuc2t5cGVhc3NldHMuY29tL3Blcy92MS9lbW90aWNvbnMvd2luay92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0td2luayAxLjhzIHN0ZXBzKDM2KSBpbmZpbml0ZX0uc21pbGVzLXN1cnByaXNlZHtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL3N1cnByaXNlZC92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tc3VycHJpc2VkIDMuNHMgc3RlcHMoNjgpIGluZmluaXRlfS5zbWlsZXMtY3J5LC5zbWlsZXMtc3BlZWNobGVzcywuc21pbGVzLXN1cnByaXNlZHtkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyNHB4O2hlaWdodDoyNHB4O2JhY2tncm91bmQtc2l6ZToyNHB4LDI0cHghaW1wb3J0YW50O3ZlcnRpY2FsLWFsaWduOm1pZGRsZX0uc21pbGVzLWNyeXtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL2NyeS92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tY3J5IDIuNXMgc3RlcHMoNTApIGluZmluaXRlfS5zbWlsZXMtc3BlZWNobGVzc3tiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL3NwZWVjaGxlc3Mvdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLXNwZWVjaGxlc3MgMy4zNXMgc3RlcHMoNjcpIGluZmluaXRlfS5zbWlsZXMtdG9uZ3Vlb3V0e2JhY2tncm91bmQ6dXJsKGh0dHBzOi8vc3RhdGljLWFzbS5zZWN1cmUuc2t5cGVhc3NldHMuY29tL3Blcy92MS9lbW90aWNvbnMvdG9uZ3Vlb3V0L3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS10b25ndWVvdXQgMy41NXMgc3RlcHMoNzEpIGluZmluaXRlfS5zbWlsZXMtaGVhcnQsLnNtaWxlcy1tb25rZXksLnNtaWxlcy10b25ndWVvdXR7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjRweDtoZWlnaHQ6MjRweDtiYWNrZ3JvdW5kLXNpemU6MjRweCwyNHB4IWltcG9ydGFudDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9LnNtaWxlcy1oZWFydHtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL2hlYXJ0L3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1oZWFydCAuODVzIHN0ZXBzKDE3KSBpbmZpbml0ZX0uc21pbGVzLW1vbmtleXtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL21vbmtleS92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tbW9ua2V5IDIuNXMgc3RlcHMoNTApIGluZmluaXRlfS5zbWlsZXMtYm9tYntiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL2JvbWIvdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLWJvbWIgOC42cyBzdGVwcygxNzIpIGluZmluaXRlfS5zbWlsZXMtYm9tYiwuc21pbGVzLWRvZywuc21pbGVzLXllc3tkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyNHB4O2hlaWdodDoyNHB4O2JhY2tncm91bmQtc2l6ZToyNHB4LDI0cHghaW1wb3J0YW50O3ZlcnRpY2FsLWFsaWduOm1pZGRsZX0uc21pbGVzLWRvZ3tiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL2RvZy92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tZG9nIDIuN3Mgc3RlcHMoNTQpIGluZmluaXRlfS5zbWlsZXMteWVze2JhY2tncm91bmQ6dXJsKGh0dHBzOi8vc3RhdGljLWFzbS5zZWN1cmUuc2t5cGVhc3NldHMuY29tL3Blcy92MS9lbW90aWNvbnMveWVzL3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS15ZXMgMnMgc3RlcHMoNDApIGluZmluaXRlfS5zbWlsZXMtbm97YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9uby92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tbm8gMi43NXMgc3RlcHMoNTUpIGluZmluaXRlfS5zbWlsZXMtZHJ1bmssLnNtaWxlcy1ubywuc21pbGVzLW9re2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjI0cHg7aGVpZ2h0OjI0cHg7YmFja2dyb3VuZC1zaXplOjI0cHgsMjRweCFpbXBvcnRhbnQ7dmVydGljYWwtYWxpZ246bWlkZGxlfS5zbWlsZXMtb2t7YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9vay92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tb2sgMy42cyBzdGVwcyg3MikgaW5maW5pdGV9LnNtaWxlcy1kcnVua3tiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL2RydW5rL3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1kcnVuayAyLjQ1cyBzdGVwcyg0OSkgaW5maW5pdGV9LnNtaWxlcy1jd2x7YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9jd2wvdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLWN3bCAzLjA1cyBzdGVwcyg2MSkgaW5maW5pdGV9LnNtaWxlcy1jd2wsLnNtaWxlcy1maW5nZXIsLnNtaWxlcy1yb2Nre2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjI0cHg7aGVpZ2h0OjI0cHg7YmFja2dyb3VuZC1zaXplOjI0cHgsMjRweCFpbXBvcnRhbnQ7dmVydGljYWwtYWxpZ246bWlkZGxlfS5zbWlsZXMtcm9ja3tiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL3JvY2svdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLXJvY2sgLjZzIHN0ZXBzKDEyKSBpbmZpbml0ZX0uc21pbGVzLWZpbmdlcntiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL2Zpbmdlci92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tZmluZ2VyIDMuNnMgc3RlcHMoNzIpIGluZmluaXRlfS5zbWlsZXMtZmFjZXBhbG17YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9mYWNlcGFsbS92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tZmFjZXBhbG0gMy44NXMgc3RlcHMoNzcpIGluZmluaXRlfS5zbWlsZXMtYW5ncnksLnNtaWxlcy1mYWNlcGFsbSwuc21pbGVzLWhpe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjI0cHg7aGVpZ2h0OjI0cHg7YmFja2dyb3VuZC1zaXplOjI0cHgsMjRweCFpbXBvcnRhbnQ7dmVydGljYWwtYWxpZ246bWlkZGxlfS5zbWlsZXMtYW5ncnl7YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9hbmdyeS92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tYW5ncnkgNS43cyBzdGVwcygxMTQpIGluZmluaXRlfS5zbWlsZXMtaGl7YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9oaS92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0taGkgMi44NXMgc3RlcHMoNTcpIGluZmluaXRlfS5zbWlsZXMtZXZpbGdyaW57YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9ldmlsZ3Jpbi92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tZXZpbGdyaW4gMy45cyBzdGVwcyg3OCkgaW5maW5pdGV9LnNtaWxlcy1ldmlsZ3Jpbiwuc21pbGVzLWtpc3MsLnNtaWxlcy1zaG9ja3tkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyNHB4O2hlaWdodDoyNHB4O2JhY2tncm91bmQtc2l6ZToyNHB4LDI0cHghaW1wb3J0YW50O3ZlcnRpY2FsLWFsaWduOm1pZGRsZX0uc21pbGVzLXNob2Nre2JhY2tncm91bmQ6dXJsKGh0dHBzOi8vc3RhdGljLWFzbS5zZWN1cmUuc2t5cGVhc3NldHMuY29tL3Blcy92MS9lbW90aWNvbnMvc2hvY2svdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLXNob2NrIDQuNzVzIHN0ZXBzKDk1KSBpbmZpbml0ZX0uc21pbGVzLWtpc3N7YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9raXNzL3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1raXNzIDIuNXMgc3RlcHMoNTApIGluZmluaXRlfS5zbWlsZXMtYmx1c2h7YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9ibHVzaC92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tYmx1c2ggMy40NXMgc3RlcHMoNjkpIGluZmluaXRlfS5zbWlsZXMtYmx1c2gsLnNtaWxlcy1kZXZpbCwuc21pbGVzLXJvZmx7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjRweDtoZWlnaHQ6MjRweDtiYWNrZ3JvdW5kLXNpemU6MjRweCwyNHB4IWltcG9ydGFudDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9LnNtaWxlcy1kZXZpbHtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL2RldmlsL3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1kZXZpbCAzLjM1cyBzdGVwcyg2NykgaW5maW5pdGV9LnNtaWxlcy1yb2Zse2JhY2tncm91bmQ6dXJsKGh0dHBzOi8vc3RhdGljLWFzbS5zZWN1cmUuc2t5cGVhc3NldHMuY29tL3Blcy92MS9lbW90aWNvbnMvcm9mbC92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tcm9mbCA0LjA1cyBzdGVwcyg4MSkgaW5maW5pdGV9LnNtaWxlcy1oYXBweXtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL2hhcHB5L3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1oYXBweSAzLjVzIHN0ZXBzKDcwKSBpbmZpbml0ZX0uc21pbGVzLWNsYXAsLnNtaWxlcy1oYXBweSwuc21pbGVzLXdvcnJ5e2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjI0cHg7aGVpZ2h0OjI0cHg7YmFja2dyb3VuZC1zaXplOjI0cHgsMjRweCFpbXBvcnRhbnQ7dmVydGljYWwtYWxpZ246bWlkZGxlfS5zbWlsZXMtY2xhcHtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL2NsYXAvdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLWNsYXAgMnMgc3RlcHMoNDApIGluZmluaXRlfS5zbWlsZXMtd29ycnl7YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy93b3JyeS92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0td29ycnkgMi44cyBzdGVwcyg1NikgaW5maW5pdGV9LnNtaWxlcy1wYXJ0eXtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL3BhcnR5L3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1wYXJ0eSAzLjU1cyBzdGVwcyg3MSkgaW5maW5pdGV9LnNtaWxlcy1saXBzLC5zbWlsZXMtbGlwc3NlYWxlZCwuc21pbGVzLXBhcnR5e2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjI0cHg7aGVpZ2h0OjI0cHg7YmFja2dyb3VuZC1zaXplOjI0cHgsMjRweCFpbXBvcnRhbnQ7dmVydGljYWwtYWxpZ246bWlkZGxlfS5zbWlsZXMtbGlwc3tiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL2xpcHMvdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLWxpcHMgNC40NXMgc3RlcHMoODkpIGluZmluaXRlfS5zbWlsZXMtbGlwc3NlYWxlZHtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL2xpcHNzZWFsZWQvdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLWxpcHNzZWFsZWQgMi41cyBzdGVwcyg1MCkgaW5maW5pdGV9LnNtaWxlcy1wdW5jaHtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL3B1bmNoL3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1wdW5jaCAyLjJzIHN0ZXBzKDQ0KSBpbmZpbml0ZX0uc21pbGVzLWNhbGwsLnNtaWxlcy1wdW5jaCwuc21pbGVzLXd0ZntkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyNHB4O2hlaWdodDoyNHB4O2JhY2tncm91bmQtc2l6ZToyNHB4LDI0cHghaW1wb3J0YW50O3ZlcnRpY2FsLWFsaWduOm1pZGRsZX0uc21pbGVzLWNhbGx7YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9jYWxsL3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1jYWxsIDIuM3Mgc3RlcHMoNDYpIGluZmluaXRlfS5zbWlsZXMtd3Rme2JhY2tncm91bmQ6dXJsKGh0dHBzOi8vc3RhdGljLWFzbS5zZWN1cmUuc2t5cGVhc3NldHMuY29tL3Blcy92MS9lbW90aWNvbnMvd3RmL3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS13dGYgMi44NXMgc3RlcHMoNTcpIGluZmluaXRlfS5zbWlsZXMtc3dlYXJ7YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9zd2Vhci92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tc3dlYXIgMy44NXMgc3RlcHMoNzcpIGluZmluaXRlfS5zbWlsZXMtYmFuZGl0LC5zbWlsZXMtcG9vcCwuc21pbGVzLXN3ZWFye2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjI0cHg7aGVpZ2h0OjI0cHg7YmFja2dyb3VuZC1zaXplOjI0cHgsMjRweCFpbXBvcnRhbnQ7dmVydGljYWwtYWxpZ246bWlkZGxlfS5zbWlsZXMtYmFuZGl0e2JhY2tncm91bmQ6dXJsKGh0dHBzOi8vc3RhdGljLWFzbS5zZWN1cmUuc2t5cGVhc3NldHMuY29tL3Blcy92MS9lbW90aWNvbnMvYmFuZGl0L3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1iYW5kaXQgNS4xcyBzdGVwcygxMDIpIGluZmluaXRlfS5zbWlsZXMtcG9vcHtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL3Bvb3Avdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLXBvb3AgLjc1cyBzdGVwcygxNSkgaW5maW5pdGV9LnNtaWxlcy1wbGFuZXtiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL3BsYW5lL3ZpZXdzL2RlZmF1bHRfNDBfYW5pbSkgdG9wIGNlbnRlcjthbmltYXRpb246YW5pbS1wbGFuZSA0cyBzdGVwcyg4MCkgaW5maW5pdGV9LnNtaWxlcy1naWZ0LC5zbWlsZXMtcGxhbmUsLnNtaWxlcy1yb2NrY2hpY2t7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjRweDtoZWlnaHQ6MjRweDtiYWNrZ3JvdW5kLXNpemU6MjRweCwyNHB4IWltcG9ydGFudDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9LnNtaWxlcy1yb2NrY2hpY2t7YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9yb2NrY2hpY2svdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLXJvY2tjaGljayAzLjA1cyBzdGVwcyg2MSkgaW5maW5pdGV9LnNtaWxlcy1naWZ0e2JhY2tncm91bmQ6dXJsKGh0dHBzOi8vc3RhdGljLWFzbS5zZWN1cmUuc2t5cGVhc3NldHMuY29tL3Blcy92MS9lbW90aWNvbnMvZ2lmdC92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tZ2lmdCAuNjVzIHN0ZXBzKDEzKSBpbmZpbml0ZX0uc21pbGVzLXNhcmNhc3RpY3tiYWNrZ3JvdW5kOnVybChodHRwczovL3N0YXRpYy1hc20uc2VjdXJlLnNreXBlYXNzZXRzLmNvbS9wZXMvdjEvZW1vdGljb25zL3NhcmNhc3RpYy92aWV3cy9kZWZhdWx0XzQwX2FuaW0pIHRvcCBjZW50ZXI7YW5pbWF0aW9uOmFuaW0tc2FyY2FzdGljIDQuMnMgc3RlcHMoODQpIGluZmluaXRlfS5zbWlsZXMtbWlzaGthLC5zbWlsZXMtc2FyY2FzdGljLC5zbWlsZXMtc25lZ292aWt7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjRweDtoZWlnaHQ6MjRweDtiYWNrZ3JvdW5kLXNpemU6MjRweCwyNHB4IWltcG9ydGFudDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9LnNtaWxlcy1taXNoa2F7YmFja2dyb3VuZDp1cmwoaHR0cHM6Ly9zdGF0aWMtYXNtLnNlY3VyZS5za3lwZWFzc2V0cy5jb20vcGVzL3YxL2Vtb3RpY29ucy9taXNoa2Evdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLW1pc2hrYSAzLjZzIHN0ZXBzKDcyKSBpbmZpbml0ZX0uc21pbGVzLXNuZWdvdmlre2JhY2tncm91bmQ6dXJsKGh0dHBzOi8vc3RhdGljLWFzbS5zZWN1cmUuc2t5cGVhc3NldHMuY29tL3Blcy92MS9lbW90aWNvbnMvc25lZ292aWsvdmlld3MvZGVmYXVsdF80MF9hbmltKSB0b3AgY2VudGVyO2FuaW1hdGlvbjphbmltLXNuZWdvdmlrIDUuNHMgc3RlcHMoMTA4KSBpbmZpbml0ZX0ueHBtdC1idXktY29udGVudHt0ZXh0LWFsaWduOmNlbnRlcjttYXJnaW46OHB4IDB9LnhwbXQtYnV5LWNvbnRlbnQgZGl2e2Rpc3BsYXk6aW5saW5lLWJsb2NrO3ZlcnRpY2FsLWFsaWduOm1pZGRsZX0ueHBtdC1tb25leS1zdGFja3t3aWR0aDo5OHB4O2hlaWdodDoxMDJweDtiYWNrZ3JvdW5kOnVybCgvL2ltYXN0ZXIuc3BhY2UvYWdhci5pby9pbWdzL0RlYWRab25lQ29pbl9JdGVtcy13ZWIucG5nKSA5N3B4IDQ5MXB4O2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9LnhwbXQtaXRlbS1hbW91bnR7cG9zaXRpb246YWJzb2x1dGU7Y29sb3I6I2ViODUwMDtmb250LWZhbWlseTpjdXJzaXZlO2ZvbnQtd2VpZ2h0OjcwMDtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Ym9yZGVyLXJhZGl1czoxOHB4O2JvcmRlcjoycHggc29saWQgI2YwODgyNTtsaW5lLWhlaWdodDoxLjQ7cGFkZGluZzoxcHggN3B4O3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwwKTtib3R0b206MDt3aWR0aDpmaXQtY29udGVudH0jYnV5X3N0YXJ0ZXJwYWNrIC54cG10LW1vbmV5LXN0YWNrIC5jb2luc3twb3NpdGlvbjpyZWxhdGl2ZTtsZWZ0Oi0xcHg7dG9wOjc0cHg7Zm9udC1mYW1pbHk6Y3Vyc2l2ZTtmb250LXdlaWdodDo3MDA7Y29sb3I6I2ViODUwMH0ueHBtdC1idXktY29udGVudCAueHBtdC1za2luc3t3aWR0aDoxMTBweDtoZWlnaHQ6MTEwcHg7YmFja2dyb3VuZDpuby1yZXBlYXQgNTAlIDUwJTtiYWNrZ3JvdW5kLXNpemU6Y29udGFpbjtib3JkZXItcmFkaXVzOjUwJTtib3JkZXI6M3B4IHNvbGlkICM3MDgwOTA7bWFyZ2luOjAgNXB4O3Bvc2l0aW9uOnJlbGF0aXZlfS5zcy1idXktdGV4dHtjb2xvcjojNTY0MTRjO2ZvbnQtc2l6ZTp4LWxhcmdlO2xpbmUtaGVpZ2h0OjIuOGVtfS5iLWxpc3QtYWxsaWVze2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0Oi43dnc7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDE1LDE2LDE2LC4xMSk7Ym9yZGVyLXJhZGl1czo0cHg7b3ZlcmZsb3c6aGlkZGVuO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbi1yZXZlcnNlO3RyYW5zZm9ybS1vcmlnaW46bGVmdCB0b3A7dXNlci1zZWxlY3Q6bm9uZTt6LWluZGV4OjEwMDF9LmItbGlzdC1hbGxpZXMgLmJhZGdle2JhY2tncm91bmQtY29sb3I6I2ZmZTRiNTtjb2xvcjojYTk0NDQyfS5iLWxpc3QtYWxsaWVzPjpudGgtY2hpbGQoMSl7cGFkZGluZzo0cHggNnB4IDdweDtib3JkZXItdG9wOjFweCBkYXNoZWQgcmdiYSgxNTgsMTU4LDE1OCwuMyk7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDE4NCwxMzQsMTEsLjIpfS5iLWxpc3QtYWxsaWVzPjpudGgtY2hpbGQoMil7d2lkdGg6MTc0cHg7b3ZlcmZsb3cteTphdXRvO292ZXJmbG93LXg6aGlkZGVuO3BhZGRpbmc6OHB4IDA7d29yZC1icmVhazpicmVhay1hbGx9LmItbGlzdC1hbGxpZXM+Om50aC1jaGlsZCgyKTo6LXdlYmtpdC1zY3JvbGxiYXJ7aGVpZ2h0OjhweDt3aWR0aDo4cHh9LmItbGlzdC1hbGxpZXM+Om50aC1jaGlsZCgyKTo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2t7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDEzMiwxMzIsMTMyLC4yKX0uYi1saXN0LWFsbGllcz46bnRoLWNoaWxkKDIpOjotd2Via2l0LXNjcm9sbGJhci10aHVtYntiYWNrZ3JvdW5kLWNvbG9yOiM3NzI5Mjl9LmItbGlzdC1hbGxpZXM+Om50aC1jaGlsZCgyKTo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIsLmItbGlzdC1hbGxpZXM+Om50aC1jaGlsZCgyKTo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2t7Ym9yZGVyLXJhZGl1czoxNHB4fS5iLWFlLXBsYXllcntjdXJzb3I6cG9pbnRlcjtjb2xvcjojNzA4MDkwO3BhZGRpbmc6OHB4IDZweH0uYi1hZS1wbGF5ZXJbZGF0YS1zdGF0ZT0iMSJde2NvbG9yOiMwMzY1M2R9LmItYWUtcGxheWVyW2RhdGEtc3RhdGU9IjIiXXtjb2xvcjojN2M3NDAzfS5iLWFlLXBsYXllcltkYXRhLXN0YXRlPSI5Il17Y29sb3I6IzA2ZjE5MX0uYi1hZS1wbGF5ZXJbZGF0YS1zdGF0ZT0iMTAiXXtjb2xvcjojZjFlMTA2fS5iLWFlLXBsYXllcjo6YmVmb3Jle2NvbnRlbnQ6YXR0cihkYXRhLXN1bW1hcnkpO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjI2cHg7aGVpZ2h0OjE4cHg7bGluZS1oZWlnaHQ6MThweDtmbG9hdDpsZWZ0O2ZvbnQtc2l6ZTpzbWFsbGVyO2ZvbnQtd2VpZ2h0OjcwMDtiYWNrZ3JvdW5kLWNvbG9yOiM0ZTYyODU7Ym9yZGVyLXJhZGl1czoxMHB4O2NvbG9yOiNmZmQzMmM7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO3RleHQtYWxpZ246Y2VudGVyO21hcmdpbi1yaWdodDoxNnB4O3ZlcnRpY2FsLWFsaWduOnRvcH0uYi1hZS1wbGF5ZXIgaW1ne3dpZHRoOjY0cHg7aGVpZ2h0OjY0cHg7bWFyZ2luLWJvdHRvbTo1cHh9LmFlLXBsYXllci1za2luW2RhdGEtc3BpbmU9dHJ1ZV17YmFja2dyb3VuZC1zaXplOjIwMCV9LmFlLXBsYXllci1za2lue2Rpc3BsYXk6aW5saW5lLWJsb2NrO2JvcmRlcjoycHggc29saWQgIzMzMztiYWNrZ3JvdW5kOiM0YzU2NjEgdXJsKGRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBQUFBQUN3QUFBQUFBUUFCQUFBPSkgbm8tcmVwZWF0O2JhY2tncm91bmQtc2l6ZTpjb3Zlcjt3aWR0aDo2NHB4O2hlaWdodDo2NHB4fS5iLWFlLXBsYXllciA6bnRoLWNoaWxkKDIpe2ZvbnQtc2l6ZTpzbWFsbDt0ZXh0LWFsaWduOmNlbnRlcn0uYnRuLXNwZWNpYWwtc2hvcHtib3JkZXI6MXB4IHNvbGlkICNmZmE2MmY7Ym9yZGVyLXJhZGl1czo1MCU7d2lkdGg6MzJweDtoZWlnaHQ6MzJweDtmbG9hdDpsZWZ0fS5idG4tc3BlY2lhbC1zaG9wLmJyaWVmY2FzZS1pY29ue2JhY2tncm91bmQ6I2ZmYmM2MiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjU2Ljk1IiB3aWR0aD0iNjQiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zNi41NTUgMzguOTc4cTYuOTk5LS40NDYgMTMuOS0xLjczNSA2Ljg5OC0xLjMyMyAxMy4wMTItMy4yNlY1MC41M3EwIDEuMTktLjQ3NiAyLjI0NS0uNDQyIDEuMDUyLTEuMjIzIDEuODctLjc4Ljc4LTEuODM2IDEuMjU1LTEuMDE4LjQ3Ni0yLjIwNy40NzZINi40ODJxLTEuMTkgMC0yLjI3OS0uNDc2LTEuMDg1LS40NzUtMS45MDItMS4yNTYtLjgxNC0uODE3LTEuMjktMS44Ny0uNDc2LTEuMDU1LS40NzYtMi4yNDRWMzQuMTVxNi41NiAyLjM0NiAxMy4zMiAzLjYwNiA2Ljc2NCAxLjIyMiAxMy43NjIgMS4zOXYuNzVxMCAuODgxLjYxMyAxLjQ5NC42MS42MSAxLjU2MS42MWg0LjU5cS45NTIgMCAxLjU2MS0uNjEuNjEzLS42MTMuNjEzLTEuNDk0di0uOTE4em0tOC45MzgtNC4xOHEtNi45OTgtLjE3Mi0xMy43OTUtMS40OTVRNy4wMjQgMzEuOTc2LjUzNSAyOS41MzFWMTcuODQzcTAtMS4xOS40NzYtMi4yNDUuNDc2LTEuMDUyIDEuMjktMS44MzYuODE3LS44MTQgMS45MDItMS4yOSAxLjA5LS40NzUgMi4yNzktLjQ3NWg1Ljc0MmwuMTA0LS4yNzJxLjEtLjIzOC4yMzctLjY0Ni4xMzQtLjQxLjMwNS0uODg1LjIwNS0uNTEuMzcyLTEuMDE4LjQwOS0xLjE5LjkxOC0yLjcxNy40NDYtMS4yNiAxLjM2LTIuMzQ1Ljk1MS0xLjEyMyAyLjIwOC0xLjkzNlExOS4wMiAxLjMyNiAyMC41MTUuODVxMS41MzEtLjQ3NiAzLjA5Mi0uNDc2aDE2Ljk1OHExLjU2MSAwIDMuMDYuNDc2IDEuNTI3LjQ3NSAyLjc4NyAxLjMyNyAxLjI5LjgxMyAyLjIwNyAxLjkzMi45NTIgMS4wODkgMS4zOTQgMi4zNDkuNTA5IDEuNTI3LjkxNCAyLjcxNy4zNDIgMS4wMTguNjEzIDEuOTAzLjMwNS44NS4zMDUuOTE4aDUuODhxMS4xODkgMCAyLjIwNy40NzUgMS4wNTYuNDc2IDEuODM2IDEuMjkuNzguNzggMS4yMjcgMS44MzYuNDcyIDEuMDU1LjQ3MiAyLjI0NXYxMS41NXEtMi45NTUgMS4wMjItNi4yNTIgMS45MDMtMy4yNjMuODUxLTYuNjkzIDEuNTMxLTMuNDM0LjY0Ny02Ljk2OCAxLjEyMy0zLjUzMS40NzUtNi45OTkuNzEzdi0uNDQ2cTAtLjk0Ny0uNjEzLTEuNDk0LS42MS0uNTc2LTEuNTYtLjU3NmgtNC41OXEtLjk1MiAwLTEuNTYyLjU3Ni0uNjEzLjU0Ny0uNjEzIDEuNDk4di41NzZ6TTE4LjY4MyA3Ljk4NWwtMS4xOSA0LjAxSDQ2LjU4bC0xLjE1Mi00LjAxcS0uMTM4LS40NzUtLjYxNC0uOTg0LS40NDYtLjUxLTEuMTIyLS45MTgtLjY0Ny0uNDEtMS40Ni0uNjgtLjgxOC0uMjcyLTEuNjY1LS4yNzJIMjMuNjA3cS0uODQ3IDAtMS42NjUuMjcxdC0xLjQ5NC42OHEtLjY4LjQxLTEuMTUyLjkxOS0uNDguNTA5LS42MTMuOTg0eiIvPjwvc3ZnPicpIDUwJSA0MCUgbm8tcmVwZWF0O2JhY2tncm91bmQtc2l6ZToyMnB4IDE4cHh9LmJ0bi1zcGVjaWFsLXNob3AuYnJpZWZjYXNlLWljb246aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojZmZhNjJmO2N1cnNvcjpwb2ludGVyfSNzcGVjaWFsU2hvcE1vZGFse3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSkgdHJhbnNsYXRlWCgtNTAlKTtkaXNwbGF5Om5vbmU7YmFja2dyb3VuZC1jb2xvcjojZmZmZmY3O2JveC1zaGFkb3c6IzMzMyAwIDAgMTBweDtib3JkZXI6MXB4IHNvbGlkICM5ZTllOWU7Ym9yZGVyLXJhZGl1czo4cHg7ei1pbmRleDoxfS5tb2RhbC1iYWNrZHJvcHtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjUpO3Bvc2l0aW9uOmZpeGVkO3RvcDowO3JpZ2h0OjA7Ym90dG9tOjA7bGVmdDowfS5yYWRpby1tb2R1bGV7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO2JvdHRvbTowO3BhZGRpbmc6MjZweCAyNnB4IDEzcHggMTNweDttYXgtd2lkdGg6MzAwcHg7ei1pbmRleDoxMDAwO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC0yMTZweCk7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gMzAwbXMgY3ViaWMtYmV6aWVyKDAsMCwuMiwxKX0ucmFkaW8tbW9kdWxlOmhvdmVye3RyYW5zZm9ybTp0cmFuc2xhdGVYKDApfS5yZC1zb25nLXRpdGxle3Bvc2l0aW9uOmFic29sdXRlO3RvcDoycHg7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDE3LDE3NSwyMDgsLjYpO2NvbG9yOiNmZmY7cGFkZGluZzowIDhweDtib3JkZXItcmFkaXVzOjNweDtmb250LXNpemU6MTJweDtsaW5lLWhlaWdodDoyMnB4O3BvaW50ZXItZXZlbnRzOm5vbmU7d2hpdGUtc3BhY2U6bm93cmFwO29wYWNpdHk6MDt0cmFuc2l0aW9uOm9wYWNpdHkgMzAwbXMgY3ViaWMtYmV6aWVyKDAsMCwuMiwxKX0ucmFkaW8tbW9kdWxlOmhvdmVyIC5yZC1zb25nLXRpdGxle29wYWNpdHk6MX0ucHVsc2UtcmFkaW97d2lkdGg6MjEwcHg7aGVpZ2h0OjI4cHg7YmFja2dyb3VuZC1jb2xvcjojMWEyMzJhO2JvcmRlci1yYWRpdXM6MnB4O2JvcmRlcjoxcHggc29saWQgIzFmMmEzMztib3JkZXItcmlnaHQ6MnB4IHNvbGlkICNhZDAwMDB9LnB1bHNlLXJhZGlvLXBhdXNlLC5wdWxzZS1yYWRpby1wbGF5e2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjM2cHg7aGVpZ2h0OjIwcHg7YmFja2dyb3VuZC1zaXplOmNvbnRhaW4haW1wb3J0YW50O3ZlcnRpY2FsLWFsaWduOm1pZGRsZTtjdXJzb3I6cG9pbnRlcn0ucHVsc2UtcmFkaW8tcGF1c2V7YmFja2dyb3VuZDp1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc2hhcGUtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iPjx0aXRsZT5QYXVzZTwvdGl0bGU+PGcgc3Ryb2tlPSIjZmVmZWZkIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIwIiBzdHJva2UtbGluZWpvaW49Im51bGwiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0iTTg0LjMwOCAxOC42Mjh2OTAuNzQ0TTQzLjY5MiAxOC4xOTZ2OTEuNjA4Ii8+PC9nPjwvc3ZnPicpIDUwJSBuby1yZXBlYXR9LnB1bHNlLXJhZGlvLXBsYXl7YmFja2dyb3VuZDp1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc2hhcGUtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iPjx0aXRsZT5QbGF5PC90aXRsZT48cGF0aCBmaWxsPSIjZmVmZWZkIiBzdHJva2U9IiNmZWZlZmQiIHN0cm9rZS13aWR0aD0iMTYiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjQiIGQ9Ik05OC4wMzYgNjRsLTY4LjA3MiA0NC43MThWMTkuMjgyTDk4LjAzNiA2NCIvPjwvc3ZnPicpIDUwJSBuby1yZXBlYXR9LnB1bHNlLXJhZGlvLXZvbHVtZXtkaXNwbGF5OmlubGluZS1ibG9jayFpbXBvcnRhbnQ7d2lkdGg6MTY0cHghaW1wb3J0YW50O2hlaWdodDoxMDAlO3ZlcnRpY2FsLWFsaWduOm1pZGRsZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50fS5wdWxzZS1yYWRpby12b2x1bWU6Zm9jdXN7b3V0bGluZTowfS5wdWxzZS1yYWRpby12b2x1bWU6Oi13ZWJraXQtc2xpZGVyLXJ1bm5hYmxlLXRyYWNre2JhY2tncm91bmQtY29sb3I6Izg1OGY5Njtib3JkZXI6MDtib3JkZXItcmFkaXVzOjNweDtoZWlnaHQ6NHB4fS5wdWxzZS1yYWRpby12b2x1bWU6Oi13ZWJraXQtc2xpZGVyLXRodW1iey13ZWJraXQtYXBwZWFyYW5jZTpub25lO2JvcmRlcjowO2hlaWdodDoxM3B4O3dpZHRoOjEzcHg7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZDojZWZkOTRmO21hcmdpbi10b3A6LTRweH0jY2FudmFze21hcmdpbjphdXRvfSN2YW5pbGxhLWhvbWUtbGlua3twYWRkaW5nLXRvcDoycHg7dGV4dC1hbGlnbjpjZW50ZXI7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsI2ZmZixyZ2JhKDE4LDEzNSwyMTgsLjE2KSwjZmZmKX0jdmFuaWxsYS1ob21lLWxpbmsgYXtjb2xvcjojNjI4OGFmfS5jdXItcG9pbnRlcntjdXJzb3I6cG9pbnRlcn0uY3VzdG9tLXNjcm9sbGJhcjo6LXdlYmtpdC1zY3JvbGxiYXJ7aGVpZ2h0OjhweDt3aWR0aDo4cHh9LmN1c3RvbS1zY3JvbGxiYXI6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNre2JhY2tncm91bmQtY29sb3I6cmdiYSgxMzIsMTMyLDEzMiwuMil9LmN1c3RvbS1zY3JvbGxiYXI6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1ie2JhY2tncm91bmQtY29sb3I6Izc3MjkyOX0uY3VzdG9tLXNjcm9sbGJhcjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIsLmN1c3RvbS1zY3JvbGxiYXI6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNre2JvcmRlci1yYWRpdXM6MTRweH0jcGF5LW1vZGFse2ZvbnQtZmFtaWx5OiJSb2JvdG8gQ29uZGVuc2VkIiwiSGVsdmV0aWNhIE5ldWUiLEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmfSNwYXktbW9kYWwgLmFmdGVyLXBheW1lbnR7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzo1cHg7bWFyZ2luOjdweCAwfSNwYXktbW9kYWwgLm1vZGFsLWRpYWxvZ3t3aWR0aDozNDBweDt1c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZX0jcGF5LW1vZGFsIC5nbHlwaGljb24tcmVtb3Zle2ZvbnQtc2l6ZToxOHB4O2xpbmUtaGVpZ2h0OjI4cHh9I3BheS1tb2RhbCAucGF5LWJ1dHRvbntiYWNrZ3JvdW5kOiNmZmMwNTQ7Zm9udC1zaXplOjE2cHg7Y29sb3I6IzU2NTY2NTt0ZXh0LXNoYWRvdzpub25lO3dpZHRoOjEyMHB4fSNwYXktbW9kYWwgLm1vZGFsLWhlYWRlcntwYWRkaW5nOjEwcHg7YmFja2dyb3VuZC1jb2xvcjojOTQ3ZmZmO2JvcmRlci1yYWRpdXM6NHB4IDRweCAwIDA7Y29sb3I6I2ZmZn0jcGF5LW1vZGFsIC5wcmljZXtmb250LXNpemU6NDhweDtmb250LWZhbWlseTpVYnVudHUsIkhlbHZldGljYSBOZXVlIixIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZjtmb250LXdlaWdodDo3MDB9I3BheS1tb2RhbCAuZ2x5cGhpY29uLXJ1Ymxle2ZvbnQtc2l6ZTozNnB4fSNwYXktbW9kYWwgLm1vZGFsLWJvZHl7Y29sb3I6I2I2YzdkMH0jcGF5LW1vZGFsIC5mZWF0dXJlcy1kZXNjcmlwdGlvbntjb2xvcjojNzA4MDkwfSNwYXktbW9kYWwgLmhpbnR7Y29sb3I6I2NiY2JjYjtmb250LXNpemU6MTNweH0jcGF5LW1vZGFsIC5tb2RhbC1mb290ZXJ7YmFja2dyb3VuZC1jb2xvcjojZWZlZmVmfSNwYXktbW9kYWwgLmhpbnQtcHJpbWFyeXtiYWNrZ3JvdW5kLWNvbG9yOiM3ZmZmZDQ7Ym9yZGVyLXJhZGl1czo0cHg7cGFkZGluZzowIDRweH0udmVydGljYWwtYWxpZ25tZW50LWhlbHBlcntkaXNwbGF5OnRhYmxlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCV9LnZlcnRpY2FsLWFsaWduLWNlbnRlcntkaXNwbGF5OnRhYmxlLWNlbGw7dmVydGljYWwtYWxpZ246bWlkZGxlfSNwYXktbW9kYWwgLm1vZGFsLWNvbnRlbnR7d2lkdGg6aW5oZXJpdDtoZWlnaHQ6aW5oZXJpdDttYXJnaW46MCBhdXRvfSNwYXktbWV0aG9kc3t2aXNpYmlsaXR5OmhpZGRlbjtoZWlnaHQ6MH0jdi1leC1tZW51e2ZvbnQtZmFtaWx5OiJSb2JvdG8gQ29uZGVuc2VkIiwiSGVsdmV0aWNhIE5ldWUiLEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmO2ZvbnQtc2l6ZToxNXB4O2JhY2tncm91bmQ6I2ZlZmVmZTtib3JkZXI6MXB4IHNvbGlkICNmOGJiNTk7cG9zaXRpb246YWJzb2x1dGU7Ym90dG9tOjgwcHg7dXNlci1zZWxlY3Q6bm9uZTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtMTAwLjIlKTt0cmFuc2l0aW9uOnRyYW5zZm9ybSAyNTBtczt3aGl0ZS1zcGFjZTpub3dyYXA7bGluZS1oZWlnaHQ6MTAwJTt6LWluZGV4OjEwMDJ9I3YtZXgtbWVudVtzaG93XXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgwKX0udmVtLWdyb3VwLXRpdGxle3RleHQtYWxpZ246Y2VudGVyO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOjE1cHg7Y29sb3I6IzI0YjZkNDtiYWNrZ3JvdW5kLWNvbG9yOiNmMGYzZjU7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2MyY2ZkNjtwYWRkaW5nOjhweCAzMHB4fS52ZW0tZ3JvdXAtdGl0bGU6bm90KDpmaXJzdC1jaGlsZCl7Ym9yZGVyLXRvcDoxcHggc29saWQgI2MyY2ZkNn0udmVtLWdyb3VwLW9wdGlvbnN7Y29sb3I6IzE1MWIxZTtwYWRkaW5nOjAgMTBweDttYXJnaW46MTBweCAwfS52ZW0tZWFye3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0Oi0xMnB4O2JvdHRvbTotMXB4O3dpZHRoOjEwcHg7aGVpZ2h0OjMwcHg7Ym9yZGVyOjFweCBzb2xpZCAjZjhiYjU5O2JvcmRlci1sZWZ0OjJweCBzb2xpZCAjZmVmZWZlO2JvcmRlci1yYWRpdXM6MnB4IDRweCA0cHggMnB4O2N1cnNvcjpwb2ludGVyO2JhY2tncm91bmQtY29sb3I6I2ZlZmVmZTtib3gtc2l6aW5nOmNvbnRlbnQtYm94fSN2LWV4LW1lbnVbZmlyc3RTdGFydF0gLnZlbS1lYXJ7YW5pbWF0aW9uOmFuaW0tZWFyLXB1bHNlIDRzIGVhc2UgaW5maW5pdGV9LnZlbS1lYXI+c3Bhbnt2ZXJ0aWNhbC1hbGlnbjpzdWI7Zm9udC1zaXplOjIycHg7Y29sb3I6IzY0N2Y4YztsaW5lLWhlaWdodDoyN3B4fS52ZW0tY29tYm9ib3ggc2VsZWN0e3dpZHRoOjEwMCU7dGV4dC1hbGlnbjpjZW50ZXI7bWFyZ2luLXRvcDoxMHB4fUBzdXBwb3J0cyAoLXdlYmtpdC1hcHBlYXJhbmNlOmNoZWNrYm94KXsudmVtLWNvbWJvYm94IHNlbGVjdHtwYWRkaW5nOjJweCA0cHg7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwuMDc1KTtib3JkZXI6MXB4IHNvbGlkICNjY2M7Ym9yZGVyLXJhZGl1czo0cHg7Y29sb3I6IzU1NX19LnZlbS1pbnB1dCBpbnB1dFt0eXBlPXRleHRdW21heGxlbmd0aD0iMyJde3dpZHRoOjM0cHg7dGV4dC1hbGlnbjpjZW50ZXI7bWFyZ2luLXJpZ2h0OjRweH0udmVtLWlucHV0IGlucHV0W2RhdGEtdHlwZT1udW1iZXJde2NvbG9yOiM3MDgwOTA7Ym9yZGVyLXJhZGl1czoyMHB4O2JvcmRlcjoycHggc29saWQgI2RhZGZlMTt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7b3V0bGluZTowfS5zd2l0Y2ggbGFiZWwsLnZlbS1pbnB1dCBsYWJlbHtmb250LXdlaWdodDo0MDA7bWFyZ2luLWJvdHRvbTo0cHh9LnN3aXRjaHtjb2xvcjojNzc4Mjg1O21hcmdpbi1ib3R0b206MTBweH0uc3dpdGNoIGxhYmVse21hcmdpbi1ib3R0b206MH0uc3dpdGNoIC5zd2l0Y2gtdGl0bGV7dmVydGljYWwtYWxpZ246bWlkZGxlO21hcmdpbi1sZWZ0OjEycHh9LnN3aXRjaCAuc3dpdGNoLWNvbnRyb2wsLnN3aXRjaCAuc3dpdGNoLWNvbnRyb2w+c3BhbntoZWlnaHQ6MTJweDtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7dHJhbnNpdGlvbjphbGwgLjE1cyBlYXNlfS5zd2l0Y2ggLnN3aXRjaC1jb250cm9se2JvcmRlcjoycHggc29saWQgI2RhZGZlMTt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7Y3Vyc29yOnBvaW50ZXI7Ym94LXNpemluZzpjb250ZW50LWJveDtkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyNHB4O2JvcmRlci1yYWRpdXM6MjBweH0uc3dpdGNoIC5zd2l0Y2gtY29udHJvbD5zcGFue2Rpc3BsYXk6YmxvY2s7d2lkdGg6MTJweDtib3JkZXItcmFkaXVzOjUwJTtib3gtc2hhZG93OjFweCAxcHggMnB4IHJnYmEoMCwwLDAsLjMpfS5zd2l0Y2ggaW5wdXQ6Y2hlY2tlZH4uc3dpdGNoLXRpdGxle2NvbG9yOiMxNTFiMWV9LnN3aXRjaCBpbnB1dDpkaXNhYmxlZH5zcGFue29wYWNpdHk6LjN9LnN3aXRjaCBpbnB1dFt0eXBlPWNoZWNrYm94XSwuc3dpdGNoIGlucHV0W3R5cGU9Y29sb3Jde2Rpc3BsYXk6bm9uZX0uc3dpdGNoIGlucHV0OmNoZWNrZWR+LnN3aXRjaC1jb250cm9se2JhY2tncm91bmQtY29sb3I6IzJmY2E2Yztib3JkZXItY29sb3I6IzMwYmQ1Zn0uc3dpdGNoIGlucHV0OmNoZWNrZWR+LnN3aXRjaC1jb250cm9sPnNwYW57bWFyZ2luLWxlZnQ6MTJweDtib3gtc2hhZG93Oi0xcHggMXB4IDJweCByZ2JhKDAsMCwwLC4zKX0uc3dpdGNoIC5jb2xvci1jb250cm9se2Rpc3BsYXk6aW5saW5lLWJsb2NrO3ZlcnRpY2FsLWFsaWduOm1pZGRsZTt3aWR0aDozMnB4O2hlaWdodDoxOHB4fS5zd2l0Y2ggLmNvbG9yLWNvbnRyb2w+c3BhbntkaXNwbGF5OmJsb2NrO3dpZHRoOjE4cHg7aGVpZ2h0OjE4cHg7Ym9yZGVyLXJhZGl1czo1MCU7bWFyZ2luOjAgYXV0bztib3gtc2hhZG93OjAgMCAycHggIzAwMH1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LWRldmljZS13aWR0aDoxMzY2cHgpeyN2LWV4LW1lbnUsLmNoYXQtd2luZG93e3RyYW5zZm9ybS1vcmlnaW46bGVmdCBib3R0b219LmNoYXQtd2luZG93e3RyYW5zZm9ybTpzY2FsZSguOSl9I3YtZXgtbWVudXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtOTAuMiUpIHNjYWxlKC45KX0jdi1leC1tZW51W3Nob3dde3RyYW5zZm9ybTp0cmFuc2xhdGVYKDApIHNjYWxlKC45KX19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6MTAyNHB4KXsjdi1leC1tZW51LC5jaGF0LXdpbmRvd3t0cmFuc2Zvcm0tb3JpZ2luOmxlZnQgYm90dG9tfS5jaGF0LXdpbmRvd3t0cmFuc2Zvcm06c2NhbGUoLjgpfSN2LWV4LW1lbnV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTg1LjIlKSBzY2FsZSguODUpfSN2LWV4LW1lbnVbc2hvd117dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMCkgc2NhbGUoLjg1KX19") + 
      _0x26ae("0x38b") + _0x26ae("0x38c"));
      let target = {
        "agario" : {
          "re" : /<script [^>]*?src="([^>]*?agario\.js).+?><\/script>/,
          "url" : "",
          "version" : 0,
          "proc" : data[_0x26ae("0xba")][_0x26ae("0x24a")][_0x26ae("0x38d")]["proc"]
        },
        "core" : {
          "re" : /<script [^>]*?src="([^>]*?agario\.core\.js).+?><\/script>/,
          "url" : "",
          "version" : 0,
          "proc" : data["vanilla"][_0x26ae("0x24a")][_0x26ae("0x49")][_0x26ae("0x24b")],
          "important" : true,
          "async" : true
        },
        "bundleStart" : {
          "re" : /<script [^>]*?src="(bundle_start\.\w+\.js).+?><\/script>/,
          "url" : "",
          "version" : 0,
          "onload" : "ru" === vanilla["getSupportLanguage"]() ? _0x26ae("0x38e") : null,
          "proc" : (result) => {
            return result;
          }
        },
        "bundleEnd" : {
          "re" : /<script [^>]*?src="(bundle_end\.\w+\.js).+?><\/script>/,
          "url" : "",
          "version" : 0,
          "proc" : (options) => {
            return options = vanilla[_0x26ae("0x235")](options, _0x26ae("0x38f"), _0x26ae("0x390")), value = vanilla["replaceRegex"](value, _0x26ae("0x38c"), _0x26ae("0x391")), options;
          }
        }
      };
      !function() {
        function render(ctx, e) {
          var eventMark;
          if (Array[_0x26ae("0x66")](ctx[_0x26ae("0x24b")])) {
            ctx[_0x26ae("0x24b")]["forEach"]((getTarget, canCreateDiscussions, isSlidingUp) => {
              if (_0x26ae("0x5") == typeof getTarget) {
                e = getTarget(e) || e;
              }
            });
          } else {
            e = ctx[_0x26ae("0x24b")](e);
          }
          value = vanilla[_0x26ae("0x235")](value, ctx["re"], _0x26ae("0x392") + (eventMark = e, data[_0x26ae("0x393")]["createObjectURL"](new Blob([eventMark], {
            "type" : _0x26ae("0x394")
          }))) + '" ' + (ctx["async"] ? _0x26ae("0x395") : "") + " " + (ctx["onload"] || "") + _0x26ae("0x396"));
          if (0 == --_0x9ae7a9) {
            document[_0x26ae("0xe3")]();
            document["write"](value);
            document["close"]();
            leftRecord[_0x26ae("0x397")]();
            vanilla[_0x26ae("0x6d")] = leftRecord[_0x26ae("0x6d")];
            vanilla["dispatchEvent"] = leftRecord[_0x26ae("0xbb")];
            obj[_0x26ae("0x398")](vanilla);
          }
        }
        let names = Object[_0x26ae("0xf")](target);
        let _0x9ae7a9 = names[_0x26ae("0xc")];
        for (let name of names) {
          let token = target[name];
          let mixins = value[_0x26ae("0x231")](token["re"]);
          if (token["re"][_0x26ae("0x230")](value)) {
            token[_0x26ae("0x399")] = mixins[1];
            token[_0x26ae("0x39a")] = mixins[2] || Date[_0x26ae("0x2e")]() / 1E3 / 60 | 0;
            get(name, token, token[_0x26ae("0x399")], token[_0x26ae("0x39a")], render);
          }
        }
      }();
    });
    if (0 == (0 | localStorage[_0x26ae("0xdb")]("firstStart"))) {
      localStorage[_0x26ae("0x10d")](_0x26ae("0x39b"), _0x26ae("0x39c"));
      localStorage[_0x26ae("0x10d")](_0x26ae("0x1a2"), _0x26ae("0x39d"));
      localStorage["setItem"](_0x26ae("0x168"), "1");
    }
  });
  (function() {
    function detect() {
      function init(listeners) {
        if (!(listeners["length"] < 15 || 0 !== listeners["indexOf"](_0x26ae("0x4b")))) {
          if (-1 !== listeners[_0x26ae("0x46")]()[_0x26ae("0xb")](_0x26ae("0x39e"))) {
            data[_0x26ae("0x49")]["disableIntegrityChecks"](true);
            obj["Core"]["ui"][_0x26ae("0xec")]["_integrityChecksActive"] = false;
          }
          data["core"][_0x26ae("0x4a")]();
          data[_0x26ae("0x49")][_0x26ae("0x10c")]("wss://" + filter(listeners));
        }
      }
      let props;
      let _0x4d22c9;
      let _0x2f64a0;
      let table = create(_0x26ae("0x8d"), {
        "id" : "direct-connect"
      });
      table[_0x26ae("0x71")]("afterbegin", _0x26ae("0x39f"));
      props = table[_0x26ae("0x96")]("#btn-dc-input");
      _0x4d22c9 = table[_0x26ae("0x96")](_0x26ae("0x3a0"));
      _0x2f64a0 = table["querySelector"](_0x26ae("0x3a1"));
      props[_0x26ae("0x6d")](_0x26ae("0x3a2"), function(_Event_prototype) {
        if (13 == _Event_prototype[_0x26ae("0x371")]) {
          init(props[_0x26ae("0x171")]);
          _Event_prototype["stopImmediatePropagation"]();
        }
      }, false);
      data[_0x26ae("0xba")]["addEventListener"](_0x26ae("0x10c"), function(argsValue) {
        props[_0x26ae("0x171")] = argsValue[_0x26ae("0x364")];
      }, false);
      props[_0x26ae("0x6d")](_0x26ae("0x3a3"), function(canCreateDiscussions) {
        canCreateDiscussions[_0x26ae("0x3a4")][_0x26ae("0x3a5")]();
      }, false);
      _0x4d22c9[_0x26ae("0x6d")](_0x26ae("0x3a6"), function(canCreateDiscussions) {
        obj["refreshServer"]();
      }, false);
      _0x2f64a0[_0x26ae("0x6d")](_0x26ae("0x3a6"), function(canCreateDiscussions) {
        init(props[_0x26ae("0x171")]);
      }, false);
      target["tabContainer"]["querySelector"](_0x26ae("0x3a7"))[_0x26ae("0x3a8")](table);
    }
    function render(lagOffset) {
      function delta() {
        data["vanilla"]["dispatchEvent"](_0x26ae("0x325"), arr[i] || arr[0]);
      }
      function Number() {
        return i = parseInt(localStorage[_0x26ae("0x3da")], 10) || 0;
      }
      function init(idx) {
        if (idx < arr[_0x26ae("0xc")]) {
          switch(localStorage[_0x26ae("0x3da")] = i = idx, document[_0x26ae("0x70")]["style"][_0x26ae("0x3db")] = "", eventsToRemember[_0x26ae("0x3dc")]({
            "id" : "darkTheme",
            "state" : arr[idx][_0x26ae("0xaa")],
            "disabled" : 0 != idx
          }), delta(), arr[idx][_0x26ae("0x65")]) {
            case _0x26ae("0xb0"):
              return document[_0x26ae("0x70")][_0x26ae("0x35c")]["backgroundImage"] = 'url("' + arr[idx][_0x26ae("0x399")] + '")', document[_0x26ae("0x70")][_0x26ae("0x35c")][_0x26ae("0x3dd")] = _0x26ae("0x3de"), document["body"][_0x26ae("0x35c")]["backgroundSize"] = _0x26ae("0x3df"), void(document[_0x26ae("0x70")][_0x26ae("0x35c")][_0x26ae("0x3e0")] = "fixed");
            case "color":
              return void(document["body"][_0x26ae("0x35c")][_0x26ae("0x3e1")] = arr[idx]["url"]);
            case _0x26ae("0x3b5"):
              return document[_0x26ae("0x70")][_0x26ae("0x35c")][_0x26ae("0x189")] = screen[_0x26ae("0x189")] + "px", document["body"]["style"][_0x26ae("0x18b")] = screen[_0x26ae("0x18b")] + "px", document[_0x26ae("0x70")]["style"]["background"] = arr[idx][_0x26ae("0x399")], document[_0x26ae("0x70")]["style"][_0x26ae("0x3dd")] = _0x26ae("0x3de"), void(document[_0x26ae("0x70")][_0x26ae("0x35c")][_0x26ae("0x3e0")] = "fixed");
            default:
              return void(document["body"]["style"][_0x26ae("0x3e1")] = _0x10153e[_0x26ae("0xaa")] ? _0x26ae("0x3e2") : _0x26ae("0x3e3"));
          }
        }
      }
      let i = 0;
      let arr = [{
        "type" : "",
        "url" : _0x26ae("0x3a9"),
        "darkTheme" : false,
        "description" : translate({
          "ru" : _0x26ae("0x3aa"),
          "en" : "The original theme"
        })
      }, {
        "type" : "image",
        "url" : _0x26ae("0x3ab"),
        "darkTheme" : true,
        "borderColor" : _0x26ae("0x3ac"),
        "description" : translate({
          "ru" : _0x26ae("0x3ad"),
          "en" : _0x26ae("0x3ae")
        })
      }, {
        "type" : _0x26ae("0xb0"),
        "url" : _0x26ae("0x3af"),
        "darkTheme" : false,
        "borderColor" : _0x26ae("0x3b0"),
        "description" : translate({
          "ru" : _0x26ae("0x3b1"),
          "en" : "Effulgence"
        })
      }, {
        "type" : _0x26ae("0xb0"),
        "url" : tarpitHost + _0x26ae("0x3b2"),
        "darkTheme" : true,
        "borderColor" : _0x26ae("0x3b3"),
        "description" : translate({
          "ru" : "\u0421\u0438\u043d\u0435\u0432\u0430\u0442\u043e-\u0441\u0435\u0440\u044b\u0439",
          "en" : _0x26ae("0x3b4")
        })
      }, {
        "type" : _0x26ae("0x3b5"),
        "url" : _0x26ae("0x3b6"),
        "darkTheme" : true,
        "borderColor" : _0x26ae("0x3b7"),
        "description" : translate({
          "ru" : _0x26ae("0x3b8"),
          "en" : _0x26ae("0x3b9")
        })
      }, {
        "type" : _0x26ae("0xb0"),
        "url" : tarpitHost + _0x26ae("0x3ba"),
        "darkTheme" : true,
        "borderColor" : "rgba(0,0,16,0.2)",
        "description" : translate({
          "ru" : "\u0412\u0435\u043b\u0438\u043a\u043e\u043b\u0435\u043f\u043d\u044b\u0439 \u0441\u0438\u043d\u0438\u0439",
          "en" : _0x26ae("0x3bb")
        })
      }, {
        "type" : _0x26ae("0x3b5"),
        "url" : _0x26ae("0x3bc"),
        "darkTheme" : true,
        "borderColor" : _0x26ae("0x3bd"),
        "description" : translate({
          "ru" : "\u0422\u0451\u043c\u043d\u043e-\u0441\u0435\u0440\u044b\u0439",
          "en" : _0x26ae("0x3be")
        })
      }, {
        "type" : _0x26ae("0x3b5"),
        "url" : _0x26ae("0x3bf"),
        "darkTheme" : false,
        "borderColor" : _0x26ae("0x3c0"),
        "description" : translate({
          "ru" : "\u0413\u043e\u043b\u0443\u0431\u043e\u0439",
          "en" : _0x26ae("0x3c1")
        })
      }, {
        "type" : _0x26ae("0x3b5"),
        "url" : _0x26ae("0x3c2"),
        "darkTheme" : false,
        "borderColor" : _0x26ae("0x3b3"),
        "description" : translate({
          "ru" : "C\u0432\u0435\u0442\u043b\u043e-\u0433\u043e\u043b\u0443\u0431\u043e\u0439",
          "en" : _0x26ae("0x3c3")
        })
      }, {
        "type" : "radial-gradient",
        "url" : _0x26ae("0x3c4"),
        "darkTheme" : false,
        "borderColor" : _0x26ae("0x3b3"),
        "description" : translate({
          "ru" : _0x26ae("0x3c5"),
          "en" : "Grey snow"
        })
      }, {
        "type" : _0x26ae("0x3b5"),
        "url" : _0x26ae("0x3c6"),
        "darkTheme" : false,
        "borderColor" : "rgba(10,10,10,0.15)",
        "description" : translate({
          "ru" : _0x26ae("0x3c7"),
          "en" : _0x26ae("0x3c8")
        })
      }, {
        "type" : _0x26ae("0x3b5"),
        "url" : _0x26ae("0x3c9"),
        "darkTheme" : true,
        "borderColor" : _0x26ae("0x3ca"),
        "sectorColor" : "rgba(130,140,149,0.2)",
        "mmTextColor" : "",
        "mmCenterTextColor" : "",
        "description" : translate({
          "ru" : _0x26ae("0x3cb"),
          "en" : _0x26ae("0x3cc")
        })
      }, {
        "type" : _0x26ae("0x3b5"),
        "url" : _0x26ae("0x3cd"),
        "darkTheme" : true,
        "borderColor" : "rgba(30,10,16,0.15)",
        "description" : translate({
          "ru" : _0x26ae("0x3ce"),
          "en" : _0x26ae("0x3cf")
        })
      }, {
        "type" : _0x26ae("0x3b5"),
        "url" : "radial-gradient(circle at center, rgb(18, 0, 41) 0%, rgb(6, 0, 15) 100%)",
        "darkTheme" : true,
        "borderColor" : _0x26ae("0x3ca"),
        "description" : translate({
          "ru" : _0x26ae("0x3d0"),
          "en" : _0x26ae("0x3d1")
        })
      }, {
        "type" : "image",
        "url" : tarpitHost + _0x26ae("0x3d2"),
        "darkTheme" : true,
        "borderColor" : "rgba(239,214,49,0.1)",
        "description" : translate({
          "ru" : _0x26ae("0x3d3"),
          "en" : _0x26ae("0x3d4")
        })
      }];
      let _0x247d0a = translate({
        "ru" : " -- \u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u043e\u043d -- ",
        "en" : " -- Select a background -- ",
        "fr" : " -- S\u00e9lectionner un arri\u00e8re-plan -- ",
        "tr" : _0x26ae("0x3d5"),
        "es" : _0x26ae("0x3d6"),
        "it" : _0x26ae("0x3d7"),
        "de" : _0x26ae("0x3d8")
      });
      let _0x10153e = {
        "get" : () => {
          return JSON[_0x26ae("0x5f")](localStorage[_0x26ae("0xfa")]);
        },
        get "darkTheme"() {
          return this[_0x26ae("0x12")]()[_0x26ae("0x3d9")] || false;
        }
      };
      data[_0x26ae("0xba")]["addEventListener"](-743589170, function(canCreateDiscussions) {
        let _0x2dc721 = canCreateDiscussions[0];
        if (_0x26ae("0x3d9") === canCreateDiscussions[1] && 0 === i) {
          document["body"][_0x26ae("0x35c")][_0x26ae("0x3e1")] = _0x2dc721[_0x26ae("0x3d9")] ? "#111111" : "#f2fbff";
        }
      }, false);
      data[_0x26ae("0xba")][_0x26ae("0x6d")]("initMainMenuComplete", function() {
        init(i);
      }, false);
      data[_0x26ae("0xba")][_0x26ae("0x195")][_0x26ae("0x3e4")] = {
        "change" : delta,
        "getSelectedTheme" : function() {
          return arr[i] || arr[0];
        }
      };
      (function() {
        init(i = Number());
        let _0x2e3f47 = target[_0x26ae("0x3e5")][_0x26ae("0x96")]("#tab-home");
        let _0x2dc721 = null;
        if (_0x2e3f47) {
          init(i = Number());
          _0x2e3f47[_0x26ae("0x71")](_0x26ae("0x3e6"), _0x26ae("0x3e7") + _0x247d0a + "</option></select>");
          _0x2dc721 = _0x2e3f47[_0x26ae("0x96")](_0x26ae("0x3e8"));
          for (let idx = 0; idx < arr[_0x26ae("0xc")]; idx++) {
            _0x2dc721[_0x26ae("0x71")]("beforeend", _0x26ae("0x3e9") + (idx === i ? _0x26ae("0x3ea") : "") + _0x26ae("0x3eb") + arr[idx][_0x26ae("0x3ec")] + _0x26ae("0x3ed"));
          }
          _0x2dc721[_0x26ae("0x6d")](_0x26ae("0x6b"), function(task_options) {
            init(task_options["target"][_0x26ae("0x3ee")] - 1);
          }, false);
        }
      })();
    }
    function initialize(castNode) {
      function firstPointGuide() {
        return name = parseInt(localStorage["vn_virusColorScheme"], 10) || 0;
      }
      function cb(username) {
        if (username < options[_0x26ae("0xc")]) {
          localStorage["vn_virusColorScheme"] = name = username;
          data[_0x26ae("0xba")][_0x26ae("0x303")][_0x26ae("0x41a")] = options[username][_0x26ae("0x52")];
          data[_0x26ae("0xba")][_0x26ae("0x303")][_0x26ae("0x41b")] = options[username][_0x26ae("0x41c")];
        }
      }
      let name = 0;
      let options = [{
        "color" : _0x26ae("0x3ef"),
        "colorEdge" : "rgb(45,229,45)",
        "description" : translate({
          "ru" : _0x26ae("0x3f0"),
          "en" : "Original"
        })
      }, {
        "color" : _0x26ae("0x3f1"),
        "colorEdge" : "rgba(45,229,45,0.7)",
        "description" : translate({
          "ru" : "\u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b + \u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c",
          "en" : _0x26ae("0x3f2")
        })
      }, {
        "color" : _0x26ae("0x3f3"),
        "colorEdge" : _0x26ae("0x3f4"),
        "description" : translate({
          "ru" : _0x26ae("0x3f5"),
          "en" : _0x26ae("0x3f6")
        })
      }, {
        "color" : _0x26ae("0x3f7"),
        "colorEdge" : _0x26ae("0x3f8"),
        "description" : translate({
          "ru" : _0x26ae("0x3f9"),
          "en" : "Mobile red + transparent"
        })
      }, {
        "color" : _0x26ae("0x3fa"),
        "colorEdge" : _0x26ae("0x3fb"),
        "description" : translate({
          "ru" : _0x26ae("0x3fc"),
          "en" : _0x26ae("0x3fd")
        })
      }, {
        "color" : "rgba(30,30,30,0.7)",
        "colorEdge" : _0x26ae("0x3f1"),
        "description" : translate({
          "ru" : _0x26ae("0x3fe"),
          "en" : _0x26ae("0x3ff")
        })
      }, {
        "color" : _0x26ae("0x400"),
        "colorEdge" : _0x26ae("0x400"),
        "description" : translate({
          "ru" : _0x26ae("0x401"),
          "en" : _0x26ae("0x402")
        })
      }, {
        "color" : _0x26ae("0x403"),
        "colorEdge" : "rgba(255,155,56,0.7)",
        "description" : translate({
          "ru" : "\u0410\u043f\u0435\u043b\u044c\u0441\u0438\u043d\u043e\u0432\u044b\u0439",
          "en" : _0x26ae("0x404")
        })
      }, {
        "color" : _0x26ae("0x405"),
        "colorEdge" : _0x26ae("0x405"),
        "description" : translate({
          "ru" : _0x26ae("0x406"),
          "en" : _0x26ae("0x407")
        })
      }, {
        "color" : _0x26ae("0x405"),
        "colorEdge" : _0x26ae("0x408"),
        "description" : translate({
          "ru" : _0x26ae("0x409"),
          "en" : _0x26ae("0x40a")
        })
      }, {
        "color" : _0x26ae("0x40b"),
        "colorEdge" : "rgb(255,238,56)",
        "description" : translate({
          "ru" : "\u0427\u0451\u0440\u043d\u043e-\u0436\u0451\u043b\u0442\u044b\u0439",
          "en" : "Black-yellow"
        })
      }, {
        "color" : _0x26ae("0x40c"),
        "colorEdge" : _0x26ae("0x40d"),
        "description" : translate({
          "ru" : _0x26ae("0x40e"),
          "en" : _0x26ae("0x40f")
        })
      }, {
        "color" : _0x26ae("0x410"),
        "colorEdge" : "rgb(236,236,236)",
        "description" : translate({
          "ru" : _0x26ae("0x411"),
          "en" : _0x26ae("0x412")
        })
      }];
      let _0x5e54c8 = translate({
        "ru" : _0x26ae("0x413"),
        "en" : _0x26ae("0x414"),
        "fr" : _0x26ae("0x415"),
        "tr" : _0x26ae("0x416"),
        "es" : _0x26ae("0x417"),
        "it" : _0x26ae("0x418"),
        "de" : _0x26ae("0x419")
      });
      !function() {
        cb(name = firstPointGuide());
        let _0xebac5d = target[_0x26ae("0x3e5")][_0x26ae("0x96")]("#tab-home");
        let _0x2dc721 = null;
        if (_0xebac5d) {
          cb(name = firstPointGuide());
          _0xebac5d["insertAdjacentHTML"]("beforeend", "<select id='virusColorScheme' class='form-control' style='margin-top: 6px' required=''><option disabled='disabled'>" + _0x5e54c8 + _0x26ae("0x41d"));
          _0x2dc721 = _0xebac5d[_0x26ae("0x96")](_0x26ae("0x41e"));
          for (let i = 0; i < options[_0x26ae("0xc")]; i++) {
            _0x2dc721[_0x26ae("0x71")](_0x26ae("0x3e6"), _0x26ae("0x3e9") + (i === name ? _0x26ae("0x3ea") : "") + ">VC: " + options[i][_0x26ae("0x3ec")] + _0x26ae("0x3ed"));
          }
          _0x2dc721[_0x26ae("0x6d")](_0x26ae("0x6b"), function(task_options) {
            cb(task_options["target"][_0x26ae("0x3ee")] - 1);
          }, false);
        }
      }();
    }
    function create() {
      function send(name) {
        return new Promise((callback, testFn) => {
          if (config[name]) {
            return callback(config[name]);
          }
          let current = new XMLHttpRequest;
          current[_0x26ae("0xe3")](_0x26ae("0xe4"), obj[_0x26ae("0x38")](name), true);
          current[_0x26ae("0x3a")] = (canCreateDiscussions) => {
            if (current[_0x26ae("0x427")]) {
              config[name] = current[_0x26ae("0x427")];
              callback(config[name]);
            } else {
              testFn(current["statusText"]);
            }
          };
          current[_0x26ae("0xe7")]();
        });
      }
      function print(wrapper, args, signature, value) {
        return new Promise((drawFrame, canCreateDiscussions) => {
          send(wrapper)[_0x26ae("0x58")]((isSlidingUp) => {
            let params = isSlidingUp[_0x26ae("0x96")]('*[name="' + signature + '"]');
            drawFrame({
              "spriteFileName" : obj[_0x26ae("0x38")](args),
              "textureName" : signature,
              "x" : 0 | params[_0x26ae("0x428")]("x"),
              "y" : 0 | params[_0x26ae("0x428")]("y"),
              "width" : 0 | params[_0x26ae("0x428")](_0x26ae("0x189")),
              "height" : 0 | params["getAttribute"]("height"),
              "amount" : value,
              "imageType" : "atlas"
            });
          })[_0x26ae("0x429")]((canCreateDiscussions) => {
          });
        });
      }
      function open(p) {
        if (/^\d+_(?:dna|coins)(?:_promo1)?$/[_0x26ae("0x230")](p)) {
          return null;
        }
        let _0x2dc721 = obj[_0x26ae("0x7a")][_0x26ae("0xac")][_0x26ae("0x42a")];
        let lines = _0x2dc721[_0x26ae("0x42b")][_0x26ae("0x368")]((expanding) => {
          return expanding["id"] === p;
        });
        let socket = null;
        if (lines[_0x26ae("0xc")]) {
          socket = [];
          for (let line of lines) {
            socket["push"]({
              "productId" : line[_0x26ae("0x42c")],
              "quantity" : line[_0x26ae("0x42d")],
              "visual" : _0x26ae("0x42e") === line["productId"] ? _0x2dc721[_0x26ae("0x42f")][_0x26ae("0x430")]((canCreateDiscussions) => {
                return _0x26ae("0x431") === canCreateDiscussions[_0x26ae("0x432")];
              }) : _0x2dc721[_0x26ae("0x433")]["find"]((currentItem) => {
                return currentItem["productId"] === line[_0x26ae("0x42c")];
              })
            });
          }
        }
        return socket;
      }
      function check(context) {
        return context["match"](/(\d+_\w+?(?=_\d_|_\d+_dna_|$))/g);
      }
      function callback(el) {
        let m;
        if (!(el["childNodes"][_0x26ae("0xc")] > 0)) {
          for (let files of obj[_0x26ae("0x434")]()["walletInappPurchases"]) {
            if (m = check(files[_0x26ae("0x432")]), open(files["bundleId"])) {
              let result = document[_0x26ae("0x30")](_0x26ae("0x435"));
              result[_0x26ae("0x37d")] = m["join"](_0x26ae("0x436")) + _0x26ae("0x437") + require(files[_0x26ae("0x438")]);
              result[_0x26ae("0x171")] = files["id"];
              el["appendChild"](result);
            }
          }
        }
      }
      function resolve() {
        return obj["Core"][_0x26ae("0xbc")]["shop"][_0x26ae("0x439")][_0x26ae("0x43a")]();
      }
      function require(relModuleId) {
        let name = resolve();
        return obj[_0x26ae("0x7a")]["models"][_0x26ae("0x43b")]["getPriceForTier"](relModuleId, name) + " " + (attrToProp[name] || name);
      }
      function isString(name) {
        return leon_construct[_0x26ae("0x230")](name);
      }
      function init(conid) {
        let target = obj[_0x26ae("0x7a")]["models"]["shopPurchasesModel"][_0x26ae("0x45a")](conid);
        let lerpFns = obj[_0x26ae("0x79")][init["b"]("o2SeqUWyMF5yrUDhoT9wLJkcrzS0nJ9hYxxkBT4=")];
        let table = document[_0x26ae("0x96")](_0x26ae("0x45b"));
        let _0xfa8d69 = table[_0x26ae("0x96")](_0x26ae("0x45c"));
        let temp = table[_0x26ae("0x96")](".coins");
        let enginesObject = table["querySelector"](_0x26ae("0x45d"));
        let sArrDayId = check(target[_0x26ae("0x432")]);
        var data;
        var src;
        temp["innerHTML"] = parseInt(sArrDayId[0], 10);
        enginesObject[_0x26ae("0x37d")] = require(target[_0x26ae("0x438")]);
        _0xfa8d69[_0x26ae("0x37d")] = lerpFns[_0x26ae("0x308")](target["localizedName"]);
        table[_0x26ae("0x45e")](_0x26ae("0x45f"))["forEach"](function(canCreateDiscussions) {
          canCreateDiscussions[_0x26ae("0xa")]();
        });
        (src = target[_0x26ae("0x432")], new Promise((PL$7, sessionMiddleware) => {
          let arrays = open(src);
          if (!arrays) {
            return sessionMiddleware(null);
          }
          let _0x362711 = Promise[_0x26ae("0x460")]();
          let PL$24 = [];
          for (let arr of arrays) {
            let data = arr[_0x26ae("0x461")];
            let foo = data[_0x26ae("0x462")];
            if ("cell" === data[_0x26ae("0x463")]) {
              let _0x3e5306 = obj[_0x26ae("0x7a")][_0x26ae("0xac")][_0x26ae("0x464")](data[_0x26ae("0x42c")])[_0x26ae("0xaf")];
              PL$24["push"]({
                "cellColor" : "#" + _0x3e5306[_0x26ae("0x19a")][_0x26ae("0x55")](2),
                "source" : obj[_0x26ae("0x38")](foo[_0x26ae("0xb1")]),
                "sourceHigh" : obj[_0x26ae("0x38")](foo[_0x26ae("0x465")]),
                "amount" : arr[_0x26ae("0x42d")],
                "imageType" : data[_0x26ae("0x463")]
              });
            } else {
              if (_0x26ae("0x466") === data["imageType"]) {
                PL$24[_0x26ae("0x9")]({
                  "cellColor" : "",
                  "source" : obj[_0x26ae("0x38")](foo[_0x26ae("0xb1")]),
                  "sourceHigh" : obj[_0x26ae("0x38")](foo[_0x26ae("0x465")]),
                  "amount" : arr["quantity"],
                  "imageType" : data["imageType"]
                });
              } else {
                if (_0x26ae("0x467") === data[_0x26ae("0x463")]) {
                  _0x362711 = _0x362711[_0x26ae("0x58")](() => {
                    return print(foo[_0x26ae("0x468")], foo["spriteFilename"], foo[_0x26ae("0x469")], arr[_0x26ae("0x42d")]);
                  })[_0x26ae("0x58")]((PL$60) => {
                    return PL$24["push"](PL$60);
                  });
                }
              }
            }
          }
          _0x362711[_0x26ae("0x58")](() => {
            PL$24[_0x26ae("0x46a")]((isSlidingUp, canCreateDiscussions) => {
              return !!canCreateDiscussions["cellColor"];
            });
            PL$7(PL$24);
          });
        }))[_0x26ae("0x58")]((prev) => {
          for (let a of prev) {
            if (a[_0x26ae("0x46b")]) {
              let _0x20472d = 90 / a["height"];
              let _0xd66d7d = a["amount"] > 1 ? '<div class="xpmt-item-amount" style="zoom: ' + 1 / _0x20472d + '">' + (data = a["amount"], String(data)[_0x26ae("0x41")](/(\d{2})(?=(\d{3})+([^\d]|$))/g, _0x26ae("0x46c"))) + _0x26ae("0x46d") : "";
              table[_0x26ae("0x96")](_0x26ae("0x46e"))["insertAdjacentHTML"](_0x26ae("0x3e6"), _0x26ae("0x46f") + a["spriteFileName"] + ") " + -a["x"] + _0x26ae("0x194") + -a["y"] + _0x26ae("0x470") + a["width"] + "px; height: " + a["height"] + _0x26ae("0x471") + _0x20472d + '">' + _0xd66d7d + _0x26ae("0x46d"));
            } else {
              table[_0x26ae("0x96")](_0x26ae("0x46e"))[_0x26ae("0x71")]("beforeend", _0x26ae("0x472") + a[_0x26ae("0xb1")] + _0x26ae("0x473") + (a[_0x26ae("0x19a")] || _0x26ae("0x474")) + "; border-radius: " + (a[_0x26ae("0x19a")] ? "50%" : _0x26ae("0x475")) + _0x26ae("0x476"));
            }
          }
        });
      }
      document[_0x26ae("0x96")](_0x26ae("0x41f"));
      let prev = document[_0x26ae("0x96")](_0x26ae("0x420"));
      let backdrop = document[_0x26ae("0x30")](_0x26ae("0x8d"));
      let leon_construct = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      let attrToProp = {
        "CNY" : _0x26ae("0x421"),
        "EUR" : _0x26ae("0x422"),
        "GBP" : _0x26ae("0x423"),
        "JPY" : _0x26ae("0x424"),
        "RUB" : _0x26ae("0x425"),
        "USD" : _0x26ae("0x426")
      };
      let config = {};
      backdrop[_0x26ae("0x71")]("afterbegin", _0x26ae("0x43c"));
      backdrop[_0x26ae("0x6d")]("click", function(canCreateDiscussions) {
        callback($el);
        init($el[_0x26ae("0x43")][$el[_0x26ae("0x43")][_0x26ae("0x3ee")]][_0x26ae("0x171")]);
        wysiwygConf[_0x26ae("0x43d")] = obj[_0x26ae("0xda")] && obj["user"]["id"] || "";
      }, false);
      target["on"](_0x26ae("0x72"), () => {
        (prev = document[_0x26ae("0x96")](_0x26ae("0x420")))[_0x26ae("0x9b")]["insertBefore"](backdrop, prev["nextSibling"]);
      });
      let _0x12e98d = translate({
        "ru" : {
          "specialOffers" : _0x26ae("0x43e"),
          "toMakePurchases" : _0x26ae("0x43f"),
          "notEnterAnything" : _0x26ae("0x440")
        },
        "en" : {
          "specialOffers" : "Special deals",
          "toMakePurchases" : "To make purchases, you must be logged in to your account",
          "notEnterAnything" : _0x26ae("0x441")
        },
        "tr" : {
          "specialOffers" : _0x26ae("0x442"),
          "toMakePurchases" : _0x26ae("0x443"),
          "notEnterAnything" : _0x26ae("0x444")
        },
        "es" : {
          "specialOffers" : _0x26ae("0x445"),
          "toMakePurchases" : "Para realizar las compras, debe iniciar sesi\u00f3n en su cuenta",
          "notEnterAnything" : _0x26ae("0x446")
        },
        "it" : {
          "specialOffers" : _0x26ae("0x447"),
          "toMakePurchases" : _0x26ae("0x448"),
          "notEnterAnything" : _0x26ae("0x449")
        },
        "de" : {
          "specialOffers" : _0x26ae("0x44a"),
          "toMakePurchases" : _0x26ae("0x44b"),
          "notEnterAnything" : _0x26ae("0x44c")
        },
        "fr" : {
          "specialOffers" : _0x26ae("0x44d"),
          "toMakePurchases" : _0x26ae("0x44e"),
          "notEnterAnything" : _0x26ae("0x44f")
        }
      });
      document[_0x26ae("0x70")][_0x26ae("0x71")]("beforeend", _0x26ae("0x450") + ('<h4 class="modal-title">' + _0x12e98d[_0x26ae("0x451")] + _0x26ae("0x452")) + '</div><div class="modal-body">' + ('<input type="email" class="form-control" id="agario_uid_input" placeholder="UID (' + _0x12e98d[_0x26ae("0x453")] + ')" style="width: 94%; display: inline-block">') + '<div class="custom-checkbox" style="display: inline-block; margin-left: 9px; vertical-align: sub;"><input id="checkBoxLockUID" type="checkbox" style="width: 20px; height: 20px"><label for="cb1"></label></div><div class="bs-callout bs-callout-buy bs-callout-clickable" id="buy_starterpack"><h4 class="pull-left">STARTER PACK</h4><h4 class="text-right"></h4><div class="xpmt-buy-content"><div class="xpmt-money-stack"><span class="coins">&nbsp;</span></div><div class="xpmt-skins"></div></div></div><select id="ss-select-purchases" class="form-control" required=""></select>' + 
      (_0x26ae("0x454") + _0x12e98d[_0x26ae("0x455")] + _0x26ae("0x456")) + _0x26ae("0x457"));
      let survivedIdList = document[_0x26ae("0x96")](_0x26ae("0x458"));
      let wysiwygConf = document[_0x26ae("0x96")]("#exp-uid");
      let $el = document["querySelector"](_0x26ae("0x459"));
      document["querySelector"](_0x26ae("0x477"))["addEventListener"](_0x26ae("0x6b"), function(task_options) {
        if (task_options["target"][_0x26ae("0x478")]) {
          let pkg = survivedIdList[_0x26ae("0x171")];
          if (isString(pkg)) {
            task_options[_0x26ae("0x3a4")][_0x26ae("0x479")](_0x26ae("0x16d"), _0x26ae("0x16d"));
            survivedIdList[_0x26ae("0x479")](_0x26ae("0x16d"), _0x26ae("0x16d"));
            obj[_0x26ae("0xda")][_0x26ae("0x47a")]["id"] = obj["user"]["id"] = pkg;
          } else {
            task_options[_0x26ae("0x3a4")]["checked"] = false;
          }
        }
        task_options[_0x26ae("0x167")]();
      }, false);
      document[_0x26ae("0x96")](_0x26ae("0x47b"))[_0x26ae("0x6d")](_0x26ae("0x3a6"), function(canCreateDiscussions) {
        var artistTrack;
        var id;
        canCreateDiscussions[_0x26ae("0x167")]();
        artistTrack = $el[_0x26ae("0x43")][$el[_0x26ae("0x43")][_0x26ae("0x3ee")]][_0x26ae("0x171")];
        id = survivedIdList[_0x26ae("0x171")];
        if (obj[_0x26ae("0xda")] && obj[_0x26ae("0xda")]["id"]) {
          obj[_0x26ae("0x7a")]["services"][_0x26ae("0x47c")]["_payModel"]["buyProduct"](isString(id) ? id : obj[_0x26ae("0xda")]["id"], artistTrack, resolve());
        }
      }, false);
      $el[_0x26ae("0x6d")]("change", function(canCreateDiscussions) {
        init(canCreateDiscussions[_0x26ae("0x3a4")][_0x26ae("0x171")]);
      }, false);
    }
    function run(player) {
      function flushAndFail(errorMsg) {
        self[_0x26ae("0x4cd")](settings);
      }
      function render(prop) {
        settings[_0x26ae("0x4e0")] = obj[_0x26ae("0x43")][_0x26ae("0xfe")];
        settings[_0x26ae("0x50")] = settings[_0x26ae("0x4e0")]["toStronger32UTF8Conversion"]();
        settings["skin"] = obj[_0x26ae("0x43")][_0x26ae("0x505")];
        settings[_0x26ae("0x47")] = obj[_0x26ae("0x43")][_0x26ae("0x47")];
        settings["gamemode"] = obj[_0x26ae("0x43")][_0x26ae("0x44")];
        settings["uid"] = obj[_0x26ae("0x43")]["socialId"];
        settings[_0x26ae("0x506")] = obj[_0x26ae("0x43")][_0x26ae("0x507")];
        settings[_0x26ae("0x52")] = parseInt(settings[_0x26ae("0x506")][_0x26ae("0x55")](1), 16) || 0;
        settings[_0x26ae("0x36d")] = window[_0x26ae("0x352")]["cleanAddr"];
        settings[_0x26ae("0x4df")] = localStorage["getItem"](_0x26ae("0x508")) || settings[_0x26ae("0x4df")];
        settings["ownSkin"] = window[_0x26ae("0x509")]["query"]();
        if (prop) {
          Object["assign"](settings, prop);
        }
      }
      let css = data["vanilla"]["module"][_0x26ae("0x374")];
      let window = data[_0x26ae("0xba")];
      let MIME_TYPES = data[_0x26ae("0xba")][_0x26ae("0xfa")];
      let PSSHBoxBuffer = new ArrayBuffer(512);
      let dataPlus = new Uint8Array(PSSHBoxBuffer, 0, 1);
      let settings = (new Uint8Array(PSSHBoxBuffer, 0, 9), new DataView(PSSHBoxBuffer, 0), css[_0x26ae("0x47d")]());
      let _0x76e589 = 0;
      let element = null;
      let _0x10f327 = null;
      let PL$35 = null;
      let _0x47110f = null;
      let options = null;
      let params0 = null;
      let _0x47e1b1 = new Audio(waveTag + _0x26ae("0x47e"));
      let _0x3167b6 = new Audio(waveTag + _0x26ae("0x47f"));
      let TTYPlayerPrototype = new Audio(waveTag + _0x26ae("0x480"));
      let _0x480c85 = new Audio(waveTag + _0x26ae("0x481"));
      let ttyPlayer = new Audio(waveTag + _0x26ae("0x482"));
      let multiple = !attemptRun();
      let M = translate({
        "ru" : {
          "serverConnected" : _0x26ae("0x483"),
          "serverDisonnected" : _0x26ae("0x484"),
          "needUpdate" : _0x26ae("0x485"),
          "roomKey" : _0x26ae("0x486")
        },
        "en" : {
          "serverConnected" : _0x26ae("0x487"),
          "serverDisonnected" : _0x26ae("0x488"),
          "needUpdate" : _0x26ae("0x489"),
          "roomKey" : _0x26ae("0x48a")
        },
        "tr" : {
          "serverConnected" : _0x26ae("0x48b"),
          "serverDisonnected" : _0x26ae("0x48c"),
          "needUpdate" : _0x26ae("0x48d"),
          "roomKey" : _0x26ae("0x48e")
        },
        "es" : {
          "serverConnected" : _0x26ae("0x48f"),
          "serverDisonnected" : "La conexi\u00f3n a la estaci\u00f3n se ha perdido. Esto es temporal y pronto todo ser\u00e1 restaurado ...",
          "needUpdate" : _0x26ae("0x490"),
          "roomKey" : _0x26ae("0x491")
        },
        "it" : {
          "serverConnected" : _0x26ae("0x492"),
          "serverDisonnected" : "La connessione alla stazione \u00e8 stata persa. Questo \u00e8 temporaneo e presto tutti saranno ripristinati...",
          "needUpdate" : _0x26ae("0x493"),
          "roomKey" : _0x26ae("0x494")
        },
        "de" : {
          "serverConnected" : "Die Verbindung wird hergestellt. Flug ist normal!",
          "serverDisonnected" : "Die Verbindung zum Bahnhof ist verloren gegangen. Dies ist vor\u00fcbergehend und bald alle wiederhergestellt werden ...",
          "needUpdate" : _0x26ae("0x495"),
          "roomKey" : _0x26ae("0x496")
        },
        "fr" : {
          "serverConnected" : "La connexion est \u00e9tablie. Le vol est normal!",
          "serverDisonnected" : "La connexion \u00e0 la station a \u00e9t\u00e9 perdue. C'est temporaire et bient\u00f4t tous seront restaur\u00e9s ...",
          "needUpdate" : _0x26ae("0x497"),
          "roomKey" : "Cl\u00e9 de la chambre (optionnel)"
        }
      });
      let callbacks = function() {
        let data = {
          "laugh" : {
            "re" : /(?::D|:=D|:-D|:d|:=d|:-d|\u0416\u0412)/g,
            "tag" : ":D"
          },
          "smile" : {
            "re" : /(?::\)|:=\)|:-\)|\u0416\))/g,
            "tag" : ":)"
          },
          "sad" : {
            "re" : /(?::\(|:=\(|:-\(|\u0416\()/g,
            "tag" : ":("
          },
          "cool" : {
            "re" : /(?:8=\)|8-\)|8\)|B=\)|B-\)|\(cool\))/g,
            "tag" : "8)"
          },
          "wink" : {
            "re" : /(?:;\)|;-\)|;=\)|\u0436\))/g,
            "tag" : ";)"
          },
          "surprised" : {
            "re" : /(?::o|:=o|:-o|:O|:=O|:-O|\(surprised\)|\(Surprised\)|\u0416\u0429)/g,
            "tag" : "(surprised)"
          },
          "cry" : {
            "re" : /(?:;\(|;-\(|;=\()/g,
            "tag" : ";("
          },
          "speechless" : {
            "re" : /(?::\||:=\||:-\|)/g,
            "tag" : ":|"
          },
          "tongueout" : {
            "re" : /(?::P|:=P|:-P|:p|:=p|:-p|\u0416\u0417)/g,
            "tag" : ":P"
          },
          "heart" : {
            "re" : /(?:\(h\)|\(H\)|\(l\)|\(L\)|<3)/g,
            "tag" : _0x26ae("0x498")
          },
          "lips" : {
            "re" : /\(lips\)/g,
            "tag" : _0x26ae("0x499")
          },
          "santa" : {
            "re" : /\(santa\)/g
          },
          "drunk" : {
            "re" : /\(drunk\)/g,
            "tag" : "(drunk)"
          },
          "rofl" : {
            "re" : /\(rofl\)/g,
            "tag" : _0x26ae("0x49a")
          },
          "cwl" : {
            "re" : /(?:\(cwl\)|\(lol\))/g,
            "tag" : _0x26ae("0x49b")
          },
          "rock" : {
            "re" : /\(rock\)/g,
            "tag" : _0x26ae("0x49c")
          },
          "facepalm" : {
            "re" : /\(facepalm\)/g,
            "tag" : _0x26ae("0x49d")
          },
          "sarcastic" : {
            "re" : /\((?:sarcastic|Sarcastic|sarcasm|Sarcasm|slowclap|Slowclap)\)/g,
            "tag" : _0x26ae("0x49e")
          },
          "finger" : {
            "re" : /(?:\(finger\)|^fu$|(?!\s)fu$|(?!\s)fu(?=\s))/g,
            "tag" : _0x26ae("0x49f")
          },
          "angry" : {
            "re" : /(?::@|:-@|:=@|x\(|x-\(|x=\(|X\(|X-\(|X=\()/g,
            "tag" : ":@"
          },
          "hi" : {
            "re" : /\((?:hi|wave)\)/g
          },
          "evilgrin" : {
            "re" : /(?:]:\)|>:\)|\(grin\))/g,
            "tag" : "(grin)"
          },
          "shock" : {
            "re" : /\(shock\)/g
          },
          "kiss" : {
            "re" : /(?::\*|:=\*|:-\*)/g,
            "tag" : ":*"
          },
          "blush" : {
            "re" : /(?:\(blush\)|:\$|:-\$|:=\$|:">)/g,
            "tag" : _0x26ae("0x4a0")
          },
          "devil" : {
            "re" : /\(devil\)/g,
            "tag" : "(devil)"
          },
          "clap" : {
            "re" : /\(clap\)/g,
            "tag" : _0x26ae("0x4a1")
          },
          "party" : {
            "re" : /\(party\)/g,
            "tag" : "(party)"
          },
          "lipssealed" : {
            "re" : /(?::x|:-x|:X|:-X|:#|:-#|:=x|:=X|:=#)/g,
            "tag" : ":X"
          },
          "worry" : {
            "re" : /(?::S|:-S|:=S|:s|:-s|:=s)/g,
            "tag" : ":S"
          },
          "happy" : {
            "re" : /\(happy\)/g,
            "tag" : _0x26ae("0x4a2")
          },
          "punch" : {
            "re" : /\(punch\)/g,
            "tag" : _0x26ae("0x4a3")
          },
          "call" : {
            "re" : /\(call\)/g,
            "tag" : "(call)"
          },
          "wtf" : {
            "re" : /\(wtf\)/g
          },
          "swear" : {
            "re" : /\(swear\)/g,
            "tag" : "(swear)"
          },
          "bandit" : {
            "re" : /\(bandit\)/g,
            "tag" : _0x26ae("0x4a4")
          },
          "yes" : {
            "re" : /\((?:y|Y)\)/g,
            "tag" : _0x26ae("0x4a5")
          },
          "no" : {
            "re" : /\((?:n|N)\)/g,
            "tag" : _0x26ae("0x4a6")
          },
          "ok" : {
            "re" : /\((?:ok|OK|oK|Ok|okay|Okay)\)/g,
            "tag" : _0x26ae("0x4a7")
          },
          "poop" : {
            "re" : /\(poop\)/g,
            "tag" : _0x26ae("0x4a8")
          },
          "bomb" : {
            "re" : /\(bomb\)/g,
            "tag" : _0x26ae("0x4a9")
          },
          "plane" : {
            "re" : /\((?:plane|Plane|ap|Ap|airplane|Airplane|aeroplane|Aeroplane|aircraft|Aircraft|jet|Jet)\)/g,
            "tag" : "(jet)"
          },
          "monkey" : {
            "re" : /\(monkey\)/g,
            "tag" : _0x26ae("0x4aa")
          },
          "mishka" : {
            "re" : /\((?:mishka|Mishka)\)/g,
            "tag" : _0x26ae("0x4ab")
          },
          "dog" : {
            "re" : /(?:\(dog\)|:o3)/g,
            "tag" : _0x26ae("0x4ac")
          },
          "gift" : {
            "re" : /\((?:gift|Gift|g|G)\)/g,
            "tag" : "(gift)"
          }
        };
        return {
          "doIt" : function(remainingTimes) {
            for (let tmpJump in data) {
              remainingTimes = remainingTimes[_0x26ae("0x41")](data[tmpJump]["re"], _0x26ae("0x4ad") + tmpJump + _0x26ae("0x4ae"));
            }
            return remainingTimes[_0x26ae("0x41")](/(?:https?:\/\/\S+?.(?:png|gif|jpg|jpeg)\S*|data:image\/.+(?: |$))/g, '<img class="chat-embed-image" src="$&" crossorigin="anonymous">');
          },
          "fillPreview" : function(canCreateDiscussions) {
            if (void 0 != canCreateDiscussions) {
              for (let tmpJump in data) {
                if (void 0 != data[tmpJump][_0x26ae("0x4af")]) {
                  canCreateDiscussions[_0x26ae("0x71")]("beforeend", _0x26ae("0x4b0") + tmpJump + '/views/default_20" data-tag="' + data[tmpJump][_0x26ae("0x4af")] + _0x26ae("0x4b1"));
                }
              }
            }
          },
          "insertTag" : function(element, data) {
            let behaviorInstance = element["scrollTop"];
            let value = element[_0x26ae("0x4b2")];
            let tmp_flow_path = element["value"][_0x26ae("0x4b3")](0, value);
            let filename = element[_0x26ae("0x171")]["substring"](element[_0x26ae("0x4b4")], element[_0x26ae("0x171")][_0x26ae("0xc")]);
            value = value + data[_0x26ae("0xc")];
            element[_0x26ae("0x171")] = tmp_flow_path + data + filename;
            element[_0x26ae("0x4b2")] = value;
            element[_0x26ae("0x4b4")] = value;
            element[_0x26ae("0x3a3")]();
            element["scrollTop"] = behaviorInstance;
          }
        };
      }();
      let tween = function() {
        function process(crossover) {
          if (!_0x4bd4e3) {
            if (null !== crossover) {
              let _SERVICE_TAKING_TOO_LONG = 1E3 * (crossover || MIME_TYPES[_0x26ae("0x161")] || 15);
              clearTimeout(_takingTooLongTimeout);
              _takingTooLongTimeout = setTimeout(process, _SERVICE_TAKING_TOO_LONG, null);
            } else {
              PL$35["style"][_0x26ae("0x4bb")] = _0x26ae("0x4bc");
            }
          }
        }
        function remove() {
          let PL$29 = PL$27[_0x26ae("0xc")] - (MIME_TYPES[_0x26ae("0x15e")] || 20);
          let pixel = 0;
          if (PL$29 > 0) {
            for (; PL$29 > pixel;) {
              PL$35[_0x26ae("0x96")]('div[data-messid="' + PL$27[pixel++]["id"] + '"]')[_0x26ae("0xa")]();
            }
            PL$27["splice"](0, PL$29);
          }
        }
        function onComplete(index) {
          PL$20 = 0;
          for (let reserved of PL$27) {
            if (reserved["id"] === index) {
              PL$35["querySelector"](_0x26ae("0x4bd") + reserved["id"] + '"]')[_0x26ae("0xa")]();
              PL$27[_0x26ae("0x4be")](PL$20, 1);
              break;
            }
            PL$20 = PL$20 + 1;
          }
        }
        let PL$20 = 0;
        let PL$27 = [];
        let CAPTURE_ID = 1;
        let uniqueErrors = {};
        let count = 0;
        let _0x4bd4e3 = false;
        let _takingTooLongTimeout = 0;
        const monthsToShow = ["rgb(3,169,244)", _0x26ae("0x4b5"), _0x26ae("0x4b6"), _0x26ae("0x4b7"), "rgb(139,195,74)", _0x26ae("0x4b8"), "rgb(255,235,59)", "rgb(255,193,7)", _0x26ae("0x4b9"), _0x26ae("0x4ba")];
        return setTimeout(function render() {
          let btDCS = Date[_0x26ae("0x2e")]();
          for (let request of PL$27) {
            if (request[_0x26ae("0x4bf")] && btDCS - request["date"] > 6E3) {
              onComplete(request["id"]);
            }
          }
          setTimeout(render, 1E3);
        }, 1E3), _0x480c85[_0x26ae("0x4c0")] = .1, _0x47e1b1[_0x26ae("0x4c0")] = .2, _0x3167b6[_0x26ae("0x4c0")] = .2, {
          "addMessage" : function(message, result) {
            let isSelected = 0 === result["indexOf"]("! ");
            if (isSelected) {
              result = result[_0x26ae("0xb9")](2);
            }
            if (void 0 == uniqueErrors[message]) {
              uniqueErrors[message] = monthsToShow[count++ % monthsToShow[_0x26ae("0xc")]];
            }
            let PL$8 = {
              "id" : CAPTURE_ID,
              "body" : '<div data-messid="' + CAPTURE_ID + _0x26ae("0x4c1") + (isSelected ? _0x26ae("0x4c2") : "") + _0x26ae("0x4c3") + uniqueErrors[message] + '">' + message + _0x26ae("0x4c4") + callbacks["doIt"](result) + _0x26ae("0x4c5"),
              "date" : Date[_0x26ae("0x2e")](),
              "isSpecial" : isSelected
            };
            PL$27["push"](PL$8);
            let undefined = element[_0x26ae("0x4c6")] - element["clientHeight"];
            return PL$35["style"][_0x26ae("0x4bb")] = _0x26ae("0x4c7"), PL$35[_0x26ae("0x71")](_0x26ae("0x3e6"), PL$8[_0x26ae("0x70")]), element[_0x26ae("0x4c8")] == undefined && (element[_0x26ae("0x4c8")] = element["scrollHeight"]), multiple && _0x26ae("0x4c9") == document["visibilityState"] && (isSelected ? (ttyPlayer[_0x26ae("0x95")](), ttyPlayer["currentTime"] = 0, ttyPlayer["play"]()) : _0x480c85[_0x26ae("0x4ca")]()), remove(), process(), CAPTURE_ID++;
          },
          "remove" : onComplete,
          "openChatWindow" : function() {
            _0x4bd4e3 = true;
            clearTimeout(_takingTooLongTimeout);
            PL$35[_0x26ae("0x35c")][_0x26ae("0x4bb")] = "block";
            element[_0x26ae("0x4c8")] = element[_0x26ae("0x4c6")];
          },
          "closeChatWindow" : function(canCreateDiscussions) {
            _0x4bd4e3 = false;
            if (canCreateDiscussions) {
              PL$35["style"][_0x26ae("0x4bb")] = _0x26ae("0x4bc");
            } else {
              process();
            }
          },
          "pullChat" : process,
          "serverClosed" : function() {
            let _0x512ea5 = !options[_0x26ae("0x35c")][_0x26ae("0x4bb")];
            _0x47110f[_0x26ae("0x35c")][_0x26ae("0x4bb")] = null;
            options[_0x26ae("0x35c")][_0x26ae("0x4bb")] = _0x26ae("0x4cb");
            if (_0x512ea5) {
              if (window[_0x26ae("0xfa")][_0x26ae("0x4cc")]) {
                params0[_0x26ae("0x35c")][_0x26ae("0x4bb")] = _0x26ae("0x4cb");
                TTYPlayerPrototype[_0x26ae("0x4ca")]();
              } else {
                _0x3167b6[_0x26ae("0x4ca")]();
              }
            }
          },
          "serverOpened" : function() {
            let _0x512ea5 = !_0x47110f[_0x26ae("0x35c")][_0x26ae("0x4bb")];
            _0x47110f[_0x26ae("0x35c")][_0x26ae("0x4bb")] = _0x26ae("0x4cb");
            options[_0x26ae("0x35c")]["display"] = null;
            if (_0x512ea5) {
              if (window[_0x26ae("0xfa")][_0x26ae("0x4cc")]) {
                params0[_0x26ae("0x35c")]["display"] = _0x26ae("0x4cb");
                TTYPlayerPrototype["play"]();
              } else {
                _0x47e1b1[_0x26ae("0x4ca")]();
              }
              setTimeout(function() {
                _0x47110f[_0x26ae("0x35c")][_0x26ae("0x4bb")] = null;
              }, 5E3);
            }
          }
        };
      }();
      this[_0x26ae("0x4ce")] = css[_0x26ae("0x4cf")];
      this[_0x26ae("0x4d0")] = function(modelInstanceOrCreateMap, oldValue) {
        self[_0x26ae("0x4d1")](modelInstanceOrCreateMap, oldValue);
      };
      class e {
        static ["defineConstants"](descriptor, obj) {
          let properties = {};
          for (let [prop, delta] of Object[_0x26ae("0x4d2")](obj)) {
            properties[prop] = {
              "value" : delta
            };
          }
          Object[_0x26ae("0x4d3")](descriptor, properties);
        }
        static [_0x26ae("0x60")](data) {
          try {
            return JSON[_0x26ae("0x60")](data);
          } catch (_0x2eb713) {
          }
        }
        static get [_0x26ae("0x4d4")]() {
          return 0;
        }
        static get [_0x26ae("0x4d5")]() {
          return 1;
        }
        static get [_0x26ae("0x4d6")]() {
          return 2;
        }
        static get [_0x26ae("0x4d7")]() {
          return 2;
        }
        static get [_0x26ae("0x4d8")]() {
          return 3;
        }
        static get ["DISCONNECT"]() {
          return 4;
        }
        static get [_0x26ae("0x4d9")]() {
          return 5;
        }
        static get [_0x26ae("0x4da")]() {
          return 7;
        }
        static get ["SAME_SERVER"]() {
          return 8;
        }
        static get [_0x26ae("0x4db")]() {
          return 10;
        }
        static get ["PREMIUM"]() {
          return 11;
        }
        static get [_0x26ae("0x4dc")]() {
          return 20;
        }
        constructor(value_or_anything) {
          this[_0x26ae("0x4dd")] = {
            "uid" : "",
            "roomId" : _0x26ae("0x357"),
            "sip" : "",
            "region" : "",
            "gamemode" : "",
            "state" : e[_0x26ae("0x4d4")],
            "nick" : "",
            "hash" : 0,
            "skin" : {
              "src" : "",
              "spine" : false
            },
            "color" : 0,
            "strokeColor" : "",
            "ownSkin" : "",
            "alive" : false
          };
          this["textEncoder"] = new TextEncoder(_0x26ae("0x4de"));
          let _status = this[_0x26ae("0x4dd")][_0x26ae("0x36d")];
          let attrObjValue = this["info"][_0x26ae("0x4df")];
          let expr = this[_0x26ae("0x4dd")][_0x26ae("0x4e0")];
          Object[_0x26ae("0x4d3")](this[_0x26ae("0x4dd")], {
            "nick" : {
              "get" : () => {
                return expr;
              },
              "set" : (b) => {
                if ((expr = b["length"] ? this["limitString"](b, 15) : b)[_0x26ae("0xc")]) {
                  let callbackVals = this[_0x26ae("0x4e1")][_0x26ae("0x4e2")](expr);
                  let targetOffsetHeight = 0;
                  let clientHeight = callbackVals[_0x26ae("0xc")];
                  let _0x62d38a = 1404277552;
                  for (; targetOffsetHeight < clientHeight;) {
                    _0x62d38a = _0x62d38a + 113 ^ callbackVals[targetOffsetHeight++];
                    _0x62d38a = _0x62d38a * 371;
                  }
                  this[_0x26ae("0x4dd")]["hash"] = _0x62d38a >>> 0;
                }
              }
            },
            "sip" : {
              "get" : () => {
                return _status;
              },
              "set" : (router) => {
                _status = router[_0x26ae("0x41")](/(?:wss?:\/\/)?(.+:\d+).*/i, "$1");
              }
            },
            "roomId" : {
              "get" : () => {
                return attrObjValue;
              },
              "set" : (b) => {
                attrObjValue = b["length"] ? this[_0x26ae("0x4e3")](b, 20) : _0x26ae("0x357");
              }
            },
            "alive" : {
              "get" : () => {
                return this["info"]["state"] === e["SPAWN"];
              },
              "set" : () => {
              }
            }
          });
          this[_0x26ae("0x4cd")](value_or_anything);
        }
        [_0x26ae("0x4e3")](data, mmCoreSplitViewBlock) {
          return Array["from"](data)[_0x26ae("0xb9")](0, mmCoreSplitViewBlock)["join"]("");
        }
        get [_0x26ae("0x4e4")]() {
          let _tempRoomIdSet = this[_0x26ae("0x4dd")];
          return !!_tempRoomIdSet[_0x26ae("0x36d")] && !!_tempRoomIdSet["roomId"];
        }
        get ["inGame"]() {
          return this[_0x26ae("0x4dd")]["state"] === e[_0x26ae("0x4d5")];
        }
        get [_0x26ae("0x4e5")]() {
          return this["info"]["state"] === e[_0x26ae("0x4d5")];
        }
        get [_0x26ae("0x4e6")]() {
          let nonWhitespaceOrBookmarkEval = /-([0-9a-z]{5,})\.agar\.io:\d+/i;
          let el = this[_0x26ae("0x4dd")][_0x26ae("0x36d")];
          return nonWhitespaceOrBookmarkEval[_0x26ae("0x230")](el) ? el[_0x26ae("0x231")](nonWhitespaceOrBookmarkEval)[1] : "";
        }
        [_0x26ae("0x4cd")](prop) {
          return _0x26ae("0x334") == typeof prop && (prop = e["parse"](prop)), "object" == typeof prop && Object[_0x26ae("0x35")](this["info"], prop), this;
        }
        [_0x26ae("0x7c")]() {
          return this[_0x26ae("0x4e4")] ? JSON[_0x26ae("0x178")](this[_0x26ae("0x4dd")]) : null;
        }
      }
      class AttrLoader {
        [_0x26ae("0x4e7")]() {
        }
        [_0x26ae("0x4e8")]() {
        }
        [_0x26ae("0x4e9")](canCreateDiscussions, ..._0x91f415) {
        }
        ["_connect"](renderlessBody) {
          this[_0x26ae("0x4ea")] = new WebSocket(_0x26ae("0x4eb"));
          this["socket"][_0x26ae("0x4ec")] = _0x26ae("0x4ed");
          this[_0x26ae("0x4ea")][_0x26ae("0x4e7")] = (canCreateDiscussions) => {
            this[_0x26ae("0x4ee")] = 0;
            this[_0x26ae("0x4e7")]();
          };
          this[_0x26ae("0x4ea")][_0x26ae("0x4e8")] = (canCreateDiscussions) => {
            this["PREMIUM_TOKEN"] = 0;
            this["timeoutInterval"] = 1E3 * (2 * Math["min"](this[_0x26ae("0x4ee")]++, 4) + Math[_0x26ae("0x4ef")]());
            setTimeout(this[_0x26ae("0x4f0")][_0x26ae("0x16")](this, renderlessBody), this[_0x26ae("0x4f1")]);
            this[_0x26ae("0x4e8")]();
          };
          this["socket"][_0x26ae("0x4e9")] = (data) => {
            let _0x2dc721 = typeof data["data"];
            if (_0x26ae("0x334") === _0x2dc721) {
              try {
                let artistTrack = JSON[_0x26ae("0x60")](data["data"]);
                this[_0x26ae("0x4e9")](e[_0x26ae("0x4d4")], artistTrack);
              } catch (_0x54b16e) {
              }
            } else {
              if (_0x26ae("0x234") === _0x2dc721) {
                let _0x2dc721 = new DataView(data[_0x26ae("0x198")]);
                let artistTrack = _0x2dc721["getUint16"](0);
                let GET_AUTH_URL_TIMEOUT = _0x2dc721[_0x26ae("0x4f2")](2);
                switch(GET_AUTH_URL_TIMEOUT) {
                  case e[_0x26ae("0xc2")]:
                    this[_0x26ae("0x4f3")] = _0x2dc721[_0x26ae("0x4f4")](3);
                    this[_0x26ae("0x4e9")](GET_AUTH_URL_TIMEOUT, this[_0x26ae("0x4f3")]);
                    break;
                  case e["SEND_MESSAGE"]:
                    let numKeysDeleted = this[_0x26ae("0x4f5")][_0x26ae("0x4f6")](new Uint8Array(data[_0x26ae("0x198")], 3));
                    if (!(65535 === artistTrack)) {
                      this[_0x26ae("0x4e9")](GET_AUTH_URL_TIMEOUT, artistTrack, numKeysDeleted);
                    }
                    break;
                  case e["UPDATE"]:
                    this[_0x26ae("0x4e9")](GET_AUTH_URL_TIMEOUT, artistTrack, _0x2dc721[_0x26ae("0x4f7")](3, true), _0x2dc721[_0x26ae("0x4f7")](7, true));
                    break;
                  case e[_0x26ae("0x4d8")]:
                  case e[_0x26ae("0x4f8")]:
                    this[_0x26ae("0x4e9")](GET_AUTH_URL_TIMEOUT, artistTrack);
                }
              }
            }
          };
        }
        static [_0x26ae("0x4f9")](g, testCache, then) {
          let time = Date[_0x26ae("0x2e")]();
          let totalDuration = time;
          let now = totalDuration - time;
          let t = null;
          return function start(...d) {
            totalDuration = Date[_0x26ae("0x2e")]();
            now = totalDuration - time;
            time = totalDuration;
            if (now < then) {
              clearTimeout(t);
              t = setTimeout(start, then - now, d);
            } else {
              testCache[_0x26ae("0x1f")](g, d);
            }
          };
        }
        static [_0x26ae("0x4fa")](p, buckets, name, dontForceConstraints) {
          let targetOffsetHeight = buckets;
          let clientHeight = buckets + name;
          let _0x2501e5 = dontForceConstraints;
          for (; targetOffsetHeight < clientHeight;) {
            _0x2501e5 = (_0x2501e5 = (_0x2501e5 = 374761393 + (_0x2501e5 = -949894596 ^ (_0x2501e5 = _0x2501e5 + 2127912214 + (_0x2501e5 << 12) | 0) ^ _0x2501e5 >>> 19) + (_0x2501e5 << 5) | 0) - 744332180 ^ _0x2501e5 << 9) - 42973499 + (_0x2501e5 << 3) | 0;
            p[targetOffsetHeight++] ^= -1252372727 ^ _0x2501e5 ^ _0x2501e5 >>> 16 | 0;
          }
          return p;
        }
        [_0x26ae("0x4fb")](PL$8, PL$16) {
          let PL$15 = new Uint8Array(PL$16[_0x26ae("0x4fc")] + 1);
          return PL$15[0] = PL$8, PL$15["set"](PL$16, 1), PL$15;
        }
        [_0x26ae("0xe7")](PL$126) {
          let PL$123 = this["socket"];
          let _0x48742d = PL$123[_0x26ae("0x4fd")] === PL$123[_0x26ae("0x4fe")];
          return _0x48742d && PL$123["send"](PL$126), _0x48742d;
        }
        [_0x26ae("0x11")](elementId, value) {
          switch(null === value ? _0x26ae("0x4ff") : typeof value) {
            case _0x26ae("0x334"):
              return this[_0x26ae("0xe7")](this[_0x26ae("0x4fb")](elementId, this["textEncoder"][_0x26ae("0x4e2")](value)));
            case "object":
              return this[_0x26ae("0xe7")](value instanceof Uint8Array ? this[_0x26ae("0x4fb")](elementId, value) : this[_0x26ae("0x4fb")](elementId, new Uint8Array(value[_0x26ae("0x500")])));
            default:
              return false;
          }
        }
        ["chat"](mmCoreSplitViewBlock) {
          return this[_0x26ae("0x11")](e[_0x26ae("0x4d9")], mmCoreSplitViewBlock);
        }
        get [_0x26ae("0x501")]() {
          let artistTrack = this[_0x26ae("0x502")][_0x26ae("0x7c")]();
          let data = this[_0x26ae("0x4e1")][_0x26ae("0x4e2")](artistTrack);
          return AttrLoader[_0x26ae("0x4fa")](data, 0, data[_0x26ae("0xc")], this[_0x26ae("0x4f3")]);
        }
        ["update"](data) {
          return this["localPlayer"]["update"](data)[_0x26ae("0x4e4")] && this[_0x26ae("0x11")](e[_0x26ae("0x4dc")], this["_encryptInfo"]);
        }
        [_0x26ae("0x4d1")](mmCoreSplitViewBlock, mmaPushNotificationsComponent) {
          if (this[_0x26ae("0x502")]["inGame"]) {
            let _0x379d87 = Date[_0x26ae("0x2e")]();
            if (_0x379d87 > this[_0x26ae("0x503")]) {
              this[_0x26ae("0x11")](e[_0x26ae("0x4d6")], Float32Array["of"](mmCoreSplitViewBlock, mmaPushNotificationsComponent));
              this[_0x26ae("0x503")] = _0x379d87 + 250;
            }
          }
        }
        constructor(dependencyChain) {
          this[_0x26ae("0x4f3")] = 0;
          this["lastUpdate"] = Date[_0x26ae("0x2e")]();
          this[_0x26ae("0x502")] = new e;
          this[_0x26ae("0x4f5")] = new TextDecoder(_0x26ae("0x4de"));
          this[_0x26ae("0x4e1")] = new TextEncoder("utf-8");
          this[_0x26ae("0x4f1")] = 5E3;
          this[_0x26ae("0x4ee")] = 0;
          this[_0x26ae("0x504")] = 8E3;
          this[_0x26ae("0x4f0")](dependencyChain);
        }
      }
      let self = new AttrLoader(window[_0x26ae("0x352")]["addr"]);
      self["onopen"] = function() {
        if (window[_0x26ae("0x352")][_0x26ae("0x50a")]) {
          callbacks[_0x26ae("0x50b")]();
          render({
            "state" : 0
          });
          this[_0x26ae("0x4cd")](settings);
        }
        tween["serverOpened"]();
      };
      self[_0x26ae("0x4e8")] = function() {
        clearing = 0;
        css[_0x26ae("0xd")]();
        tween[_0x26ae("0x50c")]();
      };
      self[_0x26ae("0x4e9")] = function(canCreateDiscussions, ...entry) {
        let p;
        let path;
        let to;
        let from;
        let rememberedPath;
        let x1;
        let i;
        switch(canCreateDiscussions) {
          case 0:
            [path] = entry;
            if (null != path[_0x26ae("0x36d")]) {
              css[_0x26ae("0x47d")](path);
            } else {
              callbacks[_0x26ae("0x50d")](path);
            }
            break;
          case 11:
            [from] = entry;
            clearing = from;
            leftRecord[_0x26ae("0xbb")](clearing ? -1839191229 : 1855757555, "");
            break;
          case 5:
            [to, rememberedPath] = entry;
            if (p = css[_0x26ae("0x12")](to)) {
              tween[_0x26ae("0x50e")](p[_0x26ae("0x4e0")], rememberedPath);
            }
            break;
          case 2:
            [to, x1, i] = entry;
            if (p = css[_0x26ae("0x12")](to)) {
              p["x"] = x1;
              p["y"] = i;
            }
            break;
          case 3:
            [to] = entry;
            if (p = css[_0x26ae("0x12")](to)) {
              p[_0x26ae("0x4e5")] = false;
              p[_0x26ae("0xf7")] = 3;
            }
            break;
          case 4:
            [to] = entry;
            css[_0x26ae("0xa")](to);
        }
      };
      window[_0x26ae("0x6d")](-743589170, function(canCreateDiscussions) {
        if (_0x26ae("0xab") === canCreateDiscussions[1]) {
          settings[_0x26ae("0x50f")] = obj["options"][_0x26ae("0x505")];
          flushAndFail();
        }
      }, false);
      window[_0x26ae("0x6d")](-903576033, function(canCreateDiscussions) {
        render();
        flushAndFail();
      }, false);
      window[_0x26ae("0x6d")](_0x26ae("0x10c"), function(canCreateDiscussions) {
        render({
          "alive" : false,
          "state" : 0,
          "color" : 0,
          "hash" : 0,
          "sip" : canCreateDiscussions ? canCreateDiscussions[_0x26ae("0x364")] : settings["sip"]
        });
        _0x76e589 = window[_0x26ae("0x352")][_0x26ae("0x369")];
        callbacks["clearSkins"]();
        css[_0x26ae("0x4cd")]();
        flushAndFail();
      }, false);
      window["addEventListener"](_0x26ae("0x510"), function() {
        render({
          "alive" : true,
          "state" : 1
        });
        flushAndFail();
      }, false);
      window[_0x26ae("0x6d")](_0x26ae("0x511"), function() {
        render({
          "alive" : false,
          "state" : 2,
          "color" : 0,
          "hash" : 0
        });
        flushAndFail();
      }, false);
      window[_0x26ae("0x6d")](_0x26ae("0x512"), function() {
        settings[_0x26ae("0x4e5")] = false;
        settings[_0x26ae("0xf7")] = 3;
        settings[_0x26ae("0x52")] = 0;
        settings[_0x26ae("0x50")] = 0;
        dataPlus[0] = 3;
        self[_0x26ae("0xe7")](dataPlus);
      }, false);
      window[_0x26ae("0x6d")](_0x26ae("0x4a"), function() {
        settings["alive"] = false;
        settings[_0x26ae("0xf7")] = 4;
        settings[_0x26ae("0x52")] = 0;
        settings[_0x26ae("0x50")] = 0;
        settings[_0x26ae("0x36d")] = "";
        dataPlus[0] = 3;
        self[_0x26ae("0xe7")](dataPlus);
      }, false);
      (function() {
        let object = create(_0x26ae("0x513"), {
          "id" : _0x26ae("0x514"),
          "type" : _0x26ae("0x515"),
          "placeholder" : M[_0x26ae("0x516")],
          "maxlength" : "20"
        });
        object[_0x26ae("0x171")] = localStorage[_0x26ae("0xdb")](_0x26ae("0x508")) || "VANILLA";
        object["addEventListener"](_0x26ae("0x3a3"), function(PL$103) {
          PL$103[_0x26ae("0x3a4")]["type"] = _0x26ae("0x308");
          PL$103[_0x26ae("0x3a4")][_0x26ae("0x35c")]["color"] = "darkgreen";
        }, false);
        object[_0x26ae("0x6d")](_0x26ae("0x517"), function(canCreateDiscussions) {
          canCreateDiscussions[_0x26ae("0x3a4")][_0x26ae("0x65")] = _0x26ae("0x515");
          canCreateDiscussions[_0x26ae("0x3a4")][_0x26ae("0x35c")]["color"] = null;
        }, false);
        object[_0x26ae("0x6d")]("change", function(default_maximize) {
          let BROWSER_ENGINES = default_maximize[_0x26ae("0x3a4")][_0x26ae("0x171")][_0x26ae("0x186")](":");
          let value = BROWSER_ENGINES[0] || _0x26ae("0x357");
          let datum = BROWSER_ENGINES[1] || "";
          let _0x4509c4 = settings[_0x26ae("0x4df")] !== value;
          settings[_0x26ae("0x4df")] = value;
          default_maximize[_0x26ae("0x3a4")]["value"] = value;
          localStorage[_0x26ae("0x10d")](_0x26ae("0x508"), value);
          if (datum) {
            localStorage[_0x26ae("0x10d")](_0x26ae("0x518"), datum);
          }
          if (_0x4509c4) {
            window[_0x26ae("0xbb")](-551928355, value);
            dataPlus[0] = 4;
            self[_0x26ae("0xe7")](dataPlus);
            css["clear"]();
            flushAndFail();
          }
        }, false);
        settings["roomId"] = object[_0x26ae("0x171")];
        target[_0x26ae("0x3e5")][_0x26ae("0x96")](_0x26ae("0x3a7"))["appendChild"](object);
      })();
      (function() {
        function handler(data) {
          try {
            returnStyles[_0x26ae("0x35c")][_0x26ae("0x4bb")] = _0x26ae("0x4bc");
            if (data) {
              data[_0x26ae("0x171")] = "";
            }
            let position = !data;
            tween[_0x26ae("0x51d")](position);
          } catch (_0xb5c333) {
          }
        }
        player[_0x26ae("0x71")]("afterend", _0x26ae("0x519"));
        let returnStyles = document[_0x26ae("0x96")](_0x26ae("0x51a"));
        let el = returnStyles[_0x26ae("0x96")](_0x26ae("0x51b"));
        let data = returnStyles[_0x26ae("0x96")](_0x26ae("0x51c"));
        let array = [];
        let i = 0;
        callbacks[_0x26ae("0x51e")](el);
        el["addEventListener"]("click", function(canCreateDiscussions) {
          let oldValue = canCreateDiscussions[_0x26ae("0x3a4")][_0x26ae("0x428")](_0x26ae("0x51f"));
          if (oldValue) {
            callbacks[_0x26ae("0x520")](data, oldValue);
          }
        }, false);
        data[_0x26ae("0x6d")](_0x26ae("0x164"), (canCreateDiscussions) => {
          switch(canCreateDiscussions[_0x26ae("0x371")]) {
            case 38:
              if (array[_0x26ae("0xc")]) {
                data[_0x26ae("0x171")] = array[i];
                i = Math[_0x26ae("0x2c")](++i, array[_0x26ae("0xc")] - 1);
              }
              break;
            case 40:
              if (i > 0) {
                i = Math["max"](--i, 0);
                data["value"] = array[i];
              }
          }
        });
        window[_0x26ae("0x6d")](_0x26ae("0x521"), function() {
          returnStyles["style"][_0x26ae("0x4bb")] = _0x26ae("0x4c7");
          data[_0x26ae("0x3a3")]();
          tween[_0x26ae("0x522")]();
        }, false);
        window[_0x26ae("0x6d")](_0x26ae("0x523"), fn(function(event) {
          if (event = event || data[_0x26ae("0x171")], 0 == /^\s*$/[_0x26ae("0x230")](settings[_0x26ae("0x4e0")])) {
            if (event) {
              if (self[_0x26ae("0x524")](event)) {
                tween[_0x26ae("0x50e")](settings[_0x26ae("0x4e0")], event);
                i = 0;
                let trigger = array[_0x26ae("0xb")](event);
                if (trigger > 0) {
                  array = array[_0x26ae("0x4be")](trigger, 1)[_0x26ae("0x525")](array);
                } else {
                  if (!~trigger) {
                    array[_0x26ae("0x8")](event);
                    if (array[_0x26ae("0xc")] > 5) {
                      array = array[_0x26ae("0xb9")](0, 5);
                    }
                  }
                }
              }
            } else {
              tween["pullChat"]();
            }
          }
          handler(true);
        }, 500), false);
        window[_0x26ae("0x6d")](_0x26ae("0x526"), handler, false);
        target["on"](_0x26ae("0x72"), handler);
        player[_0x26ae("0x71")]("afterend", '<div class="chat-window"><div id="service-message-area"><div class="service-message server-closed"><div class="left-panel"><div class="b-icon-svg b-icon-robot"></div></div><div class="right-panel">' + (_0x26ae("0x527") + M[_0x26ae("0x528")] + _0x26ae("0x46d")) + _0x26ae("0x529") + (_0x26ae("0x527") + M["serverConnected"] + _0x26ae("0x46d")) + '</div></div><div class="service-message need-update"><div class="left-panel"><div class="b-icon-svg b-icon-warning"></div></div><div class="right-panel">' + 
        (_0x26ae("0x527") + M[_0x26ae("0x4cc")] + _0x26ae("0x46d")) + _0x26ae("0x52a"));
        element = document["querySelector"](_0x26ae("0x52b"));
        _0x10f327 = element[_0x26ae("0x96")](_0x26ae("0x52c"));
        PL$35 = element[_0x26ae("0x96")](_0x26ae("0x52d"));
        _0x47110f = element[_0x26ae("0x96")](_0x26ae("0x52e"));
        options = element["querySelector"](".server-closed");
        params0 = element["querySelector"](_0x26ae("0x52f"));
        element[_0x26ae("0x6d")]("wheel", function(canCreateDiscussions) {
          canCreateDiscussions[_0x26ae("0x530")]();
        }, false);
      })();
    }
    function update(y2, t) {
      function replaceDomain2Ip() {
        numKeysDeleted = .023 * (x2 = 270 * tagOrShortcut | 0);
        contentsTransformOrigin = (.085 * x2 | 0) + _0x4d79ef[_0x26ae("0x314")];
        height = (2 * numKeysDeleted | 0) + _0x4d79ef[_0x26ae("0x314")];
        a[_0x26ae("0x189")] = b[_0x26ae("0x189")] = x2;
        a[_0x26ae("0x18b")] = b[_0x26ae("0x18b")] = x2;
        onSizeChange = 14 * tagOrShortcut | 0;
        _onDelete = 14 * tagOrShortcut | 0;
        extend();
        style[_0x26ae("0x196")](a, 0, 0);
      }
      function extend() {
        let i;
        let j;
        let xscale = names[0]["length"];
        let l = names[_0x26ae("0xc")];
        let rotation = a[_0x26ae("0x189")] / xscale;
        let e = a["height"] / l;
        if (currentSubwiki) {
          value = _0x26ae("0x534");
          userOpt = _0x26ae("0x535");
        } else {
          value = _0x26ae("0x536");
          userOpt = "aqua";
        }
        options[_0x26ae("0x30b")] = _0x26ae("0x537");
        options[_0x26ae("0x332")](0, 0, a[_0x26ae("0x189")], a[_0x26ae("0x18b")]);
        options["fillRect"](0, 0, a[_0x26ae("0x189")], a[_0x26ae("0x18b")]);
        options["strokeWidth"] = 1;
        options[_0x26ae("0x538")] = "rgba(100,100,100, 0.4)";
        options["strokeRect"](rotation, e, a["width"] - 2 * rotation, a[_0x26ae("0x18b")] - 2 * e);
        options[_0x26ae("0x539")](2 * rotation, 2 * e, a[_0x26ae("0x189")] - 4 * rotation, a[_0x26ae("0x18b")] - 4 * e);
        options[_0x26ae("0x319")] = _0x26ae("0x33d");
        options[_0x26ae("0x31b")] = _0x26ae("0x31c");
        options[_0x26ae("0x172")] = (x2 * (1 / 13) | 0) + _0x4d79ef[_0x26ae("0x314")];
        options["fillStyle"] = value;
        i = 0;
        for (; i < l; i++) {
          j = 0;
          for (; j < xscale; j++) {
            options[_0x26ae("0x30b")] = 2 === i && 2 === j ? userOpt : value;
            options["fillText"](names[j][i], i * rotation + .5 * rotation, j * e + .5 * e);
          }
        }
      }
      function min(len, x, data) {
        return len + (x - len) * data;
      }
      function renderText(a) {
        w = b[_0x26ae("0x189")] * a["x"];
        width = b["height"] * a["y"];
        a[_0x26ae("0x53a")] = min(a[_0x26ae("0x53a")] || 0, w, .1);
        a[_0x26ae("0x53b")] = min(a[_0x26ae("0x53b")] || 0, width, .1);
        w = ~~a["tempX"] - .5;
        width = ~~a["tempY"] - .5;
        style["beginPath"]();
        style[_0x26ae("0x30d")](w, width, .8 * numKeysDeleted, 0, 6.283185307179586, 1);
        style[_0x26ae("0x310")]();
        style["fillText"](a[_0x26ae("0x4e0")], w, width - 18);
      }
      function render(p) {
        if (p < pos || !geometry[_0x26ae("0x18c")]) {
          return;
        }
        pos = p + termLen;
        let ratio = (vertices["x"] - geometry["x1"]) / geometry[_0x26ae("0x189")];
        let r = (vertices["y"] - geometry["y1"]) / geometry[_0x26ae("0x18b")];
        if (p >= n) {
          Math["sendCoord"](ratio, r);
          n = p + 250;
        }
        if (_0x4d79ef["optShowMinimap"]) {
          style[_0x26ae("0x332")](0, 0, b["width"], b[_0x26ae("0x18b")]);
          style["drawImage"](a, 0, 0);
          style[_0x26ae("0x319")] = _0x26ae("0x33d");
          style[_0x26ae("0x31b")] = _0x26ae("0x35f");
          style["font"] = height;
          style[_0x26ae("0x30b")] = _0x26ae("0x53c");
          style["strokeStyle"] = _0x26ae("0x53d");
          Math[_0x26ae("0x4ce")](renderText);
          w = b[_0x26ae("0x189")] * ratio;
          width = b[_0x26ae("0x18b")] * r;
          vertices[_0x26ae("0x53a")] = min(vertices[_0x26ae("0x53a")] || 0, w, .1);
          vertices[_0x26ae("0x53b")] = min(vertices["tempY"] || 0, width, .1);
          w = ~~vertices[_0x26ae("0x53a")] - .5;
          width = ~~vertices[_0x26ae("0x53b")] - .5;
          style[_0x26ae("0x316")] = 1;
          style[_0x26ae("0x538")] = "rgba(0, 255, 169, 0.32)";
          style[_0x26ae("0x30a")]();
          style[_0x26ae("0x53e")](w, 0);
          style[_0x26ae("0x32d")](w, b[_0x26ae("0x18b")]);
          style[_0x26ae("0x53e")](0, width);
          style[_0x26ae("0x32d")](b[_0x26ae("0x189")], width);
          style["stroke"]();
          style[_0x26ae("0x30b")] = _0x26ae("0x53f");
          style[_0x26ae("0x30a")]();
          style["arc"](w, width, numKeysDeleted, 0, 6.283185307179586, true);
          style["fill"]();
          if (vertices["deadX"]) {
            style[_0x26ae("0x319")] = _0x26ae("0x33d");
            style[_0x26ae("0x31b")] = _0x26ae("0x31c");
            style[_0x26ae("0x172")] = contentsTransformOrigin;
            style[_0x26ae("0x30b")] = "rgba(194, 5, 82, 0.9)";
            style["fillText"]("\u25c9", vertices[_0x26ae("0x540")], vertices[_0x26ae("0x541")]);
          }
        }
      }
      let b = document[_0x26ae("0x30")](_0x26ae("0x312"));
      let style = b[_0x26ae("0x10e")]("2d");
      let a = document[_0x26ae("0x30")]("canvas");
      let options = a["getContext"]("2d");
      let Math = new run(y2);
      let onSizeChange = 14;
      let _onDelete = 14;
      let config = data[_0x26ae("0xba")];
      let geometry = data[_0x26ae("0xba")]["map"];
      let vertices = data[_0x26ae("0xba")][_0x26ae("0x531")];
      let _0x4d79ef = data[_0x26ae("0xba")]["settings"];
      let tagOrShortcut = config[_0x26ae("0x195")][_0x26ae("0x362")][_0x26ae("0x532")] || 1;
      let _0x380a9f = false;
      let w = 0;
      let width = 0;
      let termLen = 33;
      let x2 = 270;
      let numKeysDeleted = .023 * x2;
      let contentsTransformOrigin = (.085 * x2 | 0) + _0x4d79ef[_0x26ae("0x314")];
      let height = (2 * numKeysDeleted | 0) + _0x4d79ef[_0x26ae("0x314")];
      let pos = 0;
      let n = 0;
      let value = "";
      let userOpt = "";
      let currentSubwiki = config[_0x26ae("0x195")]["customBackground"][_0x26ae("0x533")]()[_0x26ae("0xaa")];
      let names = [["A1", "B1", "C1", "D1", "E1"], ["A2", "B2", "C2", "D2", "E2"], ["A3", "B3", "C3", "D3", "E3"], ["A4", "B4", "C4", "D4", "E4"], ["A5", "B5", "C5", "D5", "E5"]];
      this[_0x26ae("0x94")] = function() {
        render(Date[_0x26ae("0x2e")]());
        if (_0x4d79ef[_0x26ae("0x157")]) {
          t[_0x26ae("0x196")](b, onSizeChange, _onDelete);
        }
      };
      data[_0x26ae("0xba")][_0x26ae("0x6d")](_0x26ae("0x512"), function(canCreateDiscussions) {
        let r = (vertices["x"] - geometry["x1"]) / geometry[_0x26ae("0x189")];
        let s = (vertices["y"] - geometry["y1"]) / geometry[_0x26ae("0x18b")];
        vertices[_0x26ae("0x540")] = b["width"] * r;
        vertices[_0x26ae("0x541")] = b[_0x26ae("0x18b")] * s;
      }, false);
      data["vanilla"][_0x26ae("0x6d")]("disconnect", function(canCreateDiscussions) {
        vertices["deadX"] = vertices[_0x26ae("0x541")] = 0;
      }, false);
      config[_0x26ae("0x6d")](_0x26ae("0x363"), function(tagsWithShortcuts) {
        tagOrShortcut = tagsWithShortcuts[_0x26ae("0x532")];
        replaceDomain2Ip();
      });
      data[_0x26ae("0xba")][_0x26ae("0x6d")](-743589170, function(canCreateDiscussions) {
        let loadedSubwikis = canCreateDiscussions[0];
        if (_0x26ae("0x3d9") === canCreateDiscussions[1] && "" === config[_0x26ae("0x195")][_0x26ae("0x3e4")]["getSelectedTheme"]()["type"]) {
          currentSubwiki = loadedSubwikis[_0x26ae("0x3d9")];
          extend();
        }
        _0x380a9f = _0x26ae("0x542") !== loadedSubwikis[_0x26ae("0x44")];
      }, false);
      config["addEventListener"](_0x26ae("0x325"), function(loadedSubwikis) {
        currentSubwiki = loadedSubwikis[_0x26ae("0xaa")];
        extend();
      });
      replaceDomain2Ip();
    }
    function init(constructor, proto) {
      function init(flightPhase) {
        let _0x2dc721 = flightPhase || localStorage[_0x26ae("0xdb")](_0x26ae("0x508"));
        if (_0x2dc721) {
          let reservedIndices = _0x2dc721[_0x26ae("0x231")](/\w+(?=[-_+]?)/);
          if (reservedIndices) {
            for (let i of Object[_0x26ae("0xf")](obj)) {
              if (i === reservedIndices[0]) {
                v = obj[i];
                break;
              }
            }
          }
        }
        next(v[_0x26ae("0x551")], function callback(params, value) {
          if (_0x26ae("0x57") === params["type"]) {
            path[2][2] = "";
            props[_0x26ae("0x189")] = value[_0x26ae("0x189")];
            props[_0x26ae("0x18b")] = value[_0x26ae("0x18b")];
            settingHandler["drawImage"](value, 0, 0);
            close();
          } else {
            props["width"] = props[_0x26ae("0x18b")] = 1;
            setTimeout(next, 3E4, v[_0x26ae("0x551")], callback);
          }
        });
      }
      function createUserStatus(value) {
        self[_0x26ae("0x552")] = value ? global : kw;
      }
      function redraw() {
        let buckets = attrs["width"] * (1 / 11) | 0;
        let ry = 2 * buckets / Math[_0x26ae("0x2c")](props["width"], props[_0x26ae("0x18b")]);
        let rx = props[_0x26ae("0x189")] * ry * v[_0x26ae("0x33b")];
        let conditionVariable = props["height"] * ry * v[_0x26ae("0x33b")];
        let key = attrs["x1"] + .5 * attrs["width"];
        let GET_AUTH_URL_TIMEOUT = attrs["y1"] + .5 * attrs[_0x26ae("0x18b")];
        let siteName = 6 * value >> 1;
        proto[_0x26ae("0x175")]();
        proto[_0x26ae("0x30b")] = self[_0x26ae("0x552")];
        proto[_0x26ae("0x30a")]();
        proto["arc"](key, GET_AUTH_URL_TIMEOUT, buckets + siteName, 0, 6.283185307179586, false);
        proto[_0x26ae("0x310")]();
        proto["beginPath"]();
        proto[_0x26ae("0x30d")](key, GET_AUTH_URL_TIMEOUT, buckets, 0, 6.283185307179586, false);
        proto[_0x26ae("0x30e")]();
        proto[_0x26ae("0x553")] = .2;
        proto[_0x26ae("0x554")] = _0x26ae("0x555");
        if (_0x26ae("0x4bc") !== v[_0x26ae("0x556")]) {
          proto[_0x26ae("0x30b")] = v[_0x26ae("0x556")] || proto["fillStyle"];
          proto["fill"]();
          proto[_0x26ae("0x554")] = "source-over";
        }
        proto[_0x26ae("0x196")](props, key - .5 * rx * v[_0x26ae("0x557")], GET_AUTH_URL_TIMEOUT - .5 * conditionVariable * v[_0x26ae("0x558")], rx, conditionVariable);
        proto[_0x26ae("0x30f")]();
      }
      function startDrag() {
        proto[_0x26ae("0x538")] = self[_0x26ae("0x552")];
        proto["lineWidth"] = value;
        proto[_0x26ae("0x539")](attrs["x1"], attrs["y1"], attrs[_0x26ae("0x189")], attrs["height"]);
      }
      function draw() {
        proto[_0x26ae("0x538")] = self[_0x26ae("0x552")];
        proto[_0x26ae("0x316")] = value;
        proto[_0x26ae("0x30a")]();
        proto[_0x26ae("0x559")](attrs["x1"], attrs["y1"], attrs[_0x26ae("0x189")], attrs[_0x26ae("0x18b")]);
        i = 0;
        for (; ++i !== steps;) {
          top = attrs["x1"] + t * i;
          proto[_0x26ae("0x53e")](top, attrs["y1"]);
          proto["lineTo"](top, attrs["y2"]);
        }
        i = 0;
        for (; ++i !== k;) {
          x1 = attrs["y1"] + r * i;
          proto["moveTo"](attrs["x1"], x1);
          proto["lineTo"](attrs["x2"], x1);
        }
        proto[_0x26ae("0x55a")]();
      }
      function updateChart() {
        y = attrs["x1"] + .5 * t;
        cx = attrs["y1"] + .5 * r;
        delta = .5 * lineHeight;
        i = 0;
        for (; k > i; i++) {
          x1 = cx + r * i;
          j = 0;
          for (; steps > j; j++) {
            top = y + t * j;
            proto[_0x26ae("0x196")](a[i * k + j], top - delta, x1 - delta, lineHeight, lineHeight);
          }
        }
        redraw();
      }
      function close() {
        let b;
        let x;
        let l;
        let costSum = ~~(screen["width"] / 7.6180339887);
        format("" + (costSum + cost[_0x26ae("0x314")]), function() {
          i = 0;
          for (; k > i; i++) {
            l = i * k;
            j = 0;
            for (; steps > j; j++) {
              if (void 0 == a[l + j]) {
                b = document[_0x26ae("0x30")](_0x26ae("0x312"));
                x = b["getContext"]("2d");
                a["push"](b);
                X["push"](x);
              } else {
                b = a[l + j];
                x = X[l + j];
              }
              x[_0x26ae("0x172")] = costSum + cost[_0x26ae("0x314")];
              b["width"] = b["height"] = 0 | Math[_0x26ae("0x35a")](x[_0x26ae("0x315")]("A4")[_0x26ae("0x189")]);
              x[_0x26ae("0x172")] = costSum + cost[_0x26ae("0x314")];
              x[_0x26ae("0x30b")] = self[_0x26ae("0x552")];
              x[_0x26ae("0x319")] = _0x26ae("0x33d");
              x[_0x26ae("0x31b")] = _0x26ae("0x31c");
              x[_0x26ae("0x320")](path[i][j], b["width"] >> 1, b[_0x26ae("0x18b")] >> 1);
            }
          }
        });
      }
      let y;
      let cx;
      let t;
      let r;
      let lineHeight;
      let top;
      let x1;
      let i;
      let j;
      let delta;
      let props = document["createElement"]("canvas");
      let settingHandler = props[_0x26ae("0x10e")]("2d");
      let value = 15;
      let global = _0x26ae("0x546");
      let kw = _0x26ae("0x547");
      let doc = data["vanilla"];
      let attrs = data[_0x26ae("0xba")][_0x26ae("0x548")];
      let cost = data["vanilla"]["settings"];
      let self = (attrs[_0x26ae("0x18a")], doc[_0x26ae("0x303")]);
      let prototype = new Date;
      let num_elements = prototype["toLocaleString"]("en", {
        "month" : "short"
      });
      let path = [["A1", "B1", "C1", "D1", "E1"], ["A2", "B2", "C2", "D2", "E2"], ["A3", "B3", "C3", "D3", "E3"], ["A4", "B4", "C4", "D4", "E4"], ["A5", "B5", "C5", "D5", "E5"]];
      let steps = path[0]["length"];
      let k = path["length"];
      let a = [];
      let X = [];
      let obj = {
        "GCA" : {
          "imgURL" : tarpitHost + _0x26ae("0x549"),
          "bgColor" : "",
          "scale" : .78,
          "offsetX" : 1,
          "offsetY" : 1,
          "edgingWidth" : 12
        },
        "BOF" : {
          "imgURL" : tarpitHost + "/emblem/bof_clan.png",
          "bgColor" : "",
          "scale" : 1.02,
          "offsetX" : 1,
          "offsetY" : 1,
          "edgingWidth" : 12
        },
        "EC" : {
          "imgURL" : tarpitHost + _0x26ae("0x54a"),
          "bgColor" : "",
          "scale" : 1.01,
          "offsetX" : 1,
          "offsetY" : 1,
          "edgingWidth" : 12
        },
        "SF" : {
          "imgURL" : tarpitHost + "/emblem/sf_clan.png",
          "bgColor" : "",
          "scale" : 1.05,
          "offsetX" : .98,
          "offsetY" : 1,
          "edgingWidth" : 12
        }
      };
      let map = {
        "dev" : {
          "imgURL" : tarpitHost + _0x26ae("0x54b"),
          "bgColor" : "",
          "scale" : 1,
          "offsetX" : 1,
          "offsetY" : 1,
          "edgingWidth" : 12
        },
        "default" : {
          "imgURL" : tarpitHost + _0x26ae("0x54c"),
          "bgColor" : _0x26ae("0x4bc"),
          "scale" : 1,
          "offsetX" : 1,
          "offsetY" : 1,
          "edgingWidth" : 6
        },
        "Feb" : {
          23 : {
            "imgURL" : tarpitHost + _0x26ae("0x54d"),
            "bgColor" : "",
            "scale" : 1,
            "offsetX" : 1,
            "offsetY" : 1,
            "edgingWidth" : 12
          }
        },
        "Apr" : {
          12 : {
            "imgURL" : tarpitHost + _0x26ae("0x54e"),
            "bgColor" : _0x26ae("0x4bc"),
            "scale" : 1,
            "offsetX" : 1,
            "offsetY" : 1,
            "edgingWidth" : 6
          }
        },
        "May" : {
          5 : {
            "imgURL" : tarpitHost + _0x26ae("0x54f"),
            "bgColor" : "none",
            "scale" : 1.06,
            "offsetX" : 1,
            "offsetY" : 1,
            "edgingWidth" : 6
          },
          9 : {
            "imgURL" : tarpitHost + _0x26ae("0x550"),
            "bgColor" : "",
            "scale" : 1,
            "offsetX" : 1,
            "offsetY" : 1,
            "edgingWidth" : 12
          }
        }
      };
      let v = map["default"];
      var row_prefix_len;
      if (map[num_elements] && map[num_elements][prototype["getDate"]()]) {
        v = map[num_elements][prototype[_0x26ae("0x55b")]()];
      }
      init();
      doc["addEventListener"](-551928355, init, false);
      doc[_0x26ae("0x6d")]("changeMapMetric", function() {
        t = attrs[_0x26ae("0x189")] / steps;
        r = attrs[_0x26ae("0x18b")] / k;
        lineHeight = Math[_0x26ae("0x2b")](t, r) / 2.6180339887;
      });
      data["vanilla"][_0x26ae("0x6d")](-743589170, function(canCreateDiscussions) {
        let result = canCreateDiscussions[0];
        if (_0x26ae("0x3d9") === canCreateDiscussions[1] && "" === doc[_0x26ae("0x195")][_0x26ae("0x3e4")][_0x26ae("0x533")]()[_0x26ae("0x65")]) {
          createUserStatus(result[_0x26ae("0x3d9")]);
          close();
        }
      }, false);
      doc[_0x26ae("0x6d")](_0x26ae("0x325"), function(classes) {
        self["sectorColor"] = classes[_0x26ae("0x55c")] || (eventsToRemember[_0x26ae("0x545")](_0x26ae("0xaa")) ? global : kw);
        close();
      });
      createUserStatus(doc[_0x26ae("0x55d")](_0x26ae("0x3d9")));
      cost[_0x26ae("0x55e")] = (row_prefix_len = "showSectors", parseInt(localStorage[_0x26ae("0xdb")](row_prefix_len), 10) || 0);
      close();
      doc["backgroundDrawCallbacks"][_0x26ae("0x6")](function() {
        if (cost["showSectors"] && doc[_0x26ae("0x548")][_0x26ae("0x18c")]) {
          switch(cost["showSectors"]) {
            case 1:
              return startDrag();
            case 2:
              return updateChart();
            case 3:
              return startDrag(), updateChart();
            default:
              draw();
              updateChart();
          }
        }
      });
    }
    function renderChart(results, options) {
      function calculateValuesExtent(shouldBeLoved) {
        mergeLaunches = shouldBeLoved ? love : unlove;
      }
      function mousemove(b) {
        if (!(b["isVirus"] || (_0x2b64c5 = a[_0x26ae("0x4f")] / b[_0x26ae("0x4f")]) > 4.6)) {
          if (_0x2b64c5 >= 2.31886) {
            options["strokeStyle"] = _0x26ae("0x561");
          } else {
            if (_0x2b64c5 >= 1.633) {
              options["strokeStyle"] = "#22d822";
            } else {
              if (_0x2b64c5 >= 1.15) {
                options[_0x26ae("0x538")] = _0x26ae("0x562");
              } else {
                if (_0x2b64c5 <= .612369871402327) {
                  options[_0x26ae("0x538")] = _0x26ae("0x563");
                } else {
                  if (!(_0x2b64c5 < .8695652173913043)) {
                    return;
                  }
                  options[_0x26ae("0x538")] = _0x26ae("0x564");
                }
              }
            }
          }
          options[_0x26ae("0x30a")]();
          options[_0x26ae("0x30d")](b["x"], b["y"], b[_0x26ae("0x4f")] + 15, 0, 6.283185307179586, 0);
          options[_0x26ae("0x55a")]();
        }
      }
      let a = {};
      let _0x2b64c5 = 0;
      let love = _0x26ae("0x55f");
      let unlove = _0x26ae("0x560");
      let mergeLaunches = unlove;
      let klass = data[_0x26ae("0xba")];
      let m = klass[_0x26ae("0xfa")];
      let xy = klass[_0x26ae("0x531")];
      let vec2_scale = klass[_0x26ae("0x195")][_0x26ae("0x362")];
      let _0x3d007b = klass[_0x26ae("0x304")];
      let svgRoot = klass["cellsStore"];
      let USUAL_WIDTH = 0;
      let ow = 0;
      document[_0x26ae("0x6d")](_0x26ae("0x565"), function(aabb2_2) {
        USUAL_WIDTH = aabb2_2[_0x26ae("0x566")] * vec2_scale["qualityRatio"] - .5 * results[_0x26ae("0x189")];
        ow = aabb2_2[_0x26ae("0x567")] * vec2_scale[_0x26ae("0x35b")] - .5 * results[_0x26ae("0x18b")];
      }, false);
      data["vanilla"][_0x26ae("0x6d")](-743589170, function(canCreateDiscussions) {
        let _0x2dc721 = canCreateDiscussions[0];
        if (_0x26ae("0x3d9") === canCreateDiscussions[1]) {
          calculateValuesExtent(_0x2dc721["blackTheme"]);
        }
      }, false);
      calculateValuesExtent(klass[_0x26ae("0x55d")]("blackTheme"));
      klass[_0x26ae("0x568")] = (_0x26ae("0x568"), parseInt(localStorage["getItem"](_0x26ae("0x568")), 10) || 0);
      klass[_0x26ae("0x302")]["add"](function() {
        if (klass[_0x26ae("0x568")] && _0x3d007b[_0x26ae("0x53")]()) {
          a = _0x3d007b[_0x26ae("0x51")]();
          options[_0x26ae("0x31d")] = _0x26ae("0x569");
          options[_0x26ae("0x33c")] = _0x26ae("0x56a");
          options["lineWidth"] = 2;
          options[_0x26ae("0x538")] = _0x26ae("0x561");
          if (m[_0x26ae("0x151")]) {
            _0x3d007b[_0x26ae("0x4e")](function(a) {
              options[_0x26ae("0x30a")]();
              options[_0x26ae("0x53e")](a["x"], a["y"]);
              options["lineTo"](xy["x"] + USUAL_WIDTH / m["scale"], xy["y"] + ow / m[_0x26ae("0x33b")]);
              options["stroke"]();
            });
          }
          options[_0x26ae("0x538")] = mergeLaunches;
          options[_0x26ae("0x30a")]();
          options["arc"](a["x"], a["y"], a["size"] + 760, 0, 6.283185307179586, false);
          options[_0x26ae("0x55a")]();
          options[_0x26ae("0x553")] = .75;
          options[_0x26ae("0x316")] = 6;
          svgRoot[_0x26ae("0x4e")](mousemove);
          options[_0x26ae("0x553")] = 1;
        }
      });
    }
    function add(key, value, type) {
      type[_0x26ae("0x65")];
      if (value) {
        value(type, key);
      }
    }
    function next(currentState, stack) {
      let result = document[_0x26ae("0x30")](_0x26ae("0x31"));
      return result[_0x26ae("0x3a")] = result[_0x26ae("0x56b")] = add[_0x26ae("0x16")](null, result, stack), result[_0x26ae("0x33")] = currentState + "?" + (Date[_0x26ae("0x2e")]() / 1E3 / 60 | 0), result;
    }
    function draw(n, c) {
      function transform(from) {
        return from < 10 ? "0" + from : from;
      }
      function translate(s) {
        return String(s)[_0x26ae("0x41")](/(\d)(?=(\d{3})+(\D|$))/g, _0x26ae("0x56d"));
      }
      function hide(text, position, index, count, a, e, b, c) {
        let i = .5 * (index < count ? index : count);
        return e = e || a, b = b || a, c = c || e, i < a && (a = i), i < e && (e = i), i < b && (b = i), i < c && (c = i), styles[_0x26ae("0x30a")](), styles[_0x26ae("0x53e")](text + a, position), styles[_0x26ae("0x56e")](text + index, position, text + index, position + count, e), styles[_0x26ae("0x56e")](text + index, position + count, text, position + count, b), styles["arcTo"](text, position + count, text, position, c), styles[_0x26ae("0x56e")](text, position, text + index, position, a), styles[_0x26ae("0x32e")](), 
        styles;
      }
      function render() {
        let lastviewmatrix = obj[_0x26ae("0x189")];
        let maxdim = obj[_0x26ae("0x18b")];
        let iNew = 25 - maxdim / 2;
        let newx = (template[_0x26ae("0x189")] - 10) / obj[_0x26ae("0x53")];
        let lines = frames["playerCellsMass"][_0x26ae("0xc")];
        let end_perspective = 0;
        let i = 0;
        let text = 0;
        let perspective = 0;
        var dataWorkedMinutes;
        styles[_0x26ae("0x332")](0, 0, template[_0x26ae("0x189")], template[_0x26ae("0x18b")]);
        styles[_0x26ae("0x30b")] = "rgba(1, 0, 6, 0.4)";
        styles["font"] = "22" + _0x670c00[_0x26ae("0x314")];
        styles[_0x26ae("0x319")] = "left";
        styles["textBaseline"] = "middle";
        if (rotationAngleAfter || !_0x4a395b[_0x26ae("0x56f")]) {
          end_perspective = 5 + lastviewmatrix;
          i = iNew + maxdim / 2;
          hide(0, 0, template[_0x26ae("0x189")], 50, 4)["fill"]();
          styles[_0x26ae("0x196")](obj[_0x26ae("0x31")], obj[_0x26ae("0x570")][5], 0, lastviewmatrix, maxdim, 5 + 0 * newx, iNew, lastviewmatrix, maxdim);
          styles[_0x26ae("0x196")](obj[_0x26ae("0x31")], obj[_0x26ae("0x570")][2], 0, lastviewmatrix, maxdim, 5 + 1 * newx, iNew, lastviewmatrix, maxdim);
          styles[_0x26ae("0x196")](obj[_0x26ae("0x31")], obj[_0x26ae("0x570")][6], 0, lastviewmatrix, maxdim, 5 + 2 * newx, iNew, lastviewmatrix, maxdim);
          styles["drawImage"](obj[_0x26ae("0x31")], obj["num"][0], 0, lastviewmatrix, maxdim, 5 + 3 * newx, iNew, lastviewmatrix, maxdim);
          styles["drawImage"](obj[_0x26ae("0x31")], obj[_0x26ae("0x570")][3], 0, lastviewmatrix, maxdim, 5 + 4 * newx, iNew, lastviewmatrix, maxdim);
          styles[_0x26ae("0x196")](obj[_0x26ae("0x31")], obj["num"][8], 0, lastviewmatrix, maxdim, 5 + 5 * newx, iNew, lastviewmatrix, maxdim);
          styles["font"] = "20" + _0x670c00[_0x26ae("0x314")];
          styles["fillStyle"] = _0x26ae("0x571");
          styles[_0x26ae("0x320")](" " + translate(value[_0x26ae("0x572")]), end_perspective + 0 * newx, i);
          styles[_0x26ae("0x320")](" " + translate(value[_0x26ae("0x1a5")]), end_perspective + 1 * newx, i);
          styles[_0x26ae("0x320")](" " + translate(value[_0x26ae("0x1a7")]), end_perspective + 2 * newx, i);
          styles[_0x26ae("0x320")](" " + translate(value[_0x26ae("0x1a3")]), end_perspective + 3 * newx, i);
          styles[_0x26ae("0x320")](" " + transform((dataWorkedMinutes = value["timeAlive"]) / 3600 | 0) + ":" + transform(dataWorkedMinutes / 60 % 60 | 0) + ":" + transform(dataWorkedMinutes % 60 | 0), end_perspective + 4 * newx, i);
          styles[_0x26ae("0x320")](" " + width + " / " + frames[_0x26ae("0x339")], end_perspective + 5 * newx, i);
        } else {
          text = frames[_0x26ae("0x1a9")] >= 320 ? frames[_0x26ae("0x1a9")] / 16 | 0 : 0;
          perspective = styles[_0x26ae("0x315")]("\u2002" + (frames["playerMass"] + (text ? _0x26ae("0x573") + text : "")));
          end_perspective = template["width"] / 2 + lastviewmatrix / 2 + 5;
          i = 25;
          hide(template[_0x26ae("0x189")] / 2 + lastviewmatrix / 2, 4, perspective[_0x26ae("0x189")] + 20, 42, 20, 20, 20, 20)[_0x26ae("0x310")]();
          styles[_0x26ae("0x30a")]();
          styles["arc"](template["width"] / 2, i, 50 / 2.2, 0, 6.283185307179586, false);
          styles[_0x26ae("0x32e")]();
          styles[_0x26ae("0x30b")] = _0x26ae("0x574");
          styles[_0x26ae("0x538")] = [_0x26ae("0x575"), _0x26ae("0x576"), "#ed143d"][lines / 8 | 0];
          styles[_0x26ae("0x316")] = 3;
          styles["fill"]();
          styles[_0x26ae("0x55a")]();
          styles[_0x26ae("0x30b")] = "#cbcfd8";
          styles["fillText"]("\u2002" + frames[_0x26ae("0x1a9")], end_perspective, i);
          if (text) {
            perspective = styles[_0x26ae("0x315")]("\u2002" + frames[_0x26ae("0x1a9")]);
            styles[_0x26ae("0x320")](_0x26ae("0x573"), end_perspective + perspective[_0x26ae("0x189")], i);
            perspective = styles[_0x26ae("0x315")]("\u2002" + frames[_0x26ae("0x1a9")] + _0x26ae("0x573"));
            styles[_0x26ae("0x30b")] = "#2aabd2";
            styles[_0x26ae("0x320")](text, end_perspective + perspective[_0x26ae("0x189")], i);
          }
          styles[_0x26ae("0x30b")] = _0x26ae("0x577");
          styles["textAlign"] = _0x26ae("0x33d");
          styles[_0x26ae("0x320")](lines, template[_0x26ae("0x189")] / 2, i);
        }
      }
      function cb() {
        let balance = Date["now"]();
        let prevCharCode = 0;
        if (balance - default_fee >= amount && (default_fee = balance, render()), balance - startingBalance >= 1E3) {
          startingBalance = balance;
          monthsToShow[count++ % monthsToShow[_0x26ae("0xc")]] = height;
          width = height = 0;
          do {
            width = width + monthsToShow[prevCharCode];
          } while (++prevCharCode != monthsToShow[_0x26ae("0xc")]);
          width = width / monthsToShow[_0x26ae("0xc")] | 0;
        } else {
          height++;
        }
        c[_0x26ae("0x196")](template, .5 * n[_0x26ae("0x189")] - .5 * template[_0x26ae("0x189")] * equationString | 0, 14 * equationString | 0, template[_0x26ae("0x189")] * equationString | 0, template[_0x26ae("0x18b")] * equationString | 0);
      }
      let template = document[_0x26ae("0x30")](_0x26ae("0x312"));
      let styles = template[_0x26ae("0x10e")]("2d");
      let frames = data[_0x26ae("0xba")];
      let value = data["vanilla"][_0x26ae("0x56c")];
      let _0x4a395b = data[_0x26ae("0xba")][_0x26ae("0x531")];
      let _0x670c00 = data[_0x26ae("0xba")]["settings"];
      let localVarName = data["innerWidth"];
      let localVarMin = data[_0x26ae("0x361")];
      let localVarMax = 1;
      let equationString = 1;
      let obj = {
        "img" : null,
        "width" : 50,
        "height" : 40,
        "num" : [0, 50, 100, 150, 200, 250, 300, 350, 400],
        "count" : 6
      };
      let rotationAngleAfter = false;
      let amount = 250;
      let default_fee = 0;
      let monthsToShow = new Uint32Array(2);
      let count = 0;
      let startingBalance = 0;
      let height = 0;
      let width = 0;
      obj[_0x26ae("0x189")];
      obj["height"];
      template["width"];
      obj["count"];
      frames[_0x26ae("0x344")]["length"];
      template[_0x26ae("0x189")] = 138 * obj["count"];
      template["height"] = 50;
      frames[_0x26ae("0x6d")](_0x26ae("0x363"), function(equationStringSplit) {
        localVarName = equationStringSplit[_0x26ae("0x385")];
        localVarMin = equationStringSplit[_0x26ae("0x361")];
        localVarMax = equationStringSplit[_0x26ae("0x35b")];
        equationString = equationStringSplit[_0x26ae("0x532")];
      });
      frames["addEventListener"](_0x26ae("0x578"), function(rotationAngle) {
        let _0x2dc721 = rotationAngleAfter !== rotationAngle;
        rotationAngleAfter = rotationAngle;
        if (_0x2dc721) {
          render();
        }
      });
      obj["img"] = next(tarpitHost + _0x26ae("0x579"), function(toolTipTexts) {
        if (_0x26ae("0x57") === toolTipTexts["type"]) {
          frames[_0x26ae("0x57a")][_0x26ae("0x6")](cb);
        }
      });
    }
    function save() {
      function doSaveProject() {
        localStorage[_0x26ae("0x57c")] = JSON[_0x26ae("0x178")](obj);
      }
      function clone(layer, index, material) {
        if (obj[index]) {
          obj[index][_0x26ae("0x371")] = material[_0x26ae("0x371")];
          obj[index][_0x26ae("0x5ad")] = material[_0x26ae("0x5ae")]["toUpperCase"]();
          if (" " === obj[index][_0x26ae("0x5ad")]) {
            obj[index]["charRepresentation"] = _0x26ae("0x191");
          }
          layer[_0x26ae("0x171")] = obj[index]["charRepresentation"];
          doSaveProject();
        }
      }
      let base;
      let viewportCenter;
      let Error = null;
      let ns = _0x26ae("0x57b");
      let _0x546fda = data[_0x26ae("0xba")];
      let obj = _0x546fda[_0x26ae("0x57c")];
      let cacheNodeAttrs = translate({
        "ru" : {
          "feed" : _0x26ae("0x57d"),
          "macroFeed" : _0x26ae("0x57e"),
          "doubleSplit" : _0x26ae("0x57f"),
          "pause" : _0x26ae("0x580"),
          "toggleSectors" : _0x26ae("0x581"),
          "copyLeaderboard" : _0x26ae("0x582"),
          "showHints" : "\u041f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0438",
          "splitTo16" : _0x26ae("0x583"),
          "simpliDraw" : _0x26ae("0x584"),
          "homeTab" : _0x26ae("0x86"),
          "hotkeysTab" : _0x26ae("0x585"),
          "settingsTab" : "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438",
          "chatHistoryLimit" : _0x26ae("0x586"),
          "chatHideTimeout" : _0x26ae("0x587"),
          "fontSelect" : _0x26ae("0x588")
        },
        "en" : {
          "feed" : "Eject mass",
          "macroFeed" : _0x26ae("0x589"),
          "doubleSplit" : _0x26ae("0x58a"),
          "pause" : _0x26ae("0x58b"),
          "toggleSectors" : "Show sectors (4 in 1)",
          "copyLeaderboard" : "Copy leaderboard",
          "showHints" : _0x26ae("0x58c"),
          "splitTo16" : _0x26ae("0x58d"),
          "simpliDraw" : _0x26ae("0x58e"),
          "homeTab" : _0x26ae("0x87"),
          "hotkeysTab" : _0x26ae("0x88"),
          "settingsTab" : "Settings",
          "chatHistoryLimit" : _0x26ae("0x130"),
          "chatHideTimeout" : _0x26ae("0x58f"),
          "fontSelect" : _0x26ae("0x590")
        },
        "tr" : {
          "feed" : "Kitle \u00e7\u0131karma",
          "macroFeed" : _0x26ae("0x591"),
          "doubleSplit" : _0x26ae("0x592"),
          "pause" : "Pause",
          "toggleSectors" : "G\u00f6ster sekt\u00f6rler (4 i\u00e7inde 1)",
          "copyLeaderboard" : "Kopyala afi\u015f",
          "showHints" : _0x26ae("0x593"),
          "splitTo16" : _0x26ae("0x594"),
          "simpliDraw" : "Basitle\u015ftirilmi\u015f beraberlik",
          "homeTab" : "Genel",
          "hotkeysTab" : _0x26ae("0x8a"),
          "settingsTab" : "Ayarlar",
          "chatHistoryLimit" : "\u0130leti s\u0131n\u0131r\u0131",
          "chatHideTimeout" : _0x26ae("0x595"),
          "fontSelect" : _0x26ae("0x596")
        },
        "it" : {
          "feed" : "Espulsione massa",
          "macroFeed" : _0x26ae("0x597"),
          "doubleSplit" : _0x26ae("0x598"),
          "pause" : _0x26ae("0x599"),
          "toggleSectors" : "Mostra settori (4 in 1)",
          "copyLeaderboard" : _0x26ae("0x59a"),
          "showHints" : _0x26ae("0x59b"),
          "splitTo16" : _0x26ae("0x59c"),
          "simpliDraw" : _0x26ae("0x59d"),
          "homeTab" : "Base",
          "hotkeysTab" : _0x26ae("0x59e"),
          "settingsTab" : _0x26ae("0x59f"),
          "chatHistoryLimit" : "Limite messaggio",
          "chatHideTimeout" : _0x26ae("0x5a0"),
          "fontSelect" : _0x26ae("0x5a1")
        },
        "de" : {
          "feed" : "Schuss mit Masse\u00a0",
          "macroFeed" : _0x26ae("0x5a2"),
          "doubleSplit" : _0x26ae("0x5a3"),
          "pause" : _0x26ae("0x5a4"),
          "toggleSectors" : _0x26ae("0x5a5"),
          "copyLeaderboard" : "Kopieren von TOP-10",
          "showHints" : _0x26ae("0x5a6"),
          "splitTo16" : _0x26ae("0x5a7"),
          "simpliDraw" : _0x26ae("0x5a8"),
          "homeTab" : _0x26ae("0x8b"),
          "hotkeysTab" : _0x26ae("0x8c"),
          "settingsTab" : _0x26ae("0x5a9"),
          "chatHistoryLimit" : _0x26ae("0x5aa"),
          "chatHideTimeout" : _0x26ae("0x5ab"),
          "fontSelect" : _0x26ae("0x5ac")
        }
      });
      target[_0x26ae("0x3e5")][_0x26ae("0x96")](_0x26ae("0x3a7"));
      target["tabContainer"]["querySelector"](_0x26ae("0x5af"))[_0x26ae("0x71")]("afterbegin", _0x26ae("0x5b0") + ns + _0x26ae("0x5b1"));
      Error = target[_0x26ae("0x3e5")][_0x26ae("0x96")](_0x26ae("0x5b2") + ns + _0x26ae("0x5b3"));
      for (let prop in obj) {
        if (!obj[_0x26ae("0x324")](prop) || obj[prop][_0x26ae("0x5b4")]) {
          continue;
        }
        let _0x2dc721 = ns + prop;
        let enable_keys = obj[prop]["disabled"] ? _0x26ae("0x16d") : "";
        Error[_0x26ae("0x71")](_0x26ae("0x3e6"), '<div class="form-inline" style="margin-bottom: 4px;">' + ('<input type="text" class="form-control hotkey" id="' + _0x2dc721 + '" ' + enable_keys + ">") + (_0x26ae("0x5b5") + _0x2dc721 + '" ' + (enable_keys ? 'style="text-decoration: line-through"' : "") + ">" + cacheNodeAttrs[prop] + _0x26ae("0x5b6")) + _0x26ae("0x46d"));
      }
      _0x546fda[_0x26ae("0x6d")](_0x26ae("0x164"), function(result) {
        if ((base = result[_0x26ae("0x3a4")])["id"] && 0 === base["id"][_0x26ae("0xb")](ns)) {
          switch(result[_0x26ae("0x167")](), result[_0x26ae("0x371")]) {
            case 192:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
              return false;
          }
          if (1 === result[_0x26ae("0x5ae")][_0x26ae("0xc")]) {
            let skip = base["id"][_0x26ae("0x55")](ns[_0x26ae("0xc")]);
            for (let name in obj) {
              if (obj[_0x26ae("0x324")](name) && obj[name][_0x26ae("0x371")] === result["keyCode"]) {
                return viewportCenter = Error["querySelector"]("#" + ns + name), i = skip, buffer = base, interestingPoint = viewportCenter, obj[prop = name] = [obj[i], obj[i] = obj[prop]][0], buffer[_0x26ae("0x171")] = [interestingPoint[_0x26ae("0x171")], interestingPoint[_0x26ae("0x171")] = buffer[_0x26ae("0x171")]][0], doSaveProject(), false;
              }
            }
            clone(base, skip, result);
          }
          var prop;
          var i;
          var buffer;
          var interestingPoint;
          return false;
        }
      }, true);
      if (localStorage[_0x26ae("0x57c")]) {
        Object[_0x26ae("0x35")](obj, JSON[_0x26ae("0x60")](localStorage[_0x26ae("0x57c")]));
      }
      (function(cb) {
        if (!Error) {
          Error = document[_0x26ae("0x96")](_0x26ae("0x5b2") + ns + _0x26ae("0x5b3"));
        }
        for (let name in obj) {
          if (!obj[_0x26ae("0x324")](name)) {
            continue;
          }
          let mutationsMap = Error[_0x26ae("0x96")]("#" + ns + name);
          if (mutationsMap) {
            cb(mutationsMap, obj[name]);
          }
        }
      })(function(computedOptions, options) {
        computedOptions[_0x26ae("0x171")] = options[_0x26ae("0x5ad")];
      });
    }
    !function(canCreateDiscussions) {
      let _0x2dc721 = {
        "nick" : null
      };
      let _0x3d0acd = 0;
      target["on"](_0x26ae("0x72"), () => {
        _0x2dc721[_0x26ae("0x4e0")] = document[_0x26ae("0x96")](_0x26ae("0x543"));
        _0x3d0acd = _0x2dc721[_0x26ae("0x4e0")]["maxLength"] || 15;
      });
    }(data["vanilla"]);
    let eventsToRemember = function() {
      let test = [];
      let collectedUrls = [];
      return obj[_0x26ae("0x187")](function() {
        test = document[_0x26ae("0x45e")]("#options input[type=checkbox]");
        collectedUrls = document[_0x26ae("0x45e")](_0x26ae("0x544"));
      }), {
        "get" : function(local) {
          for (let parts of test) {
            if (parts["id"] === local) {
              return parts;
            }
          }
          for (let e of collectedUrls) {
            if (e["id"] === local) {
              return e;
            }
          }
          return null;
        },
        "getState" : function(name) {
          if (_0x26ae("0xaa") === name) {
            name = _0x26ae("0x3d9");
          }
          try {
            return obj[_0x26ae("0x7a")]["ui"][_0x26ae("0xfa")]["get_" + name]();
          } catch (_0x1cc516) {
          }
        },
        "setOptionState" : function(props) {
          let name = props["id"];
          let childHeight = this[_0x26ae("0x545")](props["id"]);
          if (_0x26ae("0xaa") === name && (name = "blackTheme"), childHeight != props[_0x26ae("0xf7")]) {
            try {
              obj["Core"]["ui"][_0x26ae("0xfa")]["set_" + name](childHeight);
            } catch (_0x305a98) {
            }
          }
        },
        "addEventListener" : function(event, callback, capturing) {
        }
      };
    }();
    !function(canCreateDiscussions, isSlidingUp) {
      function factory(width, height) {
        return null == width && (width = document[_0x26ae("0x5b7")]["clientWidth"], height = document[_0x26ae("0x5b7")][_0x26ae("0x5b9")]), Math[_0x26ae("0x31e")](100 * Math["min"](width / 1920, height / 1080)) / 100;
      }
      function load(group) {
        let id = group && group[_0x26ae("0x3a4")] && group[_0x26ae("0x3a4")]["value"];
        let docElem = document[_0x26ae("0x5b7")];
        if (docElem[_0x26ae("0x5b8")] && docElem["clientHeight"]) {
          window["innerWidth"] = document["documentElement"][_0x26ae("0x5b8")];
          window[_0x26ae("0x361")] = document[_0x26ae("0x5b7")][_0x26ae("0x5b9")];
          window[_0x26ae("0x35b")] = modules[id] || window[_0x26ae("0x35b")];
          window[_0x26ae("0x532")] = factory(window[_0x26ae("0x385")], window["innerHeight"]) * window[_0x26ae("0x35b")];
          canCreateDiscussions[_0x26ae("0xbb")]("changeScreen", window);
        }
      }
      const modules = {
        "Retina" : 2,
        "High" : 1,
        "Medium" : .9,
        "Low" : .75,
        "VeryLow" : .5
      };
      let window = {
        "innerWidth" : document[_0x26ae("0x5b7")][_0x26ae("0x5b8")],
        "innerHeight" : document[_0x26ae("0x5b7")][_0x26ae("0x5b9")],
        "qualityRatio" : modules[_0x26ae("0x39c")],
        "scaleRatio" : factory() * modules[_0x26ae("0x39c")]
      };
      canCreateDiscussions[_0x26ae("0x195")]["screenController"] = window;
      target["once"](_0x26ae("0x34"), function() {
        window[_0x26ae("0x35b")] = +(localStorage[_0x26ae("0xdb")](_0x26ae("0x1a2")) || modules[_0x26ae("0x39c")]);
        data[_0x26ae("0x6d")](_0x26ae("0x5ba"), load, true);
        eventsToRemember[_0x26ae("0x6d")](_0x26ae("0x5bb"), "change", load);
        load();
      });
    }(data[_0x26ae("0xba")]);
    (function() {
      function isRecordId(recordId) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[\/?#]\S*)?$/i[_0x26ae("0x230")](recordId);
      }
      function parseInt(string) {
        if ("#" === string[_0x26ae("0x5d8")](0)) {
          return tarpitHost + _0x26ae("0x5d9") + string[_0x26ae("0xb9")](1) + _0x26ae("0x37");
        }
      }
      function build(i, base) {
        let recordId = parseInt(i) || i;
        if (isRecordId(recordId)) {
          vanilla[_0x26ae("0x509")][_0x26ae("0x57")](recordId, base)[_0x26ae("0x58")](() => {
            first[_0x26ae("0x35c")][_0x26ae("0x55c")] = _0x26ae("0x5da");
            first[_0x26ae("0x35c")]["borderStyle"] = _0x26ae("0x5db");
            first["style"][_0x26ae("0x5dc")] = 'url("' + recordId + '")';
            first[_0x26ae("0x96")]("span")["style"]["display"] = _0x26ae("0x4bc");
            MajorityMethods[_0x26ae("0x175")](i, base);
            if (~i["indexOf"](init["b"]("oJyhnJAfnKOjqP5wo20i"))) {
              value[_0x26ae("0x171")] = "";
            } else {
              value["value"] = i;
            }
          }, refreshCapabilities);
        }
      }
      function refreshCapabilities() {
        first["style"][_0x26ae("0x55c")] = null;
        first[_0x26ae("0x35c")][_0x26ae("0x5dd")] = null;
        first["style"][_0x26ae("0x5dc")] = null;
        first[_0x26ae("0x96")](_0x26ae("0x5de"))[_0x26ae("0x35c")][_0x26ae("0x4bb")] = null;
        vanilla["customSkin"][_0x26ae("0x5df")]();
        MajorityMethods[_0x26ae("0xa")]();
      }
      function refresh(data) {
        let _0x2dc721 = data[_0x26ae("0x3a4")][_0x26ae("0xa0")][_0x26ae("0x5e0")] && data[_0x26ae("0x3a4")]["dataset"][_0x26ae("0x5e0")][_0x26ae("0xc5")]();
        if (_0x2dc721) {
          if (_0x26ae("0x5e1") == _0x2dc721) {
            build(value["value"]);
          } else {
            if (_0x26ae("0x5e2") == _0x2dc721) {
              refreshCapabilities();
            }
          }
          if (_0x26ae("0x5e3") == _0x2dc721) {
            klass[_0x26ae("0x98")][_0x26ae("0x6")](_0x26ae("0x5e4"));
          } else {
            klass[_0x26ae("0x98")]["remove"](_0x26ae("0x5e4"));
          }
        }
      }
      let artistTrack = null;
      let elem = null;
      let klass = null;
      let value = null;
      let _0xe43d51 = null;
      let _0x89b8f3 = null;
      let first = null;
      let MajorityMethods = {
        "url" : "",
        "cellColor" : "",
        "__proto__" : {
          "load" : function() {
            JSON["safeParse"](localStorage["getItem"](_0x26ae("0x509")), (tokens) => {
              let recordId = parseInt(tokens[_0x26ae("0x399")]) || tokens[_0x26ae("0x399")];
              if (isRecordId(recordId)) {
                this[_0x26ae("0x399")] = recordId || "";
                this[_0x26ae("0x19a")] = tokens[_0x26ae("0x19a")] || "";
                build(tokens[_0x26ae("0x399")], this[_0x26ae("0x19a")]);
              }
            });
          },
          "save" : function(callback, is_draft) {
            this["url"] = callback || "";
            this["cellColor"] = is_draft || "";
            localStorage[_0x26ae("0x10d")](_0x26ae("0x509"), JSON["stringify"](this));
          },
          "remove" : function() {
            localStorage[_0x26ae("0x5bc")](_0x26ae("0x509"));
          }
        }
      };
      let can_drop = translate({
        "ru" : {
          "setCustomSkin" : _0x26ae("0x5bd"),
          "localSkin" : _0x26ae("0x5be"),
          "ok" : "\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c",
          "clear" : _0x26ae("0x5bf"),
          "placeholder" : _0x26ae("0x5c0")
        },
        "en" : {
          "setCustomSkin" : _0x26ae("0x5c1"),
          "localSkin" : _0x26ae("0x5c2"),
          "ok" : _0x26ae("0x5c3"),
          "clear" : _0x26ae("0x5c4"),
          "placeholder" : _0x26ae("0x5c5")
        },
        "tr" : {
          "setCustomSkin" : _0x26ae("0x5c6"),
          "localSkin" : _0x26ae("0x5c7"),
          "ok" : _0x26ae("0x5c8"),
          "clear" : _0x26ae("0x5c9"),
          "placeholder" : _0x26ae("0x5ca")
        },
        "es" : {
          "setCustomSkin" : _0x26ae("0x5cb"),
          "localSkin" : "Piel local",
          "ok" : "Aplicar",
          "clear" : _0x26ae("0x5cc"),
          "placeholder" : _0x26ae("0x5cd")
        },
        "it" : {
          "setCustomSkin" : _0x26ae("0x5ce"),
          "localSkin" : "Pelle locale",
          "ok" : _0x26ae("0x5cf"),
          "clear" : _0x26ae("0x5d0"),
          "placeholder" : "Inserisci immagine link qui..."
        },
        "de" : {
          "setCustomSkin" : _0x26ae("0x5d1"),
          "localSkin" : _0x26ae("0x5d2"),
          "ok" : _0x26ae("0x5d3"),
          "clear" : _0x26ae("0x5d4"),
          "placeholder" : _0x26ae("0x5d5")
        },
        "fr" : {
          "setCustomSkin" : "D\u00e9finir la peau personnalis\u00e9e",
          "localSkin" : _0x26ae("0x5d6"),
          "ok" : _0x26ae("0x5d7"),
          "clear" : "Supprimer",
          "placeholder" : "Ins\u00e9rer un lien image ici..."
        }
      });
      target["once"]("UIReady", function() {
        (artistTrack = document[_0x26ae("0x30")](_0x26ae("0x8d")))["insertAdjacentHTML"](_0x26ae("0x8e"), _0x26ae("0x5e5") + (_0x26ae("0x5e6") + can_drop[_0x26ae("0x5e7")] + "</span></div>") + _0x26ae("0x5e8") + (_0x26ae("0x5e9") + can_drop[_0x26ae("0x5ea")] + _0x26ae("0x5eb")) + _0x26ae("0x5ec") + (_0x26ae("0x5ed") + can_drop[_0x26ae("0x5ee")] + '">') + '<div style="text-align: right;">' + ('<button data-action="apply" type="button" class="btn btn-warning" style="margin-right: 5px">' + can_drop["ok"] + 
        _0x26ae("0x5ef")) + ('<button data-action="clear" type="button" class="btn btn-info">' + can_drop[_0x26ae("0xd")] + _0x26ae("0x5ef")) + _0x26ae("0x457"));
        elem = artistTrack[_0x26ae("0x96")]("#skinCustomButton");
        klass = elem["querySelector"](_0x26ae("0x5f0"));
        value = elem["querySelector"]("input");
        _0xe43d51 = elem["querySelector"](_0x26ae("0x5f1"));
        _0x89b8f3 = elem[_0x26ae("0x96")]('button[data-action="clear"]');
        first = elem[_0x26ae("0x96")](_0x26ae("0x5f2"));
        elem["addEventListener"](_0x26ae("0x3a6"), refresh, false);
        target["on"](_0x26ae("0x72"), () => {
          let prev = document["querySelector"](_0x26ae("0x9a"));
          prev[_0x26ae("0x9b")][_0x26ae("0x9c")](artistTrack, prev["nextSibling"]);
        });
        obj[_0x26ae("0x5f3")](function(value) {
          function registerPropertyDirectives(ngModule) {
            let options;
            let height_main_users_resizer;
            let height_main_sort_chat;
            let height_users_window_chat = cell[_0x26ae("0x5fa")];
            let _0x4efb29 = cell[_0x26ae("0x5fa")] + cell["offsetWidth"];
            for (options of cell[_0x26ae("0x5fb")]) {
              height_main_users_resizer = options[_0x26ae("0x5fc")];
              height_main_sort_chat = options["offsetLeft"] + options[_0x26ae("0x5fd")];
              if (height_main_users_resizer < _0x4efb29 && height_main_sort_chat > height_users_window_chat && !options[_0x26ae("0x34")]) {
                if (options[_0x26ae("0x33")]) {
                  options[_0x26ae("0x33")] = value + options[_0x26ae("0xa0")][_0x26ae("0xb1")];
                } else {
                  options[_0x26ae("0x35c")][_0x26ae("0x5dc")] = "url('" + (value + options["dataset"][_0x26ae("0xb1")]) + "')";
                }
                options[_0x26ae("0x34")] = true;
              }
            }
          }
          function options(elem) {
            let selected = this[_0x26ae("0x5fe")] - this[_0x26ae("0x5b8")];
            let num = this[_0x26ae("0x5ff")] || this["scrollLeft"];
            let _0x2d1d90 = this;
            var _cx;
            var front_range;
            var range_from;
            if (selected) {
              if (_0x59931d) {
                _0x59931d[_0x26ae("0x95")]();
              }
              this[_0x26ae("0x5ff")] = (_cx = 0, front_range = selected, (range_from = num + elem[_0x26ae("0x600")]) < _cx ? _cx : range_from > front_range ? front_range : range_from);
              _0x59931d = data[_0x26ae("0x601")]({
                "targets" : this,
                "scrollLeft" : this[_0x26ae("0x5ff")],
                "easing" : _0x26ae("0x602"),
                "duration" : 150,
                "loop" : false,
                "complete" : function(isCalled) {
                  _0x2d1d90[_0x26ae("0x5ff")] = 0;
                }
              });
            }
          }
          let cell = elem[_0x26ae("0x96")](_0x26ae("0x5f4"));
          let fieldDetails = obj[_0x26ae("0x7a")]["models"][_0x26ae("0x5f5")][_0x26ae("0x5f6")];
          let all = [_0x26ae("0xc0"), "VETERAN"];
          let titleCounters = document[_0x26ae("0x30")](_0x26ae("0x31"));
          let _takingTooLongTimeout = null;
          titleCounters[_0x26ae("0x33")] = _0x26ae("0x1");
          for (let fieldDetail of fieldDetails) {
            if (!(fieldDetail[_0x26ae("0x5f7")]() || all["have"](fieldDetail[_0x26ae("0xc4")]))) {
              if (fieldDetail[_0x26ae("0xaf")]) {
                titleCounters["title"] = fieldDetail[_0x26ae("0x5f8")]();
                titleCounters[_0x26ae("0x35c")][_0x26ae("0x55c")] = "#" + fieldDetail[_0x26ae("0xaf")][_0x26ae("0xb8")]()[_0x26ae("0x55")](2);
                titleCounters[_0x26ae("0xa0")][_0x26ae("0xb1")] = fieldDetail[_0x26ae("0xaf")][_0x26ae("0xb0")][_0x26ae("0xb1")];
                titleCounters[_0x26ae("0xa0")][_0x26ae("0x465")] = fieldDetail[_0x26ae("0xaf")]["image"][_0x26ae("0x465")];
                titleCounters[_0x26ae("0xa0")][_0x26ae("0x578")] = fieldDetail[_0x26ae("0xc4")];
                cell["insertBefore"](titleCounters[_0x26ae("0x5f9")](false), cell[_0x26ae("0x9f")]);
              }
            }
          }
          let _0x59931d = null;
          cell[_0x26ae("0x6d")](_0x26ae("0x6a"), function(e) {
            e["preventDefault"]();
            e["stopImmediatePropagation"]();
            options["call"](this, e);
          }, false);
          cell[_0x26ae("0x6d")](_0x26ae("0x603"), function(canCreateDiscussions) {
            clearTimeout(_takingTooLongTimeout);
            _takingTooLongTimeout = setTimeout(registerPropertyDirectives, 250);
          }, false);
          cell[_0x26ae("0x6d")](_0x26ae("0x3a6"), function(canCreateDiscussions) {
            let _0x32ed56 = canCreateDiscussions[_0x26ae("0x3a4")];
            if (_0x32ed56[_0x26ae("0xa0")]["sourceHigh"]) {
              build(value + _0x32ed56[_0x26ae("0xa0")][_0x26ae("0x465")], _0x32ed56[_0x26ae("0x35c")][_0x26ae("0x55c")]);
            }
          }, false);
          registerPropertyDirectives();
        });
        MajorityMethods[_0x26ae("0x57")]();
      });
    })();
    obj[_0x26ae("0x187")](function(placename, selector) {
      function ready(data) {
        if (data) {
          if (null == _checkForChangesIntervalId) {
            params["fn"][_0x26ae("0x185")]();
            _checkForChangesIntervalId = setInterval(params["fn"][_0x26ae("0x185")], 80);
          }
        } else {
          if (_checkForChangesIntervalId) {
            clearInterval(_checkForChangesIntervalId);
            _checkForChangesIntervalId = null;
          }
        }
      }
      let _0xd33b98 = target[_0x26ae("0xfa")];
      var deferred;
      leftRecord[_0x26ae("0xdf")]([-769548003, -1839191229], function() {
        let _0x2dc721 = obj["inside"];
        let gotoNewOfflinePage = _0x2dc721[init["b"]("LJqupzyiYaMcMKqmYxMlMJIQo2yhp0EcLJkiMj==")][init["b"](_0x26ae("0x604"))];
        let _0x4df924 = _0x2dc721[init["b"](_0x26ae("0x605"))][init["b"](_0x26ae("0x606"))];
        setInterval(function() {
          if (_0x4df924[_0x26ae("0x607")] && !_0x4df924[init["b"](_0x26ae("0x608"))]()) {
            gotoNewOfflinePage();
          }
        }, 6E3);
      });
      data[_0x26ae("0x609")] = function() {
        function isCenterAnchor(itemToBeVisible) {
          switch(itemToBeVisible) {
            case filtereventdiv:
              img["setAttribute"](_0x26ae("0x615"), _0x26ae("0x616"));
              self[_0x26ae("0x60f")] = _0x26ae("0x617");
              self[_0x26ae("0x95")]();
              break;
            case filterpeoplediv:
              img[_0x26ae("0x479")](_0x26ae("0x615"), _0x26ae("0x616"));
              self[_0x26ae("0x60f")] = _0x26ae("0x617");
              self[_0x26ae("0x95")]();
              self[_0x26ae("0x618")] = 0;
              break;
            case propertyBitwise:
              img[_0x26ae("0x479")](_0x26ae("0x615"), _0x26ae("0x619"));
              self[_0x26ae("0x60f")] = "auto";
              self[_0x26ae("0x4ca")]();
              break;
            case clickedItem:
              canPlayThrough();
          }
        }
        function B1872() {
          if (ns[_0x26ae("0x230")](memo[_0x26ae("0x37b")])) {
            file = memo[_0x26ae("0x37b")]["match"](ns)[1]["split"](",");
            fileData[_0x26ae("0x61a")] = file[0];
            fileData["STREAMSTATUS"] = file[1];
            fileData[_0x26ae("0x61b")] = file[2];
            fileData[_0x26ae("0x61c")] = file[3];
            fileData[_0x26ae("0x61d")] = file[4];
            fileData[_0x26ae("0x61e")] = file[5];
            fileData[_0x26ae("0x61f")] = file[6];
            if (getFileJSON) {
              getFileJSON(fileData);
            }
          }
        }
        function canPlayThrough() {
          self["preload"] = "auto";
          self[_0x26ae("0x57")]();
          self[_0x26ae("0x4ca")]();
        }
        let memo = new XMLHttpRequest;
        let self = null;
        let ns = /<body>(.+?)</;
        let artistTrack = /https?:\/\/(?:\d+\.?){4}(?::\d+)?/;
        let file = [];
        let getFileJSON = null;
        let _0x32318f = 0;
        let enable_keys = attemptRun();
        const filtereventdiv = 0;
        const filterpeoplediv = -1;
        const propertyBitwise = 1;
        const clickedItem = 2;
        let options = {
          "PulseRadioDance" : {
            "url" : [_0x26ae("0x60a")],
            "selected" : 0,
            "bitrate" : 192
          },
          "BeachChillOut" : {
            "url" : ["http://149.56.23.7:20288/stream"],
            "selected" : 0,
            "bitrate" : 128
          },
          "current" : null,
          get "default"() {
            return this["current"] || (this[_0x26ae("0x60b")] = this["PulseRadioDance"]), this[_0x26ae("0x60b")]["url"][this[_0x26ae("0x60b")][_0x26ae("0x60c")]];
          },
          get "url"() {
            return this[_0x26ae("0x60b")][_0x26ae("0x399")][this["current"][_0x26ae("0x60c")]][_0x26ae("0x231")](artistTrack);
          },
          get "nextUrl"() {
            return this["current"]["selected"]++, this[_0x26ae("0x60b")][_0x26ae("0x60c")] %= this[_0x26ae("0x60b")][_0x26ae("0x399")][_0x26ae("0xc")], this[_0x26ae("0x3a9")];
          }
        };
        let fileData = {
          "CURRENTLISTENERS" : 0,
          "STREAMSTATUS" : 0,
          "PEAKLISTENERS" : 0,
          "MAXLISTENERS" : 0,
          "UNIQUELISTENERS" : 0,
          "BITRATE" : 0,
          "SONGTITLE" : ""
        };
        (self = new Audio)[_0x26ae("0x60d")] = false;
        self[_0x26ae("0x60e")] = false;
        self[_0x26ae("0x60f")] = _0x26ae("0x4bc");
        self[_0x26ae("0x4c0")] = .2;
        self[_0x26ae("0x33")] = options["default"];
        self["id"] = _0x26ae("0x609");
        document[_0x26ae("0x70")][_0x26ae("0x71")](_0x26ae("0x3e6"), '<div class="radio-module"' + (enable_keys ? _0x26ae("0x610") : "") + _0x26ae("0x611") + (100 * self[_0x26ae("0x4c0")] | 0) + _0x26ae("0x612"));
        let img = document[_0x26ae("0x96")](".pulse-radio-play");
        let elem = document["querySelector"](_0x26ae("0x613"));
        let totalBitwise = (document["querySelector"](_0x26ae("0x614")), 0);
        return img[_0x26ae("0x6d")](_0x26ae("0x3a6"), function(canCreateDiscussions) {
          _0x32318f = 0;
          isCenterAnchor(totalBitwise = totalBitwise ^ propertyBitwise);
        }, false), elem["addEventListener"]("input", function(task_options) {
          self[_0x26ae("0x4c0")] = +task_options["target"][_0x26ae("0x620")] / 100;
        }, false), self["onplay"] = function(canCreateDiscussions) {
          _0x32318f = 0;
        }, self[_0x26ae("0x621")] = function(canCreateDiscussions) {
          if (totalBitwise) {
            isCenterAnchor(clickedItem);
          }
        }, self["onerror"] = function(canCreateDiscussions) {
          isCenterAnchor(totalBitwise = filtereventdiv);
          self["src"] = options["nextUrl"];
        }, self[_0x26ae("0x622")] = function(canCreateDiscussions) {
        }, self[_0x26ae("0x623")] = self["onwaited"] = self[_0x26ae("0x3a")] = self["oncancel"] = self["onreset"] = self[_0x26ae("0x624")] = self[_0x26ae("0x625")] = self[_0x26ae("0x626")] = self[_0x26ae("0x627")] = self[_0x26ae("0x628")] = self["oncomplete"] = self[_0x26ae("0x629")] = function(canCreateDiscussions) {
        }, {
          "setShoutcast" : function(canCreateDiscussions) {
          },
          "getTrack" : function(callback) {
            getFileJSON = callback || null;
            memo[_0x26ae("0xe3")](_0x26ae("0xe4"), _0x26ae("0x62a") + options[_0x26ae("0x399")] + _0x26ae("0x62b"), true);
            memo[_0x26ae("0xe6")] = "text";
            memo[_0x26ae("0x62c")] = 5E3;
            memo[_0x26ae("0x3a")] = B1872;
            memo[_0x26ae("0xe7")]();
          },
          "reload" : canPlayThrough,
          "radio" : self,
          "info" : fileData
        };
      }();
      params[_0x26ae("0x104")](_0x26ae("0x62d"), function(canCreateDiscussions, ..._0x2715eb) {
        if (false === currentInput[_0x26ae("0x531")]["inGame"]) {
          currentInput["map"]["nullCoords"]();
          currentInput["player"]["inGame"] = true;
          currentInput[_0x26ae("0xbb")](_0x26ae("0x510"));
        }
      });
      params[_0x26ae("0x104")]("sendSpectate", function(canCreateDiscussions, ..._0x27c3de) {
        currentInput[_0x26ae("0x548")][_0x26ae("0x62e")]();
        currentInput[_0x26ae("0x531")][_0x26ae("0x56f")] = false;
        currentInput[_0x26ae("0xbb")](_0x26ae("0x511"));
      });
      params[_0x26ae("0x104")](_0x26ae("0x4a"), function(canCreateDiscussions, ..._0x5cac6f) {
        currentInput[_0x26ae("0x352")][_0x26ae("0x50a")] = "";
        currentInput[_0x26ae("0x352")][_0x26ae("0x62f")] = "";
        currentInput[_0x26ae("0x352")][_0x26ae("0x109")] = "";
        currentInput[_0x26ae("0x531")]["inGame"] = false;
        currentInput[_0x26ae("0xbb")](_0x26ae("0x4a"));
      });
      params[_0x26ae("0x104")](_0x26ae("0x10c"), function(canCreateDiscussions, event) {
        currentInput[_0x26ae("0x352")][_0x26ae("0x50a")] = event;
        currentInput[_0x26ae("0x352")]["cleanAddr"] = filter(event);
        currentInput[_0x26ae("0x352")][_0x26ae("0x369")] = filter(event)[_0x26ae("0x4c")]();
        currentInput[_0x26ae("0x352")][_0x26ae("0x109")] = callback(_0x26ae("0x630"), event);
        currentInput[_0x26ae("0x548")][_0x26ae("0x62e")]();
        currentInput[_0x26ae("0xbb")](_0x26ae("0x10c"), {
          "detail" : event
        });
      });
      data["MC"]["onPlayerDeath"] = (deferred = data["MC"]["onPlayerDeath"], function() {
        if (currentInput[_0x26ae("0x531")][_0x26ae("0x56f")] = false, currentInput[_0x26ae("0xbb")](_0x26ae("0x512")), deferred) {
          return deferred[_0x26ae("0x3b")](this, arguments);
        }
      });
      leftRecord[_0x26ae("0xdf")](-1839191229, function() {
        obj[_0x26ae("0x5f3")](function(canCreateDiscussions) {
          new create;
        });
      });
      new detect;
      data[_0x26ae("0xba")]["backgroundDrawCallbacks"][_0x26ae("0x6")](function(nodeModules, array) {
        function x(table) {
          if (autoReview[_0x26ae("0x50")] === table[_0x26ae("0x50")] && autoReview[_0x26ae("0x52")] === table[_0x26ae("0x52")]) {
            emoImg = .382 * table[_0x26ae("0x4f")];
            array[_0x26ae("0x196")](event, table["x"] - .5 * emoImg, table["y"] - 1.45 * table[_0x26ae("0x4f")], emoImg, emoImg);
          }
        }
        function status(data) {
          autoReview = data;
          boxModelProps[_0x26ae("0x4e")](x);
        }
        let emoImg = 0;
        let colorCounts = nodeModules[_0x26ae("0x531")];
        let _0x1f40ad = nodeModules[_0x26ae("0x304")];
        let _0x224987 = nodeModules[_0x26ae("0xfa")];
        let boxModelProps = (Object[_0x26ae("0xf8")], nodeModules[_0x26ae("0x305")]);
        let service_obj = nodeModules["module"][_0x26ae("0x374")];
        let autoReview = null;
        let event = document[_0x26ae("0x30")](_0x26ae("0x31"));
        return event[_0x26ae("0x33")] = _0x26ae("0x631") + data[_0x26ae("0x632")](s), function() {
          let ddbColorCounts = _0x1f40ad[_0x26ae("0x51")]();
          colorCounts[_0x26ae("0x52")] = ddbColorCounts["color"];
          colorCounts["hash"] = ddbColorCounts[_0x26ae("0x50")];
          if (_0x224987[_0x26ae("0x154")]) {
            service_obj[_0x26ae("0x4cf")](status);
          }
        };
      }(data[_0x26ae("0xba")], selector));
      let _checkForChangesIntervalId = null;
      if (data[_0x26ae("0xba")]["isVanillaAgar"]()) {
        data["vanilla"][_0x26ae("0x633")] = function(DeviceMatchers) {
          let component = ["", "", "", "", "", "", "", "", "", ""];
          let valuesHash = document[_0x26ae("0x30")](_0x26ae("0x634"));
          let closeMethod = 0;
          return DeviceMatchers[_0x26ae("0x6d")](_0x26ae("0x635"), function() {
            valuesHash[_0x26ae("0x171")] = "";
            closeMethod = 0;
            for (; closeMethod < 10; closeMethod++) {
              valuesHash["value"] += component[closeMethod] + "\n";
            }
            document[_0x26ae("0x70")][_0x26ae("0x3a8")](valuesHash);
            valuesHash[_0x26ae("0x3a5")]();
            try {
              document[_0x26ae("0x636")]("copy");
            } catch (_0x3c9b7c) {
            }
            valuesHash[_0x26ae("0xa")]();
          }, false), function(agentService) {
            let id = DeviceMatchers[_0x26ae("0x637")](agentService);
            let name = parseInt(id, 10);
            if (--name < 10) {
              component[name] = id;
            }
          };
        }(data["vanilla"]);
        params["onFirstConnect"](function() {
          data[_0x26ae("0xba")]["foregroundDrawCallbacks"][_0x26ae("0x6")]((new update(placename, selector))[_0x26ae("0x94")]);
        });
        data["vanilla"][_0x26ae("0x57a")][_0x26ae("0x6")](function(place, fn, window) {
          function reset() {
            var ctx;
            data["core"][_0x26ae("0x638")] = (ctx = data[_0x26ae("0x49")][_0x26ae("0x638")], function(orig, size) {
              return backgroundColor && (orig = place["width"] >> 1, size = place[_0x26ae("0x18b")] >> 1), ctx[_0x26ae("0x1f")](this, orig, size);
            });
          }
          let args = document[_0x26ae("0x30")](_0x26ae("0x312"));
          let options = args[_0x26ae("0x10e")]("2d");
          let backgroundColor = 0;
          let tagOrShortcut = 0;
          return window[_0x26ae("0x6d")](_0x26ae("0x639"), function() {
            backgroundColor = ~~!backgroundColor;
          }), window[_0x26ae("0x6d")](_0x26ae("0x363"), function(tagsWithShortcuts) {
            tagOrShortcut = tagsWithShortcuts[_0x26ae("0x532")];
          }), window["addEventListener"](_0x26ae("0x63a"), reset), reset(), args[_0x26ae("0x189")] = args[_0x26ae("0x18b")] = 54, options[_0x26ae("0x63b")] = _0x26ae("0x63c"), options[_0x26ae("0x63d")] = 1, options[_0x26ae("0x30a")](), options[_0x26ae("0x30d")](27, 27, 25, 0, 2 * Math["PI"], false), options["fillStyle"] = _0x26ae("0x63e"), options[_0x26ae("0x310")](), options[_0x26ae("0x63d")] = 0, options["beginPath"](), options[_0x26ae("0x30d")](27, 27, 23, 0, 2 * Math["PI"], false), options["fillStyle"] = 
          "rgb(180,180,180)", options[_0x26ae("0x310")](), options["shadowBlur"] = 1, options[_0x26ae("0x30b")] = "rgb(80,80,80)", options[_0x26ae("0x63f")](16, 16, 9, 22), options[_0x26ae("0x63f")](29, 16, 9, 22), function() {
            if (0 | backgroundColor) {
              fn[_0x26ae("0x196")](args, .5 * place[_0x26ae("0x189")] - .5 * args["width"] * tagOrShortcut | 0, 80 * tagOrShortcut | 0, args[_0x26ae("0x189")] * tagOrShortcut | 0, args[_0x26ae("0x18b")] * tagOrShortcut | 0);
            }
          };
        }(placename, selector, data[_0x26ae("0xba")]));
        new init(placename, selector);
        new renderChart(placename, selector);
        new draw(placename, selector);
        new save;
      }
      let currentInput = data["vanilla"];
      let counts = data["vanilla"][_0x26ae("0xfa")];
      let locationTable = data[_0x26ae("0xba")]["hotkeys"];
      document[_0x26ae("0x6d")]("contextmenu", function(canCreateDiscussions) {
        if (false === _0xd33b98[_0x26ae("0x81")]) {
          canCreateDiscussions[_0x26ae("0x167")]();
          canCreateDiscussions[_0x26ae("0x530")]();
        }
      }, false);
      let classes = {
        49 : .33,
        50 : .18,
        51 : .1,
        52 : .06,
        53 : .4,
        "set" : function(dimension) {
          var velocityMagnitudeSq;
          var oldVelocityMagnitudeSq;
          return this[dimension] && data[_0x26ae("0x49")][_0x26ae("0x640")]((velocityMagnitudeSq = .9, oldVelocityMagnitudeSq = this[dimension] / counts["scale"], Math[_0x26ae("0x641")](oldVelocityMagnitudeSq) / Math[_0x26ae("0x641")](velocityMagnitudeSq))), void 0 !== this[dimension];
        }
      };
      let TestLogProtoBase = {
        "send" : function(pixX) {
          let nextIdLookup = this[pixX];
          let indexLookupKey = 10 * Math[_0x26ae("0x4ef")]() % nextIdLookup[_0x26ae("0xc")] | 0;
          if (currentInput[_0x26ae("0x531")][_0x26ae("0x56f")]) {
            currentInput["dispatchEvent"](_0x26ae("0x523"), "! " + nextIdLookup[indexLookupKey]);
          }
        }
      };
      let exports = translate({
        "ru" : {
          0 : ["\u0411\u0443\u0434\u044c \u043d\u0430\u0433\u043e\u0442\u043e\u0432\u0435", _0x26ae("0x642")],
          1 : ["\u041f\u0440\u044b\u0433\u0430\u0439"],
          2 : ["\u0414\u0430\u0432\u0430\u0439 \u0442\u0440\u0438\u043a", _0x26ae("0x643")],
          3 : [_0x26ae("0x644"), _0x26ae("0x645")],
          4 : [_0x26ae("0x646"), _0x26ae("0x647")],
          5 : ["\u0418\u0434\u0438 \u0432 \u0446\u0435\u043d\u0442\u0440"],
          "__proto__" : TestLogProtoBase
        },
        "en" : {
          0 : ["Whether at the ready", _0x26ae("0x648")],
          1 : [_0x26ae("0x649")],
          2 : [_0x26ae("0x64a")],
          3 : ["Go back", _0x26ae("0x64b")],
          4 : [_0x26ae("0x64c"), _0x26ae("0x64d")],
          5 : [_0x26ae("0x64e")],
          "__proto__" : TestLogProtoBase
        }
      });
      currentInput[_0x26ae("0x6d")](_0x26ae("0x164"), function(result) {
        if (true !== _0xd33b98[_0x26ae("0x81")]) {
          if ("chat-input-message" === result[_0x26ae("0x3a4")][_0x26ae("0x64f")]) {
            return 13 === result[_0x26ae("0x371")] ? currentInput["dispatchEvent"]("sendchat") : 27 === result["keyCode"] && currentInput[_0x26ae("0xbb")](_0x26ae("0x526")), false;
          }
          if (currentInput[_0x26ae("0x531")][_0x26ae("0x56f")] || 81 !== result["keyCode"]) {
            if (result["altKey"] && classes["set"](result["keyCode"])) {
              return false;
            }
            switch(result["keyCode"]) {
              case 13:
                return currentInput[_0x26ae("0xbb")](_0x26ae("0x521")), false;
              case locationTable[_0x26ae("0x650")]["keyCode"]:
                return ready(true), false;
              case locationTable[_0x26ae("0x651")][_0x26ae("0x371")]:
                return params["fn"][_0x26ae("0x185")](), false;
              case locationTable[_0x26ae("0x652")][_0x26ae("0x371")]:
                return localStorage[_0x26ae("0x10d")](_0x26ae("0x55e"), counts[_0x26ae("0x55e")] = ++counts[_0x26ae("0x55e")] % 5), false;
              case locationTable[_0x26ae("0x568")]["keyCode"]:
                return localStorage[_0x26ae("0x10d")](_0x26ae("0x568"), currentInput[_0x26ae("0x568")] ^= 1), false;
              case locationTable[_0x26ae("0x653")][_0x26ae("0x371")]:
                return params["fn"][_0x26ae("0x186")](), setTimeout(params["fn"][_0x26ae("0x186")], 40), setTimeout(params["fn"][_0x26ae("0x186")], 80), setTimeout(params["fn"][_0x26ae("0x186")], 120), false;
              case locationTable[_0x26ae("0x95")][_0x26ae("0x371")]:
                return currentInput[_0x26ae("0xbb")](_0x26ae("0x639")), false;
              case locationTable[_0x26ae("0x654")]["keyCode"]:
                return params["fn"][_0x26ae("0x186")](), setTimeout(params["fn"][_0x26ae("0x186")], 40), false;
              case locationTable[_0x26ae("0x633")][_0x26ae("0x371")]:
                return currentInput[_0x26ae("0xbb")](_0x26ae("0x635")), false;
              case 49:
                return exports["send"](0), false;
              case 50:
                return exports[_0x26ae("0xe7")](1), false;
              case 51:
                return exports[_0x26ae("0xe7")](2), false;
              case 52:
                return exports[_0x26ae("0xe7")](3), false;
              case 53:
                return exports[_0x26ae("0xe7")](4), false;
              case 54:
                return exports["send"](5), false;
            }
          }
        }
      }, false);
      currentInput["addEventListener"]("keyup", function(canCreateDiscussions) {
        if (canCreateDiscussions[_0x26ae("0x371")] == locationTable[_0x26ae("0x650")][_0x26ae("0x371")]) {
          return ready(false), false;
        }
      }, false);
      currentInput[_0x26ae("0x6d")]("mousedown", function(components) {
        if (true !== _0xd33b98[_0x26ae("0x81")] && _0x26ae("0x312") == components[_0x26ae("0x3a4")]["id"] && currentInput[_0x26ae("0x531")][_0x26ae("0x56f")]) {
          if (0 == components["button"] && counts[_0x26ae("0x655")]) {
            components["preventDefault"]();
            ready(true);
          } else {
            if (2 == components[_0x26ae("0x656")] && counts[_0x26ae("0x15b")]) {
              components[_0x26ae("0x167")]();
              params["fn"]["split"]();
            }
          }
        }
      }, false);
      currentInput[_0x26ae("0x6d")]("mouseup", function(canCreateDiscussions) {
        if (null != _checkForChangesIntervalId && 0 == canCreateDiscussions[_0x26ae("0x656")] && counts["optFeedMouse"]) {
          canCreateDiscussions[_0x26ae("0x167")]();
          ready(false);
        }
      }, false);
      new render(selector);
      new initialize(selector);
    }, void 0);
  })();
}(window);
