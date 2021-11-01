
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


export class Value{
    public originalValue:number = 0;
    public otherValues:number[] = [];
    public basicValue:number = 0;
    public currentValue:number = 0;
    public maxValue:number =0;
    public minValue:number = 0;
    public percentValues:PercentValue[] = [];
    public oldBasicValue:number =0;
    public currentEqualsBasic:boolean = false;

    public InitFromBasicTable(_currentEqualsBasic:boolean,_originalValue:number,_otherValues:number[],_basicValue:number,_currentValue:number,_maxValue:number,_minValue:number,_percentValues:PercentValue[]):void
    {
        this.originalValue = _originalValue;
        this.otherValues = _otherValues.slice();
        this.basicValue = _basicValue;
        this.currentValue = _currentValue;
        this.maxValue = _maxValue;
        this.minValue = _minValue;
        this.percentValues = _percentValues.slice();
        this.currentEqualsBasic = _currentEqualsBasic;
        this.oldBasicValue = this.basicValue;
    }

    public ApplyDamage(damage:number):void{
        this.currentValue +=damage;
        console.log(this.currentValue);
    }

    public InitFromTempTable(_currentEqualsBasic:boolean,_originalValue:number,_otherValues:number[],_basicValue:number,_currentValue:number,_maxValue:number,_minValue:number,_percentValues:PercentValue[]):void
    {
        this.originalValue = _originalValue;
        this.otherValues = _otherValues;
        this.otherValues = _otherValues.slice();
        this.basicValue = _basicValue;
        this.currentValue = _currentValue;
        this.maxValue = _maxValue;
        this.minValue = _minValue;
        this.percentValues = _percentValues.slice();
        this.currentEqualsBasic = _currentEqualsBasic;
        this.oldBasicValue = this.basicValue;
    }

    public UpdateValue():void
    {
        
        this.basicValue = this.originalValue;
        this.otherValues.forEach((val,idx,array)=>{
            this.basicValue +=val;
        });
        //this.oldBasicValue = this.basicValue;
        for(var i:number =0;i<this.percentValues.length;i++)
        {
            var tempNum:number = this.basicValue * this.percentValues[i].GetOriginalValue();
            this.basicValue += tempNum;
            var offset:number = this.AdjustBasicValue();
            if(!(this.currentEqualsBasic))
            {
                var increasementPercent:number = (this.basicValue- this.oldBasicValue)/this.oldBasicValue;
                console.log(`increasementPercent: ${increasementPercent}\ncurrentValue: ${this.currentValue}`);
                if(increasementPercent>0)
                {
                    this.currentValue  += this.currentValue * increasementPercent ;
                    
                }
                else{
                    this.AdjustCurrentValue();
                }
            }
            if(offset != 0)
            {
                this.percentValues[i].SetValidValue(offset/this.oldBasicValue);
            }
            this.oldBasicValue = this.basicValue;
        }
        if(this.currentEqualsBasic)
        {
            this.currentValue = this.basicValue;
        }
    }

    private AdjustCurrentValue():void
    {
        if(this.currentValue>this.basicValue)
        {
            this.currentValue = this.basicValue;
        }
        if(this.currentValue<this.minValue)
        {
            this.currentValue = this.minValue;
        }
    }

    private AdjustBasicValue():number
    {
        
        var tempNum:number = 0;
        if(this.basicValue >this.maxValue)
        {
            tempNum = this.maxValue - this.oldBasicValue;
            this.basicValue = this.maxValue;
        }
        else if(this.basicValue <this.minValue)
        {
            tempNum = -(this.minValue - this.basicValue);
            this.basicValue = this.minValue;
        }
        return tempNum;
    }

    public ValueTimerCount(deltaTime:number)
    {
        for (const val of this.percentValues) {
            if(val.GetTemp())
            {
                val.CounterTime(deltaTime);
            }
        }
    }

    public AddPercentValueToList(percent:PercentValue):void
    {
        this.percentValues.push(percent);
        this.UpdateValue();
    }
    public RemovePercentValueFromList(percent:PercentValue):void
    {
        this.percentValues.some(function(val,idx,array){
            if(val == percent)
            {
                array.splice(idx,1);
            }
        })
        this.UpdateValue();
    }
}

export class PercentValue{
    private originalValue:number =0;
    private validValue:number =0;
    private temp:boolean = false;
    private time:number =0;
    private timer:number =0;
    private value:Value = null;

    public constructor(_originalValue:number,_temp:boolean,_value:Value,_time?:number)
    {
        this.originalValue = _originalValue;
        this.validValue = this.originalValue;
        this.temp = _temp;
        this.value = _value;
        if(this.temp)
        {
            this.time = _time;
        }
        this.timer =0;
    }
    public CounterTime(deltaTime:number)
    {
        if(this.temp)
        {
            this.timer += deltaTime;
            // console.log(this.timer);
            if(this.timer>=this.time)
            {
                this.timer =0;
                this.value.RemovePercentValueFromList(this);
            }
        }
    }
    public GetOriginalValue():number
    {
        return this.originalValue;
    }
    public GetValidValue():number
    {
        return this.validValue;
    }
    public GetTemp():boolean
    {
        return this.temp;
    }
    public SetValidValue(num:number):void
    {
        this.validValue = num;
    }
}