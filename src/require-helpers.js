
// absolute require support (as alternative for relative requiring)
global.absRequire = function(name) {
    return require(__dirname + '/' + name);
}
