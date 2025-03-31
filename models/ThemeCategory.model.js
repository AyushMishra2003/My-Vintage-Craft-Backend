import { model, Schema } from "mongoose";


const ThemeSchema=new Schema(
    {
        themeName:{
            type:String,
            required:true,
            trim:true
        },
        photo:{
            public_id:{
                type:String,
                default:""
            },
            secure_url:{
                type:String,
                default:""
            }
        },
        themeSlug:{
            type:String,
            required:true,
            trim:true
        }
    },
    {
        timestamps:true
    }
)



// Pre-Save Middleware
// ThemeSchema.pre("save", function (next) {
//     console.log("mai chala ki nahi babu");
    
//     if (this.isModified("themeName")) { 
//         this.themeSlug = slugify(this.themeName, { lower: true, strict: true });
//     }
//     next();
// });

// Pre-Update Middleware
ThemeSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.category) {
        update.themeSlug = slugify(update.category, { lower: true, strict: true });
    }
    next();
});




// create index basic of theme slug
ThemeSchema.index({ themeSlug: 1 });



const ThemeModel=model("Theme-Category",ThemeSchema)

export default ThemeModel
