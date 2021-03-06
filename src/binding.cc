#include <node.h>
#include <nan.h>
#include <uv.h>
#include <stdio.h>

using namespace node;
using v8::FunctionTemplate;
using v8::Function;

using v8::String;

uv_timer_t timer;
bool dirty = false;
Nan::Callback *tickCallback;

static void tick(uv_timer_t* handle) {
  Nan::HandleScope scope;

  // TODO: use the shared ArrayBuffer trick to determine
  //       whether we should call into JS or not.

  tickCallback->Call(0, 0);
}

NAN_METHOD(Emit) {
  uv_timer_init(uv_default_loop(), &timer);
  uv_timer_start(&timer, tick, 16, 16);

  tickCallback = new Nan::Callback(info[0].As<Function>());
}

NAN_METHOD(Dirty) {
  dirty = true;
}

NAN_METHOD(Destroy) {
  uv_timer_stop(&timer);
  uv_unref((uv_handle_t *)&timer);
}

NAN_MODULE_INIT(InitAll) {
  Nan::Set(
    target,
    Nan::New<String>("emit").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(Emit)).ToLocalChecked()
  );

  Nan::Set(
    target,
    Nan::New<String>("dirty").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(Dirty)).ToLocalChecked()
  );

  Nan::Set(
    target,
    Nan::New<String>("destroy").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(Destroy)).ToLocalChecked()
  );
}

NODE_MODULE(binding, InitAll)
