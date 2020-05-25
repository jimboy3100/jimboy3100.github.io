//SPECS v1.6



function addBox() {
  let spect = new Spect();
  spect.player = true;
  spects.unshift(spect);
}
function addSpectator() {
  let spect = new Spect();
  spects.push(spect)
}
function addFullSpectator() {
  // let mtp = 4.95,
  //   w = ~~(1024 * mtp),
  //   h = ~~(600 * mtp);
  // let stop = 0,
  //   x = 0,
  //   y = 0;
  // for (; stop < 30; stop++) {
  //   if (stop == 0) {
  //     let spect = new Spect();
  //     x = application.tabs[CT["master"]].mapMinX + 2400;
  //     y = application.tabs[CT["master"]].mapMinY + 1000;
  //     spect.staticX = x;
  //     spect.staticY = y;
  //     spects.push(spect)
  //     stop++
  //   } else {
  //     if (x > application.tabs[CT["master"]].mapMaxX - 2400) {
  //       x = application.tabs[CT["master"]].mapMinX + 2400;
  //       y = y + h;
  //     } else { x = x + w; }
  //     if (y > application.tabs[CT["master"]].mapMaxY - 1000) {
  //       stop = 100;
  //       break
  //     }
  //     let spect = new Spect();
  //     spect.staticX = x;
  //     spect.staticY = y;
  //     spects.push(spect)
  //     stop++
  //   }
  // }

  // How much of the excess viewport goes to overlap
  // This should obviously be smaller than the free spectator viewport, and smaller than the map edge length.
  const OVERLAP_AMOUNT = 32;
  // viewport we have extra, as we need to round up how many spectators we take for the grid, to see the entire map
  const EXCESS_VIEWPORT_WIDTH =   AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH
                                - (AGAR_CONST.MAP_EDGE_LENGTH - OVERLAP_AMOUNT) % (AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH - OVERLAP_AMOUNT)
                                - OVERLAP_AMOUNT;
  const EXCESS_VIEWPORT_HEIGHT =   AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT
                                 - (AGAR_CONST.MAP_EDGE_LENGTH - OVERLAP_AMOUNT) % (AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT - OVERLAP_AMOUNT)
                                 - OVERLAP_AMOUNT;
  // amount of spectators to overlap the entire map as a grid
  const SPECTATOR_ROWS = Math.ceil((AGAR_CONST.MAP_EDGE_LENGTH - OVERLAP_AMOUNT) / (AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT - OVERLAP_AMOUNT));
  const SPECTATOR_COLUMNS = Math.ceil((AGAR_CONST.MAP_EDGE_LENGTH - OVERLAP_AMOUNT) / (AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH - OVERLAP_AMOUNT));

  let grid = [];
  function spectatorGridFactory(row, column, staticX, staticY) {
    let spect = new Spect(grid, row, column);
    spect.staticX = staticX;
    spect.staticY = staticY;

    if (grid.length <= row) {
      if (grid.length < row) throw new Error("Attempted to construct spectator grid rows out of order.");
      grid.push([]);
    }
    if (grid[row].length < column) throw new Error("Attempted to construct spectator grid columns out of order.");
    
    grid[row].push(spect);
    spects.push(spect);

    // typically unused
    return spect;
  }

  let y = - AGAR_CONST.MAP_EDGE_LENGTH / 2                 // negative border of map
          + AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT_HALF  // half of spectator viewport width in
          - EXCESS_VIEWPORT_HEIGHT / 2;                    // back out to have excess outside of map
  // generate grid of spectators  
  for (let row = 0; row < SPECTATOR_ROWS; row++) {
    let x = - AGAR_CONST.MAP_EDGE_LENGTH / 2
            + AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH_HALF
            - EXCESS_VIEWPORT_WIDTH / 2;

    for (let column = 0; column < SPECTATOR_COLUMNS; column++) {
      // we want as little overlap of the viewports as possible, but more than zero.
      spectatorGridFactory(row, column, x, y);

      x += AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH - OVERLAP_AMOUNT;
    }
    y += AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT - OVERLAP_AMOUNT;
  }
}
let spects = [];
class Spect {
  constructor(grid = null, row = 0, column = 0) {
    this.clientDummy = new ClientDummy();
    this.adjustedCoords = false;
    this.grid = grid;
    this.row = row;
    this.column = column;
    this.number = spects.length + 1
    this.ws = null
    this.socket = null
    this.protocolKey = null
    this.clientKey = null
    this.clientVersion = null
    this.connectionOpened = false
    this.mapOffset = AGAR_CONST.MAP_EDGE_LENGTH / 2;
    this.mapOffsetX = 0
    this.mapOffsetY = 0
    this.mapShrinkW = 1;
    this.mapShrinkH = 1;
    this.fixX = 1
    this.fixY = 1
    this.staticX = null
    this.staticY = null
    this.ghostsFixed = false
    this.closedByUser = false
    this.positionController = null
    this.player = false
    this.active = false
    this.targetX = null
    this.targetY = null
    this.connect()
  }
  reset() {
    this.ws = null
    //this.socket = null
    this.protocolKey = null
    this.clientKey = null
    this.clientVersion = null
    this.connectionOpened = false
    this.mapOffsetX = 0
    this.mapOffsetY = 0
    this.ghostsFixed = false
    this.closedByUser = false
    this.positionController = null
    this.player = false
    this.active = false
    this.targetX = null
    this.targetY = null
    this.clientDummy.flushCellsData();
    this.adjustedCoords = false;
  }
  connect() {
    this.reset()
    this.ws = application.tabs[CT["master"]].ws
    this.socket = new WebSocket(application.tabs[CT["master"]].ws)
    this.socket.binaryType = 'arraybuffer'
    this.socket.onopen = this.onopen.bind(this)
    this.socket.onmessage = this.onmessage.bind(this)
    this.socket.onerror = this.onerror.bind(this)
    this.socket.onclose = this.onclose.bind(this)
  }



  onopen() {
    console.log('[SPECT] Game server socket open')

    this.clientVersion = master.client_version
    this.protocolVersion = 22

    let view = this.createView(5);
    view.setUint8(0, 254);
    //if(!window.game.protocolVersion) window.game.protocolVersion = 22
    view.setUint32(1, this.protocolVersion, true);
    this.sendMessage(view);
    view = this.createView(5);
    view.setUint8(0, 255);
    //if(!window.game.clientVersion) window.game.clientVersion = this.clientVersion
    view.setUint32(1, this.clientVersion, true);
    this.sendMessage(view);
    this.connectionOpened = true;


  }



  onmessage(message) {
    message = new DataView(message.data);
    //if (this.buffersKey) message.data = algorithm.rotateBufferBytes(message.data, this.buffersKey)

    if (this.protocolKey) {
      message = this.shiftMessage(message, this.protocolKey ^ this.clientVersion);
    }
    this.handleMessage(message);
  }
  onerror() {
    setTimeout(() => {
      if (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN) this.socket.close()
    }, 1000)
    console.log('error')
  }
  onclose() {
    if (this.connectionOpened) {
      this.connectionOpened = false

      this.flushCellsData()

      this.reset()
      console.log('closed')
      if (!this.closedByUser) {
        this.connect()
      }

    }
  }
  closeConnection() {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onclose = null;
      try {
        this.socket.close();
      } catch (error) { }
      this.socket = null;
      this.ws = null;

      this.flushCellsData()

      this.reset()

      this.closedByUser = true

    }
  }
  flushCellsData() {
    this.isSpectateEnabled = false
    this.isFreeSpectate = false;
    this.ghostCells = [];
    //this.indexedCells = {};
    //this.deletefromObject("indexedCells")
    //this.cells = [];
    //this.deleteFromArray("cells")
    //this.playerCells = [];
    //this.playerCellIDs = [];
    //this.food = [];
    //this.viruses = [];
    //this.deleteFromArray("viruses")
    // for (let cell of Object.values(application.tabs[CT["master"]].indexedCells)) {
    //   if (cell.spectator == this.number) {
    //     cell.removeCell();
    //   }
    // }
    this.clientDummy.flushCellsData();
  }
  isSocketOpen() {
    return this.socket !== null && this.socket.readyState === this.socket.OPEN;
  }
  createView(value) {
    return new DataView(new ArrayBuffer(value));


  }
  sendBuffer(data) {
    this.socket.send(data.buffer);
  }
  sendMessage(message) {
    if (this.connectionOpened /*&& this.integrity*/) {
      if (!this.clientKey) {
        return;
      }
      message = this.shiftMessage(message, this.clientKey);
      this.clientKey = this.shiftKey(this.clientKey);
    }
    this.sendBuffer(message);

  }
  sendAction(action) {
    if (!this.isSocketOpen()) {
      return;
    }
    const view = this.createView(1);
    view.setUint8(0, action);
    this.sendMessage(view);

  }
  convertX(x) {
    return ((x + application.tabs[CT["master"]].mapOffsetX) * this.fixX - this.mapOffsetX) / this.mapShrinkW;
  }
  convertY(y) {
    return ((y + application.tabs[CT["master"]].mapOffsetY) * this.fixY - this.mapOffsetY) / this.mapShrinkH;
  }
  sendCursor() {
    this.positionController = setInterval(() => {
      this.sendPosition(this.convertX(application.tabs[CT["master"]].cursorX), this.convertY(application.tabs[CT["master"]].cursorY));
    }, 50);
    //this.sendSpectate()
    //this.sendFreeSpectate()
  }
  sendSpectate() {
    this.isSpectateEnabled = true
    this.sendAction(1);
  }
  sendFreeSpectate() {
    this.isFreeSpectate = !this.isFreeSpectate
    if (this.staticX == 0) {
      if (this.isFreeSpectate) {
        this.sendCursor()
      } else {
        clearInterval(this.positionController)
      }
    }
    this.sendAction(18);
  }
  sendEject() {
    this.sendPosition(this.convertX(application.tabs[CT["master"]].cursorX), this.convertY(application.tabs[CT["master"]].cursorY));
    this.sendAction(21);
  }
  sendSplit() {
    this.sendPosition(this.convertX(application.tabs[CT["master"]].cursorX), this.convertY(application.tabs[CT["master"]].cursorY));
    this.sendAction(17);
  }
  sendNick(nick) {
    application.tabs[CT["master"]].playerNick = nick;
    var self = this
    var sendSpawn = function (token) {
      nick = window.unescape(window.encodeURIComponent(self.playerNick));
      var view = self.createView(1 + nick.length + 1 + token.length + 1);
      var pos = 1
      for (let length = 0; length < nick.length; length++, pos++) view.setUint8(pos, nick.charCodeAt(length))
      pos++
      for (let length = 0; length < token.length; length++, pos++) view.setUint8(pos, token.charCodeAt(length));
      self.sendMessage(view);
    }
    application.tabs[CT["master"]].integrity && agarCaptcha.requestCaptchaV3("play", function (token) {
      sendSpawn(token)
    });
    !application.tabs[CT["master"]].integrity && sendSpawn('0')
  }
  sendPosition(x, y) {
    if (!this.isSocketOpen() || !this.connectionOpened || (!this.clientKey && this.integrity)) {
      return;
    }
    const view = this.createView(13);
    view.setUint8(0, 16);
    if (this.player == true && !this.active == true) {

      view.setInt32(1, this.targetX, true);
      view.setInt32(5, this.targetY, true);
      console.log(this.targetX, this.targetY)
    } else {

      view.setInt32(1, x, true);
      view.setInt32(5, y, true);
      this.targetX = x;
      this.targetY = y;
    }
    view.setUint32(9, this.protocolKey, true);
    this.sendMessage(view);
  }
  generateClientKey(ip, options) {
    if (!ip.length || !options.byteLength) {
      return null;
    }
    let x = null;
    const Length = 1540483477;
    const ipCheck = ip.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2];
    const newLength = ipCheck.length + options.byteLength;
    const uint8Arr = new Uint8Array(newLength);
    for (let length = 0; length < ipCheck.length; length++) {
      uint8Arr[length] = ipCheck.charCodeAt(length);
    }
    uint8Arr.set(options, ipCheck.length);
    const dataview = new DataView(uint8Arr.buffer);
    let type = newLength - 1;
    const value = (type - 4 & -4) + 4 | 0;
    let newValue = type ^ 255;
    let offset = 0;
    while (type > 3) {
      x = Math.imul(dataview.getInt32(offset, true), Length) | 0;
      newValue = (Math.imul(x >>> 24 ^ x, Length) | 0) ^ (Math.imul(newValue, Length) | 0);
      type -= 4;
      offset += 4;
    }
    switch (type) {
      case 3:
        newValue = uint8Arr[value + 2] << 16 ^ newValue;
        newValue = uint8Arr[value + 1] << 8 ^ newValue;
        break;
      case 2:
        newValue = uint8Arr[value + 1] << 8 ^ newValue;
        break;
      case 1:
        break;
      default:
        x = newValue;
        break;
    }
    if (x != newValue) {
      x = Math.imul(uint8Arr[value] ^ newValue, Length) | 0;
    }
    newValue = x >>> 13;
    x = newValue ^ x;
    x = Math.imul(x, Length) | 0;
    newValue = x >>> 15;
    x = newValue ^ x;
    console.log('[SPECT] Generated client key:', x);
    return x;
  }
  shiftKey(key) {
    const value = 1540483477;
    key = Math.imul(key, value) | 0;
    key = (Math.imul(key >>> 24 ^ key, value) | 0) ^ 114296087;
    key = Math.imul(key >>> 13 ^ key, value) | 0;
    return key >>> 15 ^ key;
  }
  shiftMessage(view, key, write) {
    if (!write) {
      for (var length = 0; length < view.byteLength; length++) {
        view.setUint8(length, view.getUint8(length) ^ key >>> length % 4 * 8 & 255);
      }
    } else {
      for (var length = 0; length < view.length; length++) {
        view.writeUInt8(view.readUInt8(length) ^ key >>> length % 4 * 8 & 255, length);
      }
    }
    return view;
  }


  decompressMessage(message) {

    const buffer = window.buffer.Buffer;
    const messageBuffer = new buffer(message.buffer);
    const readMessage = new buffer(messageBuffer.readUInt32LE(1));
    Client.prototype.uncompressBuffer(messageBuffer.slice(5), readMessage);
    return readMessage;

  }


  handleMessage(view) {
    const encode = () => {
      for (var text = ''; ;) {
        const string = view.getUint8(offset++);
        if (string == 0) {
          break;
        }
        text += String.fromCharCode(string);
      }
      return text;
    };
    var offset = 0;
    let opCode = view.getUint8(offset++);
    if (opCode == 54) {
      opCode = 53;
    }
    switch (opCode) {
      case 5:

        console.log('case 5');

        break;
      case 17:

        this.viewX = this.getX(view.getFloat32(offset, true));
        //var x=this.viewX = view.getFloat32(offset, true);
        //this.viewX = window.application.tabs[CT["master"]].vector[window.application.tabs[CT["master"]].vnr][0] ? this.translateX(x) : x;
        offset += 4;
        this.viewY = this.getY(view.getFloat32(offset, true));
        //var y=this.viewX = view.getFloat32(offset, true);
        //this.viewY = window.application.tabs[CT["master"]].vector[window.application.tabs[CT["master"]].vnr][1] ? this.translateY(y) : y;
        offset += 4;
        this.scale = view.getFloat32(offset, true);



        break;
      case 18:
        if (this.protocolKey) {
          this.protocolKey = this.shiftKey(this.protocolKey);
        }
        this.flushCellsData();
        console.log('case 18');

        break;
      case 32:

        console.log('case 32');

        break;
      case 50:
        console.log('case 50');

        break;
      case 53:

        //console.log('case 53');

        break;
      case 54:

        console.log('case 54');
        break;

      case 69:
        var length = view.getUint16(offset, true);
        offset += 2;
        this.ghostCells = [];
        for (let i = 0; i < length; i++) {
          var x = view.getInt32(offset, true);
          offset += 4;
          var y = view.getInt32(offset, true);
          offset += 4;
          var mass = view.getUint32(offset, true);
          offset += 4;
          //false&&console.log(view.getUint8(offset))
          offset += 1

          var size = Math.sqrt(100 * mass);
          this.ghostCells.push({
            'x': x,
            'y': y,
            'size': size,
            'mass': mass,
            'inView': this.isInView(this.getX(x), this.getY(y), size)
          });
        }

        const masterClient = application.tabs[CT["master"]];
        let masterTopPlayerPosition = { x: masterClient.ghostCells[0].x, y: masterClient.ghostCells[0].y };

        // if (masterClient.isSpectateEnabled) {
        //     masterTopPlayerPosition = { x: masterClient.playerX, y: masterClient.playerY };
        // } else masterTopPlayerPosition = (({ x, y }) => ({ x, y }))(masterClient.ghostCells[0]);

        // masterTopPlayerPosition.x += masterClient.mapOffsetX;
        // masterTopPlayerPosition.y += masterClient.mapOffsetY;

        if (!this.ghostFixed
          && this.mapOffsetFixed
          && this.ghostCells.length !== 0
          // && Math.abs(application.getghostX()) > 1000
          // && Math.abs(application.getghostY()) > 1000)
          && Math.abs(masterTopPlayerPosition.x) > 1000
          && Math.abs(masterTopPlayerPosition.y) > 1000) {
          // this.fixX = /*Math.round*/(application.getghostX()/(this.ghostCells[0].x+this.mapOffsetX))<0?-1:1;
          // this.fixY = /*Math.round*/(application.getghostY()/(this.ghostCells[0].y+this.mapOffsetY))<0?-1:1;

          this.fixX = Math.sign(masterTopPlayerPosition.x / (this.ghostCells[0].x + this.mapOffsetX));
          this.fixY = Math.sign(masterTopPlayerPosition.y / (this.ghostCells[0].y + this.mapOffsetY));
          this.ghostFixed = true
          if (this.mapOffsetFixed) this.adjustCoordsAfterFixes();
        }
        break;
      case 85:

        console.log('case 85');


        break;
      case 102:

        console.log('case 102');

        break;
      case 103:

        console.log('case 103');

        break;
      case 104:
        console.log('case 104');

        break;
      case 114:
        console.error('[Agario] Spectate mode is full')
        console.log('case 114');

        break;
      case 160:

        console.log('case 160');

        break;
      case 161:
        //console.log('case 161');

        break;
      case 176:
        console.log('case 176');

        break;
      case 177:
        console.log('case 177');

        break;
      case 178:

        console.log('case 178');

        break;
      case 179:

        console.log('case 179');

        break;
      case 180:

        console.log('case 180');

        break;
      case 226:
        const ping = view.getUint16(1, true);
        view = this.createView(3);
        view.setUint8(0, 227);
        view.setUint16(1, ping);
        this.sendMessage(view);

        break;
      case 241:
        this.protocolKey = view.getUint32(offset, true);
        console.log('[SPECT] Received protocol key:', this.protocolKey);
        const agarioReader = new Uint8Array(view.buffer, offset += 4);
        this.clientKey = this.generateClientKey(this.ws, agarioReader);

        break;
      case 242:
        console.log('242')
        this.serverTime = view.getUint32(offset, true) * 1000;
        this.serverTimeDiff = Date.now() - this.serverTime;

        if (this.player == true) {
          this.active = true
          this.sendCursor()
          this.sendNick()
        } else {
          this.sendSpectate();
        }
        if (this.staticX != null && this.staticY != null) {
          setInterval(() => {
            this.sendPosition(this.convertX(this.staticX), this.convertY(this.staticY));
          }, 200);
          this.sendFreeSpectate()
        }
        break;
      case 255:
        this.handleSubmessage(view);

        break;
      case 16:

        console.log('[SPECT] case 16');

        break;
      case 64:

        console.log('[SPECT] case 64');

        break;
      default:
        console.log('[SPECT] Unknown opcode:', view.getUint8(0));
        break;
    }
  }
  getX(x) {
    if (this.ghostFixed && this.mapOffsetFixed) {
      return (x * this.mapShrinkW + this.mapOffsetX) * this.fixX - application.tabs[CT["master"]].mapOffsetX;
    } else return x;
  }
  getY(y) {
    if (this.ghostFixed && this.mapOffsetFixed) {
      return (y * this.mapShrinkH + this.mapOffsetY) * this.fixY - application.tabs[CT["master"]].mapOffsetY;
    } else return y;
  }
  handleSubmessage(message) {
    message = this.decompressMessage(message);
    let offset = 0;
    switch (message.readUInt8(offset++)) {
      case 16:
        this.updateCells(message, offset);
        break;
      case 64:
        this.viewMinX = (message.readDoubleLE(offset));
        offset += 8;
        this.viewMinY = (message.readDoubleLE(offset));
        offset += 8;
        this.viewMaxX = (message.readDoubleLE(offset));
        offset += 8;
        this.viewMaxY = (message.readDoubleLE(offset));


        this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);

        break;
      default:
        console.log('[SPECT] Unknown sub opcode:', message.readUInt8(0));
        break;
    }
  }
  isInView(x, y) {
    let mtp = AGAR_CONST.VIEWPORT_MULTIPLIER.FREE_SPECTATE,
      w = AGAR_CONST.VIEWPORT_BASE_WIDTH / 2 * mtp,
      h = AGAR_CONST.VIEWPORT_BASE_HEIGHT / 2 * mtp;
    if (x < this.viewX - w || y < this.viewY - h || x > this.viewX + w || y > this.viewY + h) {
      return true;
    }
    return false;
  }
  circleInViewport(x, y, radius = 0, safetyMargin = 0) {
    let effectiveRadius = Math.max(radius - safetyMargin, 0);

    let distX = Math.abs(x - this.viewX);
    let distY = Math.abs(y - this.viewY);

    // Could take Math.abs here, but it is irrelevant for pythagoras
    let distanceToClosestCornerX = distX - AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH_HALF;
    let distanceToClosestCornerY = distY - AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT_HALF;

    /*
     * Middle rectangle is the viewport, regions outside need to be considered,
     * as we are colliding with a circle.
     *         ┌ ─ ─ ─ ─ ─ ─ ─ ─ ┐
     *       C |        B        | C
     *    ┌ ─ ─┌─────────────────┐─ ─ ┐
     *    |    │                 │    |
     *    |  A │      A & B      │ A  |
     *    |    │                 │    |
     *    └ ─ ─└─────────────────┘─ ─ ┘
     *       C |        B        | C
     *         └ ─ ─ ─ ─ ─ ─ ─ ─ ┘
     * 
     * Yes, i was having fun with box drawing.
     */

    // Case for any region A
    if (  distX <= AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH_HALF + effectiveRadius
      &&  distY <= AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT_HALF)
      return true;

    // Case for any region B
    if (distX <= AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH_HALF
      && distY <= AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT_HALF + effectiveRadius)
      return true;

    // Corner would be the first to hit a circle in any C region, check whether distance is smaller than radius
    return (distanceToClosestCornerX * distanceToClosestCornerX + distanceToClosestCornerY * distanceToClosestCornerY <= (effectiveRadius * effectiveRadius));
  }
  circleInViewportOfEarlierSpectator(x, y, radius = 0, safetyMargin = 0) {
    if (this.row > 0 && this.grid[this.row - 1][this.column].circleInViewport(x, y, radius, safetyMargin)) return true;
    if (this.column > 0 && this.grid[this.row][this.column - 1].circleInViewport(x, y, radius, safetyMargin)) return true;
    if (this.row > 0 && this.column > 0 && this.grid[this.row - 1][this.column - 1].circleInViewport(x, y, radius, safetyMargin)) return true;
    return false;
  }
  setMapOffset(left, top, right, bottom) {
    if (!this.integrity || (right - left) > 14000 && (bottom - top) > 14000) {
      this.mapShrinkW = AGAR_CONST.MAP_EDGE_LENGTH / (right - left);
      this.mapShrinkH = AGAR_CONST.MAP_EDGE_LENGTH / (bottom - top);
      left = left * this.mapShrinkW;
      right = right * this.mapShrinkW;
      top = top * this.mapShrinkH;
      bottom = bottom * this.mapShrinkH;

      this.mapOffsetX = (this.mapOffset) - right;
      this.mapOffsetY = (this.mapOffset) - bottom;
      this.mapMinX = -this.mapOffset - this.mapOffsetX;
      this.mapMinY = -this.mapOffset - this.mapOffsetY;
      this.mapMaxX = this.mapOffset - this.mapOffsetX;
      this.mapMaxY = this.mapOffset - this.mapOffsetY;
      this.mapMidX = (this.mapMaxX + this.mapMinX) / 2;
      this.mapMidY = (this.mapMaxY + this.mapMinY) / 2;
      if (!this.mapOffsetFixed) {
        this.viewX = (right + left) / 2;
        this.viewY = (bottom + top) / 2;
      }
      this.mapOffsetFixed = true;
      if (this.ghostFixed) this.adjustCoordsAfterFixes();
      console.log('[SPECT] Map offset fixed (x, y):', this.mapOffsetX, this.mapOffsetY);
    }
  }
  adjustCoordsAfterFixes(){
    if (this.adjustedCoords) {
      console.log("Tried to adjust coords, although that already happened.");
      return;
    }
    for (let cell of this.clientDummy.cells) {
      cell.targetX = cell.x = this.getX(cell.x);
      cell.targetY = cell.y = this.getY(cell.y);
    }
    this.adjustedCoords = true;
  }
  /*translateX(x) {
      return this.mapMaxX - (x - this.mapMinX);
  }
  translateY(x) {
      return this.mapMaxY - (x - this.mapMinY);
  }
  untranslateX(x) {
      return 0 - (x - this.mapMaxX + this.mapMinX);
  }
  untranslateY(x) {
      return 0 - (x - this.mapMaxY + this.mapMinY);
  }	*/
  updateCells(view, offset) {
    const encode = () => {
      for (var text = ''; ;) {
        const string = view.readUInt8(offset++);
        if (string == 0) {
          break;
        }
        text += String.fromCharCode(string);
      }
      return text;
    };
    this.time = Date.now();
    this.removePlayerCell = false;
    let eatEventsLength = view.readUInt16LE(offset);
    offset += 2;
    for (var length = 0; length < eatEventsLength; length++) {
      const eaterID = this.clientDummy.indexedCells[this.newID(view.readUInt32LE(offset))];
      const victimID = this.clientDummy.indexedCells[this.newID(view.readUInt32LE(offset + 4))];
      //console.log('victim isFood',victimID.isFood)
      offset += 8;
      if (eaterID && victimID) {
        victimID.targetX = eaterID.x;
        victimID.targetY = eaterID.y;
        victimID.targetSize = victimID.size;
        victimID.time = this.time;
        victimID.removeCell();
      }
    }

    //snez
    var mapX = application.tabs[CT["master"]].mapMaxX - application.tabs[CT["master"]].mapMinX;
    var mapY = application.tabs[CT["master"]].mapMaxY - application.tabs[CT["master"]].mapMinY;
    var maxX = Math.round(mapX / application.tabs[CT["master"]].zoomValue / 10);
    var maxY = Math.round(mapY / application.tabs[CT["master"]].zoomValue / 10); //or 1

    for (length = 0; ;) {
      var id = view.readUInt32LE(offset);
      offset += 4;
      if (id == 0) {
        break;
      }
      let x = view.readInt32LE(offset);
      offset += 4;
      let y = view.readInt32LE(offset);
      offset += 4;
      //snez
      x = this.getX(x);
      y = this.getY(y);
      const invisible = this.staticX != null ? this.isInView(x, y) : false;
      var a = x - application.tabs[CT["master"]].playerX;
      var b = y - application.tabs[CT["master"]].playerY;
      var distanceX = Math.round(Math.sqrt(a * a)); // wtf is this, sqrt(a²) is just Math.abs(a)
      var distanceY = Math.round(Math.sqrt(b * b));
      var remove = false;
      if (distanceX > maxX || distanceY > maxY) {
        remove = true;
      }
      //
      const size = view.readUInt16LE(offset);
      offset += 2;
      const flags = view.readUInt8(offset++);
      let extendedFlags = 0;
      if (flags & 128) {
        extendedFlags = view.readUInt8(offset++);
      }
      let color = null,
        skin = null,
        name = '',
        accountID = null;
      if (flags & 2) {
        const r = view.readUInt8(offset++);
        const g = view.readUInt8(offset++);
        const b = view.readUInt8(offset++);
        //snez	
        color = "#bbbbbb";
        //color = defaultSettings.miniMapGhostCellsColor;			  
        /*if(defaultmapsettings.oneColoredSpectator) {
          color = application.tabs[CT["master"]].rgb2Hex(255, 255, 255);
        } else {
          color = application.tabs[CT["master"]].rgb2Hex(~~(r * 0.9), ~~(g * 0.9), ~~(b * 0.9));
        }*/
      }
      if (flags & 4) {
        skin = encode();
      }
      if (flags & 8) {
        //name = window.decodeURIComponent(window.escape(encode()));				
        name = window.decodeURIComponent(escape(encode()));

      }
      if (flags & 10) {
      }
      const isVirus = flags & 1;
      const isFood = extendedFlags & 1;
      const isFriend = extendedFlags & 2;
      //const invisible = this.staticX!=null?this.isInView(x, y):false;
      id = this.newID(id);
      //snez
      //x = this.getX(x),
      //y = this.getY(y);
      var cell = null;
      if (this.clientDummy.indexedCells.hasOwnProperty(id)) {
        cell = this.clientDummy.indexedCells[id];
        cell.invisible = invisible;

        if (color) {
          cell.color = color;
        }
      }
      else {
        cell = new Cell(id, x, y, size, color, isFood, isVirus, false, settings.shortMass, settings.virMassShots);
        cell.time = this.time;
        cell.spectator = this.number;
        cell.c = this.clientDummy;
        //if (!isFood) {
        if (!isFood && !remove) {
          if (isVirus && settings.virusesRange) {
            this.clientDummy.viruses.push(cell);
          }
          this.clientDummy.cells.push(cell);

        } else {
          //application.tabs[CT["master"]].food.push(cell);
        }
        this.clientDummy.indexedCells[id] = cell;
      }

      if (name) {
        cell.targetNick = name;
      }
      cell.targetX = x;
      cell.targetY = y;
      cell.targetSize = size;
      cell.isFood = isFood;
      cell.isVirus = isVirus;
      //cell.invisible = invisible;
      if (skin) {
        cell.skin = skin;
      }
      if (extendedFlags & 4) {
        accountID = view.readUInt32LE(offset);
        offset += 4;
        cell.accID = accountID;
        //let friend = application.tabs[CT["master"]].fbOnline.find(element => {return element.id == accountID});
        //friend != undefined?cell.fbID = friend.fbId:void(0);
      }
      if (extendedFlags & 2) {
        cell.isFriend = isFriend;
        //console.log('FB friend cell in view', isFriend)
      }
    }
    // var rmaxedX=rmaxedY=rminedX=rminedY=0

    eatEventsLength = view.readUInt16LE(offset);
    offset += 2;
    for (length = 0; length < eatEventsLength; length++) {
      var id = view.readUInt32LE(offset);
      offset += 4;
      cell = this.clientDummy.indexedCells[this.newID(id)];
      if (cell) {
        cell.removeCell();
      }
    }

  }
  newID(id) {
    return id + this.number + 10000000000
  }
}

window.sendAction = action => {
  application.tabs[CT["master"]].sendAction(action);
};
