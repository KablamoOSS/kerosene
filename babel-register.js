/**
 * This file needs to Vanilla JavaScript that can be executed in the current Node environment as Babel cannot know what
 * transformations it would need to apply before reading this file
 */

require("@babel/register")({
  extensions: [".js", ".ts"],
});

require("core-js/features/array/flat");
require("core-js/features/array/flat-map");
