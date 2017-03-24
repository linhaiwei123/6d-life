cc.Class({
    extends: cc.Component,

    properties: {
        _isSpaceRelease: true,
        _moveControl: null,
        // _canvas: {
        //     get: function(){
        //         return cc.find('Canvas');
        //     }
        // },
        shadowPlayerPrefab: cc.Prefab,
    },

    onLoad: function () {
        this._moveControl = this.node.getComponent('move-control');
        cc.systemEvent.on('keydown',this.onKeyDown,this)
        cc.systemEvent.on('keyup',this.onKeyUp,this)
    },

    onKeyDown: function(e){
        if(e.keyCode == cc.KEY.s){
            if(this._isSpaceRelease){
                this._isSpaceRelease = false;
                this.generate();
            }
        }
    },

    onKeyUp: function(e){
        if(e.keyCode == cc.KEY.s){
            this._isSpaceRelease = true;
            //this.generate();
        }
    },

    generate: function(){
        if(this._moveControl._leftBlock || this._moveControl._rightBlock){return;}

        //squating
        if(!!this._moveControl._down){
            this.generateSquat();
        }
        //jump moving
        else if(!!this._moveControl._jumping){
            this.generateMove(true); 
        }
        //moving
        else if(!!this._moveControl._left==true && !!this._moveControl._right == false ||
           !!this._moveControl._left==false && !!this._moveControl._right == true ){
           this.generateMove(false);
        }
        //idling
        else if(!!this._moveControl._left==true && !!this._moveControl._right == true ||
           !!this._moveControl._left==false && !!this._moveControl._right == false ){
            this.generateIdle();
        }
        
    },

    setShadowPlayerToScene: function(shadowPlayer){
        shadowPlayer.parent = this.node.parent;
        shadowPlayer.position = cc.pAdd(this.node.position,cc.v2(0,10));
    },

    generateSquat: function(){
        let shadowPlayer = cc.instantiate(this.shadowPlayerPrefab);
        shadowPlayer.getComponent('shadow-player-control').init('squat',this.node);
        this.setShadowPlayerToScene(shadowPlayer);
    },

    generateMove: function(isJump){
        let shadowPlayer = cc.instantiate(this.shadowPlayerPrefab);
        shadowPlayer.getComponent('shadow-player-control').init('move',this.node,isJump);
        this.setShadowPlayerToScene(shadowPlayer);
    },

    generateIdle: function(){
        let shadowPlayer = cc.instantiate(this.shadowPlayerPrefab);
        shadowPlayer.getComponent('shadow-player-control').init('idle',this.node);
        this.setShadowPlayerToScene(shadowPlayer);
    }

});
