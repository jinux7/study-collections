#include <emscripten/emscripten.h>
#include <emscripten/bind.h>

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void call_js() {
        emscripten_run_script("console.log('Hello from C++!')");
    }
}