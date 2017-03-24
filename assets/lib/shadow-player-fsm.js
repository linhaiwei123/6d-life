let StateMachine = require('state-machine');
let fsmData = {
initial: 'nope',
//please select the enter-state here ↓
events: [
{"name":"startup","from":"nope","to":"configing"},
{"name":"idle","from":"configing","to":"idling"},
{"name":"move","from":"configing","to":"moving"},
{"name":"squat","from":"configing","to":"squating"},
{"name":"jump","from":"moving","to":"jumping"},
{"name":"move","from":"jumping","to":"moving"},
// {"name":"dead","from":"jumping","to":"dying"},
// {"name":"dead","from":"squating","to":"dying"},
// {"name":"dead","from":"moving","to":"dying"},
// {"name":"dead","from":"idling","to":"dying"}
]
};
let create = function(){
let fsm = StateMachine.create(fsmData);
fsm.ASYNC = StateMachine.ASYNC;
return fsm;
}
module.exports = {create}