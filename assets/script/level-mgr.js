cc.Class({
    extends: cc.Component,

    properties: {
        level: 0,
        _sceneLoading: false,
    },

    onLoad: function(){
        this.node.on('touch-gate',this.nextLevel,this);
        this.node.on('player-touch-danger',this.restart,this);
        this.node.on('restart',this.restart,this);
    },

    restart: function(){
        if(!this._sceneLoading){
            this._sceneLoading = true;
            let restartLevelName = 'level-' + (this.level) + '-scene';
            cc.director.loadScene(restartLevelName);
        }
    },

    nextLevel: function () {
        if(!this._sceneLoading){
            this._sceneLoading = true;
            let nextLevelName = 'level-' + (this.level + 1) + '-scene';
            cc.director.loadScene(nextLevelName);
        }
    },



});
