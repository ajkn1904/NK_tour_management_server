import { ITour, ITourType } from "./tour.interface";
import { Tour } from "./tour.model";
import { TourType } from "./tourType.model";


//---------------Tour API ------------------

const createTour = async (payload: ITour) => {

    const existingTour = await Tour.findOne({title: payload.title});
    if(existingTour){
        throw new Error("Tour already exists!")
    }

    const tour = await Tour.create(payload)

    return tour;
};


const getAllTours = async () => {
    
    const tours = await Tour.find({});
    const totalTours = await Tour.countDocuments();
    
    return {
        data: tours,
        meta: {
            total: totalTours
        }
    };
};


const updateTour = async (id: string, payload: Partial<ITour>) => {

    const existingTour = await Tour.findById(id);
    if(!existingTour){
        throw new Error("Tour Not Found!")
    }

    const updateTour = await Tour.findByIdAndUpdate(id, payload, {new: true, runValidators: true});

    return updateTour;
};


const deleteTour = async (id: string) => {

   return await Tour.findByIdAndDelete(id)

};



//---------------TourType API ------------------

const createTourType = async (payload: ITourType) => {
    
    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    //console.log(payload);
    return await TourType.create(payload);

};


const getAllTourTypes = async () => {
    
    return await TourType.find();

};


const updateTourType = async (id: string, payload: ITourType) => {
    
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;

};


const deleteTourType = async (id: string) => {
    
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    return await TourType.findByIdAndDelete(id);

};



export const TourService = {
    createTour,
    createTourType,
    updateTour,
    updateTourType,
    getAllTours,
    getAllTourTypes,
    deleteTour,
    deleteTourType
}
