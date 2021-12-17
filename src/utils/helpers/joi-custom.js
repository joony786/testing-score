export default class Joi_sd {
    constructor (schema) { 
        this.schema = schema;
        this.schema = this.parseSchema(this.schema);
    }
    parseSchema (toArraySchema) {
        let tmpSchema = [];
        for(let i in toArraySchema) {
            tmpSchema.push(i)
        }
        return tmpSchema;
    }
    validate(passedSchema) {
        let schemaCount = this.schema.length,
            passedCount = 0;
        try {
            for(let i in passedSchema) {
                if(this.schema.includes(i)) {
                    passedCount++;
                    //console.log(i);
                }
            }
            if(schemaCount > passedCount) {
                throw "invalid schema";
            }
            else {
                return true;
            }
        }
        catch (err) {
            return false;
        }
    }
}