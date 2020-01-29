module.exports = class AsyncEvents {

    constructor(){

        this._data = {

        };

    }

    async emit (name, data){

        if (this._data[name]){

            const calls = this._data[name];

            for (const key in calls){

                if (key === "count") continue;
                await calls[key].cb(data);

                if (calls[key].once)
                    delete calls[key];
            }

        }

    }

    on(name, cb){

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

