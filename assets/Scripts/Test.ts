
import { _decorator, Component, Node, LabelComponent, systemEvent, SystemEvent, EventKeyboard, KeyCode } from 'cc';
import { PercentValue, Value } from './Value';
const { ccclass, property } = _decorator;


 
@ccclass('Test')
export class Test extends Component {
    
    @property({type:LabelComponent})
    public label:LabelComponent = null;

    private finalString:string = "";

    private health:Value = null;


    start () {
        // [3]
        systemEvent.on(SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);


        this.health = new Value();
        this.health.InitFromBasicTable(false,100,[],100,100,300,0,[]);
    }

    update (deltaTime: number) {
        // [4]
        this.health.ValueTimerCount(deltaTime);
        
        this.onSpaceButtonDown();
    }

    onKeyDown(e:EventKeyboard)
    {
        switch(e.keyCode)
        {
            case KeyCode.SPACE:
                this.onSpaceButtonDown();
                break;
            case KeyCode.NUM_1:
                this.onOneButtonDown();
                break;
            case KeyCode.NUM_2:
                this.onTwoButtonDown();
                break;
            case KeyCode.NUM_3:
                this.onTreeButtonDown();
                break;
            case KeyCode.NUM_4:
                this.onFourButtonDown();
                break;
            default:
                break;
        }
    }

    onSpaceButtonDown()
    {
        this.label.string = `OriginalValue: ${this.health.originalValue};  BasicValue: ${this.health.basicValue};\nMaxValue: ${this.health.maxValue};    MinValue: ${this.health.minValue};\nCurrentHealth: ${this.health.currentValue}`
    }

    onOneButtonDown()
    {
        var p:PercentValue = new PercentValue(0.5,false,this.health,3);
        this.health.AddPercentValueToList(p);
    }

    onTwoButtonDown()
    {
        var p:PercentValue = new PercentValue(-0.2,true,this.health,3);
        this.health.AddPercentValueToList(p);
    }

    onTreeButtonDown()
    {
        this.health.ApplyDamage(30);
    }

    onFourButtonDown()
    {
        this.health.ApplyDamage(-30);
    }
}
