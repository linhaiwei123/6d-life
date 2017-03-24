cc.Class({
    extends: cc.Component,

    properties: {
        _fsm: null,
        //_player: null,
        _firstTimeFromPlayer: true,

        _left: false,
        _right: false,
        _up: false,
        _down: false,

        _jumping: false,
        jumpY: 40,
        speedX: 5,
        _speedY: 0,
        g: -10,

        _leftBlock: 0,
        _rightBlock: 0,
        _upBlock: 0,
        _downBlock: 0,

        _anim: null,
        _animState : null,
    },

   init: function(event,player,isJump){
        this._anim = this.getComponent(cc.Animation);
        this.node.scaleX = player.scaleX; 
        this.node.name = 'shadow-player#' + Date.now();
        
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.node.on('touch-static',this.onTouchStatic,this);
        this.node.on('touch-squat',this.onTouchSquat,this);
        //this.node.on('touch-danger',this.onTouchDanger,this);


        this._fsm = require('shadow-player-fsm').create();
        this._fsm.onmoving = this.onMoving.bind(this);
        this._fsm.onsquating = this.onSquating.bind(this);
        this._fsm.onidling = this.onIdling.bind(this);
        this._fsm.onjumping = this.onJumping.bind(this);
        //this._fsm.ondying = this.onDying.bind(this);

        this._fsm.startup();

        //todo 
        //set the dir of moving or facing
        //this._player = player;
        this._fsm[event]();
        if(isJump!=undefined && isJump){
            this._fsm.jump();
        }

        
    },

    onTouchStatic: function(e){
        //[fix] when jump and hit the wall ,we should turn back
        //if(this._fsm.current == 'moving'){
            if(e.detail == 'leftBlock'){
                //to right
                this.node.scaleX = 1;
            }else if(e.detail == 'rightBlock'){
                //to left
                this.node.scaleX = -1;
            }
            //this.node.scaleX = -this.node.scaleX;
            this.onMoving();
        //}
    },

    onTouchSquat: function(){
        if(this._fsm.current == 'moving'){
            this._fsm.jump();
        }
    },

    // onTouchDanger: function(){
    //     //opt anim of dead
    //     this.node.removeFromParent();
    // },

    onJumping: function(){
        //todo anim of jump
        this.changeAnim();
        this._up = true;
        this._jumping = true;
    },

    onIdling: function(){
        //todo anim of idle
        this.changeAnim();
    },

    onSquating: function(){
        //todo anim of squat
        this.changeAnim();
    },

    onMoving: function(){
        //todo anim of moving
        this.changeAnim();
        //this.node.scaleX = this.player.scaleX;
        if(this.node.scaleX > 0){
            //right
            this._right = true;
            this._left = false;
        }else{
            this._left = true;
            this._right = false;
        }
    },

    onCollisionEnter: function(other,self){  
        let selfState = self.node.getComponent('shadow-player-control')._fsm.current;
        if(other.node.group == 'shadow-player'){   
            let otherState = other.node.getComponent('shadow-player-control')._fsm.current;
            if(selfState == 'moving' && otherState == 'idling'){
                //this.node.emit('onTouchStatic');
                this.blockCheck(other,self,true);
            }else if(selfState == 'moving' && otherState == 'squating'){
                this.node.emit('touch-squat');
            }
        }
        else if(other.node.group == 'wall'){
            if(selfState == 'moving' || selfState == 'jumping'){
                //this.node.emit('onTouchStatic');
                this.blockCheck(other,self,true);
            }else{
                this.blockCheck(other,self)
            }
        //[modify] shadow-player touch with player cause the error block
        // }else if(other.node.group == 'player'){
        //     if(this._firstTimeFromPlayer){
        //         this._firstTimeFromPlayer = false;
        //     }else if(selfState == 'moving'){
        //             //this.node.emit('onTouchStatic');
        //             this.blockCheck(other,self,true);
        //         }else{
        //             this.blockCheck(other,self)
        //         }
        }  
        // }else if(other.node.group == 'danger'){
        //     this.node.emit('touch-danger');
        // }
    },

    blockCheck: function(other,self,isTurnBack){
        if(other.node.group == 'btn' || other.node.group == 'toggle'|| other.node.group == 'gate' || other.node.group == 'danger'){
            return;
        }
        let blockArray = [];
        let selfAabb = self.world.aabb;
        let otherAabb = other.world.aabb;
        let selfPreAabb = self.world.preAabb;
        let otherPreAabb = other.world.preAabb;

        //[fix] two way block

        if(selfPreAabb.xMax <= otherAabb.xMin && selfAabb.xMax >= otherAabb.xMin){
            //right block
            //console.log('right');
            let worldPositionX = selfAabb.center.x - Math.abs(otherAabb.xMin - selfAabb.xMax);
            this.node.x = this.node.parent.convertToNodeSpaceAR(cc.v2(worldPositionX,0)).x;
            let distance = Math.abs(otherAabb.xMin - selfAabb.xMax);
            //blockArray.push({direction:"_rightBlock",distance: distance});
            blockArray['rightBlock'] = distance;
            //this._rightBlock++;
            if(isTurnBack!= undefined && isTurnBack){
                this.node.emit('touch-static','rightBlock');
            }
        }
        if(selfPreAabb.xMin >= otherAabb.xMax && selfAabb.xMin <= otherAabb.xMax){
            //left block
            //console.log('left');
            let worldPositionX = selfAabb.center.x  +  Math.abs(otherAabb.xMax - selfAabb.xMin);
            this.node.x = this.node.parent.convertToNodeSpaceAR(cc.v2(worldPositionX,0)).x;
            let distance = Math.abs(otherAabb.xMax - selfAabb.xMin);
            //blockArray.push("_leftBlock");
            blockArray['leftBlock'] = distance;
            //this._leftBlock++;
            //[todo] delay after fix two way block
             if(isTurnBack!= undefined && isTurnBack){
                this.node.emit('touch-static','leftBlock');
            }   
        }
        if(selfPreAabb.yMax <= otherAabb.yMin && selfAabb.yMax >= otherAabb.yMin){
            //up block
            //console.log('up');
            let worldPositionY = selfAabb.center.y - Math.abs(otherAabb.yMin - selfAabb.yMax);
            this.node.y = this.node.parent.convertToNodeSpaceAR(cc.v2(0,worldPositionY)).y;
            let distance = Math.abs(otherAabb.yMin - selfAabb.yMax);
            blockArray['upBlock'] = distance;
            //blockArray.push("_upBlock");
            //this._upBlock++;
        }
        if(selfPreAabb.yMin >= otherAabb.yMax && selfAabb.yMin <= otherAabb.yMax){
            //down block
            //console.log('down');
            let worldPositionY = selfAabb.center.y + Math.abs(otherAabb.yMax - selfAabb.yMin);
            this.node.y = this.node.parent.convertToNodeSpaceAR(cc.v2(0,worldPositionY)).y;
            let distance = Math.abs(otherAabb.yMin - selfAabb.yMax);
            //blockArray.push("_downBlock");
            blockArray['downBlock'] = distance;
            //this._downBlock++;
            this._jumping = false;
        }

        if(other.blockArrays == undefined){
            other.blockArrays = [];
        }
        let filterBlockArray = [];
        if(blockArray['upBlock']!= undefined && blockArray['downBlock']!=undefined){
            if(blockArray['upBlock'] < blockArray['downBlock']){
                filterBlockArray.push('_upBlock');
                this._upBlock++;
            }else{
                filterBlockArray.push('_downBlock');
                this._downBlock++;
            }
        }else if(blockArray['upBlock']!=undefined){
             filterBlockArray.push('_upBlock');
             this._upBlock++;
        }else if(blockArray['downBlock']!=undefined){
             filterBlockArray.push('_downBlock');
             this._downBlock++;
        }
        if(blockArray['leftBlock']!= undefined && blockArray['rightBlock']!=undefined){
            if(blockArray['leftBlock'] < blockArray['rightBlock']){
                filterBlockArray.push('_leftBlock');
                this._leftBlock++;
            }else{
                filterBlockArray.push('_rightBlock');
                this._rightBlock++;
            }
        }else if(blockArray['leftBlock']!=undefined){
             filterBlockArray.push('_leftBlock');
             this._leftBlock++;
        }else if(blockArray['rightBlock']!=undefined){
             filterBlockArray.push('_rightBlock');
             this._rightBlock++;
        }

        //other.blockArrays[this.node.name] = blockArray;
        other.blockArrays[this.node.name] = filterBlockArray;
    },

    onCollisionExit: function(other,self){
        if(other.node.group == 'btn' || other.node.group == 'toggle'|| other.node.group == 'gate' || other.node.group == 'danger'){
            return;
        }
        if(other.blockArrays && other.blockArrays[this.node.name] != undefined){
            let blockArray = other.blockArrays[this.node.name]
            for(let item of blockArray){
                this[item]--;
            }
        }
    },

     changeAnim: function(){
        //check squat
        if(this._fsm.current == 'squating'){
            if(!this._animState || this._animState.name !== 'squat'){
                this._anim.stop();
                this._animState = this._anim.play('squat');
            }
        }
        //check jump
        else if(this._jumping){
            if(!this._animState || this._animState.name !== 'jump'){
                this._anim.stop();
                this._animState = this._anim.play('jump');
            }
        }
        //check move
        else if(this._fsm.current=='moving'){
               if(!this._animState || this._animState.name !== 'move'){
                    this._anim.stop();
                    this._animState = this._anim.play('move');
               }
           }
        //check idle
        else if(this._fsm.current=='idling'){
                    if(!this._animState || this._animState.name !== 'idle'){
                        this._anim.stop();
                        this._animState = this._anim.play('idle');
                    }
                }
    },

    update: function(dt){
        //console.log(this._fsm.current);
        if(this._left && !this._leftBlock){this.node.x -= this.speedX};
        if(this._right && !this._rightBlock){this.node.x += this.speedX};
        
        if(!this._downBlock){
            this._speedY += this.g * dt;
        }else{
            //downBlock
            this._speedY = 0;
            this._jumping = false;
            
            if(this._fsm.can('move')){
                this._fsm.move();
            }
            
        }
        if(this._up){
            this._speedY = this.jumpY;
            this._up = false;
            this._jumping = true;
            
        }
        let currentSpeedY = this._speedY;
        if(!!this._upBlock){
            currentSpeedY = Math.min(this._speedY,0);
        }
        this.node.y += currentSpeedY * dt;
    }

});
