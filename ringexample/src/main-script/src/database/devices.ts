import mysql = require('mysql')

export default class Devices{
    private static _instance : Devices;

    connection : mysql.Connection;
    connected: boolean = false;

    constructor(){

        // this.connection = mysql.createConnection({
        //     host: 'localhost',
        //     user: 'ivan',
        //     password: 'ELb8pCtVhHlcIjki',
        //     database: 'ringd',
        // });
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ringd',
        });

        this.connect();
         
    }

    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    public static query(query:string, callback: Function){
        this.instance.connection.query(query, (err:Error, results: Object[], fields:[]) => {

            if(err){
                callback(err);
            }
            else if(results.length===0){
                callback('There is no record');
            }
            else{
                callback(null, results);
            }
        })
    }

    public static escape(id:any){
        return this.instance.connection.escape(id);
    }

    private connect(){
        this.connection.connect((err:mysql.MysqlError) => {
            if(err){
                console.log(err.message);
                return;
            }
            this.connected = true;
            console.log('MySQL Connection stablished!');
            
        })
    }

}
