cc.Class({
    extends: cc.Component,
    
    editor: {
        requireComponent: cc.Label,
    },

    properties: {
       fadeDuration: 1,
       delay: 4,
       onActionEnd: cc.Component.EventHandler,
       tips: [cc.String],
       _times: 0,
    },

    onLoad: function () {
        //this.preAction();
        this.nextTips();
    },

    preAction: function(){
        this.node.opacity = 0;
        this.node.runAction(cc.sequence(
            cc.fadeIn(this.fadeDuration),
            cc.delayTime(this.delay),
            cc.fadeOut(this.fadeDuration),
            cc.callFunc(this.actionEnd.bind(this))
        )); 
    },

    actionEnd: function(){
        //cc.find('Canvas').emit('action-end',this.eventInfo);
        //console.log(this.onActionEnd);
        this.onActionEnd.emit();
    },

    nextTips: function(){
        if(this._times == this.tips.length){return;}
        let tipsString = this.tips[this._times];
        this._times++;
        this.getComponent(cc.Label).string = tipsString;
        this.preAction();
    },

});
