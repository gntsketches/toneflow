
[–]cutety 3 points 5 hours ago*
I'm unfamiliar with the Keypress library itself, however I have thought about this exact same problem in passing a few times, so I can give you a rough example of how I would solve it, and hopefully it'll help you in your app.

So, the basic problem is you have contextual keybindings that you need to unbind and rebind depending on where the user is focused on the webpage. And, looking over Keypress's docs reveals it has two functions that will make this fairly easy register_many & unregister_many.

Basically, you'll want to store which keybindings are currently bound, and when the user's focus changes to a new keybinding context, unregister the current keybindings, and register the new context's keybindings.

In some quick and dirty code:

const listener = new window.keypress.Listener();

let currentCtxKeybindings;
const contextKeybindings = {
  "note-entry": [{ keys: "ctrl c", /* omitted */ }],
  "playback-options": [{ keys: "ctrl c", /* omitted */ }],
};

["note-entry", "playback-options"].forEach(context => {
  const el = document.getElementById(context);
  const keybindings = contextKeybindings[context];

  el.addEventListener("click", () => {
    if (currentCtxKeybindings) listener.unregister_many(currentCtxKeybindings);

    listener.register_many(keybindings);
    currentCtxKeybindings = keybindings;
  });
});

Now when either of those elements are clicked, it will unregister the other's keybindings and then register it's own. This can be modified to then store the contexts and the current keybindings in a central store if you're using something like React/Redux or Vue/Vuex.
