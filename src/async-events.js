module.exports = class AsyncEvents {

    constructor(){

        this._data = {

        };

    }

    async emit (name, data){

        if (!this._data[name]) return;

        const calls = this._data[name];

        for (const key in calls){

            if (key === "count") continue;

            if (typeof calls[key].cb === "function")
                await calls[key].cb(data);
            else
                console.error("calls[key].cb is not a function", name, data, calls[key].cb);

            if (calls[key].once)
                delete calls[key];
        }

    }

    on(name, cb){

        if ( !cb || typeof cb !== "function" ) throw "callback is not defined";

        if (!this._data[name] )
            this._data[name] = {
                count: 0,
            };

        const count = this._data[name].count ++ ;
        this._data[name][count] = {
            cb: cb,
        };

        return () => delete this._data[name][count]
    }

    once(name, cb){

        if ( !cb || typeof cb !== "function" ) throw "callback is not defined";

        if (!this._data[name] )
            this._data[name] = {
                count: 0,
            };

        const count = this._data[name].count ++ ;
        this._data[name][count] = {
            cb: cb,
            once: true,
        };

        return () => delete this._data[name][count]
    }

}

