module.exports = class AsyncEvents {

    constructor(){

        this._data = {

        };

    }

    async emit (name, data){

        if (!this._data[name]) return;

        const calls = this._data[name];

        const out = [];

        for (const key in calls){

            if (key === "count") continue;

            if (typeof calls[key].cb === "function") {
                const result = await calls[key].cb(data);
                out.push(result);
            }
            else
                console.error("calls[key].cb is not a function", name, data, calls[key].cb);

            if (calls[key].once)
                delete calls[key];
        }

        if (out.length === 0) return undefined;
        if (out.length === 1) return out[1];
        return out;
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

