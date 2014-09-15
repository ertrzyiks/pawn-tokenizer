#include <amxmodx>

#define DISPLAY_MSG // Comment to disable message on join

#define PLUGIN "New Plug-In"
#define VERSION "1.0"
#define AUTHOR "someone"

public plugin_init() {
    register_plugin(PLUGIN, VERSION, AUTHOR);
}
