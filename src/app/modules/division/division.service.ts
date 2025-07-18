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

const getAllDivision = async() => {
    const divisions = await Division.find({});
    const totalDivision = await Division.countDocuments();

    return{
        data: divisions,
        meta: {
            total: totalDivision
        }
    }
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