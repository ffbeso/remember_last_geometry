// Sometime the leftmost screen doesn't have id 0
// not sure yet how to detect this automatically
var leftMostScreen = 0

// Some setup used by both reading and writing
var dir = mp.utils.split_path(mp.get_script_file())[0]
var scriptName = mp.get_script_name()

var o = {geometry : ""}
mp.options.read_options(o)

// Read last window rect if present
try {
    var {x, y, width, height} = o.geometry.trim().split(' ')
    mp.set_property("screen", leftMostScreen)
    var geometry = width + "x" + height + "+" + x + "+" + y
    mp.set_property("geometry", geometry)
}
catch (e) {
    dump(e)
}

// Save the rect at shutdown
function save_rect() {
    var ps1_script = mp.utils.join_path(dir.replace("scripts/", "script-opts/"), scriptName + ".ps1")
    var output = mp.utils.subprocess({ args: ["powershell", ps1_script, mp.utils.getpid()], cancellable: false }).stdout
    mp.utils.write_file("file://" + dir.replace("s/", "-opts/") + scriptName + ".conf", "geometry=" + output)
}
mp.register_event("shutdown", save_rect)
