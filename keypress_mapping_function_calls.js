
var listener = new window.keypress.Listener();


//////////////////////////////////////////////////////////////

listener.simple_combo("shift s", function() {
   console.log("You pressed shift and s");
});

Listener.prototype.simple_combo = function(keys, callback) {
  return this.register_combo({
   keys: keys,
    on_keydown: callback
  });
};

Listener.prototype.register_combo = function(combo_dictionary) {
  console.log('combo_dictionary', combo_dictionary);
  var combo, property, value, _ref;
  if (typeof combo_dictionary["keys"] === "string") {
    combo_dictionary["keys"] = combo_dictionary["keys"].split(" ");
  }
  _ref = this._defaults;
  for (property in _ref) {
    if (!__hasProp.call(_ref, property)) continue;
    value = _ref[property];
    if (combo_dictionary[property] === void 0) {
      combo_dictionary[property] = value;
    }
  }
  combo = new Combo(combo_dictionary);
  if (_validate_combo(combo)) {
    this._registered_combos.push(combo);
    return combo;
  }
};

Combo = (function() {
  function Combo(dictionary) {
    console.log('combo dictionary', dictionary)
    var property, value;
    // Copy over any non-false values
    for (property in dictionary) {
      if (!__hasProp.call(dictionary, property)) continue;
      value = dictionary[property];
      if (value !== false) {
        this[property] = value;
      }
    }
    // Standard Defaults
    this.keys = this.keys || [];
    this.count = this.count || 0;
  }

  Combo.prototype.allows_key_repeat = function() {
    // Combos with keydown functions should be able to rapid fire
    // when holding down the key for an extended period
    return !this.prevent_repeat && typeof this.on_keydown === "function";
  };

  Combo.prototype.reset = function() {
    this.count = 0;
    // HMMM:
      // this is both returning and assigning?
      // and why is it returning?
      // Elliot: this bad code. It's transpile weirdness.
      return this.keyup_fired = null;
  };

  return Combo;

})();


// and _validate_combo, which looks not-fun to read.

/* QUESTIONS:

- when is the callback called? (_fire?)


BREAKING DOWN HOW TO UNDERSTAND THIS:
- Folding all and memorizing the categories
- Folding functions and memorizing the function names
- Sumarizing functions:
    - what other functions do they call?
    - what upper-scope variables do they modify?
    - what do they return?
    - general English-language summary of what this does
3 lines of 'entering the maze':
- Initialization of Listener
- Registration of Combos
- activation of key events


*/

///////////////


_change_keycodes_by_browser = function() {
_compare_arrays = function(a1, a2) {
_compare_arrays_sorted = function(a1, a2) {
_convert_key_to_readable = function(k) {
_convert_to_shifted_key = function(key, e) {
_decide_meta_key = function() {
_filter_array = function(array, callback) {
_index_of_in_array = Array.prototype.indexOf || function(a, item) {
_is_array_in_array = function(a1, a2) {
_is_array_in_array_sorted = function(a1, a2) {
_key_is_valid = function(key) {
_log_error = function() {
_validate_combo = function(combo) {
