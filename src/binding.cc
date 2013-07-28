#include <node.h>
#include <uv.h>
#include <stdio.h>
using namespace node;
using namespace v8;

uv_timer_t timer;
bool dirty = false;
Persistent<Function> tickCallback;

static void tick(uv_timer_t* handle, int status) {
  if (dirty) {
    const unsigned argc = 0;
    Local<Value> argv[argc] = {};
    tickCallback->Call(Context::GetCurrent()->Global(), argc, argv);
    dirty = false;
  }
}

Handle<Value> Emit(const Arguments& args) {
  HandleScope scope;

  uv_timer_init(uv_default_loop(), &timer);
  uv_timer_start(&timer, tick, 16, 16);

  tickCallback = Persistent<Function>::New(Handle<Function>::Cast(args[0]));

  return scope.Close(Undefined());
}

Handle<Value> Dirty(const Arguments& args) {
  HandleScope scope;

  dirty = true;

  return scope.Close(Undefined());
}

Handle<Value> Destroy(const Arguments& args) {
  HandleScope scope;

  uv_timer_stop(&timer);
  uv_unref((uv_handle_t *)&timer);

  return scope.Close(Undefined());
}


void init(Handle<Object> exports) {

  exports->Set(String::NewSymbol("emit"),
      FunctionTemplate::New(Emit)->GetFunction());

  exports->Set(String::NewSymbol("dirty"),
      FunctionTemplate::New(Dirty)->GetFunction());

  exports->Set(String::NewSymbol("destroy"),
      FunctionTemplate::New(Destroy)->GetFunction());
}

NODE_MODULE(binding, init)
