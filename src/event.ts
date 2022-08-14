export class Event{
    private content: any
    private time: number

    public get_content(): any {
        return this.content
    }

    public get_time(): any {
        return this.time
    }
    
    constructor(c:any, n:number){
        this.content = c
        this.time = n
    }

    toString(): string{
        return `content: ${this.content.toString()}, time: ${this.time.toString()}`
    }

}