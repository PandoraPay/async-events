module.exports = class AsyncEvents {

    constructor(){

        this.__data = {

        };

    }

    async emit (name, data){

        if (!this.__data[name]) return;

        const calls = this.__data[name];

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
        if (out.length === 1) return out[0];
        return out;
    }

    on(name, cb){

        if ( !cb || typeof cb !== "function" ) throw "callback is not defined";

        if (!this.__data[name] )
            this.__data[name] = {
                count: 0,
            };

        const count = this.__data[name].count ++ ;
        this.__data[name][count] = {
            cb: cb,
        };

        return () => delete this.__data[name][count]
    }

    once(name, cb){

        if ( !cb || typeof cb !== "function" ) throw "callback is not defined";

        if (!this.__data[name] )
            this.__data[name] = {
                count: 0,
            };

        const count = this.__data[name].count ++ ;
        this.__data[name][count] = {
            cb: cb,
            once: true,
        };

        return () => delete this.__data[name][count]
    }

}

