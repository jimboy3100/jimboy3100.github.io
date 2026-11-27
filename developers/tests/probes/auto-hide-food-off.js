// Settings > Food > Auto hide food - mass turned off: the food it hid (over 1000 mass, or when
// spectating) is drawn again at once. It stayed hidden until the next Play, so the switch seemed
// to do nothing. Food hidden by the player (Show / hide food key) stays hidden.
(async () => {
  var fail = [], info = {}, ms = window.defaultmapsettings, A = window.application;
  var L = window.legendmod, R = window.drawRender;
  if (!L || !R || typeof R.drawFood !== 'function' || !A) return { fail: ['game objects missing'], info: info };
  var cb = document.getElementById('autoHideFood');
  if (!cb || cb.type !== 'checkbox') return { fail: ['no Auto hide food switch in Settings'], info: info };
  var keep = { on: ms.autoHideFood, show: L.showFood, hidden: L.foodIsHidden, mass: L.playerMass, auto: L._lmFoodAutoHid };
  var flip = function (on) { cb.checked = on; cb.dispatchEvent(new Event('change', { bubbles: true })); };
  try {
    L.showFood = true; L.foodIsHidden = false; L._lmFoodAutoHid = false;
    flip(true);
    /* a frame of a player over 1000 mass: the food draw hides the food */
    L.playerMass = 1500;
    R.drawFood();
    info.hiddenByMass = L.showFood === false;
    if (L.showFood !== false) fail.push('Auto hide food on, 1500 mass: food not hidden');
    flip(false);
    info.afterOff = L.showFood;
    if (L.showFood !== true) fail.push('Auto hide food turned off: the food it hid is still hidden');
    if (ms.autoHideFood !== false) fail.push('setting not stored off');
    /* on again in the same life: hidden again over 1000 mass */
    flip(true);
    R.drawFood();
    if (L.showFood !== false) fail.push('Auto hide food on again, 1500 mass: food not hidden again');
    flip(false);
    /* hidden by the player's key: turning the switch off leaves it hidden */
    L.playerMass = 0;
    flip(true);
    A.setShowFood();
    info.keyHidden = L.showFood;
    flip(false);
    if (L.showFood !== false) fail.push('food hidden with the key came back when Auto hide food was turned off');
  } catch (e) {
    fail.push('error: ' + (e && e.message));
  } finally {
    L.playerMass = keep.mass;
    flip(!!keep.on);
    L.showFood = keep.show; L.foodIsHidden = keep.hidden; L._lmFoodAutoHid = keep.auto;
  }
  return { fail: fail, info: info };
})()
