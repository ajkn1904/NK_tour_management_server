import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { divisionSearchableFields } from "./division.constants";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
    
    const existingDivision = await Division.findOne({name: payload.name})
    if(existingDivision){
        throw new Error("Division already exists!");
    };

    const division = await Division.create(payload);

    return division
};

const getAllDivision = async(query : Record<string, string>) => {
    // const divisions = await Division.find({});
    // const totalDivision = await Division.countDocuments();

    const queryBuilder = new QueryBuilder(Division.find(), query);
    
    const divisions = await queryBuilder.search(divisionSearchableFields).filter().sort().fields().paginate();

    const [data, meta] = await Promise.all([
        divisions.build(),
        queryBuilder.getMeta()
    ])
    
    return {
        data,
        meta
    };

};


const getSingleDivision = async (slug: string) => {
    return await Division.findOne({slug});
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
    const existingDivision = await Division.findById(id)
    if(!existingDivision){
        throw new Error("Division not Found!");
    };

    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id: {$ne : id}
    });
    if(duplicateDivision){
        throw new Error("Division Already Exists!")
    };

    const updatedDivision = await Division.findByIdAndUpdate(id, payload, {new: true, runValidators: true});

    if(payload.thumbnail && existingDivision.thumbnail){
        await deleteImageFromCloudinary(existingDivision.thumbnail);
    }

    return updatedDivision;
};


const deleteDivision = async (id: string) => {
    await Division.findByIdAndDelete(id);
    return null;
};


export const DivisionService = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision
}