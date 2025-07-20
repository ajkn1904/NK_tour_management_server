import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";


const divisionSchema = new Schema<IDivision>({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String }
}, {
    timestamps: true,
    versionKey: false
})


//for create pre save hook
divisionSchema.pre("save", async function (next) {
    if(this.isModified("name")){
        const baseSlug = this.name.toLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;
        let count = 0;
        while(await Division.exists({slug})){
            slug = `${slug}-${count++}`
        }
        this.slug = slug;
    }
    next();
})

//for update pre hook
divisionSchema.pre("findOneAndUpdate", async function (next) {

    const division = this.getUpdate() as Partial<IDivision>

    if(division.name){
        const baseSlug = division.name.toLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;
        let count = 0;
        while(await Division.exists({slug})){
            slug = `${slug}-${count++}`
        }
        division.slug = slug;
    }
    this.setUpdate(division)
    next();
})


export const Division = model<IDivision>("Division", divisionSchema)